"""Assemble synthesis/10_equipment_model.json from the computed layer (build_10_equipment_model.py -> _computed.json) plus the
hand-authored model.  Every coach label is quoted verbatim with tab!cell.  Status labels:
  COACH-ANSWER  the coach's own written answers (coach_answers.md, 2026-10-08) - AUTHORITATIVE, override sheet inferences
  OBSERVED      read from a workbook cell (tab!cell; 'MM' = MASTER MODEL; bare library cells = BYOP 'MASTER EXERCISE LIBRARY')
  COACH-CHAT    the coach's spoken words relayed in the brief
  SCIENCE       published finding; [S#] ids point to synthesis/10b_equipment_variables_science.md section 12
  INFERRED      analyst derivation
Run:  .venv/bin/python synthesis/_build_10/build_10_equipment_model.py && .venv/bin/python synthesis/_build_10/build_10_assemble.py
"""
import json, os, re, runpy, collections

HERE = os.path.dirname(os.path.abspath(__file__))
G = runpy.run_path(os.path.join(HERE, 'build_10_equipment_model.py'))
C = json.load(open(os.path.join(HERE, '_computed.json')))
PROFILES, PROFILE_ORDER, SLOT_META, KIT_TOKENS = G['PROFILES'], G['PROFILE_ORDER'], G['SLOT_META'], G['KIT_TOKENS']
items = C['items']
cell_name = {it['cell']: it['name'] for it in items}
S = C['impl_stats']
P = C['pop_stats']
LT = C['level_test']


def cn(cell):
    return "'%s' %s" % (cell_name[cell], cell)


# =============================================================================================
# (1) IMPLEMENT TAXONOMY
# =============================================================================================
IMPLEMENT_GROUPS = {
    'MACHINE_GUIDED': 'Fixed path plus seat/pads: the most reference points ("you sit down, feet on the ground, move your hands or feet", COACH-CHAT). The machine does the stabilising work (COACH-ANSWER CAT-04). Constraint 4-5.',
    'CABLE': 'Free line of pull, constant tension; the cable takes part of the stabilising work (COACH-ANSWER CAT-04). Constraint 3 (standing) to 4 (seated/supported).',
    'FREE_BAR': 'Barbell family: one rigid bar, fixed grip, highest load ceiling, most skill ("Barbells are more skilled", COACH-CHAT). The only implement that loads zone 3 BEHIND the body (back squat, good morning). Constraint 2.',
    'FREE_HANDHELD': 'Dumbbells, kettlebells, plates, sandbag: split grip, unilateral/offset loading; one implement is enough for contra/ipsilateral work. Reach zones 1-3 but not behind the body. Constraint 2-3.',
    'BALLISTIC_IMPLEMENT': 'Medicine ball, slam ball: released at speed. Constraint 1 (standing) to 3 (sit-up throws).',
    'BODYWEIGHT_APPARATUS': 'Pull-up/dip bars, TRX/rings, stability ball, sliders: let bodyweight carry a pattern.',
    'REFERENCE_PROPS': 'Boxes, benches, steps, walls, and plates/hurdles/cones used as targets: they set depth, ROM, height or a target, not load.',
    'FIELD_SPACE': 'Open space (10-20 m, 40-60 m+), track, turf.',
    'CARDIO_MACHINES': 'Bike, rower, ski erg, treadmill.',
}
IZ = C['impl_zone']
IMPLEMENTS = {
    'machine_selectorized': dict(
        group='MACHINE_GUIDED', kit_tokens=['machine_selectorized', 'cable_attachments'], constraint_typical='4-5',
        library_stats=dict(resistance_machine_class=S['res:machine']), skill='low (0% of 46 machine entries rated high skill)', stability_demand='low (external)',
        zones_reachable='machine sets the position (pulldown zone 3, row/chest press zone 2); stabilisation is provided, so the zone costs less',
        load_ceiling='moderate-high for the target muscle, low systemic', velocity_role="controlled; can carry FAST intent (see machine_plate_loaded)",
        roles=['ON_RAMP (upper-body pulls: lat pulldowns U9-U14, assisted pull-up machine U16-U18, machine rows X9-X11, all FOUNDATIONAL)',
               'ISOLATION (the only options of the LEG EXTENSIONS AM9 and LEG CURLS AR9/AR10 slots; Machine Calf Raises AU13)'],
        library_examples=[cn('U9'), cn('U17'), cn('AM9'), cn('AR9'), cn('AR10'), cn('AU13')],
        coach_evidence=['COACH-CHAT: machines "have a lot of reference points / constraints ... You can push a lot, and it\'s safer"; "For people who want to go up in volume, people with injuries, or older people, more machines are usually better"',
                        "COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work'",
                        "OBSERVED: VERTICAL PULL FOUNDATIONAL is 9/12 machine (U9-U18); ADVANCED is 7/7 strict/weighted pull-ups (U46-U52)",
                        "OBSERVED: PPL NOVICE gets 'Cable Lat pulldown' (MM EXAMPLE PUSHPULLLEGS SPLIT!C28) while NEWBY/INTERMEDIATE get 'Pull ups or Cable Lat pull down' (G28/K28)"],
        observed_program_share='gen-pop MM items ~18% machine; athletes 0.5% (5 items); BYOP aesthetics pools machine+cable 31%, athletic 18%',
        generator_rules=['ON_RAMP for upper-body pulls of beginners; default constraint-4/5 option for older/injured/high-volume clients, for compounds AND isolation (COACH-ANSWER EQ-03: "I\'d rather they collect that volume in a safe place with more constraints"; CR-10, CR-12, CR-14, CR-33).',
                         "Seated machine shoulder press (ADD-EQ05, COACH-ANSWER EQ-05) gives the vertical push a constraint-5 option for older and injured clients.",
                         'Isolation machines go last in the session; MYO sets only here (CR-23).']),
    'machine_plate_loaded': dict(
        group='MACHINE_GUIDED', kit_tokens=['machine_plate_loaded'], constraint_typical='4 (hack) - 5 (leg press, seated on a back pad)',
        skill='low', stability_demand='low', zones_reachable='n/a (load through the feet, trunk supported)', load_ceiling='high (local)',
        velocity_role="controlled by default; the coach also writes 'LEG PRESS' with 'FAST RPE6 or about 60-70%' (MM (NOT DONE) 4 TRACKS PROGRAMMING!O17)",
        roles=['VOLUME_TOOL (library files them in BILATERAL KNEE DOMINANT ADVANCED AI97:AI99 and MODERATE AI52; operative level FOUNDATIONAL per CAT-04)'],
        library_examples=[cn('AI98'), cn('AI97'), cn('AI52')],
        coach_evidence=["OBSERVED ALL ABOUT SQUATS!G35:I35 LEG PRESS 'LOVE IT': 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure'",
                        "OBSERVED ALL ABOUT SQUATS!G37:I37 HACK SQUAT \"I PERSONALLY DON'T LIKE IT\" - superseded for the generator by COACH-ANSWER EQ-11: 'if the hack squat that you have in your gym works and you feel it is good, then that's great'",
                        "OBSERVED MM 4 TRACKS!W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (the intensity technique sits on the machine, last)",
                        "OBSERVED BYOP AESTHETICS - FULL BODY - 4 DAYS!D4 'Leg press' filled in the 'Bilateral KD' slot"],
        generator_rules=["No ranking (COACH-ANSWER EQ-11: 'I don't want to rank them because they have different brands, angles'). Leg press (seated, back pad, constraint 5) and hack squat (back and shoulder pads, fixed path) are the MOST constrained squat machines, more than the Smith machine (EQ-11). Choose by constraint fit, spine loading (CR-29) and what the client feels (EQ-10/EQ-11).",
                         "Missing machine: swap first (EQ-08), else 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42)."]),
    'machine_specialty': dict(
        group='MACHINE_GUIDED', kit_tokens=['machine_specialty'], constraint_typical='4', skill='low', stability_demand='low', load_ceiling='high (local)',
        roles=['VOLUME_TOOL'], library_examples=[cn('AI99'), cn('AN51')],
        coach_evidence=["OBSERVED ALL ABOUT SQUATS!G41:I41 PENDULUM 'LOVE IT': 'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these'",
                        "OBSERVED BILATERAL HIP DOMNANT MODERATE holds 'Hip Thrust Machine', 'Machine Good Mornings', 'GHD', 'Hyper extensions ' (plus the machine leg curls now moved to LEG FLEXION)"],
        generator_rules=['One of the knee-dominant machine options when available (FULL_GYM, FULL_FACILITY); not ranked above the others (EQ-11). Pendulum: back and shoulder pads, arc path (constraint 4).']),
    'belt_squat': dict(
        group='MACHINE_GUIDED', kit_tokens=['belt_squat'], constraint_typical='4', skill='low', stability_demand='low', load_ceiling='high (local)',
        zones_reachable='1 (load hangs from a hip belt, below the trunk)', roles=['VOLUME_TOOL', 'AXIAL-SPARING squat (CR-29)'],
        library_examples=["'Belt Squat' ADD-EQ11 (not in the library; coach-named)"],
        coach_evidence=["COACH-ANSWER EQ-11: 'Belt squats are for people that you don't need to load them axially, so it won't be a load on their back ... If you have an athlete that already has been loaded on their back that week or a couple of weeks and they're sore, then you might want to switch over to the belt squat'",
                        "COACH-ANSWER PER-04: squat once a week and use the leg press (or belt squat) on the other day so the spine is not loaded twice"],
        generator_rules=['Second knee-dominant exposure of the week when the first one loaded the spine (CR-29); swap in when the client is sore from back-loaded work (EQ-11).', 'Ask about it at intake (gym add-on); FULL_FACILITY has one.']),
    'smith': dict(group='MACHINE_GUIDED', kit_tokens=['smith'], constraint_typical='4', skill='low', stability_demand='low',
                  library_examples=["'Inverted Rows' X13 (smith as one of the bar options)", "'Incline reverse pushup (rings/trx/barbell/smith machine)' RP!G64"],
                  coach_evidence=["COACH-ANSWER EQ-11: 'If a Smith machine feels good, that's great ... Less constraint would be a Smith machine' (than hack squat and leg press)", "OBSERVED 'SQUATS SMITH MACHINE' in MM FAT BURN (05 session architecture)."],
                  science='Smith squat 1RM above the free squat; Smith bench below free bench (Cotterman 2005 [S6]).',
                  generator_rules=['Constraint 4 but the LEAST constrained squat machine (trunk unsupported, EQ-11); use it when it feels good to the client.', 'Also a bar for inverted rows and a seated constraint-4 shoulder press for older/injured clients when there is no press machine.']),
    'hip_back_apparatus': dict(group='MACHINE_GUIDED', kit_tokens=['ghd', 'hyper_bench', 'reverse_hyper'], constraint_typical='4', skill='low-moderate',
                               library_examples=["'GHD' AN48/AN93", "'Hyper extensions ' AN55", "'Reverse Hyper Extension' AN11"],
                               coach_evidence=["OBSERVED MM BASEBALL!CY34 '45 degree hyper-extension machine' is one of only 5 machine items in 949 athlete items",
                                               "COACH-ANSWER EQ-11: 'The GHD reverse hyper is also if they're available and if they feel good doing them ... I want them to feel the right muscles. I want them to get the right stimulus.'",
                                               "COACH-ANSWER LIB-08: GHD - 'no levels on this'"],
                               generator_rules=["Offer GHD / reverse hyper / back extension only when available; keep them only if the client feels the target muscles (EQ-11).", "GHD has no level (LIB-08): AN48 and AN93 are one option, level 'any'."]),
    'cable': dict(group='CABLE', kit_tokens=['cable', 'cable_attachments'], constraint_typical='3 (standing) - 4 (seated pulldown, leaning raise)',
                  library_stats=dict(cable=S['res:cable'], cable_or_band=S['res:cable/band']), skill='low (0% high)', stability_demand='low-moderate',
                  zones_reachable='all three (the pulley height sets the zone): the coach writes it into the name, \'Cable Machine Curls (Zone1, Zone 2, Zone 3\' (AS12) and Sheet23 \'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)\' (AP6)',
                  load_ceiling='moderate', velocity_role="controlled; also 'powerful turns' ('Cable rotational oblique twist' MM BASEBALL!W30)",
                  roles=['RESISTANCE (pulldowns, rows, presses, flies)', 'ISOLATION (44% of TRICEP options AT)', 'CORE / FBS (all 17 FUNCTIONAL BIOMECHANICS SYSTEM items are written cable OR band; v1 keeps the cable route of 9 and drops the 8 knee-banded ones, EQ-01)', 'ROTATIONAL POWER without a medball (fast cable rotations, COACH-ANSWER EQ-07)'],
                  library_examples=[cn('AD9'), "'Cable Machine UL Rows' X92", "'Cable tricep push downs' AT17", "'Cable Machine Oblique Rotations' O93"],
                  coach_evidence=["COACH-ANSWER CAT-04: cables make an exercise easier because the cable does part of the stabilising",
                                  "OBSERVED 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' (MM EXAMPLE ATHLETIC FULL BODY SPLI!C16): cable -> band -> bodyweight/DB ladder (v1 uses the cable and Bird Dog routes only)"],
                  generator_rules=["No band stands in for a cable (COACH-ANSWER EQ-01 'I don't program anything with bands'; EQ-07 'Band chops are, to me, worthless'): without a cable use the DB/KB, bodyweight or other non-band substitutes of the slot.", 'Zone is a free variable on a cable: change pulley height between blocks (one small variable).']),
    'barbell': dict(group='FREE_BAR', kit_tokens=['barbell', 'rack', 'weight_plate'], constraint_typical='2',
                    library_stats=dict(resistance_barbell_family=S['res:barbell-family'], triple_extension_barbell=S['ath:barbell']),
                    skill='high (45% of barbell-family resistance entries rated high skill)', stability_demand='high (51%)', load_ceiling='highest',
                    zones_reachable='1 (deadlift, hang pulls, zercher), 2 (front rack, bench, rows), 3 (overhead) and 3-behind (back squat, good morning, barbell calf raise) - the only implement that loads behind the body',
                    velocity_role="slow when heavy ('HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS', ALL ABOUT SQUATS!A44:A45); fast only in Olympic lifts and light 'same speed' / dynamic-effort sets (no bands or chains, EQ-12)",
                    roles=['STRENGTH (all 18 absolute-strength library entries are barbell, hex or weighted-bodyweight compounds)', 'POWER-STRENGTH (16/16 strength-speed rows of TRIPPLE EXTENSION C12:C96)'],
                    coach_evidence=['COACH-CHAT "Barbells are more skilled"',
                                    "COACH-ANSWER CAT-04: 'barbell front squat' = intermediate (load on the body), 'barbell back squat' = advanced (load behind the body)",
                                    "OBSERVED pain rule: 'getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips)' (MM EXAMPLE UPPERLOWER SPLIT!A7)",
                                    "OBSERVED: in every RESISTANCE PATTERNS colour block with DB and barbell twins the barbell is the same or harder colour (RP!E12 yellow vs E13 red)"],
                    observed_program_share='barbell share of MM line items (prog_mm decode): hybrid 41%, strength 37%, CrossFit 32% (49/154; barbell is the only loaded implement CrossFit names - the rest is cardio, WOD, pull-up bar/wall or unspecified; the lib_resistance_notes keyword scan counts it as 96% of implement-word cells), gen pop 18%, athletes 13%',
                    generator_rules=['Main bilateral lifts for strength, hybrid and athletic goals; remove first under a pain flag (CR-12).',
                                     "Bumper-only lifts (Power Snatch C91, Power Clean & Jerk C93, 'Squat Snatch' C94, 'Squat Clean & Jerk' C96 - LIB-07 names) require barbell_bumpers_platform; without bumpers use hang pulls and hang cleans lowered under control (ATH-10).",
                                     "Never for older, injured or high-volume clients: overhead squat, snatch, low-bar back squat (COACH-ANSWER EQ-03).",
                                     "A heavy barbell squat loads the spine: one axial squat day per week, the other squat day on a leg press or belt squat (COACH-ANSWER PER-04, CR-29); deadlifts load it too (PER-04)."]),
    'hex_bar': dict(group='FREE_BAR', kit_tokens=['hex_bar'], constraint_typical='2', skill='low-moderate', stability_demand='moderate', load_ceiling='high',
                    zones_reachable='1 only (load at the sides) - which is why it is the easiest bar',
                    velocity_role="jumpable: 'Hex bar squat jumps' (MM BASEBALL!S33), 'Hex bar squat to calf raise' C11",
                    coach_evidence=["OBSERVED squat loading ladder: 'Hex Bar Squat' = 'EASIEST' (ALL ABOUT SQUATS!A10:A11)"],
                    science='Hex-bar jumps give more power than barbell-on-back jumps; peak power ~20% of squat 1RM (Swinton 2012 [S45]).',
                    generator_rules=['Default loaded-jump and beginner squat/deadlift bar where available; specialty item (absent in BASIC_GYM).', "Hex-bar jumps are one of the beginner Olympic-lift options (COACH-ANSWER ATH-10); load 10-20% of body weight for jumps (EQ-15)."]),
    'ez_bar': dict(group='FREE_BAR', kit_tokens=['ez_bar'], constraint_typical='2', skill='low', library_examples=[cn('AS9')],
                   coach_evidence=["OBSERVED 'Ez bar curls or barbell' x8 (MM 4 TRACKS)"]),
    'ssb': dict(group='FREE_BAR', kit_tokens=['ssb'], constraint_typical='2', zones_reachable='on the back with handles in front; the coach ranks it with the front squat',
                coach_evidence=["OBSERVED 'Front Squat/ SSB Bar' = 'HARD' (ALL ABOUT SQUATS!E10:E11)"]),
    'landmine': dict(group='FREE_BAR', kit_tokens=['landmine', 'barbell'], constraint_typical='3 (arc path)', skill='low-moderate',
                     zones_reachable='1-2 (held in front, arc path)',
                     coach_evidence=["OBSERVED 'Landmine Squat' green (RP!A16)", "OBSERVED 'LAndmine half kneeling press' (MM BASEBALL!M34)"],
                     library_examples=["'Landmine Squats' AI16", "'Landmine Hack Squat ' AI56", "'Kneeling Landmine Press' AA93 (the only fixed-arc press in VERTICAL PUSH)"]),
    'dumbbell': dict(group='FREE_HANDHELD', kit_tokens=['dumbbell'], constraint_typical='2-3', library_stats=dict(DB_KB=S['res:DB/KB'], plyo_db=S['ath:dumbbell']),
                     skill='low-moderate (4% high)', stability_demand='moderate (22% high)', load_ceiling='moderate',
                     zones_reachable='1 (suitcase, goblet, deadlift), 2 (front rack on the shoulder, bench, rows), 3 (overhead); not behind the body',
                     velocity_role="controlled by default; light DBs for loaded jumps ('DB repeat squat jumps' G139, 'DB Squat Jumps' MM BASEBALL!D33)",
                     roles=['SPLIT-GRIP default under pain', 'UNILATERAL/OFFSET loading (contra/ipsilateral needs one DB)', 'SMALL-MUSCLE default (8/12 side raises, 9/14 biceps, 4/9 triceps)'],
                     coach_evidence=["OBSERVED 19 DB/Barbell twin pairs in the library ('DB Push press'/'Barbell push press' AA11/AA12 ...)",
                                     "OBSERVED 'Deadlifts (DB or Barbell)', 'Bench Press (DB or Barbell)', 'Overhead Press (DB or Barbell)' (MM EXAMPLE UPPERLOWER SPLIT!C18/C29/C31)"],
                     observed_program_share='most-used implement in every population: gen pop 33% of items, athletes 29%, strength 35%',
                     generator_rules=['The single biggest unlock for home clients (see intake add-on ranking).', 'Barbell -> DB load conversion: each DB ~0.40 x barbell load for the first exposure (10b EQ-6).',
                                      "Default implement for a name with none (lunges, deadlifts, rows, calf raises): bodyweight -> DB -> barbell as the client's level rises, limited by the kit (COACH-ANSWER EQ-09, CR-30).",
                                      "DB snatches and cleans are beginner Olympic-lift options (COACH-ANSWER ATH-10)."]),
    'kettlebell': dict(group='FREE_HANDHELD', kit_tokens=['kettlebell'], constraint_typical='1 (swing) - 2', skill='moderate', load_ceiling='low-moderate (coarse jumps)',
                       zones_reachable='1 (deadlift, swing start, goblet), 2 (front rack: \'Double front rack kb squat\' AI51), 3 (press)',
                       velocity_role="ballistic hinge: 'SPEED SPECIALS' 'Russian kb swing' / 'American kb swing' (RP!A77:A79); 'Fast KB swings' (MM BASEBALL!AI51)",
                       coach_evidence=["OBSERVED 'db or kb' written as interchangeable (RP!C24, G66; 'Goblet KB/DB Squats' AI11)", "OBSERVED 'Kb rotation swings no hip thrust' (CONTROL PATTERNSCORE!B16)"],
                       science='6 weeks of KB swings ~ jump-squat training for half-squat 1RM and vertical jump (Lake & Lauder 2012 [S47]).',
                       generator_rules=['Home power-strength fallback for the Tripple Extension slot (KB swing / KB squat clean).', "KB snatches and cleans are beginner Olympic-lift options (COACH-ANSWER ATH-10).", "Two bells from the floor = the 'Kong row' (LIB-09): a low-stimulus row for shoulder or back pain."]),
    'weight_plate_sandbag': dict(group='FREE_HANDHELD', kit_tokens=['weight_plate', 'sandbag'], constraint_typical='2-3', zones_reachable='1 (hugged, reach forward)',
                                 coach_evidence=["OBSERVED 'Plate reach forward squat' (RP!A10, green)", "OBSERVED 'heavy plate russian twists' (MM BASEBALL!I48)", "'Sandbag Hip Thrusts' AN16", "COACH-ANSWER LIB-19: sandbag is one of the carry implements"],
                                 generator_rules=['A plate laid flat is also a plyo TARGET (plate hops G46:G52), not a load.']),
    'medball': dict(group='BALLISTIC_IMPLEMENT', kit_tokens=['medball', 'partner_or_wall'], constraint_typical='1 standing/stepping; 2 half-kneeling or back-to-wall; 3 sit-up throws',
                    library_stats=dict(throwing=S['ath:medball']), skill='low', stability_demand='low', load_ceiling='low by design',
                    zones_reachable='1 (hug, scoop start), 2 (chest pass), 3 (overhead throw, slam start)',
                    velocity_role='the fastest loaded implement: speed-strength',
                    roles=['THROWING (20/20 options of K7:K87)', "WARM-UP load position ('DYNAMIC MEDBALL WARMUP DRILLS' ALL ABOUT BALLISTICS!A4: 'Reach forward', 'Reach UP', 'front hold', 'hug goblet')", 'CORE load'],
                    coach_evidence=['COACH-CHAT: "Med ball upper body passes/rotations should be light - 8-10 lb" so force is produced with speed',
                                    "COACH-ANSWER EQ-06: slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients - RIGHT; 'the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or ... wall balls ... I don't think there's any need for anything more than 20 lbs.'",
                                    "COACH-ANSWER ATH-05: 'I don't really need any med ball throwing for aesthetics ... That might be something for warming up, but it's not something in the main workout.'",
                                    "OBSERVED 'this but hugging a light medball' (MM EXAMPLE ATHLETIC FULL BODY SPLI!K13)",
                                    "OBSERVED medball cheat sheet dose 1 x 10 per throw, 1 x 20 for the two sit-up throws, no load written (ALL ABOUT BALLISTICS!A53:B71)",
                                    'OBSERVED: 0 cells in either workbook contain lb, lbs, kg or pound'],
                    observed_program_share='athletes 13% of items (EXAMPLE ATHLETIC 19% of implement cells; MID OFF SEASON 46%); gen pop 0%',
                    generator_rules=['Weight by throw type and person: load_velocity.medball_rule (never over 20 lb, EQ-06).', 'No throwing in the main workout for aesthetics / bodybuilding clients - warm-up drills only (ATH-05, CR-34).',
                                     "No medball -> the Throwing slot has 0 as-written options; use the coach's substitutes (plyo push-ups, fast cable rotations, the no-ball 'fake medball slam'; never band chops, EQ-07) and add the ball to the buy list."]),
    'slam_ball': dict(group='BALLISTIC_IMPLEMENT', kit_tokens=['slam_ball'], constraint_typical='1',
                      library_examples=["'Rotational Floor side to side slams' K16", "'Rotational Downward Slam Throw' K28", "'Overhead throw' K10 (or a wall)"],
                      coach_evidence=["OBSERVED 'Side to side shuffle floor slam (height matters)' (ALL ABOUT BALLISTICS!C80)", "COACH-ANSWER EQ-06: slams 10-20 lb (slam ball) - RIGHT"]),
    'pullup_bar_dip_bars': dict(group='BODYWEIGHT_APPARATUS', kit_tokens=['pullup_bar', 'dip_bars', 'dip_belt'], constraint_typical='1 (hanging) - 2',
                                library_stats=dict(hanging_core=S['ath:pullup_bar']), skill='high for strict/weighted pull-ups',
                                zones_reachable='3 (hanging, arms overhead); dips = hands low with the shoulders behind the body (tagged zone 3-behind, ambiguous)',
                                coach_evidence=["OBSERVED vertical-pull ladder 'Lat pull downs' (RP!E61:E67) -> 'Assisted pull up machine' (E68:E70) -> 'Strict pull ups' (E71:E74) -> 'Weighted Pull ups' (E75)"],
                                generator_rules=['The only route to a true vertical pull at home (no band pulldowns, EQ-01); also unlocks hanging core (O15, O16, O130, O209).',
                                                 "Part of the coach's ideal home kit with DBs, a bench and an 8-10 lb medball (COACH-ANSWER EQ-02).",
                                                 'Regressions without bands: negatives / flexed-arm hang, foot-assisted pull-ups (feet on a box), assisted pull-up machine in a gym.']),
    'trx_rings': dict(group='BODYWEIGHT_APPARATUS', kit_tokens=['trx', 'rings'], constraint_typical='2-3',
                      library_examples=["'TRX Rows' X12", "'Seated Pull ups with Rings or TRX' U19", "'TRX Bicep Curls' AS19"],
                      coach_evidence=["OBSERVED 'Incline reverse pushup (rings/trx/barbell/smith machine)' (RP!G64)"],
                      generator_rules=['Cheapest single item that fills horizontal pull, vertical pull and biceps for travel/home clients.']),
    'stability_ball_slider_foam_roller': dict(group='BODYWEIGHT_APPARATUS', kit_tokens=['stability_ball', 'slider', 'foam_roller'], constraint_typical='2-4',
                                              coach_evidence=["OBSERVED 'Foam roller or swiss ball wall assisted goblet' (RP!A12, green)", "'swiss ball hamstring curls' AN19", "'Supine Glidder hamstring curls' AN18"],
                                              generator_rules=['Instability is a rehab/health-fitness tool, not a strength tool (CSEP [S10]); the coach uses the ball/roller as a SUPPORT (wall-assisted goblet, constraint 4) and as the home leg-flexion implement (swiss ball / slider curls).']),
    'bodyweight': dict(group='BODYWEIGHT_APPARATUS', kit_tokens=['floor'], constraint_typical='1 (ballistic, hanging, single-leg) - 3 (floor-supported)',
                       library_stats=dict(resistance=S['res:bodyweight'], athletic=S['ath:bodyweight']),
                       zones_reachable='upper body by hand position: push-ups zone 2, pike/handstand and pull-ups zone 3; lower body unloaded (no zone)',
                       coach_evidence=['OBSERVED 278 of 701 reference-tab exercise cells are bodyweight; 217 (31%) need no equipment at all',
                                       "OBSERVED in every plyo column equipment comes last: bodyweight first, then 'WEIGHTED' (added load) or 'REVERSE BANDED'/'DELOAD WEIGHT' (removed load) (ALL ABOUT BALLISTICS row 24 columns)"],
                       generator_rules=['Default implement for plyos, COD, sprints, core and unilateral knee-dominant work.']),
    'box_bench_step': dict(group='REFERENCE_PROPS', kit_tokens=['box', 'bench', 'step_low', 'plyo_box_high', 'two_boxes'], constraint_typical='+1 level when used as a depth/position reference',
                           library_stats=dict(plyo_box=S['ath:box/bench/step']),
                           coach_evidence=["OBSERVED box as a FOUNDATIONAL constraint: 'Box. Zercher squat Touch and Go' AI9, 'Box. Goblet squat Touch and Go' AI10, 'Box Squats' AI13",
                                           "OBSERVED box as an ADVANCED speed tool: 'Box. Any Squat Touch and Go fast' AI91, 'Box. Any Squat Deload' AI94 (the banded / reverse-banded AI92, AI93, AI95, AI96 are out of scope, EQ-12)",
                                           "OBSERVED heights written in names: 'Low Box Jumps (half shin)' G13, 'Mid Box Jump (up to knee)' G14, 'High Depth Drop (above hip)' G133",
                                           "COACH-ANSWER EQ-16: depth-drop boxes low ~6-12 in, medium ~12-18 in, high = above hip as written - RIGHT"],
                           generator_rules=['Height is a progression lever changed between blocks, not within (10b VARI-2).', 'Depth-drop heights: low 6-12 in, medium 12-18 in, high above the hip (EQ-16).', "'Single Leg Get Ups' AL14 is a box pistol: sit on a box and stand on one leg (LIB-09)."]),
    'hurdles_cones_targets': dict(group='REFERENCE_PROPS', kit_tokens=['hurdles', 'cones', 'plate_low_target'], constraint_typical='1',
                                  library_stats=dict(S['ath:hurdles/plates/cones']),
                                  coach_evidence=["OBSERVED 'Bigger plates start at lateral bilateral plate hops' (MASTER EXERCISE LIBRARY!G53 = H16): a bigger implement resets the pattern to a simpler one",
                                                  "COACH-ANSWER EQ-16: hurdles ~6 in for MODERATE hops, 12+ in for ADVANCED - RIGHT; LIB-04: advanced hurdle hops = taller hurdles + continuous quick contacts - RIGHT"],
                                  generator_rules=['Hurdles are the only plyo implement lost in a commercial gym (6 items); cones/lines are the stand-in.', 'Hurdle height: ~6 in moderate, 12 in+ advanced (EQ-16).']),
    'open_space': dict(group='FIELD_SPACE', kit_tokens=['open_space_short', 'open_space_long'], constraint_typical='1',
                       library_stats=dict(S['ath:track/field']),
                       coach_evidence=["OBSERVED COD route names 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL' (L9:L91) need 10-20 m",
                                       "OBSERVED ' Max velocity running (top speed)' G128 and 'Bounding' G140 need a 40-60 m runway"]),
    'cardio_machines': dict(group='CARDIO_MACHINES', kit_tokens=['cardio_machine_cal', 'treadmill'],
                            constraint_by_modality=dict(outdoor_run=1, treadmill=2, ski_erg=3, rower=4, bike=5),
                            coach_evidence=["OBSERVED 'Any Cardio Equipment' (MM EXAMPLE UPPERLOWER SPLIT!C13, x15 cells)", "OBSERVED '20 sec fast/ 40 sec slow (cardio of choice)' (MM BOXING!D7)",
                                            "OBSERVED '1 X 12 Cal bike sprint' / '1 X 12 Cal skierg sprint' / '1 X 12 Cal row sprint' rotated in one slot (MM BASEBALL!CM40/CQ40/CU40)",
                                            "OBSERVED only BOOTCAMP - OPTION 2 (E7/E12/E22/E27 -> B7:B335) reaches the 'CALORIES' block B133:B141; every other cardio dropdown (B7:B122) is running only"],
                            coach_evidence_v1=["COACH-ANSWER EQ-14: 'the blue, green, and orange aerobic work can run on different things that are available ... For non-runners, it is completely fine ... doing the block is the important part, and being able to track it and see any changes week to week is important'; 'some things are easier to manage with calories or time, but you can also manage them and track them with distance. I wouldn't completely throw away distance.'",
                                               "COACH-ANSWER ATH-07: aerobic sessions per week - 3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders, plus long walks after workouts (dose belongs to 03/06)"],
                            generator_rules=['Treat every cardio item as modality-free: run, bike, rower, ski erg or treadmill (EQ-14); bike (constraint 5) for older/injured.',
                                             'Track by distance, calories or time - choose one unit per block and keep it so week-to-week changes are visible (EQ-14).']),
    'jump_rope': dict(group='CARDIO_MACHINES', kit_tokens=['jump_rope'], coach_evidence=["OBSERVED 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' (MM BOXING!L12)"]),
}

