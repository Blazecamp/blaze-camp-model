// tools/compile/patches.mjs - B1 (model compiler): the coach-correction layer of the catalog compile.
// Sources: generator_spec_v1.json > rule_tables.library_decisions (renames, removed, credit, levels, build_out,
// additions_approved, kb_swings), the per-record 02 v1.1 `v1_1_changes` logs, coach_answers_full.md (LIB-*, EQ-*, CAT-*,
// VOL-*) and coach_answers_round2.md (R2-*; newest authority). Every patch names its target records; when a target is
// missing from the source the compile FAILS (BUILD_PLAN §3 B1.3). A patch either VERIFIES that the v1.1 source already
// carries the correction (most do: 02 v1.1 applied round 2) or APPLIES it (logged per record in model/CHANGELOG.md).
// Patches also add the coach id to `rule_refs` of every record they touch (CONTRACTS §3.2: "coach ids that changed this record").
import { BAND_RE, CREDIT_MAP } from './catalog.mjs';

const has = (arr, x) => arr.includes(x);
const addRef = (e, ref) => { if (!e.rule_refs.includes(ref)) { e.rule_refs.push(ref); e.rule_refs.sort(); } };

/**
 * @param {{src: Map<string, object>, ex: Map<string, object>, en: Object<string,string>, dropped: object[], aliases: Object<string,string>, activeSourceIds: Set<string>}} ctx
 * @returns {{patches: object[], changes: object[], errors: string[]}}
 */
