// tests/dose.test.mjs - owner B3. engine/dose.mjs: H02 (never to failure on heavy compounds; MAX / MYO only where allowed),
// planned RIR from the stairway, VOL phases, pyramid, preference, per-side, Olympic power language / ramp / full catch,
// medballs <= 20 lb, plyo contacts and the session cap, tests (never a 1RM from zero), circuits, WODs and aerobic doses.
import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureModel, stubDerived, sampleContexts, buildSelections } from './helpers/stub-derived.mjs';
import { layoutForWeek, daySlots, baseSets } from '../engine/week.mjs';
import { doseItem, doseAerobic, doseConditioning, repClassFor, positionFor } from '../engine/dose.mjs';

const model = fixtureModel();
const R = model.rules;
const contexts = await sampleContexts(model);
const built = [];
for (const c of contexts) built.push({ c, ...(await buildSelections(c, model)) });
const stub = (name) => built.find((b) => b.c.name === name && b.c.source === 'stub');
const NEVER = R.effort.never_failure_rep_classes;

/** dose every slot of every week (sets: week-1 base + 1 per 4 weeks, the shape of a stairway) */
function allItems(b, opts = {}) {
  const out = [];
  for (const ws of b.c.shape.weeks) {
    const L = layoutForWeek(b.layouts[ws.training_block - 1], ws, b.c.derived, model);
    const sel = b.selections[ws.exercise_block - 1];
    for (const day of L.days) {
      const flat = daySlots(day);
      for (const slot of flat) {
        const fill = sel.fills[slot.slot_id] || null;
        const ex = fill && fill.exercise_id ? model.ex(fill.exercise_id) : null;
        const sets = (opts.sets ? opts.sets(slot, ws) : baseSets(slot, b.c.derived.session_minutes) + Math.floor((ws.stair_week || 1) / 4));
        const position = positionFor(day, slot.slot_id, sel.fills, null, model);
        const dose = doseItem({ slot, fill, exercise: ex, sets, week: ws, day, derived: b.c.derived, athletic: null, position, at_cap: !!opts.atCap, model });
        const rc = ex && !slot.aerobic && model.bucket(slot.bucket).kind !== 'warmup' ? repClassFor({ ...slot, bucket: (fill && fill.bucket) || slot.bucket }, ex, model) : null;
        out.push({ b, ws, day, slot, fill, ex, sets, position, dose, rc });
      }
    }
  }
  return out;
}
const everything = built.flatMap((b) => allItems(b));

test('H02: heavy compounds never to failure - RIR >= 1 (or intent / role / power), never MAX or MYO', () => {
  let n = 0;
  for (const it of everything) {
    if (!it.rc || !NEVER.includes(it.rc)) continue;
    const e = it.dose.effort;
    assert.ok(e, `${it.slot.slot_id}`);
    assert.ok(['rir', 'intent', 'role', 'power'].includes(e.type), `${it.b.c.name} w${it.ws.n} ${it.slot.slot_id} ${e.type}`);
    if (e.type === 'rir') {
      assert.ok(e.min >= R.effort.compound_floor_rir, `${it.slot.slot_id} min ${e.min}`);
      assert.ok(e.last_set !== 'max', `${it.slot.slot_id} ${e.last_set}`);
      // MYO only on a machine compound that is the day's last item (H02 'last machine exercise'), never free weights
      if (e.last_set === 'myo') { assert.equal(it.rc, 'machine_stable_compound'); assert.ok(it.position.is_last_resistance); }
      n++;
    }
  }
  assert.ok(n > 500);
});

