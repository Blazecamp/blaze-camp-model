// Blaze Camp engine 0.7 - templates, selection, athletic progression and WODs (coach answers round 5, coach_answers_round5.md): one
// test per rule the package added, named with the round-5 answer it reads. Every plan here is generated in the test - no stored plan.
//   layer       tools/fixture/v07-select.mjs is pure and idempotent; every new rule section names its coach answers; EN + ES words
//   R5-GEN-01   2 days a week = two full-body days built from his slots (G-250, G-251)
//   R5-ATH-04   incline first for throwers and volleyball too, and an overhead press kept for shoulder health (G-252)
//   R5-GRD-03   jumps progress two-leg low -> single-leg higher; no single-leg hurdle hop in the first block (G-253)
//   R5-ATH-10   a cutting sport keeps a lateral or single-leg jump every training day, two-foot lateral first (G-254)
//   R5-GRD-08   knee pain: assisted jumps first, the pain-scale line (G-255)
//   R5-ATH-02   athletic doses hold at most 2 weeks and reach the block's final number (G-256)
//   R5-GRD-04   named benchmark workouts in the class workout (G-257, G-258)
//   R5-GRD-05   the bootcamp's two formats (G-259)
//   confirmations R5-LIB-01 / 02, R5-CLS-01 / 02 / 04 / 06, R5-ATH-05 / 08 / 09 / 10 / 11 (G-262)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { jumpLevel } from '../engine/select.mjs';
import { amendRulesV07, amendTemplatesV07, amendExerciseV07, addedExercisesV07, UI_V07, ADDED_V07 } from '../tools/fixture/v07-select.mjs';

const clone = (x) => JSON.parse(JSON.stringify(x));
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };

const model = loadCompiledModel() || loadFixtureModel();
const raw = loadCompiledModel() ? readModelDir() : readFixtureRaw();
const R = model.rules;
const V7 = R.selection.v7;
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(itemsOf);
const uni = (e) => !!e && (e.laterality === 'unilateral' || e.laterality === 'alternating');
const lateral = (id) => /(^|-)(lateral|side|skater|cossack|zig-zag)(-|$)/.test(id);
const lowerJump = (x) => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(x.it.bucket) && !!ex(x.it.exercise_id) && !ex(x.it.exercise_id).athletic.upper;
const isOverhead = (e) => !!e && e.tags.includes('overhead') && !e.tags.includes('mid_range_push');
const isIncline = (e) => !!e && e.tags.includes('mid_range_push');

/** an athlete's intake from the soccer sample: sport, position, days (Mon / Wed / Fri / Tue order) */
function athlete(sport, position, days, extra = {}) {
  const i = loadSample(NAMES['03']);
  i.lang = 'en'; i.release.lang = 'en';
  i.sport.sport = sport; i.sport.position = position; i.sport.season = { type: 'no_season', date: null };
  i.plan.mode = 'fixed_12';
  const ord = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  i.schedule.days_per_week = days;
  i.schedule.weekdays = ['Mon', 'Wed', 'Fri', 'Tue'].slice(0, days).sort((a, b) => ord.indexOf(a) - ord.indexOf(b));
  if (days === 2) i.schedule.weekdays = ['Mon', 'Thu'];
  return Object.assign(i, extra);
}

