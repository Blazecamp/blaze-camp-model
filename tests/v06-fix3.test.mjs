// Blaze Camp engine 0.6 - fix round on the round-6 coach-eye reviews (reviews/coach-eye-r6/02-football.md, 08-pickleball-genpop.md):
// one test per rule, named with the coach answer it reads. Every plan here is generated in the test - no stored plan is read.
// Decisions: engine/DECISIONS.md G-207..G-219.
//   R4-SES-03 / CH5-03  2 days: the shoulders hold the band on the training days; the optional-day bonus is extra and said (G-207, G-208)
//   VOL-07 / CH5-03     a later lift of a group never out-sets the day's first lift; the group reaches its final with a bonus (G-209)
//   R4-LIB-04           the weekly table's legend explains only the cells it prints (G-211)
//   R4-PRG-01           a weekly number under the final sets never prints as the final sets (G-212)
//   H08                 the week at a glance counts groups by the plan's own credits (G-213)
//   R2-PER-07           a day that holds a test carries no intensifier (G-214)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';

const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const model = loadCompiledModel() || loadFixtureModel();
const R = model.rules;
const plans = new Map(), mds = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const mdOf = (n, lang = 'en') => { const k = n + lang; if (!mds.has(k)) mds.set(k, renderPlan(planOf(n), model, { lang })); return mds.get(k); };
const unesc = (s) => s.replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1');
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const series = (p, slotId) => p.weeks.map(w => { const x = itemsOf(w).find(y => y.it.slot_id === slotId && y.it.role !== 'test'); return x ? x.it.sets : null; });
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const groupOfEx = (id) => { const e = ex(id); if (!e) return null; const cr = e.credits || {}; return R.muscles.groups.order.find(g => (R.muscles.groups.members[g] || []).some(m => (cr[m] || 0) >= 1 - EPS)) || null; };
const t = (lang, k, a) => model.t(lang, k, a);

