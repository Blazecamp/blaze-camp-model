# -*- coding: utf-8 -*-
import json, os, sys, io, contextlib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
with contextlib.redirect_stdout(io.StringIO()):
    import build_profiles as B
D = B.D
PROFILES, OBS = B.PROFILES, B.OBS
OUT_MD = os.path.join(B.OUTDIR, "04_athlete_profiles.md")
OUT_JSON = os.path.join(B.OUTDIR, "04_profiles.json")

def fmt(x):
    if x is None: return "-"
    if isinstance(x, float):
        return ("%.1f" % x).rstrip("0").rstrip(".") if x != int(x) else str(int(x))
    return str(x)

def rng(a):
    if isinstance(a, (list, tuple)) and len(a) == 2: return f"{fmt(a[0])}-{fmt(a[1])}"
    return fmt(a)

def table(head, rows):
    out = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for r in rows:
        out.append("| " + " | ".join(str(c).replace("|", "/").replace("\n", " ") for c in r) + " |")
    return "\n".join(out)

HEADLINES = [
    "OBSERVED + INFERRED: the BYOP templates share one resistance skeleton (knee+pull / hip+push, bilateral -> unilateral -> isolation, every pattern 2x/week) and swap the PREFIX: 4-5 athletic slots for athletes, calves/biceps/triceps for physique, cardio slots for bootcamp. The two sport programs he actually wrote are NOT that template: BASEBALL is a Parts A-E grid (ballistics -> core by plane -> optional OLY -> bkd+uhd / bhd+ukd supersets -> buy-out) and BOXING is an upper/lower 3x10 base followed by complex-based full-body days - but both reuse the same 8-pattern vocabulary. Treating a sport profile as a set of dials on the skeleton is therefore an INFERRED modelling choice, not something the coach states.",
    "OBSERVED athletic share of weekly working sets (excluding medball throws): 0% in every physique, bootcamp and fat-loss template; 11-17% in the gym UPPER/LOWER and PPL examples (A-drills only); 5% strength/conjugate (one 3x6 'EASY' plyo); 16% HYBRID; 16-22% BASEBALL; 32% BYOP ATHLETIC at the coach's 2-sets dose; 28% -> 19% -> 15% across the MM athletic STARTING/MID/ADVANCED blocks; 36% for the boxer's conversion weeks.",
    "OBSERVED medball volume is the largest athletic item in the athlete/fighter programs: 176-192 throws/week in baseball as block means (single weeks 70-290; 45-63% transverse), 190 -> 380 for the boxer, 210 -> 400 -> 420 in the MM athletic blocks (210 and 420 are ASSUMED expansions: the STARTING/ADVANCED cells say only 'ALL LIST', read as the 19-throw ballistics 'MEDBALL CHEAT SHEET' = 17 x 10 + 2 x 20). The BYOP athletic template at 2 sets per slot only delivers about 64-96.",
    "OBSERVED high-amplitude plyo contacts: no program's average week exceeds ~151 (strength 18, hybrid ~36, MM advanced 32, MM mid 71, BYOP @2 72-96, baseball block means 103/151/135, boxer 113-129, MM starting 146), BUT single BASEBALL weeks reach 174-201 (8 of 22 training weeks: B1W1 178, B2W2 174, B2W6 174, B2W7 195, B3W1 186, B3W3 190, B3W5 185, B3W7 201); in-season Block 3 alternates ~185-201 weeks with 36-80 weeks. So T4 (161-220) IS observed at week level in the coach's own baseball programming; only T5 (221-320) is an extrapolation, reserved for the sport the coach named as plyo-heaviest (basketball, then volleyball).",
    "OBSERVED: the boxer is NOT low on plyo contacts against the generic athlete example (258-306 total/week in weeks 3-8 vs 132-191 for MM athletic MID/ADVANCED). 'Boxers need fewer plyos' shows up as timing (zero plyos in the 2 base weeks), type (single-leg reactive squirrel jumps, jump rope, landings) and packaging (bilateral max-effort jumps - tuck jumps, DB squat jumps, broad jumps - appear only as 5-rep components of the two complexes; outside them it is weighted depth drops x8, single-leg high march jumps 6/6 and drop-into-box jumps x8; 28-32 high-intensity contacts per session vs 48.7 in MM STARTING). The matrix encodes this as a separate high-amplitude and low-amplitude dial. CAVEAT: the high/low split is the ANALYST's - the coach files ' Squirrel jumps' and 'Single leg squirrel jumps' under PLYOS 'ADVANCED' / 'FULL JUMPING' (library G126-G127, J9-J10; Sheet23 'ADVANCED - AP -JUMPING' I2-I3, '*FASTEST SSC*' B43); counted as high-amplitude the way he files them, the boxer's wk3-6 high-amplitude contacts are 248-264/week (wk7 206, wk8 211), still above every MM athletic block counted the same way (STARTING 146, MID 191, ADVANCED 132 once their squirrel and plate jumps - also filed under PLYOS - are moved to high).",
    "OBSERVED plyo mix in the only fully written athlete year (BASEBALL, 4,690 lower-body contacts): 75% vertical, 16% horizontal, 9% lateral; 39% unilateral; 6% landings; 39% low-amplitude (ankle hops). Field and court sports in the matrix shift this toward horizontal/lateral and unilateral (soccer 40/30 horizontal/lateral, hockey 45% lateral, football skill 60% unilateral).",
    "OBSERVED: change-of-direction work is zero in every MASTER_MODEL program (athletic, boxing, baseball); only the BYOP athletic template has COD (4 slots/week = 48-64 cuts at 2 sets) and its list is mostly the American-football receiver route tree ('FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL') plus 'Shuffles', 'LEFT TEST' and a date-coerced 5-10-5 cell (L92). Sprinting has no BYOP slot at all (only 'Max velocity running' inside PLYOS ADVANCED). Both are the biggest structural gaps for field/court profiles.",
    "OBSERVED set counts, INFERRED muscle credit (analyst 1.0/0.5 map, see 5.6): athletes keep legs at 12-26 resistance sets/week (glutes highest under that map) while upper-body muscles often sit at 2-10; only the aesthetics tracks run 15-35 sets on most muscles. The coach's '15-20 sets per muscle' is applied to the muscles a goal cares about, and athletic sets are extra exposure on top.",
    "OBSERVED unilateral share of lower-body compound sets: 26-32% strength/conjugate, ~50% in the BYOP 4-day templates (structural; 43% in the 3 DAY BUILDER, 33% in the miswired NO ACCESS copy), 43-47% baseball, 50-75% in the MM athletic blocks (STARTING 55, MID 75, ADVANCED 50) and 63% HYBRID. Unilateral emphasis rises with athleticism; it does NOT rise monotonically with level (MID 75% -> ADVANCED 50%).",
    "OBSERVED core-by-plane: BASEBALL rotates 'LATERAL CORE' (Mon), 'Transverse core' (Tue/Fri), 'Sagital core' (Thu) -> 48% transverse, 24% sagittal, 22% frontal sets; BYOP uses plane as difficulty (sagittal = EASY, frontal = MODERATE, transverse = HARD); physique leaves core optional, fat loss trains it only in circuits, strength tracks write none.",
    "OBSERVED conditioning by population: physique = colour C 2x/week ('30-40 mi slow/steady CARDIO'); fat loss = C 2x + 2 metabolic circuits (12 -> 33 min work); boxer = one A ('Sprint 20/ Recover 40' 5 -> 8 rounds) + one C (20-40 min); baseball = only short A-type buy-outs (10-39 s, 3-4 bouts/week); HYBRID = one A + one C; CrossFit = C -> C,B -> C,B,A -> lactate clearance by level, 2-4 sessions + 1-4 WODs.",
    "OBSERVED: 'level' moves volume in opposite directions by population. Athletes STARTING -> MID -> ADVANCED: working sets -19% and -18%, high-amplitude contacts -51% and -55%, throws +90% and +5%, main-lift reps 6-8 -> 1. Gym clients NOVICE -> NEWBY -> INTERMEDIATE: weekly sets +18-23% and +13-14%, but compound reps move BOTH ways - UPPER/LOWER lower compounds 2x12 -> 3x10 -> 4x8 while its upper compounds go 3x8 -> 3x10 -> 4x12 (reps up); PPL push/pull 3x15 -> 3-4x10 -> 4x8 except pull-ups 3x15 -> 4x10 -> 5x12, PPL legs 2x8 -> 3x10 -> 4x8. Arm and leg isolation stays at 20 / 'MAX REPS'; PPL delt isolation does not (side raises 3x15 -> 4x8).",
    "OBSERVED seasons (BASEBALL; the three blocks carry no season label - off-season / pre-season / in-season is INFERRED from their cell dates against the coach's calendars): off-season = new menu every week, '12/10/8/8', OLY introduced late; pre-season = +47% high-amplitude contacts, x3 sprint sets, contrast complexes, OLY 75 -> 90%, resistance flat 74-76 for four weeks then +2.6/+3.8/+3.7% per week over the last three loading weeks, then a DELOAD (-31% resistance, -46% all sets); in-season = flat 4 x 10, no compound below 8 reps, no Olympic lifts, two alternating proven weekly menus; recovery week = arm care + 4 x 10 min easy cardio.",
    "OBSERVED combat phasing (boxer): 2-week hypertrophy base (3 x 10 on all 8 patterns, no plyos) -> 6-week conversion (exercise list replaced, contrast complexes of the 'ALL ABOUT SQUATS' 'FRENCH CONTRAST' type - the boxing tab itself never uses that term, 2-week steps, wk 7 accessory mini-deload while the hinge complex / clean & press / row superset rise 3 -> 4 -> 6 sets, wk 8 peak), and horizontal push, vertical pull and arm isolation are removed after the base.",
    "OBSERVED injury logic the coach already uses: joint pain -> unilateral and split grips (DB/KB) first; throwers press mostly with DBs/landmine/single-arm (no barbell bench is named, but barbell overhead pressing appears 3 times in the baseball year: 'barbell press' B1W2/B1W3, 'barbell overhead strict press' B2W1); Copenhagen planks appear in the athletic, boxing and baseball programs; machines for low systemic fatigue ('LEG PRESS'/'PENDULUM' 'LOVE IT', 'V-SQUAT' never). SCIENCE adds fixed accessories the matrix wires in: Nordics (-51% hamstring injuries), Copenhagen (-41% groin problems), landing-first neuromuscular training (~-50% ACL in female athletes), jumper's-knee volume caps (44.6% prevalence in volleyball, 31.9% in basketball).",
    "MATRIX (INFERRED): 27 profiles and 23 position/phase variants, each written as a weekly set budget per category in the coach's own slot grammar (PLYO, JLK, THROW, COD, SPRINT, TE, 8 resistance patterns, isolations, CORE, FOCUS) so the shares, muscle sets and contact checks are computed, not asserted. Eight profiles are numerically OBSERVED (baseball, boxer, CrossFit, hybrid, strength, aesthetics, fat loss, generic athlete).",
    "MATRIX plyo order (high-amplitude tier): basketball and volleyball T5 (~224/week) > football skill, soccer, MMA T4 (168-192) > baseball, boxer, hockey, tennis, kickboxing, sprinter, football big-skill T3 (101-160) > karate/TKD, wrestling, linemen, youth, generic athlete T2 > golf, BJJ, distance, strength, hybrid T1 > physique, fat loss, general population T0. This reproduces the coach's 'basketball > MMA > boxing/karate' statement with the observed boxer as the T3 anchor - which holds ONLY under the analyst's choice to count squirrel jumps as low-amplitude; counted the way the coach files them (PLYOS 'ADVANCED' / 'FULL JUMPING') the boxer's 248-264 high-amplitude contacts/week sit in T5, and the scale would have to be re-anchored (open questions 1 and 3).",
    "MATRIX 'more resistance' vs 'more power' axis: linemen (46% compound sets, strength 50%), wrestling/BJJ (pull:push 2.0-2.4:1, neck + grip), powerlifting (89% compound) sit at the resistance end; basketball, volleyball, football skill, soccer, sprinters and karate (athletic sets 46-52% of weekly work, power 35-45% of resistance emphasis) at the power end; baseball, softball, golf and tennis are rotational-power profiles (throws T2-T3, transverse core 45-55%).",
    "The coach's set budget per session (OBSERVED: ~19-21 physique, 20 BYOP athletic @2, median 29 baseball, 23-39 boxer component sets) is the hard constraint. The INFERRED off-season budgets land at 25-33 sets per main day for 4-day athlete profiles (upper bound, if core/focus/calves stay on main days; 14-23 for golf, BJJ, distance, youth and general population), i.e. the upper end of what he writes; the generator should scale sets per slot 2 -> 3 by level and season instead of adding slots.",
    "Library gaps the profiles need (OBSERVED absence): a SPRINT slot (MACH drills / acceleration starts live in MASTER_MODEL only: Sheet23, the cheat-sheet 'RUNNING WARMUP', UL/PPL A-drills, BASEBALL accelerations), REPS units for contacts / metres / seconds / per-side / 1-3 reps, neck exercises, CARRY and DRAGS library items (headings exist with sub-headings only; carries are programmed in BASEBALL, drags nowhere), a rear-delt/external-rotation slot for throwers, reactive agility drills, and equipment tags.",
]

