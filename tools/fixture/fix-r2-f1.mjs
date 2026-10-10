// tools/fixture/fix-r2-f1.mjs - model 1.3.0, engine 0.4.0 FIX ROUND 2 / F1 (time, volume and structure). Applied after
// fix-r1-f3.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps
// deep-equalling the fixture rules (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value
// names its source: COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What fix round 2 / F1 changes in the model (engine/DECISIONS.md section E, fix round 2 / F1, E-135 ... ; samples/REVIEW_LOG.md
// v0.4 fix round 2 / F1):
//   * rules.placement.added_slots.big_lines_on_optional_day = 'focus_only' - the stairway of a big line climbs on the MAIN days; only a
//     Focus line (the client's Focus muscle 1 / 2) may climb on the optional day, inside its two Focus slots x 2-3 sets (COACH-ANSWER
//     ORD-10 / ORD-11, COACH-R3 R3-VOL-03 'Monday's first back exercise, then Thursday's'; RECHECK v0.4 01 / 03 / 06: the climb sat
//     on the optional Saturday while the main days held flat)
//   * rules.stairway.hold_rules.main_days / total_hold - H21 reads the main days too (main_sets_by_group) and the main-day total may
//     not hold for more than half the block (R3-VOL-04, R3-SES-02 step 4)
//   * rules.stairway.release_rounding.mode = 'scheduled' - a whole-set schedule per block (buildSchedule), the last week lands on the
//     ceiling (R3-VOL-04 'each muscle reaches its ceiling exactly in the last week'; RECHECK v0.4 04 / 08: the ceiling reached in week
//     4 / 10 and held)
//   * templates athletic.3: S1 / S2 cross pattern (G2 and its mirror; COACH-R3 R3-SES-01 'cross pattern stays the default for most
//     athletes'; D-81 retired)

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * Fix round 2 / F1 rule amendments (after amendRulesF3).
 * @param {object} rules @returns {object}
 */
export function amendRulesR2F1(rules) {
  const R = clone(rules);
  R.placement.added_slots = {
    ...R.placement.added_slots,
    big_lines_on_optional_day: 'focus_only',
    optional_focus: { slots: 2, sets_max: 3, refs: ['ORD-10', 'ORD-11', 'R3-VOL-03'] },
    r2_status: 'PROPOSED (fix round 2 / F1, E-135): a big line climbs on the main days; only a Focus line may climb on the optional day, inside its two Focus slots x 2-3 sets'
  };
  // the keep order of the time check (R3-SES-02 step 2): racket players 50+ keep calves first (R3-ATH-02 'calf and Achilles work every
  // leg day', approved); field / court athletes keep calves (one exercise x 3 sets a leg day, R3-SES-01) before the shoulder isolation
  R.session.time_fit = {
    ...R.session.time_fit,
    keep_order_r2: {
      pin_first_50_racket: { groups: ['calves'], age_gte: 50, refs: ['R3-ATH-02'] },
      athletic: ['hips', 'quads', 'back', 'chest', 'calves', 'shoulders', 'triceps', 'biceps'],
      refs: ['R3-SES-02', 'R3-SES-01', 'R3-ATH-02'],
      status: 'PROPOSED (fix round 2 / F1, E-140)'
    },
    // a stay-active plan keeps one athletic station a day and switches its power block off before a big mover leaves (E-143; COACH-R3
    // R3-SES-02 'turn off that day's athletic training ... and just focus on resistance'); the block stays switchable (offer.block_on)
    stay_active_room_cuts: ['stay_active_second_athletic', 'stay_active_power'],
    // a main day keeps the pattern its work lift names: a big mover the time check leaves out comes back below its floor on its work
    // lift's day (E-144; UNI-11 / ORD-06 knee + pull, hip + push; BRAIN 10.7 every primary pattern each week)
    keep_day_patterns: true,
    // the schedule offers name the smallest longer session that trains one more group directly, and the core opener's minutes (E-148)
    offer_lengths: [60, 75, 90, 105, 120],
    offer_block_off_min: 3,
    // timed circuits: the R3-SES-02 step-2 credit groups read their donor room on group sets with helper credit (E-149)
    circuit_credit_donors: ['shoulders', 'biceps', 'triceps'],
    stay_active_room_cuts_status: 'PROPOSED (fix round 2 / F1, E-143)'
  };
  // a big mover the minutes leave untrained directly keeps its pattern on the main day whose work lift it pairs with (knee + pull,
  // hip + push; UNI-11 / ORD-06), as a superset with that lift, before the optional day (E-145; RECHECK v0.4 08 blocker / 01 major)
  R.volume.pattern_keep = { ...R.volume.pattern_keep, main_day_pairs: true, main_day_status: 'PROPOSED (fix round 2 / F1, E-145)' };
  // whole sets follow the planned T(w) rounded down and the last week lands on the ceiling (E-146; COACH-R3 R3-VOL-04 'each muscle
  // reaches its ceiling exactly in the last week'; RECHECK v0.4 04 / 06 / 07 / 08: the half-up release reached the ceiling weeks early)
  R.stairway.release_rounding = { ...R.stairway.release_rounding, mode: 'scheduled', r2_status: 'PROPOSED (fix round 2 / F1, E-146): a whole-set schedule per block - each set in the week its planned T(w) passes the half set, the last in the last week, the 7 % weekly limit, no week without a step where a neighbour holds two (was half_up, E-85)' };
  R.stairway.hold_rules = {
    ...R.stairway.hold_rules,
    main_days: true,
    total_hold_max_frac: 0.5,
    r2_status: 'PROPOSED (fix round 2 / F1, E-136): H21 reads the main days too; the main-day total holds for at most half the block'
  };
  return R;
}

