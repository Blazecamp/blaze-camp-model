// app/plan-view.js - turns a plan/2 JSON into what the page shows: the week header, the day tabs, the day card (rows with sets x
// reps, effort, rest, a "+1 set" badge, and the expandable details), the progress tab (weekly sets per group, effort by week, the
// plan's notes) and the release / health lines. Pure (no DOM): the page and tests/app.test.mjs both use it.
//
// Words: every plan word comes from the engine. The day card and the week notes are parsed from engine/render.mjs's own Markdown
// (renderDay / renderWeek / renderPlan), so the wording, the order and every rule the renderer applies stay the engine's. The plan
// JSON adds the structure the Markdown does not carry: each row's exercise, sets, swaps and video link, and last week's sets.
import { WEEKDAYS } from '../engine/util.mjs';
import { renderDay, renderWeek, renderPlan, formatEffort, formatRest } from '../engine/render.mjs';
import { videoOf } from '../engine/library.mjs';
import { plain, sections, stripMarkers } from './md.js';

const DASH = ' — ';
const DOT = ' · ';

const tt = (model, lang, key, args) => stripMarkers(model.t(lang, key, args));
const has = (model, key) => model.has('en', key);

export const weekOf = (plan, n) => (plan.weeks || []).find(w => w.n === n) || null;
export const weeksTotal = (plan) => (plan.shape && plan.shape.weeks_total) || (plan.weeks || []).length;

/** the days a week shows, Monday first: [{weekday, kind, optional}] */
export function dayTabs(plan, n) {
  const w = weekOf(plan, n);
  if (!w) return [];
  return (w.days || []).slice().sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday))
    .map(d => ({ weekday: d.weekday, kind: d.kind, optional: !!d.optional }));
}

/** the first training day of a week (main, else optional, else any) */
export function firstDay(plan, n) {
  const tabs = dayTabs(plan, n);
  const d = tabs.find(x => x.kind === 'main') || tabs.find(x => x.kind === 'optional') || tabs[0];
  return d ? d.weekday : null;
}

/** one line that names the plan: program, goal / sport / activity, days, weeks */
export function summary(plan, model, lang) {
  const m = plan.meta || {};
  const t = (k, a) => tt(model, lang, k, a);
  let who = null;
  const p = m.profile || {};
  if (p.name_key && (p.competitive === 'competitive' || (p.activity_ids || []).length)) {
    const rec = p.name_key + '_recreational';
    who = t(p.competitive !== 'competitive' && has(model, rec) ? rec : p.name_key);
  }
  return {
    program: m.program_name_key && has(model, m.program_name_key) ? t(m.program_name_key) : t('ui.plan.title'),
    goal: m.goal && has(model, 'goal.' + m.goal) ? t('goal.' + m.goal) : '',
    who,
    days: m.days_per_week,
    weekdays: m.weekdays || [],
    weeks: weeksTotal(plan)
  };
}

// ------------------------------------------------------------------------------------------------- legal and health lines

/** the release line (every view; R4-SCP-01 / R4-SCP-02, H20) and the health warning (R5-GEN-02), in the engine's keys */
export function legal(plan, model, lang) {
  const t = (k, a) => tt(model, lang, k, a);
  const L = model.rules.legal || {};
  const RL = L.release_line || {};
  const st = plan.release_stamp || {};
  const lineKey = (RL.by_version || {})[st.version] || (RL.by_version || {})['release.client'] || 'ui.plan.own_risk';
  const url = (L.disclaimer_url && (L.disclaimer_url[lang] || L.disclaimer_url.en)) || null;
  const out = {
    label: has(model, RL.label_key || '') ? t(RL.label_key) : '',
    full: has(model, lineKey) ? t(lineKey) : '',
    short: has(model, RL.short_key || '') ? t(RL.short_key) : t('ui.plan.own_risk_short'),
    footer: has(model, RL.footer_key || '') ? t(RL.footer_key) : '',
    disclaimer: has(model, 'ui.disclaimer') ? t('ui.disclaimer') : '',
    link_text: has(model, RL.link_key || '') ? t(RL.link_key) : 'Disclaimer',
    url,
    health: null
  };
  const HF = L.health_flag;
  const h = plan.meta && plan.meta.health;
  if (HF && HF.on_flag === 'warn' && h && h.warn) {
    const reasons = (h.reasons || []).filter(r => has(model, r)).map(r => t(r)).map(s => s.charAt(0).toLowerCase() + s.slice(1));
    out.health = {
      label: has(model, HF.label_key) ? t(HF.label_key) : '',
      why: reasons.length && has(model, HF.reasons_key) ? t(HF.reasons_key, { reasons: reasons.join('; ') }) : '',
      line: has(model, HF.line_key) ? t(HF.line_key) : '',
      short: has(model, HF.short_key) ? t(HF.short_key) : ''
    };
  }
  if (h && h.bypass && has(model, 'ui.plan.coach_bypass_stamp')) out.bypass = t('ui.plan.coach_bypass_stamp');
  return out;
}