QUESTIONS = [
    "Plyo scale: is the boxer's 113-129 high-amplitude + 142-177 low-amplitude contacts/week (plus jump rope) the CEILING for boxing, a typical dose, or 'a lot'? The whole T1-T5 scale is anchored on it.",
    "Do you agree with roughly 220-300 high-amplitude contacts/week for an off-season basketball player, 160-200 for MMA, 60-90 for karate/TKD? Or should 'more plyos' mean more sessions/frequency rather than more contacts per week?",
    "When you say boxers/karate need fewer plyos, do you mean fewer HIGH-amplitude jumps (depth jumps, max jumps) while keeping low-amplitude bouncing (rope, squirrel jumps, ankle hops) high, as the boxing example does?",
    "Should every field/court sport get a dedicated SPRINT slot (and should 'MACH DRILLS' / 'Acceleration starts' from Sheet23 and the cheat-sheet 'RUNNING WARMUP' move into the BYOP library)? Today sprint only appears as A-drills, 'Falling start accelerations', baseball accelerations, or conditioning intervals.",
    "Your MASTER_MODEL programs contain zero change-of-direction work. Is COD left to sport practice for in-season athletes? Should non-football athletes still use the receiver route tree ('FADE' ... 'COMEBACK/CURL'), or do soccer/basketball/tennis need their own COD and reactive-agility list?",
    "Medball dose: athletes/fighters get 176-420 throws/week in your examples but the BYOP template at 2 sets gives 64-96. What weekly throw target do you want per sport, and does a 'Throwing' slot mean one throw or the whole 19-throw list?",
    "Strikers: is dropping horizontal push, vertical pull and arm isolation after the base phase a rule for every striking sport (boxing, kickboxing, karate), and should MMA keep pulling for grappling?",
    "Baseball/softball: do pitchers, catchers and position players get different templates (your pro calendar separates 'PITCHERS/CATCHERS' from 'POSITIONS')? What changes for pitchers on throwing days?",
    "In-season for game-heavy sports (basketball, volleyball, soccer, football, hockey): how many lifts per week, and should game/practice jumps and sprints be subtracted from the plyo/sprint budget?",
    "Should athletic sets (plyos, throws, cuts, cleans) count toward the 15-20 sets per muscle per week, partly (e.g. quads/calves), or not at all?",
    "Confirm the level rule: athletes get LESS volume and more intensity/specificity as they advance (MM athletic ladder), while physique clients get MORE sets (UPPER/LOWER, PPL ladders)?",
    "Core: should every athlete profile rotate planes by day like BASEBALL ('LATERAL CORE' / 'Transverse core' / 'Sagital core'), with more transverse for rotational sports (golf, tennis, baseball) and more frontal for skating/cutting sports?",
    "Conditioning: the athletic template has 2 'Aerobic Capacity' slots, the cheat sheet says 3 (one per colour). Which sports should use lactate clearance (MMA, hockey, 400 m?), and is colour A (short/high) the only conditioning for baseball/football?",
    "Female athletes in landing/cutting sports: should the generator automatically lengthen the 'TAKING IN FORCES' landing block (ACL risk), and limit 'HARD TURN' COD until landing competency is shown?",
    "Youth: do you want maturation stage (pre / circa / post growth spurt) as a UI input, with reduced depth jumps and FOUNDATIONAL-only library levels during the growth spurt?",
    "Neck, grip, carries and drags: should the library get a NECK column and filled CARRY/DRAGS columns for wrestling, BJJ, MMA, football and hockey?",
    "Golf, tennis and hockey: build them on the BASEBALL Part-A/B/C/D/E template (upper and lower ballistics on alternate days, core by plane) or on the BYOP ATHLETIC 4-day template?",
    "Distance runners: keep the Chris Hinshaw half-marathon plan as the running backbone (it is a borrowed model), or build your own run progression with the aerobic colour system?",
    "Position variants in the UI: basketball guard/big, volleyball hitter/setter/libero, football skill/big-skill/line/QB/specialist, soccer outfield/GK, hockey skater/goalie, baseball position/pitcher/catcher, softball pitcher - are these the right splits?",
    "Season input: which of your baseball calendars (high school, fall ball, pro, pro weekly with 'PEAK'/'DELOAD') should the generator use as the default season model for other sports?",
]

VERIFICATION_LOG_INTRO = "Adversarial fact-check, 2026-10-08, against `dumps/BYOP`, `dumps/MASTER_MODEL` and `analysis/` (read-only; no Google Sheet touched). The 04 md/json published at 2026-10-07 22:12 were STALE: `profiles_data.py`, `build_profiles.py` and `render.py` had already been partly corrected (22:21-22:23) but never re-rendered. Every one of those pending script corrections was re-checked against the dumps (one was itself wrong and was fixed, see C-28), further errors were fixed in the same scripts, and both files were regenerated with `python3 render.py`. Items marked [pending] were in the scripts but not in the published files; [new] are this pass."