# v1: COACH-ANSWER EQ-01 ("I don't do bands. I don't program anything with bands"), EQ-02 ("In my model, bands are not something that
# you're going to make changes to your body with"), EQ-07 ("Band chops are, to me, worthless"), EQ-08 ("I don't want any bands in the
# program"), EQ-12 ("No variable resistance should be available in this for now. We will work with that later on").  The v0 records are
# kept here as history (OBSERVED evidence) so the later variable-resistance work can start from them.
OUT_OF_SCOPE_IMPLEMENTS = {
    'status': 'OUT OF SCOPE in v1 - never prescribed, never offered as a substitute, not asked at intake',
    'coach_answers': {'EQ-01': "The only exception is I don't do bands. I don't program anything with bands. That is something that will eventually come up about variable resistance, but I don't really want to talk about variable resistance in any of this right now because it's so complicated.",
                      'EQ-02': "I just never use bands. I don't work with anything with bands, so I don't really like bands. In my model, bands are not something that you're going to make changes to your body with.",
                      'EQ-07': "Yes, just no bands. I don't need any bands. Band chops are, to me, worthless.",
                      'EQ-08': "Yes, just no bands. I don't want any bands in the program.",
                      'EQ-12': "We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on."},
    'v0_records': {
            'band': dict(group='ELASTIC_ACCOMMODATING', kit_tokens=['band', 'band_anchor'], constraint_typical='2-3', skill='low',
                         zones_reachable='all three (anchor height sets the zone, like a cable)',
                         velocity_role="'Bands are designed for speed/velocity' (ALL ABOUT SQUATS!C35); 'Weight should be lower ranges around 50% so you can move fast' (B36)",
                         roles=['ACCOMMODATING on a barbell (BOTTOM BANDED, REVERSE BANDED; advanced only, every banded RP entry is red RP!A26:A27, A29:A30 - as are the unbanded box squats A25/A28)',
                                "ASSISTANCE ('Assisted  Pull-Up w bands' U15; 'BILATERAL REVERSE BANDED JUMPS' BA!D38)",
                                "PERTURBATION ('Hip banded tube bands' RP!A47)",
                                'PRIMARY RESISTANCE at home (INFERRED; the reference tabs contain no band-resisted row, pulldown, press or curl)'],
                         coach_evidence=["OBSERVED 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' (MM EXAMPLE ATHLETIC FULL BODY SPLI!C16)",
                                         "OBSERVED 'Banded fast LAT PULL DOWNS Single Arm' (MM 05!C27), 'Banded rolling hamstring curls' (MM BASEBALL!M54), 'overhead band tricep ext' (MM BASEBALL!AS73)"],
                         science='Elastic-band training gives strength gains equal to DBs/machines (Lopes 2019 [S16]).',
                         generator_rules=['Home: prescribe by reps and RIR, not tension (10b AR-6).', 'Accommodating use needs a barbell + anchor, intermediate+ level, strength/athletic goal (10b AR-1).']),
            'chains': dict(group='ELASTIC_ACCOMMODATING', kit_tokens=['chains'],
                           coach_evidence=["OBSERVED 'BOTTOM CHAINS' / '*INTENSIONALLY SLOW YOU DOWN' (ALL ABOUT SQUATS!A39:A40), 'Weght can be moderate around 70%' (B40), 'Chains are designed for magnitude influence, loading.' (C39)",
                                           "OBSERVED 'HEAVY CHAINED DEADLIFT' (MM 4 TRACKS!H9), 'FAST CHAINED DL' (MM CONJUGATE!H22)"],
                           science='At matched total load chains RAISED concentric velocity ~10% (Baker & Newton 2009 [S97]); strength benefit needs >=80% total load in trained lifters [S94]. Contradiction F1.',
                           generator_rules=['FULL_FACILITY only; advanced strength/athletic; describe as top-heavy loading, not as a slowing tool.']),
            'weight_releasers': dict(group='ELASTIC_ACCOMMODATING', kit_tokens=[],
                                     coach_evidence=["OBSERVED 'WEIGHT RELEASERS' = 'I HAVE NO IDEA' in all three columns (ALL ABOUT SQUATS!B41:D41)"],
                                     generator_rules=["Do not program. The coach's own eccentric-overload tool is the DB drop-and-release: 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP' (ALL ABOUT BALLISTICS!C40) = 'DB Depth drop dbs Jump' G136."]),
    },
}

# =============================================================================================
# (1b) CONSTRAINT CONTINUUM
# =============================================================================================
CONSTRAINT_SCALE = {
    'definition': ('External constraint = how many reference points and how much external guidance the set-up gives '
                   '(COACH-CHAT: "Machines have a lot of reference points / constraints: you sit down, feet on the ground, move your hands or feet"). '
                   "It is Pat Davidson's 'ground' (high ground = many contacts/supports; low ground = few). SCIENCE: constraints/references [S26], high vs low ground [S27][S31]. "
                   "It is ONE of the three inputs of the coach's level rule (CAT-04: skill + stability + load position); see level_model."),
    'levels': {
        '5': dict(name='Seated or lying, pad-supported, fixed path', davidson='highest ground',
                  examples_library=[cn('AI98'), cn('AM9'), cn('AR9'), cn('AR10'), cn('AU13'), "'Machine Row Close Grip' X9", "'Machine bench press' AD14", "'10 cals'..'50 cals' on a bike B133:B141"],
                  examples_program=["'2 sets LEG PRESS MYO - 15-5-5-5-5-5' (MM 4 TRACKS!W61)", "'Leg Extensions' 2 x 'MYO SET' (BYOP JUSTICE LEAGUE E12/G12)"],
                  skill='low', who='frail/older, pain, high-volume finishers, MYO/near-failure sets'),
        '4': dict(name='Plate-loaded or fixed-path machine; seated or leaning cable; chest-supported free weight; wall/ball-supported squat', davidson='high ground',
                  examples_library=[cn('AI99'), cn('AI97'), cn('U9'), cn('U17'), cn('X52'), cn('AI14'), "'GHD' AN48", "'Hyper extensions ' AN55"],
                  skill='low', who='beginners learning a pull (ON_RAMP), volume clients (VOLUME_TOOL), older/injured'),
        '3': dict(name='Standing cable; free weight supported by a bench or the floor; box/wall used as a depth reference; floor core', davidson='medium-high ground',
                  examples_library=[cn('AD9'), cn('AD94'), cn('AD10'), cn('AI13'), cn('AI10'), cn('AN9'), cn('AD12'), cn('O10'), cn('K27'), cn('AI16')],
                  skill='low', who='beginners, hypertrophy accessories, pain regressions'),
        '2': dict(name='Free weight or bodyweight, standing or closed-chain, no external support', davidson='medium ground',
                  examples_library=[cn('AI46'), cn('AN92'), cn('AA50'), cn('AD47'), cn('AI12'), cn('AI11'), 'all UNILATERAL KNEE DOMINANT lunges AL9:AL21 (mean 1.92)',
                                    'hang pulls C12:C15 and Olympic lifts C91:C96', 'half-kneeling scoops K21:K24', cn('O47'), cn('O15')],
                  skill='moderate (barbell high)', who='strength main lifts, athletes, intermediate+ gen pop'),
        '1': dict(name='Open space: hanging, inverted, single-leg free, ballistic/reactive, unstable', davidson='low ground',
                  examples_library=['strict/weighted pull-ups U46:U52', cn('AA52'), cn('AL13'), cn('AI100'), cn('AA11'), cn('AN20'), 'thrusters AA54/AA55, AI102:AI104',
                                    'all plyos G9:G141', 'all COD L9:L92', 'standing/stepping throws K9:K20', 'ankle track C126:C136', 'running B9:B128'],
                  skill='varies (ballistic low-moderate; HSPU/pistol/strict pull-up high)', who='athletes (athletic slots and main lifts), advanced bodyweight skill'),
    },
    'mean_constraint_by_implement_class_library': {k.split(':', 1)[1] + (' (athletic/core library)' if k.startswith('ath:') else ''): v['mean_constraint'] for k, v in S.items()},
    'distribution': dict(
        athletic_core_library='C1 100 / C2 33 / C3 10 / C4 0 / C5 9 of 152 dropdown rows; the only C5 rows are calorie cardio (lib_athletic_core_notes section 3)',
        resistance_library='mean 2.66 over 283 entries; 19% at C>=4; 10% at C1 (lib_resistance_notes section 2)',
        by_level_resistance='FOUNDATIONAL mean 2.98 (34% machine or cable, 6% high skill) -> ADVANCED 2.21 (10% machine or cable, 34% high skill, 39% barbell); upper body removes constraint with level (VERTICAL PULL 3.5 -> 1.0), lower body files machines higher (BILATERAL KNEE DOMINANT ADVANCED holds Hack/Leg press/Pendulum)'),
    'crosswalk_other_scales': {
        'BYOP program rubric (prog_byop_equipment: 1 + path + support + reference)': 'Spearman 0.88 with the canonical scale over 413 shared cells (318 identical, 91 one step apart); differences of two steps only on the banded/reverse-banded box squats AI92, AI93, AI95, AI96 (BYOP 4, canonical 2).',
        'MASTER MODEL program scale (prog_mm_equipment)': 'measured on 410 name-matched items: MM 1 -> canonical 1.27; MM 2 -> 1.95; MM 3 -> 2.19; MM 4 -> 3.19; MM 5 -> 5.0 (re-derived 2026-10-08 by exact name match on 431 items: 1.27 / 1.97 / 2.18 / 3.19 / 5.0). MM population means run about 0.25-0.5 above canonical (athletes +0.26, gen pop +0.50).',
    },
    'coach_answer': "COACH-ANSWER EQ-13: the 1-5 scale (5 = seated machine with back pad, 4 = plate-loaded / Smith / chest-supported, 3 = cable or DB on a bench, 2 = standing free weights, 1 = bodyweight, ballistic, reactive) - RIGHT. EQ-11 adds an order inside level 4: back-supported machines (hack squat, pendulum) give more constraint than the Smith machine, whose bar leaves the trunk free.",
    'rules': [
        'GRD-1 constraint_level is the primary equipment axis; every slot gets a target band from client_rules; options outside the band are penalised, not banned (10b EQ-1).',
        'GRD-2 remove ONE reference per block, never more: support (seated -> kneeling -> standing), base (bilateral -> split -> single-leg), implement (machine -> cable -> DB -> barbell), path (fixed -> free), tempo (controlled -> fast), load position (zone 1 -> 2 -> 3) (10b GRD-2; OBSERVED RP!E8:E15 colour ladder; COACH-ANSWER CAT-04).',
        'GRD-3 direction by goal: hypertrophy holds or raises constraint on the sets that carry volume; athletic lowers it on main and athletic slots until everything except finishers is C1-2; pain raises it (+1 to +2) on the affected region.',
        "GRD-4 (EQ-11) inside constraint 4, a back-supported machine (hack squat, pendulum) is more constrained than the Smith machine; leg press (seated, back pad) is 5. This orders machines by constraint, never by preference (no machine ranking).",
        "Machine roles: ON_RAMP for upper-body pulls (library FOUNDATIONAL), VOLUME_TOOL for leg machines (library MODERATE/ADVANCED, operative FOUNDATIONAL per CAT-04), ISOLATION (AM9, AR9/AR10, AU13). OBSERVED Sheet23: upper machines only in T9:T11 (header T1 'FOUNDATIONAL - RP - BS - VERTICAL PULL') and AA2:AA4 (header AA1 'RP - BS - HORIZONTAL PULL', no level written), 'Hack Squat Machine' AD8, 'Leg Press' AD9/AE9, 'Pendulum Squat' AE10 only in INTERMIDIATE/ADVANCED columns.",
    ],
}

