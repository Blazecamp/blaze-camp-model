import { load, intake } from './snapgen.mjs';
const { model, gen } = await load();
const name = process.argv[2] || '08-pickleball-genpop';
const weeksArg = (process.argv[3] || '1,last').split(',');
const plan = gen.generate(intake(name), model);
const m = plan.meta;
console.log('##', name, '| family', m.family, '| profile', JSON.stringify(m.profile), '| level', m.level, '| template', JSON.stringify(m.template), '| weeks', m.weeks, '| season', m.season);
console.log('targets', JSON.stringify(m.targets));
console.log('time_check', JSON.stringify(plan.time_check).slice(0, 3000));
console.log('offers', JSON.stringify(plan.offers).slice(0, 1500));
console.log('shape', JSON.stringify(plan.shape).slice(0, 1500));
const N = plan.weeks.length;
for (const wa of weeksArg) {
  const wi = wa === 'last' ? N - 1 : Number(wa) - 1;
  const w = plan.weeks[wi];
  console.log(`\n=== week ${w.n} block ${w.training_block} ${w.block_type} exblock ${w.exercise_block} stair_week ${w.stair_week} rep_phase ${w.rep_phase} stage ${w.plyo_stage} rir ${JSON.stringify(w.planned_rir)} test ${JSON.stringify(w.test)}`);
  console.log(' main_sets_by_group', JSON.stringify(w.main_sets_by_group), 'total_main', w.total_main_sets);
  console.log(' athletic_budget', JSON.stringify(w.athletic_budget).slice(0, 1200));
  for (const d of w.days) {
    console.log(`\n -- ${d.weekday} ${d.day_type} kind=${d.kind} optional=${d.optional} full_body=${d.full_body} est=${d.est_minutes} limit=${d.minutes_limit} ss_on=${JSON.stringify(d.supersets_on)} needed=${JSON.stringify(d.supersets_needed)}`);
    for (const b of d.blocks) for (const it of b.items) {
      const reps = it.reps ? (it.reps.type + ':' + (it.reps.min ?? it.reps.value ?? '') + (it.reps.max != null ? '-' + it.reps.max : '')) : '';
      const rest = it.rest ? (it.rest.type + ':' + (it.rest.min ?? '') + '-' + (it.rest.max ?? '')) : '';
      console.log(`    ${b.kind.padEnd(11)} ${String(it.role).padEnd(13)} ${String(it.bucket).padEnd(22)} ${String(it.group).padEnd(10)} ${String(it.sets).padStart(2)} x ${reps.padEnd(16)} rest ${rest.padEnd(18)} ${String(it.laterality||'').padEnd(11)} ss=${it.superset||'-'} ${it.origin} ${it.exercise_id||it.text_key||''} cr=${JSON.stringify(it.credits||{})} ${it.athletic?('ath='+JSON.stringify(it.athletic)).slice(0,120):''}`);
    }
  }
}