VERIFICATION_RECOMPUTED = [
    "R-1 BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (C/D columns): Mon/Thu 10 slots (Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions), Tue/Fri 10 slots (PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution), Wed/Sat 5 (Calves, Aerobic Capacity, Core, Focus 1, Focus 2). At 2 sets and excluding 'Aerobic Capacity': 96 sets, athletic 36 = 37.5%, excl. throws 28/88 = 31.8%. CONFIRMED.",
    "R-2 JUSTICE LEAGUE: only 11 slots carry sets (Mon rows 3-12 + Tue 'SL Depth Drops'), all F = 2.0; Thu row 35 'Low Bar Back Squat' has no sets; 38 of 50 weekly slots are 'CHOOSE 👇'. The doc's 'completed @2' label was WRONG (fixed). 'Medium Depth Drop' = PLYOS FOUNDATIONAL G11, 'Power Clean' = TRIPPLE EXTENSION ADVANCED C92/E10: 'level per slot' CONFIRMED.",
    "R-3 'EXAMPLE BOXING 8 WEEK BUILD UP' cell by cell: wk1-2 = 99 component sets (RP 48, ISO 18, core 14, 19 throw lines); wk3-8 high-amplitude contacts 113/113/129/129/116/116 (depth drops 3x8, SL march 3x6/6, complex tuck + DB squat jumps 3x10, drop-into-box 1-3x8, broad jumps 3-6x5), low 177/177/177/177/142/167; weekly sets 151/151/155/155/142/174. CONFIRMED; squirrel-jump reclassification gives 248-264 high (new caveat).",
    "R-4 MM 'EXAMPLE UPPERLOWER SPLIT' / 'EXAMPLE PUSHPULLLEGS SPLIT': weekly resistance sets 76 -> 90 -> 102 and 47 -> 58 -> 66 per rotation CONFIRMED; rep directions NOT uniform (UL upper compounds 3x8 -> 3x10 -> 4x12; PPL legs 2x8 -> 3x10 -> 4x8; PPL delt isolation 15 -> 8) - original 'compound reps 12-15 -> 10 -> 8, isolation fixed' was WRONG.",
    "R-5 'EXAMPLE FAT BURNBODY TONING PRO': lifting sets 60/60/64/70 CONFIRMED; circuits 3x4x30 s x2 = 12 min -> 5x4x50 s x2 = 33 min CONFIRMED; circuits sit on Mon/Fri (wk1, wk3) and Tue/Thu (wk2, wk4).",
    "R-6 BASEBALL (decode entries re-aggregated): weekly sets block means 107.3 / 130.1 / 121.2, deload 151 -> 82 (-46%), resistance 84 -> 58 (-31%), high-amplitude block means 102.6 / 151.4 / 135.1, 4,690 contacts, 57% transverse throws, buy-outs 3.3 / 3.3 / 3.75 per week, ankle hops 20 of 46 labelled 'calfs' slots (43%), MAX on 35% of arm/delt isolation sets - CONFIRMED; but single weeks reach 174-201 high-amplitude contacts (8 of 22 training weeks) - the 'never exceed ~151/week' claim was WRONG.",
    "R-7 4 TRACKS: STRENGTH-8 = 56 sets/week; STRENGTH-12 % 80,80,85,85,90,90,'MID DELOAD', RPE / SETS / REPS rows, AESTHETICS-8 SETS 2,3,3,3,4,4,5, AESTHETICS-12 SETS 3,3,3,4,4,4,3,4,4,4,4,5, HYBRID AMRAP 12..20 / SETS 2..4 / REPS 6,8,10 - CONFIRMED; WK6 column FFF2CC CONFIRMED.",
    "R-8 Sheet24: 21 weeks x 2 runs, cut-back weeks 3/6/8/12/18, '1-mile at max effort' wk 10/14, longest run 3 -> 12 mi CONFIRMED; hill sprints are 6-10 reps x 8-20 s (not '8-10 x 8-10 s').",
    "R-9 Library cell references re-read: AA91/AA93, AD126-AD130, AH10/AH15, AK18, AL12/AL19/AL21, AN18/AN19/AN91, AU9, BC9/BC13/BC17, BC46-BC49, R47/O165, G93/G94, G50-G52, C124-C136, AW8:AW14, AY8:AY11 - all CONFIRMED (AD130 is 'Push ups (1 hand Higher)', not an alternating press).",
]