describe('v0.7 selection - the amendment layer', () => {
  it('amendRulesV07 / amendTemplatesV07 / amendExerciseV07 do not change their input, are idempotent on the built model, and the compiled model carries the layer', () => {
    const fx = readFixtureRaw();
    const r0 = clone(fx.rules), t0 = clone(fx.templates.families);
    const r1 = amendRulesV07(fx.rules), t1 = amendTemplatesV07(fx.templates.families);
    assert.deepEqual(fx.rules, r0); assert.deepEqual(fx.templates.families, t0);
    assert.deepEqual(r1, fx.rules, 'the fixture already carries the layer'); assert.deepEqual(t1, fx.templates.families);
    for (const e of fx.catalog.exercises) assert.deepEqual(amendExerciseV07(e), e, e.id);
    assert.deepEqual(addedExercisesV07(fx.catalog.exercises), [], 'the added records are already there (idempotent)');
    for (const k of ['selection', 'conditioning', 'athletic', 'supersets']) assert.deepEqual(raw.rules[k].v7, fx.rules[k].v7, k);
  });
  it('every new rule section names its coach answers and says what is PROPOSED; the words are in English and Spanish', () => {
    for (const [name, sec] of [['selection.v7', V7], ['two_day_full_body', V7.two_day_full_body], ['incline_overhead', V7.incline_overhead], ['jumps', V7.jumps], ['assisted_jumps', V7.assisted_jumps],
      ['jump_pain_warning', V7.jump_pain_warning], ['named_wods', R.conditioning.v7.named_wods], ['bootcamp_format', R.supersets.v7.bootcamp_format], ['athletic.v7.hold', R.athletic.v7.hold]]) {
      assert.ok(sec && Array.isArray(sec.refs) && sec.refs.some(r => /^R5-/.test(r)), name + ': refs');
      assert.ok(typeof sec.status === 'string' && sec.status.length > 0, name + ': status');
    }
    for (const [k, v] of Object.entries(UI_V07)) { assert.equal(v.length, 2, k); assert.ok(v[0] && v[1], k); assert.equal(model.t('en', k), v[0], k); assert.equal(model.t('es', k), v[1], k); }
  });
  it('the new records: never a band, chain or releaser (H01), a YouTube search link built from the name (R4-LIB-05), an English and a Spanish name', () => {
    for (const id of ADDED_V07) {
      const e = ex(id);
      assert.ok(e, id);
      assert.ok(!/band|chain|releaser/i.test(JSON.stringify([e.id, e.equipment, e.tags, model.t('en', e.name_key)])), id);
      assert.equal(e.video.kind, 'search', id);
      assert.ok(e.video.url.startsWith('https://www.youtube.com/results?search_query='), id);
      assert.equal(decodeURIComponent(e.video.url.split('=')[1]), model.t('en', e.name_key), id);
      assert.notEqual(model.t('es', e.name_key), e.name_key, id);
    }
  });
});

