# 10b · Equipment usage and training variables: the science behind the coach's logic (Blaze Camp)

**Purpose.** This file sets the coach's equipment and variable logic against the research literature. For each topic it gives (a) the key findings with citations, (b) whether they support, refine or contradict what the coach says and writes, and (c) concrete rules the program generator can execute. The client says what equipment they have, and the generator returns a plan in the coach's style (4-6-week maintenance/transition block, 8 or 12 weeks, week-by-week or yearly - COACH-ANSWER PER-01).

## v1 - coach answers applied

**Scope of this v1 edit (2026-10-08):** the band and variable-resistance passages of this file, rewritten to the coach's questionnaire answers (`coach_answers_full.md`). The research findings themselves stay as reference; what changes is what the generator is allowed to do with them. The generator-ready equipment rules now live in `10_equipment_model.md/.json` v1, which wins wherever the two files differ.

1. **EQ-01, EQ-02, EQ-07, EQ-08 - no bands anywhere.** "I don't do bands. I don't program anything with bands" (EQ-01); "In my model, bands are not something that you're going to make changes to your body with" (EQ-02); "Band chops are, to me, worthless" (EQ-07); "I don't want any bands in the program" (EQ-08). Changed here: section 0 row 12, the home-band findings in 1.1, EQ-6 (band load conversion removed), EQ-7 (band step removed, band stand-ins replaced), EQ-9 (minimum kit = the coach's ideal home kit), AR-6, the 9.2 profile crosswalk and intake checklist, the 9.3 pseudo-code and the 9.4 no-gym preset.
2. **EQ-12 - no variable resistance for now** ("No variable resistance should be available in this for now. We will work with that later on."). Section 8 (bands, chains, weight releasers) is kept as reference only; AR-1 to AR-6 are SUSPENDED; the FV-4 band load, FV-5 accommodating route, FV-8 reverse-band contrast member and FV-10 weight releasers are removed from the generator; the 9.1 'Accommodating' row is out of scope; flags F1 and F13 and open questions 1 and 8 are closed.
3. **EQ-12 replacements (straight weight).** Speed work written with bands or chains in the sheets ('FAST BANDED BENCH PRESS', banded box squats AI92-AI96, 'FAST CHAINED DL') is run as the same lift with straight weight at the coach's own 'FAST RPE6 or about 60-70%' (OBSERVED 4 TRACKS!N17). The tempo rules (TEMPO-1..4) and the DB-release jump (FV-10, the coach's 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP') stay active - neither is variable resistance.
4. **ATH-12 + EQ-12 - French contrast.** Intermediate+ athletes, off-season, heavy member 78-85% (ATH-12 RIGHT); the 4th member (reverse-banded squat jumps) becomes bodyweight pogo / repeat squat jumps - PROPOSED - PENDING COACH APPROVAL.

**Superseded elsewhere in this file by other coach answers** (not band passages, so the evidence is not rewritten; the v1 verification added an inline RETIRED / SUPERSEDED / v1 marker at each place - see the log at the end; follow `10_equipment_model` v1 and the files named):
- FV-6 / F3 medball weights: the coach's numbers are now rules (EQ-06: passes/rotations 8-10 lb, overhead 6-10, sit-up 6-8, slams 10-20, never over 20 lb; heavier only for medball cleans / wall balls); the female -2 lb modifier is retired (ATH-09: no sex-based rules); no medball throwing for aesthetics except in the warm-up (ATH-05).
- EQ-8 machine ranking (Pendulum > Leg press > Hack): retired - machines are not ranked; leg press and hack squat are more constrained than the Smith machine; belt squat avoids axial loading (EQ-11).
- VOL-1 synergist credit 0.5 → 0.25 for helpers (VOL-09); the 3/5/7 % step is chosen by the person's state, not muscle size (VOL-05); VOL-4 → added sets go to the first exercise in session order, then the next (VOL-07). Owner: `03_volume_dosing`.
- ORD-7 core placement by family → core first by default for everyone, movable (ATH-11); ORD-4 supersets are also a fatigue tool for advanced clients, off-season VO2 work and beginners who do not fatigue (ORD-05). Owner: `05_session_architecture`.
- VARI-1 block arithmetic → PER-01 (4-6 weeks = maintenance/transition at ~50-70% volume; 8 weeks = 4 adapting + 4 driving; 12 weeks = 2-4 acclimation, 4-6 driving, hardest last). Owner: `06_periodization`.
- 9.1 'Load laterality' row: contralateral vs ipsilateral is a purpose choice (into the hip for change-of-direction athletes; out of the hip for sprint acceleration), not a difficulty ladder (CAT-13).
- F12 push press / jerk → LIB-13 (push press foundational, push jerk intermediate/advanced).
- Section 11 questions 2-7, 9 and 10 were put to the coach in the questionnaire; the answers are in `10_equipment_model.md` section 7.

**Still pending:** the French contrast 4th member (PROPOSED above); every band / chain / releaser method is parked by the coach for a later version (EQ-01, EQ-12) - the section 8 evidence is the starting point when he reopens it.

**Status labels used in every section**

| Label | Meaning |
|---|---|
| **COACH-ANSWER** | The coach's questionnaire answers (`coach_answers_full.md`, 2026-10-08), cited by question ID. Authoritative: they override sheet inferences and the generator rules written here before v1. |
| **PROPOSED** | "PROPOSED - PENDING COACH APPROVAL": our science-grounded proposal where the answers leave a gap. |
| **OBSERVED** | Written in the coach's workbooks. Each one is cited as tab + cell. The key quotes were re-read from `dumps/` for this file. |
| **COACH-CHAT** | The coach's spoken statements, as relayed in this task (paraphrased closely). |
| **SCIENCE** | A published finding or a named practitioner source. Source IDs such as [S12] point to section 12. |
| **INFERRED** | Our derivation. Never present it to the client as the coach's words. |

**Companion files** (do not duplicate; this file links into them):
* `analysis/equipment/lib_athletic_core.json`, `lib_resistance.json`. These hold the per-exercise `constraint_level` (1-5), `velocity_intent`, `force_velocity_zone`, `rom_profile`, `available_in_profiles` / `available_at_tier` and `substitutes_by_equipment`.
* `analysis/equipment/prog_byop_equipment.md`, `prog_mm_equipment.md`, `reference_variables.md` and `ordering_audit.md`.
* `synthesis/03_volume_dosing.md` (set caps, the 3/5/7 % governor), `05_session_architecture.md` (tier order, buckets) and `06_periodization.md` (blocks, levers).

**Source quality note.** Most sources were opened directly; they are marked "primary/abstract" in section 12. A few numbers come from search-engine summaries or secondary write-ups, and they are flagged "secondary" in section 12. Nothing here comes from memory alone.

---

## 0. Short answers: the coach's statements against the evidence

| # | Coach statement (COACH-CHAT unless cited) | Verdict | Key evidence | Rule IDs |
|---|---|---|---|---|
| 1 | "Machines have a lot of reference points / constraints... you can push a lot, and it's safer." | **Supported, with one refinement.** Machines are not better for growth. They are equal (Haugen 2023 [S1]; Heidel 2022 [S3]; Schwanbeck 2020 [S4]). Their advantages are safety, lower skill demand, lower systemic cost per unit of local stimulus, and safe sets close to failure. "Push a lot" holds for some machines (Smith squat 1RM above free squat in women) but not all (Smith bench is below barbell bench) [S6][S7]. | [S1][S3][S4][S6][S7][S9][S11][S14] | EQ-1 to EQ-9 |
| 2 | "For people who want more volume, injured people, older people: more machines." | **Supported.** The NSCA says machines are "an appropriate starting point" for frail, novice and limited older adults, and that high-functioning older adults gain more from free weights [S12]. Machines give a similar local stimulus with less total work and less hormonal or systemic disturbance [S14]. In US emergency departments, 90 % of weight-training injuries involve free weights [S11]. | [S12][S14][S11][S24] | EQ-2, EQ-3, EQ-5 |
| 3 | "Free weights are very different; barbells are more skilled." | **Supported.** Strength gains are specific to the mode trained [S1]. Much early strength gain is coordination [S15]. Lower stability lowers force output [S9][S10]. A barbell bench 1RM is about 17 % above the DB 1RM [S7]. | [S1][S7][S9][S15] | EQ-4, EQ-6 |
| 4 | "Power equipment first, then power-strength, then strength, then resistance patterns." | **Supported as a default.** Fast work goes first: ACSM sequencing [S80] and intent/velocity-loss data [S38][S39]. Contrast and complex methods deliberately invert the order and also work [S60][S62]. | [S80][S38][S39][S60][S62] | ORD-1 to ORD-4 |
| 5 | "If an athlete wants to go faster you don't need a lot of weight; medball passes/rotations light, 8-10 lb." | **Supported in principle; the number needs refining.** The load-velocity relation is hyperbolic for throws [S48]. A 2 kg ball moves faster than 5 kg in pushes [S49]. Practitioners put rotational throws at 4-8 lb [S54]. 8-10 lb (3.6-4.5 kg) fits overhead and backward throws [S50] and strong adults. For rotational and chest passes in smaller, youth and older clients it sits at the top of the range. **v1:** COACH-ANSWER EQ-06 (RIGHT) sets the rule - passes/rotations 8-10 lb, overhead 6-10, sit-up 6-8, slams 10-20, never over 20 lb, lighter for youth and older clients; no sex-based modifier (ATH-09). | [S48][S49][S50][S51][S52][S53][S54] | FV-6 |
| 6 | "Heavier = slower; lighter = faster." | **Supported** (R² ≈ 0.98 between bar velocity and %1RM [S35]; the load-velocity profiles in [S36]). Adaptations follow the loaded velocity [S40][S41], but **intent** matters as much as actual speed [S37][S38]. | [S35][S36][S37][S38][S40][S41] | FV-1 to FV-4 |
| 7 | "Speed, ROM, load and volume are variables." | **Supported.** Each one has its own dose-response literature (sections 3, 4, 5, 8). | all | VAR stack, section 9 |
| 8 | "Full ROM, mid ROM: mechanical work." | **Refined.** Full or long ROM is the safest default [S64][S65]. Partials done at **long muscle lengths** match or beat full ROM for growth [S66][S67][S65]. Mid or short ROM transfers better to sprint and jump in athletes (joint-angle specificity) [S71]. | [S64]-[S71] | ROM-1 to ROM-6 |
| 9 | "Week to week: do more sets of the same thing; 20 → 22 chest sets, load the same." | **Supported.** Hard-set counting is a valid volume metric [S72]. Volume has a dose-response with diminishing returns [S74]-[S76]. Progressive set increases beat fixed volume in trained people [S78][S79]. **Refinement:** count hard sets, not weight × reps × sets, because tonnage is biased by rep range [S73]. | [S72]-[S80][S22] | VOL-1 to VOL-7 |
| 10 | "Don't try to confuse the muscle; same over the block; change small variables next block." | **Supported.** Systematic variation helps regional growth and strength. Excessive or random variation adds nothing or hurts [S81][S83][S84]. Novelty-driven damage does not drive growth [S85]. Random rotation does not hurt muscle and can raise motivation [S82], so variation is a tool, not a requirement. | [S81]-[S86][S15] | VARI-1 to VARI-6 |
| 11 | "Rowing before overhead pull; horizontal push before vertical push." | **Consistent with the evidence, but not directly tested.** The order effect is real (the first exercise gains most [S87]-[S89]). No study tests horizontal vs vertical order. Bench → shoulder press vs the reverse showed no rep difference [S90]. Treat it as the coach's house rule, backed by "higher-intensity before lower-intensity" [S80]. | [S80][S87]-[S91] | ORD-5 |
| 12 | Bands "designed for speed/velocity" at ~50 %; chains "INTENSIONALLY SLOW YOU DOWN" at ~70 % (OBSERVED SQ!C35/B36, A40/B40). | **v1: OUT OF SCOPE (COACH-ANSWER EQ-01, EQ-12 - "No variable resistance should be available in this for now").** Reference only: fast lifts with bands beat slow heavy lifts for power [S95]; at equal total load chains *raised* concentric velocity by about 10 % [S97]; accommodating resistance needs ≥80 % total load to beat constant load for strength in trained people [S94]. The generator runs these lifts with straight weight ('FAST RPE6 or about 60-70%'). | [S93]-[S97] | AR-1 to AR-6 (suspended) |
| 13 | "HEAVY BARBELL → ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS; LIGHT BARBELL → ECCENTRICFAST LESS MUSCLE RECRUITMENT" (OBSERVED SQ!A44:A48). | **Partly supported.** Heavy loads recruit high-threshold motor units from the first rep. Light loads reach similar recruitment and growth when sets go near failure [S19]. Slow eccentrics cost concentric power and reps [S98][S99]. Fast eccentrics help the stretch-shortening cycle [S97]. | [S19][S98][S99][S100] | TEMPO-1 to TEMPO-4 |
| 14 | 'WEIGHT RELEASERS' = 'I HAVE NO IDEA' (OBSERVED SQ!B41:D41). | **v1: weight releasers are not programmed (COACH-ANSWER EQ-12).** Reference: accentuated eccentric loading at 105-120 % eccentric with releasers suits trained lifters only. The coach's own DB-release jump (DB load released before take-off) stays; COACH-ANSWER EQ-15 sets loaded jumps at 10-20 % of body weight, consistent with the ~20 % body-mass overload found safe for most athletes [S63]. | [S63] | FV-10 |

---

## 1. Machines vs free weights: stability, skill, safety, populations, volume

### 1.1 Key findings (SCIENCE)

**Hypertrophy and strength are equal overall; strength is mode-specific.**
* **Haugen et al. 2023** (13 studies, 1,016 participants) [S1]:
  * Strength tested with free weights rose more after free-weight training (SMD −0.21, p = 0.023).
  * Strength tested on machines tended to rise more after machine training (SMD 0.29, p = 0.064).
  * In direct comparison: no difference in dynamic strength (SMD 0.08), isometric strength, CMJ (−0.21, n.s.) or hypertrophy (−0.06, n.s.).
  * Upper-body strength showed a small machine advantage (SMD 0.25).
  * Training status did **not** moderate the result.
  * The authors suggest machines may suit beginners and rehab because they demand less stability and coordination and may lower injury risk. They also allow a muscle to be taken closer to failure when synergists would otherwise limit the set.
* **Heidel et al. 2022** (three-level meta-analysis): hypertrophy effect ≈ −0.01, with no difference in power or in neutral-device strength tests. Each mode wins its own test [S3, secondary summary].
* **Schwanbeck et al. 2020** (8 weeks, n = 46): no difference in muscle or strength. Free testosterone rose more in men training with free weights, which has no known hypertrophy relevance [S4].
* **Aerenhouts & D'Hondt 2020** (10 weeks, 36 male novices): machines only vs free weights only vs **machines for 5 weeks then free weights**. All groups improved size, strength and FMS. There were no group × time differences, and **no "fallback" when switching** from machines to free weights [S5].

**Stability and force output.**
* **Cotterman et al. 2005**:
  * Smith-machine squat 1RM is **higher** than the free squat (significant in women).
  * Smith bench 1RM is **lower** than free bench.
  * Conversion: Smith bench ≈ −6.76 + 0.95 × free bench (kg) [S6].
* **Saeterbakken et al. 2011**: DB bench 1RM was 17 % below barbell and 14 % below Smith; barbell was 3 % above Smith. Pectoral and anterior-deltoid EMG did not differ [S7, numbers from abstract summary].
* **Schwanbeck et al. 2009**: averaged EMG was 43 % higher in the free squat than the Smith squat (n = 6). This is acute EMG only; it does not predict long-term growth [S8][S1].
* **Behm & Colado 2012**: unstable surfaces cut force about 29 % on average, and up to 70-84 % on some lifts (squat, leg extension on a ball). They suit rehab.
* **CSEP position stand**: ground-based free weights give enough instability for athletes while keeping near-maximal force. Instability devices fit rehab and health-fitness only [S9][S10].

**Skill and motor learning.**
* **Rutherford & Jones 1986**: dynamic leg-extension training raised training loads about 200 % but isometric force only 15-20 %. Most of the gain was learning to coordinate and stabilise [S15].
* This is why free-weight strength is skill-specific, and why tests favour the trained mode [S1].

**Injury and populations.**
* **Kerr et al. 2010** (US emergency departments, 1990-2007; an estimated 970,801 injuries): 90.4 % involved free weights, and 65.5 % happened when a weight was dropped on the person [S11].
* **NSCA older-adult position stand (Fragala 2019)** [S12]:
  * Machine-based equipment is an appropriate starting point for frail, beginning and functionally limited older adults.
  * High-functioning older adults benefit more from free weights.
  * Dose: 2-3 sets, 10-15 reps for beginners.
  * Power work at 40-60 % 1RM (30-60 % for frail).
  * Failure training adds nothing in older adults.
* **Schott et al.** (older adults): the relative load increase was larger with free weights for triceps and knee/hip extensors (cited in [S5]; secondary).

**Systemic vs local fatigue (the volume argument).**
* **Kotikangas et al. 2025**, 5 × 10RM [S14]:
  * Smith-machine back squat: 43.0 kJ of total work. Horizontal leg press: 29.1 kJ.
  * Quadriceps fatigue was **similar**.
  * The squat produced a bigger drop in maximal EMG and larger cortisol and GH responses.
  * Both recovered by 24 h.
  * So supported, lower-work machine patterns give the same local muscle stimulus at a lower whole-body cost.
* This is the mechanism behind RP's **stimulus-to-fatigue ratio (SFR)**: choose exercises that give high target-muscle stimulus per unit of systemic, axial and joint fatigue. Leg press vs squat is the textbook example [S24][S22].

**Failure proximity (why "safe to push" matters).**
* Hypertrophy rises as sets get closer to failure; strength barely changes (Robinson 2024 [S21]).
* Training to failure vs non-failure gives only a trivial extra growth effect (ES 0.19, Refalo 2023 [S20]).
* Low loads to failure grow muscle as well as high loads; heavy loads still win for strength (Lopez 2021 [S19]).
* Implication: the safe place to take sets to 0-1 RIR is a high-constraint machine or cable, not a heavy barbell.

**Home equipment is not inferior per se.**
* Elastic-band training gives the same strength gains as DBs and machines (8 RCTs; lower-body SMD −0.11, upper-body 0.09) [S16].
* Banded push-ups at a 6RM load matched bench press (both about +20 % 6RM) [S17].
* Push-ups at a load equal to 40 % 1RM bench matched bench press for growth and 1RM [S18].
* **v1 (COACH-ANSWER EQ-01/EQ-02):** the band findings stay as reference only - the coach does not program bands ("In my model, bands are not something that you're going to make changes to your body with"). The usable conclusion for the generator is the push-up / bodyweight one [S18][S19]: home clients progress with DBs, KBs, bodyweight leverage, tempo and proximity to failure.

### 1.2 Against the coach

* **Supports.**
  * The coach's machines-are-safe / push-more / volume rule (COACH-CHAT) matches the safety [S11], skill [S15], instability [S9] and SFR [S14][S24] evidence.
  * His OBSERVED leg-press note matches the Kotikangas data almost word for word: 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' (ALL ABOUT SQUATS!I35).
  * His athlete programs are almost machine-free. Machines make up 0.5 % of athlete line items vs 18 % for gen-pop (prog_mm_equipment). The BYOP athletic family has the lowest constraint (mean 2.17) and aesthetics the highest (2.82). This matches the specificity finding: athletes need free-body, low-stability-support force [S1][S10].
* **Refines.**
  1. Machines do **not** build more muscle. The case for them is cost, safety and accessibility, not stimulus. The generator must never justify a machine as "better for growth".
  2. "Push a lot" depends on the machine. A Smith squat lets you lift more than a free squat. A Smith or DB bench does not [S6][S7]. The real advantage is pushing **closer to failure safely**, not more absolute load.
  3. Beginners do not *have* to start on machines: training status did not moderate the result [S1]. Machines are the default only when risk, frailty or pain is high (NSCA [S12]). Otherwise choose by goal.
  4. The library files lower-body machines under MODERATE/ADVANCED and upper-body pulling machines under FOUNDATIONAL (OBSERVED in the lib_resistance and reference_variables digests). The science supports both uses:
     * Upper-body assisted machines scaffold a skill the client cannot yet do (a pull-up).
     * Leg machines are SFR volume tools for trained people who already have the skill [S14][S24].
     * So "machine" is two roles: **ON-RAMP** and **VOLUME TOOL**. The generator should tag which role each machine plays.
* **Contradicts.** Nothing central. The coach's machine preferences ('LEG PRESS' / 'PENDULUM' = 'LOVE IT'; 'HACK SQUAT' = "I PERSONALLY DON'T LIKE IT"; 'V-SQUAT' = "I don't presercibe the use of these, ever", ALL ABOUT SQUATS!G35:I41) are **preferences without contrary evidence**. No study separates these machines, so keep his ranking. **v1 RETIRED (COACH-ANSWER EQ-11 NOT RIGHT):** machines are not ranked ('I don't want to rank them because they have different brands, angles'); the sheet verdicts are informational only; constraint differences, spine loading and what the client feels decide (EQ-8 below, 10_equipment_model section 6).