/**
 * Fix round 2 / F1 template amendments (after amendTemplatesB2).
 * @param {object} families @returns {object}
 */
export function amendTemplatesR2F1(families) {
  const F = clone(families);
  // E-155 (RECHECK v0.4 07 major: four rear-delt flies a week - two near-identical on each pull day - while the side delts held 2
  // stations of 2 sets for 12 weeks): the PPL pull day's second delt slot is the coach's 'ABdution' side raise (OBSERVED BYOP
  // 'PUSHPULLLEGS' pull day: one 'ABdution' slot + one 'Reverse Flies' slot; the slot's own note says so; COACH-R3 R3-VOL-01 'one
  // rear-delt exercise a week, people add more if they want')
  const ppl = F.aesthetics && F.aesthetics.days && F.aesthetics.days['6'] && F.aesthetics.days['6'].variants && F.aesthetics.days['6'].variants.ppl_x2;
  const pull = ppl && ppl.day_types && ppl.day_types.Pull;
  const s10 = pull && (pull.stations || []).find(x => x.id === 'Pull.s10');
  if (s10 && s10.bucket === 'ISO_SIDE_REAR_DELT' && s10.variant === 'rear' && !process.env.NO_R2T) {
    s10.variant = 'side';
    s10.note = "OBSERVED 'ABdution' slot (BYOP PUSHPULLLEGS pull day): a side raise next to the reverse fly - shoulder width for a physique client (fix round 2 / F1, E-155; COACH-R3 R3-VOL-01)";
  }
  const t = F.athletic && F.athletic.days && F.athletic.days['3'];
  if (!t || !t.day_types || !t.day_types.S1 || !t.day_types.S2 || process.env.NO_R2T) return F;
  const S1 = t.day_types.S1, S2 = t.day_types.S2;
  const byId = (dt, id) => dt.stations.find(s => s.id === id);
  if (!byId(S1, 'S1.s11') || byId(S1, 'S1.s11').bucket !== 'RP_UKD') return F; // already amended / unexpected source: leave it
  // the same-pattern days stay for size-focused and high-level athletes (COACH-R3 R3-SES-01; intake 'same_pattern' step)
  t.variants = { ...t.variants, same_pattern: {
    week_layout: null, evidence: null,
    use_when: 'size-focused and high-level athletes (COACH-R3 R3-SES-01 "your same-pattern athletic template ... for size-focused and high-level athletes"; COACH-ANSWER UNI-06): S1 squat + single-leg squat with pulls, S2 hinge + single-leg hinge with pushes (the v1.1 athletic.3 S1 / S2)',
    day_types: {
      S1: { ...clone(S1), label: 'S1 - jump + squat + single-leg squat + pulls', label_key: 'day.athletic.3.same_pattern.S1' },
      S2: { ...clone(S2), label: 'S2 - medball + hinge + single-leg hinge + pushes', label_key: 'day.athletic.3.same_pattern.S2' }
    }
  } };
  const st = (src, over) => ({ ...clone(src), ...over });
  const P = (pair) => ({ pair, superset: pair, superset_below_minutes: 999 });
  const NP = { pair: null, superset: null, superset_below_minutes: null };
  // S1 = G2 A: [BKD | HPULL] + [UHD | VPUSH] + [leg extension | VPULL] + leg curl + rear delt + calf (the coach's athletic A day,
  // OBSERVED BYOP ATHLETIC; athletic.2 A / athletic.4 A1): knee + pull and hip + push on the same day, both lower patterns covered
  const O1 = { stations: clone(S1.stations) }, O2 = { stations: clone(S2.stations) }; // the v1.1 stations (read-only sources)
  const s1 = (id) => byId(O1, 'S1.' + id);
  S1.stations = [
    ...['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'].map(s1).map(clone),
    st(s1('s13'), { id: 'S1.s11', role: 'secondary', group: 'hips', sets_hint: [2, 3], axial: 'non_axial', ...P('P2'), note: 'hips exercise 1: single-leg hinge (single-leg RDL / staggered deadlift) - the cross pattern pairs the squat day with a single-leg hinge (COACH-ANSWER UNI-06, COACH-R3 R3-SES-01)' }),
    st(s1('s12'), { id: 'S1.s12', bucket: 'RP_VPUSH', group: 'shoulders', ...P('P2'), note: 'hip + push: the single-leg hinge pairs with a vertical press (UNI-11, ORD-06)' }),
    st(s1('s14'), { id: 'S1.s13', bucket: 'ISO_QUAD', group: 'quads', ...P('P3'), note: 'quads exercise 2 (leg extension / Spanish squat / sissy squat)' }),
    st(s1('s12'), { id: 'S1.s14', bucket: 'RP_VPULL', group: 'back', sets_hint: [2, 2], ...P('P3'), note: 'back exercise 2 (row before pulldown, ORD-01)' }),
    st(s1('s14'), { id: 'S1.s15', note: 'hips exercise 2 (nordics / leg curls)' }),
    st(s1('s15'), { id: 'S1.s16', ...NP, note: 'shoulders exercise 2 on the pull day (rear delt, face pull)' }),
    st(s1('s17'), { id: 'S1.s17' })
  ];
  S1.groups = ['quads', 'back', 'hips', 'shoulders', 'calves'];
  // S2 = G2 B (mirror): [BHD | HPUSH] + [UKD | HPULL] + [single-leg hinge | chest 2] + [leg extension | VPULL] + calf (athletic.2 B /
  // athletic.4 B1, the non-axial hinge day): hip + push and knee + pull on the same day; its second hip exercise is single-leg (the
  // leg curls sit on S1 / S3)
  const s2 = (id) => byId(O2, 'S2.' + id);
  S2.stations = [
    ...['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'].map(s2).map(clone),
    st(s2('s11'), { id: 'S2.s11', bucket: 'RP_UKD', group: 'quads', note: 'quads exercise 1: single-leg squat (split squat / step-up) - the cross pattern pairs the hinge day with a single-leg squat (COACH-ANSWER UNI-06, COACH-R3 R3-SES-01)' }),
    st(s2('s12'), { id: 'S2.s12', bucket: 'RP_HPULL', group: 'back', note: 'knee + pull: the single-leg squat pairs with a row (UNI-11, ORD-06; row before pulldown, ORD-01)' }),
    st(s2('s11'), { id: 'S2.s13', ...P('P3'), sets_hint: [2, 2], note: 'hips exercise 2: single-leg hinge (single-leg glute bridge / staggered deadlift) - the non-axial hinge day keeps its single-leg hip work (UNI-02 field-athlete share)' }),
    st(s2('s13'), { id: 'S2.s14', ...P('P3'), note: 'chest exercise 2' }),
    st(s1('s14'), { id: 'S2.s15', bucket: 'ISO_QUAD', group: 'quads', ...P('P4'), note: 'quads exercise 2 (leg extension / Spanish squat / sissy squat)' }),
    st(s1('s12'), { id: 'S2.s16', bucket: 'RP_VPULL', group: 'back', sets_hint: [2, 2], ...P('P4'), note: 'back exercise 2' }),
    st(s2('s15'), { id: 'S2.s17' })
  ];
  S2.groups = ['hips', 'chest', 'quads', 'back', 'calves'];
  // (E-137: the v1.1 same-pattern S1 / S2 are the same_pattern variant for size-focused and high-level athletes; D-81 retired)
  amendClassR2F1(F);
  amendBootcampR2F1(F);
  return F;
}

