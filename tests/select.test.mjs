// tests/select.test.mjs - owner B3. engine/select.mjs: the hard rules selection owns (H01, H07, H09 swings, H11, H12, youth,
// Olympic tier / station pattern), swaps (2-4, never the pick, same filters), determinism of seeded picks, laterality share,
// contra / ipsi loading, exercise-block changes (<= 34 %, work and core kept, one-detail variations), fallbacks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureModel, stubDerived, stubShape, stubSeed, loadIntake, sampleContexts, buildSelections } from './helpers/stub-derived.mjs';
import { buildWeekLayout, daySlots } from '../engine/week.mjs';
import { selectBlock, fillSlot, candidates, passesHardFilters, aerobicPick, variationValues } from '../engine/select.mjs';
import { olympicVariantByDay } from '../engine/athletic.mjs';

const model = fixtureModel();
const R = model.rules;
const BAND_RE = /\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i;
const contexts = await sampleContexts(model);
const built = [];
for (const c of contexts) built.push({ c, ...(await buildSelections(c, model)) });
const stub = (name) => built.find((b) => b.c.name === name && b.c.source === 'stub');
const ex = (id) => model.ex(id);
const fillsOf = (sel) => Object.values(sel.fills);
const slotIndex = (layout) => new Map(layout.days.flatMap((d) => daySlots(d).map((s) => [s.slot_id, { s, d }])));

/** every (layout, selection) pair with the slot map */
function* pairs(b) {
  for (const sel of b.selections) {
    const eb = b.c.shape.exercise_blocks.find((e) => e.n === sel.exercise_block);
    const layout = b.layouts[eb.training_block - 1];
    yield { sel, layout, idx: slotIndex(layout) };
  }
}

async function buildFor(name, patch) {
  const d = stubDerived(name, model, patch);
  const sh = stubShape(name, model, d);
  const c = { name, source: 'stub', derived: d, shape: sh, seed: stubSeed(loadIntake(name), model) };
  return { c, ...(await buildSelections(c, model)) };
}

test('H01: no pick, swap or WOD station is a band / chain / weight-releaser exercise; kit never holds a banned token', () => {
  for (const b of built) {
    for (const t of b.c.derived.D8_kit.tokens) assert.ok(!R.equipment.banned_tokens.includes(t), t);
    for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) {
      for (const id of [f.exercise_id, ...(f.swaps || []), ...(f.stations || [])].filter(Boolean)) {
        assert.ok(!BAND_RE.test(id), id);
        assert.ok(!BAND_RE.test(model.t('en', ex(id).name_key)), id);
        assert.ok(ex(id).equipment.any_of.flat().every((t) => !R.equipment.banned_tokens.includes(t)), id);
      }
    }
  }
});

test('H07: per week at most one counted squat and one counted hinge, on the axial stations, never the same day', () => {
  for (const b of built) for (const { sel, idx } of pairs(b)) {
    const counted = fillsOf(sel).filter((f) => f.exercise_id && ex(f.exercise_id).axial);
    const sq = counted.filter((f) => ex(f.exercise_id).axial_pattern === 'squat');
    const hi = counted.filter((f) => ex(f.exercise_id).axial_pattern === 'hinge');
    assert.ok(sq.length <= 1 && hi.length <= 1, `${b.c.name}/${b.c.source} EB${sel.exercise_block}: ${counted.map((f) => f.exercise_id)}`);
    for (const f of counted) {
      assert.equal(idx.get(f.slot_id).s.axial_req, 'axial', f.slot_id);
      assert.ok(f.flags.includes('axial_counted'));
    }
    if (sq.length && hi.length) assert.notEqual(sq[0].slot_id.split('.')[0], hi[0].slot_id.split('.')[0], b.c.name);
    for (const f of fillsOf(sel)) { // second spine day: non-counted only (R2-SES-02)
      const s = idx.get(f.slot_id).s;
      if (f.exercise_id && s.axial_req && s.axial_req !== 'axial') assert.ok(R.axial.second_day_classes.includes(ex(f.exercise_id).spine_class), f.slot_id);
    }
  }
  // the athletes' heavy days: football squat Monday, deadlift Friday (§9)
  const fb = stub('02-football');
  const sel = fb.selections[0];
  // (v0.5, R4-SES-05: the day opens with its upper lift - station s08 - and the lower work lift is the second lift, s09)
  assert.ok(ex(sel.fills['Mon.A1.s09'].exercise_id).axial);
  assert.ok(ex(sel.fills['Fri.B2.s09'].exercise_id).axial);
});

