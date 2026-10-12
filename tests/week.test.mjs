// tests/week.test.mjs - owner B3. engine/week.mjs: template / weekday mapping / aerobic placement facts of CONTRACTS §9 and
// the day-level hard rules week.mjs owns (H03, H04 + D-30, H05, H06, H07 stations, H18, caps, prehab, older defaults).
import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureModel, stubDerived, stubShape, sampleContexts } from './helpers/stub-derived.mjs';
import { buildWeekLayout, layoutForWeek, estimateMinutes, daySlots, programIdFor } from '../engine/week.mjs';
import { sessionSize } from '../engine/intake.mjs';

const model = fixtureModel();
const R = model.rules;
const contexts = await sampleContexts(model);
const byName = (name, source = 'stub') => contexts.find((c) => c.name === name && c.source === source);
const layoutOf = (ctx, i = 0) => buildWeekLayout(ctx.derived, ctx.shape, ctx.shape.training_blocks[i], model);
const mainDays = (L) => L.days.filter((d) => d.kind === 'main');
const RES = ['resistance', 'isolation', 'focus'];
const kindOf = (s) => model.bucket(s.bucket).kind;
const sources = [...new Set(contexts.map((c) => c.source))];

// ---------------------------------------------------------------------------------------------------- §9 facts
const EXPECT = {
  '01-swimming': { template: 'athletic.3', variant: null, program: 'OT11', main: { Mon: 'S1', Wed: 'S2', Fri: 'S3' }, optional: { Sat: 'OPT' } },
  '02-football': { template: 'athletic.4', variant: null, program: 'OT11', main: { Mon: 'A1', Tue: 'B1', Thu: 'A2', Fri: 'B2' }, optional: { Wed: 'OPT', Sat: 'OPT' } },
  '03-soccer': { template: 'athletic.3', variant: null, program: 'OT11', main: { Mon: 'S1', Wed: 'S2', Fri: 'S3' }, optional: { Sat: 'OPT' } },
  '04-crossfit-style-bootcamp': { template: 'hybrid_crossfit.4', variant: 'crossfit_style_bootcamp', program: 'OTCFB',
    main: { Mon: 'SQUAT', Tue: 'PRESS', Thu: 'DEADLIFT', Fri: 'CLEAN/PUSH' }, optional: { Sat: 'WOD' } },
  '05-bootcamp': { template: 'fat_loss_bootcamp.3', variant: null, program: 'OT06', main: { Mon: 'BC1', Wed: 'BC2', Fri: 'BC3' }, optional: {} },
  '06-full-body-aesthetics': { template: 'aesthetics.4', variant: null, program: 'OT01', main: { Mon: 'A1', Tue: 'B1', Thu: 'A2', Fri: 'B2' }, optional: { Wed: 'OPT', Sat: 'OPT' } },
  '07-push-pull-legs': { template: 'aesthetics.6', variant: 'ppl_x2', program: 'OT03',
    main: { Mon: 'Push', Tue: 'Pull', Wed: 'Legs 1', Thu: 'Push', Fri: 'Pull', Sat: 'Legs 2' }, optional: {} },
  '08-pickleball-genpop': { template: 'athletic.2', variant: null, program: 'OTACT', main: { Mon: 'A', Thu: 'B' }, optional: { Fri: 'OPT' }, play: ['Wed', 'Sat', 'Sun'] }
};
// aerobic sessions of the first training block: {count, colours (placement order), separate days}
const AEROBIC = {
  '01-swimming': { n: 0 },
  // (v0.5 fix round 2, converted - DECISIONS G: the session that follows lifting takes the easy colour, Orange, and the hard
  // intervals go to a day of their own - sample 02 major 'max-effort intervals after the heaviest lower day';
  // rules.conditioning.x2.addon_easy_colour)
  // (engine 0.6 selection, converted - DECISIONS G-136: the hard Blue intervals never sit on the day before a sprint day - Thursday's
  // accelerations - so they trade with Saturday's Green; the soccer player's 2 team practices count as 2 of his 4 sessions and take
  // the template's 'sport or off' days)
  '02-football': { n: 3, separate: { Wed: 'B', Sat: 'A' }, addons: ['C'] },
  // (engine 0.6.0, converted back - COACH-CH5 CH5-01 / DECISIONS G-197: team practices are not built into the week nor counted, so the
  // soccer player keeps his 4 sessions; the hard eve of G-136 still holds: Thursday's Blue, the eve of Friday's sprints, trades with Saturday)
  '03-soccer': { n: 4, separate: { Sat: 'A', Tue: 'B', Thu: 'C' }, addons: ['C'] },
  // v1.2 (review 04 major 7): the Green session never lands on a main day already over its minutes - it goes to the WOD day
  '04-crossfit-style-bootcamp': { n: 2, separate: { Wed: 'C', Sat: 'B' }, addons: [] },
  '05-bootcamp': { n: 3, separate: { Tue: 'C', Thu: 'B', Sat: 'A' }, addons: [] },
  // (v0.5 fix round 2, converted: both sessions after lifting are Orange; the hard intervals have Wednesday to themselves)
  '06-full-body-aesthetics': { n: 4, separate: { Wed: 'A', Sat: 'B' }, addons: ['C', 'C'] },
  '07-push-pull-legs': { n: 4, separate: {}, addons: ['A', 'B', 'C', 'C'] },
  '08-pickleball-genpop': { n: 1, separate: { Fri: 'C' }, addons: [] }
};