/**
 * Bootcamp 3 (fat_loss_bootcamp.3 BC3), E-150: the day trained chest and shoulders with one station each (RECHECK v0.4 05 major,
 * COACH-R3 R3-SES-01 '2-4 exercises per group, never 1'): its side-raise station becomes the day's first chest press (push-up / DB
 * floor press), so chest gets two stations that day and the shoulders train on Bootcamp 2 (press + side raise)
 */
function amendBootcampR2F1(F) {
  const t = F.fat_loss_bootcamp && F.fat_loss_bootcamp.days && F.fat_loss_bootcamp.days['3'];
  const BC3 = t && t.day_types && t.day_types.BC3;
  if (!BC3) return;
  const s9 = BC3.stations.find(s => s.id === 'BC3.s09');
  if (!s9 || s9.bucket !== 'ISO_SIDE_REAR_DELT') return;
  Object.assign(s9, { bucket: 'RP_HPUSH', group: 'chest', variant: null, note: 'chest station 1 (push-up / DB floor press): Bootcamp 3 trains chest with two stations, never one (R3-SES-01); shoulders train on Bootcamp 2' });
  BC3.groups = (BC3.groups || []).filter(g => g !== 'shoulders').concat((BC3.groups || []).includes('chest') ? [] : ['chest']);
}

