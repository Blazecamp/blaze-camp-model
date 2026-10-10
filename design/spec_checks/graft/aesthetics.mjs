// design/spec_checks/graft/aesthetics.mjs - sample 06 (full-body aesthetics, 29 years, L3, Focus glutes + side delts, 4 x 75, 12 weeks)
// written out by hand as a stage-0 instance, to answer judge 1's condition "run samples 06 and 07 through the prototype".
// Sources (read-only): model/templates.json family aesthetics, 4 days (day types A1 / B1 / A2 / B2: every station with a group, the
// minute-gated ones as later candidates, one or two extension candidates per group-day), the engine's own targets for this intake
// (samples/plans/06-full-body-aesthetics.json > meta.targets; hips = the larger of its two lines: 14 -> 23 with the glute Focus),
// rules.time_model (bilateral compound 45 + 90 s, unilateral 90 + 90, isolation 36 + 75; warm-up 480 s, core opener 330 s).
// Simplifications: the two optional days (Focus slots, calves) are left out; every pick keeps its bucket's default laterality in all
// three exercise blocks; no tests (the intake has none).
//   node design/spec_checks/graft/aesthetics.mjs [minutes] [budget]
import { mk } from '../../two-stage/proto/samples.mjs';
import { dayTime, blockSel, blockOfWeek } from '../../two-stage/proto/core.mjs';
import { placeBlock } from '../../two-stage/proto/stage2.mjs';
import { planEndpoints } from './stage1.mjs';
import { show } from './run.mjs';