describe('R4-SES-03 / CH5-03 (G-207, G-208): 2 days - the shoulders hold the band on the training days, the optional day is extra', () => {
  it('08: Monday + Thursday hold at least 6 shoulder sets every week; the face pull holds 3+ sets from week 1', () => {
    const p = planOf('08');
    assert.ok(R.placement.x3.two_day_main_floor.also_groups.includes('shoulders'));
    for (const w of p.weeks) assert.ok(w.main_sets_by_group.shoulders >= R.volume.two_day.weekly_sets[0] - EPS, 'week ' + w.n + ': ' + w.main_sets_by_group.shoulders);
    const fp = itemsOf(p.weeks[0]).find(x => x.d.kind === 'main' && groupOfEx(x.it.exercise_id) === 'shoulders' && x.it.origin !== 'bonus');
    assert.ok(fp && fp.it.sets >= 3, 'the training-day shoulder exercise holds 3+ sets in week 1');
    // the big groups keep the band, the arms keep slot 5's 2-3 sets (G-200)
    for (const w of p.weeks) for (const g of ['quads', 'hips', 'back', 'chest']) assert.ok(w.main_sets_by_group[g] >= 6 - EPS, g + ' week ' + w.n);
    for (const w of p.weeks) for (const { it } of itemsOf(w)) if (['biceps', 'triceps'].includes(groupOfEx(it.exercise_id)) && typeof it.sets === 'number') assert.ok(it.sets >= 2 && it.sets <= 3, it.exercise_id + ' ' + it.sets);
  });
  it('08: the optional-day bonus is extra - the shoulders climb to their final sets, never above them, and arrive at the end', () => {
    const p = planOf('08');
    const st = p.meta.stairway[0];
    assert.ok((st.bonus || []).some(b => b.group === 'shoulders'));
    const fin = st.group_top.shoulders;
    const last = p.weeks[p.weeks.length - 1];
    assert.ok(last.weekly_sets_by_group.shoulders >= fin - EPS && last.weekly_sets_by_group.shoulders < fin + 1 - EPS, 'final ' + fin + ' vs ' + last.weekly_sets_by_group.shoulders);
    assert.ok(last.main_sets_by_group.shoulders < fin - EPS, 'the final depends on the optional day');
    const ws = p.weeks.map(w => w.weekly_sets_by_group.shoulders);
    ws.slice(1).forEach((v, i) => assert.ok(v >= ws[i] - EPS, 'never down'));
    assert.ok(ws[0] < fin - EPS, 'the shoulders climb');
  });
  it('08: the "skip that day" line prints for the shoulders, EN and ES, with what the training days hold', () => {
    const p = planOf('08');
    const fin = p.meta.stairway[0].group_top.shoulders;
    const last = p.weeks[p.weeks.length - 1];
    const en = unesc(mdOf('08', 'en')).split('\n').find(l => l.startsWith('- ' + t('en', 'group.shoulders') + ':') && l.includes('optional day'));
    assert.ok(en, 'EN line');
    assert.ok(en.includes('of its ' + fin + ' final sets') && en.includes('Skip that day'), en);
    const about = Number(/about (\d+)/.exec(en)[1]);
    assert.ok(Math.abs(about - last.main_sets_by_group.shoulders) <= 0.5 + EPS && about >= 6, en);
    const es = unesc(mdOf('08', 'es')).split('\n').find(l => l.startsWith('- ' + t('es', 'group.shoulders') + ':') && l.includes('día opcional'));
    assert.ok(es && es.includes('Si te saltas ese día'), 'ES line');
  });
  it('every sample: a group whose final sets hold an optional day\'s bonus exercise is named up front (not only big groups)', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      const md = unesc(mdOf(n));
      for (const rec of p.meta.stairway || []) {
        const ws = p.weeks.filter(w => w.training_block === rec.training_block && w.block_type === 'stairway');
        const last = ws[ws.length - 1];
        if (!last) continue;
        const onOpt = new Set(last.days.filter(d => d.kind === 'optional').flatMap(d => d.blocks.flatMap(b => b.items)).filter(i => i.origin === 'bonus' && i.sets > 0).map(i => i.group));
        for (const g of onOpt) if (typeof (rec.group_top || {})[g] === 'number') assert.ok(md.split('\n').some(l => l.startsWith('- ' + t('en', 'group.' + g) + ':') && /final sets sit on your optional day/.test(l)), n + ' ' + g);
      }
    }
  });
});