test('H09 / R2-VOL-05: KB swings and wall balls never fill a resistance, isolation or focus slot (power / WOD only)', () => {
  for (const b of built) for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) {
    const kind = model.bucket(f.bucket).kind;
    for (const id of [f.exercise_id, ...(f.swaps || [])].filter(Boolean)) {
      const t = ex(id).tags;
      if (t.includes('kb_swing') || t.includes('wall_ball')) assert.ok(!['resistance', 'isolation', 'focus'].includes(kind), `${f.slot_id} ${id}`);
    }
    if (f.exercise_id && ['resistance', 'isolation', 'focus'].includes(kind)) assert.ok(!ex(f.exercise_id).is_athletic, f.slot_id);
  }
});

test('Olympic lifts by level and day pattern: L1 tier for L1 and L2 block 1; clean station -> clean / loaded jump; snatch -> snatch / swing', () => {
  for (const b of built) for (const { sel, idx } of pairs(b)) {
    const lvl = b.c.derived.D3_client_level.level;
    for (const f of fillsOf(sel)) {
      if (f.bucket !== 'AP_TRIPLE_EXT' || !f.exercise_id) continue;
      const a = ex(f.exercise_id).athletic;
      // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): an L2 lifter's first block may hold the two hang power
      // lifts (ATH-10 'power and hang variants with the barbell'; sample 04 major) - rules.olympic.x2.l2_block1.ids, nothing else above the tier
      const hangOk = lvl === 'L2' && sel.exercise_block === 1 && ((R.olympic.x2 || {}).l2_block1 || { ids: [] }).ids.includes(f.exercise_id);
      if ((lvl === 'L1' || (lvl === 'L2' && sel.exercise_block === 1)) && !hangOk) assert.notEqual(a.olympic_tier, 'L2_plus', `${b.c.name} ${f.slot_id} ${f.exercise_id}`);
      // v0.4 fix round 2 / F2 (R2-ATH-04; same test name): a clean / snatch station takes the family of the day's lower-body work lift
      // (clean on a knee-dominant day, snatch on a hip-dominant day - athletic.olympicVariantByDay); the item says which
      const { s: st0, d: day0 } = idx.get(f.slot_id);
      const wl = daySlots(day0).find((x) => x.role === 'work' && ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'].includes(x.bucket));
      const v = olympicVariantByDay(st0.variant, wl ? wl.bucket : null, R);
      if (v === 'clean') assert.ok(f.flags.includes('clean_day') && !f.flags.includes('snatch_day'), `${f.slot_id} flags ${f.flags}`);
      if (v === 'snatch') assert.ok(f.flags.includes('snatch_day') && !f.flags.includes('clean_day'), `${f.slot_id} flags ${f.flags}`);
      // (engine 0.6 selection, converted - DECISIONS G-133: an 'olympic safe' client's clean-day station holds a KB swing or the DB / KB
      // high pull where no clean or loaded jump is safe for him - the item says so, flag olympic_safe; EQ-03 / ATH-10)
      if (v === 'clean' && f.flags.includes('olympic_safe')) assert.ok(['swing', 'snatch'].includes(a.olympic_family) && (a.olympic_family !== 'snatch' || /high-pull/.test(f.exercise_id)), `${f.slot_id} ${f.exercise_id}`);
      else if (v === 'clean') assert.ok(['clean', 'loaded_jump'].includes(a.olympic_family), `${f.slot_id} ${f.exercise_id}`);
      if (v === 'snatch') assert.ok(['snatch', 'swing'].includes(a.olympic_family), `${f.slot_id} ${f.exercise_id}`);
      if (v === 'swing') assert.equal(a.olympic_family, 'swing');
    }
  }
  // swimmer: the profile's preferred lifts (single-arm DB snatch, hang power clean) and no floor lifts (no bumpers, youth)
  const sw = stub('01-swimming').selections[0].fills;
  assert.equal(sw['Wed.S2.s07'].exercise_id, 'single-arm-db-snatch');
  assert.equal(sw['Mon.S1.s08'].exercise_id, 'hang-power-clean-from-the-high-hang-hip-crease');
  // L3 football may use full lifts from block 1 (bumpers available)
  const fb = stub('02-football').selections[0];
  assert.ok(fillsOf(fb).some((f) => f.bucket === 'AP_TRIPLE_EXT' && f.exercise_id && ex(f.exercise_id).athletic.olympic_tier === 'L2_plus'));
});

test('youth (16): exercise level <= intermediate, no Olympic lift from the floor before one completed block (D-41)', () => {
  const b = stub('01-swimming');
  for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) for (const id of [f.exercise_id, ...(f.swaps || [])].filter(Boolean)) {
    // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the flat and incline dumbbell bench presses - filed 'advanced' in the
    // library - are a 16-year-old swimmer's presses, sample 01 major; rules.selection.x2.youth_level_exempt_re)
    const youthOk = new RegExp(R.selection.x2.youth_level_exempt_re).test(id);
    assert.ok(youthOk || R.levels.ladder_order.indexOf(ex(id).level) <= R.levels.ladder_order.indexOf(R.levels.youth_max_ladder), id);
    assert.ok(!ex(id).tags.includes('olympic_from_floor'), id);
  }
});

