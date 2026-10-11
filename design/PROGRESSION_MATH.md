# Progression Math: CX-01..04

**Authority:** [COACH-CX CX-01..04](../coach_answers_codex_2026-10-10.md), above earlier coach answers only on the subjects it answers. **Engineering status:** this is the mathematical contract for the isolated progression prototype, not a new set of coach rules or a certificate for the rebuilt planner. The prototype lives under `design/progression/`; the existing default engine is unchanged.

The completed mathematical scope is endpoint construction, monotone integer interpolation, conditional preservation of certified dose/time constraints, zero-headroom handling, and the boundary for rechecking edits. The isolated references passed the independent focused suites; commands, results, and limitations are recorded in [PROGRESSION_VERIFICATION.md](PROGRESSION_VERIFICATION.md). Full planner readiness additionally requires integration, a certified instance/cost builder, correct endpoint selection, and the independent gates in the implementation plan.

## 1. What Changes, and What Does Not

| Question | Controlling requirement |
|---|---|
| Must an otherwise feasible target be lowered to obey the former 7%, below-10%, or one-set-per-group weekly limits? | No. CX-01 permits faster increases when needed to reach the target. The scheduler reports increases; it does not invent another percentage ceiling. |
| Must sets increase every week? | No. CX-02 permits flat-set weeks with an actual rep/load progression prescription. A label alone is not progress. |
| Must a group with no volume headroom add more sets? | No. CX-03 permits holding sets at the ceiling while progressing reps/load. |
| Does an edit keep the old certificate? | No. CX-04 allows editing; mathematical guarantees must be rechecked against the edited prescription. |
| Do these answers waive time, exercise bounds, effort, equipment, population, or final ceiling rules? | No. |
| Do these answers approve a new peak-fairness objective or next-block rounding rule? | No. These remain explicit engineering policies, with their evidence/status retained. |

Acceleration is a permitted means of reaching a feasible target, not a claim that faster progression is universally preferable or physiologically safe. This document does not choose new training ceilings, effort limits, intake fields, or application behavior.

## 2. Units and Fixed Instance

Use integer physical sets for allocation. Use integer quarter sets for credited volume: a physical set can contribute a nonnegative integer number of quarter sets to each group. The normalized prescription prototype receives already-resolved group credits, bounded at four quarter sets per group per physical set under the existing group aggregation convention in PLANNER_SPEC section 7.1: `min(4, sum(memberCredits * 4))`. It does not accept a raw muscle map and silently sum it without that convention. This is an existing planner counting contract, not a new CX rule. Never compare a physical-set total to a credited-set target without an explicit conversion and the actual exercise credits.

For a block of `N >= 2` weeks, let:

- `g` identify a focus group; `d` identify a day; `gamma = (g,d)` identify a group-day.
- `n_gamma(w)` be the integer physical sets assigned to that group-day in week `w`.
- `x_c(w)` be the sets of candidate exercise slot `c`, obtained from the fixed staircase placement `St` in PLANNER_SPEC section 5.2(a).
- `1 = w_0 < ... < w_m = N` be certified epochs, with endpoint vectors `A^j = n(w_j)`.
- `A^0 <= ... <= A^m` mean componentwise nesting, not merely increasing weekly totals.
- `a_h(c) >= 0` be the unchanged quarter-set credit to group `h` for each set in slot `c`.
- `b_h` be any fixed credited contribution from stations/class work outside the variable staircase.
- `B_d` be the fixed certified time allowance for day `d`, including any explicitly selected overrun.

The preservation theorem below requires fixed active slots, exercise counts, day assignments, stations, room items, pair selection, and slot credit vectors throughout the block. An exercise identity may change at an exercise-block boundary only if the required structural properties and credit vector stay the same; its different time cost must be covered. Fixed credited contributions `b_h` must also remain unchanged. Otherwise the theorem does not apply as stated: evaluate the changed weeks directly or supply an explicitly stronger certificate.