describe('VOL-07 / CH5-03 (G-209): the day\'s first lift of a group leads it; the group still reaches its final sets', () => {
  it('every sample, every week: a later lift of a group on a training day never holds more sets than the day\'s first lift of that group', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
        const its = d.blocks.flatMap(b => b.items).filter(i => typeof i.sets === 'number' && i.sets > 0 && i.exercise_id);
        const lifts = its.filter(i => i.role !== 'test' && ex(i.exercise_id) && !ex(i.exercise_id).is_athletic);
        const firstOf = new Map();
        for (const i of lifts) {
          const g = groupOfEx(i.exercise_id);
          if (!g) continue;
          if (!firstOf.has(g)) { firstOf.set(g, i.sets + its.filter(x => x.role === 'test' && x.exercise_id === i.exercise_id).length); continue; }
          assert.ok(i.sets <= firstOf.get(g), n + ' week ' + w.n + ' ' + d.weekday + ' ' + g + ': ' + i.exercise_id + ' ' + i.sets + ' > ' + firstOf.get(g));
        }
      }
    }
  });
  it('02: Tuesday\'s incline press never out-sets the bench press; the chest still reaches 13 (a training-day bonus, CH5-03)', () => {
    const p = planOf('02');
    const bench = series(p, 'Tue.B1.s08'), incline = series(p, 'Tue.B1.s10');
    const tests = p.weeks.map(w => itemsOf(w).filter(x => x.it.slot_id === 'Tue.B1.s08.test').length);
    incline.forEach((v, i) => assert.ok(v <= bench[i] + tests[i], 'week ' + (i + 1) + ': incline ' + v + ' bench ' + bench[i]));
    assert.ok(Math.max(...incline) <= R.placement.x3.athlete_press_max.max);
    const st = p.meta.stairway[0];
    assert.equal(st.group_top.chest, 13);
    assert.ok(!(st.capped || []).some(c => c.group === 'chest'), 'not capped');
    assert.ok(p.weeks[p.weeks.length - 1].weekly_sets_by_group.chest >= 13 - EPS);
    // the bonus is the extra: it never holds more than a template chest lift of its day, and takes no step before they are full
    const tue = p.weeks[p.weeks.length - 2].days.find(d => d.weekday === 'Tue').blocks.flatMap(b => b.items);
    const bonus = tue.filter(i => i.origin === 'bonus' && groupOfEx(i.exercise_id) === 'chest');
    assert.equal(bonus.length, 1);
  });
  it('CH5-03: a training day\'s bonus exercise never repeats a compound pattern the day before trained', () => {
    const NR = R.placement.x3.bonus_no_repeat_previous_day;
    const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
        const prev = w.days.find(x => x.weekday === WD[(WD.indexOf(d.weekday) + 6) % 7] && x.kind === 'main');
        if (!prev) continue;
        const pats = new Set(prev.blocks.flatMap(b => b.items).filter(i => i.sets > 0 && ex(i.exercise_id)).map(i => ex(i.exercise_id).pattern));
        for (const i of d.blocks.flatMap(b => b.items).filter(x => x.origin === 'bonus' && ex(x.exercise_id))) {
          const pat = ex(i.exercise_id).pattern;
          assert.ok(!(NR.compound_patterns.includes(pat) && pats.has(pat)), n + ' week ' + w.n + ' ' + d.weekday + ' ' + i.exercise_id);
        }
      }
    }
  });
});

describe('R4-LIB-04 (G-211): the weekly table legend explains only what the table prints', () => {
  for (const n of Object.keys(NAMES)) it(n + ': no "-" legend without a "-" row; the "(n direct)" legend with every held row, EN and ES', () => {
    for (const lang of ['en', 'es']) {
      const md = unesc(mdOf(n, lang));
      const lines = md.split('\n');
      const h = lines.findIndex(l => l === '## ' + t(lang, 'ui.plan.weekly_sets_groups'));
      if (h < 0) continue;
      const note = lines[h + 2];
      const rows = [];
      for (let i = h + 4; i < lines.length && lines[i].startsWith('|'); i++) rows.push(lines[i]);
      const dash = rows.some(r => /\| - /.test(r) || /\| -$/.test(r.trim()));
      const direct = rows.some(r => r.includes(lang === 'en' ? ' direct)' : ' directas)'));
      assert.equal(note.includes('"-" ='), dash, n + ' ' + lang + ': ' + note);
      assert.equal(note.includes(lang === 'en' ? ' direct)" =' : ' directas)" ='), direct, n + ' ' + lang + ': ' + note);
      if (direct) {
        const m = /"(\d+) \((\d+) direct(?:as)?\)" = (\d+) .*?, (\d+) /.exec(note);
        assert.ok(m && m[1] === m[3] && m[2] === m[4], 'the legend reads the bracket as direct sets: ' + note);
      }
    }
  });
});

