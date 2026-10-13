// app/prefill.js - a link that opens the Plan Builder with the wizard's answers already filled in (made by an AI agent that asked
// the questions in a conversation: agent/README.md, AGENT_PLAYBOOK.md). The page opens on its last screen, so the person answers
// the health check, reads the release and accepts it themselves, then taps Build (H20, R5-GEN-02).
//
//   https://<site>/#a=<base64url(JSON of the answers)>[&l=en|es]
//
// * The answers ride in the URL fragment, never the query string: a browser never sends the fragment to a server, so they reach
//   no server and no log (R3-GEN-01). The page drops the fragment from the address bar once it has read it.
// * Only the wizard's own answer keys (intake-builder.js > defaultAnswers) are read, each checked against the wizard's choices;
//   anything else is ignored.
// * Never prefilled, whatever the link says: the release acceptance (`accepted`), the guardian's acceptance (`guardian`) and the
//   health check (`health`, `safety`). The person gives those on the page.
// Pure module (no DOM, no storage): the page (main.js) and the agent tools (agent/core.mjs) both use it; tests/agent-prefill.test.mjs.
import * as B from './intake-builder.js';

/** answer keys a link may never set (the person gives them on the page) */
export const NEVER_PREFILLED = ['accepted', 'guardian', 'health', 'safety'];
const MAX_HASH = 6000;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9_]{1,60}$/i;

// base64url of UTF-8 text (btoa / atob exist in browsers and in Node 22)
function b64urlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  const b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

/** the answers worth carrying: the wizard's keys only, minus the ones never prefilled */
function carried(answers) {
  const def = B.defaultAnswers('2026-01-05');
  const out = {};
  for (const k of Object.keys(def)) {
    if (NEVER_PREFILLED.includes(k) || !answers || answers[k] === undefined) continue;
    if (k !== 'start_date' && JSON.stringify(answers[k]) === JSON.stringify(def[k])) continue;   // a default: no need to carry it (shorter link)
    if (k === 'weekdays' && Array.isArray(answers[k]) && !answers[k].length) continue;
    out[k] = answers[k];
  }
  return out;
}

/**
 * The fragment for a prefilled link: '#a=...' (+ '&l=es'). Never carries accepted / guardian / health / safety.
 * @param {object} answers the wizard's answers (defaultAnswers shape; partial is fine) @param {{lang?: 'en'|'es'}} [opts]
 */
export function encodePrefill(answers, opts = {}) {
  const a = carried(answers);
  let frag = '#a=' + b64urlEncode(JSON.stringify(a));
  if (opts.lang === 'en' || opts.lang === 'es') frag += '&l=' + opts.lang;
  return frag;
}

