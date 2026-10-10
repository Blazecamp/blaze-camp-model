// design/spec_checks/graft/run.mjs - the three hard samples under the rules PLANNER_SPEC.md adds to the two-stage design:
//   lead pattern stations (the day keeps its own work lift at 2 sets when its group is not trained), R-PARTNER (an active lower
//   work lift keeps its upper partner), the pattern band (kept movements may use "a little longer day", trained groups may not),
//   the smallest overrun pinned before the peaks, the 11-sets-a-session rule as its own tier, the spec's stairway order.
// Prototype evidence, not engine code. Instances: design/two-stage/proto/samples.mjs (read-only), decorated below.
//   node design/spec_checks/graft/run.mjs            -> the decision table D1 (three 2 x 45 plans) and the default plans
import * as S from '../../two-stage/proto/samples.mjs';
import { dayTime, blockSel, blockOfWeek, setsAt } from '../../two-stage/proto/core.mjs';
import { placeBlock } from '../../two-stage/proto/stage2.mjs';
import { planEndpoints } from './stage1.mjs';

const TIERS = ['last', 'flat', 'hold', 'late', 'shape', 'land'];
const CR = { BKD: { quads: 4, hips: 1 }, BHD: { hips: 4 }, UHD: { hips: 4 } };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

function addStation(I, { id, d, g, cls, sec, str }) {
  const cred = new Array(I.groups.length).fill(0); for (const [k, q] of Object.entries(CR[cls])) if (I.gix[k] != null) cred[I.gix[k]] = q;
  const NB = I.exBlocks.length, blocks = [];
  for (let e = 0; e < NB; e++) blocks.push({ work: sec[0], rest: str && str[e] ? 270 : sec[1] });
  I.partners.push({ id, d: I.dix[d], g: I.gix[g], host: null, sets: 2, cls, cred, blocks, work: [blocks[0].work, Math.max(...blocks.map((b) => b.work))], rest: [blocks[0].rest, Math.max(...blocks.map((b) => b.rest))] });
  return I.partners.length - 1;
}
const P = (I, id) => I.partners.findIndex((p) => p.id === id);
const GD = (I, id) => I.gdIx[id];
const pair = (I, d, a, b, tag) => { if (a && b) I.pairs.push({ d: I.dix[d], s1: a, s2: b, tag }); };
const sideP = (I, id) => (P(I, id) < 0 ? null : { t: 'p', pi: P(I, id) });
const sideC = (I, id, ci) => (GD(I, id) == null ? null : { t: 'c', gd: GD(I, id), ci });