for (const src of sources) {
  test(`[${src}] §9 template, variant, program and weekday mapping for the 8 samples`, () => {
    for (const [name, e] of Object.entries(EXPECT)) {
      const L = layoutOf(byName(name, src));
      assert.equal(L.template_id, e.template, name);
      assert.equal(L.variant, e.variant, name);
      assert.equal(L.program_id, e.program, name);
      for (const [wd, dt] of Object.entries(e.main)) {
        const d = L.days.find((x) => x.weekday === wd);
        assert.ok(d && d.kind === 'main' && d.day_type === dt, `${name} ${wd} main ${dt}`);
      }
      for (const [wd, dt] of Object.entries(e.optional)) {
        const d = L.days.find((x) => x.weekday === wd);
        assert.ok(d && d.day_type === dt && d.kind === 'optional', `${name} ${wd} optional ${dt}`);
      }
      assert.equal(mainDays(L).length, Object.keys(e.main).length, name);
      if (e.play) assert.deepEqual(L.days.filter((d) => d.kind === 'play').map((d) => d.weekday), e.play, name);
      assert.ok(L.off_days.length >= R.session.off_days_min, `${name}: at least one full OFF day`);
    }
  });

  test(`[${src}] aerobic sessions: count, colours fill C -> B -> A (+ extra Orange), placement (R2-SES-06)`, () => {
    for (const [name, e] of Object.entries(AEROBIC)) {
      const L = layoutOf(byName(name, src));
      const aer = L.days.flatMap((d) => daySlots(d).filter((s) => s.aerobic).map((s) => ({ d, s })));
      assert.equal(aer.length, e.n, name);
      if (!e.n) continue;
      for (const [wd, colour] of Object.entries(e.separate)) {
        const hit = aer.find((x) => x.d.weekday === wd && x.s.aerobic.position === 'separate');
        assert.ok(hit, `${name}: separate aerobic session on ${wd}`);
        assert.equal(hit.s.aerobic.colour, colour, `${name} ${wd}`);
      }
      // v1.2 (review 02 / 03 / 06 / 07): a session on a main day is an add-on when it fits the minutes, else a separate session
      // that day (another time, not lifting time) - both count as 'on a main day' here
      const addons = aer.filter((x) => ['addon_after', 'separate_session'].includes(x.s.aerobic.position)).map((x) => x.s.aerobic.colour).sort();
      assert.deepEqual(addons, e.addons.slice().sort(), `${name} add-ons`);
      const colours = aer.map((x) => x.s.aerobic.colour);
      const counts = colours.reduce((o, c) => ({ ...o, [c]: (o[c] || 0) + 1 }), {});
      for (const [c, k] of Object.entries(counts)) if (c !== R.conditioning.extra_colour) assert.equal(k, 1, `${name}: colour ${c} twice`);
      for (const x of aer) assert.ok(!L.play_days.includes(x.d.weekday) || x.d.kind !== 'aerobic', `${name}: no aerobic day on a play day`);
    }
  });
}