# =============================================================================================
# (1c) LEVEL MODEL: Davidson load-position zones (COACH-ANSWER CAT-04/05/06)
# =============================================================================================
_rows = LT['rows']
conflicts = [r for r in _rows if r['cls'].startswith('library_easier: zone-3')]
overrides = [dict(cell=it['cell'], name=it['name'], bucket=it['bucket'], **it['level_override']) for it in items if it.get('level_override')]
LEVEL_MODEL = dict(
    coach_answer=dict(
        CAT_04="Mostly skill and stability demand, AND load POSITIONING. Load in front of you / front-loaded = foundational (goblet squat, front-loaded zercher) - people need to learn to be upright. Load closer to and on your body = intermediate (barbell front squat). Load behind your body = advanced (barbell back squat). Based on Dr. Pat Davidson's 'A Coach's Guide to Optimizing Movement' ZONES: Zone 1 = closer to the body at the bottom (arms low) - easiest; Zone 2 = horizontal (high-pressure, but safer to push and pull) - intermediate; Zone 3 = overhead/vertical - most advanced (more positioning, stability and skill needed). Machines or cables change this: easier, because the machine/cable does the stabilizing work.",
        CAT_05="Levels add options, they don't remove them. 'The levels are still very theoretical, so we don't need to rely heavily on them.'",
        CAT_06='Client level and exercise level are separate axes.',
        CAT_10="Zones come from Dr. Pat Davidson's 'A Coach's Guide to Optimizing Movement' and are ROTATION BIASES: vertical positions (hands down / standing, hands overhead, deep squat) = external-rotation bias; horizontal positions (hands in front, knee at hip height / half squat) = zone 2 = internal-rotation bias, more compressive. 'It doesn't apply to the plyos. The plyos are different.'",
        CAT_11="The plyo progression (receive and pause -> receive then create -> repeatedly receive and create) is 'not necessarily a plyo zone ... I don't know what to call it yet'.",
        source='coach_answers.md + coach_answers_full.md (2026-10-08)'),
    zones={
        '1': dict(name='Zone 1 - low / front / close to the body', level='FOUNDATIONAL', rotation_bias='external (vertical: arms down / standing) - CAT-10',
                  load_positions=['suitcase / farmer (arms low)', 'goblet', 'zercher and high zercher', 'hex bar (load at the sides)', 'landmine (front)', 'medball hug', 'plate reach (counterbalance)', 'DB/KB/barbell deadlift (bar low, in front)', 'arm work with the upper arm at the side (curls, pushdowns)'],
                  coach_ladders=["ALL ABOUT SQUATS!A10:D11: 'Hex Bar Squat' EASIEST, 'Goblet Squat' EASIER, 'High Zercher Squat' EASY, 'Zercher Squat' MODERATE",
                                 "ALL ABOUT LUNGES!C21 'LOADING' -> C22:C24 'Contralateral Suitcase', 'Ipsilateral Suitcase', 'Duble suitcase' and C28:C30 '... High zercher' (C25:C27 'on shoulder' are zone 2)",
                                 "RESISTANCE PATTERNS!C27 'LOW/MID LOADING VARIATION': 'Plate reach ', 'Goblet loading', 'Double kb or Db'"]),
        '2': dict(name='Zone 2 - horizontal / racked on the front of the body', level='INTERMEDIATE', rotation_bias='internal (horizontal: hands in front, half squat; compressive) - CAT-10',
                  load_positions=['front rack (barbell front squat, double KB front rack, DB on the shoulder)', 'horizontal push and pull (bench, push-ups, rows, flies, chest press)', 'arms at shoulder height (skull crushers, spider curls, end of a lateral raise)'],
                  coach_ladders=["ALL ABOUT SQUATS!E10:E11 'Front Squat/ SSB Bar' HARD", "RESISTANCE PATTERNS!C23:C26 'Front racked db or kb contralateral/Ipsilateral loading' = HARDER (vs plain 'Contralateral loading ' / 'Ipsilateral loading ' = MODERATE, C19:C22; reading those as suitcase loads is INFERRED)",
                                 "ALL ABOUT LUNGES!C25:C27 'on shoulder' loadings, C32 'Front racked barbell'"]),
        '3': dict(name='Zone 3 - overhead / vertical, or BEHIND the body', level='ADVANCED', rotation_bias='external (vertical: arms overhead / deep squat) - CAT-10',
                  load_positions=['overhead press, push press, jerk, snatch, thruster, overhead squat, overhead triceps', 'hanging / pulling from overhead (pull-ups, pulldowns, hanging core)', 'behind the body: back squat (high/low bar), good morning, barbell calf raise; dips (shoulders extended behind the trunk, ambiguous)'],
                  coach_ladders=["ALL ABOUT SQUATS!F10:H11 'High Bar Squat' HARDER, 'Low Bar Squat' HARDEST, 'Overhead Squat' VERY HARD", "ALL ABOUT LUNGES!C33 'Back racked barbell'",
                                 "RESISTANCE PATTERNS!C31:C36 'HIGH LOADING VARIATION': high zercher -> zercher -> front squat racked -> back squat racked -> 'Barbell overhead '"]),
    },
    guidance_modifier="COACH-ANSWER: machines and cables make any zone easier ('the machine/cable does the stabilizing work'). OBSERVED proof: every machine-guided or assisted vertical pull (zone 3) is FOUNDATIONAL (U9-U18), while the free versions are ADVANCED (U46-U52).",
    where_zones_are_already_written=["'Cable Machine Curls (Zone1, Zone 2, Zone 3' (MASTER EXERCISE LIBRARY!AS12; Sheet23!AO5)", "'Unilateral/Bilateral DB Tricep Extension (Zone 3)' (Sheet23!AP5)",
                                     "'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' (Sheet23!AP6)", "Sheet23!A1 'ZONE' header with rows A2:A9 'ZONE 1' (green B6D7A8), A10:A16 'ZONE 2' (yellow FFF2CC), A17:A28 'ZONE 3' (red F4CCCC)",
                                     "MASTER EXERCISE LIBRARY!A3 'ZONE' labels the row-3 level band ('EASY' / 'MODERATE' / 'ADVANCED')",
                                     "NOT a Davidson zone (COACH-ANSWER CAT-10/CAT-11): Sheet23!C34:D36 plyo key 'ZONE 1' 'Receive pause/creat' -> 'ZONE 2' 'Receive/create' -> 'ZONE 3 ' 'Repeat receive create' is a plyo METHOD progression the coach has not named yet; zones do not apply to plyos, so v1 tags no plyo with a zone"],
    reading="COACH-ANSWER CAT-04/CAT-10: a zone is a position (and its rotation bias); the level follows from it: low/front = foundational, on the body / horizontal = intermediate, behind the body / overhead = advanced, and machines or cables make any zone easier. The coach adds (CAT-05) that 'the levels are still very theoretical, so we don't need to rely heavily on them': zone and level are ranking inputs, never hard gates (LV-2).",
    estimator=dict(
        rule='coach_rule_level = position level (zone 1 -> F, zone 2 -> I, zone 3 or behind the body -> A; unloaded -> by skill: low F, moderate I, high A) minus guidance (machine-guided or assisted -2; cable-guided, suspension or supported -1); floor F.',
        why_no_skill_bump="The coach's own anchor 'barbell front squat = intermediate' is a high-skill lift he still calls intermediate, so skill is not added on top of the zone.",
        status='INFERRED tags (zone, guidance) from exercise names; the rule itself is COACH-ANSWER CAT-04'),
    test_against_library=dict(
        scope='%d library entries with explicit FOUNDATIONAL/MODERATE/ADVANCED levels (VERTICAL/HORIZONTAL PULL/PUSH, BILATERAL KNEE/HIP DOMINANT, UNILATERAL HIP, LEG FLEXION, TRIPPLE EXTENSION pulls/lifts, FBS chops)' % LT['n'],
        exact=LT['exact'], within_one_level=LT['within_one'], n=LT['n'], delta_counts=LT['counts'], by_class=LT['by_class'], by_bucket=LT['by_bucket'],
        reading=['Position alone reproduces the coach\'s FBS chop ladder 12/12 (\'chop down\' FOUNDATIONAL BC9:BC12 -> \'midline\' INTERMEDIATE BC13:BC16 -> \'up\' ADVANCED BC17:BC20), the vertical pulls 17/19 and the unilateral hinges 8/8.',
                 'Where the library is HARDER than the rule, the reason is almost always one of the other two inputs of CAT-04: barbell skill/stability (barbell deadlift family, bent-over barbell rows, bench press: %d entries) or the machine filed as a volume tool (%d entries).' % (
                     LT['by_class'].get('library_harder: explained by skill/stability (barbell, high skill)', 0), LT['by_class'].get('library_harder: machine filed as a volume tool', 0)),
                 'The only hard conflicts (zone-3 unguided lifts filed FOUNDATIONAL/MODERATE) are the 4 push press/jerk entries AA11:AA14 and the 2 back squats AI49:AI50. v1: the coach settled the push press/jerk case himself (LIB-13: push press is easier -> stays FOUNDATIONAL; push jerk intermediate/advanced -> INTERMEDIATE); the back squats stay ADVANCED (his CAT-04 anchor).',
                 'The test covers the whole library as written, including the 13 band / variable-resistance cells and Camporini (AQ16) that v1 removes from every list.']),
    conflicts_with_coach_answer=[dict(cell=r['cell'], name=r['name'], library_level=r['library_level'], coach_rule_level=r['coach_rule_level'], operative_level=r['operative_level']) for r in conflicts],
    operative_level_overrides=overrides,
    other_sheet_disagreements=[
        "Seal rows X50:X53 are ADVANCED although chest-supported (more reference points = easier; RP!G62 'Chest suported row' sits at the easy end of the row ladder). Kept ADVANCED (needs a seal bench); open question.",
        "Barbell hinges AN92:AN99 (zone 1, low and in front) are ADVANCED: explained by barbell skill/stability, so no override (CAT-04 counts skill and stability too).",
        "Hamstring curls on a ball or slider AN17:AN19 are FOUNDATIONAL although unloaded moderate-skill; kept (now in LEG FLEXION).",
        "'Toes to bar' O15, 'Knees to chest' O16 and 'Hanging Rotational Knee/Leg Raises' O130 are FOUNDATIONAL core although hanging (zone 3). The coach (CAT-08) calls toes-to-bar a 'more complicated case'; core levels follow the thorax/pelvis/plane rule, not the zone rule. Kept; open question.",
        "Clean / Power Clean C92/C95 (front-rack catch, zone 2) are ADVANCED: explained by the catch skill; snatch and jerks (zone 3) are ADVANCED as the rule predicts; all hang pulls (zone 1) are FOUNDATIONAL/MODERATE as predicted. v1: ATH-10 adds FOUNDATIONAL Olympic options from his programs (hang cleans without bumpers, DB/KB snatches and cleans, hex-bar jumps) as ADD-ATH10-1..4.",
        "COACH-ANSWER LIB-15: the leg extension filed '...KNEE DOMINANT - ADVANCED' (AI101) and the 'UNILATERAL' label on the leg curls (AR5) are typos; leg extensions and leg curls are available at every level.",
        "COACH-ANSWER LIB-08: GHD (AN48 MODERATE / AN93 ADVANCED) has no levels -> operative 'any'."],
    generator_policy=[
        'LV-1 (CAT-05) Levels ADD options: a client at level L may use every exercise whose operative level <= L. Never remove a foundational option from an advanced client.',
        'LV-2 (CAT-05) Levels are soft: the operative level is a ranking input and an eligibility ceiling, not the main driver; constraint band, goal and pain rules decide among eligible options.',
        'LV-3 (CAT-06) Client level (training age, skill) and exercise level are separate axes: an advanced athlete still gets foundational exercises when the slot purpose or a pain flag asks for them.',
        'LV-4 (CAT-04, LIB-13, LIB-08, EQ-04) Operative level = library level, except the explicit overrides listed (back squats up to ADVANCED; push jerk up to INTERMEDIATE while push press keeps FOUNDATIONAL; front-loaded high zercher down to FOUNDATIONAL; low-skill guided machines down to FOUNDATIONAL so older/injured FOUNDATIONAL clients can use them - EQ-04 RIGHT; GHD no level).',
        'LV-5 (CAT-04) Progress a client along the zone ladder one step per block: zone 1 (goblet, zercher, hex, suitcase) -> zone 2 (front rack, horizontal) -> zone 3 (back-loaded, overhead), and remove guidance (machine -> cable -> free) one step per block (GRD-2).',
        'LV-6 (INFERRED from CAT-04) The zone also explains the session order the coach states: horizontal (zone 2, "safer to push and pull" heavy) before vertical (zone 3, more positioning and skill).',
        'LV-7 (CAT-10) Zones do not apply to plyos; plyos progress by method (receive & pause -> receive then create -> repeated receive/create, CAT-10/11), bilateral -> unilateral (unilateral is harder) and height (EQ-16).',
        'LV-8 (CAT-05/CAT-10) Levels are theoretical: never block a client from an exercise only because of its zone or level when constraint, goal, pain and preference rules say it fits.'],
)

SEGMENT_CHANGES = dict(
    leg_flexion=dict(
        coach_answer="CAT-09: knee flexion (leg curls, nordics, slider curls) is NOT hip dominant; it belongs in a flexion-of-the-leg segment, 'kind of like bicep curls'.",
        sheet_support="OBSERVED MM 'Sheet25'!H11 'LEG FLEXION' with H13 'ham curls', next to B11 'BILATERAL HIP DOMINANT' ('rdl' B12, 'hip thrust' B13), E11 'UNILATERAL KNE DOMINANT' and J11 'BILATERAL KNEE DOMINANT'.",
        bucket='ISO_LEG_FLEXION (alias of 05_session_architecture ISO_HAM)',
        moved_cells={c: cell_name[c] for c in sorted(G['KNEE_FLEXION_CELLS'], key=lambda x: int(x[2:]))},
        effect='The BYOP \'Leg Curls\' slot is wired to AR7:AR10 only (2 machines, 0 home options). With the segment the generator can also offer the 9 AN knee-flexion items: at BODYWEIGHT it has 2 as-written options (\'Supine Glidder hamstring curls\' AN18, \'Nordic Curl\' AN91) instead of 0; at HOME_DB_BENCH 3; at HOTEL_GYM 5. COACH-ANSWER EQ-08 confirms the no-machine swaps: nordics, slider or swiss-ball curls (no bands).',
        sheet_disagreement="The library files these 9 items under 'BILATERAL HIP DOMNANT' (AN) and the AR header row 5 reads 'UNILATERAL'; RP_BHD keeps 23 distinct hinge/bridge/thrust options."),
    biomechanics=dict(coach_answer="CAT-03: biomechanics is the definition of the whole thing; it has no bucket of its own.",
                      effect="The 'FUNCTIONAL BIOMECHANICS SYSTEM' column (BC, 17 cable-or-band chops and anti-rotation holds) is treated as a core / anti-rotation accessory bucket (FBS_CHOP_ANTIROT), not as a 'biomechanics' category. v1: 9 remain (cable route; their names are shown without 'or band'); the 8 'Knee banded for adduction' items are out (EQ-01) and their 'Hold object Adducted between knees' twins replace them."),
    core=dict(coach_answer="CAT-08: trunk on core (thorax moves), pelvis on core (pelvis moves), then both at the same time; each in different planes. Toes to bar and Copenhagen planks are more complicated cases.",
              equipment_effect="Equipment matters only for the hanging items (pull-up bar: O15, O16, O130, O209) and the rotations (O92 'Woodchoppers' cable, medball, DB or KB; O93 cable only - the band route is out, EQ-01); 10 of 17 core items need nothing. COACH-ANSWER ATH-11: core goes FIRST in the session by default (warm-up), movable by the client; about 2 core exercises (VOL-17)."),
    muscle_size=dict(coach_answer='CAT-02: big = quads, glutes, hamstrings, lats/upper back, chest; small = biceps, triceps, side/rear delts, calves, forearms, abs.',
                     equipment_effect='Small-muscle slots are DB-first (55% DB/KB, 0% high skill) with cable/machine second; big-muscle compounds use every implement, and big-muscle isolation (leg extension, leg curl) is machine-first. COACH-ANSWER VOL-17: calves get 3 sets every leg day (single-leg on a ramp/plate/deficit or bilateral) and rear delts get their own sets.'),
)