export function applyCoachPatches(ctx) {
  const errors = [];
  const changes = [];  // {patch, id, field, from, to}
  const patches = [];
  const { src, ex, en } = ctx;

  const need = (patch, id) => {
    const e = ex.get(id);
    if (!e) errors.push(`${patch}: patch target missing: exercise ${id}`);
    return e || null;
  };
  const needSource = (patch, re) => {
    const hits = [...src.values()].filter(r => re.test(r.id));
    if (!hits.length) errors.push(`${patch}: patch target missing in 02 source: ${re}`);
    return hits;
  };
  const verify = (patch, cond, msg) => { if (!cond) errors.push(`${patch}: ${msg}`); return !!cond; };
  const set = (patch, e, field, value) => {
    const from = e[field];
    if (JSON.stringify(from) === JSON.stringify(value)) return false;
    e[field] = value;
    changes.push({ patch, id: e.id, field, from, to: value });
    return true;
  };
  const rename = (patch, e, name) => {
    const from = en[e.name_key];
    if (from === name) return false;
    en[e.name_key] = name;
    changes.push({ patch, id: e.id, field: 'name(en)', from, to: name });
    return true;
  };
  const all = () => [...ex.values()];
  const record = (p) => { patches.push(p); return p; };

  // ------------------------------------------------------------------ P01 bands, chains, weight releasers (EQ-01/07/08/12)
  {
    const P = 'P01';
    const bandSources = needSource(P, /band|chain|releaser/);
    const renamed = Object.entries(ctx.aliases).filter(([s, r]) => s !== r);
    const bandOnly = ctx.dropped.filter(d => d.reason === 'band_only');
    const outOfScope = [...src.values()].filter(r => r.record_type === 'out_of_scope' && /band|chain|releaser/i.test(r.id + ' ' + r.name));
    let setupsRemoved = 0;
    for (const e of all()) {
      const r = src.get(e.source_id);
      const n = (r.equipment.setups_any_of || []).filter(s => s.some(x => BAND_RE.test(x))).length;
      if (n) { setupsRemoved += n; addRef(e, 'EQ-01'); }
      if (e.id !== e.source_id) addRef(e, 'EQ-01');
      verify(P, !BAND_RE.test(e.id), `band word left in id ${e.id}`);
      verify(P, !BAND_RE.test(en[e.name_key] || ''), `band word left in name of ${e.id}`);
      for (const t of e.equipment.any_of.flat()) verify(P, !['band', 'bands', 'band_anchor', 'chains', 'weight_releaser'].includes(t), `banned kit token ${t} on ${e.id}`);
    }
    need(P, 'kb-face-pull'); // the KB face pull's '-as-written-...-cable-band' id suffix (CONTRACTS §3.2.2)
    record({ id: P, refs: ['EQ-01', 'EQ-07', 'EQ-08', 'EQ-12'], target: 'every band / chain / weight-releaser item, setup, id and name', rule: 'removed everywhere: band-only records dropped, band setups removed, band words stripped from ids and names (source id kept as an alias)', action: 'applied', counts: { source_records_mentioning_bands: bandSources.length, out_of_scope_band_records_dropped: outOfScope.length, band_only_records_dropped: bandOnly.length, band_setups_removed: setupsRemoved, ids_renamed: renamed.length } });
  }

  // ------------------------------------------------------------------ P02 retired / removed items (LIB-09, R2-LIB-06, LIB-17)
  {
    const P = 'P02';
    const camporini = needSource(P, /^camporini-deadlift/);
    const run216 = needSource(P, /21-6-mile/);
    for (const r of [...camporini, ...run216]) verify(P, !ctx.activeSourceIds.has(r.id), `removed item still active: ${r.id}`);
    const retired = [...src.values()].filter(r => r.record_type === 'retired' || r.status === 'retired');
    for (const r of retired) verify(P, !ctx.activeSourceIds.has(r.id), `retired record still active: ${r.id}`);
    // LIB-17: near-duplicates merged (seated DB curls; 'Side Plank' / 'Side Planks')
    need(P, 'seated-dumbbell-curl'); need(P, 'side-plank-elbow');
    const seatedCurls = all().filter(e => /^seated (db|dumbbell) (bicep )?curls?$/i.test(en[e.name_key] || ''));
    const sidePlanks = all().filter(e => /^side planks?( \(elbow\))?$/i.test(en[e.name_key] || ''));
    verify(P, seatedCurls.length === 1, `LIB-17: ${seatedCurls.length} seated DB curl records (expected 1)`);
    verify(P, sidePlanks.length === 1, `LIB-17: ${sidePlanks.length} side plank records (expected 1)`);
    record({ id: P, refs: ['LIB-09', 'R2-LIB-06', 'LIB-17'], target: 'Camporini deadlift, the 21.6-mile run, every retired record, near-duplicate seated DB curls / side planks', rule: 'removed from plans and tests (the longest run stays the half-marathon plan)', action: 'verified', counts: { retired_records_dropped: retired.length, camporini: camporini.length, run_21_6: run216.length } });
  }

  // ------------------------------------------------------------------ P03 renames (library_decisions.renames)
  {
    const P = 'P03';
    const RENAMES = [
      { from: 'LEFT TEST', ref: 'LIB-01', ids: ['l-test-l-drill-3-cone-inferred-from-left-test'], expect: /^L-Test \/ L-Drill \(3-Cone\)$/, name: 'L-Test / L-Drill (3-Cone)' },
      { from: '5/10/05', ref: 'LIB-01', ids: ['5-10-5-pro-agility-shuttle'], expect: /^5-10-5 Pro-Agility Shuttle$/, name: '5-10-5 Pro-Agility Shuttle' },
      { from: 'Snatch', ref: 'LIB-07', ids: ['snatch-squat-snatch'], expect: /^Squat Snatch$/, name: 'Squat Snatch' },
      { from: 'Clean', ref: 'LIB-07', ids: ['clean-squat-clean'], expect: /^Squat Clean$/, name: 'Squat Clean' },
      { from: 'Clean & Jerk', ref: 'LIB-07', ids: ['clean-and-jerk-full'], expect: /^Squat Clean & Jerk$/, name: 'Squat Clean & Jerk' },
      { from: 'Pull under', ref: 'LIB-09', ids: ['cable-lat-pullover'], expect: /^Lat Pull-over \(cable\)$/, name: 'Lat Pull-over (cable)' },
      { from: 'Kong Row', ref: 'LIB-09', ids: ['kong-row-unclear-possibly-kroc-row'], expect: /double-KB row from the floor/, name: 'Kong Row (double-KB row from the floor)' },
      { from: 'Single Leg Get Ups', ref: 'LIB-09', ids: ['single-leg-get-up-single-leg-sit-to-stand-from-bench-box'], expect: /box pistol/, name: 'Single-Leg Get-Up (box pistol)' },
      { from: 'Low DB Squats', ref: 'LIB-09', ids: ['low-hold-db-squat-single-db-hanging-between-the-legs'], expect: /two DBs hanging at the sides/, name: 'Low DB Squat (two DBs hanging at the sides)' },
      { from: 'Alternating DB/Barbell Deadlifts', ref: 'LIB-09', ids: ['alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer', 'alternating-barbell-deadlift-alternate-lead-leg-meaning-inferred'], expect: /^Alternating Staggered-Stance Single-Leg Deadlift/, name: null },
      { from: 'Standing DB Press (second entry)', ref: 'LIB-11', ids: ['standing-barbell-overhead-press-strict'], expect: /^Standing Barbell Overhead Press/, name: 'Standing Barbell Overhead Press (strict)' },
      { from: 'Bench Push ups', ref: 'R2-LIB-05', ids: ['bench-push-up-hands-or-feet-on-bench-not-stated', 'bench-push-up-feet-on-bench'], expect: /^Bench Push-Up - (Hands|Feet) on Bench/, name: null }
    ];
    let verified = 0, applied = 0;
    for (const rn of RENAMES) for (const id of rn.ids) {
      const e = need(P, id); if (!e) continue;
      addRef(e, rn.ref);
      if (rn.expect.test(en[e.name_key] || '')) { verified++; continue; }
      if (rn.name) { rename(P, e, rn.name); applied++; } else errors.push(`${P}: ${id} name '${en[e.name_key]}' does not carry the ${rn.ref} rename and no fallback name is defined`);
    }
    record({ id: P, refs: ['LIB-01', 'LIB-07', 'LIB-09', 'LIB-11', 'LIB-12', 'R2-LIB-05'], target: RENAMES.map(r => r.from).join(' | '), rule: 'his words renamed to the clear names he approved (catalog records only; tab / program renames live in templates.program_names)', action: applied ? 'applied' : 'verified', counts: { verified, applied } });
  }

  // ------------------------------------------------------------------ P04 leg-flexion category (CAT-09)
  {
    const P = 'P04';
    const kflex = all().filter(e => e.pattern === 'KFLEX');
    verify(P, kflex.length > 0, 'patch target missing: no KFLEX (leg flexion) record');
    for (const e of kflex) {
      verify(P, e.credit_class === 'LEG_FLEXION', `${e.id} credit class ${e.credit_class} != LEG_FLEXION`);
      verify(P, has(e.slots, 'ISO_LEG_FLEXION'), `${e.id} not in ISO_LEG_FLEXION`);
      addRef(e, 'CAT-09');
    }
    for (const e of all()) verify(P, !e.slots.includes('ISO_HAM') && !e.slots.includes('RP.HD.ISO'), `${e.id} uses a retired leg-flexion bucket alias`);
    record({ id: P, refs: ['CAT-09'], target: 'leg curls (KFLEX pool)', rule: "'LEG CURLS' = the LEG FLEXION segment: bucket ISO_LEG_FLEXION (ISO_HAM / RP.HD.ISO are retired aliases), credit hamstrings 1.0", action: 'verified', counts: { records: kflex.length } });
  }

  // ------------------------------------------------------------------ P05 face pulls = shoulder work (LIB-10, R2-LIB-04)
  {
    const P = 'P05';
    const fps = all().filter(e => e.tags.includes('face_pull'));
    need(P, 'kb-face-pull'); need(P, 'face-pull');
    for (const e of fps) {
      verify(P, e.credit_class === 'FACEPULL', `${e.id} credit class ${e.credit_class} != FACEPULL`);
      verify(P, has(e.slots, 'ISO_SIDE_REAR_DELT'), `${e.id} not a shoulder (ISO_SIDE_REAR_DELT) option`);
      verify(P, !has(e.slots, 'RP_VPULL') && !has(e.default_in_slots, 'RP_VPULL'), `${e.id} still fills the vertical pull`);
      addRef(e, 'R2-LIB-04');
    }
    record({ id: P, refs: ['LIB-10', 'R2-LIB-04'], target: 'KB / cable face pulls', rule: 'shoulder work (rear delts 1.0 + side delts 0.25), a rear-delt option and a swap, never the main vertical pull', action: 'verified', counts: { records: fps.length } });
  }

  // ------------------------------------------------------------------ P06 KB swings = ballistic, 0 muscle sets (R2-VOL-05)
  {
    const P = 'P06';
    need(P, 'kettlebell-swing-russian');
    const swings = all().filter(e => e.tags.includes('kb_swing'));
    for (const e of swings) {
      verify(P, e.credit_class === 'ATHLETIC' && Object.keys(e.credits).length === 0, `${e.id} credits muscles`);
      verify(P, !e.slots.some(s => s.startsWith('RP_')), `${e.id} fills a resistance slot`);
      verify(P, has(e.slots, 'AP_TRIPLE_EXT'), `${e.id} not in the power (triple-extension) slot`);
    }
    // 02 v1.1 lists swings as 0-credit swaps in BHD / UHD pools: count what the compile excluded (C-04 / D-12)
    const excluded = swings.filter(e => ((src.get(e.source_id).generator || {}).pools || []).some(p => ['BHD', 'UHD'].includes(p))).length;
    record({ id: P, refs: ['R2-VOL-05', 'C-04', 'D-12'], target: 'every kettlebell swing', rule: 'ballistic / athletic power reps, credit {} (never glute volume), only AP_TRIPLE_EXT and WOD slots; the 02 BHD / UHD swap listing is excluded', action: 'applied', counts: { records: swings.length, removed_from_hinge_slots: excluded } });
  }

  // ------------------------------------------------------------------ P07 credit map: helpers 0.25, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25, upright rows
  {
    const P = 'P07';
    for (const [cls, map] of Object.entries(CREDIT_MAP)) {
      const vals = Object.entries(map);
      if (cls === 'DIPS') { verify(P, map.triceps === 0.5 && map.chest === 0.5 && vals.length === 2, 'DIPS != 0.5 triceps + 0.5 chest'); continue; }
      if (cls === 'THRUSTER') { verify(P, map.quads === 1 && map.front_delts === 0.5 && map.glutes === 0.25 && vals.length === 3, 'THRUSTER != 1 / 0.5 / 0.25'); continue; }
      const primes = vals.filter(([, v]) => v === 1).length;
      if (vals.length) verify(P, primes === 1, `${cls} has ${primes} prime movers`);
      for (const [m, v] of vals) if (v !== 1) verify(P, v === 0.25, `${cls}.${m} helper credit ${v} != 0.25`);
    }
    const dips = all().filter(e => e.credit_class === 'DIPS');
    need(P, 'parallel-bar-dip');
    for (const e of dips) { verify(P, e.primary_muscle === null, `${e.id} DIPS primary_muscle must be null (triceps placement, LIB-16)`); addRef(e, 'LIB-16'); }
    const thrusters = all().filter(e => e.tags.includes('thruster') && e.family !== 'ATHLETIC' && e.pattern === 'BKD');
    for (const id of ['barbell-thruster', 'db-thruster-front-squat-into-overhead-press', 'single-arm-db-thruster']) need(P, id);
    for (const e of thrusters) verify(P, e.credit_class === 'THRUSTER', `${e.id} credit class ${e.credit_class} != THRUSTER`);
    const upright = all().filter(e => e.tags.includes('upright_row'));
    for (const id of ['barbell-upright-row', 'db-upright-row']) need(P, id);
    for (const e of upright) { verify(P, e.credit_class === 'ISO_SIDE', `${e.id} upright row credit class ${e.credit_class} != ISO_SIDE`); addRef(e, 'LIB-16'); }
    let mismatches = 0;
    for (const e of all()) if (JSON.stringify(e.credits) !== JSON.stringify(CREDIT_MAP[e.credit_class])) { mismatches++; errors.push(`${P}: ${e.id} credits != class map`); }
    record({ id: P, refs: ['VOL-09', 'UNI-01', 'LIB-14', 'LIB-16', 'R2-VOL-05'], target: 'the credit map and every exercise credit', rule: 'prime mover 1.0, helpers 0.25 (glutes 0.25 on squats / lunges / deadlifts / RDLs); dips 0.5 triceps + 0.5 chest; thruster 1.0 quads + 0.5 front delts + 0.25 glutes; upright rows = side delts; the catalog coarse per_set groups are not copied', action: 'applied', counts: { classes: Object.keys(CREDIT_MAP).length, dips: dips.length, thrusters: thrusters.length, upright_rows: upright.length, credit_mismatches: mismatches } });
  }

  // ------------------------------------------------------------------ P08 approved additions (R2-LIB-07, EQ-05, EQ-11, ATH-10)
  {
    const P = 'P08';
    const ADD = [
      { id: 'belt-squat-machine', ref: ['R2-LIB-07', 'EQ-11'], slot: 'RP_BKD' },
      { id: 'seated-machine-shoulder-press', ref: ['R2-LIB-07', 'EQ-05'], slot: 'RP_VPUSH' },
      { id: 'hang-clean-of-1rm-catch-not-stated', ref: ['R2-LIB-07', 'ATH-10'], slot: 'AP_TRIPLE_EXT', library: true },
      { id: 'single-arm-db-snatch', ref: ['R2-LIB-07', 'ATH-10'], slot: 'AP_TRIPLE_EXT', library: true },
      { id: 'kb-squat-clean', ref: ['R2-LIB-07', 'ATH-10'], slot: 'AP_TRIPLE_EXT', library: true },
      { id: 'hex-bar-jump-squat', ref: ['R2-LIB-07', 'ATH-10'], slot: 'AP_TRIPLE_EXT', library: true },
      { id: 'kb-curl', ref: ['R2-LIB-07'], slot: 'ISO_BICEP' },
      { id: 'table-row-inverted-row-under-a-sturdy-table', ref: ['R2-LIB-07'], slot: 'RP_HPULL' },
      { id: 'floor-prone-y-t-raises', ref: ['R2-LIB-07'], slot: 'ISO_SIDE_REAR_DELT' }
    ];
    let statusApplied = 0;
    for (const a of ADD) {
      const e = need(P, a.id); if (!e) continue;
      verify(P, e.level === 'foundational', `${a.id} level ${e.level} != foundational`);
      verify(P, has(e.default_in_slots, a.slot), `${a.id} is not a default pick in ${a.slot}`);
      for (const r of a.ref) addRef(e, r);
      // R2-LIB-07 added these to the master library: 'program_only' (lives only in his programs) no longer describes them
      if (a.library && e.status === 'program_only') { set(P, e, 'status', 'added_v1_1'); statusApplied++; }
    }
    record({ id: P, refs: ['R2-LIB-07', 'EQ-05', 'EQ-11', 'ATH-10'], target: ADD.map(a => a.id).join(', '), rule: 'added to the master library at FOUNDATIONAL (belt squat, seated machine shoulder press, hang clean, single-arm DB snatch, KB squat clean, hex-bar jump; home: KB curl, table row, floor Y / T raises)', action: statusApplied ? 'applied' : 'verified', counts: { records: ADD.length, status_program_only_to_added_v1_1: statusApplied } });
  }

  // ------------------------------------------------------------------ P09 levels (LIB-12 / R2-LIB-05, LIB-13, LIB-15)
  {
    const P = 'P09';
    const LV = [
      ['bench-push-up-hands-or-feet-on-bench-not-stated', ['foundational'], 'R2-LIB-05'], ['bench-push-up-feet-on-bench', ['advanced'], 'R2-LIB-05'],
      ['barbell-push-press', ['foundational'], 'LIB-13'], ['db-push-press', ['foundational'], 'LIB-13'],
      ['barbell-push-jerk', ['intermediate', 'advanced'], 'LIB-13'], ['db-push-jerk', ['intermediate', 'advanced'], 'LIB-13'],
      ['leg-extension-machine', ['foundational'], 'LIB-15'], ['lying-leg-curl-machine', ['foundational'], 'LIB-15'],
      ['seated-leg-curl-machine', ['foundational'], 'LIB-15'], ['machine-leg-curl-seated-or-lying', ['foundational'], 'LIB-15']
    ];
    for (const [id, ok, ref] of LV) { const e = need(P, id); if (!e) continue; verify(P, ok.includes(e.level), `${id} level ${e.level} not in ${ok.join('/')}`); addRef(e, ref); }
    record({ id: P, refs: ['LIB-12', 'R2-LIB-05', 'LIB-13', 'LIB-15'], target: LV.map(x => x[0]).join(', '), rule: 'bench push-up hands on bench = foundational, feet on bench = advanced; push press foundational, push jerk intermediate-advanced; leg extensions / curls at every level', action: 'verified', counts: { records: LV.length } });
  }

  // ------------------------------------------------------------------ P10 two spine days: the counted list (R2-SES-01, R2-SES-02)
  {
    const P = 'P10';
    const counted = all().filter(e => e.axial);
    verify(P, counted.length > 0, 'patch target missing: no counted spine-loading lift');
    for (const e of counted) { verify(P, e.axial_pattern === 'squat' || e.axial_pattern === 'hinge', `${e.id} counted but not a squat / hinge`); verify(P, e.spine_class === 'counted', `${e.id} spine_class ${e.spine_class}`); addRef(e, 'R2-SES-02'); }
    record({ id: P, refs: ['R2-SES-01', 'R2-SES-02', 'PER-04', 'EQ-11'], target: '02 v1.1 axial_spinal_load.spine_day_v1_1', rule: 'at most one counted heavy squat and one counted heavy hinge a week, never the same day; goblet / hack / pendulum are second-day options; leg press, belt squat, hip thrust not counted', action: 'verified', counts: { counted: counted.length, counted_squat: counted.filter(e => e.axial_pattern === 'squat').length, counted_hinge: counted.filter(e => e.axial_pattern === 'hinge').length, second_day: all().filter(e => e.spine_class === 'second_day').length } });
  }

  // ------------------------------------------------------------------ P11 older adults (EQ-03, R2-ATH-08, D-05)
  {
    const P = 'P11';
    let never = 0, defaultOff = 0;
    for (const e of all()) {
      if (e.tags.some(t => ['overhead_squat', 'low_bar', 'depth_jump', 'high_depth_drop', 'snatch'].includes(t))) { never++; verify(P, !e.older_ok && !e.older_opt_in_ok, `${e.id} older never-list leak`); }
      if (e.athletic && ['plyometric', 'olympic'].includes(e.athletic.quality)) { verify(P, !e.older_ok, `${e.id} plyo / Olympic allowed for 60+ by default`); }
      if (!e.older_ok) defaultOff++;
    }
    record({ id: P, refs: ['EQ-03', 'R2-ATH-08', 'D-05'], target: 'every Olympic, plyometric, depth-jump, snatch, overhead-squat and low-bar record', rule: '60+: no Olympic / plyo / depth jumps by default (opt-in with the warning); overhead and low-bar squats never; depth jumps, high drops and snatches stay locked for 60+ in Phase 0', action: 'verified', counts: { never_for_60plus: never, off_by_default_for_60plus: defaultOff } });
  }

  // ------------------------------------------------------------------ P12 proposed additions are swaps only (R2-LIB-07, CAT-07)
  {
    const P = 'P12';
    const proposed = all().filter(e => ['proposed_v1', 'proposed_v1_1'].includes(e.status));
    for (const e of proposed) verify(P, e.default_in_slots.length === 0, `${e.id} PROPOSED record is a default pick`);
    record({ id: P, refs: ['CAT-07', 'R2-LIB-07'], target: 'proposed_v1 / proposed_v1_1 records (22 sport additions + 9 v1 starters)', rule: 'library exercises are always the main pick; PROPOSED records are swaps only until he approves them', action: 'verified', counts: { records: proposed.length } });
  }

  // ------------------------------------------------------------------ P13 medball never above 20 lb (EQ-06)
  {
    const P = 'P13';
    let clamped = 0, medball = 0;
    for (const e of all()) {
      if (!e.medball) continue;
      medball++;
      verify(P, e.medball.max_lb <= 20, `${e.id} medball ${e.medball.max_lb} lb > 20`);
      const r = src.get(e.source_id);
      const raw = String((r.implement_load && (r.implement_load.typical_lb || r.implement_load.max_lb)) || '');
      if ((raw.match(/\d+/g) || []).map(Number).some(n => n > 20)) { clamped++; addRef(e, 'EQ-06'); }
    }
    record({ id: P, refs: ['EQ-06', 'ATH-05'], target: 'every record with an implement load', rule: 'no medball load above 20 lb anywhere (aesthetics: warm-up only, enforced at selection)', action: clamped ? 'applied' : 'verified', counts: { medball_records: medball, clamped_to_20: clamped } });
  }

  // ------------------------------------------------------------------ P14 no V-squat (GEN-08)
  {
    const P = 'P14';
    for (const e of all()) verify(P, !/v[- ]?squat/i.test(e.id) && !/\bv[- ]?squat\b/i.test(en[e.name_key] || '') && !e.tags.includes('v_squat'), `V-squat present: ${e.id}`);
    record({ id: P, refs: ['GEN-08'], target: 'every record', rule: 'never a V-squat', action: 'verified', counts: {} });
  }

  // ------------------------------------------------------------------ P15 generic, understandable names (FIX-03, FIX-04)
  {
    const P = 'P15';
    const cleaned = ctx.nameCleanups || [];
    for (const c of cleaned) { const e = ex.get(c.id); if (e) changes.push({ patch: P, id: c.id, field: 'name(en)', from: c.from, to: c.to }); }
    record({ id: P, refs: ['FIX-03', 'FIX-04'], target: 'EN exercise names', rule: "decoder notes ('not stated', 'inferred', 'typo ambiguous', 'second ... listing') removed from user-facing names; his sheets untouched", action: cleaned.length ? 'applied' : 'verified', counts: { names_cleaned_beyond_fixture_reading: cleaned.length } });
  }

  return { patches, changes, errors };
}