describe('v0.7 selection - R5-GEN-01 two full-body days', () => {
  it('R5-GEN-01: every 2-day A / B template is two full-body days - day 1 a squat + a horizontal pull, a vertical / incline push + a single-leg hinge, biceps; day 2 a hinge + a horizontal push, a vertical pull + a lunge, triceps', () => {
    const TD = V7.two_day_full_body;
    let n = 0;
    for (const [fam, f] of Object.entries(model.templates.families)) {
      const t = f.days['2'];
      if (!t) continue;
      for (const dts of [t.day_types, ...Object.values(t.variants || {}).map(v => v.day_types)]) for (const d of Object.values(dts || {})) {
        if (!/_FB[12]$/.test(String(d.skeleton))) { assert.ok(!/_[AB]$/.test(String(d.skeleton)), `${fam}: a 2-day ${d.skeleton} day is left`); continue; }
        n++;
        const b = d.stations.map(s => s.bucket);
        const want = /FB1$/.test(d.skeleton) ? TD.day1 : TD.day2;
        for (const x of want) assert.ok(b.includes(x), `${fam} ${d.skeleton}: no ${x}`);
        const arm = /FB1$/.test(d.skeleton) ? 'ISO_BICEP' : 'ISO_TRICEP', other = /FB1$/.test(d.skeleton) ? 'ISO_TRICEP' : 'ISO_BICEP';
        if (b.includes(arm) || b.includes(other)) { assert.ok(b.includes(arm), `${fam} ${d.skeleton}: ${arm}`); assert.ok(!b.includes(other), `${fam} ${d.skeleton}: one arm a day`); }
        assert.equal(d.full_body, true);
      }
    }
    assert.ok(n >= 8, `${n} full-body day types`);
  });
  it('R5-GEN-01 / R4-SES-03 (08): the pickleball player trains two full-body days that each pair a knee lift with a pull and a hip lift with a push, and every big group holds the 2-day band (about 6-8 weekly sets) with no below-floor line', () => {
    const p = planOf('08');
    assert.equal(p.status, 'ok'); assert.equal(p.validation.ok, true);
    const mains = p.weeks[0].days.filter(d => d.kind === 'main');
    assert.deepEqual(mains.map(d => d.skeleton), ['athletic_FB1', 'athletic_FB2']);
    for (const d of mains) {
      const b = d.blocks.flatMap(x => x.items).map(it => it.bucket);
      for (const x of [['RP_BKD', 'RP_UKD'], ['RP_BHD', 'RP_UHD'], ['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']]) assert.ok(x.some(y => b.includes(y)), `${d.weekday}: ${x}`);
    }
    // over the two days: both pull and both push vectors, a two-leg and a single-leg knee and hip lift
    const wk = itemsOf(p.weeks[0]).map(x => x.it.bucket);
    for (const x of [...V7.two_day_full_body.day1, ...V7.two_day_full_body.day2]) assert.ok(wk.includes(x), x);
    for (const g of ['quads', 'hips', 'back', 'chest', 'shoulders']) {
      const v = p.summary.sets_by_group_by_week[g];
      for (const [i, x] of v.entries()) assert.ok(x >= 6 - 0.25 - EPS && x <= 8.5 + EPS, `${g} w${i + 1}: ${x}`);
    }
    assert.ok(!p.meta.warnings.some(w => w.code === 'below_floor_template'), 'no group below the 2-day band');
    assert.ok(p.meta.warnings.some(w => w.code === 'two_day_rule'), 'the plan says so and suggests a third day');
  });
});

describe('v0.7 selection - R5-ATH-04 incline first, overhead kept', () => {
  it('R5-ATH-04: throwers and volleyball (2, 3 and 4 days) press incline in most exercise blocks and keep an overhead press in the plan; every plan is valid', () => {
    for (const [sp, pos] of [['baseball', 'pitcher'], ['volleyball', 'middle'], ['softball', 'infield']]) for (const days of [2, 3, 4]) {
      const p = generate(athlete(sp, pos, days), model);
      assert.equal(p.status, 'ok'); assert.equal(p.validation.ok, true, `${sp} ${days}`);
      const vp = allItems(p).filter(x => x.it.bucket === 'RP_VPUSH' && x.d.kind === 'main').map(x => ex(x.it.exercise_id));
      assert.ok(vp.some(isOverhead), `${sp} ${days}: no overhead press`);
      assert.ok(vp.some(isIncline), `${sp} ${days}: no incline press`);
      assert.ok(vp.filter(isIncline).length >= vp.filter(isOverhead).length, `${sp} ${days}: the incline press is the bias`);
    }
  });
  it('R5-ATH-04 / R3-ATH-01 (01): the swimmer keeps an overhead press in her plan next to her incline presses, never a standing or seesaw one (her hot spot)', () => {
    const p = planOf('01');
    const vp = allItems(p).filter(x => x.it.bucket === 'RP_VPUSH').map(x => ex(x.it.exercise_id));
    assert.ok(vp.some(isOverhead) && vp.some(isIncline));
    assert.ok(allItems(p).some(x => (x.it.why || []).some(y => y.key === 'why.overhead_for_health')));
  });
  it('R5-ATH-04: the chest never drops when the overhead press comes in (one vertical-push slot a week: the overhead press is the first exercise block, H21)', () => {
    for (const days of [2, 3]) {
      const p = generate(athlete('baseball', 'pitcher', days), model);
      const v = p.summary.sets_by_group_by_week.chest;
      for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] - EPS, `${days} days chest ${v.join(' ')}`);
      const first = p.weeks.filter(w => w.exercise_block === 1).flatMap(itemsOf).filter(x => x.it.bucket === 'RP_VPUSH');
      assert.ok(first.every(x => isOverhead(ex(x.it.exercise_id))), `${days}: block 1 is the overhead press`);
    }
  });
});

