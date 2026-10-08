# 08 · Open questions for the coach, and what the generator still does not know

**What this is.** A completeness review of the whole Blaze Camp model, written after reading every synthesis file (01-07, 10, 10b, 11), skimming every decode in `analysis/`, re-checking a few things in the raw workbooks, and reading `coach_answers.md` first. It has two jobs:

1. **A new questionnaire for the coach.** It holds only questions that are **not** already on the questionnaire page (`coach-questions.html`, 140 questions in its `S` array). Each new question names the existing question IDs it relates to, so the two lists can be merged on the page.
2. **A critic's report for the team.** What the generator still does not know, what nobody read, quantified or reconciled, which contradictions remain between the synthesis files, and which rules are guesses that only the coach can confirm.

**Where the questionnaire stands (OBSERVED, 2026-10-08).** 9 of the 140 page questions are answered (CAT-01 to CAT-09, in `coach_answers.md`). The other 131 are still open. The new questions below are meant to be added to the page **after** the open core questions there. They do not replace them.

**Labels used in this file**

| Label | Meaning |
|---|---|
| COACH-ANSWER | The coach's own answer in `coach_answers.md`. Overrides everything else. |
| COACH-CHAT | The coach's spoken statements as relayed in the brief (close paraphrase, not a transcript). |
| OBSERVED | Read from a sheet cell. Labels are quoted verbatim with the coach's typos ('TRIPPLE', 'SAGITAL', 'INTERMIDIATE', 'ABdution', 'DOMNANT'). |
| INFERRED | The team's reasoning. Never show it to clients as the coach's rule. |
| SCIENCE | Published evidence, as cited in the synthesis files. |
| P1 / P2 / P3 | Priority. **P1** = the generator cannot be built correctly without it, or it changes many plans. **P2** = it changes defaults for some clients. **P3** = detail or clean-up. |

**Question IDs.** New questions use an `N-` prefix so they never collide with the page IDs: N-CAT (categorization), N-VOL (volume and dosing), N-ATH (athletes and sports), N-SES (session structure), N-PER (periodization), N-IN (intake form), N-OUT (output format).

---

## 0. The 20 new questions to ask first

There are 104 new questions below (32 P1, 64 P2, 8 P3; two more were withdrawn as repeats). These are the 20 most important P1 questions, in the order the build needs them. Every one of them blocks a part of the generator or changes most plans.

| # | ID | In one line | Blocks |
|---|---|---|---|
| 1 | N-CAT-01 | Are the hidden MASTER MODEL tabs (boxing, upper/lower and PPL levels, ALL ABOUT SQUATS, ballistics, control patterns) still your current thinking? | the gym level ladder, the sport dial anchor, machine ratings, rest rules, force phases, core regions |
| 2 | N-IN-01 | How should a client's level be decided? | every start volume, cap and rep bracket |
| 3 | N-CAT-02 | Will you review the exercise tags in bulk (muscles, implement, skill)? | slot filling, volume credit, equipment filter |
| 4 | N-VOL-01 | Is 15-20 sets the week-1 volume or the end-of-block target? | every weekly set number |
| 5 | N-VOL-04 | Does the 3/5/7 % ramp apply to every muscle or only the focus muscle? | the progression engine |
| 6 | N-VOL-02 | When sets go up, does the load stay the same that week? | load prescriptions |
| 7 | N-VOL-03 | Is +2 sets at ~20 sets (then a hold week) your normal step? | the release rule |
| 8 | N-VOL-05 | What is the weekly ceiling for a muscle that is not a priority? | caps and overreach |
| 9 | N-PER-01 | What happens after a 6/8/12-week plan ends? | plan chaining, deload placement |
| 10 | N-CAT-13 | Are squirrel jumps (and other bouncing) "real" plyos or low-amplitude work? | the whole sport plyo dial |
| 11 | N-ATH-02 | Is your boxing example a normal, low or high plyo dose for a boxer? | the tier scale for every sport |
| 12 | N-ATH-01 | Which sports must the first version support? | intake menu, profile work |
| 13 | N-ATH-04 | Should field and court athletes get a sprint slot? | athletic templates |
| 14 | N-ATH-05 | Is change of direction kept in the gym plan or left to sport practice? | athletic templates |
| 15 | N-ATH-07 | In season, do games and practice count against the gym's jumps, sprints and cuts? | in-season plans |
| 16 | N-SES-01 | In athlete sessions, does core come before or after the Olympic lift? | session order |
| 17 | N-SES-04 | What do you cut first for a 30- or 45-minute client? | short sessions |
| 18 | N-IN-04 | Should a short health screen send some clients to you before a plan is made? | safety, self-serve flow |
| 19 | N-IN-06 | For athletes: season phase picker, or season dates plus practice load? | phase selection |
| 20 | N-OUT-12 | Will you write or grade 3-5 sample client plans so we can test the generator against you? | validation of everything |

---

## 1. What the generator still does not know (critic summary)

1. **Whether the hidden tabs are current.** Eight MASTER MODEL tabs are hidden: 'EXAMPLE UPPERLOWER SPLIT', 'EXAMPLE PUSHPULLLEGS SPLIT', 'EXAMPLE BOXING 8 WEEK BUILD UP', 'ALL ABOUT SQUATS', '(NOT DONE) ALL ABOUT BALLISTICS', '(NOT DONE) ALL ABOUT OLYMPIC LI', 'AGILITYCOD PATTERNS' and 'CONTROL PATTERNSCORE' (OBSERVED, `sheet_state = hidden` in `raw/MASTER_MODEL.xlsx`). The team leaned on them heavily: the gym level ladder 76 → 90 → 102 sets/week, the boxer as the anchor of the sport dial, the machine ratings ('LOVE IT', "I PERSONALLY DON'T LIKE IT"), the only written rest rules ('*REST 1-2 MIN BETWEEN SETS', '*REST 3-6 MIN BETWEEN SETS'), the French contrast, the force phases, the medball list and the core 'BOTH' region. Nobody asked whether hidden means retired. (N-CAT-01)
2. **The exercise tags are all ours.** For all 322 selectable library exercises, the main muscles, synergists, implement, skill, impact and typical rep range are INFERRED (computed from `02_exercise_catalog.json`: every one of these fields is listed in `inferred_fields` for 322 of 322 records). The coach called this tagging "huge" (CAT-01) but has not seen a single tag. (N-CAT-02)
3. **Most of the library has never been dosed by the coach.** Only 145 of the 322 selectable exercises appear in any of his programs (computed: `observed_in_programs_count > 0`). For the other 177 (55 %) every set, rep and effort default is a guess. (N-CAT-02, N-CAT-20)
4. **The sport dial rests on two programs.** The only coach-written programs for a named sport are BASEBALL and the boxing build-up (plus CrossFit, which is its own sport); the athletic examples and the BYOP athletic template name no sport. Basketball, MMA, karate, football, soccer and the rest are extrapolated (`04_athlete_profiles.md` section 5, 19 of 27 profiles INFERRED). One counting choice (squirrel jumps as low-amplitude) decides whether the coach's own "boxers fewer plyos" statement holds. (N-CAT-13, N-ATH-02)
5. **How a client's level is decided.** Every file uses levels (L1-L4, F/I/A eligibility, NOVICE/NEWBY/INTERMEDIATE). No file says how a client is placed in one. (N-IN-01, N-IN-02, N-IN-03)
6. **What happens after week 6, 8 or 12.** The files disagree on whether a 6-week plan ends on a peak or a deload, and none says how the next plan starts. (N-PER-01)
7. **Session length.** No tab states a duration. Every minute figure is modelled (`05_session_architecture.md` 7.2), and two files anchor the same athletic day at 60 and at 75 minutes. (N-SES-04, contradiction C-15)
8. **Load guidance for clients.** No implement weight is written anywhere (0 cells in lb or kg), and there is no rule for how a client picks a starting weight or warms up to a working set. (N-OUT-02, N-SES-14)
9. **Safety gate.** No file defines when a self-serve client should be stopped and sent to the coach (medical red flags, recent surgery, pregnancy). (N-IN-04)
10. **Videos.** Only 81 of the 322 selectable exercises (25 %) carry one of the coach's video links (computed from `video_urls` in the catalog). (N-OUT-09)
11. **The generator has never been tested against the coach.** No file regenerates one of his own plans (for example JUSTICE LEAGUE Monday or BASEBALL Block 1) from the client inputs to see whether the rules reproduce his choices. (N-OUT-12)

---

## 2. The questionnaire (new questions only)

Format of every entry:
- **Question**, in plain words.
- **We assume**: what the model does today, with its evidence tag.
- **Why it matters**: what the generator does differently depending on the answer.
- **Options**: suggested answers (the coach can always write his own).
- **Relates to**: page question IDs on the same topic.

### 2.1 Categorization

**N-CAT-01 · P1 · Relates to: CAT-07, PRG-01**
**Question.** Eight tabs in the MASTER MODEL are hidden: the upper/lower and push/pull/legs level examples, the boxing build-up, 'ALL ABOUT SQUATS', the ballistics, Olympic lifting and agility tabs, and 'CONTROL PATTERNSCORE'. Do they still show how you think today?
- **We assume:** yes, all of them are current (INFERRED; the hidden state is OBSERVED).
- **Why it matters:** if a tab is outdated, every rule built on it must go back to "guess". That includes the gym levels (more sets as clients advance), the boxer anchor for the sport dial, your machine ratings, the only rest rules you wrote, the French contrast, the force phases, the medball list and the 'BOTH' core region.
- **Options:** A) all current; B) current but unfinished; C) some are outdated (name them); D) hidden because they are retired.

**N-CAT-02 · P1 · Relates to: CAT-01, CAT-02, VOL-09**
**Question.** We tagged every exercise ourselves: main muscle, helper muscles, implement, skill, impact and usual reps. Would you check these tags in one review sheet?
- **We assume:** the tags are right until you correct them (INFERRED: all 322 selectable exercises carry analyst tags).
- **Why it matters:** these tags decide which exercise can go in which slot, which muscle gets credit for the sets, and what a client with no gym can do. You said tagging every exercise this way is "huge" (CAT-01).
- **Options:** A) review all 322; B) review only the 145 you have used in programs; C) review only the ones we flag as uncertain or conflicting; D) trust the tags and fix them as you spot problems.

**N-CAT-03 · P1 · Relates to: CAT-02, VOL-05, VOL-09**
**Question.** Your big and small lists (CAT-02) leave out traps, front delts, adductors, hip abductors (glute med), lower back, neck and the rotator cuff. For each one: big, small, credited only through other lifts, or its own weekly target?
- **We assume:** none of them has its own weekly target; they get half credit from presses, rows and hinges (INFERRED, `11_training_variables.md` 3.3).
- **Why it matters:** the weekly growth rate and the weekly cap both depend on the size group. Neck and adductor work also matter for wrestlers, hockey players and fighters (N-ATH-14).
- **Options per muscle:** big / small / indirect only / own target.

