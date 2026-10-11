# Blaze Camp Model Review

**Foundation review and upgrade blueprint | Updated 10 October 2026 | Sections 1-6: approximately 15 minutes; technical appendices optional**

## Overall Assessment

**Keep the foundation. Blaze Camp is a substantial, coherent coaching model, not merely an exercise list with a progression formula.** Its strongest contribution is the integration of movement classification, muscle accounting, equipment constraints, athletic qualities, sport context, session construction, and traceable coaching decisions. That combination is more useful for explaining and reproducing a coach's reasoning than a typical exercise database or standalone workout template.

The evidence supports much of its underlying training philosophy. It does **not** establish that the complete model outperforms competing systems, but neither does the absence of a trial of its exact percentages make those percentages bad coaching. A complete system necessarily contains practical conventions. The important tests are whether they have defensible purposes, fit the intended population, remain internally consistent, and allow sensible exceptions.

**The central development task is calibration and clarification, not wholesale redesign:** separate growth optimization from minimum useful training; reconcile competing priorities; keep distinct dose units distinct; and make the boundary between a physiological principle and a Blaze coaching preference explicit. The long-term ambition should be broad usefulness through well-defined contexts, not one universally optimal prescription.

**Scope.** The canonical foundation reviewed is [commit c13cbaa](https://github.com/Blazecamp/blaze-camp-model/tree/c13cbaa38317ab58c0e6e44d4c41ed858991f592): [CODEX_BRIEF](../CODEX_BRIEF.md), [BRAIN v1.2](../BLAZE_CAMP_BRAIN.md), [generator specification](../generator_spec_v1.json), and `synthesis/`. This update also reviews the newer README and documentation at [commit 3c373fa](https://github.com/Blazecamp/blaze-camp-model/tree/3c373faa1bed945549da5191e5e811e27362f581), including its 48 decision records and parameter reference; the canonical model and coach-answer files are unchanged between these revisions. Authority remains [round 3](../coach_answers_round3.md) > [round 2](../coach_answers_round2.md) > [full answers](../coach_answers_full.md) > [chat statements](../coach_chat_statements.md). `engine/`, `model/`, `tests/`, `samples/`, `tools/`, and `design/` were excluded. No model files were changed. This is a foundation proposal, not an app specification or implementation audit.

**Evidence standard.** This is a critical narrative review, not a registered systematic review. Strong/moderate/limited confidence below is a reviewer judgment about a specified claim, not formal GRADE scoring. Research, expert practice, and bookkeeping conventions are distinguished. Commercial documentation demonstrates what a system does, not that it works better. Abstract-only evidence is identified in Appendix A. Every proposed change contrary to an authoritative answer is **for discussion with the coach**, never silently treated as a model error.

**New in this update:** [E: mathematical contract and worked conflicts](#appendix-e-mathematical-upgrade-blueprint), [F: precise library and coverage upgrades](#appendix-f-library-and-coverage-upgrades), and [G: benchmarks and publication gates](#appendix-g-validation-and-publication). These define what "better" would mean and how to demonstrate it. A mathematically optimal allocation is not automatically a biologically optimal program.

## 1. The Model in My Own Words

Blaze is a grammar for turning a person's goal, capacity, equipment, and sporting context into a complete training plan. It describes exercises through multiple simultaneous lenses, then applies the coach's rules to their selection, dose, pairing, and progression. The planned block is visible in advance; people and coaches adjust it themselves. **No check-ins, automated adaptation, or stored personal data are required.** That is an intentional boundary, not a scientific deficiency.

Its principal families are athletic patterns, resistance patterns, and control/core, extended by conditioning, functional work, and preparation/testing. Resistance distinguishes knee/hip dominance, bilateral/unilateral work, separate knee flexion, horizontal/vertical pushing and pulling, mid-range pushing, and small-muscle accessories; mid-range pulling remains an unresolved taxonomy question. Core describes thorax, pelvis, or both, across planes and static/dynamic actions. Athletic work includes explosive extension, Olympic derivatives, landings, jumps, throws, acceleration, maximum velocity, COD, and proposed reactive-agility entries.

The taxonomy has 47 facets, including plane, stance, grip, load position, contralateral/ipsilateral loading, ROM, end-range behavior, support/constraint, and intended quality. **Exercise skill level and client volume level are separate.** Levels are soft selection guides, not a rule that advanced clients must do complicated exercises. The five-point constraint scale and Davidson rotation zones add practical selection lenses. Equipment is represented as alternative sets of required implements, richer than a single equipment label. The catalog's 939 source records include 633 typed exercises plus drills, complexes, prescriptions, modifiers, and historical entries; 31 records are proposed. Presence in the catalog does not imply approval as a default. [Taxonomy](../synthesis/01_taxonomy.md), [catalog](../synthesis/02_exercise_catalog.md)

Resistance dosing uses hard sets, generally 1-3 RIR, with goal-specific rep/rest prescriptions. Main movers usually receive 1.0 muscle-set credit and helpers 0.25; dips, thrusters, glute-focused work, and other cases have explicit exceptions. Completing both sides of unilateral work counts once per relevant muscle. Athletic work has separate units and zero resistance-set credit. Hips and shoulders are aggregate planning groups, not claims that their constituent muscles are interchangeable. Typical big-muscle starts are 10/15/20 sets for L1/L2/L3, with ceilings 14/22/25, modified by goal, season, pain, maintenance, and up to two Focus choices. [Volume model](../synthesis/12_volume_algorithm_v1.md)

The stairway combines approximately 3% early and 5% later weekly set increases, scaled and rounded into whole sets, with effort drifting from three toward one RIR. The model retains exercises for roughly 4-6-week exercise blocks inside longer plans. It includes 8-/12-week training plans, maintenance, annual organization, event preparation, and seasonal plans. Recovery between blocks is recommended rather than mandatory; there is no automatic in-block deload.

Sessions generally progress through warm-up, a **light** core primer, athletic/power work, strength, accessories, and conditioning. Hip + push and knee + pull are characteristic pairings. Counted heavy squat and hinge exposures occur on different days, ordinarily once each weekly. The model includes 127 profiles routing 52 sports and 26 activities, plus position/event, season, age, and practice overlays. Those are structured coaching profiles, not 127 independently tested interventions. [Sessions](../synthesis/05_session_architecture.md), [profiles](../synthesis/04_athlete_profiles.md), [periodization](../synthesis/06_periodization.md)

Importantly, the model already contains speed/form termination rules, landing-competence gates, a lifting-skill ladder, lighter-ball adjustments, double progression, pain alternatives, and printed self-adjustment guidance. Some details are inferred rather than approved. Its full tuning surface spans 25 training-variable families, dosing and scheduling policies, equipment/space, profile/context inputs, and coach overrides; Appendix D maps these without proposing more user questions. [Training variables, especially sections 3.5 and 6](../synthesis/11_training_variables.md)

## 2. What Is Strong

**The resistance-training foundation is credible.** Purposeful effort, multiple sets, progression, and goal-specific loading align with the [2026 ACSM position stand](https://pubmed.ncbi.nlm.nih.gov/41843416/). The [IUSCA hypertrophy stand](https://journal.iusca.org/index.php/Journal/article/download/81/140/) specifically treats approximately ten weekly sets as a reasonable starting point for optimizing hypertrophy, while acknowledging useful responses below it. Higher-volume physique programming is therefore defensible. The issue is its application, not that ten or twenty sets are inherently excessive.

**The stairway has a legitimate rationale and precedent.** Gradual accumulation lets a coach organize exposure and effort over time. IUSCA discusses cautious volume increases; [RP explicitly describes planned set and RIR progressions](https://rpstrength.com/blogs/articles/progressing-for-hypertrophy), and [Volt uses stable movements with weekly volume increases](https://help.voltathletics.com/how-do-i-set-up-the-training-calendar). A [2025 RIR-ramp trial](https://link.springer.com/article/10.1007/s42978-025-00338-8) found no clear difference in gains versus constant one-RIR training, with lower perceived exertion in the ramp group. This supports the approach, not the exact combined Blaze curve.

**Fractional muscle accounting is a real strength.** Recognizing that compound work also trains assisting muscles is preferable to pretending every exercise affects only one muscle. [Pelland et al.](https://link.springer.com/article/10.1007/s40279-025-02344-w) support fractional accounting and a positive, diminishing-returns volume relationship. Blaze's explicit exceptions are more inspectable than hidden assumptions in a generic program.

**The exercise grammar is unusually useful for reuse.** Separating movement, equipment, skill, support, purpose, and dose gives a coach more explanatory power than body-part tags alone. The distinction between a new exercise and a consequential variation is already documented. Traceable coach approvals, inferred fields, aliases, and bilingual terminology are substantial assets. Compared with [free-exercise-db's schema](https://github.com/yuhonas/free-exercise-db/blob/main/schema.json), Blaze carries considerably more programming meaning.

**Stable exercise blocks, machines, and simple progressions are sensible defaults.** [Variation research](https://pubmed.ncbi.nlm.nih.gov/35438660/) supports purposeful rather than excessive random changes. [Machine/free-weight research](https://pmc.ncbi.nlm.nih.gov/articles/PMC10426227/) supports both for hypertrophy, with strength gains partly specific to the tested modality. Choosing support to match the task is better founded than treating complexity as inherently superior. Neither result proves a particular machine universally safer or a four-week change mandatory.

**The athletic layer is more developed than the first review acknowledged.** Separate power units, maximum intent, receiving before rebounding, scalable derivatives, and quality stops form a coherent progression. [Plyometric synthesis](https://pmc.ncbi.nlm.nih.gov/articles/PMC10115703/) and the [NSCA weightlifting position stand](https://www.nsca.com/globalassets/about/position-statements/weighlifting-for-sports-performance.pdf) support these broad choices. Here, "Olympic" includes simpler explosive alternatives; it does not mean everyone must perform full barbell catches.

**Context-sensitive programming is already present.** Practice-aware reductions, sport-provided aerobic work, competition buffers, maintenance, older-adult power alternatives, and event tapers are not missing features. They reflect the principle that gym work supports the person's life or sport. Reduced-dose [maintenance evidence](https://pubmed.ncbi.nlm.nih.gov/33629972/) and [taper evidence](https://pubmed.ncbi.nlm.nih.gov/17762369/) support the direction, though not every numerical modifier.

**Avoiding sex stereotypes is defensible.** A [2025 meta-analysis including Nuckols and Galpin](https://pubmed.ncbi.nlm.nih.gov/40028215/) found similar relative hypertrophy in men and women. Individual goals and capabilities are a reasonable basis for ordinary prescriptions. This does not eliminate pregnancy/postpartum or other condition-specific scope boundaries.

## 3. What Is Missing or Incomplete

### A Clear Hierarchy of Training Objectives

The model distinguishes goals, but needs sharper definitions of **minimum useful dose, growth-oriented default, specialization, maintenance, and sport-support dose**. These are different objectives, not competing answers to one question. An intermediate lifter with limited time and an intermediate bodybuilder maximizing growth need not start at the same target merely because both are L2.

The strongest concrete issue remains [volume section 5.5](../synthesis/12_volume_algorithm_v1.md): under its modeled two 45-minute pickleball sessions, hips and calves retain the group targets, with two shoulder-press sets also remaining, but quads, chest, and back have zero credited sets. This is a source-document feasibility example, not an engine result or proof that every short Blaze plan fails. The time estimates and priority ordering also contain team interpretation. The coach already permits block removal and supersets.

**For discussion with the coach:** should a time-limited general-fitness branch preserve useful whole-body exposure before preserving every selected group's floor and exercise count? A recent [single-set trial in trained adults](https://pubmed.ncbi.nlm.nih.gov/40249908/) shows that low-dose training can produce meaningful adaptations. It does not show that low dose maximizes growth. An additional pathway would broaden applicability without dismantling the physique pathway.

### Consistent Meanings and Rule Precedence

Separate **prescribed work sets, muscle credits, aggregate group credits, and exposure/fatigue considerations**. A prescription is not a record of completed training. Ten hip-group credits are not necessarily ten hamstring sets and ten glute sets. Zero athletic resistance credit does not mean zero training effect or tissue demand. Conversely, there is no validated conversion that lets us add a sprint meter, throw, and lifting set into one universal fatigue score.

The unresolved questions are already candidly recorded in [BRAIN section 0c.3](../BLAZE_CAMP_BRAIN.md). The arithmetic now makes them concrete: starting at 12 with the documented twelve-week 3%/5% curve reaches approximately 18.64 before rounding, not a ceiling of 22. Repeated 5% block-start increases eventually exhaust a fixed ceiling. **For discussion with the coach:** settle endpoints, plateaus, saturation, and which rule wins when progression conflicts with quality, sport, or time. Appendix E supplies the calculations; these are policy conflicts, not evidence that accumulation is ineffective.

### Better Coverage of the Intended Stimulus

The library already contains Nordics, Copenhagen variations, suspension rows, landmine work, and many core options. Carries/drags, neck work, cuff/serratus work, soleus/tibialis work, and reactive drills exist at mixed levels of completeness or approval. Prioritize their status, execution, dose, and justified use over adding hundreds of names.

A useful swap should preserve the **intended adaptation**, not merely the body part or pattern: a fast throw, cable rotation, and slow trunk exercise are not automatically equivalent. Likewise, a unilateral lift may change support, duration, load, and task demands at once. The existing variation rules are strong; resolve their edge cases explicitly. CrossFit's [stimulus-preserving scaling](https://www.crossfit.com/pro-coach/programming-basics-part-1) is a useful practice comparison, not a replacement system.

Retain current equipment exclusions as deliberate scope choices. Bands, chains, flywheels, BFR, and every specialist machine are not prerequisites for a complete first model. Expanding inexpensive or adaptive-equipment coverage is **for discussion with the coach**, especially if universal accessibility becomes a release claim.

### Depth and Boundaries Rather Than More Labels

Sport profiles already include needs analyses and practical context. The improvement is to show which recommendations are sport/event-specific, which are borrowed by analogy, and what has only provisional support. A nearest-profile route is useful when labeled; it is not proof of equivalence. See Appendix C for sport-family priorities.

Similarly, distinguish healthy self-directed training, qualified-coach use, and clinical/specialist referral. Youth supervision and maturation, frailty, pregnancy/postpartum, disability, significant chronic disease, and return from injury cannot be reduced to an age or exercise-level tag. That is a scope declaration, not a requirement to become a rehabilitation system. [Youth consensus](https://pubmed.ncbi.nlm.nih.gov/24055781/), [older-adult stand](https://pubmed.ncbi.nlm.nih.gov/31343601/), [WHO guidance](https://www.who.int/publications/i/item/9789240015128/)

## 4. What Is Debatable or Weakly Supported

**Every proposed departure in this section is for discussion with the coach.** Unvalidated precision is not the same as evidence of harm or ineffectiveness.

| Rule or claim | Strongest defense | Balanced judgment |
|---|---|---|
| Ten-set floor and high-volume starts | Credible hypertrophy-optimization defaults; substantial practice support. | Not a universal minimum for health, strength, or sporting benefit. Keep the pathway; define where it applies. [IUSCA](https://journal.iusca.org/index.php/Journal/article/view/81), [low-dose trial](https://pubmed.ncbi.nlm.nih.gov/40249908/) |
| Compulsory set escalation and 3%/5% curve | Orderly accumulation; manageable increments; familiar coaching practice. | Exact superiority is unestablished. Load or repetition improvements at stable set counts also constitute progression. Direct trials give mixed results, not a verdict against accumulation. [Enes](https://pubmed.ncbi.nlm.nih.gov/37796222/), [Barsuhn](https://pubmed.ncbi.nlm.nih.gov/39665246/) |
| Quarter-set helpers, fixed glute/dip credits, MYO equivalence | Transparent conventions make planning reproducible. | Do not interpret them as measured stimulus ratios. Lower helper credits can generate more direct work, not less total workload. [Fractional accounting](https://link.springer.com/article/10.1007/s40279-025-02344-w), [squat/hip-thrust trial](https://pubmed.ncbi.nlm.nih.gov/37877099/) |
| Core first, horizontal first, cross-pattern pairing | A light primer and predictable low-overlap pairing can work well. Core is explicitly light and movable. | No case for removing the primer. Preserve the existing work/Focus ordering exceptions; wider relaxation of horizontal-first would be a coaching decision. Pairing is practical, not universally optimal. [Order review](https://pubmed.ncbi.nlm.nih.gov/32077380/), [superset review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12011898/) |
| No planned in-block deload | Uninterrupted training can be effective; scheduled deload superiority is not established. | Preserve optional recovery and manual reduction. A week of cessation is not the same as reduced training; neither is compulsory. [Coleman](https://pubmed.ncbi.nlm.nih.gov/38274324/), [Pancar](https://www.nature.com/articles/s41598-026-40612-5) |
| High unilateral shares and exact sport power ratios | Task specificity and a deliberate mix are sensible. | Evidence does not identify 80-90% unilateral or a particular jump/throw share as optimal. Treat these as starting policies, not demonstrated sport requirements. [Unilateral/bilateral synthesis](https://pubmed.ncbi.nlm.nih.gov/35959319/) |
| Ballistic versus plyometric bins; fixed contact caps | Useful coaching shorthand for discrete/longer-contact versus repeated/rebound intent. | Scientific categories overlap: slow stretch-shortening-cycle (SSC) actions can still be plyometric. Retain coach labels alongside contact, direction, landing demand, and purpose descriptors. Exact optimal contact caps are not established. [Classification review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10457889/), [evidence-quality review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9832201/) |
| Two counted spinal days; constraint/rotation-based swaps | Plausible exposure management and practical ways to find tolerable movements. | "Not counted" is not "spine unloaded"; high constraint is not guaranteed safety. Rotation zones are not validated pain diagnoses. [McGill's framework](https://www.backfitpro.com/medical-scientific-articles/2010/%5B70%5DMcGill%2CS.M.%282010%29Core-training%5BJ.Strength-and-Condit.%5D.pdf), [lifting/posture review](https://pubmed.ncbi.nlm.nih.gov/31775556/) |
| Dense French contrast | Seven small RCTs support jump/sprint benefits versus traditional resistance training. | No clear superiority over traditional complex training. Chronic gains do not prove immediate potentiation or validate no-inside-rest specifically; match rest to the objective. [Chronic synthesis](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1672353/full), [acute PAPE synthesis](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2023.1202789/full) |
| Rep ranges by muscle size, fixed ball masses, level by load position | Useful ways to simplify instruction and equipment choice. | These are defaults, not biological laws. Effort, competence, implement, and actual movement matter. Existing quality gates deserve priority. [Loading review](https://pubmed.ncbi.nlm.nih.gov/33874848/), [NSCA weightlifting stand](https://www.nsca.com/globalassets/about/position-statements/weighlifting-for-sports-performance.pdf) |

Two further cautions: an exact percentage increase cannot guarantee injury prevention, and a movement's resemblance to a sport action does not by itself demonstrate transfer. Those limitations apply equally to competing systems and fashionable biomechanical theories.

## 5. Structure Review

**The organization is fundamentally sound, and the new documentation materially improves it.** Keep the faceted taxonomy, separate skill/volume levels, provenance, exclusions, plan families, and approved-versus-proposed distinction. The [48-record decision register](https://github.com/Blazecamp/blaze-camp-model/blob/3c373faa1bed945549da5191e5e811e27362f581/docs/04-decisions/index.md), [parameter map](https://github.com/Blazecamp/blaze-camp-model/blob/3c373faa1bed945549da5191e5e811e27362f581/docs/05-reference/parameters.md), and data dictionary already supply the organizational structures this review previously recommended. The remaining work is reconciliation and completion, not another documentation layer.

For an open foundation, distinguish five layers conceptually: **movement description; intended training stimulus; dose/accounting; coaching policy; application context**. Much of this already exists. The task is to make the boundaries clear. For example, a push press can be explosive practice or shoulder work depending on prescription; equipment support is not the same thing as skill, and neither is a clinical safety certificate.

Complete the existing register's active-policy view: each unresolved field needs an authorized value, units, context, exception, override authority, and superseded-rule link. "Coach approved" and "well supported by research" answer different questions. [ADR-048](https://github.com/Blazecamp/blaze-camp-model/blob/3c373faa1bed945549da5191e5e811e27362f581/docs/04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) already proposes joint optimization and an independent checker. Appendix E develops the mathematical contract, without selecting an implementation or treating that team direction as a new coach rule.

**Generic representation and a specific coaching philosophy can coexist.** Preserve the Blaze profile exactly as approved. A reusable description should nevertheless make it clear which restrictions belong to that profile, rather than presenting them as universal facts about exercise. Broader selectable policies inside Blaze itself would require coach approval. This is a model-design distinction, not a request to build software now.

**Against the field:** Blaze is richer in programming meaning than simple exercise databases; broader than a single 5/3/1 or physique template; and more inspectable than proprietary systems. But [wger](https://wger.readthedocs.io/en/stable/api/routines.html) and [Liftosaur](https://www.liftosaur.com/features/liftoscript) already represent routines and progression openly, [Volt](https://voltathletics.com/training-programs) covers multiple sports, and [Bosch](https://www.fransbosch.systems/app) uses a sophisticated movement taxonomy. Its integration is distinctive among these comparators; an exhaustive uniqueness claim or outcome-superiority claim is not established. Appendix B gives the substantive comparison.

Use the [CERT exercise-reporting framework](https://pubmed.ncbi.nlm.nih.gov/27707738/) to check whether another coach can reproduce a prescription: equipment, starting level, dose, progression, tailoring, supervision, and delivery. It is a completeness standard, not proof of efficacy. Then compare hand-worked cases with independent coaches. No app, tracking system, or engine rebuild is required to do that.

## 6. Top 10 Improvements Ranked by Impact

1. **Separate objective-specific dosing pathways.** Preserve growth-focused accumulation while resolving the time-limited whole-body tradeoff. Define minimum useful, optimization, maintenance, and sport-support targets. **For discussion with the coach.** [IUSCA](https://journal.iusca.org/index.php/Journal/article/view/81), [Hermann](https://pubmed.ncbi.nlm.nih.gov/40249908/).
2. **Make every dose unit unambiguous.** Distinguish work sets, individual muscle credits, group credits, and athletic exposure. Compare research and Blaze only after matching their counting conventions. Changes to coefficients are **for discussion with the coach**. [Pelland](https://link.springer.com/article/10.1007/s40279-025-02344-w).
3. **Resolve the stairway's mathematical contract and priority conflicts.** Approve reachable endpoints, rounding/plateaus, strict percentage limits, and behavior at the ceiling. Check the entire block jointly, not independent muscle targets. **For discussion with the coach.** [Documented equations](../synthesis/12_volume_algorithm_v1.md), worked proofs in Appendix E.
4. **Finish the athletic dose description.** Preserve Receive-Create and current quality gates; clarify contact intensity, direction, entry speed, rest, and the denominator of sport ratios. Changed ratios or stage rules are **for discussion with the coach**. [Plyometric evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC10115703/), [COD demands](https://pubmed.ncbi.nlm.nih.gov/30094799/).
5. **Clarify cross-modality workload interactions.** Keep separate counts, but explicitly consider regional overlap between lifting, jumps, sprinting, throwing, and practice. Do not invent a single fatigue conversion. [Concurrent-training review](https://pubmed.ncbi.nlm.nih.gov/34757594/), [ALTIS programming](https://altis.world/articles/strength-training-programming/).
6. **Consolidate the existing quality and self-adjustment rules.** Identify what is approved, what remains inferred, and which instruction wins over the calendar. Preserve human judgment without introducing check-ins. Altered locked rules are **for discussion with the coach**. [Variables section 6](../synthesis/11_training_variables.md), [NSCA](https://www.nsca.com/globalassets/about/position-statements/weighlifting-for-sports-performance.pdf).
7. **Define stimulus-preserving substitutions and complete high-value entries.** Prioritize approval, setup, units, regressions, and limitations for functional, reactive, and sport-care work. Audit media rights separately from code licensing. [Existing contribution rules](../docs/adding-exercises.md), [CrossFit scaling](https://www.crossfit.com/pro-coach/programming-basics-part-1).
8. **Publish profile confidence and scope boundaries.** Distinguish direct sport evidence from analogy, supervised pathways from self-directed ones, and S&C from clinical or technical-sport coaching. Changing approved defaults is **for discussion with the coach**. [Youth](https://pubmed.ncbi.nlm.nih.gov/24055781/), [older adults](https://pubmed.ncbi.nlm.nih.gov/31343601/), Appendix C.
9. **Finish the existing active policy/parameter map.** Reconcile the new ADRs with the canonical source fields, units, and approval status. Keep historical observations without allowing them to override round 3. This is reproducibility work, not a missing exercise-science theory. [Existing parameter map](https://github.com/Blazecamp/blaze-camp-model/blob/3c373faa1bed945549da5191e5e811e27362f581/docs/05-reference/parameters.md), [CERT](https://pubmed.ncbi.nlm.nih.gov/27707738/).
10. **Publish an independently checkable benchmark, then earn outcome claims.** Test fidelity, dimensional consistency, whole-block feasibility, uncertainty, and coach reproducibility before comparative research. Declare supported populations, media rights, and unvalidated assumptions. [CERT](https://pubmed.ncbi.nlm.nih.gov/27707738/), [individual-response methodology](https://link.springer.com/article/10.1007/s40279-024-02050-z), Appendix G.

**Bottom line:** The model merits refinement, not replacement. Its most valuable asset is a coherent coaching philosophy made explicit. The next step is to make its assumptions and decision boundaries as strong as its exercise vocabulary.

---

## Appendix A. Evidence That Changes the Judgment

These notes explain why apparently conflicting recommendations can both be reasonable. They supplement the main review rather than add new mandatory rules.

**Confidence summary:** confidence is high in resistance training's broad benefits and goal-dependent loading priorities ([ACSM](https://pubmed.ncbi.nlm.nih.gov/41843416/)); moderate and context-dependent for many comparative programming choices; limited for exact universal allocation percentages and cross-sport transfer. Coach-approved defaults and accounting conventions are useful decision rules, not measured physiological constants. Historical practice and commercial system descriptions sit in a separate evidence category, regardless of the coach's reputation.

| Source and design | What it supports | What it cannot establish |
|---|---|---|
| [ACSM 2026, overview of 137 systematic reviews](https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/) | Resistance training improves multiple outcomes; prescription priorities differ for strength, size, and power. | Its search ended in October 2024. It is not an evaluation of Blaze, every sport, or all clinical populations. Reviews share underlying studies; their counts are not independent replications. |
| [Schoenfeld et al., IUSCA 2021 position stand](https://journal.iusca.org/index.php/Journal/article/download/81/140/) | Hypertrophy-oriented volume targets and cautious systematic increases have credible scientific/practitioner support. | Expert synthesis is not a trial of an exact progression. Calculation: four 3% increments compound to 12.6%; four 5% increments to 21.6%, before Blaze's ceiling scaling and rounding. This contextualizes the stairway; it does not validate it. |
| [Pelland et al., 2026 dose-response meta-regression](https://link.springer.com/article/10.1007/s40279-025-02344-w) | 67 studies, 2,058 participants; fractional accounting fitted better than ignoring or fully counting indirect work. | Compared 0, 0.5, and 1, not 0.25. Mostly young men; a group-level curve cannot identify one person's optimal volume. It does not justify replacing every helper credit with 0.5. |
| [Hermann et al., 2025, randomized single-set trial](https://pubmed.ncbi.nlm.nih.gov/40249908/) | 42 trained adults assigned to failure or two-RIR work; nine exercises twice weekly for eight weeks. Both conditions improved most measured outcomes. | Abstract-based appraisal. No high-volume comparator; useful low-dose training is not demonstrated equivalence to maximal-growth programming. |
| [Enes et al., 2024](https://pubmed.ncbi.nlm.nih.gov/37796222/); [Barsuhn et al., 2025, institutional full text](https://openrepository.aut.ac.nz/server/api/core/bitstreams/4f83ffc5-1aad-4dc8-92fb-1c28156b3211/content) | Direct volume-progression research is more relevant than arguing from popularity: Enes favored progressive additions for squat strength; Barsuhn observed growth without increasing prior volume. | Barsuhn randomized 55 but had 29 completers; no clear between-group hypertrophy difference is not proof of equivalence. Neither tests Blaze's algorithm. Enes appraisal is abstract-based; Barsuhn's full text was checked. |
| [Martikainen et al., 2025 RIR-ramp trial](https://link.springer.com/article/10.1007/s42978-025-00338-8) | 31 trained completers; ten weeks comparing four-to-one RIR ramps with constant one RIR. Gains did not clearly differ; the ramp produced lower session RPE. | Two five-week blocks included deloads. This supports tolerability of effort progression, not Blaze's full combination of increasing sets, harder effort, and late intensifiers. |
| [Coleman et al., 2024](https://pubmed.ncbi.nlm.nih.gov/38274324/); [Pancar et al., 2026](https://www.nature.com/articles/s41598-026-40612-5) | A week off and reduced-dose weeks are different interventions. Neither study establishes mandatory planned deloads for everyone. | Coleman found smaller strength gains with cessation; Pancar's small untrained sample found similar outcomes with reduced dosing. Neither settles recovery needs in advanced, high-volume, multisport plans. |
| [Plotkin et al., 2023 squat versus hip thrust](https://pubmed.ncbi.nlm.nih.gov/37877099/) | Similar glute growth in the studied novice protocol challenges interpreting squat credit 0.25 versus thrust 1.0 as literal growth ratios. | One protocol does not calibrate every squat, hinge, individual, or quarter-set coefficient. Keep coaching accounting distinct from physiology. |
| [Radaelli et al., 2025 older-adult network meta-analysis](https://pubmed.ncbi.nlm.nih.gov/39405023/) | Low-volume programs can meaningfully improve function and muscle size; higher volume may favor some strength outcomes. | Abstract-based appraisal. Its dose categories use frequency, exercises, and sets, not Blaze's per-muscle credits. Do not paste its numerical tiers into this model. |
| [Refalo et al., 2025 sex-differences meta-analysis](https://pubmed.ncbi.nlm.nih.gov/40028215/) | Across 29 studies, relative hypertrophy was similar; absolute changes modestly favored men. | Few highly trained samples; not evidence that pregnancy, postpartum, or all fatigue responses are identical. Authors disclose fitness-industry roles, including Stronger by Science. |
| [Singer et al., 2024 inter-set rest review](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1429789/full) | Nine studies suggest a small potential hypertrophy advantage above 60 seconds, with uncertainty. | Not a universal three-minute minimum. Blaze already allows longer hypertrophy rest when needed; preserve that flexibility. |
| [Wolf et al., 2025 lengthened-partial trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC11829627/); [Varovic et al., 2025 regional meta-analysis](https://pubmed.ncbi.nlm.nih.gov/40570881/); [Pedrosa et al., 2026 review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12951042/) | Muscle length, joint position, resistance profile, and ROM are worth describing separately. Wolf found similar upper-body adaptations between lengthened partials and full ROM; Varovic found small/trivial estimated differences across studied lengths; Pedrosa emphasizes torque at long lengths. | Different comparisons and methods explain some apparent disagreement. Pedrosa is an unstructured review; the evidence does not mandate lengthened partials everywhere. Preserve full-ROM defaults and purposeful alternatives. |
| [Schoenfeld, Ogborn and Krieger, 2015 tempo meta-analysis](https://pubmed.ncbi.nlm.nih.gov/25601394/) | A broad range of repetition durations produced similar hypertrophy in the included studies. | Slow eccentrics can teach control, but "slower always recruits more and grows more" is not established. Fast intent and actual bar speed are also different quantities. |
| [2023 plyometric umbrella review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9832201/) | Broadly favorable performance findings across 29 meta-analyses. | Most were low/moderate quality; 24 relied on within-group changes rather than control-group contrasts. Supports cautious use, not precisely optimal sport percentages or contact ceilings. |
| [2025 French-contrast meta-analysis](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1672353/full) | Seven RCTs, 195 participants; favorable jump/sprint findings versus traditional resistance training. | Small, protocol-dependent evidence; no clear superiority over traditional complex training. The method deserves a place without claims that every sequence acutely potentiates performance. |
| [Zhao et al., 2026 reactive-agility review](https://pmc.ncbi.nlm.nih.gov/articles/PMC12912675/) | 28 studies support training perception and movement together. Reported certainty: moderate for reactive-agility tests, low for planned tests, very low for reaction tests. | Soccer/basketball dominate; heterogeneous tests and possible publication bias limit generalization. Estimated dose peaks are not universal prescriptions. |
| [Solberg et al., 2025 force-velocity review](https://pubmed.ncbi.nlm.nih.gov/40593873/); [individualized-profile meta-analysis](https://pubmed.ncbi.nlm.nih.gov/41766810/) | Profiling can describe capabilities; a velocity-deficit subgroup may benefit from tailored training. | Overall superiority for jump height/power remains uncertain. Vertical-jump evidence should not be generalized to every sprint profile. Do not replace practical coaching with unsupported claims of precise optimization. Abstract-based appraisal. |
| [Mo et al., 2023 load-position study](https://pubmed.ncbi.nlm.nih.gov/38093908/) | In 12 trained men, ipsilateral/contralateral placement altered some trunk/hip activation measures during single-leg RDLs. This supports describing setup precisely. | Acute EMG is not evidence of lasting hypertrophy, restored hip rotation, pain treatment, or superior sport transfer. Preserve the taxonomy while qualifying causal explanations. |

**Counting example, not a prescription:** eight pressing sets plus six direct triceps sets equal eight triceps credits under a 0.25 helper convention, ten under 0.5, and fourteen under full counting. The work has not changed. Raising direct work to satisfy a fixed numerical floor changes the prescription. This is why target tables and credit conventions must be calibrated together.

**Research limitations that matter:** most interventions are short and test selected muscles or performance proxies. A statistically nonsignificant difference is not automatically proof of equivalence. EMG, acute fatigue, movement resemblance, and strength gains are not interchangeable with hypertrophy, injury reduction, or sport transfer. Coaching experience contributes feasibility and context, but has selection and attribution biases; published studies also have sampling, measurement, and publication biases.

**Commercial interests and source status:** RP, Juggernaut, Westside, Triphasic, ALTIS, Volt, and Bosch sell products or services. Several researchers also coach, write, or consult commercially; disclosed interests should inform scrutiny, not automatically invalidate findings. A concrete reason to maintain source status: the [2025 Copenhagen-exercise meta-analysis](https://pubmed.ncbi.nlm.nih.gov/40827942/) was [retracted in 2026](https://pubmed.ncbi.nlm.nih.gov/41975640/) and is not used here as efficacy evidence. This does not invalidate separate underlying trials.

## Appendix B. Comparison With Complete Systems

This is a comparison of publicly inspectable methods and documentation, not a league table of training outcomes. Paid curricula and proprietary algorithms were not audited.

| Comparator | Its useful contribution | Fair implication for Blaze |
|---|---|---|
| [Renaissance Periodization](https://rpstrength.com/blogs/articles/training-volume-landmarks-muscle-growth) | Distinguishes maintenance, effective/adaptive, and recoverable volume; links dose to the individual. | Blaze's accumulation belongs in a respected tradition. Clarify its target meanings and individual exceptions; an RP app workflow is not required. |
| [Juggernaut](https://www.jtsstrength.com/scientific-principles-of-weightlifting/) | Prioritizes specificity, overload, fatigue management, recovery/adaptation, variation, phase potentiation, and individuality. | Blaze translates many principles into explicit rules. A similarly clear hierarchy would help resolve conflicts between those rules. |
| [Jim Wendler's 5/3/1 beginner program](https://www.jimwendler.com/blogs/jimwendler-com/101065094-5-3-1-for-a-beginner) | Conservative training maxima, jumps/throws, assistance, conditioning, and simple progression tied to successful work. | A complete program need not increase muscle-set counts every week. Blaze is broader in exercise/sport semantics; 5/3/1 is a useful clarity and prioritization benchmark. |
| [Westside/conjugate](https://www.westside-barbell.com/blogs/the-blog/applying-the-conjugate-method) | Distinct maximal-, dynamic-, and repeated-effort purposes, rotating emphases and loading waves. | Make loading purpose explicit. Success stories do not prove universal superiority or require Blaze to adopt maximal attempts, bands, or chains. |
| [Triphasic](https://triphasictraining.com/the-triphasic-training-block-method/) | Emphasizes eccentric, isometric, and concentric phases within planned blocks. | Blaze already has variables to represent these emphases. The branded sequence need not become a universal rule. |
| [ALTIS](https://altis.world/articles/strength-training-programming/) and [Schexnayder](https://sacspeed.com/pdf/Speeddevelopment.pdf) | Athlete-sport needs, explicit training purposes, quality, recovery, and changes in gym emphasis as sport intensity rises. | Valuable depth for the athletic profiles. Elite examples should not be copied into novice populations; the coaches themselves emphasize context. |
| [NSCA needs analysis](https://www.nsca.com/education/articles/kinetic-select/needs-analysis-for-a-tactical-athlete/) | Sport/task demands plus athlete status, testing, resources, and constraints. | Blaze already covers much of this. Strengthen the trace from an identified need to the prescribed quality and dose. |
| [CrossFit](https://www.crossfit.com/essentials/mechanics-consistency-intensity-intensity) | Mechanics, consistency, then intensity; scalable mixed-modal training. | Useful execution and scaling principles. Its conditioning objectives differ from physique optimization or fresh-speed training, so compare like with like. |
| [HYROX partner programming](https://hyrox.com/training-partner/hybrid-program/) | Running, strength, station skill, specificity, and peaking. | The approved Blaze hybrid split is plausible. Specify when the aim is general preparation versus race-specific pacing and running under fatigue. Organizer endorsement is not comparative trial evidence. |
| [Volt](https://voltathletics.com/training-programs) | Multiple sports and seasonal programming, with [stable blocks and accumulation](https://help.voltathletics.com/how-do-i-set-up-the-training-calendar). | Related scope exists. Blaze's advantage is public inspectability and reuse of coaching logic; proprietary adaptive features are not missing model requirements. |
| [Bosch's exercise system](https://www.fransbosch.systems/app) | Classifies exercises through muscle contribution, movement organization, and sport-related tasks. | Sophisticated movement classification is not unique to Blaze. Their conceptual lenses can coexist; neither taxonomy alone establishes transfer or clinical efficacy. |
| [TeamBuildr](https://www.teambuildr.com/programming-templates-and-exercise-database) | Coach-authored programs, templates, and exercise libraries. | A platform is not one coaching philosophy. Blaze could supply the explicit model beneath such authoring; platform features are not the appropriate scientific benchmark. |

**Open foundations:** [free-exercise-db](https://github.com/yuhonas/free-exercise-db) and [ExerciseDB](https://oss.exercisedb.dev/docs) primarily provide exercise content. [wger](https://wger.readthedocs.io/en/stable/api/routines.html) additionally represents routine/day/slot entries with sets, reps, load, RIR, rest, and progression. [Liftosaur/Liftoscript](https://github.com/astashov/liftosaur) represents programmable routines and progression in an open project. Blaze's opportunity is the combination of those kinds of explicit representations with its much richer, provenance-bearing coaching policy.

**Licensing diligence:** free access is not unrestricted redistribution. Record the exact provider, record/asset license, attribution, and version before importing. [wger](https://github.com/wger-project/wger) distinguishes code and content licensing; [ExerciseDB .io terms](https://exercisedb.io/terms) and the separately branded [.dev API](https://oss.exercisedb.dev/docs) must not be conflated. Existing third-party exercise videos do not become Blaze-owned assets merely because their URLs appear in the catalog.

**Practitioner communities:** [weightroom's RP discussion](https://www.reddit.com/r/weightroom/comments/kvqd07) and [CrossFit's stimulus discussion](https://www.reddit.com/r/crossfit/comments/c0p81i) illustrate recurring practical issues around individualized volume and preserving workout purpose. These are self-selected accounts, not effect estimates or proof of one system's superiority.

## Appendix C. Athletic and Sport Research Priorities

These are refinements to existing profiles, not assertions that the model lacks sport context. Broad physical qualities and narrowly specific transfer should be kept distinct.

| Domain | Evidence-informed foundation to preserve | Next model-level refinement |
|---|---|---|
| Explosive extension | [Morris et al.'s weightlifting comparison](https://pmc.ncbi.nlm.nih.gov/articles/PMC9213388/) supports useful adaptations, often comparable with plyometrics. [Suchomel et al.](https://pubmed.ncbi.nlm.nih.gov/25689955/) explain the value of pulling derivatives. | Clarify explosive-extension purpose versus full Olympic-lift skill. Define the reference lift for percentages; do not apply one load/rep curve indiscriminately across pulls, catches, DB/KB lifts, and bodyweight alternatives. |
| Plyometrics and landing | [Ramirez-Campillo et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC10115703/) support reactive-strength improvement. [NSCA practical guidance](https://www.nsca.com/education/articles/kinetic-select/plyometric-exercises/) also uses low-volume, high-quality dosing. | Existing Receive-Create gates are valuable. Clarify per-session versus per-week caps and whether a contact is bilateral, per limb, extensive, or high impact. Throw sets should not change apparent lower-limb exposure. |
| Sprinting and field speed | [Haugen et al.](https://pubmed.ncbi.nlm.nih.gov/31754845/) synthesize sprint practice; [Morin and Samozino](https://pubmed.ncbi.nlm.nih.gov/26694658/) provide a mechanical profiling framework. | Distinguish acceleration, maximum velocity, resisted sprinting, and repeated-sprint conditioning. Preserve full-recovery quality where speed is the objective. Profiling equipment is optional, not a foundation requirement. |
| COD and reactive agility | [Angle/velocity research](https://pubmed.ncbi.nlm.nih.gov/30094799/) distinguishes braking and propulsion; [Nimphius et al.](https://pubmed.ncbi.nlm.nih.gov/26982972/) separate COD ability from straight-line speed; [reactive-agility evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC12912675/) supports perception-action coupling. | Finish the already acknowledged reactive gap using representative opponent/ball/cue tasks. Describe approach speed, turn angle, response options, decision complexity, and stopping space. Planned routes are valuable, but not interchangeable with reactive tests. |
| Soccer, basketball, volleyball, football, rugby | Strength/power preparation has a rationale, while [team-sport dose evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC11747014/) suggests useful adaptations can occur at lower volumes, albeit with very low certainty. | Link existing position/season profiles to actual practice jumping, sprinting, braking, and collision demands. A ratio alone cannot express this. Individual positional needs can differ more than a sport label suggests. |
| Hamstring/adductor preparation | Programs containing Nordics reduced hamstring injury rates in [van Dyk et al.'s synthesis](https://bjsm.bmj.com/content/53/21/1362). [Haroy et al.'s cluster trial](https://pubmed.ncbi.nlm.nih.gov/29891614/) supports a Copenhagen-based progression for self-reported groin problems in male football. | These exercises already exist. Specify tolerable introduction, progression, and adherence; do not claim every exercise named "prehab" prevents injury or generalize a football protocol to everyone. |
| Baseball/softball, tennis and other overhead sports | [Overarm-training review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11550301/) and [tennis synthesis](https://pubmed.ncbi.nlm.nih.gov/40605097/) support targeted physical preparation with context-dependent transfer. | Tie throwing/serving exposure and event demands to gym priorities. Preserve shoulder-care choices without representing generic cuff work or avoiding all overhead loading as a proven universal prevention strategy. |
| Running, cycling, rowing, swimming | Strength work can complement endurance: reviews in [running](https://pubmed.ncbi.nlm.nih.gov/38165636/), [cycling](https://pubmed.ncbi.nlm.nih.gov/40632222/), [rowing](https://pubmed.ncbi.nlm.nih.gov/32216524/), and [swimming](https://pubmed.ncbi.nlm.nih.gov/39129754/) examine different outcomes. | Keep existing event/stroke variants and no-redundant-cardio rule. Separate start/turn power, economy, local strength, and whole-race performance. Equal gym prescriptions should not be inferred from a shared "endurance" label. |
| Combat, golf, ice hockey | [Combat review](https://pubmed.ncbi.nlm.nih.gov/36834211/), [golf review](https://pubmed.ncbi.nlm.nih.gov/38424374/), and [hockey testing review](https://pubmed.ncbi.nlm.nih.gov/37841888/) support distinct demands and measurement choices. | Preserve strike/grapple, swing, skating, and position distinctions. Associations between strength and performance are weaker evidence than interventions that improve sport outcomes. |
| HYROX, CrossFit, mixed-modal goals | The approved combined approach fits the tasks. [Concurrent-training evidence](https://pubmed.ncbi.nlm.nih.gov/34757594/) does not show average impairment of maximal strength/hypertrophy, but explosive strength can be attenuated. [Direct HYROX research](https://pubmed.ncbi.nlm.nih.gov/40230601/) supports the importance of endurance demands. | Distinguish fresh power from deliberately fatigued station/running practice. The HYROX study involved only 11 recreational athletes in a simulation: it cannot validate the exact strength/cardio split. Do not give circuits fictitious resistance-set equivalence. |
| Youth and older adults | [Youth consensus](https://pubmed.ncbi.nlm.nih.gov/24055781/) supports competent supervised training; [NSCA older-adult guidance](https://pubmed.ncbi.nlm.nih.gov/31343601/) supports strength and power. | Current conservative defaults plus opt-in are defensible. Age is not a direct measure of competence; clarify supervision, task prerequisites, and functional goals. Changed age restrictions remain for discussion with the coach. |

**Practitioner frameworks:** [Hartman's positioning discussions](https://billhartmanpt.com/tag/exercises-for-shoulder-health/), [McGill's trunk-load framework](https://www.backfitpro.com/medical-scientific-articles/2010/%5B70%5DMcGill%2CS.M.%282010%29Core-training%5BJ.Strength-and-Condit.%5D.pdf), [Verkhoshansky's special-strength methodology](https://www.verkhoshansky.com/portals/0/book/special_strength_training.pdf), and [Issurin's block organization](https://pubmed.ncbi.nlm.nih.gov/18212712/) offer ways to reason about movement and planning, not universal diagnostic or dosing laws. Distinguishing sport-performance preparation from physique optimization is especially relevant. Map useful concepts to Blaze's existing variables; do not treat a respected name or branded method as independent validation.

## Appendix D. Parameter and Foundation Checklist

The model already has a broad tuning vocabulary. This index distinguishes it from a proposal to add more intake fields. Locked coach policies remain locked unless the coach changes them.

| Layer | Existing parameters and decision families | Source |
|---|---|---|
| Mechanical stimulus | V01 load; V02 speed intent; V03 tempo; V04 ROM; V05 end-range behavior | [Variables](../synthesis/11_training_variables.json) |
| Dose and organization | V06 volume; V07 density/rest; V08 effort; V09 frequency; V10 selection/constraint; V11 variation; V12 order | [Variables](../synthesis/11_training_variables.json) |
| Movement configuration | V13 position zone; V14 load laterality; V15 stance/base; V16 grip/feet; V18 plane/core segment | [Taxonomy](../synthesis/01_taxonomy.json), [variables](../synthesis/11_training_variables.json) |
| Athletic and session qualities | V19 force phase/method/stage/height; V20 ball mass; V21 conditioning; V22 bilateral share; V23 exercise level; V24 pairing; V25 spinal exposure | [Variables](../synthesis/11_training_variables.json); V17 accommodating resistance is deliberately dormant |
| Volume policy | Muscle/group definitions, credits, starts, floors, caps, Focus additions, goal/phase/pain factors, per-session distribution, repeated-block adjustments | [Volume](../synthesis/12_volume_algorithm_v1.json) |
| Stairway mathematics | Early/late step, halfway timing, scaling to ceiling, banking/rounding, placement, whole-week increase limits, short-block and one-set exceptions | [Volume](../synthesis/12_volume_algorithm_v1.json), [specification](../generator_spec_v1.json) |
| Session feasibility | Warm-up/core dose, order, split, same/cross pattern, exercise/slot caps, sets/reps/rest, transitions/time assumptions, superset/contrast/circuit rules, optional-day and keep/drop priorities | [Sessions](../synthesis/05_templates.json), [specification](../generator_spec_v1.json) |
| Equipment and selection | Required setup combinations, available loads/machines, space, preferences/exclusions, constraint, load position, skill level, variation and substitution permissions | [Equipment](../synthesis/10_equipment_model.json), [catalog](../synthesis/02_exercise_catalog.json) |
| Athletic/sport context | Sport/position/event, competitive level, season, practice/play, jump/throw mix, contact/power budgets, stage timing, Olympic families, cardio counts/bands, care-work and age overlays | [Profiles](../synthesis/04_profiles.json) |
| Calendar and assessment | Plan length/type, exercise-block duration, maintenance reason/length, taper/event timing, holidays, repeated cycles, baseline/end tests and load references | [Periodization](../synthesis/06_periodization.json), [specification](../generator_spec_v1.json) |
| Person and preferences | Role/screening, age/growth stage, body weight, experience/layoff, goals/training style, Focus choices, rep preference, days/minutes, equipment, pain/exclusions, dates, units/language | [Input fields](../generator_spec_v1.json), [input explanation](../synthesis/09_generator_inputs.md) |
| Authority and modification | Field provenance, active/proposed/retired status, coach overrides, user modification of the printed plan, source precedence | [Coach answers](../coach_answers_round3.md), [BRAIN](../BLAZE_CAMP_BRAIN.md), [contribution rules](../docs/adding-exercises.md) |

**Model validation before software:** ask independent coaches to construct and explain the same handful of cases from the written rules: two short general-fitness sessions; a full hypertrophy block; a congested in-season week; a novice with limited kit; a capable older athlete; a youth athlete; an endurance athlete with extensive sport practice; and a client whose compatible exercise options run out. Compare coverage, actual time, intended stimulus, dose units, and justified exceptions, not merely rule compliance. Use agreed cases to settle the open decisions.

For baseline/end comparisons, specify familiarization, technique, equipment, surface, timing method, trials, recovery, and expected measurement variation. Otherwise learning the test or testing under peak-block fatigue can masquerade as a training effect. This strengthens the existing testing policy without requiring mid-block tests or personal-data collection.

## Appendix E. Mathematical Upgrade Blueprint

**Status: proposed foundation contract, not an implementation or replacement coaching policy.** All departures from approved rules below are **for discussion with the coach**. The equations describe prescriptions, not a model that can predict an individual's gains, recovery, or injury risk. They develop the joint-planning direction already recorded in [ADR-048](https://github.com/Blazecamp/blaze-camp-model/blob/3c373faa1bed945549da5191e5e811e27362f581/docs/04-decisions/adr-048-optimizer-rebuild-of-the-planner.md).

### E1. What the Mathematics Should Optimize

First define a valid plan; only then rank valid alternatives. The strongest foundation is an explicit **constrained, multi-objective allocation and scheduling model**, not a single speculative "fitness score."

Classify each rule as a logical requirement, authorized mandatory policy, provisional proposal, or preference. Record scientific confidence separately. A coach's counted-spinal-exposure limit can be mandatory within Blaze without being a validated biological threshold. An equipment requirement cannot be traded away for more hypertrophy points. An optional preference must not silently become an exclusion.

Use an approved **lexicographic order**: optimize the highest-priority criterion, preserve its best attainable value, then optimize the next. Possible criteria include retaining the coach's prioritized groups, meeting their approved dose, matching the progression trajectory, and minimizing unnecessary complexity. Their actual order must come from resolved coaching decisions. Do not invent numerical trade-offs such as "70% hypertrophy, 30% athleticism." Where goals genuinely compete, show a small set of nondominated alternatives with the trade-off stated.

An optimum is always conditional on the candidate exercises, templates, rules, time assumptions, and objective. Restricting the menu may simplify the problem but also exclude better plans. If using staged allocation followed by daily packing, failed packing must feed back into allocation; otherwise each stage can look sensible while their combination is impossible. None of this requires choosing a programming language or solver now.

### E2. A Dimensionally Correct Prescription

For **ordinary straight resistance sets**, let `e` identify an eligible exercise **with its execution and dose option**, `d` a training day, and `w` a week. Different rep ranges, tempo, sidedness, or athletic intent may change its timing or purpose.

```text
x[e,d,w] = prescribed resistance work sets, a nonnegative integer
a[m,e]   = approved credit to muscle m per work set of e
W[w]     = sum over e,d of x[e,d,w]                 [work sets]
v[m,w]   = sum over e,d of a[m,e] * x[e,d,w]        [muscle credits]

Proposed grouped convention already in the source:
b[g,e]   = min(1, sum over muscles m in g of a[m,e])
u[g,w]   = sum over e,d of b[g,e] * x[e,d,w]        [group credits]
```

The group cap of one is applied **per exercise's set contribution**, not to the week's final total. This grouped convention remains a proposal where the source marks it as such. A hips-group floor does not independently guarantee the same floor for hamstrings and glutes. Keep individual anatomy visible even when the coach plans by group. Source: [volume JSON, `counting`](../synthesis/12_volume_algorithm_v1.json).

For quarter-credit coefficients, multiply the accounting constraints by four to use exact integers. Do not round each helper contribution independently. If future approved coefficients have another denominator, use an exact common scale or explicitly defined precision. Integer work sets do **not** imply integer muscle credits, and not every quarter-credit total is attainable from a given exercise menu.

Both sides of a unilateral exercise still count as one prescribed set under the coach's convention. Its execution time, left/right exposure, and grip/setup requirements remain separate. Contacts, throws, sprint metres, seconds, cuts, and conditioning bouts are other quantities, not fractional resistance sets.

**Advanced-set and core exceptions need separate definitions.** The source's inferred MYO multiplier of two and proposed per-set group cap of one cannot be combined without deciding whether grouping occurs before or after the multiplier. Treating one MYO protocol as two physical work sets also changes the meaning of `W`. Define the protocol's bouts, timing, muscle credit, group credit, and approval status explicitly; do not assume the straight-set formula resolves it. This clarification is **for discussion with the coach**, not evidence against MYO training.

### E3. Reachability Before Rounding

The documented continuous stairway uses `h = ceil(N/2)`, with 3% steps into weeks 2 through `h` and 5% thereafter. Define:

```text
G_N(lambda) = product over w=2..N of (1 + lambda * s[w])
T[1] = S
T[w] = T[w-1] * (1 + lambda * s[w])
```

For `S > 0`, `N >= 2`, positive standard steps, and `0 <= lambda <= lambda_max`, a desired continuous endpoint `P` is reachable exactly when `S <= P <= S * G_N(lambda_max)`. Within that interval the solution is unique; `P = S` requires `lambda = 0`. This follows because the product is continuous and strictly increasing. A start above its ceiling is inconsistent before exercise allocation begins.

| Worked calculation, before rounding or time limits | Eight weeks | Twelve weeks |
|---|---:|---:|
| Number of early / late increments | 3 / 4 | 5 / 6 |
| Standard growth factor `G_N(1)` | 1.3282164980 | 1.5535381333 |
| Start 12: standard endpoint | 15.9385979765 | 18.6424575991 |
| Scale needed for 12 to reach 22 | 2.1884979241 | 1.3869809561 |
| Corresponding late weekly increase | 10.9424896207% | 6.9349047805% |

The source currently restricts scaling to `lambda <= 1`. Thus its standard twelve-week curve cannot take 12 to 22. Allowing `lambda <= 1.4` would respect a 7% late-step cap and reach 22 over twelve weeks, but yields only **17.7958818480** over eight. Raising the scale is a possible policy revision, not a universal remedy. These are calculations from [section 3.7](../synthesis/12_volume_algorithm_v1.md), not exercise-science claims.

Keep four values separate: **policy ceiling, desired endpoint, mathematically reachable endpoint, and realized allocated endpoint**. An operational shortfall does not lower a person's biological ceiling. Time, exercise maxima, helper spill, and session rules may make a continuously reachable endpoint unattainable in a real prescription.

**Decision E3, for discussion with the coach:** when exact ceiling arrival conflicts with the standard rates, preserve the approximate shape/rates and accept a lower peak, revise rates within an approved bound, or change the starting dose/block length where appropriate. None should happen silently. The source's statement that every eight-week line finishes below its cap also overstates its own table: L3 big and L3 Focus reach their caps. That explanatory sentence can be corrected without changing a coach rule.

### E4. Coupling, Plateaus, and Strict Inequalities

Adding a bench set changes multiple muscle totals at once. Therefore the attainable endpoint is a **vector** in the set `{A*x[N] : the complete block is feasible}`, not a separate bank for each muscle. Even independent targets can compete for the same time: when two groups require separate, non-overlapping exercises, six work sets for each cannot both fit a ten-set budget, though each fits alone. If an eligible compound serves both groups, that particular bound changes. This illustrative example is not a Blaze prescription.

For a line whose eligible additions all contribute one credit, strict growth in every transition of a twelve-week block requires at least eleven additional credits. A 15-to-22 range offers only seven. Fractional helpers can change that bound; this is not a universal integer-only proof. A useful distinction is strictly increasing continuous targets versus nondecreasing realized credits with plateaus. Approving the latter is a coach decision, not something to conceal with a smooth chart.

For a positive current work-set count, the strict total-work-set limit has an exact integer form:

```text
W[next] < 1.10 * W[current]
equivalently: 10 * W[next] <= 11 * W[current] - 1
maximum added integer sets = ceil(0.10 * W[current]) - 1
```

At 10 work sets this permits zero additions; at 20 it permits one. A one-set allowance is a genuine exception: 10 to 11 is exactly 10%, and 9 to 10 is 11.1%. The source labels that allowance **PROPOSED**. Define its domain, approved rounding, and whether limits refer to work sets or credits. Do not apply a percentage to one and validate the other. [Limits and banking](../synthesis/12_volume_algorithm_v1.md)

**Decision E4, for discussion with the coach:** approve plateau tolerance, endpoint tolerance, the small-plan exception, and whether ceilings include all helper credits or allow the proposed spill. A proposed two-set minimum climb also conflicts with a start of 13 and a capacity of 14: it requires both `P >= 15` and `P <= 14`. Calling 15 the new "time ceiling" cannot create capacity. The source's `S+1` wording and later `S+2` minimum need one interpretation.

### E5. Repeated Blocks Need a Saturation Rule

The documented recurrence is iterative `start = round_half_up(start * 1.05)` for each completed block, not one final rounding of `S0 * 1.05^k`. Starting at 20, it produces **20, 21, 22, 23, 24, 25, 26** after zero through six completed blocks, while the nonpriority cap stays 25. At five completed blocks no set-growth headroom remains; at six the start exceeds the cap. [Next-block rule in section 3.12 and exact pseudocode in section 4](../synthesis/12_volume_algorithm_v1.md)

**Decision E5, for discussion with the coach:** specify a saturation and re-entry policy. The philosophy already supplies options: [R2-PER-05](../coach_answers_round2.md) allows load/intensifier progression or rotating Focus at the set ceiling. Formalize when that regime replaces set growth and how a subsequent block starts. Do not clamp, reset, escalate the ceiling, or introduce a compulsory deload without approval.

### E6. Time Is a Schedule, Not Just a Set Multiplier

The existing minutes-per-set and superset-discount model is transparently **proposed**. A stronger contract describes actual scheduled events: warm-up, each work bout, both sides where relevant, recovery, transitions, equipment changes, and the end of the session. Required recovery is measured from the relevant preceding effort to the next, not only from the last line of the written plan.

For illustration, an `A1 -> 15-second transition -> 30-second B1 -> 15-second transition -> A2` sequence supplies only 60 seconds between the end of A1 and start of A2. If A requires 120 seconds, another 60 seconds is needed. Pairing does not automatically erase that rest. Count actual overlap once, respect equipment availability, and preserve the quality objective. A blanket 0.65 time multiplier cannot express every pairing. This is scheduling arithmetic; it is not evidence that supersets are ineffective.

Check **all weeks**, including the peak, not only the starting week. Distinguish the chosen time limit from any explicitly accepted longer session and from uncertainty in the estimate. A plan that fits under normal assumptions but not plausible slower transitions is **time-fragile**, not guaranteed feasible in practice. No stopwatch data or new intake field is required to disclose that limitation.

### E7. What a Defensible Solution Would Report

For each hand-worked or future computed plan, provide its source/rule versions, eligible menu, prescription totals, assumptions, approved exceptions, and binding constraints. Use precise statuses: feasible, optimal within the stated model, proven infeasible within that model, or unknown. A search timeout is not proof that no valid plan exists. An independent checker should recompute dose and timing from the prescription, not trust the planner's cached totals. [CP-SAT's official status and integer-constraint definitions](https://developers.google.com/optimization/cp/cp_solver) illustrate established practice; this is a mathematical reference, not a dependency recommendation.

When infeasible, identify a demonstrably conflicting subset of requirements where possible and show only authorized alternatives. Do not claim a conflict set is minimal unless that was checked. "Add a day" may solve an exercise-distribution conflict that "add minutes" cannot. Keep unresolved cases unresolved rather than silently violating a rule.

Use sensitivity scenarios for uncertain time assumptions and accounting conventions. They are not clinical confidence intervals. A smaller helper coefficient is not automatically conservative: against the same floor it may require more direct work. Calibrate coefficients and targets together, keeping the approved convention canonical. Repeat this reasoning for regional demands without inventing a universal fatigue currency.

**What not to add now:** a reinforcement-learning label, a genetic search, or an LLM does not establish a better biological objective or a proven optimum. Fitness-fatigue models have substantial input and interpretation limitations; see the [conceptual review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8894528/). Do not infer personal recovery from data the foundation deliberately does not collect. Do not use an acute:chronic workload ratio as an injury guarantee; its causal interpretation has serious problems ([Impellizzeri et al.](https://pubmed.ncbi.nlm.nih.gov/32502973/)). Advanced mathematics should expose uncertainty, not give it extra decimal places.

**Verification for this review:** the growth factors, endpoint scales, positive-integer percentage bound, repeated-block recurrence, and illustrative timing were recomputed independently of the excluded engine. The integer bound was checked for current totals 1 through 1,000. These checks verify the worked arithmetic, not a future optimizer or physiological prediction. A complete optimization specification still depends on the unresolved coach decisions above.

## Appendix F. Library and Coverage Upgrades

These are proposed specifications for the foundation. They do not require a new app, stored training history, or mandatory intake questions. Existing approvals and exclusions remain authoritative.

### F1. Finish Existing Records Before Expanding the Count

The following are direct observations from the [catalog JSON](../synthesis/02_exercise_catalog.json), identified by exact record ID. A proposed entry's inconsistency is not evidence that a currently delivered plan contains it.

| Entry or domain | What is already present | Precise recommended refinement |
|---|---|---|
| `farmer-carry` | Proposed, not a default; description says 2-4 bouts of 20-40 m or 20-40 s; `dose_unit` says `reps`; accounting currently gives CORE credit. | Represent distance and time as alternative prescriptions; specify load, rest, implement quantity, space, and intended purpose. Coach approval is needed for active status and credit, not merely changing the unit label. |
| `single-side-suitcase-carry` | Reference-only, available as a swap rather than default; observed prescriptions accumulate minutes per arm, but an inferred hint says 8-15 reps. | Preserve observed and inferred values separately; resolve the active prescription and sided-time convention. Do not invent repetitions to fit a resistance template. |
| `split-step-reaction-drill` | Proposed AP.AGI record; 4-8 bouts of 5-10 seconds, but `dose_unit` says `reps`; setup alternatives permit short open space **or** cones. | Require usable space; treat cones as optional markers, not a replacement for space. Specify stimulus, response choices, approach speed, stopping space, and counted event. Reconcile older-adult notes with the latest authority. |
| `run-intervals-2-min-fast-1-min-walk` | Live conditioning prescription, with a 5-8-round hint and generic `time / distance / calories` unit. | Structure work and recovery separately: two-minute fast bout, one-minute walking recovery, rounds, intensity anchor, and whether recovery follows the last bout. Do not infer interchangeable calories or distance from a time-based name. |
| Nordic, Copenhagen, calf/soleus/tibialis, cuff/scapular work | Several useful exercises are live; others are proposed. Regressions already occur in prose. | Link actual variants and prerequisites; approve purpose, dose, and status. "Add these missing exercises" would misrepresent the existing library. |
| Carries/drags, neck work, HYROX stations | Broad categories and many named entries already exist, often proposed. | Reconcile sport-level approval with record-level approval, then finish a representative usable set. Do not promote every proposal automatically. |

A stronger reusable prescription separates **identity, execution variant, intended quality, dose, recovery, and progression**. [Liftoscript](https://www.liftosaur.com/doc/liftoscript) and [wger routines](https://wger.readthedocs.io/en/stable/api/routines.html) demonstrate useful separation; neither provides a universal superior coaching policy. Retain Blaze's richer taxonomy and provenance.

### F2. Make Coverage a Matrix of Usable Tasks

Audit each intended outcome against approved tasks, prerequisites, valid dose units, equipment/access options, regressions, and known limitations. Mark cells **supported, conditional, proposed, or outside scope**. Here "supported" means an approved, usable prescription exists, not that its comparative superiority has been demonstrated. Retain separate coach-approval and evidence-confidence fields. A catalog name alone does not fill a cell. Priorities:

1. **Strength and hypertrophy:** major movement families and muscle coverage, with deliberate knee-flexion/hip-extension distinctions, support/ROM variants, and usable limited-equipment alternatives. Do not require one exercise for every conceivable angle.
2. **Athletic qualities:** receiving/braking, propulsive/rebound actions, explosive extension, throws, acceleration, maximum velocity, planned COD, and perception-action agility. Count contact events and limb exposures separately; distinguish sprint build-up, quality zone, and stopping space. The existing categories are the starting point, not missing concepts.
3. **Aerobic and hybrid fitness:** steady work, intervals, recovery bouts, practice-supplied conditioning, and race-specific mixed work where approved. Keep fresh-speed objectives distinct from repeated efforts under fatigue.
4. **General function:** balance, locomotion, getting up/down, carrying, usable ROM, and age-appropriate power. Identify where current exercises already serve these purposes instead of creating redundant categories.
5. **Access and adaptation:** floor-transfer needs, standing support, grip/implement requirements, seated options, overhead access, and assistance. Equipment ownership alone does not establish usability; [NCHPAD's accessible-equipment assessment](https://www.nchpad.org/resources/my-scorecard-exercise/) is a useful specialist reference. Expanded population or equipment policy is **for discussion with the coach**.

Populate only meaningful distinctions: movement plane versus resisted plane; stance versus load laterality; support; ROM/lever length; contraction/action; and parent/regression/progression relationships. Existing [variation-authoring rules](../docs/adding-exercises.md) already provide the basis. Preserve unknown values as unknown rather than manufacturing precision.

### F3. Substitutions Must Say What They Lose

The equipment model already uses `same_pattern`, `partial`, `pattern_gap`, and `zone_shift`. Extend this existing language with a concise statement of **preserves, loses, requires, dose adjustment, and approval basis**. These illustrative field names are proposals.

A pull may preserve explosive extension while removing catch practice. A supported row may preserve much of the intended pulling stimulus while changing trunk demand. A cable rotation or cross-connect roll does not preserve the released-ball component of a throw, even when it is the best approved constrained alternative. A pullover is not a complete pull-up substitute, which the existing model already acknowledges. Honest partial substitutions are useful; pretending they are equivalent is not.

Load prescriptions also need their reference: actual implement load, percentage of which lift/test, or intended effort. Rep-to-%1RM charts vary across exercises and people ([Nuzzo et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC10933212/)), and RIR estimates have error ([Halperin et al.](https://pubmed.ncbi.nlm.nih.gov/34542869/)). Preserve practical starting guidance and existing human load adjustment; do not represent an estimated load as an exact personal capacity or require failure testing to calibrate it.

### F4. Quality and Sport Practice Must Survive the Calendar

The model already has quality rules, competence gates, practice reductions, and competition buffers. The next decision is explicit precedence:

```text
Proposed athletic-stage rule:
advance = scheduled_stage_due AND prerequisite_demonstrated
otherwise: retain or regress the task using approved guidance
```

**For discussion with the coach:** reconcile this with approved stage timing and distinguish inferred gate details from approved ones. It governs advancement after the approved starting-stage decision; retain R2-ATH-03's intermediate/advanced stage-2 option, off-season restart, and maintenance-stage rule unless changed by the coach. A stopped low-quality set should not create an obligation to finish slower repetitions or make up contacts elsewhere. No specific number of successful landing holds should be advertised as a validated safety test. Broad technical progression is supported by the [NSCA weightlifting stand](https://www.nsca.com/globalassets/about/position-statements/weighlifting-for-sports-performance.pdf), not every local gate.

For each sport profile, describe what practice is likely to supply and what remains unknown: aerobic exposure, maximal-speed opportunities, jumps, braking, throws, or collisions. Unknown is neither zero nor adequate. Keep the approved practice-credit rules; a more detailed supply statement is a proposed extension, not an excuse to override R3-ATH-04/05.

Label sport recommendations as direct sport evidence, adjacent-sport inference, or coaching judgment. Improving a jump, start, serve velocity, or economy measure is not the same as improving whole-match or race performance. Most profiles should explicitly describe **physical-preparation support**, not claim to replace technical/tactical coaching. Deepen representative court/field, sprint/power, endurance, overhead, combat, and hybrid examples before adding more profile names. Appendix C provides the evidence.

### F5. Complete the General-Purpose Claim

**Aerobic dose:** existing weekly counts and Blue/Green/Orange bands are useful, but frequency alone cannot establish total aerobic dose. Specify modality, work/recovery duration, intensity anchor, and weekly exposure, including approved sport credit. The [WHO guidelines](https://www.who.int/publications/i/item/9789240015128/) recommend 150-300 moderate or 75-150 vigorous minutes per week for adults, or an equivalent combination, alongside strengthening; these are population health targets, not a mandatory starting dose or a physique optimum. A credited recreational session should not automatically imply that the guideline is fulfilled.

Fixed percentages of maximum heart rate do not place everyone in the same physiological domain ([Jamnick et al.](https://pubmed.ncbi.nlm.nih.gov/32729096/)). Keep understandable effort-based guidance and labeled uncertainty; do not require laboratory thresholds. Nor should the model acquire a universal "80/20" rule: an [individual-participant network meta-analysis](https://www.stir.ac.uk/research/hub/publication/2095779) in endurance-trained athletes found no clear overall polarized-versus-pyramidal advantage for its main outcomes, with fitness-level differences exploratory. Changes to approved conditioning prescriptions are **for discussion with the coach**.

**Function and mobility:** strength through appropriate ROM can itself improve ROM ([Alizadeh et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9935664/)); that does not prove every task-specific mobility need is covered. Identify balance, floor access, and necessary ROM goals where relevant. Avoid making dedicated corrective work mandatory for everyone.

**Population boundaries:** distinguish healthy independent use, coach-adapted participation, and specialist care. Age is a conservative policy input, not a direct measurement of competence. Pregnancy/postpartum, disability, frailty, significant disease, and return from injury require explicit supported/conditional/out-of-scope statements. This does not mean collecting diagnoses or expanding the approved intake. Broad inclusion should be an honest roadmap, not a claim of present clinical coverage.

**Injury-related language:** attach the actual studied population, dose, progression, adherence, and outcome to a named preventive protocol. Capacity training, risk-reduction programs, and rehabilitation are different purposes. Existing Nordics and Copenhagens are useful examples, not universal guarantees. Count their training cost rather than treating "prehab" as free additional work.

### F6. Media and Open Reuse

Before importing external content, record the asset's owner, original URL, applicable permission/license, attribution, version, and demonstrated variant. Current catalog media fields do not consistently carry that rights layer; one URL field even contains two links separated by a semicolon. Normalize references while keeping videos optional and the coach's personal cues distinct from contributor-written definitions.

Use [free-exercise-db's schema](https://github.com/yuhonas/free-exercise-db/blob/main/schema.json) for crosswalk ideas, not as a richer replacement; its single-equipment representation is less expressive than Blaze's alternative setups. [ExerciseDB's public repository](https://github.com/exercisedb/exercisedb-api) is useful for inspecting published sample fields, but advertised catalog size is not audited coaching coverage. [wger's license distinctions](https://github.com/wger-project/wger) illustrate why code, exercise text, and images must be checked separately. Publicly viewable media is not automatically redistributable.

## Appendix G. Validation and Publication

### G1. A Fair Definition of "Best"

The defensible ambition is the most useful **open, inspectable, reproducible foundation within declared contexts**, then better demonstrated outcomes where tested. Compare systems on multiple axes, not one invented score: authority fidelity, coverage, valid dosing, time feasibility, explainability, accessibility, reproducibility, and evidence for outcomes.

Algorithms solve different problems. [Fitbod's own description](https://fitbod.me/blog/fitbod-algorithm/) emphasizes exercise selection and capability recommendations informed by workout history. [TrainingPeaks' Performance Manager](https://www.trainingpeaks.com/learn/articles/the-science-of-the-performance-manager/) models training-load fitness/fatigue trends. Those are useful comparators for their objectives, not proof of superiority and not missing requirements for Blaze's output-only philosophy. Neither commercial description is independent comparative validation.

### G2. Benchmark Cases and Invariants

Start with coach-approved paper cases. A later independent solver or application can use the same cases, but no engine work is necessary to settle the foundation.

| Case | What must be demonstrated |
|---|---|
| Two short general-fitness sessions, with two Focus choices | Exact authorized keep/drop order; visible whole-body trade-offs; no concealed below-floor work or time expansion. Compare a proposed minimum-useful-dose policy separately, not as approved Blaze. |
| Eight- and twelve-week starts of 12, desired cap 22 | Correct growth factors, reachable endpoint, rounding, and disclosed conflict if exact arrival is mandatory. |
| Repeated L3 blocks starting at 20, cap 25 | The iterative rounding sequence and an approved saturation decision, not indefinite set escalation. |
| Compound-heavy upper-body block | Direct, helper, muscle, and group totals recomputed independently; no double counting or silent helper spill. |
| Unilateral timed core/carry work | One both-sides set under the coach's convention; both sides' execution time included; seconds/metres not interpreted as repetitions. |
| No vertical-pulling equipment | An approved partial alternative with its limitation, or a declared gap; no imaginary anchor or equipment. |
| Strength session with long rest and supersets | A feasible event timeline, realistic transitions, equipment availability, and sufficient relevant recovery. |
| Congested team-sport week; endurance athlete | Existing practice/season rules applied; aerobic credit does not imply adequate maximal-speed or landing exposure. |
| Youth, capable older athlete, restricted floor/grip access | Correct scope, approved defaults/opt-ins, supervision and task prerequisites; no age-as-competence shortcut. |
| Proposed exercise, conflicting note, or no eligible candidate | Approval precedence honored; unresolved fields remain unresolved; explicit gap instead of invented content. |

**Mathematical invariants to specify now:** same inputs and version produce the same result under a defined tie-break; record ordering and aliases do not alter canonical meaning; physically equivalent units preserve dose when equipment/increments also match; all mandatory rules hold together; no fabricated dose equivalence crosses unit families.

If extra time or equipment only enlarges the feasible set and the objective is unchanged, the optimal objective cannot worsen. This does **not** guarantee identical exercise choices or retention of every previously chosen group among tied optima. Those require an explicit stability/retention preference. Likewise, a timeout must remain "unknown," not "infeasible." On small finite examples, enumerate every feasible prescription to check claimed optima independently.

### G3. Five Evidence Gates

This is a proposed validation roadmap, not a mandatory scientific sequence. Gates 1-3 establish foundation-release readiness; gates 4-5 support later feasibility and comparative-outcome claims. Open publication with explicit limitations need not await outcome trials.

1. **Authority and semantics:** every active rule has a source, status, unit, context, and exception; each released example is reconstructible from them. Resolve, rather than bury, contradictory active statements.
2. **Mathematics and feasibility:** independently check accounting, reachability, time, eligibility, and declared exceptions across all weeks. Report sensitivity to uncertain estimates. Passing proves consistency under assumptions, not effectiveness.
3. **Independent coaching review:** coaches reconstruct and assess anonymized hypothetical cases, with disagreements and corrections retained. Use a prespecified rubric so reviewer preference is not mistaken for truth. Reporting frameworks such as [TIDieR](https://www.bmj.com/content/348/bmj.g1687) help establish reproducibility, not superiority.
4. **Practical feasibility and acceptability:** later, separately consented research can examine whether people understand and can perform the prescriptions within the claimed time and scope. Any data collection is a distinct approved research activity, not an automatic change to the no-storage model.
5. **Comparative outcomes:** only then test selected claims against competent comparators matched for goal, time, supervision, and population. Prespecify meaningful outcomes, adverse-event reporting, adherence, uncertainty, and analysis. Distinguish equal-volume comparisons of organization from equal-time comparisons of practical utility. Methods for [individual-response research](https://link.springer.com/article/10.1007/s40279-024-02050-z) caution against confusing measurement noise with genuine personalization.

### G4. Recommended Next Decisions

The highest-value next artifact is a short coach decision round, not another exercise dump. Ask for explicit rulings on: objective-specific floors; ceiling versus reachable peak; allowable plateaus and rounding; one-set and helper-spill exceptions; saturation/re-entry; quality versus calendar; group retention under time limits; and approval of the small set of incomplete high-value records. Resolve the already logged population ambiguities at the same time.

After those answers, reconcile the existing ADRs, parameter reference, catalog, and canonical narrative in one separately authorized model revision. Then publish a versioned model card, scope matrix, worked reference cases, the reconciled existing decision/parameter register with research-evidence status, and an asset-license inventory alongside the report. Do not claim "world's best" or guaranteed injury prevention. The stronger public claim is specific and auditable: what the foundation represents, which rules are approved, what it can demonstrate, and what remains uncertain.

## What Changed in This Update

The earlier expansion corrected an overly generic critique and gave proper credit to quality gates, manual adjustments, detailed sport profiles, and reasonable coaching conventions. This update adds independently checked stairway arithmetic, repeated-block saturation, exact counting and scheduling requirements, record-level library examples, general-fitness coverage, and a staged validation standard. It also recognizes the new ADR/parameter documentation rather than recommending structures that now exist.

The conclusion remains deliberately balanced: **preserve the integrated foundation, resolve its quantitative contract, finish usable coverage, and test the claims.** More elaborate mathematics cannot substitute for a justified objective; more exercise names cannot substitute for approved, reproducible prescriptions. No model policy, intake, application, or data-collection requirement was changed by this review.