# =============================================================================================
# (2) CLIENT RULES
# =============================================================================================
CLIENT_RULES = [
    dict(id='CR-01', **{'if': {'goal': 'athletic_sport'}}, then=dict(
        athletic_slots=dict(constraint=[1, 2], implements=['bodyweight', 'boxes/plates/hurdles', 'medball (8-10 lb passes/rotations, EQ-06)', 'field'], velocity='max intent'),
        main_lifts=dict(constraint=[1, 2], implements=['barbell', 'hex_bar', 'dumbbell', 'kettlebell']),
        olympic="every client in athletic training gets Olympic-lift work (COACH-ANSWER ATH-10): beginners and early intermediates = hang pulls, hang cleans lowered under control, DB/KB snatches and cleans, hex-bar jumps (no bumpers needed); intermediate+ and pros = the full lifts",
        plyo_vs_ballistic="set by the sport's ground-contact time (COACH-ANSWER ATH-01): longer on the ground (fighters, karate) -> more ballistics; shorter (sprinters) -> more plyos; basketball a mix; baseball ballistics + rotational + sprinting, few plyos. Programs start more ballistic and become more plyometric (CAT-10). Dose belongs to 04_athlete_profiles.",
        machines='last 1-2 slots only (isolation finisher); <= 5% of line items',
        targets=dict(machine_items_pct='<=5 (observed 0.5)', medball_items_pct='10-20 (observed 13 MM athletes; EXAMPLE ATHLETIC 28 of line items / 19 of implement-word cells)',
                     fast_or_ballistic_items_pct='40-50 (observed %d)' % P['athlete']['pct_fast_or_ballistic'],
                     mean_constraint_canonical='~2.0 (observed %.2f)' % P['athlete']['mean_constraint_canonical'],
                     share_hard_sets_constraint_ge3='<=15%')),
         evidence=["OBSERVED BYOP JUSTICE LEAGUE!E3:E12 constraint by position 1,1,3,1,1,2,3,1,1,5 (BYOP program rubric; canonical scale 1,1,3,1,2,2,3,2,1,5) - ends on its only machine 'Leg Extensions'",
                   'OBSERVED MM athletes: machines 0.5% (5 of 949 items), medball 13%, constraint-1 items 30%, fast/ballistic 44%',
                   'OBSERVED BYOP athletic pools: machine+cable 18%, free weights 40%, bodyweight/field/props 42%',
                   'COACH-ANSWER ATH-10 (everyone in athletic training gets Olympic lifts), ATH-01 (plyo vs ballistic by ground contact)'],
         basis='OBSERVED + COACH-ANSWER ATH-01/ATH-10; SCIENCE specificity [S1][S10]'),
    dict(id='CR-02', **{'if': {'goal': 'hypertrophy_aesthetics'}}, then=dict(
        main_lifts=dict(constraint=[2, 4], note='1-2 free-weight lead lifts per session'), accessories=dict(constraint=[3, 5]),
        medball='none in the main workout; medball drills only in the warm-up (COACH-ANSWER ATH-05)',
        targets=dict(machine_plus_cable_items_pct='30-35 (observed gen pop ~33; BYOP aesthetics pools 31)', dumbbell_items_pct='30-45 (observed 33)',
                     fast_items_pct='<=5 (observed %d)' % P['gen_pop']['pct_fast_or_ballistic'], medball_items_pct='0 (observed 0; ATH-05)',
                     mean_constraint_canonical='~2.8 (observed %.2f)' % P['gen_pop']['mean_constraint_canonical'], share_hard_sets_constraint_ge3='45-65%'),
        failure='RIR 0-1 / MYO only on constraint >=4 or isolation, last exercise (VOL-15 RIGHT)'),
         evidence=["OBSERVED gen-pop MM items: DB 33%, barbell 18%, machine 18%, cable 15%; constraint 4-5 = 35% (MM scale)",
                   "OBSERVED bodybuilding 12-week track writes the machine first: 'Machine Dips or dips' x20, 'machine rows or db rows' x16, 'machine or db flies' x12",
                   "OBSERVED AESTHETICS Day 1 (BYOP 00) filled with machines at both ends: 'Machine Calf Raises', 'Leg press', 'Lat Pulldown Pronated Grip', 'Leg Extensions'",
                   "COACH-ANSWER ATH-05: 'If you're a bodybuilder, you don't need to do med ball throwing. That might be something for warming up'"],
         basis='OBSERVED + COACH-ANSWER ATH-05; SCIENCE: machines = free weights for hypertrophy [S1][S3], better SFR [S14]'),
    dict(id='CR-03', **{'if': {'goal': 'strength'}}, then=dict(
        main_lifts=dict(constraint=[2, 2], implements=['barbell'], note="'the work' (1RIR) first, then 'the accessory' (2RIR), 'the nuance' (MAX), 'the survival' (ALL) (MM CONJUGATE!M13:M16; ORD-07 RIGHT); the main lift goes first whatever its direction (ORD-02)"),
        accessories=dict(constraint=[2, 5], implements=['dumbbell', 'machine', 'cable']),
        dynamic_effort="FAST days with straight weight: 'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17). The sheets also write banded/chained versions ('FAST BANDED BENCH PRESS' E21, 'FAST CHAINED DL' CONJUGATE!H22); v1 drops the band/chain and keeps the lift (COACH-ANSWER EQ-12)",
        targets=dict(barbell_items_pct='35-40 (observed 37)', dumbbell_items_pct='~35 (observed 35)', machine_items_pct='10-15 (observed 11)',
                     fast_items_pct='10-20 (observed %d): FAST dynamic-effort days, straight weight' % P['strength_powerlifting']['pct_fast_or_ballistic'])),
         evidence=["OBSERVED 'HEAVY ...' vs 'FAST ...' prefixes on the same lift ('HEAVY BENCH PRESS' MM 4 TRACKS!E13 vs 'FAST BANDED BENCH PRESS' E21)", 'COACH-ANSWER EQ-12 (no variable resistance)'],
         basis='OBSERVED + COACH-ANSWER EQ-12; SCIENCE specificity [S1]'),
    dict(id='CR-04', **{'if': {'goal': 'power_speed', 'or': 'athlete wants to go faster'}}, then=dict(
        rule='lightest implement that still needs maximal effort; heaviest implement that does NOT slow the movement',
        implements=['bodyweight', 'medball 8-10 lb for passes/rotations (coach; see load_velocity.medball_rule)', 'light DB/hex loaded jumps at 10-20% of body weight (EQ-15)', 'KB swings', 'Olympic-lift derivatives (ATH-10)'],
        quality_gate='if the rep slows, jump height drops or the throw slows: drop load one step (EQ-15: too heavy when jump height or speed clearly drops); stop the set at visible slowing (~20% velocity loss)'),
         evidence=['COACH-CHAT: "If an athlete wants to go faster you don\'t need a lot of weight ... med ball upper body passes/rotations should be light - 8-10 lb ... Go heavier and you go slower. Quality of movement matters as much as quantity."',
                   "OBSERVED 'Front squats - light weights - same speed for all reps' (MM BASEBALL!BU33)", 'COACH-ANSWER EQ-15 (10-20% BW; too heavy when height/speed drops) - RIGHT'],
         basis='COACH-CHAT + OBSERVED + COACH-ANSWER EQ-15; SCIENCE [S35][S38][S39][S43]'),
    dict(id='CR-05', **{'if': {'goal': 'fat_loss_bootcamp_general'}}, then=dict(
        constraint=[2, 3], implements=['dumbbell', 'bodyweight', 'kettlebell', 'machines allowed on muscle-building days'],
        circuits='bodyweight + light DB stations alternating full-body / lower / core / upper (FAT BURN circuits); bootcamps = timed circuits, 5-7 stations, 3-5 rounds x 30-50 s, 35-45 min (COACH-ANSWER PRG-03)',
        pairing='hip-dominant with push, knee-dominant with pull - also in full-body and bootcamp days (COACH-ANSWER ORD-06/UNI-11)',
        cardio='running intervals or any cardio equipment (EQ-14); 3 aerobic sessions a week for general and fat-loss clients (ATH-07)',
        targets=dict(mean_constraint_BYOP_rubric='~2.56 (observed bootcamp family)', circuit_items='~70% bodyweight, ~20% DB (observed FAT BURN circuits)')),
         evidence=["OBSERVED BYOP bootcamp pools: machine+cable 23%, free weights 43%, bodyweight/field 31%", "OBSERVED FAT BURN MUSCLE BUILDING items: DB 42%, machine 23%, barbell 15%, cable 11%",
                   "OBSERVED FAT BURN circuit 'Jumping Jacks' -> 'Bodyweight reverse lunges' -> 'Situps' -> 'Dumbbell overhead press' (MM 01!D39:D42)"],
         basis='OBSERVED + COACH-ANSWER PRG-03, ORD-06, ATH-07'),
    dict(id='CR-06', **{'if': {'goal': 'hybrid_crossfit'}}, then=dict(
        implements=['barbell (dominant)', 'dumbbell', 'kettlebell', 'pull-up bar', 'wall-ball / medball (the one place a heavier ball is used: up to 20 lb, EQ-06)', 'cardio ergs'], machines='none (observed 0%)',
        olympic='hang/power variants with % (see load_velocity.olympic); power before strength in the session (ORD-03)',
        high_reps="40-rep sets only as a CrossFit / AMRAP-style option, not a default (COACH-ANSWER VOL-11)"),
         evidence=['OBSERVED hybrid items: barbell 41%, DB 28%, bodyweight-ballistic 15%, machine 0%; CrossFit: barbell 32% of line items and the only loaded implement named (96% of implement-word cells in the keyword scan)',
                   "COACH-ANSWER EQ-06: 'the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or something like wall balls'"],
         basis='OBSERVED (both sheets NOT DONE / planning grids) + COACH-ANSWER EQ-06, ORD-03, VOL-11'),
    dict(id='CR-07', **{'if': {'sport': 'boxing / karate / combat striking'}}, then=dict(
        plyo_emphasis='LOW: more ballistics, fewer plyos (long ground contact, ATH-01); boxing ~ karate near the bottom of the plyo ranking (ATH-02)',
        medball='HIGH (ATH-05: boxing, MMA, baseball, tennis, golf)',
        pressing_when_punching_volume_is_high="reduce pressing and arm volume step by step but do not cut it out (COACH-ANSWER ATH-04: 'don't completely cut it ... bring the volume down, down, down')",
        phase_1_weeks_1_2='gym template: canonical constraint ~2.6-2.8, machines ~14%, fast ~7%',
        phase_2_weeks_3_8="athletic template: canonical constraint ~1.95 (MM scale 1.96), machines ~8%, fast/ballistic ~56%, medball lists, weighted depth drops, 'Clean Pull/ hang Power Clean', contrast complexes",
        equipment_priority=['medball (throws/rotations)', 'DB/KB', 'barbell for 1-2 heavy lifts', 'jump rope']),
         evidence=["COACH-CHAT: 'boxing/karate = few plyos'", "OBSERVED MM EXAMPLE BOXING 8 WEEK BUILD UP weeks 1-2 vs 3-8; '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (L22)", 'COACH-ANSWER ATH-01, ATH-02, ATH-04, ATH-05'],
         basis='COACH-CHAT + OBSERVED + COACH-ANSWER'),
    dict(id='CR-08', **{'if': {'sport': 'rotational_or_throwing (baseball, softball, tennis, golf, hockey)'}}, then=dict(
        medball='HIGH for baseball, tennis and golf (ATH-05): rotational and half-kneeling throws every week (BASEBALL Part A 77 medball lines)',
        plyos='baseball: ballistics + rotational work + sprinting, few plyos (ATH-01)',
        weekly_vectors="Mon 'horiz pull', Tue 'horiz push', Thu 'vert pull', Fri 'vert push' (MM BASEBALL Part C labels, 20 each)",
        olympic="hang cleans/snatches between core and strength, 75% -> 90% (PER-09 RIGHT)",
        pitchers='less overhead pressing, more arm care, rotational throws kept light (ATH-08 RIGHT)',
        loading='load laterality per CR-32 (tennis = change-of-direction athlete: contralateral); core first (ATH-11)'),
         evidence=['OBSERVED MM BASEBALL (96 sessions)', 'COACH-ANSWER ATH-01, ATH-05, ATH-08, ATH-11, PER-09, CAT-13'], basis='OBSERVED + COACH-ANSWER'),
    dict(id='CR-09', **{'if': {'sport': 'basketball / volleyball / jumping court sports'}}, then=dict(
        plyo_emphasis='HIGHEST (coach: basketball = most plyos; ATH-02 ranking basketball ~ volleyball first) with a mix of plyos and ballistics (ATH-01)',
        medball='MODERATE (ATH-05)',
        equipment_priority=['plyo box or step (low 6-12 in / medium 12-18 in / high above hip, EQ-16)', 'hurdles (6 in moderate, 12 in+ advanced, EQ-16) or cones', 'weight plate or low target for plate hops', '20 m+ of space', 'medball'],
        plyo_volume='most plyo slots per week of any sport; progress method, height, unilateral (harder) and contact speed, not load (FV-7, CAT-10)'),
         evidence=["COACH-CHAT: 'basketball = most plyos; MMA = many plyos but fewer than basketball; boxing/karate = few plyos'", 'COACH-ANSWER ATH-01, ATH-02, ATH-05, EQ-16'],
         basis='COACH-CHAT + COACH-ANSWER (dose belongs to 03/04; equipment priority INFERRED)'),
    dict(id='CR-09b', **{'if': {'sport': 'MMA / grappling'}}, then=dict(plyo_emphasis='HIGH but below basketball (coach); fighters get more ballistics because they spend longer on the ground (ATH-01)',
                                                                     medball='HIGH (ATH-05)', equipment_priority=['plyo box/step', 'medball', 'DB/KB']),
         evidence=["COACH-CHAT: 'MMA = many plyos but fewer than basketball'", 'COACH-ANSWER ATH-01, ATH-05 (v0 listed a band here: removed, EQ-01)'], basis='COACH-CHAT + COACH-ANSWER'),
    dict(id='CR-09c', **{'if': {'sport': 'field sport with cutting (football, soccer, rugby)'}}, then=dict(
        cod="route-shaped COD 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'Shuffles' -> 'DIG/OUT', 'LEFT TEST' -> 'COMEBACK/CURL', '5-10-5' (L9:L92; turn severity 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN'); routes are for every athlete, tiered by turn angle (ATH-06 RIGHT)",
        loading='contralateral loading on unilateral lifts to pull into the hip (CAT-13, CR-32)',
        medball='MODERATE for football (ATH-05)',
        space_required='open_space_short (10-20 m) for COD; open_space_long (40-60 m) for top speed/bounding', props='cones; hurdles for hurdle hops'),
         evidence=['OBSERVED library COD block; BYOP athletic templates carry 4 COD slots/week', 'COACH-ANSWER ATH-06, CAT-13, ATH-05'], basis='OBSERVED + COACH-ANSWER (sport mapping INFERRED)'),
    dict(id='CR-10', **{'if': {'age': '>=65 or frail/functionally limited'}}, then=dict(
        main_lifts=dict(constraint=[4, 5]), accessories=dict(constraint=[4, 5]), share_hard_sets_constraint_ge3='70-90%',
        prefer=['leg press', 'pendulum / hack squat', 'belt squat', 'selectorized chest press/row/pulldown', 'seated machine shoulder press (EQ-05)', 'assisted pull-up machine', 'leg extension / seated leg curl', 'bike'],
        level_rule='leg machines are eligible even for a FOUNDATIONAL client (operative level F per CAT-04; COACH-ANSWER EQ-04: safety beats the level label - RIGHT)',
        load_position='zone 1 loads (goblet, hex, suitcase); avoid zone 3 free-weight positions (back squat, standing overhead press)',
        never='overhead squat, snatch, low-bar back squat, depth jumps (COACH-ANSWER EQ-03; CR-33)',
        plyos="few, unless the client asks for them (COACH-ANSWER ATH-09: 'the older population doesn't really need a lot of plyos unless they ask for it')",
        power='fast-concentric machine work at 40-60% 1RM (30-60% frail) before any jumps or throws (SCIENCE)', avoid=['depth jumps', 'hurdle hops', 'bounding', 'maximal barbell lifts'],
        athletic_slots="if present: 'BodyWeight Squat to calf raise', light medball chest pass / squat to chest pass (lighter ball, EQ-06), 'Shuffles', walk-run intervals",
        no_sex_rules="age, foundation, goal and injuries drive the rules, never sex (COACH-ANSWER ATH-09)"),
         evidence=['COACH-CHAT: "For people who want to go up in volume, people with injuries, or older people, more machines are usually better"', "COACH-ANSWER CAT-04: machines make it easier", 'COACH-ANSWER EQ-03, EQ-04, ATH-09', 'No older-adult program exists in either workbook (gap)'],
         basis='COACH-CHAT + COACH-ANSWER + SCIENCE (NSCA older-adult position stand [S12]; light-load power [S41])'),
    dict(id='CR-11', **{'if': {'age': '>=60 and high-functioning'}}, then=dict(
        block_1=dict(constraint=[3, 5]), block_2_plus=dict(main_lifts_constraint=[2, 3], accessories_constraint=[3, 5]), share_hard_sets_constraint_ge3='40-60%',
        never='the EQ-03 list still applies (overhead squat, snatch, low-bar squat, depth jumps)'),
         evidence=['COACH-CHAT (machines for older clients)', 'COACH-ANSWER EQ-03'], basis='SCIENCE: high-functioning older adults gain more from free weights [S12]; INFERRED progression; COACH-ANSWER EQ-03'),
    dict(id='CR-12', **{'if': {'pain_flag': "any region (intake, or FEELING = 'Felt a PAIN')"}}, then=dict(
        sequence=["1. move that muscle/pattern to machines or split grips: 'getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips)' (OBSERVED) / machines (COACH-ANSWER VOL-03)",
                  "2. cut that muscle or pattern 30-50% and keep it moving (COACH-ANSWER VOL-03 - RIGHT)",
                  "3. athletes: 'going unilateral' (OBSERVED); when a bilateral lift becomes unilateral, keep the sets if possible but adjust (UNI-08 PARTLY)",
                  "4. raise constraint +1 to +2 on that region's slots (machines/cables do the stabilising, CAT-04)",
                  '5. move the load toward zone 1 (front/low) and restrict to the pain-free range',
                  "6. if it is still too much, drop the exercise altogether (COACH-ANSWER VOL-03: 'maybe even drop the exercise altogether')"],
        never='the EQ-03 list (overhead squat, snatch, low-bar squat, depth jumps) for injured clients (CR-33)',
        avoid_in_region='ballistic/Olympic work', keep='half-kneeling and seated throws (no lower-limb impact) if the region allows'),
         evidence=["OBSERVED MM EXAMPLE UPPERLOWER SPLIT!A7 and EXAMPLE PUSHPULLLEGS SPLIT!A7: '****When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'",
                   "OBSERVED MM EXAMPLE ATHLETIC FULL BODY SPLI!A6: '...usually going unilateral or/and also getting away from fixed grips...'", 'COACH-ANSWER VOL-03, UNI-08, EQ-03'],
         basis='OBSERVED + COACH-ANSWER VOL-03/UNI-08/EQ-03; SCIENCE [S9][S103]'),
    dict(id='CR-13', **{'if': {'pain_flag': 'lower limb / impact-sensitive'}}, then=dict(
        avoid=["'Depth Jumps' G131 (never for injured clients, EQ-03)", "'High Depth Drop (above hip)' G133", 'hurdle hops G91:G96, G134', "'Bounding' G140", 'running intervals'],
        prefer=["'Low Box Jumps (half shin)' G13 (lands on the box)", "'BodyWeight Squat to calf raise' C9", 'half-kneeling scoops K21:K24', 'bike or any erg for cardio (constraint 5, EQ-14)']),
         evidence=['lib_athletic_core suitability tags (injured/pain only on half-kneeling throws)', 'COACH-ANSWER EQ-03, EQ-14'], basis='INFERRED from OBSERVED library + COACH-ANSWER'),
    dict(id='CR-14', **{'if': {'goal_modifier': 'wants more volume / high-volume block'}}, then=dict(
        where_volume_goes="added sets go to the exercises already in the session, in session order: the first exercise first, then the next (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); small muscles trained last get extra volume as a bonus exercise (COACH-ANSWER VOL-07; the set maths belong to 03_volume_dosing)",
        equipment="those exercises lean machine/cable (constraint >=4) for compounds AND isolation: 'I'd rather they collect that volume in a safe place with more constraints' (COACH-ANSWER EQ-03)",
        how='keep load the same; add sets (VOL-04: % of weekly sets)', intensity_technique="MYO on the last machine/isolation exercise only (VOL-15 RIGHT)",
        never='the EQ-03 list (CR-33)'),
         evidence=['COACH-CHAT: "20 sets of chest this week ... next week keep load the same and do 22 sets of chest with different exercises - more volume, more variety"',
                   "OBSERVED LEG PRESS 'local fatigue of the quads/legs and not have so much systemic fatigue' (ALL ABOUT SQUATS!I35)", 'COACH-ANSWER VOL-07, EQ-03'],
         basis='COACH-CHAT + OBSERVED + COACH-ANSWER; SCIENCE SFR [S14][S24]'),
    dict(id='CR-15', **{'if': {'training_level': 'beginner (L1)'}}, then=dict(
        who="under ~6-12 months of consistent training, or back after more than 6-12 months off (the body is treated as a beginner; skills come back fast); ex-pros only briefly (COACH-ANSWER PRG-05)",
        eligible_levels=['F'], load_position='zone 1 first (goblet, zercher, hex, suitcase, landmine)',
        upper_pulls="ON_RAMP: lat pulldown U9-U14 / assisted pull-up machine U16-U18 / machine row X9-X11 (FOUNDATIONAL); at home: pull-up negatives, flexed-arm hang or foot-assisted pull-ups on a doorway bar; with no bar: DB pullover + extra row sets and a buy-list flag (no bands, EQ-01)",
        lower_body="box/goblet/hex/landmine (AI9, AI10, AI11, AI13, AI16, AI17) and, per CAT-04/EQ-04, the leg machines (operative F)",
        triple_extension="athletic programs: Olympic-lift work from day one (COACH-ANSWER ATH-10) - hang pulls C12:C15, hang cleans lowered under control, DB/KB snatches and cleans, hex-bar jumps (ADD-ATH10-1..4), plus 'BodyWeight Squat to calf raise' C9, 'Lunge to high knee reach' C10 and the ankle track C126:C136",
        plyos="FOUNDATIONAL block G9:G15 ('Low Depth Drop', 'Medium Depth Drop', 'Push up Stick the Landing' (hands start on a box, land on the floor, LIB-02), 'Low Box Jumps (half shin)', 'Mid Box Jump (up to knee)', 'Ankle Hops '); start more ballistic and with receive-and-pause landings (CAT-10)",
        vertical_push="seated presses first (RP!E8:E9 green; 'Incline Seated DB Press' AA9; seated machine press ADD-EQ05); push press AA11/AA12 is FOUNDATIONAL ('push press is easier', LIB-13), push jerk AA13/AA14 INTERMEDIATE",
        default_implement='bodyweight or DB when a name gives no implement (EQ-09, CR-30)'),
         evidence=["OBSERVED PPL NOVICE 'Cable Lat pulldown' (MM 06!C28) vs NEWBY/INTERMEDIATE 'Pull ups or Cable Lat pull down' (G28/K28)", 'COACH-ANSWER CAT-04 (zone 1 = foundational), ATH-10, LIB-13, PRG-05, EQ-09'],
         basis='COACH-ANSWER + OBSERVED; SCIENCE: training status does not moderate machine vs free weight [S1]; switching machine->free at a block boundary costs nothing [S5]'),
    dict(id='CR-16', **{'if': {'training_level': 'intermediate (L2)'}}, then=dict(
        who='more than about a year of consistent training (COACH-ANSWER PRG-05)',
        eligible_levels=['F', 'I'], load_position='zone 2 added (front rack, horizontal barbell/DB work)',
        progression='remove one reference per block (GRD-2): machine -> cable -> DB -> barbell; seated -> kneeling -> standing; bilateral -> split -> single-leg; zone 1 -> zone 2',
        athletic="MODERATE plyo block (plate/hurdle hops; one from each MODERATE column, LIB-05), the MODERATE hang-pull block C49:C54 (repeats the high/mid-hang pulls C49:C52 and adds the low-hang pulls C53:C54), push jerk (LIB-13); full Olympic lifts from 'intermediate plus' (ATH-10)",
        default_implement='DB/KB (EQ-09, CR-30)'),
         evidence=['OBSERVED RP!E8:E15 colour ladder; Olympic start-height ladder OL!A7:A10', 'COACH-ANSWER CAT-04, PRG-05, ATH-10, LIB-05, LIB-13'], basis='COACH-ANSWER + OBSERVED + INFERRED'),
    dict(id='CR-17', **{'if': {'training_level': 'advanced (L3)'}}, then=dict(
        who='PROPOSED - PENDING COACH APPROVAL: several years of consistent training with the skills of the advanced lists (the coach defined novice and intermediate only, PRG-05)',
        eligible_levels=['F', 'I', 'A'], load_position='zone 3 added (back-loaded barbell, overhead, hanging)',
        upper='free: weighted/strict pull-ups U46:U52, barbell rows (X ADVANCED 6/9 barbell), standing presses',
        lower='free main lift + leg machines as VOLUME_TOOL (no machine ranking, EQ-11)',
        eligible_methods=['contrast/French contrast stations (intermediate+ athletes, off-season, heavy member 78-85%, ATH-12)', 'DB plyos G136:G139', "full Olympic lifts C91:C96 ('Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' per LIB-07)", 'supersets as a fatigue tool when the client no longer fatigues (ORD-05)'],
        not_eligible='bands, chains, weight releasers - out of scope for every level (EQ-01/EQ-12)',
        default_implement='barbell (EQ-09, CR-30)'),
         evidence=['OBSERVED library ADVANCED blocks', 'COACH-ANSWER CAT-04, ATH-10, ATH-12, LIB-07, ORD-05, EQ-11, EQ-12'], basis='COACH-ANSWER + OBSERVED'),
    dict(id='CR-18', **{'if': {'age': '<15 (youth)'}}, then=dict(
        medball_lb='lighter than adults (COACH-ANSWER EQ-06 - RIGHT); 4-6 lb as the starting number (SCIENCE, 10b FV-6)',
        lists='mostly the FOUNDATIONAL lists (ATH-09: about right)',
        olympic="some Olympic lifts from the floor are allowed when the program calls for them (COACH-ANSWER ATH-09: 'It could be some Olympic lift from the ground according to their program'); technique loads, no maximal lifts (INFERRED)",
        plyos='FOUNDATIONAL/MODERATE bodyweight', load_position='zone 1-2 mostly'),
         evidence=['No youth program in the workbooks', 'COACH-ANSWER ATH-09, EQ-06'], basis='COACH-ANSWER + SCIENCE (10b FV-6) + INFERRED'),
    dict(id='CR-19', **{'if': {'status': 'RETIRED in v1'}}, then=dict(
        was="sex_or_size = female athlete or bodyweight < 60 kg -> medball base minus 2 lb (SCIENCE [S48])",
        why="COACH-ANSWER ATH-09: 'I don't go by sex on these things, but mainly by age, foundation, goal, and injuries.' Medball weight now follows throw type, age (youth/older lighter, EQ-06) and the quality gate (drop 2 lb when the throw slows)."),
         evidence=['COACH-ANSWER ATH-09'], basis='COACH-ANSWER'),
    dict(id='CR-20', **{'if': {'equipment_profile': 'BODYWEIGHT | KB_ONLY | HOME_DB_BENCH | HOTEL_GYM | FIELD_TRACK_KIT | FIELD_TRACK_NO_KIT'}}, then=dict(
        keep='the parent template skeleton; filter options per slot (never drop the slot)',
        intensifiers='closer to failure (safe exercises), unilateral variant, 3-4 s eccentric, pause at long length, 1.5 reps, lengthened partials (10b TEMPO-3)',
        power="KB swing / DB snatch / DB jumps; without any load the Tripple Extension slot shifts to bodyweight reactive work (flag 'zone_shift')",
        no_bands="bands are never the home resistance (COACH-ANSWER EQ-01/EQ-02): the generator uses DBs/KBs, bodyweight progressions and household loads",
        flags="report 'pattern_gap' with the coach's ideal home kit as the buy list: adjustable DBs + bench + pull-up bar + an 8-10 lb medball (COACH-ANSWER EQ-02)"),
         evidence=["OBSERVED 'NO ACCESS' tabs are not equipment-filtered (same full-gym ranges; 'Leg extensions' prefilled at NO ACCESS - ATHLETIC!E12/E39)", 'COACH-ANSWER EQ-01, EQ-02'],
         basis='INFERRED from OBSERVED coverage + COACH-ANSWER; SCIENCE [S19]'),
    dict(id='CR-21', **{'if': {'season': 'in-season athlete'}}, then=dict(
        implements='unchanged from the off-season block; no new implements or skills',
        volume='frozen or reduced; minimal bilateral work, more unilateral (COACH-ANSWER UNI-10)',
        focus="speed athletes: sprints; others: strength maintenance or jumps (COACH-ANSWER PER-08)", aerobic='2 sessions a week (ATH-07)'),
         evidence=['10b section 9.4 (BASEBALL Block 3 sets frozen)', 'COACH-ANSWER UNI-10, PER-08, ATH-07'], basis='OBSERVED (via 10b) + COACH-ANSWER + INFERRED'),
    dict(id='CR-22', **{'if': {'always': True}}, then=dict(
        machines="NO RANKING (COACH-ANSWER EQ-11): 'if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great ... I don't want to rank them because they have different brands, angles'",
        constraint_differences='leg press (seated, back pad) and hack squat (back + shoulder pads) are more constrained than the Smith machine (EQ-11); pendulum like the hack; belt squat takes the load off the spine (EQ-11)',
        choose_by=['constraint band of the client (CR-02, CR-10, CR-14)', 'spine loading this week (CR-29: belt squat or leg press when the spine was already loaded or the client is sore)', 'what the client feels in the target muscles (EQ-11)', "the client's preference (EQ-10, CR-31)"],
        hip_machines='GHD / reverse hyper / back extension: only if available and the client feels the right muscles (EQ-11)',
        never=['V-squat (OBSERVED ALL ABOUT SQUATS!G39:I39; hard rule list GEN-08 - RIGHT)']),
         evidence=['COACH-ANSWER EQ-11 (NOT RIGHT to ranking), GEN-08', 'OBSERVED ALL ABOUT SQUATS!G35:I41 (sheet opinions, informational only)'], basis='COACH-ANSWER'),
    dict(id='CR-23', **{'if': {'always': True}}, then=dict(failure_gate='RIR 0-1, MYO SETs and drop sets only at constraint >=4 or on isolation, last exercise; barbell compounds RIR 1-3; Olympic/athletic work never near failure; never to failure on heavy compounds (GEN-08 hard rule)'),
         evidence=["OBSERVED 'MYO SET' only on the last slot (BYOP 03/04 G12), '2 sets LEG PRESS MYO' (MM 4 TRACKS!W61), BASEBALL Part D 'myo set'", "OBSERVED 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM EXAMPLE UPPERLOWER SPLIT!A6)", 'COACH-ANSWER VOL-13, VOL-15, GEN-08'],
         basis='OBSERVED + COACH-ANSWER + SCIENCE [S20][S21] (10b EQ-3)'),
    dict(id='CR-24', **{'if': {'always': True}}, then=dict(
        within_block='same exercise and implement in every slot for the block (4-6 weeks); progress sets/reps/load only (COACH-ANSWER PER-02 - RIGHT)',
        between_blocks='change ONE or two small variables per slot (implement, grip, stance, load position zone, ROM, end range, tempo), never all at once; <= 1/3 of slots fully replaced (PER-02)',
        second_exposure_in_week='the second time a slot comes up in a week it gets a different exercise of the same category (COACH-ANSWER PER-04 - RIGHT), e.g. squat Monday, leg press or belt squat Thursday (CR-29)',
        ab_weeks='A/B lead-lift weeks only for clients who want variety (PER-03)',
        exception="athletic speed-strength/strength-speed accessory slots may rotate the implement weekly inside the same velocity zone (BASEBALL 'bkd': 'DB Squat Jumps' > 'Hex bar squat jumps' > 'fast high zercher squats' > 'KB Squat cleans' ...)"),
         evidence=['COACH-CHAT: "don\'t try to \'confuse\' the muscle ... not a lot of new things, keep the same over the block; next block change some small variables"',
                   "OBSERVED 'Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus' (ALL ABOUT SQUATS!A5)",
                   'OBSERVED 162 of 234 week-to-week MM slot changes switch implement (mostly BASEBALL)', 'COACH-ANSWER PER-02, PER-03, PER-04'],
         basis='COACH-CHAT + OBSERVED + COACH-ANSWER; SCIENCE [S81]-[S85]'),
    dict(id='CR-25', **{'if': {'always': True, 'when': 'an equipment substitution changes the laterality of a slot'}}, then=dict(
        rule="count the substitute's sets on its true side of the bilateral/unilateral ledger and flag 'laterality_shift'. Keep the sets if possible but adjust (UNI-08). The bilateral:unilateral ratio itself is adjustable from 90/10 to 10/90 by athlete type and is moved by pain (COACH-ANSWER UNI-02/UNI-03); the ratio engine in 03_volume_dosing decides whether to rebalance",
        library_flag="every option carries 'laterality'; substitutes that shift a bilateral slot to unilateral carry 'laterality_shift'"),
         evidence=["COACH-CHAT: 'The bilateral vs unilateral VOLUME relationship is very important'", 'OBSERVED bilateral before unilateral in 225/231 sessions (ordering audit R5)', 'COACH-ANSWER UNI-02, UNI-03, UNI-08'],
         basis='COACH-CHAT + COACH-ANSWER (the ratio itself belongs to 03_volume_dosing)'),
    dict(id='CR-26', **{'if': {'always': True}}, then=dict(
        eligibility='client level L may use every option with operative level <= L (levels add options, CAT-05); levels are a soft ceiling, not the main driver (CAT-05: "still very theoretical")',
        exceptions='machines (constraint >=4, low skill) are eligible at every client level (CAT-04; EQ-04 RIGHT)'),
         evidence=['COACH-ANSWER CAT-04, CAT-05, CAT-06, EQ-04'], basis='COACH-ANSWER'),
    dict(id='CR-27', **{'if': {'slot': 'Leg Curls / hamstring isolation'}}, then=dict(
        segment='ISO_LEG_FLEXION (knee flexion) - not part of the hip-dominant volume (CAT-09)',
        options='machine curls (seated preferred: lengthened [S69]) -> DB / swiss ball / slider / medball curls -> Nordic (advanced; eccentric-only or hands-assisted as the regression)',
        no_machine='swap to nordics, slider or swiss-ball curls - no bands (COACH-ANSWER EQ-08)',
        volume='count as hamstring (knee-flexion) sets, separate from hinge sets'),
         evidence=['COACH-ANSWER CAT-09, EQ-08', "OBSERVED Sheet25!H11 'LEG FLEXION'"], basis='COACH-ANSWER + OBSERVED'),
    dict(id='CR-28', **{'if': {'slot_muscle_size': 'small muscle (biceps, triceps, side/rear delts, calves, forearms, abs)'}}, then=dict(
        implements=['dumbbell first', 'cable', 'machine'], skill='low only', reps='higher (coach: small muscles = more reps, cannot go heavy; VOL-11)',
        calves='3 sets every leg day, single-leg on a ramp/plate/deficit or bilateral (COACH-ANSWER VOL-17)', rear_delts='their own sets, not only indirect pulling volume (VOL-17)'),
         evidence=['COACH-ANSWER CAT-02, VOL-11, VOL-17', 'COACH-CHAT volume statement (small muscles = more reps)', 'OBSERVED small-muscle library entries 55% DB/KB, 0% high skill'], basis='COACH-ANSWER + OBSERVED'),
    dict(id='CR-29', **{'if': {'always': True, 'when': 'filling the knee- and hip-dominant main slots of a week'}}, then=dict(
        rule="one axially loaded squat day per week; the other knee-dominant day uses a leg press, belt squat or another non-axial option (COACH-ANSWER PER-04). Deadlifts load the spine too (PER-04), so the generator also keeps heavy barbell hinging to one day a week and fills a second hinge slot with hip thrust, back extension or reverse hyper - PROPOSED - PENDING COACH APPROVAL (open question)",
        tag="exercise_index[cell].axial_load = high | moderate | supported | none (INFERRED from the name; lower body only)",
        sore_or_already_loaded="swap the squat to the belt squat when the client was loaded on the back that week or is sore (COACH-ANSWER EQ-11)",
        no_machines="home clients: the second exposure uses a unilateral or front-loaded light option (split squat, goblet), PROPOSED - PENDING COACH APPROVAL"),
         evidence=["COACH-ANSWER PER-04: 'I can do one day of squatting and the other day of leg pressing. I don't want to always load the lower back and the spine twice per week ... I'm probably going to load it with the deadlifts as well'", 'COACH-ANSWER EQ-11 (belt squat)'],
         basis='COACH-ANSWER'),
    dict(id='CR-30', **{'if': {'always': True, 'when': 'the exercise name gives no implement (lunges, deadlifts, rows, calf raises, squats)'}}, then=dict(
        ladder='bodyweight -> DB -> barbell as the client level rises, limited by the kit (COACH-ANSWER EQ-09 - RIGHT)',
        by_level={'beginner (L1)': 'bodyweight or DB (zone 1: goblet, suitcase)', 'intermediate (L2)': 'DB / KB (front rack allowed)', 'advanced (L3)': 'barbell'},
        override='client preference (CR-31) and the older/injured/high-volume rule (machines first, CR-33) win over the ladder'),
         evidence=['COACH-ANSWER EQ-09'], basis='COACH-ANSWER'),
    dict(id='CR-31', **{'if': {'always': True, 'when': "a slot has alternatives ('Squats or Leg Press', 'DB or Barbell') or a dropdown"}}, then=dict(
        default='the generator picks a default by client rules (older/injured -> machine or DB; experienced -> barbell)',
        preference="the client may prefer one alternative and that can be completely up to them (COACH-ANSWER EQ-10 PARTLY)",
        dropdown='every slot keeps a dropdown of the other options of the same category (COACH-ANSWER GEN-04 - RIGHT)',
        intake='optional preference question: machines / free weights / dumbbells / no preference (INFERRED from EQ-10)'),
         evidence=['COACH-ANSWER EQ-10, GEN-04'], basis='COACH-ANSWER'),
    dict(id='CR-32', **{'if': {'always': True, 'when': 'a unilateral lift is loaded with one implement (contralateral / ipsilateral)'}}, then=dict(
        contralateral="load in the hand opposite the front leg: it pulls you INTO the hip - for change-of-direction athletes (football routes, soccer, basketball, tennis) (COACH-ANSWER CAT-13)",
        ipsilateral="load on the same side as the front leg: it helps you OUT of the hip - e.g. ipsilateral step-ups for the sprint acceleration phase (CAT-13)",
        bodybuilders_powerlifters='contra/ipsilateral work is a health accessory, mostly in the first 2-4 weeks, then bilateral symmetrical work dominates; kept later only if something bothers them (CAT-13)',
        equipment='one DB, KB or medball is enough (ALL ABOUT LUNGES!C22:C33 LOADING list)'),
         evidence=['COACH-ANSWER CAT-13', "OBSERVED RP!C19:C26 'Contralateral loading' (GET INTO THE HIP) / 'Ipsilateral loading' (GET OUT OF THE HIP); 'Split stance ALWAYS contralateral' RP!G83"],
         basis='COACH-ANSWER + OBSERVED'),
    dict(id='CR-33', **{'if': {'client': 'older OR injured OR in a high-volume block'}}, then=dict(
        equipment="compounds and isolation both lean machine/cable (constraint >=4): 'If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints' (COACH-ANSWER EQ-03 - RIGHT)",
        never=['overhead squat', 'snatch (barbell or DB)', 'low-bar back squat', 'depth jumps'],
        eligible='FOUNDATIONAL clients may use machines the library files MODERATE/ADVANCED (EQ-04)'),
         evidence=['COACH-ANSWER EQ-03, EQ-04'], basis='COACH-ANSWER'),
    dict(id='CR-34', **{'if': {'always': True, 'when': 'a session has a Throwing / medball slot'}}, then=dict(
        by_goal={'aesthetics / bodybuilding': 'no throwing in the main workout; medball only in the warm-up (ATH-05)',
                 'baseball, boxing, MMA, tennis, golf': 'high throwing volume (ATH-05)', 'basketball, football': 'moderate (ATH-05)'},
        weights='see load_velocity.medball_rule (8-10 lb passes/rotations; never over 20 lb, EQ-06)',
        no_medball="plyo push-ups (pressing), fast cable rotations, the no-ball 'fake medball slam'; never band chops (EQ-07)"),
         evidence=['COACH-ANSWER ATH-05, EQ-06, EQ-07'], basis='COACH-ANSWER'),
    dict(id='CR-35', **{'if': {'always': True, 'when': 'an aerobic (Blue / Green / Orange) block is scheduled'}}, then=dict(
        modality='any available erg or running: bike, rower, ski erg, treadmill or outdoors - non-runners are fine (COACH-ANSWER EQ-14)',
        tracking='distance, calories or time; keep one unit for the block so changes show week to week; do not throw away distance (EQ-14)',
        sessions_per_week='3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts (COACH-ANSWER ATH-07; dose belongs to 03/06)'),
         evidence=['COACH-ANSWER EQ-14, ATH-07'], basis='COACH-ANSWER'),
    dict(id='CR-36', **{'if': {'always': True}}, then=dict(
        rule='no bands and no variable resistance (bands, chains, weight releasers, reverse bands) anywhere: not in profiles, substitutes, prescriptions, intake or buy lists',
        library_cells_removed='U15, AI92, AI93, AI95, AI96, BC11, BC12, BC15, BC16, BC19, BC20, BC48, BC49 (and AQ16 Camporini, LIB-09)',
        names_cleaned="'cable or band(ed)' names keep only the cable route (display_name)",
        later='variable resistance is parked for a later version (EQ-01, EQ-12); the v0 notes are kept in out_of_scope_implements'),
         evidence=['COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12'], basis='COACH-ANSWER'),
]