**N-CAT-04 · P2 · Relates to: VOL-09, CAT-02**
**Question.** Every lower-body lift gives glutes some credit, so glutes land at 21-35 sets a week in your programs, more than any other muscle. Should glutes have their own target and ceiling?
- **We assume:** glutes are tracked but never limit a plan (INFERRED).
- **Why it matters:** if glutes count fully, they hit the ceiling first and block extra leg sets for quads and hamstrings.
- **Options:** A) count glutes only from hinges, hip thrusts and lunges; B) count all lower work but cap glutes; C) don't track glutes separately.

**N-CAT-05 · P2 · Relates to: CAT-01, CAT-04, ORD-01**
**Question.** 'MID RANGE PUSH' (incline presses, landmine, viking press) appears only in the RESISTANCE PATTERNS tab. In BYOP these lifts are spread over VERTICAL PUSH FOUNDATIONAL, HORIZONTAL PUSH ADVANCED and the unilateral vertical push block. Should mid-range push be its own category? Do incline presses count for chest, shoulders or both? Is there a mid-range pull?
- **We assume:** incline is a horizontal-push variant that counts 1.0 chest and 0.5 front delts; no mid-range pull (INFERRED).
- **Why it matters:** it decides which slot an incline press can fill and how much chest volume it adds.
- **Options:** A) own category and slot; B) part of horizontal push; C) part of vertical push; D) add a mid-range pull too.

**N-CAT-06 · P2 · Relates to: VOL-17, LIB-10, LIB-16, ATH-08**
**Question.** The 'ABdution' list mixes side raises, front raises, reverse flies and upright rows, and rear delts get about 3 sets a week. Should shoulders split into side, rear and front, with rear delts getting their own slot?
- **We assume:** split in three; rear delts get a slot 1-2 times a week in every template (INFERRED).
- **Why it matters:** rear delts and external rotation protect throwers and overhead athletes, and today they are almost never trained directly.
- **Options:** A) split and give rear delts their own slot; B) split for tagging only, one shoulder slot; C) keep one list.

**N-CAT-07 · P2 · Relates to: CAT-09, LIB-14, LIB-15**
**Question.** You answered that leg curls are not hip dominant (CAT-09). The same question for other isolations inside compound lists: 'Leg Extension Machine' sits in all three Bilateral KD blocks, flies sit in horizontal push, thrusters in both Bilateral KD and vertical push. Should a client be able to pick a leg extension in the 'Bilateral KD' slot?
- **We assume:** no. Leg extensions only in the 'Leg Extensions' slot; flies only in a fly or Focus slot (INFERRED).
- **Why it matters:** a leg extension in the squat slot would leave a quad day with no squat pattern.
- **Options:** A) isolation only in isolation slots; B) allowed in compound slots as a fallback when equipment is missing; C) allowed freely.

**N-CAT-08 · P1 · Relates to: CAT-09, VOL-05, VOL-09**
**Question.** You said leg curls, nordics and slider curls are "kind of like bicep curls" (CAT-09). Should they be dosed like a small muscle (high reps, 'MAX', faster weekly growth) or like hamstrings (a mix of reps, slower growth)? Do their sets count fully toward hamstring weekly sets?
- **We assume:** they count fully toward hamstrings, with 15-20 reps and the last set to 'MAX' (INFERRED; growth rate open).
- **Why it matters:** it decides the rep range, the weekly growth rate and how many hamstring sets are left for hinges.
- **Options:** A) like curls: high reps, small-muscle rate; B) like hamstrings: mixed reps, big-muscle rate; C) nordics differ from machine curls (say how).

**N-CAT-09 · P2 · Relates to: CAT-08**
**Question.** Sheet23 orders core by plane as difficulty: 'FOUNDATIONAL - CT - SAGITAL', 'INTERMEDIATE - CT - FRONTAL', 'ADVANCED - CT - TRANSVERSE'. Your CAT-08 answer says each segment "can be done in different planes". So is plane a difficulty ladder or only variety? Do static holds come before dynamic moves? Can a static rotation hold (Pallof hold) be foundational?
- **We assume:** plane is the default order between blocks (sagittal, then frontal, then transverse) and static comes before dynamic, but single exercises may break it (INFERRED).
- **Why it matters:** it decides which core exercises a beginner can get and how core changes from block to block.
- **Options:** A) plane is difficulty; B) plane is variety, difficulty comes from other things (lever length, load, static vs dynamic); C) both, case by case.

**N-CAT-10 · P2 · Relates to: CAT-08, CAT-07**
**Question.** The 'BOTH' core region (dead bugs, bird dogs, V-ups, planks) and the STATIC/DYNAMIC split exist only in the hidden 'CONTROL PATTERNSCORE' tab. Should they go into the BYOP core list and the 'Core' slot?
- **We assume:** yes (INFERRED).
- **Why it matters:** without them the 'Core' slot cannot follow your thorax / pelvis / both rule (CAT-08).
- **Options:** A) add both; B) add 'BOTH' only; C) keep BYOP as it is.

**N-CAT-11 · P2 · Relates to: CAT-01, CAT-13, UNI-12**
**Question.** In your sheets a squat with a hip band is filed 'BILATERAL FRONTAL' and a squat with a rotating strap is transverse. So does "plane" mean the direction of the force the athlete must resist, not the direction the body moves?
- **We assume:** yes: plane = the force to resist (INFERRED from RESISTANCE PATTERNS; 'Movement orientations/guidance loads AROUND', ALL ABOUT LUNGES A19).
- **Why it matters:** court and combat profiles ask for frontal and transverse work; the generator needs to know which exercises count.
- **Options:** A) force to resist; B) direction of movement; C) both are tagged and both count.

**N-CAT-12 · P2 · Relates to: CAT-04, LIB-13, EQ-04**
**Question.** Some follow-ups on your load-position zones (CAT-04):
1. For raises and chops, is the zone judged where the movement ends (a raise to shoulder height = zone 2)?
2. Dips: hands are low but the shoulders go behind the body. Zone 3?
3. Seal rows are filed ADVANCED although the chest is supported. Should supported rows be easier?
4. Hanging core ('Toes to bar', 'Knees to chest') is FOUNDATIONAL although hanging is overhead (zone 3). Keep?
5. Following your rule, we moved 'High Zercher DB Squats' / 'High Zercher Barbell Squats' down to FOUNDATIONAL and the high-bar and low-bar back squats up to ADVANCED. Agree?
- **We assume:** 1 yes; 2 zone 3; 3 easier; 4 keep; 5 agree (INFERRED, `10_equipment_model.md` 1.4).
- **Why it matters:** these items sit at the edges of your zone rule, so they decide which clients can be offered them.
- **Options:** yes or no per item.

**N-CAT-13 · P1 · Relates to: ATH-01, LIB-05, CAT-11**
**Question.** We see three jump tracks in your library: ankle / limited-knee hops ('JUMPING ANKLE', plate hops), landing → box → hurdle plyos ('PLYOS'), and 'FULL JUMPING' (which also holds ' Squirrel jumps', 'Single leg squirrel jumps', ' Max velocity running (top speed)' and plyo push-ups). You file squirrel jumps under PLYOS 'ADVANCED' / 'FULL JUMPING' and '*FASTEST SSC*'. We counted them as low-amplitude bouncing. Which is right?
- **We assume:** squirrel jumps, ankle hops and rope are low-amplitude; depth drops, box, hurdle and max jumps are high-amplitude (INFERRED).
- **Why it matters:** counted our way, your boxer does about 113-129 high-amplitude contacts a week, a mid tier, so "boxers fewer plyos" holds. Counted your way (as filed), the boxer does about 248-264, the top tier, and the sport ladder would have to be rebuilt.
- **Options:** A) squirrel jumps are low-amplitude bouncing; B) they are real plyos; C) a third class (fast reactive, low height).

**N-CAT-14 · P2 · Relates to: CAT-11, CAT-10**
**Question.** Two plyo ladders exist: the force phases 'TAKING IN FORCES' → 'DELIVER FORCES FAST' → 'AMORTIZATION OF FORCES' → 'REBOUNDING ' (ballistics tab) and the plyo zones 'Receive pause/creat' → 'Receive/create' → 'Repeat receive create' (Sheet23). Are they the same ladder? Is putting 'DELIVER FORCES FAST' (jump onto a box) before 'AMORTIZATION OF FORCES' deliberate?
- **We assume:** they are the same progression seen two ways, and jump-onto comes before drop-and-go on purpose because it removes the landing cost (INFERRED).
- **Why it matters:** it sets the week-by-week order of jump work in every athletic plan.
- **Options:** A) same ladder; B) different ladders (explain); C) force phases are a season order, zones are a weekly order.

**N-CAT-15 · P2 · Relates to: ATH-01, ATH-05**
**Question.** Your ballistics tab separates 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' ('*I USE THESE FOR MUSCULAR FORCE PRODUCTION') from 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' ('*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'). Should the generator keep two separate dials: one for throws, loaded jumps and Olympic work, one for reactive plyos?
- **We assume:** yes. Sport mostly changes the reactive dial; strikers and rotational sports keep the ballistic dial high (INFERRED).
- **Why it matters:** one "plyo" number cannot express a boxer with few rebounds but 380 throws a week.
- **Options:** A) two dials; B) one dial; C) three dials (reactive, ballistic, throws).

**N-CAT-16 · P1 · Relates to: CAT-07, LIB-21**
**Question.** About 134 exercises appear only in your programs, not in the BYOP library: 'SL RDL' / 'Single Leg Deadlift' (49 uses), 'JM PRESS', 'Neutral grip lat pull down' and 'Pull under' (16 each), hang cleans and snatches at %, seal rows, A-drills, bike/row/ski calorie sprints, slider hamstring runners, Copenhagen raises, hollow rocks. Should the generator offer them? At what level?
- **We assume:** yes, all of them, each at the level of the library block its pattern belongs to (INFERRED).
- **Why it matters:** these are some of your most-used exercises; leaving them out makes generated plans look less like yours.
- **Options:** A) add all; B) add the ones used 5+ times; C) you pick from a list; D) library only.

**N-CAT-17 · P3 · Relates to: CAT-03, ORD-08**
**Question.** Dr. Pat Davidson's patterns include Breathing; your library has the other families but no breathing work. Left out on purpose, or should breathing or positional drills go into the warm-up?
- **We assume:** left out on purpose (INFERRED).
- **Options:** A) on purpose; B) add to warm-up; C) add as its own category.

