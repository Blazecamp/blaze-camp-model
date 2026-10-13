// app/md.js - a tiny Markdown -> HTML converter for the engine's own rendered words (engine/render.mjs writes Markdown).
// It covers what the engine prints: headings, paragraphs, '-' and '1.' lists (one nesting level), '>' quotes, tables, '---',
// **bold**, _italic_, `code`, [links](url) and the engine's backslash escapes. Pure; everything is HTML-escaped first.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

// reviewer markers ('[LEGAL REVIEW]', '[REVISIÓN LEGAL: ...]') are notes for the team, not words for the public page: the sentence
// is shown as written, the bracketed marker is hidden (see app/README.md "For the coach")
const MARKER = /\s*\[(?:LEGAL REVIEW|REVISIÓN LEGAL)[^\]]*\]/g;
export const stripMarkers = (s) => String(s).replace(MARKER, '');

/** safe href: only http(s) links */
function safeUrl(u) {
  const s = String(u).trim();
  return /^https?:\/\//i.test(s) ? s : '#';
}

/** inline Markdown -> HTML */
export function inline(src) {
  const text = stripMarkers(src);
  const out = [];
  // split out code spans first (their content is literal)
  const parts = text.split(/(`[^`]*`)/g);
  for (const part of parts) {
    if (/^`[^`]*`$/.test(part)) { out.push('<code>' + escapeHtml(part.slice(1, -1)) + '</code>'); continue; }
    // protect backslash escapes
    const held = [];
    let s = part.replace(/\\([\\*_`[\]()#|>-])/g, (m, c) => { held.push(c); return '\u0000' + (held.length - 1) + '\u0000'; });
    // links: [text](url) - the url is taken raw before escaping
    const links = [];
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => { links.push({ t, u }); return '\u0001' + (links.length - 1) + '\u0001'; });
    s = escapeHtml(s);
    s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(>])_([^_]+?)_(?=$|[\s.,:;)!?<])/g, '$1<em>$2</em>');
    s = s.replace(/\u0001(\d+)\u0001/g, (m, i) => {
      const l = links[Number(i)];
      const t = escapeHtml(l.t).replace(/\u0000(\d+)\u0000/g, (mm, k) => escapeHtml(held[Number(k)]));
      return '<a href="' + escapeHtml(safeUrl(l.u)) + '" target="_blank" rel="noopener noreferrer">' + t + '</a>';
    });
    s = s.replace(/\u0000(\d+)\u0000/g, (m, i) => escapeHtml(held[Number(i)]));
    out.push(s);
  }
  return out.join('');
}

/** plain text of an inline Markdown string (no tags) */
export function plain(src) {
  return stripMarkers(src)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+?)\*\*/g, '$1')
    .replace(/(^|[\s(])_([^_]+?)_(?=$|[\s.,:;)!?])/g, '$1$2')
    .replace(/\\([\\*_`[\]()#|>-])/g, '$1');
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

/** block Markdown -> HTML */
export function markdown(src) {
  const lines = String(src || '').split('\n');
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
      const lvl = Math.min(6, m[1].length + 1); // the page owns h1
      html.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`);
      i++; continue;
    }
    if (/^\s*-{3,}\s*$/.test(line)) { html.push('<hr>'); i++; continue; }
    if (/^\s*\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const body = rows.filter(r => !/^\s*\|?\s*:?-{3,}/.test(r.trim()));
      const head = splitRow(body[0] || '');
      const t = ['<div class="table-wrap"><table><thead><tr>', ...head.map(c => `<th>${inline(c)}</th>`), '</tr></thead><tbody>'];
      for (const r of body.slice(1)) t.push('<tr>' + splitRow(r).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>');
      t.push('</tbody></table></div>');
      html.push(t.join(''));
      continue;
    }
    if (/^\s*>/.test(line)) {
      const q = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      html.push('<blockquote>' + markdown(q.join('\n')) + '</blockquote>');
      continue;
    }
    if (/^\s*(-|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^\s*(-|\d+\.)\s+/.test(lines[i])) {
        const indent = /^(\s*)/.exec(lines[i])[1].length;
        const txt = lines[i].replace(/^\s*(-|\d+\.)\s+/, '');
        if (indent >= 2 && items.length) items[items.length - 1].sub.push(txt);
        else items.push({ txt, sub: [] });
        i++;
        // continuation lines ('   > cue') belong to the last item
        while (i < lines.length && /^\s{2,}>/.test(lines[i]) && items.length) { items[items.length - 1].sub.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
      }
      const tag = ordered ? 'ol' : 'ul';
      html.push(`<${tag}>` + items.map(it => '<li>' + inline(it.txt) + (it.sub.length ? '<ul>' + it.sub.map(s => '<li>' + inline(s) + '</li>').join('') + '</ul>' : '') + '</li>').join('') + `</${tag}>`);
      continue;
    }
    const p = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*\||\s*>|\s*(-|\d+\.)\s+|\s*-{3,}\s*$)/.test(lines[i])) { p.push(lines[i].trim()); i++; }
    html.push('<p>' + inline(p.join(' ')) + '</p>');
  }
  return html.join('\n');
}

/** split a rendered plan into its '## ' sections: [{title, body}] (title in plain text) */
export function sections(src) {
  const out = [];
  let cur = null;
  for (const line of String(src || '').split('\n')) {
    const m = /^##\s+(.*)$/.exec(line);
    if (m) { cur = { title: plain(m[1]), body: [] }; out.push(cur); continue; }
    if (cur) cur.body.push(line);
  }
  return out.map(s => ({ title: s.title, body: s.body.join('\n').trim() }));
}
