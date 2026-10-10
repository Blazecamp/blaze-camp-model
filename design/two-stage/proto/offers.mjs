// design/two-stage/proto/offers.mjs - PROTOTYPE: R3-SES-02 step 1 (tell up front and offer) computed by RE-SOLVING, never by arithmetic.
//   reasons : for every group that is not trained directly, the smallest number of extra minutes a day that would keep it
//             (exact questions with extraSec, bisected on whole minutes), or "template" when no session length helps
//   offers  : the same intake at every longer legal session length; each offer says what it adds and what it trades
//   switches: the profile's on / off blocks (core, athletic, joint care ...), each re-solved; what each one buys
import { ask } from './oracle.mjs';
import { planEndpoints } from './stage1.mjs';
import { placeBlock } from './stage2.mjs';

export const LEGAL_MINUTES = [30, 45, 60, 75, 90, 105, 120];

/** smallest whole minutes a day that would keep group g together with the kept set (null = no length helps: template capacity) */
export function minutesMissing(I, s1, g) {
  const must = [...s1.kept, g].sort((a, b) => a - b), not = I.groups.map((_, h) => h).filter((h) => !must.includes(h));
  const fits = (min) => ask(I, { must, not, extraSec: min * 60, session4: { ...(s1.sess || {}), [g]: 56 }, noPartners: true }, 100000).status === 'fits';
  if (!fits(240)) return null;
  let lo = 0, hi = 240;                                   // fits(hi) is true, fits(lo) is false (the group was not kept)
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (fits(mid)) hi = mid; else lo = mid; }
  return hi;
}

/** the days whose limit refuses group g: lifting that one day's limit (by two hours) lets kept + g fit */
export function bindingDays(I, s1, g) {
  const must = [...s1.kept, g].sort((a, b) => a - b), not = I.groups.map((_, h) => h).filter((h) => !must.includes(h));
  const out = [];
  I.days.forEach((day, d) => { const x = I.days.map(() => 0); x[d] = 7200; if (ask(I, { must, not, extraByDay: x, session4: { ...(s1.sess || {}), [g]: 56 }, noPartners: true }, 100000).status === 'fits') out.push(day.id); });
  return out;
}

export function summarize(I, s1, s2) {
  const N = I.N;
  return {
    kept: s1.kept.map((g) => I.groups[g].id),
    pattern: I.groups.map((grp, g) => (s1.states[g] === 'PATTERN' ? grp.id : null)).filter(Boolean),
    lines: s1.kept.map((g) => `${I.groups[g].id} ${s2.weeks[0].Qmain[g] / 4} -> ${s2.weeks[N - 1].Qmain[g] / 4}`),
    sets: [s2.weeks[0].total, s2.weeks[N - 1].total],
    longest: Math.max(...s2.weeks.flatMap((w) => w.seconds)) / 60,
  };
}

/** plan one variant of a sample and return its summary (null when no group fits) */
export function solve(make, o) {
  const I = make(o), s1 = planEndpoints(I, {});
  if (!s1.plan) return { I, s1, s2: null, sum: { kept: [], pattern: [], lines: [], sets: [0, 0], longest: 0 } };
  const s2 = placeBlock(I, s1, {});
  return { I, s1, s2, sum: summarize(I, s1, s2) };
}

/** offers at every longer legal length: what each adds, what it trades */
export function lengthOffers(make, o, baseSum) {
  const out = [];
  for (const m of LEGAL_MINUTES) {
    if (m <= (o.minutes)) continue;
    const r = solve(make, { ...o, minutes: m });
    const adds = r.sum.kept.filter((g) => !baseSum.kept.includes(g)), loses = baseSum.kept.filter((g) => !r.sum.kept.includes(g));
    out.push({ minutes: m, adds, loses, lines: r.sum.lines, sets: r.sum.sets, same: !adds.length && !loses.length && r.sum.lines.join() === baseSum.lines.join() });
  }
  return out;
}