describe('v0.7 selection - R5-GRD-03 / R5-ATH-10 the jump progression', () => {
  it('R5-GRD-03: no single-leg hurdle hop is a pick of a plan\'s first exercise block (every sample, every sport)', () => {
    const bad = (x) => x.w.exercise_block === 1 && lowerJump(x) && uni(ex(x.it.exercise_id)) && (/hurdle/.test(x.it.exercise_id) || ex(x.it.exercise_id).tags.includes('hurdle_hop'));
    for (const n of Object.keys(NAMES)) assert.ok(!allItems(planOf(n)).some(bad), n);
    for (const [sp, pos] of [['soccer', 'midfielder'], ['basketball', null], ['tennis', null], ['american_football', 'WR']]) {
      const p = generate(athlete(sp, pos, 3), model);
      assert.equal(p.status, 'ok', sp);
      assert.ok(!allItems(p).some(bad), sp);
    }
  });
  it('R5-GRD-03 (03, 02): the first block jumps on two feet and low first, single-leg work comes later, and the highest level climbs block by block', () => {
    for (const n of ['02', '03']) {
      const p = planOf(n);
      const byEb = new Map();
      for (const x of allItems(p).filter(lowerJump)) {
        const lv = jumpLevel(ex(x.it.exercise_id), V7.jumps);
        const e = byEb.get(x.w.exercise_block) || [];
        e.push(lv); byEb.set(x.w.exercise_block, e);
      }
      const ebs = [...byEb.keys()].sort((a, b) => a - b);
      assert.ok(byEb.get(1).every(l => l <= 2), `${n} block 1: ${byEb.get(1)}`);
      const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
      assert.ok(mean(byEb.get(1)) < 1.6, `${n}: block 1 leans low (${mean(byEb.get(1))})`);
      for (let i = 1; i < ebs.length; i++) assert.ok(Math.max(...byEb.get(ebs[i])) >= Math.max(...byEb.get(ebs[i - 1])), `${n} block ${ebs[i]}`);
      assert.ok(Math.max(...byEb.get(ebs[ebs.length - 1])) >= 3, `${n}: single-leg by the last block`);
    }
  });
  it('R5-ATH-10 (03): a cutting sport holds a lateral or single-leg jump on every training day that jumps; in the first stage it lands on two feet', () => {
    const p = planOf('03');
    for (const w of p.weeks) for (const d of w.days.filter(d => d.kind === 'main')) {
      const js = itemsOf(w).filter(x => x.d === d && lowerJump(x));
      if (!js.length) continue;
      assert.ok(js.some(x => lateral(x.it.exercise_id) || uni(ex(x.it.exercise_id))), `w${w.n} ${d.weekday}: ${js.map(x => x.it.exercise_id)}`);
      if (w.exercise_block === 1) for (const x of js.filter(x => lateral(x.it.exercise_id))) assert.equal(ex(x.it.exercise_id).laterality, 'bilateral', x.it.exercise_id);
    }
  });
});

