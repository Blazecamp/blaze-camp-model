// app/pdf.js - "Download PDF": the whole plan as a real PDF file, built in the browser with the vendored jsPDF
// (app/vendor/jspdf.umd.min.js, MIT, loaded only when the button is pressed; the site's CSP allows only its own scripts).
// The PDF is text, not screenshots, so it is small and crisp:
//   * a cover page: the plan's name, who / goal, days and weeks, the plan at a glance (start date, level, days ...), the health
//     warning when there is one, the release, the credit line and the model version;
//   * every week: its phase and notes, then each day as a compact table (exercise, sets x reps, effort and rest; block headings;
//     badges such as "+1 set"); a day is never split across pages;
//   * the weekly sets per muscle group, then the plan's own notes (before you start, how you progress, the basic instruction);
//   * on every page a footer with the release line (and the health line) and "Page n of N".
// Every word is the engine's or the app's (plan-view.js / i18n.js), so the PDF says what the page says, in the page's language.
// pdfDoc() and drawPdf() are pure (no DOM): tests/app-pdf.test.mjs runs them in Node with the same vendored jsPDF.
import * as V from './plan-view.js';
import { plain, stripMarkers } from './md.js';
import { renderPlan } from '../engine/render.mjs';
import { BRAND } from './brand.js';
import { brandUi } from './brand-apply.js';

// ------------------------------------------------------------------------------------------------- text the PDF can hold

// jsPDF's built-in Helvetica writes WinAnsi (Windows-1252): all of Latin-1 (á é í ó ú ü ñ ¿ ¡ ...) plus – — ‘ ’ “ ” • … € ™ etc.
// Anything else is swapped for a plain equivalent so nothing prints as garbage.
const WINANSI_EXTRA = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');
const SWAP = {
  '→': '->', '←': '<-', '⇄': '<->', '↔': '<->', '⇒': '=>', '≤': '<=', '≥': '>=', '≈': '~', '−': '-', '‑': '-', '‐': '-',
  '‒': '-', '―': '—', '′': "'", '″': '"', '✓': '+', '✔': '+', '✗': 'x', '✕': 'x', '⚡': '', '⏱': '', '⤓': '', '⎙': '', '↺': '',
  '▶': '>', '►': '>', '◀': '<', '‹': '<', '›': '>', ' ': ' ', ' ': ' ', ' ': ' ', ' ': ' ', '​': ''
};
/** a string with only characters the standard PDF font can show */
export function pdfText(s) {
  let out = '';
  for (const ch of String(s == null ? '' : s).normalize('NFC')) {
    const c = ch.codePointAt(0);
    if (c === 9) out += ' ';
    else if ((c >= 32 && c <= 126) || (c >= 160 && c <= 255) || WINANSI_EXTRA.has(ch)) out += ch;
    else if (ch in SWAP) out += SWAP[ch];
    else if (c >= 0x2000 && c <= 0x200a) out += ' ';
    // anything else (emoji, symbols, other scripts) is left out
  }
  return out.replace(/ {2,}/g, ' ').trim();
}
const txt = (s) => pdfText(plain(stripMarkers(String(s == null ? '' : s))));

/** '<brand prefix>-muscle-2026-10-12.pdf' (app/brands/<id>.js > pdf.file_prefix) */
export function pdfFileName(plan, prefix = BRAND.pdf.file_prefix) {
  const m = (plan && plan.meta) || {};
  const goal = String(m.goal || 'plan').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'plan';
  const start = /^\d{4}-\d{2}-\d{2}$/.test(m.start_date || '') ? m.start_date : '';
  return `${prefix}-${goal}${start ? '-' + start : ''}.pdf`;
}

// ------------------------------------------------------------------------------------------------- what the PDF says