**N-CAT-18 · P3 · Relates to: CAT-12**
**Question.** In the 'ROM VARIABLE' block, does 'Elevated' (green, easiest) mean a raised start (shorter range) or raised feet (longer range)? 'Elevated Push ups (for full ROM)' suggests the second. And what does '*RDL' mean as the red value in 'ROM VARIABLE', 'END RANGE BEHAVIOR VARIABLE' and 'LOADING VARIABLES'?
- **We assume:** 'Elevated' changes by exercise; '*RDL' is unknown (INFERRED).
- **Options:** free answer.

**N-CAT-19 · P3 · Relates to: CAT-07, FIX-01 to FIX-04**
**Question.** In the tab 'Copy of Copy of MASTER EXERCISE', some category headers are in red font (TRIPPLE EXTENSION, PLYOS, THROWING, core and the lower-body categories). What does the red mean?
- **We assume:** nothing the generator needs (INFERRED).
- **Options:** A) reviewed; B) still needs work; C) used in athletic programs; D) no meaning.

**N-CAT-20 · P2 · Relates to: GEN-04, CAT-05, EQ-10**
**Question.** You said the levels are "very theoretical" (CAT-05). So when a slot has 30 options, what should the generator pick first?
- **We assume:** in this order: (1) the exercises you program most (Front Squat 66 uses, deadlift with no implement named 65, Single-Arm DB/KB Row 60, Pull-up 54, DB Lateral Raise 52, SL RDL 49, Staggered-Stance DL 48, Barbell Bench 48, Leg Press 45, Leg Extension 45); (2) the best fit for the client's age, pain and goal (machines for older or injured clients); (3) the client's equipment; (4) your 'LOVE IT' machines first and the hack squat last (INFERRED).
- **Why it matters:** this is how every default exercise in every plan gets chosen.
- **Options:** A) as assumed; B) a different order (say which); C) you name a default per slot.

**N-CAT-21 · P3 · Relates to: LIB-19**
**Question.** The anterior oblique chops and Pallof holds (17 items) are in the library, but no slot reads them. Where should they go: the 'Core' slot, the warm-up, or paired with push or pull days? What do 'INTEGRATED WITH PUSH & LEGS' and 'INTEGRATIONS LEGS & DELTS' mean?
- **We assume:** they fill the 'Core' slot as anti-rotation work (INFERRED).
- **Options:** A) core slot; B) warm-up; C) paired with push/pull; D) a new slot.

### 2.2 Volume and dosing

**N-VOL-01 · P1 · Relates to: VOL-01, VOL-04**
**Question.** Your 15-20 sets per muscle per week: is that where a client starts in week 1, or where the block ends (the peak week)? (VOL-01 asks for starting numbers by level; this asks what your 15-20 itself means.)
- **We assume:** it is the end-of-block target. Week 1 starts lower and climbs (for example quads 13 → 16 for an intermediate over 8 weeks) (INFERRED, `03_volume_dosing.md` 9.3).
- **Why it matters:** this choice changes every weekly set number in every plan by 15-30 %.
- **Options:** A) week-1 target; B) end-of-block target; C) start around 15 and finish near 20.

**N-VOL-02 · P1 · Relates to: VOL-04, VOL-07**
**Question.** In your chest example (20 sets → 22 sets) you said "let's say I keep the load the same". Is that a rule: an exercise that gets an extra set keeps its weight that week?
- **We assume:** yes. An exercise that gains a set keeps its load; exercises with no new set progress by reps or load (INFERRED, `11_training_variables.md` 3.6).
- **Why it matters:** it decides what the plan tells the client to do with the weight each week.
- **Options:** A) rule; B) just an example; C) rule for big lifts only.

**N-VOL-03 · P1 · Relates to: VOL-06, VOL-04**
**Question.** Is "+2 sets at about 20 sets, then a hold week" your normal step? At 10-14 sets would you add 1 set at a time?
- **We assume:** add 10 % of the current sets once enough has built up: +1 set below 15 sets, +2 sets from 15 sets, with hold weeks between (INFERRED).
- **Why it matters:** it sets how often a client sees a jump in sets.
- **Options:** A) as assumed; B) always +1; C) +2 every second week; D) your own step.

**N-VOL-04 · P1 · Relates to: VOL-04, VOL-02**
**Question.** Does the 3/5/7 % weekly ramp apply to every muscle, or only to the muscle a client wants to grow, with the others held steady?
- **We assume:** every muscle ramps at its size rate; the focus muscle ramps faster (INFERRED).
- **Why it matters:** if every muscle ramps, total weekly sets rise by 30-60 % over a 12-week plan. If only the focus muscle ramps, total volume barely changes.
- **Options:** A) every muscle; B) only focus muscles; C) every muscle until 15-20, then only focus muscles.

**N-VOL-05 · P1 · Relates to: VOL-02, VOL-18**
**Question.** What is the most weekly sets a muscle should get when it is not a priority? Your 12-week aesthetics track peaks at 32-35 sets for quads, glutes, back and triceps in week 12. Is that a planned overreach?
- **We assume:** caps by level: big lower body 20-24, chest and back 18-22, small muscles 14-18, rear delts and abs 10-14; a one-week overreach to ~30-35 only in the peak week of the 12-week aesthetics product (INFERRED, `03_volume_dosing.md` 9.7).
- **Why it matters:** caps stop the ramp from running away and decide when a deload is needed.
- **Options:** A) as assumed; B) 20 for everything that is not a focus; C) your numbers.

**N-VOL-06 · P2 · Relates to: VOL-08**
**Question.** Limits inside one session: at most about 10 sets for one muscle per session? At most 5 sets on one exercise (4 in fat loss, 7 on a strength main lift)?
- **We assume:** yes to both (INFERRED from your maxima, `03_volume_dosing.md` 9.7).
- **Why it matters:** when weekly sets rise, the generator must spread them over the week instead of piling them into one day.
- **Options:** A) yes; B) other numbers.

**N-VOL-07 · P2 · Relates to: VOL-17**
**Question.** Calves, rear delts and abs sit at 0-3 direct sets a week in most of your programs. Should every plan carry a minimum (for example calves 4-6, rear delts 4, abs 4-6), even when they are not a priority?
- **We assume:** yes, small floors (INFERRED).
- **Options:** A) yes, floors as assumed; B) only when the client picks them; C) no floors.

**N-VOL-08 · P2 · Relates to: VOL-10**
**Question.** If plyos, throws, cuts and Olympic lifts do not count as muscle sets (VOL-10), should they still reduce how much leg lifting an athlete gets? For example, each high-intensity jump or Olympic set costs half a leg set from a weekly leg budget.
- **We assume:** yes, half a set each (INFERRED, `03_volume_dosing.md` 9.7).
- **Why it matters:** without it, a basketball player gets full leg volume on top of the most plyos.
- **Options:** A) yes; B) no, they are separate; C) a different cost.

**N-VOL-09 · P2 · Relates to: VOL-13, ORD-07**
**Question.** Your strength track puts 'MAX' on pull-ups, DB rows and alternating incline DB bench, and 'ALL' on rear-foot-elevated lunges and staggered-stance deadlifts. So may compound accessories (bodyweight or DB, late in the session) go to failure, not only isolation work?
- **We assume:** yes, but only on bodyweight/DB accessories in the last two slots, never on barbell main lifts (INFERRED).
- **Options:** A) yes as assumed; B) isolation and machines only; C) any last-slot exercise.

**N-VOL-10 · P1 · Relates to: PER-09, ATH-10**
**Question.** Olympic lift reps. JUSTICE LEAGUE writes 'Power Clean' as 2 sets of '6 to 8 Reps'; BASEBALL writes hang cleans at '@ 75%' 4 × 8 up to '@ 90%' 4 × 4. Research stops Olympic sets at 1-5 reps, when the bar slows. Do you want 6-8 reps per set? And is the % of a true 1-rep max or of a training max?
- **We assume:** 2-5 reps per set, stop when the bar slows; % of a training max about 90 % of the true max (INFERRED + SCIENCE, `07_science_lineage.md` T6).
- **Why it matters:** it is a safety and quality question for every athlete who gets Olympic lifts.
- **Options:** A) keep 6-8; B) 2-5 and stop when slow; C) 6-8 for pulls only, 2-5 with a catch.

**N-VOL-11 · P2 · Relates to: VOL-13, EQ-12**
**Question.** On speed days, your conjugate sheets label the fast lifts '1RIR' while STRENGTH-12 says 'FAST RPE6 or about 60-70%'. Which is right? Should a speed set stop at the first slower rep?
- **We assume:** 'FAST RPE6 or about 60-70%' and stop at the first slower rep (INFERRED).
- **Options:** A) RPE 6 and stop when slower; B) 1 RIR; C) other.

**N-VOL-12 · P2 · Relates to: VOL-11, VOL-12**
**Question.** In your strength track most isolations are '3x8' (leg extension, leg curl, side raises, curls, flies, JM press; only 'TATE PRESS' is '3x20'), and in push/pull/legs side raises go 3 × 15 → 4 × 8 as clients advance. So is "small muscles = high reps" a default for muscle-building clients that changes for strength clients and higher levels?
- **We assume:** yes (INFERRED).
- **Options:** A) yes; B) high reps always; C) depends on the exercise.

**N-VOL-13 · P2 · Relates to: EQ-02, EQ-09, UNI-05**
**Question.** For home clients whose weights cannot go up: progress reps first, then a slow lowering ('slow eccentric deficit Lunges (no weigths)'), then a deficit or longer range, then sets, and load last?
- **We assume:** yes, in that order (INFERRED from your BASEBALL cell + SCIENCE).
- **Options:** A) yes; B) another order.

**N-VOL-14 · P2 · Relates to: VOL-04, GEN-05**
**Question.** When a client reaches the top of the rep range at the right effort, how much weight do you add? We assume +2.5-5 kg on barbell lower-body lifts, +1-2.5 kg on upper-body lifts, the next dumbbell pair, the next machine plate, and reps go back to the bottom of the range.
- **We assume:** as written (INFERRED + SCIENCE).
- **Options:** A) yes; B) your increments.

### 2.3 Athletes and sports

**N-ATH-01 · P1 · Relates to: GEN-01, GEN-02, ATH-02**
**Question.** Which sports must the first version support? We drafted 27 profiles: baseball, softball, basketball, volleyball, American football (skill, big skill, linemen), soccer, ice hockey, tennis, golf, track sprint, distance running, boxing, kickboxing/Muay Thai, karate/taekwondo, MMA, wrestling, BJJ, CrossFit, hybrid, powerlifting, bodybuilding, fat loss, general population, youth athlete and a generic athlete.
- **We assume:** all 27 at launch, with "generic athlete" for any other sport (INFERRED).
- **Why it matters:** only 8 profiles rest on your own programs; the other 19 are our guesses and each needs your sign-off.
- **Options:** A) all 27; B) the 8 you have written for + generic athlete; C) your list.