test('H11: aesthetics clients get no medball outside the warm-up (picks and swaps); medball warm-up is allowed', () => {
  for (const name of ['06-full-body-aesthetics', '07-push-pull-legs']) {
    const b = stub(name);
    let warm = 0;
    for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) for (const id of [f.exercise_id, ...(f.swaps || [])].filter(Boolean)) {
      if (model.bucket(f.bucket).kind === 'warmup') { if (ex(id).tags.includes('medball')) warm++; continue; }
      assert.ok(!ex(id).tags.includes('medball') && !ex(id).tags.includes('aesthetics_warmup_only'), `${name} ${f.slot_id} ${id}`);
    }
    if (name === '06-full-body-aesthetics') assert.ok(warm > 0, 'dynamic medball warm-up (ATH-05)');
  }
  for (const b of built) for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) if (f.exercise_id && ex(f.exercise_id).medball) {
    assert.ok(ex(f.exercise_id).medball.min_lb <= R.medball.max_lb);
    const owned = b.c.derived.D8_kit.medball_max_lb;
    if (owned != null) assert.ok(ex(f.exercise_id).medball.min_lb <= owned, `${b.c.name} ${f.exercise_id}`);
  }
});

test('H12: 60+ without opt-in - no Olympic, plyometric, loaded jump or depth jump (picks and swaps); plyo slots landing only', async () => {
  const b = await buildFor('02-football', { age: 65 });
  const never = [...R.population.older.never_tags, ...R.population.older.never_tags_phase0_even_with_opt_in];
  for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) {
    for (const id of [f.exercise_id, ...(f.swaps || []), ...(f.stations || [])].filter(Boolean)) {
      const e = ex(id);
      assert.ok(!never.some((t) => e.tags.includes(t)), `${f.slot_id} ${id}`);
      assert.ok(!e.tags.includes('loaded_jump'), id);
      if (e.athletic) assert.ok(!['plyometric', 'olympic'].includes(e.athletic.quality), `${f.slot_id} ${id}`);
      if (['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(f.bucket)) assert.equal(e.athletic.quality, 'landing', id);
    }
  }
});

test('H12: 60+ with opt-in - Olympic lifts allowed, but never snatch, depth jump, high drop, overhead or low-bar squat (D-05)', async () => {
  const base = stubDerived('02-football', model);
  const b = await buildFor('02-football', { age: 65, prefs: { ...base.prefs, older_athletic_opt_in: true } });
  let olympic = 0;
  for (const { sel } of pairs(b)) for (const f of fillsOf(sel)) {
    for (const id of [f.exercise_id, ...(f.swaps || [])].filter(Boolean)) {
      const e = ex(id);
      for (const t of ['snatch', 'depth_jump', 'high_depth_drop', 'overhead_squat', 'low_bar']) assert.ok(!e.tags.includes(t), `${f.slot_id} ${id} ${t}`);
      assert.ok(e.older_opt_in_ok, id);
    }
    if (f.bucket === 'AP_TRIPLE_EXT' && f.exercise_id) { olympic++; assert.ok(f.flags.includes('older_opt_in')); }
  }
  assert.ok(olympic > 0);
});

test('pain (knee, mild) and 50-59 racket rules: no deep knee flexion, depth jumps, hurdle hops, bounds or high impact on lower slots', () => {
  const b = stub('08-pickleball-genpop');
  const avoid = [...R.volume.pain.areas.knee.avoid_tags, ...R.population.active_aging_50.avoid_tags_unless_opt_in];
  for (const { sel, idx } of pairs(b)) for (const f of fillsOf(sel)) {
    const s = idx.get(f.slot_id).s;
    const lowerish = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'ISO_CALF', 'AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_TRIPLE_EXT'].includes(f.bucket) && s.variant !== 'upper';
    if (!lowerish) continue;
    for (const id of [f.exercise_id, ...(f.swaps || [])].filter(Boolean)) assert.ok(!avoid.some((t) => ex(id).tags.includes(t)), `${f.slot_id} ${id}`);
  }
  // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the pain flag sits only on a lift the pain changed (sample 08 major: 'chosen to
  // protect your knee' printed under lifts that were the pick anyway) and it names the lift it took the place of
  for (const f of fillsOf(b.selections[0]).filter((x) => x.flags.includes('pain_swap'))) assert.ok(f.pain_instead_of && f.pain_instead_of !== f.exercise_id, f.slot_id);
  assert.ok(fillsOf(b.selections[0]).some((f) => f.flags.includes('age_50_racket')));
});

