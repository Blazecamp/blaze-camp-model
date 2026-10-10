// design/two-stage/proto/samples.mjs - PROTOTYPE: stage-0 instances (the day grammar as data) for the three hardest samples.
// Sources (read-only): model/templates.json day types athletic.2, athletic.3, hybrid_crossfit.4 (variant crossfit_style_bootcamp);
// model/rules.json time model (work + dosed rest, changeovers) and volume tables; the frozen engine snapshot's layouts for the
// fixed blocks (warm-up, core, athletic, Olympic, joint care, skill, WOD) and for the picks' laterality.
// Everything here is DATA a coach can read like a sheet: which exercises of which group may sit on which day, in session order.
import { buildTables, growth10k } from './core.mjs';

// seconds per set by time class (rules.time_model.work_minutes / rest_class_minutes x 60)
const TC = { cb: [45, 90], cu: [90, 90], iso: [36, 75], isoU: [72, 75] };
const STRENGTH_REST = 270;
const WARMUP = 480, CORE_PAIR = 330, SKILL = 360;
const station = (sets, work, rest, change = 60) => sets * (work + rest) + change;
const PLYO = (sets) => station(sets, 24, 75), THROW = (sets) => station(sets, 30, 66), ANKLE = (sets) => station(sets, 24, 30), OLY = (sets) => station(sets, 30, 150), CARE = (sets) => station(sets, 36, 45);
// quarter-set credit by exercise class (rules.credit.classes, group credit capped at one set)
const CR = {
  BKD: { quads: 4, hips: 1 }, UKD: { quads: 4, hips: 1 }, BHD: { hips: 4 }, UHD: { hips: 4 }, GLUTE: { hips: 4 }, LEGFLEX: { hips: 4 }, LEGEXT: { quads: 4 },
  HPUSH: { chest: 4, triceps: 1, shoulders: 1 }, VPUSH: { shoulders: 4, triceps: 1 }, HPULL: { back: 4, biceps: 1, shoulders: 1 }, VPULL: { back: 4, biceps: 1 },
  ICHEST: { chest: 4 }, ISHO: { shoulders: 4 }, IBI: { biceps: 4 }, ITRI: { triceps: 4 }, CALF: { calves: 4 },
};

/** build an instance from a readable spec */
export function mk(spec) {
  const gix = Object.fromEntries(spec.groups.map((g, i) => [g.id, i]));
  const dix = Object.fromEntries(spec.days.map((d, i) => [d.id, i]));
  const NB = spec.exBlocks.length;
  const credVec = (cls) => { const v = new Array(spec.groups.length).fill(0); for (const [g, q] of Object.entries(CR[cls] || {})) if (gix[g] != null) v[gix[g]] = q; return v; };
  const costs = (kind, strBlocks) => {
    const blocks = [];
    for (let e = 0; e < NB; e++) blocks.push({ work: TC[kind][0], rest: strBlocks && strBlocks[e] ? STRENGTH_REST : TC[kind][1] });
    return { blocks, work: [blocks[0].work, Math.max(...blocks.map((b) => b.work))], rest: [blocks[0].rest, Math.max(...blocks.map((b) => b.rest))] };
  };
  const I = {
    name: spec.name, N: spec.N, exBlocks: spec.exBlocks, patternOrder: spec.patternOrder || spec.groups.map((g) => g.id), G10k: growth10k(spec.N), spill4: 4, maxPartners: 3, noLambda: !!spec.noLambda,
    groups: spec.groups.map((g) => ({ F: 10, mc: spec.N <= 7 ? 1 : 2, session4: g.focus ? 56 : 44, ...g })),
    days: spec.days.map((d) => {
      const lim = Math.floor(d.minutes * 60 * (d.factor || 1));
      const fixedW = d.fixedW.length === spec.N ? d.fixedW : new Array(spec.N).fill(d.fixedW[0]);
      return { id: d.id, label: d.label, main: d.main !== false, minutes: d.minutes, limit: [lim, lim], fixedW, fixed: [fixedW[0], Math.max(...fixedW.slice(1))], exBudget: d.exBudget ?? null, cap12: d.cap12 ?? null, parts: d.parts || null };
    }),
    gds: [], pairs: [], partners: [], fixedSets: spec.fixedSets || 0,
  };
  const gdIx = {};
  for (const s of spec.gds) {
    const gd = { id: `${s.g}@${s.d}`, g: gix[s.g], d: dix[s.d], Ks: s.Ks, home: spec.noHome ? false : (!!s.home || (s.cands[0] && s.cands[0].role === 'work')), cands: s.cands.map((c) => ({ sid: c.sid, cls: c.cls, role: c.role || null, lo: c.lo ?? 2, hi: c.hi, cred: credVec(c.cls), ...costs(c.kind, c.str) })) };
    gdIx[gd.id] = I.gds.length; I.gds.push(gd);
  }
  for (const p of spec.partners || []) {
    const host = p.host ? [gdIx[p.host[0]], p.host[1]] : null;
    if (p.host && host[0] == null) continue;
    I.partners.push({ id: p.id, d: dix[p.d], g: gix[p.g], host, sets: 2, cls: p.cls, cred: credVec(p.cls), ...costs(p.kind, null) });
  }
  const side = (s) => {
    if (s.mate) return { t: 'm', sets: s.mate.sets, work: [s.mate.work, s.mate.work], rest: [s.mate.rest, s.mate.rest] };
    if (s.partner) { const pi = I.partners.findIndex((x) => x.id === s.partner); return pi < 0 ? null : { t: 'p', pi }; }
    const gi = gdIx[s[0]]; return gi == null ? null : { t: 'c', gd: gi, ci: s[1] };
  };
  for (const p of spec.pairs || []) { const s1 = side(p.a), s2 = side(p.b); if (s1 && s2) I.pairs.push({ d: dix[p.d], s1, s2, tag: p.tag || '' }); }
  if (spec.fixedCredDay) {
    I.fixedCredDay = spec.days.map(() => new Array(spec.groups.length).fill(0));
    I.fixedCred = new Array(spec.groups.length).fill(0);
    for (const [d, m] of Object.entries(spec.fixedCredDay)) for (const [g, q] of Object.entries(m)) if (gix[g] != null) { I.fixedCredDay[dix[d]][gix[g]] += q; I.fixedCred[gix[g]] += q; }
  }
  I.gix = gix; I.dix = dix; I.gdIx = gdIx; I.spec = spec;
  return buildTables(I);
}