/** decorate a prototype instance with station kinds, partner rules and the pattern band */
function decorate(I, name, o) {
  const kinds = {}, rules = [];
  if (name === 'pickleball') {
    Object.assign(kinds, { 'knee@Mon': 'lead', 'hinge@Thu': 'lead', 'row@Mon': 'partner', 'press@Thu': 'partner' });
    rules.push({ id: 'Mon knee + pull', cls: 'pull', leadGds: [GD(I, 'quads@Mon')], leadStations: [P(I, 'knee@Mon')], satGds: [GD(I, 'back@Mon')], satStations: [P(I, 'row@Mon')] });
    rules.push({ id: 'Thu hip + push', cls: 'push', leadGds: [GD(I, 'hips@Thu')], leadStations: [P(I, 'hinge@Thu')], satGds: [GD(I, 'chest@Thu')], satStations: [P(I, 'press@Thu')] });
  }
  if (name === 'swimmer') {
    const str3 = o.vol3Strength === false ? null : [false, false, true];
    addStation(I, { id: 'squat@Mon', d: 'Mon', g: 'quads', cls: 'BKD', sec: [45, 90], str: str3 });
    addStation(I, { id: 'hipext@Wed', d: 'Wed', g: 'hips', cls: 'BHD', sec: [45, 90] });
    addStation(I, { id: 'deadlift@Fri', d: 'Fri', g: 'hips', cls: 'BHD', sec: [45, 90], str: str3 });
    pair(I, 'Mon', sideP(I, 'squat@Mon'), sideC(I, 'back@Mon', 0), 'P1'); pair(I, 'Mon', sideP(I, 'squat@Mon'), sideP(I, 'row@Mon'), 'P1');
    pair(I, 'Wed', sideP(I, 'hipext@Wed'), sideC(I, 'chest@Wed', 0), 'P1'); pair(I, 'Wed', sideP(I, 'hipext@Wed'), sideP(I, 'press@Wed'), 'P1');
    pair(I, 'Fri', sideP(I, 'deadlift@Fri'), sideC(I, 'chest@Fri', 0), 'P1'); pair(I, 'Fri', sideP(I, 'deadlift@Fri'), sideP(I, 'press@Fri'), 'P1');
    Object.assign(kinds, { 'squat@Mon': 'lead', 'hipext@Wed': 'lead', 'deadlift@Fri': 'lead', 'row@Mon': 'partner', 'press@Wed': 'partner', 'press@Fri': 'partner' });
    rules.push({ id: 'Mon knee + pull', cls: 'pull', leadGds: [GD(I, 'quads@Mon')], leadStations: [P(I, 'squat@Mon')], satGds: [GD(I, 'back@Mon')], satStations: [P(I, 'row@Mon')] });
    rules.push({ id: 'Wed hip + push', cls: 'push', leadGds: [GD(I, 'hips@Wed')], leadStations: [P(I, 'hipext@Wed')], satGds: [GD(I, 'chest@Wed')], satStations: [P(I, 'press@Wed')] });
    rules.push({ id: 'Fri hip + push', cls: 'push', leadGds: [GD(I, 'hips@Fri')], leadStations: [P(I, 'deadlift@Fri')], satGds: [GD(I, 'chest@Fri')], satStations: [P(I, 'press@Fri')] });
  }
  if (name === 'crossfit') {
    Object.assign(kinds, { 'row@Mon': 'partner', 'bench@Thu': 'partner' });
    rules.push({ id: 'Mon class squat + pull', cls: 'pull', leadFixed: true, satGds: [GD(I, 'back@Mon')], satStations: [P(I, 'row@Mon')] });
    rules.push({ id: 'Thu class deadlift + push', cls: 'push', leadFixed: true, satGds: [GD(I, 'chest@Thu')], satStations: [P(I, 'bench@Thu')] });
  }
  I.patternOrder = ['back', 'chest', 'quads', 'hips'];                          // rules.volume.pattern_keep.order
  I.partners.forEach((pt) => { pt.kind = kinds[pt.id] || 'keep'; });
  // the paired upper of a day may also stay WITHOUT its work lift, as an ordinary keep station (counted in the weekly maximum):
  // the same exercise as a second station object, never on together with its partner form
  I.exclusive = [];
  I.partners.slice().forEach((pt, pi) => { if (pt.kind !== 'partner') return; I.partners.push({ ...pt, id: pt.id + '*', kind: 'keep', leadPair: true }); I.exclusive.push([pi, I.partners.length - 1]); });
  // a lead station that is the work lift of a group cannot sit beside that group's own training of the day: nothing to add (y <= 1 - z)
  I.partnerRules = o.noRules ? [] : rules.map((r) => ({ ...r, satGds: (r.satGds || []).filter((x) => x != null), satStations: (r.satStations || []).filter((x) => x >= 0), leadGds: (r.leadGds || []).filter((x) => x != null), leadStations: (r.leadStations || []).filter((x) => x >= 0) }));
  const pf = o.patternFactor ?? 1.1;
  I.days.forEach((d) => { d.band = Math.floor(d.minutes * 60 * pf) - Math.floor(d.minutes * 60); });
  let q = 0; const acc = (x) => { if (x) q = gcd(q, x); };
  I.gds.forEach((gd) => gd.cands.forEach((c) => { acc(c.work[0]); acc(c.work[1]); acc(c.rest[0]); acc(c.rest[1]); }));
  I.partners.forEach((p) => { acc(p.work[0]); acc(p.rest[0]); acc(p.rest[1]); }); I.days.forEach((d) => { d.fixedW.forEach(acc); acc(d.limit[0]); });
  I.timeQuantum = q || 1;
  return I;
}