const c = (sid, cls, kind, extra = {}) => ({ sid, cls, kind, ...extra });
export function aesthetics(o = {}) {
  const minutes = o.minutes ?? 75, hi = 5, ih = 4, N = 12;
  const fixed = 480 + 330;                                                        // warm-up + core opener (2 x 2 as a pair)
  const budget = { 30: 4, 45: 5, 60: 7, 75: 9, 90: 9, 105: 9, 120: 9 }[minutes] + (o.margin ?? 1);
  const A = (d) => [
    { g: 'quads', d, Ks: [2, 3, 4], cands: [c(`${d}.s05`, 'BKD', 'cb', { hi, role: 'work' }), c(`${d}.s07`, 'UKD', 'cu', { hi }), c(`${d}.s09`, 'LEGEXT', 'iso', { hi: ih }), c(`${d}.x1`, 'UKD', 'cu', { hi })] },
    { g: 'back', d, Ks: [2, 3, 4], cands: [c(`${d}.s06`, 'HPULL', 'cb', { hi }), c(`${d}.s08`, 'VPULL', 'cb', { hi }), c(`${d}.s15`, 'VPULL', 'cb', { hi }), c(`${d}.x2`, 'HPULL', 'cb', { hi })] },
    { g: 'shoulders', d, Ks: [2, 3], cands: [c(`${d}.s10`, 'ISHO', 'iso', { hi: ih }), c(`${d}.s12`, 'ISHO', 'iso', { hi: ih }), c(`${d}.x3`, 'ISHO', 'iso', { hi: ih })] },
    { g: 'biceps', d, Ks: [2, 3], cands: [c(`${d}.s11`, 'IBI', 'iso', { hi: ih }), c(`${d}.s13`, 'IBI', 'iso', { hi: ih }), c(`${d}.x4`, 'IBI', 'iso', { hi: ih })] },
    { g: 'calves', d, Ks: [1], cands: [c(`${d}.s14`, 'CALF', 'iso', { lo: 3, hi: 4 })] },
  ];
  const B = (d) => [
    { g: 'hips', d, Ks: [2, 3, 4], cands: [c(`${d}.s05`, 'BHD', 'cb', { hi, role: 'work' }), c(`${d}.s07`, 'UHD', 'cu', { hi }), c(`${d}.s09`, 'LEGFLEX', 'iso', { hi: ih }), c(`${d}.x1`, 'GLUTE', 'iso', { hi: ih })] },
    { g: 'chest', d, Ks: [2, 3, 4], cands: [c(`${d}.s06`, 'HPUSH', 'cb', { hi }), c(`${d}.s10`, 'ICHEST', 'iso', { hi: ih }), c(`${d}.x2`, 'HPUSH', 'cb', { hi }), c(`${d}.x5`, 'ICHEST', 'iso', { hi: ih })] },
    { g: 'shoulders', d, Ks: [2, 3], cands: [c(`${d}.s08`, 'VPUSH', 'cb', { hi }), c(`${d}.s11`, 'ISHO', 'iso', { hi: ih }), c(`${d}.x3`, 'ISHO', 'iso', { hi: ih })] },
    { g: 'triceps', d, Ks: [2, 3], cands: [c(`${d}.s12`, 'ITRI', 'iso', { hi: ih }), c(`${d}.s13`, 'ITRI', 'iso', { hi: ih }), c(`${d}.x4`, 'ITRI', 'iso', { hi: ih })] },
    { g: 'calves', d, Ks: [1], cands: [c(`${d}.s14`, 'CALF', 'iso', { lo: 3, hi: 4 })] },
  ];
  const pairsA = (d) => [{ d, tag: 'P1', a: [`quads@${d}`, 0], b: [`back@${d}`, 0] }, { d, tag: 'P2', a: [`quads@${d}`, 1], b: [`back@${d}`, 1] }, { d, tag: 'S1', a: [`shoulders@${d}`, 0], b: [`biceps@${d}`, 0] }, { d, tag: 'S2', a: [`shoulders@${d}`, 1], b: [`biceps@${d}`, 1] },
    { d, tag: 'P1', a: { partner: `squat@${d}` }, b: [`back@${d}`, 0] }, { d, tag: 'P1', a: [`quads@${d}`, 0], b: { partner: `row@${d}` } }, { d, tag: 'P1', a: { partner: `squat@${d}` }, b: { partner: `row@${d}` } }];
  const pairsB = (d) => [{ d, tag: 'P1', a: [`hips@${d}`, 0], b: [`chest@${d}`, 0] }, { d, tag: 'P2', a: [`hips@${d}`, 1], b: [`shoulders@${d}`, 0] }, { d, tag: 'P3', a: [`hips@${d}`, 2], b: [`chest@${d}`, 1] }, { d, tag: 'S1', a: [`shoulders@${d}`, 1], b: [`triceps@${d}`, 0] },
    { d, tag: 'P1', a: { partner: `hinge@${d}` }, b: [`chest@${d}`, 0] }, { d, tag: 'P1', a: [`hips@${d}`, 0], b: { partner: `press@${d}` } }, { d, tag: 'P1', a: { partner: `hinge@${d}` }, b: { partner: `press@${d}` } }];
  const I = mk({
    name: `06 aesthetics 4 x ${minutes}`, N, exBlocks: [[1, 4], [5, 8], [9, 12]],
    // keep order: the Focus groups first (glutes -> hips, side delts -> shoulders), then the model's order
    groups: [
      { id: 'hips', S: 14, C: 23, focus: true }, { id: 'shoulders', S: 18, C: 27, focus: true }, { id: 'quads', S: 14, C: 20 }, { id: 'back', S: 12, C: 19 }, { id: 'chest', S: 12, C: 20 },
      { id: 'calves', S: 12, C: 15, F: 12, mc: 1, calves: true }, { id: 'triceps', S: 14, C: 20 }, { id: 'biceps', S: 15, C: 20 },
    ],
    days: [['Mon', 'A1 squat + pull'], ['Tue', 'B1 hip thrust + push'], ['Thu', 'A2 leg press + pull'], ['Fri', 'B2 deadlift + push']].map(([id, label]) => ({ id, label, minutes, factor: 1, fixedW: [fixed], exBudget: budget })),
    gds: [...A('Mon'), ...B('Tue'), ...A('Thu'), ...B('Fri')],
    partners: [
      { id: 'squat@Mon', d: 'Mon', g: 'quads', cls: 'BKD', kind: 'cb' }, { id: 'squat@Thu', d: 'Thu', g: 'quads', cls: 'BKD', kind: 'cb' },
      { id: 'hinge@Tue', d: 'Tue', g: 'hips', cls: 'BHD', kind: 'cb' }, { id: 'hinge@Fri', d: 'Fri', g: 'hips', cls: 'BHD', kind: 'cb' },
      { id: 'row@Mon', d: 'Mon', g: 'back', cls: 'HPULL', kind: 'cb' }, { id: 'row@Thu', d: 'Thu', g: 'back', cls: 'HPULL', kind: 'cb' },
      { id: 'press@Tue', d: 'Tue', g: 'chest', cls: 'HPUSH', kind: 'cb' }, { id: 'press@Fri', d: 'Fri', g: 'chest', cls: 'HPUSH', kind: 'cb' },
    ],
    pairs: [...pairsA('Mon'), ...pairsB('Tue'), ...pairsA('Thu'), ...pairsB('Fri')],
  });
  const P = (id) => I.partners.findIndex((p) => p.id === id), GD = (id) => I.gdIx[id];
  const kinds = { 'squat@Mon': 'lead', 'squat@Thu': 'lead', 'hinge@Tue': 'lead', 'hinge@Fri': 'lead', 'row@Mon': 'partner', 'row@Thu': 'partner', 'press@Tue': 'partner', 'press@Fri': 'partner' };
  I.patternOrder = ['back', 'chest', 'quads', 'hips'];
  I.partners.forEach((pt) => { pt.kind = kinds[pt.id] || 'keep'; });
  I.exclusive = [];
  I.partners.slice().forEach((pt, pi) => { if (pt.kind !== 'partner') return; I.partners.push({ ...pt, id: pt.id + '*', kind: 'keep', leadPair: true }); I.exclusive.push([pi, I.partners.length - 1]); });
  I.partnerRules = [
    ...['Mon', 'Thu'].map((d) => ({ id: `${d} knee + pull`, cls: 'pull', leadGds: [GD(`quads@${d}`)], leadStations: [P(`squat@${d}`)], satGds: [GD(`back@${d}`)], satStations: [P(`row@${d}`)] })),
    // hip + push: the chest press or the shoulder press of the day (T0-SES-08: RP_HPUSH or RP_VPUSH)
    ...['Tue', 'Fri'].map((d) => ({ id: `${d} hip + push`, cls: 'push', leadGds: [GD(`hips@${d}`)], leadStations: [P(`hinge@${d}`)], satGds: [GD(`chest@${d}`), GD(`shoulders@${d}`)], satStations: [P(`press@${d}`)] })),
  ];
  const pf = o.patternFactor ?? 1.1;
  I.days.forEach((d) => { d.band = Math.floor(d.minutes * 60 * pf) - Math.floor(d.minutes * 60); });
  I.timeQuantum = 3;
  return I;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const minutes = Number(process.argv[2] || 75), budget = Number(process.argv[3] || 200000);
  const t0 = process.hrtime.bigint();
  const I = aesthetics({ minutes });
  const s1 = planEndpoints(I, { budget, trace: true });
  const L = I.days.map((d) => d.limit.slice());
  I.days.forEach((d, i) => { d.limit = [L[i][0] + s1.band[i], L[i][1] + s1.band[i]]; });
  const s2 = placeBlock(I, s1, { tiers: ['last', 'flat', 'hold', 'late', 'shape', 'land'] });
  I.days.forEach((d, i) => { d.limit = L[i]; });
  const none = I.partners.map(() => false);
  const coreMax = I.days.map((d, i) => Math.max(...s2.weeks.map((wk) => dayTime(I, i, blockSel(blockOfWeek(I, wk.w)), d.fixedW[wk.w - 1], wk.sets, none, null))));
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log(show(`06 aesthetics 4 x ${minutes}, L3, Focus glutes + side delts (per-question node budget ${budget})`, { I, s1, s2, viol: s2.violations, coreMax, ms }, true));
  console.log(`   ceilings: ${I.groups.map((g) => `${g.id} ${g.S}->${g.C}`).join(', ')}`);
  console.log(`   stopped: ${JSON.stringify(Object.fromEntries(Object.entries(s1.stopped).map(([g, r]) => [I.groups[g].id, r])))}`);
  const big = s1.audit.log.map((l) => [Number((l.match(/\((\d+) nodes\)/) || [0, 0])[1]), l]).sort((a, b) => b[0] - a[0]).slice(0, 6).map((x) => x[1]);
  console.log(`   the six largest questions: ${big.join(' | ')}`);
}
