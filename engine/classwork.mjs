// engine/classwork.mjs - engine 0.7 (coach answers round 5): the class formats that are decided on the whole week, after the weeks are
// dosed (engine/generate.mjs calls them before the plan's meta and summary are built). Pure, deterministic, no I/O.
//   * applyBootcampFormat (COACH-R5 R5-GRD-05): the bootcamp varies its format - some days in rounds through all the stations
//     (his "vertical" circuits), some days station by station (sets per muscle, his "horizontal" training); rules.supersets.v7.
//   * applyNamedWods (COACH-R5 R5-GRD-04): the class workout uses the CrossFit community's named benchmark workouts - a "Girl" workout
//     once a week, a "Hero" workout once a block, another popular benchmark every few weeks, the rest varied (the engine's own WODs);
//     each one scaled for a class member by level; rules.conditioning.v7.named_wods.
// Neither changes a muscle set: a circuit station keeps its rounds (its sets) whatever the order it is done in, and a WOD never counts
// as muscle sets (H09).

import { why, roundHalfUp } from './util.mjs';
import { videoOf } from './library.mjs';
import { isNearDuplicate } from './select.mjs';

/**
 * R5-GRD-05: the week's circuit days alternate the two formats and each exercise block swaps them (PROPOSED split); a week with one
 * circuit day takes the formats by exercise block. Marks `item.circuit.format` ('rounds' | 'stations'), the station note and the day's
 * why. Mutates the weeks.
 * @param {object[]} weeks plan weeks @param {object} model @param {object} derived
 */
export function applyBootcampFormat(weeks, model, derived) {
  const BF = model.rules.supersets && model.rules.supersets.v7 && model.rules.supersets.v7.bootcamp_format;
  if (!BF || !(BF.families || []).includes(derived.D1_family)) return;
  const F = BF.formats || ['rounds', 'stations'];
  for (const w of weeks) {
    const days = (w.days || []).filter((d) => d.kind === 'main' && (d.blocks || []).some((b) => b.kind === 'circuit' && (b.items || []).some((it) => it.circuit)));
    const eb = Math.max(0, (w.exercise_block || 1) - 1);
    days.forEach((d, i) => {
      const fmt = F[(i + eb) % F.length];
      for (const b of d.blocks || []) {
        if (b.kind !== 'circuit') continue;
        for (const it of b.items || []) {
          if (!it.circuit) continue;
          it.circuit = { ...it.circuit, format: fmt };
          if (fmt === 'stations' && it.reps && it.reps.type === 'rounds_work') it.reps = { ...it.reps, format: fmt };
          if (fmt === 'stations' && model.has('en', 'note.circuit_stations')) it.notes = (it.notes || []).map((n) => (n && n.key === 'note.circuit' ? { key: 'note.circuit_stations', args: { rounds: it.circuit.rounds, work_s: it.circuit.work_s, transition_s: it.circuit.transition_s } } : n));
        }
      }
      d.why = [...(d.why || []), why('why.bootcamp_format', 'R5-GRD-05', { format: fmt })];
    });
  }
}