export function solve(name, o = {}) {
  const t0 = process.hrtime.bigint();
  const I = decorate(S[name](o), name, o);
  const s1 = planEndpoints(I, { noPartners: !!o.noStations, coreAlways: !!o.coreAlways, trace: !!process.env.TRACE });
  if (process.env.TRACE) console.log(s1.audit.log.join('\n'));
  if (!s1.plan) return { I, s1, s2: null, ms: Number(process.hrtime.bigint() - t0) / 1e6 };
  // stage 2 places against the pinned day limits (chosen minutes + the pinned overrun)
  const L = I.days.map((d) => d.limit.slice());
  I.days.forEach((d, i) => { d.limit = [L[i][0] + s1.band[i], L[i][1] + s1.band[i]]; });
  const s2 = placeBlock(I, s1, { tiers: TIERS });
  I.days.forEach((d, i) => { d.limit = L[i]; });
  // CORE check on every week: the day without its pattern stations, with that week's own costs, inside the chosen minutes
  const none = I.partners.map(() => false), viol = [...s2.violations];
  // reported, not a rule of the finished plan: the largest day without its kept movements (what the trained work alone takes)
  const coreMax = I.days.map((d, i) => Math.max(...s2.weeks.map((wk) => dayTime(I, i, blockSel(blockOfWeek(I, wk.w)), d.fixedW[wk.w - 1], wk.sets, none, null))));
  return { I, s1, s2, viol, coreMax, ms: Number(process.hrtime.bigint() - t0) / 1e6 };
}