test('swaps: 2-4 alternatives from the same filtered pool, never the pick', () => {
  let checked = 0;
  for (const b of built) for (const { sel, idx } of pairs(b)) for (const f of fillsOf(sel)) {
    if (!f.exercise_id || f.bucket === 'COND_WOD' || model.bucket(f.bucket).kind === 'warmup' || f.bucket === 'COND_AEROBIC') continue;
    assert.ok(f.swaps.length <= R.selection.swaps.max, f.slot_id);
    assert.ok(!f.swaps.includes(f.exercise_id), f.slot_id);
    assert.equal(new Set(f.swaps).size, f.swaps.length);
    const s = idx.get(f.slot_id).s;
    for (const id of f.swaps) {
      // v0.4 B2: a general-population circuit's metabolic station also draws ballistic medball / KB-swing records
      // (rules.athletic.circuit_ballistic, RECHECK 05 major)
      const b2Ballistic = f.bucket === 'COND_CIRCUIT' && R.athletic.circuit_ballistic && (ex(id).medball || ex(id).tags.includes('kb_swing'));
      // the sprint buy-out draws its conditioning finishers (calorie efforts, fast runs) from rules.conditioning.buyout_pool
      // (review 02 major 1; v0.5: a competitive athlete's day keeps its buy-out - nothing is cut for time)
      const BP = R.conditioning.buyout_pool;
      const buyout = f.bucket === 'COND_SPRINT_BUYOUT' && BP && new RegExp(BP.include_ids_re).test(id) && !new RegExp(BP.exclude_ids_re).test(id);
      // a joint-care slot's alternatives are the code's other preferred exercises (rules.prehab.preferred_by_code; v0.5: knee care
      // stays on its leg day instead of moving to the optional day for time)
      const prehabPref = f.flags.includes('prehab_preferred') && Object.values(R.prehab.preferred_by_code || {}).some((l) => l.includes(id));
      // v0.5 fix round 1 (R4-SES-05 slot 3 'vertical push ... or an incline press'; BYOP 'Chest / Shoulders'): the week's first B day
      // takes a 30-45 degree incline press in that slot, so its alternatives are the other incline presses (rules.selection.x1.chest_shoulders)
      const CSx = R.selection.x1 && R.selection.x1.chest_shoulders;
      const chestSlot = !!CSx && f.bucket === CSx.bucket && new RegExp(CSx.incline_re).test(f.exercise_id) && (new RegExp(CSx.incline_re).test(id) || ex(id).slots.includes(CSx.lead_bucket));
      assert.ok(ex(id).slots.includes(f.bucket === 'CORE_OTHER' ? 'CORE_ANY' : f.bucket) || f.flags.includes('pattern_gap') || b2Ballistic || buyout || prehabPref || chestSlot, `${f.slot_id} swap ${id} not in ${f.bucket}`);
      if (!s.axial_req || s.axial_req !== 'axial') assert.ok(!ex(id).axial || !['RP_BKD', 'RP_BHD', 'RP_UKD', 'RP_UHD'].includes(f.bucket) || s.axial_req === 'axial', `${f.slot_id} swap ${id} is a counted lift`);
    }
    // (v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): a slot a pain area touches lists the swaps that pass the pain filter -
    // at least one; a beginner's knee-protected step-up has one other knee-friendly single-leg lift, not a placeholder 'Lunge')
    const painSlot = b.c.derived.pain && b.c.derived.pain.length && ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD'].includes(f.bucket);
    if (model.bySlot(f.bucket).length >= 8 && ['resistance', 'isolation'].includes(model.bucket(f.bucket).kind)) { assert.ok(f.swaps.length >= (painSlot ? 1 : R.selection.swaps.min), f.slot_id); checked++; }
  }
  assert.ok(checked > 50);
});