VERIFICATION_LOG = [
    "C-1 [pending] Headline 4 + section 4 note + tier anchors: 'high-amplitude contacts never exceed ~151/week' -> block means max 151, but 8 single BASEBALL weeks reach 174-201 (B3 'WEEK 7' 201), so T4 is observed at week level; only T5 is extrapolated.",
    "C-2 [pending] COD library is not 'literally the receiver route tree': it also holds 'Shuffles' (L13, EASY TURN), 'LEFT TEST' (L47, MOD. TURN) and a date-coerced 5-10-5 cell (L92 / N10, HARD TURN). Headline 7, football card, basketball COD notes, gap table fixed.",
    "C-3 [pending] JUSTICE LEAGUE relabelled from 'completed @2' to 'partial fill: Mon + 1 Tue slot; 2 sets extrapolated'; contacts re-estimated ~60-80 high + ~12-16 low; generic athlete evidence downgraded to OBSERVED slots + ASSUMED sets; plyo mix limited to the 3 observed picks (100% vertical, 33% unilateral, 67% landings).",
    "C-4 [pending] Gym ladder: compound reps do NOT all fall with level (UL upper 3x8 -> 3x10 -> 4x12; PPL pull-ups 3x15 -> 4x10 -> 5x12, dips 3x8 -> 3x10 -> 4x'MAX'; PPL legs 2x8 -> 3x10 -> 4x8) and PPL delt isolation is not fixed (side raises 3x15 -> 4x8 -> 4x8). Headline 12, section 2.4, level-modifier table fixed.",
    "C-5 [pending] UL A-drill contacts were per lower DAY, not per week: 72 / 90 / 64 per leg per day = 144 / 180 / 128 per week.",
    "C-6 [pending] BASEBALL blocks carry no season label (A24 'BLOCK 1', A41 'BLOCK 2', A59 'BLOCK 3'); off / pre / in-season is INFERRED from the cell dates vs the calendars. Headline 13, section 2.4, season-family evidence fixed; pre-season resistance described as flat 74-76 for four weeks before the +2.6/+3.8/+3.7% climb.",
    "C-7 [pending] Core order: BYOP puts core on the optional days; BASEBALL puts core SECOND (Part B); MM STARTING puts it first/second/last. The 'isolation -> core' order was not observed (rule 3, assembly step 4).",
    "C-8 [pending] Rule 8: fat loss is not 'no jumping' - circuits contain 'Jumping Jacks' and 'Burpees'.",
    "C-9 [pending] Barbell overhead pressing IS written for the baseball player 3 times ('barbell press' AE34, AW34; 'barbell overhead strict press' Q52) plus 'arnold presses' AS70; 'DB-only pressing' and the throwing-shoulder rule were corrected; the one non-DB bench is 'fast banded assisted bench press' (implement unnamed).",
    "C-10 [pending] PAIN_GENERAL: only the athletic tab (A6) says 'going unilateral'; UL/PPL A7 give the grip rule only. FEELING list quoted from AY8:AY11.",
    "C-11 [pending] Copenhagen cell refs: MM athletic is F66 / J24 (not D66 / H24, which are SETS cells); BASEBALL cells listed.",
    "C-12 [pending] Unilateral share does not rise monotonically with level (MM MID 75% -> ADVANCED 50%); BYOP 3 DAY BUILDER 43%, NO ACCESS 33%.",
    "C-13 [pending] Boxer conversion: the levers are the hinge complex (L46), clean & press (L35) and the DB-row superset (L20) 3 -> 4 -> 6 sets; the squat complex (L22) goes 3 -> 2 -> 3, so 'complexes 3 -> 4 -> 6' was wrong for one of the two complexes; the eleven wk-7 rows that drop 3 -> 2 are listed.",
    "C-14 [pending] Boxer mix recomputed (85/15/0 vertical/horizontal/lateral, 62% unilateral, 8% landings); max jumps outside the complexes listed. [new] Noted that this counts 'Single Leg to high march jump' as vertical while the BASEBALL rule counts 'march jump' horizontal (73/27 under that rule).",
    "C-15 [pending] MYO is not machine-only: 'ALL ABOUT SQUATS' B27 '**MYO SET - ADVANCED' sits in the free-weight squat menu (explained A30), plus leg-press MYO (AESTHETICS-12) and leg-extension 'MYO SET' (JUSTICE LEAGUE G12). STRENGTH zone cited to D15:E26; CrossFit strength levels (3x7 -> 6x4) noted as higher-rep.",
    "C-16 [pending] Sheet24 quotes made verbatim ('Program we use for all Blaze Camp Athletes who are looking to run a half marathon.', 'Tapering: 6 miles, comfortable pace'); the strength/plyo rules in the endurance family are INFERRED (Sheet24 has no lifting).",
    "C-17 [pending] CARRY / DRAG library columns hold sub-headings ('PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; 'SAGITAL', 'FRONTAL'), not nothing; carries ARE programmed in BASEBALL (E47, W49, S65) and CONTROL PATTERNS (B10); drags appear nowhere. Sprint gap updated with the cheat-sheet 'RUNNING WARMUP' ('Falling start accelerations') and Sheet23 B48/B49.",
    "C-18 [pending] 'JUMPING ANKLE' block is C124-C136 under the TRIPPLE EXTENSION column (same list as Sheet23 E2:E12); BOOTCAMP 1 is titled 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'; AESTHETICS optional days are 'Optional' (no weekday); 4 TRACKS A1 says '8 WEEKS OF 3 TRACKS ...' and writes no 6-week product; HYBRID 'heavy' is absent in wk1; HYBRID 'AMRAP' row 70 is not tied to Saturday; CrossFit power months have 2-4 WOD days.",
    "C-19 [new] Headline 1 overstated ('the coach does not write a different program per sport', labelled OBSERVED): BASEBALL (Parts A-E) and BOXING (3x10 upper/lower base -> complexes) are structurally different programs; the 'dials on one skeleton' view is now labelled an INFERRED modelling choice.",
    "C-20 [new] Squirrel jumps: the doc counted them as low-amplitude without saying the coach files ' Squirrel jumps' / 'Single leg squirrel jumps' under PLYOS 'ADVANCED' / 'FULL JUMPING' (G126-G127, J9-J10; Sheet23 I2-I3). Caveat added to headline 5, section 2.2 rules, section 2.5 reading and the JLK category definition; counted the coach's way the boxer has 248-264 high-amplitude contacts/week in wk3-6 (wk7 206, wk8 211).",
    "C-21 [new] 'JUMPING LIMITED KNEE' is only a MASTER_MODEL Sheet23 heading (E1/G1); the BYOP library heading is 'JUMPING ANKLE' (F5) - JLK definition corrected.",
    "C-22 [new] MM athletic throws 210 (STARTING) and 420 (ADVANCED) are ASSUMED expansions of the cell 'ALL LIST' (19-throw ballistics 'MEDBALL CHEAT SHEET', 17x10 + 2x20); flagged in headline 3, section 2.2, 2.4, the throws tier anchors, the athlete ladder and the generic-athlete variants. MID's 400 is fully written.",
    "C-23 [new] 'French contrast' is the analyst's label for the boxer complexes - the boxing tab never uses the term; the pattern matches 'ALL ABOUT SQUATS' G16 'FRENCH CONTRAST'. Headline 14 and the boxing pairing now say so.",
    "C-24 [new] STRENGTH-8 rows E4:L6 are three UNLABELLED coloured number rows; reading them as M.E. reps / D.E. reps / sets ladder is INFERRED (was stated as OBSERVED).",
    "C-25 [new] The post-season recovery phase was evidenced by BASEBALL Block 1 'wk 8', which is the recovery week between Block 1 and Block 2, not a post-season week (it also keeps an empty 'OPTIONAL PIECE' 'OLY' 4 x 6 label); evidence relabelled.",
    "C-26 [new] Ballistics tab: within-column order (bilateral -> unilateral, unweighted -> weighted, hop -> jump) is OBSERVED; reading the four columns 'TAKING IN FORCES' -> 'REBOUNDING ' as a time sequence is INFERRED (tab is 'UNDER CONSTRUCTION').",
    "C-27 [new] MM STARTING core position: first in S3 ('Med ball rolls'), second in S2, last in S1 (was 'second and last').",
    "C-28 [new, corrects a pending edit] CrossFit Saturday: the pending text said 'no WOD or lifting on SAT in any month grid' - MAY has a SAT WOD (G144 'YES'); SAT aerobic sessions occur in AUG/SEPT/NOV/DEC/MAY. Skill days 'T2B/ DUBS' / 'H.S./ DUBS' also occur in MAR and APR, not only JUN/JUL/NOV.",
    "C-29 [new] Cossack: 'Cosak lateral lunges' exists in '(NOT DONE) RESISTANCE PATTERNS ' C47 (the pending text said it appeared only as a ballistics warm-up lunge).",
    "C-30 [new] Sheet24 hill sprints corrected to 6-10 reps x 8-20 s (wk12 '6x10sec plus 2x20sec'); distance-runner conditioning: Sheet24 is 2 runs/week, the A/B/C split of 3 sessions is INFERRED.",
    "C-31 [new] Hybrid 'JUMPS' 3x6 is an assumption (no sets/reps on the row); the tab's global SETS/REPS rows 71-72 would give 24-60 contacts/week (mean ~41).",
    "C-32 [new] Per-muscle sets (5.6, headline 8) use an analyst credit map; the decodes disagree with each other (front-delt credit for horizontal push 1.0 vs 0.5). Note added; code comment claiming 'the one used by every program decode' corrected.",
    "C-33 [new] Baseball row count: 865 prescription rows (911 decode entries incl. 46 label-only rows). Baseball in-season override now says OBSERVED in Block 3, season reading INFERRED.",
    "C-34 [new] Verbatim fixes: 'Focus 1' / 'Focus 2' (not 'Focus 1/2'); 'Shuffles' (not 'Lateral Shuffles'); the medball 2x2 matrix quoted as 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP', 'OUT OF THE LEFT LEG/HIP', 'INTO THE RIGHT LEG/HIP' (ballistics D65-D68); AGILITYCOD formation headings ('KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'HOPS IN PLACE', 'RUNNING ROUTES', 'ROUTE TREE') added to the reactive-agility gap.",
    "C-35 [new] SCIENCE check: S4 (NSCA 80-100 / 100-120 / 120-140 contacts per session), S14 (Nordics up to -51%), S15 (Copenhagen -41%), S20 (~-50% ACL), S21 (44.6% / 31.9% jumper's knee), S22 (40-60% 1RM power), S31 (Schoenfeld dose-response), golf ~8x body-weight lumbar load and hockey -18% adduction strength match the published values; sources were not re-fetched. The youth circa-PHV caps (-30-50% plyos, ~30 cm depth jumps) were presented as SCIENCE but are analyst heuristics - relabelled INFERRED.",
    "C-36 [new] Headline 8 relabelled (set counts OBSERVED, muscle credit INFERRED); headline 17 now states that the boxer-as-T3 anchor depends on the squirrel-jump classification (T5 if counted the coach's way).",
    "C-37 [new] Section 5.1 evidence column: profiles whose set budget contains assumed or illustrative cells (CrossFit JULY 'ILLUSTRATIVE 3-exercise' resistance sessions, HYBRID blank-set assumptions) now show 'OBSERVED + INFERRED/ASSUMED parts' instead of plain OBSERVED.",
    "C-38 [new] BYOP AESTHETICS (bodybuilding profile, 102 sets/week) is also a PARTIAL coach fill (Day 1 complete, 4 of 7 Day-2 slots, rest 'CHOOSE 👇'); the weekly set note now says the counts are an ASSUMED extrapolation.",
    "Not changed (verified correct): AEROBIC CAPACITY CHEAT SHEET colours / A5 rule / D21:D24 level unlock; BASEBALL VOL legend rows 20-22, core-by-day labels, 'PITCHERS/CATCHERS' E16 vs 'POSITIONS' F16; ALL ABOUT SQUATS machine opinions; CrossFit macro A10:M17 and FULL/HALF TIME tables; NO ACCESS UHD -> LEG CURLS miswire (E19/E46 -> AR); neck exercises absent everywhere.",
]

