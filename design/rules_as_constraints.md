# Rules as constraints: the coach's system as a formal model

## Controlling Amendment: 2026-10-10

[Coach answers CX-01..04](../coach_answers_codex_2026-10-10.md) supersede earlier readings on the topics below. The generated rule tables, numeric parameters, metrics and counts are otherwise retained as a **historical snapshot**, not a fully migrated active inventory. In the JSON twin, `policy_amendment` identifies the overridden items. Consumers must reconcile that amendment before using an affected legacy constraint or benchmark as a current requirement; no runtime change is made here.

| Source | Approved policy | Superseded or conditional legacy items |
|---|---|---|
| CX-01 | Increase faster when needed to reach the intended endpoint instead of accepting a lower peak solely to retain the former weekly rate limit. Lambda may exceed 1; no new numerical maximum was approved. Keep the applicable set ceiling, time/equipment feasibility, execution quality and clinical scope. Proposed targets are not upgraded to approved targets. | T0-STW-02/03, T3-STW-05/06, DEF-10, SF-2, C-01/C-09, P-09/P-12, LK08 and O-01/O-09 cannot impose their old rate bounds when acceleration is needed. Standard 3%/5% weights remain a reference shape. |
| CX-02 | Occasional same-set weeks can progress reps/load; the nonsaturated accumulation block progresses overall. A rising display level alone is insufficient. | T3-STW-02/03/09, P-10/P-11 and associated hold/flat metrics do not prohibit approved plateaus. Exact climb amounts and tier weights remain proposals. |
| CX-03 | At the applicable set ceiling hold sets and progress load/reps. | DER-09, P-10/P-28 and positive minimum-climb rules require a saturation branch; use no positive set climb and no `(C-S)` division when `S=C`. |
| CX-04 | People/coaches can edit sets in any week/day. | T1-POL-14 extends to explicit set overrides. Recompute credits/time/rule compliance; the original certificate is invalid until rechecked. Do not silently discard the edit or falsely certify conflicts. No check-ins, tracking or stored personal data are introduced. |

**Implementation status:** endpoint priority, plateaus, saturation and editability are approved policy; root finding, bounded recurrence, integer scheduling, tolerance and edited-plan reporting are proposed procedures. The affected scheduler bounds and proofs in [PLANNER_SPEC](PLANNER_SPEC.md) must be revised and independently checked before release. A rate-restricted search failure is not proof of general infeasibility. Exact endpoint arrival remains subject to joint discrete/time feasibility; neither an editable plan nor a mathematical certificate predicts an individual's gains or safety.

**What this is.** Every coach rule that affects dosing (weekly sets, the stairway, floors, ceilings), ordering, exercise selection or session time, written as a numbered formal item - a hard constraint, a conditional hard constraint, a soft constraint with its priority tier, an objective term, an output obligation or a definition - with its source (coach answer id, master section, engine decision), the exact parameter values read from `model/rules.json`, and the variables it touches. The items are grouped into lexicographic priority tiers in the coach's stated order: **safety and hard rules > the R3-SES-02 policy > floors on trained groups > a monotone stairway climb > time fit > caps > exercise counts > pairing / order preferences > balance / variety**. It is the input for the planner designs (`design/design_*.md`) and for the benchmark scorer (`design/bench/score.mjs`); the machine-readable twin is `design/rules_as_constraints.json` (same ids, full parameter values, a `metric` per measurable rule).

**State of the repo.** Model 1.3.0 (rules 1.3.0), engine 0.4.0, git 4d6cc82 2026-10-09 06:29:45 -0400. Another workflow is editing `engine/`, `model/` and `samples/` (fix round 2 / F1, decisions E-135 ... E-146; the 8 sample plans were regenerated 2026-10-10 00:57 UTC) while this was written; every value below was read from `model/rules.json` when this file was generated, and sample evidence is dated where it is quoted. Values tagged PROPOSED are ours and need the coach's OK.

**In numbers.** 127 rules (T0 52, T1 14, T2 6, T3 12, T4 3, T5 9, T6 8, T7 13, T8 10), 12 definitions, 13 parameter derivations, 10 structural facts a solver can use, 15 review failure modes mapped to the rules they break, 17 conflicts that need a reading, 55 coach-tunable parameters. By kind: hard 67, output 4, hard_conditional 13, objective 10, definition 3, soft 30. By status: approved 75, approved+proposed-numbers 30, science 1, proposed 14, inferred 4, engine 1, observed 2.

**Authority order** (when sources differ, the earlier wins): coach_answers_codex_2026-10-10.md (CX-01..04, within their scope) > coach_answers_round3.md (COACH-R3, ids R3-*) > coach_answers_round2.md (COACH-R2, ids R2-*; LIB-10 / LIB-12 round-1 leftovers answered there) > coach_answers_full.md (round 1, ids CAT-, UNI-, VOL-, PER-, ATH-, ORD-, EQ-, GEN-, LIB-, PRG-, FIX-) > BLAZE_CAMP_BRAIN.md v1.2 (master; §-references) > generator_spec_v1.json / synthesis/12_volume_algorithm_v1.md v1.2 / 05 / 06 / 04 / 10 / 11 > engine/DECISIONS.md (D-xx, E-xx) and model/rules.json 1.3.0 (the values).

**Map of this file.** 1 how to read an item · 2 notation · 3 the tiers and why they interlock · 4 every rule at a glance · 5 definitions and parameter derivations · 6 the full inventory by tier · 7 the objective as a lexicographic vector · 8 structural facts a solver can use · 9 review failure modes mapped to rules · 10 conflicts that need a reading · 11 what a coach can change (tunable parameters, client preferences, locked rules) · 12 open items.

---

## 1. How to read an item

| Field | Meaning |
|---|---|
| **id** | `T<tier>-<TOPIC>-<nn>` for rules; `DEF-` definitions; `DER-` parameter derivations; `SF-` structural facts; `FM-` failure modes; `C-` conflicts; `P-` tunable parameters; `O-` open items. |
| kind **hard** | Never violated (feasibility). Most live in T0; a few structural ones are filed under their topic tier for readability (listed below) and are feasibility constraints all the same. |
| kind **hard_conditional** | Hard once a decision is taken (e.g. y_g = FULL implies the floor). Relaxed only by changing that decision through the T1 policy, never by violating it. |
| kind **soft** | Goal with a non-negative deviation variable, minimized at its tier (lexicographic: a lower tier never worsens a higher one). |
| kind **objective** | A maximize / minimize term at its tier (no target value). |
| kind **output** | An obligation on what the plan must state (offers, lists, warnings, why). Checked on the plan, costs nothing in the optimization. |
| kind **definition** | How a quantity is computed (credit, minutes, targets). Not a constraint; every constraint reads it. |
| status **approved** | Coach rule: a RIGHT chip, or a PARTLY / NOT RIGHT answer whose words define the rule (rounds 1-3). |
| status **approved+proposed-numbers** | The coach approved the rule; one or more numbers are ours (PROPOSED) - tunable. |
| status **observed** | Read from his Google Sheets / programs (OBSERVED in the synthesis files). |
| status **inferred** | Our reading of his words or data (INFERRED). |
| status **proposed** | Our design to fill a gap (PROPOSED - pending coach approval). |
| status **science** | Published research or practitioner standard (SCIENCE). |
| status **engine** | An engine decision (engine/DECISIONS.md D-xx / E-xx), PROPOSED or INFERRED. |
| **params** | `name = value (rules.path)`; long values are cut here and complete in the JSON. |
| **metric** | how the benchmark measures the rule on a plan/2 JSON, and the pass condition. |

**The tier is a conflict order, not an approval level.** Several T7 items are approved coach rules (VOL-07, R3-VOL-03); they sit low only because, when they collide with a floor or the minutes, they are what yields. Hard rules are feasibility constraints whatever tier they are filed under (a few structural hard rules are filed with their topic for readability: T1-POL-09, T1-POL-14, T3-STW-05, T3-STW-06, T3-STW-08, T3-STW-09, T4-TIME-02, T4-TIME-03, T5-CAP-01, T5-CAP-03, T5-CAP-06, T5-ATH-01, T6-CNT-04, T6-CNT-05, T6-CNT-07, T6-CNT-08).

## 2. Notation

**Index sets**

| Symbol | Meaning |
|---|---|
| b ∈ B | training blocks of the plan; type(b) ∈ {stairway, maintenance, pre_season, taper, in_season, recovery, flat_q1} |
| w ∈ W_b = {1..N_b} | weeks of block b; h_b = ⌈N_b / 2⌉ is the halfway week |
| e ∈ E_b, e(w) | exercise blocks (4-6 weeks) partitioning W_b (rules.stairway.exercise_blocks_by_N, e.g. N=12 → [1-4],[5-8],[9-12]) |
| d ∈ D | days of the template week; D^main (training), D^opt (optional), D^aer (aerobic), D^play (play / game, no gym); D^leg ⊆ D^main = days holding a quads or hips station; μ_d = chosen minutes |
| (d, d′) ∈ Π | the two exposures of one day type (A1/A2, B1/B2, Legs 1/Legs 2), d earlier in the week |
| g ∈ G | FOCUS groups {quads, hips, back, chest, shoulders, biceps, triceps, calves} (core apart); rules.muscles.groups |
| l ∈ L | stairway lines {quads, hamstrings, glutes, chest, lats_upper_back (back), shoulders, biceps, triceps, calves}; grp(l) its group (hamstrings, glutes → hips); rules.muscles.lines |
| m ∈ M | muscles of the credit map (quads, hamstrings, glutes, adductors, chest, lats_upper_back, side/rear/front delts, traps, biceps, triceps, forearms, calves, abs_obliques, neck) |
| s ∈ S_d | slots (stations) of day d; bucket β(s), role ρ(s) (work, paired_upper, secondary, accessory, nuance, survival, iso, focus, core_block, athletic, power, prehab, conditioning, circuit_station, warmup, cooldown, test), block kind κ(s), session position pos(s) |
| x ∈ X_s ⊆ X | catalog exercises eligible for slot s for this client (kit, ladder, age, pain, tags) |
| k ∈ K | athletic budget keys {plyo_contacts, jump_contacts, low_contacts, throws, cod_cuts, sprint_m, olympic_sets} |

**Decision variables**

| Symbol | Meaning |
|---|---|
| state_g ∈ {FULL=3, BELOW_FLOOR=2, PATTERN=1, NONE=0} | how group g is trained in block b (T1). y_g := [state_g = FULL]. BELOW_FLOOR and PATTERN are PROPOSED states (E-11, E-94/E-145) |
| z_{g,d} ∈ {0,1} | group g trained (as prime mover) on day d |
| u_{s,e} ∈ {0,1} | slot s holds an exercise in exercise block e |
| x_{s,e} ∈ X_s | the exercise of slot s in exercise block e (constant over the weeks of e) |
| n_{s,w} ∈ ℤ≥0 | working sets of slot s in week w |
| p_{s,s′,e} ∈ {0,1} | slots s, s′ run as a superset (on); rec_{s,s′} = recommended |
| a_{s,w} ≥ 0 | athletic dose per set (contacts, throws, cuts, metres) of an athletic slot |
| r_{s,w}, RIR_w | rep bracket and planned effort (from the tables; they set the rest class → minutes) |
| C̃_l | the realized (time-held) ceiling of line l in block b; λ_l its step scale |
| O, NT | outputs: offers and the not-trained-directly list |

**Derived quantities**

| Symbol | Meaning |
|---|---|
| c_m(x) | muscle credit of one set of x (rules.credit.classes by credit class; DEF-02..05) |
| c_l(x) = min(1, Σ_{m ∈ l} c_m(x)),  c_g(x) = min(1, Σ_{m ∈ g} c_m(x)) | line / group credit (DEF-04) |
| prime(x) | lines (groups) with summed member credit ≥ 1 (dips also prime triceps) |
| V_{l,w} = Σ_{d∈D} Σ_{s∈S_d} n_{s,w} · c_l(x_{s,e(w)});  V^main_{l,w}: d ∈ D^main only | weekly credited sets of line l |
| Q_{g,w}, Q^main_{g,w} | the same with group credit c_g (plan JSON: weeks[].weekly_sets_by_group / main_sets_by_group) |
| K_{g,d,e} = #{s ∈ S_d : u_{s,e} = 1, g ∈ prime(x_{s,e}), ρ(s) ∉ {prehab, warmup}} | exercises of group g on day d (plan JSON: weeks[].group_counts_by_day) |
| Tot_w = Σ_{resistance s} n_{s,w};  Tot^main_w | weekly resistance sets (plan JSON: total_resistance_sets / total_main_sets) |
| τ(s,w) = work(tc(s)) + rest(rc(s,w)) | minutes of one set (DEF-09) |
| Min_{d,w} | day minutes (DEF-09; plan JSON: days[].est_minutes) |
| S_l, C_l, T_l(w), λ_l | stairway start, ceiling, planned target and step scale (DEF-10, DER-*) |
| β^{reg}_e | bilateral share of region reg ∈ {lower, upper} in exercise block e (DEF-11) |
| A_{k,w}, Â_{k,w} | planned / target athletic dose of key k in week w (plan JSON: weeks[].athletic_budget.planned / .targets) |

## 3. The lexicographic tiers

| Tier | Name | Role in the model | What it holds | Coach basis |
|---|---|---|---|---|
| T0 | Safety and hard rules | feasible set | Never violated. Safety, eligibility, locked coach rules (rules.locked LK01-LK18), counting definitions, session-structure rules the coach called hard (core first, power before strength, horizontal before vertical, hip+push / knee+pull, two spine days, never 1 exercise for a trained group, one calf exercise per leg day, 12 + 2 for field athletes), the step and weekly-rise limits, test timing, athletic safety. A plan that cannot satisfy T0 is refused (refer) or its offending block is removed - never shipped with a T0 violation. | GEN-08 "Hard rules it must never break" + locked list; R2-SES-01/02; R2-SES-04; R2-SES-05; R3-SES-01 |
| T1 | R3-SES-02 infeasibility policy | which groups are trained directly (and in what state), the offers | Lexicographic maximization of the trained-group state vector in the keep order, subject to T0 and to the minimums of a trained group (floor, 2-4 per trained day, minimum climb) and to "the day holds" (minutes x fit factor). Offers (one more day, longer sessions, block toggles) are always computed and shown first. | R3-SES-02 (RIGHT): (1) tell up front + offer; (2) train fewer muscles directly, big movers first; (3) supersets; (4) never flat. "Never squeeze 2-4 exercises per muscle into a day that can't hold them." |
| T2 | Floors on trained groups | conditional hard (y_g = FULL) + soft deficit for listed exemptions | Every directly trained FOCUS group holds the floor (10; calves by the leg-day rule) on the main days in every week of a training block. | R2-VOL-06 "I don't think anybody needs less than 10 sets a week per muscle"; R3-VOL-01; R3-SES-01 |
| T3 | Stairway monotone climb | conditional hard minimum climb + soft shape | Weekly sets never drop, every trained group climbs at least the minimum climb, no long holds, the last week is the hardest, the early steps are smaller than the late ones, whole sets track the planned T(w). Athletic doses climb with the block and never drop. | R2-PER-03 (NOT RIGHT -> "steps up a stairway ... that goes for every plan"); R2-PER-04; R3-VOL-04 (RIGHT); R3-SES-02 step 4 "never flat" |
| T4 | Time fit | soft below the "day holds" band of T1 | Day minutes within the chosen session length; the x1.10 band is spent only on the minimums (T1-T3), never on extra ceiling height. Only the overrun is minimized here: terms that would reward less volume (fewer supersets, a shorter longest day, fewer exercises) sit below the ceiling attainment of T5. | UNI-09 "it has to be accounted for"; R2-SES-05 "it might be a little longer day"; R3-SES-02 "they should be able to get things done" |
| T5 | Caps (and ceiling attainment) | upper bounds + the peak height objective | Direct sets never above the line ceiling, never above the absolute 30; per-session and per-exercise limits; then reach as close to the ceiling as the minutes allow in the last week. Athletic budget caps and attainment live here. | R2-VOL-06 caps 14/22/25, priority 18/26-28/30 ("this is all customizable"); R3-VOL-04 "reaches its ceiling exactly in the last week"; R3-SES-01 Focus +1..+3 |
| T6 | Exercise counts | soft | Exercise caps by session length on split days, 3-4 per group preferred on split days, fewest exercises (sets go to existing exercises first), added exercises enter at 2 sets at an exercise-block start, Focus slots 2 x 2-3 sets. | VOL-08, VOL-16, VOL-07, ORD-11; UNI-09 "Ideally, just do not add too much" |
| T7 | Pairing, order and placement preferences | soft (several are approved coach rules; the tier only says what yields in a conflict) | VOL-07 staircase inside a day, R3-VOL-03 alternation between the two exposures of a day type, bonus / Focus placement, default orders, same- vs cross-pattern pairing, superset recommendations and straight sets by default, even exposure days, week shape and frequency. | VOL-07; R3-VOL-03 (RIGHT); ORD-04; UNI-06; ORD-05; R2-ATH-04 |
| T8 | Balance and variety | soft | Bilateral : unilateral share, push : pull, contra / ipsi, frontal / transverse, rotation bias, core planes, second exposure different, one-detail block changes, near-duplicates, exercise preference scoring. | UNI-02, UNI-03, UNI-10, CAT-13, UNI-12, R2-LIB-03, PER-02, PER-04, R2-LIB-01, VOL-18 |

**Why the tiers interlock this way (readings the designs must keep).**

1. **The policy (T1) decides *who* is trained; T2-T3 then hold for everyone trained.** The coach's R3-SES-02 order resolves a floor-vs-time conflict by training fewer groups directly, never by putting every group under the floor and never by squeezing 2-4 exercises into a day that cannot hold them. So the floor (T2) and the minimum climb (T3) are *conditional hard* constraints on a FULL group, and the minutes are part of T1's feasibility ("the day holds", x 1.10). An optimizer that ranked "keep groups" above "fit the minutes" would keep every group and overrun the day - the opposite of his rule.
2. **The minimum climb beats the minutes; the ceiling height does not.** "Never flat" (R3-SES-02 step 4) is part of a trained group's minimums, while "reach the ceiling" yields to time: the ceiling becomes "the ceiling the time holds" (12 §3.10.1 step 4). Hence T3 (monotone + minimum climb + shape) sits above T4 (time) and the peak *height* (T5-CAP-04) below it. The 10 % "a little longer day" band is spent on the minimums only (C-16).
3. **Caps sit below the climb.** When a group's week-1 structure already sits near its ceiling, the climb wins and the ceiling is raised to S + the minimum climb (cap ≥ start; E-83 first tries to start lower by training the group on fewer days - SF-9).
4. **Exercise counts sit below caps and time.** The minutes already bound the exercise count; the session caps of VOL-08 are soft on split days and give way to the 2-4 rule on full-body days (D-54). The field-athlete 12 + 2 is hard (approved R2-SES-04).
5. **Athletic work is its own budget** (it never counts toward muscles) but shares the minutes: its hard safety rules are in T0, its climb in T3, its budget caps and attainment in T5, and its priority against resistance groups when time is short in T1 (T1-POL-13).
6. **Nothing that rewards less volume sits above the ceiling attainment.** In a pre-emptive scheme each tier is frozen before the next; a term such as "fewest supersets", "shortest longest day" or "fewest exercises" placed above T5 would be satisfied by lowering every peak. So T4 holds only the overrun beyond the chosen minutes, and the straight-sets preference, even days and exercise-count economy sit in T6-T7.

## 4. Every rule at a glance

One line per rule; the full item (formal statement, parameters with their model values, variables, sources, engine references, metric) is in section 6, the machine-readable one in the JSON.

