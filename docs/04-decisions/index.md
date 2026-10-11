# Decision records: index

This folder holds one short record for each big choice behind the Blaze Camp model: what was decided, who decided it, what else was considered, and what follows from it. Most decisions are the coach's, and each record gives the id of the answer where he made it. A few are team decisions about method or engineering, and they say so. Anything the coach has not confirmed is marked PROPOSED or INFERRED. Read a record when you want to know why a rule is the way it is, or before you change one.

## How to read a record

Every record has the same parts, in this order:

| Part | What it tells you |
|---|---|
| Summary | The decision in one paragraph |
| Status table | Status, who decided (answer id or team), what it replaced |
| Decision (the rule) | The rule itself, with numbers in a table |
| Why | The coach's reasoning, with short quotes and answer ids |
| Context | What led to the question |
| Options considered | The alternatives and what happened to each |
| Consequences | What follows, including the parts still PROPOSED |
| Where it lives in the data | File and JSON key |
| Related | Other records and model guides |

**Answer ids.** `CAT-01`, `VOL-09` and similar are round 1 ([coach_answers_full.md](../../coach_answers_full.md)). `R2-...` is round 2 ([coach_answers_round2.md](../../coach_answers_round2.md)). `R3-...` is round 3 ([coach_answers_round3.md](../../coach_answers_round3.md)). `R4-...` is round 4 ([coach_answers_round4.md](../../coach_answers_round4.md)). `CX-01..04` and `CT-01` are two dated clarifications he gave in conversation on 2026-10-10 ([progression](../../coach_answers_codex_2026-10-10.md), [session time](../../coach_answers_time_2026-10-10.md)). "Conversation" means things he said while the model was being built ([coach_chat_statements.md](../../coach_chat_statements.md), [coach_answers.md](../../coach_answers.md)). When two answers disagree, the newest one wins: round 4 and CT-01 first, then CX, then round 3, round 2, round 1 ([ADR-047](adr-047-authority-order-and-evidence-labels.md)). Ids like `N-PROD-21` are open product questions for the coach, listed in [synthesis/13_product_options.md](../../synthesis/13_product_options.md) §11.

**Status words.**

**Newest answers (model v1.3).** Three records came after round 3. `CX-01..04` (2026-10-10): reach the planned final sets, same sets are fine while reps or load progress, everything is editable ([ADR-049](adr-049-endpoint-priority-and-editable-progression.md)). `CT-01` (2026-10-10): do not fit plans to time ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)). Round 4 (2026-10-11, 20 answers): session size, his templates, the 2-day rule, progression wording, the library, the liability gate, profile labels and the release ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) to [ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md)). Records 001 to 048 were written before these answers. Where one of them changed, the record carries an "Update" note under its status table, and the tables below show the new status.

| Status | Meaning |
|---|---|
| Accepted | The coach decided it. The answer id is given. |
| Accepted, with parts PROPOSED | The rule is his. Some numbers or mechanics are the team's and wait for his approval. The record says which. |
| Accepted (team) | A team decision about method or engineering. Not a coaching rule. |
| In progress (team) | Team work that is under way. Not final. |
| Retired | Replaced by a later decision. Kept so nobody rebuilds it. |
| Superseded | A team decision that a later team decision replaced. Kept as history. |

**PROPOSED** means "suggested by the team, waiting for the coach's approval". **INFERRED** means "the team's reading of his sheets or answers". **LEGAL REVIEW** means the wording must go to a lawyer before it is used.

**Data keys.** "Where it lives" points to the machine-readable spec ([generator_spec_v1.json](../../generator_spec_v1.json)) and the `synthesis/` files. Keys in `model/rules.json` are the compiled copy the engine reads. Records 050 to 058 cite `model/rules.json`, because engine 0.5 was built and tested on those keys. The matching master-document section and spec key for every round-4, CT and CX answer are in [coverage_matrix_round4.md](../../coverage_matrix_round4.md). When the compiled copy and a coach answer differ, the coach answer wins.

## All records

