// Read-only helper: compact dump of a sample plan (current engine output) for the design hand-simulation.
import fs from 'node:fs';
const [,, file, ...wks] = process.argv;
const p = JSON.parse(fs.readFileSync(file, 'utf8'));
const W = wks.length ? wks.map(Number) : [1, p.weeks.length];
console.log('template', JSON.stringify(p.meta.template), 'level', p.meta.level.client, 'mod', p.meta.targets.modifier_id, 'weeks', p.weeks.length);
console.log('targets.start', JSON.stringify(p.meta.targets.start)); console.log('targets.cap', JSON.stringify(p.meta.targets.cap));
console.log('level_start', JSON.stringify(p.meta.targets.level_start)); console.log('level_cap', JSON.stringify(p.meta.targets.level_cap));
console.log('time_check', JSON.stringify(p.time_check).slice(0, 1500));
for (const wn of W) {
  const w = p.weeks[wn - 1];
  console.log(`\n== week ${wn} eb=${w.exercise_block} rir=${JSON.stringify(w.planned_rir)} rep_phase=${w.rep_phase} stage=${w.plyo_stage} test=${JSON.stringify(w.test)}`);
  console.log('  main_sets_by_group', JSON.stringify(w.main_sets_by_group), 'tot', w.total_resistance_sets, 'ath', JSON.stringify(w.athletic_budget && { planned: w.athletic_budget.planned, targets: w.athletic_budget.targets }));
  for (const d of w.days) {
    console.log(`  -- ${d.weekday} ${d.day_type} kind=${d.kind} opt=${d.optional} fb=${d.full_body} est=${d.est_minutes}/${d.minutes_limit} ss_on=${d.supersets_on} groups=${JSON.stringify(d.groups)}`);
    for (const b of d.blocks) for (const it of b.items) {
      const cr = Object.entries(it.credits || {}).map(([k, v]) => k + ':' + v).join(',');
      console.log(`     [${b.kind}] ${it.slot_id} ${it.bucket} role=${it.role} org=${it.origin} g=${it.group} sets=${it.sets} reps=${it.reps ? (it.reps.min + '-' + it.reps.max + (it.reps.type === 'seconds' ? 's' : '')) : ''} rest=${it.rest ? it.rest.min + '-' + it.rest.max : ''} lat=${it.laterality} ss=${it.superset} ex=${it.exercise_id} cr=${cr}${it.athletic ? ' ATH=' + JSON.stringify(it.athletic).slice(0, 120) : ''}${it.wod ? ' WOD=' + JSON.stringify(it.wod).slice(0, 100) : ''}${it.test ? ' TEST' : ''}`);
    }
  }
}