test('swimmer: the pool is the aerobic work (no gym cardio, OPT-day aerobic station dropped, why.sport_is_aerobic)', () => {
  const L = layoutOf(byName('01-swimming'));
  assert.equal(L.days.flatMap(daySlots).filter((s) => s.bucket === 'COND_AEROBIC').length, 0);
  assert.ok(L.why.some((w) => w.key === 'why.sport_is_aerobic'));
});

// (engine 0.6.0, converted back - COACH-CH5 CH5-01 / DECISIONS G-197: team practices are not counted and not placed - the pre-season's
// 2 aerobic sessions are the gym's own again, and no practice day is built)
test('soccer pre-season block: same template, 2 aerobic sessions (athlete pre-season), no practice day built (CH5-01)', () => {
  const c = byName('03-soccer');
  const L = layoutOf(c, 1);
  assert.equal(L.training_block, 2);
  assert.equal(L.template_id, 'athletic.3');
  assert.equal(L.days.flatMap(daySlots).filter((s) => s.aerobic).length, 2);
  assert.equal(L.days.filter((d) => d.kind === 'sport').length, 0);
});

// ---------------------------------------------------------------------------------------------------- hard rules (day level)
const allLayouts = () => contexts.flatMap((c) => c.shape.training_blocks.map((tb) => ({ c, L: buildWeekLayout(c.derived, c.shape, tb, model) })));

test('H05: core block first after the warm-up on every main day (default position); moving it is honoured', () => {
  for (const { c, L } of allLayouts()) for (const d of mainDays(L)) {
    const kinds = d.blocks.map((b) => b.kind);
    assert.ok(kinds.includes('core'), `${c.name} ${d.weekday}: core never skipped`);
    const first = kinds.filter((k) => k !== 'warmup')[0];
    assert.equal(first, 'core', `${c.name} ${d.weekday}: ${kinds.join(',')}`);
  }
  const c = byName('02-football');
  const d = stubDerived('02-football', model, { prefs: { ...c.derived.prefs, core_position: 'end' } });
  const L = buildWeekLayout(d, stubShape('02-football', model, d), c.shape.training_blocks[0], model);
  for (const day of mainDays(L)) {
    const kinds = day.blocks.map((b) => b.kind).filter((k) => !['aerobic', 'cooldown'].includes(k));
    assert.equal(kinds[kinds.length - 1], 'core');
    assert.ok(daySlots(day).filter((s) => model.bucket(s.bucket).kind === 'core').every((s) => s.why.some((w) => w.key === 'why.core_moved')));
  }
});

test('H03 + block order: blocks follow rules.ordering.block_order; athletic and power precede strength', () => {
  const order = R.ordering.block_order;
  for (const { c, L } of allLayouts()) for (const d of L.days) {
    const kinds = d.blocks.map((b) => b.kind);
    const idx = kinds.map((k) => order.indexOf(k));
    for (let i = 1; i < idx.length; i++) assert.ok(idx[i] >= idx[i - 1], `${c.name} ${d.weekday}: ${kinds.join(',')}`);
    const s = kinds.indexOf('strength');
    if (s >= 0) for (const k of ['athletic', 'power']) if (kinds.includes(k)) assert.ok(kinds.indexOf(k) < s, `${c.name} ${d.weekday}`);
  }
});