The scheduler does not establish that this fixed structure is appropriate, that selected ceilings are approved, or that a particular endpoint is jointly feasible. It accepts a candidate endpoint construction; the full certifier must establish those facts.

## 3. Executable Kernel Contract

`design/progression/stairway.mjs` is an isolated, pure prototype. The input/output contract deliberately distinguishes a failed construction from global infeasibility.

| API | Meaning and boundary |
|---|---|
| `solveEndpointCurve({start, peak, rates, numerics})` | Construct a multiplicative endpoint shape with nonnegative `lambda`, including `lambda > 1`. `rates` has one weight per transition. Explicit numerical budgets bound execution. It is not a time/credit feasibility solver. |
| `scheduleNestedSets({startSets, peakSets, progress, rounding})` | Quantize each component of a nested integer interval along a nondecreasing progress vector. Useful as a small general construction; it does not by itself implement the coach's alternating group-day placement. |
| `scheduleGroupPrefixes({groups, rounding, maxAdditions})` | Preferred group allocation construction: quantize the aggregate additions for each group and place the requested prefix of that group's deterministic day-addition sequence. Each group supplies `id`, `startSets`, `peakSets`, `progress`, `optionalDays`, and `nextDayIndex`. |
| `scheduleEpochs({epochs})` | Compose consecutive nested schedules with matching shared endpoints. This utility accepts per-epoch nested-scheduler inputs; the caller must separately validate the covering-cost certificate. |

Numeric controls, the rounding choice, and the addition budget are explicit engineering inputs, not new coach rules. Inputs must be finite and dimensionally consistent; counts and all count arithmetic must remain in the supported integer range. A resource or numerical budget exhaustion means `unresolved`, not "no legal plan exists." Non-nested endpoints mean `unsupported` for the nested construction, not global infeasibility.

Weekly metadata reports the actual integer changes, not the smooth ideal curve. For prior total `t > 0`, relative increase is `(next - t) / t`; for a zero-to-positive transition it is undefined and must be represented explicitly, not as a finite percentage. The plan can report that a former rate threshold was exceeded without using that threshold to truncate the prescribed target.

### 3.1 Endpoint curve

For `S > 0`, `P >= S`, and nonnegative transition weights `r_i`, define:

```text
T(1) = S
T(w) = S * product(i = 1..w-1, 1 + lambda * r_i)
T(N) = P
```

If `P = S`, choose `lambda = 0` and hold the set-volume shape. If `P > S` and at least one weight is positive, define:

```text
f(lambda) = sum_i log(1 + lambda * r_i) - log(P / S)
```

`f` is continuous and strictly increasing for `lambda >= 0`, starts negative, and tends to infinity. Therefore exactly one nonnegative root exists. Doubling a finite upper bracket until it crosses zero, followed by bisection, finds a bounded numerical approximation. A fixed upper bracket of `1` is not sound: valid endpoints can require a larger multiplier.

Use stable log arithmetic and explicit tolerance/iteration limits. The prototype uses `effectiveLogTolerance = logTolerance * min(1, targetLogGrowth)`: a relative bound for a small positive target log-growth, and an absolute bound when target log-growth is at least one. This avoids treating an arbitrarily small requested growth as converged solely because a fixed absolute tolerance is larger than the whole request. If that bound underflows to zero or the floating search cannot resolve it, return `unresolved`. A converged floating-point answer is an approximation to this real-number equation, not an exact symbolic equality. Integer schedules pin their first and last vectors exactly; do not assert that floating-point multiplication exactly reaches the endpoint.

If all weights are zero and `P > S`, the multiplicative construction cannot reach `P`. Likewise `S = 0 < P` cannot be reached multiplicatively. These are failures of this particular curve, not proof that no additive integer progression exists. `S > P`, negative values, and nonfinite inputs do not describe this nondecreasing endpoint problem.