test('MAX only on small-muscle / rear-delt / calf work; MYO only on the last resistance item, isolation or constraint >= 4, last stair week (or at cap in HARDEST)', () => {
  let max = 0, myo = 0;
  for (const it of everything) {
    const e = it.dose.effort;
    if (!e || e.type !== 'rir') continue;
    if (e.last_set === 'max') { max++; assert.ok(R.effort.max.allowed_rep_classes.includes(it.rc), `${it.slot.slot_id} ${it.rc}`); }
    if (e.last_set === 'myo') {
      myo++;
      assert.ok(it.position.is_last_resistance, it.slot.slot_id);
      assert.ok(['big_muscle_isolation', 'small_muscle_isolation', 'rear_delts', 'calves'].includes(it.rc) || it.ex.constraint >= 4, it.slot.slot_id);
      assert.equal(it.ws.block_type, 'stairway');
      assert.ok(it.ws.is_last_stair_week, `w${it.ws.n}`);
    }
  }
  assert.ok(max > 0 && myo > 0);
  // at cap in the HARDEST phase also unlocks MYO (never outside a stairway)
  const b = stub('06-full-body-aesthetics');
  const capped = allItems(b, { atCap: true }).filter((it) => it.dose.effort && it.dose.effort.last_set === 'myo');
  assert.ok(capped.some((it) => it.ws.phase === 'HARDEST' && !it.ws.is_last_stair_week));
  assert.ok(capped.every((it) => it.ws.phase === 'HARDEST' || it.ws.is_last_stair_week));
});

test('planned RIR follows the stairway week (R2-PER-05, R3-VOL-04): 3 RIR early, 1+ with intensifiers only in the last week', () => {
  for (const it of everything) {
    const e = it.dose.effort;
    if (!e || e.type !== 'rir' || it.rc === 'core' || it.ws.block_type !== 'stairway') continue;
    const p = it.ws.planned_rir;
    assert.equal(e.min, Math.max(p.min, NEVER.includes(it.rc) ? R.effort.compound_floor_rir : 0), `${it.b.c.name} w${it.ws.n} ${it.slot.slot_id}`);
    assert.equal(e.max, Math.max(p.max, e.min));
    assert.equal(e.rpe_max, R.effort.rpe_for_rir[String(e.min)]);
    // v1.2 (review 06 / 07): intensifiers never land on a never-to-failure compound (H02)
    assert.equal(e.intensifier, !!(it.ws.is_last_stair_week && p.intensifiers && !NEVER.includes(it.rc)));
  }
  // core opener stays light (2 x 2 short of failure, R2-SES-03)
  for (const it of everything) if (it.rc === 'core' && it.dose.effort && it.dose.effort.type === 'rir') assert.ok(it.dose.effort.min >= 2);
});

test('flat blocks: RIR from by_block_type, no MAX / MYO, no week-1 tip (soccer pre-season)', () => {
  const pre = everything.filter((it) => it.b.c.name === '03-soccer' && it.ws.block_type === 'pre_season' && it.dose.effort && it.dose.effort.type === 'rir' && it.rc !== 'core');
  assert.ok(pre.length > 20);
  for (const it of pre) {
    assert.equal(it.dose.effort.min, Math.max(R.effort.by_block_type.pre_season.min, NEVER.includes(it.rc) ? 1 : 0));
    assert.ok(!['max', 'myo'].includes(it.dose.effort.last_set));
    assert.ok(!it.dose.load || it.dose.load.type !== 'week1_tip');
  }
  const pw = pre.filter((it) => it.slot.role === 'work');
  assert.ok(pw.some((it) => it.dose.notes.some((n) => n.key === 'note.pre_season')));
});

test('recovery week: RIR >= 3 (outside the band only here), Orange aerobic only', () => {
  const b = stub('02-football');
  const ws = { ...b.c.shape.weeks[4], block_type: 'recovery', phase: 'RECOVERY', planned_rir: { ...R.effort.by_block_type.recovery, intensifiers: false }, test: null, stair_week: null, stair_level: null };
  const L = layoutForWeek(b.layouts[0], ws, b.c.derived, model);
  for (const day of L.days) for (const slot of daySlots(day)) {
    const fill = b.selections[0].fills[slot.slot_id];
    const ex = fill && fill.exercise_id ? model.ex(fill.exercise_id) : null;
    const d = doseItem({ slot, fill, exercise: ex, sets: 2, week: ws, day, derived: b.c.derived, athletic: null, position: positionFor(day, slot.slot_id, null, null, model), at_cap: false, model });
    if (d.effort && d.effort.type === 'rir') assert.ok(d.effort.min >= R.recovery.rir_min, slot.slot_id);
    if (slot.aerobic) assert.equal(d.effort.colour, 'C');
  }
});