### Product: what the tool is

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-001](adr-001-answers-in-plan-out-no-check-ins.md) | Answers in, the whole plan out. No check-ins | Accepted | Coach: R3-VOL-02, R3-VOL-04 |
| [ADR-002](adr-002-no-data-kept.md) | No data kept | Accepted | Coach: R3-GEN-01 |
| [ADR-003](adr-003-no-lifestyle-inputs.md) | No lifestyle inputs | Accepted | Coach: R2-GEN-04 |
| [ADR-004](adr-004-no-sex-field.md) | No sex field and no sex-based rules | Accepted | Coach: GEN-02, ATH-09 |
| [ADR-005](adr-005-editable-plan-switches-and-supersets.md) | The plan is a template people edit | Accepted; widened to day and week sets (CX-02, CX-04); screen mechanics PROPOSED | Coach: R3-SES-02, GEN-04, CX-02, CX-04, R4-SES-04 |
| [ADR-006](adr-006-website-not-app.md) | A phone-friendly website, not an app | Accepted (direction); not built yet | Coach: GEN-03, R2-GEN-02 |
| [ADR-007](adr-007-bilingual-english-first-full-spanish.md) | English first, with a full Spanish toggle | Accepted; Spanish lines PROPOSED until approved | Coach: GEN-01, R2-GEN-08, R3-GEN-01 |
| [ADR-008](adr-008-videos-optional.md) | Exercise videos are optional | Accepted; refined: no third-party links, a YouTube search link and a name to copy | Coach: R2-GEN-02, R4-LIB-05 |
| [ADR-009](adr-009-mit-license-and-disclaimers.md) | MIT license, with disclaimers in English and Spanish | Accepted; LEGAL REVIEW pending; credit line added in round 4 | Coach: R3-GEN-01, R4-REL-01, R4-REL-03 |
| [ADR-010](adr-010-health-check-and-release-every-build.md) | A short health check, and a "use at your own risk" tick at every build | Accepted; refined by ADR-056; LEGAL REVIEW pending | Coach: R2-GEN-03, R3-GEN-01 |
| [ADR-056](adr-056-liability-gate-before-every-plan.md) | The liability gate: accept the terms before any plan, and a release line on every plan | Accepted; wording PROPOSED, LEGAL REVIEW pending | Coach: R4-SCP-01, R4-SCP-02 |

### Categorization: how exercises and people are described

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-011](adr-011-tag-every-exercise-on-all-lenses.md) | Tag every exercise on all lenses at once | Accepted | Coach: CAT-01, CAT-02, CAT-03 |
| [ADR-012](adr-012-levels-from-load-position.md) | Exercise levels come from load position, skill and stability | Accepted | Coach: CAT-04, CAT-05, EQ-04, R2-LIB-02 |
| [ADR-013](adr-013-davidson-zones-as-tags.md) | Davidson zones are tags, not levels | Accepted; angle cut-offs INFERRED | Coach: CAT-04, CAT-10, R2-LIB-02, R2-LIB-03 |
| [ADR-014](adr-014-leg-flexion-own-segment.md) | Leg flexion is its own segment | Accepted | Coach: CAT-09 |
| [ADR-015](adr-015-library-source-of-truth-one-detail-variations.md) | His library is the source of truth; variations change one detail only | Accepted | Coach: CAT-07, GEN-04, R2-LIB-01, R2-LIB-07 |
| [ADR-054](adr-054-proposed-exercises-are-optional-add-ons.md) | Proposed exercises are optional add-ons, never the template's pick | Accepted; "maybe CrossFit" read as on, PROPOSED | Coach: R4-LIB-01, R4-LIB-02 |
| [ADR-055](adr-055-incline-preference-and-mid-range-pull.md) | Incline pressing before overhead pressing, and a mid-range pull category | Accepted; weights and two records PROPOSED | Coach: R4-LIB-03, R4-SES-05 |
| [ADR-016](adr-016-client-levels-by-training-experience.md) | Client level comes from training experience | Accepted; L3 definition PROPOSED | Coach: PRG-05, CAT-06, GEN-02 |