test('H04: horizontal pull before vertical pull and horizontal push before vertical push, unless the vertical is the work (D-30)', () => {
  let exempt = 0;
  for (const { c, L } of allLayouts()) for (const d of L.days) {
    const flat = daySlots(d).filter((s) => s.block !== 'circuit');
    for (const [h, v] of [['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']]) {
      const iH = flat.findIndex((s) => s.bucket === h);
      const iV = flat.findIndex((s) => s.bucket === v);
      if (iH < 0 || iV < 0) continue;
      if (iV < iH) { assert.equal(flat[iV].role, 'work', `${c.name} ${d.weekday} ${v} before ${h}`); exempt++; }
    }
  }
  assert.ok(exempt >= 1, 'the CrossFit PRESS day (vertical press = work) is the exempt case');
});

test('H06: hip-dominant lower paired with a push, knee-dominant lower paired with a pull (UNI-11)', () => {
  const P = R.pairing;
  for (const { c, L } of allLayouts()) {
    if (P.not_for_variants.includes(L.variant)) continue;
    for (const d of mainDays(L)) {
      const pairs = new Map();
      for (const s of daySlots(d)) if (s.pair) { if (!pairs.has(s.pair)) pairs.set(s.pair, []); pairs.get(s.pair).push(s); }
      for (const [id, ms] of pairs) for (const s of ms) {
        const partners = ms.filter((x) => x !== s);
        const upper = partners.filter((x) => ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL'].includes(x.bucket));
        if (P.hip_buckets.includes(s.bucket)) for (const x of upper) assert.ok(P.hip_with.includes(x.bucket), `${c.name} ${d.weekday} ${id}: hip + ${x.bucket}`);
        if (P.knee_buckets.includes(s.bucket)) for (const x of upper) assert.ok(P.knee_with.includes(x.bucket), `${c.name} ${d.weekday} ${id}: knee + ${x.bucket}`);
      }
    }
  }
});

test('H07 (stations): at most one counted squat and one counted hinge station a week, never on the same day', () => {
  for (const { c, L } of allLayouts()) {
    const ax = L.days.flatMap((d) => daySlots(d).filter((s) => s.axial_req === 'axial').map((s) => ({ d: d.weekday, p: model.bucket(s.bucket).axial_pattern })));
    const sq = ax.filter((x) => x.p === 'squat');
    const hi = ax.filter((x) => x.p === 'hinge');
    assert.ok(sq.length <= 1 && hi.length <= 1, `${c.name}: ${JSON.stringify(ax)}`);
    if (sq.length && hi.length) assert.notEqual(sq[0].d, hi[0].d, c.name);
  }
});

// (converted in v0.5 from 'H18: ... 2-4 exercises, never 1': the coach's A / B template gives some groups one exercise a day,
// R4-SES-05 - rules.session.exercises_per_group.full_body_day = [1, 4])
test('H18 / R4-SES-05: full-body main days give a trained muscle group 1-4 exercises (calves / core exempt)', () => {
  const ex = R.session.exercises_per_group;
  for (const { c, L } of allLayouts()) for (const d of mainDays(L)) {
    if (ex.exempt_families.includes(L.family) || d.format === 'circuit') continue; // a timed circuit is not a full-body day (V23)
    const counts = {};
    for (const s of daySlots(d)) if (s.group && RES.includes(kindOf(s))) counts[s.group] = (counts[s.group] || 0) + 1;
    for (const [g, n] of Object.entries(counts)) {
      if (ex.exempt_groups.includes(g)) continue;
      assert.ok(n >= ex.full_body_day[0], `${c.name} ${d.weekday} ${g}: ${n}`);
      if (d.full_body) assert.ok(n <= ex.full_body_day[1], `${c.name} ${d.weekday} ${g}: ${n}`);
    }
  }
});

// (converted in v0.5 from 'H18 robustness: every built template x 30-90 min keeps groups at >= 2 ...', 'caps: athletic days <=
// athlete_cap 12 ... split days <= cap by minutes' and 'long days are kept ...': no session length, no cuts - R4-SES-02 sizes a
// session by its exercise count)
test('R4-SES-02 robustness: every built template x variant holds a main day at or under its session count; no group above 4 on a full-body day', () => {
  const base = byName('06-full-body-aesthetics');
  for (const [fam, F] of Object.entries(model.templates.families)) for (const [days, t] of Object.entries(F.days)) {
    const variants = [null, ...Object.keys(t.variants)];
    for (const variant of variants) {
      const sel = model.templateFor(fam, Number(days), variant);
      const wl = model.dayTypes(sel.template, sel.variant).week_layout;
      const planned = Object.keys(wl).filter((wd) => wl[wd].kind === 'main' || (wl[wd].kind === 'optional' && !wl[wd].optional));
      const d = stubDerived('06-full-body-aesthetics', model, {
        D1_family: fam, weekdays: planned, days_per_week: planned.length, goal: fam === 'athletic' ? 'athletic' : base.derived.goal,
        D6_week_layout: { template_id: `${fam}.${days}`, family: fam, days: Number(days), variant, pairing: F.pairing.startsWith('same') ? 'same_pattern' : 'cross_pattern', format: 'gym',
          session_size: sessionSize({ age: base.derived.age }, fam, base.derived.D2_profile, { template: sel.template, variant: sel.variant }, model) }
      });
      const L = buildWeekLayout(d, base.shape, base.shape.training_blocks[0], model);
      const size = d.D6_week_layout.session_size;
      for (const day of mainDays(L)) {
        const tag = `${fam}.${days}${variant ? '.' + variant : ''} ${day.weekday}`;
        assert.ok(!('minutes_limit' in day), `${tag}: no minute limit (CT-01)`);
        const counted = daySlots(day).filter((s) => s.counts_in_cap && !s.test);
        assert.ok(Number.isInteger(day.exercise_count) && day.exercise_count >= size.range[0] && day.exercise_count <= size.range[1], `${tag}: count ${day.exercise_count} in ${size.range}`);
        // (the athletic tracks size their jump / throw / sprint stations against the day's count too, R3-ATH-01)
        assert.ok(counted.length <= day.exercise_count, `${tag}: ${counted.length} exercises > ${day.exercise_count}`);
        if (R.session.exercises_per_group.exempt_families.includes(fam) || day.format === 'circuit') continue;
        const counts = {};
        for (const s of daySlots(day)) if (s.group && RES.includes(kindOf(s))) counts[s.group] = (counts[s.group] || 0) + 1;
        for (const [g, n] of Object.entries(counts)) {
          if (R.session.exercises_per_group.exempt_groups.includes(g)) continue;
          if (day.full_body) assert.ok(n <= R.session.exercises_per_group.full_body_day[1], `${tag} ${g}=${n}`);
        }
      }
    }
  }
});

test('R4-SES-02: the 8 samples - a main day holds at most its session count of exercises (warm-up, core, joint care, skill, conditioning outside)', () => {
  for (const { c, L } of allLayouts()) for (const d of mainDays(L)) {
    const counted = daySlots(d).filter((s) => s.counts_in_cap && !s.test);
    const size = c.derived.D6_week_layout.session_size;
    assert.ok(d.exercise_count <= size.range[1], `${c.name} ${d.weekday}: count ${d.exercise_count}`);
    assert.ok(counted.length <= size.range[1], `${c.name} ${d.weekday}: ${counted.length} exercises, range ${size.range}`);
  }
});

test('CT-01 / R4-SES-04: no layout carries a minute limit, a time warning or a time cut; the estimate is a number', () => {
  const retired = ['warning.long_day', 'warning.time_check', 'warning.supersets_needed', 'warning.test_day_long'];
  for (const { c, L } of allLayouts()) {
    assert.ok(!L.warnings.some((w) => retired.includes(w.key)), `${c.name}: ${L.warnings.map((w) => w.key).join(' ')}`);
    for (const d of L.days) {
      assert.ok(!('minutes_limit' in d), `${c.name} ${d.weekday}`);
      assert.ok(!d.why.some((w) => ['why.cut_time', 'why.group_two_to_four', 'why.time_fit', 'why.room_cut'].includes(w.key)), `${c.name} ${d.weekday}: ${d.why.map((w) => w.key).join(' ')}`);
      assert.ok(typeof d.est_minutes === 'number' && d.est_minutes >= 0);
    }
  }
});

test('prehab: swimmer SHOULDER_SWIMMER arm care every session (R3-ATH-01, B2); 52-year-old pickleball: PREHAB_LOWER each leg day + arm care', () => {
  const sw = layoutOf(byName('01-swimming'));
  const arm = sw.days.filter((d) => daySlots(d).some((s) => s.bucket === 'RECOVERY_ARM_CARE'));
  const SS = R.prehab.by_injury_code.SHOULDER_SWIMMER;
  // COACH-R3 R3-ATH-01 (approved): a swimmer's shoulder care runs every main session (1 set each, never cut for time); without
  // the B2 rule it is the v1.2 twice a week on pull days, never a third rear-delt exercise
  if (SS.each_session) assert.deepEqual(arm.map((d) => d.weekday), mainDays(sw).map((d) => d.weekday));
  else assert.equal(arm.length, SS.per_week);
  for (const d of arm) {
    const s = daySlots(d).find((x) => x.bucket === 'RECOVERY_ARM_CARE');
    assert.equal(s.block, 'prehab'); assert.equal(s.counts_in_cap, false); assert.equal(s.origin, 'prehab_added');
    if (SS.each_session) { assert.equal(s.default_sets, SS.each_session_sets); assert.ok(s.why.some((w) => w.key === 'why.shoulder_care_each_session')); }
  }
  const pb = layoutOf(byName('08-pickleball-genpop'));
  // v0.5 fix round 1 (R4-SES-02 / VOL-17 / sample 08 majors: a calf raise as joint care next to a dropped calf slot, a home leg
  // extension as knee care on the hip day): the care lives in the template's own lift where the day holds one - the slot carries
  // `care_code` (rules.prehab.x1.in_template_slot) - and an extra joint-care station is placed only on a day without it
  const lowerCare = (s) => s.bucket === 'PREHAB_LOWER' || (!!s.care_code && ['ISO_CALF', 'ISO_QUAD'].includes(s.bucket));
  for (const d of mainDays(pb)) {
    assert.ok(daySlots(d).some(lowerCare), `lower joint care ${d.weekday}`);
    assert.ok(daySlots(d).some((s) => s.why.some((w) => w.key === 'why.age_50_racket' || w.key === 'why.prehab')));
    assert.ok(!(daySlots(d).some((s) => s.bucket === 'PREHAB_LOWER') && daySlots(d).some((s) => s.care_code && s.bucket === 'ISO_CALF')), `${d.weekday}: a calf slot and a calf care station`);
  }
  assert.ok(pb.days.some((d) => daySlots(d).some((s) => s.bucket === 'RECOVERY_ARM_CARE' || (!!s.care_code && s.bucket === 'ISO_SIDE_REAR_DELT'))));
  // a prehab bucket whose records are all unapproved (PREHAB_NECK: proposed only) gets no slot
  const fb = layoutOf(byName('02-football'));
  assert.ok(!fb.days.some((d) => daySlots(d).some((s) => s.bucket === 'PREHAB_NECK')));
});

test('heavy play week (3 play days) drops AP_COD with why.heavy_play; running / jumping exclusions drop their buckets', () => {
  const pb = layoutOf(byName('08-pickleball-genpop'));
  assert.ok(!pb.days.some((d) => daySlots(d).some((s) => s.bucket === 'AP_COD')));
  assert.ok(pb.why.some((w) => w.key === 'why.heavy_play'));
  const c = byName('02-football');
  const d = stubDerived('02-football', model, { exclusions: ['running', 'jumping'] });
  const L = buildWeekLayout(d, c.shape, c.shape.training_blocks[0], model);
  const buckets = new Set(L.days.flatMap(daySlots).map((s) => s.bucket));
  for (const b of ['AP_SPRINT', 'AP_COD', 'COND_SPRINT_BUYOUT', 'AP_PLYO', 'AP_JUMP_LIMITED_KNEE']) assert.ok(!buckets.has(b), b);
});

test('H12 (layout): 60+ without opt-in -> no Olympic station, plyo stations stay as landing work; with opt-in the Olympic stations return', () => {
  const c = byName('02-football');
  const older = stubDerived('02-football', model, { age: 65 });
  const L = buildWeekLayout(older, c.shape, c.shape.training_blocks[0], model);
  const slots = L.days.flatMap(daySlots);
  assert.ok(!slots.some((s) => s.bucket === 'AP_TRIPLE_EXT'));
  assert.ok(slots.filter((s) => s.bucket === 'AP_PLYO').every((s) => s.why.some((w) => w.key === 'why.older_default')));
  const optIn = stubDerived('02-football', model, { age: 65, prefs: { ...older.prefs, older_athletic_opt_in: true } });
  const L2 = buildWeekLayout(optIn, c.shape, c.shape.training_blocks[0], model);
  assert.ok(L2.days.flatMap(daySlots).some((s) => s.bucket === 'AP_TRIPLE_EXT'));
});

test('in-season block: athletic.2 in_season on the first 2 weekdays, COD dropped for a game-heavy sport', () => {
  const c = byName('02-football');
  const L = buildWeekLayout(c.derived, c.shape, { n: 2, type: 'in_season', weeks: [13, 16], stair_N: null, first_exercise_block: 4, label_key: 'plan.block_type.in_season', factor: null }, model);
  assert.equal(L.template_id, 'athletic.2'); assert.equal(L.variant, 'in_season');
  assert.deepEqual(mainDays(L).map((d) => d.weekday), ['Mon', 'Tue']);
  assert.ok(!L.days.flatMap(daySlots).some((s) => s.bucket === 'AP_COD'));
  assert.ok(L.why.some((w) => w.key === 'why.in_season'));
});

test('slots: ids, sets defaults, circuits = rounds, walks for aesthetics, priority small muscle first (ORD-04)', () => {
  for (const { c, L } of allLayouts()) {
    const ids = L.days.flatMap(daySlots).map((s) => s.slot_id);
    assert.equal(new Set(ids).size, ids.length, `${c.name}: unique slot ids`);
    for (const s of L.days.flatMap(daySlots)) {
      assert.ok(s.slot_id.startsWith(s.slot_id.split('.')[0] + '.'), s.slot_id);
      assert.equal(typeof s.default_sets, 'number');
      if (s.block === 'circuit') assert.equal(s.default_sets, R.supersets.bootcamp.stairway.rounds_start);
    }
  }
  const aes = layoutOf(byName('06-full-body-aesthetics'));
  for (const d of mainDays(aes)) assert.ok(daySlots(d).some((s) => s.role === 'cooldown' && s.text_key === 'note.walk_after'));
  for (const wd of ['Tue', 'Fri']) { // B days: the side-delt isolation (priority) opens the strength block
    const d = aes.days.find((x) => x.weekday === wd);
    const strength = d.blocks.find((b) => b.kind === 'strength');
    assert.equal(strength.slots[0].bucket, 'ISO_SIDE_REAR_DELT');
    assert.ok(strength.slots[0].why.some((w) => w.key === 'why.priority_first'));
  }
});

test('layoutForWeek: recovery -> no compound supersets / buy-outs, Orange only; test weeks mark the counted lifts; base untouched', () => {
  const c = byName('02-football');
  const base = layoutOf(c);
  const snapshot = JSON.stringify(base);
  const rec = { ...c.shape.weeks[0], block_type: 'recovery', phase: 'RECOVERY', test: null };
  const Lr = layoutForWeek(base, rec, c.derived, model);
  const slots = Lr.days.flatMap(daySlots);
  const small = ['ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF'];
  // v0.5 (CT-01; R3-SES-02 'I recommend'): supersets are a recommendation the person switches on - no session length turns them on
  assert.ok(!base.days.flatMap(daySlots).some((s) => s.superset), 'a pair is a recommendation, not on by default');
  assert.ok(base.days.flatMap(daySlots).some((s) => s.superset_eligible && !small.includes(s.bucket)), 'the template pairs stay as recommendations');
  const cOn = stubDerived('02-football', model, { prefs: { ...c.derived.prefs, supersets_for_fatigue: true } });
  const on = buildWeekLayout(cOn, c.shape, c.shape.training_blocks[0], model);
  assert.ok(on.days.flatMap(daySlots).some((s) => s.superset && !small.includes(s.bucket)), 'the preference switches the pairs on (L3)');
  const LrOn = layoutForWeek(on, rec, cOn, model);
  assert.ok(LrOn.days.flatMap(daySlots).filter((s) => s.superset).every((s) => small.includes(s.bucket)), 'recovery week: only small-isolation pairs stay paired');
  assert.ok(slots.filter((s) => s.superset).every((s) => small.includes(s.bucket)), 'only small-isolation pairs stay paired');
  assert.ok(!slots.some((s) => s.bucket === 'COND_SPRINT_BUYOUT'));
  assert.ok(slots.filter((s) => s.aerobic).every((s) => s.aerobic.colour === 'C'));
  const w1 = layoutForWeek(base, c.shape.weeks[0], c.derived, model);
  const tested = w1.days.flatMap(daySlots).filter((s) => s.test);
  assert.ok(tested.length >= 3);
  const squat = tested.find((s) => s.bucket === 'RP_BKD');
  assert.equal(squat.axial_req, 'axial'); // the heavy squat of the week carries the strength test
  assert.ok(tested.every((s) => s.test !== 'rm_3_or_work_up_to_1'), 'never a 1RM from zero');
  const mid = layoutForWeek(base, c.shape.weeks[5], c.derived, model);
  assert.equal(mid.days.flatMap(daySlots).filter((s) => s.test).length, 0, 'never mid-block (H19)');
  const end = layoutForWeek(base, c.shape.weeks[11], c.derived, model);
  assert.ok(end.days.flatMap(daySlots).some((s) => s.test === R.tests.catalogue.strength.after_completed_block.L3));
  assert.equal(JSON.stringify(base), snapshot, 'layoutForWeek must not mutate its input');
});

test('bootcamp circuit days carry the week circuit dose; estimateMinutes grows with work seconds and sets', () => {
  const c = byName('05-bootcamp');
  const base = layoutOf(c);
  const w1 = layoutForWeek(base, c.shape.weeks[0], c.derived, model);
  const w8 = layoutForWeek(base, c.shape.weeks[7], c.derived, model);
  const d1 = w1.days.find((d) => d.weekday === 'Mon');
  const d8 = w8.days.find((d) => d.weekday === 'Mon');
  // (v0.5, G-09: the rounds come from the level - 3 / 4 / 5, PRG-03 - not from the session minutes; the sample is L2)
  assert.deepEqual(d1.circuit_dose, { rounds: R.supersets.bootcamp.stairway.rounds_by_level[c.derived.D3_client_level.level], work_s: 35, transition_s: 15, between_rounds_s: 90 });
  assert.equal(d8.circuit_dose.work_s, 46); // v1.2: 35 -> 46 s by the planned steps over 8 weeks (D-19 revised)
  assert.ok(estimateMinutes(d8, null, null, model) > estimateMinutes(d1, null, null, model));
  const fb = layoutOf(byName('02-football'));
  const mon = fb.days.find((d) => d.weekday === 'Mon');
  const more = Object.fromEntries(daySlots(mon).map((s) => [s.slot_id, 5]));
  assert.ok(estimateMinutes(mon, more, null, model) > estimateMinutes(mon, null, null, model));
});

test('determinism: two builds are identical; programIdFor follows templates.program_names', () => {
  for (const c of contexts) {
    for (const tb of c.shape.training_blocks) {
      assert.equal(JSON.stringify(buildWeekLayout(c.derived, c.shape, tb, model)), JSON.stringify(buildWeekLayout(c.derived, c.shape, tb, model)), c.name);
    }
    assert.equal(programIdFor(c.derived, model), EXPECT[c.name].program, c.name);
  }
});
