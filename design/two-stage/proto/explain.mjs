// design/two-stage/proto/explain.mjs - the user-facing "before week 1" block for the three samples (EN text built from the plan data).
//   node explain.mjs
import * as S from './samples.mjs';
import { solve, lengthOffers, minutesMissing, bindingDays } from './offers.mjs';
import { report } from './stage2.mjs';

const cases = [
  { fn: 'pickleball', o: { minutes: 45, care: 'one' }, days: 2, switches: [['core opener off (both days)', { core: false }], ['athletic piece off (both days)', { athletic: false }], ['cuff care inside the warm-up (no separate item)', { care: 'warmup' }], ['the engine\'s two joint-care items a day', { care: 'engine' }], ['day limit 110 % (R2-SES-05 "a little longer day")', { factor: 1.1 }]] },
  { fn: 'swimmer', o: { minutes: 60 }, days: 3, switches: [['core opener off (all days)', { core: false }], ['Olympic lift off (all days)', { oly: false }], ['athletic block off (all days)', { athletic: false }], ['no strength rests in the last exercise block (open item O-17)', { vol3Strength: false }], ['day limit 110 %', { factor: 1.1 }]] },
  { fn: 'crossfit', o: { minutes: 60 }, days: 4, switches: [['skill block off (Mon, Thu)', { skill: false }], ['core opener off (all days)', { core: false }], ['class-lift rest 3 min instead of 4.5 (time model, P-18)', { classRest: 180 }], ['WOD 15 min instead of 10', { wod: 15 }], ['day limit 110 %', { factor: 1.1 }]] },
];
for (const c of cases) {
  const base = solve(S[c.fn], c.o), { I, s1, s2, sum } = base;
  console.log('\n' + '='.repeat(110));
  console.log(report(I, s1, s2));
  console.log(`\nfixed blocks: ${I.days.map((d) => `${d.id} ${d.parts ? d.parts.filter((p) => p[1]).map((p) => `${p[0]} ${(p[1] / 60).toFixed(1)}`).join(' + ') : ''} = ${(d.fixed[1] / 60).toFixed(1)} min`).join(' | ')}`);
  console.log('\n-- told before week 1 --');
  console.log(`Your ${c.days} x ${c.o.minutes} minutes hold: ${sum.lines.join(', ')}${sum.pattern.length ? `; one ${sum.pattern.join(' / ')} exercise stays as a pattern station` : ''}.`);
  for (let g = 0; g < I.groups.length; g++) {
    if (s1.kept.includes(g)) continue;
    const why = s1.reasons[g];
    if (why === 'credit_only') { console.log(`  ${I.groups[g].id}: counted from compound credit (your profile does not train it directly).`); continue; }
    if (why === 'no_station') { console.log(`  ${I.groups[g].id}: no exercise of its own in this week layout; counted from compound credit.`); continue; }
    if (why === 'template') { console.log(`  ${I.groups[g].id}: not trained directly - this week layout cannot hold it at any session length (another training day can).`); continue; }
    const m = minutesMissing(I, s1, g), bd = bindingDays(I, s1, g);
    console.log(`  ${I.groups[g].id}: not trained directly (time)${m == null ? ' - no session length adds it on this layout' : ` - it would need about ${m} more minute${m === 1 ? '' : 's'} a day beside the groups above`}${bd.length ? `; the day that refuses it: ${bd.join(' or ')}` : '; more than one day is short'}.`);
  }
  console.log('offers (each one re-solved):');
  for (const of of lengthOffers(S[c.fn], c.o, sum)) console.log(`  ${c.days} x ${of.minutes}: ${of.adds.length ? 'adds ' + of.adds.join(', ') : of.same ? 'nothing changes' : 'same groups, higher peaks'}${of.loses.length ? ` (and ${of.loses.join(', ')} moves to compound credit)` : ''} -> ${of.lines.join(', ')} | sets ${of.sets[0]} -> ${of.sets[1]}`);
  console.log('switches (each one re-solved):');
  for (const [label, d] of c.switches) { const r = solve(S[c.fn], { ...c.o, ...d }); console.log(`  ${label}: ${r.sum.lines.join(', ') || 'no group fits'}${r.sum.pattern.length ? ' | pattern ' + r.sum.pattern.join(',') : ''} | sets ${r.sum.sets[0]} -> ${r.sum.sets[1]} | longest day ${r.sum.longest.toFixed(1)}`); }
}
