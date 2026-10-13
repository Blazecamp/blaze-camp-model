# Coach answers by topic: index

> **Round 5 and the chats CH5 / CH6 (2026-10-11 to 2026-10-13) are not yet written into these topic pages entry by entry.** They are the newest answers and win on their subjects. Read them in [coach_answers_round5.md](../../coach_answers_round5.md), [coach_answers_chat_2026-10-11.md](../../coach_answers_chat_2026-10-11.md) and [coach_answers_chat_2026-10-13.md](../../coach_answers_chat_2026-10-13.md); where each one lives is in [coverage_matrix_round5.md](../../coverage_matrix_round5.md), and the short list is in [AGENTS.md](../../AGENTS.md) §4.0. The biggest changes: a health-check yes warns and does not stop the plan (R5-GEN-02); 2 days = two full-body days (R5-GEN-01); a high-incline press counts 1.0 chest (R5-VOL-01); no group starts at its top number (R5-CLS-07); overhead pressing stays for shoulder health (R5-ATH-04); every athletic A / B day has an arm slot (CH5-02); no group above 35 sets (CH5-03).

> **Model v1.3 (2026-10-11).** This index now covers every answer: rounds 1 to 3 (198 ids), the two dated clarifications of 2026-10-10 (`CX-01..04` on progression and editing, `CT-01` on session time) and round 4 (20 ids). The newest answers win on their subjects: no time-fitting, sessions sized by exercise count, his A / B and push / pull / legs templates, the 2-day rule, final sets always reached, progression written as a rule, optional add-ons, incline before overhead, the liability gate, profile labels and the release. Older entries that these answers changed carry a "Changed later" note and a new status. Decision records: [ADR-049](../04-decisions/adr-049-endpoint-priority-and-editable-progression.md) to [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md).

Everything coach Lalo Vera answered about his training model, sorted by topic instead of by questionnaire round. There are 223 ids: 140 from round 1, 45 from round 2, 13 from round 3, 20 from round 4, and 5 from two dated clarifications he gave in conversation on 2026-10-10 (CX-01 to CX-04, CT-01). Each id sits on one topic page with the question, his final answer as it stands today, a short quote, what the team added without his confirmation, where the rule lives in the data, and a note when a later answer changed it. This index maps every id to its page and gives the final rule in one line. The things he said in conversation are filed under the same topics.

## How to read this folder

1. **The latest relevant answer wins.** Round 4 and CT-01 are the newest and rank first. The CX clarification comes next, on its own subjects. Then round 3 beats round 2, round 2 beats round 1, and questionnaire answers beat the earlier conversation notes. Anything he said beats what was read from his sheets.
2. **"Final rule" is the rule today.** When a later round changed an answer, the entry shows both: the earlier text is marked *superseded* and the entry names the answer that replaced it.
3. **PROPOSED means not confirmed by him.** It is the team's design where he asked for a proposal or left a gap. INFERRED means the team's reading of his words. Neither is the coach speaking.
4. **RIGHT with no words** means our assumption or proposal became his rule as written, so each entry prints that text.
5. **Quotes are his words**, copied from the answer files. His answers were dictated, so some words are speech-to-text slips ("park queue" = PAR-Q, "high rows" = HYROX, "plies" = plyos). They are left as they are inside quotes.
6. **"Where it lives"** points to a key in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model (version 1.3.0), unless another file is named. Entries for the 2026-10-10 clarifications and round 4 cite `model/rules.json` and the other compiled files in `model/`, because engine 0.5 was built and tested on those keys. The master-document section and the spec key for each of those answers are in [`coverage_matrix_round4.md`](../../coverage_matrix_round4.md).

| Status word | Meaning |
|---|---|
| Stands | His answer holds as given. |
| Stands, refined | His answer holds. A later round made it more exact. |
| Partly superseded | Part of the answer was reversed by a later round. |
| Superseded | A later round replaced the answer. |
| Answered later | Skipped, not understood or blank in that round; answered in a later one. |

## Topic pages

| Page | What it covers | Question ids | Conversation statements |
|---|---|---|---|
| [Categorization](categorization.md) | How every exercise is tagged; bigger and smaller muscles; core; leg flexion. | 6 | 5 |
| [Levels and zones](levels-and-zones.md) | Foundational / intermediate / advanced; client levels; what "zone" means. | 9 | 1 |
| [Volume](volume.md) | Weekly sets, the floor and ceilings, how a set is counted, reps, effort, rest, pain. | 18 | 4 |
| [Progression](progression.md) | The stairway, the weekly step, reaching the final sets, the written progression rule, where added sets go, and the removed check-in. | 24 | 5 |
| [Bilateral and unilateral](bilateral-unilateral.md) | The 90/10 to 10/90 share; contralateral and ipsilateral loading. | 10 | 2 |
| [Sessions and order](sessions-and-order.md) | Order, pairing, spine loading, session size by exercise count, his A / B template, 2-day weeks, supersets, editing, cardio. | 36 | 3 |
| [Equipment](equipment.md) | No bands, machines and constraint, substitutions, medballs, cardio tools. | 16 | 7 |
| [Athletes and sports](athletes-and-sports.md) | Plyometric vs ballistic, Olympic lifts, seasons, older adults, swimming, HYROX, staying active, profile confidence labels. | 27 | 5 |
| [Plans and calendar](plans-and-calendar.md) | Plan lengths, blocks, easy weeks and maintenance, the year, seasons. | 14 | 3 |
| [Testing](testing.md) | When and what to test; test names. | 5 | 0 |
| [Library details](library-details.md) | Setups, names, levels, additions and removals of specific exercises; optional add-ons, carries, mid-range pull, swaps, video links; sheet fixes. | 37 | 2 |
| [Product and generator](product-and-generator.md) | Who it is for, language, the intake form, the output as an editable template, hard rules, sample plans, the release. | 16 | 7 |
| [Legal and open source](legal-and-open-source.md) | Health check, the liability gate and release line, no data kept, MIT licence, credit, open source. | 5 | 8 |
| [Changes across rounds](changes-across-rounds.md) | Every place where a later answer (round 2, round 3, the 2026-10-10 clarifications, round 4) reversed or refined an earlier one. | - | - |

## The answers in numbers

| Round | File | Date | Questions | RIGHT | PARTLY | NOT RIGHT | Words, no chip | Skipped | No answer |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [`coach_answers_full.md`](../../coach_answers_full.md) | 2026-10-08 | 140 | 84 | 18 | 4 | 30 | 2 | 2 |
| 2 | [`coach_answers_round2.md`](../../coach_answers_round2.md) | 2026-10-08 | 47 | 38 | 3 | 2 | 4 | 0 | 0 |
| 3 | [`coach_answers_round3.md`](../../coach_answers_round3.md) | 2026-10-09 | 13 | 12 | 1 | 0 | 0 | 0 | 0 |
| CX | [`coach_answers_codex_2026-10-10.md`](../../coach_answers_codex_2026-10-10.md) | 2026-10-10 | 3 answers + 1 explanation (CX-01..04) | - | - | - | 4 | 0 | 0 |
| CT | [`coach_answers_time_2026-10-10.md`](../../coach_answers_time_2026-10-10.md) | 2026-10-10 | 1 statement (CT-01) | - | - | - | 1 | 0 | 0 |
| 4 | [`coach_answers_round4.md`](../../coach_answers_round4.md) | 2026-10-11 | 20 | 15 | 4 | 1 | 0 | 0 | 0 |

