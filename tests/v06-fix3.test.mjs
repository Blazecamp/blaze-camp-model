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
  // (converted in the round-7 fix round, G-221 / G-223: the training days hold the shoulders inside the band, so they take no bonus - the
  // optional day's fly is gone and the shoulders' final sets are what Monday and Thursday hold)
  it('08: the shoulders take no bonus - their final sets are what the training days hold, inside the band, never above it', () => {
    const p = planOf('08');
    const st = p.meta.stairway[0];
    assert.ok(!(st.bonus || []).some(b => b.group === 'shoulders') && !(st.main_bonus || []).some(b => b.group === 'shoulders'));
    const fin = st.group_top.shoulders;
    const last = p.weeks[p.weeks.length - 1];
    assert.ok(Math.abs(last.main_sets_by_group.shoulders - last.weekly_sets_by_group.shoulders) < EPS, 'every shoulder set on the training days');
    assert.ok(last.weekly_sets_by_group.shoulders >= fin - EPS && last.weekly_sets_by_group.shoulders < fin + 1 - EPS, 'final ' + fin + ' vs ' + last.weekly_sets_by_group.shoulders);
    assert.ok(fin <= R.volume.two_day.weekly_sets[1], 'inside the 2-day band');
    const ws = p.weeks.map(w => w.weekly_sets_by_group.shoulders);
    ws.slice(1).forEach((v, i) => assert.ok(v >= ws[i] - EPS, 'never down'));
  });
  it('08: no "skip that day" line for the shoulders (nothing of theirs sits on the optional day), EN and ES; no "shoulders ends" anywhere', () => {
    for (const lang of ['en', 'es']) {
      const md = unesc(mdOf('08', lang));
      assert.ok(!md.split('\n').some(l => l.startsWith('- ' + t(lang, 'group.shoulders') + ':') && (l.includes('optional day') || l.includes('día opcional'))), lang);
      assert.ok(!/shoulders ends|hombros termina/.test(md), lang);
    }
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
        // (G-222: a group whose bonuses sit on an optional day and a training day is named by the training-day line)
        for (const g of onOpt) if (typeof (rec.group_top || {})[g] === 'number') assert.ok(md.split('\n').some(l => l.startsWith('- ' + t('en', 'group.' + g) + ':') && /final sets sit on (your optional day|a bonus exercise|bonus exercises)/.test(l)), n + ' ' + g);
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
  // (converted in the round-7 fix round, G-219: every chest press at its cap of 4 holds 12; a 2-set bonus would take chest to 14, above its
  // final 13 - so chest is held at 12 of 13 and the plan says so, with no fly)
  it('02: Tuesday\'s incline press never out-sets the bench press; chest holds 12 of 13 on its presses, said, with no bonus', () => {
    const p = planOf('02');
    const bench = series(p, 'Tue.B1.s08'), incline = series(p, 'Tue.B1.s10');
    const tests = p.weeks.map(w => itemsOf(w).filter(x => x.it.slot_id === 'Tue.B1.s08.test').length);
    incline.forEach((v, i) => assert.ok(v <= bench[i] + tests[i], 'week ' + (i + 1) + ': incline ' + v + ' bench ' + bench[i]));
    assert.ok(Math.max(...incline) <= R.placement.x3.athlete_press_max.max);
    const st = p.meta.stairway[0];
    assert.equal(st.group_top.chest, 12);
    assert.ok((st.capped || []).some(c => c.group === 'chest' && c.held === 12 && c.planned === 13), 'capped and said');
    assert.ok(unesc(mdOf('02')).includes(t('en', 'warning.capped_by_template', { group: t('en', 'group.chest'), held: 12, planned: 13 }).slice(0, 30)));
    for (const w of p.weeks) assert.ok(!itemsOf(w).some(x => x.it.origin === 'bonus' && groupOfEx(x.it.exercise_id) === 'chest'), 'no chest bonus, week ' + w.n);
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

// ---- engine 0.6 fix round on the round-7 coach-eye reviews (reviews/coach-eye-r7/02-football.md M1, 08-pickleball-genpop.md M1):
// one rule for every bonus exercise of a group (rules.placement.x3.bonus_last; DECISIONS G-217..G-224). The caps are re-derived here
// from the rules (level top, a training day's isolation 3 / 4 in the hardest weeks, an optional-day Focus slot, the athlete's press cap
// with later_capped, the 2-day arm slot, the physique first week) - independent of engine/volume.mjs. A tested lift counts its test set.
const X1 = R.placement.x1 || {}, X2 = R.placement.x2 || {}, X3 = R.placement.x3 || {};
const BL = X3.bonus_last || {};
const isGroupBonus = (it) => it.origin === 'bonus' && !(BL.template_whys || []).includes(((it.why || [])[0] || {}).key);
function bonusRows(p, w) {
  const rows = [];
  for (const d of w.days) {
    const items = d.blocks.flatMap(b => b.items.map(it => ({ it, b })));
    for (const { it, b } of items) {
      if (!it.exercise_id || typeof it.sets !== 'number' || it.sets <= 0 || it.role === 'test') continue;
      // (the group the item's own credits give it - joint care counts no sets, rules.prehab)
      const cr = it.credits || {};
      const full = R.muscles.groups.order.filter(g2 => (R.muscles.groups.members[g2] || []).some(m => (cr[m] || 0) >= 1 - EPS));
      const g = it.group && full.includes(it.group) ? it.group : full[0];
      if (!g || g === 'calves' || (ex(it.exercise_id) || {}).is_athletic) continue;
      const test = items.find(x => x.it.role === 'test' && x.it.slot_id === it.slot_id + '.test');
      rows.push({ d, b, it, g, sets: it.sets + (test && typeof test.it.sets === 'number' ? test.it.sets : 0), bonus: isGroupBonus(it), e: ex(it.exercise_id) });
    }
  }
  return rows;
}
function capOf(p, w, N, r, rows) {
  let cap = R.placement.max_sets_per_exercise[p.meta.level.client];
  const main = r.d.kind === 'main', iso = r.e.exercise_class === 'isolation';
  if (main && iso && X1.iso_main_day_max && r.it.origin !== 'bonus') { const M = X1.iso_main_day_max; cap = Math.min(cap, w.phase === M.phase || (X2.iso_fourth_from_share && w.stair_week > N * X2.iso_fourth_from_share + EPS) ? M.hardest : M.default); }
  if (!main && r.it.origin === 'template' && (r.it.role === 'focus' || r.it.bucket === 'FOCUS')) cap = Math.min(cap, R.placement.optional_focus.sets[1]);
  const AP = X3.athlete_press_max;
  if (AP && AP.families.includes(p.meta.family)) {
    const many = rows.filter(x => x.g === r.g).length >= (AP.min_group_exercises || 0);
    const held = (x) => AP.credit_classes.includes(x.e.credit_class) && !(x.e.tags || []).some(tg => (AP.not_tags || []).includes(tg));
    if (many && held(r)) cap = Math.min(cap, AP.max);
    if (many && AP.later_capped && main && r.it.origin !== 'bonus') { const day = rows.filter(x => x.d === r.d && x.g === r.g && x.it.origin !== 'bonus'); if (day.length && day[0] !== r && held(day[0])) cap = Math.min(cap, AP.max); }
  }
  if (p.meta.two_day && main && X3.two_day_arm_slot && X3.two_day_arm_slot.groups.includes(r.g)) cap = Math.min(cap, X3.two_day_arm_slot.sets[1]);
  const SM = X3.start_max_sets;
  if (SM && w.stair_week === 1 && SM.families.includes(p.meta.family)) cap = Math.min(cap, iso || r.it.origin === 'bonus' ? SM.isolation : SM.compound);
  return Math.max(cap, r.sets);
}
const stairWeeks = (p, rec) => p.weeks.filter(w => w.training_block === rec.training_block && w.block_type === 'stairway');

describe('VOL-07 / CH5-03 (G-217, G-218, G-219): a bonus exercise opens only when its group\'s template lifts are at their tops and still short', () => {
  it('rules.placement.x3.bonus_last is on in both builds', () => {
    assert.ok(BL.enabled && BL.open_when_needed && BL.whole_bonus_only && BL.template_first && BL.first_exposure_first && BL.two_day_no_extra && BL.print_last);
    assert.deepEqual(loadFixtureModel().rules.placement.x3.bonus_last, BL);
  });
  for (const n of Object.keys(NAMES)) it(n + ': a bonus opens in an exercise block that ends with every template lift of its group at its top; its group needs it in every block it is open', () => {
    const p = planOf(n);
    for (const rec of p.meta.stairway || []) {
      if (rec.circuit) continue;
      const ws = stairWeeks(p, rec), N = ws.length;
      const rowsW = ws.map(w => bonusRows(p, w));
      for (const id of [...new Set(rowsW.flat().filter(r => r.bonus).map(r => r.it.slot_id))]) {
        const i0 = rowsW.findIndex(rows => rows.some(r => r.it.slot_id === id));
        const r0 = rowsW[i0].find(r => r.it.slot_id === id);
        const last = ws.map((w, i) => i).filter(i => ws[i].exercise_block === ws[i0].exercise_block).pop();
        const below = rowsW[last].filter(r => r.g === r0.g && !r.bonus && r.sets < capOf(p, ws[last], N, r, rowsW[last]));
        assert.deepEqual(below.map(r => r.it.exercise_id), [], n + ': ' + r0.it.exercise_id + ' opens in week ' + ws[i0].n);
        // (and every exercise block it is open in needs it: the group without it is under its number at the block's last week)
        for (const eb of new Set(ws.filter((w, i) => rowsW[i].some(r => r.it.slot_id === id)).map(w => w.exercise_block))) {
          const li = ws.map((w, i) => i).filter(i => ws[i].exercise_block === eb).pop();
          const bon = rowsW[li].filter(r => r.g === r0.g && r.bonus).reduce((a, r) => a + r.sets, 0);
          assert.ok((ws[li].weekly_sets_by_group[r0.g] || 0) - bon < ws[li].target_by_group[r0.g] - EPS, n + ' ' + r0.g + ' exercise block ' + eb + ' holds its number without its bonus');
        }
      }
    }
  });
  for (const n of Object.keys(NAMES)) it(n + ': a bonus never takes a set while a template lift of its group, on any day, is under its top', () => {
    const p = planOf(n);
    for (const rec of p.meta.stairway || []) {
      if (rec.circuit) continue;
      const ws = stairWeeks(p, rec), N = ws.length;
      const rowsW = ws.map(w => bonusRows(p, w));
      for (let i = 0; i < N; i++) for (const r of rowsW[i].filter(x => x.bonus)) {
        const prev = i > 0 ? rowsW[i - 1].find(x => x.it.slot_id === r.it.slot_id) : null;
        const fewest = r.d.kind === 'main' ? X1.main_day_extra.sets[0] : R.placement.bonus.sets[0];
        const stepped = prev ? r.sets > prev.sets : r.sets > fewest;
        if (!stepped) continue;
        const below = rowsW[i].filter(x => x.g === r.g && !x.bonus && x.sets < capOf(p, ws[i], N, x, rowsW[i]));
        assert.deepEqual(below.map(x => x.d.weekday + ' ' + x.it.exercise_id + ' ' + x.sets), [], n + ' week ' + ws[i].n + ': ' + r.it.exercise_id + ' takes a set');
      }
    }
  });
  for (const n of Object.keys(NAMES)) it(n + ': a group never goes above its final sets or its level top because of a bonus', () => {
    const p = planOf(n);
    for (const rec of p.meta.stairway || []) {
      if (rec.circuit) continue;
      const ws = stairWeeks(p, rec);
      const gs = new Set(ws.flatMap(w => bonusRows(p, w).filter(r => r.bonus).map(r => r.g)));
      for (const g of gs) for (const w of ws) {
        const v = w.weekly_sets_by_group[g] || 0;
        assert.ok(v < rec.group_top[g] + 1 - EPS, n + ' ' + g + ' week ' + w.n + ': ' + v + ' vs final ' + rec.group_top[g]);
        const line = (rec.carrier || {})[g];
        if (line && typeof (rec.cap || {})[line] === 'number') assert.ok(v < rec.cap[line] + 1 - EPS, n + ' ' + g + ' week ' + w.n + ': ' + v + ' vs top ' + rec.cap[line]);
      }
    }
  });
  it('02: no chest bonus at all; Tuesday\'s bench (the day\'s first press, the tested lift) reaches its cap of 4 and holds it, every press ends at 4', () => {
    const p = planOf('02');
    const AP = X3.athlete_press_max.max;
    const tests = p.weeks.map(w => itemsOf(w).filter(x => x.it.slot_id === 'Tue.B1.s08.test').length);
    const bench = series(p, 'Tue.B1.s08').map((v, i) => v + tests[i]), dbBench = series(p, 'Fri.B2.s08'), incline = series(p, 'Tue.B1.s10');
    const first = bench.findIndex(v => v >= AP);
    assert.ok(first >= 0 && first <= 2, 'the bench holds 4 from week ' + (first + 1));
    bench.slice(first).forEach((v, i) => assert.equal(v, AP, 'week ' + (first + i + 1)));
    assert.equal(dbBench[dbBench.length - 1], AP);
    assert.equal(incline[incline.length - 1], AP);
    assert.ok(!p.weeks.some(w => itemsOf(w).some(x => x.it.origin === 'bonus')), 'no bonus exercise in 02');
  });
  it('01: the chest fly opens with the last exercise block (week 9), after every chest press can reach 4; the back holds 20 of 21 on its rows, said', () => {
    const p = planOf('01');
    const st = p.meta.stairway[0];
    const fly = (st.main_bonus || []).find(b => b.group === 'chest');
    assert.ok(fly, 'a chest bonus on a training day');
    const s = series(p, fly.slot_id);
    const w0 = s.findIndex(v => v !== null && v > 0);
    assert.equal(p.weeks[w0].exercise_block, Math.max(...p.weeks.map(w => w.exercise_block)), 'opens with the last exercise block');
    assert.ok(!(st.main_bonus || []).some(b => b.group === 'back') && !(st.bonus || []).some(b => b.group === 'back'));
    assert.ok((st.capped || []).some(c => c.group === 'back' && c.held === 20 && c.planned === 21));
  });
});

describe('R3-VOL-03 (G-220): the same template station on the two exposures of a day type - the first exposure steps first', () => {
  for (const n of Object.keys(NAMES)) it(n + ': the second exposure\'s lift never takes a set ahead of the first\'s while the first is under its top', () => {
    const p = planOf(n);
    const stem = (d) => String(d.day_type || d.weekday).replace(/[ ]?[12]$/, '');
    const pos = (it) => String(it.station_id).split('.').slice(1).join('.');
    for (const rec of p.meta.stairway || []) {
      if (rec.circuit) continue;
      const ws = stairWeeks(p, rec), N = ws.length;
      for (let i = 1; i < N; i++) {
        const rows = bonusRows(p, ws[i]), prevRows = bonusRows(p, ws[i - 1]);
        const mains = ws[i].days.filter(d => d.kind === 'main');
        for (const a of mains) for (const b of mains) {
          if (a === b || stem(a) !== stem(b) || mains.indexOf(a) > mains.indexOf(b)) continue;
          for (const ra of rows.filter(x => x.d === a && x.it.origin === 'template')) {
            const rb = rows.find(x => x.d === b && x.it.origin === 'template' && pos(x.it) === pos(ra.it) && x.g === ra.g);
            if (!rb) continue;
            const pa = prevRows.find(x => x.it.slot_id === ra.it.slot_id), pb = prevRows.find(x => x.it.slot_id === rb.it.slot_id);
            if (!pa || !pb || pb.sets !== pa.sets || rb.sets <= pb.sets || ra.it.role === 'test') continue;
            // (Friday's lift stepped from a tie: Tuesday's took the step too, or was at its top - or a test week held it)
            assert.ok(ra.sets > pa.sets || ra.sets >= capOf(p, ws[i], N, ra, rows) || !!ws[i].test, n + ' week ' + ws[i].n + ': ' + b.weekday + ' ' + rb.it.exercise_id + ' ' + pb.sets + '->' + rb.sets + ' ahead of ' + a.weekday + ' ' + ra.it.exercise_id + ' ' + ra.sets);
          }
        }
      }
    }
  });
  it('02: Tuesday\'s bench takes its 4th set before Friday\'s DB bench', () => {
    const p = planOf('02');
    const tests = p.weeks.map(w => itemsOf(w).filter(x => x.it.slot_id === 'Tue.B1.s08.test').length);
    const bench = series(p, 'Tue.B1.s08').map((v, i) => v + tests[i]), db = series(p, 'Fri.B2.s08');
    assert.ok(bench.findIndex(v => v >= 4) < db.findIndex(v => v >= 4), bench.join(' ') + ' / ' + db.join(' '));
  });
});

describe('R4-SES-03 / CH5-03 (G-221): 2 days - a group the training days hold inside the band takes no bonus', () => {
  it('08: no bonus exercise for the shoulders; they stay inside 6-8 and never above back, chest or hips', () => {
    const p = planOf('08');
    for (const w of p.weeks) {
      assert.ok(!itemsOf(w).some(x => isGroupBonus(x.it) && groupOfEx(x.it.exercise_id) === 'shoulders'), 'week ' + w.n);
      const sh = w.weekly_sets_by_group.shoulders;
      assert.ok(sh >= R.volume.two_day.weekly_sets[0] - EPS && sh <= R.volume.two_day.weekly_sets[1] + EPS, 'week ' + w.n + ': ' + sh);
      // (whole sets, as the plan prints them: a quarter of helper credit is not a set - G-174)
      for (const g of ['back', 'chest', 'hips']) assert.ok(Math.floor(sh + EPS) <= Math.floor(w.weekly_sets_by_group[g] + EPS), 'week ' + w.n + ': shoulders ' + sh + ' above ' + g + ' ' + w.weekly_sets_by_group[g]);
    }
  });
});

describe('CH5-03 / VOL-07 (G-222): a bonus prints last in its day, says why, and the plan says how many final sets sit on it', () => {
  for (const n of Object.keys(NAMES)) it(n + ': a group\'s bonus is the last lift of its day and carries the "done last ... final number" note', () => {
    const p = planOf(n);
    for (const w of p.weeks) for (const d of w.days) {
      const seq = d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items).filter(it => it.exercise_id && (typeof it.sets !== 'number' || it.sets > 0));
      const k = seq.findIndex(isGroupBonus);
      if (k < 0) continue;
      assert.ok(seq.slice(k).every(isGroupBonus), n + ' week ' + w.n + ' ' + d.weekday);
      for (const it of seq.slice(k)) assert.ok((it.notes || []).some(x => x.key === BL.note_key), it.exercise_id);
    }
  });
  it('01: the up-front line names the chest fly, from week 9, with the final sets it carries - EN and ES', () => {
    const p = planOf('01');
    const top = p.meta.stairway[0].group_top.chest;
    const en = unesc(mdOf('01', 'en')).split('\n').find(l => l.startsWith('- ' + t('en', 'group.chest') + ':') && l.includes('bonus exercise'));
    assert.ok(en && en.includes('of its ' + top + ' final sets') && en.includes('from week 9') && en.includes('total ends at about'), en);
    const es = unesc(renderPlan(p, model, { lang: 'es' })).split('\n').find(l => l.startsWith('- ' + t('es', 'group.chest') + ':') && l.includes('ejercicio extra'));
    assert.ok(es && es.includes('desde la semana 9') && es.includes('el total de'), es);
  });
  it('every sample, EN and ES: no "<group> ends at about" / "<grupo> termina en unas" (the total ends)', () => {
    for (const n of Object.keys(NAMES)) for (const lang of ['en', 'es']) {
      const md = renderPlan(planOf(n), model, { lang });
      assert.ok(!/ (shoulders|biceps|triceps|quads|hips|calves|back|chest) ends at about/i.test(md), n + ' ' + lang);
      assert.ok(!/(hombros|bíceps|tríceps|cuádriceps|cadera|pantorrillas|espalda|pecho) termina en unas/i.test(md), n + ' ' + lang);
    }
  });
});