test('determinism: same seed -> identical selection; another seed can change tie-breaks but not the hard rules', async () => {
  for (const b of built) {
    const again = await buildSelections(b.c, model);
    assert.equal(JSON.stringify(again.selections), JSON.stringify(b.selections), `${b.c.name}/${b.c.source}`);
  }
  const b = stub('06-full-body-aesthetics');
  const other = await buildSelections({ ...b.c, seed: 'c53:00000000000000' }, model);
  assert.notEqual(JSON.stringify(other.selections), JSON.stringify(b.selections));
});

test('second exposure (PER-04): an exercise is not repeated in the same bucket or on the same day when alternatives exist', () => {
  for (const b of built) for (const { sel } of pairs(b)) {
    const byDay = new Map();
    for (const f of fillsOf(sel)) {
      if (!f.exercise_id || model.bucket(f.bucket).kind === 'warmup' || f.bucket === 'COND_AEROBIC') continue;
      const wd = f.slot_id.split('.')[0];
      if (!byDay.has(wd)) byDay.set(wd, []);
      byDay.get(wd).push(f.exercise_id);
    }
    for (const [wd, ids] of byDay) assert.equal(new Set(ids).size, ids.length, `${b.c.name} EB${sel.exercise_block} ${wd}: ${ids}`);
  }
});