For `P > S`, a normalized ideal progress shape is `(T(w)-S)/(P-S)`, with endpoints `0` and `1`. For `P = S`, no division by `P-S` is permitted; any explicitly represented nondecreasing shape gives the same constant set vector. The prescription layer must still handle reps/load where required.

Curve values may be expressed in credited sets, but prefix allocation operates in physical work sets. When helper credits couple groups, the realized credited trajectory need not equal every group's independent ideal curve. Exact physical endpoints and containment do not prove equality to an ideal credited trajectory; recompute the actual credits.

### 3.2 Integer interpolation

Given integer component endpoints `A_i <= B_i`, headroom `h_i = B_i-A_i`, and `0 = p_1 <= ... <= p_N = 1`, use either explicitly selected monotone quantizer:

```text
floor:   q(h,p) = floor(h*p)
half_up: q(h,p) = floor(h*p + 1/2)
n_i(w) = A_i + q(h_i,p_w)
```

The implementation must validate the input range and progress order, pin exact endpoint vectors, and check produced integer bounds. Floating-point tolerance is not permission to repair arbitrary invalid input silently.

The prototype quantizes the exact binary fraction represented by each supplied JavaScript progress number using integer arithmetic. It does not first round the floating product `h*p`. This preserves the integer quantizer contract for the represented input; it does not make transcendental curve computations bit-identical across every JavaScript runtime.

**Lemma P1 (nested interpolation).** For either quantizer, `A <= n(w) <= B`, the vector never decreases, and its endpoints equal `A` and `B`.

*Proof.* Multiplication by `h_i >= 0` and either quantizer are nondecreasing. For `p` in `[0,1]`, quantized additions are integers from `0` to `h_i`; at `0` and `1` they equal those endpoints. Apply this independently to every component. No weekly upper bound on additions is required.

This elementary construction is sufficient to establish existence inside a componentwise nested interval. It does not optimize a preferred shape, decide where exercises belong, or guarantee balance ratios.

### 3.3 Aggregate group prefixes

For group `g` in an epoch segment, let its group-day endpoints be `A_g <= B_g` and its total required additions be `H_g = sum_d(B_gd-A_gd)`. Build the deterministic addition sequence described in PLANNER_SPEC section 5.2(c): choose an eligible day with the fewest additions in this segment; resolve ties using main/optional-day priority and the explicit cyclic cursor. The next chosen day must still have room below its endpoint. Preserve the cursor across segments if cross-segment alternation is intended; do not silently reset it.

For week `w`, choose the aggregate prefix length `k_g(w) = q(H_g,p_g(w))`. Reconstruct the group-day vector by taking exactly that prefix. Groups may have different progress shapes, provided each is nondecreasing and endpoint-pinned.

**Lemma P2 (finite prefix).** The sequence has exactly `H_g` steps, reaches `B_g`, and every prefix lies componentwise between `A_g` and `B_g`.

*Proof.* Initially the sum of remaining day capacities is `H_g`. Every step consumes exactly one positive unit of remaining capacity. Therefore a step exists whenever fewer than `H_g` steps have been used. At the end all capacities are zero. A prefix cannot exceed a day capacity or subtract an existing set.

**Lemma P3 (prefix schedule).** A nondecreasing sequence of prefix lengths produces nondecreasing group-day sets and exact aggregate group additions. Multiple additions for a group in one week are allowed.

*Proof.* Each longer prefix contains the earlier prefix plus nonnegative unit additions. Its component sum increases by exactly the difference in prefix lengths. This argument is independent of how many additions occur in any transition.

Do not substitute independent per-day rounding when claiming this alternating placement contract: its sum and tie behavior can differ from aggregate rounding followed by a group prefix.

## 4. Conditional Feasibility Proof

### 4.1 Staircase placement