| Id | Tier | Kind | Status | Rule | Key parameters |
|---|---|---|---|---|---|
| T0-SYS-01 | T0 | hard | approved | Deterministic, outputs only, computed once | nothing stored `true`; planned only `{"note":"the generator outputs the whole plan once; people … (full value in the JSON)` |
| T0-SYS-02 | T0 | hard | approved | No lifestyle, check-in or tracking inputs; nothing kept | - |
| T0-SYS-03 | T0 | output | approved | Explainable: every dosing decision carries its reason | - |
| T0-SYS-04 | T0 | hard | approved | No sex-based rules | - |
| T0-SAFE-01 | T0 | hard | approved | Health check refers, release before every build | - |
| T0-SAFE-02 | T0 | hard | approved | No bands, chains or variable resistance | banned tokens `["band","bands","band_anchor","chains","weight_releaser"]` |
| T0-SAFE-03 | T0 | hard | approved | No V-squat | - |
| T0-SAFE-04 | T0 | hard | approved | Never to failure on heavy compounds; MAX only on small-muscle / bodyweight last sets | RIR band `[1,3]`; MAX rule `{"allowed_rep_classes":["small_muscle_isolation","rear_delt… (full value in the JSON)` |
| T0-SAFE-05 | T0 | hard | approved | Older adults (60+): the never list and the opt-in power work | from age `60`; never tags `["overhead_squat","low_bar"]` |
| T0-SAFE-06 | T0 | hard | approved | Racket players 50+ and pickleball / padel / tennis defaults | racket 50+ `{"from_age":50,"to_age":59,"racket_profiles":["rec_pickleba… (full value in the JSON)` |
| T0-SAFE-07 | T0 | hard | approved | Youth limits | youth `{"below_age":18,"max_ladder":"intermediate","olympic_floor_… (full value in the JSON)`; youth floor age `14` |
| T0-SAFE-08 | T0 | hard | approved+proposed-numbers | Pain areas: avoid tags, axial limit, refer when severe | areas `{"neck":{"muscles":[],"avoid_tags":["overhead_barbell","ben… (full value in the JSON)`; worse-with `{"overhead":{"avoid_tags":["overhead"]},"deep_knee_bend":{"… (full value in the JSON)` |
| T0-SAFE-09 | T0 | hard | approved | Medball ≤ 20 lb; no medball in the aesthetics main workout | max lb `20`; loads `{"pass_rotation":[8,10],"overhead":[6,10],"situp":[6,8],"sl… (full value in the JSON)` |
| T0-SAFE-10 | T0 | hard | approved | Equipment availability | access profiles `{"FULL_GYM":{"kit":["anchor_point","barbell","bench","box",… (full value in the JSON)`; substitution order `["pool_filtered","coach_alternates","same_pattern_other_imp… (full value in the JSON)` |
| T0-SAFE-11 | T0 | hard | approved | Library exercises only; one-detail variations; never invented | block change `{"max_share_of_slots":0.34,"keep_roles":["work","core_block… (full value in the JSON)`; swap-only statuses `["program_only","reference_only"]` |
| T0-SAFE-12 | T0 | hard | approved | Slot-type exclusions (KB swings, Olympic catches) | kb swing rule `true`; olympic rule `{"tags":["push_jerk"],"push_press_families":["athletic","hy… (full value in the JSON)` |
| T0-SAFE-13 | T0 | hard | approved | No max test from zero | from zero if `["level_L1","layoff","years_consistent_lt_1","youth"]`; catalogue `{"from_zero":{"L1":"rm_5_8","L2":"rm_3_or_5","L3":"rm_3_or_… (full value in the JSON)` |
| T0-SES-01 | T0 | hard | approved | Warm-up every session; drills never volume | warm-up `{"general":{"text_key":"warmup.any_cardio_5min","minutes":5… (full value in the JSON)` |
| T0-SES-02 | T0 | hard | approved | Core opener: 2 exercises x 2 sets, short of failure, first | exercises `2`; sets `2` |
| T0-SES-03 | T0 | hard | approved | Block order | block order `["warmup","core","test","skill","athletic","power","strengt… (full value in the JSON)`; overrides `["contrast_station","priority_small_muscle_first","core_mov… (full value in the JSON)` |
| T0-SES-04 | T0 | hard | approved | Power before strength | hard list `["H_PULL_BEFORE_V_PULL","H_PUSH_BEFORE_V_PUSH","POWER_BEFOR… (full value in the JSON)` |
| T0-SES-05 | T0 | hard | approved | Horizontal before vertical (row before pulldown, flat before overhead) | exemption `work` |
| T0-SES-06 | T0 | hard | approved | The work first; bilateral before unilateral; MYO last | hard list `["H_PULL_BEFORE_V_PULL","H_PUSH_BEFORE_V_PUSH","POWER_BEFOR… (full value in the JSON)` |
| T0-SES-07 | T0 | hard | approved | Athletic order and the speed session order | athletic order `["AP_SPRINT","AP_PLYO","AP_JUMP_LIMITED_KNEE","AP_THROW","A… (full value in the JSON)`; speed order `["squirrel_jumps","mach_acceleration","max_velocity"]` |
| T0-SES-08 | T0 | hard | approved | Hip-dominant + push, knee-dominant + pull | hip with `["RP_HPUSH","RP_VPUSH"]`; knee with `["RP_HPULL","RP_VPULL"]` |
| T0-SES-09 | T0 | hard | approved | Two spine days: heavy squat and heavy deadlift on different days, once each per week | budget `{"squat":1,"hinge":1}`; never same day `true` |
| T0-SES-10 | T0 | hard | approved | Never 1 exercise for a trained group on a day (2-4) | per group per day `[2,4]`; split days `[2,4]` |
| T0-SES-11 | T0 | hard | approved | Calves: one calf exercise on every leg day, at least 3 sets | per leg day `{"L1":3,"L2":3,"L3":3}`; calves per day `[1,1]` |
| T0-SES-12 | T0 | hard | approved+proposed-numbers | A rear-delt exercise every week while the shoulders are trained | rows minimum `1.5` |
| T0-SES-13 | T0 | hard | approved | Field athletes: 12 exercises + the 2-exercise core block | cap `12`; hard `true` |
| T0-SES-14 | T0 | hard | approved | Exercises fixed inside an exercise block (4-6 weeks) | exercise blocks by N `{"2":[[1,2]],"3":[[1,3]],"4":[[1,4]],"5":[[1,5]],"6":[[1,6]… (full value in the JSON)` |
| T0-SES-15 | T0 | hard | approved+proposed-numbers | Sets per exercise: 2 to 4 (L1) / 5 (L2-L3), isolation ≤ 4 | min `2`; max `{"L1":4,"L2":5,"L3":5}` |
| T0-SES-16 | T0 | hard | approved+proposed-numbers | Superset legality | never `["two_lower_compounds","heavy_and_fatiguing_same_muscle"]`; pairs `[["knee","pull"],["hip","push"],["ISO_BICEP","rear"],["ISO_… (full value in the JSON)` |
| T0-SES-17 | T0 | hard | approved | Day spacing around play and games; an OFF day | in-season gap `48`; play gap `48` |
| T0-EFF-01 | T0 | hard | approved | Planned effort inside 1-3 RIR, drifting 3 → 1 RIR, never rising | band `[1,3]`; map `{"2":{"min":2,"max":2},"3":{"min":3,"max":3},"1-2":{"min":1… (full value in the JSON)` |
| T0-EFF-02 | T0 | hard | approved+proposed-numbers | Intensifiers: last stairway week only, one a day, MYO on the last eligible item | intensifiers `{"last_week_only":true,"per_day":1,"kind":"myo","also_max":… (full value in the JSON)`; myo `{"last_item_of_day_only":true,"requires":["isolation_or_con… (full value in the JSON)` |
| T0-EFF-03 | T0 | hard | approved | Rest by class (VOL-14) - the input of every minute estimate | rest `{"hypertrophy_s":[60,120],"hypertrophy_max_s":180,"isolatio… (full value in the JSON)` |
| T0-EFF-04 | T0 | hard | approved | Lift-style preference moves reps, never weekly sets | preference `{"volume_lighter":{"big_compound_shift":1},"balanced":{"big… (full value in the JSON)` |
| T0-EFF-05 | T0 | hard | approved | Olympic doses: the ramp, full catches 3-5 reps, % only when tested | ramp `[{"pct":75,"sets":4,"reps":8},{"pct":80,"sets":4,"reps":6},… (full value in the JSON)`; full catch reps `[3,5]` |
| T0-EFF-06 | T0 | hard | approved | Strength roles: the work, the accessory, the nuance, the survival | strength roles `{"work":[1,1],"accessory":[2,2],"nuance":"max","survival":"… (full value in the JSON)`; never cut roles `["core_block","work","paired_upper","survival"]` |
| T0-EFF-07 | T0 | hard | approved | Rep phases and the rep matrix (they set the rest, therefore the minutes) | athlete VOL phases `{"by_exercise_block":["VOL1","VOL2","VOL3"],"pre_season":"V… (full value in the JSON)`; goal column `{"muscle":"hypertrophy","strength":"strength","athletic":"a… (full value in the JSON)` |
| T0-STW-01 | T0 | hard | approved | No deload or maintenance week inside a training block | recovery `{"sets_factor":0.5,"of":"hardest_week","round":"up","min_se… (full value in the JSON)` |
| T0-STW-02 | T0 | hard | approved | Planned step ≤ 7 % a week per line | planned step max `0.07`; hand-set max `0.07` |
| T0-STW-03 | T0 | hard | approved+proposed-numbers | Weekly total resistance sets rise below 10 % (one whole set excepted) | total ceiling `0.1`; strict `true` |
| T0-STW-04 | T0 | hard | approved | Flat blocks have no steps; week 1 has no step | phase factors `{"pre_season":{"of":"last_offseason_week_sets","factor":0.6… (full value in the JSON)` |
| T0-STW-05 | T0 | hard | approved | Calendar: holidays between blocks, event and meet tapers, pre-season | season `{"weeks_to_season":{"OFF_EARLY":20,"OFF_BUILD":12,"OFF_LATE… (full value in the JSON)`; prep / events `{"step_every_weeks":2,"taper_weeks":[1,2],"taper_volume_cut… (full value in the JSON)` |
| T0-TST-01 | T0 | hard | approved | Tests only at the start and the end; the test is the top set | when `{"baseline":"week_1_of_each_stairway","end":"last_week_of_e… (full value in the JSON)`; replaces top set `{"back_off_rir_add":1,"back_off_rir_min":2}` |
| T0-ATH-01 | T0 | hard | approved | Olympic lifts in every athletic week, level-matched, ≤ 4 exposures | per week max `4`; day pattern `{"clean":"knee","loaded_jump":"knee","snatch":"hip","swing"… (full value in the JSON)` |
| T0-ATH-02 | T0 | hard | approved+proposed-numbers | Receive-Create stages aligned to exercise blocks, never backwards | stages `{"2":{"RC1":[1,1],"RC2":[2,2],"RC3":null},"3":{"RC1":[1,1],… (full value in the JSON)`; alignment `{"rule":"majority_of_weeks_ties_lower_one_step_at_a_time","… (full value in the JSON)` |
| T0-ATH-03 | T0 | hard | science | Contacts per session and plyo spacing | contacts cap `{"L1":80,"L2":100,"L3":120}`; plyo sessions `[2,3]` |
| T0-ATH-04 | T0 | hard | approved | In-season game-heavy and heavy play weeks | game heavy `{"sports":["basketball","volleyball","soccer","american_foo… (full value in the JSON)`; heavy play `{"min_play_sessions":3,"plyo_factor":0.5,"extra_cod":false,… (full value in the JSON)` |
| T0-ATH-05 | T0 | hard | approved | Sport defaults the coach approved (swimming, HYROX) | hyrox `{"station_ids":["sled-push","sled-rope-pull-hand-over-hand"… (full value in the JSON)` |
| T1-POL-01 | T1 | hard_conditional | approved+proposed-numbers | The minimums of a directly trained group | floor F `10`; min climb `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"gr… (full value in the JSON)` |
| T1-POL-02 | T1 | hard_conditional | approved+proposed-numbers | "The day holds": minutes within the fit factor, with every eligible pair supersetted, at the peak week | fit factor `1.1`; long-day warn `1.1` |
| T1-POL-03 | T1 | objective | approved | Step 0: the full level plan when it fits | - |
| T1-POL-04 | T1 | output | approved+proposed-numbers | Step 1: tell up front and offer (before the plan) | offers `["offer.more_days","offer.longer_sessions","offer.keep_time… (full value in the JSON)`; round minutes to `5` |
| T1-POL-05 | T1 | objective | approved+proposed-numbers | Step 2: keep the time - train fewer groups directly, in the keep order | keep first `["focus","profile_priority"]`; keep order `["hips","quads","back","chest","shoulders","calves","tricep… (full value in the JSON)` |
| T1-POL-06 | T1 | objective | proposed | Room cuts before groups: what leaves the day first | cut orders `{"aesthetics":[{"id":"focus","match":{"role":["focus"]}},{"… (full value in the JSON)`; never cut `{"roles":["core_block","work","paired_upper","survival"],"b… (full value in the JSON)` |
| T1-POL-07 | T1 | hard_conditional | proposed | Pattern coverage: big movers not trained directly keep their movement (anti over-cut) | pattern keep `{"buckets":{"back":"RP_HPULL","chest":"RP_HPUSH","quads":"R… (full value in the JSON)` |
| T1-POL-08 | T1 | objective | proposed | Relaxed states: a big mover below its floor on its work lift; the class lift | class lift `{"families":["hybrid_crossfit"],"roles":["work"],"sets":3,"… (full value in the JSON)` |
| T1-POL-09 | T1 | hard | approved | Never squeeze: a group leaves a day rather than taking 1 exercise | - |
| T1-POL-10 | T1 | output | approved | Groups not trained directly are listed honestly, with their compound credit | - |
| T1-POL-11 | T1 | output | approved | Step 3: supersets recommended, "needed" when the fit depends on them | recommend `{"pairs":[["knee","pull"],["hip","push"],["ISO_BICEP","rear… (full value in the JSON)` |
| T1-POL-12 | T1 | hard_conditional | approved+proposed-numbers | Step 4: the stairway climbs on every trained group, to the ceiling the time holds | min climb `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"gr… (full value in the JSON)` |
| T1-POL-13 | T1 | objective | proposed | Athletic blocks inside the policy: protected for competitive athletes, room for stay-active | track protection `competitive_only`; stay-active cuts `[{"id":"olympic_over_budget","match":{"olympic_over_budget"… (full value in the JSON)` |
| T1-POL-14 | T1 | hard | approved | User edits are constraints on a rebuild; the person's choice wins | block editing `{"id_format":"blk.<weekday>-<day_type slug>.<kind>.<n>","to… (full value in the JSON)` |
| T2-FLR-01 | T2 | hard_conditional | approved | Floor of 10 weekly sets on every directly trained FOCUS group | F `10`; counted on `main_days` |
| T2-FLR-02 | T2 | hard_conditional | approved+proposed-numbers | Calves floor from leg days | weekly floor `10`; per leg day `{"L1":3,"L2":3,"L3":3}` |
| T2-FLR-03 | T2 | definition | inferred | Which line carries a group's floor | carriers `{"quads":["quads"],"hips":["hamstrings","glutes"],"back":["… (full value in the JSON)` |
| T2-FLR-04 | T2 | hard_conditional | approved+proposed-numbers | Field athletes: chest, back, shoulders floored; arms credit-only | field_off `{"lower":0.7,"upper":0.5,"small":0.6,"credit_only":["biceps… (full value in the JSON)` |
| T2-FLR-05 | T2 | soft | proposed | Deficit of a listed below-floor group (minimize) | F `10` |
| T2-FLR-06 | T2 | hard_conditional | engine | Week 1 is planned from the structure, never below the floor | group-day reduction `{"enabled":true,"keep_roles":["work","core_block","survival… (full value in the JSON)` |
| T3-STW-01 | T3 | hard_conditional | approved | Never down: planned targets and weekly sets of trained groups never drop | - |
| T3-STW-02 | T3 | hard_conditional | approved+proposed-numbers | Minimum climb (never flat) | min climb `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"gr… (full value in the JSON)` |
| T3-STW-03 | T3 | soft | proposed | No long holds; the second half climbs; the main days carry the climb | hold rules `{"min_N":8,"min_climb":3,"hold_extra_weeks":1,"main_days":t… (full value in the JSON)`; track `{"week1_above_target_max":1,"behind_target_max":1,"flat_tot… (full value in the JSON)` |
| T3-STW-04 | T3 | hard_conditional | approved | The last week is the hardest; on 12 weeks the last four are the hardest | - |
| T3-STW-05 | T3 | hard | approved | The stairway shape: small steps to the halfway week, bigger after it | steps `{"early":0.03,"late":0.05}`; halfway `ceil(N/2)` |
| T3-STW-06 | T3 | hard | approved+proposed-numbers | λ peak anchoring: the peak lands in the last week | λ `{"solve":"bisection","lo":0,"hi":1,"iterations":60,"display… (full value in the JSON)` |
| T3-STW-07 | T3 | soft | approved+proposed-numbers | Whole sets track the planned stairway ("round up, round down") | release rounding `{"mode":"scheduled"}`; release `{"threshold":1,"epsilon":1e-9,"bank_max_blocked":1.99,"stag… (full value in the JSON)` |
| T3-STW-08 | T3 | hard | approved | Start from the larger of the table start and the week-1 sets; no restart at exercise blocks | continues across exercise blocks `true` |
| T3-STW-09 | T3 | hard | approved | Stair level rises every week; Focus does not slow the others | slow others `false`; non-priority cap (push only) `0.03` |
| T3-STW-10 | T3 | hard_conditional | proposed | Timed circuits climb by work seconds | bootcamp stairway `{"work_s_start":35,"work_s_max":50,"work_s_step":5,"rounds_… (full value in the JSON)` |
| T3-ATH-01 | T3 | hard_conditional | approved+proposed-numbers | The athletic stairway: doses climb with the block and never drop | reconcile `{"enabled":true,"tolerance":0.25,"olympic_max_factor":1.5,"… (full value in the JSON)`; olympic sets `{"from_budget":true,"min_per_exposure":2,"max_per_exposure"… (full value in the JSON)` |
| T3-ATH-02 | T3 | soft | approved+proposed-numbers | Plyometric share ramps from block start to block end | contact classes `{"1":{"end":0.75},"2":{"end":0.6},"3":{"end":0.5},"4":{"end… (full value in the JSON)`; start offset `-0.15` |
| T4-TIME-01 | T4 | soft | approved+proposed-numbers | Days within the chosen minutes | warn above `1.1`; error above `1.25` |
| T4-TIME-02 | T4 | hard | approved+proposed-numbers | Session lengths and defaults | allowed `[30,45,60,75,90,105,120]`; defaults `{"athletes_bodybuilders_powerlifters":90,"general_fat_loss"… (full value in the JSON)` |
| T4-TIME-03 | T4 | hard | approved | Bootcamp and class formats keep their own minutes | bootcamp `{"circuits":2,"stations":[4,6],"rounds":[3,5],"work_s":[30,… (full value in the JSON)`; WOD minutes `[10,20]` |
| T5-CAP-01 | T5 | hard | approved+proposed-numbers | Direct sets never above the line ceiling (helper spill-over ≤ 1) | cap table `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L… (full value in the JSON)`; cap rule `cap = max(round_half_up(cap[m][L] x factor), start + round_… (full value in the JSON)` |
| T5-CAP-02 | T5 | definition | approved+proposed-numbers | How a ceiling is computed | cap `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L… (full value in the JSON)`; cap rule `cap = max(round_half_up(cap[m][L] x factor), start + round_… (full value in the JSON)` |
| T5-CAP-03 | T5 | hard | approved+proposed-numbers | Absolute ceiling 30 sets a week for any line (Pro setting excepted) | absolute cap `30`; Pro setting `{"enabled_by_default":false,"min_level":"L3","muscles_max":… (full value in the JSON)` |
| T5-CAP-04 | T5 | objective | approved | Ceiling attainment: as close to the ceiling as the minutes allow, in the last week | cap `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L… (full value in the JSON)` |
| T5-CAP-05 | T5 | soft | proposed | Per-session sets per line ≤ 11 (Focus / priority 14) | per session `{"soft":11,"priority":14}` |
| T5-CAP-06 | T5 | hard | approved | Focus muscles: at most 2, +1 to +3 each | focus `{"max":2,"add_default":2,"add_range":[1,3],"applies_to":["s… (full value in the JSON)`; priority `{"L1":2,"L2":2,"L3":2}` |
| T5-ATH-01 | T5 | hard | proposed | Athletic budget never exceeded | tolerance `0.25`; olympic max factor `1.5` |
| T5-ATH-02 | T5 | objective | proposed | Athletic budget attainment (and an honest warning when the minutes cannot hold it) | tracks `{"from_budget":true,"per_station":{"jumps":16,"throws":20,"… (full value in the JSON)` |
| T5-ATH-03 | T5 | soft | approved | Change of direction for every athlete, by turn angle | COD `{"sport_only_field":"athletic.sport_only","no_cuts_field":"… (full value in the JSON)`; COD dosing `{"reps_from_cuts_per_rep":true,"reactive_drill_ids":["split… (full value in the JSON)` |
| T6-CNT-01 | T6 | soft | approved | Exercise cap by session length (split days) | cap by minutes `{"30":4,"45":5,"60":7,"75":9,"90":9,"105":9,"120":9}`; applies to `split_days_only` |
| T6-CNT-02 | T6 | soft | approved | 3-4 exercises per group on split days; full-body days start at 2 | split day `[2,4]` |
| T6-CNT-03 | T6 | objective | approved | Fewest exercises: a new set goes to an existing exercise first | order rule `first_below_first` |
| T6-CNT-04 | T6 | hard | approved+proposed-numbers | Added exercises enter at 2 sets, only at an exercise-block start | added slots `{"entry_sets":2,"only_at_exercise_block_start":true,"big_li… (full value in the JSON)` |
| T6-CNT-05 | T6 | hard | approved | Optional-day Focus slots: up to 2 x 2-3 sets | optional days `{"stairway_sets":false,"focus_slots_max":2,"focus_sets":[2,… (full value in the JSON)` |
| T6-CNT-06 | T6 | definition | approved | Default sets when a slot starts | default sets `{"compound":3,"isolation":2,"calves_first":2,"calves_second… (full value in the JSON)`; work min sets `3` |
| T6-CNT-07 | T6 | hard | approved | Field-athlete day split inside the 12 | split `{"share_counts":{"plyometric":["plyo_contacts","low_contact… (full value in the JSON)` |
| T6-CNT-08 | T6 | hard | proposed | Joint care: at most 2 items a day, outside the exercise count | per day `2` |
| T7-PLC-01 | T7 | soft | approved | Inside a day: the coach's staircase (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3) | order rule `first_below_first` |
| T7-PLC-02 | T7 | soft | approved | Between the two exposures of a day type: alternate (Monday first, then Thursday) | day rotation `alternate_same_day_type` |
| T7-PLC-03 | T7 | soft | approved | Small-muscle extras become a bonus exercise on the optional day (or a day already training it) | bonus `{"sets":2,"for":"small","prefer":["optional_day","day_train… (full value in the JSON)`; optional-day calves below leg days `4` |
| T7-PLC-04 | T7 | soft | proposed | Big lines climb on the main days; only a Focus line may climb on the optional day | main days first `true`; optional days `{"stairway_sets":false,"focus_slots_max":2,"focus_sets":[2,… (full value in the JSON)` |
| T7-PLC-05 | T7 | soft | proposed | Laterality-aware placement | tolerance `0.03` |
| T7-ORD-01 | T7 | soft | approved | The Focus muscle's exercise first in its session; isolation first only as a priority | first in session `true` |
| T7-ORD-02 | T7 | soft | approved | Clean family on knee days, snatch family on hip days | day pattern `{"clean":"knee","loaded_jump":"knee","snatch":"hip","swing"… (full value in the JSON)` |
| T7-ORD-03 | T7 | soft | observed | Default orders inside the strength block | - |
| T7-PAIR-01 | T7 | soft | approved | Same-pattern vs cross-pattern pairing by goal | same pattern `{"goals":["muscle","strength"],"ath03_groups":["size_streng… (full value in the JSON)`; cross pattern `{"goals":["fat_loss","general","athletic","active","hybrid"… (full value in the JSON)` |
| T7-PAIR-02 | T7 | soft | approved+proposed-numbers | Superset pairs and contrast | pairs `[["knee","pull"],["hip","push"],["ISO_BICEP","rear"],["ISO_… (full value in the JSON)`; contrast `{"min_level":"L2","season":["OFF_EARLY","OFF_BUILD","OFF_LA… (full value in the JSON)` |
| T7-WEEK-01 | T7 | soft | observed | Week shape and frequency | optional days `free_weekdays_nearest_template_day_skipping_play_and_game_d… (full value in the JSON)` |
| T7-PAIR-03 | T7 | objective | approved+proposed-numbers | Straight sets by default; supersets only when needed (or by trigger) | default `straight_sets`; triggers `{"short_session":true,"l3_preference":true,"athlete_off_sea… (full value in the JSON)` |
| T7-WEEK-02 | T7 | soft | inferred | Even exposure days; cuts come off the most loaded day | - |
| T8-BAL-01 | T8 | soft | approved+proposed-numbers | Bilateral : unilateral share by profile, phase and exercise block | profiles `{"bb_pl":{"lower":{"by_exercise_block":[0.5,0.8,0.9]},"uppe… (full value in the JSON)`; tolerance `0.03` |
| T8-BAL-02 | T8 | soft | approved | Upper-body laterality by the same logic | profiles `{"bb_pl":{"lower":{"by_exercise_block":[0.5,0.8,0.9]},"uppe… (full value in the JSON)` |
| T8-BAL-03 | T8 | soft | proposed | Push : pull balance | - |
| T8-BAL-04 | T8 | soft | approved | Balanced groups (no unintended bias) | - |
| T8-BAL-05 | T8 | soft | approved+proposed-numbers | Contralateral / ipsilateral, frontal / transverse, rotation bias, core planes | contra / ipsi `{"cod_contralateral_share":0.7,"sprinter_ipsilateral_share"… (full value in the JSON)`; frontal / transverse `{"default_share_from_profile":true,"court_combat_share":[0.… (full value in the JSON)` |
| T8-VAR-01 | T8 | soft | approved | Second weekly exposure of a slot = a different exercise of the same category | second exposure different `true` |
| T8-VAR-02 | T8 | soft | approved+proposed-numbers | Block-to-block changes: one or two small variables, never all at once | block change `{"max_share_of_slots":0.34,"keep_roles":["work","core_block… (full value in the JSON)` |
| T8-VAR-03 | T8 | soft | inferred | No near-duplicates in a session; week families | near duplicate `{"scope":"day","week_scope_kinds":["isolation","focus"],"tr… (full value in the JSON)` |
| T8-VAR-04 | T8 | objective | inferred | Exercise preference scoring | weights `{"default_in_slot":3,"preference_match":1.5,"constraint_in_… (full value in the JSON)` |
| T8-VAR-05 | T8 | soft | approved | A/B lead-lift weeks for clients who want variety; aerobic colours | variety A/B `{"lead_lift_alternates":true}` |

## 5. Definitions and parameter derivations

### DEF-01 · Hard set (the counting unit)

*approved* - A working set at 1-3 reps in reserve, 5-30 reps. Warm-up sets and A-drills never count; the light core-opener sets count toward abs.

```
hard(set) ⟺ RIR ∈ [1,3] (MAX = 0 RIR allowed only where T0-SAFE-04 allows) ∧ reps ∈ [5,30]; ρ(s) ∈ {warmup} ⇒ n_{s,w} contributes 0 to every V, Q.
```
- **Params:** RIR band = `[1,3]` (`rules.effort.rir_band`); warm-up counts as volume = `false` (`rules.warmup.counts_as_volume`); core opener counts to abs = `true` (`rules.core_block.counts_to_abs`)
- **Sources:** VOL-04; VOL-13; ORD-08; R2-SES-03; BRAIN §5.1 V1

### DEF-02 · Credit map: prime 1.0, helpers 0.25, the coach exceptions

*approved* - Main mover 1.0 set, helpers 0.25. Squats / lunges / deadlifts / RDLs give glutes 0.25; hip thrusts and bridges 1.0 glutes; dips 0.5 triceps + 0.5 chest; thruster 1.0 quads + 0.5 front delts + 0.25 glutes; leg curl / leg extension count fully; face pull rear 1.0 + side 0.25 (split PROPOSED); curls 0.25 forearms.

```
c_m(x) = rules.credit.classes[class(x)][m] (0 if absent).
```
- **Params:** helper = `0.25` (`rules.credit.helper`); class map = `{"BKD":{"quads":1,"glutes":0.25,"adductors":0.25},"UKD":{"quads":1,"glutes":0.25,"adductors":0.25},"BHD":{"ha… (full value in the JSON)` (`rules.credit.classes`); exceptions = `{"DIPS":"R2-VOL-05 / LIB-16: 0.5 triceps + 0.5 chest","THRUSTER":"R2-VOL-05: 1.0 quads + 0.5 shoulders + 0.25… (full value in the JSON)` (`rules.credit.exceptions`)
- **Sources:** VOL-09; LIB-14; LIB-16; CAT-09; R2-VOL-05; R2-LIB-04; LIB-10; BRAIN §5.2; 12 §3.1

### DEF-03 · Athletic and ballistic work credits no muscle

*approved* - Plyos, ballistics (KB swings included), throws, Olympic lifts, sprints, change of direction, HYROX station circuits, wall balls: 0 muscle sets. Locked (LK07).

```
β(s) ∈ athletic_slot_buckets ∨ tags(x) ∩ never_credit_tags ≠ ∅ ⇒ c_m(x) = 0 ∀m.
```
- **Params:** athletic buckets = `["SKILL","AP_PLYO","AP_JUMP_LIMITED_KNEE","AP_SPRINT","AP_THROW","AP_COD","AP_TRIPLE_EXT","COND_AEROBIC","CON… (full value in the JSON)` (`rules.credit.athletic_slot_buckets`); never-credit tags = `["kb_swing","wall_ball"]` (`rules.credit.never_credit_tags`)
- **Sources:** VOL-10; R2-VOL-05; R3-ATH-03; LK07; BRAIN §5.1 V4

### DEF-04 · Group credit: a set counts at most 1.0 to a line or a group

*approved+proposed-numbers* - Hips = glutes + hamstrings, shoulders = front + side + rear delts (+ traps). An RDL is one hips set (not 1.25); a face pull one shoulder set; a horizontal press 0.25 shoulders.

```
c_l(x) = min(1, Σ_{m ∈ members(l)} c_m(x));  c_g(x) = min(1, Σ_{m ∈ members(g)} c_m(x)).
```
- **Params:** group members = `{"quads":["quads"],"hips":["glutes","hamstrings"],"back":["lats_upper_back"],"chest":["chest"],"shoulders":["… (full value in the JSON)` (`rules.muscles.groups.members`); line definitions = `{"quads":{"members":["quads"],"class":"big","region":"lower","group":"quads"},"hamstrings":{"members":["hamst… (full value in the JSON)` (`rules.muscles.lines.defs`)
- **Sources:** R3-VOL-01; R3-SES-01; 12 §3.3 (group credit PROPOSED); E-03

### DEF-05 · A 10/10 unilateral set is one set; alternating = unilateral

*approved* - 3 x 10/10 split squats = 3 quad sets. Unilateral sets cost about 1.5x the time (DEF-09).

```
unilateral or alternating x: n_{s,w} counts once toward c (not per side).
```
- **Params:** unilateral set value = `1` (`rules.credit.unilateral_set`)
- **Sources:** UNI-01; UNI-07; PRG-07

### DEF-06 · MYO sets do not change set counts

*engine* - A MYO set is reported as 2 equivalent sets for display only; it never changes V, Q, caps or floors.

```
myo(s,w) ⇒ V, Q unchanged; myo_equivalent_sets reported.
```
- **Params:** myo set value (display) = `2` (`rules.credit.myo_set_value`)
- **Sources:** VOL-15; D-13

### DEF-07 · Joint care (prehab) credits no muscle

*proposed* - Easy face pulls, Y-T raises, soleus / tibialis raises done as joint care are survival work, not hard sets toward the floor.

```
ρ(s) = prehab ⇒ c_m(x_s) := 0 for V, Q.
```
- **Params:** prehab credits = `none` (`rules.prehab.credits`); prehab counts in exercise cap = `false` (`rules.prehab.counts_in_cap`)
- **Sources:** ORD-07; E-89; R3-VOL-01

### DEF-08 · Trained directly / exercises of a group on a day

*approved* - A group is trained on a day when a station on that day has it as prime mover (joint care and kept pattern stations excluded). A group left to compound credit, a credit-only line and a kept pattern station are not "trained that day".

```
z_{g,d} = [K_{g,d,e} ≥ 1];  y_g = [state_g = FULL];  PATTERN stations and credit_only lines excluded from K and from the floor.
```
- **Params:** groups = `["quads","hips","back","chest","shoulders","biceps","triceps","calves","core"]` (`rules.muscles.groups.order`)
- **Sources:** R3-SES-01; R3-SES-02; 12 §3.10

### DEF-09 · The time model (minutes of a set, a superset, a day)

*proposed* - A set costs its work time plus the rest it is dosed with. A superset pair works back to back and shares one rest (the longest). A day = warm-up + core + every block, changeovers included.

```
τ(s,w) = work_minutes[tc(s)] + rest_class_minutes[rc(s,w)], tc = time class (unilateral pick → compound_unilateral / isolation_unilateral), rc = strength for heavy work lifts (strength / class family, heavy_powerlifting style, athletes VOL3 bilateral main compound), else by tc.
straight(s) = n_{s,w}·τ(s,w) + co,  co = changeover_min_per_exercise.
superset(P) = Σ_{k=1}^{max_s n_s} [ Σ_{s∈P: n_s ≥ k} work(s) + max_{s∈P: n_s ≥ k} rest(s) ] + co_pair·|P|.
Min_{d,w} = warmup + skill_in_warmup + Σ_straight + Σ_supersets + athletic / Olympic / conditioning / circuit / aerobic add-on minutes + test minutes (work-up 10).
```
- **Params:** work minutes = `{"compound_bilateral":0.75,"compound_unilateral":1.5,"isolation":0.6,"isolation_unilateral":1.2,"core_set":0.… (full value in the JSON)` (`rules.time_model.work_minutes`); rest class minutes = `{"strength":4.5,"olympic":2.5,"hypertrophy":1.5,"isolation":1.25,"core":0.75,"plyo":1.25,"throw":1.1,"cod":1.… (full value in the JSON)` (`rules.time_model.rest_class_minutes`); rest class by time class = `{"compound_bilateral":"hypertrophy","compound_unilateral":"hypertrophy","isolation":"isolation","isolation_un… (full value in the JSON)` (`rules.time_model.rest_class_by_time_class`); changeover per exercise = `1` (`rules.time_model.changeover_min_per_exercise`); changeover in a pair = `0.5` (`rules.time_model.changeover_in_superset_pair`); warm-up per session = `8` (`rules.time_model.minutes_per_set.warmup_session`); skill folded in warm-up = `6` (`rules.time_model.skill_in_warmup_min`); skill at ≤45 min = `{"at_or_below_minutes":45,"min":3}` (`rules.time_model.skill_in_warmup_short`); test work-up = `10` (`rules.time_model.test_workup_minutes`); test items = `{"jumps":6,"sprint":8,"cod":8,"cardio":15}` (`rules.time_model.test_item_minutes`); aerobic add-on = `{"A":15,"B":20,"C":30,"LC":20}` (`rules.time_model.aerobic_addon_minutes`); superset rule = `pair_shares_rest` (`rules.time_model.superset_rule`); strength rest for = `["work_heavy","class_model_work","strength_family_work"]` (`rules.time_model.strength_rest_for`)
- **Sources:** UNI-09; VOL-14; ORD-08; R2-SES-05; R3-SES-02; E-09; E-142; engine/timefit.mjs setCost / supersetMinutes

### DEF-10 · The planned stairway T_l(w)

*approved policy, proposed numerical procedure (CX-01/03)* - Use the standard 3%/5% weights as a reference shape; reach the intended endpoint by accelerating when needed, without raising the applicable set ceiling. Choose an endpoint P through the joint feasibility policy, not by silently truncating it at standard-rate growth. For positive S and N>=2, the continuous endpoint equation has one nonnegative root for every P>=S; this does not prove an integer prescription fits the time.

```
h = ⌈N/2⌉; s_w = 0.03 (2 ≤ w ≤ h), 0.05 (h < w ≤ N); G(N) = Π_{w=2..N}(1 + s_w).
S_l = actual credited start; P_l = intended, jointly feasible endpoint; S_l <= P_l <= applicable ceiling.
If P_l = S_l: lambda_l = 0 (saturation or an explicitly flat regime).
If P_l > S_l: solve S_l*product(1 + lambda_l*s_w) = P_l with lambda_l >= 0, including lambda_l > 1 when needed.
T_l(1) = S_l;  T_l(w) = T_l(w−1)·(1 + λ_l s_w).
```
- The bounded bracket `[0,1]` and fixed numerical recipe in the historical params below are superseded when acceleration is needed. Root bracketing, precision, discrete allocation and endpoint tolerances must be verified; no new numeric rate ceiling is approved.
- **Params:** early / late step = `{"early":0.03,"late":0.05}` (`rules.stairway.standard_steps`); halfway = `ceil(N/2)` (`rules.stairway.halfway`); λ solve = `{"solve":"bisection","lo":0,"hi":1,"iterations":60,"display_round_to":4,"last_week_equals_cap_when_lambda_bel… (full value in the JSON)` (`rules.stairway.lambda`); growth by N: rules.stairway.by_N[N].growth (N=8: 1.3282, N=12: 1.5535)
- **Sources:** CX-01; CX-03; R2-PER-03; R2-PER-04; R3-VOL-04; VOL-04; VOL-05; 12 §3.7.1; D-18 (historical procedure)

### DEF-11 · Bilateral share

*approved* - Bilateral sets ÷ (bilateral + unilateral sets) in the lower-body knee- and hip-dominant compound slots (leg flexion, leg extension and isolation excluded); the upper body by the same logic (alternating = unilateral).

```
β^{lower}_e = Σ_{s: β(s) ∈ {RP_BKD, RP_UKD, RP_BHD, RP_UHD}, bilateral(x_s)} n / Σ_{same slots} n over the weeks of e; β^{upper}_e on {RP_HPUSH, RP_VPUSH, RP_HPULL, RP_VPULL}.
```
- **Params:** regions = `{"lower":["RP_BKD","RP_UKD","RP_BHD","RP_UHD"],"upper":["RP_HPUSH","RP_VPUSH","RP_HPULL","RP_VPULL"]}` (`rules.bilateral_share.regions`); compound buckets = `["RP_BKD","RP_UKD","RP_BHD","RP_UHD"]` (`rules.bilateral_share.compound_only`)
- **Sources:** UNI-02; UNI-03; UNI-07; CAT-09; BRAIN §6.2; 12 §3.11

### DEF-12 · Client level

*approved+proposed-numbers* - L1 = under about a year of consistent training, or 6+ months off (body treated as a beginner); L2 = consistent for over a year; L3 = 3+ years and 4+ days a week, or a competitive physique / strength athlete (PROPOSED). The client level (volume) is separate from the exercise level (difficulty).

```
L = L1 if years < 1 ∨ layoff ≥ 6 mo ∨ (former competitor ∧ first block); L3 if years ≥ 3 ∧ days ≥ 4 (inclusive, D-01) ∨ competitive physique / strength; else L2.
```
- **Params:** level thresholds = `{"L1_below_years":1,"L3_min_years":3,"L3_min_days":4,"L3_competitive_physique_strength":true,"layoff_months_b… (full value in the JSON)` (`rules.levels.client`)
- **Sources:** PRG-05; CAT-06; D-01; 12 §3.2

### DER-01 · Level start table

*approved+proposed-numbers* - Big lines (quads, hamstrings, glutes, chest, back) 10 / 15 / 20; shoulders, biceps, triceps 10 / 12 / 15 (L1 small raised to 10 by the floor); calves 3 sets x leg days.

```
start⁰_l = volume.start[l][L]; calves: 3·|D^leg| (DER-04).
```
- **Params:** start table = `{"quads":{"L1":10,"L2":15,"L3":20},"hamstrings":{"L1":10,"L2":15,"L3":20},"glutes":{"L1":10,"L2":15,"L3":20},… (full value in the JSON)` (`rules.volume.start`)
- **Sources:** VOL-01; UNI-01; R2-VOL-04; R2-VOL-06; R3-VOL-01; BRAIN §5.3

### DER-02 · Goal / phase modifier

*approved+proposed-numbers* - The start is multiplied by a factor by region (lower, upper, small): aesthetics 1/1/1, strength 1/1/0.75, general and fat loss 0.8, stay-active 0.8, field athletes off-season 0.7/0.5/0.6 (arms credit-only), strength-type athletes 0.9/0.8/0.6, in-season 0.45/0.35/credit; the modifier is chosen by family, competitiveness and ATH-03 group.

```
start¹_l = round_half_up(start⁰_l · mod[region(l) or small]); "credit" ⇒ line is credit-only (no direct slot unless Focus).
```
- **Params:** modifiers = `{"aesthetics":{"lower":1,"upper":1,"small":1},"strength":{"lower":1,"upper":1,"small":0.75},"general":{"lower… (full value in the JSON)` (`rules.volume.modifiers`); modifier selection = `[{"when":{"family":["athletic","hybrid_crossfit"],"competitive":["competitive"],"ath03_group":["resistance"]}… (full value in the JSON)` (`rules.volume.modifier_select`); rounding = `half_up` (`rules.volume.rounding`)
- **Sources:** VOL-01; VOL-12; ATH-03; ATH-07; UNI-02; R2-VOL-06; 12 §3.4 (factors PROPOSED); D-03; D-07; D-08

### DER-03 · Order of operations of a line target

*engine* - base → modifier → round half up → Focus add → floor 10 → pain factor → profile ratios → phase factor → cycles → cap ≥ start. Pain wins over the floor.

```
S⁰_l = cycles(phase(ratios(pain(floor(focus(round(base·mod))))))), C_l ≥ S⁰_l.
```
- **Params:** order = `["base","modifier","round_half_up","priority_add","floor_10","pain_factor","profile_ratios","phase_factor(mai… (full value in the JSON)` (`rules.volume.order_of_operations`)
- **Sources:** 12 §3.3-3.6; VOL-03; R2-VOL-06; R3-SES-01; engine/volume.mjs targetsFor

### DER-04 · Calves start and floor from leg days

*approved+proposed-numbers* - One calf exercise x 3 sets every leg day; the weekly floor is the most one exercise a leg day can hold with room for its climb.

```
start_calves = 3·n_leg;  F_calves(n_leg) = max(3·n_leg, min(10, 4·n_leg − 1))  (2 leg days → 7, 3 → 10, 4 → 12); timed circuit: 3·n_leg.
```
- **Params:** per leg day = `{"L1":3,"L2":3,"L3":3}` (`rules.volume.calves.per_leg_day`); weekly floor = `10` (`rules.volume.calves.weekly_floor`); isolation max sets = `4` (`rules.placement.max_sets_isolation`); calves climb = `1` (`rules.stairway.min_climb.calves`)
- **Sources:** VOL-17; R3-SES-01; R2-VOL-06; E-05; engine/volume.mjs calvesFloor

### DER-05 · Focus muscle 1 and 2

*approved+proposed-numbers* - Up to 2 Focus muscles; each gets +F sets (default 2, range 1-3) on its start and on its ceiling, the ceiling bounded by the priority caps 18 / 26 (chest 28) / 30. v_taper takes both slots (shoulders + back). The other lines are not slowed.

```
l ∈ Focus ⇒ S_l += F, C_l = min(C_l + F, prio_cap[l][L]);  |Focus| ≤ 2;  F ∈ [1,3].
```
- **Params:** max = `2` (`rules.volume.focus.max`); F default = `2` (`rules.volume.focus.add_default`); F range = `[1,3]` (`rules.volume.focus.add_range`); priority caps = `{"default":{"L1":18,"L2":26,"L3":30},"chest":{"L1":18,"L2":28,"L3":30}}` (`rules.volume.priority.cap`); slow others = `false` (`rules.volume.focus.slow_others`)
- **Sources:** R3-SES-01; VOL-02; VOL-18; ORD-04; R2-VOL-06; E-06

### DER-06 · Pain declared at intake