### Volume: how much, and how it grows

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-017](adr-017-floor-of-10-on-focus-groups.md) | A floor of 10 weekly sets, counted on focus groups | Accepted; applies from 3 training days (round 4); group credit PROPOSED | Coach: R2-VOL-06, R3-SES-01, R3-VOL-01, R4-SES-03 |
| [ADR-052](adr-052-two-day-rule.md) | Two training days a week: every big muscle, fewer sets | Accepted; small groups on 2 days PROPOSED | Coach: R4-SES-03 |
| [ADR-018](adr-018-rear-delts-part-of-shoulders.md) | Rear delts are part of the shoulders | Accepted | Coach: R3-VOL-01 |
| [ADR-019](adr-019-helper-credit-0-25.md) | Helper muscles get a quarter set | Accepted | Coach: VOL-09, LIB-16, R2-VOL-05 |
| [ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md) | Athletic work never counts as muscle sets | Accepted | Coach: VOL-10, R2-VOL-05, R3-ATH-03 |
| [ADR-021](adr-021-starting-sets-and-ceilings-by-level.md) | Starting sets and ceilings by level | Accepted; L3 start of 20, goal factors and Pro setting PROPOSED | Coach: VOL-01, UNI-01, R2-VOL-04, R2-VOL-06 |
| [ADR-022](adr-022-every-plan-is-a-stairway.md) | Every plan is a stairway | Accepted; refined: the 3 % / 5 % pattern is the usual shape, not a limit | Coach: R2-PER-03, R2-PER-04, R2-PER-05, R3-VOL-04, CX-01, R4-PRG-01, R4-PRG-02 |
| [ADR-023](adr-023-weekly-percentages-by-size-or-by-person-retired.md) | Weekly percentages by muscle size, or by the person's week | Retired | Coach: VOL-05; R2-GEN-04, R2-VOL-03; R3-VOL-02, R3-VOL-04 |
| [ADR-024](adr-024-focus-muscle-1-and-2.md) | Focus muscle 1 and Focus muscle 2 | Accepted; default of +2 PROPOSED | Coach: R3-SES-01 |
| [ADR-025](adr-025-where-a-new-set-goes.md) | Where a new set goes | Accepted; per-exercise limits PROPOSED | Coach: VOL-06, VOL-07, R3-VOL-03 |
| [ADR-026](adr-026-effort-in-reps-in-reserve.md) | Effort is given in reps in reserve | Accepted | Coach: VOL-13, GEN-08, R2-VOL-02, R2-GEN-06, R3-VOL-04 |
| [ADR-049](adr-049-endpoint-priority-and-editable-progression.md) | Endpoint priority; same-set and at-cap progression; editable day/week sets | Accepted; completed by round 4 and built in engine 0.5 | Coach: CX-01..04 |
| [ADR-053](adr-053-progression-written-as-a-rule.md) | Reps and load progress are written as a rule the person applies | Accepted; two small numbers and some wording PROPOSED | Coach: R4-PRG-01, R4-PRG-02, R4-PRG-03, R4-PRG-04, CX-01..03 |

### Sessions: what a training day looks like

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-027](adr-027-core-first.md) | Core first | Accepted | Coach: ATH-11, R2-SES-03, R3-SES-02 |
| [ADR-028](adr-028-power-first-horizontal-before-vertical.md) | Power before strength, horizontal before vertical | Accepted | Coach: ORD-01, ORD-02, ORD-03, GEN-08 |
| [ADR-029](adr-029-pairing-hip-push-knee-pull.md) | Pair hip-dominant with a push, knee-dominant with a pull | Accepted | Coach: UNI-11, ORD-06, UNI-06 |
| [ADR-030](adr-030-axial-loading-once-per-pattern.md) | Load the spine heavily once a week per pattern | Accepted | Coach: PER-04, R2-SES-01, R2-SES-02 |
| [ADR-031](adr-031-two-to-four-exercises-per-group.md) | Two to four exercises per group on its day, never one | Accepted for split days; full-body days follow the A / B template (round 4) | Coach: R2-SES-05, R2-SES-04, R3-SES-01, R4-SES-05 |
| [ADR-032](adr-032-time-vs-minimums-order.md) | When time is short, what gives, and in what order | **Retired** by ADR-050 and ADR-052 | Coach: R3-SES-02; retired by CT-01, R4-SES-01, R4-SES-03 |
| [ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) | No time-fitting. Sessions are sized by exercise count | Accepted; estimate range and defaults PROPOSED | Coach: CT-01, R4-SES-01, R4-SES-02, R4-SES-04 |
| [ADR-051](adr-051-coach-templates-are-the-skeleton.md) | The coach's own templates are the skeleton of every day | Accepted; order inside a pair PROPOSED | Coach: R4-SES-05, R4-SES-04 |