For fixed active candidates and bounds, `St(n+1)` equals `St(n)` plus one set on one eligible exercise. The earliest-among-least-loaded rule determines which exercise, but the proof needs only this prefix property. Hence nested group-day totals yield nested individual exercise-slot sets, always within the fixed candidate bounds.

This preserves a slot's set count across exercise-block changes. It does not claim that repetitions, kilograms, effort, exercise identity, or physiological stress are numerically nondecreasing merely because slot sets are.

### 4.2 Time monotonicity

With the fixed disjoint pairing structure from PLANNER_SPEC section 5.2(b):

```text
straight(c) = x_c * (work_c + rest_c) + CH
pair(a,b) = straight(a) + straight(b)
            - min(x_a,x_b) * min(rest_a,rest_b)
            - 2 * (CH-CHP)
Sec_d = fixed_d + straight contributions - savings of selected pairs
```

Work/rest/fixed times are nonnegative. Each exercise belongs to at most one selected pair. Pair membership and active-exercise changeovers stay fixed while comparing set/cost vectors.

**Lemma P4 (time monotonicity).** Under those conditions, increasing any set count, work time, rest time, or fixed-time component cannot reduce modeled session time.

*Proof.* Increasing a set count by one adds `work+rest`; its pair saving can increase by at most that exercise's rest, leaving a nonnegative net change. Raising one exercise's rest by `delta` increases its straight contribution by `x*delta`, while the extra saving is at most `min(x,x_mate)*delta <= x*delta`. Work and fixed seconds have nonnegative coefficients. Disjoint pairs prevent counting the same rest saving twice. Summing proves the result.

This lemma does not require the stronger historical H5 about adding/removing room items: here room and active slots are already fixed. It also does not permit removing a needed pair without recosting every affected week.

### 4.3 Covering-cost epochs

For every `w >= 2`, the certificate supplies an epoch index `j = cover(w)` with `w_j >= w`. Its cost envelope `C^j` dominates every fixed, work, and rest time component actually used in week `w`. Certify the endpoint `A^j` using `C^j`, not just the raw costs of calendar week `w_j`.

Check this relation explicitly for every week after building or compressing the epoch list. When merging/dropping epochs, the receiving envelope must include all weeks formerly covered by the dropped epoch. Taking only the dropped epoch's raw cost can lose an earlier expensive week already assigned to it. A componentwise maximum over the complete reassigned coverage set is sufficient.

Week 1 has its own certificate, including its test seconds. The chosen per-day limits `B_d` are the same for the endpoint and the covered weeks; if limits vary by week, the envelope certificate must use a limit no larger than any covered week's allowance, or verify each week separately.

### 4.4 Replacement Link Theorem

**Theorem P5 (accelerated monotone linking).** Suppose:

1. The fixed-instance assumptions in section 2 hold, including nonnegative unchanged credit vectors and fixed credited contributions.
2. Every epoch vector is certified, the epoch vectors are componentwise nested, and each active candidate staircase is defined throughout its endpoint interval.
3. Every intermediate vector is built by P1 or P2/P3, exactly matching both endpoints of its segment.
4. Every week has the covering-cost certificate in section 4.3, with the same fixed disjoint pair structure and applicable day limit.
5. Floor rows are nonnegative credited-volume lower bounds certified at the first endpoint. Ceiling/session rows are nonnegative linear upper bounds certified at the final endpoint. Any fixed-count/structural rows being claimed are certified for the fixed structure in every exercise block.

Then every week has exact prescribed integer totals, nondecreasing exercise-slot sets, valid staircase bounds, the certified floor rows, the certified monotone upper rows, and the modeled day-time limits. Fixed-count/structural rows remain true because the relevant structure is unchanged.

*Proof.* P1 or P3 gives nested group-day sets; staircase monotonicity gives nested exercise-slot sets. A floor `b + sum(a_c*x_c) >= F` with all `a_c >= 0` holds everywhere because `x(w) >= x(1)`. An upper bound of the same nonnegative form holds because `x(w) <= x(N)`. For time, the first certified epoch after `w` is no later than `cover(w)`; hence global nesting gives `x(w) <= x(cover(w))`. By P4 and envelope dominance:

```text
Sec_d(x(w), actualCosts(w))
    <= Sec_d(x(cover(w)), envelopeCosts(cover(w)))
    <= B_d.
```

Endpoints match exactly by construction; concatenating segments preserves nesting because adjacent segments share their endpoint vector. Fixed structural rows are unaffected. No part of this argument assumes at most one set per group per week or a maximum weekly percentage.

**What this theorem does not establish:** feasibility or optimality of the selected endpoint; exercise suitability; bilateral/push-pull ratios; athletic dose/contact bounds; rep/load/RIR progression; test eligibility; equipment availability; injury risk; physiological recovery; legal approval; or all rows of the full planner. Those need their own checks. For example, both `(1,1)` and `(3,3)` have a 1:1 ratio, but the componentwise intermediate vector `(1,3)` does not. A two-sided ratio cannot be inferred from this sandwich proof.

## 5. Historical Proof Reconciliation

This document supersedes the following proof claims only for the amended accelerated progression path. The earlier text remains historical context; it must not be used to restore a superseded rate limit.

| Historical item | Reconciled status |
|---|---|
| L1 staircase | Retained under fixed candidates/bounds; section 4.1. |
| L2 time monotonicity | Retained for a fixed disjoint pair structure and nonnegative costs; P4. Adding/removing structure needs its own check. |
| L3 sandwich | Retained and made conditional on explicit cost coverage, unchanged credit vectors/fixed contributions, constant applicable limits, and genuinely monotone rows; P5. |
| L4 add sequence | Retained; P2/P3 allow an arbitrary number of prefix additions per week. |
| L5 one-set transportation/Gale-Ryser argument | Not needed by the accelerated construction. This document makes no claim about the correctness or generality of its former weekly-rise characterization. |
| L6 greedy rate-cap reachability | Retired as a requirement or fallback for CX progression. Nested endpoints are constructively reachable without its weekly limits. A failed legacy schedule is not global infeasibility. |
| T1 "every row" link theorem | Replaced by the explicitly limited P5. Other rows require independent full-week certification. |
| T3 general greedy peak optimality | Not established by these progression proofs. See section 6. |

Old intermediate-epoch bounds such as `peak - remainingWeeks` or `previous + elapsedWeeks` encode the one-set-per-group limit. They are not valid mandatory bounds after CX-01. The replacement construction requires componentwise endpoint nesting and finite slot capacities, not a rate-derived reachable interval. Chosen middle endpoints still need certification; this document does not optimize them.

Likewise, an `existsSchedule` call based only on the historical rate-capped path must not freeze a peak, lower it, or un-keep a group. A candidate that fails a true time/ceiling/equipment/structure constraint is a different case and follows the existing authorized feasibility policy.

## 6. Zero Headroom and Peak Comparisons

For compatible policy units, classify a start/ceiling pair before computing any relative progress:

```text
S < C: active headroom; score may be (value-S)/(C-S)
S = C: at_cap; no set-growth score (null), keep volume within the ceiling
S > C: conflict; reject or return for explicit resolution
```

Do not treat `0/0` as zero or perfect progress. A saturated group stays in the plan and in its constraints; it is excluded only from an inapplicable set-growth objective. CX-03's rep/load prescription remains separate. A group with a chosen endpoint equal to its start below the ceiling has zero scheduled growth, but is not automatically "at cap."

The historical `a_g*v_g+h_g` score is exact credited volume only if `a_g` and `h_g` are genuinely constant for every candidate being compared. An average credit rate is not an exact representation of a staircase whose added exercises have different credits. Helper contributions can also change when another group's vector changes. Use the actual endpoint credit evaluation when the objective purports to measure actual credited progress.

### 6.1 A finite, testable objective contract

