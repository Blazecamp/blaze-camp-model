import { load, intake } from './snapgen.mjs';
const { model, gen } = await load();
for (const name of ['08-pickleball-genpop', '01-swimming', '04-crossfit-style-bootcamp']) {
  const plan = gen.generate(intake(name), model);
  console.log('##', name);
  for (const k of ['plyo_contacts', 'jump_contacts', 'low_contacts', 'throws', 'cod_cuts', 'sprint_m', 'olympic_sets']) {
    console.log(k.padEnd(14), 'target', plan.weeks.map((w) => w.athletic_budget.targets[k]).join(' '), '| engine planned', plan.weeks.map((w) => w.athletic_budget.planned[k]).join(' '));
  }
  console.log('stage', plan.weeks.map((w) => w.plyo_stage).join(' '), '| share', plan.weeks.map((w) => w.athletic_budget.plyo_share).join(' '));
  console.log('level', plan.weeks.map((w) => w.stair_level).join(' '));
  console.log('rep_phase', plan.weeks.map((w) => w.rep_phase).join(' '), '| rir', plan.weeks.map((w) => w.planned_rir.min + '-' + w.planned_rir.max + (w.planned_rir.intensifiers ? '+' : '')).join(' '));
}