test('laterality share (UNI-02): football keeps the counted squat / deadlift bilateral and flips the other dial slots to single-leg', () => {
  const b = stub('02-football');
  const f = b.selections[0].fills;
  // (v0.5, R4-SES-05: the lower work lift is the day's second lift - station s09 - after the upper lift it is paired with)
  assert.equal(f['Mon.A1.s09'].bucket, 'RP_BKD');
  assert.equal(f['Fri.B2.s09'].bucket, 'RP_BHD');
  // v0.5 fix round 1 (R4-SES-05 slot 2 'knee-dominant, bilateral' / 'a deadlift, a hip extension, or ... a hip thrust'; PER-04 'one
  // day of squatting and the other day of leg pressing'; samples 02 / 08 majors): the athletic A / B days keep each slot's
  // laterality - the second A day's slot 2 is a two-leg knee lift that does not load the spine again, the first B day's a two-leg
  // hip lift; the single-leg work is the days' slot 4
  assert.equal(f['Thu.A2.s09'].bucket, 'RP_BKD');
  assert.equal(f['Tue.B1.s09'].bucket, 'RP_BHD');
  for (const id of ['Thu.A2.s09', 'Tue.B1.s09']) { assert.equal(ex(f[id].exercise_id).laterality, 'bilateral'); assert.ok(!ex(f[id].exercise_id).axial, f[id].exercise_id); }
  for (const id of ['Thu.A2.s11', 'Tue.B1.s11']) assert.ok(['unilateral', 'alternating'].includes(ex(f[id].exercise_id).laterality), f[id].exercise_id);
  // pickleball (sample 08 major 'the two-leg slot of his template is gone on both days'): the painful knee moves the two-leg slot to
  // a supported machine lift (VOL-03 / EQ-03), never a deep free knee bend; the hip day keeps a two-leg hip lift
  const p = stub('08-pickleball-genpop').selections[0].fills;
  assert.equal(p['Mon.A.s09'].bucket, 'RP_BKD');
  assert.equal(p['Thu.B.s09'].bucket, 'RP_BHD');
  assert.ok(!ex(p['Mon.A.s09'].exercise_id).tags.includes('deep_knee_flexion') && ex(p['Mon.A.s09'].exercise_id).constraint >= 4, p['Mon.A.s09'].exercise_id);
});

test('contra / ipsi (CAT-13): COD profiles load DB / KB single-leg work mostly contralateral; swimmers cue split stance only', () => {
  const loadable = (id) => ex(id).equipment.any_of.some((su) => su.includes('dumbbell') || su.includes('kettlebell'));
  const loads = [];
  for (const name of ['02-football', '03-soccer', '08-pickleball-genpop']) {
    for (const sel of stub(name).selections) for (const f of fillsOf(sel)) {
      if (!f.exercise_id || !['RP_UKD', 'RP_UHD'].includes(f.bucket) || !['unilateral', 'alternating'].includes(ex(f.exercise_id).laterality)) continue;
      if (loadable(f.exercise_id)) { assert.ok(['contralateral', 'ipsilateral'].includes(f.loading), `${name} ${f.slot_id}`); loads.push(f.loading); }
      else assert.equal(f.loading, null, `${name} ${f.slot_id}: nothing to load`);
    }
  }
  assert.ok(loads.length >= 3);
  assert.ok(loads.filter((l) => l === 'contralateral').length / loads.length >= 0.5);
  for (const f of fillsOf(stub('01-swimming').selections[0])) if (f.loading) assert.equal(f.loading, 'contralateral');
});