**N-ATH-02 · P1 · Relates to: ATH-01, ATH-02**
**Question.** Your boxing build-up (weeks 3-8) has about 113-129 high-intensity and 142-177 low-amplitude jump contacts a week, plus jump rope. For a boxer, is that typical, the most you would give, or a lot?
- **We assume:** typical for an off-season boxer (INFERRED). Our whole sport ladder (basketball highest, then MMA, then boxing and karate) is anchored on this one program.
- **Why it matters:** if it is "a lot", every sport's jump numbers move down one step.
- **Options:** A) typical; B) the ceiling; C) a lot; D) low.

**N-ATH-03 · withdrawn.** It repeated page question ATH-02 (sport ranking). The team's numeric ladder now goes into ATH-02's assumption text instead (section 3).

**N-ATH-04 · P1 · Relates to: LIB-21, ATH-06**
**Question.** BYOP has no sprint slot; sprinting appears only as ' Max velocity running (top speed)' inside PLYOS ADVANCED. Should football, soccer, basketball, baseball and track athletes get a sprint or acceleration slot? Where in the session (with the plyos?), and dosed how (metres or reps)?
- **We assume:** yes, for field and court sports, right after the plyos, in metres at full speed with full rest (INFERRED).
- **Options:** A) yes for all field/court sports; B) only some sports; C) no, sprinting stays in practice.

**N-ATH-05 · P1 · Relates to: ATH-06**
**Question.** Every BYOP athletic day has a 'COD' slot, but none of your written athlete programs (the athletic levels, boxing, baseball) has any change-of-direction work. Should the generator keep COD in every athletic plan, only off-season, or leave it to sport practice?
- **We assume:** keep it off-season and pre-season, drop it in-season when the sport has cutting (INFERRED).
- **Options:** A) always; B) off-season only; C) leave to practice; D) by sport.

**N-ATH-06 · P2 · Relates to: ATH-06**
**Question.** 'AGILITYCOD PATTERNS' separates 'COD: Proactive in nature - Cognitive Competence' from 'Agility: Reactive in nature - Incognitive Competence', and lists empty headings 'HOPS IN PLACE', 'KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION'. Should plans include reactive agility drills? What are the Krumrie and Munoz formations?
- **We assume:** pre-planned COD first; reactive drills only for advanced court and combat athletes, coached live (INFERRED).
- **Options:** free answer.

**N-ATH-07 · P1 · Relates to: PER-08, UNI-10**
**Question.** In season, games and practice already give an athlete jumps, sprints and cuts. For game-heavy sports (basketball, volleyball, soccer, football, hockey), should the gym plan subtract them: fewer gym jumps, fewer sprints, no COD? (PER-08 asks how many in-season lifting days; this asks what happens to the athletic work.) Your BASEBALL Block 3 (read as in-season from its dates, INFERRED) keeps about 135 high-amplitude contacts a week, more than Block 1 (about 103).
- **We assume:** gym jumps cut to a third or a half because games supply them; one fast sprint exposure kept each week to protect the hamstrings; no COD (INFERRED).
- **Options:** A) as assumed; B) no subtraction, same as baseball; C) the client logs practice and the plan adjusts each week; D) your rule.

**N-ATH-08 · P2 · Relates to: PER-08**
**Question.** In-season you keep 4 × 8-10 with no main lift under 8 reps. Research says heavy, short work (one heavy set or two per pattern) keeps strength best in season. Keep yours, or go heavier and shorter?
- **We assume:** your 4 × 8-10 (OBSERVED BASEBALL Block 3), with heavier as an option.
- **Options:** A) keep 4 × 8-10; B) heavier and shorter; C) by sport.

**N-ATH-09 · P2 · Relates to: ATH-04, PER-08**
**Question.** Your boxing build-up ends with a peak in week 8 (dark red) and nothing after it. What follows: a fight camp, a deload, a test? How long is a camp, and how many days before a fight does the taper start?
- **We assume:** fight camp of 6-8 weeks with 2-3 lifting days, last 7-10 days tapered (INFERRED; no camp in the sheets).
- **Options:** free answer.

**N-ATH-10 · P2 · Relates to: ATH-04**
**Question.** Boxing weeks 3-8 drop bench pressing, pull-ups and arm isolation. Should MMA fighters keep pulling (rows and pull-ups) for grappling while dropping pressing like a boxer?
- **We assume:** MMA keeps both pulls, drops heavy pressing (INFERRED).
- **Options:** A) yes; B) MMA like boxing; C) MMA keeps everything.

**N-ATH-11 · P2 · Relates to: GEN-02, ATH-08**
**Question.** Are these the right position choices for the form: basketball guard / big; volleyball hitter / setter / libero; football skill / big skill / lineman / quarterback / specialist; soccer outfield / goalkeeper; hockey skater / goalie; baseball position / pitcher / catcher; softball pitcher?
- **We assume:** yes (INFERRED).
- **Options:** A) yes; B) fewer; C) different splits.

**N-ATH-12 · withdrawn.** Merged into N-IN-06 (how the form asks about the season), which now offers "a default calendar per sport" as an option.

**N-ATH-13 · P2 · Relates to: ATH-02, ATH-11**
**Question.** Golf, tennis and hockey: build them on your BASEBALL template (upper and lower ballistics on alternate days, core by plane) or on the BYOP athletic 4-day template?
- **We assume:** BASEBALL-style for golf and tennis; BYOP athletic for hockey (INFERRED).
- **Options:** free answer.

**N-ATH-14 · P2 · Relates to: CAT-02, LIB-19**
**Question.** Your library has no neck or grip exercises. Should wrestlers, BJJ players, MMA fighters, football players and hockey players get neck work (and grip work) every week?
- **We assume:** yes, 2 short neck sessions a week, holds first (INFERRED + SCIENCE).
- **Options:** A) yes; B) no; C) only some sports.

**N-ATH-15 · P2 · Relates to: ATH-08**
**Question.** For throwers (baseball, softball, volleyball, tennis, quarterbacks): rear-delt and rotator-cuff work twice a week, arm care like your Block 1 'wk 8' ('Kettlebell arm bars', 'Half kneeling shoulder roll'), and a limit on hanging pull-ups?
- **We assume:** yes to all three (INFERRED).
- **Options:** yes or no per item.

**N-ATH-16 · P2 · Relates to: ATH-09**
**Question.** For female athletes in landing and cutting sports (basketball, soccer, volleyball): should the first landing block ('TAKING IN FORCES', stick the landing) last longer, and should 'HARD TURN' cuts wait until landings are clean? (ATH-09 asks whether there are any different rules for women; this asks about one specific safety default.)
- **We assume:** yes, as a default the coach can switch off (INFERRED + SCIENCE).
- **Options:** A) yes; B) no, same plan; C) for everyone, not only women.

**N-ATH-17 · P2 · Relates to: ATH-09**
**Question.** For youth athletes, should the form ask about the growth spurt (before / during / after), with fewer depth jumps and foundational lists only during the spurt?
- **We assume:** yes (INFERRED + SCIENCE).
- **Options:** A) yes; B) age only; C) no youth plans.

**N-ATH-18 · P2 · Relates to: ATH-09, EQ-03**
**Question.** For older clients, should power work start as fast pushes on machines (about 40-60 % of max) before any jumps or throws?
- **We assume:** yes (INFERRED + SCIENCE).
- **Options:** A) yes; B) light medball throws first; C) no power work.

**N-ATH-19 · P2 · Relates to: ATH-07**
**Question.** Which sports use 'LACTATE CLERANCE' work (MMA, hockey, 400 m)? Do baseball and football get only short blue (A) conditioning?
- **We assume:** lactate clearance for MMA, kickboxing, wrestling, hockey and 400 m; baseball and football mostly A (INFERRED).
- **Options:** free answer.

**N-ATH-20 · P2 · Relates to: ATH-11, CAT-08**
**Question.** BASEBALL rotates the core plane by day: 'LATERAL CORE' Monday, 'Transverse core' Tuesday and Friday, 'Sagital core' Thursday. Should every athlete do this, with more rotation for rotational sports and more side-to-side for skating and cutting sports?
- **We assume:** yes (INFERRED).
- **Options:** A) every athlete; B) rotational sports only; C) no fixed rotation.

### 2.4 Session structure

**N-SES-01 · P1 · Relates to: ATH-11, ORD-03**
**Question.** In athlete sessions, does core come before or after the Olympic / triple-extension lift? In BASEBALL, Part B core sits above the 'OPTIONAL PIECE' 'OLY' row every time, and the athletic examples put core drills before the cleans. Two of our files put core after the Olympic lift.
- **We assume:** core first, then the Olympic lift (OBSERVED in BASEBALL and the athletic examples; `05_session_architecture.md` section 0).
- **Why it matters:** it fixes the order of every athletic session.
- **Options:** A) core before the Olympic lift; B) after; C) core at the end.

**N-SES-02 · P1 · Relates to: UNI-11, ORD-06**
**Question.** In 20 of 23 template days, the horizontal pull goes with knee-dominant work and the horizontal push goes with hip-dominant work. Is "knee + pull, hip + push" a rule? Your RESISTANCE PATTERNS tab lays knee-dominant next to the pushes, the opposite.
- **We assume:** it is a rule; the tab layout is only layout (INFERRED).
- **Options:** A) rule; B) habit, either is fine; C) the opposite pairing.

**N-SES-03 · P2 · Relates to: UNI-11**
**Question.** BYOP gives the knee day both pulls (row + pull-down). BOOTCAMP 1 and the athletic examples give it a row + an overhead press. When do you want "two pulls" days and when "one pull + one push" days?
- **We assume:** two pulls for muscle-focus programs; one of each for stand-alone sessions (2-3 days a week, bootcamp, athletes) (INFERRED).
- **Options:** free answer.

**N-SES-04 · P1 · Relates to: VOL-08**
**Question.** What do you cut first for a 30- or 45-minute client?
- **We assume:** muscle-building clients lose arm and side-raise isolation first, then leg extensions, then the vertical exercise and the single-leg hinge drop to once a week. Athletes lose the second plyo slot, then COD, then isolation. Strength clients lose 'the survival', then 'the nuance' (INFERRED, partly OBSERVED in your 3-day and bootcamp cuts).
- **Why it matters:** many self-serve clients will choose short sessions.
- **Options:** A) as assumed; B) supersets first, cut nothing; C) your order.

**N-SES-05 · P2 · Relates to: VOL-08**
**Question.** For 75- and 90-minute sessions, what do you add: a Focus slot, core, a short sprint finisher ('Buy out'), the Olympic piece, or more sets of the same lifts?
- **We assume:** other qualities first (Focus, core, buy-out, Olympic piece), not more sets of the same lift (INFERRED).
- **Options:** free answer.

**N-SES-06 · P1 · Relates to: ORD-10, UNI-06**
**Question.** For clients who train only 2 days a week: should each session be a complete full body (squat + hinge + push + pull every time), like BOOTCAMP OPTION 1?
- **We assume:** yes (INFERRED).
- **Options:** A) yes; B) two different focus days; C) don't offer 2 days.