def build_md():
    L = []
    A = L.append
    A("# Athlete & goal profiles: how emphasis changes by sport and goal")
    A("")
    A("Deliverable 04 of the Blaze Camp model synthesis. Companion machine-readable file: `04_profiles.json` (same folder). Inputs: every program decode under `analysis/programs/` (BYOP aesthetics, 3-day, PPL, bootcamps, athletic, JUSTICE LEAGUE, NO ACCESS copies; MASTER_MODEL upper/lower, PPL, fat burn, athletic off-season STARTING/MID/ADVANCED, boxing build-up, BASEBALL 3 blocks, CrossFit macro and class, 4 TRACKS strength/aesthetics/hybrid, conjugate draft, Sheet24 half marathon), the library and reference decodes (`analysis/library/`, `analysis/reference/`) and the equipment decode. Numbers were recomputed from the decode volume JSONs with the same counting convention; the build scripts and intermediate JSON are in `synthesis/_build_04/` (`python3 render.py` regenerates both files). Nothing in Google Sheets was opened for writing.")
    A("")
    A("## 0. How to read this")
    A("")
    A("* **OBSERVED** = read from the coach's sheets (tab + cell or decoded program). **INFERRED** = analyst reasoning, written so the coach can correct it. **SCIENCE** = external literature (sources in section 12, tagged [S#]).")
    A("* Coach labels are quoted verbatim with their typos ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT', 'CLERANCE'); my own names use correct spelling.")
    A("* **Unit of work = one working set** (same convention as every program decode: a movement inside a superset/complex counts its own sets; one medball throw line of 10 = 1 set; per-side reps = 1 set). Shares are % of weekly working sets. Because a 19-throw medball list adds 19 'sets' of light work, athletic share is shown both **including** and **excluding** throws.")
    A("* **Conditioning is not in sets.** It is counted in sessions per week by the coach's colour code: **A** blue short/high, **B** green moderate 1-3 min, **C** orange long/low, **LC** lactate clearance ('AEROBIC CAPACITY CHEAT SHEET').")
    A("* **Category codes** (the coach's slot grammar): " + "; ".join(f"`{k}` = {v}" for k, v in D.CAT_LABELS.items()) + ".")
    A("* **Nominal reps** used only to check that an INFERRED set budget lands in the intended tier: " + "; ".join(f"{k} {v[0]} ({v[1]})" for k, v in D.NOMINAL.items()) + ". They do not apply to the OBSERVED profiles, which carry the observed counts.")
    A("")
    A("## 1. Headline findings")
    A("")
    for i, h in enumerate(HEADLINES, 1):
        A(f"{i}. {h}")
    A("")
    # ---------------- section 2 observed
    A("## 2. OBSERVED: what each population actually gets in the coach's programs")
    A("")
    A("### 2.1 Share of weekly working sets")
    A("")
    A("Representative programs (BYOP templates at the stated set assumption; MASTER_MODEL programs as written, with the decode's assumptions where a cell was blank). Lower uni % = unilateral share of lower-body compound sets.")
    A("")
    rows = []
    for o in OBS:
        s = o.get("share_pct", {})
        if not s: continue
        rows.append([o["program"], o["population"], fmt(o["weekly_sets"]), fmt(s.get("athletic_excl_throws")), fmt(s.get("athletic_incl_throw_sets")), fmt(s.get("resistance_compound")), fmt(s.get("resistance_isolation")),
                     fmt(s.get("core")), fmt(s.get("focus")), fmt(o.get("unilateral_pct")), "/".join(fmt(x) for x in o.get("knee_hip_sets", [])), "/".join(fmt(x) for x in o.get("push_pull_sets", [])), fmt(o.get("compound_to_isolation"))])
    A(table(["program", "population", "weekly sets", "athletic % excl. throws", "athletic % incl. throw-sets", "compound %", "isolation %", "core %", "focus %", "lower uni %", "knee/hip sets", "push/pull sets", "compound:iso"], rows))
    A("")
    A("Reading (INFERRED): three clusters. (1) **Physique / fat loss / bootcamp**: no athletic work, isolation 19-43% of sets, compound:isolation 1.0-2.9, core optional or circuit-only. (2) **Strength / CrossFit strength months**: 80-90% compound, almost no isolation or athletic work. (3) **Athletes and fighters**: athletic work 15-36% of non-throw sets plus large throw volumes, resistance shrinks toward legs, upper-body pressing is cut for strikers.")
    A("")
    A("### 2.2 Athletic dose by sub-type (weekly)")
    A("")
    rows = []
    for o in OBS:
        mix = o.get("athletic_sets_by_type", {})
        rows.append([o["program"], ", ".join(f"{k} {fmt(v)}" for k, v in mix.items()) or "-", o.get("contacts_wk", "-"), o.get("throws_wk", "-"), o.get("cod_wk", "-"), o.get("sprint_wk", "-"), o.get("triple_ext", "-")])
    A(table(["program", "athletic sets by type", "lower-body contacts / week", "medball throws / week", "COD", "sprint", "triple extension / Olympic"], rows))
    A("")
    A("**BASEBALL plyo / throw / core mix (OBSERVED, per training week, recomputed from the decode's 865 prescription rows (911 entries incl. 46 label-only rows); deload and recovery weeks excluded):**")
    A("")
    A(table(["block (season)", "high-amplitude contacts", "low-amplitude contacts", "vertical / horizontal / lateral contacts", "unilateral contacts", "landings", "throws sagittal / transverse", "core sets frontal / sagittal / transverse"],
            [["B1 off-season (7 wk)", "102.6", "96.6", "146.6 / 38.3 / 14.3", "70.6", "14.3", "97.9 / 80.0", "2.1 / 3.1 / 5.6"],
             ["B2 pre-season (7 wk)", "151.4", "89.3", "200.4 / 28.9 / 11.4", "97.7", "12.9", "70.6 / 121.7", "3.7 / 3.1 / 7.3"],
             ["B3 in-season (8 wk)", "135.1", "66.2", "134.1 / 35.5 / 31.8", "78.4", "12.6", "69.8 / 106.5", "3.6 / 4.2 / 8.1"],
             ["all training weeks (share)", "61%", "39%", "75% / 16% / 9%", "39%", "6%", "43% / 57%", "22% / 24% / 48% (+6% unspecified)"]]))
    A("")
    A("Classification rules (INFERRED, keyword based): lateral = 'lateral', 'side to side', 'skater'; horizontal = 'broad', 'bound', 'forward', 'hurdle', 'march jump'; unilateral = single leg / split / staggered / lunge / RFE / FFE / march / bound; low-amplitude = the JUMPING LIMITED KNEE bucket, ankle hops, squirrel jumps (squirrel jumps are low-amplitude by ANALYST choice; the coach's library files them under PLYOS 'ADVANCED' / 'FULL JUMPING'). Upper-body plyo push-ups (230 contacts over the year) are excluded.")
    A("")
    A("### 2.3 Conditioning and core as written")
    A("")
    A(table(["program", "conditioning (colour per AEROBIC CAPACITY CHEAT SHEET)", "core"], [[o["program"], o.get("conditioning", "-"), o.get("core_detail", "-")] for o in OBS]))
    A("")
    A("### 2.4 Phase, level and season evidence (OBSERVED)")
    A("")
    A(table(["source", "what changes", "numbers"], [
        ["MM athletic STARTING -> MID -> ADVANCED ('First 8 weeks (8wk1) adaptation focus' ...)", "volume down, intensity/specificity up", "working sets 89 -> 72 -> 59; resistance 44 -> 44 -> 24; high contacts 146 -> 71 -> 32; low 0 -> 120 -> 100; throws 210 -> 400 -> 420 (210/420 ASSUMED from 'ALL LIST'; 400 written as 10 rotational throws x 2 x 10 on 2 days); core 20 -> 14 -> 26; deadlift 3x6 -> 2x6-8 -> 3x1 '1RIR'"],
        ["MM UPPER/LOWER NOVICE -> NEWBY -> INTERMEDIATE", "volume up; lower compound reps down, upper compound reps UP", "weekly resistance sets 76 -> 90 -> 102; lower compounds 2x12 -> 3x10 -> 4x8; upper compounds (bench, pulldown, OHP) 3x8 -> 3x10 -> 4x12; rows 3x'12/12' fixed; isolation 2-3 x 20 / 'MAX REPS' fixed"],
        ["MM PPL NOVICE -> NEWBY -> INTERMEDIATE", "volume up; most reps down", "sets per rotation 47 -> 58 -> 66; push/pull compounds 3x15 -> 3-4x10 -> 4x8 except pull-ups 3x15 -> 4x10 -> 5x12 and dips 3x8 -> 3x10 -> 4x'MAX'; legs 2x8 -> 3x10 -> 4x8; delt isolation 3x15 -> 3-4x8-10 -> 4x8; arms 3x20 fixed"],
        ["BOXER wk1-2 -> wk3-8", "base -> conversion", "working sets (excl. throws) 80 -> 113 / 113 / 117 / 117 / 104 (wk7) / 136 (wk8); resistance 66 -> 50-68; athletic 0 -> 38-48; throws 190 -> 380; contacts 0 -> 258-306; sprint rounds 0 -> 5,5,6,6,7,8"],
        ["BASEBALL Block 1 -> 2 -> 3 (season reading INFERRED from dates)", "build -> intensify -> maintain", "AP_PLYO sets 9 -> 16.3 -> 14.6; sprint sets 1 -> 3.1 -> 1.8; throws 178 -> 192 -> 176; resistance sets/week ~72 -> 74-84 -> 64-76; main lifts '12/10/8/8' -> '8/6/4/4','6/6/5/4' -> 4x10"],
        ["BASEBALL B2 DELOAD WEEK", "deload recipe", "resistance 84 -> 58 (-31%); all sets 151 -> 82 (-46%); athletic 1-2 sets; no buy-out; no OLY; everything 3 x 8"],
        ["CROSSFIT macro A10:M17", "quality sequencing", "RESISTANCE -> STRENGTH -> POWER -> TEST per ~4-month block; aerobic & WOD levels 1 -> 4 inside each block"],
        ["4 TRACKS plan shapes (A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING')", "8- and 12-week products only (no 6-week product is written)", "8 wk = 7 loading + deload/test; 12 wk = 6 + 'MID DELOAD' / 'A WEEK LOWER' + 5; weekly set growth +4.75-5.2% (12-wk tracks)"],
    ]))
    A("")
    A("### 2.5 The plyo question, answered from the data")
    A("")
    A("The coach's rule: basketball needs the most plyos, MMA a lot (but less than basketball), boxers and karate athletes not that many. The only fighter program in the workbook (boxing) and the generic athlete example give:")
    A("")
    A(table(["program", "high-amplitude contacts / wk", "low-amplitude / wk", "jump rope (est.)", "high-intensity per session", "athletic share of non-throw sets"], [
        ["MM athletic STARTING (3 d)", "146", "0", "0", "48.7", "28%"], ["MM athletic MID (4 d)", "71", "120", "0", "17.8", "19%"], ["MM athletic ADVANCED (4 d)", "32", "100", "0", "8.0", "15%"],
        ["BOXER wk3-6", "113-129", "177", "~1,080 contacts", "28-32", "36%"], ["BASEBALL B1 / B2 / B3 (block means)", "103 / 151 / 135", "97 / 89 / 66", "0", "26-38", "16-22%"],
        ["BASEBALL single training weeks", "28-201 (8 weeks at 174-201)", "0-196", "0", "7-50", "-"]]))
    A("")
    A("**Reading (INFERRED):** measured as total contacts, the boxer is not low. What makes the boxer's plyo 'small' is (a) zero plyos in the base phase, (b) max-height bilateral jumps limited to 5-rep sets inside complexes, (c) most contacts are low-amplitude, single-leg, stiffness-type (squirrel jumps 'FASTEST SSC', rope) - but 'low-amplitude' is the analyst's label: the coach files squirrel jumps as PLYOS 'ADVANCED' / 'FULL JUMPING', and counted that way the boxer reaches 248-264 high-amplitude contacts/week in wk3-6. The matrix therefore separates **high-amplitude** from **low-amplitude** contacts and places boxing at T3 high-amplitude in its conversion block (OBSERVED) and T2 in fight camp (INFERRED), karate T2, MMA T4, basketball/volleyball T5. If the coach considers the boxer example 'a lot', the whole scale shifts up by one tier (open question 1).")
    A("")
    # ---------------- section 3 rules
    A("## 3. Rules the data implies (INFERRED from OBSERVED) - the profile calculus")
    A("")
    A("1. **One skeleton, many dials.** Keep the coach's slot order and pairing; a sport changes (a) how many athletic slots precede the resistance block and which sub-types they are, (b) sets per slot, (c) which resistance slots are dropped or doubled, (d) exercise selection inside each slot (direction, laterality, plane, implement), (e) conditioning colours, (f) season multipliers.")
    A("2. **Fixed session budget, redistributed** (OBSERVED: BYOP athletic keeps the ~20-set AESTHETICS session size and pays for 4-5 athletic slots by cutting arm/calf isolation and dropping sets per slot from 3 to 2). Athletic profiles spend 35-52% of weekly sets on athletic work; physique 0%.")
    A("3. **Quality first, fast before slow**: plyo -> throw -> COD -> (sprint) -> triple extension -> bilateral -> unilateral -> isolation (OBSERVED in the 8 athletic days of BYOP ATHLETIC + JUSTICE LEAGUE, where core sits on the optional days). BASEBALL Parts A-E put CORE second (ballistics -> core -> OLY -> bilateral -> unilateral + isolation -> buy-out), and MM athletic STARTING puts core first (S3 'Med ball rolls'), second (S2 'Star Supine Cross Connects') and last (S1 'Side Plank presses'), so core position is NOT fixed at the end.")
    A("4. **Separate high-amplitude and low-amplitude plyo dials** (boxer finding above). Within each of the four ballistics columns the coach lists bilateral before unilateral, unweighted before weighted, hop before jump (OBSERVED '(NOT DONE) ALL ABOUT BALLISTICS' rows 24-46, tab marked 'UNDER CONSTRUCTION'); the columns 'TAKING IN FORCES' -> 'DELIVER FORCES FAST' -> 'AMORTIZATION OF FORCES' -> 'REBOUNDING ' sit side by side, so reading them as a time sequence (landings before rebound volume) is INFERRED.")
    A("5. **Upper and lower ballistics on different days** when athletic volume is high (OBSERVED BASEBALL Part A: 'Upper Ballistics/plyo' Mon/Thu, 'LOWER ballistics/plyo' Tue/Fri; MM MID/ADVANCED alternate jump days and medball days).")
    A("6. **Level per slot, not per person** (OBSERVED JUSTICE LEAGUE mixes FOUNDATIONAL landings with ADVANCED power cleans). Population level moves volume down for athletes and up for physique clients (section 2.4).")
    A("7. **Rotational and frontal-plane demand is expressed through exercise selection inside existing slots** (OBSERVED: baseball 'In-out of hip' scoops, Copenhagen, lateral step-ups 'IPSILATERAL loading'), plus core plane rotation by day.")
    A("8. **Sport specificity by removal** (OBSERVED boxer: horizontal pressing, vertical pulling and arm isolation removed after base; baseball: barbell bench never written; fat loss: no plyometrics beyond 'Jumping Jacks' and 'Burpees' inside circuits).")
    A("")
    A("**Generator assembly steps:**")
    A("")
    for s in B.ASSEMBLY: A(s)
    A("")
    A("**Level modifiers (OBSERVED ladders):**")
    A("")
    A(table(["ladder", "evidence", "per step", "rule"], [[k, v["evidence"], "; ".join(f"{a}: {b}" for a, b in v.get("per_step", {}).items()) or "-", v["rule"]] for k, v in B.LEVEL_MODIFIERS.items()]))
    A("")
    # ---------------- section 4 scales
    A("## 4. Tier scales (INFERRED boundaries, OBSERVED anchors)")
    A("")
    sc = D.SCALES
    rows = []
    for key, lab in [("plyo_high_contacts_wk", "high-amplitude plyo contacts / week"), ("plyo_low_contacts_wk", "low-amplitude contacts / week"), ("throws_wk", "medball throws / week"), ("cod_cuts_wk", "planned cuts / week"), ("triple_ext_sets_wk", "triple-extension / Olympic sets / week")]:
        s = sc[key]
        rows.append([lab] + [rng(s[t]) for t in ("T0", "T1", "T2", "T3", "T4", "T5")] + ["; ".join(f"{a} = {fmt(b)}" for a, b in s["anchors"].items())])
    s = sc["sprint_m_wk_at_90pct"]
    rows.append(["sprint metres / week at >90%"] + [rng(s[t]) for t in ("T0", "T1", "T2", "T3", "T4", "T5")] + ["; ".join(f"{a} = {b}" for a, b in s["anchors"].items())])
    A(table(["dial", "T0", "T1", "T2", "T3", "T4", "T5", "observed anchors"], rows))
    A("")
    A("* " + sc["_note"])
    A("* Plane need: " + "; ".join(f"{k} = {v}" for k, v in sc["plane_need"].items()) + ".")
    A("* Resistance rep zones: " + "; ".join(f"**{k}** {v}" for k, v in sc["resistance_rep_zones"].items()) + ".")
    A("* Conditioning colours: " + "; ".join(f"**{k}** {v}" for k, v in sc["conditioning_colours"].items()) + ".")
    A("")
    # ---------------- section 5 matrix
    A("## 5. The sport / goal matrix")
    A("")
    A("Baseline = **off-season build** week. Apply season multipliers (section 7) and the level ladder for other phases. 'Evidence' says whether the weekly SET BUDGET is OBSERVED (copied from a coach program) or INFERRED (analyst set budget, sized to the coach's session budget, with the rationale in section 6). Even on OBSERVED rows, the H/S/P emphasis %, plane-need scores, contact/throw/cut TARGET ranges and core-plane % are analyst classifications (INFERRED) unless a cell reference or 'observed' note is given (the BASEBALL core-plane % and the observed contact/throw counts are OBSERVED).")
    A("")
    A("### 5.1 Dial overview")
    A("")
    rows = []
    for p in PROFILES:
        pl, th, cd, sp, te, rs = p["plyo"], p["throwing"], p["cod"], p["sprint"], p["triple_ext"], p["resistance"]
        em = rs["emphasis_pct"]
        cond = p["conditioning"]
        rows.append([p["name"], (("OBSERVED + INFERRED/ASSUMED parts" if any(w in (p["evidence"] + " " + p.get("weekly_sets_note", "")).upper() for w in ("INFERRED", "ASSUMED", "PARTIAL", "ILLUSTRATIVE")) else "OBSERVED") if p["evidence"].startswith("OBSERVED") else ("INFERRED (observed analog)" if "OBSERVED" in p["evidence"] else "INFERRED")), f"{pl['tier_high']} ({rng(pl['high_contacts_wk'])})", rng(pl["low_contacts_wk"]), f"{th['tier']} ({rng(th['throws_wk'])})",
                     f"{cd['tier']} ({rng(cd['cuts_wk'])}{', reactive' if cd.get('reactive') else ''})", f"{sp['tier']}", f"{te['tier']}", f"{em['hypertrophy']}/{em['strength']}/{em['power']}",
                     fmt(rs["unilateral_pct"]), f"{p['planes']['frontal']}/{p['planes']['transverse']}", "/".join(fmt(p["core"]["plane_pct"].get(k, 0)) for k in ("sagittal", "frontal", "transverse")) if p["core"]["plane_pct"] else "-",
                     " ".join(f"{k}:{fmt(cond.get(k))}" for k in ("A", "B", "C", "LC") if cond.get(k) not in (None, 0)) or "none"])
    A(table(["profile", "evidence", "plyo high tier (contacts/wk)", "plyo low (contacts/wk)", "throws tier (/wk)", "COD tier (cuts/wk)", "sprint", "triple ext.", "resistance emphasis H/S/P %", "lower uni % target", "plane need F/T (0-3)", "core plane % (Sag/Fro/Tra)", "conditioning sessions/wk"], rows))
    A("")
    A("### 5.2 Weekly set budget per category (the encodable recipe)")
    A("")
    cats1 = D.CATS_ATH + D.CATS_RP
    cats2 = D.CATS_ISO + D.CATS_OTHER
    A(table(["profile"] + cats1, [[p["name"]] + [fmt(p["weekly_sets"].get(c, 0)) for c in cats1] for p in PROFILES]))
    A("")
    A("Compare profiles by **contacts / throws / cuts (5.4-5.5), not by set counts** in this table: the OBSERVED boxer's 26 PLYO sets average ~4.6 high-amplitude contacts per set (5-rep jumps inside complexes, 8-rep landings) plus low-amplitude squirrel sets, and its 38 THROW sets are single-throw lines of 10; BASEBALL throw sets are mostly '10/10' per side (~20 throws per set). INFERRED profiles use the nominal reps in section 0.")
    A("")
    A(table(["profile"] + cats2 + ["total", "source"], [[p["name"]] + [fmt(p["weekly_sets"].get(c, 0)) for c in cats2] + [fmt(p["derived"]["weekly_sets_total"]), p["weekly_sets_source"].split(" (")[0]] for p in PROFILES]))
    A("")
    A("### 5.3 Computed weekly shares (from 5.2)")
    A("")
    rows = []
    for p in PROFILES:
        d = p["derived"]; s = d["share_pct"]
        rows.append([p["name"], fmt(d["weekly_sets_total"]), fmt(s["athletic"]), fmt(s["athletic_excl_throws_of_non_throw_sets"]), "/".join(fmt(s["ath_" + k]) for k in D.CATS_ATH), fmt(s["resistance_compound"]), fmt(s["resistance_isolation"]), fmt(s["core"]), fmt(s["focus"]),
                     fmt(d["unilateral_pct_of_lower_compound"]), fmt(d["pull_per_push"]), "/".join(fmt(x) for x in d["knee_hip_sets"]), fmt(d["compound_to_isolation"]), fmt(d["avg_sets_per_main_day_if_all_on_main_days"])])
    A(table(["profile", "weekly sets", "athletic %", "athletic % excl. throws", "PLYO/JLK/THROW/COD/SPRINT/TE %", "compound %", "isolation %", "core %", "focus %", "lower uni %", "pull per push", "knee/hip sets", "compound:iso", "sets per main day (upper bound)"], rows))
    A("")
    A("### 5.4 Plyometrics by profile")
    A("")
    rows = []
    for p in PROFILES:
        pl = p["plyo"]; dd = p["derived"]["nominal_weekly_dose_from_sets"]; tc = p["derived"]["tier_check_from_sets"]
        obsflag = p["weekly_sets_source"].startswith("OBSERVED")
        rows.append([p["name"], f"{pl['tier_high']}: {rng(pl['high_contacts_wk'])}", rng(pl["low_contacts_wk"]), "/".join(fmt(pl["direction_pct"].get(k, 0)) for k in ("vertical", "horizontal", "lateral")) if pl["direction_pct"] else "-",
                     fmt(pl["unilateral_pct"]), fmt(pl.get("landing_pct")), pl.get("phases", "-"), ", ".join(pl.get("tracks", [])) or "-",
                     ("observed: " + pl["observed"]) if pl.get("observed") else f"sets x nominal = {dd['plyo_high_contacts']} high / {dd['plyo_low_contacts']} low ({tc['plyo_high']}/{tc['plyo_low']})"])
    A(table(["profile", "high-amplitude target", "low-amplitude", "vertical/horizontal/lateral %", "unilateral %", "landing %", "force phases", "library tracks", "check"], rows))
    A("")
    A("### 5.5 Throwing, change of direction, sprint, triple extension")
    A("")
    rows = []
    for p in PROFILES:
        th, cd, sp, te = p["throwing"], p["cod"], p["sprint"], p["triple_ext"]
        rows.append([p["name"], f"{th['tier']} {rng(th['throws_wk'])}", " ".join(f"{k[:3]} {v}" for k, v in th.get("plane_pct", {}).items()) or "-", f"{cd['tier']} {rng(cd['cuts_wk'])}; max '{cd.get('max_turn')}'; reactive {'yes' if cd.get('reactive') else 'no'}",
                     f"{sp['tier']} {rng(sp.get('m_wk'))} m; {sp.get('focus', '-')}", f"{te['tier']} {rng(te['sets_wk'])} sets; {te.get('ceiling', '-')}"])
    A(table(["profile", "throws / wk", "throw plane %", "COD", "sprint", "triple extension / Olympic"], rows))
    A("")
    A("### 5.6 Resistance emphasis and computed weekly sets per muscle")
    A("")
    A("Per-muscle sets are COMPUTED from 5.2 with the synthesis muscle-credit map (1.0 prime mover / 0.5 synergist, an analyst convention - INFERRED, not a coach rule; the decodes themselves disagree, e.g. horizontal push credits front delts 1.0 here and in the BYOP decodes but 0.5 in the BASEBALL and MM gym decodes). H/S/P % and 'target sets/muscle/wk' are analyst classifications on every row.")
    A("")
    musc = ["quads", "glutes", "hamstrings", "chest", "lats_upper_back", "front_delts", "side_delts", "rear_delts", "biceps", "triceps", "calves", "abs_obliques", "neck", "forearms_grip"]
    rows = []
    for p in PROFILES:
        rs = p["resistance"]; m = p["derived"]["resistance_sets_by_muscle"]
        rows.append([p["name"], "/".join(str(rs["emphasis_pct"][k]) for k in ("hypertrophy", "strength", "power")), rs["rep_zone"], f"big {rng(rs['sets_big_wk'])}, small {rng(rs['sets_small_wk'])}"] + [fmt(m.get(k, 0)) for k in musc])
    A(table(["profile", "H/S/P %", "rep zone", "target sets/muscle/wk"] + ["quads", "glutes", "hams", "chest", "lats/UB", "front d.", "side d.", "rear d.", "biceps", "triceps", "calves", "abs", "neck", "grip"], rows))
    A("")
    A(table(["profile", "pairing", "priorities", "avoid / remove", "push:pull target"], [[p["name"], p["resistance"].get("pairing", "-"), "; ".join(p["resistance"].get("priorities", [])) or "-", "; ".join(p["resistance"].get("avoid", [])) or "-", p["resistance"].get("push_pull", "-")] for p in PROFILES]))
    A("")
    A("### 5.7 Planes and core")
    A("")
    A(table(["profile", "frontal need", "transverse need", "core slots/wk", "core plane %", "region", "mode"], [[p["name"], p["planes"]["frontal"], p["planes"]["transverse"], p["core"]["slots_wk"], " ".join(f"{k} {v}" for k, v in p["core"]["plane_pct"].items()) or "-", p["core"].get("region", "-"), p["core"].get("mode", "-")] for p in PROFILES]))
    A("")
    A("### 5.8 Conditioning (colour mix per week)")
    A("")
    A(table(["profile", "A (blue)", "B (green)", "C (orange)", "LC", "formats", "evidence"], [[p["name"]] + [fmt(p["conditioning"].get(k, 0)) for k in ("A", "B", "C", "LC")] + ["; ".join(p["conditioning"].get("formats", [])) or "-", p["conditioning"].get("evidence", "-")] for p in PROFILES]))
    A("")
    A("### 5.9 Injury hotspots -> selection rules (codes resolve in section 9)")
    A("")
    A(table(["profile", "hotspot codes (priority order)"], [[p["name"], ", ".join(p["injuries"])] for p in PROFILES]))
    A("")
    A("### 5.10 Position and phase variants")
    A("")
    rows = []
    for p in PROFILES:
        for v in p.get("variants", []):
            dlt = ", ".join(f"{k} {'+' if dv > 0 else ''}{fmt(dv)}" for k, dv in v.get("weekly_sets_delta", {}).items()) or "-"
            extra = ""
            if "derived" in v:
                d = v["derived"]
                extra = f"total {fmt(d['weekly_sets_total'])}; athletic {fmt(d['share_pct']['athletic'])}%"
                if not p["weekly_sets_source"].startswith("OBSERVED"):
                    extra += f"; plyo high ~{d['nominal_weekly_dose_from_sets']['plyo_high_contacts']}"
            rows.append([p["name"], v["name"], v["evidence"], dlt, extra or "-", "; ".join(v.get("notes", []))])
    A(table(["profile", "variant", "evidence", "weekly set delta vs base", "computed", "notes"], rows))
    A("")
    if any("base_phase_weekly_sets" in p for p in PROFILES):
        bx = next(p for p in PROFILES if p["id"] == "boxing")
        A("Boxer base phase (OBSERVED wk1-2): " + ", ".join(f"{k} {fmt(v)}" for k, v in bx["base_phase_weekly_sets"].items()) + ".  CrossFit power month (OBSERVED SEPT): " + ", ".join(f"{k} {fmt(v)}" for k, v in next(p for p in PROFILES if p["id"] == "crossfit_competitor")["power_month_weekly_sets"].items()) + " (plus aerobic L4 + WODs L4 + TEST).")
        A("")
    # ---------------- section 6 cards
    A("## 6. Profile cards (rationale, template, season overrides, what to confirm)")
    A("")
    for p in PROFILES:
        A(f"### {p['name']}  (`{p['id']}`)")
        A("")
        A(f"* **Evidence:** {p['evidence']}")
        A(f"* **Template:** {p['template']}")
        A(f"* **Days:** {p['days'].get('main')} main + {p['days'].get('optional', 0)} optional" + (f" ({p['days']['note']})" if p['days'].get('note') else ""))
        A(f"* **Weekly sets source:** {p['weekly_sets_source']}" + (f"; {p['weekly_sets_note']}" if p.get('weekly_sets_note') else ""))
        A(f"* **Why (INFERRED unless stated):** {p['rationale']}")
        if p["plyo"].get("notes"): A(f"* **Plyo notes:** {p['plyo']['notes']}")
        if p["throwing"].get("notes"): A(f"* **Throw notes:** {p['throwing']['notes']}")
        if p["cod"].get("notes"): A(f"* **COD notes:** {p['cod']['notes']}")
        if p.get("season_overrides"): A(f"* **Season overrides:** " + "; ".join(f"{k}: {json.dumps(v, ensure_ascii=False) if isinstance(v, dict) else v}" for k, v in p["season_overrides"].items()))
        if p.get("science"): A(f"* **SCIENCE:** " + "; ".join(p["science"]))
        if p.get("confirm"): A(f"* **Confirm with coach:** " + " ".join(p["confirm"]))
        A("")
    # ---------------- section 7/8 season
    A("## 7. Season families (phase multipliers on the baseline)")
    A("")
    for fam, f in D.SEASON_FAMILIES.items():
        A(f"### {fam} - {f['applies_to']}")
        A("")
        A(table(["phase", "weeks", "multipliers", "rules", "evidence"], [[ph["phase"], fmt(ph.get("weeks", "-")), ", ".join(f"{k} {v}" for k, v in ph.get("multipliers", {}).items()) or "-", "; ".join(ph.get("rules", [])), ph.get("evidence", "-")] for ph in f["phases"]]))
        A("")
    A("Per-sport overrides on top of the family multipliers are in each profile card (section 6) and in `profiles[].season_overrides` in the JSON. The key INFERRED override: jump- and run-dominant team sports (basketball, volleyball, soccer, football) cut gym plyos to x0.3-0.5 in season because games and practice supply the contacts, but keep one max-velocity sprint exposure per week for hamstring protection.")
    A("")
    # ---------------- section 9 injuries
    A("## 8. Plan length shapes (OBSERVED, apply to every profile)")
    A("")
    A(table(["plan", "shape", "source"], [["6 weeks", "first 6 weeks of the 12-week shape, ending at the wave peak (WK6 column highlighted FFF2CC)", "INFERRED from 4 TRACKS STRENGTH-12"],
                                         ["8 weeks", "7 progressive weeks + week 8 'DELOAD WEEK' / 'TEST'", "OBSERVED AESTHETICS-8, STRENGTH-8, CONJUGATE, CrossFit class"],
                                         ["12 weeks", "6 weeks + week 7 deload ('MID DELOAD' / 'A WEEK LOWER') + 5 weeks with a phase change; peak in week 12", "OBSERVED STRENGTH-12, AESTHETICS-12"],
                                         ["athlete 8-week build", "2-week base + 6-week conversion in 2-week steps, week 7 mini-deload, week 8 peak", "OBSERVED boxer"],
                                         ["athlete season block", "8-week grids per season block, pre-season ends with a deload week", "OBSERVED BASEBALL"]]))
    A("")
    A("## 9. Injury hotspot library (selection rules)")
    A("")
    A(table(["code", "evidence", "sports", "source / mechanism", "generator rules"], [[k, v["evidence"], ", ".join(v.get("sports", [])) or "all", v.get("source", "-"), "; ".join(v["rules"])] for k, v in D.INJURY_LIBRARY.items()]))
    A("")
    A("## 10. Library and template gaps the profiles need (OBSERVED absence)")
    A("")
    A(table(["gap", "evidence", "needed by"], [[g["gap"], g["evidence"], g["needed_by"]] for g in B.GAPS]))
    A("")
    A("## 11. Open questions for the coach")
    A("")
    for i, q in enumerate(QUESTIONS, 1): A(f"{i}. {q}")
    A("")
    A("## 12. Sources (SCIENCE)")
    A("")
    for rid, txt, url in B.REFS: A(f"* [{rid}] {txt}: [{url}]({url})")
    A("")
    A("Coach sources (OBSERVED) are the decoded tabs named in each row; the program decode files are `analysis/programs/prog_*.md` and `prog_*.volume.json`, the library decodes `analysis/library/L1-L4_*`, and the reference decodes `analysis/reference/*`.")
    A("")
    A("## Verification log")
    A("")
    A(VERIFICATION_LOG_INTRO)
    A("")
    A("**Independent recomputations (python on the dumps / decode entries):**")
    A("")
    for x in VERIFICATION_RECOMPUTED: A("* " + x)
    A("")
    A("**Corrections:**")
    A("")
    for x in VERIFICATION_LOG: A("* " + x)
    return "\n".join(L)