# client families used to rank each slot's options (INFERRED from the rules above)
FAMILIES = {
    'athlete': dict(label='trained athlete / power-speed', levels=('F', 'I', 'A', 'any'), main=(1, 2), iso=(2, 4), machine_pen=2.0, skill_pen=0, ballistic_pen=0, prefer_fast=True,
                    barbell_bonus=1.0, unloaded_pen=1.0, level_pref=0.25, guidance_pen=0.5, rules=['CR-01', 'CR-04', 'CR-17']),
    'hypertrophy': dict(label='hypertrophy / aesthetics / high volume (intermediate)', levels=('F', 'I', 'any'), main=(2, 5), iso=(3, 5), machine_pen=0, skill_pen=0, ballistic_pen=1,
                        lower_lead_machine_pen=0.75, unloaded_pen=1.0, skip_buckets={'AP_THROW': "not used: no medball throwing in the main workout for aesthetics / bodybuilding (COACH-ANSWER ATH-05); medball drills only in the warm-up"},
                        rules=['CR-02', 'CR-14', 'CR-16', 'CR-34']),
    'strength': dict(label='trained strength client', levels=('F', 'I', 'A', 'any'), main=(2, 3), iso=(3, 5), machine_pen=0.5, skill_pen=0, ballistic_pen=1,
                     barbell_bonus=1.5, unloaded_pen=1.5, level_pref=0.25, abs_strength_bonus=0.5, rules=['CR-03', 'CR-17']),
    'beginner': dict(label='beginner, healthy (foundational)', levels=('F', 'any'), main=(2, 4), iso=(3, 5), machine_pen=0.5, skill_pen=2, ballistic_pen=1,
                     zone1_bonus=0.75, unloaded_pen=0.5, rules=['CR-15']),
    'older_or_pain': dict(label='older (65+), frail or injured / pain flag (foundational); the EQ-03 never-list also applies to high-volume blocks (CR-33)', levels=('F', 'any'), main=(4, 5), iso=(4, 5), machine_pen=0, skill_pen=3, ballistic_pen=3,
                          never=('snatch', 'overhead squat', 'low bar', 'depth jump'), rules=['CR-10', 'CR-12', 'CR-33']),
    'fat_loss': dict(label='fat loss / bootcamp (foundational-intermediate)', levels=('F', 'I', 'any'), main=(2, 3), iso=(2, 4), machine_pen=0.5, skill_pen=1, ballistic_pen=0,
                     rules=['CR-05']),
}
MAIN_COMPOUND = {'RP_BKD', 'RP_BHD', 'RP_HPUSH', 'RP_HPULL', 'RP_VPUSH', 'RP_VPULL', 'RP_UKD', 'RP_UHD'}
LENGTHENED = ('seated leg curl', 'overhead', 'deficit', 'incline seated db curls')
ATHLETIC_BUCKETS = {'AP_PLYO', 'AP_THROW', 'AP_COD', 'AP_TRIPLE_EXT', 'COND_AEROBIC', 'CORE_ANY'}
item_by_cell = {it['cell']: it for it in items}


def band_dist(c, band):
    if c is None:
        return 0
    lo, hi = band
    return 0 if lo <= c <= hi else min(abs(c - lo), abs(c - hi))


def pick_for(bucket, profile, fam, n=3):
    F = FAMILIES[fam]
    if bucket in F.get('skip_buckets', {}):
        return [dict(note=F['skip_buckets'][bucket])]
    lst = C['substitution_by_category'][bucket][profile]
    lib = [o for o in lst if o.get('src') in ('library', 'coach_addition') and o.get('lvl') in F['levels'] and o['cell'] not in ('U20', 'AI20', 'AI55', 'AI101')]
    iso = bucket.startswith('ISO_') or bucket.startswith('FOCUS_')
    band = F['iso'] if iso else F['main']
    scored = []
    for idx, o in enumerate(lib):
        it = item_by_cell[o['cell']]
        s = 2 * band_dist(o.get('c'), band)
        if it['impl'] == 'machine' and not iso:
            s += F['machine_pen']
        if it.get('skill') == 'high':
            s += F['skill_pen']
        if (it.get('vel') in ('max_velocity', 'fast')) and bucket not in ATHLETIC_BUCKETS:
            s += F['ballistic_pen']
        if bucket in MAIN_COMPOUND:
            real_bar = ('barbell' in (it['impl'] or '')) and not it['name'].lower().startswith(('box. any', 'box. squat'))
            if F.get('barbell_bonus') and real_bar and bucket in ('RP_BKD', 'RP_BHD', 'RP_HPUSH', 'RP_HPULL'):
                s -= F['barbell_bonus']
            if F.get('abs_strength_bonus') and it.get('fv') == 'absolute_strength':
                s -= F['abs_strength_bonus']
            if F.get('lower_lead_machine_pen') and it['impl'] == 'machine' and bucket in ('RP_BKD', 'RP_BHD'):
                s += F['lower_lead_machine_pen']
            if F.get('guidance_pen'):
                s += F['guidance_pen'] * (it.get('guidance') or 0)  # athletes: low ground on main lifts (GRD-3)
            if F.get('level_pref'):
                s -= F['level_pref'] * {'F': 0, 'I': 1, 'A': 2}.get(o.get('lvl'), 1)
            if F.get('unloaded_pen') and it['zone'] is None and it['impl'] == 'bodyweight' and bucket in ('RP_BKD', 'RP_BHD'):
                s += F['unloaded_pen']
            if F.get('zone1_bonus') and it['zone'] == 1 and it['impl'] != 'machine' and bucket in ('RP_BKD', 'RP_BHD'):
                s -= F['zone1_bonus']
        if iso and any(w in it['name'].lower() for w in LENGTHENED):
            s -= 0.5  # lengthened-bias isolation (10b ROM-2)
        if F.get('prefer_fast') and bucket in ATHLETIC_BUCKETS and it.get('fv') in ('strength_speed', 'speed_strength', 'reactive', 'starting_strength/speed'):
            s -= 0.5
        if fam == 'older_or_pain' and bucket in ATHLETIC_BUCKETS and not ({'older_adult', 'injured/pain'} & set(it.get('suitable_for') or [])):
            s += 10
        if F.get('never') and any(w in it['name'].lower() for w in F['never']):
            s += 10  # COACH-ANSWER EQ-03: never overhead squat, snatch, low-bar squat or depth jumps for older/injured/high-volume clients
        # v1: no bonus or penalty from the coach's sheet opinions on machines (COACH-ANSWER EQ-11: machines are not ranked)
        scored.append((s, idx, o))
    scored.sort(key=lambda x: (x[0], x[1]))
    out, stems = [], set()
    for s_, i, o in scored:
        if s_ >= 10:
            continue
        stem = ' '.join(o['name'].lower().replace('-', ' ').split()[:2])
        if stem in stems:
            continue  # variety: one grip/variant per exercise family in the top picks
        stems.add(stem)
        out.append(dict(name=o.get('display_name') or o['name'], cell=o['cell'], c=o.get('c'), lvl=o.get('lvl'), zone=o.get('zone')))
        if len(out) == n:
            break
    if len(out) < n and not (fam == 'older_or_pain' and bucket in ATHLETIC_BUCKETS):
        subs = [o for o in lst if o.get('substitute') and o.get('flag') in ('same_pattern', 'partial', 'zone_shift')]
        out += [dict(name=o['name'], src=o['src'], substitute=True, flag=o['flag']) for o in subs[:n - len(out)]]
    if not out:
        if fam == 'older_or_pain' and bucket in ATHLETIC_BUCKETS:
            out = [dict(note="DROP or replace per CR-10/CR-13 (nothing in this slot suits the client as written)")]
        else:
            out = [dict(note='GAP: no option with this kit (buy list)')]
    return out


picks = {}
for b in C['substitution_by_category']:
    if b.startswith('FOCUS_') or b.startswith('FUNCTIONAL'):
        continue
    picks[b] = {p: {fam: pick_for(b, p, fam) for fam in FAMILIES} for p in PROFILE_ORDER}