**N-SES-07 · P2 · Relates to: ORD-10, PRG-02**
**Question.** For 5- and 6-day muscle-building clients: 4 main days plus your optional days, or push/pull/legs twice? From what level?
- **We assume:** 4 main days + optional days for most; push/pull/legs twice for advanced clients (INFERRED).
- **Options:** free answer.

**N-SES-08 · P2 · Relates to: ORD-09**
**Question.** BASEBALL ends sessions with 1-3 short all-out 'Buy out' bouts ('SPEED POWER' '10-39 Secs'), and none in the deload. Should every athlete session of 60 minutes or more end that way?
- **We assume:** yes, off-season and pre-season; shorter in-season; never in deloads (INFERRED).
- **Options:** A) yes; B) only baseball-type sports; C) no.

**N-SES-09 · P2 · Relates to: ORD-09, PRG-03**
**Question.** Your conditioning sits first (boxing, HYBRID), last (BASEBALL buy-outs) or in the middle (BOOTCAMP 2). What is the general rule? Is hard interval work ever allowed before plyos or heavy lifting?
- **We assume:** easy aerobic may go first for fighters; hard intervals always last or on another day; never before plyos or heavy lifts (INFERRED + SCIENCE).
- **Options:** free answer.

**N-SES-10 · P2 · Relates to: ORD-01, LIB-16**
**Question.** FAT BURN weeks 2-3 and AESTHETICS-8 weeks 2, 3, 6 and 7 have no overhead press: 'UPRIGHT ROWS' or 'SIDE RAISES' fill that spot, and the MM push/pull/legs and STRENGTH-12 never press overhead. Is overhead pressing optional for physique and fat-loss clients?
- **We assume:** optional; side raises or upright rows can replace it (INFERRED).
- **Options:** A) optional; B) always include one overhead press a week; C) depends on the client.

**N-SES-11 · P2 · Relates to: ORD-07, PER-09**
**Question.** Strength clients: is Monday max-effort lower / Wednesday max-effort upper / Thursday speed lower / Saturday speed upper your fixed layout? For 2-3 strength days, may squat and deadlift share a day? Should non-powerlifters get an overhead press (STRENGTH-12 has none)?
- **We assume:** that layout for 4 days; squat and deadlift may share a day at 2-3 days; add an overhead press for non-powerlifters (INFERRED).
- **Options:** yes or no per item.

**N-SES-12 · P2 · Relates to: ATH-05, ORD-03**
**Question.** BASEBALL splits athletic work by day: upper-body throws Monday and Thursday, lower-body jumps Tuesday and Friday. Should the generator do this whenever athletic volume is high?
- **We assume:** yes (INFERRED from BASEBALL Part A).
- **Options:** A) yes; B) both every day; C) by sport.

**N-SES-13 · P2 · Relates to: ORD-08**
**Question.** Your ballistics tab holds a 'DYNAMIC MEDBALL WARMUP DRILLS' list (35 drills) that no program or slot uses. Should it become the athletes' warm-up, before the plyos and throws? (ORD-08 asks about the general warm-up: cardio, A-drills, mobility.)
- **We assume:** yes, 4-6 drills from the list on athletic days (INFERRED).
- **Options:** A) yes, on athletic days; B) only before throwing days; C) no, it was a reference list.

**N-SES-14 · P2 · Relates to: ORD-08, VOL-16**
**Question.** None of your sheets writes warm-up (ramp-up) sets before a heavy lift. Should the plan show them (for example 2-3 lighter sets before the first working set of the main lift)?
- **We assume:** yes, on the first big lift of each session only, not counted as working sets (INFERRED).
- **Options:** A) yes; B) no, the client knows; C) only for beginners.

**N-SES-15 · P3 · Relates to: ORD-10, PRG-02**
**Question.** When you cut AESTHETICS from 4 days to the 3 DAY BUILDER, 'Leg Curls' stays while leg extensions, arms and side raises go, and the vertical push/pull and single-leg hinge drop to once a week while the lunge stays twice. What is the rule behind it, so we can apply it to any shortened plan?
- **We assume:** keep the isolation no compound covers (knee flexion); keep the lunge because it is the main single-leg pattern (INFERRED).
- **Options:** free answer.

### 2.5 Periodization

**N-PER-01 · P1 · Relates to: PER-01, PER-02, PER-07**
**Question.** What happens when a plan ends and the client buys the next one? Does the next plan start with a deload week, a test week, or straight into week 1? Does it keep the same exercises and change one small variable per slot, as you described for blocks, or start a new menu? (PER-01 asks the shape inside one plan; this asks how plans connect.)
- **We assume:** a plan that ends on its peak is followed by a deload week at the start of the next plan; the next plan keeps the slot skeleton and changes one small variable per slot (INFERRED).
- **Why it matters:** clients will run several plans in a row.
- **Options:** free answer.

**N-PER-02 · P2 · Relates to: PER-05**
**Question.** Your FAT BURN example runs 4 weeks with no deload and ends at its peak. For 8- and 12-week fat-loss plans, should there be a deload, or just a new 4-week block with new variations?
- **We assume:** a lighter week at the end of each 4-week block from the second block on (INFERRED).
- **Options:** A) deload; B) new block, no deload; C) your rule.

**N-PER-03 · P2 · Relates to: PER-05, GEN-05**
**Question.** Should the client's log trigger an early deload? Our draft: EFFORT 9-10 on about a third of logged sets two weeks in a row, or 'Felt a PAIN' on 2 or more exercises in one week, or weights dropping on 3 or more main lifts.
- **We assume:** yes, with those triggers (INFERRED).
- **Options:** A) yes; B) planned deloads only; C) other triggers.

**N-PER-04 · P2 · Relates to: ATH-07**
**Question.** Your aerobic levels unlock colours: 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE'. Can a client move up a colour level within one 12-week plan, or only between plans?
- **We assume:** one level up per 12-week plan at most (INFERRED).
- **Options:** A) within a plan; B) between plans; C) by test result.

**N-PER-05 · P2 · Relates to: PER-01, PER-11**
**Question.** Your CrossFit year runs 'RESISTANCE' → 'STRENGTH' → 'POWER' → 'TEST/PEAK'. Should a 12-week plan for a general or muscle-building client also move through qualities (higher reps early, heavier later), or stay in one quality the whole time?
- **We assume:** one quality, with rep waves inside (INFERRED).
- **Options:** A) one quality; B) move through qualities; C) by goal.

**N-PER-06 · P2 · Relates to: PER-02, VOL-11**
**Question.** In AESTHETICS-8, main-lift reps fall 12 → 10 → 8 inside each 3-week wave. Should every muscle-building plan use these rep waves, or keep one rep range and add reps then weight (double progression)?
- **We assume:** rep waves for the main lifts, double progression for everything else (INFERRED).
- **Options:** A) rep waves; B) double progression; C) both as assumed.

**N-PER-07 · P1 · Relates to: PER-08, N-IN-06**
**Question.** If an athlete's season starts in 5 weeks and they ask for an 8-week plan, what should happen?
- **We assume:** the generator shortens to the weeks left, makes the last 1-2 weeks a taper and warns the client (INFERRED).
- **Options:** A) as assumed; B) refuse and offer the right length; C) start in-season mode at the season date.

**N-PER-08 · P3 · Relates to: PER-09**
**Question.** STRENGTH-12 writes % only for weeks 1-6 (80, 80, 85, 85, 90, 90). Should weeks 8-12 follow RPE only, or about 85, 90, 90, 92.5, 95 %?
- **We assume:** RPE only (INFERRED).
- **Options:** A) RPE only; B) the % as written; C) your numbers.

### 2.6 Intake form and inputs

(Field-by-field design is in `09_generator_inputs.md`. These are the decisions only the coach can make.)

**N-IN-01 · P1 · Relates to: CAT-06, PRG-05, VOL-01, GEN-02**
**Question.** How should the form place a client in a level? Years of training, a few simple tests (push-ups, pull-ups, a goblet squat), a self-rating, or your review?
- **We assume:** years of consistent training (under 1, 1-3, 3-5, 5+) adjusted by a short ability checklist; athletes who compete get the top level (INFERRED).
- **Why it matters:** level sets every start volume, cap and rep range.
- **Options:** A) years only; B) years + checklist; C) self-rating; D) you review each client.

**N-IN-02 · P1 · Relates to: PRG-05**
**Question.** Your gym examples stop at 'INTERMEDIATE'. Should the generator add a fourth client level above it for competitive athletes and very experienced lifters, like your CrossFit 'LVL 4'? (PRG-05 asks which of NOVICE / NEWBY is lower and whether to rename them; this asks whether a top level exists.)
- **We assume:** yes, a fourth level with higher caps for muscle clients and the lowest volume / highest intensity for athletes (INFERRED, `03_volume_dosing.md` 9.2).
- **Options:** A) three levels only; B) add a fourth level.

**N-IN-03 · P1 · Relates to: CAT-05, CAT-06, PER-06, ATH-10**
**Question.** Since client level and exercise level are separate (CAT-06), should the form ask a few "can you do it?" questions to pick the exercise level per slot? For example: how many strict pull-ups, how many push-ups, can you land a jump softly, have you been coached in the Olympic lifts, are you comfortable back squatting with a barbell, can you sprint without pain.
- **We assume:** yes, 6 quick questions (INFERRED).
- **Why it matters:** without them a beginner may be offered strict pull-ups or depth jumps.
- **Options:** A) yes; B) no, start everyone foundational and move up from the log; C) your questions.

**N-IN-04 · P1 · Relates to: GEN-01, VOL-03**
**Question.** Should the form start with a short health check (for example: chest pain or heart problems, surgery in the last 6 months, pregnancy or recent birth, a diagnosed injury under treatment)? Any "yes" would send the client to you before a plan is made.
- **We assume:** yes. This is a product safety suggestion, not a coaching rule (INFERRED).
- **Options:** A) yes; B) a waiver only; C) your own screen.

**N-IN-05 · P1 · Relates to: VOL-03, UNI-08**
**Question.** How detailed should the pain question be? Our draft: body area (neck, shoulder, elbow, wrist/hand, upper back, lower back, hip/groin, knee, ankle/foot, other), side, how bad (mild / moderate / severe), and what makes it worse (overhead, deep knee bend, impact/jumping, twisting, bending forward).
- **We assume:** that draft; "severe" sends the client to you (INFERRED).
- **Why it matters:** your pain rule (split grips, going unilateral, machines) needs to know which area and which movements.
- **Options:** A) as drafted; B) area only; C) area + severity.