def build_json():
    return {
        "_meta": {"deliverable": "04 athlete & goal profiles", "generated": "2026-10-07", "verified": "2026-10-08", "companion_md": "04_athlete_profiles.md",
                  "inputs": ["analysis/programs/*.volume.json", "analysis/programs/*.md", "analysis/library/*", "analysis/reference/*", "analysis/equipment/prog_byop_equipment.md"],
                  "read_only": "no Google Sheet was modified",
                  "evidence_tags": {"OBSERVED": "read from the coach's sheets", "INFERRED": "analyst reasoning, to be confirmed", "SCIENCE": "external literature, see references"},
                  "unit": "working sets per week (component sets inside complexes; 1 medball throw line = 1 set; per-side = 1 set); conditioning in sessions per week by colour",
                  "baseline_phase": "off-season build week; apply season_families multipliers and level_modifiers"},
        "headline_findings": HEADLINES,
        "categories": D.CAT_LABELS, "muscle_credit_map": D.CREDIT, "nominal_reps_per_set": {k: {"reps": v[0], "basis": v[1]} for k, v in D.NOMINAL.items()},
        "scales": D.SCALES, "observed_populations": OBS,
        "observed_baseball_mix_per_training_week": {
            "B1": {"high": 102.6, "low": 96.6, "vertical": 146.6, "horizontal": 38.3, "lateral": 14.3, "unilateral": 70.6, "landing": 14.3, "throws_sagittal": 97.9, "throws_transverse": 80.0, "core_frontal": 2.1, "core_sagittal": 3.1, "core_transverse": 5.6},
            "B2": {"high": 151.4, "low": 89.3, "vertical": 200.4, "horizontal": 28.9, "lateral": 11.4, "unilateral": 97.7, "landing": 12.9, "throws_sagittal": 70.6, "throws_transverse": 121.7, "core_frontal": 3.7, "core_sagittal": 3.1, "core_transverse": 7.3},
            "B3": {"high": 135.1, "low": 66.2, "vertical": 134.1, "horizontal": 35.5, "lateral": 31.8, "unilateral": 78.4, "landing": 12.6, "throws_sagittal": 69.8, "throws_transverse": 106.5, "core_frontal": 3.6, "core_sagittal": 4.2, "core_transverse": 8.1},
            "all_weeks_pct": {"vertical": 74.7, "horizontal": 16.1, "lateral": 9.3, "unilateral": 38.5, "landing": 6.2, "low_amplitude": 39.0, "throws_transverse": 56.6, "core_transverse": 48.4, "core_sagittal": 24.4, "core_frontal": 21.9}},
        "level_modifiers": B.LEVEL_MODIFIERS, "assembly_rules": B.ASSEMBLY,
        "plan_length_shapes": {"6": "first 6 weeks of the 12-week shape (INFERRED)", "8": "7 loading + deload/test (OBSERVED)", "12": "6 + deload wk7 + 5 with phase change (OBSERVED)", "athlete_8_build": "2 base + 6 conversion, 2-week steps, wk7 mini-deload, wk8 peak (OBSERVED boxer)"},
        "season_families": D.SEASON_FAMILIES, "injury_library": D.INJURY_LIBRARY, "profiles": PROFILES, "library_gaps": B.GAPS,
        "open_questions": QUESTIONS, "references": [{"id": r[0], "claim": r[1], "url": r[2]} for r in B.REFS],
        "verification_log": {"intro": VERIFICATION_LOG_INTRO, "recomputed": VERIFICATION_RECOMPUTED, "corrections": VERIFICATION_LOG},
    }

if __name__ == "__main__":
    md = build_md()
    open(OUT_MD, "w").write(md)
    js = build_json()
    json.dump(js, open(OUT_JSON, "w"), indent=1, ensure_ascii=False)
    print(OUT_MD, len(md.splitlines()), "lines", len(md), "chars")
    print(OUT_JSON, os.path.getsize(OUT_JSON), "bytes")
    nvar = sum(len(p.get("variants", [])) for p in PROFILES)
    print("profiles", len(PROFILES), "variants", nvar)