test('athlete VOL phases (PER-11): compounds 12-15 -> 8-12 -> 6-8 by exercise block', () => {
  const vp = R.reps.athlete_vol_phases;
  // v1.2: an exercise's own rep ceiling (catalog rep hint: push press 3-6, weighted pull-up 5-8 ...) wins (note.rep_cap, VOL-11)
  const capped = (x) => (x.dose.notes || []).some((n) => n.key === 'note.rep_cap');
  const checked = everything.filter((x) => x.b.c.name === '02-football' && x.rc === 'main_bilateral_compound' && x.dose.reps && x.dose.reps.type === 'range' && !capped(x));
  assert.ok(checked.length > 20);
  for (const it of checked) {
    const br = R.reps.brackets[vp[it.ws.rep_phase].compound];
    assert.equal(it.dose.reps.min, br.min, `w${it.ws.n} ${it.slot.slot_id}`);
    assert.equal(it.dose.reps.max, br.max);
  }
});

test('pyramid 12/10/8 then a light 20 (PRG-07): L2+, hypertrophy, the first main bilateral compound of the day, sets >= 4', () => {
  const b = stub('06-full-body-aesthetics');
  const items = allItems(b, { sets: (s) => (s.role === 'work' ? 4 : 3) });
  const pyr = items.filter((it) => it.dose.set_reps);
  assert.ok(pyr.length > 0);
  for (const it of pyr) {
    assert.equal(it.rc, 'main_bilateral_compound');
    assert.deepEqual(it.dose.set_reps.map((r) => r.value), [12, 10, 8, 20]);
    const first = daySlots(it.day).find((s) => model.bucket(s.bucket).kind === 'resistance' && s.block !== 'circuit');
    assert.equal(first.slot_id, it.slot.slot_id);
  }
  assert.ok(!allItems(b, { sets: () => 3 }).some((it) => it.dose.set_reps), 'no pyramid below 4 sets');
  const l1 = stub('08-pickleball-genpop');
  assert.ok(!allItems(l1, { sets: () => 4 }).some((it) => it.dose.set_reps), 'no pyramid for L1 / non-hypertrophy');
});

test('lifting style (VOL-12): heavy_powerlifting moves the first lift of each day one bracket down; weekly sets untouched', () => {
  const b = stub('07-push-pull-legs');
  const firsts = everything.filter((it) => it.b === b && it.ws.n === 2 && it.rc && ['main_bilateral_compound', 'machine_stable_compound', 'unilateral_compound'].includes(it.rc) &&
    daySlots(it.day).find((s) => model.bucket(s.bucket).kind === 'resistance').slot_id === it.slot.slot_id);
  assert.ok(firsts.length >= 4);
  for (const it of firsts) {
    const cell = R.reps.matrix[it.rc].hypertrophy;
    const base = R.reps.brackets[it.b.c.derived.D3_client_level.level === 'L1' && cell.L1 ? cell.L1 : cell.bracket];
    assert.ok(it.dose.reps.max < base.max, `${it.slot.slot_id} ${JSON.stringify(it.dose.reps)}`);
    assert.ok(it.dose.why.some((w) => w.key === 'why.reps_preference'));
  }
  const d = stubDerived('06-full-body-aesthetics', model, { lift_style: 'volume_lighter' });
  const s6 = stub('06-full-body-aesthetics');
  const it = everything.find((x) => x.b === s6 && x.ws.n === 2 && x.rc === 'main_bilateral_compound');
  const lighter = doseItem({ ...it, exercise: it.ex, week: it.ws, derived: d, athletic: null, at_cap: false, model });
  assert.ok(lighter.reps.min > it.dose.reps.min || lighter.reps.max > it.dose.reps.max);
});