**N-IN-06 · P1 · Relates to: PER-08, ATH-07, PRG-09**
**Question.** For athletes: should the form ask the season phase directly (off-season, pre-season, in-season, post-season), or the dates (next season start or competition date) plus weekly practice load (sessions, hours, game days)? Or should each sport follow a default calendar, like one of your four baseball calendars (high school, fall ball, pro, pro weekly with 'PEAK' / 'DELOAD')? (PRG-09 asks which baseball calendar is for whom; this asks how the form should handle seasons for every sport.)
- **We assume:** dates + practice load; the generator works out the phase (INFERRED).
- **Options:** A) phase picker; B) dates + practice load; C) a default calendar per sport, adjusted by the client's dates.

**N-IN-07 · P2 · Relates to: ORD-10, PRG-02**
**Question.** Should clients pick which weekdays they train, or should the generator place them (your A, B, optional, A, B, optional, off pattern)?
- **We assume:** the client picks available days; the generator places hard days at least 48 hours apart (INFERRED).
- **Options:** A) client picks; B) fixed pattern; C) both.

**N-IN-08 · P2 · Relates to: GEN-02, VOL-12**
**Question.** Can a client have two goals (an athlete who also wants size; fat loss plus strength)? If so, which goal sets the template and which only tweaks it?
- **We assume:** one main goal + an optional second goal that adds Focus sets or a conditioning slot (INFERRED).
- **Options:** A) one goal only; B) main + second goal; C) free mix.

**N-IN-09 · P2 · Relates to: EQ-06, EQ-15, ATH-09**
**Question.** Should the form ask body weight and sex? We would use them only for medball weight (lighter for smaller clients), loaded jumps (a share of body weight) and the landing block for female athletes in cutting sports.
- **We assume:** optional fields, with "prefer not to say" (INFERRED).
- **Options:** A) ask both; B) body weight only; C) neither.

**N-IN-10 · P2 · Relates to: PER-09, EQ-12**
**Question.** Some of your lifts are written in % ('@ 75%', 80-90 %, '78% of 1RM', bands 'around 50%'). Should the form ask for known maxes or recent best sets, or should clients find their weights by effort (RIR) only?
- **We assume:** optional "best recent set" for squat, bench, deadlift and power clean; otherwise effort only (INFERRED).
- **Options:** A) ask maxes; B) effort only; C) a test in week 1.

**N-IN-11 · P2 · Relates to: EQ-10, EQ-14**
**Question.** Can clients exclude exercises they cannot or will not do (for example "no running", "no lunges", "no barbell")?
- **We assume:** yes; the slot keeps its pattern and the generator picks another exercise from the same category (INFERRED).
- **Options:** A) yes; B) no; C) yes, but you review.

**N-IN-12 · P2 · Relates to: EQ-01, EQ-02, EQ-16**
**Question.** For home clients, which equipment details do you want asked: heaviest dumbbell pair, medball weights owned, box or step height, space to sprint (10-20 m or 40-60 m), bands, pull-up bar?
- **We assume:** all six; each one opens or closes specific slots (INFERRED, `10_equipment_model.md` 3.2).
- **Options:** keep or drop each.

**N-IN-13 · P2 · Relates to: EQ-01, EQ-11**
**Question.** For gym clients, should the form ask which machines the gym has (leg press, pendulum, hack squat, leg extension, leg curl seated or lying, lat pull-down, assisted pull-up, row, chest press, cables, Smith, GHD)? It is a long list.
- **We assume:** yes, as one tick-list, because you rank leg machines (INFERRED).
- **Options:** A) full list; B) leg machines only; C) no list, assume a normal gym.

**N-IN-14 · P2 · Relates to: ATH-09**
**Question.** At what age do youth rules apply, and at what age do older-adult rules start?
- **We assume:** youth under 15; older-adult rules from 65, or from 60 if the client reports low fitness (INFERRED).
- **Options:** your ages.

**N-IN-15 · P2 · Relates to: PER-02, N-PER-01**
**Question.** For returning clients, should the form ask for (or link to) their last plan, so the new plan changes only one small variable per slot?
- **We assume:** yes, via the client's previous plan ID (INFERRED).
- **Options:** A) yes; B) start fresh each time.

### 2.7 Output format

**N-OUT-01 · P1 · Relates to: GEN-03**
**Question.** Your REPS menu runs '4 to 6 Reps' … '20 Reps' and 'MYO SET'. The plans also need '1 to 3', '3 to 5', '25 to 30', per side ('10/10'), seconds, metres, jump contacts, throws, calories and rounds. Add these to the menu, in your style?
- **We assume:** yes, written like yours ('1 to 3 Reps', '10/10 Reps', '20 Sec', '30 m', '20 Contacts') (INFERRED).
- **Options:** A) yes; B) only some (name them).

**N-OUT-02 · P1 · Relates to: GEN-03, VOL-13**
**Question.** How should the plan tell a client what weight to use? Effort words only (your 'leave 1 rep in the tank' style), % for barbell main lifts, or also a first-week tip ("pick a weight you could lift 2-3 more times")?
- **We assume:** effort (RIR) for everything, % only for Olympic and strength main lifts, plus a week-1 tip (INFERRED).
- **Options:** A) as assumed; B) effort only; C) % wherever possible.

**N-OUT-03 · P2 · Relates to: VOL-14, GEN-07**
**Question.** BYOP rows have no rest or tempo column. Should each row show the rest time, and a tempo note where it matters (for example "slow down, fast up")? (GEN-07 already asks about coaching cues.)
- **We assume:** rest on every row; tempo only on rows where it changes the exercise (slow eccentrics, pauses, speed work) (INFERRED).
- **Options:** keep or drop each.

**N-OUT-04 · P2 · Relates to: GEN-03**
**Question.** Should clients see a weekly summary: sets per muscle, jump contacts, throws, conditioning colours?
- **We assume:** yes, as a small table at the top of each week (INFERRED).
- **Options:** A) yes; B) coach view only; C) no.

**N-OUT-05 · P2 · Relates to: GEN-03**
**Question.** One sheet tab per week, or one tab with week columns? (JUSTICE LEAGUE has a 'WEEK' column with only 'WEEK 1' built; the merged A64:A70 looks like the start of week 2.)
- **We assume:** one tab with all weeks stacked, like JUSTICE LEAGUE, plus a phone view (INFERRED).
- **Options:** A) one tab per week; B) one tab, weeks stacked; C) one tab, weeks side by side.

**N-OUT-06 · P2 · Relates to: GEN-03, FIX-04**
**Question.** Should plans show your colour codes: green / yellow / red for level, blue (A) / green (B) / orange (C) for conditioning, red shades for harder weeks?
- **We assume:** yes (INFERRED).
- **Options:** A) yes; B) no; C) some (name them).

**N-OUT-07 · P2 · Relates to: PRG-08, GEN-03**
**Question.** In JUSTICE LEAGUE the 'WEIGHT USED or SCORE' column also holds cues ('LATERAL', 'SINGLE ARM', 'OUCH'). Should plans get a separate 'NOTES' column so weights and notes don't mix?
- **We assume:** yes (INFERRED).
- **Options:** A) yes; B) no.

**N-OUT-08 · P2 · Relates to: GEN-07**
**Question.** Should the plan explain "why" in short lines (for example "rows before pull-downs: house rule", "this week adds 2 chest sets", "deload week: same exercises, fewer sets")?
- **We assume:** yes, one short line per week and per rule change (INFERRED).
- **Options:** A) yes; B) no; C) only in the coach view.

**N-OUT-09 · P2 · Relates to: GEN-06**
**Question.** Only 81 of the 322 selectable library exercises (25 %) have one of your video links. For the rest: record new videos, link public videos, or use a text cue only?
- **We assume:** your video where it exists, a text cue otherwise, and a "missing video" list for you (INFERRED; the 25 % is computed from the catalog).
- **Options:** A) record new; B) public videos; C) text only; D) a mix.

**N-OUT-10 · P3 · Relates to: GEN-01, GEN-03**
**Question.** Units and language: pounds, kilograms or the client's choice? English only, or other languages too?
- **We assume:** client's choice of units; English (INFERRED).
- **Options:** free answer.

**N-OUT-11 · P2 · Relates to: GEN-01, GEN-05**
**Question.** Your example tabs end with '*****If you have any questions just ask me - IG @BLAZECAMP or TWITTER @BLAZECAMP_'. Keep that line? Should you be alerted automatically when a client logs 'Felt a PAIN' twice on the same exercise?
- **We assume:** keep the line; alert on repeated pain (INFERRED).
- **Options:** yes or no per item.

**N-OUT-12 · P1 · Relates to: GEN-01**
**Question.** To test the generator, would you either write 3-5 plans for sample clients (for example a beginner fat-loss client, an intermediate aesthetics client, an off-season basketball player, a boxer, a home client with dumbbells), or grade 5 plans the generator makes?
- **We assume:** you grade 5 generated plans (INFERRED).
- **Why it matters:** it is the only way to check that the rules really reproduce your choices.
- **Options:** A) you write sample plans; B) you grade generated plans; C) both.

**N-OUT-13 · P3 · Relates to: CAT-07**
**Question.** Each BYOP library column has a black 'FILL HERE' strip in row 2. Is that where buyers add their own exercises? Should clients be able to add their own exercise to a slot in the generated plan?
- **We assume:** yes, a free-text "my own exercise" option in each slot that keeps the slot's pattern (INFERRED).
- **Options:** A) yes; B) no.

---

## 3. Existing page questions whose "We assume" text is now stale or wrong

These are not new questions. They are page questions whose assumption text contradicts the coach's answers or the sheets. Fix the wording before the coach answers them, or the answers will be harder to read.