const f1 = (s) => (Math.round(s / 6) / 10).toFixed(1);
export function show(title, r, detail = false) {
  const { I, s1, s2 } = r, out = [];
  out.push(`### ${title}`);
  if (!s2) { out.push(s1.formatMin ? '   no plan: the fixed blocks (and the partner a class lift needs) do not fit this session length - the format starts at a longer session' : '   no plan'); return out.join('\n'); }
  const N = I.N, w1 = s2.weeks[0], wN = s2.weeks[N - 1];
  out.push(`   trained directly: ${s1.kept.map((g) => `${I.groups[g].id} ${w1.Qmain[g] / 4} -> ${wN.Qmain[g] / 4}`).join(', ') || 'no group'}`);
  out.push(`   kept movements (2 sets, not counted as trained): ${I.partners.map((p, pi) => (s1.plan.y[pi] ? `${p.id} [${p.kind}]` : null)).filter(Boolean).join(', ') || '-'}`);
  out.push(`   not trained directly: ${I.groups.map((g, gi) => (s1.kept.includes(gi) ? null : `${g.id} (${s1.reasons[gi] || 'time'})`)).filter(Boolean).join(', ')}`);
  out.push(`   all resistance sets by week: ${s2.weeks.map((w) => w.total).join(' ')}   (flat weeks ${s2.stair.flats}, arithmetic minimum ${Math.max(0, N - 1 - s2.groups.reduce((a, g) => a + g.P - g.S, 0))})`);
  out.push(`   minutes per day, week 1 / longest week (chosen ${I.days[0].minutes}; overrun pinned ${s1.band.map((b, i) => `${I.days[i].id} ${f1(b)}`).join(', ')}): ${I.days.map((d, i) => `${d.id} ${f1(w1.seconds[i])} / ${f1(Math.max(...s2.weeks.map((w) => w.seconds[i])))}`).join(', ')}`);
  out.push(`   longest day without the kept movements: ${I.days.map((d, i) => `${d.id} ${f1(r.coreMax[i])}`).join(', ')}`);
  out.push(`   exercises per day (resistance): ${I.days.map((d, i) => `${d.id} ${w1.exercises[i]}`).join(', ')}; supersets needed on: ${I.days.filter((d, i) => s2.needed[i]).map((d) => d.id).join(', ') || 'no day'}`);
  out.push(`   notes: ${[...s1.notes, ...s2.notes].join('; ') || '-'} | questions ${s1.audit.calls}, nodes ${s1.audit.nodes} (largest ${s1.audit.maxNodes}), unknown ${s1.audit.unknown}, ${r.ms.toFixed(0)} ms | violations in any week: ${r.viol.length}${r.viol.length ? ' ' + r.viol.slice(0, 3).join('; ') : ''}`);
  if (detail) {
    I.days.forEach((d, di) => {
      const parts = [];
      I.gds.forEach((gd, gi) => { if (gd.d === di && s1.plan.K[gi]) parts.push(`${I.groups[gd.g].id}: ${gd.cands.slice(0, s1.plan.K[gi]).map((c, i) => `${c.cls} ${w1.sets[gi][i]}${wN.sets[gi][i] !== w1.sets[gi][i] ? '->' + wN.sets[gi][i] : ''}`).join(' + ')}`); });
      I.partners.forEach((p, pi) => { if (p.d === di && s1.plan.y[pi]) parts.push(`[${p.id.split('@')[0]} ${p.cls} 2]`); });
      out.push(`      ${d.id} (${d.label}): ${parts.join('; ') || '-'}`);
    });
    for (const g of s1.kept) out.push(`      ${I.groups[g].id} by week: ${s2.weeks.map((w) => w.Qmain[g] / 4).join(' ')}`);
    I.days.forEach((d, i) => out.push(`      ${d.id} minutes by week: ${s2.weeks.map((w) => f1(w.seconds[i])).join(' ')}`));
  }
  return out.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const lines = [];
  const run = (title, name, o, detail) => { const r = solve(name, o); const t = show(title, r, detail); console.log(t + '\n'); lines.push(t); return r; };
  console.log('## Decision table D1: the 2 x 45 pickleball plan under the three readings (judge 1, section 4)\n');
  run('D1-a  DEFAULT: who is trained is decided inside 45; the kept movements may use the 10 % band; the smallest overrun is pinned', 'pickleball', { care: 'one' }, true);
  run('D1-b  45 exactly for everything (pattern factor 1.00)', 'pickleball', { care: 'one', patternFactor: 1 }, true);
  run('D1-c  45 exactly, core opener switched off by the person', 'pickleball', { care: 'one', patternFactor: 1, core: false }, true);
  run('D1-c2 45 exactly, athletic piece switched off by the person', 'pickleball', { care: 'one', patternFactor: 1, athletic: false }, true);
  run('D1-x  REJECTED variant of the default: the day without its kept movements must fit 45 in EVERY tier (R-TIME.CORE never dropped)', 'pickleball', { care: 'one', coreAlways: true }, true);
  run('D1-d  no kept movements at all (the worked example of 12 section 5.5: R-PARTNER and stations off)', 'pickleball', { care: 'one', patternFactor: 1, noStations: true, noRules: true }, true);
  console.log('## The same client at other lengths (default reading)\n');
  for (const m of [30, 60, 75, 90]) run(`2 x ${m}`, 'pickleball', { care: 'one', minutes: m });
  console.log('## 01 swimmer 3 x 60\n');
  run('DEFAULT', 'swimmer', {}, true);
  run('60 exactly for everything (pattern factor 1.00)', 'swimmer', { patternFactor: 1 }, true);
  run('default, no strength rest in the last exercise block (open item O-17)', 'swimmer', { vol3Strength: false });
  for (const m of [45, 75, 90]) run(`3 x ${m}`, 'swimmer', { minutes: m });
  console.log('## 04 CrossFit-style class 4 x 60\n');
  run('DEFAULT', 'crossfit', {}, true);
  run('60 exactly for everything (pattern factor 1.00)', 'crossfit', { patternFactor: 1 }, true);
  for (const m of [45, 75, 90]) run(`4 x ${m}`, 'crossfit', { minutes: m });
}