Round 2 re-asked the two round-1 questions that had no answer (LIB-10, LIB-12), so the first three files hold 200 answer blocks for 198 ids. CX-04 is his explanation that came with the three CX answers, not a fourth answer. Round 4 has 20 questions and 20 answers. His conversation statements are in [`coach_chat_statements.md`](../../coach_chat_statements.md) and, for the earliest ones, [`coach_answers.md`](../../coach_answers.md). That second file also holds a first cleaned copy of his answers to CAT-01 to CAT-09; the full text is in `coach_answers_full.md`.

| Where the 223 answers stand today | Rounds 1 to 3 (198) | 2026-10-10 and round 4 (25) | All |
|---|---|---|---|
| Stands | 90 | 22 | 112 |
| Stands, refined | 80 | 3 | 83 |
| Partly superseded | 16 | 0 | 16 |
| Superseded | 6 | 0 | 6 |
| Answered later | 6 | 0 | 6 |

## All 223 ids

In the order he was asked. Follow an id to its entry.

### Round 1 (140 ids)

| ID | Topic page | Final rule in one line | Status |
|---|---|---|---|
| [CAT-01](categorization.md#cat-01) | [categorization](categorization.md) | Tag every exercise on all lenses at once. | Stands |
| [CAT-02](categorization.md#cat-02) | [categorization](categorization.md) | Big: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, delts, calves, forearms, abs. Rear delts sit inside shoulders. | Stands, refined |
| [CAT-03](categorization.md#cat-03) | [categorization](categorization.md) | Biomechanics describes every exercise; it is not a bucket. | Stands |
| [CAT-04](levels-and-zones.md#cat-04) | [levels-and-zones](levels-and-zones.md) | Level = skill + stability + load position (front foundational, on the body intermediate, behind advanced); machines and cables make it easier. | Stands, refined |
| [CAT-05](levels-and-zones.md#cat-05) | [levels-and-zones](levels-and-zones.md) | Levels add options, never remove them; they are "still very theoretical". | Stands |
| [CAT-06](levels-and-zones.md#cat-06) | [levels-and-zones](levels-and-zones.md) | Client level and exercise level are separate. | Stands |
| [CAT-07](categorization.md#cat-07) | [categorization](categorization.md) | The BYOP MASTER EXERCISE LIBRARY is the single source of truth. | Stands, refined |
| [CAT-08](categorization.md#cat-08) | [categorization](categorization.md) | Core = trunk moves, pelvis moves, or both; in any plane. | Stands |
| [CAT-09](categorization.md#cat-09) | [categorization](categorization.md) | Leg curls, nordics and slider curls = leg flexion, not hip dominant. | Stands, refined |
| [CAT-10](levels-and-zones.md#cat-10) | [levels-and-zones](levels-and-zones.md) | Davidson zones = rotation biases (vertical external, horizontal internal); they do not apply to plyos, which follow a receive-then-create teaching order. | Stands, refined |
| [CAT-11](levels-and-zones.md#cat-11) | [levels-and-zones](levels-and-zones.md) | The plyo "zones" are a way to perform plyos, now named the Receive-Create stages. | Stands, refined |
| [CAT-12](library-details.md#cat-12) | [library-details](library-details.md) | Not understood in round 1; answered by R2-LIB-01. | Answered later |
| [CAT-13](bilateral-unilateral.md#cat-13) | [bilateral-unilateral](bilateral-unilateral.md) | Contralateral load gets you into the hip; ipsilateral helps you out. COD athletes use both; sprinters ipsilateral; BB/PL as early accessory work. | Stands, refined |
| [UNI-01](bilateral-unilateral.md#uni-01) | [bilateral-unilateral](bilateral-unilateral.md) | 10/10 = 10 each side = one set, mostly quads. Landmarks: 15-20 maintenance to some growth, 20-25 growth, 5 too little, 40 too much. | Stands, refined |
| [UNI-02](bilateral-unilateral.md#uni-02) | [bilateral-unilateral](bilateral-unilateral.md) | Bilateral : unilateral share runs 90/10 to 10/90 by athlete; unilateral = health and rotation, bilateral = driving force. | Stands |
| [UNI-03](bilateral-unilateral.md#uni-03) | [bilateral-unilateral](bilateral-unilateral.md) | Upper body: same 90/10 to 10/90 logic. | Stands |
| [UNI-04](bilateral-unilateral.md#uni-04) | [bilateral-unilateral](bilateral-unilateral.md) | Unilateral reps moderate to high by default; heavy low reps available as an option. | Stands |
| [UNI-05](bilateral-unilateral.md#uni-05) | [bilateral-unilateral](bilateral-unilateral.md) | Unilateral progresses like bilateral; 10 % a week is way too much. | Stands, refined |
| [UNI-06](sessions-and-order.md#uni-06) | [sessions-and-order](sessions-and-order.md) | Same-pattern or opposite-pattern pairing depends on the goal; cross pattern is the default for most athletes. | Stands, refined |
| [UNI-07](bilateral-unilateral.md#uni-07) | [bilateral-unilateral](bilateral-unilateral.md) | Alternating exercises count like unilateral ones. | Stands |
| [UNI-08](bilateral-unilateral.md#uni-08) | [bilateral-unilateral](bilateral-unilateral.md) | Pain swap bilateral to unilateral: keep the sets ideally, adjust as needed. | Stands, refined |
| [UNI-09](sessions-and-order.md#uni-09) | [sessions-and-order](sessions-and-order.md) | Typical lengths (athletes about 1.5 h, everyday people 45-60 min) are background for the printed estimate. Session length is not asked and limits nothing (CT-01, R4-SES-01). | Partly superseded |
| [UNI-10](bilateral-unilateral.md#uni-10) | [bilateral-unilateral](bilateral-unilateral.md) | In season: bilateral minimal, unilateral keeps range and health. | Stands |
| [UNI-11](sessions-and-order.md#uni-11) | [sessions-and-order](sessions-and-order.md) | Pair hip dominant with push, knee dominant with pull, to avoid bleed-over. | Stands |
| [UNI-12](bilateral-unilateral.md#uni-12) | [bilateral-unilateral](bilateral-unilateral.md) | More frontal and transverse unilateral work for court and combat athletes; little for aesthetics. | Stands |
| [VOL-01](volume.md#vol-01) | [volume](volume.md) | Start: beginner 10-12, intermediate 15-20, advanced 20+ sets per muscle per week. No learning from user data. | Partly superseded |
| [VOL-02](volume.md#vol-02) | [volume](volume.md) | Superseded: priority muscles (+4-6 sets) became Focus muscle 1 and 2 (+1 to 3 sets each). | Superseded |
| [VOL-03](volume.md#vol-03) | [volume](volume.md) | Pain: cut 30-50 %, machines or split grips, or drop the exercise. The person applies it; nothing is logged. | Stands, refined |
| [VOL-04](progression.md#vol-04) | [progression](progression.md) | The weekly percentage applies to weekly sets per muscle, not to load. | Stands, refined |
| [VOL-05](progression.md#vol-05) | [progression](progression.md) | The weekly step never goes by muscle size. One planned stairway; people adjust by hand. | Partly superseded |
| [VOL-06](progression.md#vol-06) | [progression](progression.md) | Bank the fraction; add a whole set when it reaches 1. The tool does the math. | Stands, refined |
| [VOL-07](progression.md#vol-07) | [progression](progression.md) | Add the set to the first exercise of the day, then the second, and so on; small muscles get a bonus exercise. | Stands, refined |
| [VOL-08](sessions-and-order.md#vol-08) | [sessions-and-order](sessions-and-order.md) | About 7 exercises per resistance session; field athletes up to 12. The by-minutes mapping is retired; counts by client type are in R4-SES-02. | Partly superseded |
| [VOL-09](volume.md#vol-09) | [volume](volume.md) | Main mover 1.0, helpers 0.25 (not 0.5). | Stands, refined |
| [VOL-10](volume.md#vol-10) | [volume](volume.md) | Athletic work never counts toward muscle sets; it is tracked separately. | Stands, refined |
| [VOL-11](volume.md#vol-11) | [volume](volume.md) | Small muscles 12-30 reps, big muscles 5-15 mixed; 40-rep sets only in AMRAP-style or HYROX circuits. | Stands, refined |
| [VOL-12](volume.md#vol-12) | [volume](volume.md) | Preference changes reps on big compound lifts only. | Stands |
| [VOL-13](volume.md#vol-13) | [volume](volume.md) | Effort is RIR, 1-3 on every working set; MAX = technical failure on small or bodyweight work; planned drift 3 to 1 inside that band. | Stands, refined |
| [VOL-14](volume.md#vol-14) | [volume](volume.md) | Rest: hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed. | Stands |
| [VOL-15](volume.md#vol-15) | [volume](volume.md) | Myo sets: last exercise only, machine or isolation only. | Stands |
| [VOL-16](volume.md#vol-16) | [volume](volume.md) | Default 3 sets on compounds, 2 on isolation; athletic templates 2; about 5-7 exercises. | Stands, refined |
| [VOL-17](volume.md#vol-17) | [volume](volume.md) | Calves: 3 sets every leg day. Core: about 2 exercises. Rear delts: inside the shoulders group (no own line). | Partly superseded |
| [VOL-18](volume.md#vol-18) | [volume](volume.md) | Balance the plan; a V-taper bias only when the person wants it. | Stands, refined |
| [PER-01](plans-and-calendar.md#per-01) | [plans-and-calendar](plans-and-calendar.md) | Plans: 12 weeks preferred; 8 weeks OK; 4-6 weeks = maintenance at 50-70 %; more than 12 = another 12 one step up; a yearly option. | Partly superseded |
| [PER-02](plans-and-calendar.md#per-02) | [plans-and-calendar](plans-and-calendar.md) | Same exercises for a 4-6-week block; next block change one or two small variables. | Stands, refined |
| [PER-03](plans-and-calendar.md#per-03) | [plans-and-calendar](plans-and-calendar.md) | A / B weeks (lead-lift swap) for people who want more variety. | Stands |
| [PER-04](sessions-and-order.md#per-04) | [sessions-and-order](sessions-and-order.md) | Second exposure in the week = a different exercise; do not squat heavy twice a week. | Stands, refined |
| [PER-05](plans-and-calendar.md#per-05) | [plans-and-calendar](plans-and-calendar.md) | Easy week (deload) = about half the sets of the hardest week, same exercises, lighter or 3+ RIR, no finisher; only after a block, and only a recommendation. | Stands, refined |
| [PER-06](levels-and-zones.md#per-06) | [levels-and-zones](levels-and-zones.md) | Move up a level in a slot at the end of a block if it felt like an 8 or easier with no pain; the person decides (no check-ins). | Stands, refined |
| [PER-07](testing.md#per-07) | [testing](testing.md) | Tests are optional; picked at block start; the plan says when the test day is. | Stands, refined |
| [PER-08](plans-and-calendar.md#per-08) | [plans-and-calendar](plans-and-calendar.md) | Off-season most volume; pre-season speed/power with less volume; in season 2 days, low volume; post-season recovery. | Stands, refined |
| [PER-09](progression.md#per-09) | [progression](progression.md) | Strength template: main lifts 80/80/85/85/90/90 % at RPE 7 to 10; Olympic ramp 75 to 90 % (8s only for DB/KB and pulls). | Stands, refined |
| [PER-10](plans-and-calendar.md#per-10) | [plans-and-calendar](plans-and-calendar.md) | Smooth increases for general and hypertrophy clients; 2-week steps and waves for fight or competition prep. | Stands, refined |
| [PER-11](plans-and-calendar.md#per-11) | [plans-and-calendar](plans-and-calendar.md) | Athlete rep phases: VOL 1 (12-15) early off-season, VOL 2 (8-12) mid, VOL 3 (6-8) late off-season / pre-season. | Stands |
| [ATH-01](athletes-and-sports.md#ath-01) | [athletes-and-sports](athletes-and-sports.md) | Ground-contact time sets the mix: less time on the ground = more plyos; more time on the ground = more ballistics. | Stands, refined |
| [ATH-02](athletes-and-sports.md#ath-02) | [athletes-and-sports](athletes-and-sports.md) | Plyo ranking: basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing = karate > golf. | Stands, refined |
| [ATH-03](athletes-and-sports.md#ath-03) | [athletes-and-sports](athletes-and-sports.md) | More resistance: linemen, wrestlers, rugby, heavyweights, throwers. More speed/power: sprinters, basketball, skill positions, volleyball. | Stands |
| [ATH-04](athletes-and-sports.md#ath-04) | [athletes-and-sports](athletes-and-sports.md) | Strikers: lower pressing and arm volume when punching volume is high; never cut it completely. | Stands |
| [ATH-05](athletes-and-sports.md#ath-05) | [athletes-and-sports](athletes-and-sports.md) | Medball throws: high for rotational sports, moderate for basketball and football, none for aesthetics except the warm-up. | Stands |
| [ATH-06](athletes-and-sports.md#ath-06) | [athletes-and-sports](athletes-and-sports.md) | COD route names are for every athlete, tiered by turn angle. | Stands, refined |
| [ATH-07](sessions-and-order.md#ath-07) | [sessions-and-order](sessions-and-order.md) | Aerobic sessions: 3 general / fat loss, 2 athletes in season, 4 aesthetics, plus long walks; adjustable. | Stands, refined |
| [ATH-08](athletes-and-sports.md#ath-08) | [athletes-and-sports](athletes-and-sports.md) | Pitchers: less overhead pressing, more arm care, light rotational throws. | Stands |
| [ATH-09](athletes-and-sports.md#ath-09) | [athletes-and-sports](athletes-and-sports.md) | No rules by sex; go by age, foundation, goal, injuries. Older: few plyos unless asked. Youth may lift from the floor. | Stands, refined |
| [ATH-10](athletes-and-sports.md#ath-10) | [athletes-and-sports](athletes-and-sports.md) | Everyone in athletic training gets Olympic lifts; beginners the DB/KB/hex-bar/hang versions, intermediate+ the full scope. | Stands, refined |
| [ATH-11](sessions-and-order.md#ath-11) | [sessions-and-order](sessions-and-order.md) | Core first for everyone, as the warm-up; movable, and can be switched off for a day. | Stands, refined |
| [ATH-12](athletes-and-sports.md#ath-12) | [athletes-and-sports](athletes-and-sports.md) | Contrast and complexes: intermediate+ athletes, off-season, heavy lift about 78-85 %, no rest inside. | Stands |
| [ATH-13](athletes-and-sports.md#ath-13) | [athletes-and-sports](athletes-and-sports.md) | "Justice League" = a marketing name for a non-competitive, all-around athletic program (weekend warriors). | Stands, refined |
| [ORD-01](sessions-and-order.md#ord-01) | [sessions-and-order](sessions-and-order.md) | Row before pulldown, always. | Stands |
| [ORD-02](sessions-and-order.md#ord-02) | [sessions-and-order](sessions-and-order.md) | "The work" (main lift) always comes first, whatever its direction. | Stands |
| [ORD-03](sessions-and-order.md#ord-03) | [sessions-and-order](sessions-and-order.md) | Power (cleans, snatches) before heavy strength. | Stands |
| [ORD-04](sessions-and-order.md#ord-04) | [sessions-and-order](sessions-and-order.md) | A small muscle goes first only when it is the person's Focus muscle. | Stands, refined |
| [ORD-05](sessions-and-order.md#ord-05) | [sessions-and-order](sessions-and-order.md) | Supersets = a tool to add fatigue and compress time: short sessions, advanced athletes, off-season conditioning, beginners who do not fatigue. | Stands, refined |
| [ORD-06](sessions-and-order.md#ord-06) | [sessions-and-order](sessions-and-order.md) | Bootcamp 1 Tue/Fri was a mistake: hip dominant + push, knee dominant + pull. | Stands |
| [ORD-07](sessions-and-order.md#ord-07) | [sessions-and-order](sessions-and-order.md) | The work / the accessory / the nuance / the survival: the four roles of a strength session. | Stands |
| [ORD-08](sessions-and-order.md#ord-08) | [sessions-and-order](sessions-and-order.md) | Always a warm-up (5 min cardio + A-drills or mobility); never counted as volume. | Stands |
| [ORD-09](sessions-and-order.md#ord-09) | [sessions-and-order](sessions-and-order.md) | Fighters' opening cardio is a real aerobic block, not a warm-up. | Stands |
| [ORD-10](sessions-and-order.md#ord-10) | [sessions-and-order](sessions-and-order.md) | Optional days: add-ons or separate days; ideally separate. | Stands, refined |
| [ORD-11](sessions-and-order.md#ord-11) | [sessions-and-order](sessions-and-order.md) | Focus slots: both may hit the same muscle, 2-3 sets each. | Stands, refined |
| [EQ-01](equipment.md#eq-01) | [equipment](equipment.md) | Intake equipment options approved, minus bands: he never programs bands. | Stands |
| [EQ-02](equipment.md#eq-02) | [equipment](equipment.md) | Ideal home kit: adjustable DBs + bench + pull-up bar + 8-10 lb medball; never bands. | Stands, refined |
| [EQ-03](equipment.md#eq-03) | [equipment](equipment.md) | Older, injured, high-volume clients lean on machines and cables; overhead and low-bar squats never. For 60+, jumps and Olympic lifts are off but switchable. | Partly superseded |
| [EQ-04](equipment.md#eq-04) | [equipment](equipment.md) | Foundational older or injured clients may use machines filed as moderate or advanced. | Stands |
| [EQ-05](equipment.md#eq-05) | [equipment](equipment.md) | Add a seated machine shoulder press (foundational). | Stands, refined |
| [EQ-06](equipment.md#eq-06) | [equipment](equipment.md) | Medballs: 8-10 lb passes and rotations, slams 10-20 lb; never over 20 lb. | Stands, refined |
| [EQ-07](equipment.md#eq-07) | [equipment](equipment.md) | No medball: substitute (plyo push-ups, fast cable rotations, fake slam); never band chops. | Stands |
| [EQ-08](equipment.md#eq-08) | [equipment](equipment.md) | No leg extension / leg curl machine: sissy squats; nordics, slider or swiss-ball curls. No bands. | Stands |
| [EQ-09](equipment.md#eq-09) | [equipment](equipment.md) | No implement named: bodyweight, then DB, then barbell as level rises. | Stands |
| [EQ-10](equipment.md#eq-10) | [equipment](equipment.md) | Alternatives: pick by client and by the client's own preference. | Stands |
| [EQ-11](equipment.md#eq-11) | [equipment](equipment.md) | Machines are not ranked; use what works and feels right. Belt squat = no load on the back. | Stands, refined |
| [EQ-12](equipment.md#eq-12) | [equipment](equipment.md) | No variable resistance (bands, chains, weight releasers) for now. | Stands |
| [EQ-13](equipment.md#eq-13) | [equipment](equipment.md) | The 1-5 constraint scale is approved (5 = seated machine with back pad ... 1 = bodyweight, ballistic, reactive). | Stands |
| [EQ-14](equipment.md#eq-14) | [equipment](equipment.md) | Aerobic work on any tool; calories, time or distance; doing the block is what matters. | Stands |
| [EQ-15](equipment.md#eq-15) | [equipment](equipment.md) | Loaded jumps: 10-20 % of bodyweight; too heavy when height or speed drops. | Stands |
| [EQ-16](equipment.md#eq-16) | [equipment](equipment.md) | Depth drops low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12+ in advanced. | Stands |
| [GEN-01](product-and-generator.md#gen-01) | [product-and-generator](product-and-generator.md) | For clients, coaches, trainers, S&C coaches, anyone; English first with a full Spanish toggle. | Stands, refined |
| [GEN-02](product-and-generator.md#gen-02) | [product-and-generator](product-and-generator.md) | Intake: no sex; training experience in years; body weight; sport, position and season only for competitive athletes. Session length left the form in round 4. | Partly superseded |
| [GEN-03](product-and-generator.md#gen-03) | [product-and-generator](product-and-generator.md) | Output: a simple, phone-friendly website (not an app); no tracking by the tool; the repo given away as open source. | Stands, refined |
| [GEN-04](product-and-generator.md#gen-04) | [product-and-generator](product-and-generator.md) | A default exercise in every slot plus same-category dropdown swaps. | Stands, refined |
| [GEN-05](progression.md#gen-05) | [progression](progression.md) | Superseded: the plan is not adjusted from logs. It comes out whole; people adjust it. | Superseded |
| [GEN-06](product-and-generator.md#gen-06) | [product-and-generator](product-and-generator.md) | Superseded: videos are optional; each exercise has a YouTube search link and a name to copy. | Superseded |
| [GEN-07](product-and-generator.md#gen-07) | [product-and-generator](product-and-generator.md) | A short cue per exercise in his voice + his instruction block at the top. | Stands |
| [GEN-08](product-and-generator.md#gen-08) | [product-and-generator](product-and-generator.md) | Hard rules: no failure on heavy compounds, no V-squat, power before strength, horizontal before vertical, core never skipped. Coaches can add rules. | Stands, refined |
| [LIB-01](testing.md#lib-01) | [testing](testing.md) | 'LEFT TEST' = L-test; '5/10/05' = 5-10-5 pro agility drill. | Stands |
| [LIB-02](library-details.md#lib-02) | [library-details](library-details.md) | Push up Stick the Landing: hands start on the box, land on the floor. | Stands |
| [LIB-03](library-details.md#lib-03) | [library-details](library-details.md) | The second 'Low Depth Drop' = the single-leg or weighted variant. | Stands |
| [LIB-04](library-details.md#lib-04) | [library-details](library-details.md) | Advanced hurdle hops = taller hurdles and continuous quick contacts. | Stands |
| [LIB-05](library-details.md#lib-05) | [library-details](library-details.md) | Two MODERATE plyo columns: take one from each. | Stands |
| [LIB-06](library-details.md#lib-06) | [library-details](library-details.md) | Throws have no levels: "just do them right". | Stands |
| [LIB-07](library-details.md#lib-07) | [library-details](library-details.md) | Snatch / Clean / Clean & Jerk = full squat versions (add "Squat" to the name); calf-raise squat with any tool. | Stands, refined |
| [LIB-08](library-details.md#lib-08) | [library-details](library-details.md) | GHD: no levels. | Stands |
| [LIB-09](library-details.md#lib-09) | [library-details](library-details.md) | Setups: alternating staggered deadlift, box pistol, low DB squat, Kong row; 'Pull under' = lat pull-over; Camporini and strap rotations removed. | Stands |
| [LIB-10](library-details.md#lib-10) | [library-details](library-details.md) | KB face pulls = shoulder work (side/rear delts, traps), on shoulder or pull days. | Answered later |
| [LIB-11](library-details.md#lib-11) | [library-details](library-details.md) | The second 'Standing DB Press' = the barbell press. | Stands |
| [LIB-12](library-details.md#lib-12) | [library-details](library-details.md) | Bench push-ups: hands on bench foundational, feet on bench advanced. | Answered later |
| [LIB-13](library-details.md#lib-13) | [library-details](library-details.md) | Push press is the easier one; push jerk is intermediate/advanced. | Stands |
| [LIB-14](library-details.md#lib-14) | [library-details](library-details.md) | Thrusters: quads 1.0, shoulders 0.5 (and glutes 0.25 since R2-VOL-05). | Stands, refined |
| [LIB-15](library-details.md#lib-15) | [library-details](library-details.md) | Leg extension / leg curl level labels were typos; every level may use them. | Stands |
| [LIB-16](library-details.md#lib-16) | [library-details](library-details.md) | Upright rows = side delts. Dips = 0.5 triceps + 0.5 chest, on push days. | Stands |
| [LIB-17](library-details.md#lib-17) | [library-details](library-details.md) | Merge near-duplicates. | Stands |
| [LIB-18](testing.md#lib-18) | [testing](testing.md) | Superseded: the '21.6 mile run' (his "marathon") was removed by R2-LIB-06. | Superseded |
| [LIB-19](library-details.md#lib-19) | [library-details](library-details.md) | Build out carries, drags and sling systems. Since round 4 they are optional add-ons, dosed by distance or time. | Stands, refined |
| [LIB-20](library-details.md#lib-20) | [library-details](library-details.md) | Add frontal / transverse lower-body moves to the library for court and combat athletes. | Stands |
| [LIB-21](sessions-and-order.md#lib-21) | [sessions-and-order](sessions-and-order.md) | Speed session order is fixed: squirrel jumps, MACH drills / acceleration starts, max velocity. | Stands |
| [LIB-22](library-details.md#lib-22) | [library-details](library-details.md) | Medball ALL LIST = 1 x 10 of each throw (about 200 throws). | Stands |
| [PRG-01](library-details.md#prg-01) | [library-details](library-details.md) | Skipped in round 1; answered by R2-LIB-08 (NO ACCESS = self-serve, no coach access). | Answered later |
| [PRG-02](sessions-and-order.md#prg-02) | [sessions-and-order](sessions-and-order.md) | PPL weekdays are flexible: set by the athlete. | Stands |
| [PRG-03](sessions-and-order.md#prg-03) | [sessions-and-order](sessions-and-order.md) | Bootcamp: timed circuits, 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min; 4, 5 or 6 sessions a week. | Stands, refined |
| [PRG-04](plans-and-calendar.md#prg-04) | [plans-and-calendar](plans-and-calendar.md) | STARTING / MID / ADVANCED OFF SEASON: blocks or levels, whatever is needed. | Stands |
| [PRG-05](levels-and-zones.md#prg-05) | [levels-and-zones](levels-and-zones.md) | Novice = newby = Level 1 (under ~1 year, or back after 6-12 months off); Level 2 = over a year consistent; ex-pros only briefly at Level 1. | Stands, refined |
| [PRG-06](progression.md#prg-06) | [progression](progression.md) | One sound algorithm for rep, set and volume increases, for every athlete and level. | Stands, refined |
| [PRG-07](library-details.md#prg-07) | [library-details](library-details.md) | '12/10/8 -20' = 12, 10, 8 getting heavier, then a light 20. '10/10' = 10 per side. | Stands |
| [PRG-08](library-details.md#prg-08) | [library-details](library-details.md) | SCORE = times, rounds or distances for conditioning. | Stands |
| [PRG-09](athletes-and-sports.md#prg-09) | [athletes-and-sports](athletes-and-sports.md) | Baseball: high school = college = pro in structure; loads and speeds differ; Thursday = strength. | Stands |
| [PRG-10](athletes-and-sports.md#prg-10) | [athletes-and-sports](athletes-and-sports.md) | CrossFit FULL TIME = competitor, HALF TIME = class member. | Stands |
| [PRG-11](sessions-and-order.md#prg-11) | [sessions-and-order](sessions-and-order.md) | Fat Burn circuits are finishers after lifting. | Stands |
| [PRG-12](plans-and-calendar.md#prg-12) | [plans-and-calendar](plans-and-calendar.md) | Half-marathon plan (Chris Hinshaw) used as-is, for the half marathon only. | Stands, refined |
| [FIX-01](library-details.md#fix-01) | [library-details](library-details.md) | Skipped in round 1; answered by R2-LIB-08 (point Unilateral HD to the single-leg hinge list). | Answered later |
| [FIX-02](library-details.md#fix-02) | [library-details](library-details.md) | Extend the cardio menus with distance (200-1000 m) and calories; keep them logical. | Stands |
| [FIX-03](library-details.md#fix-03) | [library-details](library-details.md) | Program and day names must be general and understandable. | Stands |
| [FIX-04](library-details.md#fix-04) | [library-details](library-details.md) | Correct spelling in the generator; leave his sheets untouched. | Stands |

### Round 2 (45 ids)

| ID | Topic page | Final rule in one line | Status |
|---|---|---|---|
| [R2-VOL-01](progression.md#r2-vol-01) | [progression](progression.md) | Superseded: the check-in step table is gone, and its 7 % limit was retired by CX-01 and R4-PRG-02. | Superseded |
| [R2-VOL-02](volume.md#r2-vol-02) | [volume](volume.md) | Effort 10 = the most I could do, successful, not a fail. The tool no longer reads effort ratings. | Partly superseded |
| [R2-VOL-03](progression.md#r2-vol-03) | [progression](progression.md) | No check-in, no change: the plan follows its planned stairway. Now true for everyone. | Stands, refined |
| [R2-VOL-04](volume.md#r2-vol-04) | [volume](volume.md) | Small muscles start 10 / 12 / 15 by level. Rear delts' own 4/6/8 sets are retired. | Partly superseded |
| [R2-VOL-05](volume.md#r2-vol-05) | [volume](volume.md) | Glutes 0.25 on squats, lunges, deadlifts, RDLs; 1.0 on hip thrusts and bridges; KB swings count nothing; thruster 1 / 0.5 / 0.25. | Stands |
| [R2-VOL-06](volume.md#r2-vol-06) | [volume](volume.md) | Ceilings 14 / 22 / 25 (priority muscle 18 / 26-28 / 30, now the bound for a Focus muscle); floor 10 sets per muscle per week (from 3 training days); next block starts about 5 % above the last block's start; all customizable. | Partly superseded |
| [R2-VOL-07](plans-and-calendar.md#r2-vol-07) | [plans-and-calendar](plans-and-calendar.md) | No deload or maintenance inside a block. Cannot finish it: stop, maintenance, then a whole new block. | Partly superseded |
| [R2-VOL-08](progression.md#r2-vol-08) | [progression](progression.md) | Not understood in round 2; answered by R3-VOL-03. | Answered later |
| [R2-SES-01](sessions-and-order.md#r2-ses-01) | [sessions-and-order](sessions-and-order.md) | Heavy squat and heavy deadlift on two different days; non-spinal lifts on the other lower days. | Stands |
| [R2-SES-02](sessions-and-order.md#r2-ses-02) | [sessions-and-order](sessions-and-order.md) | Approved list of what counts as loading the spine and what does not. | Stands |
| [R2-SES-03](sessions-and-order.md#r2-ses-03) | [sessions-and-order](sessions-and-order.md) | Core opener: 2 exercises x 2 sets, short of failure. Core supersets optional anywhere. | Stands, refined |
| [R2-SES-04](sessions-and-order.md#r2-ses-04) | [sessions-and-order](sessions-and-order.md) | Field athletes: 12 exercises + the 2-exercise core block. | Stands, refined |
| [R2-SES-05](sessions-and-order.md#r2-ses-05) | [sessions-and-order](sessions-and-order.md) | 2 to 4 exercises per muscle on its day. For full-body days R4-SES-05 replaced this with his A / B template (about 6 exercises). | Partly superseded |
| [R2-SES-06](sessions-and-order.md#r2-ses-06) | [sessions-and-order](sessions-and-order.md) | Aesthetics: 4 sessions (the 4th a second easy Orange) + walks. Every cardio count is adjustable up or down. | Stands |
| [R2-ATH-01](athletes-and-sports.md#r2-ath-01) | [athletes-and-sports](athletes-and-sports.md) | Plyometric share at block end: 75 / 60 / 50 / 40 / 25 % by sport; each block starts 15 points more ballistic. | Stands, refined |
| [R2-ATH-02](athletes-and-sports.md#r2-ath-02) | [athletes-and-sports](athletes-and-sports.md) | Approved lists: which jumps are ballistic and which are plyometric. | Stands |
| [R2-ATH-03](athletes-and-sports.md#r2-ath-03) | [athletes-and-sports](athletes-and-sports.md) | Receive-Create stages: 1 Land, 2 Land & Go, 3 Repeat (12 weeks: 1-3 / 4-7 / 8-12; 8 weeks: 1-2 / 3-5 / 6-8). | Stands |
| [R2-ATH-04](athletes-and-sports.md#r2-ath-04) | [athletes-and-sports](athletes-and-sports.md) | Olympic lifts in season too; up to 4 times a week; cleans = squat pattern, snatches = hinge pattern. | Stands |
| [R2-ATH-05](athletes-and-sports.md#r2-ath-05) | [athletes-and-sports](athletes-and-sports.md) | Full squat cleans/snatches: 3-5 reps per set; the 8-rep ramp stays for DB/KB and pulls; fast and powerful by the coach's eye. | Stands, refined |
| [R2-ATH-06](athletes-and-sports.md#r2-ath-06) | [athletes-and-sports](athletes-and-sports.md) | Athletes off-season 2-4 aerobic sessions by sport; pre-season 2; powerlifters 2 easy. | Stands, refined |
| [R2-ATH-07](athletes-and-sports.md#r2-ath-07) | [athletes-and-sports](athletes-and-sports.md) | In season, game-heavy sports: gym plyos ~half, no extra COD, sprints only for speed athletes, hard day 48 h before a game. | Stands, refined |
| [R2-ATH-08](athletes-and-sports.md#r2-ath-08) | [athletes-and-sports](athletes-and-sports.md) | From 60: no Olympic lifts, plyos or depth jumps by default; optional with his warning. Youth from the floor from ~14 after a hang block. | Partly superseded |
| [R2-LIB-01](library-details.md#r2-lib-01) | [library-details](library-details.md) | Library exercises first; one detail may change between blocks; never an invented exercise. | Stands, refined |
| [R2-LIB-02](levels-and-zones.md#r2-lib-02) | [levels-and-zones](levels-and-zones.md) | Zones 1 and 3 vertical (external rotation), zone 2 horizontal (internal rotation); the zone is a tag, the level comes from load position. | Stands |
| [R2-LIB-03](levels-and-zones.md#r2-lib-03) | [levels-and-zones](levels-and-zones.md) | Keep both rotation biases every week; use the bias to pick pain swaps; not by sport for now. | Stands, refined |
| [R2-LIB-04](library-details.md#r2-lib-04) | [library-details](library-details.md) | KB face pulls: a rear-delt (shoulder) option and a swap, never the main vertical pull. | Stands, refined |
| [R2-LIB-05](library-details.md#r2-lib-05) | [library-details](library-details.md) | Bench push-ups: hands on bench foundational, feet on bench advanced. | Stands |
| [R2-LIB-06](testing.md#r2-lib-06) | [testing](testing.md) | The '21.6 mile run' is removed; the half-marathon plan stays the longest run. | Stands |
| [R2-LIB-07](library-details.md#r2-lib-07) | [library-details](library-details.md) | Approved additions: belt squat, seated machine shoulder press, hang clean, single-arm DB snatch, KB squat clean, hex-bar jump; KB curl, table row, floor Y/T raises. | Stands, refined |
| [R2-LIB-08](library-details.md#r2-lib-08) | [library-details](library-details.md) | 'NO ACCESS' = a self-serve version without coach access (full gym library). | Stands |
| [R2-PER-01](plans-and-calendar.md#r2-per-01) | [plans-and-calendar](plans-and-calendar.md) | Yearly plan for the general population: Q1 cut with more cardio, Q2 summer shape, Q3 maintain ~70 %, Q4 build; December holidays in maintenance. | Stands, refined |
| [R2-PER-02](plans-and-calendar.md#r2-per-02) | [plans-and-calendar](plans-and-calendar.md) | The year follows the user's calendar and is fully tunable (re-order blocks, more or less cardio). | Stands, refined |
| [R2-PER-03](progression.md#r2-per-03) | [progression](progression.md) | Every plan is a stairway: smaller steps first, a bit higher after halfway, never a hard start. | Stands, refined |
| [R2-PER-04](progression.md#r2-per-04) | [progression](progression.md) | 12 weeks: a stairway whose last 4 weeks are the hardest. | Stands, refined |
| [R2-PER-05](progression.md#r2-per-05) | [progression](progression.md) | "Start at a 2 and end at an 11" is the felt level of the block, not a count of sets. | Stands, refined |
| [R2-PER-06](plans-and-calendar.md#r2-per-06) | [plans-and-calendar](plans-and-calendar.md) | Pre-season = 4-6 weeks at ~60 % with speed/power + a 1-2-week taper. Maintenance length is the person's choice and can be extended. | Stands, refined |
| [R2-PER-07](testing.md#r2-per-07) | [testing](testing.md) | Test before (or at the start) and at the end, never during the block; never from zero to a 1RM: 5RM or 3RM, 80-90 % efforts. | Stands, refined |
| [R2-GEN-01](progression.md#r2-gen-01) | [progression](progression.md) | The plan works with no tracking (stands); the optional weekly check-in is removed. | Superseded |
| [R2-GEN-02](product-and-generator.md#r2-gen-02) | [product-and-generator](product-and-generator.md) | Phone-friendly website: fewest clicks, block / week / day views, easy screenshots, videos optional. | Partly superseded |
| [R2-GEN-03](legal-and-open-source.md#r2-gen-03) | [legal-and-open-source](legal-and-open-source.md) | Health check for clients; coaches may bypass it with a legal warning; everyone releases liability every time. | Stands, refined |
| [R2-GEN-04](product-and-generator.md#r2-gen-04) | [product-and-generator](product-and-generator.md) | No sleep, stress or lifestyle questions: workouts only. | Stands |
| [R2-GEN-05](product-and-generator.md#r2-gen-05) | [product-and-generator](product-and-generator.md) | Ask the season start date and practice / game days; the tool works out the phase. | Stands |
| [R2-GEN-06](product-and-generator.md#r2-gen-06) | [product-and-generator](product-and-generator.md) | Weight in reps-in-reserve words; percentages only with a recent tested best; Olympic lifts explained as power output. | Stands |
| [R2-GEN-07](product-and-generator.md#r2-gen-07) | [product-and-generator](product-and-generator.md) | He grades seven sample plans: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs. | Stands, refined |
| [R2-GEN-08](product-and-generator.md#r2-gen-08) | [product-and-generator](product-and-generator.md) | Neutral Latin American Spanish with the English gym word in brackets; he approves the lines; lb / kg switchable. | Stands, refined |

### Round 3 (13 ids)

| ID | Topic page | Final rule in one line | Status |
|---|---|---|---|
| [R3-VOL-01](volume.md#r3-vol-01) | [volume](volume.md) | Rear delts are part of the shoulders group; the floor of 10 is counted on the group; people can always add more rear delts. | Stands |
| [R3-VOL-02](progression.md#r3-vol-02) | [progression](progression.md) | No check-ins at all. Outputs only; people change the plan themselves. | Stands |
| [R3-VOL-03](progression.md#r3-vol-03) | [progression](progression.md) | Added sets alternate between the two days of the same type; small-muscle extras become a bonus exercise, never the only one that day. | Stands |
| [R3-VOL-04](progression.md#r3-vol-04) | [progression](progression.md) | Stairway numbers: usually about 3 % a week to halfway, about 5 % after; the final sets are reached in the last week; the plan comes out whole and people adjust it. | Stands, refined |
| [R3-SES-02](sessions-and-order.md#r3-ses-02) | [sessions-and-order](sessions-and-order.md) | Still his: recommend supersets; people can switch off athletic or core blocks and add or remove exercises. Retired: the time-versus-minimums order (CT-01, R4-SES-03). | Partly superseded |
| [R3-SES-01](sessions-and-order.md#r3-ses-01) | [sessions-and-order](sessions-and-order.md) | Count FOCUS groups (hips, shoulders); calves 1 exercise x 3 sets per leg day; field-athlete layout; Focus muscle 1 and 2 get 1-3 extra sets. | Stands, refined |
| [R3-PER-01](plans-and-calendar.md#r3-per-01) | [plans-and-calendar](plans-and-calendar.md) | The easy week after a block is an extra week and only a recommendation; holidays sit between blocks; when a block ends, it ends. | Stands |
| [R3-ATH-01](athletes-and-sports.md#r3-ath-01) | [athletes-and-sports](athletes-and-sports.md) | Swimming dryland: 3 + 1 days, 0 extra cardio, 25 % plyo, Olympic lifts 2-3 days, shoulder care every session, 2-week taper with the swim taper. | Stands |
| [R3-ATH-02](athletes-and-sports.md#r3-ath-02) | [athletes-and-sports](athletes-and-sports.md) | 60+: on/off defaults with a switch and warning. Racket players 50+: knee-friendly strength, calf/Achilles every leg day, rotator cuff, low-impact jumps. | Stands |
| [R3-ATH-03](athletes-and-sports.md#r3-ath-03) | [athletes-and-sports](athletes-and-sports.md) | "High rows" = HYROX. Plan: 2 strength + 2 hybrid days, 4 cardio, 2 station circuits as finishers, wall ball max 20 lb, 50 % plyo. | Stands |
| [R3-ATH-04](athletes-and-sports.md#r3-ath-04) | [athletes-and-sports](athletes-and-sports.md) | Plyo shares, cardio and in-season rule for every remaining sport; recreational players use their activity's share. | Stands |
| [R3-ATH-05](athletes-and-sports.md#r3-ath-05) | [athletes-and-sports](athletes-and-sports.md) | Stay active: play days (hard gym day 48 h before), activity counts as cardio (up to 2), optional event date. | Stands |
| [R3-GEN-01](legal-and-open-source.md#r3-gen-01) | [legal-and-open-source](legal-and-open-source.md) | Lawyer-written health check EN/ES + PAR-Q+ link; own-risk checkbox every build; no data kept; MIT to Lalo Vera, Blaze Camp, BFit Studios Corp.; legal text in EN and ES. | Stands, refined |

### The 2026-10-10 clarifications (5 ids)

Said in conversation, between rounds 3 and 4. They rank above rounds 1 to 3 on their own subjects. CT-01 ranks with round 4.

| ID | Topic page | Final rule in one line | Status |
|---|---|---|---|
| [CX-01](progression.md#cx-01) | [progression](progression.md) | Reach the planned final sets; increase faster when that is what it takes. | Stands, refined |
| [CX-02](progression.md#cx-02) | [progression](progression.md) | A week may keep the same sets while reps or load progress; the sets of any day or week are editable. | Stands |
| [CX-03](progression.md#cx-03) | [progression](progression.md) | At the top number, sets stay and reps or load progress. | Stands, refined |
| [CX-04](product-and-generator.md#cx-04) | [product-and-generator](product-and-generator.md) | The output is an editable template: all of it, including the sets of any day or week. | Stands |
| [CT-01](sessions-and-order.md#ct-01) | [sessions-and-order](sessions-and-order.md) | Do not fit plans to time. Size sessions by exercise count; an average time is information only. | Stands |

### Round 4 (20 ids)

| ID | Topic page | Final rule in one line | Status |
|---|---|---|---|
| [R4-SES-01](sessions-and-order.md#r4-ses-01) | [sessions-and-order](sessions-and-order.md) | The form does not ask for a session length. Each day shows an estimate only; nothing is cut for time. | Stands |
| [R4-SES-02](sessions-and-order.md#r4-ses-02) | [sessions-and-order](sessions-and-order.md) | Exercises per session: general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6. Recommendations. | Stands |
| [R4-SES-03](sessions-and-order.md#r4-ses-03) | [sessions-and-order](sessions-and-order.md) | 2 days a week: every big muscle at about 6-8 weekly sets; the plan says so and suggests a third day. | Stands |
| [R4-SES-04](sessions-and-order.md#r4-ses-04) | [sessions-and-order](sessions-and-order.md) | Nothing is left out automatically. The person picks what to keep or take away. | Stands |
| [R4-SES-05](sessions-and-order.md#r4-ses-05) | [sessions-and-order](sessions-and-order.md) | Full-body days are his A day (pull + knee dominant) and B day (push + hip dominant): about 6 exercises, up to 8. | Stands |
| [R4-PRG-01](progression.md#r4-prg-01) | [progression](progression.md) | Reach the top set number in the last week when the math allows; one week early is fine; never earlier. | Stands |
| [R4-PRG-02](progression.md#r4-prg-02) | [progression](progression.md) | No hard limit on a weekly step; a clear note when a week adds more than about 15 %. | Stands |
| [R4-PRG-03](progression.md#r4-prg-03) | [progression](progression.md) | Rep and load progress is written as a rule the person applies, never a promised number. | Stands |
| [R4-PRG-04](progression.md#r4-prg-04) | [progression](progression.md) | The next block starts about 5 % above the last block's start, in whole sets, never above the level's top. | Stands |
| [R4-LIB-01](library-details.md#r4-lib-01) | [library-details](library-details.md) | Proposed exercises are optional add-ons, never a template's pick; wall balls and sled pushes may be primary in HYROX, maybe CrossFit; neck work stays proposed. | Stands |
| [R4-LIB-02](library-details.md#r4-lib-02) | [library-details](library-details.md) | Carries and sled work: 2-4 trips of 20-40 m or 20-40 s; no muscle sets; with core / conditioning. | Stands |
| [R4-LIB-03](library-details.md#r4-lib-03) | [library-details](library-details.md) | A mid-range pull category; incline pressing before overhead pressing for bodybuilders and the general population. | Stands |
| [R4-LIB-04](library-details.md#r4-lib-04) | [library-details](library-details.md) | A swap says in one short line what it keeps and what it loses. | Stands |
| [R4-LIB-05](library-details.md#r4-lib-05) | [library-details](library-details.md) | No third-party video links in the public data; a YouTube search link and an easy way to copy the exercise name. | Stands |
| [R4-SCP-01](legal-and-open-source.md#r4-scp-01) | [legal-and-open-source](legal-and-open-source.md) | Everyone may use the plans on their own; every plan releases liability before and after it comes out. | Stands |
| [R4-SCP-02](legal-and-open-source.md#r4-scp-02) | [legal-and-open-source](legal-and-open-source.md) | The terms and release must be accepted before the plan shows; a minimal release line is printed on the plan. | Stands |
| [R4-SCP-03](athletes-and-sports.md#r4-scp-03) | [athletes-and-sports](athletes-and-sports.md) | Every sport profile carries a label: confirmed by coach, based on a similar sport, or proposed. Not shown on the plan. | Stands |
| [R4-REL-01](product-and-generator.md#r4-rel-01) | [product-and-generator](product-and-generator.md) | Release model v1.3 as the finished model; finish it all, then consolidate. | Stands, refined |
| [R4-REL-02](product-and-generator.md#r4-rel-02) | [product-and-generator](product-and-generator.md) | Build the engine now. | Stands |
| [R4-REL-03](legal-and-open-source.md#r4-rel-03) | [legal-and-open-source](legal-and-open-source.md) | The repo credits the model to Coach Lalo (Gerardo Vera), Master NASM coach, as his experience and intellectual property; no "world's best" claims. | Stands |

## Related documents

| Document | What it is |
|---|---|
| [`docs/README.md`](../README.md) | The map of the docs folder |
| [`docs/01-philosophy/principles.md`](../01-philosophy/principles.md) | His principles, with the reasons |
| [`docs/01-philosophy/what-he-rejected.md`](../01-philosophy/what-he-rejected.md) | Ideas he considered and rejected |
| [`docs/02-model/volume.md`](../02-model/volume.md) | Plain-language model guides (one per topic, in `02-model/`) |
| [`docs/04-decisions/index.md`](../04-decisions/index.md) | Decision records |
| [`docs/05-reference/glossary.md`](../05-reference/glossary.md) | Glossary of his terms |
| [`docs/05-reference/parameters.md`](../05-reference/parameters.md) | Every number in the model and where it lives |
| [`docs/06-history/method.md`](../06-history/method.md) | How the answers were collected and checked |
| [`docs/adding-exercises.md`](../adding-exercises.md) | How to add an exercise |
| [`BLAZE_CAMP_BRAIN.md`](../../BLAZE_CAMP_BRAIN.md) | The master document of the model (v1.3) |
| [`coverage_matrix_round4.md`](../../coverage_matrix_round4.md) | Coverage check: each round-4, CT-01 and CX answer traced into the master, the spec and the compiled rules |
| [`coverage_matrix_round3.md`](../../coverage_matrix_round3.md) | Coverage check: each round-3 answer traced into the model |
| [`coverage_matrix_round2.md`](../../coverage_matrix_round2.md) | Coverage check for round 2 |
| [`coverage_matrix.md`](../../coverage_matrix.md) | Coverage check for round 1 |
| [`DISCLAIMER.md`](../../DISCLAIMER.md) | Disclaimer and release of liability |