/** the full link: the site's address (its path kept, any old fragment dropped) + the fragment */
export function prefillLink(siteUrl, answers, opts = {}) {
  const u = new URL(siteUrl);
  u.hash = '';
  return u.href.replace(/#$/, '') + encodePrefill(answers, opts);
}

const oneOf = (v, list) => list.includes(v);
const isInt = (v) => Number.isInteger(v);

/** check one carried answer against the wizard's choices; returns the clean value or undefined */
function clean(key, v, def) {
  switch (key) {
    case 'role': return oneOf(v, ['self', 'client']) ? v : undefined;
    case 'health_route': return oneOf(v, ['coach_screen', 'coach_own_sop']) ? v : undefined;
    case 'age': return isInt(v) && v >= 10 && v <= 90 ? v : undefined;
    case 'weight': return typeof v === 'number' && v >= 20 && v <= 700 ? v : undefined;
    case 'unit': return oneOf(v, ['lb', 'kg']) ? v : undefined;
    case 'years': return oneOf(v, B.YEARS_CHOICES) ? v : undefined;
    case 'goal': return oneOf(v, B.GOALS) ? v : undefined;
    case 'format': return oneOf(v, ['gym', 'bootcamp']) ? v : undefined;
    case 'sport': {
      if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
      const s = { ...def };
      if (typeof v.id === 'string' && ID.test(v.id)) s.id = v.id;
      if (typeof v.position === 'string' && ID.test(v.position)) s.position = v.position;
      if (typeof v.detail === 'string' && ID.test(v.detail)) s.detail = v.detail;
      if (oneOf(v.season, B.SEASON_TYPES)) s.season = v.season;
      if (typeof v.season_date === 'string' && ISO.test(v.season_date)) s.season_date = v.season_date;
      if (oneOf(v.level, B.LEVELS_OF_PLAY)) s.level = v.level;
      if (isInt(v.practice) && v.practice >= 0 && v.practice <= 7) s.practice = v.practice;
      return s;
    }
    case 'activity': {
      if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
      const ac = { ...def, play_days: [] };
      if (typeof v.id === 'string' && ID.test(v.id)) ac.id = v.id;
      if (Array.isArray(v.play_days)) ac.play_days = B.WEEKDAYS.filter(d => v.play_days.includes(d));
      if (typeof v.league === 'string' && ID.test(v.league)) ac.league = v.league;
      if (typeof v.style === 'string' && ID.test(v.style)) ac.style = v.style;
      if (typeof v.event_date === 'string' && ISO.test(v.event_date)) ac.event_date = v.event_date;
      return ac;
    }
    case 'focus': {
      if (!Array.isArray(v)) return undefined;
      let out = [];
      for (const f of v) if (oneOf(f, B.FOCUS_CHOICES) && !out.includes(f)) out = B.toggleFocus(out, f);
      return out;
    }
    case 'split': return oneOf(v, ['default', 'ppl', 'upper_lower']) ? v : undefined;
    case 'days': return oneOf(v, B.DAYS_CHOICES) ? v : undefined;
    case 'weekdays': return Array.isArray(v) ? B.WEEKDAYS.filter(d => v.includes(d)) : undefined;
    case 'weeks': return oneOf(v, [8, 12]) ? v : undefined;
    case 'start_date': return typeof v === 'string' && ISO.test(v) ? v : undefined;
    case 'tests': return Array.isArray(v) ? B.TEST_CHOICES.filter(t => v.includes(t)) : undefined;
    case 'equipment': return typeof v === 'string' && /^[A-Z_]{2,40}$/.test(v) ? v : undefined;
    case 'extras': return Array.isArray(v) ? B.EXTRA_CHOICES.filter(t => v.includes(t)) : undefined;
    case 'pain': {
      if (!Array.isArray(v)) return undefined;
      const seen = new Set();
      return v.filter(p => p && typeof p.area === 'string' && ID.test(p.area) && oneOf(p.severity, B.SEVERITIES) && !seen.has(p.area) && seen.add(p.area))
        .map(p => ({ area: p.area, severity: p.severity }));
    }
    default: return undefined;
  }
}

/**
 * Read a prefilled link's fragment over the wizard's default answers.
 * @param {string} hash location.hash ('#a=...&l=es') @param {object} defaults defaultAnswers(today)
 * @returns {{answers: object, lang: 'en'|'es'|null, touched: string[], ignored: string[]} | null} null when the fragment is not a prefill
 */
export function decodePrefill(hash, defaults) {
  const h = String(hash || '').replace(/^#/, '');
  if (!h || h.length > MAX_HASH) return null;
  const params = new URLSearchParams(h);
  const enc = params.get('a');
  if (!enc) return null;
  let raw;
  try { raw = JSON.parse(b64urlDecode(enc)); } catch { return null; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const answers = { ...defaults };
  const ignored = [];
  for (const [k, v] of Object.entries(raw)) {
    if (NEVER_PREFILLED.includes(k) || !(k in defaults)) { ignored.push(k); continue; }
    const c = clean(k, v, defaults[k]);
    if (c === undefined) { ignored.push(k); continue; }
    answers[k] = c;
  }
  // the person accepts on the page, every time (H20); the health check is theirs to answer (R5-GEN-02)
  for (const k of NEVER_PREFILLED) answers[k] = defaults[k];
  // the weekdays must match the day count (the wizard's own rule); else the template's usual days
  if (!Array.isArray(answers.weekdays) || answers.weekdays.length !== answers.days) answers.weekdays = B.DEFAULT_WEEKDAYS[answers.days].slice();
  if (!B.splitChoices(answers.goal, answers.days).includes(answers.split)) answers.split = 'default';
  const l = params.get('l');
  return { answers, lang: l === 'en' || l === 'es' ? l : null, touched: touchedOf(raw), ignored };
}

/** the wizard questions a link answered (main.js's "touched" names), so they do not pulse as unanswered */
function touchedOf(raw) {
  const map = { role: 'role', age: 'age', weight: 'weight', unit: 'weight', years: 'years', goal: 'goal', sport: 'detail', activity: 'detail',
    focus: 'detail', format: 'detail', days: 'days', weekdays: 'weekdays', equipment: 'kit', pain: 'pain' };
  const out = [];
  for (const k of Object.keys(raw)) if (map[k] && !out.includes(map[k])) out.push(map[k]);
  if (raw.activity && Array.isArray(raw.activity.play_days) && raw.activity.play_days.length) out.push('playdays');
  return out;
}