test('exercise-block changes (PER-02, R2-LIB-01): work and core kept, <= 34 % of the other resistance slots per day change (at least one), details are concrete values (B3)', () => {
  for (const b of built) {
    for (let i = 1; i < b.selections.length; i++) {
      const prev = b.selections[i - 1], cur = b.selections[i];
      const ebPrev = b.c.shape.exercise_blocks[i - 1], ebCur = b.c.shape.exercise_blocks[i];
      if (ebPrev.training_block !== ebCur.training_block) continue;
      const layout = b.layouts[ebCur.training_block - 1];
      for (const d of layout.days) {
        let others = 0, changed = 0;
        for (const s of daySlots(d)) {
          const f = cur.fills[s.slot_id], p = prev.fills[s.slot_id];
          if (!f || !p || !f.exercise_id || !p.exercise_id) continue;
          const kind = model.bucket(s.bucket).kind;
          if ((s.role === 'work' || kind === 'core') && f.bucket === p.bucket && !f.flags.includes('laterality_flip')) {
            const stillValid = candidates(s, { derived: b.c.derived, shape: b.c.shape, layout, exerciseBlock: ebCur.n, prev, model, seed: b.c.seed }).some((c) => c.exercise_id === p.exercise_id);
            // (engine 0.6 selection, converted - DECISIONS G-131: one core exercise of a main day changes at the block boundary, inside
            // its plane and kind - PER-02; the others are kept)
            if (stillValid && kind === 'core' && f.exercise_id !== p.exercise_id) {
              const pl = (e) => (e.plane === 'frontal' ? 'frontal' : ['transverse', 'multi'].includes(e.plane) ? 'transverse' : 'sagittal');
              assert.equal(pl(ex(f.exercise_id)), pl(ex(p.exercise_id)), `${b.c.name} ${s.slot_id} core changes inside its plane`);
              const coreChanged = daySlots(d).filter((x) => model.bucket(x.bucket).kind === 'core' && cur.fills[x.slot_id] && prev.fills[x.slot_id] && cur.fills[x.slot_id].exercise_id !== prev.fills[x.slot_id].exercise_id).length;
              assert.ok(coreChanged <= 2, `${b.c.name} ${d.weekday}: ${coreChanged} core changes`);
            }
          }
          if (['resistance', 'isolation'].includes(kind) && s.role !== 'work' && s.block !== 'circuit') {
            others++;
            if (f.flags.includes('block_change')) changed++;
          }
          if (f.detail) {
            // v0.4 stage B3 (R2-LIB-01 'show it as "Reverse lunge - dumbbell in opposite hand"'; RECHECK 05 / 06 / 07 majors): the detail
            // is a concrete value of the record's variation vocabulary, never the axis alone ('different grip')
            const vals = variationValues(model, ex(f.exercise_id), b.c.derived.D8_kit.tokens, (b.c.derived.pain || []).map((x) => x.area));
            assert.ok(vals.some((v) => v.value === f.detail.value && v.axis === f.detail.axis), `${s.slot_id} ${f.detail.value}`);
            assert.equal(f.detail.key, 'detail.v.' + f.detail.value);
            assert.equal(f.exercise_id, p.exercise_id, 'a detail variation keeps the exercise');
          }
        }
        // a day with too few slots for a one-third share takes its single small change: a real alternative on a full kit (v1.2,
        // review 01 'a full kit takes a real alternative'), else a one-detail variation (R2-LIB-01, not flagged block_change)
        const BC = R.selection.block_change, n = Math.floor(BC.max_share_of_slots * others + 1e-9);
        // B3: every kit looks for a real one-detail alternative (BC.one_detail), at least one slot a day
        if (others) assert.ok(changed <= Math.max(1, n), `${b.c.name} ${d.weekday}: ${changed}/${others}`);
      }
    }
  }
});

test('fallbacks: bootcamp kit without a pull-up bar -> nearest pattern + buy list (V7); colour-matched aerobic picks', () => {
  const b = stub('05-bootcamp');
  const sel = b.selections[0];
  assert.deepEqual(sel.buy_list, ['pullup_bar', 'trx']);
  // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): Monday's second back station is a vertical pull the kit cannot
  // set up - with two rows in the kit it is a rear-delt fly, not one more row (sample 05 major 'the same two rows four times');
  // Friday's own vertical-pull slot stays a row of another family and both still name the pull-up bar to buy
  const vp = sel.fills['Mon.BC1.s07'];
  assert.equal(vp.bucket, 'ISO_SIDE_REAR_DELT');
  assert.equal(ex(vp.exercise_id).credit_class, 'ISO_REAR');
  assert.ok(vp.flags.includes('pattern_gap') && vp.flags.includes('no_vertical_pull') && vp.exercise_id);
  const vf = sel.fills['Fri.BC3.s07'];
  assert.equal(vf.bucket, 'RP_HPULL');
  assert.ok(vf.flags.includes('pattern_gap') && vf.exercise_id && !ex(vf.exercise_id).tags.includes('home_substitute'));
  for (const bb of built) for (const { sel: s2, idx } of pairs(bb)) for (const f of fillsOf(s2)) {
    const slot = idx.get(f.slot_id).s;
    if (slot.aerobic && f.exercise_id) assert.equal(ex(f.exercise_id).conditioning.colour, slot.aerobic.colour);
  }
  assert.equal(aerobicPick('C', b.c.derived, model, b.c.seed, 'x'), aerobicPick('C', b.c.derived, model, b.c.seed, 'x'));
});