# =============================================================================================
# (4) INTENT / EQUIPMENT SEQUENCE INSIDE A SESSION
# =============================================================================================
INTENT_SEQUENCE = [
    dict(order=0, tier='PREP (always)', buckets=['WARMUP_GENERAL', 'WARMUP_PREP'], implements=['any cardio equipment', 'KB', 'medball (warm-up drills; the only medball use for aesthetics, ATH-05)', 'bodyweight'], constraint='n/a', intent='warm-up',
         evidence=["COACH-ANSWER ORD-08 - RIGHT: always a warm-up (5 min any cardio + A March/Skip/Run or mobility); A-drills do not count as volume",
                   "OBSERVED 'Any Cardio Equipment' 1 x '5 Minutes' opens every UL/PPL session (MM EXAMPLE UPPERLOWER SPLIT!C13)", "OBSERVED 'KB Book openers ' before pressing (MM PPL!C15)",
                   "OBSERVED 'DYNAMIC MEDBALL WARMUP DRILLS' (ALL ABOUT BALLISTICS!A4)"]),
    dict(order='0b', tier='CORE (default: first, right after the warm-up; the client may move it after the plyos or after strength)', buckets=['CORE_ANY'], implements=['bodyweight', 'medball', 'cable', 'plate'], constraint='2-3',
         intent='core as part of the warm-up; about 2 core exercises',
         evidence=["COACH-ANSWER ATH-11 (NOT RIGHT to 'core after the power block'): 'we need all the core work to be done first ... start with the core work that'll give you a good warm-up ... if they want to be able to move the core work to after the plyos or after the strength, that's fine too'",
                   "COACH-ANSWER VOL-17: 'Usually, about 2 core exercises, then we get into the plyo work'"]),
    dict(order=1, tier='REACTIVE / ELASTIC (speed/power, lower)', buckets=['AP_PLYO'], implements=['bodyweight', 'box/step (low 6-12 in, medium 12-18 in, high above hip)', 'plate target', 'hurdles (6 in moderate, 12 in+ advanced)'], constraint='1',
         intent='max velocity, reactive', velocity_zone='reactive / starting speed', load='bodyweight (EASY)', reps_observed="2 x '6 to 8 Reps' (BYOP JUSTICE LEAGUE F3:G4); 'EASY' (MM 4 TRACKS!D17)",
         evidence=["OBSERVED BYOP athletic rows 1-2 'Plyo'; BASEBALL Part A 'Upper Ballistics/plyo' / 'LOWER ballistics/plyo' (170/177 T1)", 'OBSERVED landing/stick before reactive in 11/13 sessions; COACH-ANSWER CAT-10: receive and pause first, then receive and create, then repeated receive/create', 'COACH-ANSWER EQ-16 heights']),
    dict(order=2, tier='BALLISTIC UPPER / TRUNK', buckets=['AP_THROW'], implements=['medball (8-10 lb passes/rotations; never over 20 lb)', 'slam ball (10-20 lb)', 'wall/partner'], constraint='1-3', intent='max velocity, release',
         velocity_zone='speed-strength', load='8-10 lb passes/rotations (COACH-CHAT); overhead 6-10, sit-up 6-8, slams 10-20 lb (COACH-ANSWER EQ-06)', reps_observed="1 x 10 per throw, 1 x 20 sit-up throws (ALL ABOUT BALLISTICS!A53:B71); 2 x '8 to 12 Reps' (JUSTICE LEAGUE F5:G5)",
         evidence=["OBSERVED BYOP 'Throwing' after 'Plyo'", 'COACH-ANSWER ATH-05: not used in the main workout for aesthetics']),
    dict(order=3, tier='CHANGE OF DIRECTION / SPRINT', buckets=['AP_COD'], implements=['field', 'cones'], constraint='1', intent='max velocity, acceleration/braking',
         velocity_zone='starting strength / speed', reps_observed="2 x '6 to 8 Reps' 'DIG/OUT' (JUSTICE LEAGUE E6:G6)", evidence=["OBSERVED BYOP 'COD' after 'Throwing' (the only place COD is programmed)", 'COACH-ANSWER ATH-06: route names for every athlete, tiered by turn angle']),
    dict(order=4, tier='POWER-STRENGTH (triple extension / Olympic / loaded ballistic)', buckets=['AP_TRIPLE_EXT', 'loaded jumps', 'KB swings', 'dynamic effort'],
         implements=['barbell (+bumpers for the full lifts)', 'hex bar', 'kettlebell', 'dumbbell'], constraint='1-2', intent='max intent with load', velocity_zone='strength-speed',
         load="'Hang cleans @ 75%' 4x8 -> '@ 80%' 4x6 -> '@ 85%' 4x6 -> '@ 90%' 4x4 (MM BASEBALL OPTIONAL PIECE rows; PER-09 RIGHT); 'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17); loaded jumps 10-20% BW (EQ-15)",
         reps_observed="'Power Clean' 2 x '6 to 8 Reps' (JUSTICE LEAGUE E7)",
         evidence=["OBSERVED BYOP 'Tripple Extension' is the last athletic slot (12/12)", "OBSERVED BASEBALL 'OPTIONAL PIECE' 'OLY' rows sit after Part B core and before Part C (24/24)",
                   'OBSERVED plyo/throws/COD/sprint before Olympic work in 48/51 sessions', 'COACH-ANSWER ORD-03 - RIGHT: power before strength; ATH-10: everyone in athletic training gets Olympic-lift work']),
    dict(order=5, tier='STRENGTH (bilateral main lift + first upper compound = the HORIZONTAL vector, zone 2)', buckets=['RP_BKD', 'RP_BHD', 'RP_HPULL', 'RP_HPUSH'],
         implements=['barbell', 'hex bar', 'dumbbell', 'leg press / belt squat on the non-axial day (CR-29)'], constraint='2 (athletes/strength) - 3-5 (hypertrophy/older)', intent='heavy, max intent concentric', velocity_zone='absolute / accelerative strength',
         load="'1RIR' / 'HEAVY ...' (MM 4 TRACKS!E9); 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' (ALL ABOUT SQUATS!D13)", reps_observed="'Front Squats' 2 x '6 to 8 Reps' (JUSTICE LEAGUE E8)",
         evidence=["OBSERVED BYOP resistance slots 1-2 always pair the bilateral lower lift with the HORIZONTAL vector (29 vs 2)", "OBSERVED BASEBALL Part C 'bkd'/'bhd' + 'horiz pull'/'horiz push'/'vert pull'/'vert push'",
                   "COACH-ANSWER UNI-11 / ORD-06: hip-dominant pairs with the push (front of the upper body), knee-dominant with the pull - to avoid bleed-over; same rule for full-body days and bootcamps",
                   "COACH-ANSWER CAT-04: zone 2 (horizontal) is 'high-pressure, but safer to push and pull' -> the heavier vector goes first"]),
    dict(order=6, tier='RESISTANCE PATTERNS (unilateral lower + VERTICAL upper, zone 3)', buckets=['RP_UKD', 'RP_UHD', 'RP_VPULL', 'RP_VPUSH'],
         implements=['dumbbell', 'cable', 'bodyweight', 'kettlebell'], constraint='1-4', intent='controlled', velocity_zone='accelerative strength / hypertrophy',
         reps_observed="2 x '8 to 12 Reps' ('Cable Machine UL Rows', 'Front Foot Elevated Lunges (FFE)', 'Stricted Pull-ups feet in front ', JUSTICE LEAGUE E9:E11)",
         evidence=['OBSERVED BYOP unilateral lower sits with the vertical vector (24 vs 2)', "OBSERVED BASEBALL Part D 'uhd'/'ukd' + 'bicep'/'tricep'/'calfs'/'shoulders'"]),
    dict(order=7, tier='ISOLATION', buckets=['ISO_QUAD', 'ISO_LEG_FLEXION', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF', 'FOCUS_*'],
         implements=['selectorized machine', 'cable', 'dumbbell'], constraint='3-5', intent='controlled, near failure allowed', reps_observed="'Leg Extensions' 2 x 'MYO SET' (JUSTICE LEAGUE E12); 'Ez Bar Curls' and 'Leg Extensions' 2 x '20 Reps' (AESTHETICS)",
         evidence=['OBSERVED last slots in every template; MYO only on the last exercise (audit N13; VOL-15 RIGHT)', 'OBSERVED quad isolation on knee days (10 vs 1), leg-flexion isolation on hip days (11 vs 1), leg extension before leg curl 12/14',
                   'COACH-ANSWER VOL-17: calves 3 sets every leg day; rear delts get their own sets']),
    dict(order=8, tier='CORE (only if the client moved it to the end) / optional day', buckets=['CORE_ANY'], implements=['bodyweight', 'cable'], constraint='2-3',
         evidence=["COACH-ANSWER ATH-11: core is first by default; 'Some athletes like to do it at the end, so that's why I want them to be able to move it around'",
                   "COACH-ANSWER ORD-10 PARTLY: optional days (Calves, Cardio, Core, Focus) can be add-ons or separate days - ideally separate",
                   "OBSERVED BYOP core sits on the 'Optional' days; MM '50 situps + 50 crunches + 50 reverse crunches' (MM EXAMPLE ATHLETIC FULL BODY SPLI!J25/F67)"]),
    dict(order=9, tier='CONDITIONING', buckets=['COND_AEROBIC', 'COND_SPRINT_BUYOUT'], implements=['bike/row/ski', 'run', 'jump rope'], constraint='1-5 by modality',
         evidence=["OBSERVED BASEBALL Part E 'Buy out' last 65/65; conditioning last or on its own day 107/121", 'COACH-ANSWER EQ-14: any erg; track by distance, calories or time; ORD-09: fighters start with a real aerobic block']),
]
SEQUENCE_SUBRULES = [
    dict(rule='Fast before slow / free before constrained: velocity intent falls and constraint rises through the session',
         evidence=['OBSERVED JUSTICE LEAGUE constraint by position 1,1,3,1,1,2,3,1,1,5 (BYOP rubric; canonical 1,1,3,1,2,2,3,2,1,5); reps 6-8 -> 8-12 -> MYO', 'OBSERVED BYOP athletic tabs mean constraint position 1 = 1.0 -> positions 9-10 = 3.5-3.9 (BYOP rubric)',
                   'OBSERVED MM athletes first half 1.58 -> second half 2.54; UL/PPL 2.4 -> 3.2 (MM scale)', 'OBSERVED Spearman(constraint, rep midpoint) = 0.72 over 21 filled BYOP slots', 'COACH-ANSWER ORD-03 - RIGHT (power before strength)'],
         status='OBSERVED + COACH-ANSWER'),
    dict(rule="Horizontal pull before vertical pull; horizontal push before vertical push - except that the main lift ('the work') always goes first, whatever its direction",
         evidence=['COACH-ANSWER ORD-01 - RIGHT: follow BYOP (row before pulldown, always); ORD-02 - RIGHT: the main lift comes first regardless of direction',
                   'OBSERVED BYOP 13/13 (pull) and 15/15 (push); MM UL/PPL 6/6 sessions for the pull rule (19/19 = BYOP 13 + UL 3 + PPL 3, audit R1)',
                   'OBSERVED but NOT to be copied: FAT BURN 0/8, 4 TRACKS AESTHETICS 0/38, BOXING wk1-2 0/2 put the pulldown first (ORD-01)',
                   'COACH-ANSWER CAT-04 gives the reason the generator can explain: zone 2 (horizontal) before zone 3 (overhead)'],
         status="COACH-ANSWER ORD-01/ORD-02 (house rule; no direct study, 10b ORD-5)"),
    dict(rule='Core first (as the warm-up), movable by the client', evidence=['COACH-ANSWER ATH-11'], status='COACH-ANSWER'),
    dict(rule='Bilateral before unilateral (same region)', evidence=['OBSERVED 225/231 sessions'], status='OBSERVED'),
    dict(rule='Compound before isolation; big before small', evidence=['OBSERVED 227/301 and 178/244; breaks are deliberate (calves first, pre-exhaust side raises) and only for a priority muscle (ORD-04)'], status='OBSERVED + COACH-ANSWER ORD-04'),
    dict(rule='Hip-dominant (lower posterior) pairs with the push (upper anterior); knee-dominant pairs with the pull - on split, full-body and bootcamp days', evidence=['OBSERVED 186 of 222 lower/upper pairs (BASEBALL 92/92; BYOP 00/03/04/07/08 100%)', "COACH-ANSWER UNI-11 ('If I'm doing the back of my lower body, then the opposite would be the front of my upper body ... keep as far away as I can from bleeding over'), ORD-06 ('hip-dominant with pushing and knee-dominant with pulling ... for full bodies and for boot camps')"], status='OBSERVED + COACH-ANSWER'),
    dict(rule='Inside the power block: plyo -> throws -> COD/sprint -> Olympic; landing before reactive', evidence=['OBSERVED 48/51; landing first 11/13', 'COACH-ANSWER CAT-10 (receive before create)'], status='OBSERVED + COACH-ANSWER'),
    dict(rule="Intensity techniques ('MYO SET', drop sets) only on the last exercise, on machines or isolation", evidence=['OBSERVED audit N13', 'COACH-ANSWER VOL-15 - RIGHT'], status='OBSERVED + COACH-ANSWER'),
    dict(rule="Priority override: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival' (loads '1RIR' -> '2RIR' -> 'MAX' -> 'ALL')", evidence=['OBSERVED MM CONJUGATE!M13:M16, 4 TRACKS M9:M24', 'COACH-ANSWER ORD-07 - RIGHT'], status='OBSERVED + COACH-ANSWER'),
    dict(rule='Supersets are a fatigue / density tool: short sessions, advanced clients who need more stimulus, off-season VO2 / mitochondrial work, and beginners who do not fatigue with straight sets', evidence=["COACH-ANSWER ORD-05 PARTLY: 'The supersetting is more like a fatiguing principle ... a tool to use to fatigue the heart more and compress the time'"], status='COACH-ANSWER'),
]
SEQUENCE_EXCEPTIONS = [
    dict(name='Contrast / French contrast (heavy -> jump)', allowed_for='intermediate+ athletes, off-season, heavy member about 78-85%, no rest inside the complex (COACH-ANSWER ATH-12 - RIGHT)',
         evidence=["OBSERVED 'FRENCH CONTRAST': '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps' (ALL ABOUT SQUATS!I18)",
                   "v1: the 4th member is written with a reverse band, which is out (EQ-12): PROPOSED - PENDING COACH APPROVAL - use bodyweight pogo / repeat squat jumps (fast contacts) as the 4th member, or run the first three members only",
                   "OBSERVED 11 heavy->jump instances, e.g. 'Barbell deadlift' (MM BASEBALL!I51) then 'Broad jumps' (I52); 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' (MM 05!C17)"]),
    dict(name='Calves first on aesthetics A-days', allowed_for='aesthetics, only when calves are a priority (COACH-ANSWER ORD-04 - RIGHT)', evidence=["OBSERVED BYOP AESTHETICS D3 'Machine Calf Raises' above D4 'Leg press'; 3 DAY BUILDER DAY 1"]),
    dict(name='Isolation first (pre-exhaust / priority)', allowed_for='bodybuilding clients, only for a priority muscle (ORD-04)', evidence=["OBSERVED 4 TRACKS AESTHETICS 19/59 sessions open with 'cable Side Raises' / 'DB side raises' / 'Arnold press' before 'Incline bench' (04:O35)"]),
    dict(name='Core moved to after the plyos or to the end', allowed_for='any client who prefers it (core is first by default, ATH-11)', evidence=['COACH-ANSWER ATH-11', 'OBSERVED BASEBALL Part B (core after the power block); HYBRID core inside strength supersets']),
    dict(name='Conditioning first', allowed_for='fighters (a real aerobic block, ORD-09 RIGHT), the sprint stimulus of the day, or an easy C-colour warm-up', evidence=['OBSERVED BOXING 4/4 day types; HYBRID Tue/Fri', 'COACH-ANSWER ORD-09']),
    dict(name='Low-intensity plyos and light ballistics as late accessories', allowed_for='athletes (calf/shoulder accessory)', evidence=["OBSERVED BASEBALL Part D 'Bicep Curls' > 'Side to side hurdle hops' (02:D37:D38); 'Single Arm DB snatch from floor' in the 'shoulders' slot (02:BG38)"]),
    dict(name='Circuit placement', allowed_for='bootcamp (timed circuits, PRG-03)', evidence=["OBSERVED BOOTCAMP - OPTION 2 'Cardio' third (E15/E30) and 'Bicep' before 'Vertical Push' (2A/2B)"]),
    dict(name='Isolation before the second unilateral lift on leg days', allowed_for='PPL leg days', evidence=["OBSERVED BYOP PPL 'Leg Extensions'/'Leg Curls' (rows 20-21) before 'Unilateral HD' (row 22)"]),
]
# v1: exceptions the coach's answers no longer allow (kept for traceability)
RETIRED_EXCEPTIONS = [
    dict(name='Pulldown before row', why="COACH-ANSWER ORD-01 - RIGHT: BYOP order (row before pulldown) always; the FAT BURN / 4 TRACKS / BOXING order is not followed"),
    dict(name='Strength listed above Olympic work (HYBRID, CrossFit)', why='COACH-ANSWER ORD-03 - RIGHT: power before strength; the HYBRID listing is not an execution order'),
    dict(name="Core early only for athletes / core at the end for aesthetics", why='COACH-ANSWER ATH-11 - NOT RIGHT: core first for everyone by default, movable'),
]

# =============================================================================================
# (5) LOAD-VELOCITY PRESCRIPTIONS BY INTENT
# =============================================================================================
LOAD_VELOCITY = {
    'principle': dict(
        coach=['COACH-CHAT: "The heavier I go the slower I am; the lighter, the faster. Range of motion (full ROM, mid ROM) is mechanical work. Speed is a variable, ROM is a variable, load is a variable, volume (sets x reps over time) is a variable."',
               "OBSERVED 'HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' vs 'LIGHT BARBELL ' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (ALL ABOUT SQUATS!A44:A48)",
               "OBSERVED 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' / '*I USE THESE FOR MUSCULAR FORCE PRODUCTION' and 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' / '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS' (ALL ABOUT BALLISTICS!A22:D23)"],
        science='bar velocity vs %1RM R^2 ~0.98 [S35]; intent matters as much as actual speed [S37][S38]; velocity loss within a set changes the adaptation [S39]',
        generator_rule='Pick the heaviest implement that does not slow the movement for the slot purpose; speed is a SLOT variable (HEAVY vs FAST on the same lift), not a separate exercise. Speed work uses straight weight only - no bands or chains (COACH-ANSWER EQ-12).'),
    'zones': [
        dict(zone='reactive / starting speed', velocity_ms='>1.3', pct_1rm='< 25 / body mass', implements=['bodyweight', 'boxes/plates/hurdles as targets'],
             library=['plyos G9:G141', 'ankle track C126:C136', 'COD L9:L92', "' Max velocity running (top speed)' G128"],
             observed=["'EASY' load on 'DEPTH DROP & JUMP' / 'HIGH SQUAT JUMPS' / 'REPEAT HIGH JUMPS' x 6 (MM 4 TRACKS!F17:H17)", "2 x '6 to 8 Reps' (BYOP JUSTICE LEAGUE)", "'Hurdle hops' 2 x 20 (MM BASEBALL!CO29:CQ29)"],
             science_dose='5-10 contacts x 2-4 sets, 1-2 min rest; depth-drop height 20-30 cm progressing to the RSI-optimal ~30-40 cm [S58][S59] (coach heights: low 6-12 in, medium 12-18 in, high above hip, EQ-16); fast SSC contacts <250 ms [S57]'),
        dict(zone='speed-strength (light external load)', velocity_ms='1.0-1.3', pct_1rm='body mass - 30', implements=['medball', 'slam ball', 'light DB/hex loaded jumps (10-20% BW, EQ-15)'],
             library=['throws K9:K28', "'DB repeat squat jumps' G139", "'Hex bar squat to calf raise' C11", "'Weighted squat to calf raise' C46 (any tool, LIB-07)", "'Hex bar squat jumps' ADD-ATH10-4"],
             observed=["'MB fast chest pass ' 10 (MM BASEBALL!AW47)", "'Really high jump squats LOAD & jump hard' 8 (MM 05!C14)", "'WEIGHTED DEPTH DROP' 6, load 'EASY' (MM 4 TRACKS!E17)",
                       "'DB Squat Jumps' 12/10/8/8 (MM BASEBALL!D33)", "'Hex bar squat jumps' 12/10/8/8 (MM BASEBALL!S33)"],
             science_dose='3-6 reps x 3-5 sets, 1.5-3 min rest; jump squat peak power body mass to ~30% 1RM [S43]; hex ~20% squat 1RM [S45]; DB jumps total 10-20% body weight (COACH-ANSWER EQ-15)'),
        dict(zone='strength-speed', velocity_ms='0.75-1.0', pct_1rm='40-65 (Olympic lifts 70-90)', implements=['barbell (Olympic, dynamic effort with straight weight)', 'kettlebell swings', 'DB/KB snatches and cleans'],
             library=['hang pulls C12:C54', 'Olympic lifts C91:C96', "beginner Olympic options ADD-ATH10-1..3 (ATH-10)", "'Box. Any Squat Touch and Go fast' AI91", "'KB swing' AN20", 'push press/jerk AA11:AA14'],
             observed=["'Hang cleans @ 75%' 4x8 -> '@ 80%' 4x6 -> '@ 85%' 4x6 -> '@ 90%' 4x4 (MM BASEBALL OPTIONAL PIECE rows, e.g. CM33, BY51, CQ51, DH50)",
                       "'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17/N21; also on 'LEG PRESS' O17)",
                       "'Front squats - light weights - same speed for all reps' 12/12/12/12 (MM BASEBALL!BU33) and 4/4/4/4 (AO51)", "'Fast KB swings' 12/12/12/12 (MM BASEBALL!AI51)"],
             science_dose="power clean >=70% (HPC peak ~65-80%) [S43][S46]; jump shrug ~30-45% HPC [S46]; dynamic effort with straight weight at the coach's 'FAST RPE6 or about 60-70%', 6-10 x 2-3, 45-90 s [S101]; stop at ~20% velocity loss [S39]"),
        dict(zone='accelerative / absolute strength', velocity_ms='< 0.75', pct_1rm='>= 75-85', implements=['barbell', 'hex bar', 'weighted bodyweight'],
             library=['18 absolute-strength entries (e.g. AI46 Front Squats, AI49/AI50 back squats, AN92 Barbell Deadlifts, AD95 Barbell bench Press, U52 Weighted Pull ups)'],
             observed=["'1RIR' on 'the work' (MM CONJUGATE!D13)", "'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' and '*REST 3-6 MIN BETWEEN SETS' (ALL ABOUT SQUATS!D13, E28)",
                       "'78% of 1RM' heavy member of French contrast (ALL ABOUT SQUATS!I18)"],
             science_dose='>= 80-85% 1RM, 1-6 reps x 3-6 sets, 3-5 min rest [S80] (coach rest: strength 3-6 min, VOL-14 RIGHT)'),
        dict(zone='hypertrophy (controlled)', velocity_ms='intent max, actual moderate', pct_1rm='~60-80 (RIR-based)', implements=['DB', 'cable', 'machine', 'barbell'],
             observed=["'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+', '*REST 1-2 MIN BETWEEN SETS' (ALL ABOUT SQUATS!A13, B28)", "'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM EXAMPLE UPPERLOWER SPLIT!A6)",
                       "VOL zones (MM BASEBALL!A19:C22): compounds 'VOL 1' '12-15 Reps' / 'VOL 2' '8-12 Reps' / 'VOL 3' '6-8 Reps'; isolations '10-12 Reps' / '15 REPS' / 'MAX REPS'",
                       "BYOP REPS list 'AW8:AW14': '4 to 6 Reps' ... '20 Reps', 'MYO SET'"],
             science_dose='5-30 reps at <= 4 RIR counts as a hard set [S72][S22]; 2-3 s eccentric, max-intent concentric [S99]; rest 1-2 min (up to 3, VOL-14)'),
        dict(zone='local-fatigue machine work', implements=['leg press', 'pendulum', 'belt squat', 'selectorized isolation'],
             observed=["LEG PRESS 'local fatigue of the quads/legs and not have so much systemic fatigue failure' (ALL ABOUT SQUATS!I35)", "'**MYO SET - ADVANCED' '15/5/5/5/5/5' (ALL ABOUT SQUATS!C27, B27; definition A30)", "'2 sets LEG PRESS MYO - 15-5-5-5-5-5' (MM 4 TRACKS!W61)"],
             science_dose='INFERRED: keep near-failure work on constraint >= 4 (most weight-training injuries involve free weights [S11]; going to failure is not needed for growth [S20][S21] - no study tests failure safety by implement); COACH-ANSWER EQ-03: high-volume clients collect volume on constrained machines'),
    ],
    'medball_rule': dict(
        observed="No ball weight is written in either workbook (0 lb/kg cells). Cues: 'this but hugging a light medball' (MM 05!K13); dose 1 x 10 per throw, 1 x 20 for the two sit-up throws (ALL ABOUT BALLISTICS!A53:B71).",
        coach_chat='8-10 lb for upper-body passes and rotations; "As long as you generate force with a lot of speed you train the body to move at that speed."',
        coach_answer="COACH-ANSWER EQ-06 - RIGHT to: slams 10-20 lb (slam ball), overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients. His words: 'the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or something like wall balls. Are they doing CrossFit, or are they doing high rows [probably HYROX - INFERRED]? ... I don't think there's any need for anything more than 20 lbs.' ATH-05: no medball throwing for aesthetics / bodybuilding except in the warm-up.",
        generator_default_lb={'chest pass / push throws / rotational passes (scoop toss, shotput, punch throw)': '8-10 (coach: passes and rotations); start at 8',
                              'overhead / backward throws': '6-10 (COACH-ANSWER EQ-06)',
                              'sit-up throws (situps to overhead / chest)': '6-8 (COACH-ANSWER EQ-06)',
                              'slams (non-bounce slam ball)': '10-20 (COACH-ANSWER EQ-06)',
                              'specific heavy uses only: medball hang cleans, wall balls (CrossFit / HYROX-style)': 'up to 20 (COACH-ANSWER EQ-06)',
                              'cap': 'never over 20 lb (COACH-ANSWER EQ-06)'},
        modifiers={'youth (< 15) or older adult': 'lighter for every throw type (COACH-ANSWER EQ-06); 4-6 lb is the starting number (SCIENCE, 10b FV-6)',
                   'aesthetics / bodybuilding goal': 'no throws in the main workout; medball drills only in the warm-up (COACH-ANSWER ATH-05)',
                   'sex': 'no sex-based modifier (COACH-ANSWER ATH-09; the v0 female -2 lb rule CR-19 is retired)'},
        quality_gate='if the throw visibly slows, the head drifts or the spine side-bends: drop 2 lb; if clearly too easy with clean technique: +2 lb, staying inside the ranges above',
        science_note="SCIENCE (10b FV-6) puts rotational and chest passes fastest at about 4-8 lb [S49][S54]; the coach's 8-10 lb stands (his COACH-CHAT number, not contradicted in EQ-06), so the generator starts at the 8 lb end. Contradiction F3 closed by the coach's answer.",
        no_medball="COACH-ANSWER EQ-07 - RIGHT with 'just no bands': plyo push-ups (pressing), fast cable rotations, or the 'fake medball slam' with no ball; never band chops ('Band chops are, to me, worthless').",
        status='COACH-ANSWER EQ-06, EQ-07, ATH-05, ATH-09 + COACH-CHAT'),
    'loaded_jumps': dict(
        observed=["'DB Depth drop dbs Jump' G136 = 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP' (ALL ABOUT BALLISTICS!C40): load on the drop, released before the jump",
                  "DB plyos exist only in the ADVANCED plyo block (G136:G139)", "'DB heavy ankle hops' (MM BASEBALL!E56)", "'Really high jump squats LOAD & jump hard' (MM 05!C14)"],
        rule='load 10-20% of body weight in total for loaded jumps; too heavy when jump height or speed clearly drops (COACH-ANSWER EQ-15 - RIGHT). Needs the client body weight at intake (COACH-ANSWER GEN-02 adds weight). DB-release drops ~20% (10-30%) body mass [S63]',
        status='COACH-ANSWER EQ-15 + OBSERVED + SCIENCE'),
    'plyo_heights': dict(
        depth_drops={'low': '~6-12 in', 'medium': '~12-18 in', 'high': 'above the hip (as written, G133)'},
        hurdles={'moderate': '~6 in', 'advanced': '12 in+ (taller hurdles + continuous quick contacts, LIB-04)'},
        method_progression="receive and pause (stick the landing) -> receive then create (stick, then jump/hop) -> repeatedly receive and create (repeat hops); bilateral is easier than unilateral (COACH-ANSWER CAT-10/CAT-11; the coach has not named this progression - it is NOT a Davidson zone)",
        status='COACH-ANSWER EQ-16, LIB-04, CAT-10, CAT-11'),
    'olympic': dict(
        who="everyone in athletic training (COACH-ANSWER ATH-10): beginners and early intermediates = hang pulls, hang cleans without bumpers, DB/KB snatches and cleans, hex-bar jumps; intermediate+ and pros = the full lifts. Youth may do some lifts from the floor (ATH-09). Never a snatch for older, injured or high-volume clients (EQ-03).",
        names="LIB-07: the full lifts are squat lifts - shown as 'Squat Snatch' C94, 'Squat Clean' C95, 'Squat Clean & Jerk' C96",
        start_position_ladder="high hang -> mid hang (knee) -> low hang (below knee) -> floor (OL!A7:A10); library C12:C15 (FOUNDATIONAL high/mid pulls) -> C53:C54 (MODERATE low-hang pulls) -> C91:C96 (ADVANCED full lifts)",
        catch_ladder='pull (no catch, zone 1) -> power clean (front-rack catch, zone 2) -> snatch / jerk (overhead, zone 3) -> squat lift',
        percent_progression=['@ 75% 4x8', '@ 80% 4x6', '@ 85% 4x6', '@ 90% 4x4'],
        equipment="Power Snatch C91, Power Clean & Jerk C93, 'Squat Snatch' C94, 'Squat Clean & Jerk' C96 need bumpers + a drop area; Power Clean C92, 'Squat Clean' C95 and hang cleans can be lowered under control",
        no_barbell_ladder=['Hex bar squat jumps', 'KB Squat cleans / Fast KB swings', 'Staggered stance DB snatch / Single Arm DB snatch from floor', 'DB Squat Jumps', 'Squat Jumps w/ Medicine Ball', 'broad jumps / Tuck Jumps (zone_shift)'],
        status='COACH-ANSWER ATH-10, ATH-09, LIB-07, EQ-03, PER-09 + OBSERVED'),
    'variable_resistance': dict(
        status='OUT OF SCOPE in v1 (COACH-ANSWER EQ-01, EQ-12): no bands, chains, weight releasers or reverse bands are prescribed.',
        coach_answer="EQ-12 NOT RIGHT: 'We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on.'",
        what_the_generator_does=["banded / reverse-banded box squats AI92, AI93, AI95, AI96 -> 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94 with straight weight at 'FAST RPE6 or about 60-70%'",
                                 "'FAST BANDED BENCH PRESS' / 'FAST CHAINED DL' / 'HEAVY CHAINED DEADLIFT' in the sheets -> the same lift with straight weight (FAST = 60-70%, HEAVY = 1 RIR)",
                                 "reverse-banded (assisted) jumps -> bodyweight jumps; French contrast 4th member -> PROPOSED pogo / repeat squat jumps (pending coach approval)",
                                 "weight releasers -> not used; the DB-release depth drop G136 stays (it is the coach's own drop-and-release, not a releaser)"],
        v0_reference="The v0 band/chain prescriptions (bands ~50%, chains ~70%, eligibility rules, 10b AR-1..AR-6) are parked for the later variable-resistance work; see out_of_scope_implements and 10b section 8."),
    'tempo': dict(
        observed="'Goblet squat slow' (MM BASEBALL!AA33), 'slow eccentric deficit Lunges (no weigths)' (EL52), 'SLOW FRONT SQUATS' (DG68)",
        by_zone={'athletic / power': 'natural or fast eccentric, max-intent concentric', 'strength': 'controlled ~1-2 s eccentric, max intent', 'hypertrophy': '2-3 s eccentric, max intent'},
        rule='never slow eccentrics on throws, jumps, Olympic lifts or dynamic effort; slow eccentrics are for control blocks, pain, and light home equipment (10b TEMPO-1..4)'),
    'speed_endurance_bands': "OBSERVED MM BASEBALL!E20:F22: 'SPEED ENDURANCE' '>40 Secs'; 'SPEED POWER' '10-39 Secs'; 'SPEED STRENGTH & POWER' '0-12 Secs'",
    'rom': dict(observed=["'ROM VARIABLE' 'Elevated' (green) -> 'Floor' (yellow) -> 'Deficit' (red) (RP!A81:A84)", "'END RANGE BEHAVIOR VARIABLE' 'Dead stop' -> 'Touch & go' (RP!A86:A88)",
                          "'Leg ext. Leg Curls (FULL RANGE OF MOTION)' (MM BOXING!L14)", "'Heel raises & fast/rythmic/1/4 SQUATS' (MM 05!J40)"],
                coach_chat='"Range of motion (full ROM, mid ROM) is mechanical work ... ROM is a variable."',
                rule='full (longest pain-free) ROM by default; lengthened-bias isolation variants; partial/mid ROM is legitimate for athletes on fast work; ROM changes between blocks (10b ROM-1..6)'),
    'aerobic_modality': dict(
        rule="Blue / Green / Orange aerobic work runs on any erg or running (bike, rower, ski erg, treadmill, outdoors); non-runners are fine; track by distance, calories or time and keep one unit per block (COACH-ANSWER EQ-14 - RIGHT)",
        sessions_per_week='3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts (COACH-ANSWER ATH-07; dose belongs to 03/06)',
        library_note="the DISTANCE (200-1000 m) and CALORIES blocks (B123:B141) are opened to every template (FIX-02 RIGHT: 'just make sure they're logical'); '21.6 mile run' B33 is flagged (coach: a marathon; a marathon is 26.2 mi)"),
    'older_adults': 'fast concentric at 40-60% 1RM on machines (30-60% frail) before jumps/throws (SCIENCE [S12][S41]); few plyos unless the client asks (ATH-09); never overhead squat, snatch, low-bar squat or depth jumps (EQ-03)',
}

# =============================================================================================
# (6) MACHINE PREFERENCES
# =============================================================================================
MACHINE_PREFERENCES = dict(
    coach_answer=dict(
        EQ_11="NOT RIGHT (to 'hack squat ranked last'): 'my opinion on machines is that if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great. Some people have certain machines that are different, so they don't always feel the same. What I'm trying to do is I don't want to rank them because they have different brands, angles, and things like that ... Probably more constraint would be a hack squat and a leg press. Less constraint would be a Smith machine ... Belt squats are for people that you don't need to load them axially ... The GHD reverse hyper is also if they're available and if they feel good doing them ... I want them to feel the right muscles.'",
        EQ_10="PARTLY: pick by client, 'but also the preference of the client ... that can be completely up to them'",
        EQ_03="RIGHT: older / injured / high-volume clients lean machine and cable for compounds and isolation; never overhead squat, snatch, low-bar squat, depth jumps",
        EQ_04='RIGHT: FOUNDATIONAL older or injured clients can use the machines the library files MODERATE/ADVANCED',
        EQ_05='RIGHT: add a seated machine shoulder press (ADD-EQ05)',
        GEN_08='RIGHT: hard rules include "no V-squat"'),
    ranking='NONE. The generator never ranks machines against each other (EQ-11).',
    constraint_differences=[
        dict(machine='LEG PRESS', set_up='seated, back pad, feet on a platform', constraint=5, spine='no axial load', note="more constrained than the Smith machine (EQ-11)"),
        dict(machine='HACK SQUAT', set_up='back pad + shoulder pads, fixed path', constraint=4, spine='supported (load through the shoulder pads)', note='more constrained than the Smith machine (EQ-11); the top of level 4'),
        dict(machine='PENDULUM', set_up='back pad + shoulder pads, arc path', constraint=4, spine='supported (load through the shoulder pads)', note='like the hack squat'),
        dict(machine='BELT SQUAT', set_up='load hangs from a hip belt; hands on rails', constraint=4, spine='no axial load', note="for clients who should not be loaded on the back that week or are sore from it (EQ-11); not in the library (ADD-EQ11)"),
        dict(machine='SMITH MACHINE', set_up='bar on the back on a fixed path; trunk unsupported', constraint=4, spine='axial (bar on the back)', note='the least constrained squat machine (EQ-11)'),
        dict(machine='GHD / REVERSE HYPER / 45-degree back extension', set_up='hips on a pad', constraint=4, spine='no axial load', note='only if available and the client feels the target muscles (EQ-11); GHD has no level (LIB-08)'),
    ],
    sheet_opinions_informational=[
        dict(machine='PENDULUM', cell='ALL ABOUT SQUATS!G41', verdict="'LOVE IT' (H41)", detail="'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these' (I41)",
             library=cn('AI99') + ' (library ADVANCED; operative FOUNDATIONAL)', generator='informational only (EQ-11): not ranked first'),
        dict(machine='LEG PRESS', cell='ALL ABOUT SQUATS!G35', verdict="'LOVE IT' (H35)", detail="'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' (I35)",
             library=cn('AI98') + " (library ADVANCED; operative FOUNDATIONAL); FULL FOCUS 'Leg press' AZ10", generator="the most constrained squat machine (5); MYO sets; fast leg press 60-70% for dynamic effort (MM 4 TRACKS!O17); free-weight swap pair 'Sqats or Leg Press'; the non-axial second squat day (PER-04)"),
        dict(machine='HACK SQUAT', cell='ALL ABOUT SQUATS!G37', verdict="\"I PERSONALLY DON'T LIKE IT\" (H37)",
             detail="\"Most hack squat machines don't have the right strength profile for me so getting used to a good upright squat might be difficult, I haven't had much success with these myself or with clients, but I know there are amazing people out there having great results with them. \" (I37)",
             library=cn('AI52') + ' (MODERATE), ' + cn('AI97') + ' (ADVANCED); both operative FOUNDATIONAL', generator="v0 demoted it; v1 does NOT (EQ-11: 'if the hack squat that you have in your gym works and you feel it is good, then that's great')"),
        dict(machine='V-SQUAT', cell='ALL ABOUT SQUATS!G39', verdict="\"DON'T LIKE IT\" (H39)", detail="\"Always tight on lower back & knees, so I don't presercibe the use of these, ever.\" (I39)",
             library='absent from the library (correct)', generator='never prescribe (GEN-08 hard rule)'),
    ],
    unrated=['Leg extension machine (RP!A39; AM9; AI20/AI55/AI101)', 'Leg Curl Machine / Seated leg curls / Lying Leg Curls (AN15, AN54, AN100, AR9, AR10 - now LEG FLEXION)', 'Hip Thrust Machine (AN51)',
             'Machine Good Mornings (AN52)', 'GHD (AN48, AN93; RP!A67)', 'Reverse hyper extensions (AN11; RP!A63)', '45 degree hip ext. (RP!A68)', 'Assisted pull up machine (RP!E68:E70; U16:U18)',
             'Machine row / Pendulum row / Machine single arm row (RP!G61, G70, G74)', 'Machine reverse flies (RP!K18; AH20)', 'Machine bench press / Machine flies (AD14, AD50)', 'Machine Calf Raises (AU13)', 'Smith machine (X13 option; RP!G64)',
             'Seated machine shoulder press (ADD-EQ05, EQ-05)', 'Belt squat (ADD-EQ11, EQ-11)'],
    unrated_rule='no machine is ranked (EQ-11): order by constraint fit to the client (client_rules), spine loading (CR-29), what the client feels, client preference (EQ-10) and coach usage; seated leg curl above lying leg curl only for the lengthened position ([S69]), not as a preference',
    model_quote="'This model is based on free weight squats, leg presses and machines will be covered at the end' (ALL ABOUT SQUATS!A4)",
    roles=dict(ON_RAMP='upper-body assisted/guided pulls and supported presses (library FOUNDATIONAL): U9-U18 (minus the band-assisted U15), X9-X11, AD14, ADD-EQ05', VOLUME_TOOL='leg/hip machines (library MODERATE/ADVANCED, operative FOUNDATIONAL): AI52, AI97-AI99, AN51, AN52, AN55, ADD-EQ11 belt squat',
               ISOLATION='AM9, AR9/AR10 (+ AN15, AN54, AN100 in LEG FLEXION), AU13, AH20; leg-extension copies AI20/AI55/AI101'),
    machine_first_vs_free_first="OBSERVED: gen-pop UL/PPL write the free weight first ('Sqats or Leg Press', 'Deadlifts (DB or Barbell)', 'DB Rows or Row machine'); the bodybuilding 12-week track writes the machine first ('Machine Dips or dips' x20, 'machine rows or db rows' x16, 'machine or db flies' x12, 'machine or db Reverse flies' x8). COACH-ANSWER EQ-10: the first-written option is not the default - pick by client, and the client's preference can decide.",
    missing_machine_rule="COACH-ANSWER EQ-08: swap first (quads: DB leg extensions on a box, sissy squats, reverse Nordic; hamstrings: nordics, slider or swiss-ball curls) - no bands; fallback OBSERVED 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42): a missing machine becomes +2 sets of the free-weight lift of the same pattern",
    generator_rules=['Never V-squat (GEN-08).', 'No machine ranking (EQ-11); the sheet verdicts above are informational only.',
                     'Constraint differences decide when constraint matters: leg press 5 > hack / pendulum 4 (back-supported) > Smith 4 (trunk free) (EQ-11, EQ-13).',
                     'Belt squat or leg press for the second squat exposure of the week, or whenever the spine was already loaded or the client is sore (PER-04, EQ-11, CR-29).',
                     'GHD / reverse hyper / back extension only if available and the client feels the target muscles (EQ-11).',
                     'Machines carry near-failure work (MYO, RIR 0-1); never justify a machine to the client as "better for growth" (machines = free weights for hypertrophy [S1]).',
                     'Older / injured / high-volume clients: compounds and isolation lean machine/cable (EQ-03); FOUNDATIONAL clients may use the MODERATE/ADVANCED-filed machines (EQ-04).',
                     'Tag each machine ON_RAMP / VOLUME_TOOL / ISOLATION; ON_RAMP machines are swapped out as the client earns the free version (one reference per block).',
                     'Leg machines are eligible for FOUNDATIONAL clients (CAT-04 operative level), but the athlete constraint band keeps them out of athlete main slots.'],
)

# =============================================================================================
# (7) OPEN QUESTIONS (consolidated, prioritised)
# =============================================================================================
OPEN_QUESTIONS = dict(
    answered_v0=[
        dict(q="Zones = where the load/hands sit, judged at the end position?", answered_by='CAT-04, CAT-10', result='zones are positions with a rotation bias (vertical = external, horizontal = internal/compressive); level follows from them; zones do not apply to plyos. The end-position detail for chops is not confirmed but reproduces his FBS ladder 12/12 - kept, low priority'),
        dict(q='Push press and jerks AA11:AA14 FOUNDATIONAL vs CAT-04 overhead = advanced', answered_by='LIB-13', result='push press stays FOUNDATIONAL (easier); push jerk INTERMEDIATE (intermediate/advanced)'),
        dict(q='High zercher AI47:AI48 MODERATE vs front-loaded zercher = foundational', answered_by='CAT-04 (his own anchor)', result='FOUNDATIONAL'),
        dict(q='Low-skill leg/hip machines FOUNDATIONAL for older/injured/beginners?', answered_by='EQ-04 RIGHT', result='kept'),
        dict(q='Medball weight per throw, lighter for women/youth/older?', answered_by='EQ-06 RIGHT, ATH-09', result='8-10 lb passes/rotations, overhead 6-10, sit-up 6-8, slams 10-20, heavier only for hang cleans / wall balls, never over 20 lb; lighter for youth/older; no sex-based rule'),
        dict(q='No medball: what goes in the Throwing slot? Meaning of FAKE MEDBALL SLAM', answered_by='EQ-07 RIGHT', result='plyo push-ups, fast cable rotations, the no-ball fake slam; never band chops'),
        dict(q='Olympic lifts without bumpers?', answered_by='ATH-10 RIGHT', result='everyone in athletic training gets Olympic work; beginners: DB/KB snatches and cleans, hex-bar jumps, hang pulls, hang cleans lowered under control'),
        dict(q='Seated machine shoulder press for VERTICAL PUSH?', answered_by='EQ-05 RIGHT', result="added as 'Seated Machine Shoulder Press' ADD-EQ05"),
        dict(q='Leg Extensions slot with no machine?', answered_by='EQ-08', result='swap (DB leg extension on a box, sissy squat; reverse Nordic proposed) - no bands'),
        dict(q='Whole leg-flexion segment for the Leg Curls slot?', answered_by='CAT-09, EQ-08', result='yes: nordics, slider or swiss-ball curls when there is no machine'),
        dict(q='Minimum home kit with bands?', answered_by='EQ-02', result="no bands; ideal home kit = adjustable DBs + bench + pull-up bar + 8-10 lb medball ('people have different things')"),
        dict(q='Rebalance the bilateral:unilateral ratio when a swap changes laterality?', answered_by='UNI-02, UNI-08', result='keep the sets if possible but adjust; the ratio (90/10 to 10/90) is adjustable and pain moves it - handled by 03'),
        dict(q='Default implement when the name has none?', answered_by='EQ-09 RIGHT', result='bodyweight -> DB -> barbell as level rises, limited by the kit (CR-30)'),
        dict(q="Chains 'slow you down' vs science; bands ~50% / chains ~70% of what?", answered_by='EQ-12 NOT RIGHT', result='no variable resistance at all for now'),
        dict(q='Horizontal before vertical for every client?', answered_by='ORD-01, ORD-02', result="yes (BYOP order), except the main lift ('the work') always goes first"),
        dict(q="HYBRID/CrossFit 'STRENGTH' above 'OLY/POWER'?", answered_by='ORD-03 RIGHT', result='power before strength'),
        dict(q='Which sports get more plyos?', answered_by='ATH-01, ATH-02 RIGHT', result='ranking confirmed; plyo vs ballistic set by ground-contact time'),
        dict(q='Implement sizes as numbers (boxes, hurdles)?', answered_by='EQ-16 RIGHT, LIB-04', result='drops low 6-12 in / medium 12-18 in / high above hip; hurdles 6 in moderate, 12 in+ advanced'),
        dict(q='Bike/rower/ski equal to running? Open DISTANCE/CALORIES?', answered_by='EQ-14 RIGHT, FIX-02 RIGHT', result='any erg; track by distance, calories or time'),
        dict(q="Data: Camporini, Kong rows, strap rotating, AA50/AA51 twin", answered_by='LIB-09, LIB-11', result="Camporini ignored (excluded); Kong row = double-KB row from the floor (pain option); strap rotating removed; AA51 = barbell press"),
        dict(q='Machine ranking (hack squat last?)', answered_by='EQ-11 NOT RIGHT', result='no ranking; describe constraint differences; belt squat for axial sparing; GHD/reverse hyper if available and felt'),
    ],
    still_open=[
        "Seal rows (X50:X53) are filed ADVANCED although chest-supported. Should supported rows be easier (FOUNDATIONAL/INTERMEDIATE) like the machine row? (not asked in the questionnaire)",
        "'KB Face Pulls ' (U20) under VERTICAL PULL: move to rear delts / side raises? (LIB-10 - no answer)",
        "'Bench Push ups': hands on the bench in FOUNDATIONAL (AD13) and feet on the bench in ADVANCED (AF11)? (LIB-12 - no answer)",
        "What does 'NO ACCESS' mean on the two hidden templates? (PRG-01 - skipped)",
        "Dips (AD96/AD97) and hanging core (O15, O16, O130): which zone/level? (low priority; CAT-08 calls toes-to-bar 'more complicated')",
        "Advanced client (L3): what training history makes someone advanced? PRG-05 defines novice and intermediate only (CR-17 has a PROPOSED definition).",
        "Rephrased CAT-12 (the coach did not understand it): should the generator only pick named exercises from your library, or may it also make a variation by changing one small thing (e.g. goblet -> front-rack, floor -> deficit)?",
    ],
    new_from_answers=[
        "No bands means no vertical pull at home without a bar. With DBs + bench and no pull-up bar, is a DB pullover plus 1-2 extra row sets (and a 'buy a doorway bar' note) acceptable? (EQ-01, EQ-02)",
        "Eight FUNCTIONAL BIOMECHANICS items use a band round the knees ('Knee banded for adduction ...', BC11-BC49). v1 swaps each one for its 'Hold object Adducted between knees' twin (ball, pad or pillow squeeze). Right? (EQ-01)",
        "Your sheets write some speed work with bands or chains ('FAST BANDED BENCH PRESS', banded box squats AI92-AI96, 'FAST CHAINED DL'). v1 keeps the lift with straight weight at 'FAST RPE6 or about 60-70%'. Right? And the 4th member of your French contrast (reverse-banded squat jumps): pogo / repeat squat jumps, or only the first three members? (EQ-12, ATH-12)",
        "Spine loading (PER-04): does the hinge follow the same once-a-week rule (deadlift once; the second hinge day uses hip thrust, back extension or reverse hyper)? Do front squats, zercher and heavy goblet squats count as spine-loading for this rule? With no machines at home, is a split squat or a light goblet squat the second squat day? (PER-04)",
        "Push press 'is easier' (LIB-13): FOUNDATIONAL for every client, or only inside athletic programs (non-athletes would wait until INTERMEDIATE)? (LIB-13 vs CAT-04)",
        "Belt squat and the seated machine shoulder press are not in your library, nor are the beginner Olympic options from ATH-10 (hang cleans, DB/KB snatches and cleans, hex-bar jumps) as FOUNDATIONAL rows. Add them to the MASTER EXERCISE LIBRARY? Which column and level? (EQ-05, EQ-11, ATH-10)",
        "Youth may do some Olympic lifts from the floor (ATH-09): from what age or training level? (ATH-09)",
        "Heavier medballs are for medball cleans and wall balls in 'CrossFit or ... high rows'. We read 'high rows' as HYROX. Right? (EQ-06)",
        "'21.6 mile run' (B33): you call it a marathon, but a marathon is 26.2 mi (21.6 mi is about 35 km). Change it to 26.2 mi, keep 21.6, or drop it? (LIB-18)",
        "On the 1-5 scale the hack squat and the Smith machine are both 4, yet you say the hack squat (and leg press) are more constrained than the Smith. Move hack and pendulum to 5, or keep 4 with the Smith at the bottom of level 4 (what v1 does)? (EQ-11, EQ-13)",
        "To replace band options, v1 uses a few standard exercises that are not in your sheets: reverse Nordic, foot-assisted pull-up, seated DB calf raise, eccentric-only Nordic, ball-squeeze dead bug, seated Smith shoulder press. OK to offer them, or only exercises from your library? (EQ-01, EQ-08; ties to CAT-12)",
    ],
)

# =============================================================================================
# ASSEMBLE
# =============================================================================================
gap = C['gap_matrix']
main_b = [b for b in gap if not b.startswith('FOCUS_')]
access_profiles = {}
for p in PROFILE_ORDER:
    pr = PROFILES[p]
    st = collections.Counter(gap[b][p]['status'] for b in main_b if not b.startswith('FUNCTIONAL') and b != 'FBS_CHOP_ANTIROT')
    access_profiles[p] = dict(
        label=pr['label'], intake_option=pr.get('intake_option'), derived_from=pr.get('derived_from'), kit=sorted(pr['kit']), ask_to_unlock=pr['ask'],
        unlock_ranking=[dict(add=r['add'], new_as_written_options=r['new_as_written_options'], empty_slots_filled=r['empty_slots_filled_as_written'],
                             slots_improved_incl_substitutes=r['slots_improved_incl_substitutes']) for r in C['unlock'].get(p, [])[:8]],
        typical_client=pr['typical_client'], maps_to_team_profiles=pr['maps_to'],
        slot_status_counts=dict(st),
        slots_without_as_written_option=[b for b in main_b if gap[b][p]['as_written'] == 0 and not b.startswith('FUNCTIONAL')],
        slots_with_level_gaps={b: gap[b][p]['missing_levels'] for b in main_b if gap[b][p]['status'] == 'level_gap'},
    )

home_q, seen = [], set()
for base in ['BODYWEIGHT', 'HOME_DB_BENCH']:
    for r in C['unlock'][base]:
        key = tuple(r['add'])
        if key in seen:
            continue
        seen.add(key)
        home_q.append(dict(kit=r['add'], asked_against=base, new_as_written_options=r['new_as_written_options'],
                           empty_slots_filled=r['empty_slots_filled_as_written'], slots_improved_incl_substitutes=r['slots_improved_incl_substitutes']))
INTAKE = dict(
    step_1_pick_base_profile=[p for p in sorted(PROFILE_ORDER, key=lambda x: PROFILES[x].get('intake_option') or 99) if PROFILES[p].get('intake_option')],
    step_1_note="The coach's eight options (COACH-ANSWER EQ-01 RIGHT, minus bands): full commercial gym, basic gym, home gym (rack + barbell + DBs), home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit. FULL_FACILITY and FIELD_TRACK_NO_KIT are reached through add-on answers.",
    step_2_add_ons_ranked_for_home_clients=home_q,
    step_3_space=['open_space_short (10-20 m)? -> COD', 'open_space_long (40-60 m / track / safe road)? -> sprints, bounding, outdoor running'],
    step_4_specific_machines_for_gym_clients=['leg press', 'pendulum', 'hack squat', 'belt squat', 'leg extension', 'leg curl (seated / lying)', 'lat pulldown', 'assisted pull-up', 'row machine', 'chest press', 'shoulder press machine', 'cable stack', 'Smith', 'GHD / 45-degree hyper / reverse hyper'],
    step_4_why='constraint and spine loading differ by machine (EQ-11, PER-04) and the client may prefer one (EQ-10); machines are NOT ranked (EQ-11)',
    step_5_non_equipment_fields_that_change_equipment_use=['age', 'training experience in years (novice under ~6-12 months; intermediate over ~1 year consistent; more than 6-12 months off = beginner body, skills return fast; ex-pros at L1 only briefly - COACH-ANSWER GEN-02, PRG-05)',
                                                           'body weight (loaded jumps at 10-20% of body weight, EQ-15; GEN-02)', 'pain or injury areas (and which joints)',
                                                           'sport + position + season if competitive; general sport only if recreational (GEN-02)', 'goal (hypertrophy, strength, power/speed, athletic, fat loss, hybrid)',
                                                           'equipment preference: machines / free weights / dumbbells / no preference (EQ-10, INFERRED question)',
                                                           'max dumbbell pair weight (sets the ceiling for home loading)', 'medball weights owned', 'box/step heights available'],
    removed_fields='sex (COACH-ANSWER GEN-02: "I need you to take away just sex"; ATH-09: no sex-based rules); bands (EQ-01)',
    rule='Never infer equipment from a template name (the NO ACCESS tabs are not equipment-filtered); filter options per slot from the intake answers only.',
)

exercise_index = {}
for it in items:
    exercise_index[it['cell']] = dict(
        name=it['name'], bucket=it['bucket'], library_category=it['category'], lvl=it['lvl'], lvl_library=it['lvl_library'], level_override=it.get('level_override'),
        coach_rule_level=it['coach_rule_level'], load_position_zone=it['zone'], zone_path=it.get('zone_path'), behind_body=it['behind_body'], zone_basis=it['zone_basis'],
        guidance=it['guidance_basis'], constraint=it['c'], skill=it['skill'], stability=it['stab'], velocity_intent=it['vel'], fv_zone=it['fv'], implement=it['impl'],
        laterality=it['laterality'], machine_role=it.get('machine_role'),
        display_name=it.get('display_name'), coach_description=it.get('coach_description'), rotation_bias=it.get('rotation_bias'), axial_load=it.get('axial_load'),
        excluded=it.get('excluded'), not_in_library=it.get('not_in_library', False), source=it.get('source'),
        needs=(dict(semantics='AND of OR-groups', groups=it['needs_and_of_or']) if 'needs_and_of_or' in it else dict(semantics='OR of AND-kits', kits=it['needs_or_of_and'])),
        available_in=[p for p in PROFILE_ORDER if it['avail'][p]], coach_usage_count=it['usage'], suitable_for=it['suitable_for'],
        coach_pref=G['PREF'].get(it['cell'], (None,))[0], flag=G['ITEM_FLAGS'].get(it['cell']))

# ---------------------------------------------------------------------------------------------
# Verification log (adversarial fact-check, 2026-10-08). Kept in the build so a rebuild reproduces it;
# build_10_write_md.py renders it as the last section of the .md.
# ---------------------------------------------------------------------------------------------
VERIFICATION_LOG = dict(
    date='2026-10-08',
    scope=('Adversarial fact-check of 10_equipment_model.md/.json and the four build scripts against raw/BYOP.xlsx and '
           'raw/MASTER_MODEL.xlsx (read with openpyxl), dumps/ and analysis/equipment/. Fixes were made in the build scripts and '
           'the outputs rebuilt, so a re-run reproduces them. Before the fixes the scripts reproduced the published files byte for byte.'),
    checked=[
        'Every library exercise name: all 432 exercise_index entries and every library entry of the 33 x 11 substitution lists '
        'match their MASTER EXERCISE LIBRARY cell (only L92 \'5-10-5\' is stored as a date, already flagged).',
        'All 84 OBSERVED / OBSERVED-lib curated substitutes: the name is in the cited cell (BYOP or MM).',
        'All 42 coach_alternates strings: n and cells re-found by scanning the MM program tabs (Copy of BASEBALL skipped). '
        "42/42 match; J67/AP67 'toes to bar or knees to chest' carry a YouTube link after the text.",
        'About 150 other cited cells, colours included (ALL ABOUT SQUATS, RESISTANCE PATTERNS, BALLISTICS, LUNGES, OLYMPIC, '
        'Sheet23, Sheet25, BASEBALL, 4 TRACKS, CONJUGATE, BOXING, UL, PPL, FAT BURN, CROSSFIT, ATHLETIC FULL BODY; BYOP '
        'JUSTICE LEAGUE, ATHLETIC, AESTHETICS, PPL, BOOTCAMP 2, NO ACCESS).',
        'COACH-ANSWER quotes against coach_answers.md; COACH-CHAT quotes against the brief.',
        'Every [S#] used here exists in 10b section 12 and its topic fits the claim.',
        'Substitution lists: every curated substitute is flagged same_pattern only when it is the same movement; cross-pattern '
        'fallbacks carry partial / zone_shift / pattern_gap / rule. Implement and kit tags spot-checked on 45 ambiguous items.'],
    recomputed=[
        'Athletic/core dropdown constraint C1 100 / C2 33 / C3 10 / C4 0 / C5 9 of 152: matches.',
        'Resistance library mean constraint 2.66 over 283, 19% at C>=4, 10% at C1; small muscles 29/53 = 55% DB/KB, 0 high skill: matches.',
        'MM population table, all six populations (e.g. gen pop 719 tagged items, canonical 2.81, MM 3.31, C4-5 36%, fast 2%; '
        'athletes 945, 2.00, 2.26, 11%, 45%, medball 13%): matches.',
        'MM to canonical crosswalk by exact name match on 431 items: 1.27 / 1.97 / 2.18 / 3.19 / 5.0 vs published 1.27 / 1.95 / 2.19 / 3.19 / 5.0.',
        'Level test 98/176 exact, 157 within one level; per-bucket and per-cause counts; zone x level table (70 / 28 / 65): matches.',
        'Spearman BYOP rubric vs canonical = 0.877 (published 0.88) - but over 413 cells, not 426.',
        '19 DB/barbell twin pairs; UNILATERAL KNEE DOMINANT AL9:AL21 mean 1.92; 6 overrides up / 14 down: match.',
        'Boxing weeks 1-2: canonical 2.76, machines 14%, fast 7% (matches); weeks 3-8: canonical 1.95 (published 1.6-1.8, corrected).',
        'Coverage matrix: as-written counts equal the distinct library names in each list in all 363 slot x profile cells.',
        'Ordering figures 13/13, 15/15, 225/231, 227/301, 178/244, 186/222, 107/121, 65/65, 48/51, 11/13, 12/14, 29 vs 2, 24 vs 2: '
        'match ordering_audit.md.'],
    corrections=[
        "JUSTICE LEAGUE 'constraint by position 1,1,3,1,1,2,3,1,1,5' had no scale: it is the BYOP program rubric; the canonical "
        "tags give 1,1,3,1,2,2,3,2,1,5 ('Power Clean' C92 and the FFE lunge AL15 are canonical 2). 'The only filled athletic day' -> "
        "'only fully filled' (E13 'SL Depth Drops' and E35 'Low Bar Back Squat' are also chosen).",
        'BYOP family table, no_access_hidden: the 26% in the Machine + cable column is the machine-only share; machine + cable '
        'is 30%, free weights 38%, bodyweight/field/props 31%, mean constraint 2.65 (prog_byop_equipment _group_comparison).',
        "'CrossFit is 96% barbell' mixed units: 96% is the keyword-scan share of implement-word cells (lib_resistance_notes); on "
        "line items barbell is 49/154 = 32% and the only loaded implement named. Fixed in section 2.1, implements.barbell and CR-06.",
        "CR-01 medball target '19 EXAMPLE ATHLETIC' -> 28% of line items (27/98) / 19% of implement-word cells.",
        "CR-07 boxing weeks 3-8 'constraint ~1.6-1.8' -> canonical ~1.95 (MM scale 1.96); machines ~8% added.",
        "Sub-rule evidence 'MM UL/PPL 19/19 sessions' -> 6/6 (UL 3 + PPL 3); the 19/19 of audit R1 is BYOP 13 + UL/PPL 6.",
        "'**MYO SET - ADVANCED' cited to ALL ABOUT SQUATS!B27, A30 -> C27 (label), B27 ('15/5/5/5/5/5'), A30 (definition).",
        "Zone-2 ladder 'vs suitcase MODERATE C19:C22': the cells read 'Contralateral loading ' / 'Ipsilateral loading '; "
        "'suitcase' is our reading and is now marked INFERRED.",
        "Zone-1 ladder 'ALL ABOUT LUNGES!C22:C30' included the zone-2 'on shoulder' loads C25:C27 -> C22:C24 + C28:C30.",
        "'push press and jerks AA11:AA14, which the coach's own RP traffic light colours red': RP does not list push press or "
        "jerk; it colours every standing overhead press red (RP!E13:E15). Reworded.",
        "Home DB + bench + bands gaps 'the FOUNDATIONAL leg-flexion ... levels' -> INTERMEDIATE leg flexion (AN18 is FOUNDATIONAL and "
        "available), INTERMEDIATE knee-dominant, FOUNDATIONAL horizontal pull, ADVANCED triple extension (gap_matrix).",
        "Basic-gym reading: the 4 Olympic lifts, 6 hurdle plyos and 'Max velocity running' / 'Bounding' are already missing in "
        "FULL_GYM; BASIC_GYM also loses 'High Depth Drop (above hip)' (hip-high box) and 'Hex bar squat to calf raise'.",
        "Scale crosswalk 'over 426 shared cells' -> 413 (427 BYOP-classified cells, 413 of them in exercise_index); "
        "'MM means run about 0.3-0.5 above canonical' -> 0.25-0.5 (athletes +0.26).",
        "COACH-CHAT quotes were longer than the brief they cite ('put your feet on the ground, and move your hands or your feet', "
        "\"but it's also safer\", 'people who have injuries, or people who are older', 'need to be light, 10 lbs., 8 lbs.') -> "
        "replaced with the brief's wording. CAT-04 quote: restored '(more positioning, stability and skill needed)'. The "
        "bilateral/unilateral 'must keep' rule is now labelled as our application of the coach's statement.",
        "'KB Face Pulls ' U20 (misfiled under VERTICAL PULL; a rear-delt / horizontal pull) was option 1 of the KB_ONLY RP_VPULL "
        "list -> moved after the substitutes and flagged misfiled_not_this_pattern (it was already excluded from counts and picks).",
        "Duplicate options removed: 'KB swing' twice in RP_BHD KB_ONLY (library AN20 + substitute); 'Bodyweight single-leg RDL "
        "with reach' twice in all 11 FOCUS_GLUTES lists.",
        "Leg-flexion substitutes 'Glidder hamstring runners', 'Swiss ball leg curls', 'Banded rolling hamstring curls': the coach "
        "writes them in the 'uhd' slot (MM BASEBALL!AH36, AP36, J54). Note added; CAT-09 still files knee flexion separately.",
        "Calf substitute evidence 'ankle/hurdle hops in the calfs slot' -> ankle hops only (BASEBALL 'calfs' slots hold calf raises "
        "and DB / heavy / high ankle hops, no hurdle hops).",
        "'near-failure work is safest at constraint >= 4 [S11][S20][S21]' was given as SCIENCE; none of the three tests failure "
        'safety by implement -> marked INFERRED with what each source does show.',
        "Level-test bucket label 'FBS_CHOPS' -> 'FBS_CHOP_ANTIROT' (the real bucket id).",
        "Smaller precision fixes: banded RP box squats are A26:A27 + A29:A30 (the unbanded A25/A28 are red too); Sheet23 AA1 header "
        "has no level; '50 situps + 50 crunches + 50 reverse crunches' located (MM EXAMPLE ATHLETIC FULL BODY SPLI!J25/F67); CR-16 "
        "hang pulls C49:C54 include the high/mid-hang pulls; population table header now 'Items with a constraint tag' (athletes "
        '945 of 949 line items); pick names in section 2.3 no longer cut mid-word; zones.py no longer tags the COD route '
        "'COMEBACK/CURL' (L91) as an arm curl in zone 1."],
    left_as_is=[
        "HYBRID 'STRENGTH' above 'OLY/ POWER': ordering_audit counts 16/16 (Mon/Thu); prog_mm_equipment counts 24/24 (Mon/Tue/Thu). Both are OBSERVED subsets.",
        "FOUNDATIONAL mean 2.98 / ADVANCED 2.21 and 'X ADVANCED 6/9 barbell' come from lib_resistance_notes (six levelled categories); "
        "the model's own kit tags let X48/X49 'Bent Over Rows ...' be done with dumbbells.",
        'Constraint, zone, skill and implement tags stay INFERRED from exercise names (the library has no equipment column).',
        'Science spot-check: [S35] R^2 ~0.98, [S43] jump-squat optimum 0-30% 1RM, [S69] seated > prone leg curl, [S80] ACSM order, '
        '[S94] variable resistance at >= 80% 1RM, [S97] chains about +10% bar velocity - consistent with those papers. '
        '[S63] is listed in 10b as Front Physiol 2026;16 (volume/year look inconsistent); not re-checked here.'],
)


# ---------------------------------------------------------------------------------------------
# v1 (2026-10-08): coach answers applied.  Rendered at the top of the .md as "v1 - coach answers applied".
# ---------------------------------------------------------------------------------------------
_band_re = re.compile(r'\bband(ed|s)?\b|\bchains?\b|releaser', re.I)
_shown_band = [(b, p_, (o.get('display_name') or o['name'])) for b, per in C['substitution_by_category'].items() for p_, lst in per.items() for o in lst
               if _band_re.search(o.get('display_name') or o['name'])]
_sub_needs_band = [(b, s_['name']) for b, lst in G['SUBS'].items() for s_ in lst if any(t in k for k in s_['needs'] for t in G['EXCLUDED_TOKENS'])]
_kit_band = [p_ for p_ in PROFILE_ORDER if set(PROFILES[p_]['kit']) & set(G['EXCLUDED_TOKENS']) or set(PROFILES[p_]['ask']) & set(G['EXCLUDED_TOKENS'])]
_xd = C['xcheck_diff']
_xd_summary = {k: dict(n=len(v), all_band_or_chain_route=all(x['band_or_chain_route'] for x in v),
                       other_cells=[x['cell'] for x in v if not x['band_or_chain_route']]) for k, v in _xd.items()}
V1 = dict(
    version='v1', date='2026-10-08',
    source='coach_answers_full.md (138 of 140 questions answered) + coach_answers.md; the coach answers are AUTHORITATIVE and override every sheet inference and every v0 decision',
    applied=[
        dict(ids='EQ-01, EQ-02', change="Bands removed everywhere: no 'band' / 'band_anchor' kit tokens, BANDS_ONLY profile deleted, HOME_DB_BENCH_BANDS -> HOME_DB_BENCH, bands dropped from every add-on and buy list. Ideal home kit = adjustable DBs + bench + pull-up bar + 8-10 lb medball."),
        dict(ids='EQ-12', change="Variable resistance out of scope: 'chains' token and weight releasers gone; banded / reverse-banded box squats AI92, AI93, AI95, AI96 removed; 'FAST BANDED' / 'CHAINED' lifts run with straight weight at 'FAST RPE6 or about 60-70%'; the v0 accommodating-resistance block is replaced by load_velocity.variable_resistance (out of scope) and out_of_scope_implements (history)."),
        dict(ids='EQ-01, LIB-09', change="%d library cells leave every list and count (exercise_index keeps them with the reason): U15 band-assisted pull-up; AI92/AI93/AI95/AI96; the 8 'Knee banded for adduction' FBS items (replaced by their 'Hold object Adducted between knees' twins); AQ16 Camporini (LIB-09 'ignore'). 6 'cable or band' names are shown with the cable route only." % len(C['excluded'])),
        dict(ids='EQ-01, EQ-07, EQ-08', change="%d v0 band / reverse-band substitutes removed and replaced with a non-band option or dropped (_meta.v1.removed_v0_subs): band pulldowns -> foot-assisted pull-up, cable lat pull-over, DB pullover; band chops -> fast cable rotations; band leg extension / Spanish squat -> DB leg extension on a box, reverse Nordic, heels-elevated goblet; band Nordic -> eccentric-only Nordic; band calf raise -> seated DB calf raise; band rows/raises/curls/pushdowns -> cable or DB/KB versions." % len(C['removed_v0_subs'])),
        dict(ids='EQ-01', change="Access profiles = the coach's 8 intake options (full gym, basic gym, home gym, home DB + bench, KB only, bodyweight only, hotel gym, field/track/outdoor kit). FULL_FACILITY and FIELD_TRACK_NO_KIT stay as derived (add-on) profiles; BOOTCAMP_OUTDOOR -> FIELD_TRACK_KIT; TRACK_FIELD -> FIELD_TRACK_NO_KIT (ids in _meta.v1.profile_id_changes)."),
        dict(ids='EQ-11', change="Machine ranking retired: the Pendulum > Leg press > Hack order and the hack-squat demotion are gone from lists, picks and rules. Constraint differences instead: leg press 5; hack squat and pendulum back-supported 4; Smith 4 and least constrained. Belt squat added as a coach-named option (ADD-EQ11) for axial sparing. GHD / reverse hyper only if available and the client feels the target muscles."),
        dict(ids='EQ-10, GEN-04', change='The client may choose between alternatives (preference); each slot keeps a default plus a dropdown of its category (CR-31).'),
        dict(ids='EQ-13', change='The 1-5 constraint scale is coach-approved; EQ-11 adds the order inside level 4 (GRD-4).'),
        dict(ids='EQ-03, EQ-04', change='Older / injured / high-volume clients: compounds and isolation lean machine/cable; never overhead squat, snatch, low-bar squat or depth jumps (CR-33; enforced in the older_or_pain picks). FOUNDATIONAL clients may use machines filed MODERATE/ADVANCED (confirmed).'),
        dict(ids='EQ-05', change="'Seated Machine Shoulder Press' added to VERTICAL PUSH (ADD-EQ05, constraint 5); a seated Smith press is its substitute."),
        dict(ids='EQ-06, ATH-05', change='Medball weights: passes/rotations 8-10 lb, overhead 6-10, sit-up 6-8, slams 10-20; heavier only for medball cleans / wall balls; never over 20 lb; lighter for youth and older clients; no throwing in the main workout for aesthetics (warm-up only) - the hypertrophy picks for the Throwing slot now say "not used".'),
        dict(ids='EQ-07', change="No medball -> plyo push-ups, fast cable rotations, the no-ball 'fake medball slam'; band chops removed ('worthless')."),
        dict(ids='EQ-08', change="No leg extension / leg curl machine -> swap: DB leg extension on a box, sissy squat (reverse Nordic PROPOSED); nordics, slider or swiss-ball curls. The 'add 2 rounds to front squats' rule is now the fallback."),
        dict(ids='EQ-09', change='Default implement when a name has none: bodyweight -> DB -> barbell as the level rises, within the kit (CR-30).'),
        dict(ids='EQ-14, ATH-07, FIX-02', change='Aerobic work on any erg or running; tracked by distance, calories or time with one unit per block (CR-35); DISTANCE and CALORIES blocks open to every template.'),
        dict(ids='EQ-15, GEN-02', change='Loaded jumps 10-20% of body weight, too heavy when jump height or speed drops; body weight is now an intake field.'),
        dict(ids='EQ-16, LIB-04', change='Depth drops low 6-12 in / medium 12-18 in / high above hip; hurdles 6 in moderate, 12 in+ advanced (load_velocity.plyo_heights).'),
        dict(ids='ATH-10', change='Everyone in athletic training gets Olympic-lift work. Four options from his programs are added as FOUNDATIONAL triple-extension options (ADD-ATH10-1..4: hang cleans without bumpers, single-arm DB snatch, KB squat cleans, hex-bar squat jumps).'),
        dict(ids='ATH-09', change='No sex-based rules (CR-19 female medball modifier retired); youth may do some Olympic lifts from the floor (CR-18); older clients get few plyos unless they ask (CR-10).'),
        dict(ids='CAT-10, CAT-11, CAT-05', change="Zones are Davidson rotation biases (rotation_bias tag added); zones do not apply to plyos (plyo zone tags removed); the Sheet23 plyo 'ZONE 1/2/3' key is an unnamed method progression; levels stay soft (LV-7, LV-8)."),
        dict(ids='LIB-13', change='Push press back to FOUNDATIONAL ("easier"); push jerk INTERMEDIATE ("intermediate/advance"). v0 had both at ADVANCED.'),
        dict(ids='LIB-02, LIB-03, LIB-07, LIB-08, LIB-09, LIB-11, LIB-15, LIB-16, LIB-18', change="Library details: 'Squat Snatch' / 'Squat Clean' / 'Squat Clean & Jerk' display names; GHD has no level; Kong row added as a KB pain option; 'Single Leg Get Ups' = box pistol; 'Low DB Squats' = DBs at the sides (zone 1); alternating deadlifts = alternating staggered-stance single-leg deadlifts; 'pull under' = lat pull-over; push-up stick the landing = hands from a box to the floor; AA51 = barbell press; leg-extension/curl level labels are typos; dips 0.5/0.5; '21.6 mile run' flagged (a marathon is 26.2 mi)."),
        dict(ids='PER-04, EQ-11', change='axial_load tag on every lower-body exercise; one axially loaded squat day per week - the second squat day uses leg press / belt squat (CR-29); deadlifts also load the spine, so heavy hinging is kept to one day (PROPOSED, open question).'),
        dict(ids='ATH-11, ORD-01, ORD-02, ORD-03, ORD-04, ORD-05, ORD-06, ORD-08, ORD-09, ORD-10, UNI-11, VOL-15, VOL-17', change='Session order: warm-up always; core FIRST by default (movable); power before strength; row before pulldown always but the main lift first whatever its direction; hip-dominant + push and knee-dominant + pull on every day type incl. bootcamps; supersets as a fatigue tool; MYO last on machines/isolation; calves 3 sets each leg day and rear delts their own sets. Retired exceptions: pulldown before row, strength above Olympic work, core placement by family.'),
        dict(ids='VOL-03, UNI-08', change='Pain rule: machines or split grips plus a 30-50% cut, drop the exercise if still too much; keep the sets when a bilateral lift turns unilateral if possible (CR-12).'),
        dict(ids='VOL-07', change='High-volume rule: added sets go to the exercises already in the session, first exercise first (CR-14).'),
        dict(ids='CAT-13', change='Contralateral (into the hip, COD athletes) vs ipsilateral (out of the hip, sprint acceleration) loading rule; health accessory for bodybuilders/powerlifters in the first 2-4 weeks (CR-32).'),
        dict(ids='UNI-02, UNI-03', change='Laterality-shift rule now defers to the adjustable bilateral:unilateral ratio (90/10 to 10/90, moved by pain) in 03_volume_dosing (CR-25).'),
        dict(ids='GEN-02, PRG-05', change='Intake: sex removed; training experience in years with the coach\'s novice / intermediate definitions; body weight added; optional equipment preference.'),
        dict(ids='ATH-01, ATH-02, ATH-04, ATH-06, ATH-08, ATH-12, PER-08, PER-09, UNI-10, VOL-09, VOL-10, VOL-11, PRG-03', change='Athlete and goal rules: plyo vs ballistic by ground-contact time; boxers reduce (not cut) pressing; COD routes for every athlete; pitchers less overhead; contrast for intermediate+ off-season; in-season focus; helpers credit 0.25 (chin-up note); athletic sets never count toward muscles; 40-rep sets only as a CrossFit/AMRAP option; bootcamp timed circuits.'),
        dict(ids='all', change='Open questions rebuilt: 21 of the 24 v0 questions are answered (open_questions.answered_v0); 7 remain open; 11 new questions come from the answers.'),
    ],
    pending=[
        'PROPOSED - PENDING COACH APPROVAL: French contrast 4th member without a reverse band (pogo / repeat squat jumps or a 3-member complex).',
        'PROPOSED - PENDING COACH APPROVAL: non-library replacements for band options (reverse Nordic, foot-assisted pull-up, seated DB calf raise, eccentric-only Nordic, ball-squeeze dead bug, seated Smith shoulder press).',
        'PROPOSED - PENDING COACH APPROVAL: advanced (L3) definition (CR-17); the second squat day for home clients without machines (CR-29); equipment-preference intake question (CR-31).',
        'Coach decision needed: add belt squat, seated machine shoulder press and the ATH-10 beginner Olympic options to the MASTER EXERCISE LIBRARY (with a level).',
        'Unanswered: LIB-10 (KB Face Pulls U20), LIB-12 (Bench Push ups AD13/AF11), PRG-01 (NO ACCESS, skipped), CAT-12 (not understood; rephrased), seal-row level, dips / hanging-core level.',
        'Parked by the coach: all variable resistance (bands, chains, weight releasers) for a later version (EQ-01, EQ-12).',
        'Team alignment: generator_spec_v0.json, 09_generator_inputs.md and 02_exercise_catalog still use the v0 profile ids and include the band cells; use _meta.v1.profile_id_changes and exercise_index[cell].excluded.',
    ],
    profile_id_changes=G['PROFILE_ID_CHANGES'],
    excluded_cells=C['excluded'],
    removed_v0_subs=[dict(name=a, slot=b, basis=c, replaced_by=d) for a, b, c, d in C['removed_v0_subs']],
    additions=[dict(id=it['cell'], name=it['name'], slot=it['bucket'], lvl=it['lvl'], constraint=it['c'], source=it['source'], available_in=[p_ for p_ in PROFILE_ORDER if it['avail'][p_]])
               for it in items if it['lib'] == 'coach_addition'],
    verification=dict(
        shown_names_mentioning_band_chain_or_releaser_in_any_list=len(_shown_band),
        curated_substitutes_needing_an_excluded_token=len(_sub_needs_band),
        profiles_with_an_excluded_token_in_kit_or_add_ons=_kit_band,
        cross_check_vs_decode_tiers=_xd_summary,
        note="Every disagreement with the decode teams' tiers is a band/chain route that v1 removes, except the 6 known v0 BASIC_GYM differences (TRX U19, X12, AS19; hex bar C11, C48; hip-high box G133)."),
)

OUT = dict(
    _meta=dict(
        verification_log=VERIFICATION_LOG,
        title='Blaze Camp equipment model (generator-ready) - v1, coach answers applied', built='2026-10-08', version='v1',
        v1=V1,
        coach_pref_use="exercise_index[cell].coach_pref and list field coach_pref are the coach's OBSERVED sheet opinions ('LOVE IT', \"I PERSONALLY DON'T LIKE IT\"); informational only - they never rank anything (COACH-ANSWER EQ-11)",
        sources=['coach_answers_full.md + coach_answers.md (COACH-ANSWER, authoritative)', 'analysis/equipment/lib_athletic_core.json + _notes.md', 'analysis/equipment/lib_resistance.json + _notes.md', 'analysis/equipment/prog_byop_equipment.json/.md',
                 'analysis/equipment/prog_mm_equipment.json/.md', 'analysis/equipment/reference_variables.json/.md', 'analysis/equipment/ordering_audit.json/.md',
                 'synthesis/10b_equipment_variables_science.md (SCIENCE ids [S#], rule ids EQ/GRD/FV/ROM/VOL/VARI/ORD/AR/TEMPO)', 'synthesis/05_session_architecture.md (bucket ids)', "dumps/MASTER_MODEL/09_Sheet25.txt ('LEG FLEXION')", 'dumps/MASTER_MODEL/18_Sheet23.txt (ZONE rows)'],
        evidence_labels=dict(COACH_ANSWER='the coach\'s written answers (coach_answers.md); override sheet inferences', OBSERVED='read from a workbook cell (tab!cell; MM = MASTER MODEL; library cells are MASTER EXERCISE LIBRARY in BYOP)',
                             COACH_CHAT="the coach's spoken words relayed in the brief", SCIENCE='published finding; ids point to 10b section 12', INFERRED='analyst derivation'),
        how_to_use=['1. Intake -> pick one of the 8 intake options (intake.step_1_pick_base_profile) and add the add-on kit tokens; never offer bands, chains or weight releasers (CR-36).',
                    '2. For each template slot (bucket) take substitution_by_category[bucket][profile]; keep options with lvl <= client level (levels ADD options, CAT-05), then re-rank by client_rules (constraint band, preferences, pain). picks_by_client_family shows the result for 6 typical clients.',
                    "3. Library items carry src='library' (show display_name when present); coach-approved additions carry src='coach_addition'; substitutes carry substitute=true with flag same_pattern | partial | zone_shift | pattern_gap | rule. Prefer as-written, then same_pattern, then partial/zone_shift; report pattern_gap to the client with the buy list (the coach's ideal home kit, EQ-02). Respect 'laterality_shift' (CR-25) and 'axial_load' (CR-29). Let the client swap within the slot (dropdown, CR-31).",
                    '4. For a custom kit use exercise_index[cell].needs with the stated semantics.', '5. Order the session with intent_sequence; dose with load_velocity.'],
        ordering_of_lists='as-written options first (library items + coach-approved additions; excluded cells never appear): operative level (F < I/any < A), then demoted items last within a level (leg-extension copies in compound columns, misfiled items - v1: no machine is promoted or demoted for preference, EQ-11), then the coach-rule level (easiest first), then most constrained first, then coach usage, then library row; in athletic slots the additions follow the library items of their level; substitutes follow in curated preference order (a substitute that repeats a name already in the list is dropped); a misfiled library item that is not the slot pattern (misfiled_not_this_pattern: \'KB Face Pulls \' U20 in RP_VPULL) is listed last of all and never counts as as-written.',
        cross_check=dict(note="availability recomputed from each exercise's requirement groups with this file's kit tokens, against the decode teams' own tiers (which still include bands, and chains at full_gym)",
                         counts=C['xcheck'], differences=_xd_summary,
                         known_differences="v1: every 'theirs_only' cell reaches the exercise only through a band or chain route (removed, EQ-01/EQ-12), except the v0 BASIC_GYM differences: TRX as an add-on ('Seated Pull ups with Rings or TRX' U19, 'TRX Rows' X12, 'TRX Bicep Curls' AS19) and no hex bar or hip-high box (C11, C48, G133)."),
        constraint_scale_note='constraint numbers are on the canonical scale (lib_*.json); MASTER MODEL population means are converted with the measured crosswalk',
        changes_from_coach_answers=['level_model (CAT-04/05/06: Davidson load-position zones, guidance modifier, soft cumulative levels; operative-level overrides: 6 entries up to ADVANCED, 14 down to FOUNDATIONAL)',
                                    'ISO_LEG_FLEXION segment (CAT-09) replaces ISO_HAM and absorbs 9 knee-flexion items from BILATERAL HIP DOMNANT',
                                    'FBS treated as a core/anti-rotation bucket, not a biomechanics bucket (CAT-03)', 'small-muscle implement rule (CAT-02)',
                                    'sport plyo emphasis (basketball > MMA > boxing/karate) and the bilateral/unilateral volume rule from the coach\'s chat statements',
                                    'v1: see _meta.v1.applied (questionnaire answers EQ-01..16, ATH-05, ATH-10 and every other answer that touches equipment)']),
    implement_groups=IMPLEMENT_GROUPS,
    implements=IMPLEMENTS,
    out_of_scope_implements=OUT_OF_SCOPE_IMPLEMENTS,
    constraint_scale=CONSTRAINT_SCALE,
    level_model=LEVEL_MODEL,
    segment_changes=SEGMENT_CHANGES,
    kit_tokens=KIT_TOKENS,
    access_profiles=access_profiles,
    intake=INTAKE,
    slot_meta=SLOT_META,
    substitution_by_category=C['substitution_by_category'],
    gap_matrix=C['gap_matrix'],
    client_rules=CLIENT_RULES,
    client_families=FAMILIES,
    picks_by_client_family=picks,
    population_benchmarks=dict(mm_programs=C['pop_stats'], byop_families=dict(
        aesthetics=dict(machine_plus_cable_pct=31, free_weights_pct=46, bodyweight_field_props_pct=22, mean_constraint_byop_rubric=2.82, slots_with_no_equipment_option='42/85', with_home_kit='76/85'),
        athletic=dict(machine_plus_cable_pct=18, free_weights_pct=40, bodyweight_field_props_pct=42, mean_constraint_byop_rubric=2.17, slots_with_no_equipment_option='52/80', with_home_kit='72/80'),
        bootcamp=dict(machine_plus_cable_pct=23, free_weights_pct=43, bodyweight_field_props_pct=31, mean_constraint_byop_rubric=2.56, slots_with_no_equipment_option='32/58', with_home_kit='54/58'),
        no_access_hidden=dict(machine_plus_cable_pct=30, machine_share_pct=26, free_weights_pct=38, bodyweight_field_props_pct=31, mean_constraint_byop_rubric=2.65,
                              slots_with_no_equipment_option='34/68', with_home_kit='56/68'))),
    intent_sequence=INTENT_SEQUENCE, sequence_subrules=SEQUENCE_SUBRULES, sequence_exceptions=SEQUENCE_EXCEPTIONS, sequence_exceptions_retired_v1=RETIRED_EXCEPTIONS,
    load_velocity=LOAD_VELOCITY,
    machine_preferences=MACHINE_PREFERENCES,
    coach_alternates=[dict(a, v1_use=("band route excluded (EQ-01): use the cable or Bird Dog (DB/KB) route" if 'band row' in a['text'] else
                                     "band assistance excluded (EQ-01): pull-ups, negatives or foot-assisted pull-ups" if 'banded' in a['text'] else None))
                      for a in C['coach_alternates']],
    exercise_index=exercise_index,
    open_questions=OPEN_QUESTIONS,
)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
out_path = os.path.join(ROOT, 'synthesis', '10_equipment_model.json')
json.dump(OUT, open(out_path, 'w'), indent=1, ensure_ascii=False)
print('wrote', out_path, os.path.getsize(out_path), 'bytes')