The following is an **INFERRED/PROPOSED mathematical comparison**, not a new coach-approved priority rule or a theorem about the old ladder:

1. Fix the scoring units, baseline, ceiling, active groups, and keep order before comparing candidates. Obtain actual endpoint metrics from each fully evaluated candidate; exclude `S=C` from the growth score.
2. Compute each active group's rational progress score without premature floating rounding. Quarter-set numerators and denominators can be compared by exact cross multiplication within a safe integer representation.
3. Compare the ascending-sorted score vectors lexicographically. This is ordinary leximin: improve the worst score, then the next worst, and so on.
4. Only after those vectors tie, compare the unsorted score vector in the declared keep order. Any remaining tie uses a stable canonical candidate identifier.

Given a finite enumerated set of certified candidates, exhaustive evaluation under this explicit comparator returns its optimum by the definition of a maximum over a finite total order. It does **not** establish that the candidate set contains every feasible full plan. A priority-first tie rule applied during unit-by-unit growth is not automatically the same objective; do not call the two equivalent without proof.

The original increment/freeze ladder may be retained as a transparent heuristic only with `best_found` or equivalent limited status until its full objective/feasible-set assumptions are proved or checked by an exact optimizer. Random tests, including the earlier 431 examples, are evidence about those examples, not a proof of general optimality. Progression reconciliation does not certify the full peak allocator.

## 7. Repeated Blocks and Editable Prescriptions

### 7.1 Exact bounded block transitions

The isolated prescription prototype accepts an explicit caller policy:

```text
advanceBlocks({start, ceiling, absoluteCap, blocks,
               multiplier: {numerator, denominator}, capIncrement})
C_next = min(absoluteCap, C + capIncrement)
S_next = min(C_next, half_up(S * numerator / denominator))
```

Inputs are nonnegative supported integers with `S <= C <= absoluteCap`, positive denominator, numerator at least denominator, and nonnegative cap increment. Rational rounding is exact using integer arithmetic. The multiplier, cap increment, and rounding policy are engineering inputs, not numbers newly authorized by CX-01..04.

**Lemma P6 (bounded iteration).** Every transition preserves `S <= C <= absoluteCap`, and both `S` and `C` are nondecreasing. At `S=C=absoluteCap`, the volume state is a fixed point.

*Proof.* `C_next` lies between `C` and `absoluteCap`. Because `S` is an integer and the multiplier is at least one, half-up rounding of the multiplied start is at least `S`. Both arguments to the minimum defining `S_next` are therefore at least `S`, and that minimum cannot exceed `C_next`. At the absolute cap, both minima return the cap.

This is a boundedness proof, not a promise of strict growth or finite-time arrival at the cap for every input policy. For example, a multiplier of one with no cap increment can remain unchanged below the cap. Fractional rounding can also hold a small start unchanged. Report the actual state instead of inventing progress.

### 7.2 Concrete flat-set progression

`planProgression` distinguishes a changed prescription from a progress label. Where sets hold, it can issue a concrete higher rep target or an explicit conditional next-load-step instruction inside the allowed rep/effort envelope. A load step is ordinal unless the caller actually supplied calibrated load units; it is not a claim that a specific kilogram jump is appropriate or was completed.

If sets hold, reps are already at their permitted upper bound, and no permitted load progression is available, the result is unresolved progression, not a fabricated increase. These are prewritten instructions for an output-only template, not tracking or automatic adaptation. Rep/load changes that affect modeled work/rest time require the same cost-envelope or direct-week checks as any other prescription change.

### 7.3 Edit rechecks

`applySetEdits` discards previous `validation`, `certificate`, `certified`, and `status` metadata at plan/week/day/item levels before rechecking. It does not recursively erase identically named credit-map keys. It retains a requested edit and its conflicts for inspection rather than silently claiming that an incompatible edit is certified.

