// tools/compile/crosscheck.mjs - B1 (model compiler): cross-checks of the normative rules.json against the read-only
// sources (generator_spec_v1.json, 12_volume_algorithm_v1.json, 03_volume_rules.json, 06_periodization.json,
// 10_equipment_model.json, 04_profiles.json). The rules object is the architect's normative reading (deep-equals the
// fixture); this module proves it still agrees with the sources it came from. A mismatch is reported in
// model/COMPILE_REPORT.json (`crosschecks`), never silently "fixed": round 2 (coach_answers_round2.md) outranks the docs,
// so a known, round-2-justified difference is listed with `status: "superseded"` and the round-2 id.

const sameJSON = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const num = (x) => (typeof x === 'number' ? x : Number(String(x).replace(/[^0-9.]/g, '')));

/**
 * @param {object} rules   compiled rules.json
 * @param {object} S       sources from loadSources()
 * @returns {{id:string, source:string, what:string, status:'ok'|'mismatch'|'superseded'|'source_missing', detail?:string, ref?:string}[]}
 */
export function crossCheckRules(rules, S) {
  const out = [];
  const add = (id, source, what, status, detail, ref) => out.push(Object.assign({ id, source, what, status }, detail ? { detail } : {}, ref ? { ref } : {}));
  const dig = (obj, p) => p.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);

  // X01 / X02 / X03: starting table (12 v1.1 starting_table.muscles) vs rules.volume.start / cap / priority caps
  const mus = dig(S.alg12, 'starting_table.muscles');
  if (!mus) add('X01', '12_volume_algorithm_v1.json', 'starts / caps', 'source_missing', 'starting_table.muscles not found');
  else {
    const startDiff = [], capDiff = [], prioDiff = [];
    for (const [m, start] of Object.entries(rules.volume.start)) {
      const s = mus[m] && mus[m].start;
      if (!s || typeof s.L1 !== 'number') { startDiff.push(`${m}: no numeric start in 12`); continue; }
      if (!sameJSON({ L1: s.L1, L2: s.L2, L3: s.L3 }, start)) startDiff.push(`${m}: rules ${JSON.stringify(start)} vs 12 ${JSON.stringify(s)}`);
    }
    for (const [m, cap] of Object.entries(rules.volume.cap)) {
      const c = mus[m] && mus[m].cap;
      if (!c) { capDiff.push(`${m}: no cap in 12`); continue; }
      if (!sameJSON({ L1: c.L1, L2: c.L2, L3: c.L3 }, cap)) capDiff.push(`${m}: rules ${JSON.stringify(cap)} vs 12 ${JSON.stringify(c)}`);
    }
    for (const m of Object.keys(rules.volume.start)) {
      const pc = mus[m] && mus[m].priority && mus[m].priority.cap;
      if (!pc) continue;
      const want = rules.volume.priority.cap[m] || rules.volume.priority.cap.default;
      for (const L of ['L1', 'L2', 'L3']) {
        const src = pc[L];
        const ok = typeof src === 'number' ? src === want[L] : (/^(\d+)-(\d+)$/.test(String(src)) && want[L] >= num(String(src).split('-')[0]) && want[L] <= num(String(src).split('-')[1]));
        if (!ok) prioDiff.push(`${m}.${L}: rules ${want[L]} vs 12 ${src}`);
      }
    }
    add('X01', '12_volume_algorithm_v1.json', 'volume.start (big 10/15/20, small 10/12/15, rear 4/6/8)', startDiff.length ? 'mismatch' : 'ok', startDiff.join('; ') || undefined);
    add('X02', '12_volume_algorithm_v1.json', 'volume.cap (14/22/25 incl. calves; rear 8/12/16; abs 16/20/20)', capDiff.length ? 'mismatch' : 'ok', capDiff.join('; ') || undefined);
    add('X03', '12_volume_algorithm_v1.json', 'volume.priority.cap (18/26/30; chest L2 26-28 -> 28, D-39; rear 12/16/20)', prioDiff.length ? 'mismatch' : 'ok', prioDiff.join('; ') || undefined);
  }

  // X04: stairway tables (12 v1.1 stairway.steps_by_plan_length) vs rules.stairway.by_N
  const steps = dig(S.alg12, 'stairway.steps_by_plan_length');
  if (!steps) add('X04', '12_volume_algorithm_v1.json', 'stairway by_N', 'source_missing', 'stairway.steps_by_plan_length not found');
  else {
    const diffs = [];
    const effortMap = (t) => { const s = String(t); if (/^1 RIR \+ intensifiers/.test(s)) return '1+'; return s.replace(/\s*RIR$/, ''); };
    for (const [N, src] of Object.entries(steps)) {
      const r = rules.stairway.by_N[N];
      if (!r) { diffs.push(`N=${N} missing in rules`); continue; }
      if (r.halfway !== src.halfway) diffs.push(`N=${N} halfway ${r.halfway} vs ${src.halfway}`);
      if (!sameJSON(r.standard_steps, src.standard_steps)) diffs.push(`N=${N} standard_steps differ`);
      if (Math.abs(r.growth - src.growth) > 1e-4) diffs.push(`N=${N} growth ${r.growth} vs ${src.growth}`);
      for (const [w, lv] of Object.entries(src.display_level || {})) if (Math.abs(r.display_level[w] - lv) > 1e-9) diffs.push(`N=${N} display_level w${w} ${r.display_level[w]} vs ${lv}`);
      for (const [w, ef] of Object.entries(src.planned_effort || {})) if (r.planned_effort[w] !== effortMap(ef)) diffs.push(`N=${N} planned_effort w${w} ${r.planned_effort[w]} vs ${ef}`);
    }
    add('X04', '12_volume_algorithm_v1.json', `stairway.by_N for N = ${Object.keys(steps).join(', ')} (halfway, 3 % / 5 % steps, growth, 2 -> 11 display level, planned RIR)`, diffs.length ? 'mismatch' : 'ok', diffs.join('; ') || undefined);
  }

  // X05: stairway limits. v0.5: the source's rate limits (step <= 7 %, total strictly < 10 %) are SUPERSEDED by COACH-CX CX-01
  // ('increase faster if that's the need') and COACH-R4 R4-PRG-02 (no hard limit; a note above about 15 %): the compiled rules
  // carry rules.stairway.progression instead, and no limit of the source may come back as a rule
  {
    const L = rules.stairway.limits || {}, PG = rules.stairway.progression, d = [];
    if (!PG || PG.target_reached !== true) d.push('stairway.progression.target_reached missing');
    for (const k of ['planned_step_max', 'total_weekly_ceiling', 'placed']) if (L[k] !== undefined) d.push(`stairway.limits.${k} is back`);
    add('X05', 'coach_answers_codex_2026-10-10.md / coach_answers_round4.md', 'stairway progression (CX-01, R4-PRG-01 / 02) supersedes the 7 % / 10 % limits of 12_volume_algorithm_v1.json', d.length ? 'mismatch' : 'ok', d.join('; ') || undefined);
  }

  // X06: plan types 12 / 8 (spec plan_types) vs rules phases_by_N, exercise blocks, Receive-Create weeks, planned RIR
  for (const [N, key] of [['12', 'fixed_12'], ['8', 'fixed_8']]) {
    const pt = dig(S.spec, `plan_types.${key}`);
    if (!pt) { add(`X06.${N}`, 'generator_spec_v1.json', `plan_types.${key}`, 'source_missing'); continue; }
    const d = [];
    for (const L of ['L1', 'L2', 'L3']) {
      const sp = pt.phases_by_level && pt.phases_by_level[L];
      const rp = rules.stairway.phases_by_N[N][L];
      if (!sp || !sameJSON([sp.acclimation, sp.drive, sp.hardest], [rp.ACCLIMATION, rp.DRIVE, rp.HARDEST])) d.push(`phases ${L}: rules ${JSON.stringify(rp)} vs spec ${JSON.stringify(sp)}`);
    }
    if (!sameJSON(pt.exercise_blocks, rules.stairway.exercise_blocks_by_N[N])) d.push(`exercise blocks rules ${JSON.stringify(rules.stairway.exercise_blocks_by_N[N])} vs spec ${JSON.stringify(pt.exercise_blocks)}`);
    if (!sameJSON(pt.receive_create_weeks, rules.athletic.stages.weeks_by_N[N])) d.push('Receive-Create weeks differ');
    const rir = (pt.planned_rir || []).map(s => (/^1 \+ intensifiers/.test(s) ? '1+' : s));
    if (!sameJSON(rir, Object.values(rules.stairway.by_N[N].planned_effort))) d.push(`planned RIR rules ${JSON.stringify(Object.values(rules.stairway.by_N[N].planned_effort))} vs spec ${JSON.stringify(pt.planned_rir)}`);
    const lv = pt.stair_level || [];
    if (lv.some((x, i) => Math.abs(x - rules.stairway.by_N[N].display_level[i + 1]) > 1e-9)) d.push('stair level display differs');
    add(`X06.${N}`, 'generator_spec_v1.json', `plan_types.${key} (phases by level, exercise blocks, RC weeks, planned RIR, stair level)`, d.length ? 'mismatch' : 'ok', d.join('; ') || undefined);
  }

  // X07: credit map (12 v1.1 counting.credit_map) vs rules.credit.classes
  const cm = dig(S.alg12, 'counting.credit_map');
  if (!cm) add('X07', '12_volume_algorithm_v1.json', 'credit map', 'source_missing');
  else {
    const d = [];
    for (const [cls, src] of Object.entries(cm)) {
      if (!rules.credit.classes[cls]) continue; // ISOLATION / ATHLETIC (...) are prose rows
      const want = Object.fromEntries(Object.entries(src).filter(([, v]) => typeof v === 'number'));
      if (!sameJSON(Object.keys(want).sort().map(k => [k, want[k]]), Object.keys(rules.credit.classes[cls]).sort().map(k => [k, rules.credit.classes[cls][k]]))) d.push(`${cls}: rules ${JSON.stringify(rules.credit.classes[cls])} vs 12 ${JSON.stringify(want)}`);
    }
    add('X07', '12_volume_algorithm_v1.json', 'credit.classes (helpers 0.25, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25, face pull 1 + 0.25)', d.length ? 'mismatch' : 'ok', d.join('; ') || undefined);
  }

  // X08: 03 bucket credit map (v1 era) vs round 2: hinge glute credit 0.5 retired by R2-VOL-05 ('a quarter')
  const b03 = dig(S.vol03, 'counting.bucket_credit_map_coach_v1');
  if (!b03) add('X08', '03_volume_rules.json', 'bucket credit map', 'source_missing');
  else {
    const d = [];
    for (const [b, cls] of [['RP_BKD', 'BKD'], ['RP_UKD', 'UKD'], ['RP_BHD', 'BHD'], ['RP_UHD', 'UHD'], ['RP_HPUSH', 'HPUSH'], ['RP_VPUSH', 'VPUSH'], ['RP_HPULL', 'HPULL'], ['RP_VPULL', 'VPULL']]) {
      const src = Object.fromEntries(Object.entries(b03[b] || {}).filter(([, v]) => typeof v === 'number'));
      for (const [m, v] of Object.entries(src)) if (rules.credit.classes[cls][m] !== v) d.push(`${b}.${m}: 03 ${v} vs rules ${rules.credit.classes[cls][m]}`);
    }
    add('X08', '03_volume_rules.json', 'counting.bucket_credit_map_coach_v1 (v1 PROPOSED values)', d.length ? 'superseded' : 'ok', d.join('; ') || undefined, d.length ? 'R2-VOL-05 (glutes 0.25 on hinges: "a quarter"); 12 v1.1 counting.credit_map is authoritative' : undefined);
  }

  // X09: equipment access profiles (10_equipment_model.access_profiles) vs rules.equipment.profiles
  const ap = S.eqm && S.eqm.access_profiles;
  if (!ap) add('X09', '10_equipment_model.json', 'access profiles', 'source_missing');
  else {
    const d = [];
    for (const [id, p] of Object.entries(rules.equipment.profiles)) if (!ap[id] || !sameJSON(ap[id].kit.slice().sort(), p.kit)) d.push(id);
    const kitTokens = new Set(Object.keys(S.eqm.kit_tokens || {}));
    const unknown = [...new Set(Object.values(rules.equipment.profiles).flatMap(p => p.kit))].filter(t => kitTokens.size && !kitTokens.has(t));
    if (unknown.length) d.push(`kit tokens not in 10.kit_tokens: ${unknown.join(', ')}`);
    for (const t of rules.equipment.banned_tokens) if (Object.values(rules.equipment.profiles).some(p => p.kit.includes(t))) d.push(`banned token ${t} in a profile`);
    add('X09', '10_equipment_model.json', 'equipment.profiles kit lists (10 ids) and banned tokens', d.length ? 'mismatch' : 'ok', d.join('; ') || undefined);
  }

  // X10: ground-contact classes (04 / R2-ATH-01: 75 / 60 / 50 / 40 / 25 %)
  const want = { 1: 0.75, 2: 0.6, 3: 0.5, 4: 0.4, 5: 0.25 };
  const gcc = rules.athletic.ground_contact_classes;
  const d10 = Object.entries(want).filter(([k, v]) => !gcc[k] || gcc[k].end !== v).map(([k]) => `class ${k}`);
  const roundTwo = /R2-ATH-01/.test(S.round2);
  add('X10', 'coach_answers_round2.md', 'athletic.ground_contact_classes end shares (R2-ATH-01)', d10.length || !roundTwo ? 'mismatch' : 'ok', d10.join('; ') || (roundTwo ? undefined : 'R2-ATH-01 not found in round 2'));

  // X11: the next block. v0.5: the source's rule (start x 1.05, ceiling + 1 up to 25 / 30) is SUPERSEDED by COACH-R4 R4-PRG-04:
  // the start goes up about 5 % in whole sets and never above the level's top - the ceiling no longer grows with finished blocks
  {
    const c = rules.cycles, nb = c.next_block || {};
    const ok = c.start_multiplier === 1.05 && nb.multiplier && nb.multiplier.numerator === 105 && nb.multiplier.denominator === 100 && nb.never_above_top === true && c.cap_add === undefined;
    add('X11', 'coach_answers_round4.md', 'next block (R4-PRG-04): start about 5 % up in whole sets, never above the level top (supersedes 12_volume_algorithm_v1.json cycles: cap + 1)', ok ? 'ok' : 'mismatch', ok ? undefined : JSON.stringify(c));
  }

  // X12: 06 v1.1 states the 12-week lambda (L1 0.76, L2 0.87, L3 0.50) and no deload inside a block
  const ch06 = JSON.stringify(S.per06 && S.per06.v1_1 && S.per06.v1_1.changes || '');
  const ok12 = /0\.76/.test(ch06) && /0\.87/.test(ch06) && /0\.50/.test(ch06);
  add('X12', '06_periodization.json', 'v1_1.changes: stairway lambda for 12 weeks (0.76 / 0.87 / 0.50) present', ok12 ? 'ok' : 'mismatch', ok12 ? undefined : 'lambda values not found in 06 v1_1.changes');

  // X13: medball ceiling (EQ-06) and the spec library decisions for KB swings (R2-VOL-05)
  const kb = String(dig(S.spec, 'rule_tables.library_decisions.kb_swings') || '');
  const okKb = /0 muscle sets/.test(kb) && rules.credit.never_credit_tags.includes('kb_swing') && rules.medball.max_lb === 20;
  add('X13', 'generator_spec_v1.json', 'library_decisions.kb_swings = 0 muscle sets; medball max 20 lb', okKb ? 'ok' : 'mismatch', okKb ? undefined : kb);

  return out;
}