/** the named workouts the client can do: every movement resolves to an exercise the kit, the age rules, the pain and the switches allow */
function eligibleWods(NW, model, derived, lvl) {
  const R = model.rules;
  const kit = derived.D8_kit || { tokens: [], machines: [] };
  const kitObj = { tokens: new Set(kit.tokens || []), machines: kit.machines || [] };
  const age = derived.age || 0;
  // (the age and injury rules exactly as V4 / V5 / H12 read them: a 60+ client never takes the never-tags, opt-in or not; without the
  // opt-in only older-ok movements; with it only opt-in-ok ones; an injured / high-volume client never the never-tags; a youth stays on
  // the youth ladder and never lifts from the floor)
  const P = R.population.older;
  const olderAge = age >= P.from_age;
  const optIn = !!(derived.prefs && derived.prefs.older_athletic_opt_in);
  const injured = !!(derived.D7_constraint_band && derived.D7_constraint_band.client_family === 'older_or_pain');
  const neverTags = [...(P.never_tags || []), ...(P.never_tags_phase0_even_with_opt_in || [])];
  const youth = age < R.levels.youth_age;
  const order = R.levels.ladder_order || [], youthMax = order.indexOf(R.levels.youth_max_ladder);
  const yx = R.selection.x2 && R.selection.x2.youth_level_exempt_re ? new RegExp(R.selection.x2.youth_level_exempt_re) : null;
  const A = R.selection.addons || {};
  const never = A.never_pick_statuses || [];
  const exceptionOk = (e) => (A.primary_exceptions || []).some((x) => x.enabled !== false && x.bucket === 'COND_WOD' && x.ids.includes(e.id) && (!x.families || x.families.includes(derived.D1_family)));
  const pains = (derived.pain || []).filter((p) => !(R.volume.pain.refer_if_severity || []).includes(p.severity));
  const avoid = new Set(pains.flatMap((p) => ((R.volume.pain.areas[p.area] || {}).avoid_tags || [])));
  const ok = (id) => {
    if (!model.hasEx(id)) return false;
    const e = model.ex(id);
    if (!model.kitAvailable(e, kitObj)) return false;
    if (never.includes(e.status) && !exceptionOk(e)) return false;
    const tags = e.tags || [];
    if ((olderAge || injured) && neverTags.some((t) => tags.includes(t))) return false;
    if (olderAge && !optIn && !e.older_ok && !(e.athletic && e.athletic.quality === 'landing')) return false;
    if (olderAge && optIn && !e.older_opt_in_ok) return false;
    if (youth && (e.youth_ok === false || tags.includes('olympic_from_floor'))) return false;
    if (youth && youthMax >= 0 && order.indexOf(e.level) > youthMax && !(yx && yx.test(e.id))) return false;
    if ((e.tags || []).some((t) => avoid.has(t))) return false;
    if ((e.tags || []).includes('olympic_from_floor') && !kitObj.tokens.has('barbell_bumpers_platform')) return false;
    if (e.medball && typeof e.medball.max_lb === 'number' && e.medball.max_lb > R.medball.max_lb) return false;
    // (H07: the week's counted heavy squat and hinge are the template's; ATH-10: the full Olympic lifts are an L3 lifter's)
    if ((NW.never_spine_classes || []).includes(e.spine_class)) return false;
    if (e.athletic && e.athletic.olympic_tier === 'L2_plus' && !(NW.l2_plus_levels || []).includes(lvl)) return false;
    return true;
  };
  const out = [];
  for (const wod of NW.library || []) {
    if (!(wod.levels || []).includes(lvl)) continue;
    const picks = [];
    for (const m of wod.movements) {
      const order = (m.scaled_first || []).includes(lvl) ? [...m.ids.slice(1), m.ids[0]] : m.ids.slice();
      const id = order.find(ok);
      if (!id) { picks.length = 0; break; }
      picks.push({ m, id, rx: id === m.ids[0] });
    }
    if (picks.length === wod.movements.length) out.push({ wod, picks });
  }
  return out;
}