The isolated `evaluatePrescription` checks its normalized fixed-item input using actual per-item quarter-set credits, explicit time parameters, and disjoint pairs. Its scope includes item set/rep bounds, per-item set decreases/removal by stable day/item identity, the RIR band/nonincrease, main-day-only floors, all-day targets/ceilings, nondecreasing main/all-day credited volume, declared daily group limits (including optional days), and day time. Pair time is summed as nonnegative work/shared-rest/unshared-rest/changeover components to avoid subtraction cancellation. A successful result is `valid_subset` with `certified: false`; a conflict result is not a full-model certificate either.

An arbitrary human edit can break nesting, add/remove exercises, change pair viability, or alter costs. P5 cannot be reused until its assumptions are re-established. Checking nondecreasing credited totals alone is insufficient to prove that no individual exercise loses a set; the prototype also checks stable item identities, but does not implement exercise-block identity mapping for plan/2. Full planner integration must recheck the relevant individual-slot, structure, population, equipment, ordering, effort/intensifier, and athletic rules as well. Editability does not imply silent safety approval or automatic rejection of the user's desired change.

## 8. Verification and Integration Boundary

The executable verification suite should contain both proof-oriented small exhaustive cases and targeted regressions. Record results from the actual run; this table describes required coverage, not a claim that every future integration test already exists.

| Area | Verification obligation |
|---|---|
| Curve | Equal endpoints; `lambda > 1`; bracket growth; zero weights/start; large representable inputs; nonfinite/invalid inputs; numerical-budget exhaustion; exact integer endpoint pinning. |
| Nested sets | Exhaustive small integer endpoint intervals and monotone progress vectors; exact endpoints, bounds, monotonicity; more than one added set per group/week. |
| Group prefixes | Exact group aggregate, each day within endpoint bounds, main/optional tie priority, cursor/alternation, bounded work, heterogeneous group shapes; compare to an independently written small reference enumerator. |
| Epoch composition | Matching shared endpoints; non-nested or mismatched inputs rejected/unsupported; zero-headroom segments; coverage of every week; compressed envelopes retaining inherited maxima. |
| Time proof | Paired and straight costs monotone in all supported nonnegative inputs; no exercise used by two active pairs; envelope/direct-week evaluation equivalence for the claimed rows. |
| Credits | Nonnegative exact quarter-set arithmetic; main-only floors versus all-day upper limits; helper changes evaluated from actual exercise sets; varying credit vectors do not receive the fixed-credit certificate. |
| Caps/blocks | `S=C`, `S>C`, repeated saturation, safe exact rounding, invalid units and boundedness; no divide-by-zero or fabricated strict growth. |
| Edits | Previous certificate removed; targeted bound/floor/cap/time/target conflicts returned; unchanged input not mutated; an acceptable subset never labeled full certified. |
| Fairness | Explicit comparator tests and finite-oracle checks if used; no general greedy optimality claim inferred from fuzzing. |

The theorem and isolated kernels close the specific objection that an otherwise certified nested endpoint requires more than one weekly set addition. They do not close these separate integration obligations:

- Build endpoint candidates with actual credits and valid structure; do not rely on an unverified affine average-credit oracle.
- Produce and independently validate the complete per-week cost-coverage certificate, including exercise-block changes and tests.
- Carry exact group-prefix placement, reps/load prescriptions, and edit conflict reporting into the final plan contract and rendering.
- Replace all active rate-based peak truncations, restricted reachability bounds, and legacy fallbacks; retain historical rates only in truthful reporting where relevant.
- Resolve the peak objective/optimizer status and any other still-proposed policy choices before claiming the complete planner is exact or release-ready.
- Run the full planner's independent technical, coach-eye, and separately authorized promotion gates on the integrated candidate. Prototype tests do not authorize launching the workflow, changing the default engine, or publishing plans.

The implementation readiness flag for the full planner must therefore remain separate from the verified status of this progression prototype. Successful progression tests are a concrete completed result, not a substitute for those remaining gates.