| Page ID | Problem with the current "We assume" text | Evidence | Suggested new assumption |
|---|---|---|---|
| VOL-05 | Still offers three size groups ("Big 3 %, medium 5 %, small 7 %"). CAT-02 confirmed only big and small. | COACH-ANSWER CAT-02 | "Big lower body (quads, glutes, hamstrings) 3 %, big upper body (chest, back) 5 %, small 7 %. Or: all big 3 %." |
| PER-05 | "About half the sets" is deeper than every deload you wrote. Your deloads land back near week-1 volume: about 25-50 % below the peak. | OBSERVED: AESTHETICS-12 wk 7 = week-1 sets; STRENGTH-12 wk 7 = 75 % of week 1; BASEBALL 'DELOAD WEEK' resistance = 76 % of block week 1 (`03_volume_dosing.md` 9.8) | "Back to about week-1 volume, same exercises, about RPE 7, no extras." |
| PER-08 | "In-season: 2 days/week" contradicts your only in-season block. | OBSERVED: BASEBALL Block 3 = 4 days, Part C/D 4 sets, 8-10 reps | "Baseball in-season keeps 4 days at 4 × 8-10. For game-heavy sports: 2-3 days?" |
| PER-01 | "6 weeks = 5 building + deload or test" disagrees with the default in 03, 06 and 11 (6 building weeks ending at the peak, next plan opens with a deload). The 8-week assumption also hides three exceptions in your sheets: the boxing build-up ends week 8 on its peak, HYBRID-8 has no deload, and the CrossFit class cycle ends with a 1RM test only. | `06_periodization.md` D1, D3; `11_training_variables.md` 3.10 | Offer both 6-week shapes, and ask "When is week 8 a peak instead of a deload?" |
| ORD-06 | "Not intentional. Should read hinge + push." But the session-architecture file reads BOOTCAMP OPTION 1's crossed pairing as deliberate, so each bootcamp session is a complete full body. | `05_session_architecture.md` section 0 and grammar G2 | "Intentional? It makes every bootcamp session a complete full body." |
| EQ-06 | Gives overhead throws 6-10 lb and sit-up throws 6-8 lb. The equipment and variables files use your chat number (8-10 lb) as the adult default for overhead, sit-up and scoop throws. | COACH-CHAT ("light, 8-10 lb"); `10_equipment_model.md` 5; `11_training_variables.md` LV-3 | "Adults 8-10 lb for passes, rotations, overhead and sit-up throws; slams 10-20 lb; lighter for youth and smaller clients?" |
| VOL-16 | "Athletic templates use 2 everywhere" rests on a partly filled tab: JUSTICE LEAGUE fills 11 of its 50 weekly slots. | `04_athlete_profiles.md` verification fix 2 | Add "(based on the 11 slots you filled in JUSTICE LEAGUE)". |
| VOL-13 | "1-3 RIR at all times, no planned RIR ramp" contradicts the periodization skeletons, which ramp RIR inside each wave (2 RIR → 1 RIR). | `06_periodization.md` 5.2 | Keep the question but say the skeletons currently ramp. |
| ATH-02 | Puts sprinters third (above football and soccer), while the team's own matrix puts sprinters a tier below football skill, soccer and MMA. It also gives no numbers. | `04_athlete_profiles.md` headline 17 and section 4 | Use the matrix ladder with its weekly high-amplitude jump contacts: basketball and volleyball ~224; football skill, soccer and MMA 168-192; baseball, boxing, hockey, tennis, kickboxing, sprinters and football big skill 101-160; karate/taekwondo, wrestling, linemen, youth and generic athletes 41-100; golf, BJJ, distance runners, strength and hybrid 1-40; physique, fat loss and general population 0. |
| ATH-06 | "Every athlete, tiered by turn angle" ignores that none of your written athlete programs contains change-of-direction work. | `04_athlete_profiles.md` headline 7 | Add the observation and ask N-ATH-05 next to it. |
| GEN-08 | "Core is never skipped" contradicts the BYOP push/pull/legs tab and the strength tracks, which have no core at all. | OBSERVED (`04_athlete_profiles.md` 2.3) | "Core in every week (not every session)?" |
| CAT-09 | Answered: knee flexion is its own segment. The 01 taxonomy still keeps leg curls under hip dominant. | COACH-ANSWER CAT-09 | Mark answered; update 01 (see C-08). |

---

## 4. Contradictions still open between the synthesis files

Each row names the files, what each says, and how to settle it. "Resolved by" points at the question that settles it, or at a coach answer that already did and only needs the stale file fixed.