*approved+proposed-numbers* - The affected group / pattern starts at 50-70 % (engine 0.6), on constrained machines or split grips, positions that hurt excluded, not floored; a gentle climb (12: ceiling = start + 1; engine: no step in weeks 2-3, then ≤ 3 %).

```
l ∈ pain ⇒ S_l = round_half_up(S_l·0.6), l ∉ floored; constraint(x) ∈ [4,5] preferred; share shift 0.2 toward the pain-free side.
```
- **Params:** start factor = `0.6` (`rules.volume.pain.start_factor`); range = `[0.5,0.7]` (`rules.volume.pain.start_factor_range`); freeze weeks = `2` (`rules.volume.pain.freeze_weeks`); after-freeze step cap = `0.03` (`rules.volume.pain.after_freeze_step_cap`); share shift = `0.2` (`rules.volume.pain.share_shift`); constraint bias = `[4,5]` (`rules.volume.pain.constraint_bias`)
- **Sources:** VOL-03; UNI-08; EQ-03; UNI-02; 12 §3.6; D-11

### DER-07 · One target per FOCUS group outside physique / strength plans

*engine* - For field, stay-active, general, fat-loss and in-season clients the hips group carries ONE weekly target (the hamstrings line); glutes follow as credit unless picked as a Focus muscle. Physique and strength plans keep two lines.

```
modifier ∈ one_target_groups.modifiers ⇒ hips target on carrier line only; other line fill = credit.
```
- **Params:** one-target groups = `{"groups":["hips"],"modifiers":["field_off","strength_athlete_off","stay_active","general","fat_loss","athlet… (full value in the JSON)` (`rules.volume.one_target_groups`); floor carriers = `{"quads":["quads"],"hips":["hamstrings","glutes"],"back":["lats_upper_back"],"chest":["chest"],"shoulders":["… (full value in the JSON)` (`rules.volume.floor.carriers`)
- **Sources:** R3-SES-01; R2-VOL-06; E-04; E-84

### DER-08 · Profile volume ratios (swimming)

*inferred* - Swimmers (and other shoulder-swimmer profiles): back ≥ 1.5 x chest on starts and ceilings.

```
S_back ≥ ⌈1.5·S_chest⌉ (and on C).
```
- **Params:** profile ratios: profiles.sports[].volume_ratios
- **Sources:** D-09; E-23; R3-ATH-01

### DER-09 · Next block after completed blocks

*approved policy, proposed numerical procedure* - R2-VOL-06 supplies the next-block increase; CX-03 holds the applicable set ceiling and continues load/rep progression there. Canonical synthesis section 4 rounds after each completed block, not once after exponentiation. The bounded recurrence below is a proposed exact implementation consistent with that saturation policy. An unfinished block repeating its start and the count input retain their existing proposed status. Nothing is stored.

```
For each completed block, in order:
    C_next = min(C_l + 1, applicable_cap_l)
    S_next = min(C_next, round_half_up(1.05*S_l))
    S_l, C_l = S_next, C_next
At S_l = C_l: set climb = 0; use load/rep progression, never a ratio divided by C_l-S_l.
Resolve imported S_l > C_l before planning; do not silently raise the ceiling.
```
- **Params:** cycles = `{"start_multiplier":1.05,"rounding":"half_up","cap_add":1,"cap_max_nonpriority":25,"cap_max_priority":30,"sam… (full value in the JSON)` (`rules.cycles`)
- **Sources:** CX-03; R2-VOL-06; R3-PER-01; R3-GEN-01; synthesis/12_volume_algorithm_v1.md section 4; E-07 (historical)

### DER-10 · Flat block types (maintenance, pre-season, taper, in-season, recovery)

*approved+proposed-numbers* - Maintenance 50 / 60 / 70 % (vacation or limited kit / travel, moving, season change / planned; older ≥ 70 %) of the last block's final weeks or the level start; pre-season about 60 % of the last off-season week; taper 50 % of pre-season; in-season the athlete_in modifier, 2 days. Flat (step 0), not floored, RIR 2-3.

```
type(b) ∈ flat ⇒ n_{s,w} = n_{s,1} ∀w ∈ W_b; sets from the factor; F not applied.
```
- **Params:** maintenance = `{"weeks_default":4,"weeks_range":[1,8],"extendable":true,"factor":{"vacation_limited_kit":0.5,"travel_moving_… (full value in the JSON)` (`rules.plan_types.maintenance_4_6`); phase factors = `{"pre_season":{"of":"last_offseason_week_sets","factor":0.6,"floor":false,"step":0},"in_season":{"modifier":"… (full value in the JSON)` (`rules.volume.phase_factors`); effort by block type = `{"maintenance":{"min":2,"max":3},"pre_season":{"min":2,"max":2},"taper":{"min":2,"max":3},"in_season":{"min":… (full value in the JSON)` (`rules.effort.by_block_type`); season windows = `{"weeks_to_season":{"OFF_EARLY":20,"OFF_BUILD":12,"OFF_LATE":6,"PRE":0},"pre_weeks_default":4,"pre_weeks_rang… (full value in the JSON)` (`rules.plan_types.season`)
- **Sources:** PER-01; PER-08; R2-PER-06; R2-VOL-07; UNI-10; R3-PER-01; D-10; D-37; D-57

### DER-11 · Athletic weekly targets

*approved+proposed-numbers* - Each sport profile gives weekly ranges per key (contacts, throws, cuts, sprint metres, Olympic sets) and tiers; the plyometric share at block end by ground-contact class (75 / 60 / 50 / 40 / 25 %), each block starting 15 points more ballistic; phase factors (pre-season, in-season game-heavy x 0.5, heavy play weeks x 0.5).

```
Â_{k,w} = ramp(low_k → high_k over the block) · phase_factor_k;  share*(w) = (end − 0.15) + progress(w)·0.15, counted over jump and throw work.
```
- **Params:** contact classes = `{"1":{"end":0.75},"2":{"end":0.6},"3":{"end":0.5},"4":{"end":0.4},"5":{"end":0.25}}` (`rules.athletic.ground_contact_classes`); block start offset = `-0.15` (`rules.athletic.block_start_offset`); share counted over = `["plyometric","ballistic","throw"]` (`rules.athletic.share_counted_over`); game-heavy in-season = `{"sports":["basketball","volleyball","soccer","american_football","flag_football","ice_hockey","lacrosse","fi… (full value in the JSON)` (`rules.athletic.in_season_game_heavy`); heavy play weeks = `{"min_play_sessions":3,"plyo_factor":0.5,"extra_cod":false,"olympic":"light_2x3","hard_day_gap_h":48}` (`rules.athletic.heavy_play_weeks`); sport ranges: profiles.sports[].athletic_weekly (e.g. basketball plyo 100-140, throws 80-120, cuts 120-160, sprint 180-300 m, Olympic 6-10 sets)
- **Sources:** ATH-01; ATH-02; R2-ATH-01; R2-ATH-02; R2-ATH-07; R3-ATH-01; R3-ATH-04; R3-ATH-05; D-73; E-28; E-29

### DER-12 · Aerobic sessions per week

*approved* - General / fat loss 3, aesthetics 4 (a second easy Orange), athletes in season 2, pre-season 2, off-season by sport (2-4), powerlifters 2 easy, HYROX 4, swimmers / runners / rowers / endurance cyclists 0 extra; the user moves it up or down; a 45-60+ min session of a stay-active activity counts as one (up to 2).

```
n_aer = sessions(goal, sport, phase) + adj, adj ∈ [−3, +3], n_aer ≥ 0; activity sessions replace ≤ 2.
```
- **Params:** sessions = `{"fat_loss":3,"general":3,"active":3,"aesthetics":4,"athlete_in":2,"athlete_pre":2,"powerlifter":2,"hybrid":2… (full value in the JSON)` (`rules.conditioning.sessions`); user adjust = `{"min":-3,"max":3,"floor_total":0,"extra_colour":"C"}` (`rules.conditioning.cardio_adjust`); activity counts = `{"enabled":true,"max_replaced":2,"min_minutes":45,"keep_gym_led_min":1}` (`rules.conditioning.activity_counts_as_aerobic`)
- **Sources:** ATH-07; R2-SES-06; R2-ATH-06; R3-ATH-01; R3-ATH-03; R3-ATH-04; R3-ATH-05

### DER-13 · Planned effort by week (the 2 → 11 drift)

*approved* - 12 weeks: 3 RIR weeks 1-6, 2 RIR weeks 7-9, 1-2 RIR weeks 10-11, 1 RIR + intensifiers in week 12; display level 2 → 11. Always inside 1-3 RIR.

```
RIR_w = planned_map[by_N[N].planned_effort[w]];  level(w) = 2 + 9·A(w)/A(N), A adds 1 per early step and 5/3 per late step.
```
- **Params:** planned map = `{"2":{"min":2,"max":2},"3":{"min":3,"max":3},"1-2":{"min":1,"max":2},"1+":{"min":1,"max":1,"intensifiers":tru… (full value in the JSON)` (`rules.effort.planned_map`); 12-week drift = `{"1":"3","2":"3","3":"3","4":"3","5":"3","6":"3","7":"2","8":"2","9":"2","10":"1-2","11":"1-2","12":"1+"}` (`rules.stairway.by_N.12.planned_effort`)
- **Sources:** R2-PER-05; R3-VOL-04; VOL-13; 12 §3.7.2

## 6. The rule inventory by tier

### T0 - Safety and hard rules (52 items)

*Never violated. Safety, eligibility, locked coach rules (rules.locked LK01-LK18), counting definitions, session-structure rules the coach called hard (core first, power before strength, horizontal before vertical, hip+push / knee+pull, two spine days, never 1 exercise for a trained group, one calf exercise per leg day, 12 + 2 for field athletes), the step and weekly-rise limits, test timing, athletic safety. A plan that cannot satisfy T0 is refused (refer) or its offending block is removed - never shipped with a T0 violation.*

#### T0-SYS-01 · Deterministic, outputs only, computed once

**hard** · approved · topic system. The whole plan is a pure function of the intake and the model, computed once and shown ahead of time; no check-in, tracking or adaptive input changes it; identical inputs give an identical plan. Every tie is broken by a fixed order (rules.muscles.lines.order, session position, weekday order).

```
plan = Φ(intake, model, seed(intake)); ∀ runs: Φ identical; no clock or randomness except the intake-derived seed; ties broken lexicographically by (line order, pos(s), weekday).
```
- **Params:** nothing stored = `true` (`rules.legal.nothing_stored`); planned only = `{"note":"the generator outputs the whole plan once; people and coaches adjust it themselves; nothing is kept"}` (`rules.stairway.planned_only`)
- **Variables:** all
- **Sources:** R3-VOL-02; R3-VOL-04; R3-GEN-01; R2-VOL-03; LK18; engine/CONTRACTS.md §1.2
- **Engine today:** validators H22, V26; decisions E-07
- **Metric `determinism`** (bool): generate the same intake twice in fresh processes; deep-equal the plan JSON - pass: == true

#### T0-SYS-02 · No lifestyle, check-in or tracking inputs; nothing kept

**hard** · approved · topic system. The intake holds no sleep, stress, job or life field and no check-in field; nothing after the build feeds the engine; no data kept.

```
intake fields ∩ {sleep, stress, job, life, checkin, effort_log} = ∅; no network call with intake / plan data.
```
- **Params:** locked rules: LK16, LK18 (rules.locked)
- **Variables:** intake
- **Sources:** R2-GEN-04; R3-VOL-02; R3-GEN-01; LK16; LK18
- **Engine today:** validators H16, V26
- **Metric `lifestyle_inputs`** (count): fields of the intake / plan.meta.input_audit naming sleep, stress, job, life or check-in - pass: == 0

#### T0-SYS-03 · Explainable: every dosing decision carries its reason

**output** · approved · topic system. Every start, ceiling, floor lift, dropped group, cut, offer and placed set carries a why with its source id, and the plan tells the person up front what it could not fit.

```
∀ decision δ ∈ {S_l, C̃_l, state_g, cut, offer, n change}: why(δ) ≠ ∅ with ref ∈ sources.
```
- **Params:** -
- **Variables:** why
- **Sources:** R3-SES-02 step 1; GEN-07; R3-VOL-04 ("the program will tell you to adjust accordingly")
- **Engine today:** decisions E-59, E-116
- **Metric `unexplained_decisions`** (count): items / week changes / time_check entries without a why ref - pass: == 0

#### T0-SYS-04 · No sex-based rules

**hard** · approved · topic system. Age, foundation, goal and injuries decide; there is no sex field, and a Focus muscle is the person's choice, never inferred ("if it's a female and she chooses glutes" is an example of a choice).

```
Φ independent of sex; Focus ⊆ intake.focus_muscles.
```
- **Params:** locked: LK10 no_sex_rules
- **Variables:** intake
- **Sources:** ATH-09; GEN-02; R3-SES-01; LK10
- **Engine today:** validators H13
- **Metric `sex_inputs`** (count): intake / plan fields naming sex - pass: == 0

#### T0-SAFE-01 · Health check refers, release before every build

**hard** · approved · topic safety. Any health-check refer item (chest pain / heart, surgery or fracture < 6 months, pregnancy / birth < 6 months, injury under treatment, doctor said no) or severe pain: no plan, refer. A coach may bypass with the coach warning. The own-risk + terms + release box is ticked for every build.

```
refer(intake) ⇒ plan.status = refer ∧ no weeks;  ¬release(intake) ⇒ no plan.
```
- **Params:** locked: LK17 release_every_build
- **Variables:** intake
- **Sources:** R2-GEN-03; R3-GEN-01; LK17; BRAIN §13.6 V1, V21
- **Engine today:** validators V1, V21, H20
- **Metric `refer_or_release_violation`** (count): plans with weeks while refer is set or release missing - pass: == 0

#### T0-SAFE-02 · No bands, chains or variable resistance

**hard** · approved · topic safety. No exercise, swap or kit token uses a band, chain or weight releaser.

```
∀s, e: tags(x_{s,e}) ∩ {band, chain, releaser} = ∅ (swaps included).
```
- **Params:** banned tokens = `["band","bands","band_anchor","chains","weight_releaser"]` (`rules.equipment.banned_tokens`)
- **Variables:** x
- **Sources:** EQ-01; EQ-07; EQ-08; EQ-12; LK06
- **Engine today:** validators V9, H01
- **Metric `band_items`** (count): items or swaps whose exercise has a band / chain tag - pass: == 0

#### T0-SAFE-03 · No V-squat

**hard** · approved · topic safety. The V-squat never appears.

```
∀s, e: x_{s,e} ≠ v-squat.
```
- **Params:** -
- **Variables:** x
- **Sources:** GEN-08; LK02
- **Engine today:** validators V20
- **Metric `v_squat`** (count): items with a v-squat exercise id - pass: == 0

#### T0-SAFE-04 · Never to failure on heavy compounds; MAX only on small-muscle / bodyweight last sets

**hard** · approved · topic safety. Planned effort stays at 1-3 RIR on every working set; MAX (technical failure) only as the last set of a small-muscle or bodyweight item.

```
RIR(s,w) ∈ [1,3] ∀ heavy compound s;  MAX(s,w) ⇒ class(x_s) ∈ {small_muscle_isolation, rear_delts, calves} ∨ bodyweight(x_s), last set only.
```
- **Params:** RIR band = `[1,3]` (`rules.effort.rir_band`); MAX rule = `{"allowed_rep_classes":["small_muscle_isolation","rear_delts","calves"],"allowed_bodyweight":true,"last_set_o… (full value in the JSON)` (`rules.effort.max`); never-failure rep classes = `["main_bilateral_compound","unilateral_compound","machine_stable_compound","olympic"]` (`rules.effort.never_failure_rep_classes`)
- **Variables:** RIR, x
- **Sources:** VOL-13; GEN-08; LK01; PER-09; BRAIN §7.1 T3; §7.7
- **Engine today:** validators H02, V17; decisions D-77
- **Metric `failure_on_compound`** (count): compound items with effort.min < 1 or a MAX last set - pass: == 0

#### T0-SAFE-05 · Older adults (60+): the never list and the opt-in power work

**hard** · approved · topic safety. Overhead and low-bar squats never. By default off: plyometric jumps, ankle hops, Olympic lifts, ballistic jumps (switchable on with the warning "Make sure that you have a fitness professional to help you understand what this means"). Depth jumps, high depth drops and snatches stay locked even with the opt-in (Phase 0 strict reading). On by default: landing drills, balance, quick stepping without a hop, light medball throws, fast machine work. Constrained machines preferred.

```
age ≥ 60 ⇒ ∀s: tags(x_s) ∩ (never_tags ∪ never_tags_phase0_even_with_opt_in) = ∅ ∧ (¬opt_in ⇒ quality(x_s) ∉ default_excluded_qualities).
```
- **Params:** from age = `60` (`rules.population.older.from_age`); never tags = `["overhead_squat","low_bar"]` (`rules.population.older.never_tags`); never even with opt-in = `["depth_jump","high_depth_drop","snatch"]` (`rules.population.older.never_tags_phase0_even_with_opt_in`); default excluded = `["plyometric","olympic","ballistic_jump"]` (`rules.population.older.default_excluded_qualities`); default on = `{"landing":true,"balance_warmup":true,"quick_stepping":true,"light_throws":true,"fast_machine_intent":true}` (`rules.population.older.default_on`); constraint band = `[4,5]` (`rules.population.older.constraint_band`)
- **Variables:** x
- **Sources:** EQ-03; EQ-04; R2-ATH-08; R3-ATH-02; ATH-09; LK09; LK15; D-05; C-12; BRAIN §9.1 A13; §13.6 V5
- **Engine today:** validators V5, H12
- **Metric `older_never`** (count): items for a 60+ client with a never tag, or default-off quality without prefs opt-in - pass: == 0

#### T0-SAFE-06 · Racket players 50+ and pickleball / padel / tennis defaults

**hard** · approved · topic safety. Knee-friendly strength; calf and Achilles work every leg day; rotator-cuff and elbow care weekly (kept on a main day, never cut for time); only low-impact jumps (no depth jumps, high drops, hurdle hops or bounds) unless switched on.

```
age ≥ 50 ∧ profile ∈ racket ⇒ ∀d ∈ D^leg: ∃ prehab_lower(d); ∃ arm-care station on some d ∈ D^main per week; tags(x) ∩ {depth_jump, high_depth_drop, hurdle_hop, bound} = ∅ unless opt-in.
```
- **Params:** racket 50+ = `{"from_age":50,"to_age":59,"racket_profiles":["rec_pickleball","pickleball_competitive","rec_padel","rec_tenn… (full value in the JSON)` (`rules.population.active_aging_50`)
- **Variables:** x, u
- **Sources:** R3-ATH-02; D-32; E-41; E-75; E-89; BRAIN §9.1 A13; §9.10
- **Engine today:** validators V5
- **Metric `racket50_defaults`** (count): leg days of a racket 50+ client without lower prehab + weeks without arm care on a main day + avoided-tag items - pass: == 0

#### T0-SAFE-07 · Youth limits

**hard** · approved · topic safety. Under 18: exercise ladder up to intermediate; Olympic lifts from the floor only from about 14 and after one block of hang work; medballs 2 lb lighter; guardian release.

```
age < 18 ⇒ ladder(x) ≤ intermediate; floor_olympic(x) ⇒ age ≥ 14 ∧ previous_cycles ≥ 1.
```
- **Params:** youth = `{"below_age":18,"max_ladder":"intermediate","olympic_floor_min_age":14,"medball_minus_lb":2}` (`rules.population.youth`); youth floor age = `14` (`rules.olympic.youth_floor_min_age`)
- **Variables:** x
- **Sources:** R2-ATH-08; ATH-09; EQ-06; D-41; BRAIN §9.1 A13
- **Engine today:** validators V4
- **Metric `youth_violation`** (count): youth items above the ladder or floor Olympic lifts before the rule allows - pass: == 0

#### T0-SAFE-08 · Pain areas: avoid tags, axial limit, refer when severe

**hard** · approved+proposed-numbers · topic safety. Each declared pain area removes the exercises with its avoid tags (e.g. lower back: no good mornings, bent-over, axial-high or counted spine lifts; knee: no deep knee flexion, depth jumps, hurdle hops, bounds), prefers machines / split grips (constraint 4-5), and severe pain refers.

```
∀ area a ∈ pain: ∀s: tags(x_s) ∩ avoid(a) = ∅ ∧ axial_class(x_s) ≤ max_axial_class(a);  severity(a) = severe ⇒ refer.
```
- **Params:** areas = `{"neck":{"muscles":[],"avoid_tags":["overhead_barbell","bent_over"],"prefer_tags":["machine","chest_supported… (full value in the JSON)` (`rules.volume.pain.areas`); worse-with = `{"overhead":{"avoid_tags":["overhead"]},"deep_knee_bend":{"avoid_tags":["deep_knee_flexion"]},"impact":{"avoi… (full value in the JSON)` (`rules.volume.pain.worse_with`); refer if = `["severe"]` (`rules.volume.pain.refer_if_severity`)
- **Variables:** x
- **Sources:** VOL-03; UNI-08; EQ-03; EQ-11; D-70; BRAIN §5.7
- **Engine today:** validators V1
- **Metric `pain_avoid_items`** (count): items whose exercise carries an avoid tag of a declared pain area - pass: == 0

#### T0-SAFE-09 · Medball ≤ 20 lb; no medball in the aesthetics main workout

**hard** · approved · topic safety. Medballs never over 20 lb (light 8-10 lb for passes, 6-10 overhead, 10-20 slams); aesthetics / bodybuilders use the medball only in the warm-up.

```
load_lb(x_s) ≤ 20 ∀ medball s;  goal = muscle ⇒ no medball item outside the warm-up.
```
- **Params:** max lb = `20` (`rules.medball.max_lb`); loads = `{"pass_rotation":[8,10],"overhead":[6,10],"situp":[6,8],"slam":[10,20],"warmup":[6,10],"wall_ball":[10,20]}` (`rules.medball.loads_lb`); aesthetics main = `false` (`rules.medball.aesthetics_main`)
- **Variables:** x, load
- **Sources:** EQ-06; ATH-05; LK12; BRAIN §9.6
- **Engine today:** validators H11, V16
- **Metric `medball_violation`** (count): medball items > 20 lb or an aesthetics main-workout medball item - pass: == 0

#### T0-SAFE-10 · Equipment availability

**hard** · approved · topic selection. Every pick is doable with the client's kit (access profile + extra items + machines owned); no-ball substitutes only when no medball is owned.

```
∀s, e: x_{s,e} ∈ X_s(kit).
```
- **Params:** access profiles = `{"FULL_GYM":{"kit":["anchor_point","barbell","bench","box","cable","cable_attachments","cardio_machine_cal","… (full value in the JSON)` (`rules.equipment.profiles`); substitution order = `["pool_filtered","coach_alternates","same_pattern_other_implement","machine_isolation_swap","nearest_pattern_… (full value in the JSON)` (`rules.equipment.substitution_order`)
- **Variables:** x
- **Sources:** EQ-01; EQ-07; EQ-09; EQ-10; 10_equipment_model; E-37; BRAIN §8.1; §8.5
- **Engine today:** validators V7
- **Metric `kit_violation`** (count): items whose exercise needs equipment outside the kit - pass: == 0

#### T0-SAFE-11 · Library exercises only; one-detail variations; never invented

**hard** · approved · topic selection. The library is the single source of truth; between exercise blocks the tool may change one detail (hand, grip, stance, implement, range) and show it as "<name> - <detail>"; it never invents an exercise; swap-only / generic records are never the pick.

```
∀s, e: x_{s,e} ∈ X^live ∪ {(x, detail): x ∈ X^live, detail ∈ variations(x)}; status(x) ∉ swap_only_statuses.
```
- **Params:** block change = `{"max_share_of_slots":0.34,"keep_roles":["work","core_block","tested"],"prefer_same":["pattern","laterality"]… (full value in the JSON)` (`rules.selection.block_change`); swap-only statuses = `["program_only","reference_only"]` (`rules.selection.swap_only_statuses`); generic ids = `["-not-stated","-any-kind","^calf-raise-any$","^row-any","-any-loading","^squat-any","-either$","any-variatio… (full value in the JSON)` (`rules.selection.generic_id_patterns`)
- **Variables:** x
- **Sources:** CAT-07; R2-LIB-01; PER-02; E-46; E-50; BRAIN §7.6; §4.1
- **Engine today:** validators H14
- **Metric `invented_exercises`** (count): items whose exercise id is not in the catalog (live) or carries a non-library detail - pass: == 0

#### T0-SAFE-12 · Slot-type exclusions (KB swings, Olympic catches)

**hard** · approved · topic selection. KB swings (and wall balls) never fill a resistance slot (they are ballistic, power block or WOD only); a jerk / Olympic catch never fills a resistance, isolation or Focus slot; a push press presses only for athletes and class-model clients.

```
κ(s) ∈ {strength, accessories, focus} ⇒ tags(x_s) ∩ {kb_swing, wall_ball, olympic_catch} = ∅.
```
- **Params:** kb swing rule = `true` (`rules.selection.kb_swing_never_resistance_slot`); olympic rule = `{"tags":["push_jerk"],"push_press_families":["athletic","hybrid_crossfit"]}` (`rules.selection.olympic_never_in_resistance`)
- **Variables:** x
- **Sources:** R2-VOL-05; ORD-03; VOL-10; C-04; E-36
- **Engine today:** validators V14
- **Metric `slot_type_violation`** (count): resistance / isolation / focus items with a kb_swing, wall_ball or Olympic catch exercise - pass: == 0

#### T0-SAFE-13 · No max test from zero

**hard** · approved · topic safety. Someone untrained, back from a layoff, under a year of training or a minor never tests a 1RM or a max-effort mile: 5-8RM (L1) / 3-5RM and 80-90 % efforts instead.

```
from_zero(intake) ⇒ test kind ∈ {rm_5_8, rm_3_or_5, submax_80_90}.
```
- **Params:** from zero if = `["level_L1","layoff","years_consistent_lt_1","youth"]` (`rules.tests.from_zero_if`); catalogue = `{"from_zero":{"L1":"rm_5_8","L2":"rm_3_or_5","L3":"rm_3_or_5"},"after_completed_block":{"L1":"rm_5_8","L2":"r… (full value in the JSON)` (`rules.tests.catalogue.strength`)
- **Variables:** test
- **Sources:** R2-PER-07; LK14; D-40; D-75
- **Engine today:** validators V25, H19
- **Metric `max_test_from_zero`** (count): test items with 1RM / max mile for a from-zero client - pass: == 0

#### T0-SES-01 · Warm-up every session; drills never volume

**hard** · approved · topic structure. Every session opens with a warm-up (5 min any cardio + A-drills on lower / athletic days or mobility on press days); A-drills never count.

```
∀d ∈ D^main: first block κ = warmup;  c(warmup items) = 0.
```
- **Params:** warm-up = `{"general":{"text_key":"warmup.any_cardio_5min","minutes":5},"lower_or_athletic_drills":["a-march-running-dri… (full value in the JSON)` (`rules.warmup`)
- **Variables:** u
- **Sources:** ORD-08; BRAIN §10.1 W9
- **Engine today:** validators V12
- **Metric `missing_warmup`** (count): main days whose first block is not warmup - pass: == 0

#### T0-SES-02 · Core opener: 2 exercises x 2 sets, short of failure, first

**hard** · approved · topic structure. Right after the warm-up every main session has the core block: 2 exercises x 2 sets, short of failure (RIR ≥ 2), one thorax + one pelvis. The person may move it (after plyos / after strength / end) or switch it off for a day; the generator never leaves it out.

```
∀d ∈ D^main: |core items| = 2 ∧ n = 2 ∧ RIR ≥ 2 ∧ pos(core) = start unless prefs.core_position; generator: toggle = on.
```
- **Params:** exercises = `2` (`rules.core_block.exercises`); sets = `2` (`rules.core_block.sets_when_first`); position = `start` (`rules.core_block.position_default`); positions = `["start","after_plyos","after_strength","end"]` (`rules.core_block.positions`); submaximal when first = `true` (`rules.core_block.submaximal_when_first`)
- **Variables:** u, n, RIR
- **Sources:** ATH-11; VOL-17; R2-SES-03; R3-SES-02; GEN-08; LK05; BRAIN §10.1 W1; §10.2 tier 1
- **Engine today:** validators H05, V18
- **Metric `core_opener_missing`** (count): main days without a 2 x 2 core block in its position - pass: == 0

#### T0-SES-03 · Block order