/** a WOD item turned into the named workout (scaled by level) */
function namedItem(it, e, lvl, model, derived) {
  const R = model.rules;
  const { wod, picks } = e;
  const cap = wod.cap[lvl];
  const stations = picks.map((p) => p.id);
  const station_reps = picks.map(({ m, id }) => {
    const x = model.ex(id);
    if (m.metres && id === 'run-wod-station') return { type: 'metres', value: m.metres[lvl] };
    if (m.calories && (x.tags || []).includes('machine')) return { type: 'calories', n: m.calories[lvl] };
    if (m.reps) return { type: 'fixed', value: m.reps[lvl] };
    if (m.calories) return { type: 'calories', n: m.calories[lvl] };
    return { type: 'metres', value: m.metres[lvl] };
  });
  let ballLoad = null;
  const station_loads = picks.map(({ m, rx, id }) => {
    const L = !rx && m.load_scaled ? m.load_scaled : m.load;
    if (!L || !L[lvl]) return null;
    if (L.unit === 'medball') {
      // (H11: never above 20 lb; a youth or a 60+ client takes the ball's own top less `youth_older_minus_lb`, as V4 reads it)
      const age = derived.age || 0;
      const mb = model.ex(id).medball;
      const kind = mb && R.medball.loads_lb[mb.kind] ? mb.kind : 'wall_ball';
      const top = (age < R.levels.youth_age || age >= R.population.older.from_age) && R.medball.loads_lb[kind] ? R.medball.loads_lb[kind][1] - (R.medball.youth_older_minus_lb || 0) : R.medball.max_lb;
      const cap = Math.min(top, R.medball.max_lb);
      ballLoad = { type: 'medball_lb', min: Math.min(L[lvl][0], cap), max: Math.min(L[lvl][1], cap) };
      return null;
    }
    return { type: 'lb_range', unit: L.unit, min: L[lvl][0], max: L[lvl][1] };
  });
  const scaled = picks.some((p) => !p.rx) || lvl !== 'L3';
  const first = model.ex(stations[0]);
  const notes = [{ key: 'note.wod' }, { key: 'note.wod_named_' + wod.kind, args: { name: wod.name } }];
  if (model.has('en', 'wod.named.' + wod.id + '.std')) notes.push({ key: 'wod.named.' + wod.id + '.std' });
  if (scaled) notes.push({ key: 'note.wod_named_scaled' });
  if (model.has('en', 'wod.rotation.' + wod.format)) notes.push({ key: 'wod.rotation.' + wod.format });
  return {
    ...it,
    exercise_id: first.id, name_key: first.name_key, cue_key: null, detail: null,
    video: videoOf(model, first), laterality: first.laterality === 'n/a' ? null : first.laterality,
    reps: { type: 'minutes', min: cap, max: cap }, load: ballLoad,
    wod: { format: wod.format, minutes: [cap, cap], stations, station_reps, rounds: wod.rounds ? wod.rounds[lvl] : null,
      station_loads, named: { id: wod.id, kind: wod.kind, name: wod.name, level: lvl, scaled } },
    swaps: [], swap_notes: [], notes,
    why: [why('why.wod', 'D-20'), why('why.wod_named', 'R5-GRD-04', { kind: wod.kind, name: wod.name })]
  };
}

/**
 * R5-GRD-04: the class workout's named benchmark workouts. Per training block and week: a "Girl" workout on one WOD day (the day
 * rotates through the week's WOD days), a "Hero" workout once a block (three quarters into the block, on the week's longest WOD), a
 * popular benchmark every `benchmark_every_weeks` weeks on another WOD day; a day that holds a test keeps its own WOD. Each kind
 * rotates through the workouts the client can do. Mutates the weeks.
 * @param {object[]} weeks @param {object} model @param {object} derived @param {object} shape
 */
