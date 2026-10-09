// tests/helpers/simple-layout.mjs - contract-shaped stand-ins for week.buildWeekLayout / select.fillSlot (BUILD_PLAN §2).
// Owner: B2. Enough for credits, VOL-07 placement and the 10 % guard; no cuts, no aerobic placement, no pain / older filters.
import { WEEKDAYS } from '../../engine/util.mjs';

const textKey = (bucket) => (bucket === 'WARMUP_GENERAL' ? 'warmup.any_cardio_5min' : null);

function defaultSets(model, st, bucketDef, minutes, calfIndex) {
  const D = model.rules.session.default_sets;
  if (['warmup', 'aerobic', 'skill'].includes(bucketDef.kind)) return null;
  if (st.bucket === 'COND_WOD') return null;
  if (bucketDef.kind === 'resistance') return D.compound;
  if (st.bucket === 'ISO_CALF') return calfIndex === 0 ? D.calves_first : D.calves_second;
  if (bucketDef.kind === 'isolation') return D.isolation;
  if (bucketDef.kind === 'core') return D.core;
  if (bucketDef.kind === 'athletic' || bucketDef.kind === 'power') return minutes >= 90 ? D.athletic_at_90 : D.athletic;
  if (bucketDef.kind === 'focus') return D.focus;
  return D.min;
}

/**
 * A WeekLayout that maps the template's planned days onto `weekdays` in order (optional / aerobic days keep their template
 * weekday when free, else the next free weekday) and turns every station with include_from_minutes <= minutes into a SlotDef.
 * @param {object} model @param {string} templateId e.g. 'athletic.3' @param {string|null} variant @param {string[]} weekdays
 * @param {number} minutes @param {{priority?:string[], focus?:Object<string,string>, supersets?:boolean}} [opts]
 * @returns {object} WeekLayout
 */
export function simpleLayout(model, templateId, variant, weekdays, minutes, opts = {}) {
  const [family, days] = templateId.split('.');
  const t = model.template(family, days);
  const dt = model.dayTypes(t, variant || null);
  const planned = WEEKDAYS.filter(d => { const e = dt.week_layout[d]; return e && e.kind === 'main' && !e.optional && e.day_type; });
  const taken = new Set();
  const placed = [];
  planned.forEach((d, i) => { if (weekdays[i]) { placed.push({ wd: weekdays[i], e: dt.week_layout[d] }); taken.add(weekdays[i]); } });
  for (const d of WEEKDAYS) {
    const e = dt.week_layout[d];
    if (!e || !e.day_type || (e.kind === 'main' && !e.optional)) continue;
    if (!['optional', 'aerobic'].includes(e.kind) && !e.optional) continue;
    const k = WEEKDAYS.indexOf(d);
    let wd = null;
    for (let n = 0; n < 7; n++) { const c = WEEKDAYS[(k + n) % 7]; if (!taken.has(c)) { wd = c; break; } }
    if (!wd) continue;
    taken.add(wd);
    placed.push({ wd, e });
  }
  placed.sort((a, b) => WEEKDAYS.indexOf(a.wd) - WEEKDAYS.indexOf(b.wd));
  const prio = opts.priority || [];
  const out = [];
  for (const { wd, e } of placed) {
    const day = dt.day_types[e.day_type];
    if (!day) continue;
    const blocks = [];
    let calfIndex = 0;
    let ssOn = !!opts.supersets;
    for (const st of day.stations) {
      if (st.include_from_minutes !== null && st.include_from_minutes !== undefined && st.include_from_minutes > minutes) continue;
      if (st.condition && st.condition.startsWith('if_priority:') && !prio.includes(st.condition.split(':')[1])) continue;
      const b = model.bucket(st.bucket);
      const isCalf = st.bucket === 'ISO_CALF';
      const slot = {
        slot_id: wd + '.' + st.id, station_id: st.id, bucket: st.bucket, role: st.role, block: st.block, group: st.group,
        sets_hint: st.sets_hint, default_sets: defaultSets(model, st, b, minutes, isCalf ? calfIndex : 0), pair: st.pair,
        superset: st.superset, circuit: st.circuit, axial_req: st.axial, variant: st.variant, laterality_dial: st.laterality_dial,
        loading: null, focus_muscle: st.bucket === 'FOCUS' && opts.focus ? (opts.focus[wd + '.' + st.id] || null) : null,
        time_class: b.time_class || 'isolation', counts_in_cap: !model.rules.session.outside_cap_blocks.includes(st.block),
        counts_as_volume: st.counts_as_volume !== false, text_key: textKey(st.bucket), aerobic: null, origin: 'template', why: []
      };
      if (isCalf) calfIndex++;
      if (st.superset && st.superset_below_minutes !== null && st.superset_below_minutes !== undefined && minutes < st.superset_below_minutes) ssOn = true;
      let blk = blocks.find(x => x.kind === st.block);
      if (!blk) { blk = { kind: st.block, movable: !!st.movable, circuit: st.circuit || null, slots: [] }; blocks.push(blk); }
      blk.slots.push(slot);
    }
    out.push({
      weekday: wd, day_type: e.day_type, kind: e.kind === 'main' && !e.optional ? 'main' : e.kind, optional: !!e.optional,
      label_key: day.label_key, lower_focus: day.lower_focus, full_body: !!day.full_body, format: day.format, minutes_limit: minutes,
      supersets_on: ssOn, est_minutes: 0, groups: day.groups.slice(), blocks, why: []
    });
  }
  return {
    template_id: t.id, variant: variant || null, family, pairing: 'cross_pattern', program_id: 'TEST', training_block: 1,
    days: out, off_days: WEEKDAYS.filter(d => !taken.has(d)), play_days: [], why: []
  };
}