**hard** · approved · topic order. warm-up → core → test → skill → athletic → power (Olympic) → strength → accessories → joint care → circuit → conditioning → aerobic → cool-down, except the allowed overrides (contrast station, a priority small muscle first, core moved by the person, the bootcamp cardio station, a fighter's opening aerobic block, the vertical work lift first).

```
∀d: blocks of d appear as a subsequence of block_order, up to allowed_overrides.
```
- **Params:** block order = `["warmup","core","test","skill","athletic","power","strength","accessories","prehab","circuit","conditioning"… (full value in the JSON)` (`rules.ordering.block_order`); overrides = `["contrast_station","priority_small_muscle_first","core_moved_by_user","bootcamp_cardio_station","fighter_ope… (full value in the JSON)` (`rules.ordering.allowed_overrides`)
- **Variables:** pos
- **Sources:** ATH-11; ORD-03; ORD-09; LIB-21; BRAIN §10.2
- **Engine today:** validators V12
- **Metric `block_order`** (count): days whose block kinds break ordering.block_order without an allowed override - pass: == 0

#### T0-SES-04 · Power before strength

**hard** · approved · topic order. Every athletic / Olympic item comes before every strength item of the day (contrast complexes excepted).

```
∀d: max pos(athletic ∪ power) < min pos(strength ∪ accessories), contrast excepted.
```
- **Params:** hard list = `["H_PULL_BEFORE_V_PULL","H_PUSH_BEFORE_V_PUSH","POWER_BEFORE_STRENGTH","WORK_FIRST","BILATERAL_BEFORE_UNILATE… (full value in the JSON)` (`rules.ordering.hard`)
- **Variables:** pos
- **Sources:** ORD-03; GEN-08; LK03; BRAIN §7.7
- **Engine today:** validators H03, V12
- **Metric `power_after_strength`** (count): days with an athletic / power item after a strength item - pass: == 0

#### T0-SES-05 · Horizontal before vertical (row before pulldown, flat before overhead)

**hard** · approved · topic order. Within a day every horizontal pull precedes every vertical pull and every horizontal push precedes every vertical push - except when the vertical lift is the day's work lift ("the work first").

```
∀d: pos(HPULL) < pos(VPULL) ∧ pos(HPUSH) < pos(VPUSH), unless ρ(vertical) = work.
```
- **Params:** exemption = `work` (`rules.ordering.h_before_v_exempt_when_vertical_is`)
- **Variables:** pos
- **Sources:** ORD-01; ORD-02; GEN-08; LK04; D-30; BRAIN §7.7; §10.1 W8
- **Engine today:** validators H04, V12
- **Metric `h_before_v`** (count): days with a vertical pull / push before a horizontal one (non-work vertical) - pass: == 0

#### T0-SES-06 · The work first; bilateral before unilateral; MYO last

**hard** · approved · topic order. On days holding a work lift, the work comes first in the strength block, and bilateral lifts precede unilateral ones of the same region (machine MYO finisher exempt); MYO only on the day's last eligible item.

```
∃ work on d ⇒ pos(work) = min pos(strength); pos(bilateral_reg) < pos(unilateral_reg); MYO(s) ⇒ s = last eligible item of d.
```
- **Params:** hard list = `["H_PULL_BEFORE_V_PULL","H_PUSH_BEFORE_V_PUSH","POWER_BEFORE_STRENGTH","WORK_FIRST","BILATERAL_BEFORE_UNILATE… (full value in the JSON)` (`rules.ordering.hard`)
- **Variables:** pos
- **Sources:** ORD-02; VOL-15; OBSERVED R5 225/231; D-53; BRAIN §7.7
- **Engine today:** validators V12, V17
- **Metric `work_bilateral_myo_order`** (count): days breaking work-first, bilateral-before-unilateral or MYO-last - pass: == 0

#### T0-SES-07 · Athletic order and the speed session order

**hard** · approved · topic order. Sprint → plyo → ankle work → throws → COD inside the athletic block, all before Olympic work; speed sessions: squirrel jumps → MACH / acceleration starts → max velocity.

```
pos follows athletic_bucket_order; athletic < power; speed order fixed.
```
- **Params:** athletic order = `["AP_SPRINT","AP_PLYO","AP_JUMP_LIMITED_KNEE","AP_THROW","AP_COD"]` (`rules.ordering.athletic_bucket_order`); speed order = `["squirrel_jumps","mach_acceleration","max_velocity"]` (`rules.athletic.speed_session_order`)
- **Variables:** pos
- **Sources:** LIB-21; OBSERVED N5 48/51; BRAIN §7.7; §9.1 A25
- **Engine today:** validators V12
- **Metric `athletic_order`** (count): days breaking the athletic bucket order or speed order - pass: == 0

#### T0-SES-08 · Hip-dominant + push, knee-dominant + pull

**hard** · approved · topic pairing. In every session mixing lower and upper work (full body, bootcamp, athletic), the hip-dominant lower lift pairs with a push and the knee-dominant one with a pull (upper/lower and PPL variants excepted).

```
∀d mixed, ∀ lower work / secondary s: β(s) ∈ hip_buckets ⇒ partner(s) ∈ hip_with; β(s) ∈ knee_buckets ⇒ partner(s) ∈ knee_with.
```
- **Params:** hip with = `["RP_HPUSH","RP_VPUSH"]` (`rules.pairing.hip_with`); knee with = `["RP_HPULL","RP_VPULL"]` (`rules.pairing.knee_with`); not for variants = `["upper_lower","ppl_x2"]` (`rules.pairing.not_for_variants`)
- **Variables:** x, pos, p
- **Sources:** UNI-11; ORD-06; BRAIN §10.1 W2; BRAIN §10.3
- **Engine today:** validators H06, V11
- **Metric `pairing_violation`** (count): mixed days whose lower lift is paired with the wrong upper vector - pass: == 0

#### T0-SES-09 · Two spine days: heavy squat and heavy deadlift on different days, once each per week

**hard** · approved · topic axial. At most one counted (axial) squat day and one counted hinge day a week, never on the same day. Counted: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Not counted: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet / hack / pendulum fine on the second day if not sore; powerlifters may add a light technique squat or deadlift.

```
Σ_d [∃s ∈ S_d: counted_squat(x_s)] ≤ 1;  Σ_d [∃s ∈ S_d: counted_hinge(x_s)] ≤ 1;  ¬∃d with both.
```
- **Params:** budget = `{"squat":1,"hinge":1}` (`rules.axial.budget`); never same day = `true` (`rules.axial.never_same_day`); second day if sore ok = `["goblet","hack","pendulum"]` (`rules.axial.second_day_if_sore_ok`); not counted tags = `["olympic","loaded_jump","kb_swing","thruster"]` (`rules.axial.not_counted_tags`)
- **Variables:** x, z
- **Sources:** PER-04; EQ-11; R2-SES-01; R2-SES-02; LK11; D-76; BRAIN §10.4; §10.1 W4-W5
- **Engine today:** validators H07, V10
- **Metric `axial_violation`** (count): weeks with > 1 counted squat day, > 1 counted hinge day, or both on one day - pass: == 0

#### T0-SES-10 · Never 1 exercise for a trained group on a day (2-4)

**hard** · approved · topic counts. Every FOCUS group trained on a day gets 2 to 4 exercises that day, split and full-body days alike ("there's never one exercise"). A group that cannot get 2 on a day leaves that day. Exempt: calves (exactly 1), the core opener (2), conjugate four-role strength days (as written), timed circuit days, a class-model work lift kept alone.

```
∀ g ∉ {calves, core}, ∀d, e: K_{g,d,e} ∈ {0} ∪ [2, 4], except exempt families / circuit days / class lift.
```
- **Params:** per group per day = `[2,4]` (`rules.session.exercises_per_group.full_body_day`); split days = `[2,4]` (`rules.session.exercises_per_group.split_day`); exempt groups = `["calves","core"]` (`rules.session.exercises_per_group.exempt_groups`); exempt families = `["strength"]` (`rules.session.exercises_per_group.exempt_families`)
- **Variables:** u, x, z
- **Sources:** VOL-07; R2-SES-05 (PARTLY); R3-SES-01; R3-SES-02; D-54; D-59; D-71; E-64; E-69; BRAIN §10.1 W14; §10.3; §5.1 V10
- **Engine today:** validators H18, V23
- **Metric `one_exercise_groups`** (count): (stairway week, main day, g ∈ time_check.trained_groups \ {calves}) with weeks[].group_counts_by_day[weekday][g] = 1, or > 4; circuit days and the class-model work lift exempt - pass: == 0

#### T0-SES-11 · Calves: one calf exercise on every leg day, at least 3 sets

**hard** · approved · topic counts. When calves are trained, every leg day holds exactly one calf exercise (never a second calf exercise on a leg day), 3+ sets; extra calf sets go to that exercise (≤ 4) or the optional-day Calves slot.

```
state_calves = FULL ⇒ ∀d ∈ D^leg: #{s ∈ S_d: β(s) = ISO_CALF} = 1 ∧ n ≥ 3;  ∀d: #{ISO_CALF} ≤ 1.
```
- **Params:** per leg day = `{"L1":3,"L2":3,"L3":3}` (`rules.volume.calves.per_leg_day`); calves per day = `[1,1]` (`rules.session.exercises_per_group.calves_per_day`); max per leg day (L3) = `4` (`rules.volume.calves.per_leg_day_max_L3`)
- **Variables:** u, n
- **Sources:** VOL-17; R3-SES-01; BRAIN §10.1 W18; E-89; E-139; §5.1 V13
- **Engine today:** validators V18
- **Metric `calf_rule`** (count): leg days of a calves-trained plan without exactly one calf exercise at ≥ 3 sets, or any day with 2 calf exercises - pass: == 0

#### T0-SES-12 · A rear-delt exercise every week while the shoulders are trained

**hard** · approved+proposed-numbers · topic counts. Rear delts are not an individual muscle, but every plan keeps rear-delt work each week: a rear-delt station, or rows giving ≥ 1.5 rear-delt credit sets; the person can always add more.

```
state_shoulders = FULL ⇒ (∃s: β(s) ∈ {ISO_REAR, FACEPULL}) ∨ Σ_{s: HPULL} n_{s,w}·0.25 ≥ 1.5.
```
- **Params:** rows minimum = `1.5` (`rules.volume.rear_from_rows_min`)
- **Variables:** u, n
- **Sources:** VOL-17; R2-VOL-04; R3-VOL-01; E-93; BRAIN §5.1 V5; §5.1 V13
- **Engine today:** validators V18
- **Metric `rear_delt_week`** (count): weeks with shoulders trained and no rear station and < 1.5 row rear credit - pass: == 0

#### T0-SES-13 · Field athletes: 12 exercises + the 2-exercise core block

**hard** · approved · topic counts. Off-season field athletes: at most 12 counted exercises a day, the core block, warm-up, skill, joint care, conditioning, aerobic and cool-down outside the count; a superset of two small isolations counts as one; the low ankle block is outside the count.

```
∀d ∈ D^main: #{s ∈ S_d counted} ≤ 12, counted = κ ∉ outside_cap_blocks, small-iso pair = 1.
```
- **Params:** cap = `12` (`rules.session.athlete_cap`); hard = `true` (`rules.session.athlete_cap_hard`); outside cap = `["warmup","core","skill","prehab","conditioning","aerobic","cooldown","test"]` (`rules.session.outside_cap_blocks`); small-iso pair = 1 = `true` (`rules.session.small_iso_superset_counts_as_one`); ankle block outside = `true` (`rules.athletic.f2.ankle_block.outside_athlete_cap`)
- **Variables:** u
- **Sources:** VOL-08; VOL-17; R2-SES-04; R3-SES-01; E-19; E-108; BRAIN §10.1 W15; §9.1 A23; §10.5
- **Engine today:** validators V13
- **Metric `athlete_cap`** (count): field-athlete days with > 12 counted exercises - pass: == 0

#### T0-SES-14 · Exercises fixed inside an exercise block (4-6 weeks)

**hard** · approved · topic blocks. Inside an exercise block only sets, reps, load and RIR change; exercises change only at an exercise-block start.

```
∀s, ∀w, w′ ∈ e: x_{s,w} = x_{s,w′} ∧ u_{s,w} = u_{s,w′} (an added bonus / Focus exercise opens only at an exercise-block start, T6-CNT-04).
```
- **Params:** exercise blocks by N = `{"2":[[1,2]],"3":[[1,3]],"4":[[1,4]],"5":[[1,5]],"6":[[1,6]],"7":[[1,7]],"8":[[1,4],[5,8]],"9":[[1,5],[6,9]],… (full value in the JSON)` (`rules.stairway.exercise_blocks_by_N`)
- **Variables:** x, u
- **Sources:** PER-02; R2-LIB-01; D-25; BRAIN §7.1 T10; §7.6
- **Engine today:** validators V24
- **Metric `mid_block_changes`** (count): exercise ids (or details) that change between weeks of one exercise block - pass: == 0

#### T0-SES-15 · Sets per exercise: 2 to 4 (L1) / 5 (L2-L3), isolation ≤ 4

**hard** · approved+proposed-numbers · topic dose. Every working exercise holds at least 2 sets (an added exercise enters at 2) and at most 4 (L1) or 5 (L2-L3); isolation at most 4; calves ≤ 4 per leg day.

```
2 ≤ n_{s,w} ≤ max_sets[L] (iso: 4) for resistance s with u = 1; recovery weeks ≥ 1.
```
- **Params:** min = `2` (`rules.placement.min_sets`); max = `{"L1":4,"L2":5,"L3":5}` (`rules.placement.max_sets_per_exercise`); isolation max = `4` (`rules.placement.max_sets_isolation`); added entry = `2` (`rules.placement.added_slots.entry_sets`); recovery min = `1` (`rules.recovery.min_sets_per_exercise`)
- **Variables:** n
- **Sources:** VOL-07; VOL-16; 12 §3.9 (limits PROPOSED); E-86; BRAIN §5.5
- **Engine today:** validators V14
- **Metric `set_bounds`** (count): resistance items with sets outside [2, max] (stairway weeks) - pass: == 0

#### T0-SES-16 · Superset legality

**hard** · approved+proposed-numbers · topic pairing. Never two lower-body compounds; never a heavy lift with a fatiguing lift for the same muscle (contrast complexes excepted); pairs from the recommendation list; light weeks drop supersets except small-isolation pairs.

```
p_{s,s′} = 1 ⇒ ¬(lower_compound(s) ∧ lower_compound(s′)) ∧ prime(s) ∩ prime(s′) = ∅ (contrast excepted) ∧ {class(s), class(s′)} ∈ pairs.
```
- **Params:** never = `["two_lower_compounds","heavy_and_fatiguing_same_muscle"]` (`rules.supersets.never`); pairs = `[["knee","pull"],["hip","push"],["ISO_BICEP","rear"],["ISO_TRICEP","side"],["ISO_CALF","delts"],["core","core… (full value in the JSON)` (`rules.supersets.recommend.pairs`)
- **Variables:** p
- **Sources:** ORD-05; R3-SES-02; ATH-12; D-58; BRAIN §10.6
- **Engine today:** validators V12
- **Metric `illegal_supersets`** (count): superset pairs of two lower compounds or one muscle twice (non-contrast) - pass: == 0

#### T0-SES-17 · Day spacing around play and games; an OFF day

**hard** · approved · topic week. The hardest gym day sits at least 48 h before the biggest play day (stay-active) or the game (in-season); optional, WOD-only and aerobic days go on free weekdays nearest the template day, skipping play and game days; at least one full OFF day.

```
gap_h(hardest(D^main), biggest(D^play)) ≥ 48; D^opt ∩ D^play = ∅; |OFF| ≥ 1.
```
- **Params:** in-season gap = `48` (`rules.athletic.in_season_game_heavy.hard_day_gap_h`); play gap = `48` (`rules.athletic.heavy_play_weeks.hard_day_gap_h`); off days = `1` (`rules.session.off_days_min`); optional placement = `free_weekdays_nearest_template_day_skipping_play_and_game_days` (`rules.template_select.optional_days`)
- **Variables:** z
- **Sources:** R2-ATH-07; R3-ATH-05; D-42; BRAIN §10.7; §9.1 A19, A32
- **Engine today:** validators V2
- **Metric `spacing_violation`** (count): weeks breaking the 48-h rule, optional days on play days, or no OFF day - pass: == 0

#### T0-EFF-01 · Planned effort inside 1-3 RIR, drifting 3 → 1 RIR, never rising

**hard** · approved · topic effort. Planned RIR follows the stairway level (DER-13) inside the 1-3 band; it never rises week over week in a stairway; flat blocks RIR 2-3; recovery ≥ 3.

```
RIR_w ∈ [1,3]; RIR_{w+1} ≤ RIR_w in a stairway; type(b) flat ⇒ RIR ∈ by_block_type[type].
```
- **Params:** band = `[1,3]` (`rules.effort.rir_band`); map = `{"2":{"min":2,"max":2},"3":{"min":3,"max":3},"1-2":{"min":1,"max":2},"1+":{"min":1,"max":1,"intensifiers":tru… (full value in the JSON)` (`rules.effort.planned_map`); by block type = `{"maintenance":{"min":2,"max":3},"pre_season":{"min":2,"max":2},"taper":{"min":2,"max":3},"in_season":{"min":… (full value in the JSON)` (`rules.effort.by_block_type`)
- **Variables:** RIR
- **Sources:** VOL-13; R2-PER-05; R3-VOL-04; BRAIN §7.4
- **Engine today:** validators V17, H21
- **Metric `rir_violation`** (count): weeks with planned RIR outside the band or rising inside a stairway - pass: == 0

#### T0-EFF-02 · Intensifiers: last stairway week only, one a day, MYO on the last eligible item

**hard** · approved+proposed-numbers · topic effort. Only in the last stairway week; at most one per training day; a MYO set on the day's last small-muscle or machine-isolation item; never on a free-weight compound, a glute bridge / thrust, or calves of an Achilles hot spot.

```
intensifier(s,w) ⇒ w = N ∧ s = last eligible item of d ∧ class(x_s) ∉ never_credit_classes; Σ_{s∈S_d} intensifier ≤ 1.
```
- **Params:** intensifiers = `{"last_week_only":true,"per_day":1,"kind":"myo","also_max":false,"eligible":"last small-muscle (side / rear d… (full value in the JSON)` (`rules.effort.intensifiers`); myo = `{"last_item_of_day_only":true,"requires":["isolation_or_constraint_gte_4"],"when":["last_week_of_stairway","m… (full value in the JSON)` (`rules.effort.myo`)
- **Variables:** RIR, x
- **Sources:** R3-VOL-04; VOL-15; E-53; E-119; BRAIN §7.1 T5; §7.4
- **Engine today:** validators V12, V17
- **Metric `intensifier_violation`** (count): intensifier items outside the last week, > 1 per day, or on an ineligible item - pass: == 0

#### T0-EFF-03 · Rest by class (VOL-14) - the input of every minute estimate

**hard** · approved · topic dose. Hypertrophy 1-2 min (up to 3), isolation 60-90 s, strength 3-6 min (work lifts of strength / class plans, heavy powerlifting style, athletes' VOL3 main compounds, tests), Olympic 2-3 min, core 30-60 s; supersets rest after the pair, with numbers.

```
rest(s,w) ∈ rest[rc(s,w)]; rc as in DEF-09.
```
- **Params:** rest = `{"hypertrophy_s":[60,120],"hypertrophy_max_s":180,"isolation_s":[60,90],"strength_s":[180,360],"core_s":[30,6… (full value in the JSON)` (`rules.rest`)
- **Variables:** r, RIR
- **Sources:** VOL-14; E-118; BRAIN §7.1 T4
- **Engine today:** validators V17
- **Metric `rest_out_of_class`** (count): items whose rest is outside their class range - pass: == 0

#### T0-EFF-04 · Lift-style preference moves reps, never weekly sets

**hard** · approved · topic dose. "Lighter, more reps" vs "heavier, fewer reps" moves the rep range on the big compound lifts only; weekly sets stay the same; small muscles stay high-rep. (It changes rest classes and therefore minutes.)

```
∂V_{l,w} / ∂lift_style = 0 for fixed time feasibility; r_{s,w} for big compounds from the preference column.
```
- **Params:** preference = `{"volume_lighter":{"big_compound_shift":1},"balanced":{"big_compound_shift":0},"heavy_powerlifting":{"first_l… (full value in the JSON)` (`rules.reps.preference`)
- **Variables:** r, n
- **Sources:** VOL-12; BRAIN §7.1 T2; BRAIN §7.3
- **Metric `style_changes_sets`** (bool): same intake with two lift styles gives different V targets (time limits equal) - pass: == false

#### T0-EFF-05 · Olympic doses: the ramp, full catches 3-5 reps, % only when tested

**hard** · approved · topic dose. DB / KB and pull variants keep 4x8 @75 % → 4x6 @80 → 4x6 @85 → 4x4 @90; full squat cleans / snatches (and barbell power catches) 3-5 reps a set with the same weekly reps; RPE / RIR unless the lift's own max was tested.

```
rep_scheme(x) per olympic.rep_scheme; pct shown ⇔ tested(x).
```
- **Params:** ramp = `[{"pct":75,"sets":4,"reps":8},{"pct":80,"sets":4,"reps":6},{"pct":85,"sets":4,"reps":6},{"pct":90,"sets":4,"r… (full value in the JSON)` (`rules.olympic.ramp`); full catch reps = `[3,5]` (`rules.olympic.full_catch_reps`); rep scheme = `{"ramp":["db_kb","pull"],"three_to_five":["barbell_power_catch","barbell_squat_catch"],"by":"implement_and_ca… (full value in the JSON)` (`rules.olympic.rep_scheme`)
- **Variables:** r
- **Sources:** PER-09; R2-ATH-05; R2-GEN-06; D-29; BRAIN §9.1 A15; §7.1 T18
- **Engine today:** validators V19
- **Metric `olympic_dose`** (count): Olympic items outside their rep scheme or with % untested - pass: == 0

#### T0-EFF-06 · Strength roles: the work, the accessory, the nuance, the survival

**hard** · approved · topic dose. In strength plans (and wherever the roles are used) the work is the main lift at 1 RIR, the accessory a supporting lift at 2 RIR, the nuance weak-point / unilateral / variation work, the survival isolation or joint-health work done no matter what (never cut for time).

```
ρ(s) = work ⇒ RIR_target 1 (inside the weekly drift band); accessory 2; survival ∈ never_cut.
```
- **Params:** strength roles = `{"work":[1,1],"accessory":[2,2],"nuance":"max","survival":"done"}` (`rules.effort.strength_roles`); never cut roles = `["core_block","work","paired_upper","survival"]` (`rules.cut_order.never_cut.roles`)
- **Variables:** RIR, u
- **Sources:** ORD-07; BRAIN §7.1 T14
- **Metric `survival_cut`** (count): strength-family days missing their survival item - pass: == 0

#### T0-EFF-07 · Rep phases and the rep matrix (they set the rest, therefore the minutes)

**hard** · approved · topic dose. Athletes run VOL 1 / VOL 2 / VOL 3 one per off-season exercise block (compounds 12-15 → 8-12 → 6-8; pre- and in-season VOL3); big muscles 5-15 mixed, small muscles 12-30; unilateral lifts moderate-high reps; 40-rep sets only inside HYROX / AMRAP circuits. A VOL3 bilateral main compound takes strength rest (3-6 min), which the time model must price at the peak week (E-82, E-125).

```
r_{s,w} = reps.matrix[class(x_s)][goal column] (athletes: athlete_vol_phases[e]); rc(s,w) = strength when VOL3 ∧ ρ(s) = work ∧ bilateral main compound.
```
- **Params:** athlete VOL phases = `{"by_exercise_block":["VOL1","VOL2","VOL3"],"pre_season":"VOL3","in_season":"VOL3","VOL1":{"compound":"b12_15… (full value in the JSON)` (`rules.reps.athlete_vol_phases`); goal column = `{"muscle":"hypertrophy","strength":"strength","athletic":"athletic","active":"general","fat_loss":"fat_loss",… (full value in the JSON)` (`rules.reps.goal_column`); strength rest for = `["work_heavy","class_model_work","strength_family_work"]` (`rules.time_model.strength_rest_for`)
- **Variables:** r, τ
- **Sources:** PER-11; VOL-11; UNI-04; R3-ATH-03; E-56; E-125
- **Metric `rep_phase_violation`** (count): athlete items whose rep bracket does not match the exercise block's VOL phase - pass: == 0

#### T0-STW-01 · No deload or maintenance week inside a training block

**hard** · approved · topic stairway. A block is completed; the easy week (about half of the hardest week, 3+ RIR, no buy-out / finisher / MYO / supersets) sits only between blocks and is a recommendation; a holiday mark inside a block ends that block there.

```
∀b stairway, ∀w ∈ W_b: type(week w) = stairway; recovery blocks only between blocks.
```
- **Params:** recovery = `{"sets_factor":0.5,"of":"hardest_week","round":"up","min_sets_per_exercise":1,"rir_min":3,"remove":["buyout",… (full value in the JSON)` (`rules.recovery`); locked: LK13
- **Variables:** B
- **Sources:** R2-VOL-07; R3-PER-01; PER-05; LK13; BRAIN §10.1 W25; §11.6
- **Engine today:** validators H15, V24
- **Metric `deload_inside_block`** (count): weeks of a stairway block flagged deload / maintenance / recovery - pass: == 0

#### T0-STW-02 · Planned step ≤ 7 % a week per line

**hard** · approved · topic stairway. Never more than 7 % a week planned; a hand-set step runs 0-7 % (10 % is never offered).

```
T_l(w) / T_l(w−1) − 1 ≤ 0.07 ∀l, w ≥ 2.
```
- **Params:** planned step max = `0.07` (`rules.stairway.limits.planned_step_max`); hand-set max = `0.07` (`rules.stairway.limits.hand_set_max`)
- **Variables:** T, λ
- **Sources:** R2-VOL-01; UNI-05; VOL-05; BRAIN §5.1 V8
- **Engine today:** validators H10, V15
- **Metric `planned_step_over`** (count): line-weeks with target_by_muscle step > 7 % - pass: == 0

#### T0-STW-03 · Weekly total resistance sets rise below 10 % (one whole set excepted)

**hard** · approved+proposed-numbers · topic stairway. "It can progress week by week by 10 %. That's way too much." The person's weekly total rises strictly below 10 %; one whole set may always be added (a small plan can still climb). Placed rule (PROPOSED): a line rises at most max(1 set, 7 %) a week (helpers + 0.5); the week total at most 7 %. Exempt: the first week after a recovery / maintenance phase, block-boundary swaps that add no sets.

```
Tot_w − Tot_{w−1} < 0.10·Tot_{w−1} ∨ Tot_w − Tot_{w−1} ≤ 1;  placed: V_{l,w} − V_{l,w−1} ≤ max(1, 0.07·V_{l,w−1}) + 0.5;  Tot_w ≤ 1.07·Tot_{w−1} (or +1).
```
- **Params:** total ceiling = `0.1` (`rules.stairway.limits.total_weekly_ceiling`); strict = `true` (`rules.stairway.limits.total_ceiling_strict`); placed limits = `{"per_muscle_whole_sets":1,"per_muscle_pct":0.07,"ceiling_pct":0.1,"helper_slack":0.5,"total_pct":0.07,"note"… (full value in the JSON)` (`rules.stairway.limits.placed`); exempt = `["first_week_after_recovery_or_maintenance","block_boundary_swap_no_added_sets"]` (`rules.stairway.limits.exempt_from_total_ceiling`)
- **Variables:** n, V, Tot
- **Sources:** UNI-05; R2-VOL-01; LK08; 12 §3.7.4; BRAIN §5.1 V8
- **Engine today:** validators V15
- **Metric `weekly_rise_over`** (count): weeks whose total_resistance_sets rise ≥ 10 % and > 1 set - pass: == 0

#### T0-STW-04 · Flat blocks have no steps; week 1 has no step

**hard** · approved · topic stairway. Maintenance, pre-season, taper, in-season, recovery and the flat-sets Q1 of the year plan hold their sets; no step in week 1 of any block.

```
type(b) ∈ flat ⇒ n_{s,w} = n_{s,1}; step_l(1) = 0.
```
- **Params:** phase factors = `{"pre_season":{"of":"last_offseason_week_sets","factor":0.6,"floor":false,"step":0},"in_season":{"modifier":"… (full value in the JSON)` (`rules.volume.phase_factors`)
- **Variables:** n
- **Sources:** R2-PER-01; R2-PER-06; PER-08; E-17
- **Engine today:** validators H22
- **Metric `steps_in_flat`** (count): step_by_muscle ≠ 0 in a flat block or week 1 - pass: == 0

#### T0-STW-05 · Calendar: holidays between blocks, event and meet tapers, pre-season

**hard** · approved · topic calendar. Marked holidays / vacations sit between blocks (a mark inside a block ends it there); a stay-active event: the hardest weeks end 1 week before, then 1 easy week at about half the sets; swimmers: a 2-week dryland taper before the main championship (1 or none before smaller meets); pre-season 4-6 weeks at about 60 % then a 1-2-week taper; tests in week 1 and the last week only.

```
block layout from (start, season / event / meet dates, holidays) per plan_types.season / prep; no block straddles a holiday.
```
- **Params:** season = `{"weeks_to_season":{"OFF_EARLY":20,"OFF_BUILD":12,"OFF_LATE":6,"PRE":0},"pre_weeks_default":4,"pre_weeks_rang… (full value in the JSON)` (`rules.plan_types.season`); prep / events = `{"step_every_weeks":2,"taper_weeks":[1,2],"taper_volume_cut":[0.4,0.6],"gen_pop_event":{"hardest_ends_weeks_b… (full value in the JSON)` (`rules.plan_types.prep`)
- **Variables:** B
- **Sources:** R3-PER-01; R3-ATH-05; R3-ATH-01; R2-PER-06; R2-GEN-05; D-10; D-50; BRAIN §11.6; §9.8
- **Engine today:** validators V6
- **Metric `calendar_violation`** (count): blocks straddling a marked holiday or event lead-ins off the rule - pass: == 0

#### T0-TST-01 · Tests only at the start and the end; the test is the top set

**hard** · approved · topic tests. Tests in week 1 (baseline) and the last week of each stairway block, never mid-block, never in pre-season / in-season / taper / recovery / maintenance. A strength test is that week's top set (work up to one top set, the rest back-off sets a step easier); the tested lift takes no stairway step that week; rep-max tests sit only on bilateral compound picks; a hinge test takes a canonical deadlift.

```
test(s,w) ⇒ w ∈ {1, N_b} ∧ type(b) = stairway; strength test replaces one planned set of s; x_s bilateral compound.
```
- **Params:** when = `{"baseline":"week_1_of_each_stairway","end":"last_week_of_each_stairway","never_mid_block":true,"not_in_block… (full value in the JSON)` (`rules.tests.when`); replaces top set = `{"back_off_rir_add":1,"back_off_rir_min":2}` (`rules.tests.replaces_top_set`); lock tested = `true` (`rules.tests.lock_tested_exercise`)
- **Variables:** test, n
- **Sources:** PER-07; R2-PER-07; D-46; E-18; E-91; BRAIN §12.1
- **Engine today:** validators V25, H19
- **Metric `test_violation`** (count): tests outside week 1 / last week, on non-bilateral picks, or added on top of the planned sets - pass: == 0

#### T0-ATH-01 · Olympic lifts in every athletic week, level-matched, ≤ 4 exposures

**hard** · approved · topic athletic. Everyone in athletic training gets Olympic work every week: beginners DB / KB snatches, hex-bar jumps, hang pulls / cleans; L2+ the full scope within the sport's ceiling; up to 4 exposures a week; clean family on knee days, snatch family on hip days (the template station decides); 60+ only by opt-in (no snatch); 2-3 days for swimmers; in-season 2 x 3 once a week, dropped in heavy game weeks.

```
family = athletic ∧ ¬(age ≥ 60 ∧ ¬opt_in) ⇒ ∀w (except heavy game weeks in season): 1 ≤ #olympic exposures ≤ 4 (swimmers 2-3; in-season 1 x 2x3); tier(x) ≤ olympic.tiers[L]; x within the sport ceiling (power / pull) unless opted in.
```
- **Params:** per week max = `4` (`rules.olympic.per_week_max`); day pattern = `{"clean":"knee","loaded_jump":"knee","snatch":"hip","swing":"hip","jerk":"either"}` (`rules.olympic.day_pattern`); tiers = `{"L1":{"applies":["L1","L2_block_1"],"examples":["single-arm-db-snatch","kb-squat-clean","db-kb-high-pull","h… (full value in the JSON)` (`rules.olympic.tiers`); in-season = `{"sets":2,"reps":3,"per_week":1,"dropped_heavy_game_weeks":true}` (`rules.olympic.in_season`); older = `{"default":false,"opt_in":true,"opt_in_excludes_tags":["snatch"]}` (`rules.olympic.older`)
- **Variables:** u, x
- **Sources:** ATH-10; R2-ATH-04; R2-ATH-08; R3-ATH-01; E-35; E-66; E-103; BRAIN §9.1 A14; §9.5
- **Engine today:** validators V19
- **Metric `olympic_presence`** (count): athletic weeks without a fillable Olympic item, > 4 exposures, or above the level / sport ceiling - pass: == 0

#### T0-ATH-02 · Receive-Create stages aligned to exercise blocks, never backwards

**hard** · approved+proposed-numbers · topic athletic. 1 Land → 2 Land & Go → 3 Repeat (12 weeks: 1-3 / 4-7 / 8-12; 8 weeks: 1-2 / 3-5 / 6-8), snapped to exercise blocks (each block takes the stage most of its weeks have, ties lower, one stage at a time); never back down inside a training block; restart at stage 1 each off-season; hold in maintenance / pre-season; L2-L3 may start at stage 2; stage qualities: RC1 landing + ballistic, RC2 + plyometric, RC3 ballistic + plyometric (repeat drills).

```
stage(w) constant on each e; stage(e+1) − stage(e) ∈ {0, 1}; quality(x_s) ∈ stage_qualities[stage(e(w))].
```
- **Params:** stages = `{"2":{"RC1":[1,1],"RC2":[2,2],"RC3":null},"3":{"RC1":[1,1],"RC2":[2,2],"RC3":[3,3]},"4":{"RC1":[1,1],"RC2":[2… (full value in the JSON)` (`rules.athletic.stages.weeks_by_N`); alignment = `{"rule":"majority_of_weeks_ties_lower_one_step_at_a_time","single_block_start":{"L1":"RC1","L2":"RC2","L3":"R… (full value in the JSON)` (`rules.athletic.stages.align_to_exercise_blocks`); stage qualities = `{"RC1":["landing","ballistic"],"RC2":["landing","ballistic","plyometric"],"RC3":["ballistic","plyometric"]}` (`rules.athletic.stages.stage_qualities`); may start RC2 = `["L2","L3"]` (`rules.athletic.stages.may_start_RC2_levels`)
- **Variables:** x, stage
- **Sources:** R2-ATH-03; CAT-10; CAT-11; PER-02; E-26; E-27; BRAIN §9.3; §9.1 A5
- **Engine today:** validators V27
- **Metric `stage_violation`** (count): weeks where plyo_stage changes inside an exercise block, goes down, or holds a quality outside its stage - pass: == 0

#### T0-ATH-03 · Contacts per session and plyo spacing

**hard** · science · topic athletic. Plyometric contacts per session ≤ 80 (L1) / 100 (L2) / 120 (L3); 2-3 plyo sessions a week off-season, 48-72 h apart for the same area (masters 3-4 days); depth jumps ≤ 2 stations a week (1 for athletes ≥ 220 lb or L1); the first reactive block bilateral, unloaded, low box; loaded jumps 10-20 % body weight.

```
Σ_{s ∈ S_d} contacts(s,w) ≤ cap[L]; gap(plyo days, same area) ≥ 48 h; #depth_jump stations ≤ 2 (1).
```
- **Params:** contacts cap = `{"L1":80,"L2":100,"L3":120}` (`rules.athletic.contacts_per_session_max`); plyo sessions = `[2,3]` (`rules.athletic.plyo_sessions_per_week`); gap h = `[48,72]` (`rules.athletic.same_area_gap_h`); masters gap days = `[3,4]` (`rules.athletic.masters_gap_days`); first reactive = `{"bilateral_first_stage_block":true,"unloaded_first_stage_block":true,"drop_height_first":"low","heavy_bw_lb"… (full value in the JSON)` (`rules.athletic.first_reactive`); loaded jump % BW = `[10,20]` (`rules.athletic.loaded_jump_bw_pct`)
- **Variables:** a, u
- **Sources:** SCIENCE NSCA; EQ-15; CAT-10; E-32; BRAIN §9.3
- **Engine today:** validators V27
- **Metric `contact_cap`** (count): days over the contacts cap or plyo days closer than the gap - pass: == 0

#### T0-ATH-04 · In-season game-heavy and heavy play weeks

**hard** · approved · topic athletic. Game-heavy sports in season (basketball, volleyball, soccer, football, hockey, lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball): gym plyos about half, no extra COD, sprints only for speed athletes, Olympic 2 x 3 once a week, the hard gym day ≥ 48 h before a game. Stay-active weeks with 3+ play sessions drop the extra agility drills and half the jumps.

```
in_season ∧ game_heavy ⇒ Â_plyo ×= 0.5, Â_cod_extra = 0, olympic = 2x3 x1;  play_sessions ≥ 3 ⇒ Â_jumps ×= 0.5, extra COD = 0.
```
- **Params:** game heavy = `{"sports":["basketball","volleyball","soccer","american_football","flag_football","ice_hockey","lacrosse","fi… (full value in the JSON)` (`rules.athletic.in_season_game_heavy`); heavy play = `{"min_play_sessions":3,"plyo_factor":0.5,"extra_cod":false,"olympic":"light_2x3","hard_day_gap_h":48}` (`rules.athletic.heavy_play_weeks`)
- **Variables:** a, u
- **Sources:** R2-ATH-07; R3-ATH-04; R3-ATH-05; E-43; E-66; BRAIN §9.1 A19, A32
- **Engine today:** validators V27
- **Metric `in_season_violation`** (count): in-season / heavy-play weeks over the reduced targets - pass: == 0

#### T0-ATH-05 · Sport defaults the coach approved (swimming, HYROX)

**hard** · approved · topic athletic. Swimmers: shoulder care (external rotation, floor Y/T raises, KB face pulls) every session, never bands, never cut for time; 0 extra gym cardio; 25 % plyo share at block end; Olympic 2-3 days. HYROX: 2 strength days (squat + pull, deadlift + push) + 2 hybrid days, 4 cardio sessions, 2 short station circuits a week as finishers that never count as muscle sets, wall balls ≤ 20 lb, 40-rep / AMRAP sets only inside them, 50 % plyo share.

```
profile = swimming ⇒ ∀d ∈ D^main: ∃ shoulder-care station; profile = hyrox ⇒ station circuits κ = conditioning, c = 0.
```
- **Params:** hyrox = `{"station_ids":["sled-push","sled-rope-pull-hand-over-hand","sled-drag-forward","burpee-broad-jump","wall-bal… (full value in the JSON)` (`rules.athletic.hyrox`)
- **Variables:** u, x
- **Sources:** R3-ATH-01; R3-ATH-03; E-40; E-42; BRAIN §9.1 A30, A31; §9.10; §9.11
- **Engine today:** validators V27, V14
- **Metric `sport_default_violation`** (count): swimmer main days without shoulder care; HYROX circuits credited as muscle sets - pass: == 0

### T1 - R3-SES-02 infeasibility policy (14 items)

*Lexicographic maximization of the trained-group state vector in the keep order, subject to T0 and to the minimums of a trained group (floor, 2-4 per trained day, minimum climb) and to "the day holds" (minutes x fit factor). Offers (one more day, longer sessions, block toggles) are always computed and shown first.*

**The keep order and the group states.** π = dedupe( Focus groups ⊕ profile-pinned groups (racket 50+: calves) ⊕ profile big priority groups ⊕ keep_order (athletic families: keep_order_r2.athletic) ⊕ profile small priorities ). Objective: lex-max (state_{π_1}, …, state_{π_n}) ⟺ max Σ_i 4^{n−i}·state_{π_i} (n ≤ 8 groups ⇒ at most 4^8 = 65,536 state vectors). Resolved defaults: keep_first = `["focus","profile_priority"]`, keep_order = `["hips","quads","back","chest","shoulders","calves","triceps","biceps"]`, athletic = `["hips","quads","back","chest","calves","shoulders","triceps","biceps"]`, racket 50+ pin = `{"groups":["calves"],"age_gte":50,"refs":["R3-ATH-02"]}`.

| State | Rank | Meaning | Status |
|---|---|---|---|
| FULL | 3 | trained directly: floor, 2-4 per trained day, minimum climb (T1-POL-01) | approved |
| BELOW_FLOOR | 2 | big mover on its work lift only, under the floor, still climbing, listed (E-11; class lift E-64) | proposed |
| PATTERN | 1 | one 2-set pattern station kept in the week, not floor-counted (E-94 / E-145) | proposed |
| NONE | 0 | compound credit only, listed "not trained directly (time)" | approved |

#### T1-POL-01 · The minimums of a directly trained group

**hard_conditional** · approved+proposed-numbers · topic policy. A group counts as trained directly (state FULL) only if, in every week of the stairway block: (a) it holds its floor on the main days (10; calves by DER-04), (b) it gets 2-4 exercises on every day it is trained (calves 1), (c) it climbs at least the minimum climb by the last week and never drops.

```
state_g = FULL ⇒ ∀w: Q^main_{g,w} ≥ F_g  ∧  ∀d: K_{g,d,e(w)} ∈ {0} ∪ [2,4]  ∧  Q_{g,N} − Q_{g,1} ≥ mc_g − 0.5  ∧  Q_{g,w} ≥ Q_{g,w−1} − 0.5.
```
- **Params:** floor F = `10` (`rules.volume.floor.value`); min climb = `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"group":1}}` (`rules.stairway.min_climb`); 2-4 = `[2,4]` (`rules.session.exercises_per_group.full_body_day`)
- **Variables:** state, n, u, x
- **Sources:** R3-SES-02; R2-VOL-06; R2-SES-05; R3-SES-01; 12 §3.10.1 Definitions; E-14; BRAIN §5.6.1
- **Engine today:** validators V22, H17, H18, H21
- **Metric `trained_group_minimums`** (count): trained groups (time_check.trained_groups) failing floor, 2-4 or climb - pass: == 0

#### T1-POL-02 · "The day holds": minutes within the fit factor, with every eligible pair supersetted, at the peak week

**hard_conditional** · approved+proposed-numbers · topic policy. A day holds the plan when its minutes - with every eligible pair supersetted - stay within the chosen length x 1.10 ("a little longer day") in every week, the peak week included. A set placed in week 1 must also fit the peak week's costs (its Olympic sets, the VOL3 strength rest).

```
∀d ∈ D^main, ∀w: Min^{ss}_{d,w} ≤ φ·μ_d,  φ = fit_factor (full-body days), split days φ_split; Min^{ss} = Min with p = 1 on every legal pair.
```
- **Params:** fit factor = `1.1` (`rules.session.time_fit.fit_factor`); long-day warn = `1.1` (`rules.session.long_day.warn_above_factor`); split-day factor = `1` (`rules.session.long_day.split_day_factor`)
- **Variables:** n, u, p
- **Sources:** R2-SES-05; R3-SES-02 ("never squeeze"); 12 §3.10.1 (10 % PROPOSED); D-34; E-82; BRAIN §5.6.1
- **Engine today:** validators V13
- **Metric `days_not_holding`** (count): non-test main days with est_minutes > fit_factor x minutes_limit - pass: == 0

#### T1-POL-03 · Step 0: the full level plan when it fits

**objective** · approved · topic policy. Build the level plan (every template group at its level start and ceiling) inside the chosen days x minutes; if every trained group meets its minimums and every line reaches its planned peak, output it with no warning.

```
if ∃ feasible plan with state_g = FULL ∀g ∈ G* (G* = template groups minus credit-only) and C̃_l = C_l ∀l: choose it.
```
- **Params:** -
- **Variables:** state
- **Sources:** R3-SES-02; 12 §3.10.1 step 0
- **Engine today:** decisions E-10
- **Metric `full_plan_when_feasible`** (bool): a plan whose full level plan fits carries no time warning - pass: == true

#### T1-POL-04 · Step 1: tell up front and offer (before the plan)

**output** · approved+proposed-numbers · topic policy. When the full plan does not fit: say so before week 1 with the numbers, and offer (A) one more day - the next template up, checked the same way; (B) longer sessions - the full plan's peak-week need with supersets, rounded up to 5 min, within the allowed lengths; (C) the block toggles that save time (core / athletic off on some days) with the minutes saved. PROPOSED addition (open, E-134): the smallest session length that adds each next group in keep order.

```
¬fits(G*) ⇒ O ⊇ {more_days(d+1, fit check), longer(⌈m*/5⌉·5), toggles(block, Δmin)}, m* = min{μ ∈ minutes_allowed: fits(G*, μ)}; rendered before week 1.
```
- **Params:** offers = `["offer.more_days","offer.longer_sessions","offer.keep_time"]` (`rules.session.time_fit.offers`); round minutes to = `5` (`rules.session.time_fit.round_minutes_to`); allowed minutes = `[30,45,60,75,90,105,120]` (`rules.session.minutes_allowed`)
- **Variables:** O
- **Sources:** R3-SES-02 step 1; 12 §3.10.1 step 1; E-10; E-134; BRAIN §5.6.1
- **Engine today:** validators V28 (spec)
- **Metric `offer_missing`** (count): plans with time_check.fits = false and no offers (or offers after week 1) - pass: == 0

#### T1-POL-05 · Step 2: keep the time - train fewer groups directly, in the keep order

**objective** · approved+proposed-numbers · topic policy. If the person keeps their time, choose which groups are trained directly by priority: Focus groups and the groups the sport pins first, then the big movers (hips, quads, back, chest), then shoulders, calves, triceps, biceps. A group is kept only if every kept group still meets its minimums (T1-POL-01) and every day holds (T1-POL-02). Never drop every group below the floor instead.

```
lex-max (state_{π_1}, state_{π_2}, …, state_{π_n}) over the feasible set (T0 ∧ T1-POL-01 ∧ T1-POL-02), π = keep order; equivalently max Σ_i 4^{n−i}·state_{π_i}.  π = Focus groups ⊕ profile-pinned groups (racket 50+: calves) ⊕ profile big priorities ⊕ keep_order (athletic families: keep_order_r2.athletic) with duplicates removed.
```
- **Params:** keep first = `["focus","profile_priority"]` (`rules.session.time_fit.keep_first`); keep order = `["hips","quads","back","chest","shoulders","calves","triceps","biceps"]` (`rules.session.time_fit.keep_order`); athletic keep order = `["hips","quads","back","chest","calves","shoulders","triceps","biceps"]` (`rules.session.time_fit.keep_order_r2.athletic`); racket 50+ pin = `{"groups":["calves"],"age_gte":50}` (`rules.session.time_fit.keep_order_r2.pin_first_50_racket`)
- **Variables:** state
- **Sources:** R3-SES-02 step 2 ("big movers first; arms, calves and rear delts only from compound credit"); 12 §3.10.1 step 2; BRAIN §5.6.1; N-PROD-27 (Focus / pinned first PROPOSED); E-81; E-140
- **Engine today:** decisions E-10, E-81, E-140
- **Metric `keep_order_inversion`** (count): groups kept FULL while an earlier group in π is not FULL although adding it (and dropping the later one) is feasible - measured against an exhaustive check - pass: == 0

#### T1-POL-06 · Room cuts before groups: what leaves the day first

**objective** · proposed · topic policy. Before any group loses its FULL state, non-group room goes, in the family's cut order (aesthetics: Focus slot, second calf, duplicate isolation, aquatic chest fly, third exercise of a group, second non-axial bilateral; athletic: Olympic over budget, second plyo / sprint, second jump for low-contact sports, COD for non-COD sports, buy-out, second throw, ...; stay-active: Olympic over budget, joint care to the optional day, ankle block, one athletic station a day, second jump, second throw, COD, buy-out, ...). Never cut: the core block, the work lift and its paired upper lift, survival work, the first calf station, the week's last rear-delt station, a group below 2 exercises, the last plyo / ballistic station of an athlete. Supersets are tried first.

```
cuts c ∈ cut_order[family] applied in order while ¬fits; c never removes never_cut items; a cut is kept only if it raises the lex value of T1-POL-05.
```
- **Params:** cut orders = `{"aesthetics":[{"id":"focus","match":{"role":["focus"]}},{"id":"second_calf","match":{"second_calf":true}},{"… (full value in the JSON)` (`rules.cut_order`); never cut = `{"roles":["core_block","work","paired_upper","survival"],"buckets":["ISO_CALF"],"group_min_exercises":2,"rear… (full value in the JSON)` (`rules.cut_order.never_cut`); superset first = `true` (`rules.cut_order.superset_first`); track protection = `competitive_only` (`rules.cut_order.track_protection`); stay-active room cuts = `["stay_active_second_athletic","stay_active_power"]` (`rules.session.time_fit.stay_active_room_cuts`)
- **Variables:** u
- **Sources:** ORD-05; VOL-17; ORD-07; R2-SES-05; D-69; D-78; E-10; E-77; E-143; BRAIN §10.5
- **Engine today:** decisions E-10, E-143
- **Metric `protected_item_cut`** (count): never_cut items missing from a day that holds its group - pass: == 0

#### T1-POL-07 · Pattern coverage: big movers not trained directly keep their movement (anti over-cut)

**hard_conditional** · proposed · topic policy. Every primary pattern stays in the week: a big mover the time leaves untrained directly keeps one pattern station (back: horizontal row, chest: horizontal press, quads: single-leg knee, hips: single-leg hinge), 2 sets, paired with the day's work lift, not counted toward the floor, at most 3 a week. This is the rule the "pickleball plan with only hinges" broke; the coach's step 2 ("arms, calves and rear delts only from compound credit") presumes the presses and rows stay.

```
∀g ∈ {back, chest, quads, hips}: state_g ∈ {FULL, BELOW_FLOOR, PATTERN} whenever a PATTERN station fits (state PATTERN = 1 station, n = 2, c excluded from the floor); Σ PATTERN stations ≤ 3.
```
- **Params:** pattern keep = `{"buckets":{"back":"RP_HPULL","chest":"RP_HPUSH","quads":"RP_UKD","hips":"RP_UHD"},"order":["back","chest","q… (full value in the JSON)` (`rules.volume.pattern_keep`)
- **Variables:** state, u
- **Sources:** BRAIN §10.7 (with 2-3 days every primary pattern ≥ 1x); R3-SES-02 step 2 (reading); 12 §7 item 5 (open); E-94; E-145
- **Engine today:** decisions E-94, E-145
- **Metric `missing_primary_pattern`** (count): weeks without a knee, hip, horizontal push and horizontal pull station (main + optional days) - pass: == 0

#### T1-POL-08 · Relaxed states: a big mover below its floor on its work lift; the class lift

**objective** · proposed · topic policy. A big mover that cannot hold 10 sets but can hold the day's work lift may be kept below its floor, still climbing (state BELOW_FLOOR), listed "trained below the floor (time)"; in the CrossFit class model a group not trained directly keeps its class lift (3 sets, heavier by the week). Tried after the groups that hold their floor and only if no kept big mover loses its floor or climb.

```
state_g = BELOW_FLOOR ⇒ ∃ work lift of g; Q_{g,N} − Q_{g,1} ≥ mc_calves; listed in trained_below_floor; lex rank FULL > BELOW_FLOOR > PATTERN > NONE.
```
- **Params:** class lift = `{"families":["hybrid_crossfit"],"roles":["work"],"sets":3,"reason":"class_lift"}` (`rules.session.time_fit.keep_work_lift`)
- **Variables:** state
- **Sources:** R3-SES-02; E-11; E-64; E-81
- **Engine today:** validators V22
- **Metric `below_floor_unlisted`** (count): groups under the floor not listed in time_check.trained_below_floor / not_trained_directly - pass: == 0

#### T1-POL-09 · Never squeeze: a group leaves a day rather than taking 1 exercise

**hard** · approved · topic policy. Never squeeze 2-4 exercises per group into a day that cannot hold them: the group trains on its other days with 2+ exercises each; a lone station whose partner found no pick leaves the day; calves stay on every leg day or leave the plan.

```
if K_{g,d} = 2 does not fit on d ⇒ z_{g,d} = 0 (never K_{g,d} = 1).
```
- **Params:** -
- **Variables:** z, u
- **Sources:** R3-SES-02; R2-SES-05; E-12; E-69
- **Engine today:** validators H18, V23
- **Metric `squeezed_groups`** (count): same as T0-SES-10 (1-exercise groups) - pass: == 0

#### T1-POL-10 · Groups not trained directly are listed honestly, with their compound credit

**output** · approved · topic policy. A group left out keeps its compound credit (rows → biceps and rear delts, presses → triceps and front delts, squats / hinges → glutes) and is listed "not trained directly (time)"; a group the plan gives no credited set at all is printed "not trained in this plan because of time" with the offer.

```
∀g: state_g ≠ FULL ⇒ g ∈ NT with reason ∈ {time, credit_only, no_station, class_lift} and its credited Q_{g,w} shown.
```
- **Params:** -
- **Variables:** NT
- **Sources:** R3-SES-02; E-74; E-76; BRAIN §5.6.1
- **Engine today:** validators V22
- **Metric `unlisted_untrained`** (count): template groups neither trained nor in time_check.not_trained_directly - pass: == 0

#### T1-POL-11 · Step 3: supersets recommended, "needed" when the fit depends on them

**output** · approved · topic policy. Every eligible pair of every day carries a superset recommendation with the minutes it saves; when a day only fits with it, it is marked needed and switched on ("Recommend doing supersets so that it's a faster workout").

```
∀ legal (s,s′): rec_{s,s′} = 1 with Δmin; fits(d) depends on p ⇒ p_{s,s′} = 1 ∧ needed.
```
- **Params:** recommend = `{"pairs":[["knee","pull"],["hip","push"],["ISO_BICEP","rear"],["ISO_TRICEP","side"],["ISO_CALF","delts"],["co… (full value in the JSON)` (`rules.supersets.recommend`)
- **Variables:** p
- **Sources:** R3-SES-02 step 3; ORD-05; E-21; E-90; E-111; BRAIN §10.6
- **Metric `missing_superset_recs`** (count): days with eligible pairs but no superset_recommendations entry; needed pairs not on - pass: == 0

#### T1-POL-12 · Step 4: the stairway climbs on every trained group, to the ceiling the time holds

**hard_conditional** · approved+proposed-numbers · topic policy. Each trained line climbs from its week-1 sets to the ceiling its time holds (λ re-solved so it lands there in the last week), never below week 1 + the minimum climb; the keep-time ceiling is clamped to the level ceiling.

```
state_g ∈ {FULL, BELOW_FLOOR} ⇒ C̃_l = min(C_l, P^time_l) with C̃_l ≥ S_l + mc; λ_l solves DEF-10 with C̃_l.
```
- **Params:** min climb = `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"group":1}}` (`rules.stairway.min_climb`)
- **Variables:** C̃, λ, n
- **Sources:** R3-SES-02 step 4; R3-VOL-04; 12 §3.10.1 (step-2 ceiling clamp PROPOSED); E-13; BRAIN §5.5; §5.6.1
- **Engine today:** validators H21
- **Metric `trained_not_climbing`** (count): trained groups with last-week minus week-1 below the minimum climb - pass: == 0

#### T1-POL-13 · Athletic blocks inside the policy: protected for competitive athletes, room for stay-active

**objective** · proposed · topic policy. Competitive athletes keep the sport's tracks (the R3-SES-01 split: 2 jump / throw stations + 1 Olympic lift on a cross-pattern day) - their tracks are not time-cut; stay-active and general clients give up athletic room first (one athletic station a day, the power block switched off, switchable back on) before any big mover leaves.

```
competitive ⇒ athletic tracks ∈ never_cut (inside the 12 + 2 split); stay-active ⇒ athletic room cuts precede any state_g decrease for g ∈ big movers.
```
- **Params:** track protection = `competitive_only` (`rules.cut_order.track_protection`); stay-active cuts = `[{"id":"olympic_over_budget","match":{"olympic_over_budget":true}},{"id":"prehab_to_optional","match":{"preha… (full value in the JSON)` (`rules.cut_order.athletic_stay_active`)
- **Variables:** u, state
- **Sources:** R3-SES-01; R3-SES-02 ("turn off that day's athletic training ... focus on resistance"); R3-ATH-05; E-98; E-143
- **Engine today:** decisions E-98, E-143
- **Metric `athletic_vs_big_mover`** (count): stay-active plans where a big mover is not trained while an athletic room cut was available - pass: == 0

#### T1-POL-14 · User edits are constraints on a rebuild; the person's choice wins

**hard** · approved · topic editing. Switching off a day's athletic / core / accessory / cardio block, removing or adding an exercise or a block rebuilds the same plan with the edit as a constraint; edits produce notes, never refusals; athletic, Olympic, core and conditioning blocks never count as muscle sets, so switching them off changes no stairway; "add rear delts" is always offered.

```
plan(edits) = Φ(intake ∪ edits); edits are fixed u / toggle values; notes when a group falls below its floor or 2-4.
```
- **Params:** block editing = `{"id_format":"blk.<weekday>-<day_type slug>.<kind>.<n>","toggle":{"warmup":false,"core":true,"skill":true,"at… (full value in the JSON)` (`rules.ordering.block_editing`)
- **Variables:** u, toggle
- **Sources:** R3-SES-02; R3-VOL-01; R3-VOL-04; BRAIN §10.10; §5.1 V24
- **Engine today:** decisions E-22
- **Metric `edit_rebuild`** (bool): a toggle-off of an athletic / core block leaves weekly_sets_by_group unchanged - pass: == true

### T2 - Floors on trained groups (6 items)

*Every directly trained FOCUS group holds the floor (10; calves by the leg-day rule) on the main days in every week of a training block.*

#### T2-FLR-01 · Floor of 10 weekly sets on every directly trained FOCUS group

**hard_conditional** · approved · topic floor. "Nobody needs less than 10 sets a week per muscle": every directly trained group - quads, hips, chest, back, shoulders, biceps, triceps (calves by T2-FLR-02) - holds 10+ sets with group credit on the main days, every week of a training block.

```
∀g: state_g = FULL, ∀w ∈ W_b (type(b) = stairway): Q^main_{g,w} ≥ F;  F = 10.
```
- **Params:** F = `10` (`rules.volume.floor.value`); counted on = `main_days` (`rules.volume.floor.counted_on`); on = `groups` (`rules.volume.floor.on`); group credit = `true` (`rules.volume.floor.group_credit`); exempt = `["block_types:pre_season,in_season,maintenance,taper,recovery","pain_reduced","credit_only","not_trained_dire… (full value in the JSON)` (`rules.volume.floor.exempt`)
- **Variables:** n, x, state
- **Sources:** R2-VOL-06; R2-VOL-04; R3-VOL-01; R3-SES-01; BRAIN §5.1 V5b; 12 §3.3
- **Engine today:** validators V22, H17; decisions E-02, E-04, E-24
- **Metric `floor_misses`** (group-weeks): Σ over stairway weeks and FULL groups (time_check.trained_groups minus time_check.trained_below_floor) of [main_sets_by_group[g] < 10 − 1e-9] (calves: < meta.targets.calves_floor); below-floor groups are measured by T2-FLR-05 - pass: == 0

#### T2-FLR-02 · Calves floor from leg days

**hard_conditional** · approved+proposed-numbers · topic floor. Calves: one exercise x 3 sets every leg day, weekly floor max(3 x leg days, min(10, 4 x leg days − 1)); 10 a week with fewer than 4 leg days needs a 4th set or the optional-day Calves slot (PROPOSED).

```
state_calves = FULL ⇒ Q_{calves,w} ≥ F_calves(|D^leg|) (DER-04).
```
- **Params:** weekly floor = `10` (`rules.volume.calves.weekly_floor`); per leg day = `{"L1":3,"L2":3,"L3":3}` (`rules.volume.calves.per_leg_day`); optional slot below leg days = `4` (`rules.volume.calves.optional_slot_below_leg_days`)
- **Variables:** n
- **Sources:** VOL-17; R3-SES-01; R2-VOL-06; E-05; E-139; BRAIN §5.1 V13
- **Engine today:** validators V22
- **Metric `calf_floor_misses`** (weeks): stairway weeks with calves trained and weekly_sets_by_group.calves < meta.targets.calves_floor - pass: == 0

#### T2-FLR-03 · Which line carries a group's floor

**definition** · inferred · topic floor. hips → the hamstrings line (glutes when glutes is a Focus line); shoulders → the shoulders line; the others their own line. A pain-reduced line's group is not floored (pain wins).

```
carrier(g) per volume.floor.carriers; pain(l) ⇒ grp(l) ∉ floored.
```
- **Params:** carriers = `{"quads":["quads"],"hips":["hamstrings","glutes"],"back":["lats_upper_back"],"chest":["chest"],"shoulders":["… (full value in the JSON)` (`rules.volume.floor.carriers`)
- **Variables:** S
- **Sources:** R2-VOL-06; R3-SES-01; VOL-03; E-04
- **Engine today:** decisions E-04

#### T2-FLR-04 · Field athletes: chest, back, shoulders floored; arms credit-only

**hard_conditional** · approved+proposed-numbers · topic floor. For competitive field athletes the floor of 10 applies to chest, back, shoulders and glutes too (R2-VOL-06 over UNI-02); biceps and triceps stay credit-only (no direct station unless a Focus muscle or the sport writes direct sets).

```
modifier = field_off ⇒ fill[biceps, triceps] = credit; other groups floored.
```
- **Params:** field_off = `{"lower":0.7,"upper":0.5,"small":0.6,"credit_only":["biceps","triceps"]}` (`rules.volume.modifiers.field_off`)
- **Variables:** state
- **Sources:** R2-VOL-06; UNI-02; R3-VOL-01; D-03; 12 §7 item 10 (open); BRAIN §5.3
- **Engine today:** decisions D-03
- **Metric `athlete_floor_misses`** (group-weeks): as T2-FLR-01 restricted to field athletes - pass: == 0

#### T2-FLR-05 · Deficit of a listed below-floor group (minimize)

**soft** · proposed · topic floor. For a group the policy keeps BELOW_FLOOR (work lift only) or a class lift, the shortfall under 10 is minimized - never hidden.

```
min Σ_{g: state_g = BELOW_FLOOR} Σ_w max(0, F − Q^main_{g,w}).
```
- **Params:** F = `10` (`rules.volume.floor.value`)
- **Variables:** n
- **Sources:** R3-SES-02; E-11
- **Metric `below_floor_deficit`** (sets): Σ (10 − main_sets_by_group[g])+ over trained_below_floor groups - pass: min

#### T2-FLR-06 · Week 1 is planned from the structure, never below the floor

**hard_conditional** · engine · topic floor. The template's structural minimum (every station at its minimum sets) fixes week 1's floor; a group whose structure puts it above its start trains on fewer days (each with 2 exercises) rather than starting at its ceiling.

```
Q_{g,1} = Σ_{d: z_{g,d}=1} Σ_{s} n_{s,1} c_g ≥ F; if Q_{g,1}^{struct} > S_g then reduce |{d: z_{g,d} = 1}| (keep 2-4 per remaining day).
```
- **Params:** group-day reduction = `{"enabled":true,"keep_roles":["work","core_block","survival"],"keep_pair_of_work":true,"note":"a group whose … (full value in the JSON)` (`rules.placement.group_day_reduction`)
- **Variables:** z, n
- **Sources:** R2-SES-05; R3-VOL-04; D-67; E-83
- **Engine today:** decisions D-67, E-83
- **Metric `week1_at_ceiling`** (count): trained lines whose week-1 sets ≥ their ceiling − minimum climb - pass: == 0

### T3 - Stairway monotone climb (12 items)

*Weekly sets never drop, every trained group climbs at least the minimum climb, no long holds, the last week is the hardest, the early steps are smaller than the late ones, whole sets track the planned T(w). Athletic doses climb with the block and never drop.*

#### T3-STW-01 · Never down: planned targets and weekly sets of trained groups never drop

**hard_conditional** · approved · topic stairway. Inside a stairway block a line's planned target never drops and a trained group's weekly sets never drop by a set or more (half a set of quarter-credit rounding allowed).

```
T_l(w) ≥ T_l(w−1);  Q_{g,w} ≥ Q_{g,w−1} − 0.5 for trained g.
```
- **Params:** -
- **Variables:** n, T
- **Sources:** R2-PER-03; R2-PER-04; R3-VOL-04; R3-SES-02 step 4; BRAIN §5.4
- **Engine today:** validators H21
- **Metric `set_drops`** (count): (group, week) pairs with weekly_sets_by_group dropping ≥ 0.5 + ε; target_by_muscle drops - pass: == 0

#### T3-STW-02 · Minimum climb (never flat)

**hard_conditional** · approved+proposed-numbers · topic stairway. Every trained group gains at least 2 whole sets over the block (calves 1, a non-carrier line 1, 1 in a block of 7 weeks or less; a below-floor group 1).

```
Q_{g,N} − Q_{g,1} ≥ mc_g − 0.5;  mc = 2 (calves 1; N ≤ 7: 1).
```
- **Params:** min climb = `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"group":1}}` (`rules.stairway.min_climb`)
- **Variables:** n
- **Sources:** R3-SES-02 ("never flat"); R2-PER-03; 12 §3.10.1 (2-set climb PROPOSED); E-14; BRAIN §5.6.1
- **Engine today:** validators H21
- **Metric `flat_groups`** (count): trained groups with weekly_sets_by_group[N] − [1] < mc − 0.5 - pass: == 0

#### T3-STW-03 · No long holds; the second half climbs; the main days carry the climb

**soft** · proposed · topic stairway. In blocks of 8+ weeks a trained big group with a planned climb of 3+ sets gains half a set or more after the halfway week and never holds its sets (within half a set) for more than half the block + 1 week; the main-day total holds for at most half the block; the week total never stays flat two weeks in a row. The climb must sit on the main days, not only on the optional day.

```
N ≥ 8 ∧ big(g) ∧ climb_g ≥ 3 ⇒ Q_{g,N} − Q_{g,h} ≥ 0.5 ∧ longest_hold_g ≤ h + 1;  longest_hold(Tot^main) ≤ 0.5·N;  ¬(Tot_w = Tot_{w−1} = Tot_{w−2}).
```
- **Params:** hold rules = `{"min_N":8,"min_climb":3,"hold_extra_weeks":1,"main_days":true,"total_hold_max_frac":0.5}` (`rules.stairway.hold_rules`); track = `{"week1_above_target_max":1,"behind_target_max":1,"flat_total_steps_max":1,"last4_growth_share_min":0.5,"note… (full value in the JSON)` (`rules.stairway.track`)
- **Variables:** n
- **Sources:** R3-VOL-04; R3-SES-02 step 4; R2-PER-04; E-92; E-135; E-136
- **Engine today:** validators H21
- **Metric `hold_excess`** (weeks): Σ over trained big groups of max(0, longest hold run − (h + 1)) + flat-second-half count + main-total hold excess - pass: == 0

#### T3-STW-04 · The last week is the hardest; on 12 weeks the last four are the hardest

**hard_conditional** · approved · topic stairway. The weekly resistance total peaks in the last week; on a 12-week block every one of weeks 9-12 is at least every week of 1-8 ("the last 4 weeks are going to be brutal"); the main-day total rises over the block.

```
Tot_N = max_w Tot_w;  N = 12 ⇒ min_{w ≥ 9} Tot_w ≥ max_{w ≤ 8} Tot_w;  Tot^main_N > Tot^main_1.
```
- **Params:** -
- **Variables:** n
- **Sources:** R2-PER-04; R2-PER-05; R3-VOL-04; BRAIN §11.1
- **Engine today:** validators H21
- **Metric `last_week_not_hardest`** (count): blocks failing the rule (total_resistance_sets, total_main_sets) - pass: == 0

#### T3-STW-05 · The stairway shape: small steps to the halfway week, bigger after it

**hard** · approved · topic stairway. About 3 % a week until the halfway week, about 5 % after it - one rule for every person, never by muscle size; every line's early steps are never larger than its late steps.

```
s_w = 0.03 (w ≤ h), 0.05 (w > h); ∀l: max_{w ≤ h} step_l(w) ≤ min_{w > h} step_l(w).
```
- **Params:** steps = `{"early":0.03,"late":0.05}` (`rules.stairway.standard_steps`); halfway = `ceil(N/2)` (`rules.stairway.halfway`)
- **Variables:** T, λ
- **Sources:** R2-PER-03; R3-VOL-04; VOL-05; BRAIN §5.1 V8
- **Engine today:** validators H21, H22
- **Metric `early_step_larger`** (count): lines whose largest planned early step exceeds the smallest late step - pass: == 0

#### T3-STW-06 · λ peak anchoring: the peak lands in the last week

**hard** · approved+proposed-numbers · topic stairway. Each line's steps are scaled by one λ so it reaches its (time-held) ceiling exactly in the last week; λ never above 1 today (so a line whose ceiling is far peaks below it, still in the last week - open item C-01).

```
λ_l per DEF-10 with C̃_l; λ_l ≤ λ_max (= 1); T_l(N) = min(C̃_l, S_l·G(N)).
```
- **Params:** λ = `{"solve":"bisection","lo":0,"hi":1,"iterations":60,"display_round_to":4,"last_week_equals_cap_when_lambda_bel… (full value in the JSON)` (`rules.stairway.lambda`)
- **Variables:** λ, C̃
- **Sources:** R3-VOL-04 ("reaches its ceiling exactly in the last week"); 12 §3.7.1; 12 §7 item 16; D-18; BRAIN §5.4
- **Engine today:** validators H22
- **Metric `peak_not_last`** (count): trained lines whose max weekly sets occur before week N and exceed week N - pass: == 0

#### T3-STW-07 · Whole sets track the planned stairway ("round up, round down")

**soft** · approved+proposed-numbers · topic stairway. Whole weekly sets follow the planned T(w): each set lands in the week its planned target passes the half set, the last in the last week; never more than 1 set above the plan in week 1 or 1+ set behind it; no week without a step where a neighbour holds two.

```
min Σ_{l,w} |V^dir_{l,w} − T_l(w)| s.t. V^dir integer, non-decreasing, V^dir_{l,N} = C̃_l;  the optimum is round_half_up(T_l(w)) whenever that series respects T0-STW-03 (SF-1).
```
- **Params:** release rounding = `{"mode":"scheduled"}` (`rules.stairway.release_rounding`); release = `{"threshold":1,"epsilon":1e-9,"bank_max_blocked":1.99,"staggering":"smallest_bank_waits","order":["priority",… (full value in the JSON)` (`rules.stairway.release`); track = `{"week1_above_target_max":1,"behind_target_max":1,"flat_total_steps_max":1,"last4_growth_share_min":0.5,"note… (full value in the JSON)` (`rules.stairway.track`)
- **Variables:** n
- **Sources:** VOL-06 ("you round up, you round down"); R3-VOL-04; E-85; E-146; BRAIN §5.1 V9; §5.5
- **Engine today:** validators H21, H22
- **Metric `tracking_error`** (sets): Σ |weekly_sets_by_line[l] − target_by_muscle[l]| over trained lines and weeks (direct sets) - pass: min; max per cell ≤ 1

#### T3-STW-08 · Start from the larger of the table start and the week-1 sets; no restart at exercise blocks

**hard** · approved · topic stairway. The stairway climbs from S_l = max(start, week-1 sets) (so no line runs flat while its target catches up) and runs through the whole block across exercise-block boundaries.

```
S_l = max(start_l, V_{l,1});  T_l continuous over w ∈ W_b.
```
- **Params:** continues across exercise blocks = `true` (`rules.stairway.continues_across_exercise_blocks`)
- **Variables:** S, T
- **Sources:** 12 §3.7.1 (v1.2); R3-SES-02 step 4; R2-PER-04; R2-VOL-07; BRAIN §5.5; §7.6
- **Engine today:** validators H22
- **Metric `restart_at_block`** (count): trained lines whose weekly sets drop at an exercise-block start - pass: == 0

#### T3-STW-09 · Stair level rises every week; Focus does not slow the others

**hard** · approved · topic stairway. The displayed level rises every stairway week (2 → 11). A Focus muscle is a small bias inside a balanced plan: every other trained line keeps its own steps (the 3 % cap on the others only under the optional coach priority push).

```
level(w) > level(w−1);  focus.slow_others = false ⇒ λ_l independent of Focus.
```
- **Params:** slow others = `false` (`rules.volume.focus.slow_others`); non-priority cap (push only) = `0.03` (`rules.volume.priority.nonpriority_step_cap`)
- **Variables:** λ
- **Sources:** R2-PER-05; R3-SES-01; VOL-02; R2-VOL-06
- **Engine today:** validators H21, H22
- **Metric `level_not_rising`** (count): weeks whose stair_level does not rise - pass: == 0

#### T3-STW-10 · Timed circuits climb by work seconds

**hard_conditional** · proposed · topic stairway. Bootcamp circuits climb by their work seconds (35 → 50 s) along the planned steps, rounded to 1 s and rising every week while below the top, each step inside the weekly ceiling; rounds fixed by session length.

```
work_s(w) = round(35·Π(1 + λ s_w)), work_s(N) = 50, work_s(w) > work_s(w−1) while < 50, work_s(w)·Tot_w ≤ 1.10·work_s(w−1)·Tot_{w−1}.
```
- **Params:** bootcamp stairway = `{"work_s_start":35,"work_s_max":50,"work_s_step":5,"rounds_start":3,"rounds_max_by_minutes":{"30":3,"45":3,"6… (full value in the JSON)` (`rules.supersets.bootcamp.stairway`)
- **Variables:** work_s
- **Sources:** PRG-03; R2-PER-03; D-72; E-93
- **Engine today:** validators H21
- **Metric `circuit_flat`** (count): circuit weeks whose work does not rise or rises > 10 % - pass: == 0

#### T3-ATH-01 · The athletic stairway: doses climb with the block and never drop

**hard_conditional** · approved+proposed-numbers · topic athletic. Contacts, throws, cuts, sprint metres and Olympic sets climb low → high across a stairway block (the sport's weekly ranges), never drop inside it, and the end-test week holds the week before; a week never plans more than a later week can hold.

```
∀k, w ∈ stairway: A_{k,w} ≥ A_{k,w−1};  A_{k,w} ≤ min_{w′ > w} cap_{k,w′};  test week: A_{k,N} = A_{k,N−1}.
```
- **Params:** reconcile = `{"enabled":true,"tolerance":0.25,"olympic_max_factor":1.5,"contact_rise_max":0.2,"per_set_max":{"plyo_contact… (full value in the JSON)` (`rules.athletic.reconcile`); olympic sets = `{"from_budget":true,"min_per_exposure":2,"max_per_exposure":4,"stay_active":{"sets":2,"reps":[3,6],"heavy_pla… (full value in the JSON)` (`rules.olympic.sets`)
- **Variables:** a, n
- **Sources:** R3-VOL-04 (growth by itself); R3-SES-02 step 4; R2-ATH-04; D-73; E-29; E-35; BRAIN §9.1 A2
- **Engine today:** validators V27
- **Metric `athletic_drops`** (count): (key, week) pairs with athletic_budget.planned dropping inside a stairway block - pass: == 0

#### T3-ATH-02 · Plyometric share ramps from block start to block end

**soft** · approved+proposed-numbers · topic athletic. The share of jump and throw work that is plyometric climbs from (end − 15 points) at the block start to the sport's end share (75 / 60 / 50 / 40 / 25 %), held within 5 points each week.

```
|share_w − share*(w)| ≤ 0.05, share*(w) = (end − 0.15) + progress(w)·0.15.
```
- **Params:** contact classes = `{"1":{"end":0.75},"2":{"end":0.6},"3":{"end":0.5},"4":{"end":0.4},"5":{"end":0.25}}` (`rules.athletic.ground_contact_classes`); start offset = `-0.15` (`rules.athletic.block_start_offset`); tolerance = `0.05` (`rules.athletic.f2.share.tolerance`)
- **Variables:** a, x
- **Sources:** R2-ATH-01; R2-ATH-02; R3-ATH-01; R3-ATH-04; CAT-10; E-97; BRAIN §9.2
- **Engine today:** validators V27
- **Metric `share_off`** (weeks): weeks with |athletic_budget.planned_share − target share| > 0.05 - pass: == 0

### T4 - Time fit (3 items)

*Day minutes within the chosen session length; the x1.10 band is spent only on the minimums (T1-T3), never on extra ceiling height. Only the overrun is minimized here: terms that would reward less volume (fewer supersets, a shorter longest day, fewer exercises) sit below the ceiling attainment of T5.*

#### T4-TIME-01 · Days within the chosen minutes

**soft** · approved+proposed-numbers · topic time. Minimize the minutes over the chosen session length on every non-test day; the 10 % band of T1-POL-02 is a hard limit for the minimums, and a day over 1.25 x while anything is still cuttable is an error. Test-week days may run long with a warning.

```
min Σ_{d,w} max(0, Min_{d,w} − μ_d)  s.t. Min_{d,w} ≤ φ·μ_d (T1-POL-02);  Min_{d,w} ≤ 1.25·μ_d hard unless nothing is cuttable.
```
- **Params:** warn above = `1.1` (`rules.session.long_day.warn_above_factor`); error above = `1.25` (`rules.session.long_day.error_above_factor`); error when cuttable = `true` (`rules.session.long_day.error_when_cuttable`); split-day factor = `1` (`rules.session.long_day.split_day_factor`)
- **Variables:** n, u, p
- **Sources:** UNI-09; R2-SES-05; R3-SES-02; D-34; D-54; E-73; E-111; BRAIN §5.6; §10.5
- **Engine today:** validators V13
- **Metric `overrun_minutes`** (minutes): Σ max(0, est_minutes − minutes_limit) over non-test days; also counts > 1.10x and > 1.25x - pass: min; 0 days > 1.25x

#### T4-TIME-02 · Session lengths and defaults

**hard** · approved+proposed-numbers · topic time. Allowed lengths 30 / 45 / 60 / 75 / 90 / 105 / 120 min (over 90 for competitive athletes only); defaults: athletes, bodybuilders, powerlifters 90 (max 120), general and fat loss 60, bootcamp 45, non-competitive athletic 60, older / injured 60.

```
μ_d ∈ minutes_allowed; μ > 90 ⇒ competitive.
```
- **Params:** allowed = `[30,45,60,75,90,105,120]` (`rules.session.minutes_allowed`); defaults = `{"athletes_bodybuilders_powerlifters":90,"general_fat_loss":60,"bootcamp":45,"non_competitive_athletic":60,"o… (full value in the JSON)` (`rules.session.minutes_default`); over 90 competitive only = `true` (`rules.session.minutes_over_90_competitive_only`)
- **Variables:** μ
- **Sources:** UNI-09; PRG-03; BRAIN §10.5; §10.1 W16
- **Engine today:** validators V3, V26
- **Metric `length_invalid`** (count): plans with a session length outside the allowed list - pass: == 0

#### T4-TIME-03 · Bootcamp and class formats keep their own minutes

**hard** · approved · topic time. Bootcamp: 35-45 min, 3-5 rounds x 30-50 s, 5-7 stations (engine: two circuits of 4-6 stations); CrossFit class: warm-up → light core → skill → strength / power → WOD (10-20 min).

```
format = bootcamp ⇒ Min_d ∈ [35, 45] (by length); rounds ∈ [3,5], work_s ∈ [30,50].
```
- **Params:** bootcamp = `{"circuits":2,"stations":[4,6],"rounds":[3,5],"work_s":[30,50],"transition_s":15,"between_rounds_s":90,"sessi… (full value in the JSON)` (`rules.supersets.bootcamp`); WOD minutes = `[10,20]` (`rules.time_model.wod_minutes`)
- **Variables:** work_s, rounds
- **Sources:** PRG-03; PRG-10; OBSERVED OT18; D-19; D-20; BRAIN §10.1 W17; §10.5
- **Engine today:** validators V13
- **Metric `format_minutes`** (count): bootcamp days outside 35-45 min (for a 45-min choice) - pass: == 0

### T5 - Caps (and ceiling attainment) (9 items)

*Direct sets never above the line ceiling, never above the absolute 30; per-session and per-exercise limits; then reach as close to the ceiling as the minutes allow in the last week. Athletic budget caps and attainment live here.*

#### T5-CAP-01 · Direct sets never above the line ceiling (helper spill-over ≤ 1)

**hard** · approved+proposed-numbers · topic caps. The stairway never places a direct set above a line's (time-held) ceiling; helper credit from other lines may carry the weekly total up to about 1 set over, reported, never chased.

```
V^dir_{l,w} ≤ C̃_l;  V_{l,w} ≤ C̃_l + 1 (soft above C̃_l).
```
- **Params:** cap table = `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L2":22,"L3":25},"glutes":{"L1":14,"L2":22,"L3":25},… (full value in the JSON)` (`rules.volume.cap`); cap rule = `cap = max(round_half_up(cap[m][L] x factor), start + round_half_up((cap[m][L] - start[m][L]) x factor)); prio… (full value in the JSON)` (`rules.volume.cap_rule`)
- **Variables:** n, C̃
- **Sources:** R2-VOL-06; 12 §3.8 (spill-over PROPOSED); E-95; BRAIN §5.1 V6
- **Engine today:** validators V13
- **Metric `over_ceiling`** (sets): Σ max(0, weekly_sets_by_line[l] − cap[l] − 1) over lines and weeks - pass: == 0

#### T5-CAP-02 · How a ceiling is computed

**definition** · approved+proposed-numbers · topic caps. Level ceilings 14 / 22 / 25 for every line (abs 16 / 20 / 20); scaled goals keep their level growth room above the real start (cap = max(round(cap x f), start + round((cap − start_table) x f))); Focus + F bounded by 18 / 26 (chest 28) / 30; completed blocks + 1 each (≤ 25 / 30); calves of field / court athletes start + 2; never below start; never above 30.

```
C_l = min(30, max(S_l, prio_bound(focus(max(rhu(cap·f), S_l + rhu((cap − start⁰)·f))) + k_cycles)));  calves (athletes) = S + 2.
```
- **Params:** cap = `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L2":22,"L3":25},"glutes":{"L1":14,"L2":22,"L3":25},… (full value in the JSON)` (`rules.volume.cap`); cap rule = `cap = max(round_half_up(cap[m][L] x factor), start + round_half_up((cap[m][L] - start[m][L]) x factor)); prio… (full value in the JSON)` (`rules.volume.cap_rule`); priority caps = `{"default":{"L1":18,"L2":26,"L3":30},"chest":{"L1":18,"L2":28,"L3":30}}` (`rules.volume.priority.cap`); absolute cap = `30` (`rules.volume.priority.absolute_cap`); calves athlete climb = `2` (`rules.volume.calves.athlete_climb`); cycles = `{"start_multiplier":1.05,"rounding":"half_up","cap_add":1,"cap_max_nonpriority":25,"cap_max_priority":30,"sam… (full value in the JSON)` (`rules.cycles`)
- **Variables:** C
- **Sources:** R2-VOL-06 ("this is all customizable"); R3-SES-01; VOL-02; D-02; D-39; E-88; BRAIN §5.3
- **Engine today:** decisions D-02, E-88

#### T5-CAP-03 · Absolute ceiling 30 sets a week for any line (Pro setting excepted)

**hard** · approved+proposed-numbers · topic caps. "More than 30 sets per week of a muscle group should probably be for a very advanced person": no line passes 30 on all days with helper credit; only a coach-set Pro setting (L3, one muscle, up to 35) passes it.

```
V_{l,w} ≤ 30 ∀l, w (Pro: one l, ≤ 35, L3, coach).
```
- **Params:** absolute cap = `30` (`rules.volume.priority.absolute_cap`); Pro setting = `{"enabled_by_default":false,"min_level":"L3","muscles_max":1,"cap_max":35,"requires":"coach_rule_pack (Phase … (full value in the JSON)` (`rules.levels.pro_setting`)
- **Variables:** n
- **Sources:** R2-VOL-06; E-95; BRAIN §5.9
- **Engine today:** validators V13
- **Metric `over_30`** (count): line-weeks with weekly_sets_by_line > 30 - pass: == 0

#### T5-CAP-04 · Ceiling attainment: as close to the ceiling as the minutes allow, in the last week

**objective** · approved · topic caps. Each trained line reaches its ceiling in the last week when the time holds it; otherwise the highest peak the time holds, listed as "a lower peak" (trained groups only). Below time fit (T4): the 10 % band is never spent on extra height.

```
min Σ_{l trained} (C_l − C̃_l), C̃_l ≤ P^time_l = the most the minutes hold at μ (this inventory's reading of the tier order, C-16; the engine today places up to φ·μ, D-47).
```
- **Params:** cap = `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L2":22,"L3":25},"glutes":{"L1":14,"L2":22,"L3":25},… (full value in the JSON)` (`rules.volume.cap`)
- **Variables:** C̃, n
- **Sources:** R3-VOL-04; R3-SES-02 step 4; 12 §3.7.1; E-74; E-92
- **Metric `ceiling_shortfall`** (sets): Σ (cap[l] − weekly_sets_by_line[l][N])+ over trained lines - pass: min

#### T5-CAP-05 · Per-session sets per line ≤ 11 (Focus / priority 14)

**soft** · proposed · topic caps. A line's fractional sets in one session stay at or below about 11 (14 for a Focus or priority line).

```
Σ_{s ∈ S_d} n_{s,w} c_l(x_s) ≤ 11 (14 if l ∈ Focus).
```
- **Params:** per session = `{"soft":11,"priority":14}` (`rules.volume.per_session`)
- **Variables:** n
- **Sources:** SCIENCE Remmert (~11); RP 8-12; 12 §3.5 item 7
- **Metric `per_session_over`** (count): (day, line) with > 11 (14) fractional sets - pass: == 0

#### T5-CAP-06 · Focus muscles: at most 2, +1 to +3 each

**hard** · approved · topic caps. At most two Focus muscles; each +F extra weekly sets (default 2, range 1-3) on start and ceiling, its exercise first in its session; the coach-only priority push (+4 / +4 / +6, others ≤ 3 %) is an optional setting, off by default.

```
|Focus| ≤ 2; F ∈ [1,3]; V_{l,w} − V^{balanced}_{l,w} = F for l ∈ Focus.
```
- **Params:** focus = `{"max":2,"add_default":2,"add_range":[1,3],"applies_to":["start","cap"],"cap_bound":"volume.priority.cap","sl… (full value in the JSON)` (`rules.volume.focus`); priority = `{"L1":2,"L2":2,"L3":2}` (`rules.volume.priority.add`)
- **Variables:** S, C
- **Sources:** R3-SES-01; VOL-02; ORD-04; R2-VOL-06; E-06; BRAIN §5.1 V6b
- **Engine today:** validators V8
- **Metric `focus_violation`** (count): plans with > 2 Focus muscles or a Focus add outside 1-3 - pass: == 0

#### T5-ATH-01 · Athletic budget never exceeded

**hard** · proposed · topic athletic. A week's planned dose of a key stays within its target x 1.25 + one set's maximum (reactive + ballistic jumps as one budget); Olympic within 1.5 x (or the exposures' minimum); per-set doses within their bounds; stations per day: COD 2, sprint 1, throws 2, ankle 1; single-leg contacts ≤ 6 a leg (low hops 15); weekly contact rise ≤ 20 %.

```
A_{k,w} ≤ 1.25·Â_{k,w} + max_per_set_k;  olympic ≤ 1.5·Â;  a_{s,w} ∈ [per_set_min_k, per_set_max_k];  A_{contacts,w} ≤ 1.2·A_{contacts,w−1}.
```
- **Params:** tolerance = `0.25` (`rules.athletic.reconcile.tolerance`); olympic max factor = `1.5` (`rules.athletic.reconcile.olympic_max_factor`); per-set max = `{"plyo_contacts":10,"jump_contacts":8,"low_contacts":25,"throws":20,"cod_cuts":12,"sprint_m":240,"upper_conta… (full value in the JSON)` (`rules.athletic.reconcile.per_set_max`); per-set min = `{"plyo_contacts":3,"jump_contacts":3,"low_contacts":6,"throws":6,"cod_cuts":4,"sprint_m":40,"upper_contacts":… (full value in the JSON)` (`rules.athletic.reconcile.per_set_min`); stations per day = `{"AP_COD":2,"AP_SPRINT":1,"AP_THROW":2,"AP_JUMP_LIMITED_KNEE":1}` (`rules.athletic.reconcile.stations_per_day_max`); contact rise = `0.2` (`rules.athletic.reconcile.contact_rise_max`)
- **Variables:** a, n, u
- **Sources:** R2-ATH-01; ATH-01; ATH-06; D-73; E-44; E-71; BRAIN §9.2
- **Engine today:** validators V27
- **Metric `athletic_over_budget`** (count): (key, week) with athletic_budget.planned > 1.25 x targets + one set - pass: == 0

#### T5-ATH-02 · Athletic budget attainment (and an honest warning when the minutes cannot hold it)

**objective** · proposed · topic athletic. Plan each key as close to its weekly target as the stations and minutes hold, keeping the target's shape (one scale factor per exercise block); a stairway peak under 60 % of the sport target must be told (warning.athletic_capacity), jumps and ankle work told apart.

```
min Σ_{k,w} max(0, Â_{k,w} − A_{k,w}) / Â_{k,w};  max_w A_{k,w} < 0.6·Â_{k,N} ⇒ warning.
```
- **Params:** tracks = `{"from_budget":true,"per_station":{"jumps":16,"throws":20,"low_contacts":40,"cod_cuts":24},"max_stations":{"j… (full value in the JSON)` (`rules.athletic.f2.tracks`)
- **Variables:** a, u
- **Sources:** R2-ATH-01; R3-ATH-01; D-73; E-29; E-98; E-105
- **Engine today:** validators V27
- **Metric `athletic_attainment`** (ratio): mean over keys and weeks of planned / target (capped at 1); peaks < 60 % without warning - pass: max; 0 untold

#### T5-ATH-03 · Change of direction for every athlete, by turn angle

**soft** · approved · topic athletic. Every athlete gets change-of-direction work tiered by turn angle (easy, moderate, hard turns; route names for every athlete, receiver routes for football only); sports without COD demand are the first to lose it when time is short; reactive-COD profiles hold one reactive drill a week.

```
family = athletic ⇒ Â_{cod_cuts,w} > 0 (by tier); cut order: cod_non_cod_sport before any group.
```
- **Params:** COD = `{"sport_only_field":"athletic.sport_only","no_cuts_field":"athletic.no_cuts","route_sports":["american_footba… (full value in the JSON)` (`rules.athletic.cod`); COD dosing = `{"reps_from_cuts_per_rep":true,"reactive_drill_ids":["split-step-reaction-drill"],"cuts_per_rep":{"5-10-5-pro… (full value in the JSON)` (`rules.athletic.f2.cod`)
- **Variables:** a, u
- **Sources:** ATH-06; BRAIN §10.1 W22; E-33; E-104
- **Engine today:** validators V27
- **Metric `cod_missing`** (count): athletic weeks of a COD sport with no COD station - pass: == 0

### T6 - Exercise counts (8 items)

*Exercise caps by session length on split days, 3-4 per group preferred on split days, fewest exercises (sets go to existing exercises first), added exercises enter at 2 sets at an exercise-block start, Focus slots 2 x 2-3 sets.*

#### T6-CNT-01 · Exercise cap by session length (split days)

**soft** · approved · topic counts. Resistance sessions about 5 exercises at 45 min, 6-7 at 60, 8-9 at 75-90 ("usually 7"); full-body days are exempt (2-4 per group wins).

```
#resistance exercises(d) ≤ cap(μ_d) on split days; cap = exercise_cap_by_minutes.
```
- **Params:** cap by minutes = `{"30":4,"45":5,"60":7,"75":9,"90":9,"105":9,"120":9}` (`rules.session.exercise_cap_by_minutes`); applies to = `split_days_only` (`rules.session.exercise_cap_applies_to`)
- **Variables:** u
- **Sources:** VOL-08; VOL-16; D-54; BRAIN §5.1 V15; §10.5
- **Engine today:** validators V13
- **Metric `exercise_cap_excess`** (exercises): Σ over split days of max(0, resistance items − cap) - pass: min

#### T6-CNT-02 · 3-4 exercises per group on split days; full-body days start at 2

**soft** · approved · topic counts. "Usually, I have about 3 to 4 exercises per muscle group per day" on split days; full-body days start at 2 per group and may grow.

```
split day ∧ z_{g,d} = 1 ⇒ K_{g,d} ∈ [3,4] (soft); full-body ⇒ K_{g,d} = 2 at the block start.
```
- **Params:** split day = `[2,4]` (`rules.session.exercises_per_group.split_day`)
- **Variables:** u
- **Sources:** VOL-07; R2-SES-05; BRAIN §10.1 W14
- **Metric `split_day_group_counts`** (count): (split day, group) with 2 exercises where 3-4 fit in the minutes - pass: min

#### T6-CNT-03 · Fewest exercises: a new set goes to an existing exercise first

**objective** · approved · topic counts. Add a set to an existing exercise before adding an exercise; a bonus / Focus exercise only when the day's exercises are at their maximum or the muscle comes last "gassed out" ("Ideally, just do not add too much").

```
min Σ_{d,e} #{s: u_{s,e} = 1} subject to T0-T5.
```
- **Params:** order rule = `first_below_first` (`rules.placement.order_rule`)
- **Variables:** u
- **Sources:** VOL-07; UNI-09; E-87
- **Metric `exercise_count`** (exercises): mean resistance items per main day - pass: min

#### T6-CNT-04 · Added exercises enter at 2 sets, only at an exercise-block start

**hard** · approved+proposed-numbers · topic counts. A bonus or Focus exercise the stairway adds opens at 2 sets (never 1), only in the first week of an exercise block (or on the optional day later in the same block while it runs 2+ weeks), one new exercise per line per exercise block.

```
u_{s,e} added ⇒ n_{s,first(e)} = 2 ∧ added at first(e) (or optional-day rule); #added(l, e) ≤ 1.
```
- **Params:** added slots = `{"entry_sets":2,"only_at_exercise_block_start":true,"big_lines_on_optional_day":"focus_only","optional_focus"… (full value in the JSON)` (`rules.placement.added_slots`)
- **Variables:** u, n
- **Sources:** VOL-16; PER-02; ORD-11; E-86; BRAIN §5.5
- **Engine today:** validators V24
- **Metric `bad_added_exercise`** (count): added items at 1 set or appearing mid exercise block - pass: == 0

#### T6-CNT-05 · Optional-day Focus slots: up to 2 x 2-3 sets

**hard** · approved · topic counts. Optional days (Calves, Cardio, Core, Focus 1, Focus 2) are add-ons or separate days (ideally separate); two Focus slots of 2-3 sets each, both may hit the same muscle; Focus slots never for credit-only arms.

```
#focus slots(D^opt) ≤ 2; n ∈ [2,3]; target(l) ≠ credit.
```
- **Params:** optional days = `{"stairway_sets":false,"focus_slots_max":2,"focus_sets":[2,3],"focus_only_for":["priority","floor_lifted_smal… (full value in the JSON)` (`rules.placement.optional_days`)
- **Variables:** u, n
- **Sources:** ORD-10; ORD-11; E-96; BRAIN §5.1 V12; §10.1 W13
- **Metric `focus_slot_violation`** (count): optional days with > 2 Focus slots or slots outside 2-3 sets - pass: == 0

#### T6-CNT-06 · Default sets when a slot starts

**definition** · approved · topic counts. 3 on compounds, 2 on isolation, 3 calves (one calf exercise), 2 core, athletic slots 2 (3 at 90 min), Focus 2; the work lift starts at 3 from 60 min (2 under).

```
n_{s,1} = default_sets[class(s)], then the stairway.
```
- **Params:** default sets = `{"compound":3,"isolation":2,"calves_first":2,"calves_second":1,"core":2,"athletic":2,"athletic_at_90":3,"focu… (full value in the JSON)` (`rules.session.default_sets`); work min sets = `3` (`rules.placement.work_min_sets`); from minutes = `60` (`rules.placement.work_min_sets_from_minutes`)
- **Variables:** n
- **Sources:** VOL-16; VOL-17; D-69

#### T6-CNT-07 · Field-athlete day split inside the 12

**hard** · approved · topic counts. Cross pattern (the default for most athletes): the resistance groups take about 9 of the 12, leaving 2 jump / throw stations + 1 Olympic lift; the same-pattern athletic template (size-focused and high-level athletes): 3-4 jump stations + 1 Olympic lift.

```
cross ⇒ #(jump ∪ throw)(d) ≤ 2 ∧ #olympic(d) ≤ 1; same-pattern ⇒ #jump(d) ≤ 4 ∧ #olympic(d) ≤ 1.
```
- **Params:** split = `{"share_counts":{"plyometric":["plyo_contacts","low_contacts"],"over":["plyo_contacts","jump_contacts","low_c… (full value in the JSON)` (`rules.athletic.split`)
- **Variables:** u
- **Sources:** R3-SES-01; E-19; E-98; BRAIN §10.3; §9.1 A23
- **Engine today:** validators V13
- **Metric `athletic_split`** (count): cross-pattern athlete days with > 2 jump / throw stations or > 1 Olympic lift - pass: == 0

#### T6-CNT-08 · Joint care: at most 2 items a day, outside the exercise count

**hard** · proposed · topic counts. Joint-care (prehab) items stay outside the exercise cap, at most 2 a day.

```
#prehab(d) ≤ 2.
```
- **Params:** per day = `2` (`rules.prehab.per_day_max`)
- **Variables:** u
- **Sources:** D-23; E-75
- **Metric `prehab_over`** (count): days with > 2 prehab items - pass: == 0

### T7 - Pairing, order and placement preferences (13 items)

*VOL-07 staircase inside a day, R3-VOL-03 alternation between the two exposures of a day type, bonus / Focus placement, default orders, same- vs cross-pattern pairing, superset recommendations and straight sets by default, even exposure days, week shape and frequency.*

#### T7-PLC-01 · Inside a day: the coach's staircase (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3)

**soft** · approved · topic placement. A line's sets on a day go to its exercises in session order, the first exercise first: the first exercise whose sets are below the first exercise's takes the next set; an isolation only catches up with the line's compounds, never passes them.

```
procedure: the next set of l on d goes to the first s_i (session order) with n_{s_i} < n_{s_1}; if all equal, to s_1; never past max sets; an isolation only when every compound of l on d holds more.  Closed form when the week-1 vector is a staircase (the usual 2/2/2 or 3/2/2): n_{s_i} = ⌊N_{d,l}/k⌋ + [i ≤ N_{d,l} mod k], clipped at max sets (water-filling).
```
- **Params:** order rule = `first_below_first` (`rules.placement.order_rule`)
- **Variables:** n
- **Sources:** VOL-07 ("adding sets to the things that matter most"); E-87; BRAIN §5.5; BRAIN §5.1 V10
- **Metric `staircase_deviation`** (sets): Σ over (day, line) of |n − staircase(N)| per exercise - pass: == 0

#### T7-PLC-02 · Between the two exposures of a day type: alternate (Monday first, then Thursday)

**soft** · approved · topic placement. When a day type runs twice a week, an added set goes to Monday's first exercise this time and Thursday's the next, so both days stay even.

```
∀(d, d′) ∈ Π, ∀l, w: ΔN_{d,l,w} − ΔN_{d′,l,w} ∈ {0, 1}, ΔN_{d,l,w} = N_{d,l,w} − N_{d,l,1} (sets added since week 1; the earlier exposure takes the odd set).
```
- **Params:** day rotation = `alternate_same_day_type` (`rules.placement.day_rotation`)
- **Variables:** n
- **Sources:** R3-VOL-03 (RIGHT); R2-VOL-08; E-20; E-77; BRAIN §5.1 V10; §10.1 W28
- **Metric `exposure_imbalance`** (sets): Σ over exposure pairs, lines, weeks of max(0, |ΔN_d − ΔN_d′| − 1) + [ΔN_d′ > ΔN_d] (ΔN = sets added since week 1 on that day) - pass: == 0

#### T7-PLC-03 · Small-muscle extras become a bonus exercise on the optional day (or a day already training it)

**soft** · approved · topic placement. When the days are full, a small line's extra sets become a short bonus exercise (2 sets, same category) on the optional day; with no optional day, on a day that already trains that muscle (its 2nd-4th exercise), never as that day's only exercise for it. Calves never get a second calf exercise on a leg day: their extras go to the existing calf exercise (≤ 4 sets) and then the optional-day Calves slot.

```
overflow(l small) ⇒ bonus on D^opt, else on d with z_{grp(l),d} = 1 (fewest exercises); calves overflow ⇒ n_calf ≤ 4 then D^opt Calves slot.
```
- **Params:** bonus = `{"sets":2,"for":"small","prefer":["optional_day","day_training_group_fewest_exercises"],"never_only_exercise_… (full value in the JSON)` (`rules.placement.bonus`); optional-day calves below leg days = `4` (`rules.volume.calves.optional_slot_below_leg_days`)
- **Variables:** u, n
- **Sources:** R3-VOL-03 (RIGHT); VOL-07; R3-SES-01; E-20; E-139; BRAIN §5.1 V11
- **Metric `bonus_misplaced`** (count): bonus items alone for their group on a main day, or a second calf exercise on a leg day - pass: == 0

#### T7-PLC-04 · Big lines climb on the main days; only a Focus line may climb on the optional day

**soft** · proposed · topic placement. The main days carry the stairway; the optional day's template slots never take stairway sets; a big line may take a 2-set Focus exercise on the optional day only when it is a Focus line (inside its two Focus slots x 2-3 sets); otherwise its ceiling becomes what the main days hold.

```
D^opt template slots: n constant; big l ∉ Focus ⇒ Δ_w V_l comes from D^main only.
```
- **Params:** main days first = `true` (`rules.placement.main_days_first`); optional days = `{"stairway_sets":false,"focus_slots_max":2,"focus_sets":[2,3],"focus_only_for":["priority","floor_lifted_smal… (full value in the JSON)` (`rules.placement.optional_days`); big lines on optional day = `focus_only` (`rules.placement.added_slots.big_lines_on_optional_day`)
- **Variables:** n, u
- **Sources:** ORD-10 ("ideally separate days, so they don't get in the way"); ORD-11; R3-VOL-03; E-86; E-135
- **Metric `climb_on_optional_only`** (count): trained big groups whose main_sets_by_group is flat while weekly_sets_by_group rises - pass: == 0

#### T7-PLC-05 · Laterality-aware placement

**soft** · proposed · topic placement. When the block's bilateral share is more than 3 points below its target, the next set goes to a bilateral exercise; more than 3 above, to a unilateral one.

```
β^{reg}_e < β* − 0.03 ⇒ prefer bilateral s; > β* + 0.03 ⇒ unilateral.
```
- **Params:** tolerance = `0.03` (`rules.placement.laterality_tolerance`)
- **Variables:** n
- **Sources:** UNI-02; VOL-07; 12 §3.9 item 2

#### T7-ORD-01 · The Focus muscle's exercise first in its session; isolation first only as a priority

**soft** · approved · topic order. A Focus muscle's exercise goes first in its session (small muscles included); otherwise isolation never opens a session.

```
l ∈ Focus ⇒ pos(first s of l on d) = min pos(strength ∪ accessories).
```
- **Params:** first in session = `true` (`rules.volume.priority.first_in_session`)
- **Variables:** pos
- **Sources:** ORD-04; R3-SES-01; BRAIN §10.1 W8
- **Metric `focus_not_first`** (count): days training a Focus line whose first resistance item is not that line - pass: == 0

#### T7-ORD-02 · Clean family on knee days, snatch family on hip days

**soft** · approved · topic order. Cleans are more "squatty", snatches more "hingy": clean family on squat-pattern days, snatch family on hinge-pattern days (the template station decides when it says so).

```
family(x_s) = clean ⇒ day pattern(d) = knee; snatch ⇒ hip.
```
- **Params:** day pattern = `{"clean":"knee","loaded_jump":"knee","snatch":"hip","swing":"hip","jerk":"either"}` (`rules.olympic.day_pattern`)
- **Variables:** x
- **Sources:** R2-ATH-04; C-18; BRAIN §10.1 W22; §10.7
- **Engine today:** validators V19
- **Metric `olympic_day_pattern`** (count): clean on a hip day / snatch on a knee day without a template variant - pass: == 0

#### T7-ORD-03 · Default orders inside the strength block

**soft** · observed · topic order. Leg extension before leg curl; isolation follows its day; KB face pulls on pull or shoulder days; constraint rises through the session (free and fast first, machines last); landing before reactive jumping, bilateral before unilateral plyos, unloaded before loaded; conditioning last (except a fighter's / hybrid opening aerobic block or the sprint block).

```
soft precedence pairs P_default; cost = #violated pairs.
```
- **Params:** -
- **Variables:** pos
- **Sources:** OBSERVED C1; R2-LIB-04; LIB-10; CAT-10; R2-ATH-03; ORD-09; BRAIN §7.7
- **Metric `default_order_violations`** (count): violated default precedence pairs - pass: min

#### T7-PAIR-01 · Same-pattern vs cross-pattern pairing by goal

**soft** · approved · topic pairing. Same pattern (squat + lunge) drives a muscle harder: muscle and strength goals, size-focused and high-level athletes. Cross pattern (squat + single-leg hinge) keeps soreness down: bootcamp, fat loss, general, stay-active, most athletes, in-season.

```
template grammar ∈ {G1 same, G2 cross} by (goal, ath03_group, season phase).
```
- **Params:** same pattern = `{"goals":["muscle","strength"],"ath03_groups":["size_strength","resistance"]}` (`rules.pairing.same_pattern`); cross pattern = `{"goals":["fat_loss","general","athletic","active","hybrid"],"formats":["bootcamp"],"season_phases":["IN"]}` (`rules.pairing.cross_pattern`)
- **Variables:** x, u
- **Sources:** UNI-06; R3-SES-01; BRAIN §10.3; BRAIN §10.1 W7
- **Metric `pairing_style`** (count): plans whose grammar does not match the goal rule - pass: == 0

#### T7-PAIR-02 · Superset pairs and contrast

**soft** · approved+proposed-numbers · topic pairing. Recommended pairs: knee lift + pull, hip lift + push, biceps + rear delts, triceps + side delts, calves + delts, the two core exercises; contrast stations (78-85 %, straight into the jump) for L2+ athletes off-season.

```
rec_{s,s′} for {class(s), class(s′)} ∈ recommend.pairs; contrast ⇔ L ≥ 2 ∧ off-season ∧ athlete.
```
- **Params:** pairs = `[["knee","pull"],["hip","push"],["ISO_BICEP","rear"],["ISO_TRICEP","side"],["ISO_CALF","delts"],["core","core… (full value in the JSON)` (`rules.supersets.recommend.pairs`); contrast = `{"min_level":"L2","season":["OFF_EARLY","OFF_BUILD","OFF_LATE"],"heavy_pct":[78,85],"rest_inside":0,"enabled_… (full value in the JSON)` (`rules.athletic.contrast`)
- **Variables:** p
- **Sources:** ORD-05; R3-SES-02; ATH-12; BRAIN §10.6

#### T7-WEEK-01 · Week shape and frequency

**soft** · observed · topic week. A1, B1, OPT, A2, B2, OPT, OFF for 4-6 days; consecutive days alternate lower dominance; 4-day plans grow by optional days, not more heavy sessions; with 4+ resistance days every lower pattern 2x a week, push 2x, pull 2x.

```
|D^main| ≥ 4 ⇒ #days(knee), #days(hip), #days(push), #days(pull) ≥ 2.
```
- **Params:** optional days = `free_weekdays_nearest_template_day_skipping_play_and_game_days` (`rules.template_select.optional_days`)
- **Variables:** z
- **Sources:** OBSERVED BYOP; BRAIN §10.7; ORD-10
- **Metric `frequency_shortfall`** (count): patterns below 2 days a week in 4+ day plans - pass: min

#### T7-PAIR-03 · Straight sets by default; supersets only when needed (or by trigger)

**objective** · approved+proposed-numbers · topic pairing. Supersets are a fatigue and density tool: on when the minutes need them, for advanced lifters who need more stimulus, off-season athletes' conditioning, or beginners who do not fatigue; otherwise recommended but off.

```
min Σ p_{s,s′} over pairs not needed for the T4 optimum, unless trigger(intake) ∈ supersets.triggers (filed below T5: minimizing supersets above the ceiling attainment would shrink the stairway).
```
- **Params:** default = `straight_sets` (`rules.supersets.default`); triggers = `{"short_session":true,"l3_preference":true,"athlete_off_season":true,"l1_preference":true}` (`rules.supersets.triggers`)
- **Variables:** p
- **Sources:** ORD-05; R3-SES-02; BRAIN §10.6
- **Metric `supersets_on_unneeded`** (count): pairs on that the day does not need and no trigger asks for - pass: min

#### T7-WEEK-02 · Even exposure days; cuts come off the most loaded day

**soft** · inferred · topic week. The two exposures of a day type stay even; when room must be cut, it comes off the day with the most peak-week minutes first.

```
min Σ_{(d,d′) ∈ Π} |Min_{d,N} − Min_{d′,N}| with the volume fixed by T1-T5; when room must be cut (T1), cut from argmax_d Min_{d,N} first (filed below T5: a min-max of day minutes above the ceiling attainment would lower every peak).
```
- **Params:** -
- **Variables:** n, u
- **Sources:** R3-VOL-03 ("so both days stay even"); E-77
- **Metric `day_spread`** (minutes): max − min est_minutes over main days of the last week; and over each exposure pair - pass: min

### T8 - Balance and variety (10 items)

*Bilateral : unilateral share, push : pull, contra / ipsi, frontal / transverse, rotation bias, core planes, second exposure different, one-detail block changes, near-duplicates, exercise preference scoring.*

#### T8-BAL-01 · Bilateral : unilateral share by profile, phase and exercise block

**soft** · approved+proposed-numbers · topic balance. Anywhere from 90/10 to 10/90, adjustable: bodybuilders / powerlifters 50 → 80 → 90 % bilateral by exercise block; field / court change-of-direction athletes 20 → 15 % (pre-season 15, in-season 10); beginners 50; stay-active / bootcamp 50 → 40; older 60 on supported machines; pain shifts 20 points toward the pain-free side. Placement keeps within 3 points; the plan is checked at 12.

```
min Σ_e max(0, |β^{lower}_e − β*_e| − 0.03) (validator warns > 0.12); β* from the profile table; slider ∈ [0.1, 0.9].
```
- **Params:** profiles = `{"bb_pl":{"lower":{"by_exercise_block":[0.5,0.8,0.9]},"upper":{"by_exercise_block":[0.5,0.8,0.9]}},"beginner_… (full value in the JSON)` (`rules.bilateral_share.profiles`); tolerance = `0.03` (`rules.bilateral_share.tolerance`); validate tolerance = `0.12` (`rules.bilateral_share.validate_tolerance`); pain shift = `0.2` (`rules.bilateral_share.pain_shift`); slider = `[0.1,0.9]` (`rules.bilateral_share.slider_range`)
- **Variables:** x, n
- **Sources:** UNI-02; UNI-03; UNI-10; CAT-13; 12 §3.11 (numbers PROPOSED where he gave none); E-127; BRAIN §6.1; §6.2
- **Engine today:** validators V28
- **Metric `laterality_error`** (points): Σ over exercise blocks of max(0, |realized lower share − target| − 0.03) - pass: min; none > 0.12

#### T8-BAL-02 · Upper-body laterality by the same logic

**soft** · approved · topic balance. Field athletes keep 80-90 % single-arm work up top as well; alternating counts as unilateral (the engine dial reads the lower body only - open).

```
min max(0, |β^{upper}_e − β*^{upper}_e| − 0.03).
```
- **Params:** profiles = `{"bb_pl":{"lower":{"by_exercise_block":[0.5,0.8,0.9]},"upper":{"by_exercise_block":[0.5,0.8,0.9]}},"beginner_… (full value in the JSON)` (`rules.bilateral_share.profiles`)
- **Variables:** x, n
- **Sources:** UNI-03; UNI-07; E-127 (open part); BRAIN §6.1
- **Metric `upper_laterality_error`** (points): as T8-BAL-01 on the upper region - pass: min

#### T8-BAL-03 · Push : pull balance

**soft** · proposed · topic balance. Weekly pull sets at least 0.8 x push sets unless pushing is a Focus; swimmers back ≥ 1.5 x chest (DER-08).

```
V_back ≥ 0.8·V_chest (+ pressing) unless chest / shoulders ∈ Focus.
```
- **Params:** -
- **Variables:** n
- **Sources:** VOL-18; D-09; D-74 (V29); E-23
- **Engine today:** validators V29
- **Metric `push_pull_ratio`** (ratio): weekly pull / push credited sets - pass: ≥ 0.8

#### T8-BAL-04 · Balanced groups (no unintended bias)

**soft** · approved · topic balance. Unbalanced templates were not intended: every trained group sits at a similar point of its own stairway; a bias (V-taper) only through the Focus muscles.

```
min Var_{l trained}( V_{l,w} / T_l(w) ) per week.
```
- **Params:** -
- **Variables:** n
- **Sources:** VOL-18; R3-SES-01 ("as much as everything else is balanced"); E-84
- **Metric `group_balance`** (ratio): max / min of weekly_sets_by_line[l] / target over trained lines (last week) - pass: min

#### T8-BAL-05 · Contralateral / ipsilateral, frontal / transverse, rotation bias, core planes

**soft** · approved+proposed-numbers · topic balance. Change-of-direction athletes load about 70 % of unilateral sets contralaterally, sprinters about 60 % ipsilateral step-ups, bodybuilders / powerlifters use contra / ipsi as health accessories in weeks 1-4; court and combat athletes 45-50 % frontal / transverse unilateral work, aesthetics 10 %; external- and internal-rotation positions every week; the core opener one thorax + one pelvis exercise, planes rotating across the week, each core exercise once a week.

```
shares within ±tolerance of contra_ipsi / frontal_transverse targets; ∀w: ∃ zone-1/3 and zone-2 positions; core planes cover {sagittal, frontal, transverse}.
```
- **Params:** contra / ipsi = `{"cod_contralateral_share":0.7,"sprinter_ipsilateral_share":0.6,"split_stance":"contralateral","bb_pl_health_… (full value in the JSON)` (`rules.contra_ipsi`); frontal / transverse = `{"default_share_from_profile":true,"court_combat_share":[0.45,0.5],"aesthetics_share":0.1,"quota_from_profile… (full value in the JSON)` (`rules.frontal_transverse`); core planes = `["sagittal","frontal","transverse"]` (`rules.core_block.plane_rotation`)
- **Variables:** x
- **Sources:** CAT-13; UNI-12; R2-LIB-02; R2-LIB-03; CAT-08; E-52; BRAIN §6.3; §6.4; §3.2
- **Metric `plane_mix_error`** (points): deviation of realized contra / frontal shares from targets - pass: min

#### T8-VAR-01 · Second weekly exposure of a slot = a different exercise of the same category

**soft** · approved · topic variety. Monday and Thursday squat slots hold different squats (for squats and hinges the second is the non-axial one); when the kit has no real alternative, the same exercise comes back with one concrete detail.

```
∀(d, d′) ∈ Π, matching slots s, s′: x_s ≠ x_{s′} (or x_{s′} = x_s ⊕ detail when X_s has no other option).
```
- **Params:** second exposure different = `true` (`rules.selection.second_exposure_different`)
- **Variables:** x
- **Sources:** PER-04 (RIGHT); R2-SES-01; E-48; BRAIN §7.1 T12; §10.1 W6
- **Metric `repeated_exposure`** (count): exposure pairs with the identical exercise and no detail while an alternative exists - pass: min

#### T8-VAR-02 · Block-to-block changes: one or two small variables, never all at once

**soft** · approved+proposed-numbers · topic variety. Between exercise blocks each changed slot changes one or two of grip, stance, implement, range of motion or rep range - never all at once; work lifts, the core block and tested lifts stay; no return to an earlier pick (A-B-A); no load downgrade; every day changes at least one slot.

```
∀s: dist(x_{s,e}, x_{s,e+1}) ≤ 2 details; changed share ≤ max_share_of_slots; ρ(s) ∈ keep_roles ⇒ unchanged.
```
- **Params:** block change = `{"max_share_of_slots":0.34,"keep_roles":["work","core_block","tested"],"prefer_same":["pattern","laterality"]… (full value in the JSON)` (`rules.selection.block_change`)
- **Variables:** x
- **Sources:** PER-02; R2-LIB-01; E-46; BRAIN §7.6
- **Metric `block_change_violations`** (count): slots changing > 2 details, kept roles changed, A-B-A returns - pass: == 0

#### T8-VAR-03 · No near-duplicates in a session; week families

**soft** · inferred · topic variety. Two versions of one movement differing only in trivial words (seated vs bent-over reverse fly, two pulldown grips) are one exercise: never two in a session; at most 2 of a movement family a week (lying triceps extensions, reverse flies, sissy squats ...).

```
∀d: no two s with near_duplicate(x_s, x_{s′}); ∀ family: #week ≤ 2.
```
- **Params:** near duplicate = `{"scope":"day","week_scope_kinds":["isolation","focus"],"trivial_tokens":["seated","standing","bent-over","ch… (full value in the JSON)` (`rules.selection.near_duplicate`)
- **Variables:** x
- **Sources:** R2-SES-05 ("2-4 different exercises"); PER-04; E-47; E-131
- **Metric `near_duplicates`** (count): sessions holding near-duplicate items - pass: == 0

#### T8-VAR-04 · Exercise preference scoring

**objective** · inferred · topic variety. Picks follow the coach's defaults and the client: the slot default, preference (machines / free weights), constraint band (older / injured 4-5), the level ladder (above-level is a fallback), lead lifts (a two-arm press first; canonical barbell work lifts for class / strength / physique), L1 / 50+ / pain clients dumbbells / kettlebells / machines before a barbell, home substitutes only when needed, sport hot-spot avoid / prefer tags.

```
max Σ_s score(x_{s,e}; client) with rules.selection.weights.
```
- **Params:** weights = `{"default_in_slot":3,"preference_match":1.5,"constraint_in_band":2,"constraint_distance":-1,"over_ladder_step… (full value in the JSON)` (`rules.selection.weights`)
- **Variables:** x
- **Sources:** CAT-04; CAT-05; EQ-03; EQ-04; EQ-09; EQ-10; GEN-04; E-49; E-51; E-130

#### T8-VAR-05 · A/B lead-lift weeks for clients who want variety; aerobic colours

**soft** · approved · topic variety. Week A / week B lead lifts only when the client ticks variety; never the same aerobic colour twice in a week except the aesthetics second easy Orange.

```
variety_ab ⇒ alternate lead lifts by week parity; colours distinct (aesthetics: Orange twice).
```
- **Params:** variety A/B = `{"lead_lift_alternates":true}` (`rules.selection.variety_ab`)
- **Variables:** x
- **Sources:** PER-03; R2-SES-06; OBSERVED AE A5; BRAIN §7.1 T11; §7.6

## 7. The objective as a lexicographic vector

lexicographic (preemptive goal programming): minimize f0, then maximize f1, then minimize f2 … f8, each tier optimized over the optimal set of the tiers above it; within-tier weights are PROPOSED.

| Tier | Sense | Expression | Rules |
|---|---|---|---|
| T0 | feasibility | f0 = Σ hard violations = 0 (no plan with f0 > 0 is shown; a refer has no weeks) | all kind = hard in T0 |
| T1 | max (lex) | f1 = (state_{π_1}, …, state_{π_n}) lexicographic, then the offers / lists (outputs) | T1-POL-01 … T1-POL-14 |
| T2 | min | f2 = Σ_{g BELOW_FLOOR} Σ_w max(0, F − Q^main_{g,w})   (0 by construction for FULL groups) | T2-FLR-01 … 06 |
| T3 | min | f3 = 10^3·Σ_g max(0, mc_g − ΔQ_g) + 10^2·Σ_{g,w} max(0, Q_{g,w−1} − Q_{g,w}) + 10·hold_excess + Σ_{l,w} \|V^dir_{l,w} − T_l(w)\| + share deviation of the athletic ramp | T3-STW-01 … 10, T3-ATH-01/02 |
| T4 | min | f4 = Σ_{d,w} max(0, Min_{d,w} − μ_d)  (overrun only: no term that rewards less volume may sit above T5) | T4-TIME-01 … 03 |
| T5 | min | f5 = 10^2·Σ_{l,w} max(0, V_{l,w} − C̃_l − 1) + per-session excess + [resistance shortfall Σ_l (C_l − C̃_l) and athletic gap Σ_{k,w} max(0, Â_{k,w} − A_{k,w}) / Â_{k,w}, competitive athletes: athletic gap first; everyone else: resistance first (PROPOSED)] | T5-CAP-01 … 06, T5-ATH-01 … 03 |
| T6 | min | f6 = Σ_{split d} max(0, #ex_d − cap(μ_d)) + ε·Σ_d #ex_d + Σ deviations from 3-4 on split days | T6-CNT-01 … 08 |
| T7 | min | f7 = staircase deviation + exposure imbalance + misplaced bonus + optional-day-only climbs + default-order violations + supersets on that are not needed + uneven exposure days | T7-* |
| T8 | min | f8 = laterality error + push:pull shortfall + group imbalance + plane-mix error + variety penalties − preference score | T8-* |

Weights inside a tier (the powers of 10, ε) are PROPOSED orderings of the tier's own terms; across tiers there are no weights - a solver either optimizes tier by tier (fix the optimum of tier k as a constraint, then optimize k+1) or uses one big-M weighted sum whose weights provably dominate (each tier's weight larger than the maximum possible value of everything below it).

## 8. Structural facts a solver can use

**SF-1 · The coach's rounding is the optimal monotone integer tracker.** T_l(w) is non-decreasing (every factor 1 + λ s_w ≥ 1), and round_half_up is a non-decreasing function, so V^dir_{l,w} = round_half_up(T_l(w)) is automatically monotone, has |V − T| ≤ 0.5 (the best possible L∞ error for integers), and lands on C̃_l in week N when C̃_l is an integer. "You round up, you round down" (VOL-06) therefore needs no bank or smoothing logic on the direct sets; the only source of non-integers is quarter-set helper credit, which a solver should hold fixed per exercise choice and add on top (T5-CAP-01 tolerates +1). Caveat: while ΔT ≤ 1 a week the rounded series rises by at most one set a week; above about 20 sets a late 5 % step exceeds 1 set and the rounded series can jump 2 in one week - the placed limit (T0-STW-03) then spreads it to the neighbouring week. *(Used by: T3-STW-07, T3-STW-01.)*

**SF-2 · λ is unique and cheap.** f(λ) = S·(1 + 0.03λ)^{h−1}·(1 + 0.05λ)^{N−h} is strictly increasing on [0, 1], so for S < C̃ < S·G(N) the root is unique; 60 bisection steps (D-18) or 5 Newton steps on ln f give it to machine precision. Reference values (12 §3.7.1): N = 12, L2 big 15 → 22: λ = 0.87 (2.60 % / 4.33 %); L3 big 20 → 25: λ = 0.50; L1 10 → 14: λ = 0.76. A λ above 1 (late steps up to 7 %) is the only way small lines reach 22 / 25 in 12 weeks (C-01). *(Used by: DEF-10, T3-STW-06.)*

**SF-3 · VOL-07 is a closed-form apportionment.** Given the sets N_{d,l} a line gets on a day and its k exercises in session order, the coach's staircase (starting from a staircase week-1 vector such as 2/2/2 or 3/2/2) is n_i = ⌊N/k⌋ + [i ≤ N mod k] (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3), i.e. Hamilton / largest-remainder apportionment with ties broken by session order, clipped at the per-exercise maximum by water-filling. The isolation-never-passes-a-compound rule (E-87) holds automatically because compounds come first in the session order. *(Used by: T7-PLC-01.)*

**SF-4 · R3-VOL-03 is the same apportionment across exposures.** For a day type with two exposures the sets a line adds over week 1 split ⌈Δ/2⌉ / ⌊Δ/2⌋ with the earlier day taking the odd set (Monday first, then Thursday). Combined with SF-3, the whole per-day, per-exercise allocation of a line is a deterministic function of its weekly direct total V^dir_{l,w}, its days and its exercise order. The free dosing decisions therefore collapse to (state_g, z_{g,d}, the exercise layout per exercise block, V^dir_{l,w}) - at most 9 lines x 16 weeks = 144 integers per block plus the layout. *(Used by: T7-PLC-02, T7-PLC-01.)*

**SF-5 · Everything except group credit and superset rest is linear in the sets.** With the exercise layout fixed, credits are constants (c_l(x) = min(1, Σ) is evaluated per exercise, not per set), so V and Q are linear in n. Straight-set minutes are linear in n. A superset with equal sets costs n·(Σ work + max rest), linear; with unequal sets n1 ≥ n2 it costs n2·(w1 + w2 + max(r1, r2)) + (n1 − n2)·(w1 + r1) - linear once the order is fixed, and SF-3 fixes it. So, per layout, the dosing problem is an integer linear program; the hard part is the combinatorial layout / state choice, not the arithmetic. *(Used by: DEF-09, T1-POL-02, T4-TIME-01.)*

**SF-6 · A capacity lower bound prunes the R3-SES-02 search.** For a candidate trained set Y: Σ_{d ∈ D^main} φ·μ_d ≥ Σ_d overhead_d + Σ_{g ∈ Y} [F_g·τ^min_g + co^min_g·|days(g)|·2] + Σ_{kept fixed blocks} minutes, where overhead_d = warm-up + core opener (+ skill), τ^min_g = the cheapest per-set minutes of g's legal exercises with the superset discount (a bilateral compound paired with an upper compound: (0.75 + 0.75 + 1.5) / 2 = 1.5 min a set; straight 2.25), co^min = 0.5 in a pair. Any Y that fails the bound is infeasible without building it; for the peak week add each group's minimum climb. The bound is necessary, not sufficient (pairing, axial and day assignment can still fail). *(Used by: T1-POL-05, T1-POL-02.)*

**SF-7 · Where the minutes go in a 2 x 45 week (worked numbers, model time parameters).** Per straight set: bilateral compound 2.25 min, unilateral compound 3.0, isolation 1.85, core 1.5, joint care 1.35, throw 1.6, Olympic 3.0; warm-up 8; core opener 5.5 as a pair (8 straight); fit limit 45 x 1.10 = 49.5. Day with 4 big movers at the floor (5 sets each a day: knee + pull pair 3 + 3, hip + push pair 3 + 3, second exercises isolation + compound 2 + 2, all paired): 46.9 min - fits; the same at the peak (+2 sets a group a week): 52.9 - does not. Calves (pinned, 3 sets) + hips + quads at the peak (12 a week each), straight sets: 49.05 - fits. One throw station (2 sets) + one Olympic piece (2 sets) + two joint-care items cost 15.9 min a day. So for the coach's own example the decisive question is not the volume math but which fixed blocks (athletic, power, joint care, core) stay inside 45 minutes: without them three groups climb; with all of them about one does. Sample 08 shows it: at fix round 1 it trained hips only (10 → 13); the fix-round-2 regeneration (samples/plans, 2026-10-10 00:57 UTC) keeps quads and hips below the floor on their work lifts (4 → 6 and 4.5 → 5.75 sets), calves 7 → 8, back as one 2-set pattern station and no press at all, with main days at 44-49 min for 45. Illustrative composition; computed with rules.time_model. *(Used by: T1-POL-05, T1-POL-07, T1-POL-13, C-02.)*

**SF-8 · Greedy in keep order is exact only for downward-closed feasibility.** Adding groups one by one in π order and keeping each that still fits yields the lexicographic optimum exactly when the feasible family of trained sets is downward closed (removing a group never breaks another). Here it is not: (a) hip + push / knee + pull pairing makes a lower group depend on its upper partner; (b) helper credit crosses groups (squats give hips 0.25, rows give rear delts the V18 minimum, presses give triceps); (c) the axial rule and 2-4 per day constrain which days a group can take; (d) a kept group's day assignment changes the minutes left for later groups. An exact lex-max therefore needs search with re-checks, not a single greedy pass; with ≤ 8 groups and 4 states the space is ≤ 65,536 vectors and π-ordered depth-first search with the SF-6 bound prunes most of it. *(Used by: T1-POL-05.)*

**SF-9 · Training frequency is a dosing decision.** Week-1 sets of a group are at least 2 exercises x 2 sets on each day it is trained: Q_{g,1} ≥ 4·|{d: z_{g,d} = 1}|. A group on 3 full-body days starts at 12+ sets - above an L1 start of 10 and 2 sets from the L1 ceiling 14, which leaves almost no stairway (RECHECK 02 "each group can only gain 2 sets in 12 weeks"). Choosing z_{g,d} (how many days a group is trained) must therefore be part of the dosing optimization, not fixed by the template (E-83 does it as a repair). *(Used by: T2-FLR-06, T3-STW-08.)*

**SF-10 · A two-stage split is exact if stage 1 uses the stage-2 minutes formula.** Stage 1 (states, days per group, weekly line totals V^dir_{l,w}) and stage 2 (exercises, per-slot sets, order, supersets) separate cleanly when stage 1 checks time with the closed-form allocation of SF-3 / SF-4 and the per-layout linear minutes of SF-5: every stage-1 solution then has a stage-2 realization with the same minutes. Without that link (today: volume targets first, time cuts after) the stages fight - the patch-on-patch failures of the review log. *(Used by: all.)*

## 9. Review failure modes → the rules they break

| Id | Failure | Evidence | Rules / facts | Root cause (architecture) |
|---|---|---|---|---|
| FM-01 | Stairways flat on the main days | RECHECK 01 / 03 / 07 / 08; REVIEW_LOG F1 R01-flat, R03-flat (back 10/10/10/11/11/11), R07-flat (hips 15.75 for 9 weeks, calves 7 for 11), R08 "climbs every week" while flat; E-135 (the climb sat on the optional day) | T3-STW-01, T3-STW-02, T3-STW-03, T3-STW-07, T7-PLC-04, T1-POL-12 | targets climbed on paper but the per-week placement ran out of room on the main days; bank / smoothing heuristics instead of SF-1; climb parked on optional-day slots |
| FM-02 | Trained groups below the 10-set floor | v1.2 review (all 8 samples D); RECHECK 04 / 05; V22 sweep failures; E-11 / E-93 below-floor states | T2-FLR-01, T2-FLR-02, T1-POL-01, T1-POL-08 | the floor checked after the time cuts; below-floor groups kept instead of being moved to NONE / PATTERN by the policy |
| FM-03 | Days over the chosen minutes | sweep: 515-516 non-test days > 125 % in 62-64 plans; sample 08 main days 44-49 min and the optional day 48 min for 45 (fix-round-2 regeneration); 01 / 02 / 03 / 04 / 06 / 08 "supersets keep you inside 60 min" above 61-82 min days (E-111) | T1-POL-02, T4-TIME-01, T1-POL-11 | minutes estimated after dosing; fixed blocks (athletic, power, joint care, skill, aerobic add-on) not in the same budget as the sets |
| FM-04 | Too many exercises per day | coach-eye reviews (full-body days 7-10 resistance exercises + core + calves + joint care + athletic); 12 + 2 cap trims (E-19) | T6-CNT-01, T6-CNT-03, T0-SES-13, SF-9 | every template group trained on every full-body day at 2 exercises; frequency not optimized; bonus exercises added instead of sets on existing ones |
| FM-05 | The time check over-cuts (a pickleball client left with only hinges) | sample 08 at fix round 1 (REVIEW_LOG F1 table): hips only, quads / back / chest / shoulders / calves "time", main sets 10 → 13; regenerated in fix round 2 (2026-10-10): quads 4 → 6 and hips 4.5 → 5.75 below the floor, back one pattern station, chest 0; RECHECK 08 blocker "no row or press at all"; 01 swimmer lost quads (R01-quads); 04 class kept accessories, lost squat / deadlift (R04-class-groups) | T1-POL-05, T1-POL-06, T1-POL-07, T1-POL-13, SF-7, SF-8 | greedy keep order under a non-downward-closed feasibility; fixed non-resistance blocks protected ahead of big movers; no pattern-coverage constraint |
| FM-06 | Athletic work not matching its budget or not climbing | REVIEW_LOG F2: R01 jumps inverted (ballistic 14-16 of 37-46), R02 sprint 120-240 m vs 300-400, R03 85 % plyometric vs 45-60 %, R08 athletic flat; sweep V27 share / drop findings; 03 jumps 24 → 32 of 120 → 160 | T3-ATH-01, T3-ATH-02, T5-ATH-01, T5-ATH-02, T0-ATH-02 | athletic doses sized from template slots, then reconciled to targets in separate passes; stations not budgeted with the resistance minutes |
| FM-07 | Week 1 at or above the ceiling | RECHECK 02 major: quads 18 = level cap in week 1, back 16 > 13 (E-83) | T2-FLR-06, T3-STW-08, T5-CAP-02, SF-9 | structure (2 exercises x 2 sets x days) fixed before targets |
| FM-08 | Stairway sets going to isolations and calves while the work lifts stay flat | RECHECK 02 / 07 (E-87) | T7-PLC-01 | placement by bank size instead of the VOL-07 staircase (SF-3) |
| FM-09 | 1-set bonus exercises and new exercises mid-block | RECHECK 01 W4 / W10, 04, 06 (E-86) | T6-CNT-04, T0-SES-14, T0-SES-15 | overflow handled week by week instead of planned per exercise block |
| FM-10 | Tests on top of the full session | RECHECK 01 / 02 / 03 / 04 / 07 (E-91) | T0-TST-01, T4-TIME-01 | test minutes and sets not in the dosing model |
| FM-11 | One group dwarfs the others (hips 1.6-1.8x) | RECHECK 03 (E-84) | T8-BAL-04, DER-07 | two lines of one FOCUS group each given a full target |
| FM-12 | Caps passed through helpers and optional days | RECHECK 06: shoulders 30.5 > 30 (E-95); ~100 sweep plans over the per-line cap | T5-CAP-01, T5-CAP-03 | caps checked on direct main-day sets only |
| FM-13 | Laterality share 25-40 points off target | REVIEW_LOG F3 R01..R07-v28 (E-127); ~466 sweep plans warn | T8-BAL-01, T8-BAL-02, T7-PLC-05 | share steered by a score after selection, not a constraint of the layout |
| FM-14 | Uneven exposures of one day type | RECHECK 07: Pull 2 lost its pulldowns, rear delts and biceps, 40 of 75 min (E-77) | T7-PLC-02, T7-WEEK-02 | room cuts always from the latest day |
| FM-15 | Patch-on-patch interactions | every fix round lists sweep regressions caused by the round's own changes (B4, F1, F2, F3 "Sweep findings fixed on the way"); volume.mjs runBlock ~2,150 lines | SF-10, T0-SYS-01 | rules enforced by sequential greedy passes, each unaware of the others' constraints; no single objective |

## 10. Conflicts and readings that need a decision

| Id | Conflict | Between | Detail | Options | Current reading | Who decides |
|---|---|---|---|---|---|---|
| C-01 | Step size vs reaching the ceiling | former T3-STW-05/06 rate bounds vs endpoint arrival | Standard rates can finish below the intended endpoint. | Historical alternatives retained in earlier revisions. | **CX-01 resolved policy:** accelerate when needed, including lambda>1; no new numeric maximum; preserve applicable ceilings and joint feasibility | numerical scheduler and proof reconciliation pending, not another open policy vote |
| C-02 | Very short weeks: one group fully vs big movers partly | T1-POL-05 (FULL only counts) vs R3-SES-02 "big movers first; arms, calves and rear delts only from compound credit" | 2 x 45 holds about one group plus pinned calves when athletic, power and joint-care blocks stay (SF-7); without them three groups climb. The coach's words presume presses and rows remain. | (a) FULL-only (12 v1.2) \| (b) PATTERN state for big movers (E-94 / E-145; this file T1-POL-07) \| (c) BELOW_FLOOR big movers once a week \| (d) athletic / power / joint care give way first for stay-active (T1-POL-13) | fix round 2 (in progress) uses all three states: sample 08 now keeps quads and hips BELOW_FLOOR (4-6 sets), back as a PATTERN station, chest none | coach (12 §7 item 5) |
| C-03 | How much longer a day may run | R2-SES-05 "a little longer day" vs UNI-09 / the chosen minutes | fit 1.10 for the minimums (PROPOSED), split days 1.0, error at 1.25 when cuttable, test days exempt with a warning. This file spends the 10 % only on minimums (T4 above T5). | 1.0 \| 1.10 (today) \| 1.15; split-day tolerance 1.0 or 1.10 | 1.10 full-body / 1.0 split | coach (12 §7 item 4) |
| C-04 | Calves: floor 10 vs one exercise x 3 per leg day | R2-VOL-06 floor 10 vs R3-SES-01 one calf exercise x 3 sets per leg day | With 2 leg days one exercise holds at most 8 (4 + 4); the engine floor is max(3n, min(10, 4n − 1)) = 7; 10 needs the optional-day Calves slot. | leg-day floor (7) \| 10 via the optional day \| 10 via a 4th set + optional slot | DER-04 formula + optional slot below 4 leg days (E-139) | coach (12 §7 item 13) |
| C-05 | Field athletes: credit-only vs the floor | UNI-02 (field athletes do not need to get bigger) vs R2-VOL-06 floor 10 | Chest, back, shoulders, glutes floored at 10 (raises 7.5 / 6 to 10); arms credit-only. | as today \| arms floored too \| chest / back below the floor in-season only | D-03 revised | coach (12 §7 item 10) |
| C-06 | Split-day exercise cap vs 2-4 per group | VOL-08 5 / 7 / 9 by minutes vs R2-SES-05 2-4 per group | The 2-4 rule wins (D-54); the cap is soft (T6). | - | 2-4 wins | settled (engine) |
| C-07 | 12 + 2 cap vs athletic tracks vs 2-4 per group | R2-SES-04 cap vs R3-SES-01 split vs athletic budget (D-73) | The day's athletic stations shrink to the R3-SES-01 split first, then whole non-work groups leave; COD / sprint budgets can then sit under target (told). | - | E-19 | settled (approved split) |
| C-08 | Optional-day climb | ORD-10 "ideally separate days, so they don't get in the way" vs R3-VOL-03 bonus exercise on the optional day | Small-muscle bonus sets on the optional day are approved; a big line's stairway sitting only on the optional day reads as flat on the main days (FM-01). | Focus lines only (E-135) \| any line with a 2-set Focus slot | Focus lines only | proposed |
| C-09 | Weekly-rise limits on small plans | former UNI-05 rate rule vs endpoint arrival | One set on a 9-set total is 11%; the old one-set exception was proposed. | Historical one-set exception is not the only permitted acceleration after CX-01. | **CX-01/02:** accelerate when needed; occasional same-set weeks may progress reps/load | integer/rate reporting procedure pending; no new rate maximum approved |
| C-10 | Week-1 structure vs start and ceiling | R2-SES-05 2 exercises per trained day vs R3-VOL-04 room to climb | SF-9: frequency fixes week 1; E-83 trains a group on fewer days to start lower. | optimize z_{g,d} (this file) \| template frequency + repair | repair (E-83) | design |
| C-11 | Removing an exercise in the editor | 12 §3.10.2 (sets move to the group's other exercises) vs 13 / spec (sets not moved) | BRAIN §0.3 cross-file decision: not moved; the person's choice wins; a note when a group drops to 1 exercise. | - | not moved | master |
| C-12 | Pain lines | 12 §3.6 cap = start + 1 vs D-11 no step in weeks 2-3, then ≤ 3 % | Both are gentle climbs; neither is the coach's number. | start + 1 \| freeze 2 weeks then ≤ 3 % | engine D-11 parameters in rules.volume.pain | proposed |
| C-13 | Stale older-adult step cap | R3-VOL-04 (retired the 60+ 3 % cap) vs rules.population.older.step_cap / volume.older.step_cap = 0.03 | stairway.limits.older_cap_retired = true; the 0.03 values remain in the model and must not be read. | delete the keys | retired flag | cleanup |
| C-14 | Stage weeks vs exercise blocks | R2-ATH-03 week table (1-3 / 4-7 / 8-12) vs PER-02 exercises fixed in a 4-week block (1-4 / 5-8 / 9-12) | Stages snapped to exercise blocks (E-26) move each boundary by one week. | snap (today) \| 3 / 4 / 5-week exercise blocks to match the stage table | snap | proposed |
| C-15 | Ceilings scaled with goal modifiers | R2-VOL-06 caps 14 / 22 / 25 vs D-02 scaled caps keep growth room | A stay-active L2 big line (factor 0.8) starts 12 with a ceiling of 18 = max(round(22 x 0.8), 12 + round(7 x 0.8)) instead of 22. | scale (today) \| unscaled level caps | D-02 | proposed |
| C-16 | Tier order: time fit above ceiling height | the coach's stated order (time fit > caps) vs R2-SES-05 "a little longer day" | This file reads the order as: the 10 % band is used for the minimums only; reaching higher ceilings never lengthens a day past the chosen minutes. A coach who prefers the opposite swaps T4 and T5-CAP-04. | T4 > T5 (this file) \| T5-CAP-04 > T4 | this file: T4 > T5; the engine today places stairway sets up to 1.10 x the minutes (D-47) | coach |
| C-17 | Fixed non-resistance blocks vs trained groups in short sessions | R3-ATH-02 (racket 50+ calf / Achilles and rotator-cuff work), R2-ATH-04 / ATH-10 (Olympic for everyone in athletic training), ATH-11 (core first) vs R3-SES-02 (big movers first; the person can switch off athletic / core blocks) | SF-7: about 16 min of a 45-min day go to throw + Olympic + joint care. Which of these is kept ahead of a big mover decides the plan. | competitive: tracks protected; stay-active: athletic room first (T1-POL-13) \| always protect the approved sport defaults | T1-POL-13 (proposed) | coach |

## 11. What a coach can change

The generator spec has four layers (`generator_spec_v1.json > coach_rule_hooks`): **locked** (not editable), **blaze defaults** (every rule table value - editable by a coach rule pack: "this is all customizable", R2-VOL-06), **the coach's own rule pack**, and **client preferences** (inside the layers above). Precedence: locked > coach rule pack > blaze defaults > client preferences.

### 11.1 Tunable parameters (layer 2, by a coach rule pack)

| Id | Parameter | Model path | Current value | Range / note | Coach source | Rules it moves |
|---|---|---|---|---|---|---|
| P-01 | Starting weekly sets per line and level | `rules.volume.start` | `{"quads":{"L1":10,"L2":15,"L3":20},"hamstrings":{"L1":10,"L2":15,"L3":20},"glutes":{"L1":10,"L2":15,"L3":20},"chest":{"… (full value in the JSON)` | per line L1 / L2 / L3 | R2-VOL-04, VOL-01 | DER-01, T2-FLR-01 |
| P-02 | Level ceilings per line | `rules.volume.cap` | `{"quads":{"L1":14,"L2":22,"L3":25},"hamstrings":{"L1":14,"L2":22,"L3":25},"glutes":{"L1":14,"L2":22,"L3":25},"chest":{"… (full value in the JSON)` | "all customizable" (≤ 30) | R2-VOL-06 | T5-CAP-01, T5-CAP-02 |
| P-03 | Floor per trained group | `rules.volume.floor.value` | `10` | 8-12 (coach: 10) | R2-VOL-06 | T2-FLR-01, T1-POL-01 |
| P-04 | Focus add (default) and range | `rules.volume.focus.add_default` | `2` | 1-3 | R3-SES-01 | DER-05, T5-CAP-06 |
| P-05 | Focus / priority caps | `rules.volume.priority.cap` | `{"default":{"L1":18,"L2":26,"L3":30},"chest":{"L1":18,"L2":28,"L3":30}}` | ≤ 30 | R2-VOL-06 | DER-05 |
| P-06 | Absolute ceiling | `rules.volume.priority.absolute_cap` | `30` | 30 (Pro up to 35) | R2-VOL-06 | T5-CAP-03 |
| P-07 | Pro setting | `rules.levels.pro_setting` | `{"enabled_by_default":false,"min_level":"L3","muscles_max":1,"cap_max":35,"requires":"coach_rule_pack (Phase 1)"}` | off / L3 one muscle ≤ 35 | R2-VOL-06 | T5-CAP-03 |
| P-08 | Stairway steps (early / late) | `rules.stairway.standard_steps` | `{"early":0.03,"late":0.05}` | 0-7 % each, early ≤ late | R3-VOL-04, R2-PER-03 | DEF-10, T3-STW-05 |
| P-09 | λ upper bound | `rules.stairway.lambda.hi` | `1` | 1.0-1.4 | 12 §7 item 16 | T3-STW-06, C-01 |
| P-10 | Minimum climb | `rules.stairway.min_climb` | `{"group":2,"calves":1,"line":1,"short_block":{"max_N":7,"group":1}}` | group 1-3, calves 1 | R3-SES-02 | T1-POL-01, T3-STW-02 |
| P-11 | Hold rules | `rules.stairway.hold_rules` | `{"min_N":8,"min_climb":3,"hold_extra_weeks":1,"main_days":true,"total_hold_max_frac":0.5}` | - | R3-VOL-04 | T3-STW-03 |
| P-12 | Placed weekly limits | `rules.stairway.limits.placed` | `{"per_muscle_whole_sets":1,"per_muscle_pct":0.07,"ceiling_pct":0.1,"helper_slack":0.5,"total_pct":0.07,"note":"a muscle… (full value in the JSON)` | per line ≤ max(1, 7 %); total ≤ 7 % | R2-VOL-01, UNI-05 | T0-STW-03 |
| P-13 | Day fit factor | `rules.session.time_fit.fit_factor` | `1.1` | 1.0-1.15 | R2-SES-05 | T1-POL-02, C-03 |
| P-14 | Long-day warning / error factors | `rules.session.long_day` | `{"warn_above_factor":1.1,"note":"full-body days may run a little longer (warning, not an error)","split_day_factor":1,"… (full value in the JSON)` | warn 1.1, error 1.25 | R2-SES-05 | T4-TIME-01 |
| P-15 | Keep order (who is trained first when time is short) | `rules.session.time_fit.keep_order` | `["hips","quads","back","chest","shoulders","calves","triceps","biceps"]` | any order of the 8 groups | R3-SES-02 | T1-POL-05 |
| P-16 | Athletic keep order and sport pins | `rules.session.time_fit.keep_order_r2` | `{"pin_first_50_racket":{"groups":["calves"],"age_gte":50},"athletic":["hips","quads","back","chest","calves","shoulders… (full value in the JSON)` | - | R3-SES-02, R3-ATH-02 | T1-POL-05 |
| P-17 | Time model: work minutes per set | `rules.time_model.work_minutes` | `{"compound_bilateral":0.75,"compound_unilateral":1.5,"isolation":0.6,"isolation_unilateral":1.2,"core_set":0.75,"plyo_o… (full value in the JSON)` | - | UNI-09 | DEF-09 |
| P-18 | Time model: rest minutes per class | `rules.time_model.rest_class_minutes` | `{"strength":4.5,"olympic":2.5,"hypertrophy":1.5,"isolation":1.25,"core":0.75,"plyo":1.25,"throw":1.1,"cod":1.25,"sprint… (full value in the JSON)` | inside VOL-14 ranges | VOL-14 | DEF-09 |
| P-19 | Changeovers and warm-up minutes | `rules.time_model.changeover_min_per_exercise` | `1` | 0.5-2 | ORD-08 | DEF-09 |
| P-20 | Exercise cap by session length (split days) | `rules.session.exercise_cap_by_minutes` | `{"30":4,"45":5,"60":7,"75":9,"90":9,"105":9,"120":9}` | - | VOL-08 | T6-CNT-01 |
| P-21 | Field-athlete cap | `rules.session.athlete_cap` | `12` | 10-12 (+ 2 core) | R2-SES-04 | T0-SES-13 |
| P-22 | Exercises per group per day | `rules.session.exercises_per_group.full_body_day` | `[2,4]` | [2, 4] | R2-SES-05 | T0-SES-10 |
| P-23 | Calves rules | `rules.volume.calves` | `{"per_leg_day":{"L1":3,"L2":3,"L3":3},"per_leg_day_max_L3":4,"weekly_floor":10,"second_station_sets":1,"second_station"… (full value in the JSON)` | per leg day 3 (L3 3-4); weekly floor; athlete climb | VOL-17, R3-SES-01 | DER-04, T2-FLR-02 |
| P-24 | Sets per exercise (min / max) | `rules.placement.max_sets_per_exercise` | `{"L1":4,"L2":5,"L3":5}` | min 2; max 4 / 5; isolation 4 | VOL-16 | T0-SES-15 |
| P-25 | Per-session sets per line | `rules.volume.per_session` | `{"soft":11,"priority":14}` | 11 / 14 | SCIENCE | T5-CAP-05 |
| P-26 | Goal / phase modifiers | `rules.volume.modifiers` | `{"aesthetics":{"lower":1,"upper":1,"small":1},"strength":{"lower":1,"upper":1,"small":0.75},"general":{"lower":0.8,"upp… (full value in the JSON)` | 0.3-1.0 by region | 12 §3.4 | DER-02 |
| P-27 | Pain start factor and share shift | `rules.volume.pain.start_factor` | `0.6` | 0.5-0.7 | VOL-03 | DER-06 |
| P-28 | Next-block multipliers | `rules.cycles` | `{"start_multiplier":1.05,"rounding":"half_up","cap_add":1,"cap_max_nonpriority":25,"cap_max_priority":30,"same_start_if… (full value in the JSON)` | start x 1.05, cap + 1 | R2-VOL-06 | DER-09 |
| P-29 | Maintenance factors | `rules.plan_types.maintenance_4_6.factor` | `{"vacation_limited_kit":0.5,"travel_moving_season_change":0.6,"planned_maintenance":0.7}` | 0.5-0.7 (older ≥ 0.7) | PER-01, R2-PER-06 | DER-10 |
| P-30 | Pre-season / taper factors | `rules.volume.phase_factors` | `{"pre_season":{"of":"last_offseason_week_sets","factor":0.6,"floor":false,"step":0},"in_season":{"modifier":"athlete_in… (full value in the JSON)` | pre 0.6, taper 0.5 | R2-PER-06 | DER-10 |
| P-31 | Recovery (easy) week | `rules.recovery` | `{"sets_factor":0.5,"of":"hardest_week","round":"up","min_sets_per_exercise":1,"rir_min":3,"remove":["buyout","finisher"… (full value in the JSON)` | ½ of the hardest week, RIR ≥ 3 | R2-VOL-07, R3-PER-01 | T0-STW-01 |
| P-32 | Bilateral share targets | `rules.bilateral_share.profiles` | `{"bb_pl":{"lower":{"by_exercise_block":[0.5,0.8,0.9]},"upper":{"by_exercise_block":[0.5,0.8,0.9]}},"beginner_general":{… (full value in the JSON)` | 0.1-0.9 | UNI-02, UNI-03 | T8-BAL-01 |
| P-33 | Bilateral share tolerances | `rules.bilateral_share.tolerance` | `0.03` | place 0.03 / check 0.12 | 12 §3.9 | T8-BAL-01, T7-PLC-05 |
| P-34 | Plyo share by contact class / block start offset | `rules.athletic.ground_contact_classes` | `{"1":{"end":0.75},"2":{"end":0.6},"3":{"end":0.5},"4":{"end":0.4},"5":{"end":0.25}}` | approved shares | R2-ATH-01, R3-ATH-04 | DER-11, T3-ATH-02 |
| P-35 | Plyo share tolerance | `rules.athletic.f2.share.tolerance` | `0.05` | 0.03-0.10 | E-97 | T3-ATH-02 |
| P-36 | Contacts per session | `rules.athletic.contacts_per_session_max` | `{"L1":80,"L2":100,"L3":120}` | NSCA bands | SCIENCE | T0-ATH-03 |
| P-37 | Athletic budget tolerances and per-set doses | `rules.athletic.reconcile` | `{"enabled":true,"tolerance":0.25,"olympic_max_factor":1.5,"contact_rise_max":0.2,"per_set_max":{"plyo_contacts":10,"jum… (full value in the JSON)` | - | D-73 | T5-ATH-01 |
| P-38 | Athletic station sizes | `rules.athletic.f2.tracks` | `{"from_budget":true,"per_station":{"jumps":16,"throws":20,"low_contacts":40,"cod_cuts":24},"max_stations":{"jumps":3,"t… (full value in the JSON)` | - | E-98 | T5-ATH-02 |
| P-39 | Olympic exposures and sets | `rules.olympic.sets` | `{"from_budget":true,"min_per_exposure":2,"max_per_exposure":4,"stay_active":{"sets":2,"reps":[3,6],"heavy_play":{"sets"… (full value in the JSON)` | 2-4 per exposure; ≤ 4 exposures | R2-ATH-04 | T0-ATH-01, T3-ATH-01 |
| P-40 | Receive-Create stage weeks | `rules.athletic.stages.weeks_by_N` | `{"2":{"RC1":[1,1],"RC2":[2,2],"RC3":null},"3":{"RC1":[1,1],"RC2":[2,2],"RC3":[3,3]},"4":{"RC1":[1,1],"RC2":[2,2],"RC3":… (full value in the JSON)` | approved tables | R2-ATH-03 | T0-ATH-02 |
| P-41 | Aerobic sessions by goal / sport | `rules.conditioning.sessions` | `{"fat_loss":3,"general":3,"active":3,"aesthetics":4,"athlete_in":2,"athlete_pre":2,"powerlifter":2,"hybrid":2,"sport_is… (full value in the JSON)` | user ± 3 | ATH-07, R2-SES-06 | DER-12 |
| P-42 | Cut orders (what leaves a day first) | `rules.cut_order` | `{"aesthetics":[{"id":"focus","match":{"role":["focus"]}},{"id":"second_calf","match":{"second_calf":true}},{"id":"secon… (full value in the JSON)` | - | R3-SES-02 | T1-POL-06 |
| P-43 | Pattern keep | `rules.volume.pattern_keep` | `{"buckets":{"back":"RP_HPULL","chest":"RP_HPUSH","quads":"RP_UKD","hips":"RP_UHD"},"order":["back","chest","quads","hip… (full value in the JSON)` | sets 2, ≤ 3 a week | BRAIN §10.7 | T1-POL-07 |
| P-44 | Superset pairs and triggers | `rules.supersets.recommend` | `{"pairs":[["knee","pull"],["hip","push"],["ISO_BICEP","rear"],["ISO_TRICEP","side"],["ISO_CALF","delts"],["core","core"… (full value in the JSON)` | - | ORD-05 | T7-PAIR-02, T7-PAIR-03 |
| P-45 | Planned effort drift | `rules.effort.planned_map` | `{"2":{"min":2,"max":2},"3":{"min":3,"max":3},"1-2":{"min":1,"max":2},"1+":{"min":1,"max":1,"intensifiers":true}}` | inside 1-3 RIR | R3-VOL-04 | DER-13, T0-EFF-01 |
| P-46 | Rest ranges | `rules.rest` | `{"hypertrophy_s":[60,120],"hypertrophy_max_s":180,"isolation_s":[60,90],"strength_s":[180,360],"core_s":[30,60],"olympi… (full value in the JSON)` | VOL-14 | VOL-14 | T0-EFF-03 |
| P-47 | Contra / ipsi and frontal / transverse shares | `rules.contra_ipsi` | `{"cod_contralateral_share":0.7,"sprinter_ipsilateral_share":0.6,"split_stance":"contralateral","bb_pl_health_accessory_… (full value in the JSON)` | - | CAT-13, UNI-12 | T8-BAL-05 |
| P-48 | Selection weights | `rules.selection.weights` | `{"default_in_slot":3,"preference_match":1.5,"constraint_in_band":2,"constraint_distance":-1,"over_ladder_step":-1.5,"pa… (full value in the JSON)` | - | INFERRED | T8-VAR-04 |
| P-49 | Rear-delt minimum from rows | `rules.volume.rear_from_rows_min` | `1.5` | 1-3 | R3-VOL-01 | T0-SES-12 |
| P-50 | Client level thresholds | `rules.levels.client` | `{"L1_below_years":1,"L3_min_years":3,"L3_min_days":4,"L3_competitive_physique_strength":true,"layoff_months_body_L1":6,… (full value in the JSON)` | - | PRG-05 | DEF-12 |
| P-51 | Session lengths offered / defaults | `rules.session.minutes_default` | `{"athletes_bodybuilders_powerlifters":90,"general_fat_loss":60,"bootcamp":45,"non_competitive_athletic":60,"older_injur… (full value in the JSON)` | - | UNI-09 | T4-TIME-02 |
| P-52 | One-target groups | `rules.volume.one_target_groups` | `{"groups":["hips"],"modifiers":["field_off","strength_athlete_off","stay_active","general","fat_loss","athlete_in"],"un… (full value in the JSON)` | - | R3-SES-01 | DER-07 |
| P-53 | Bootcamp circuit stairway | `rules.supersets.bootcamp.stairway` | `{"work_s_start":35,"work_s_max":50,"work_s_step":5,"rounds_start":3,"rounds_max_by_minutes":{"30":3,"45":3,"60":4,"75":… (full value in the JSON)` | 30-50 s, 3-5 rounds | PRG-03 | T3-STW-10 |
| P-54 | Test catalogue / from-zero rules | `rules.tests.from_zero_if` | `["level_L1","layoff","years_consistent_lt_1","youth"]` | - | R2-PER-07 | T0-SAFE-13 |
| P-55 | Core block | `rules.core_block` | `{"position_default":"start","positions":["start","after_plyos","after_strength","end"],"exercises":2,"sets_when_first":… (full value in the JSON)` | 2 x 2, first | R2-SES-03 | T0-SES-02 |

### 11.2 Client preferences (layer 4)

| Choice | Range | Feeds |
|---|---|---|
| days per week (F22) and weekdays (F23) | 2-6 | the main driver of capacity (T1) |
| session minutes (F24) | 30-120 | μ_d (T1-POL-02, T4) |
| Focus muscle 1 / 2 (F09) | 0-2 of the 9 lines, v_taper | DER-05, T5-CAP-06 |
| optional days | add-on or separate | T6-CNT-05, T7-PLC-03 |
| core position | start / after plyos / after strength / end | T0-SES-02 |
| block toggles per day (core, athletic, power, skill, accessories, joint care, cardio, cool-down) | on / off | T1-POL-14 (never changes muscle sets) |
| add / remove exercises or blocks; "add rear delts" | - | T1-POL-14 |
| superset suggestions shown / hidden | - | T1-POL-11 |
| cardio less / as planned / more | ± 3 | DER-12 |
| lift style (F10) | lighter / balanced / heavy | T0-EFF-04 |
| variety A/B weeks | - | T8-VAR-05 |
| 60+ power-work opt-in; racket 50+ impact opt-in (with the warning) | - | T0-SAFE-05, T0-SAFE-06 |
| play days, play length, event / meet dates, season start | - | T0-SES-17, T0-STW-05 |
| blocks completed in a row (rebuild) | 0+ | DER-09 |
| maintenance length / reason | 1-8 weeks | DER-10 |
| equipment and machines (F27-F29), preference machines / free weights (F29b) | - | T0-SAFE-10, T8-VAR-04 |
| pain areas and what makes them worse (F35-F38) | - | T0-SAFE-08, DER-06 |

### 11.3 Locked (layer 1: never tunable)

| Id | Rule key | Coach sources |
|---|---|---|
| LK01 | `locked.no_failure_heavy_compounds` | GEN-08, VOL-13 |
| LK02 | `locked.no_v_squat` | GEN-08 |
| LK03 | `locked.power_before_strength` | GEN-08, ORD-03 |
| LK04 | `locked.horizontal_before_vertical` | GEN-08, ORD-01 |
| LK05 | `locked.core_never_skipped` | GEN-08, ATH-11 |
| LK06 | `locked.no_variable_resistance` | EQ-01, EQ-12 |
| LK07 | `locked.athletic_never_counts` | VOL-10, R2-VOL-05 |
| LK08 | `locked.weekly_rise_below_10pct` | UNI-05, R2-VOL-01 |
| LK09 | `locked.older_injured_never_list` | EQ-03, R2-ATH-08 |
| LK10 | `locked.no_sex_rules` | ATH-09, GEN-02 |
| LK11 | `locked.two_spine_days` | PER-04, EQ-11, R2-SES-01, R2-SES-02 |
| LK12 | `locked.medball_max_20lb` | EQ-06 |
| LK13 | `locked.no_deload_inside_block` | R2-VOL-07 |
| LK14 | `locked.no_max_test_from_zero` | R2-PER-07 |
| LK15 | `locked.older_power_opt_in` | R2-ATH-08 |
| LK16 | `locked.no_lifestyle_inputs` | R2-GEN-04 |
| LK17 | `locked.release_every_build` | R2-GEN-03 |
| LK18 | `locked.no_checkin_no_change` | R2-VOL-03, R3-VOL-02, R3-VOL-04 |

Also fixed in the generator (spec layer 1): planned step ≤ 7 %, no data kept, the own-risk + terms + release tick every build, no check-ins after the build.

## 12. Open items for the coach (the ones that move dosing)

| Id | Question | Where |
|---|---|---|
| O-01 | Policy resolved by CX-01; implement and verify endpoint-prioritized acceleration, including lambda>1 (C-01) | coach_answers_codex_2026-10-10.md CX-01; PLANNER_SPEC current amendment |
| O-02 | Very short weeks: FULL-only vs PATTERN / BELOW_FLOOR big movers (C-02, T1-POL-07 / 08) | 12 §7 item 5, E-94 / E-145, E-11 |
| O-03 | Which fixed blocks stay ahead of big movers in short sessions (C-17, T1-POL-13) | R3-SES-02 vs R3-ATH-02 / R2-ATH-04 |
| O-04 | Fit factor 1.10 and the split-day tolerance (C-03) | 12 §7 item 4 |
| O-05 | Group credit (a set counts at most 1.0 to a group) and the shoulders start with group credit | 12 §7 items 1-2 |
| O-06 | Focus default +2 and the cap bound | 12 §7 item 3 |
| O-07 | Calves 10 a week with fewer than 4 leg days (C-04) | 12 §7 item 13 |
| O-08 | Field athletes' floor on chest / back / shoulders; small lines on the big-line ceilings (C-05) | 12 §7 item 10 |
| O-09 | Reconcile discrete scheduling and rate reporting under CX-01/02; do not retain the old weekly bound as an endpoint veto (C-09) | coach_answers_codex_2026-10-10.md CX-01/02 |
| O-10 | Time model numbers (work + rest, changeovers); 1-minute changeover | 12 §7 item 12, E-09 |
| O-11 | Per-session line caps 11 / 14, max sets per exercise 4 / 5 | 12 §7 item 15 |
| O-12 | Laterality share numbers he did not give; the upper-body dial | 12 §7 item 15, E-127 |
| O-13 | Athletic: 5-point share tolerance, station sizes, the 04 weekly targets as doses the plan must land on | E-97, E-98, D-73 |
| O-14 | Tier order T4 (time) above T5 (ceiling height) (C-16) | this inventory |
| O-15 | Stage weeks snapped to exercise blocks (C-14) | E-26 |
| O-16 | Scaled ceilings for goal modifiers (C-15) | D-02 |
| O-17 | Late off-season VOL3 step (strength rest costs groups at 3 x 75) | E-125 |