describe('v0.7 selection - R5-GRD-08 knee pain: assisted jumps and the pain scale', () => {
  it('R5-GRD-08 (08): the first exercise block\'s jumps are assisted (holding a support), body-weight jumps come after; nobody without knee pain gets an assisted jump', () => {
    const p = planOf('08');
    const js = allItems(p).filter(lowerJump);
    assert.ok(js.length > 0);
    for (const x of js) {
      const a = ex(x.it.exercise_id).tags.includes('assisted');
      if (x.w.exercise_block <= V7.assisted_jumps.assisted_blocks) assert.ok(a, `w${x.w.n} ${x.it.exercise_id}`);
      else assert.ok(!a, `w${x.w.n} ${x.it.exercise_id}`);
    }
    for (const n of ['01', '02', '03', '04', '05', '06', '07']) assert.ok(!allItems(planOf(n)).some(x => ex(x.it.exercise_id) && ex(x.it.exercise_id).tags.includes('assisted') && lowerJump(x)), n);
  });
  it('R5-GRD-08: the plan says to skip the jumps when the pain is above 6 on a 1-10 scale (10 = you need a hospital), in English and Spanish; a plan with no pain does not', () => {
    const p = planOf('08');
    const w = p.meta.warnings.find(x => x.code === 'jump_pain_scale');
    assert.ok(w);
    assert.deepEqual(w.args, { above: 6, max: 10 });
    const en = renderPlan(p, model, { lang: 'en' }), es = renderPlan(p, model, { lang: 'es' });
    assert.ok(en.includes('above 6 on a scale of 1 to 10 (10 = you need a hospital)'), 'EN');
    assert.ok(es.includes('por encima de 6 en una escala del 1 al 10 (10 = necesitas ir al hospital)'), 'ES');
    for (const n of ['01', '02', '03']) assert.ok(!planOf(n).meta.warnings.some(x => x.code === 'jump_pain_scale'), n);
  });
  it('R5-GRD-08: a soccer player with knee pain starts assisted too (rack, rail or suspension trainer; never a band)', () => {
    const p = generate(athlete('soccer', 'midfielder', 3, { pain: [{ area: 'knee', side: 'left', severity: 'moderate', worse_with: [] }] }), model);
    assert.equal(p.status, 'ok');
    const first = allItems(p).filter(x => x.w.exercise_block === 1 && lowerJump(x));
    assert.ok(first.length > 0 && first.every(x => ex(x.it.exercise_id).tags.includes('assisted')), first.map(x => x.it.exercise_id).join(' '));
  });
});

describe('v0.7 selection - R5-ATH-02 athletic holds', () => {
  it('R5-ATH-02 (01, 02, 03): jumps, throws, cuts and sprint metres hold at most 2 weeks inside a training block and its last stairway week is its highest', () => {
    const H = R.athletic.v7.hold;
    assert.equal(H.max_hold_weeks, 2);
    for (const n of ['01', '02', '03']) {
      const p = planOf(n);
      for (const tb of p.shape.training_blocks) {
        const ws = p.weeks.filter(w => w.training_block === tb.n && w.block_type === 'stairway' && w.athletic_budget && !w.athletic_budget.hold);
        if (ws.length < 4) continue;
        for (const [fam, keys] of Object.entries(H.families)) {
          const v = ws.map(w => keys.reduce((a, k) => a + (w.athletic_budget.planned[k] || 0), 0));
          if (!v.some(x => x > 0)) continue;
          let run = 1, best = 1;
          for (let i = 1; i < v.length; i++) { run = Math.abs(v[i] - v[i - 1]) < EPS ? run + 1 : 1; best = Math.max(best, run); }
          assert.ok(best <= H.max_hold_weeks + 1, `${n} ${fam}: ${v.join(' ')}`);
          assert.ok(v[v.length - 1] >= Math.max(...v) - EPS, `${n} ${fam}: final ${v.join(' ')}`);
        }
      }
    }
  });
});

