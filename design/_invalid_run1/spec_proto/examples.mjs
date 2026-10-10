// design/spec_proto/examples.mjs - the spec chain on the research cases and on the shapes of the three hardest samples.
// Illustrative: the research instances leave out optional days, Focus slots, tests and the athletic co-plan (see
// proto_endpoint SIMPLIFICATIONS); starts / ceilings are the plain level table. extend() adds the spec's EXTENSION CANDIDATES:
// on a day that already holds an exercise of a group, further exercises of that group's own buckets may be opened (never a new day).
import fs from 'node:fs';
import { buildInstance, CASES } from './canon_endpoint.mjs';
import { plan, report } from './pipeline.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const KO = R.session.time_fit.keep_order, KA = R.session.time_fit.keep_order_r2.athletic;
const CLS = { RP_BKD: 'BKD', RP_UKD: 'UKD', RP_BHD: 'BHD', RP_UHD: 'UHD', RP_HPUSH: 'HPUSH', RP_VPUSH: 'VPUSH', RP_HPULL: 'HPULL', RP_VPULL: 'VPULL', ISO_QUAD: 'LEG_EXTENSION', ISO_LEG_FLEXION: 'LEG_FLEXION', ISO_CHEST: 'ISO_CHEST', ISO_SIDE_REAR_DELT: 'ISO_SIDE', ISO_BICEP: 'ISO_BICEPS', ISO_TRICEP: 'ISO_TRICEPS', ISO_CALF: 'ISO_CALF' };
const EXT = { quads: ['RP_UKD', 'ISO_QUAD'], hips: ['RP_UHD', 'ISO_LEG_FLEXION'], back: ['RP_VPULL', 'RP_HPULL'], chest: ['ISO_CHEST', 'RP_HPUSH'], shoulders: ['ISO_SIDE_REAR_DELT', 'ISO_SIDE_REAR_DELT'], biceps: ['ISO_BICEP', 'ISO_BICEP'], triceps: ['ISO_TRICEP', 'ISO_TRICEP'] };
const gom = Object.fromEntries(Object.entries(R.muscles.groups.members).flatMap(([g, ms]) => ms.map((m) => [m, g])));
const TM = R.time_model, perSet = (tc) => TM.work_minutes[tc] + TM.rest_class_minutes[TM.rest_class_by_time_class[tc]];
export function extend(I, upTo = 3) {
  const maxSets = I.o.level === 'L1' ? 4 : 5;
  for (const d of I.days) for (const g of I.present) {
    if (g === 'calves') continue;
    const have = d.slots.filter((s) => s.group === g); if (!have.length) continue;
    let k = 0;
    for (const bucket of EXT[g] || []) {
      if (have.length + k >= upTo) break;
      const b = TPL.buckets[bucket], cr = {};
      for (const [mus, c] of Object.entries(R.credit.classes[CLS[bucket]] || {})) { const h = gom[mus]; if (h && h !== 'core') cr[h] = Math.min(4, (cr[h] || 0) + Math.round(4 * c)); }
      d.slots.push({ id: `${d.wd}.ext.${g}.${++k}`, bucket, group: g, tc: b.time_class, cost: perSet(b.time_class), cr, prime: g, ss: null, min: 2, max: b.kind === 'isolation' ? Math.min(4, maxSets) : maxSets, ext: true });
    }
  }
  return I;
}
const racket = CASES[1].o;
const cases = [
  { name: 'P1  racket player 55 y, 2 x 45 (the coach\'s R3-SES-02 example; calves pinned first)', o: racket },
  { name: 'P2  the same player at 2 x 60', o: { ...racket, minutes: 60 } },
  { name: 'P3  the same player at 2 x 75', o: { ...racket, minutes: 75 } },
  { name: 'P4  swimmer-like athlete, 3 x 60, back first (athletic minutes +30 % by the peak)', o: { family: 'athletic', days: 3, minutes: 60, level: 'L2', keepOrder: ['back', ...KA.filter((g) => g !== 'back')], athleticPeak: 1.3 } },
  { name: 'P5  L1 aesthetics, 4 x 60 (12 v1.2 section 5.1 client, keeps the time)', o: CASES[0].o },
  { name: 'P6  L2 aesthetics, 4 x 75, Focus hips', o: CASES[2].o },
  { name: 'P7  L3 aesthetics, 4 x 90 (the research run gave chest 16 -> 18 and shoulders 16 -> 24)', o: CASES[3].o },
  { name: 'P8  L2 field athlete, 3 x 90, athletic minutes +30 % by the peak', o: CASES[4].o },
];
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
if (import.meta.url === `file://${process.argv[1]}`) {
const out = [`Spec chain on research instances. Options: exact pair accounting (DEF-09), a trained group-day has 2-4 exercises, exercises may be opened (extension candidates), total rule 7 %, stairway tiers late > shape > land.`];
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
for (const c of cases) {
  if (only && !only.some((k) => c.name.startsWith(k))) continue;
  for (const fit of (process.env.FITS || '1').split(',').map(Number)) {
    let I; try { I = extend(buildInstance(c.o)); } catch (e) { out.push(`\n## ${c.name}: cannot build (${e.message.slice(0, 60)})`); continue; }
    const t = cpu(); let r; try { r = plan(I, { fit, ...(process.env.TIERS ? { tiers: process.env.TIERS.split(',') } : {}) }); } catch (e) { out.push(`\n## ${c.name} fit ${fit}: ERROR ${e.stack.split('\n').slice(0, 3).join(' | ')}`); continue; }
    out.push(...report(`${c.name}  [day limit = chosen minutes x ${fit.toFixed(2)}]`, I, r), `  planner CPU ${(cpu() - t).toFixed(1)} ms`);
  }
}
console.log(out.join('\n'));
}