test('WOD stations: 3-4 distinct movements from the COND_WOD pool, never credited (class model, D-20)', () => {
  const b = stub('04-crossfit-style-bootcamp');
  for (const f of fillsOf(b.selections[0]).filter((x) => x.bucket === 'COND_WOD')) {
    assert.ok(f.stations.length >= R.conditioning.wod.stations[0] && f.stations.length <= R.conditioning.wod.stations[1], f.slot_id);
    assert.equal(f.stations[0], f.exercise_id);
    // v0.4 B2 (RECHECK 04 major): the WOD pool also holds ballistic box / squat jumps and medball slams / wall balls, so the week's
    // WODs rotate their movements; nothing in a WOD is ever credited
    const b2 = (e) => R.conditioning.wod.rotate_stations_week && e.athletic && ((e.slots.includes('AP_PLYO') && e.athletic.quality === 'ballistic') || (e.slots.includes('AP_THROW') && e.medball));
    // v0.5 fix round 1 (PRG-10; OBSERVED CrossFit sheet: T2B, gymnastics; sample 04 minor): a pull-up, an inverted row or toes-to-bar
    // is a WOD station too - the week's WODs hold one (rules.conditioning.wod.x1) - and still credits nothing there
    const pull = new RegExp(R.conditioning.wod.x1.pull_re);
    for (const id of f.stations) { assert.ok(ex(id).slots.includes('COND_WOD') || b2(ex(id)) || pull.test(id), id); assert.deepEqual(model.credits(ex(id), 'COND_WOD'), {}); }
  }
});

test('fillSlot: a bonus / focus slot respects the week (no counted lift, no repeat of the day) and is deterministic', () => {
  const b = stub('06-full-body-aesthetics');
  const layout = b.layouts[0];
  const ctx = { derived: b.c.derived, shape: b.c.shape, layout, targets: b.c.derived.D9_start_sets, exerciseBlock: 1, prev: null, model, seed: b.c.seed, selection: b.selections[0] };
  const slot = { slot_id: 'Mon.A1.x09', station_id: 'A1.x09', bucket: 'FOCUS', role: 'focus', block: 'accessories', group: 'quads', sets_hint: null,
    default_sets: 2, pair: null, superset: null, circuit: null, axial_req: null, variant: null, laterality_dial: false, loading: null,
    focus_muscle: 'quads', time_class: 'isolation', counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null, origin: 'focus_added', why: [] };
  const f1 = fillSlot(slot, ctx);
  const f2 = fillSlot(slot, ctx);
  assert.deepEqual(f1, f2);
  assert.ok(f1.exercise_id);
  assert.ok(!ex(f1.exercise_id).axial);
  const monIds = Object.values(b.selections[0].fills).filter((f) => f.slot_id.startsWith('Mon.')).map((f) => f.exercise_id);
  assert.ok(!monIds.includes(f1.exercise_id));
  assert.equal(ex(f1.exercise_id).primary_muscle, 'quads');
});

test('candidates / passesHardFilters agree; scores are sorted', () => {
  const b = stub('02-football');
  const layout = b.layouts[0];
  const slot = daySlots(layout.days[0]).find((s) => s.bucket === 'RP_HPUSH' || s.bucket === 'RP_HPULL');
  const ctx = { derived: b.c.derived, shape: b.c.shape, layout, targets: b.c.derived.D9_start_sets, exerciseBlock: 1, prev: null, model, seed: b.c.seed };
  const list = candidates(slot, ctx);
  assert.ok(list.length > 3);
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].score >= list[i].score);
  for (const c of list) assert.ok(passesHardFilters(ex(c.exercise_id), slot, ctx));
});