const c = (sid, cls, kind, extra = {}) => ({ sid, cls, kind, ...extra });

// ------------------------------------------------------------------------------------------------ 08 pickleball, 2 days
/**
 * 52-year-old recreational pickleball player, L1, stay-active, mild knee pain, 2 main days (Mon A, Thu B), 12 weeks.
 * @param o {minutes, factor, care: 'engine'|'one'|'warmup', athletic: boolean, core: boolean, calvesFloor}
 */
export function pickleball(o = {}) {
  const minutes = o.minutes ?? 45, factor = o.factor ?? 1, care = o.care ?? 'engine', hi = 4, N = 12;
  const careSec = care === 'engine' ? 2 * CARE(2) : care === 'one' ? CARE(2) : 0;
  const fx = (ath) => WARMUP + (o.core === false ? 0 : CORE_PAIR) + (o.athletic === false ? 0 : ath) + careSec;
  const parts = (athName, ath) => [['warm-up', WARMUP], ['core opener', o.core === false ? 0 : CORE_PAIR], [athName, o.athletic === false ? 0 : ath], ['joint care', careSec]];
  const budget = { 30: 4, 45: 5, 60: 7, 75: 9, 90: 9, 105: 9, 120: 9 }[minutes] + 2;      // VOL-08 count + the superset margin (PROPOSED)
  const spec = {
    name: `08 pickleball 2 x ${minutes}`, N, exBlocks: [[1, 4], [5, 8], [9, 12]],
    // keep order: sport pin (racket 50+: calves), then hips, quads, back, chest, shoulders, triceps, biceps
    groups: [
      { id: 'calves', S: 6, C: 8, F: 6, mc: 1, calves: true, pinned: true },
      { id: 'hips', S: 10, C: 13 },
      { id: 'quads', S: 6, C: 7, F: 6, mc: 1, pain: true },                         // knee pain: start x 0.6, not floored, ceiling = start + 1
      { id: 'back', S: 10, C: 13 }, { id: 'chest', S: 10, C: 13 }, { id: 'shoulders', S: 10, C: 13 },
      { id: 'triceps', S: 10, C: 13, never: 'no_station' }, { id: 'biceps', S: 10, C: 13, never: 'no_station' },
    ],
    days: [
      { id: 'Mon', label: 'A knee + pull', minutes, factor, fixedW: [fx(THROW(2))], exBudget: budget, parts: parts('medball throw 2 sets', THROW(2)) },
      { id: 'Thu', label: 'B hip + push', minutes, factor, fixedW: [fx(PLYO(2))], exBudget: budget, parts: parts('low jump 2 sets', PLYO(2)) },
    ],
    gds: [
      { g: 'calves', d: 'Mon', Ks: [1], cands: [c('A.s16', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      { g: 'calves', d: 'Thu', Ks: [1], cands: [c('B.s16', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      { g: 'hips', d: 'Mon', Ks: [2, 3], cands: [c('A.s10', 'UHD', 'cu', { hi }), c('A.s14', 'LEGFLEX', 'iso', { hi }), c('A.x1', 'GLUTE', 'cb', { hi })] },
      { g: 'hips', d: 'Thu', Ks: [2, 3], cands: [c('B.s08', 'UHD', 'cu', { hi, role: 'work' }), c('B.s12', 'LEGFLEX', 'iso', { hi }), c('B.x1', 'GLUTE', 'cb', { hi })] },
      { g: 'quads', d: 'Mon', Ks: [2, 3], cands: [c('A.s08', 'UKD', 'cu', { hi, role: 'work' }), c('A.s12', 'LEGEXT', 'iso', { hi }), c('A.x2', 'UKD', 'cu', { hi })] },
      { g: 'quads', d: 'Thu', Ks: [2, 3], cands: [c('B.s10', 'UKD', 'cu', { hi }), c('B.s14', 'LEGEXT', 'iso', { hi }), c('B.x2', 'UKD', 'cu', { hi })] },
      { g: 'back', d: 'Mon', Ks: [2, 3], cands: [c('A.s09', 'HPULL', 'cb', { hi }), c('A.s13', 'VPULL', 'cb', { hi }), c('A.x3', 'VPULL', 'iso', { hi })] },
      { g: 'back', d: 'Thu', Ks: [2, 3], cands: [c('B.s11', 'HPULL', 'cb', { hi }), c('B.s15', 'VPULL', 'cb', { hi }), c('B.x3', 'VPULL', 'iso', { hi })] },
      { g: 'chest', d: 'Thu', Ks: [2, 3], cands: [c('B.s09', 'HPUSH', 'cb', { hi }), c('B.s13', 'ICHEST', 'iso', { hi }), c('B.x4', 'HPUSH', 'cb', { hi })] },
      { g: 'shoulders', d: 'Mon', Ks: [2, 3], cands: [c('A.s11', 'VPUSH', 'cb', { hi }), c('A.s15', 'ISHO', 'iso', { hi }), c('A.x5', 'ISHO', 'iso', { hi })] },
    ],
    // pattern stations (2 sets, constant): a big mover that is not trained directly keeps its movement (rules.volume.pattern_keep)
    partners: [
      { id: 'row@Mon', d: 'Mon', g: 'back', cls: 'HPULL', kind: 'cb' }, { id: 'row@Thu', d: 'Thu', g: 'back', cls: 'HPULL', kind: 'cb' },
      { id: 'press@Thu', d: 'Thu', g: 'chest', cls: 'HPUSH', kind: 'cb' },
      { id: 'knee@Mon', d: 'Mon', g: 'quads', cls: 'UKD', kind: 'cu' }, { id: 'knee@Thu', d: 'Thu', g: 'quads', cls: 'UKD', kind: 'cu' },
      { id: 'hinge@Mon', d: 'Mon', g: 'hips', cls: 'UHD', kind: 'cu' }, { id: 'hinge@Thu', d: 'Thu', g: 'hips', cls: 'UHD', kind: 'cu' },
    ],
    pairs: [
      { d: 'Mon', tag: 'P1', a: ['quads@Mon', 0], b: ['back@Mon', 0] }, { d: 'Mon', tag: 'P2', a: ['hips@Mon', 0], b: ['shoulders@Mon', 0] }, { d: 'Mon', tag: 'P3', a: ['quads@Mon', 1], b: ['back@Mon', 1] },
      { d: 'Thu', tag: 'P1', a: ['hips@Thu', 0], b: ['chest@Thu', 0] }, { d: 'Thu', tag: 'P2', a: ['quads@Thu', 0], b: ['back@Thu', 0] }, { d: 'Thu', tag: 'P3', a: ['hips@Thu', 1], b: ['chest@Thu', 1] }, { d: 'Thu', tag: 'P4', a: ['quads@Thu', 1], b: ['back@Thu', 1] },
      // the same template pairs when one or both sides are pattern stations
      { d: 'Mon', tag: 'P1', a: ['quads@Mon', 0], b: { partner: 'row@Mon' } }, { d: 'Mon', tag: 'P1', a: { partner: 'knee@Mon' }, b: ['back@Mon', 0] }, { d: 'Mon', tag: 'P1', a: { partner: 'knee@Mon' }, b: { partner: 'row@Mon' } },
      { d: 'Mon', tag: 'P2', a: ['hips@Mon', 0], b: { partner: 'press@Mon' } }, { d: 'Mon', tag: 'P2', a: { partner: 'hinge@Mon' }, b: ['shoulders@Mon', 0] }, { d: 'Mon', tag: 'P2', a: { partner: 'hinge@Mon' }, b: { partner: 'press@Mon' } },
      { d: 'Thu', tag: 'P1', a: ['hips@Thu', 0], b: { partner: 'press@Thu' } }, { d: 'Thu', tag: 'P1', a: { partner: 'hinge@Thu' }, b: ['chest@Thu', 0] }, { d: 'Thu', tag: 'P1', a: { partner: 'hinge@Thu' }, b: { partner: 'press@Thu' } },
      { d: 'Thu', tag: 'P2', a: ['quads@Thu', 0], b: { partner: 'row@Thu' } }, { d: 'Thu', tag: 'P2', a: { partner: 'knee@Thu' }, b: ['back@Thu', 0] }, { d: 'Thu', tag: 'P2', a: { partner: 'knee@Thu' }, b: { partner: 'row@Thu' } },
      // the calf raise runs as a superset with a joint-care item (the engine pairs them: X1 / X2)
      ...(care !== 'warmup' ? [{ d: 'Mon', tag: 'X', a: ['calves@Mon', 0], b: { mate: { sets: 2, work: 36, rest: 45 } } }, { d: 'Thu', tag: 'X', a: ['calves@Thu', 0], b: { mate: { sets: 2, work: 36, rest: 45 } } }] : []),
    ],
  };
  if (o.calvesFloor) spec.groups[0].F = o.calvesFloor;
  return mk(spec);
}

// ------------------------------------------------------------------------------------------------ 01 swimmer, 3 days
/**
 * 16-year-old competitive swimmer (middle distance), L2, field-athlete modifier, off-season, 3 main days x 60 (S1 Mon, S2 Wed, S3 Fri), 12 weeks.
 * Athletic prefix = the approved structure at its smallest dose (jump / throw stations at 2 sets, one Olympic lift a day whose weekly
 * sets climb 6 -> 7 -> 8 by exercise block, shoulder care 1 set every session: R3-ATH-01).
 * @param o {minutes, factor, oly: boolean, athletic: boolean, core: boolean}
 */
export function swimmer(o = {}) {
  const minutes = o.minutes ?? 60, factor = o.factor ?? 1, hi = 5, ih = 4, N = 12;
  const str3 = o.vol3Strength === false ? null : [false, false, true];
  const wk = (f) => { const a = []; for (let w = 1; w <= N; w++) a.push(f(w <= 4 ? 0 : w <= 8 ? 1 : 2)); return a; };
  const core = o.core === false ? 0 : CORE_PAIR, A = o.athletic === false ? 0 : 1, O = o.oly === false ? 0 : 1;
  const olyMon = [2, 3, 3], olyWed = [2, 2, 3], olyFri = [2, 2, 2];                 // Olympic sets per exposure: 6 -> 7 -> 8 a week (budget 5 -> 8)
  const fri = 2 * (24 + 30 + 75) + 60;                                               // box jump + medball scoop as a pair (AJ1): 2 rounds, one rest
  const spec = {
    name: `01 swimmer 3 x ${minutes}`, N, noHome: o.home === false, exBlocks: [[1, 4], [5, 8], [9, 12]],
    // keep order: the profile's big priorities first (lats / upper back, glutes -> hips, quads), then chest, calves, shoulders; arms are credit-only
    groups: [
      { id: 'back', S: 15, C: 21 }, { id: 'hips', S: 11, C: 16 }, { id: 'quads', S: 11, C: 16 }, { id: 'chest', S: 10, C: 14 },
      { id: 'calves', S: 9, C: 12, F: 9, mc: 1, calves: true }, { id: 'shoulders', S: 10, C: 16 },
      { id: 'triceps', S: 10, C: 14, never: 'credit_only' }, { id: 'biceps', S: 10, C: 14, never: 'credit_only' },
    ],
    days: [
      { id: 'Mon', label: 'S1 jump + knee + pull', minutes, factor, cap12: 12 - 2 * A, fixedW: wk((e) => WARMUP + core + A * PLYO(2) + A * O * OLY(olyMon[e]) + CARE(1)), parts: [['warm-up', WARMUP], ['core opener', core], ['jump 2 sets', A * PLYO(2)], ['Olympic lift 2-3 sets', A * O * OLY(3)], ['shoulder care', CARE(1)]] },
      { id: 'Wed', label: 'S2 medball + hip + push', minutes, factor, cap12: 12 - 3 * A, fixedW: wk((e) => WARMUP + core + A * (PLYO(2) + ANKLE(2) + THROW(2)) + A * O * OLY(olyWed[e]) + CARE(1)), parts: [['warm-up', WARMUP], ['core opener', core], ['upper plyo + ankle hops + throw', A * (PLYO(2) + ANKLE(2) + THROW(2))], ['Olympic lift 2-3 sets', A * O * OLY(3)], ['shoulder care', CARE(1)]] },
      { id: 'Fri', label: 'S3 Olympic + strength', minutes, factor, cap12: 12 - 3 * A, fixedW: wk((e) => WARMUP + core + A * fri + A * O * OLY(olyFri[e]) + CARE(1)), parts: [['warm-up', WARMUP], ['core opener', core], ['jump + throw pair', A * fri], ['Olympic lift 2 sets', A * O * OLY(2)], ['shoulder care', CARE(1)]] },
    ],
    gds: [
      // S1: heavy axial squat day (strength rest in the last exercise block: VOL3)
      { g: 'back', d: 'Mon', Ks: [2, 3], cands: [c('S1.s10', 'HPULL', 'cu', { hi }), c('S1.s14', 'VPULL', 'cb', { hi }), c('S1.x1', 'VPULL', 'iso', { hi: ih })] },
      { g: 'hips', d: 'Mon', Ks: [2, 3], cands: [c('S1.s11', 'UHD', 'cu', { hi }), c('S1.s15', 'LEGFLEX', 'iso', { hi: ih }), c('S1.x2', 'GLUTE', 'cb', { hi })] },
      { g: 'quads', d: 'Mon', Ks: [2, 3], cands: [c('S1.s09', 'BKD', 'cb', { hi, role: 'work', str: str3 }), c('S1.s13', 'LEGEXT', 'iso', { hi: ih }), c('S1.x3', 'UKD', 'cu', { hi })] },
      { g: 'calves', d: 'Mon', Ks: [1], cands: [c('S1.s17', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      { g: 'shoulders', d: 'Mon', Ks: [2, 3], cands: [c('S1.s12', 'VPUSH', 'cb', { hi }), c('S1.s16', 'ISHO', 'iso', { hi: ih }), c('S1.x4', 'ISHO', 'iso', { hi: ih })] },
      // S2: non-axial hinge (45-degree hip extension)
      { g: 'back', d: 'Wed', Ks: [2, 3], cands: [c('S2.s12', 'HPULL', 'cb', { hi }), c('S2.s16', 'VPULL', 'cb', { hi }), c('S2.x1', 'VPULL', 'iso', { hi: ih })] },
      { g: 'hips', d: 'Wed', Ks: [2, 3], cands: [c('S2.s09', 'BHD', 'cb', { hi, role: 'work' }), c('S2.s13', 'UHD', 'cu', { hi }), c('S2.x2', 'LEGFLEX', 'iso', { hi: ih })] },
      { g: 'quads', d: 'Wed', Ks: [2, 3], cands: [c('S2.s11', 'UKD', 'cu', { hi }), c('S2.s15', 'LEGEXT', 'iso', { hi: ih }), c('S2.x3', 'UKD', 'cu', { hi })] },
      { g: 'chest', d: 'Wed', Ks: [2, 3], cands: [c('S2.s10', 'HPUSH', 'cb', { hi }), c('S2.s14', 'ICHEST', 'iso', { hi: ih }), c('S2.x4', 'HPUSH', 'cb', { hi })] },
      { g: 'calves', d: 'Wed', Ks: [1], cands: [c('S2.s17', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      // S3: heavy axial deadlift day (strength rest in the last exercise block)
      { g: 'back', d: 'Fri', Ks: [2, 3], cands: [c('S3.s09', 'HPULL', 'cb', { hi }), c('S3.s13', 'VPULL', 'cu', { hi }), c('S3.x1', 'VPULL', 'iso', { hi: ih })] },
      { g: 'hips', d: 'Fri', Ks: [2, 3], cands: [c('S3.s06', 'BHD', 'cb', { hi, role: 'work', str: str3 }), c('S3.s10', 'LEGFLEX', 'iso', { hi: ih }), c('S3.x2', 'UHD', 'cu', { hi })] },
      { g: 'quads', d: 'Fri', Ks: [2, 3], cands: [c('S3.s08', 'UKD', 'cu', { hi }), c('S3.s12', 'LEGEXT', 'iso', { hi: ih }), c('S3.x3', 'UKD', 'cu', { hi })] },
      { g: 'chest', d: 'Fri', Ks: [2, 3], cands: [c('S3.s07', 'HPUSH', 'cb', { hi }), c('S3.s11', 'ICHEST', 'iso', { hi: ih }), c('S3.x4', 'HPUSH', 'cb', { hi })] },
      { g: 'calves', d: 'Fri', Ks: [1], cands: [c('S3.s14', 'CALF', 'iso', { lo: 3, hi: 4 })] },
    ],
    partners: [
      { id: 'row@Mon', d: 'Mon', g: 'back', cls: 'HPULL', kind: 'cu' }, { id: 'row@Wed', d: 'Wed', g: 'back', cls: 'HPULL', kind: 'cb' }, { id: 'row@Fri', d: 'Fri', g: 'back', cls: 'HPULL', kind: 'cb' },
      { id: 'press@Wed', d: 'Wed', g: 'chest', cls: 'HPUSH', kind: 'cb' }, { id: 'press@Fri', d: 'Fri', g: 'chest', cls: 'HPUSH', kind: 'cb' },
      { id: 'knee@Wed', d: 'Wed', g: 'quads', cls: 'UKD', kind: 'cu' }, { id: 'knee@Fri', d: 'Fri', g: 'quads', cls: 'UKD', kind: 'cu' },
      { id: 'hinge@Mon', d: 'Mon', g: 'hips', cls: 'UHD', kind: 'cu' },
    ],
    pairs: [
      { d: 'Mon', tag: 'P1', a: ['quads@Mon', 0], b: ['back@Mon', 0] }, { d: 'Mon', tag: 'P2', a: ['hips@Mon', 0], b: ['shoulders@Mon', 0] }, { d: 'Mon', tag: 'P3', a: ['quads@Mon', 1], b: ['back@Mon', 1] },
      { d: 'Wed', tag: 'P1', a: ['hips@Wed', 0], b: ['chest@Wed', 0] }, { d: 'Wed', tag: 'P2', a: ['quads@Wed', 0], b: ['back@Wed', 0] }, { d: 'Wed', tag: 'P3', a: ['hips@Wed', 1], b: ['chest@Wed', 1] }, { d: 'Wed', tag: 'P4', a: ['quads@Wed', 1], b: ['back@Wed', 1] },
      { d: 'Fri', tag: 'P1', a: ['hips@Fri', 0], b: ['chest@Fri', 0] }, { d: 'Fri', tag: 'P2', a: ['quads@Fri', 0], b: ['back@Fri', 0] }, { d: 'Fri', tag: 'P3', a: ['hips@Fri', 1], b: ['chest@Fri', 1] }, { d: 'Fri', tag: 'P4', a: ['quads@Fri', 1], b: ['back@Fri', 1] },
      { d: 'Mon', tag: 'P1', a: ['quads@Mon', 0], b: { partner: 'row@Mon' } },
      { d: 'Mon', tag: 'P2', a: ['hips@Mon', 0], b: { partner: 'press@Mon' } }, { d: 'Mon', tag: 'P2', a: { partner: 'hinge@Mon' }, b: ['shoulders@Mon', 0] }, { d: 'Mon', tag: 'P2', a: { partner: 'hinge@Mon' }, b: { partner: 'press@Mon' } },
      { d: 'Wed', tag: 'P1', a: ['hips@Wed', 0], b: { partner: 'press@Wed' } }, { d: 'Fri', tag: 'P1', a: ['hips@Fri', 0], b: { partner: 'press@Fri' } },
      { d: 'Wed', tag: 'P2', a: ['quads@Wed', 0], b: { partner: 'row@Wed' } }, { d: 'Wed', tag: 'P2', a: { partner: 'knee@Wed' }, b: ['back@Wed', 0] }, { d: 'Wed', tag: 'P2', a: { partner: 'knee@Wed' }, b: { partner: 'row@Wed' } },
      { d: 'Fri', tag: 'P2', a: ['quads@Fri', 0], b: { partner: 'row@Fri' } }, { d: 'Fri', tag: 'P2', a: { partner: 'knee@Fri' }, b: ['back@Fri', 0] }, { d: 'Fri', tag: 'P2', a: { partner: 'knee@Fri' }, b: { partner: 'row@Fri' } },
    ],
  };
  return mk(spec);
}

// ------------------------------------------------------------------------------------------------ 04 CrossFit-style class, 4 days
/**
 * 35-year-old CrossFit-style class member, L2, stay-active, 4 main days x 60 (Mon squat, Tue press + snatch, Thu deadlift, Fri clean), 8 weeks.
 * The class stays a class: warm-up, light core, skill (Mon, Thu), the Olympic lift (Tue, Fri), the CLASS LIFT (squat / press / deadlift:
 * 3 sets at the HALF TIME class level, strength rest), WOD 10 min. Class lifts are fixed items: printed as class lifts, credited to
 * their group, and they count as the first exercise of that group on the day when the group is trained directly.
 * @param o {minutes, factor, wod (min), skill: boolean, classRest (s)}
 */
export function crossfit(o = {}) {
  const minutes = o.minutes ?? 60, factor = o.factor ?? 1, hi = 5, ih = 4, N = 8;
  const wod = (o.wod ?? 10) * 60, skill = o.skill === false ? 0 : SKILL, cr = o.classRest ?? STRENGTH_REST;
  const classLift = 3 * (45 + cr) + 60, core = o.core === false ? 0 : CORE_PAIR;
  const mate = { mate: { sets: 3, work: 45, rest: cr } };
  const spec = {
    name: `04 CrossFit class 4 x ${minutes}`, N, exBlocks: [[1, 4], [5, 8]], fixedSets: 9,
    groups: [
      { id: 'hips', S: 12, C: 18 }, { id: 'quads', S: 12, C: 18 }, { id: 'back', S: 12, C: 18 }, { id: 'chest', S: 12, C: 18 },
      { id: 'calves', S: 6, C: 8, F: 6, mc: 1, calves: true }, { id: 'shoulders', S: 10, C: 18 },
      { id: 'triceps', S: 10, C: 18, never: 'no_station' }, { id: 'biceps', S: 10, C: 18 },
    ],
    days: [
      { id: 'Mon', label: 'squat day', minutes, factor, fixedW: [WARMUP + skill + core + classLift + wod], parts: [['warm-up', WARMUP], ['skill', skill], ['core opener', core], ['class squat 3 sets', classLift], ['WOD', wod]] },
      { id: 'Tue', label: 'press + snatch day', minutes, factor, fixedW: [WARMUP + core + OLY(3) + classLift + wod], parts: [['warm-up', WARMUP], ['core opener', core], ['snatch 3 sets', OLY(3)], ['class press 3 sets', classLift], ['WOD', wod]] },
      { id: 'Thu', label: 'deadlift day', minutes, factor, fixedW: [WARMUP + skill + core + classLift + wod], parts: [['warm-up', WARMUP], ['skill', skill], ['core opener', core], ['class deadlift 3 sets', classLift], ['WOD', wod]] },
      { id: 'Fri', label: 'clean + pull day', minutes, factor, fixedW: [WARMUP + core + OLY(3) + wod], parts: [['warm-up', WARMUP], ['core opener', core], ['clean 3 sets', OLY(3)], ['WOD', wod]] },
    ],
    // the class lift is exercise 1 of its group on that day, so the group adds 1-3 more exercises there (2-4 in all)
    gds: [
      { g: 'hips', d: 'Thu', home: true, Ks: [1, 2, 3], cands: [c('DL.s08', 'UHD', 'cu', { hi }), c('DL.x1', 'GLUTE', 'cb', { hi }), c('DL.x2', 'LEGFLEX', 'iso', { hi: ih })] },
      { g: 'quads', d: 'Mon', home: true, Ks: [1, 2, 3], cands: [c('SQ.s08', 'UKD', 'cu', { hi }), c('SQ.x1', 'LEGEXT', 'iso', { hi: ih }), c('SQ.x2', 'UKD', 'cu', { hi })] },
      { g: 'back', d: 'Mon', Ks: [2, 3], cands: [c('SQ.s07', 'HPULL', 'cu', { hi }), c('SQ.s09', 'VPULL', 'cb', { hi }), c('SQ.x3', 'VPULL', 'iso', { hi: ih })] },
      { g: 'back', d: 'Fri', Ks: [2, 3], cands: [c('CL.s07', 'HPULL', 'cb', { hi, role: 'work' }), c('CL.s08', 'VPULL', 'cb', { hi }), c('CL.x1', 'VPULL', 'iso', { hi: ih })] },
      { g: 'chest', d: 'Tue', Ks: [2, 3], cands: [c('PR.s08', 'HPUSH', 'cb', { hi }), c('PR.s09', 'ICHEST', 'iso', { hi: ih }), c('PR.x1', 'HPUSH', 'cb', { hi })] },
      { g: 'chest', d: 'Thu', Ks: [2, 3], cands: [c('DL.s14', 'HPUSH', 'cb', { hi }), c('DL.s15', 'ICHEST', 'iso', { hi: ih }), c('DL.x3', 'HPUSH', 'cb', { hi })] },
      { g: 'calves', d: 'Mon', Ks: [1], cands: [c('SQ.s10', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      { g: 'calves', d: 'Thu', Ks: [1], cands: [c('DL.s10', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      { g: 'shoulders', d: 'Mon', Ks: [2, 3], cands: [c('SQ.s11', 'ISHO', 'iso', { hi: ih }), c('SQ.s12', 'ISHO', 'iso', { hi: ih }), c('SQ.x4', 'ISHO', 'iso', { hi: ih })] },
      { g: 'shoulders', d: 'Tue', home: true, Ks: [1, 2, 3], cands: [c('PR.s10', 'ISHO', 'iso', { hi: ih }), c('PR.x2', 'ISHO', 'iso', { hi: ih }), c('PR.x3', 'ISHO', 'iso', { hi: ih })] },
      { g: 'biceps', d: 'Fri', Ks: [2, 3], cands: [c('CL.s09', 'IBI', 'iso', { hi: ih }), c('CL.s12', 'IBI', 'iso', { hi: ih }), c('CL.x2', 'IBI', 'iso', { hi: ih })] },
    ],
    partners: [
      { id: 'bench@Thu', d: 'Thu', g: 'chest', cls: 'HPUSH', kind: 'cb' },          // the deadlift keeps its push (template pair P1)
      { id: 'row@Mon', d: 'Mon', g: 'back', cls: 'HPULL', kind: 'cu' },             // the squat keeps its pull (template pair P1)
    ],
    pairs: [
      { d: 'Mon', tag: 'P1', a: ['back@Mon', 0], b: mate }, { d: 'Mon', tag: 'P2', a: ['quads@Mon', 0], b: ['back@Mon', 1] },
      { d: 'Thu', tag: 'P1', a: ['chest@Thu', 0], b: mate }, { d: 'Thu', tag: 'P2', a: ['hips@Thu', 0], b: ['chest@Thu', 1] },
      { d: 'Mon', tag: 'P1', a: { partner: 'row@Mon' }, b: mate }, { d: 'Thu', tag: 'P1', a: { partner: 'bench@Thu' }, b: mate },
    ],
    fixedCredDay: { Mon: { quads: 12, hips: 3 }, Tue: { shoulders: 12, triceps: 3 }, Thu: { hips: 12 } },
  };
  return mk(spec);
}

// ------------------------------------------------------------------------------------------------ 08 pickleball with one more day
/**
 * The "one more day" offer of the pickleball player, on the template that intake would really get (athletic.3: S1 knee + pull,
 * S2 hip + push, S3 hip + push), Mon / Tue / Thu, same fixed blocks (one athletic piece and one joint-care item a day).
 */
export function pickleball3(o = {}) {
  const minutes = o.minutes ?? 45, factor = o.factor ?? 1, hi = 4, N = 12;
  const careSec = (o.care ?? 'one') === 'engine' ? 2 * CARE(2) : (o.care ?? 'one') === 'one' ? CARE(2) : 0;
  const fx = (ath) => WARMUP + CORE_PAIR + ath + careSec;
  const parts = (athName, ath) => [['warm-up', WARMUP], ['core opener', CORE_PAIR], [athName, ath], ['joint care', careSec]];
  const budget = { 30: 4, 45: 5, 60: 7, 75: 9, 90: 9, 105: 9, 120: 9 }[minutes] + 2;
  const mate = careSec ? { mate: { sets: 2, work: 36, rest: 45 } } : null;
  const spec = {
    name: `08 pickleball 3 x ${minutes} (offer)`, N, exBlocks: [[1, 4], [5, 8], [9, 12]],
    groups: [
      { id: 'calves', S: 9, C: 12, F: 9, mc: 1, calves: true, pinned: true }, { id: 'hips', S: 10, C: 13 },
      { id: 'quads', S: 6, C: 7, F: 6, mc: 1, pain: true }, { id: 'back', S: 10, C: 13 }, { id: 'chest', S: 10, C: 13 }, { id: 'shoulders', S: 10, C: 13 },
      { id: 'triceps', S: 10, C: 13, never: 'no_station' }, { id: 'biceps', S: 10, C: 13, never: 'no_station' },
    ],
    days: [
      { id: 'Mon', label: 'S1 knee + pull', minutes, factor, fixedW: [fx(THROW(2))], exBudget: budget, parts: parts('medball throw 2 sets', THROW(2)) },
      { id: 'Tue', label: 'S2 hip + push', minutes, factor, fixedW: [fx(PLYO(2))], exBudget: budget, parts: parts('low jump 2 sets', PLYO(2)) },
      { id: 'Thu', label: 'S3 hip + push', minutes, factor, fixedW: [fx(THROW(2))], exBudget: budget, parts: parts('medball throw 2 sets', THROW(2)) },
    ],
    gds: [
      { g: 'calves', d: 'Mon', Ks: [1], cands: [c('S1.s17', 'CALF', 'iso', { lo: 3, hi: 4 })] }, { g: 'calves', d: 'Tue', Ks: [1], cands: [c('S2.s17', 'CALF', 'iso', { lo: 3, hi: 4 })] }, { g: 'calves', d: 'Thu', Ks: [1], cands: [c('S3.s14', 'CALF', 'iso', { lo: 3, hi: 4 })] },
      { g: 'hips', d: 'Mon', Ks: [2, 3], cands: [c('S1.s11', 'UHD', 'cu', { hi }), c('S1.s15', 'LEGFLEX', 'iso', { hi }), c('S1.x1', 'GLUTE', 'cb', { hi })] },
      { g: 'hips', d: 'Tue', Ks: [2, 3], cands: [c('S2.s09', 'UHD', 'cu', { hi, role: 'work' }), c('S2.s13', 'GLUTE', 'cb', { hi }), c('S2.x1', 'LEGFLEX', 'iso', { hi })] },
      { g: 'hips', d: 'Thu', Ks: [2, 3], cands: [c('S3.s06', 'UHD', 'cu', { hi, role: 'work' }), c('S3.s10', 'LEGFLEX', 'iso', { hi }), c('S3.x1', 'GLUTE', 'cb', { hi })] },
      { g: 'quads', d: 'Mon', Ks: [2, 3], cands: [c('S1.s09', 'UKD', 'cu', { hi, role: 'work' }), c('S1.s13', 'LEGEXT', 'iso', { hi }), c('S1.x2', 'UKD', 'cu', { hi })] },
      { g: 'quads', d: 'Tue', Ks: [2, 3], cands: [c('S2.s11', 'UKD', 'cu', { hi }), c('S2.s15', 'LEGEXT', 'iso', { hi }), c('S2.x2', 'UKD', 'cu', { hi })] },
      { g: 'quads', d: 'Thu', Ks: [2, 3], cands: [c('S3.s08', 'UKD', 'cu', { hi }), c('S3.s12', 'LEGEXT', 'iso', { hi }), c('S3.x2', 'UKD', 'cu', { hi })] },
      { g: 'back', d: 'Mon', Ks: [2, 3], cands: [c('S1.s10', 'HPULL', 'cb', { hi }), c('S1.s14', 'VPULL', 'cb', { hi }), c('S1.x3', 'VPULL', 'iso', { hi })] },
      { g: 'back', d: 'Tue', Ks: [2, 3], cands: [c('S2.s12', 'HPULL', 'cb', { hi }), c('S2.s16', 'VPULL', 'cb', { hi }), c('S2.x3', 'VPULL', 'iso', { hi })] },
      { g: 'back', d: 'Thu', Ks: [2, 3], cands: [c('S3.s09', 'HPULL', 'cb', { hi }), c('S3.s13', 'VPULL', 'cb', { hi }), c('S3.x3', 'VPULL', 'iso', { hi })] },
      { g: 'chest', d: 'Tue', Ks: [2, 3], cands: [c('S2.s10', 'HPUSH', 'cb', { hi }), c('S2.s14', 'ICHEST', 'iso', { hi }), c('S2.x4', 'HPUSH', 'cb', { hi })] },
      { g: 'chest', d: 'Thu', Ks: [2, 3], cands: [c('S3.s07', 'HPUSH', 'cb', { hi }), c('S3.s11', 'ICHEST', 'iso', { hi }), c('S3.x4', 'HPUSH', 'cb', { hi })] },
      { g: 'shoulders', d: 'Mon', Ks: [2, 3], cands: [c('S1.s12', 'VPUSH', 'cb', { hi }), c('S1.s16', 'ISHO', 'iso', { hi }), c('S1.x5', 'ISHO', 'iso', { hi })] },
    ],
    partners: [
      { id: 'row@Mon', d: 'Mon', g: 'back', cls: 'HPULL', kind: 'cb' }, { id: 'row@Tue', d: 'Tue', g: 'back', cls: 'HPULL', kind: 'cb' }, { id: 'row@Thu', d: 'Thu', g: 'back', cls: 'HPULL', kind: 'cb' },
      { id: 'press@Tue', d: 'Tue', g: 'chest', cls: 'HPUSH', kind: 'cb' }, { id: 'press@Thu', d: 'Thu', g: 'chest', cls: 'HPUSH', kind: 'cb' },
      { id: 'knee@Tue', d: 'Tue', g: 'quads', cls: 'UKD', kind: 'cu' }, { id: 'knee@Thu', d: 'Thu', g: 'quads', cls: 'UKD', kind: 'cu' },
      { id: 'hinge@Mon', d: 'Mon', g: 'hips', cls: 'UHD', kind: 'cu' },
    ],
    pairs: [
      { d: 'Mon', tag: 'P1', a: ['quads@Mon', 0], b: ['back@Mon', 0] }, { d: 'Mon', tag: 'P2', a: ['hips@Mon', 0], b: ['shoulders@Mon', 0] }, { d: 'Mon', tag: 'P3', a: ['quads@Mon', 1], b: ['back@Mon', 1] },
      { d: 'Tue', tag: 'P1', a: ['hips@Tue', 0], b: ['chest@Tue', 0] }, { d: 'Tue', tag: 'P2', a: ['quads@Tue', 0], b: ['back@Tue', 0] }, { d: 'Tue', tag: 'P3', a: ['hips@Tue', 1], b: ['chest@Tue', 1] }, { d: 'Tue', tag: 'P4', a: ['quads@Tue', 1], b: ['back@Tue', 1] },
      { d: 'Thu', tag: 'P1', a: ['hips@Thu', 0], b: ['chest@Thu', 0] }, { d: 'Thu', tag: 'P2', a: ['quads@Thu', 0], b: ['back@Thu', 0] }, { d: 'Thu', tag: 'P3', a: ['hips@Thu', 1], b: ['chest@Thu', 1] }, { d: 'Thu', tag: 'P4', a: ['quads@Thu', 1], b: ['back@Thu', 1] },
      { d: 'Mon', tag: 'P1', a: ['quads@Mon', 0], b: { partner: 'row@Mon' } }, { d: 'Mon', tag: 'P2', a: { partner: 'hinge@Mon' }, b: ['shoulders@Mon', 0] },
      { d: 'Tue', tag: 'P1', a: ['hips@Tue', 0], b: { partner: 'press@Tue' } }, { d: 'Thu', tag: 'P1', a: ['hips@Thu', 0], b: { partner: 'press@Thu' } },
      { d: 'Tue', tag: 'P2', a: ['quads@Tue', 0], b: { partner: 'row@Tue' } }, { d: 'Tue', tag: 'P2', a: { partner: 'knee@Tue' }, b: ['back@Tue', 0] }, { d: 'Tue', tag: 'P2', a: { partner: 'knee@Tue' }, b: { partner: 'row@Tue' } },
      { d: 'Thu', tag: 'P2', a: ['quads@Thu', 0], b: { partner: 'row@Thu' } }, { d: 'Thu', tag: 'P2', a: { partner: 'knee@Thu' }, b: ['back@Thu', 0] }, { d: 'Thu', tag: 'P2', a: { partner: 'knee@Thu' }, b: { partner: 'row@Thu' } },
      ...(mate ? ['Mon', 'Tue', 'Thu'].map((d) => ({ d, tag: 'X', a: [`calves@${d}`, 0], b: mate })) : []),
    ],
  };
  return mk(spec);
}
