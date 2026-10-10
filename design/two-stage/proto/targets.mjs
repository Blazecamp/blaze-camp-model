import { load, intake } from './snapgen.mjs';
const { model, gen } = await load();
for (const name of ['08-pickleball-genpop', '04-crossfit-style-bootcamp', '01-swimming']) {
  const plan = gen.generate(intake(name), model);
  const m = plan.meta;
  console.log('\n##', name);
  console.log(JSON.stringify(m.targets, null, 0));
  console.log('stairway', JSON.stringify(m.stairway).slice(0, 1500));
  console.log('athletic', JSON.stringify(m.athletic).slice(0, 2500));
  console.log('derived', JSON.stringify(m.derived).slice(0, 2500));
  console.log('time_check', JSON.stringify(plan.time_check));
}
