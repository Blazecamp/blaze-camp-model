// design/spec_checks/fix/stage1.mjs - COPY of design/two-stage/proto/stage1.mjs with the one change of PLANNER_SPEC.md 7.6 (judge 2, D1):
//   every G1 keep question leaves EVERY later trainable group free (the prototype fixed later groups that credit nobody to 'off',
//   which loses plans when a later group hosts a pattern station that credits a group of the question).
// (original header) PROTOTYPE: stage 1 of the two-stage planner (the block table's two endpoint weeks and
// their packing certificate). Lexicographic tiers, each frozen before the next; every question goes to the exact oracle.
//   G1  keep vector: in the coach's keep order, group by group ("is there a legal plan with every kept group and this one?")
//   G3  pattern stations for big movers that are not trained directly, in keep order
//   G5  peaks: priority water-filling on relative progress with exact "can this group go one set higher?" questions
//   G6  week 1: keep the level's climb (peak - (C - S)), never under the floor, never above the level start
//   G7  canonical structure: most exposure days, fewest exercises, most even split, the earlier day takes the odd set
// The witness of the last question is the CERTIFICATE handed to stage 2 (structure, week-1 and peak sets per group-day).
import { ask } from './oracle.mjs';   // the fixed copy beside this file
import { checkEndpoints, setsAt, credits, directs } from '../../two-stage/proto/core.mjs';

const sum = (a) => a.reduce((x, y) => x + y, 0);