describe('R4-PRG-01 (G-212): a group never seems to arrive before it does', () => {
  it('every sample: a week-by-week number prints the final sets only from the week the plan reaches them', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      const md = unesc(mdOf(n));
      for (const rec of p.meta.stairway || []) {
        const ws = p.weeks.filter(w => w.training_block === rec.training_block);
        for (const g of Object.keys(rec.group_top || {})) {
          const row = md.split('\n').find(l => l.startsWith('| ' + t('en', 'group.' + g) + ' | ') && (l.match(/·/g) || []).length >= 1);
          if (!row) continue;
          const cells = row.split('|').map(x => x.trim()).filter(Boolean);
          const fin = Number(cells[cells.length - 1]);
          if (!Number.isFinite(fin)) continue;
          const nums = cells[1].split(/[ ·]+/).filter(Boolean).map(Number);
          if (nums.length !== ws.length) continue;
          nums.forEach((x, i) => { if (x >= fin) assert.ok(ws[i].weekly_sets_by_group[g] >= fin - EPS, n + ' ' + g + ' week ' + ws[i].n + ' prints ' + x + ' at ' + ws[i].weekly_sets_by_group[g]); });
        }
      }
    }
  });
  it('02: the shoulders print 12 until the week they reach 13', () => {
    const p = planOf('02');
    const row = unesc(mdOf('02')).split('\n').find(l => l.startsWith('| Shoulders | ') && l.includes('·'));
    const nums = row.split('|')[2].split(/[ ·]+/).filter(Boolean).map(Number);
    const first = p.weeks.findIndex(w => w.weekly_sets_by_group.shoulders >= 13 - EPS);
    assert.equal(nums.findIndex(x => x >= 13), first, row);
  });
});

describe('H08 (G-213): the week at a glance counts groups by the plan\'s own credits', () => {
  it('every sample: each day\'s glance counts equal the prime-mover groups of its lifts; 02 Tuesday has 2+ chest lifts and 1 shoulder lift', () => {
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const d of p.weeks[0].days) {
        for (const [g, c] of Object.entries(d.groups || {})) {
          const own = d.blocks.flatMap(b => b.items).filter(i => !['test', 'prehab'].includes(i.role) && ex(i.exercise_id) && !ex(i.exercise_id).is_athletic && groupOfEx(i.exercise_id) === g).length;
          assert.ok(own <= c, n + ' ' + d.weekday + ' ' + g + ' ' + c + ' < ' + own);
        }
      }
    }
    const tue = planOf('02').weeks[0].days.find(d => d.weekday === 'Tue');
    assert.ok(tue.groups.chest >= 2, JSON.stringify(tue.groups));
    assert.equal(tue.groups.shoulders, 1);
    assert.ok(/\| Tuesday \|[^\n]*Chest [2-9], Shoulders 1/.test(unesc(mdOf('02'))));
  });
});

describe('R2-PER-07 (G-214): a day that holds a test carries no intensifier', () => {
  it('every sample: no MYO / intensifier on a day with a test item; the last week still carries one on its non-test days', () => {
    assert.equal(R.effort.intensifiers.no_test_day, true);
    for (const n of Object.keys(NAMES)) {
      const p = planOf(n);
      for (const w of p.weeks) for (const d of w.days) {
        const its = d.blocks.flatMap(b => b.items);
        if (!its.some(i => i.role === 'test' || i.bucket === 'TEST')) continue;
        assert.ok(!its.some(i => i.effort && (i.effort.intensifier || i.effort.last_set === 'myo')), n + ' week ' + w.n + ' ' + d.weekday);
      }
    }
    // 04 tests in week 8 on some days: its Friday keeps the intensifier
    const p4 = planOf('04');
    const w8 = p4.weeks.find(w => w.is_last_stair_week) || p4.weeks[p4.weeks.length - 1];
    assert.ok(w8.days.some(d => d.blocks.flatMap(b => b.items).some(i => i.effort && i.effort.intensifier)), '04 keeps one');
  });
  it('02: the week-12 test days (Monday, Tuesday, Thursday) carry no MYO set; Friday, the B2 day without a test, keeps it (EN and ES)', () => {
    const p = planOf('02');
    const last = p.weeks[p.weeks.length - 1];
    const myoDays = last.days.filter(d => d.blocks.flatMap(b => b.items).some(i => i.effort && i.effort.intensifier)).map(d => d.weekday);
    assert.deepEqual(myoDays, ['Fri']);
    for (const lang of ['en', 'es']) {
      const md = unesc(mdOf('02', lang));
      assert.ok(md.includes(t(lang, 'effort.intensifier_days_one', { days: t(lang, 'weekday.Fri') }).split(':')[0]), lang);
    }
  });
});