export function applyNamedWods(weeks, model, derived, shape) {
  const NW = model.rules.conditioning && model.rules.conditioning.v7 && model.rules.conditioning.v7.named_wods;
  if (!NW || !(NW.families || []).includes(derived.D1_family)) return;
  const variant = (derived.D6_week_layout && derived.D6_week_layout.variant) || '';
  if (NW.not_variant_re && new RegExp(NW.not_variant_re).test(String(variant))) return;
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const all = eligibleWods(NW, model, derived, lvl);
  const byKind = (k) => all.filter((x) => x.wod.kind === k);
  const girls = byKind('girl'), heroes = byKind('hero'), benches = byKind('benchmark');
  if (!all.length) return;
  const n = { girl: 0, hero: 0, benchmark: 0 };
  // (the weeks since the last popular benchmark, counted across the plan: one comes every `benchmark_every_weeks` weeks, moved to the
  // next week when that week holds the Hero workout - so the gap stays inside the coach's 2-4 weeks)
  let sinceBench = 0;
  // the next workout of a kind in its rotation that the slot's day can take: none of its movements is an exercise the day already holds
  // in another item (no second version of the same exercise in a session - the core block's sit-ups and Annie, for one)
  const next = (list, k, slot) => {
    if (!list.length || !slot) return null;
    const dayIds = [...new Set((slot.d.blocks || []).flatMap((b) => b.items || []).filter((it) => it !== slot.it).map((it) => it.exercise_id).filter((id) => id && model.hasEx(id)))];
    const clash = (id) => dayIds.some((d) => d === id || (!model.ex(d).is_athletic && isNearDuplicate(model, model.ex(d), model.ex(id))));
    for (let t = 0; t < list.length; t++) {
      const x = list[(n[k] + t) % list.length];
      if (x.picks.some((pk) => clash(pk.id))) continue;
      n[k] += t + 1;
      return x;
    }
    return null;
  };
  for (const tb of (shape && shape.training_blocks) || []) {
    const ws = weeks.filter((w) => w.training_block === tb.n);
    const L = ws.length;
    const heroAt = L >= 3 ? Math.max(2, Math.min(L - 1, roundHalfUp(L * (NW.hero_at || 0.75)))) : null;
    ws.forEach((w, i) => {
      const k = i + 1;
      const slots = [];
      for (const d of w.days || []) {
        if (!['main', 'optional'].includes(d.kind)) continue;
        const its = (d.blocks || []).flatMap((b) => b.items || []);
        if (its.some((it) => it.test || it.bucket === 'TEST')) continue;
        for (const b of d.blocks || []) (b.items || []).forEach((it, j) => { if (it.bucket === 'COND_WOD' && it.wod && !it.wod.named) slots.push({ d, b, j, it }); });
      }
      sinceBench++;
      if (!slots.length) return;
      const taken = new Set();
      const put = (slot, entry) => {
        if (!slot || !entry) return;
        const old = slot.it.wod.minutes ? slot.it.wod.minutes[1] : 0;
        slot.b.items[slot.j] = namedItem(slot.it, entry, lvl, model, derived);
        const cap = entry.wod.cap[lvl];
        if (typeof slot.d.est_minutes === 'number') slot.d.est_minutes = Math.max(0, roundHalfUp(slot.d.est_minutes + cap - old));
        taken.add(slot);
      };
      // v0.7 G-293 (R5-GRD-04; review r9 04 m1; rules.conditioning.v7.named_wods.main_days_first): the Girl and the Hero go on a main
      // training day where one holds a WOD - skipping the optional day never skips them
      const mainFirst = (list) => { if (!NW.main_days_first) return list; const m = list.filter((s) => s.d.kind === 'main'); return m.length ? m : list; };
      // the Hero workout (once a block): the week's longest WOD
      if (heroAt !== null && k === heroAt && heroes.length) {
        const longest = mainFirst(slots).slice().sort((a, b) => (b.it.wod.minutes[1] - a.it.wod.minutes[1]) || 0)[0];
        put(longest, next(heroes, 'hero', longest));
      }
      // the Girl workout (once a week): the day rotates through the week's WOD days
      const free = () => slots.filter((s) => !taken.has(s));
      if (girls.length && free().length) {
        const f = mainFirst(free());
        for (let t = 0; t < f.length; t++) { const sl = f[(k - 1 + t) % f.length]; const e = next(girls, 'girl', sl); if (e) { put(sl, e); break; } }
      }
      // a popular benchmark every few weeks (not the Hero's week)
      if (benches.length && NW.benchmark_every_weeks && sinceBench >= NW.benchmark_every_weeks && k !== heroAt && free().length) { const f = free(); const sl = f[f.length - 1]; const e = next(benches, 'benchmark', sl); if (e) { put(sl, e); sinceBench = 0; } }
    });
  }
}