### 1.3 Generator rules (EQ-x)

**EQ-1. Constraint is the primary equipment axis.**
* Use `constraint_level` (1 = open space / free body … 5 = seated, supported machine) from `lib_*.json`.
* It equals Pat Davidson's "ground" (section 2).
* Every slot gets a **target constraint band** from the client preset (EQ-2). Candidate exercises outside the band are penalised, not banned.

**EQ-2. Population presets.** Constraint bands for the main lifts / accessories, plus the share of weekly hard sets taken at constraint ≥ 3. All values are INFERRED from [S1][S12][S14] and the OBSERVED family shares.

| Client preset | Main compound slots | Accessory / isolation | % of weekly hard sets at constraint ≥ 3 | Basis |
|---|---|---|---|---|
| Beginner, healthy, < 50 y | 2-4 | 3-5 | 40-60 % | [S1] no status moderation; [S5] free switch; OBSERVED BYOP FOUNDATIONAL mean constraint 2.98 |
| Hypertrophy / aesthetics (any level) | 2-4 (1-2 lead free-weight lifts) | 3-5 | 45-65 % | OBSERVED aesthetics machine+cable 31 % + supported DB; SFR [S14][S24] |
| Strength (barbell sport) | 1-2 for competition lifts | 3-5 | 25-40 % | specificity [S1] |
| Athlete (any sport) | 1-2 (athletic slots 1) | 2-4; machines only in the last 1-2 slots | ≤ 15 % (machines ≤ 5 % of items) | OBSERVED 0.5 % machine items, JUSTICE LEAGUE ends on 'Leg Extensions' (E12); [S1][S10] |
| Older adult, frail or limited | 4-5 | 4-5 | 70-90 % | NSCA [S12] |
| Older adult, high-functioning | block 1: 3-5 → block 2+: 3-5 by default (v1: COACH-ANSWER EQ-03 'If they're old ... I'd rather they collect that volume in a safe place with more constraints'); 2-3 only as a PROPOSED - PENDING COACH APPROVAL option for a client with a training foundation who prefers free weights (ATH-09, EQ-10; 10_equipment_model CR-11) | 3-5 | most hard sets by default; 40-60 % only under the PROPOSED option | COACH-ANSWER EQ-03; NSCA [S12]; Schott (secondary) |
| Pain / injury in a region | that region's slots +1 to +2 vs preset | +1 | +15-20 points vs preset | coach pain rule (EQ-5) + [S9] |
| Fat loss / bootcamp | 2-3 | 2-5 | 30-50 % | OBSERVED bootcamp family constraint 2.56 |

**EQ-3. Failure proximity is gated by constraint.**
* RIR 0-1, MYO SETs ('15/5/5/5/5/5', ALL ABOUT SQUATS!B27) and drop sets are allowed only when **constraint ≥ 4, or the exercise is isolation**.
* Free-weight barbell compounds stop at RIR 1-3. Olympic and athletic work is never taken toward failure (FV-3).
* OBSERVED fit: MYO sets sit only on the last exercise (BYOP 'Leg Extensions', 4 TRACKS 'LEG PRESS MYO').
* SCIENCE: [S20][S21][S11].

**EQ-4. Specificity rule.**
* A client whose goal includes a barbell test, or a sport that needs free-body force, gets ≥ 1 free-weight version of each main lower pattern and the main upper push per week, and ideally per session [S1].
* Athletes keep constraint 1-2 on every main lift. Machines enter only as finishers or volume tools (OBSERVED JUSTICE LEAGUE E3:E12, constraint by position 1,1,3,1,1,2,3,1,1,5).