/** Markdown (a section body) -> [{kind: 'h'|'p'|'li', text}] in plain words */
export function mdLines(md) {
  const out = [];
  let para = [];
  const flush = () => { if (para.length) { out.push({ kind: 'p', text: txt(para.join(' ')) }); para = []; } };
  for (const raw of String(md || '').split('\n')) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (/^\|?\s*:?-{2,}/.test(line)) continue;                                // a table's separator row
    let m;
    if ((m = /^#{1,6}\s+(.*)$/.exec(line))) { flush(); out.push({ kind: 'h', text: txt(m[1]) }); continue; }
    if ((m = /^(?:[-*+]|\d+\.)\s+(.*)$/.exec(line))) { flush(); out.push({ kind: 'li', text: txt(m[1]) }); continue; }
    if (line.startsWith('|')) { flush(); out.push({ kind: 'li', text: txt(line.replace(/^\||\|$/g, '').split('|').map(c => c.trim()).filter(Boolean).join(' · ')) }); continue; }
    if (line.startsWith('>')) { flush(); out.push({ kind: 'p', text: txt(line.replace(/^>\s?/, '')) }); continue; }
    para.push(line);
  }
  flush();
  return out.filter(x => x.text);
}

/**
 * The PDF's content as plain data: no layout, no DOM.
 * @param {object} plan  a plan/2 with status 'ok'
 * @param {object} model the loaded model
 * @param {'en'|'es'} lang
 * @param {(key: string, args?: object) => string} ui  the app's words (i18n.js ui bound to lang)
 * @param {object} [brand] the brand (app/brands/<id>.js; default: the active one) plus, in the page, `logo_data`: {data, w, h}
 */
export function pdfDoc(plan, model, lang, ui0, brand = BRAND) {
  const BP = brand.pdf || {};
  const ui = (k, a) => brandUi(brand, (l, kk, aa) => ui0(kk, aa))(lang, k, a);   // the brand's own words win
  const mt = (k, a) => (model.has('en', k) ? stripMarkers(model.t(lang, k, a)) : k);
  const sm = V.summary(plan, model, lang);
  const lg = V.legal(plan, model, lang);
  const overview = renderPlan(plan, model, { lang, view: 'overview' });
  const full = renderPlan(plan, model, { lang });
  const badge = (b) => {
    if (!b) return '';
    if (b.kind === 'new') return ui('plan.badge.new');
    if (b.kind === 'sets' && b.n > 0) return b.n === 1 ? ui('plan.badge.plus_one') : ui('plan.badge.plus_n', { n: b.n });
    if (b.kind === 'sets' && b.n < 0) return b.n === -1 ? ui('plan.badge.minus_one') : ui('plan.badge.minus_n', { n: -b.n });
    return '';
  };
  const doc = {
    lang,
    title: txt(sm.program),
    // (an edited plan says so on its cover: the person's own changes, CX-04)
    subtitle: txt([sm.who || sm.goal, ui('plan.days', { n: sm.days }), ui('plan.weeks', { n: sm.weeks }), plan.edited ? ui('edit.edited') : ''].filter(Boolean).join(' · ')),
    glance: mdLines(V.headerMd(plan, model, lang, overview)),
    health: lg.health ? txt([lg.health.label, lg.health.why, lg.health.line].filter(Boolean).join(' ')) : '',
    health_short: lg.health ? txt(lg.health.short || lg.health.line) : '',
    bypass: lg.bypass ? txt(lg.bypass) : '',
    release: txt([lg.label, lg.full].filter(Boolean).join(' ')),
    release_short: txt(lg.short),
    disclaimer: txt([lg.footer, lg.disclaimer].filter(Boolean).join(' ')),
    url: lg.url || '',
    credit: txt(ui('app.credit')),
    generated: txt(ui('print.generated') + ' · ' + mt('ui.plan.model_version', { model: plan.model_version, engine: plan.engine_version })),
    brand: txt(brand.short),
    meta: { name: brand.name, author: BP.author || brand.name, creator: BP.creator || brand.name },
    colors: BP.colors || null,
    logo: brand.logo_data || null,   // {data: 'data:image/png;base64,...', w, h}: the page fetches brand.pdf.logo
    cols: { exercise: txt(mt('ui.plan.col.exercise')), dose: txt(mt('ui.plan.col.dose')), effort: txt(mt('ui.plan.col.effort')), week: txt(mt('ui.plan.col.week')) },
    page: (n, total) => pdfText(ui('pdf.page', { n, total })),
    weeks: [],
    sets_title: txt(ui('progress.sets_title')),
    sets_note: txt(ui('progress.sets_note').split('. ').slice(0, 1).join('. ')),
    sets: [],
    final_label: txt(ui('progress.final')),
    total_label: txt(ui('progress.total')),
    effort_label: txt(mt('ui.plan.effort')),
    sections: []
  };
  for (const w of plan.weeks || []) {
    const wi = V.weekInfo(plan, model, lang, w.n);
    const week = {
      n: w.n,
      title: txt(ui('plan.week_of', { n: w.n, total: wi.total }) + (wi.phase ? ' — ' + wi.phase : '')),
      tags: [wi.test ? wi.test_label : '', wi.accel ? ui('plan.badge.accel') : ''].filter(Boolean).map(txt),
      notes: mdLines(wi.notes_md),
      days: []
    };
    for (const d of V.dayTabs(plan, w.n)) {
      const c = V.dayCard(plan, model, lang, w.n, d.weekday);
      if (!c) continue;
      const kindWord = d.optional ? ui('plan.day.optional') : ({ play: ui('plan.day.play'), aerobic: ui('plan.day.cardio'), sport: ui('plan.day.sport') })[d.kind] || '';
      const day = {
        weekday: d.weekday,
        title: txt(c.weekday_name + (kindWord ? ' (' + kindWord.toLowerCase() + ')' : '') + ' · ' + c.title),
        est: c.est ? txt(c.est) : '',
        simple: c.kind === 'play' || c.kind === 'sport',
        blocks: []
      };
      if (!day.simple) {
        for (const b of c.blocks) {
          const block = { title: txt(b.title), intro: b.intro.map(txt).filter(Boolean).join(' '), rows: [] };
          b.items.forEach((r, i) => {
            const effort = r.meta.map(txt).filter(Boolean);
            if (r.effort_full && r.effort_full.length > 30 && !effort.length) effort.push(txt(r.effort_full));
            block.rows.push({
              n: i + 1,
              name: txt(r.name),
              tag: [r.superset_tag ? r.superset_tag : '', ...r.tags].map(txt).filter(Boolean).join(' '),
              badge: txt(badge(r.badge)),
              dose: txt(r.dose),
              effort: effort.join(' · ')
            });
          });
          if (block.rows.length || block.title) day.blocks.push(block);
        }
      }
      week.days.push(day);
    }
    doc.weeks.push(week);
  }
  for (const g of V.setsGrid(plan, model, lang, overview)) {
    const eff = V.effortByWeek(plan);
    const weeks = [];
    for (let w = g.from; w <= g.to; w++) weeks.push(w);
    doc.sets.push({
      heading: txt(g.heading || ''),
      weeks,
      has_final: !!g.has_final,
      rows: g.rows.map(r => ({ name: txt(r.name), values: r.values.map(v => (typeof v === 'number' ? String(v) : '–')), final: txt(r.final == null ? '' : r.final) })),
      total: g.total ? { name: doc.total_label, values: g.total.values.map(v => (typeof v === 'number' ? String(v) : '–')), final: txt(g.total.final == null ? '' : g.total.final) } : null,
      effort: weeks.map(w => { const e = eff.find(x => x.n === w); return e ? pdfText(e.intensifiers ? e.text + '+' : e.text) : '–'; })
    });
  }
  for (const s of V.planSections(plan, model, lang, full).filter(x => ['before', 'progress', 'instruction'].includes(x.id))) {
    doc.sections.push({ title: txt(s.title), lines: mdLines(s.body) });
  }
  return doc;
}

// ------------------------------------------------------------------------------------------------- layout (jsPDF)

const PT = { w: 612, h: 792 };                 // US Letter, in points
const M = { l: 36, r: 36, t: 44, b: 54 };      // margins; the footer sits in the bottom margin
const CW = PT.w - M.l - M.r;                   // content width
const COL = { name: 0.5, dose: 0.19 };        // the day table: exercise | sets x reps | effort and rest
const INK0 = [20, 20, 22], MUTED = [95, 95, 100], ACCENT0 = [217, 67, 11], LINE = [205, 205, 210], SHADE = [244, 244, 246];

/**
 * Draw the document with a jsPDF constructor (window.jspdf.jsPDF in the page, the same file in Node for the tests).
 * @returns the jsPDF instance (call .output('blob') or .output('arraybuffer'))
 */
export function drawPdf(doc, JsPDF) {
  const pdf = new JsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait', compress: true });
  const C = doc.colors || {};
  const ACCENT = C.accent || ACCENT0, INK = C.ink || INK0, BRANDC = C.brand || ACCENT;   // a brand's colours (app/brands/<id>.js > pdf.colors)
  const B = doc.meta || {};
  pdf.setProperties({ title: doc.title + (B.name ? ' - ' + B.name : ''), subject: doc.subtitle, author: B.author || '', creator: B.creator || '' });
  pdf.setLineHeightFactor(1.18);
  let y = M.t;
  const bottom = PT.h - M.b;
  const font = (size, style = 'normal', color = INK) => { pdf.setFont('helvetica', style); pdf.setFontSize(size); pdf.setTextColor(...color); };
  const lh = (size) => size * 1.17;
  const wrap = (s, width, size, style = 'normal') => { pdf.setFont('helvetica', style); pdf.setFontSize(size); return s ? pdf.splitTextToSize(s, width) : []; };
  const newPage = () => { pdf.addPage(); y = M.t; runningHead(); };
  const need = (h) => { if (y + h > bottom) newPage(); };
  const runningHead = () => {
    font(7.5, 'bold', BRANDC); pdf.text(doc.brand, M.l, 28);
    font(7.5, 'normal', MUTED); pdf.text(pdf.splitTextToSize(doc.title, CW - 80)[0] || '', PT.w - M.r, 28, { align: 'right' });
    pdf.setDrawColor(...LINE); pdf.setLineWidth(0.5); pdf.line(M.l, 33, PT.w - M.r, 33);
  };
  /** a paragraph that may run over pages, line by line */
  const para = (s, size = 9.5, style = 'normal', color = INK, indent = 0, gap = 3) => {
    const lines = wrap(s, CW - indent, size, style);
    for (const ln of lines) { need(lh(size)); font(size, style, color); pdf.text(ln, M.l + indent, y + size); y += lh(size); }
    y += gap;
  };
  const bullets = (items, size = 9.5) => {
    for (const it of items) {
      if (it.kind === 'h') { need(lh(size + 1.5) + lh(size)); y += 3; para(it.text, size + 1.5, 'bold', INK, 0, 1); continue; }
      if (it.kind === 'li') {
        const lines = wrap(it.text, CW - 12, size);
        lines.forEach((ln, i) => { need(lh(size)); font(size); if (i === 0) pdf.text('•', M.l + 2, y + size); pdf.text(ln, M.l + 12, y + size); y += lh(size); });
        y += 1.5; continue;
      }
      para(it.text, size);
    }
  };
  const box = (s, size, fill, border, style = 'normal') => {
    const lines = wrap(s, CW - 16, size, style);
    const h = lines.length * lh(size) + 10;
    need(h);
    pdf.setFillColor(...fill); pdf.setDrawColor(...border); pdf.setLineWidth(0.8); pdf.roundedRect(M.l, y, CW, h, 4, 4, 'FD');
    font(size, style); lines.forEach((ln, i) => pdf.text(ln, M.l + 8, y + 5 + size + i * lh(size)));
    y += h + 8;
  };

  // ---- cover
  if (doc.logo && doc.logo.data) {
    const lw = 74, lhgt = Math.round(lw * doc.logo.h / doc.logo.w);
    try { pdf.addImage(doc.logo.data, 'PNG', M.l, y, lw, lhgt); y += lhgt + 12; } catch { font(9, 'bold', BRANDC); pdf.text(doc.brand, M.l, y + 9); y += 22; }
  } else { font(9, 'bold', BRANDC); pdf.text(doc.brand, M.l, y + 9); y += 22; }
  para(doc.title, 22, 'bold', INK, 0, 2);
  para(doc.subtitle, 11.5, 'normal', MUTED, 0, 10);
  pdf.setDrawColor(...ACCENT); pdf.setLineWidth(2); pdf.line(M.l, y, M.l + 60, y); y += 12;
  bullets(doc.glance, 10);
  y += 6;
  if (doc.health) box(doc.health, 9.5, [255, 243, 230], [230, 140, 60]);
  if (doc.bypass) box(doc.bypass, 9, SHADE, LINE);
  box(doc.release, 9, SHADE, LINE);
  para(doc.disclaimer, 8.5, 'normal', MUTED, 0, 2);
  if (doc.url) { need(lh(8.5)); font(8.5, 'normal', [30, 80, 170]); pdf.textWithLink(doc.url, M.l, y + 8.5, { url: doc.url }); y += lh(8.5) + 8; }
  para(doc.credit, 9.5, 'bold', INK, 0, 1);
  para(doc.generated, 8.5, 'normal', MUTED, 0, 0);

  // ---- the weeks: each starts a page; a day is never split (a day taller than a page breaks between its blocks)
  const xName = M.l + 6, xDose = M.l + CW * COL.name, xEff = M.l + CW * (COL.name + COL.dose);
  const wName = CW * COL.name - 10, wDose = CW * COL.dose - 6, wEff = CW - CW * (COL.name + COL.dose) - 6;
  const ROW = 8.5;
  const rowLayout = (r) => {
    const name = wrap(`${r.n}. ${r.name}${r.tag ? ' [' + r.tag + ']' : ''}`, wName, ROW, 'normal');
    const badge = r.badge ? wrap(r.badge, wName, 7.5, 'bold') : [];
    const dose = wrap(r.dose, wDose, ROW);
    const eff = wrap(r.effort, wEff, ROW);
    const h = Math.max(name.length + (badge.length ? 0.9 : 0), dose.length, eff.length, 1) * lh(ROW) + 4;
    return { name, badge, dose, eff, h };
  };
  const blockLayout = (b) => {
    const head = b.title ? wrap(b.title + (b.intro ? ' — ' + b.intro : ''), CW - 12, 8, 'bold') : [];
    const rows = b.rows.map(rowLayout);
    return { b, head, rows, h: (head.length ? head.length * lh(8) + 6 : 0) + rows.reduce((a, r) => a + r.h, 0) };
  };
  const dayLayout = (d) => {
    const title = wrap(d.title, CW - 12, 10.5, 'bold');
    const est = d.est ? wrap(d.est, CW - 12, 8) : [];
    const blocks = d.blocks.map(blockLayout);
    const headH = title.length * lh(10.5) + est.length * lh(8) + 8 + (blocks.length ? lh(7.5) + 4 : 0);
    return { d, title, est, blocks, headH, h: headH + blocks.reduce((a, b) => a + b.h, 0) + 8 };
  };
  const drawDayHead = (L, cont) => {
    font(10.5, 'bold'); L.title.forEach((ln, i) => pdf.text(i === 0 && cont ? ln + ' …' : ln, M.l + 6, y + 10.5 + i * lh(10.5)));
    y += L.title.length * lh(10.5) + 2;
    if (L.est.length && !cont) { font(8, 'normal', MUTED); L.est.forEach(ln => { pdf.text(ln, M.l + 6, y + 8); y += lh(8); }); }
    y += 4;
    if (L.blocks.length) {
      font(7.5, 'bold', MUTED);
      pdf.text(doc.cols.exercise.toUpperCase(), xName, y + 7.5); pdf.text(doc.cols.dose.toUpperCase(), xDose, y + 7.5); pdf.text(doc.cols.effort.toUpperCase(), xEff, y + 7.5);
      y += lh(7.5) + 4;
    }
  };
  const drawBlock = (B) => {
    if (B.head.length) {
      pdf.setFillColor(...SHADE); pdf.rect(M.l + 1, y, CW - 2, B.head.length * lh(8) + 4, 'F');
      font(8, 'bold', MUTED); B.head.forEach((ln, i) => pdf.text(ln, M.l + 6, y + 2 + 8 + i * lh(8)));
      y += B.head.length * lh(8) + 6;
    }
    for (const R of B.rows) {
      pdf.setDrawColor(...LINE); pdf.setLineWidth(0.4); pdf.line(M.l + 4, y, PT.w - M.r - 4, y);
      font(ROW); R.name.forEach((ln, i) => pdf.text(ln, xName, y + 3 + ROW + i * lh(ROW)));
      if (R.badge.length) { font(7.5, 'bold', ACCENT); pdf.text(R.badge[0], xName + 10, y + 3 + ROW + R.name.length * lh(ROW) - 1); }
      font(ROW, 'bold'); R.dose.forEach((ln, i) => pdf.text(ln, xDose, y + 3 + ROW + i * lh(ROW)));
      font(ROW, 'normal', [55, 55, 60]); R.eff.forEach((ln, i) => pdf.text(ln, xEff, y + 3 + ROW + i * lh(ROW)));
      y += R.h;
    }
  };
  const frame = (top, bottomY) => { pdf.setDrawColor(...LINE); pdf.setLineWidth(0.8); pdf.roundedRect(M.l, top, CW, bottomY - top, 4, 4, 'S'); };
  const drawDay = (L) => {
    const room = bottom - M.t;
    if (L.h <= room) {
      need(L.h);
      const top = y; y += 6; drawDayHead(L, false);
      for (const B of L.blocks) drawBlock(B);
      y += 2; frame(top, y); y += 8;
      return;
    }
    // a very long day: break between blocks, repeating the day's title
    let top = y; y += 6; drawDayHead(L, false);
    for (const B of L.blocks) {
      if (y + B.h > bottom - 4) { y += 2; frame(top, y); newPage(); top = y; y += 6; drawDayHead(L, true); }
      if (y + B.h > bottom - 4) {
        // a single block taller than a page (rare): break between its rows
        for (const R of B.rows) { if (y + R.h > bottom - 4) { y += 2; frame(top, y); newPage(); top = y; y += 6; drawDayHead(L, true); } drawBlock({ head: [], rows: [R] }); }
      } else drawBlock(B);
    }
    y += 2; frame(top, y); y += 8;
  };

  for (const w of doc.weeks) {
    newPage();
    font(15, 'bold'); const tl = wrap(w.title, CW, 15, 'bold');
    tl.forEach(ln => { pdf.text(ln, M.l, y + 15); y += lh(15); });
    if (w.tags.length) { font(8.5, 'bold', ACCENT); pdf.text(w.tags.join(' · '), M.l, y + 8.5); y += lh(8.5); }
    pdf.setDrawColor(...ACCENT); pdf.setLineWidth(1.5); pdf.line(M.l, y + 3, PT.w - M.r, y + 3); y += 10;
    if (w.notes.length) { bullets(w.notes, 8.5); y += 2; }
    for (const d of w.days) {
      if (d.simple) { const L = dayLayout({ ...d, blocks: [] }); need(L.h); const top = y; y += 6; drawDayHead(L, false); frame(top, y); y += 8; continue; }
      drawDay(dayLayout(d));
    }
  }

  // ---- the weekly sets per muscle group
  if (doc.sets.length) {
    newPage();
    para(doc.sets_title, 15, 'bold', INK, 0, 2);
    if (doc.sets_note) para(doc.sets_note, 8.5, 'normal', MUTED, 0, 6);
    for (const g of doc.sets) {
      const cols = g.weeks.length + (g.has_final ? 1 : 0);
      const nameW = Math.min(170, CW * 0.34);
      const cw = Math.min(34, (CW - nameW) / Math.max(1, cols));
      const rowH = 15;
      const all = [...g.rows, ...(g.total ? [g.total] : [])];
      const table = (all.length + 2) * rowH + 12;
      if (g.heading) { need(lh(10) + table); para(g.heading, 10, 'bold', INK, 0, 3); } else need(table);
      // header
      pdf.setFillColor(...SHADE); pdf.rect(M.l, y, nameW + cw * cols, rowH, 'F');
      font(7.5, 'bold', MUTED); pdf.text(doc.cols.week, M.l + 4, y + 10.5);
      g.weeks.forEach((wk, i) => pdf.text(String(wk), M.l + nameW + cw * i + cw / 2, y + 10.5, { align: 'center' }));
      if (g.has_final) pdf.text(doc.final_label, M.l + nameW + cw * g.weeks.length + cw / 2, y + 10.5, { align: 'center' });
      y += rowH;
      const drawRow = (r, bold) => {
        const nums = r.values.map(Number).filter(v => !Number.isNaN(v));
        const lo = Math.min(...nums), hi = Math.max(...nums);
        pdf.setDrawColor(...LINE); pdf.setLineWidth(0.4); pdf.line(M.l, y, M.l + nameW + cw * cols, y);
        font(8, bold ? 'bold' : 'normal'); pdf.text(pdf.splitTextToSize(r.name, nameW - 6)[0] || '', M.l + 4, y + 10.5);
        r.values.forEach((v, i) => {
          const n = Number(v);
          if (!Number.isNaN(n) && !bold) {
            const a = hi > lo ? 0.12 + 0.6 * (n - lo) / (hi - lo) : 0.3;
            pdf.setFillColor(Math.round(255 - (255 - ACCENT[0]) * a), Math.round(255 - (255 - ACCENT[1]) * a), Math.round(255 - (255 - ACCENT[2]) * a));
            pdf.rect(M.l + nameW + cw * i + 1, y + 1, cw - 2, rowH - 2, 'F');
          }
          font(8, bold ? 'bold' : 'normal'); pdf.text(v, M.l + nameW + cw * i + cw / 2, y + 10.5, { align: 'center' });
        });
        if (g.has_final) { font(8, 'bold'); pdf.text(r.final || '', M.l + nameW + cw * g.weeks.length + cw / 2, y + 10.5, { align: 'center' }); }
        y += rowH;
      };
      g.rows.forEach(r => drawRow(r, false));
      if (g.total) drawRow(g.total, true);
      drawRow({ name: doc.effort_label, values: g.effort, final: '' }, true);
      y += 12;
    }
  }

  // ---- the plan's own notes
  if (doc.sections.length) {
    newPage();
    for (const s of doc.sections) {
      need(lh(13) + lh(9.5) * 3);
      para(s.title, 13, 'bold', INK, 0, 4);
      bullets(s.lines, 9);
      y += 8;
    }
  }

  // ---- the footer on every page: the release line (and the health line), the page number
  const total = pdf.getNumberOfPages();
  const foot = [doc.health_short, doc.release_short].filter(Boolean).join(' ');
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(...LINE); pdf.setLineWidth(0.5); pdf.line(M.l, PT.h - M.b + 12, PT.w - M.r, PT.h - M.b + 12);
    const lines = wrap(foot, CW - 80, 7);
    font(7, 'normal', MUTED); lines.slice(0, 3).forEach((ln, i) => pdf.text(ln, M.l, PT.h - M.b + 22 + i * lh(7)));
    font(7.5, 'bold', MUTED); pdf.text(doc.page(p, total), PT.w - M.r, PT.h - M.b + 22, { align: 'right' });
  }
  return pdf;
}

// ------------------------------------------------------------------------------------------------- the page's side

let loading = null;
/** load the vendored jsPDF once, when the button is first pressed (a plain script: the CSP allows 'self') */
export function loadJsPdf(src = 'vendor/jspdf.umd.min.js') {
  if (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = () => (window.jspdf && window.jspdf.jsPDF ? resolve(window.jspdf.jsPDF) : reject(new Error('jsPDF did not load')));
    s.onerror = () => { loading = null; s.remove(); reject(new Error('jsPDF did not load')); };
    document.head.appendChild(s);
  });
  return loading;
}

/** the whole plan as a PDF Blob */
export function planPdfBlob(plan, model, lang, ui, JsPDF, brand = BRAND) {
  const pdf = drawPdf(pdfDoc(plan, model, lang, ui, brand), JsPDF);
  return pdf.output('blob');
}