describe('v0.7 selection - R5-GRD-04 named benchmark workouts', () => {
  const named = (w) => itemsOf(w).filter(x => x.it.wod && x.it.wod.named);
  it('R5-GRD-04 (04): a "Girl" workout every week, a "Hero" once a block, a popular benchmark every 2-4 weeks, the rest the engine\'s own WODs', () => {
    const p = planOf('04');
    assert.equal(p.validation.ok, true);
    let last = 0, benches = 0;
    for (const w of p.weeks) {
      const k = named(w).map(x => x.it.wod.named.kind);
      assert.equal(k.filter(x => x === 'girl').length, 1, `w${w.n}: ${k}`);
      if (k.includes('benchmark')) { assert.ok(w.n - last <= 4, `w${w.n}: ${w.n - last} weeks since the last benchmark`); last = w.n; benches++; }
      assert.ok(itemsOf(w).some(x => x.it.wod && !x.it.wod.named), `w${w.n}: the rest varied`);
    }
    assert.ok(benches >= 2, `${benches} benchmarks in ${p.weeks.length} weeks`);
    for (const tb of p.shape.training_blocks) assert.equal(p.weeks.filter(w => w.training_block === tb.n).flatMap(named).filter(x => x.it.wod.named.kind === 'hero').length, 1, `block ${tb.n}`);
    const girls = p.weeks.flatMap(named).filter(x => x.it.wod.named.kind === 'girl').map(x => x.it.wod.named.id);
    assert.ok(new Set(girls).size >= Math.min(girls.length, 6), `varied: ${girls}`);
  });
  it('R5-GRD-04: each named workout is scaled for the class member - every movement is in the kit and the age rules, no counted heavy squat or hinge (H07), wall balls at most 20 lb (H11), never a muscle set (H09)', () => {
    const p = planOf('04');
    for (const x of p.weeks.flatMap(named)) {
      const W = x.it.wod;
      assert.equal(W.named.scaled, true);
      assert.equal(W.stations.length, W.station_reps.length);
      for (const id of W.stations) { const e = ex(id); assert.ok(e, id); assert.notEqual(e.spine_class, 'counted', id); }
      if (x.it.load && x.it.load.type === 'medball_lb') assert.ok(x.it.load.max <= R.medball.max_lb);
      assert.deepEqual(x.it.credits || {}, {});
      assert.ok((x.it.notes || []).some(n => n.key === 'note.wod_named_' + W.named.kind));
    }
    const en = renderPlan(p, model, { lang: 'en' });
    assert.match(en, /Today's WOD is "[A-Z][A-Za-z ]+", a "Girl" benchmark workout/);
    assert.match(en, /a "Hero" workout from the CrossFit community/);
  });
  it('R5-GRD-04: the library holds Girl, Hero and other benchmark workouts with their standard prescriptions and names; HYROX is not a class workout', () => {
    const NW = R.conditioning.v7.named_wods;
    for (const k of ['girl', 'hero', 'benchmark']) assert.ok(NW.library.filter(w => w.kind === k).length >= 3, k);
    for (const w of NW.library) { assert.ok(w.name && model.has('en', 'wod.named.' + w.id + '.std'), w.id); for (const m of w.movements) assert.ok(m.ids.every(id => model.hasEx(id)), `${w.id}: ${m.ids}`); }
    assert.match(NW.status, /PROPOSED/);
  });
});

describe('v0.7 selection - R5-GRD-05 the bootcamp\'s two formats', () => {
  it('R5-GRD-05 (05): every week holds a day in rounds and a day station by station, each block flips them, and the plan says which (EN + ES)', () => {
    const p = planOf('05');
    assert.equal(p.validation.ok, true);
    const fmtOf = (w) => w.days.filter(d => d.kind === 'main').map(d => (d.blocks.flatMap(b => b.items).find(it => it.circuit) || {}).circuit).filter(Boolean).map(c => c.format);
    for (const w of p.weeks) { const f = fmtOf(w); assert.ok(f.includes('rounds') && f.includes('stations'), `w${w.n}: ${f}`); }
    const ebs = [...new Set(p.weeks.map(w => w.exercise_block))];
    if (ebs.length > 1) assert.notDeepEqual(fmtOf(p.weeks.find(w => w.exercise_block === ebs[0])), fmtOf(p.weeks.find(w => w.exercise_block === ebs[1])));
    assert.ok(p.meta.warnings.some(w => w.code === 'bootcamp_format'));
    const en = renderPlan(p, model, { lang: 'en', view: 'week', weeks: [1] }), es = renderPlan(p, model, { lang: 'es', view: 'week', weeks: [1] });
    assert.ok(en.includes('In rounds: go through every station once') && en.includes('Station by station: do all'), 'EN');
    assert.ok(es.includes('En rondas:') && es.includes('Estación por estación:'), 'ES');
    assert.match(en, /\d sets x \d+ s/, 'a station day reads sets');
  });
});

describe('v0.7 selection - round-5 confirmations written into the data', () => {
  it('R5-LIB-01 / R5-ATH-05 / R5-ATH-09 / R5-ATH-10 / R5-ATH-11 / R5-CLS-06: the rules they confirm carry the coach\'s answer', () => {
    for (const [sec, id] of [[R.selection.x2.small_kit_rows, 'R5-LIB-01'], [R.placement.x1.eve_of_game, 'R5-ATH-05'], [R.selection.s6.olympic_safe, 'R5-ATH-09'], [R.selection.s6.jumps, 'R5-ATH-10'],
      [R.conditioning.s6.hard_eve, 'R5-ATH-11'], [R.selection.s6.circuit_cardio_first, 'R5-CLS-06']]) {
      assert.ok(sec.refs.includes(id), id); assert.match(sec.status, new RegExp('approved \\(COACH-R5 ' + id));
    }
    assert.deepEqual(R.selection.x2.small_kit_rows.ids, ['bent-over-db-or-kb-row-two-arm', 'chest-supported-row']);
  });
  it('R5-LIB-02 / R5-ATH-08: the low-back core picks are dead bugs, bird dogs, side planks and the Pallof press, and only with reported low-back pain at any age', () => {
    for (const id of ['dead-bugs', 'bird-dogs', 'side-plank-elbow', 'pallof-press']) assert.ok(R.selection.x2.core_primary.low_back_allow_ids.includes(id), id);
    assert.equal(R.selection.s6.core.hotspot_list_from_age, null);
    assert.equal(R.selection.s6.core.low_back_list_only_with_pain, true);
  });
  it('R5-CLS-01: the class\'s clean + pull day holds the lunge; R5-CLS-04: wall balls and sled pushes are on in the class workout, with a switch', () => {
    const t4 = model.templates.families.hybrid_crossfit.days['4'];
    const dts = [t4.day_types, ...Object.values(t4.variants || {}).map(v => v.day_types)].flatMap(x => Object.values(x || {}));
    const cleanDays = dts.filter(x => /clean/i.test(x.label || '') && x.stations.some(s => s.bucket === 'RP_HPULL' || s.bucket === 'RP_VPULL'));
    assert.ok(cleanDays.length > 0);
    for (const d of cleanDays) assert.ok(d.stations.some(s => s.bucket === 'RP_UKD'), d.label);
    assert.ok(allItems(planOf('04')).some(x => /clean/i.test(x.d.day_type || '') && x.it.bucket === 'RP_UKD') || allItems(planOf('04')).some(x => x.d.weekday === 'Fri' && x.it.bucket === 'RP_UKD'), '04: the lunge is in the plan on the clean day');
    const pe = R.selection.addons.primary_exceptions.find(x => x.bucket === 'COND_WOD');
    assert.equal(pe.enabled, true); assert.ok(pe.refs.includes('R5-CLS-04'));
  });
  it('R5-CLS-02 (05): with no pull-up bar the bootcamp\'s free pull-up station is a hip thrust or bridge, and the push / pull check accepts that one-station lead', () => {
    const p = planOf('05');
    const free = allItems(p).filter(x => (x.it.why || []).some(y => y.key === 'why.circuit_free_station_hips'));
    assert.ok(free.length > 0);
    for (const x of free) assert.match(x.it.exercise_id, /hip-thrust|bridge/);
    assert.ok(p.validation.checks.find(c => c.id === 'V29').pass);
  });
});