**EQ-5. Pain rule (OBSERVED, coach's own words).**
* On 'Felt a PAIN' (the BYOP FEELING column) or an intake pain flag:
  1. Swap fixed grips to split grips: 'getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips)' (EXAMPLE UPPERLOWER SPLIT!A7).
  2. For athletes, also 'going unilateral' (EXAMPLE ATHLETIC FULL BODY SPLI!A6).
  3. Then raise constraint by one level.
  4. Then shorten ROM to the pain-free range (ROM-5).
* SCIENCE support: a narrower bench grip lowers shoulder injury risk at about a 5 % 1RM cost [S103]. Unilateral and bilateral training give similar strength and sprint gains [S102], so the switch costs little.

**EQ-6. Load conversion on implement swaps (INFERRED from [S6][S7]).** Use these for the first exposure only; then autoregulate by RIR.

| From → To | Starting load |
|---|---|
| Barbell bench → DB bench | each DB ≈ 0.40 × barbell load |
| Barbell bench → Smith bench | ≈ 0.95 × barbell |
| Free back squat → Smith squat | 1.0-1.1 × free load |
| Machine → free weight, same pattern | start 2 RIR higher than the machine prescription for 1 week; no volume reduction needed [S5] |

(v1: the v0 row 'Free weight → band: prescribe by RIR and rep range, not by tension' is removed - no bands, COACH-ANSWER EQ-01.)

**EQ-7. Substitution priority when equipment is missing** (v1: no band step, COACH-ANSWER EQ-01/EQ-07/EQ-08).
1. The coach's own written pair: 'Sqats or Leg Press', 'machine rows or db rows', 'Machine Dips or dips', 'Double kb or Db', and the cable or Bird Dog routes of 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' (OBSERVED MM 00!C17, MM 05!C16, RP!C30; the band route is out). The first-written option is not automatically the default: pick by client, and the client's preference may decide (COACH-ANSWER EQ-10).
2. Same pattern, same implement class, same constraint (machine ↔ cable).
3. Same pattern, DB/KB, split grip (constraint −1 or −2).
4. Bodyweight progression. Raise intensity through leverage, unilateral work, tempo or pauses, and take sets closer to failure. Low-load near-failure work grows muscle [S19][S18].
5. Machine slot with no machine (COACH-ANSWER EQ-08: swap, "just no bands"):
   * Quads: 'DB leg extensions on box' (RP!A41), sissy squats; reverse Nordic (PROPOSED). The v0 'banded leg extensions on bench' (RP!A40) is out.
   * Hamstrings: nordics, slider or swiss-ball curls.
   * Fallback, coach rule: 'leg press or just add 2 more rounds to front squats' (OBSERVED 4 TRACKS!W42:Z42), i.e. add +2 sets to the preceding compound of the same pattern.
6. Pattern impossible (vertical pull with no bar or cable; throws with no medball): use the nearest-pattern substitute (no medball: plyo push-ups, fast cable rotations or the no-ball 'fake medball slam' - never band chops, EQ-07), and flag `pattern_gap` to the client with a buy list (EQ-9).

**EQ-8. Coach machine ranking (OBSERVED) - RETIRED in v1 (COACH-ANSWER EQ-11 NOT RIGHT).**
* v1 rule: no machine ranking ('if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great ... I don't want to rank them'). Constraint differences only: leg press 5; hack squat and pendulum back-supported 4, more constrained than the Smith machine (4, trunk free). Belt squat when the spine should not be loaded that week or the client is sore. GHD / reverse hyper only if available and the client feels the right muscles. The client's preference can decide (EQ-10). Never 'V-SQUAT' (still a hard rule, GEN-08).
* v0 record, not used: knee-dominant machine preference 'PENDULUM' > 'LEG PRESS' > 'HACK SQUAT'; 'if the client lists only a hack squat, use it, but put a free-weight or leg-press alternative first when available'.

**EQ-9. Equipment intake → minimal kit advice.**
* Coverage data (OBSERVED tiers from `lib_resistance.json` and `prog_byop_equipment.json`, v0 tiers that still counted bands): bodyweight-only covers 16 % of the resistance menu; DB + bench (+ bands) 51 % (146/267 with a doorway bar); a commercial gym 255/267. v1 recomputation without bands (`10_equipment_model` 3.3, share of all main-slot options): DBs + bench 51 %, bodyweight 33 %, basic gym 91 %.
* v1 (COACH-ANSWER EQ-02): the buy list is the coach's ideal home kit - adjustable DBs + a bench + a pull-up bar + an 8-10 lb medball ("People have different things for their home kit, but that'll be ideal"; "I just never use bands"). With a box or step for athletes it fills every main slot except leg extension (a DB leg extension on a box) and the cable chops.
* Athletes need the medball (THROWING is 20/20 medball, OBSERVED) and a box or step.

---

## 2. Pat Davidson: ground, constraints, references, positions

### 2.1 Key findings (practitioner source, SCIENCE-adjacent; paraphrased)

* **Constraints and references** (Nosak 2021, summarising Davidson's *Rethinking the Big Patterns* [S26]):
  * A *constraint* is a barrier that stops a movement from happening the wrong way.
  * A *reference* is a sensation of a specific body area, felt against something, that tells the lifter where they are.
  * Machines such as the hack squat give both: a fixed path (constraint) and pads and a platform to push against (references).
  * Progression = **removing constraints and references one at a time**:
    * from controlled tempo to natural speed;
    * from machine to free weight;
    * from chest-supported row to 3-point DB row.
* **High ground vs low ground** (Just Fly Performance podcast 318 [S27]; Gabrielle Lyon show ep. 110 [S31]):
  * Exercises and athletes sit on a spectrum. At one end is **lots of external contact and support** ("high ground": powerlifters, bodybuilders, linemen; hack squat, leg press, Smith). At the other is **minimal contact or deformable surfaces** ("low ground": divers, skateboarders).
  * Feeding more ground to an exercise raises the chance the person does it right. High-ground selections are easier to learn and better for hypertrophy. "Functional" training is a bias toward low ground.
  * Davidson groups exercises as high, medium or low ground as an exercise-selection system [S31, show-notes summary].
* **Distance (ROM) is half of work.** Davidson notes that nobody measures the distance a lift travels, even though work = force × distance. Going full range and having to use less weight is a "punishment" lifters avoid [S28]. He prefers lengthened ranges, e.g. a prone hamstring curl with a big hip-flexion angle [S32].
* **Implements and positions.**
  * Davidson uses many stances, including tall- and half-kneeling, as part of a classified training taxonomy [S33].
  * He values the cable rig for versatility [S32].
  * He calls the cable pull-through the hardest hinge to get wrong, and advises pruning exercise selection to a small, high-yield list [S29].
  * He sees positions as trade-offs: bones moving apart → instability; bones moving together → impingement [S30].
* **Variability and persistence.**
  * Beginners progress session to session through neural adaptation.
  * Muscular change needs sustained focus on the same exercises, on the order of 12 weeks [S31, show-notes summary; treat as his view, not a study].
  * The volume guidance in the same episode (about 8-24 sets per muscle per week, 5-30 reps) matches the hypertrophy literature [S31][S22].
* **Older adults (his view; it conflicts with the NSCA).** Per the episode summary, he doubts that classic power drills (e.g. box jumps) change much in older adults, and he leans on hypertrophy training to restore power [S31]. The NSCA [S12] and a 12-week RCT [S41] show that light-load, high-velocity training in older adults improves velocity and power. **The generator follows the NSCA** (FV-9).

### 2.2 Against the coach

* **Supports, almost one-to-one.**
  * The coach's "reference points / constraints: you sit down, feet on the ground, move your hands or feet" is Davidson's constraints, references and high ground.
  * His colour ladders are high-to-low-ground ladders (OBSERVED):
    * Vertical push: 'Seated DB press' / 'Seated Barbell press' green (RP!E8:E9), then 'DB Z press on floor' and 'Kneeling DB press' yellow (E10:E12), then 'Kneeling barbell press', 'Standing DB press' and 'Standing Barbell press' red (E13:E15).
    * Feet: 'feet on bench' / 'feet on wall' green, then 'feet on raisers or plates' / 'feet on floor' yellow, then 'feet in air' red (RP!I23:I28).
    * Rows: 'Machine row' (G61) and 'Chest suported row' (G62), then 'bent over ... barbell row' (G68:G69).
  * The library's upper-body ladder removes ground with level: lat pulldown and assisted pull-up machine → strict and weighted pull-ups, mean constraint 3.5 → 1.0 (OBSERVED digest).
  * Davidson's lineage is named in the task brief. This file gives the generator its formal vocabulary: **ground = constraint_level**.
* **Refines.**
  1. Davidson's rule gives a direction by goal. Hypertrophy keeps high ground on the sets that matter. Athletic and "functional" work moves toward low ground. Skill learning starts high and removes one reference per step. The library levels do this for the upper body; the generator should do it explicitly.
  2. He would add **lengthened ranges** on machines (seated or hip-flexed curls), which the science backs (section 4).
* **Contradicts.** Only on power in older adults, where the generator sides with the NSCA [S12][S41].

### 2.3 Generator rules (GRD-x)

**GRD-1. Ground = constraint.** Treat `constraint_level` as "ground". Every client preset (EQ-2) is a ground target.

**GRD-2. Remove one reference per block, never more** (INFERRED from [S26]). For a skill-dependent pattern, the next block changes **one** of:
* support: seated → kneeling → standing;
* base: bilateral → split → single-leg;
* implement: machine → cable → DB → barbell;
* path: fixed → free;
* tempo: controlled → natural / fast.

This is the coach's "next block you can change some small variables" (COACH-CHAT).

**GRD-3. Goal direction.**
* Hypertrophy: hold or increase ground on the sets that carry the volume.
* Athletic: lower ground on main and athletic slots each block, until the client reaches constraint 1-2 on everything except finishers.
* Pain: increase ground (EQ-5).

**GRD-4. Stance as a variable.**
* Include tall-kneeling, half-kneeling and split stances as legitimate ground levels for presses, rows and chops.
* The coach writes them: 'Kneeling DB press' RP!E12; 'half kneeling' in MM 05!C16; 'Split stance ALWAYS contralateral' RP!G83 (OBSERVED).

---

## 3. Force-velocity, strength qualities and implement loads

### 3.1 Load-velocity and the strength-quality zones (SCIENCE)

* **Bar velocity tracks relative load almost perfectly**: mean propulsive velocity vs %1RM, R² ≈ 0.98 in the bench press (González-Badillo & Sánchez-Medina 2010) [S35].
* Typical mean propulsive velocities in recreationally trained men [S36]:

| %1RM | 50 | 60 | 70 | 80 | 100 |
|---|---|---|---|---|---|
| Full squat (m/s) | 0.87 | 0.70 | 0.61 | 0.49 | 0.26 |
| Bench press (m/s) | 0.92 | 0.70 | 0.57 | 0.42 | 0.21 |

* **Velocity zones** (Bryan Mann's VBT model, mean concentric velocity) [S34]:

| Zone | m/s | Approx. %1RM, squat (INFERRED by interpolating [S36]; >1.0 m/s extrapolated) | Typical implements / exercises in this library |
|---|---|---|---|
| Absolute strength | < 0.5 | ≳ 80 % | heavy barbell / hex bar / weighted pull-up ('HEAVY ...', '(1 RIR)') |
| Accelerative strength | 0.5-0.75 | ≈ 57-80 % | barbell or DB compounds moved with max intent; hang cleans '@ 75%' → '@ 90%' |
| Strength-speed | 0.75-1.0 | ≈ 40-57 % | dynamic effort with straight weight ('FAST RPE6 or about 60-70%' 4 TRACKS!N17), 'Box. Any Squat Touch and Go fast' AI91 (the banded AI92:AI96 are out of scope in v1, EQ-12), power clean / pulls, KB swings |
| Speed-strength | 1.0-1.3 | ≈ 25-40 % | loaded jumps (hex bar, DB squat jumps), medball throws, push press |
| Starting strength / speed | > 1.3 | < 25 % / body mass | bodyweight jumps, light medball passes, sprints, COD |

* **Intent matters as much as actual speed.**
  * Behm & Sale 1993: the velocity-specific training response came from the **intent** to contract ballistically, even when the movement could not actually be fast (isometric condition) [S37].
  * Pareja-Blanco 2014: bench training at maximal intended velocity gave +18.2 % 1RM vs +9.7 % for deliberately half-speed reps at the same loads [S38].
* **Velocity loss within a set changes the adaptation** (Pareja-Blanco 2017, squat, 8 weeks) [S39]:
  * Stopping at 20 % velocity loss (VL20) gave squat strength similar to 40 % (VL40).
  * VL20 gave a better CMJ (+9.5 % vs +3.5 %) with 40 % fewer reps.
  * VL40 gave more vastus hypertrophy but shifted fibres away from type IIX.

### 3.2 Specificity of the loaded velocity (SCIENCE)

* Strength gains are largest at the training velocity, with some carry-over. Faster training best improves fast athletic movements, and the rate of force application matters (Morrissey 1995) [S40].
* **Light vs heavy power training** (older adults, 12 weeks; 40 % vs 80 % 1RM, Rodriguez-Lopez 2022) [S41]:
  * Heavy improved 1RM and F0 more.
  * Light improved V0 and early rate of force development (≤ 100 ms) more.
  * Both improved Pmax and muscle size similarly.
* **Strength is the foundation of power** (Cormie, McGuigan & Newton 2011) [S42]:
  * Weaker athletes gain power first from getting stronger.
  * The most potent loads for complex movements are ballistic exercises at 0-50 % 1RM and weightlifting movements at 50-90 % 1RM.
  * Train the least-developed quality.
* **Velocity with accommodating resistance** (Rhea 2009; 48 Division I athletes, 12 weeks; Slow 0.2-0.4 m/s vs Fast 0.6-0.8 m/s vs Fast + bands) [S95]: power improved most in the fast + bands group, and significantly more than in the slow group. v1: reference only (variable resistance is out of scope, EQ-12); the transferable part for the generator is the fast vs slow contrast - move straight weight fast.

### 3.3 Optimal loads for power by exercise and implement (SCIENCE)

| Exercise / implement | Load that maximises power output | Source |
|---|---|---|
| Jump squat (barbell) | body mass to ≈ 30 % 1RM; often body mass alone | Soriano 2015 meta (27 studies) [S43]; Cormie 2007 [S44] |
| Back squat (non-ballistic) | ≈ 30-70 % 1RM | [S43] |
| Power clean / hang power clean | ≥ 70 % 1RM (HPC peak ≈ 65-80 %) | [S43]; Suchomel & Sole 2017 [S46] |
| Jump shrug / hang high pull (no catch) | ≈ 30-45 % of HPC 1RM; more peak power than the HPC | [S46] |
| Hex-bar jump vs barbell-on-back jump | the hex bar beats the back-loaded bar; peak power at ≈ 20 % of squat 1RM | Swinton 2012 [S45] |
| KB swing (home substitute) | 6 weeks of KB swings = jump-squat training for half-squat 1RM (+9.8 %) and vertical jump (+19.8 %) | Lake & Lauder 2012 [S47] |
| Ballistic upper / lower general | 0-50 % 1RM ballistic, 50-90 % weightlifting | [S42]; ACSM power guidance: 0-60 % lower body, 30-60 % upper body, fast, 3-5 min rest [S80] |

### 3.4 Medicine-ball mass (SCIENCE)

* **The load-velocity relation in throwing is hyperbolic.** Two-handed overhead throws with 0.45, 1, 3 and 5 kg balls (80 students): velocity fell hyperbolically with mass. Sex differences were largest with light balls [S48].
* **Upper-body push throws.**
  * Supine medball push-press with 2-5 kg: peak ball velocity and acceleration were significantly higher at **2 kg than 5 kg**. The authors frame light loads as right for athletes who need high-velocity, light-load pushing power [S49].
  * For *testing* chest-pass power in collegiate baseball players, 3-4 kg balls correlated best with explosive bench [S51].
* **Backward overhead (scoop) throw.** In female softball and rugby athletes there were **no differences** in peak power, force or velocity across 2.7, 3.6, 4.5 and 5.5 kg. Any ball in that range is usable [S50].
* **Rotational throws.**
  * In a punch-throw pilot with pitchers, trunk rotation power **rose** with ball mass (1 → 3 → 5 kg). The authors note that training trunk power does not require the ball mass that maximises ball power [S52].
  * Practitioner guideline (Eric Cressey): 4-8 lb is the right load for rotational power for most people. 10-12 lb balls are rarely thrown fast, and heavier balls make the head drift and the spine side-bend, which kills the hip contribution [S54].
* **Training transfer.**
  * Six weeks of 3 kg medball overhead throws raised throwing speed with 0.35, 1 and 3 kg balls. The double-volume group drove most of the gain [S53].
  * Twelve weeks of rotational medball training plus resistance training beat resistance training alone for torso rotational strength and the medball hitter's throw (Szymanski 2007) [S55].
  * Six weeks of medball training raised handball throwing velocity 14 % (Raeder 2015) [S56].
* **Conversions.** 8 lb = 3.6 kg; 10 lb = 4.5 kg; 6 lb = 2.7 kg; 4 lb = 1.8 kg; 12 lb = 5.4 kg.

### 3.5 Plyometrics: reactive vs ballistic, contact time, box and drop height (SCIENCE)

* **Fast vs slow SSC.** Schmidtbleicher's classification: fast SSC has ground contacts of about 100-250 ms with small joint excursions (stiff, "bouncy"); slow SSC has contacts over 250 ms with larger excursions [S57].
* **Drop height is the intensity dial for depth jumps.**
  * Optimal drop heights were about 0.30 m by the reactive strength index and 0.40 m by maximal jump height (Byrne 2010) [S58].
  * In youth soccer players, an individualised drop height (10-40 cm, chosen by optimal RSI) beat a fixed 30 cm box (CMJ +16.7 %; Ramirez-Campillo 2018) [S59].
* **Box jumps** (jump *up* onto a box) reduce landing load. A higher box mostly tests hip flexion and tuck, not concentric output (INFERRED; no direct source fetched). The coach's height labels '(half shin)', '(up to knee)' and '(above hip)' (OBSERVED library names) are therefore a **skill and landing** ladder, not a pure intensity ladder.

### 3.6 Contrast, French contrast, PAPE, weighted-release jumps (SCIENCE)

* **French contrast training** (Zhao 2025 meta-analysis; 7 RCTs, n = 195) [S60]:
  * Sprint improved with a large effect (SMD −0.92). Jump improved with a moderate effect (SMD 0.62). Maximal strength showed a small, non-significant effect (0.43).
  * Typical sequence: heavy compound (80-90 % 1RM) → plyometric → light loaded jump (≈ 30 % 1RM) → assisted plyometric.
  * Typical dose: 2-3 sessions per week for 8-12 weeks, 3-4 sets.
  * Untrained participants gained more. FCT matched other complex training.
* **PAP vs PAPE** (Blazevich & Babault 2019) [S61]:
  * Twitch potentiation (PAP) has a half-life of about 28 s.
  * Voluntary performance enhancement (PAPE) usually peaks **about 6-10 min** after the conditioning activity and runs through different mechanisms (muscle temperature, water content, activation).
* **Order variants are roughly equal chronically.** In elite youth soccer, complex (strength → plyo), traditional (plyo → strength) and contrast training gave similar strength and jump gains in-season. Only the traditional order lost sprint speed (Kobal 2017, via [S62]).
* **Accentuated eccentric loading** (Zhong 2026 systematic review, 20 trials) [S63]:
  * Supramaximal eccentrics with weight releasers (105-120 % 1RM eccentric, ≈ 110-120 % best) suit trained lifters (squat ≈ 1.3-2.0 × body mass) with spotters. Chronic 1RM gains were 5-27 %. v1: weight releasers are not programmed (EQ-12); reference only.
  * **Jumps with 10-30 % body-mass extra load released before take-off (≈ 20 % best)** are safe for most athletes and give small-to-moderate jump gains.
  * Transfer to sprint and COD is uncertain.

### 3.7 Against the coach

* **Supports.**
  * "Lighter → faster; heavier → slower" is the load-velocity law [S35][S36].
  * "Train the body to move at that speed" is velocity and intent specificity [S37][S38][S40].
  * The coach's ladder "power first → power-strength → strength → resistance" is the velocity-zone ladder from > 1.3 m/s down to < 0.5 m/s (section 3.1). His BYOP athletic skeleton follows it literally (OBSERVED NO ACCESS - ATHLETIC!C3:D12: 'Plyo', 'Plyo', 'Throwing', 'COD', 'Tripple Extension', 'Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull', 'Leg Extensions').
  * 'Front squats - light weights - same speed for all reps' (BASEBALL!BU33) is a low-velocity-loss prescription (VL ≈ 10-20 %) [S39].
  * 'Really high jump squats LOAD & jump hard' (MM 05!C14) and 'front squats/high jumps/hex bar squat jumps/ banded assisted hops' (BASEBALL!DH51) use the hex-bar and loaded-jump loads the evidence favours [S45][S43] (v1: the banded assisted hops are out of scope, EQ-12; loaded jumps 10-20 % of body weight, EQ-15).
  * 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP' (ALL ABOUT BALLISTICS!C40) and the library's 'DB Depth drop dbs Jump' are exactly the accentuated-eccentric DB-release jump [S63].
  * The coach's purposes 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' / 'I USE THESE FOR MUSCULAR FORCE PRODUCTION' and 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' / 'I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS' (BA!A22:D23) match the ballistic/plyometric and slow/fast SSC split [S57][S42].
  * His force phases 'TAKING IN FORCES' → 'DELIVER FORCES FAST' → 'AMORTIZATION OF FORCES' → 'REBOUNDING ' (BA!A24:D24) match landing before reactive work (audit: landing before reactive in 11/13 sessions).
* **Refines.**
  1. **Medball 8-10 lb.** Right for overhead and backward throws and sit-up throws in adults [S50][S53]. Heavy for **rotational and chest passes**, where velocity is highest at about 2 kg (4.4 lb) [S49] and practitioners use 4-8 lb [S54]. Make the ball weight depend on throw type and on the person (FV-6). Keep the coach's 8-10 lb as the adult-male athlete default for overhead, sit-up and scoop throws. **v1 SUPERSEDED (COACH-ANSWER EQ-06 RIGHT, ATH-09):** passes and rotations 8-10 lb (start at 8), overhead 6-10, sit-up throws 6-8, slams 10-20, never over 20 lb; heavier only for medball cleans / wall balls; lighter for youth and older clients; no sex-based default. Note: no workbook cell gives a medball weight. The only cue is 'this but hugging a light medball' (MM 05!K13), so this rule is COACH-CHAT plus SCIENCE.
  2. **French contrast timing.** The coach writes 'immediately' between members (ALL ABOUT SQUATS!I18). PAPE peaks about 6-10 min after a heavy set [S61]. Done immediately, the jump comes before PAPE has developed. FCT still works as a chronic method [S60], but the generator should state the **complex rest** (FV-8). His 78 % is just under the usual 80-90 %. Keep 78-85 %.
  3. **Strength first for weak athletes** [S42]. The generator should not give a beginner athlete only light, fast work. Weak athletes need the absolute and accelerative zones too.
  4. **Older adults.** Velocity work at 40-60 % 1RM is evidence-based [S12][S41]. Older clients get a "fast concentric" cue on machine work (constraint 4-5), not jumps, until they have screened in.
* **Contradicts.** None on the principle. The former open point "chains slow you down" (section 8) is closed in v1: chains are out of scope (COACH-ANSWER EQ-12).

### 3.8 Generator rules (FV-x)

**FV-1. Every athletic and resistance record carries a velocity zone.**
* Use `force_velocity_zone` from `lib_*.json`, which already holds the values reactive / starting_strength/speed / speed_strength / strength_speed / accelerative_strength / absolute_strength.
* The session builder orders slots from the fastest zone to the slowest (05 §3.1 tiers 1-7), unless a contrast pair is chosen (FV-8).

**FV-2. Intent cue on every rep.**
* Every concentric phase gets "move it as fast as you can" (max intent), including hypertrophy sets [S38][S99].
* Only the eccentric is ever slowed on purpose (TEMPO-1).

**FV-3. Velocity-loss surrogate (no VBT device).** All INFERRED from [S39] with the coach's 'same speed for all reps'.
* **Power / athletic / strength-speed sets:** stop when the rep visibly slows, or at about half of the reps possible at that load. That gives:
  * 1-3 reps for Olympic lifts;
  * 3-6 reps for loaded jumps and dynamic-effort lifts;
  * 5-10 contacts for plyos;
  * 5-10 throws.
* **Strength sets:** RIR 1-3.
* **Hypertrophy sets:** RIR 0-3, gated by EQ-3.

**FV-4. Zone → dose defaults.** The %1RM column is SCIENCE [S42][S43][S46][S80] plus the coach's OBSERVED numbers.

| Zone | Load | Reps × sets | Rest | Coach anchor (OBSERVED) |
|---|---|---|---|---|
| Absolute strength | ≥ 80-85 % 1RM, RIR 1-2 | 1-6 × 3-6 | 3-5 min | 'HEAVY ...', 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' (SQ!D13), '*REST 3-6 MIN BETWEEN SETS' (SQ!E28) |
| Accelerative strength | 60-80 % | 3-6 × 3-5, max intent | 2-4 min | 'Hang cleans @ 75%' → '@ 90%' |
| Strength-speed | 40-65 % straight weight (v1: no band tension, EQ-12) | 2-3 × 6-10 | 45-90 s | 'FAST RPE6 or about 60-70%' (4 TRACKS!N17) |
| Speed-strength | body mass to 30 % 1RM; hex bar ≈ 20 % squat 1RM; DB jumps total ≈ 10-20 % BM | 3-6 × 3-5 | 1.5-3 min | 'Hex bar squat jumps', 'DB Squat Jumps' |
| Starting strength / reactive | body mass; medball per FV-6 | 5-10 × 2-4 (plyo contacts per 03 §9.7) | 1-2 min | 1 x 10 throws (ALL ABOUT BALLISTICS!A53:B71) |

**FV-5. Implement for each zone when equipment is missing** (fallback order; INFERRED from [S43][S45][S47] and the library tags).
* Strength-speed:
  * Olympic lift (barbell + bumpers, P5) → power clean / hang pulls (barbell, P4) → hex-bar jump (P4/P5) → KB swing / KB clean ([S47]; P2/P3 with a KB) → DB snatch / DB jump (P2) → bodyweight 'Squat to calf raise' / broad jump (P1).
  * With no barbell the zone moves from strength-speed to speed-strength or reactive. Tell the client (`zone_shift` flag), since this is the OBSERVED library behaviour.
* Speed-strength throws: medball (P3+) → none in P1/P2. Substitute plyo push-ups for upper body, fast cable rotations where there is a cable, the no-ball 'fake medball slam', and broad or skater jumps for lower body (COACH-ANSWER EQ-07; never band chops); the zone is kept, the pattern is not.
* Everyone in athletic training gets Olympic-lift work (COACH-ANSWER ATH-10): without bumpers, hang pulls and hang cleans lowered under control, DB/KB snatches and cleans, hex-bar jumps.
* Accommodating resistance: v1 - not used anywhere (COACH-ANSWER EQ-12).

**FV-6. Medicine-ball weight rule** (SCIENCE [S49][S50][S52][S54] + COACH-CHAT 8-10 lb).

> **v1 SUPERSEDED (COACH-ANSWER EQ-06 RIGHT, ATH-09, ATH-05).** The block below is the v0 proposal, kept as a record. The generator uses `10_equipment_model` `load_velocity.medball_rule`: chest pass / push throws / rotational passes 8-10 lb (start at 8); overhead and backward throws 6-10 lb; sit-up throws 6-8 lb; slams 10-20 lb; heavier only for medball hang cleans / wall balls; never over 20 lb; lighter for youth and older clients; no throwing in the main workout for aesthetics / bodybuilding (warm-up only). The 'female athlete or bodyweight < 60 kg' modifier is RETIRED (ATH-09: 'I don't go by sex on these things'). The quality gate (drop 2 lb when the throw slows) stays.

```
base_lb by throw type (adult male athlete / strong adult):
  overhead / sit-up-to-overhead / scoop / backward throws ........ 8-10 lb   (coach default; [S50] 6-12 lb equivalent)
  rotational (scoop toss, shotput, punch throw) .................. 6-8 lb    ([S54] 4-8 lb; coach upper bound 10)
  chest pass / push throws ....................................... 6-8 lb    ([S49] 2 kg fastest; [S51] 3-4 kg for testing)
  slams (non-bounce) ............................................. 10-20 lb  (INFERRED; slams are gravity-assisted)
modifiers:
  female athlete or bodyweight < 60 kg ........ -2 lb      [RETIRED v1 - no sex-based rule, COACH-ANSWER ATH-09]
  youth (< 15 y) or older adult / beginner ..... use 4-6 lb (2-3 kg) for every throw type
  dose ......................................... 1 x 10 per throw (1 x 20 sit-up throws) (OBSERVED ALL ABOUT BALLISTICS!A53:B71)
quality gate (every session, coach + [S54]):
  if the throw visibly slows, the head drifts, or the spine side-bends -> drop one ball size (2 lb)
  if the ball is clearly too easy (no effort to accelerate) and technique is clean -> up one size, never past 10 lb for rotational/chest
```

**FV-7. Plyometric intensity.**
* Intensity rises with:
  * drop height: start depth drops at about 20-30 cm; progress toward the RSI-optimal height of about 30-40 cm [S58][S59];
  * unilateral vs bilateral;
  * contact speed (fast SSC < 250 ms, "bouncy") [S57].
* Box-jump height is a skill and landing variable, not intensity. Plate-hop thickness and hurdle height follow the library's own ladder ('Bigger plates start at lateral bilateral plate hops', OBSERVED G53 = H16).
* Landing and stick drills come before reactive jumps (OBSERVED audit N6). This matches 'TAKING IN FORCES' first.

**FV-8. Contrast / French contrast / complex station** (intermediate+ athletes, off-season, COACH-ANSWER ATH-12 RIGHT; ≤ 2 stations per week).
* Sequence (coach's own, OBSERVED SQ!I18): heavy squat 78-85 % × 2-4 → tuck jumps × 5 → goblet or DB squat jump (light load) × 5 → 4th member. The sheet's 4th member is 'reverse banded squat jumps' (assisted); v1 removes the band (EQ-12) and uses bodyweight pogo / repeat squat jumps with fast contacts, or stops after three members - PROPOSED - PENDING COACH APPROVAL.
* Rest:
  * between members: immediately (coach) up to 20 s;
  * between rounds: 3-5 min;
  * if the goal is an *acute* PAPE effect on a test or sprint, wait 6-10 min after the heavy member [S61].
* Dose: 3-4 rounds, 2× per week, blocks of 6-12 weeks [S60].
* Tag the station `COMPLEX`. It is exempt from the fast → slow ordering check (05 §3.4).

**FV-9. Older adults and beginners.**
* Velocity training is done on machines or with light free weights at 40-60 % 1RM (frail: 30-60 %), with an explosive concentric and a controlled eccentric [S12][S41].
* Jumps and throws enter only after a landing screen and a block of strength.

**FV-10. Accentuated eccentric** (answers 'WEIGHT RELEASERS' = 'I HAVE NO IDEA').
* DB-release jumps ('DB Depth drop dbs Jump'): total DB load 10-20 % of body weight (COACH-ANSWER EQ-15 - RIGHT; ≈ 20 % in [S63]), too heavy when jump height or speed clearly drops; 3-5 × 3-5, for athletes from the intermediate level.
* Weight releasers: v1 - not programmed (COACH-ANSWER EQ-12). The v0 rule (105-120 % eccentric, advanced lifters only, spotters, P5 facilities [S63]) is parked for the later variable-resistance work.

---

## 4. Range of motion: full, partial, lengthened, mid-range

### 4.1 Key findings (SCIENCE)

* **Full vs partial overall.**
  * Pallarés 2021 meta-analysis: full ROM produced more strength and lower-limb hypertrophy than partial ROM [S64].
  * Wolf 2023 meta-analysis (23 studies): a trivial overall advantage for full ROM (SMD 0.12; all outcome SMDs 0.05-0.2). **Partials at long muscle lengths** may beat full ROM for hypertrophy (SMD −0.28, 95 % CI −0.81 to 0.16). Strength is ROM-specific. Partial ROM is an option for variety, preference or injury [S65].
* **Lengthened partials.**
  * Knee extension (Pedrosa 2022; 45 untrained women): partials at long quadriceps lengths (100-65° knee flexion) gave favourable gains. Full ROM beat short-length partials for distal quadriceps growth [S66].
  * Calf raise (Kassiano 2023; 42 women, 8 weeks, pin-loaded leg press): initial-ROM (lengthened) partials gave +15.2 % medial gastrocnemius vs +6.7 % for full ROM and +3.4 % for final-ROM partials [S67].
* **Long-length exercise positions.**
  * Overhead cable triceps extension grew the triceps about 1.4× more than pushdowns over 12 weeks (Maeo et al., Eur J Sport Sci, 2022-23) [S68].
  * Seated leg curl grew the whole hamstrings +14 % vs +9 % for prone curls (Maeo 2021) [S69].
* **Squat depth.** Full squats (140° knee flexion) grew the gluteus maximus (+6.7 % vs +2.2 %) and adductors (+6.2 % vs +2.7 %) more than half squats (Kubo 2019) [S70].
* **Athletic transfer (joint-angle specificity).** Over 16 weeks, quarter, half and full squat groups each gained most strength at their own depth. **Quarter squats transferred best to vertical jump and 40-yd sprint** (Rhea 2016) [S71].
* **Davidson:** ROM is the forgotten half of work, and lengthened ranges come first [S28][S32].

### 4.2 Against the coach

* **Supports.** The coach treats ROM as a variable and colour-grades it:
  * 'ROM VARIABLE': 'Elevated' green, 'Floor' yellow, 'Deficit' red, '*RDL' red (RP!A81:A85).
  * 'END RANGE BEHAVIOR VARIABLE': 'Dead stop' green, 'Touch & go' yellow (RP!A86:A88).
  * ROM-enhancing names: 'Elevated Push ups (for full ROM)' (AD99), 'Standing Calf raises (use deficit)' (AU9/AU10).
  * This matches the evidence: deficits and long lengths add stimulus, especially for calves [S67] and quads [S66].
* **Refines.**
  1. "Mid ROM" has two meanings:
     * For **athletes** it is legitimate joint-angle-specific work (quarter and half squats, hang positions, jump-range loading) [S71].
     * For **hypertrophy**, partials should sit at the **lengthened** end, not the middle or short end [S65][S66][S67].
  2. Prefer lengthened-position exercise *variants* for isolation (seated over prone curl; overhead over pushdown triceps) [S68][S69].
* **Contradicts (internal flag).** The coach colours 'Elevated' green (easier, smaller ROM, as in a hands-elevated push-up or an elevated RDL). His library also uses "elevated" to mean **larger** ROM ('Elevated Push ups (for full ROM)', 'Elevated feet on bench glute bridge'). The generator must store ROM as **muscle-length effect** (`rom_effect: +/0/−`) per exercise, not as the word "elevated".

### 4.3 Generator rules (ROM-x)

**ROM-1. Default full ROM, i.e. the longest pain-free range,** on every resistance exercise [S64][S65].

**ROM-2. Lengthened-bias selection.** When two exercises fill the same isolation slot, rank the long-length variant higher:
* seated / hip-flexed leg curl > lying leg curl [S69][S32];
* overhead triceps extension > pushdown [S68];
* deficit or full-stretch calf raise ('use deficit') [S67].

**ROM-3. Lengthened partials** as an **intensifier only**. Use them for advanced hypertrophy clients on the last set of constraint ≥ 4 exercises, after the full-ROM reps, e.g. 'leg extension: full reps to RIR 0-1, then 5-10 bottom-half partials' [S65][S66][S67]. Never on free-weight barbell lifts.

**ROM-4. Athletic partials.** Athletes may get one joint-angle-specific lift per week:
* quarter or half squats in the strength-speed zone;
* hang-position pulls;
* 'Box. Any Squat Touch and Go fast' (AI91).

They also keep ≥ 1 full-depth squat or lunge pattern per week [S71][S70][S64].

**ROM-5. Pain.** Restrict to the pain-free range first, before removing the exercise [S65], then apply EQ-5.

**ROM-6. ROM as a block-to-block variable** (one change per block, GRD-2). The progression direction is:
* Hypertrophy and general clients: Floor → Deficit, or Elevated (short) → Floor → Deficit (long).
* Athletes and beginners: End-range 'Dead stop' → 'Touch & go'.

The ROM direction for each exercise comes from the stored `rom_effect`.

---

## 5. Volume: hard sets vs volume load; set-based progression

### 5.1 Key findings (SCIENCE)

* **Counting sets is a valid volume metric.** The number of sets to or near failure is an adequate way to quantify hypertrophy volume across 6-20+ reps, other variables held constant (Baz-Valle 2021, 14 studies) [S72].
* **Volume load (load × reps × sets) is biased.** It depends on rep range, rest and velocity, so it is a poor stand-alone stimulus measure across schemes (Scott 2016) [S73]. Worked example (INFERRED):
  * 3 × 20 at 40 kg = 2,400 kg.
  * 3 × 5 at 100 kg = 1,500 kg.
  * Both are 3 hard sets with a similar growth stimulus [S19][S72], yet the tonnage differs by 60 %.
* **Dose-response with diminishing returns.**
  * Schoenfeld 2017 [S74]: < 5, 5-9 and 10+ weekly sets per muscle gave 5.4 %, 6.6 % and 9.8 % growth.
  * Schoenfeld 2019 [S75]: 1, 3 and 5 sets per exercise; hypertrophy rose with volume, strength did not.
  * Pelland 2026 [S76] (67 studies, n = 2,058): growth and strength both rise with volume, with diminishing returns that are steeper for strength. Counting indirect sets as **0.5 ("fractional")** predicted outcomes best. A per-session plateau near ~11 fractional sets for hypertrophy is reported in secondary summaries.
* **Upper end.** In trained people, 18 weekly lower-body sets did best, and 24 added nothing over 18 (Aube 2022; secondary summary) [S77].
* **Progressive set increases.**
  * Raising each person's previous weekly volume by 20 % (≈ 24 sets) beat a fixed 22 sets for hypertrophy (Scarpelli 2022) [S78].
  * Starting at 22 weekly quad sets, adding **4 or 6 sets every 2 weeks** for 12 weeks (up to about 52) gave more strength than fixed volume, with a hypertrophy trend (Enes 2023) [S79].
* **Practitioner algorithm (RP)** [S22]:
  * Maintenance volume is about 6 sets per week.
  * Each mesocycle starts near MEV and adds sets according to soreness, pump and performance: **+2-3 sets** if recovery is easy, **+1** if moderate, **hold** if sore, **deload** if performance drops.
  * Deload to about maintenance volume.
  * Chest: about 12-20 weekly sets is the productive range for most; 2-5 different chest exercises per week, 1-3 per session [S23].
* **Load progression (ACSM 2009)** [S80]:
  * Add 2-10 % load once the client beats the target reps by 1-2.
  * Novices: 8-12RM.
  * Hypertrophy: 6-12RM emphasis, 1-2 min rest.
  * Strength: 1-6RM, 3-5 min rest.
* **Proximity to failure** matters for growth [S21]. A "set" only counts if it is hard: 0-4 RIR, 5-30 reps (RP working-set definition [S22]).

### 5.2 Against the coach

* **Supports.**
  * The coach's "how many sets did you do this week? To do more, do more sets next week of the same thing" (COACH-CHAT) is set-based progression with exercise stability, the model best supported in trained people [S78][S79][S22].
  * His example, 20 → 22 chest sets (+10 %) at constant load, sits inside tested progressions: Enes adds about +2-3 sets per week from 22 [S79]; Scarpelli +20 % [S78]; RP +1 to +3 [S22].
* **Refines.**
  1. The coach defines volume as "weight × reps × sets". The generator should **count hard sets** as the primary unit [S72], log volume load only as a secondary metric, and compare it only within one exercise at the same rep range [S73].
  2. Credit synergists at 0.5 per set [S76]. `03_volume_dosing.md` already uses this convention. **v1 RETIRED (COACH-ANSWER VOL-09):** helpers get 0.25 per set; dips are his named 0.5 triceps / 0.5 chest case (LIB-16); athletic sets never count toward muscles (VOL-10). Owner: `03_volume_dosing`.
  3. **Reconciliation flag with 03/06.** The parallel volume governor progresses about +0.5 set per muscle per week (3/5/7 % size tiers). **v1 RETIRED size tiers (COACH-ANSWER VOL-05):** 'It doesn't really go by muscle ... It's just more on what's going on with the person'; the 3, 5 or 7 % of weekly sets is chosen by the person's state (fatigue, life, response) and is coach-adjustable, and 10 % a week is 'way too much' (UNI-05). Owner: `03_volume_dosing`. The coach's chat example is +2 sets in one week for chest. Both are evidence-compatible. The governor is conservative; the coach's step is RP's "recovering well" branch. Proposed reconciliation: section 5.3, VOL-3.
  4. "Different exercises" inside the +2 sets ("22 sets of chest work with different exercises") is **systematic variation within the week**, which is evidence-backed for regional growth [S81][S23]. It is not the "confusion" variation he warns against (section 6).
* **Contradicts.** None.

### 5.3 Generator rules (VOL-x)

**VOL-1. Unit = hard set.**
* A set counts if it has 5-30 reps at ≤ 4 RIR, or is a MYO set (counted as 2).
* Compound sets credit the prime mover 1.0 and synergists 0.5 [S76][S72]. **v1 (COACH-ANSWER VOL-09):** helpers 0.25, not 0.5; dips 0.5 triceps / 0.5 chest (LIB-16); a 10/10 unilateral set = 1 set to the primary muscle (UNI-01). Owner: `03_volume_dosing`.
* Athletic contacts, throws and Olympic reps are counted separately (03 §9.7) and do not count as hypertrophy sets.

**VOL-2. Volume load is logged, never steered on.**
* Compute load × reps × sets per exercise for the client dashboard.
* Show week-over-week change only when the exercise and rep bracket are unchanged [S73].

**VOL-3. Weekly set step = readiness-gated.** Use the BYOP logbook EFFORT and FEELING columns.
* All muscle's exercises at EFFORT ≤ 8 and no 'Felt a PAIN' → release up to +2 sets for priority muscles and +1 for others. This is the coach's 20 → 22 behaviour and RP's easy-recovery branch [S22][S79].
* Mixed signals → +0 to +1 set, using the 03/06 governor accumulator.
* Any EFFORT 10 or a pain flag → hold, or −1 set (06 §4.3).
* Hard caps: total weekly sets +≤ 10 % week over week (03 §9.7; v1: the normal step is 3, 5 or 7 % of weekly sets chosen by the person's state, VOL-04/VOL-05, and 10 % a week is 'way too much' to sustain, UNI-05); muscle ceilings from 03 §9.7; ≤ 10-11 fractional sets per muscle per session [S76].

**VOL-4. Inside a muscle, add the new set to a different exercise than last week's addition** (coach: "22 sets ... with different exercises"). **v1 SUPERSEDED (COACH-ANSWER VOL-07):** about 3-4 exercises per muscle per day; the added set goes to the first exercise in session order, the next week's to the second, and so on (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); a small muscle trained last when the client is 'gassed out' gets its extra volume as a bonus exercise. Owner: `03_volume_dosing`. The v0 bullets below are kept as a record:
* Rotate the extra set across the muscle's weekly exercises: horizontal → incline → fly for chest, matching RP's three chest categories [S23].
* Keep each exercise's load the same that week (coach: "keep load the same").

**VOL-5. Load progression = double progression.**
* Reps rise to the top of the bracket at the target RIR.
* Then load rises 2-10 %: about +2.5-5 kg lower-body barbell, +1-2.5 kg upper-body, the next DB pair or stack plate [S80].
* Then reps reset to the bottom of the bracket.
* For home DB clients with coarse increments, progress reps, tempo (TEMPO-3) or sets instead of load [S19].

**VOL-6. Starting volume.**
* Week 1 at about MEV for the population (03 §9.3; Davidson's beginner 8-24 sets per muscle per week [S31]; NSCA older-adult 2-3 sets per exercise [S12]).
* Never start a block at last block's peak.

**VOL-7. Deload.** Last week of each 4-6-week block, or on readiness failure: about 50-60 % of last week's sets (≈ maintenance volume, ~6 sets per muscle [S22]), same exercises, RIR ≥ 3. This aligns with 03 §9.8 and 06 §6.

---

## 6. Exercise variation and the "muscle confusion" myth

### 6.1 Key findings (SCIENCE)

* **Fonseca et al. 2014** (12 weeks; constant vs varied *exercise* × constant vs varied *intensity*) [S81]:
  * Whole-quadriceps CSA rose similarly in all groups (9.3-12.2 %).
  * The constant-exercise / constant-intensity group did **not** grow the vastus medialis or rectus femoris.
  * **Varying the exercise with constant intensity gave the best squat 1RM.**
  * Varying both exercise and intensity gave the smallest strength gain.
* **Baz-Valle et al. 2019** (8 weeks, trained men): exercises varied **randomly every session** by an app vs fixed exercises. Strength and muscle-thickness gains were similar, and intrinsic motivation was higher in the varied group [S82].
* **Kassiano et al. 2022 systematic review** (8 studies, n = 241) [S83]:
  * Systematic variation can enhance regional hypertrophy and dynamic strength.
  * **Excessive, random variation may compromise gains.**
  * Exercises with redundant stimulus, or rotation at high frequency, may hinder adaptation.
  * Variation should follow anatomy and biomechanics.
* **Kassiano et al. 2024** (10 weeks, 70 women): constant vs systematically varied exercises gave equivalent muscle thickness and 1RM gains [S84].
* **Novelty and damage.** Early-training muscle damage raises protein synthesis that is **not** related to hypertrophy. Growth tracks protein synthesis after damage subsides (Damas 2016) [S85]. The repeated-bout effect means a new exercise brings soreness and damage that the same exercise soon stops causing [S86]. **Constant novelty therefore buys soreness, not growth.**
* **Skill.** Strength on a lift is partly a learned coordination [S15]. Rotating skill-heavy lifts too often costs strength (Kassiano 2022 discussion [S83]).
* **When to switch** (Israetel, practitioner) [S25]: falling pump or target-muscle tension compared with alternatives, rising joint stress or fatigue cost, and stalled performance. One sign → monitor. Two or more → switch.
* **Davidson:** keep focus on the same exercises for about 12 weeks for muscular change [S31, summary].

### 6.2 Against the coach

* **Supports.** "Don't try to 'confuse' the muscle; not a lot of new things; keep the same over the block; next block change some small variables" (COACH-CHAT) is the evidence-based position [S81][S83][S85].
  * His reference tab says it too: 'Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus' (ALL ABOUT SQUATS!A5, OBSERVED).
  * His A/B week swaps of the lead lift with a fixed skeleton (FAT BURN, CONJUGATE, 4 TRACKS 'A WEEK'/'B WEEK', audit N8) are systematic variation, not confusion.
* **Refines.**
  1. Variation **inside the week** (2-3 exercises per muscle) is good. It is how regional growth is covered [S81][S23]. The coach's 20 → 22 example already does this.
  2. **Athletes are a special case.** BASEBALL rotates the implement in the 'bkd' slot week to week ('DB Squat Jumps' > 'Hex bar squat jumps' > 'fast high zercher squats' > 'KB Squat cleans' > ..., OBSERVED; 162 of 234 week-to-week slot changes switch implement). The evidence does not forbid this. Random variation did not hurt growth [S82]. It works because the **velocity zone and pattern stay constant** while the implement changes. Allow weekly rotation in speed-strength and strength-speed accessory slots. Keep the **skill-anchor** lifts (Olympic lift, main squat or hinge) fixed through the block.
* **Contradicts.** Nothing. The weekly implement rotation in BASEBALL looks like it contradicts "keep the same", but it is reconciled by the zone-constant rule above.

### 6.3 Generator rules (VARI-x)

**VARI-1. Block = fixed menu.**
* Within a block (4-6 weeks, PER-02 RIGHT), each slot keeps the same exercise. (v0 arithmetic 'a 6-week plan = 1 block, 8 weeks = 2 × 4, 12 weeks = 2 × 6 or 3 × 4' is SUPERSEDED by COACH-ANSWER PER-01: 4-6-week plans are maintenance / transition blocks at about 50-70 % volume; 8 weeks = 4 weeks adapting + 4 driving hard; 12 weeks = 2-4 weeks acclimation, 4-6 driving hard, the last weeks hardest; open week-by-week and yearly modes too. Owner: `06_periodization`.)
* Weekly change is only to sets, reps, load and RIR.

**VARI-2. Block change = 1-2 small variables per slot, ≤ ⅓ of slots fully replaced.** At a block boundary, each slot either keeps its exercise or changes **one** variable from the variable stack (section 9.1), e.g.:
* implement: barbell ↔ DB;
* grip;
* stance or ground (GRD-2);
* load position, e.g. goblet → front rack, from the coach's front-to-back squat ladder, ALL ABOUT SQUATS!A10:H11;
* ROM (ROM-6);
* end-range behaviour;
* tempo.

Full pattern-level replacement is limited to about a third of slots per block [S83][S81].

**VARI-3. Skill anchors are frozen.**
* Olympic lifts, the main barbell squat, hinge or press, and the main sprint, jump or throw drill keep the same variant for ≥ 8 weeks (two blocks) for strength and athletic goals [S83][S15].
* Change them only by load, sets or ROM.

**VARI-4. Within-week variety.**
* Hypertrophy: give each muscle 2-3 distinct exercises per week covering different regions and lengths, e.g. chest = horizontal + incline + fly [S23][S81]; quads = squat pattern + leg extension [S81].
* Use the coach's A/B weekly alternation (lead-lift swap) when the template supports it (OBSERVED audit N8).

**VARI-5. Athletic zone-constant rotation.** In speed-strength and strength-speed accessory slots, rotate the implement weekly within the same zone and pattern (BASEBALL style). Never rotate the zone itself within a block.

**VARI-6. Mid-block swap triggers** (only these):
* 'Felt a PAIN' on the exercise → EQ-5 swap.
* Two consecutive exposures with no rep or load progress at good readiness.
* Client reports the target muscle "not feeling it" two sessions running [S25].

The swap target is the coach-native pair (EQ-7 step 1), else the same pattern at the same ground level. Never swap for soreness or novelty [S85].

---

## 7. Exercise order: what the evidence says, and horizontal before vertical

### 7.1 Key findings (SCIENCE)

* **ACSM 2009:** sequence to preserve exercise intensity: large before small muscle groups, multi-joint before single-joint, **higher-intensity before lower-intensity** [S80].
* **Order effect on performance.**
  * Exercises done later in a session get fewer reps at a given load (Simão 2005, via [S91]).
  * Simão 2012 review: the exercise done first responds best, whether multi- or single-joint. The main deciding factor should be the client's movement and priority needs [S87].
* **Order effect on chronic adaptation.**
  * Simão 2010 (12 weeks: bench → pulldown → triceps → biceps vs the reverse): the exercise done last showed the smallest strength gain; bench press done last did not improve significantly [S88].
  * Nunes 2021 meta-analysis (11 studies, n = 268): **strength gains favour the exercises done first. Hypertrophy is not affected by order** [S89].
* **Pre-exhaustion** (isolation before compound) lowers performance (Augustsson 2003; Gentil 2007, via [S91]).
* **Bench press vs shoulder press order** (6 sequences of bench, shoulder press and triceps extension): only the sequence shoulder press → triceps → bench gave fewer reps than the triceps-first sequences. **Bench → shoulder press vs shoulder press → bench did not differ** (Miranda 2013) [S90].
* **Paired sets of non-competing patterns** (bench + seated row alternated vs done separately): more volume load per set, in less time, with more neuromuscular fatigue (Paz 2017) [S92].
* **Plyo/strength order.** Complex, traditional and contrast orders gave similar strength and jump gains; the plyo-first order lost sprint speed in-season (Kobal 2017, via [S62]). Fast-to-slow is the default, but not the only valid order.

### 7.2 Against the coach

* **Supports.**
  * "Power first, then power-strength, then strength, then resistance" is ACSM's higher-intensity / more-complex-first rule [S80], plus the velocity-loss logic [S39].
  * His BYOP skeletons follow it 12/12 (OBSERVED audit R3).
  * Bilateral before unilateral (225/231 sessions, audit R5) and compound before isolation (audit R6) are the large-before-small and multi-before-single rules [S80].
* **Refines: horizontal before vertical (R1/R2).**
  * No study tests horizontal vs vertical order directly.
  * Indirect evidence: the bench vs shoulder-press order does not change reps much [S90]. Whatever is first gains most strength [S89].
  * Defensible reasons (INFERRED):
    1. Horizontal pushes and rows usually allow heavier loads and involve more muscle mass than overhead presses and pull-ups. Putting them first is ACSM's "higher-intensity first".
    2. Rows train scapular retraction and depression, which pull-ups and pulldowns use (practitioner reasoning, not tested).
    3. The overhead position needs more shoulder flexion and upward rotation, so horizontal work first acts as a specific warm-up.
  * **Status: the coach's house rule.** Low cost, keep it. Allow the evidence-based exception: when the vertical lift is the client's priority or 'the work' (CONJUGATE 'HEAVY OH PRESS' first), put it first (priority principle [S87][S89]).
* **Refines: priority principle.** For a client's **FOCUS muscle** in hypertrophy plans, the evidence says order does not change growth [S89], so the generator does **not** have to move isolation work first. For a **strength priority** lift, first position matters [S89][S88].
* **Contradicts.** None. The coach's own exceptions (calves first on aesthetics days; lead-lift swaps; contrast pairs) are allowed by the evidence (hypertrophy is order-independent [S89]; contrast works [S60]).

### 7.3 Generator rules (ORD-x)

**ORD-1. Default session order = 05 §3.1 tiers:** prep → **core (v1: first by default, as part of the warm-up; the client may move it after the plyos or to the end - COACH-ANSWER ATH-11 NOT RIGHT to late core)** → reactive/elastic → throws → COD → power-strength → main bilateral lower + horizontal upper → unilateral lower + vertical upper → isolation → conditioning. (v0 had 'core finisher' after isolation; retired.)

**ORD-2. Priority override.**
* If the goal is strength in lift X, or X is 'the work' (CONJUGATE/4 TRACKS hierarchy 'the work' → 'the accessory' → 'the nuance' → 'the survival', audit N11), X goes first among resistance slots, even if it is vertical [S87][S89].
* Athletic tiers still come before X unless a COMPLEX station is chosen.

**ORD-3. Contrast exception.** COMPLEX stations (FV-8) may put heavy before jump. Mark them and skip the order check.

**ORD-4. Supersets.**
* When the session time budget is short (05 §7), pair non-competing patterns in A1/A2 [S92]. v1 (COACH-ANSWER ORD-05 PARTLY): supersets are a fatigue / density tool, also for advanced clients who need more stimulus, off-season VO2 / mitochondrial work, and beginners who do not fatigue with straight sets.
* Use the coach's pairs: knee-dominant + pull, hip-dominant + push (audit R9, 186/222 pairs).
* Never pair two grip-limited patterns (hinge + heavy pull) or two exercises with the same prime mover.

**ORD-5. Horizontal before vertical** within the same push or pull vector, unless ORD-2 applies. Label it `house_rule` in the explanation shown to the client, not `evidence`.

**ORD-6. Isolation follows its day.** Biceps on pull days, triceps on push days, quad isolation on knee days, hamstring isolation on hip days (OBSERVED audit N1/N2). MYO sets only on the last exercise (EQ-3).

**ORD-7. Core placement by family** (OBSERVED, audit R10) - **RETIRED in v1 (COACH-ANSWER ATH-11 NOT RIGHT):** 'we need all the core work to be done first ... start with the core work that'll give you a good warm-up'; about 2 core exercises (VOL-17); the client may move the core block after the plyos or after strength. v0 record, not used:
* Athletes: core primer after athletic work and before strength (BASEBALL Part B).
* Aesthetics: core at the end.
* No evidence was found against either. (v0: 'keep them as observed'.)

---

## 8. Accommodating resistance (bands, chains, releasers) and eccentric speed

> **v1 - OUT OF SCOPE for the generator (COACH-ANSWER EQ-01, EQ-12).** EQ-01: "I don't do bands. I don't program anything with bands. That is something that will eventually come up about variable resistance, but I don't really want to talk about variable resistance in any of this right now because it's so complicated." EQ-12 (NOT RIGHT to our 'bands ~50 %, chains ~70 % of 1RM'): "We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on." The findings in 8.1-8.2 are kept as reference for that later work; **AR-1 to AR-6 are suspended**; the eccentric-speed findings and **TEMPO-1 to TEMPO-4 stay active** (tempo is not variable resistance).

### 8.1 Key findings (SCIENCE)

* **Chains or bands vs constant load, strength.**
  * Soria-Gila 2015 (7 studies, n = 235): ≥ 7 weeks of variable-resistance training gave **+5.0 kg** more 1RM than constant resistance [S93].
  * Lin 2022 (meta-analysis; ES 0.80) [S94]:
    * Trained lifters benefit only when the total load is **≥ 80 % 1RM** (ES 0.76; < 80 % no difference).
    * Untrained lifters benefit at < 80 % (ES 2.38).
    * The band or chain part was typically **10-35 % of total load**.
* **Bands with fast intent, power.** Fast squats (0.6-0.8 m/s) with large bands beat slow heavy squats (0.2-0.4 m/s) for power in Division I athletes (Rhea 2009) [S95]. Bands at 85 % 1RM raised peak force by 16 % (Wallace 2006) [S96].
* **Chains and velocity.** Professional rugby league players benched 60 % 1RM plus 17.5 kg of chain (≈ 75 % total) vs the same total load in plates. With chains, **mean and peak concentric velocity were about 10 % higher**. The likely mechanism is eccentric unloading as the links pile on the floor, which speeds up the stretch-shortening transition (Baker & Newton 2009) [S97].
* **Dynamic-effort practice** (Westside, practitioner): 50-60 % bar plus bands or chains, box squats of 8-12 sets × 2, about 60 s rest [S101].
* **Eccentric speed.**
  * A 6-s eccentric bench cut concentric average power (402 vs 468 W) and peak velocity (0.69 vs 0.79 m/s) compared with a 2-s eccentric (Wilk 2019) [S98].
  * Wilk 2021 review [S99]: a slow eccentric with a fast concentric looks best for hypertrophy; longer intended rep durations reduce the reps possible at a given load; slower eccentrics may blunt strength in some contexts.
  * Rep durations of 0.5-8 s give similar hypertrophy; very slow reps (> 10 s) are inferior (Schoenfeld 2015) [S100].
* **Load and recruitment.** Light loads taken to failure give hypertrophy similar to heavy loads. Heavy loads are better for strength (Lopez 2021) [S19].
* **Assisted (reverse-band) jumps** add take-off velocity, but the band also pulls during the eccentric phase, which can alter the natural SSC (practitioner caution) [S104].
* **Weight releasers / accentuated eccentric loading:** see section 3.6 [S63].

### 8.2 Against the coach

* **Supports.**
  * 'BOTTOM BANDED' — 'Bands are designed for speed/velocity' and 'Weight should be lower ranges around 50% so you can move fast' (SQ!C35/B36) — is the dynamic-effort and Rhea-2009 model [S95][S101].
  * 'REVERSE BANDED' — '*ACCELERATES MAX PROPULSION', 'Helps you have a faster concentric reaction', 'SOMEBODY THAT IS SLOW ON THE WAY UP' (SQ!A37:D38) — matches assisted overspeed logic [S104].
  * 'HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' (SQ!A44:A45) holds in the sense that heavy loads recruit high-threshold units from rep 1 and force a controlled eccentric.
* **Refines.**
  1. Bands at ~50 % improve **speed and power**, not maximal strength, in trained lifters. For a max-strength effect the total load must reach ≥ 80 % [S94]. If variable resistance is reopened later, label banded 50-60 % work "strength-speed", not "strength" (v1: not programmed, EQ-12).
  2. 'LIGHT BARBELL ' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (SQ!A47:A48) is true only for sets well short of failure. Light sets near failure recruit and grow muscle comparably [S19]. A fast eccentric also *helps* concentric speed [S97][S98], which is the point of athletic work.
  3. Slow eccentrics cost concentric power and reps [S98][S99]. Use them for hypertrophy or control, never on power-zone work.
* **Contradicts.**
  * 'BOTTOM CHAINS' — '*INTENSIONALLY SLOW YOU DOWN' and 'Weght can be moderate around 70%' (SQ!A39:B40). At matched total load, chains made the bar **faster**, not slower [S97].
  * What chains do (a lighter bottom, a heavier top, a load that matches the strength curve) fits the coach's other line, 'Chains are designed for magnitude influence, loading' (SQ!C39), and the strength benefit at ≥ 80 % [S94].
  * Proposed wording for the client: "chains make the top heavy so you have to keep pushing all the way through". v1: not needed for now - the coach took chains out of scope (EQ-12); keep the wording for the later variable-resistance work.
* **Gap filled.** 'WEIGHT RELEASERS' = 'I HAVE NO IDEA' (SQ!B41:D41) → section 3.6 / FV-10 [S63]; v1: releasers are not programmed (EQ-12).

### 8.3 Generator rules (AR-x, TEMPO-x)

> **v1: AR-1 to AR-6 are SUSPENDED (COACH-ANSWER EQ-01, EQ-12).** They are kept below, unchanged except for AR-6, as the starting point for the later variable-resistance work. While suspended, the generator replaces the coach's banded / chained lifts with the same lift at straight weight: 'FAST' = 'FAST RPE6 or about 60-70%' (OBSERVED 4 TRACKS!N17), 'HEAVY' = 1 RIR; banded box squats AI92, AI93, AI95, AI96 → 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94; reverse-banded / band-assisted jumps → bodyweight jumps.

**AR-1 (suspended). Eligibility.** All must be true:
* level ≥ intermediate;
* barbell + rack + band anchor or chains (P4/P5);
* goal = strength, athletic or hybrid.

Never for P1-P3, novices or pain flags. The coach colours every banded box-squat entry red (advanced) (RP!A26:A30, OBSERVED).

**AR-2 (suspended). Speed day (strength-speed, coach's 'BOTTOM BANDED').**
* Bar at 50-60 % 1RM, band tension about 20-30 % of the top load.
* 6-10 sets × 2-3 reps, max intent, 45-90 s rest [S95][S101][S94].
* Coach anchors: AI91:AI96 ('Box. Any Squat Touch and Go fast', banded and reverse-banded variants), 'FAST BANDED DEADLFTS'.

**AR-3 (suspended). Heavy accommodated day ('BOTTOM CHAINS').**
* Total load at the top ≥ 80 % 1RM, chain or band share 10-35 %.
* 3-5 × 1-5 [S94][S93].

**AR-4 (suspended). Reverse band ('REVERSE BANDED').** For clients flagged "slow out of the hole" (coach: 'SOMEBODY THAT IS SLOW ON THE WAY UP') and for intermediate older lifters learning to squat with speed. Band assistance about 10-20 % of load. Max intent.

**AR-5 (suspended). Band-assisted jumps.** At most 1 set type per session, and only after normal jumps that day [S104].

**AR-6 (replaced in v1). Home training without bands.**
* v0 made bands the primary home resistance for P1/P2 [S16][S17]. v1 (COACH-ANSWER EQ-01/EQ-02): bands are not used at home either. P1/P2 clients train with DBs/KBs, bodyweight progressions (push-ups as the bench substitute [S18]) and household loads, intensified by TEMPO-3, and get the coach's ideal home kit (DBs + bench + pull-up bar + 8-10 lb medball) as the buy list.

**TEMPO-1. Default tempo by zone.**

| Zone | Eccentric | Concentric |
|---|---|---|
| Athletic / power | natural or fast (SSC) | max intent |
| Strength | controlled (~1-2 s) | max intent |
| Hypertrophy | 2-3 s controlled | max intent |

Never prescribe > 10 s total per rep [S99][S100][S98][S80].

**TEMPO-2. Slow eccentrics (3-5 s) as a tool only for:**
* learning or control phases (GRD-2's first block);
* pain;
* home clients whose DBs are too light (TEMPO-3).

Drop 1-3 reps from the bracket to account for it [S99].

**TEMPO-3. Light-equipment intensifiers** (P1/P2, INFERRED from [S19][S99]). Raise the stimulus without load, in this order:
1. Take sets closer to failure (RIR 0-2 on safe exercises).
2. Unilateral variant.
3. 3-4 s eccentric.
4. Pause at the long length.
5. 1½ reps.
6. Lengthened partials after failure (ROM-3).

**TEMPO-4. Never prescribe a slow eccentric on throws, jumps, Olympic lifts or dynamic-effort work** [S98].

---

## 9. Putting it together: the variable stack, the equipment engine and population presets

### 9.1 The variable stack (what can change, how strong the evidence is, which way to progress)

The coach writes exercises as stacks of variables (OBSERVED `reference_variables.md`): EXERCISE = PATTERN × IMPLEMENT × EXTERNAL STABILITY × LOAD POSITION × LOAD LATERALITY × STANCE × GRIP × FEET/BODY × ROM × END RANGE × ACCOMMODATING × PLANE PERTURBATION, and DOSE = LOAD MAGNITUDE × SPEED/INTENT × VOLUME. The generator changes **one** of these per slot per block (VARI-2, GRD-2).

| Variable | Coach label / ladder (OBSERVED) | Evidence strength for its effect | Progression direction (harder / more demanding) | Rule |
|---|---|---|---|---|
| Implement / external stability | machine → cable → DB/KB → barbell (rows G61 → G68; pulldown → pull-up) | strong for skill/specificity, null for hypertrophy [S1][S3] | lower constraint for athletes; hold for hypertrophy | EQ-1, GRD-3 |
| Load position | 'Hex Bar Squat' EASIEST → 'Goblet' → 'High Zercher' → 'Zercher' → 'Front Squat/ SSB Bar' → 'High Bar' → 'Low Bar' HARDEST → 'Overhead Squat' VERY HARD (SQ!A10:H11) | hex bar best for loaded jumps [S45]; the rest is coach model | front → back → overhead | VARI-2 |
| Load laterality | 'Contralateral loading' (GET INTO THE HIP) / 'Ipsilateral loading' (GET OUT OF THE HIP) (RP!C19:C26) | no outcome studies found (coach model) | v1 (COACH-ANSWER CAT-13): not a difficulty ladder - contralateral pulls you INTO the hip (change-of-direction athletes: football, soccer, basketball, tennis), ipsilateral helps you OUT of the hip (sprint acceleration, e.g. ipsilateral step-ups); a health accessory for bodybuilders / powerlifters, mostly in the first 2-4 weeks. Load position still progresses suitcase (MODERATE) → front-rack (HARDER) | VARI-2, 10_equipment_model CR-32 |
| Stance / base | seated → Z-floor / kneeling → standing (RP!E8:E15); 'Split stance ALWAYS contralateral' (G83) | instability lowers force [S9]; uni ≈ bi for strength/speed [S102] | more ground → less ground | GRD-2/4 |
| Grip | 'HAND PLACEMENT' (RP!I16); pain rule fixed → split | wide bench grip raises shoulder risk [S103] | split grips for pain | EQ-5 |
| Feet / body | 'FEET POSITION' bench/wall → plates/floor → air (RP!I22:I28) | stability → force [S9] | green → red | GRD-2 |
| ROM | 'Elevated' → 'Floor' → 'Deficit' (RP!A81:A85) | moderate-strong [S64]-[S71] | toward long length | ROM-1..6 |
| End range | 'Dead stop' → 'Touch & go' (RP!A86:A88) | SSC speeds the concentric [S97][S98] | dead stop → touch & go | ROM-6 |
| Accommodating | 'WEIGHT RELEASERS' / 'CHAINS' / 'BANDS' (RP!A90:A93) | moderate [S93][S94][S95][S97] | v1: OUT OF SCOPE - not changed by the generator (COACH-ANSWER EQ-12) | AR-1..6 (suspended) |
| Load magnitude | %, RIR/RPE, 'HEAVY'/'LIGHT' | strong [S19][S80] | double progression | VOL-5 |
| Speed / intent | 'FAST', 'max speed', 'same speed for all reps' | strong [S37][S38][S39] | max intent always; VL cap | FV-2/3 |
| Tempo (eccentric) | 'ECCENTRIC SLOW' / 'ECCENTRICFAST' (SQ!A45/A48) | moderate [S98][S99][S100] | by zone | TEMPO-1..4 |
| Volume | sets per week; 'MYO SET' | strong [S72]-[S79] | readiness-gated sets | VOL-1..7 |
| Plyo intensity | box height labels, plate thickness, 'Bigger plates ...' rule | moderate [S57][S58][S59] | drop height, unilateral, contact speed | FV-7 |
| Medball mass | (none written; coach chat 8-10 lb; 'light medball' MM 05!K13) | moderate [S48]-[S54] | by throw type | FV-6 |

### 9.2 Equipment profiles: crosswalk and intake

The two equipment JSONs use different tier vocabularies. The generator should normalise them (INFERRED crosswalk). v1: the generator's own access profiles are the coach's 8 intake options in `10_equipment_model` section 3.1 (EQ-01: full gym, basic gym, home gym, home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit); the P-tiers below are the decode teams' vocabulary only, and every band route in them is ignored (EQ-01).

| Generator profile | `lib_athletic_core` | `lib_resistance` `available_at_tier` | Typical kit |
|---|---|---|---|
| P1 Bodyweight | P1_no_gym_bodyweight | bodyweight_only (v1: a client who owns only bands is a bodyweight client) | floor, wall, step, open space |
| P2 Home DB | P2_home_db_band (bands ignored in v1) | home_db_bench_bands (+ home_plus_doorway_bar), bands ignored | adjustable DBs, bench, (pull-up bar, 8-10 lb medball: the coach's ideal home kit, EQ-02) |
| P3 Home athlete | P3_home_athlete | home_plus_doorway_bar (+ KB, medball, box) | P2 + KB, medball, plyo box, cones/hurdles, 20-60 m space |
| P4 Commercial gym | P4_commercial_gym | commercial_basic | barbell, rack, plates, cables, selectorized machines, DBs to ~50 kg |
| P5 Performance facility | P5_performance_facility | full_gym | P4 + bumpers/platform, hex bar, landmine, sled, GHD, pendulum, med balls/wall, turf |

**Intake checklist** (each item maps to `requires_any_of` keys in the libraries):
* dumbbells (max pair weight; fixed or adjustable);
* bench (flat or adjustable);
* pull-up bar;
* rings / TRX;
* kettlebell(s) (weights);
* medicine ball (weight; bounce or non-bounce; a solid wall);
* plyo box or step (height);
* hurdles / cones;
* open running space (≥ 20 m / 40-60 m);
* barbell + rack + plates; bumpers + platform; hex bar; landmine (v1: no bands or chains on the checklist, EQ-01/EQ-12);
* cable station;
* machines: leg press / pendulum / hack / belt squat / leg extension / leg curl (seated or lying) / lat pulldown / row / chest press / shoulder press / assisted pull-up;
* Smith; sled; GHD;
* cardio machines (bike / rower / ski / treadmill).

Plus non-equipment fields that change equipment use: age, training age, pain areas, sport and season, and goal.

### 9.3 Substitution algorithm (pseudo-code, INFERRED; implements EQ-7, FV-5, GRD-2, VARI-6)

```
def fill_slot(slot, client):
    candidates = library[slot.bucket][slot.level_block]           # from lib_*.json via 05 bucket map
    candidates = [c for c in candidates if available(c, client.kit)]   # requires_any_of vs intake
    if not candidates:
        # 1. coach-native pair strings ("X or Y") mapped to this bucket
        candidates = coach_pairs(slot.bucket, client.kit)
    if not candidates:
        # 2. same pattern, lower constraint / other implement class (machine->cable->DB/KB->BW; v1: never a band, EQ-01)
        candidates = same_pattern_any_level(slot.bucket, client.kit)
        flag(slot, "level_shift")                                  # may be easier/harder than the block
    if not candidates and slot.is_machine_isolation:
        # 3. coach rule: add 2 sets to the preceding same-pattern compound
        add_sets(prev_compound(slot), 2); flag(slot, "machine_slot_absorbed"); return None
    if not candidates:
        # 4. zone-preserving substitute (athletic) or nearest pattern (resistance)
        candidates = zone_substitute(slot.zone, client.kit) or nearest_pattern(slot.bucket, client.kit)
        flag(slot, "pattern_gap" if not same_pattern else "zone_shift")
    score each candidate:
        + coach preference (EQ-8, 'LOVE IT' machines, coach-native pairs)
        - |constraint - preset_band(slot, client)|                 # EQ-2 / GRD-3
        + lengthened-bias bonus for isolation (ROM-2)
        - skill penalty if skill_demand=high and client.level < required
        - pain penalty if exercise loads a flagged region with a fixed grip / bilateral (EQ-5)
        + continuity bonus if same exercise as the previous block (VARI-1/2) unless block boundary rule says change
    return argmax(score)
```

### 9.4 Population presets: the equipment and variable choices in one table

| Preset | Equipment mix (target) | Velocity / zone work | ROM | Tempo | Volume progression | Variation |
|---|---|---|---|---|---|---|
| **Athlete (off/pre-season)** | Athletic + main lifts free (constraint 1-2); machines only as finishers (≤ 5 % of items); medball per EQ-06 (v1; FV-6 superseded); Olympic-lift work for everyone in athletic training (ATH-10) | all 5 zones; fast → slow order; contrast stations for advanced | full + 1 joint-angle-specific lift/week (ROM-4) | natural/fast eccentric on power work; controlled on strength | readiness-gated; athletic contacts per 03 | skill anchors frozen; zone-constant implement rotation (VARI-5) |
| **Athlete (in-season)** | as above, lower volume | maintain speed-strength / reactive; low volume | full | same | sets frozen (OBSERVED BASEBALL Block 3) | none |
| **Hypertrophy / aesthetics** | 1-2 free-weight lead lifts; 45-65 % of hard sets at constraint ≥ 3 | intent cue only | full + lengthened bias; lengthened partials for advanced | 2-3 s eccentric | +1-2 sets/muscle/week, readiness-gated (VOL-3) | block-fixed; 2-3 exercises/muscle/week |
| **Strength** | competition lifts free; accessories machines/DB | accelerative + strength-speed with straight weight (v1: no AR, EQ-12) | full; ROM-specific partials as accessory | controlled ecc; max intent | load-led (+2-10 %), sets +5 % (03 §9.6) | anchors frozen 8-12 weeks |
| **Beginner (healthy)** | mixed; machine → free transition at a block boundary is safe [S5] | intent cue; jumps only after a landing block | full | 2-3 s eccentric | start near MEV; +1 set when easy | minimal change; one reference removed per block |
| **Older adult** | frail: machines 70-90 %; high-functioning: v1 machines / cables by default (COACH-ANSWER EQ-03); free-weight main lifts only as a PROPOSED - PENDING COACH APPROVAL option [S12] (10_equipment_model CR-11); few plyos unless asked (ATH-09) | fast concentric at 40-60 % 1RM on machines [S12][S41] | full, pain-free | controlled ecc | 2-3 sets/exercise; no failure | minimal |
| **Pain / injury** | +1-2 constraint on the region; split grips; unilateral (athletes) | avoid ballistic in the region | pain-free partial → full | slow eccentric allowed | hold volume until no pain | swap only via EQ-5 |
| **No-gym (P1/P2)** | v1: no bands (EQ-01/EQ-02) - DB/KB, BW progressions, DB unilateral, household loads; buy list = the coach's ideal home kit | KB swing / DB jumps / BW jumps; no throws without a medball (plyo push-ups or the no-ball fake slam instead, EQ-07) | full; long length | TEMPO-3 intensifiers | sets + reps progress; load only when DBs allow | same as goal family |
| **Fat loss / bootcamp** | constraint 2-3; circuits with any equipment | intervals; low-skill power (KB swing, jumps) | full | controlled | v1: weekly sets +3, 5 or 7 % chosen by the person's state, not by exercise or muscle size (VOL-05); isolation reps rise | timed circuits, 5-7 stations, 3-5 rounds × 30-50 s, 35-45 min (PRG-03) |

---

## 10. Contradictions and flags (coach vs science, and inside the sheets)

| # | Issue | Coach (OBSERVED / COACH-CHAT) | Science | Generator decision |
|---|---|---|---|---|
| F1 | Chains and speed | '*INTENSIONALLY SLOW YOU DOWN' (SQ!A40) | At matched total load, chains raised concentric velocity by about 10 % [S97] | v1 CLOSED: chains are out of scope (COACH-ANSWER EQ-12). For the later variable-resistance work: describe chains as "top-heavy loading to keep you pushing", ≥ 80 % total (AR-3). |
| F2 | Light barbell = less recruitment | 'LIGHT BARBELL ' → 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (SQ!A47:A48) | True short of failure; near failure, light loads grow muscle equally [S19] | Use light-fast work for speed (FV-4) and light-near-failure work for home hypertrophy (TEMPO-3). |
| F3 | Medball 8-10 lb for "upper body passes/rotations" | COACH-CHAT | Rotational and chest passes are fastest at about 2-3.6 kg (4.4-8 lb) [S49][S54]; overhead and backward throws are fine at 2.7-5.5 kg [S50] | v1 CLOSED by COACH-ANSWER EQ-06 (RIGHT): passes/rotations 8-10 lb, overhead 6-10, sit-up 6-8, slams 10-20, never over 20 lb; lighter for youth and older; no sex-based default (ATH-09). |
| F4 | French contrast "immediately" | SQ!I18 | PAPE peaks about 6-10 min after a heavy set [S61]; FCT works chronically anyway [S60] | Keep "immediately" within the complex; 3-5 min between rounds; note the optional 6-10 min for acute testing. |
| F5 | Machines = beginners? | COACH-CHAT says machines for injured, older and volume clients; the library puts leg machines at MODERATE/ADVANCED and upper-body machines at FOUNDATIONAL | Training status does not moderate machine vs free weight [S1]; NSCA: machines for frail and novice older adults [S12]; SFR [S14] | Two roles: ON-RAMP (upper-body assisted, frail/older) and VOLUME TOOL (leg machines, trained). Tag both. |
| F6 | Horizontal before vertical | 100 % of BYOP sessions; broken in FAT BURN, 4 TRACKS AESTHETICS, BOXING (audit R1/R2); RP and Sheet23 list vertical first | No direct study; order between bench and shoulder press is roughly neutral [S90] | `house_rule`; default H → V; priority override (ORD-2). |
| F7 | 'Elevated' meaning | 'Elevated' = green (RP!A82) vs 'Elevated Push ups (for full ROM)' (AD99) | ROM effect depends on the exercise | Store `rom_effect` per exercise (ROM-6). |
| F8 | Volume step size | COACH-CHAT 20 → 22 chest sets in one week (+10 %) | Tested progressions include +2-3 sets/week [S79], +20 % [S78], RP +1 to +3 [S22] | v1 CLOSED by COACH-ANSWER VOL-04/VOL-05/UNI-05: +3, 5 or 7 % of weekly sets, chosen by the person's state (not muscle size), coach-adjustable; 10 % a week is 'way too much'. Owner: `03_volume_dosing`. |
| F9 | Weekly implement rotation vs "don't confuse" | BASEBALL rotates the 'bkd' implement weekly (162/234 slot changes) vs COACH-CHAT "keep the same over the block" | Random variation does not hurt growth [S82]; excessive variation may hurt strength [S83] | VARI-5: rotate within the zone for athletic accessories only; skill anchors frozen. |
| F10 | Power in older adults | — (Davidson's view, per episode notes: explosive drills do little in older adults [S31]) | Light-load power training raises V0 and early RFD in older adults [S41]; NSCA recommends 40-60 % 1RM power work [S12] | Follow the NSCA (FV-9). |
| F11 | 'NO ACCESS' tabs not equipment-filtered | OBSERVED: same gym dropdowns, plus 'Leg extensions' prefilled (NO ACCESS - ATHLETIC!E12) | — | Filter only from intake (section 9.2); never infer equipment from the template name. |
| F12 | VERTICAL PUSH FOUNDATIONAL contains push press and jerks (AA11:AA14) while the RP traffic light marks standing presses red (E13:E15) | internal inconsistency | Ballistic overhead lifts are skill-heavy, strength-speed work [S42] | v1 CLOSED by COACH-ANSWER LIB-13: push press is easier (FOUNDATIONAL, AA11/AA12); push jerk is more technical, intermediate/advanced (INTERMEDIATE, AA13/AA14). The v0 decision 'INTERMEDIATE+ for non-athletes' is retired. |
| F13 | Bands 'for SOMEBODY THAT CAN'T YIELD DOWN INTO A SQUAT CORRECTLY' (SQ!D36) | coach's indication | Not tested; band studies target power and strength in trained lifters [S95][S94] | v1 CLOSED: no bands (COACH-ANSWER EQ-01/EQ-12). A client who cannot yield into a squat gets a box squat or a constrained machine instead (INFERRED from the coach's box ladder AI9:AI13 and EQ-03). |

---

## 11. Open questions for the coach

v1: questions 1 and 8 are answered by COACH-ANSWER EQ-12 ("No variable resistance should be available in this for now"); the others were put to the coach in the questionnaire, and his answers are applied in `10_equipment_model.md` (section 7 lists them by question ID).

1. **Chains.** (answered v1: out of scope, EQ-12) Your sheet says chains "INTENSIONALLY SLOW YOU DOWN". A study found chains made the bar about 10 % *faster* at the same total weight, because the bottom gets lighter. Do you mean "they keep you pushing hard all the way to the top"? Is ~70 % bar weight plus chains, or ~70 % total?
2. **Medball weight by throw.** (answered v1: EQ-06 numbers; no sex-based rule, ATH-09) Is 8-10 lb your number for every throw, or mainly for overhead and sit-up throws? Would you use 6 lb for rotational scoop tosses and chest passes, for women, and for youth?
3. **Week-to-week sets.** (answered v1: VOL-04, VOL-05, VOL-07, UNI-05 - 3/5/7 % of weekly sets by the person's state; added sets go to the first exercise first) In your example chest goes from 20 to 22 sets in one week. Is +2 sets per week your normal step for a priority muscle, or +2 sets every 2-3 weeks (what the sheets show)?
4. **How long is a "block"?** (answered v1: PER-02 4-6 weeks; plan shapes PER-01) 4 weeks? 6? Does a 12-week plan have 2 or 3 blocks?
5. **Which variables do you change first between blocks?** (answered v1: PER-02 - one or two of grip, stance, implement, ROM or rep range, never all at once) Implement, stance, load position, ROM, tempo, or end-range behaviour?
6. **Athletes' weekly implement rotation** (BASEBALL 'bkd'). Is that deliberate (same speed zone, new implement), or just variety?
7. **Horizontal before vertical.** (answered v1: ORD-01 row before pulldown always; ORD-02 the main lift goes first whatever its direction) Is this a rule for every client, or only when both vectors fall on the same day? Should a client whose priority is the overhead press start with it?
8. **Weight releasers / eccentric overload.** (answered v1: releasers out, EQ-12; loaded jumps 10-20 % of body weight, EQ-15) Would you use DB-release jumps (about 20 % of body weight) as your 'DB Depth drop dbs Jump' standard, and keep barbell weight releasers out of the generator?
9. **Older adults and jumping.** (partly answered v1: ATH-09 few plyos for older clients unless they ask; EQ-03 machines; the 40-60 % fast-concentric machine work stays a SCIENCE proposal) Would you put fast-concentric machine work (40-60 %) into older clients' plans before any jumps or throws?
10. **Hack squat.** (answered v1: EQ-11 - use it if it feels good; machines are not ranked) If a client's gym has only a hack squat (no leg press or pendulum), should the generator use it, or prefer a free-weight squat plus extra sets?

---

## 12. Sources

Key: **P** = opened directly (full text or abstract page); **S** = numbers taken from a search-engine summary or a secondary write-up (verify before quoting to clients).

**Machines, free weights, stability, safety, populations**
* [S1] P · Haugen ME, Vårvik FT, Larsen S, Haugen AS, van den Tillaar R, Bjørnsen T. Effect of free-weight vs. machine-based strength training on maximal strength, hypertrophy and jump performance – a systematic review and meta-analysis. *BMC Sports Sci Med Rehabil* 2023;15:103. https://pmc.ncbi.nlm.nih.gov/articles/PMC10426227/ · commentary (Milo Wolf, Stronger by Science 2023): https://www.strongerbyscience.com/free-weights-vs-machines/
* [S3] S · Heidel KA, Novak ZJ, Dankel SJ. Machines and free weight exercises: a systematic review and meta-analysis comparing changes in muscle size, strength, and power. *J Sports Med Phys Fitness* 2022. Secondary summary: https://biolayne.com/reps/issue-16/free-weights-vs-machines-for-muscle-gains/
* [S4] P · Schwanbeck SR, Cornish SM, Barss T, Chilibeck PD. Effects of training with free weights versus machines on muscle mass, strength, free testosterone, and free cortisol levels. *J Strength Cond Res* 2020;34(7):1851-1859. https://harvest.usask.ca/items/fe452b3a-7019-4483-9314-6ab0d4b8abb9
* [S5] P · Aerenhouts D, D'Hondt E. Using machines or free weights for resistance training in novice males? A randomized parallel trial. *Int J Environ Res Public Health* 2020;17:7848. https://mdpi-res.com/d_attachment/ijerph/ijerph-17-07848/article_deploy/ijerph-17-07848.pdf
* [S6] P · Cotterman ML, Darby LA, Skelly WA. Comparison of muscle force production using the Smith machine and free weights for bench press and squat exercises. *J Strength Cond Res* 2005. https://pubmed.ncbi.nlm.nih.gov/15705030/
* [S7] S · Saeterbakken AH, van den Tillaar R, Fimland MS. A comparison of muscle activity and 1-RM strength of three chest-press exercises with different stability requirements. *J Sports Sci* 2011;29:533-538. https://app.cristin.no/results/show.jsf?id=741530
* [S8] P · Schwanbeck S, Chilibeck PD, Binsted G. A comparison of free weight squat to Smith machine squat using electromyography. *J Strength Cond Res* 2009. https://www.bisp-surf.de/Record/PU201102001039
* [S9] P · Behm D, Colado JC. The effectiveness of resistance training using unstable surfaces and devices for rehabilitation. *Int J Sports Phys Ther* 2012;7(2):226-241. https://pmc.ncbi.nlm.nih.gov/articles/PMC3325639
* [S10] S · Behm DG, Drinkwater EJ, Willardson JM, Cowley PM. Canadian Society for Exercise Physiology position stand: the use of instability to train the core in athletic and nonathletic conditioning. 2010. https://csep.ca/wp-content/uploads/2021/08/CSEP-Position-Instability-Training-Intro-E.pdf
* [S11] P · Kerr ZY, Collins CL, Comstock RD. Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007. *Am J Sports Med* 2010. https://pubmed.ncbi.nlm.nih.gov/20139328/
* [S12] P · Fragala MS, Cadore EL, Dorgo S, et al. Resistance training for older adults: position statement from the National Strength and Conditioning Association. *J Strength Cond Res* 2019. https://pubmed.ncbi.nlm.nih.gov/31343601/ · summary: https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html
* [S14] P · Kotikangas J, Walker S, Häkkinen K, Peltonen H. Acute neuromuscular fatigue, hormonal responses, and recovery in males during high-volume resistance exercises: Smith machine back squat vs horizontal leg press. *Eur J Appl Physiol* 2025. https://jyx.jyu.fi/jyx/Record/jyx_123456789_101860
* [S15] P · Rutherford OM, Jones DA. The role of learning and coordination in strength training. *Eur J Appl Physiol* 1986. https://coachsci.sdsu.edu/csa/vol21/rutherfo.htm
* [S16] P · Lopes et al. Effects of training with elastic resistance versus conventional resistance on muscular strength: a systematic review and meta-analysis. *SAGE Open Med* 2019. https://pmc.ncbi.nlm.nih.gov/articles/PMC6383082/
* [S17] S · Calatayud J, et al. Bench press and push-up at comparable levels of muscle activity results in similar strength gains. *J Strength Cond Res* 2015;29(1):246-253. https://producciocientifica.uv.es/documentos/5ef106d0299952068d595025
* [S18] S · Kikuchi N, Nakazato K. Low-load bench press and push-up induce similar muscle hypertrophy and strength gain. *J Exerc Sci Fit* 2017. https://pubmed.ncbi.nlm.nih.gov/29541130/
* [S19] S · Lopez P, et al. Resistance training load effects on muscle hypertrophy and strength gain: systematic review and network meta-analysis. *Med Sci Sports Exerc* 2021;53(6):1206-1216. https://jyx.jyu.fi/handle/123456789/75929
* [S20] S · Refalo MC, Helms ER, Trexler ET, Hamilton DL, Fyfe JJ. Influence of resistance training proximity-to-failure on skeletal muscle hypertrophy: a systematic review with meta-analysis. *Sports Med* 2023. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9935748/
* [S21] S · Robinson ZP, Pelland JC, Remmert JF, et al. Exploring the dose-response relationship between estimated resistance training proximity to failure, strength gain, and muscle hypertrophy: a series of meta-regressions. *Sports Med* 2024. https://sportrxiv.org/index.php/server/preprint/view/295
* [S22] P · Renaissance Periodization. Training volume landmarks for muscle growth (2017). https://rpstrength.com/training-volume-landmarks-muscle-growth/
* [S23] S · Renaissance Periodization. Chest training guide (exercise categories, sessions, volume). https://rpstrength.com/chest-training-tips-hypertrophy/
* [S24] S · Stimulus-to-fatigue ratio (Israetel/RP concept), explainer: https://outlift.com/stimulus-to-fatigue-ratio/ · https://www.boxrox.com/?p=196491
* [S25] S · Israetel exercise-switching signals (pump/tension, fatigue/joint cost, stalled progress), via BOXROX: https://www.boxrox.com/when-to-switch-exercises-for-maximum-muscle-growth/
* [S102] S · Speirs DE, et al. Unilateral vs. bilateral squat training for strength, sprints, and agility in academy rugby players. *J Strength Cond Res* 2016;30(2):386-392. https://lida.sport-iat.de/ta/Record/4038741
* [S103] S · Green C, Comfort P. The affect of grip width on bench press performance and risk of injury. *Strength Cond J* 2007;29(5):10-14. https://salford-repository.worktribe.com/output/1804489/the-affect-of-grip-width-on-bench-press-performance-and-risk-of-injury

**Pat Davidson (practitioner; paraphrased)**
* [S26] P · Nosak R. 3 principles for improving general population movement (TeamBuildr, 16 Dec 2021), citing Davidson, *A Coach's Guide to Optimizing Movement: Rethinking the Big Patterns* (2020). https://blog.teambuildr.com/3-principles-for-improving-general-population-movement
* [S27] P · Just Fly Performance Podcast 318: Pat Davidson on aerial and terrestrial factors (high ground / low ground). https://just-fly-sports.com/podcast-318
* [S28] P · Just Fly Performance Podcast 227: Pat Davidson on pressure-based principles. https://www.just-fly-sports.com/podcast-227-pat-davidson/
* [S29] P · Just Fly Performance Podcast 122: Pat Davidson, movement screens, weak points, doing no harm. https://just-fly-sports.com/podcast-122-pat-davidson
* [S30] P · Just Fly Performance Podcast 88: Pat Davidson, the big lifts and primal movement. https://www.just-fly-sports.com/podcast-88-pat-davidson/
* [S31] S · Dr. Gabrielle Lyon Show ep. 110: The science of strength and conditioning, Dr. Pat Davidson (show notes / timestamps summary). https://drgabriellelyon.com/podcast_list/the-science-of-strength-and-conditioning-dr-pat-davidson/
* [S32] P · The Self Made Podcast: Training science quick-fire with Pat Davidson (25 Mar 2024; chapter notes). https://theselfmadepodcast.buzzsprout.com/1772275/episodes/14762364-training-science-quick-fire-with-pat-davidson
* [S33] P · Robertson Training Systems podcast: Pat Davidson on coaching, cuing and creating savages (13 Apr 2018). https://robertsontrainingsystems.com/blog/pat-davidson-podcast/

**Force-velocity, intent, power loads, medball, plyos, contrast**
* [S34] S · Velocity zones (Mann model): https://www.catapult.com/blog/understanding-velocity-ranges-and-zones · https://elitefts.com/news/bryan-mann-talks-velocity-based-training
* [S35] S · González-Badillo JJ, Sánchez-Medina L. Movement velocity as a measure of loading intensity in resistance training. *Int J Sports Med* 2010. https://www.thieme-connect.com/products/ejournals/pdf/10.1055/s-0030-1248333.pdf
* [S36] P · Fernandez Ortega JA, Mendoza Romero D, Sarmento H, Prieto Mondragón L. Bar load-velocity profile of full squat and bench press exercises in young recreational athletes. *IJERPH* 2022;19(11):6756. https://pmc.ncbi.nlm.nih.gov/articles/PMC9180020/
* [S37] S · Behm DG, Sale DG. Intended rather than actual movement velocity determines velocity-specific training response. *J Appl Physiol* 1993. https://coachsci.sdsu.edu/csa/vol21/behm.htm
* [S38] S · Pareja-Blanco F, et al. Maximal intended velocity training induces greater gains in bench press performance than deliberately slower half-velocity training. *Eur J Sport Sci* 2014;14(8):772-781. https://pubmed.ncbi.nlm.nih.gov/24734902/
* [S39] S · Pareja-Blanco F, et al. Effects of velocity loss during resistance training on athletic performance, strength gains and muscle adaptations. *Scand J Med Sci Sports* 2017. https://paulogentil.com/pdf/Effects%20of%20velocity%20loss%20during%20resistance%20training%20on%20athletic%20performance,%20strength%20gains%20and%20muscle%20adaptations.pdf
* [S40] S · Morrissey MC, Harman EA, Johnson MJ. Resistance training modes: specificity and effectiveness. *Med Sci Sports Exerc* 1995;27(5):648-660. https://lida.sport-iat.de/ta/Record/4007395
* [S41] P · Rodriguez-Lopez C, et al. Neuromuscular adaptations after 12 weeks of light- vs. heavy-load power-oriented resistance training in older adults. *Scand J Med Sci Sports* 2022;32(2):324-337. https://ucrisportal.univie.ac.at/en/publications/neuromuscular-adaptations-after-12-weeks-of-light-vs-heavyload-po/
* [S42] S · Cormie P, McGuigan MR, Newton RU. Developing maximal neuromuscular power: part 2 – training considerations for improving maximal power production. *Sports Med* 2011. https://ro.ecu.edu.au/ecuworks2011/85
* [S43] S · Soriano MA, Jiménez-Reyes P, Rhea MR, Marín PJ. The optimal load for maximal power production during lower-body resistance exercises: a meta-analysis. *Sports Med* 2015;45(8):1191-1205. https://link.springer.com/article/10.1007/s40279-015-0467-8
* [S44] S · Cormie P, McCaulley GO, McBride JM. Power versus strength-power jump squat training: influence on the load-power relationship. *Med Sci Sports Exerc* 2007. https://people.stfx.ca:443/smackenz/Courses/HK396/Handouts/Cormie%202007%20Power%20versus%20strength-power%20jump%20squat%20training-influence%20on%20the%20load-power%20relationship.pdf
* [S45] S · Swinton PA, Stewart AD, Lloyd R, Agouris I, Keogh JWL. Effect of load positioning on the kinematics and kinetics of weighted vertical jumps. *J Strength Cond Res* 2012;26(4):906-913. https://rgu-repository.worktribe.com/output/248375/effect-of-load-positioning-on-the-kinematics-and-kinetics-of-weighted-vertical-jumps
* [S46] P · Suchomel TJ, Sole CJ. Power-time curve comparison between weightlifting derivatives. *J Sports Sci Med* 2017;16:407-413. https://jssm.org/jssm-16-407.xml-abst
* [S47] S · Lake JP, Lauder MA. Kettlebell swing training improves maximal and explosive strength. *J Strength Cond Res* 2012. https://eprints.chi.ac.uk/id/eprint/266/
* [S48] P · Marques MC, Marinho DA, van den Tillaar R. A load-velocity relationship for men and women in overhead throwing performance. *J Sports Sci Med* 2010;9(3):524-526. https://www.jssm.org/jssm-09-524.xml-Fulltext
* [S49] P · Kerr A, Sayers M. Influence of load on expressions of upper body power during medicine ball throws. *J Fitness Res* 2013;2(2):49-56. https://research.usc.edu.au/esploro/outputs/journalArticle/Influence-of-load-on-expressions-of/99447757002621
* [S50] P · Beckham GK, et al. Assessing full body impulsive ability using a range of medicine ball loads for the backward overhead medicine ball throw. *Sports Biomech* 2023;22(10):1278-1289. https://sponet.de/Record/4083922
* [S51] P · Eitner JD, Limbaugh GK, Davies GJ, Riemann B. Intrasession reliability and the relationship between the explosive bench press and medicine ball chest pass assessments of upper extremity power. *Med Sci Sports Exerc* 2012;44(5S):S354. https://digitalcommons.georgiasouthern.edu/health-kinesiology-facpubs/237
* [S52] P · Ishikawa S, Kitamura M, Otsuka M. Effect of medicine ball mass on trunk internal rotation kinetics during punch throw exercise in collegiate baseball pitchers: a pilot study. *ISBS Proceedings Archive* 2025;43(1):37. https://commons.nmu.edu/isbs/vol43/iss1/37
* [S53] P · van den Tillaar R, Marques MC. Effect of different training workload on overhead throwing performance with different weighted balls. *J Strength Cond Res* 2013;27(5):1196-1201. https://lida.sport-iat.de/ta/Record/4039017
* [S54] P · Cressey E. Random thoughts on sports performance training – installment 37 (medicine ball load for rotational power). https://ericcressey.com/random-thoughts-sports-performance-training-37/
* [S55] S · Szymanski DJ, et al. Effect of twelve weeks of medicine ball training on high school baseball players. *J Strength Cond Res* 2007. https://latech.elsevierpure.com/en/publications/effect-of-twelve-weeks-of-medicine-ball-training-on-high-school-b/
* [S56] S · Raeder C, Fernandez-Fernandez J, Ferrauti A. Effects of six weeks of medicine ball training on throwing velocity, throwing precision, and isokinetic strength of shoulder rotators in female handball players. *J Strength Cond Res* 2015;29(7):1904-1914. https://portalcientifico.unileon.es/documentos/5fa082b2299952440aaeaac0
* [S57] S · Fast vs slow SSC (Schmidtbleicher 1992 classification), summarised: https://www.scienceforsport.com/plyometric-training · UKSCA technical models: https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/plyometric-technical-models-biomechanical-principles-636806567189424439.pdf
* [S58] S · Byrne PJ, et al. A comparison of methods used to identify optimal drop height for depth-jump training (MJH vs RSI methods). 2010. https://research.setu.ie/en/publications/a-comparison-of-methods-used-to-identify-optimal-drop-height-for-/
* [S59] S · Ramirez-Campillo R, et al. Optimal reactive strength index: is it an accurate variable to optimize plyometric training effects on measures of physical fitness in young soccer players? *J Strength Cond Res* 2018. https://pure.urosario.edu.co/en/publications/optimal-reactive-strength-index-is-it-an-accurate-variable-to-opt/
* [S60] P · Zhao Z, Ma Z, Wu C, et al. The effects of French contrast training on lower limb athletic performance in healthy adults: a systematic review and meta-analysis. *Front Physiol* 2025;16:1672353. https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1672353/full
* [S61] P · Blazevich AJ, Babault N. Post-activation potentiation versus post-activation performance enhancement in humans: historical perspective, underlying mechanisms, and current issues. *Front Physiol* 2019;10:1359. https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2019.01359/full
* [S62] S · Kobal R, et al. Effects of different combinations of strength, power, and plyometric training on the physical performance of elite young soccer players. *J Strength Cond Res* 2017; summary: https://www.naseinc.com/blog/plyometrics-before-after-or-mixed-in-with-strength-work/
* [S63] P · Zhong J, Yu T, Xiao Y, Wu H. Accentuated eccentric loading in lower-body resistance training: a systematic review of acute and chronic adaptations on strength, power, and speed outcomes. *Front Physiol* 2026;16:1720205. https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1720205/full

**Range of motion**
* [S64] S · Pallarés JG, Hernández-Belmonte A, Martínez-Cava A, Vetrovsky T, Steffl M, Courel-Ibáñez J. Effects of range of motion on resistance training adaptations: a systematic review and meta-analysis. *Scand J Med Sci Sports* 2021;31(10):1866-1881. https://produccioncientifica.ugr.es/documentos/63b0d8410f8bcd1826cff374
* [S65] P · Wolf M, Androulakis-Korakakis P, Fisher J, Schoenfeld B, Steele J. Partial vs full range of motion resistance training: a systematic review and meta-analysis. *Int J Strength Cond* 2023;3(1). https://journal.iusca.org/index.php/Journal/article/view/182
* [S66] S · Pedrosa GF, Lima FV, Schoenfeld BJ, et al. Partial range of motion training elicits favorable improvements in muscular adaptations when carried out at long muscle lengths. *Eur J Sport Sci* 2022;22(8):1250-1260. https://doi.org/10.1080/17461391.2021.1927199
* [S67] S · Kassiano W, et al. Greater gastrocnemius muscle hypertrophy after partial range of motion training performed at long muscle lengths. 2023 (PubMed 37015016). https://pubmed.ncbi.nlm.nih.gov/37015016/
* [S68] S · Maeo S, et al. Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus neutral arm position. *Eur J Sport Sci* (online 2022). Summary: https://sci-sport.com/en/triceps-hypertrophy-impact-of-arm-position/
* [S69] S · Maeo S, et al. Greater hamstrings muscle hypertrophy but similar damage protection after training at long versus short muscle lengths. *Med Sci Sports Exerc* 2021. https://pubmed.ncbi.nlm.nih.gov/33009197/
* [S70] S · Kubo K, Ikebukuro T, Yata H. Effects of squat training with different depths on lower limb muscle volumes. *Eur J Appl Physiol* 2019. Summary: https://biolayne.com/reps/issue-3/deeper-squats-for-bigger-butts/
* [S71] S · Rhea MR, et al. Joint-angle specific strength adaptations influence improvements in power in highly trained athletes. *Human Movement* 2016;17(1):43-49. https://hummov.awf.wroc.pl/Joint-angle-specific-strength-adaptations-influence-improvements-in-power-in-highly,183245,0,2.html

**Volume and progression**
* [S72] S · Baz-Valle E, Fontes-Villalba M, Santos-Concejero J. Total number of sets as a training volume quantification method for muscle hypertrophy: a systematic review. *J Strength Cond Res* 2021;35(3):870-878. https://research.science.eus/documentos/60cd2a75ad242a605acfaaec
* [S73] S · Scott BR, Duthie GM, Thornton HR, Dascombe BJ. Training monitoring for resistance exercise: theory and applications. *Sports Med* 2016. https://vu-9.eprints-hosting.org/32754/1/Monitor%20Strength%20Review.pdf
* [S74] S · Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass: a systematic review and meta-analysis. *J Sports Sci* 2017. https://paulogentil.com/pdf/Dose-response%20relationship%20between%20weekly%20resistance%20training%20volume%20and%20increases%20in%20muscle%20mass%20-%20A%20systematic%20review%20and%20metaanalysis.pdf
* [S75] S · Schoenfeld BJ, et al. Resistance training volume enhances muscle hypertrophy but not strength in trained men. *Med Sci Sports Exerc* 2019;51(1):94-103. https://pubmed.ncbi.nlm.nih.gov/30153194/
* [S76] P · Pelland JC, Remmert JF, Robinson ZP, Hinson SR, Zourdos MC. The resistance training dose response: meta-regressions exploring the effects of weekly volume and frequency on muscle hypertrophy and strength gains. *Sports Med* 2026;56(2):481-505. https://sponet.de/sponet/Record/4097139 · per-session thresholds (secondary): https://train.fitness/personal-trainer-blogs/not-all-sets-are-created-equal
* [S77] S · Aube D, et al. Progressive resistance training volume: effects on muscle thickness, mass, and strength adaptations in resistance-trained individuals. *J Strength Cond Res* 2022. https://pubmed.ncbi.nlm.nih.gov/32058362/
* [S78] S · Scarpelli MC, et al. Muscle hypertrophy response is affected by previous resistance training volume in trained individuals. *J Strength Cond Res* 2022;36(4):1153-1157. https://pubmed.ncbi.nlm.nih.gov/32108724/
* [S79] S · Enes A, De Souza EO, Souza-Junior TP. Effects of different weekly set progressions on muscular adaptations in trained males: is there a dose-response effect? *Med Sci Sports Exerc* 2023/2024. Summary: https://www.fisiologiadelejercicio.com/efectos-de-diferentes-progresiones-en-el-aumento-de-series-semanales-en-entrenamiento-de-fuerza/
* [S80] P · American College of Sports Medicine. Progression models in resistance training for healthy adults (position stand). *Med Sci Sports Exerc* 2009;41(3):687-708. Summary PDF: https://www.sportgeneeskunde.com/wp-content/uploads/ACSM-Position-Stand-Progression-Models-in-Resistance-Training-for-Healthy-Adults.pdf

**Exercise variation**
* [S81] S · Fonseca RM, et al. Changes in exercises are more effective than in loading schemes to improve muscle strength. *J Strength Cond Res* 2014. https://paulogentil.com/pdf/Changes%20in%20exercises%20are%20more%20effective%20than%20in%20loading%20schemes%20to%20improve%20muscle%20strength.pdf · summary: https://www.naseinc.com/blog/exercise-variation-for-strength-and-hypertrophy/
* [S82] S · Baz-Valle E, Schoenfeld BJ, Torres-Unda J, Santos-Concejero J, Balsalobre-Fernández C. The effects of exercise variation in muscle thickness, maximal strength and motivation in resistance trained men. *PLoS One* 2019. https://pmc.ncbi.nlm.nih.gov/articles/PMC6934277
* [S83] S · Kassiano W, et al. Does varying resistance exercises promote superior muscle hypertrophy and strength gains? A systematic review. *J Strength Cond Res* 2022;36(6):1753-1762. https://lida.sport-iat.de/ta/Record/4077216
* [S84] P · Kassiano W, et al. Muscle hypertrophy and strength adaptations to systematically varying resistance exercises. *Res Q Exerc Sport* 2025;96(2):371-381. https://ro.ecu.edu.au/ecuworks2022-2026/4912
* [S85] S · Damas F, et al. Resistance training-induced changes in integrated myofibrillar protein synthesis are related to hypertrophy only after attenuation of muscle damage. *J Physiol* 2016. https://pubmed.ncbi.nlm.nih.gov/27219125/
* [S86] S · McHugh MP. Recent advances in the understanding of the repeated bout effect. *Scand J Med Sci Sports* 2003;13:88-97 (via search summary). Related review: https://lida.sport-iat.de/ta/Record/4030153

**Exercise order**
* [S87] S · Simão R, de Salles BF, Figueiredo T, Dias I, Willardson JM. Exercise order in resistance training. *Sports Med* 2012. https://read.qxmd.com/read/22292516/exercise-order-in-resistance-training
* [S88] P · Simão R, et al. Influence of exercise order on maximum strength and muscle thickness in untrained men. *J Sports Sci Med* 2010;9(1):1-7. https://www.jssm.org/jssm-09-1.xml-Fulltext
* [S89] S · Nunes JP, Grgic J, Cunha PM, Ribeiro AS, Schoenfeld BJ, de Salles BF, Cyrino ES. Systematic review and meta-analysis of resistance-exercise order effects on strength and hypertrophy. *Eur J Sport Sci* 2021;21(2):149-157. https://lida.sport-iat.de/ta/Record/4059795
* [S90] P · Miranda H, Figueiredo T, Rodrigues B, Paz GA, Simão R. Influence of exercise order on repetition performance among all possible combinations on resistance training. *Res Sports Med* 2013;21(4):355-366. https://lida.sport-iat.de/ta/Record/4029619
* [S91] P · Kravitz L. Exercise order in resistance training (summary of Sforzo & Touey 1996; Augustsson 2003; Gentil 2007; Simão 2005/2010/2012). https://www.unm.edu/~lkravitz/Article%20folder/ExerciseOrderinRT.html
* [S92] S · Paz GA, et al. Volume load and neuromuscular fatigue during an acute bout of agonist-antagonist paired-set vs. traditional-set training. *J Strength Cond Res* 2017. https://www.bisp-surf.de/Record/PU201802001421

**Accommodating resistance and tempo**
* [S93] S · Soria-Gila MA, et al. Effects of variable resistance training on maximal strength: a meta-analysis. *J Strength Cond Res* 2015;29(11):3260-3270. https://sponet.de/sponet/Record/4037903?lng=en
* [S94] P · Lin Y, Xu Y, Hong F, Li J, Ye W, Korivi M. Effects of variable-resistance training versus constant-resistance training on maximum strength: a systematic review and meta-analysis. *IJERPH* 2022;19(14):8559. https://pmc.ncbi.nlm.nih.gov/articles/PMC9317775
* [S95] S · Rhea MR, Kenn JG, Dermody BM. Alterations in speed of squat movement and the use of accommodated resistance among college athletes training for power. *J Strength Cond Res* 2009;23(9):2645-2650. https://www.bisp-surf.de/Record/PU201102001047
* [S96] S · Wallace BJ, Winchester JB, McGuigan MR. Effects of elastic bands on force and power characteristics during the back squat exercise. *J Strength Cond Res* 2006;20(2):268-272. https://ro.ecu.edu.au/ecuworks/1961
* [S97] S · Baker DG, Newton RU. Effect of kinetically altering a repetition via the use of chain resistance on velocity during the bench press. *J Strength Cond Res* 2009;23(7):1941-1946. https://ro.ecu.edu.au/ecuworks/116/
* [S98] P · Wilk M, Golas A, Krzysztofik M, Nawrocka M, Zajac A. The effects of eccentric cadence on power and velocity of the bar during the concentric phase of the bench press movement. *J Sports Sci Med* 2019;18:191-197. https://jssm.org/jssm-18-191.xml-abst
* [S99] P · Wilk M, Zajac A, Tufano JJ. The influence of movement tempo during resistance training on muscular strength and hypertrophy responses: a review. *Sports Med* 2021;51(8):1629-1650. https://pmc.ncbi.nlm.nih.gov/articles/PMC8310485/
* [S100] S · Schoenfeld BJ, Ogborn DI, Krieger JW. Effect of repetition duration during resistance training on muscle hypertrophy: a systematic review and meta-analysis. *Sports Med* 2015. https://pubmed.ncbi.nlm.nih.gov/25601394/
* [S101] S · Westside Barbell, dynamic-effort method (practitioner). https://www.westside-barbell.com/a/blog/introducing-dynamic-effort-beginners
* [S104] S · Science for Sport. The downside of band-assisted jumps (practitioner). https://www.scienceforsport.com/the-downside-of-band-assisted-jumps/

**Coach data cited in this file** (all OBSERVED, re-read from `dumps/` for this file):
* MASTER_MODEL 'ALL ABOUT SQUATS': A3, A5, A10:H11, B27, D13, E28, I18, A35:D41, G35:I41, A44:A48.
* '(NOT DONE) RESISTANCE PATTERNS ': E7:E15, C18:C26, I16, I22:I28, A12, C30, A40, A41, G61, G62, G64, G68, G69, G77, A81:A94, G82:G83.
* '(NOT DONE) ALL ABOUT BALLISTICS': A22:D24, C40, A53:B53.
* '(NOT DONE) 4 TRACKS PROGRAMMING': D17, N17, O17, W42:Z42.
* BASEBALL: BU33, CI33, DH51, I51, I52.
* 'EXAMPLE ATHLETIC FULL BODY SPLI': A6, C14, C16, K13.
* 'EXAMPLE UPPER/LOWER SPLIT': A7, C13, C17, C28:C31.
* BYOP 'NO ACCESS - ATHLETIC - FB - 4 t': C3:E12.
* BYOP 'JUSTICE LEAGUE': C3:E12.

Counts quoted from the team's decode files (`prog_mm_equipment`, `prog_byop_equipment`, `lib_*`, `reference_variables`, `ordering_audit`) are cited as "OBSERVED digest" and were not re-counted here.

## v1 verification log

**Date 2026-10-08.** Adversarial check of the v1 band / variable-resistance edit against `coach_answers_full.md`, plus a grep of this whole file for the ideas the coach's answers retired. Full log, with the answer-by-answer table: `10_equipment_model.md`, section 'v1 verification log'.

- **Band / chain / releaser passages (the v1 scope): OK.** Every mention sits under the section 8 OUT OF SCOPE banner, is a suspended AR rule, a closed flag (F1, F13), an answered question (1, 8), a reference-only finding, or a v1 replacement note. One generator-directed sentence in 8.2 ('The generator should label banded 50-60 % work ...') was reworded to apply only if variable resistance is reopened.
- **Rules retired by other answers that were still written inline as live rules** (the v1 header listed them, the body did not mark them). Inline RETIRED / SUPERSEDED / v1 markers added at: section 0 row 5 ('female' clients; EQ-06, ATH-09); 1.2 'keep his ranking' and EQ-8 machine ranking (EQ-11); EQ-2 older high-functioning row (EQ-03; free weights only as a PROPOSED option, as `10_equipment_model` CR-11); 3.7 item 1 and FV-6 medball weights and the female -2 lb modifier (EQ-06, ATH-09); 5.2 items 2-3, VOL-1, VOL-3, VOL-4 (0.5 synergist credit, 3/5/7 % size tiers, rotate-the-extra-set rule; VOL-09, VOL-05, VOL-07, UNI-05); VARI-1 block arithmetic (PER-01); ORD-1 'core finisher', ORD-7 core placement by family (ATH-11) and ORD-4 supersets (ORD-05); 9.1 load-laterality ladder (CAT-13); 9.4 athlete, older-adult and fat-loss rows; flags F3, F8, F12 (EQ-06, VOL-04/05, LIB-13); open questions 2-5, 7, 9, 10 tagged with the answers that closed them.
- **Left as is:** research findings and study populations (e.g. 'significant in women' in [S6]); 'JUSTICE LEAGUE' appears only as a cell citation (the program is called 'All-around athletic / weekend warrior' in the generator, ATH-13 / FIX-03).