### Bilateral work and equipment

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-033](adr-033-bilateral-unilateral-scale.md) | The bilateral to unilateral scale runs from 90/10 to 10/90 | Accepted; per-sport numbers PROPOSED | Coach: UNI-02, UNI-03, UNI-10, CAT-13 |
| [ADR-034](adr-034-no-bands-no-variable-resistance.md) | No bands and no variable resistance | Accepted | Coach: EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 |
| [ADR-035](adr-035-machines-not-ranked.md) | Machines are not ranked; equipment is described by constraint | Accepted | Coach: EQ-11, EQ-13, EQ-03 |
| [ADR-036](adr-036-light-medballs.md) | Medicine balls stay light | Accepted | Coach: conversation; EQ-06, ATH-05, LIB-06 |

### Athletes and active people

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-037](adr-037-plyometric-vs-ballistic-by-ground-contact.md) | Ground-contact time decides plyometric vs ballistic | Accepted; sports he did not name INFERRED | Coach: ATH-01, R2-ATH-01, R2-ATH-02, R3-ATH-04 |
| [ADR-038](adr-038-receive-create-stages.md) | Receive-Create stages for jump training | Accepted | Coach: CAT-10, CAT-11, R2-ATH-03 |
| [ADR-039](adr-039-olympic-lifts-policy.md) | Olympic lifts for everyone in athletic training | Accepted | Coach: ATH-10, R2-ATH-04, R2-ATH-05, R2-GEN-06 |
| [ADR-040](adr-040-older-adult-defaults.md) | Defaults for older adults | Accepted; snatch reading INFERRED | Coach: ATH-09, EQ-03, R2-ATH-08, R3-ATH-02 |
| [ADR-041](adr-041-every-sport-and-stay-athletic.md) | Every popular US sport, plus a "stay athletic and active" door | Accepted; unseen profile numbers INFERRED or PROPOSED | Coach: conversation 2026-10-08; R3-ATH-01, R3-ATH-03, R3-ATH-04, R3-ATH-05 |
| [ADR-057](adr-057-sport-profile-confidence-labels.md) | Every sport profile carries a confidence label | Accepted; the sorting of profiles INFERRED | Coach: R4-SCP-03 |

### Plans and the calendar

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-042](adr-042-plan-lengths.md) | Plan lengths and what each is for | Accepted; week-by-week replacement PROPOSED | Coach: PER-01, R2-PER-01, R2-PER-02, R2-PER-06, R3-PER-01 |
| [ADR-043](adr-043-no-deload-inside-a-block.md) | No deload inside a block | Accepted | Coach: R2-VOL-07, R3-PER-01 |
| [ADR-044](adr-044-tests-at-start-and-end.md) | Tests at the start and the end, never from zero | Accepted | Coach: PER-07, R2-PER-07 |
| [ADR-045](adr-045-same-exercises-within-a-block.md) | Same exercises within a block, small changes in the next | Accepted | Coach: conversation; PER-02, PER-03, PER-04 |

### Method and engineering

| ID | Title | Status | Source |
|---|---|---|---|
| [ADR-046](adr-046-built-from-first-principles.md) | Built from first principles, not on packaged programs | Accepted | Coach: conversation; PER-01 |
| [ADR-047](adr-047-authority-order-and-evidence-labels.md) | The coach's newest answer wins, and every rule carries a label | Accepted (team) | Team |
| [ADR-048](adr-048-optimizer-rebuild-of-the-planner.md) | Rebuild the planner as an optimizer | **Superseded** by ADR-058; designed, not built | Team; coach's request in conversation and VOL-06 |
| [ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md) | Engine v0.5 is template-first. The large planner is not being built | Accepted (team); engine 0.5.0 built | Team; follows CT-01, R4-SES-01..05, R4-REL-01, R4-REL-02 |

## Retired ideas, and the record that explains each

Do not rebuild any of these. Each was considered and replaced.

