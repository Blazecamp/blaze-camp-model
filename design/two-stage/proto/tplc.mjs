import fs from 'node:fs';
import path from 'node:path';
import { SNAP } from './snapgen.mjs';
const T = JSON.parse(fs.readFileSync(path.join(SNAP, 'model', 'templates.json'), 'utf8'));
const [fam, key] = [process.argv[2] || 'athletic', process.argv[3] || '2'];
const F = T.families[fam].days[key];
console.log('#', F.id, F.status, '|', F.format_note || '', '| variants', Object.keys(F.variants || {}));
console.log('week', Object.entries(F.week_layout).map(([d, v]) => d + ':' + (v.day_type || v.kind)).join(' '));
for (const [dt, D] of Object.entries(F.day_types)) {
  console.log(`\n[${dt}] ${D.label} | kind=${D.kind} format=${D.format} lower_focus=${D.lower_focus} full_body=${D.full_body} groups=${JSON.stringify(D.groups)} axial=${JSON.stringify(D.axial)}`);
  for (const s of D.stations) console.log(`  ${s.id.padEnd(7)} ${String(s.bucket).padEnd(22)} ${String(s.role).padEnd(13)} ${String(s.block).padEnd(12)} g=${String(s.group).padEnd(10)} sets=${JSON.stringify(s.sets_hint)} pair=${s.pair || '-'} ss=${s.superset || '-'} from=${s.include_from_minutes ?? '-'} axial=${s.axial || '-'} var=${s.variant || '-'} cond=${s.condition || '-'} lat=${s.laterality_dial ? 'dial' : '-'} ${s.dose_text ? '| ' + s.dose_text.slice(0, 60) : ''}`);
}