/**
 * The CrossFit-style class (hybrid_crossfit.4 crossfit_style_bootcamp), E-141: the Olympic piece sits where the coach's class split
 * puts it - the snatch on the press day, the clean on Friday (OBSERVED MASTER_MODEL 'CLASS PROGRAMMING SPLIT': MON squat + DUBS, TUES
 * press + snatch, THURS deadlift + GYMNASTICS, FRID clean; 04_profiles crossfit_class.triple_ext 'snatch Tue, clean Fri'), so the
 * squat and deadlift days hold their lift and its pairs; the skill practice stays on the days the split names it (DUBS on the squat
 * day, GYMNASTICS on the deadlift day) and joins the other days only at 75+ minutes (RECHECK v0.4 04 major: Monday over 60 while
 * Tuesday ran 14 minutes under). COACH-R2 R2-ATH-04 classifies the lifts (cleans squatty, snatches hingy) without fixing their day.
 */
function amendClassR2F1(F) {
  const hc = F.hybrid_crossfit && F.hybrid_crossfit.days && F.hybrid_crossfit.days['4'];
  const v = hc && hc.variants && hc.variants.crossfit_style_bootcamp;
  if (!v || !v.day_types) return;
  const SQ = v.day_types.SQUAT, PR = v.day_types.PRESS, DL = v.day_types.DEADLIFT, CP = v.day_types['CLEAN/PUSH'], WD = v.day_types.WOD;
  if (!SQ || !PR || !DL || !CP) return;
  const oly = (dt) => dt.stations.find(s => s.bucket === 'AP_TRIPLE_EXT');
  const sqOly = oly(SQ);
  if (!sqOly || oly(PR)) return; // already amended / unexpected source
  SQ.stations = SQ.stations.filter(s => s !== sqOly);
  const dlOly = oly(DL);
  if (dlOly) DL.stations = DL.stations.filter(s => s !== dlOly);
  const work = PR.stations.findIndex(s => s.role === 'work');
  PR.stations.splice(work < 0 ? PR.stations.length : work, 0, { ...clone(sqOly), id: 'PRESS.s06', variant: 'snatch', note: "'SNATCH' on the press day (OBSERVED class split 'TUES press + snatch'; 04_profiles crossfit_class triple_ext)" });
  const cpOly = oly(CP);
  if (cpOly) { cpOly.variant = 'clean'; cpOly.note = "'CLEAN' on Friday (OBSERVED class split 'FRID clean'; 04_profiles crossfit_class triple_ext)"; }
  for (const dt of [PR, CP, WD].filter(Boolean)) for (const s of dt.stations) if (s.bucket === 'SKILL' && !s.note) s.include_from_minutes = 75;
  SQ.label = 'Squat day'; PR.label = 'Press + snatch day'; DL.label = 'Deadlift + push day'; CP.label = 'Clean + pull day';
}

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_R2F1 = {
  // E-137: the v1.1 same-pattern athletic.3 days (size-focused and high-level athletes)
  'day.athletic.3.same_pattern.S1': ['S1 - jump + squat + single-leg squat + pulls', 'S1 - salto + sentadilla + sentadilla a una pierna + jalones'],
  'day.athletic.3.same_pattern.S2': ['S2 - medball + hinge + single-leg hinge + pushes', 'S2 - balón medicinal + bisagra + bisagra a una pierna + empujes'],
  // E-141: the class days named after the coach's class split
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.SQUAT': ['Squat day', 'Día de sentadilla'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.PRESS': ['Press + snatch day', 'Día de press + arranque'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.DEADLIFT': ['Deadlift + push day', 'Día de peso muerto + empuje'],
  'day.hybrid_crossfit.4.crossfit_style_bootcamp.CLEAN/PUSH': ['Clean + pull day', 'Día de cargada + jalón'],
  // E-143: offer C - a block the time check switched off can be switched back on
  'why.pattern_kept_main': [
    'Your days cannot hold {group} at 10+ sets, so the day keeps one exercise of its pattern, paired with the main lift',
    'Tus días no alcanzan para {group} con 10+ series, así que el día mantiene un ejercicio de su patrón, en superserie con el ejercicio principal'
  ],
  'offer.optional_day': ['Make {day} (your optional day) a full training day: the groups your main days cannot hold train there', 'Convierte el {day} (tu día opcional) en un día completo de entrenamiento: ahí se entrenan los grupos que tus días principales no alcanzan'],
  'offer.longer_sessions_some': ['About {min} min a session also trains {group} directly (10+ sets, climbing)', 'Con unos {min} min por sesión también entrenas {group} directamente (10+ series, subiendo)'],
  'offer.longer_sessions_peak': ['About {min} min a session gives {group} a higher peak (2+ more sets by the last week)', 'Con unos {min} min por sesión, {group} llegan más alto (2+ series más en la última semana)'],
  'offer.block_off': ['Switch off the {block} block: about {min} minutes freed for your lifts each session', 'Desactiva el bloque de {block}: unos {min} minutos libres para tus ejercicios en cada sesión'],
  'offer.block_on': ['Switch the {block} block back on: about {min} more minutes on its days', 'Vuelve a activar el bloque de {block}: unos {min} minutos más en sus días']
};

/** UI_R2F1 keys that replace an earlier string of the same key */
export const R2F1_FINAL = ['day.hybrid_crossfit.4.crossfit_style_bootcamp.SQUAT', 'day.hybrid_crossfit.4.crossfit_style_bootcamp.PRESS', 'day.hybrid_crossfit.4.crossfit_style_bootcamp.DEADLIFT', 'day.hybrid_crossfit.4.crossfit_style_bootcamp.CLEAN/PUSH'];