| Retired idea | Replaced by | Record |
|---|---|---|
| Weekly check-in, logbook, adapting the plan from feedback | The whole plan built once | [ADR-001](adr-001-answers-in-plan-out-no-check-ins.md) |
| A tool that learns from user data; accounts; stored plans | Nothing kept | [ADR-002](adr-002-no-data-kept.md) |
| Sleep, stress and job questions | Workouts only | [ADR-003](adr-003-no-lifestyle-inputs.md) |
| A sex field | Focus muscles chosen by the person | [ADR-004](adr-004-no-sex-field.md) |
| A native app | A website | [ADR-006](adr-006-website-not-app.md) |
| A video for every exercise before launch | Videos optional | [ADR-008](adr-008-videos-optional.md) |
| Third-party video links in the public data | A YouTube search link built from the exercise name, and the name to copy | [ADR-008](adr-008-videos-optional.md) (R4-LIB-05) |
| An optional "use at your own risk" tick | Required acceptance before any plan; a release line on every plan | [ADR-056](adr-056-liability-gate-before-every-plan.md) |
| Apache-2.0 plus CC BY 4.0 licenses | MIT | [ADR-009](adr-009-mit-license-and-disclaimers.md) |
| Zone number = exercise level | Zones as tags | [ADR-013](adr-013-davidson-zones-as-tags.md) |
| Leg curls counted as hip dominant | Leg flexion segment | [ADR-014](adr-014-leg-flexion-own-segment.md) |
| Rear delts with their own sets and floor | One shoulders group | [ADR-018](adr-018-rear-delts-part-of-shoulders.md) |
| Helper credit of 0.5 | 0.25 | [ADR-019](adr-019-helper-credit-0-25.md) |
| Kettlebell swings as glute volume | Ballistic, no muscle sets | [ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md) |
| An 8-week plan with a "start hard" opening (4 + 4) | The stairway | [ADR-022](adr-022-every-plan-is-a-stairway.md) |
| Weekly step by muscle size; weekly step from the person's week | One planned stairway | [ADR-023](adr-023-weekly-percentages-by-size-or-by-person-retired.md) |
| Priority push of +4 to +6 sets as the default | Focus muscles, +1 to +3 | [ADR-024](adr-024-focus-muscle-1-and-2.md) |
| Core after the power block | Core first | [ADR-027](adr-027-core-first.md) |
| ~~One exercise per muscle on full-body days~~ (this retirement was itself changed in round 4) | Full-body days follow his A / B template, 1 to 4 per group; split days keep 2 to 4 | [ADR-031](adr-031-two-to-four-exercises-per-group.md), [ADR-051](adr-051-coach-templates-are-the-skeleton.md) |
| Session length as an input; the time check; time offers; cutting or dropping anything for minutes; exercise caps by minutes | Sessions sized by exercise count; time printed as an estimate | [ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| "Train fewer muscles directly" on short schedules | On 2 days every big muscle at about 6 to 8 sets | [ADR-052](adr-052-two-day-rule.md) |
| Day layouts invented by the engine | His A / B, push / pull / legs and other templates, slot for slot | [ADR-051](adr-051-coach-templates-are-the-skeleton.md) |
| Hard limits on the weekly step (7 % a group, under 10 % in total); "sets must rise every week"; promised reps or load per week | Reach the final sets; a note above about 15 %; a rule the person applies | [ADR-053](adr-053-progression-written-as-a-rule.md), [ADR-049](adr-049-endpoint-priority-and-editable-progression.md) |
| Proposed exercises as template picks; carries counted in reps or as muscle sets | Optional add-ons; carries by distance or time, no muscle sets | [ADR-054](adr-054-proposed-exercises-are-optional-add-ons.md) |
| Overhead press as the default vertical push for bodybuilders and the general population | Incline first; overhead stays as a variation | [ADR-055](adr-055-incline-preference-and-mid-range-pull.md) |
| The two-stage optimizer planner | Engine 0.5, template-first | [ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md) |
| Bands, chains, weight releasers | None | [ADR-034](adr-034-no-bands-no-variable-resistance.md) |
| A ranking of machines (hack squat last) | Constraint scale, no ranking | [ADR-035](adr-035-machines-not-ranked.md) |
| "Plyo zones" as a property of each jump | Receive-Create stages | [ADR-038](adr-038-receive-create-stages.md) |
| Olympic lifts for intermediate and advanced athletes only | Everyone in athletic training | [ADR-039](adr-039-olympic-lifts-policy.md) |
| 6-week building plans; week-by-week as a check-in mode | Plan types by purpose | [ADR-042](adr-042-plan-lengths.md) |
| A deload in the middle of a block; a mandatory easy week | None inside; recommended after | [ADR-043](adr-043-no-deload-inside-a-block.md) |
| One-rep-max or all-out mile tests for people starting from zero | 5-rep or 3-rep max, 80-90 % efforts | [ADR-044](adr-044-tests-at-start-and-end.md) |

## Points that still go back to the coach

These are the PROPOSED or INFERRED parts named inside the records. None of them is his rule yet.

| Point | Record |
|---|---|
| Whether learning from data stays off for good; whether the site may remember the last plan on one phone | [ADR-002](adr-002-no-data-kept.md) |
| How the plan editor works (block ids, what happens to removed sets, notes after an edit) | [ADR-005](adr-005-editable-plan-switches-and-supersets.md) |
| Free or paid; plan names shown to users | [ADR-006](adr-006-website-not-app.md) |
| Approval of every Spanish line | [ADR-007](adr-007-bilingual-english-first-full-spanish.md) |
| Attorney review of the disclaimers, health check and release | [ADR-009](adr-009-mit-license-and-disclaimers.md), [ADR-010](adr-010-health-check-and-release-every-build.md) |
| The definition of an advanced (L3) client; the Pro setting | [ADR-016](adr-016-client-levels-by-training-experience.md) |
| Group credit; how calves reach 10 sets with few leg days | [ADR-017](adr-017-floor-of-10-on-focus-groups.md) |
| Direct side-delt sets under one shoulders line | [ADR-018](adr-018-rear-delts-part-of-shoulders.md) |
| The advanced (L3) start of 20 sets; the goal and phase multipliers | [ADR-021](adr-021-starting-sets-and-ceilings-by-level.md) |
| Whether a single added set should ever be flagged as a big step; the minimum next-block step | [ADR-053](adr-053-progression-written-as-a-rule.md) |
| The default of +2 sets; Focus muscles for field athletes; Focus muscles when time is short | [ADR-024](adr-024-focus-muscle-1-and-2.md) |
| Session size for the CrossFit-style class and for the non-competitive "stay athletic" adult; the default count inside each range | [ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| The order inside an A / B pair (upper lift or leg lift first); whether athletic A / B days keep a two-leg lift in slot 2 every day; the credit of a high-incline press | [ADR-051](adr-051-coach-templates-are-the-skeleton.md), [ADR-055](adr-055-incline-preference-and-mid-range-pull.md) |
| Small muscle groups on 2 training days | [ADR-052](adr-052-two-day-rule.md) |
| Wall balls and sled pushes in the CrossFit-style class ("maybe"); neck work | [ADR-054](adr-054-proposed-exercises-are-optional-add-ons.md) |
| Whether a flagged health-check answer still stops a plan now that "everyone" may use it | [ADR-056](adr-056-liability-gate-before-every-plan.md) |
| Review of the 104 profiles that are not `confirmed_by_coach` | [ADR-057](adr-057-sport-profile-confidence-labels.md) |
| The bilateral share for each sport | [ADR-033](adr-033-bilateral-unilateral-scale.md) |
| Sports placed by the ground-contact rule without his word; which goalkeepers | [ADR-037](adr-037-plyometric-vs-ballistic-by-ground-contact.md) |
| Snatches for over-60s who opt in | [ADR-040](adr-040-older-adult-defaults.md) |
| What replaces week by week | [ADR-042](adr-042-plan-lengths.md) |
| The engine's own numbers where he gave none (listed as PROPOSED in `engine/DECISIONS.md` section G and as open questions in `samples/STATUS_v0.5.md`) | [ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md) |

## Other places decisions are written down

| Where | What it holds |
|---|---|
| [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §0, §0b, §0c, §0d | What changed in each version of the model (§0d: v1.3), and where two files disagreed |
| [engine/DECISIONS.md](../../engine/DECISIONS.md) | The engine's judgement calls (ids `C-nn`, `D-nn`, `E-nn`; section G, `G-nn`, for engine 0.5). Engine level, not model level. |
| [coverage_matrix.md](../../coverage_matrix.md), [coverage_matrix_round2.md](../../coverage_matrix_round2.md), [coverage_matrix_round3.md](../../coverage_matrix_round3.md), [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | Each coach answer traced to where it is applied. The round-4 matrix also covers CT-01 and CX-01..04. |
| [What he rejected](../01-philosophy/what-he-rejected.md) | The rejected ideas, in his words |
| [Changes across rounds](../03-coach-answers/changes-across-rounds.md) | Every place a later round changed an earlier answer |

## Adding a record

1. Copy the layout of an existing record. Use the next free number.
2. Lead with the rule. Then the why, with a short quote and the answer id. Then where it lives in the data.
3. Quote the coach exactly. Never write a statement for him.
4. Mark anything he has not confirmed as PROPOSED or INFERRED.
5. If a new answer changes an old decision, do not delete the old record. Set its status to Retired, or add a "Replaces" line to the new one, and add a row to the tables above.