// ------------------------------------------------------------------------------------------------- week header

/** the week's name, test flag, bigger-step flag and its notes (the engine's week preamble, Markdown) */
export function weekInfo(plan, model, lang, n) {
  const w = weekOf(plan, n);
  if (!w) return null;
  const md = renderWeek(plan, n, model, { lang });
  const lines = md.split('\n');
  const start = lines.findIndex(l => /^##\s/.test(l));
  const end = lines.findIndex((l, i) => i > start && /^###\s/.test(l));
  const pre = lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim();
  return {
    n, total: weeksTotal(plan),
    phase: w.phase_key && has(model, w.phase_key) ? tt(model, lang, w.phase_key) : '',
    test: !!w.test,
    test_label: w.test ? tt(model, lang, 'ui.plan.test_week') : '',
    accel: Array.isArray(w.acceleration) && w.acceleration.filter(Boolean).length > 0,
    training_block: w.training_block,
    notes_md: pre
  };
}

// ------------------------------------------------------------------------------------------------- the day card

/** each block's items in the engine's reading order (engine/render.mjs displayBlocks / pairOrder: superset partners together) */
export function displayBlocks(d) {
  const pairOrder = (items) => {
    const out = [], done = new Set();
    for (const it of items) {
      if (done.has(it)) continue;
      out.push(it); done.add(it);
      if (it.superset) for (const x of items) if (!done.has(x) && x.superset === it.superset) { out.push(x); done.add(x); }
    }
    return out;
  };
  const out = new Map(), moved = new Set();
  const blocks = d.blocks || [];
  blocks.forEach((b, bi) => {
    const list = [];
    for (const it of pairOrder(b.items || [])) {
      if (moved.has(it)) continue;
      list.push(it);
      if (!it.superset) continue;
      for (const b2 of blocks.slice(bi + 1)) for (const x of b2.items || []) if (x !== it && x.superset === it.superset && !moved.has(x)) { list.push(x); moved.add(x); }
    }
    out.set(b, list);
  });
  return out;
}

const isItalicLine = (l) => /^_.*_\s*$/.test(l.trim()) || /^_.*_\s\[/.test(l.trim());
const unItalic = (l) => l.trim().replace(/^_(.*)_$/, '$1');

/** parse the engine's day card Markdown (engine/render.mjs dayCard) into a header, notes and blocks of items */
export function parseDayMarkdown(md) {
  const lines = String(md || '').split('\n');
  const out = { head: '', notes: [], blocks: [], loose: [] };
  let i = 0;
  while (i < lines.length && !/^###\s/.test(lines[i])) i++;
  if (i >= lines.length) return out;
  out.head = lines[i].replace(/^###\s+/, '');
  i++;
  // the header notes: italic lines right under the title
  while (i < lines.length && lines[i].trim() && isItalicLine(lines[i])) { out.notes.push(unItalic(lines[i])); i++; }
  let block = null, item = null, sawBlank = false;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { sawBlank = true; continue; }
    // the footer (the short release line) comes after a blank line, at column 0, in italics, outside any item
    if (sawBlank && /^_/.test(line) && (block || out.loose.length)) break;
    const bm = /^\*\*(.+)\*\*\s*$/.exec(line);
    if (bm && !/^\d+\.\s/.test(line)) { block = { title: bm[1], intro: [], items: [] }; out.blocks.push(block); item = null; sawBlank = false; continue; }
    const im = /^(\d+)\.\s+(.*)$/.exec(line);
    if (im && block) { item = { line: im[2], details: [] }; block.items.push(item); sawBlank = false; continue; }
    // an aerobic day's items: '- line' and '  - detail'
    const am = /^-\s+(.*)$/.exec(line);
    if (am && !block) { item = { line: am[1], details: [] }; out.loose.push(item); sawBlank = false; continue; }
    const dm = /^\s{2,}(?:-\s+|>\s?)(.*)$/.exec(line);
    if (dm && item) { item.details.push({ text: dm[1], quote: /^\s{2,}>/.test(line) }); sawBlank = false; continue; }
    if (block && !item && isItalicLine(line)) { block.intro.push(unItalic(line)); sawBlank = false; continue; }
    if (!block && isItalicLine(line)) { out.notes.push(unItalic(line)); sawBlank = false; continue; }
    sawBlank = false;
  }
  return out;
}

/** split an item line 'Name [A1] — dose · effort · rest · SUPERSET W/ x' into its parts (Markdown kept for inline rendering) */
export function splitItemLine(line, model, lang, compact) {
  let head = line, rest = '';
  if (compact) {
    const k = line.indexOf(DOT);
    if (/^\*\*/.test(line)) {
      const e = line.indexOf('**', 2);
      head = line.slice(0, e + 2); rest = line.slice(e + 2).replace(/^\s*·\s*/, '');
    } else if (k >= 0) { head = line.slice(0, k); rest = line.slice(k + DOT.length); }
  } else {
    const k = line.indexOf(DASH);
    if (k >= 0) { head = line.slice(0, k); rest = line.slice(k + DASH.length); }
  }
  let name = head, tag = '';
  const sm = /^(.*?)\s*\[([A-Z]\d+)\]\s*$/.exec(head);
  if (sm) { name = sm[1]; tag = sm[2]; }
  name = name.trim().replace(/^\*\*(.*)\*\*$/, '$1');
  // the '(bonus)' / '(Focus)' tag the engine adds inside the name
  const tags = [];
  for (const k of ['ui.plan.bonus_tag', 'ui.plan.focus_tag']) {
    const word = has(model, k) ? model.t(lang, k) : '';
    if (word && name.endsWith(' ' + word)) { name = name.slice(0, -(word.length + 1)); tags.push(word.replace(/[()]/g, '')); }
  }
  const sw = has(model, 'ui.plan.superset_with') ? model.t(lang, 'ui.plan.superset_with') : 'SUPERSET W/';
  const parts = rest ? rest.split(DOT) : [];
  let superset = '';
  const kept = [];
  for (const p of parts) { if (p.startsWith(sw)) superset = p.slice(sw.length).trim(); else kept.push(p); }
  return { name, superset_tag: tag, tags, dose: kept[0] || '', meta: kept.slice(1), superset_with: superset };
}

function prefixOf(model, lang, key) {
  if (!has(model, key)) return null;
  const s = model.t(lang, key);
  const k = s.indexOf('{');
  return (k > 0 ? s.slice(0, k) : s).trim();
}

/** 'about 85-105 min' - the day's estimate as the engine words it in its tables (rules.render.estimate; information only, CT-01) */
export function estShort(model, lang, min) {
  const E = model.rules.render && model.rules.render.estimate;
  if (E && Array.isArray(E.range_factor) && E.round_to_min > 0 && has(model, 'ui.plan.est_range')) {
    const r = E.round_to_min;
    const low = Math.max(r, Math.round(min * E.range_factor[0] / r) * r), high = Math.round(min * E.range_factor[1] / r) * r;
    if (high > low) return tt(model, lang, 'ui.plan.est_range', { low, high });
  }
  return tt(model, lang, 'ui.plan.est_minutes', { min });
}

/** a dose in short form for the compact row: '4 × 10 to 12 Reps' -> '4 × 10-12', '3 × 8 a 12 por lado' -> '3 × 8-12 por lado' */
export function shortDose(s) {
  return String(s || '').replace(/(\d+)\s+(?:to|a)\s+(\d+)/g, '$1-$2').replace(/(\d)\s+(?:Reps?|reps?)\s*$/, '$1');
}
/** a rest or effort note in short form: '60-120 s rest' -> '60-120 s', '2-3 min de descanso' -> '2-3 min' */
export function shortMeta(s) {
  return String(s || '').replace(/^(\d+(?:-\d+)?\s*(?:s|min))\s+(?:rest|de descanso)$/, '$1').replace(/(\d+)\s+(?:to|a)\s+(\d+)/g, '$1-$2');
}

/** the set-count change of an item against the same slot last week: {kind:'new'} | {kind:'sets', n} | null */
export function changeBadge(plan, n, weekday, it) {
  if (n <= 1 || !it || !it.slot_id || !it.exercise_id) return null;
  const pw = weekOf(plan, n - 1);
  const pd = pw && (pw.days || []).find(d => d.weekday === weekday);
  if (!pd) return null;
  const prev = (pd.blocks || []).flatMap(b => b.items || []).find(x => x.slot_id === it.slot_id);
  if (!prev || prev.exercise_id !== it.exercise_id) return { kind: 'new' };
  if (typeof it.sets === 'number' && typeof prev.sets === 'number' && it.sets !== prev.sets) return { kind: 'sets', n: it.sets - prev.sets };
  return null;
}

/**
 * The day card: title, time estimate, tips, blocks of rows. Each row: name, dose, effort / rest, badges, and details (how to
 * progress, notes, cue, swaps with what they keep and lose, the YouTube search and the exact name to copy).
 */
export function dayCard(plan, model, lang, n, weekday) {
  const w = weekOf(plan, n);
  const d = w && (w.days || []).find(x => x.weekday === weekday);
  if (!d) return null;
  const md = renderDay(plan, n, weekday, model, { lang });
  const p = parseDayMarkdown(md);
  const t = (k, a) => tt(model, lang, k, a);
  const card = {
    weekday, kind: d.kind, optional: !!d.optional,
    weekday_name: t('weekday.' + weekday),
    title: p.head.includes(DOT) ? p.head.slice(p.head.indexOf(DOT) + DOT.length) : p.head,
    est: null, tips: [], blocks: [], exercise_count: typeof d.exercise_count === 'number' ? d.exercise_count : null, mapped: false
  };
  const notes = p.notes.slice();
  if (typeof d.est_minutes === 'number' && d.est_minutes > 0 && notes.length && (d.kind === 'main' || d.kind === 'optional')) {
    card.est = notes.shift();
    card.est_short = estShort(model, lang, d.est_minutes);
  }
  card.tips = notes;

  // the JSON blocks in the same order as the Markdown blocks (a block with no shown item prints nothing)
  const shown = displayBlocks(d);
  const jsonBlocks = (d.blocks || []).map(b => ({ b, list: shown.get(b) || [] })).filter(x => x.list.length);
  const progressPrefixes = ['ui.plan.progress.double', 'ui.plan.progress.fixed', 'ui.plan.progress.written'].map(k => prefixOf(model, lang, k)).filter(Boolean);
  const swapsPrefix = (has(model, 'ui.plan.swaps') ? model.t(lang, 'ui.plan.swaps') : 'Swap for') + ':';
  const videoWords = ['ui.plan.video_search', 'ui.plan.video'].filter(k => has(model, k)).map(k => '[' + model.t(lang, k) + ']');

  const buildItem = (pi, it, compact) => {
    const s = splitItemLine(pi.line, model, lang, compact);
    const row = { ...s, progress: [], notes: [], cue: [], swaps: [], video: null, copy_name: null, badge: null, sets: null, exercise_id: null, slot_id: null, edited: false, superset_id: null, circuit: null, rest_obj: null, wod: null, label: '', md_swaps: null, md_video: null };
    for (const det of pi.details) {
      const txt = det.text;
      if (det.quote) { row.cue.push(txt); continue; }
      if (txt.startsWith(swapsPrefix)) { row.md_swaps = txt.slice(swapsPrefix.length).trim(); continue; }
      if (videoWords.some(v => txt.startsWith(v))) { row.md_video = txt; continue; }
      if (progressPrefixes.some(pp => plain(txt).startsWith(pp))) { row.progress.push(txt); continue; }
      row.notes.push(txt);
    }
    if (it) {
      // the effort in plain short words ('3 in the tank', the engine's own key); the full sentence goes to the details
      const full = formatEffort(it.effort, model, lang);
      const e = it.effort;
      if (full && e && e.type === 'rir' && !e.last_set && typeof e.min === 'number' && has(model, 'ui.plan.rir_short')) {
        const k = row.meta.findIndex(x => plain(x) === full);
        if (k >= 0) { row.meta[k] = t('ui.plan.rir_short', { rir: e.min === e.max ? e.min : e.min + '-' + e.max }); row.effort_full = full; }
      } else if (full && full.length > 30) {
        // a long effort sentence ('move it fast: if the kettlebell slows down ...') goes to the row's details, so a row stays two lines
        const k = row.meta.findIndex(x => plain(x) === full);
        if (k >= 0) { row.meta.splice(k, 1); row.effort_full = full; }
      }
      row.exercise_id = it.exercise_id || null;
      row.slot_id = it.slot_id || null;
      // what groups the row with others (a superset / triset / giant set, a circuit station, a WOD and its stations)
      row.superset_id = it.superset || null;
      row.circuit = it.circuit || null;
      row.rest_obj = it.rest || null;
      row.wod = it.wod || null;
      row.edited = !!it.edited;
      row.sets = typeof it.sets === 'number' ? it.sets : null;
      row.badge = changeBadge(plan, n, weekday, it);
      row.swaps = (it.swaps || []).filter(id => model.hasEx(id)).map(id => {
        const sn = (it.swap_notes || []).find(x => x && x.id === id);
        return {
          id, name: t(model.ex(id).name_key),
          keeps: sn && has(model, sn.keeps) ? t(sn.keeps) : '',
          loses: sn && sn.loses && has(model, sn.loses) ? t(sn.loses) : ''
        };
      });
      const v = it.video;
      // (the engine decides whether a row gets a video line - no search for a WOD or a cardio colour; the JSON gives its link)
      if (row.md_video && v && v.url) { row.video = v.url; row.video_kind = v.kind; row.copy_name = v.copy_name || null; }
    }
    // the short forms the compact row shows ('3 × 10-12 · 3 in the tank · 60-120 s'); the full words stay for print and details
    row.dose_s = shortDose(row.dose);
    row.meta_s = row.meta.map(shortMeta);
    return row;
  };

  if (d.kind === 'aerobic') {
    const items = (d.blocks || []).flatMap(b => b.items || []);
    card.mapped = items.length === p.loose.length;
    card.blocks.push({ title: '', intro: [], kind: 'aerobic', items: p.loose.map((pi, k) => buildItem(pi, card.mapped ? items[k] : null, true)) });
    return card;
  }
  card.mapped = jsonBlocks.length === p.blocks.length && jsonBlocks.every((x, k) => x.list.length === p.blocks[k].items.length);
  p.blocks.forEach((pb, k) => {
    const jb = card.mapped ? jsonBlocks[k] : null;
    card.blocks.push({
      title: pb.title, intro: pb.intro, kind: jb ? jb.b.kind : null,
      optional: !!(jb && jb.b.kind === 'core'),
      on: !(jb && jb.b.on === false), toggle: !!(jb && jb.b.toggle),
      items: pb.items.map((pi, j) => buildItem(pi, jb ? jb.list[j] : null, false))
    });
  });
  groupCard(card, model, lang);
  return card;
}

// ------------------------------------------------------------------------------------------------- grouped work

const GROUP_KIND_BY_SIZE = (n) => (n === 2 ? 'superset' : n === 3 ? 'triset' : 'giant');
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** '90 s' / '1-2 min' / '60-120 s' from a rest object or the engine's rest words */
export function restShort(rest, model, lang) {
  if (!rest) return '';
  if (rest.type === 'circuit') {
    const s = rest.between_rounds_s;
    if (typeof s !== 'number' || s <= 0) return '';
    return s >= 60 && s % 60 === 0 ? (s / 60) + ' min' : s + ' s';
  }
  const m = /(\d+(?:-\d+)?)\s*(s|min)\b/.exec(plain(formatRest(rest, model, lang)));
  return m ? m[1] + ' ' + m[2] : '';
}

/**
 * The day's grouped work, so a person sees "today I have N things to do" (coach, 2026-10-13: "each exercise ... boxed, and then each
 * set or superset ... boxed itself"). Each block gets `groups`: a straight exercise is {kind:'single', rows:[row]}; exercises done one
 * after the other and then repeated are one group - a superset (2), triset (3) or giant set (4+) from the items' superset id, a circuit
 * (a circuit block: its rounds, work, change and rest between rounds, `format` 'rounds' or 'stations'), or a WOD (its stations).
 * Groups are lettered A, B ... across the day and their rows A1, A2 ...; a superset left with one exercise (the rest removed by an edit)
 * is a straight exercise again. Inside a group the rest is said once, for the group, and taken off each row.
 */
export function groupCard(card, model, lang) {
  let li = 0;
  const nextLetter = () => LETTERS[li++ % LETTERS.length];
  for (const b of card.blocks) {
    const rows = b.items || [];
    const groups = [];
    if (b.kind === 'circuit' && rows.length > 1) {
      const c = (rows.find(r => r.circuit) || {}).circuit || {};
      const rest = rows.map(r => r.rest_obj).find(x => x && x.type === 'circuit') || null;
      groups.push({ kind: 'circuit', rows, rounds: c.rounds || null, work_s: c.work_s || null, transition_s: c.transition_s || null, format: c.format || 'rounds', rest: restShort(rest, model, lang) });
    } else {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (r.superset_id) {
          let j = i;
          while (j + 1 < rows.length && rows[j + 1].superset_id === r.superset_id) j++;
          if (j > i) {
            const list = rows.slice(i, j + 1);
            const sets = list.map(x => x.sets).filter(x => typeof x === 'number');
            const rounds = sets.length ? Math.max(...sets) : null;
            const last = list[list.length - 1];
            const rest = restShort(last.rest_obj, model, lang);
            // the rest is said once, for the group: take the after-the-pair rest words off each row
            for (const x of list) {
              const words = plain(formatRest(x.rest_obj, model, lang));
              const k = words ? x.meta.findIndex(m => plain(m) === words) : -1;
              if (k >= 0) { x.meta.splice(k, 1); if (x.meta_s) x.meta_s.splice(k, 1); }
              x.superset_with = '';
              x.superset_tag = '';
            }
            groups.push({ kind: GROUP_KIND_BY_SIZE(list.length), rows: list, rounds, rest, fewer: list.map((x, q) => ({ q, sets: x.sets })).filter(x => typeof x.sets === 'number' && rounds && x.sets < rounds) });
            i = j;
            continue;
          }
        }
        if (r.wod && Array.isArray(r.wod.stations) && r.wod.stations.length > 1) {
          // the WOD's stations, from the engine's own line ('10 Reps Toes to Bar · 15 Reps Kettlebell Swing · ...')
          const n = r.wod.stations.length;
          const k = r.notes.findIndex(x => plain(x).split(' · ').length === n);
          if (k >= 0) {
            const parts = r.notes[k].split(' · ');
            r.notes.splice(k, 1);
            const stations = parts.map((text, q) => {
              const id = r.wod.stations[q];
              const ex = id && model.hasEx(id) ? model.ex(id) : null;
              const v = ex ? videoOf(model, ex) : null;
              return { text, exercise_id: ex ? ex.id : null, name: ex ? stripMarkers(model.t(lang, ex.name_key)) : plain(text), video: v && v.url ? v.url : null, video_kind: v ? v.kind : null };
            });
            groups.push({ kind: 'wod', rows: [r], stations, format: r.wod.format || null, rounds: r.wod.rounds || null });
            continue;
          }
        }
        groups.push({ kind: 'single', rows: [r] });
      }
    }
    for (const g of groups) {
      if (g.kind === 'single') { g.rows[0].label = ''; continue; }
      g.label = nextLetter();
      if (g.kind === 'wod') (g.stations || []).forEach((st, q) => { st.label = g.label + (q + 1); });
      else g.rows.forEach((x, q) => { x.label = g.label + (q + 1); });
    }
    b.groups = groups;
  }
  return card;
}

/** 'A1 → A2 → A3' (a long list: 'A1 → A2 → … → A7') */
export function groupSeq(labels) {
  if (labels.length <= 5) return labels.join(' → ');
  return [labels[0], labels[1], '…', labels[labels.length - 1]].join(' → ');
}

/**
 * The group's header in plain words, in the app's words (`ui(key, args)`, app/i18n.js): {kind:'SUPERSET', line:'do A1 → A2, rest
 * 60-90 s, repeat ×3', note:'A2: 2 rounds only'}.
 */
export function groupHeader(g, ui) {
  const labels = g.kind === 'wod' ? (g.stations || []).map(s => s.label) : g.rows.map(r => r.label);
  const seq = groupSeq(labels);
  const out = { kind: ui('grp.' + (g.kind === 'circuit' && g.format === 'stations' ? 'stations' : g.kind)), line: '', note: '' };
  if (g.kind === 'circuit') {
    if (g.format === 'stations') out.line = ui('grp.stations_line', { n: g.rounds || '', first: labels[0], next: labels[1] || '' });
    else out.line = ui(g.rest ? 'grp.circuit_line_rest' : 'grp.circuit_line', { seq, rest: g.rest, n: g.rounds || '' });
    if (g.work_s) out.note = ui(g.transition_s ? 'grp.work_change' : 'grp.work', { work: g.work_s, change: g.transition_s || '' });
  } else if (g.kind === 'wod') {
    const r = Array.isArray(g.rounds) ? (g.rounds[0] === g.rounds[1] ? g.rounds[0] : g.rounds.join('-')) : g.rounds;
    if (g.format === 'emom') out.line = ui('grp.wod_emom', { seq });
    else if (g.format === 'amrap') out.line = ui('grp.wod_line', { seq });
    else if (r) out.line = ui('grp.wod_rounds', { seq, n: r });
    else out.line = ui('grp.wod_once', { seq });
  } else {
    out.line = ui(g.rest ? 'grp.line_rest' : 'grp.line', { seq, rest: g.rest, n: g.rounds || '' });
    if (g.fewer && g.fewer.length) out.note = g.fewer.map(f => ui('grp.fewer', { label: g.rows[f.q].label, n: f.sets })).join(' · ');
  }
  return out;
}

// ------------------------------------------------------------------------------------------------- the progress tab

function splitRow(line) { return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()); }

/** the tables under a heading of the rendered Markdown that starts with `titleStart` */
function tablesUnder(md, titleStart) {
  const lines = String(md).split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^#{2,3}\s+(.*)$/.exec(lines[i]);
    if (!m || !plain(m[1]).startsWith(titleStart)) continue;
    const rows = [];
    let j = i + 1;
    while (j < lines.length && !/^\s*\|/.test(lines[j]) && !/^#{1,3}\s/.test(lines[j])) j++;
    while (j < lines.length && /^\s*\|/.test(lines[j])) { if (!/^\s*\|?\s*:?-{3,}/.test(lines[j].trim())) rows.push(splitRow(lines[j])); j++; }
    out.push({ heading: plain(m[1]), rows });
  }
  return out;
}

/**
 * The weekly sets per muscle group, week by week, for every training block (the engine's own table, so the numbers are exactly the
 * printed ones), plus the effort of each week (the planned reps in the tank).
 */
export function setsGrid(plan, model, lang, overviewMd) {
  const md = overviewMd || renderPlan(plan, model, { lang, view: 'overview' });
  const title = has(model, 'ui.plan.sets_by_week_title') ? model.t(lang, 'ui.plan.sets_by_week_title') : 'Weekly sets per muscle group, week by week';
  const totalWord = has(model, 'ui.plan.total') ? model.t(lang, 'ui.plan.total') : 'Total';
  const blocks = [];
  for (const tb of tablesUnder(md, title)) {
    if (tb.rows.length < 2) continue;
    const head = tb.rows[0];
    const hasFinal = head.length >= 3;
    const rows = [];
    let total = null;
    for (const r of tb.rows.slice(1)) {
      const name = plain(r[0]);
      const tokens = String(r[1] || '').split(/\s+/).filter(Boolean);
      const values = [], breaks = [];
      for (const tok of tokens) { if (tok === '·') { breaks.push(values.length); continue; } const v = Number(tok); values.push(Number.isFinite(v) ? v : null); }
      const row = { name, values, breaks, final: hasFinal ? plain(r[2] || '') : '' };
      if (name === totalWord) total = row; else rows.push(row);
    }
    const m = /(\d+)\s*-\s*(\d+)\s*$/.exec(tb.heading);
    blocks.push({ heading: tb.heading, from: m ? Number(m[1]) : 1, to: m ? Number(m[2]) : rows[0] ? rows[0].values.length : 0, rows, total, has_final: hasFinal });
  }
  return blocks;
}

/** the planned reps in the tank of each week: [{n, text, intensifiers}] */
export function effortByWeek(plan) {
  return (plan.weeks || []).map(w => {
    const p = w.planned_rir;
    if (!p || typeof p.min !== 'number') return { n: w.n, text: '–', intensifiers: false };
    return { n: w.n, text: p.min === p.max ? String(p.min) : p.min + '-' + p.max, intensifiers: !!p.intensifiers };
  });
}

/** the plan's notes for the progress tab, as Markdown sections from the engine's full rendering: [{id, title, body}] */
export function planSections(plan, model, lang, fullMd) {
  const md = fullMd || renderPlan(plan, model, { lang });
  const all = sections(md);
  const want = [
    ['before', 'ui.plan.before_you_start'],
    ['progress', 'ui.plan.progress_title'],
    ['instruction', (plan.meta && plan.meta.instruction_keys && plan.meta.instruction_keys[0]) || 'instruction.title'],
    ['adjust', 'guide.adjust.title'],
    ['addons', 'ui.plan.addons_title']
  ];
  const out = [];
  for (const [id, key] of want) {
    if (!has(model, key)) continue;
    const title = plain(model.t(lang, key));
    const s = all.find(x => x.title === title);
    if (s && s.body) out.push({ id, title, body: s.body });
  }
  // the coach's "Basic Instruction" may sit under a family title (CrossFit lines): match its first line instead
  if (!out.some(x => x.id === 'instruction')) {
    const s = all.find(x => /^>\s/.test(x.body));
    if (s) out.splice(Math.min(2, out.length), 0, { id: 'instruction', title: s.title, body: s.body });
  }
  return out;
}

/** the plan's header lines (goal, sport, level, plan type, start date, days, release stamp, health check) as Markdown */
export function headerMd(plan, model, lang, overviewMd) {
  const md = overviewMd || renderPlan(plan, model, { lang, view: 'overview' });
  const lines = md.split('\n');
  const first = lines.findIndex(l => /^- /.test(l));
  if (first < 0) return '';
  let end = first;
  while (end < lines.length && /^- /.test(lines[end])) end++;
  return lines.slice(first, end).join('\n');
}

/** the words of an invalid result: one line per error (engine/render.mjs renderInvalid, with each field's label) */
export function errorLines(plan, model, lang) {
  const t = (k, a) => tt(model, lang, k, a);
  return (plan.errors || []).map(e => {
    const ek = 'intake.error.' + e.code;
    if (e.code && has(model, ek) && e.key && e.key.startsWith('intake.')) return t(ek, { ...(e.args || {}), field: t(e.key) });
    if (e.key && has(model, e.key)) return t(e.key, e.args);
    return e.code || 'error';
  });
}