test('unilateral work is written per side (10/10 = 1 set, UNI-01); heavy single-leg toggle uses 4-6 (UNI-04)', () => {
  for (const it of everything) {
    if (!it.ex || !it.rc || !['unilateral', 'alternating'].includes(it.ex.laterality)) continue;
    if (['range', 'per_side'].includes(it.dose.reps && it.dose.reps.type) && !['olympic', 'plyo', 'throw', 'cod', 'sprint'].includes(it.rc)) {
      assert.equal(it.dose.reps.type, 'per_side', `${it.slot.slot_id} ${it.ex.id}`);
      assert.ok(it.dose.notes.some((n) => n.key === 'note.per_side'));
    }
  }
  const b = stub('06-full-body-aesthetics');
  const d = stubDerived('06-full-body-aesthetics', model, { prefs: { ...b.c.derived.prefs, heavy_unilateral: true } });
  const it = everything.find((x) => x.b === b && x.ws.n === 2 && x.rc === 'unilateral_compound' && x.position.is_first_unilateral_lower);
  const heavy = doseItem({ ...it, exercise: it.ex, week: it.ws, derived: d, athletic: null, at_cap: false, model });
  assert.deepEqual([heavy.reps.min, heavy.reps.max], [4, 6]);
});

test('Olympic lifts: power language, no percentages (D-29); one 8 / 6 / 6 / 4 ramp across the block (v1.2); full catches 3-5; loaded jumps 10-20 % BW', () => {
  let ramp = 0, catches = 0;
  const keys = [R.effort.olympic.key, 'effort.olympic_power_db', 'effort.olympic_power_kb'];
  const noteKeys = ['note.olympic_power', 'note.olympic_power_db', 'note.olympic_power_kb', 'note.kb_swing_power'];
  for (const it of everything) {
    if (it.rc !== 'olympic') continue;
    assert.equal(it.dose.effort.type, 'power');
    assert.ok(keys.includes(it.dose.effort.key), it.dose.effort.key); // implement-aware wording (review 01 minor)
    assert.ok(!it.dose.load || it.dose.load.type !== 'pct_hint');
    assert.ok(it.dose.notes.some((n) => noteKeys.includes(n.key)));
    if (it.dose.why.some((w) => w.key === 'why.olympic_ramp') && it.ws.block_type === 'stairway' && it.b.c.source === 'stub' && !it.slot.test) {
      // review 08 major 3: the ramp runs once across the training block (it never restarts at an exercise-block boundary)
      const N = it.ws.stair_N || it.b.c.shape.weeks.filter((w) => w.training_block === it.ws.training_block).length;
      const p = N > 1 ? (it.ws.stair_week - 1) / (N - 1) : 1;
      const k = Math.min(R.olympic.ramp.length - 1, Math.max(0, Math.floor(p * R.olympic.ramp.length - 1e-9)));
      assert.equal(it.dose.reps.value, R.olympic.ramp[k].reps, `${it.b.c.name} w${it.ws.n}`);
      ramp++;
    }
    if (it.ex.athletic.full_catch && !it.slot.test && it.dose.why.some((w) => w.key === 'why.olympic_level') && !it.dose.why.some((w) => ['why.olympic_ramp', 'why.olympic_stay_active', 'why.class_level'].includes(w.key)) && it.ws.block_type !== 'in_season') { assert.deepEqual([it.dose.reps.min, it.dose.reps.max], R.olympic.full_catch_reps); catches++; }
    if (it.ex.athletic.loaded_jump) assert.deepEqual(it.dose.load, { type: 'bw_pct', min: 10, max: 20 });
  }
  assert.ok(ramp > 10);
});

test('real WeekShape: the Olympic ramp follows the training block, never restarting at exercise-block boundaries (review 08 major 3)', () => {
  const real = built.find((b) => b.c.name === '03-soccer' && b.c.source === 'real');
  if (!real) return;
  let prev = null;
  for (const it of allItems(real).filter((x) => x.rc === 'olympic' && x.dose.why.some((w) => w.key === 'why.olympic_ramp') && x.ws.block_type === 'stairway').sort((a, b) => a.ws.n - b.ws.n)) {
    if (prev && it.ws.n > prev.ws.n) assert.ok(it.dose.reps.value <= prev.dose.reps.value, `w${it.ws.n}`); // reps never go back up
    prev = it;
  }
});