const CLASS_BY_VARIANT = { side: ['ISO_SIDE'], rear: ['ISO_REAR', 'FACEPULL'], front: ['ISO_FRONT'] };
const OLY_BY_VARIANT = { clean: ['clean', 'loaded_jump'], snatch: ['snatch'], swing: ['swing'], jerk: null };

/**
 * SlotFill with the first default record of the bucket (no KB swing in RP_* slots); FOCUS slots by focus_muscle,
 * ISO_SIDE_REAR_DELT by variant, AP_TRIPLE_EXT by Olympic family. swaps: [].
 * @param {object} slot SlotDef @param {object} model @returns {object} SlotFill
 */
export function simpleFill(slot, model) {
  let pool = model.bySlot(slot.bucket).filter(e => !(slot.bucket.startsWith('RP_') && e.tags.includes('kb_swing')));
  if (slot.bucket === 'FOCUS' && slot.focus_muscle) pool = pool.filter(e => e.credits[slot.focus_muscle] === 1);
  if (slot.bucket === 'ISO_SIDE_REAR_DELT' && slot.variant && CLASS_BY_VARIANT[slot.variant]) pool = pool.filter(e => CLASS_BY_VARIANT[slot.variant].includes(e.credit_class));
  if (slot.bucket === 'AP_TRIPLE_EXT' && slot.variant && OLY_BY_VARIANT[slot.variant]) pool = pool.filter(e => e.athletic && OLY_BY_VARIANT[slot.variant].includes(e.athletic.olympic_family));
  const def = pool.filter(e => model.isDefaultIn(e, slot.bucket));
  const ex = def[0] || pool[0] || null;
  return {
    slot_id: slot.slot_id, bucket: slot.bucket, exercise_id: ex ? ex.id : null, detail: null, swaps: [],
    laterality: ex ? ex.laterality : null, loading: null, why: [], flags: []
  };
}

/** Selection for one exercise block: simpleFill on every slot of the layout @returns {object} Selection */
export function simpleSelection(layout, model, exerciseBlock = 1) {
  const fills = {};
  for (const d of layout.days) for (const b of d.blocks) for (const s of b.slots) fills[s.slot_id] = simpleFill(s, model);
  return { exercise_block: exerciseBlock, fills, buy_list: [], why: [] };
}