| ID | Topic | What the files say | Settle by |
|---|---|---|---|
| C-01 | Weekly growth rate by muscle size | 03 and 11: big lower 3 %, big upper (chest, back) 5 %, small 7 %. 06 and 07 rule 20: large (incl. chest, back) 3 %, **medium** (delts, triceps) 5 %, small 7 %. CAT-02 has no medium group, so 11 retired 06's mapping, but 06 and 07 were not updated. | VOL-05 (with the fixed assumption text, section 3). Then update 06 and 07. |
| C-02 | When a fraction of a set becomes a real set | 03: release at 0.75 of a set. 06 and 11: at 1.0. | VOL-06. |
| C-03 | Deload size | 03: 0.85 × week 1. 06 governor: 0.6 × the previous week; 06 D5: 25-50 % below the previous week. 07 rule 22 and T8: 40-50 % fewer sets. 11: the smaller of 0.85 × week 1 and 0.75 × peak. Page PER-05: "about half". Five different rules. | PER-05; then one rule in all files. |
| C-04 | Extra volume for a focus muscle | 03: +4 to +6 sets and +2 points on the rate. 06: one rate tier up, ceiling 26. 11: one class up, cap +6. Page VOL-02: +4-6 sets, cap 25-30. | VOL-02. |
| C-05 | Ceiling for a muscle that is not a focus | 03 and 11: by size and level (big lower 20-24, chest/back 18-22, small 14-18). 06: 20 for every non-focus muscle. | N-VOL-05. |
| C-06 | Week-over-week increase limit | 03 and 11: ≤ +10 % total sets. 07 T4: ≤ +20 %. Jump contacts: 06 and 11 ≤ +10-15 %, 07 rule 11 ≤ 20 %. | N-VOL-03, N-VOL-05 (the coach's own steps are +20-50 % with flat weeks between). |
| C-07 | 6-week plan shape | 03, 06 D3 and 11 3.10: 6 building weeks ending at the peak. 06 ATHLETE_OFF_6 skeleton and 11 worked example B: 5 building + test/deload. 07 rule 21: either. Page PER-01: 5 + deload/test. | PER-01 (fixed text) and N-PER-01. |
| C-08 | Where leg curls belong | CAT-09 (coach): own leg-flexion segment. 10 and 11 follow it. 01 still says "keep leg curls under HIP", and 03 and 05 still call the bucket ISO_HAM under hip days. | Already answered (CAT-09). Rename and re-file in 01, 03 and 05. |
| C-09 | Core vs Olympic lift order in athlete sessions | 05 (after its second check): core first, then the Olympic lift (BASEBALL Part B always above 'OPTIONAL PIECE' 'OLY'). 10 intent sequence and 11 ordering algorithm: triple extension / power-strength first, core after. 10 cites the same BASEBALL evidence that contradicts its own order. | N-SES-01. |
| C-10 | Exercise variety inside a block | Coach (chat): keep the same exercises over a block, change small variables in the next block. 11 VP-1: block-fixed default. 07 T3 and rule 27: default weekly A/B or change the exercise between the two weekly exposures. 06 hypertrophy skeletons: A/B variants every week. Page PER-04 assumption: a different exercise on the second weekly exposure. | PER-02, PER-03, PER-04. 06 and 07 predate the coach's statement and should follow 11 until he answers. |
| C-11 | RIR across a block | 03: 1-2 RIR fixed. 06: 2 RIR in the first week of each wave, then 1. 07 T2: 3 → 2 → 1. Page VOL-13: 1-3 RIR at all times. | VOL-13. |
| C-12 | Aerobic sessions per week | 03 9.12: 2 at L1, 2-3 at L2, 3 at L3, 3-4 at L4. 07 rule 25: 2 at L1-L2, 3 from L3. Page ATH-07: 3 for general and fat-loss clients, 2 for athletes in season. 06: CrossFit levels 2, 2, 3, 4. | ATH-07. |
| C-13 | Medball weights | Coach chat: 8-10 lb for upper-body passes and rotations. 10 and 11: 8-10 lb adult default for overhead, sit-up and scoop; 8 lb for rotational and chest passes; slams 10-20 lb. 10b FV-6: 6-8 lb for rotational and chest passes for smaller clients. Page EQ-06: overhead 6-10, sit-up 6-8. | EQ-06 (fixed text). |
| C-14 | What STARTING / MID / ADVANCED mean | 03 9.3 uses them as client levels and turns them into multipliers (L3 × 0.9, L4 × 0.75 on athlete volume). 06 and page PRG-04 read them as three back-to-back 8-week blocks of one off-season. They cannot be both. | PRG-04; then fix 03's multipliers if they are blocks. |
| C-15 | Length of the BYOP athletic day | 03 9.10: about 75 min. 05 7.2: 60-65 min. 05 7.4 notes the difference but leaves it. | N-SES-04 and the coach's real session lengths (VOL-08). |
| C-16 | Exercise level formula | 10 1.4: level = load position minus machine/support help; skill is **not** added (the front squat stays intermediate). 11 V23: level = position − support **+ skill** (+1 for Olympic lifts, ballistic overhead lifts, hanging pulls). | N-CAT-12; pick one formula. |
| C-17 | Two level fields per exercise | 02 catalog `level.primary` keeps the library level (for example 'Leg press' ADVANCED). 10 keeps an "operative" level that overrides 20 entries (leg press FOUNDATIONAL, back squats ADVANCED, push press ADVANCED). The generator needs one field. | EQ-04, LIB-13, N-CAT-12; then write the operative level into the catalog. |
| C-18 | Front delts | 03: small muscle, 7 %, no own target. 06: medium tier, 5 %, start 12, ceiling 20. 01: small with a pattern. 11: unplaced. CAT-02 does not list them. | N-CAT-03. |
| C-19 | Bilateral share for HYBRID | 11 3.7: 100 % bilateral by sets (an artefact of missing set counts). 04 2.1: 63 % unilateral. | Use 04's item-based figure; mark 11's as an artefact. |
| C-20 | Goal names | 03 inputs: hypertrophy_aesthetics, strength, athletic_power, fat_loss, general_fitness (no hybrid). 05: aesthetics, athletic, strength, fat_loss_bootcamp, hybrid_crossfit, no_equipment (equipment as a goal). 06: HYPERTROPHY, STRENGTH, FAT_LOSS, HYBRID, GENERAL_BEGINNER (a level, not a goal), ATHLETE. 04: 27 profiles in 8 families. | One goal list in `09_generator_inputs.md` section 4. |
| C-21 | Season phase names | 03: off_season_base, off_season_power, pre_season, in_season. 04 field/court: off_early_GPP, off_build, pre_intensify, in_season, post_season_recovery; combat: base_GPP, conversion_build, fight_camp, post_fight. 06: OFF, PRE, IN, TRANSITION. | One crosswalk in `09_generator_inputs.md` section 4. |
| C-22 | Equipment profiles | 03: 3 values. 02: tiers T0-T3. 10b: P1-P5. 10: 11 profiles + add-ons. Page EQ-01: 9 options. | EQ-01; crosswalk in `09_generator_inputs.md` section 4. |
| C-23 | Number of client levels | 03: L1-L4. Page PRG-05: rename to L1/L2/L3. 10: three exercise-level ceilings (F/I/A). | N-IN-02. |
| C-24 | Days per week offered | 05: 2-6 days. 03 inputs: 3-6. | N-SES-06. |
| C-25 | Plan skeletons that don't exist | 06 has no skeleton for distance runners, youth, older adults, fight camp, or a 12-week pre-season, yet 04 has profiles for all of them and 09 must accept them. | N-ATH-09, N-ATH-17, N-ATH-18; build skeletons or map them to existing ones (09 section 4). |
| C-26 | Squirrel jumps | 04 counts them as low-amplitude (analyst choice); the coach files them as PLYOS 'ADVANCED' / 'FULL JUMPING'. 03 9.11 and 05 sport-dial tables inherit 04's choice without saying so. | N-CAT-13. |
| C-27 | COD in athlete plans | 05 and 04 templates keep a COD slot on every athletic day (BYOP); 05 cut order drops COD second because it is "absent in every MM example"; page ATH-06 assumes every athlete gets the route tree. | N-ATH-05. |

---

## 5. What the team did not read, quantify or reconcile

### 5.1 Not read, or read but never questioned

1. **Hidden status of eight MASTER MODEL tabs** (listed in section 1). The files note "(hidden)" in passing but treat the content as current. (N-CAT-01)
2. **The coach's named sources.** Pat Davidson's book (*A Coach's Guide to Optimizing Movement*, named by the coach in CAT-04) and Dr. Mike Israetel's books were not read directly. `07_science_lineage.md` relies on course reviews and summaries. So "Davidson's zones" in the model are the coach's own definition (CAT-04), not checked against the book.
3. **'Copy of BASEBALL'.** Several fact-checks skipped it. I compared it cell by cell with 'BASEBALL' in `raw/MASTER_MODEL.xlsx`: 0 value differences and 0 fill differences. Nothing was lost by skipping it.
4. **The two copy library tabs** were read ('Copy of MASTER EXERCISE LIBRARY' is the same content compacted; 'Copy of Copy of MASTER EXERCISE' is truncated at row 44 and drops 9 items). The red header fonts there were never asked. (N-CAT-19)
5. **BYOP tabs have no instruction block.** The coach's instruction lines ('*Always leave 1 rep in the tank…', '***The lower the reps, the higher the weight…', '****When there are joint pains…', '*****If you have any questions just ask me…') exist only on the MASTER MODEL examples. Generated plans need them added (GEN-07, N-OUT-11).
6. **What the client actually experiences.** No client-facing material beyond the two workbooks was available, and no client has logged anything: in every BYOP tab the 'EFFORT' and 'HOW IT FELT?' cells still read 'CHOOSE 👇' (or 'CHOSE 👇') and every 'DONE?' checkbox is unticked (False) (OBSERVED). Every feedback rule is therefore designed, not observed.

### 5.2 Not quantified

| Gap | What we know | What is missing |
|---|---|---|
| Exercise tags | 322 of 322 selectable exercises have inferred muscles, implement, skill, impact and reps (computed). | Any coach-checked tag. (N-CAT-02) |
| Coach-dosed exercises | 145 of 322 selectable exercises appear in his programs (computed). | Doses for the other 177. |
| Videos | 81 of 322 selectable exercises have a coach video link (computed); 142 of 641 exercise records overall. | Coverage plan. (N-OUT-09) |
| Sport doses | Baseball (block means 199-241 contacts/week, ~180 throws/week) and one boxer. | Coach numbers for any other sport. (ATH-01, ATH-02, N-ATH-02) |
| Session time | Never written. Modelled 50-65 min for the product days. | Real session lengths of his clients. (VOL-08) |
| Rest | Written only in the hidden 'ALL ABOUT SQUATS' tab. | Rest for supersets, complexes, plyos ('*REST AS PRESCRIBED'). (VOL-14) |
| Loads | 0 cells give a weight in lb or kg. | Starting-load guidance. (N-OUT-02) |
| Filled templates | AESTHETICS: Day 1 and part of Day 2. JUSTICE LEAGUE: 11 of 50 weekly slots. Every other BYOP template is empty ('CHOOSE 👇'). | Fully filled examples. (N-OUT-12) |
| Generator vs coach | No back-test. | Regenerate JUSTICE LEAGUE Monday, BASEBALL Block 1 week 1 and BOXING weeks 1-2 from their client inputs and compare slot by slot. (N-OUT-12) |
| Answer coverage | 9 of 140 page questions answered. | The other 131 + the new ones here. |

### 5.3 Not reconciled

- **Vocabulary drift** for goals, sports, season phases, equipment and levels (C-20 to C-23). Buckets have a crosswalk (01 group G25); goals, phases and equipment profiles do not. `09_generator_inputs.md` section 4 proposes one.
- **Files that do not apply the coach's answers** still carry retired rules: 01 (leg curls kept under hip), 06 (medium size tier, deload 0.6 × previous week, weekly A/B variants), 07 (medium tier in rule 20, weekly A/B default in rule 27), 03 and 05 (the ISO_HAM bucket on hip days). Only 10 and 11 were rebuilt on `coach_answers.md`; 11 is the one that resolves the cross-file conflicts (its section 7.2).
- **Questionnaire assumptions vs sheet evidence**: twelve page assumptions now disagree with the sheets or the answers (section 3).

---

## 6. Guess register: rules only the coach can confirm

Every rule below is INFERRED and is currently a default in at least one generator file. The last column names the question that confirms or replaces it.

| # | Rule (current default) | Where | Confirm with |
|---|---|---|---|
| G-01 | 3/5/7 % by size: big lower 3, big upper 5, small 7; applied to weekly sets per muscle | 03 9.6, 11 3.3 | VOL-04, VOL-05, N-VOL-04 |
| G-02 | 15-20 sets is the peak-week target; week 1 is back-solved | 03 9.3 | N-VOL-01 |
| G-03 | Release a set when the bank reaches 1.0; release 10 % of current sets (1-2) | 11 3.4 | VOL-06, N-VOL-03 |
| G-04 | An exercise that gains a set keeps its load that week | 11 3.6 | N-VOL-02 |
| G-05 | Caps by level and size; focus +6; per session ≤ 10 sets per muscle | 03 9.7, 11 3.8 | VOL-02, N-VOL-05, N-VOL-06 |
| G-06 | Floors: calves, rear delts, abs | 03 9.3 | N-VOL-07 |
| G-07 | Athletic sets cost 0.5 of a leg set | 03 9.7 | VOL-10, N-VOL-08 |
| G-08 | Deload = smaller of 0.85 × week 1 and 0.75 × peak, RPE 6-7 | 11 3.10 | PER-05 |
| G-09 | Early deload triggers from the log | 03 9.8, 06 D11, 11 3.10 | N-PER-03 |
| G-10 | Readiness gate: RED / AMBER / GREEN / EASY from EFFORT and 'HOW IT FELT?' | 11 3.5 | GEN-05 |
| G-11 | Double progression increments | 11 3.9 | N-VOL-14 |
| G-12 | 6-week plan = 6 building weeks ending at the peak | 06 D3, 11 3.10 | PER-01, N-PER-01 |
| G-13 | Bilateral share targets: 50 % general, 60-70 % strength, 40-45 % athlete conversion | 11 3.7 | UNI-02, UNI-10 |
| G-14 | Sport tiers T0-T5 for high- and low-amplitude contacts, throws, cuts, sprints | 04 section 4 | ATH-01, ATH-02, N-ATH-02, N-CAT-13 |
| G-15 | Season multipliers (pre-season plyos × 1.45, in-season court sports × 0.3-0.5) | 04 section 7 | N-ATH-07, PER-08 |
| G-16 | Session time model and slots by length | 05 7.2-7.3 | VOL-08, N-SES-04, N-SES-05 |
| G-17 | Cut order for short sessions | 05 7.3 | N-SES-04 |
| G-18 | Level from training age (L1 < 1 yr … L4 5+ or competitive) | 03 9.2 | N-IN-01, N-IN-02 |
| G-19 | Exercise level = load-position zone minus machine help (± skill) | 10 1.4, 11 V23 | N-CAT-12 |
| G-20 | Machines eligible at every client level | 10 CR-26 | EQ-04 |
| G-21 | Constraint bands per client family (athletes 1-2, older 4-5) | 10 2.2 | EQ-03, EQ-13 |
| G-22 | Medball weight by throw type and person | 10 5, 11 LV-3 | EQ-06 |
| G-23 | Loaded jumps 10-20 % of body weight | 10 5 | EQ-15 |
| G-24 | Olympic sets stop when the bar slows (2-5 reps) | 07 rule 13, 11 LV-4 | N-VOL-10 |
| G-25 | MYO / 'MAX' only on isolation and machines (constraint ≥ 4), last slot | 10 CR-23, 11 QM-2 | VOL-15, N-VOL-09 |
| G-26 | Core first in athlete sessions (05) vs after power (10, 11) | 05, 10, 11 | N-SES-01 |
| G-27 | Contrast only for intermediate+ athletes, off-season and pre-season | 11 LV-6 | ATH-12 |
| G-28 | Plyo zone gating: two clean sessions before the next zone | 11 QM-7 | CAT-11 |
| G-29 | Youth and growth-spurt caps | 04 section 7 youth | ATH-09, N-ATH-17 |
| G-30 | Female athletes: longer landing block | 04 section 9 | N-ATH-16 |
| G-31 | Fight camp structure | 04 section 7 combat | N-ATH-09 |
| G-32 | Strikers drop horizontal push and vertical pull after the base | 04 section 9 | ATH-04, N-ATH-10 |
| G-33 | In-season court sports lift 2-3 days | 04 section 7 | N-ATH-07 |
| G-34 | Rear-delt and cuff work for throwers | 04 section 9 | N-ATH-15 |
| G-35 | Neck work for grapplers | 04 section 9 | N-ATH-14 |
| G-36 | Default exercise ranking inside a slot | 10 2.3 | N-CAT-20 |
| G-37 | Glutes credited 0.5 from squats, 1.0 from hinges and lunges | 03 section 1 | N-CAT-04 |
| G-38 | Mid-range push counted as horizontal push | 01, 02 | N-CAT-05 |

---

## 7. Method and checks (read-only)

- Read first: `coach_answers.md`. Then the 140 page questions, extracted from the `S` array of `coach-questions.html` (section titles, IDs, questions and assumptions).
- Read: every synthesis Markdown file (01, 02, 02 no-equipment subset, 03, 04, 05, 06, 07, 10, 10b, 11), with full reads of 11 and the rule, open-question, contradiction and verification sections of the others. Skimmed every decode in `analysis/` and pulled every "Open questions" section from `analysis/*/*.md` into one list to find questions that never reached the page.
- Checked in the raw workbooks (openpyxl, read-only): sheet states (hidden tabs), comments (none), formulas (none), conditional formats (the DONE? and WEIGHT USED highlights, already described in the decodes), 'Copy of BASEBALL' vs 'BASEBALL' (identical), the copy library tabs against the master library, the tracking dropdown values (AV8:AY17) and the FULL FOCUS headers (AZ).
- Computed from `02_exercise_catalog.json`: inferred tag coverage (322/322), coach usage (145/322), video coverage (81/322 selectable; 142/641 overall).
- Searched the page questions by topic to make sure no question here repeats one there. Where a new question narrows a page question, the overlap is named in "Relates to".
- No Google Sheet was opened or changed.