test('medballs: never above 20 lb, youth / older minus 2 lb, never above the ball the client owns (EQ-06)', () => {
  let n = 0;
  for (const it of everything) {
    const l = it.dose.load;
    if (!l || l.type !== 'medball_lb') continue;
    n++;
    assert.ok(l.max <= R.medball.max_lb && l.min >= R.medball.min_lb && l.min <= l.max, JSON.stringify(l));
    const owned = it.b.c.derived.D8_kit.medball_max_lb;
    if (owned != null) assert.ok(l.max <= owned, `${it.b.c.name} ${JSON.stringify(l)}`);
    if (it.b.c.derived.age < 18 && it.ex.medball) {
      const base = R.medball.loads_lb[it.ex.medball.kind];
      assert.ok(l.min <= Math.max(R.medball.min_lb, base[0] - R.medball.youth_older_minus_lb));
    }
  }
  assert.ok(n > 0);
});

test('plyo contacts: stage range rising through the stage, x 0.5 in a heavy play week, session cap respected (ATH-01)', () => {
  for (const it of everything) {
    if (it.rc !== 'plyo' || it.slot.test || !['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(it.slot.bucket)) continue;
    const a = it.dose.athletic;
    assert.equal(a.unit, 'contacts');
    assert.equal(a.total, it.sets * a.per_set);
    const cap = it.b.c.derived.D11_athletic_budget.contacts_session_max;
    const n = daySlots(it.day).filter((s) => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(s.bucket)).length;
    assert.ok(a.total <= Math.floor(cap / n) || a.per_set === 1, `${it.b.c.name} ${it.slot.slot_id} ${a.total} > ${cap}/${n}`);
    assert.ok(it.dose.notes.some((x) => /^note\.rc[123]$/.test(x.key)));
  }
  const pb = everything.filter((it) => it.b.c.name === '08-pickleball-genpop' && it.slot.bucket === 'AP_PLYO' && it.ws.n === 1 && !it.slot.test);
  assert.ok(pb.length);
  for (const it of pb) assert.ok(it.dose.notes.some((x) => x.key === 'note.heavy_play_week'));
});

test('tests (H19): baseline from zero is never a 1RM / max mile; end tests use the after-completed-block catalogue; items only in test weeks', () => {
  const after = Object.values(R.tests.catalogue.strength.after_completed_block);
  for (const it of everything) {
    if (!it.dose.reps || it.dose.reps.type !== 'test') { continue; }
    assert.ok(it.ws.test, `test item outside a test week w${it.ws.n}`);
    if (it.ws.test.from_zero) {
      assert.ok(!['rm_3_or_work_up_to_1', '1_mile', 'erg_time_trial'].includes(it.dose.reps.test), `${it.b.c.name} ${it.dose.reps.test}`);
      // "no max test from zero: X instead" only where X stands in for a max test (rep max, 80-90 %); never on a CMJ / drill
      const C = R.tests.catalogue;
      const safe = [...Object.values(C.strength.from_zero), C.cardio.from_zero, C.speed_agility.from_zero];
      assert.equal(it.dose.notes.some((n) => n.key === 'note.test_from_zero'), safe.includes(it.dose.reps.test), `${it.dose.reps.test}`);
    }
    // a lifting test replaces the week's top sets; an aerobic test replaces the session
    // (v1.2: a baseline lifting test says 'work up to a rep max you can own', note.test_baseline - review 04 major 9)
    const want = it.dose.effort && it.dose.effort.type === 'aerobic' ? ['note.test_day_session'] : ['note.test_day', 'note.test_baseline'];
    assert.ok(it.dose.notes.some((n) => want.includes(n.key)));
  }
  assert.ok(everything.some((it) => it.dose.reps && it.dose.reps.type === 'test' && it.ws.test.type === 'end' && after.includes(it.dose.reps.test)));
  // safety net: a from-zero week never prints a 1RM even if a slot asks for it
  const it = everything.find((x) => x.ws.test && x.ws.test.from_zero && x.dose.reps && x.dose.reps.type === 'test' && x.slot.bucket === 'RP_BKD');
  const d = doseItem({ ...it, exercise: it.ex, slot: { ...it.slot, test: 'rm_3_or_work_up_to_1' }, week: it.ws, derived: it.b.c.derived, athletic: null, at_cap: false, model });
  assert.notEqual(d.reps.test, 'rm_3_or_work_up_to_1');
});

test('week-1 load tip only on main compounds in the first week of a stairway (R2-GEN-06)', () => {
  for (const it of everything) {
    if (!it.dose.load || it.dose.load.type !== 'week1_tip') continue;
    assert.equal(it.ws.stair_week, 1);
    assert.ok(['main_bilateral_compound', 'machine_stable_compound', 'unilateral_compound'].includes(it.rc));
    assert.ok(it.dose.notes.some((n) => n.key === 'load.week1_tip'));
  }
});

test('bootcamp circuits: a round = 1 set, work seconds climb 35 s by the planned steps (1-s steps, every week), 15 s transition, 90 s between rounds (D-19 v1.2)', () => {
  const b = stub('05-bootcamp');
  const items = everything.filter((it) => it.b === b && it.slot.block === 'circuit');
  assert.ok(items.length > 20);
  for (const it of items) {
    const d = doseConditioning(it.slot, it.fill, it.ws, b.c.derived, model);
    assert.equal(d.reps.type, 'rounds_work');
    assert.equal(d.reps.work_s, it.ws.circuit.work_s);
    assert.deepEqual(d.rest, { type: 'circuit', transition_s: 15, between_rounds_s: 90 });
    // v1.2 (review 05 minor): the cue follows the station kind (resistance / metabolic)
    assert.ok(['effort.circuit', 'effort.circuit_resistance', 'effort.circuit_metabolic'].includes(d.effort.key), d.effort.key);
  }
  // v1.2 (review 05 blocker 1, D-19 revised): work seconds climb every week by the planned steps, in 1-s steps, never > 7 %
  const byWeek = [...new Set(items.map((it) => it.ws.n))].sort((a, b) => a - b).map((n) => items.find((it) => it.ws.n === n));
  assert.equal(doseConditioning(byWeek[0].slot, byWeek[0].fill, byWeek[0].ws, b.c.derived, model).reps.work_s, 35);
  for (let i = 1; i < byWeek.length; i++) {
    const a = byWeek[i - 1].ws.circuit.work_s, z = byWeek[i].ws.circuit.work_s;
    assert.ok(z > a && z <= a * 1.07 + 1, `w${byWeek[i].ws.n} ${a} -> ${z}`);
  }
  assert.ok(byWeek[byWeek.length - 1].ws.circuit.work_s <= R.supersets.bootcamp.stairway.work_s_max);
});

test('WOD (class model, D-20): 10 -> 20 min by stair level (10 -> 15 on an over-time day, v1.2), format rotates, 3-4 stations, ball <= 20 lb; WOD-only day 20-30 min', () => {
  const b = stub('04-crossfit-style-bootcamp');
  const wods = everything.filter((it) => it.b === b && it.slot.bucket === 'COND_WOD');
  assert.ok(wods.length);
  const formats = new Set();
  for (const it of wods) {
    const d = doseConditioning(it.slot, it.fill, it.ws, b.c.derived, model);
    const only = /^WOD\./.test(it.slot.station_id);
    const range = only ? R.conditioning.wod.wod_only_day_minutes : (it.slot.wod_short ? R.conditioning.wod.short_minutes : R.conditioning.wod.minutes);
    assert.ok(d.wod.minutes[0] >= range[0] && d.wod.minutes[1] <= range[1]);
    assert.ok(d.wod.stations.length >= 3 && d.wod.stations.length <= 4);
    assert.ok(R.conditioning.wod.formats.includes(d.wod.format));
    formats.add(d.wod.format);
    if (d.load) assert.ok(d.load.max <= 20);
  }
  assert.ok(formats.size >= 2);
  const w1 = wods.find((it) => it.ws.n === 1 && !/^WOD\./.test(it.slot.station_id));
  const w8 = wods.find((it) => it.ws.n === 8 && !/^WOD\./.test(it.slot.station_id));
  assert.equal(doseConditioning(w1.slot, w1.fill, w1.ws, b.c.derived, model).wod.minutes[0], 10);
  // v1.2 (review 04 blocker 1): on an over-time day the WOD climbs 10 -> 15 min instead (cut step 'wod_short')
  assert.equal(doseConditioning(w8.slot, w8.fill, w8.ws, b.c.derived, model).wod.minutes[0], w8.slot.wod_short ? R.conditioning.wod.short_minutes[1] : 20);
  const short = doseConditioning({ ...w8.slot, wod_short: true }, w8.fill, w8.ws, b.c.derived, model);
  assert.equal(short.wod.minutes[0], R.conditioning.wod.short_minutes[1]);
});

test('aerobic: minutes by colour (C steady <= 40), recovery weeks Orange, any erg', () => {
  const b = stub('06-full-body-aesthetics');
  for (const colour of ['A', 'B', 'C']) {
    const slot = { slot_id: 'Mon.x', bucket: 'COND_AEROBIC', aerobic: { colour, minutes: R.conditioning.minutes[colour], position: 'separate' }, why: [] };
    const d = doseAerobic(slot, b.c.shape.weeks[0], b.c.derived, model);
    assert.equal(d.reps.type, 'minutes');
    assert.equal(d.reps.min, R.conditioning.minutes[colour][0]);
    assert.ok(d.reps.max <= (colour === 'C' ? R.conditioning.steady_max_min : 99));
    assert.equal(d.effort.colour, colour);
    assert.ok(d.notes.some((n) => n.key === 'note.any_erg'));
    const rec = doseAerobic(slot, { ...b.c.shape.weeks[0], block_type: 'recovery' }, b.c.derived, model);
    assert.equal(rec.effort.colour, 'C');
  }
});

test('repClassFor: bucket class, machine (constraint >= 4) and single-leg overrides, rear delts, prehab, FOCUS by exercise', () => {
  const s = (bucket, variant = null) => ({ bucket, variant });
  assert.equal(repClassFor(s('RP_BKD'), model.ex('front-squat-barbell'), model), 'main_bilateral_compound');
  assert.equal(repClassFor(s('RP_BKD'), model.ex('leg-press-machine'), model), 'machine_stable_compound');
  assert.equal(repClassFor(s('RP_UKD'), model.ex('reverse-lunge'), model), 'unilateral_compound');
  assert.equal(repClassFor(s('ISO_SIDE_REAR_DELT', 'rear'), model.ex('bent-over-db-reverse-fly'), model), 'rear_delts');
  assert.equal(repClassFor(s('ISO_SIDE_REAR_DELT', 'side'), model.ex('db-lateral-side-raise'), model), 'small_muscle_isolation');
  assert.equal(repClassFor(s('ISO_CALF'), model.ex('machine-calf-raise'), model), 'calves');
  assert.equal(repClassFor(s('RECOVERY_ARM_CARE'), model.ex('floor-prone-y-t-raises'), model), 'prehab');
  assert.equal(repClassFor(s('FOCUS'), model.ex('leg-extension-machine'), model), 'big_muscle_isolation');
  assert.equal(repClassFor(s('AP_TRIPLE_EXT'), model.ex('power-clean'), model), 'olympic');
});

test('every dose has the Dose keys in order and only i18n keys that exist (notes, why)', () => {
  const keys = ['reps', 'set_reps', 'effort', 'rest', 'load', 'tempo_key', 'athletic', 'circuit', 'wod', 'notes', 'why'];
  for (const it of everything) {
    assert.deepEqual(Object.keys(it.dose), keys);
    for (const n of it.dose.notes) assert.ok(model.has('en', n.key), n.key);
    for (const w of it.dose.why) assert.ok(model.has('en', w.key), w.key);
    if (it.dose.effort && it.dose.effort.key) assert.ok(model.has('en', it.dose.effort.key), it.dose.effort.key);
  }
  for (const b of built) for (const sel of b.selections) for (const f of Object.values(sel.fills)) {
    for (const w of f.why) assert.ok(model.has('en', w.key), w.key);
    if (f.detail) assert.ok(model.has('en', f.detail.key), f.detail.key);
  }
  for (const b of built) for (const L of b.layouts) {
    for (const w of [...L.why, ...L.days.flatMap((d) => [...d.why, ...daySlots(d).flatMap((s) => s.why)])]) assert.ok(model.has('en', w.key), w.key);
    for (const d of L.days) { assert.ok(model.has('en', d.label_key), d.label_key); for (const s of daySlots(d)) if (s.text_key) assert.ok(model.has('en', s.text_key), s.text_key); }
    for (const w of L.warnings) assert.ok(model.has('en', w.key), w.key);
  }
});