export function planEndpoints(I, opt = {}) {
  const NG = I.groups.length;
  const budget = opt.budget || 200000;
  const audit = { calls: 0, reused: 0, nodes: 0, maxNodes: 0, unknown: 0, log: [], fits: [], no: [] };
  const sess = {};                                                             // per-session limit overrides (56 = 14 sets) for groups that need them
  const Q = (q, tag) => {
    const r = ask(I, { ...q, session4: { ...sess, ...(q.session4 || {}) } }, budget);
    audit.calls++; audit.nodes += r.nodes; if (r.nodes > audit.maxNodes) audit.maxNodes = r.nodes; if (r.status === 'unknown') audit.unknown++; else audit[r.status].push(r.nodes);
    if (opt.trace) audit.log.push(`${tag}: ${r.status} (${r.nodes} nodes)`);
    return r;
  };
  const ownGds = (g) => I.gds.map((gd, gi) => (gd.g === g ? gi : -1)).filter((i) => i >= 0);
  const trainable = (g) => !I.groups[g].never && ownGds(g).some((gi) => I.days[I.gds[gi].d].main);
  const donorTo = (h) => { const s = new Set(); I.gds.forEach((gd) => { if (gd.g !== h && gd.cands.some((c) => c.cred[h])) s.add(gd.g); }); return s; };
  const mainOwn = (plan, which) => directs(I, I.gds.map((gd, gi) => setsAt(gd, plan.K[gi], which === 1 ? plan.n1[gi] : plan.nN[gi])), true);

  // ---- G1: keep vector
  const kept = [], dropped = [], reasons = {}, notes = [];
  let witness = null;
  for (let g = 0; g < NG; g++) {
    if (!trainable(g)) { dropped.push(g); reasons[g] = I.groups[g].never || 'no_station'; continue; }
    const must = [...kept, g];
    // later groups stay free only when they can credit a group in `must` (a free group can help a question only as a donor)
    const free = new Set(); for (let h = g + 1; h < NG; h++) if (trainable(h)) free.add(h);                      // FIX (D1): every later group stays free
    const not = []; for (let h = 0; h < NG; h++) if (!must.includes(h) && !free.has(h)) not.push(h);
    let r = Q({ must, not }, `keep ${I.groups[g].id}`);
    if (r.status === 'no') {
      // the usual 11 sets a session is a lower-tier rule (T5): it never costs a group its place - allow the hard 14 for this group
      const r2 = Q({ must, not, session4: { [g]: 56 } }, `keep ${I.groups[g].id} (up to 14 sets a session)`);
      if (r2.status === 'fits') { sess[g] = 56; notes.push(`${I.groups[g].id}: more than 11 sets in one session`); r = r2; }
    }
    if (r.status === 'fits') { kept.push(g); witness = r.plan; continue; }
    dropped.push(g);
    if (r.status === 'unknown') { reasons[g] = 'not_proven'; continue; }
    // template capacity or time? ask the same question with no time rows at all
    const rt = Q({ must, not, session4: { [g]: 56 }, noTime: true }, `capacity ${I.groups[g].id}`);
    reasons[g] = rt.status === 'no' ? 'template' : 'time';
  }
  const notKept = []; for (let h = 0; h < NG; h++) if (!kept.includes(h)) notKept.push(h);
  if (!kept.length) return { kept, dropped, reasons, plan: null, audit, peaks: [], states: I.groups.map(() => 'NONE'), notes, stopped: {} };

  // ---- G3: pattern stations, in keep order of their groups
  const pMust = [], pNot = [];
  const pRank = (pi) => { const k = (I.patternOrder || []).indexOf(I.groups[I.partners[pi].g].id); return k < 0 ? 99 : k; };
  const pOrder = I.partners.map((_, pi) => pi).sort((a, b) => (pRank(a) - pRank(b)) || (I.partners[a].d - I.partners[b].d));
  for (const pi of pOrder) {
    const pt = I.partners[pi];
    if (kept.includes(pt.g) || opt.noPartners || pMust.some((pj) => I.partners[pj].g === pt.g)) { pNot.push(pi); continue; }
    const r = Q({ must: kept, not: notKept, partnerMust: [...pMust, pi], partnerNot: pNot }, `pattern ${pt.id}`);
    if (r.status === 'fits') { pMust.push(pi); witness = r.plan; } else pNot.push(pi);
  }
  const base = { must: kept, not: notKept, partnerMust: pMust, partnerNot: I.partners.map((_, pi) => pi).filter((pi) => !pMust.includes(pi)) };
  { const r = Q(base, 'base'); if (r.status !== 'fits') throw new Error('base question must fit: ' + r.status); witness = r.plan; }

  // ---- G5: peaks by priority water-filling on relative progress; exact questions "is there a legal plan with peaks >= v + e_g?"
  // helper allowance of a group (quarter sets): what the kept donors give it at their floors, at their average credit rate.
  // A constant of the instance and the keep vector (never read from a witness), used to ORDER the ladder and to stop at the ceiling.
  const helperQ = I.groups.map((_, g) => {
    let q = (I.fixedCred && I.fixedCred[g]) || 0;
    for (const d of kept) {
      if (d === g) continue;
      let cr = 0, cnt = 0;
      I.gds.forEach((gd) => { if (gd.g !== d || !I.days[gd.d].main) return; gd.cands.slice(0, 2).forEach((c) => { cr += c.cred[g] || 0; cnt++; }); });
      if (cnt) q += Math.round((I.groups[d].F * cr) / cnt);
    }
    return q;
  });
  // start: a lower bound of EVERY legal plan's peaks (smallest structural week 1 + the minimum climb)
  const v = new Array(NG).fill(0);
  for (const g of kept) {
    const gds = ownGds(g).filter((gi) => I.days[I.gds[gi].d].main);
    const los = gds.map((gi) => Math.min(...I.gds[gi].Ks.map((K) => I.gds[gi].tab.get(K).lo)));
    const forced = gds.filter((gi) => I.groups[g].calves || I.gds[gi].home);
    v[g] = (forced.length ? sum(forced.map((gi) => los[gds.indexOf(gi)])) : Math.min(...los)) + I.groups[g].mc;
  }
  const wits = [witness];
  const sat = (plan, pm) => { const DN = mainOwn(plan, 2); return kept.every((g) => DN[g] >= pm[g]); };
  const askPeaks = (pm, tag) => {
    for (const w of wits) if (sat(w, pm)) { audit.reused++; return { status: 'fits', plan: w }; }      // a known plan already answers it
    const r = Q({ ...base, peakMin: pm, peakMax: tops }, tag);
    if (r.status === 'fits') wits.push(r.plan);
    return r;
  };
  // progress key: (credited peak - start) / (ceiling - start), compared by cross-multiplication; ties in keep order
  const num = (g, x) => 4 * x + helperQ[g] - 4 * I.groups[g].S, den = (g) => Math.max(4, 4 * I.groups[g].C - 4 * I.groups[g].S);
  const lessKey = (a, xa, b, xb) => { const l = num(a, xa) * den(b), r = num(b, xb) * den(a); return l !== r ? l < r : a < b; };
  const top = (g) => { const c4 = Math.min(4 * I.groups[g].C, Math.floor((4 * I.groups[g].S * I.G10k) / 10000)); return Math.floor((c4 - helperQ[g]) / 4); };
  const tops = Object.fromEntries(kept.map((g) => [g, Math.max(top(g), v[g])]));      // the ladder's ceiling is part of every question
  { const r = Q({ ...base, peakMax: tops }, 'ladder base'); if (r.status === 'fits') { witness = r.plan; wits.length = 0; wits.push(witness); } else for (const g of kept) delete tops[g]; }
  const frozen = new Set(), stopped = {};
  for (let guard = 0; guard < 600; guard++) {
    let pick = -1;
    for (const g of kept) {
      if (frozen.has(g)) continue;
      if (v[g] + 1 > top(g)) { frozen.add(g); stopped[g] = 'ceiling'; continue; }
      if (pick < 0 || lessKey(g, v[g], pick, v[pick])) pick = g;
    }
    if (pick < 0) break;
    const pm = Object.fromEntries(kept.map((g) => [g, v[g] + (g === pick ? 1 : 0)]));
    const r = askPeaks(pm, `raise ${I.groups[pick].id} to ${v[pick] + 1}`);
    if (r.status === 'fits') { v[pick]++; witness = r.plan; }
    else { frozen.add(pick); stopped[pick] = r.status === 'no' ? 'time' : 'not_proven'; }
  }
  let pin = { ...base, peakMin: Object.fromEntries(kept.map((g) => [g, v[g]])), peakMax: Object.fromEntries(kept.map((g) => [g, v[g]])) };
  { const r = Q(pin, 'pin peaks');
    if (r.status === 'fits') witness = r.plan;
    else {                                                                      // only after a 'not proven' freeze: keep the best certified plan
      const DN = mainOwn(witness, 2); for (const g of kept) v[g] = DN[g];
      pin = { ...base, peakMin: Object.fromEntries(kept.map((g) => [g, v[g]])), peakMax: Object.fromEntries(kept.map((g) => [g, v[g]])) };
      notes.push('peaks: best certified plan kept (a tier was not proven)');
    } }

  // ---- G6: week 1 keeps the level's climb: target = peak - (C - S), clamped to [floor, level start]; nearest legal value, lower first
  const w1 = {};
  for (const g of kept) {
    const grp = I.groups[g];
    const credPeak4 = 4 * v[g] + helperQ[g];
    const want4 = Math.min(4 * grp.S, Math.max(4 * grp.F, credPeak4 - 4 * (grp.C - grp.S)));
    const want = Math.min(Math.ceil((want4 - helperQ[g]) / 4), v[g] - grp.mc);
    let done = false;
    for (let delta = 0; delta <= 14 && !done; delta++) {
      for (const t of delta === 0 ? [want] : [want - delta, want + delta]) {
        if (t < 0 || t > v[g] - grp.mc) continue;
        const r = Q({ ...pin, w1Min: { ...w1, [g]: t }, w1Max: { ...w1, [g]: t } }, `week 1 ${grp.id} = ${t}`);
        if (r.status === 'fits') { w1[g] = t; witness = r.plan; done = true; break; }
      }
    }
    if (!done) w1[g] = mainOwn(witness, 1)[g];
  }
  const pin2 = { ...pin, w1Min: { ...w1 }, w1Max: { ...w1 } };

  // ---- G7: canonical structure by pinned questions: most exposure days, then fewest exercises, then the most even split
  const pinsA = new Map(), pinsB = new Map();                                  // gdIndex -> predicate on endpoint states
  const allowA = (gi, s) => { const f = pinsA.get(gi); return f ? f(s) : true; };
  const allowB = (gi, s) => { const f = pinsB.get(gi); return f ? f(s) : true; };
  const snapshot = () => [new Map(pinsA), new Map(pinsB)];
  const restore = ([a, b]) => { pinsA.clear(); for (const [k, f] of a) pinsA.set(k, f); pinsB.clear(); for (const [k, f] of b) pinsB.set(k, f); };
  const addPin = (map, gi, pred) => { const old = map.get(gi); map.set(gi, old ? (s) => old(s) && pred(s) : pred); };
  const askPinned = (tag) => { const r = Q({ ...pin2, allowA, allowB }, tag); if (r.status === 'fits') witness = r.plan; return r.status === 'fits'; };
  const tryPins = (list, tag) => { const snap = snapshot(); for (const [map, gi, pred] of list) addPin(map, gi, pred); if (askPinned(tag)) return true; restore(snap); return false; };
  const isOn = (s) => s.K > 0, isOff = (s) => s.K === 0;
  for (const g of kept) for (const gi of ownGds(g)) {
    if (!tryPins([[pinsA, gi, isOn], [pinsB, gi, isOn]], `expose ${I.gds[gi].id}`)) tryPins([[pinsA, gi, isOff], [pinsB, gi, isOff]], `off ${I.gds[gi].id}`);
  }
  for (const g of kept) for (const gi of ownGds(g)) {
    if (!witness.K[gi]) continue;
    for (const K of I.gds[gi].Ks) if (tryPins([[pinsA, gi, (s) => s.K === K], [pinsB, gi, (s) => s.K === K]], `K ${I.gds[gi].id} = ${K}`)) break;
  }
  for (const which of ['nN', 'n1']) for (const g of kept) {
    const map = which === 'nN' ? pinsA : pinsB;
    const act = ownGds(g).filter((gi) => witness.K[gi] > 0 && I.days[I.gds[gi].d].main);
    if (!act.length) continue;
    const eq = (val) => (s) => s.n === val;
    const tot = sum(act.map((gi) => witness[which][gi]));
    // every split of `tot` over the active days, the most even first, the earlier day taking the odd set (R3-VOL-03)
    const splits = []; const rec = (i, left, cur) => { if (i === act.length - 1) { splits.push([...cur, left]); return; } for (let x = 0; x <= left; x++) rec(i + 1, left - x, [...cur, x]); };
    rec(0, tot, []);
    const score = (sp) => [Math.max(...sp) - Math.min(...sp), ...sp.map((x) => -x)];
    splits.sort((a, b) => { const x = score(a), y = score(b); for (let t = 0; t < x.length; t++) if (x[t] !== y[t]) return x[t] - y[t]; return 0; });
    let found = false;
    for (const sp of splits) { if (tryPins(act.map((gi, i) => [map, gi, eq(sp[i])]), `split ${which} ${I.groups[g].id} ${sp.join('/')}`)) { found = true; break; } }
    if (!found) tryPins(act.map((gi) => [map, gi, eq(witness[which][gi])]), `fix ${which} ${I.groups[g].id}`);
  }
  const viol = checkEndpoints(I, witness, { session4: sess });
  if (viol.length) throw new Error('stage 1 produced an illegal certificate: ' + viol.join('; '));
  const states = I.groups.map((_, g) => (kept.includes(g) ? 'FULL' : witness.y.some((on, pi) => on && I.partners[pi].g === g) ? 'PATTERN' : 'NONE'));
  return { kept, dropped, reasons, plan: witness, peaks: v, stopped, w1, helperQ, states, audit, notes, sess };
}
