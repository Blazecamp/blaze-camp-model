// app/main.js - the Plan Builder page: the intake wizard, the build (in a Web Worker), the plan view (week and day
// switcher, the day card, the progress tab), save image, download PDF and print. All state lives in memory; the only thing kept in the browser
// is the language choice (R3-GEN-01: no data kept). Every plan word comes from the engine and the model (model.t).
// One codebase, two brands: the active brand (./brand.js, written by tools/build-site.mjs) gives the name, words, look and legal
// party wording (app/brands/<id>.js, applied by app/brand-apply.js).
import { ui, LANGS } from './i18n.js';
import { BRAND } from './brand.js';
import { brandUi, brandLang, brandRaw, hasBrandWord } from './brand-apply.js';
import * as B from './intake-builder.js';
import * as V from './plan-view.js';
import * as E from './edit-ui.js';
import { markdown, inline, escapeHtml as h, stripMarkers, plain } from './md.js';
import { fetchModel } from './model-loader.js';
import { nodeToPng } from './snapshot.js';
import { deliver, toast, isMobile } from './deliver.js';
import { loadJsPdf, planPdfBlob, pdfFileName } from './pdf.js';
import { validateIntake } from '../engine/intake.mjs';
import { renderPlan } from '../engine/render.mjs';
import { decodePrefill } from './prefill.js';

const $app = document.getElementById('app');
const $print = document.getElementById('print-root');

function savedLang() { try { return localStorage.getItem(BRAND.storage_key); } catch { return null; } }
function saveLang(l) { try { localStorage.setItem(BRAND.storage_key, l); } catch { /* private mode: fine */ } }
const UI = brandUi(BRAND, ui);

const S = {
  touched: new Set(),          // the questions the person has answered on this visit (page memory only, never stored): the rest pulse softly
  lang: brandLang(BRAND, savedLang(), navigator.language),
  model: null,
  screen: 'loading',           // loading | error | wizard | building | invalid | plan
  answers: null,
  step: 0,
  q: '',                       // the sport / activity search
  plan: null, ms: null, week: 1, day: null, tab: 'day', open: new Set(), cache: {},
  // editing (app/edit-ui.js; COACH-CX CX-02 / CX-04): the generated plan and the person's steps, in page memory only (R3-GEN-01)
  hist: null, baseKeys: null, busy: false, swapOpen: null, adding: null, addq: '', addBlock: null, addSets: 3, pool: {},
  linking: null,               // Link (G-314): {n, weekday, ids} while the person taps the exercises to link
  errors: [], buildId: 0, buildTimer: null, buildStarted: 0
};
const t = (k, a) => UI(S.lang, k, a);
const mt = (k, a) => (S.model && S.model.has('en', k) ? stripMarkers(S.model.t(S.lang, k, a)) : k);
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const today = () => B.isoOf(new Date());

// ------------------------------------------------------------------------------------------------- worker

let worker = null, workerReady = false;
const pending = new Map();
function startWorker() {
  try {
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (ev) => {
      const m = ev.data || {};
      if (m.type === 'ready') { workerReady = true; return; }
      // the worker could not load the model (or start): build on this thread from now on
      if (m.type === 'error' && (m.id === null || m.id === undefined)) { dropWorker(); return; }
      const p = pending.get(m.id);
      if (!p) return;
      pending.delete(m.id);
      if (m.type === 'plan' || m.type === 'edited') p.resolve(m); else p.reject(new Error(m.message || 'worker'));
    };
    worker.onerror = (e) => { if (e && e.preventDefault) e.preventDefault(); dropWorker(); };
  } catch { worker = null; }
}
/** a module worker that fails (an older browser, a blocked file) is dropped; waiting builds run on this thread instead */
function dropWorker() {
  try { if (worker) worker.terminate(); } catch { /* already gone */ }
  worker = null;
  for (const [, p] of pending) p.fallback();
  pending.clear();
}

/** build a plan: in the worker, else on this thread after the "building" screen has painted */
async function generatePlan(intake) {
  const id = ++S.buildId;
  const local = async () => {
    await new Promise(r => setTimeout(r, 60));
    const { generate } = await import('../engine/generate.mjs');
    const t0 = performance.now();
    const plan = generate(intake, S.model);
    return { plan, ms: Math.round(performance.now() - t0) };
  };
  if (!worker) return local();
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, fallback: () => local().then(resolve, reject) });
    worker.postMessage({ type: 'generate', id, intake });
  });
}

/** apply the person's edits: in the worker (the page stays responsive), else here (engine/edit.mjs) */
async function editPlan(plan, edits, base) {
  const id = ++S.buildId;
  const local = async () => {
    const { applyPlanEdits } = await import('../engine/edit.mjs');
    const res = applyPlanEdits(plan, edits, S.model);
    return { plan: res.plan, conflicts: res.conflicts, base_conflicts: base ? applyPlanEdits(plan, [], S.model).conflicts : null };
  };
  if (!worker) return local();
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, fallback: () => local().then(resolve, reject) });
    worker.postMessage({ type: 'edit', id, plan, edits, base: !!base });
  });
}

// ------------------------------------------------------------------------------------------------- language

function setLang(l) {
  if (!LANGS.includes(l)) return;
  S.lang = l;
  saveLang(l);
  applyChrome();
  render();
}
function applyChrome() {
  document.documentElement.lang = S.lang;
  document.title = t('app.title');
  const meta = BRAND.meta && BRAND.meta[S.lang];
  const desc = document.querySelector('meta[name="description"]');
  if (meta && desc) desc.setAttribute('content', meta.description);
  const sub = document.getElementById('brand-sub');
  if (sub) sub.textContent = t('app.sub');
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === S.lang)));
  const g = document.querySelector('.lang');
  if (g) g.setAttribute('aria-label', t('lang.toggle'));
}

// ------------------------------------------------------------------------------------------------- render

function render() {
  const focusKey = document.activeElement && document.activeElement.dataset ? (document.activeElement.dataset.action || '') + '|' + (document.activeElement.dataset.value || '') : null;
  // <details> the person opened or closed stay that way across re-renders (data-keep names them)
  const kept = {};
  $app.querySelectorAll('details[data-keep]').forEach(d => { kept[d.dataset.keep] = d.open; });
  $app.className = S.screen === 'plan' ? 'plan-main' : '';
  if (S.screen === 'loading') $app.innerHTML = `<div class="loading"><div class="spinner"></div><p>${h(t('app.loading'))}</p></div>`;
  else if (S.screen === 'error') $app.innerHTML = `<div class="loading"><p>${h(t('app.load_failed'))}</p><p><button class="btn primary" data-action="reload">${h(t('app.reload'))}</button></p>${S.loadError ? `<p class="hint" style="font-size:12px;word-break:break-word">${h(S.loadError)}</p>` : ''}</div>`;
  else if (S.screen === 'wizard') $app.innerHTML = renderWizard();
  else if (S.screen === 'building') $app.innerHTML = renderBuilding();
  else if (S.screen === 'invalid') $app.innerHTML = renderInvalid();
  else if (S.screen === 'plan') $app.innerHTML = renderPlanScreen();
  $app.querySelectorAll('details[data-keep]').forEach(d => { if (d.dataset.keep in kept) d.open = kept[d.dataset.keep]; });
  if (focusKey && focusKey !== '|') {
    const [a, v] = focusKey.split('|');
    const el = $app.querySelector(`[data-action="${CSS.escape(a)}"]${v ? `[data-value="${CSS.escape(v)}"]` : ''}`);
    if (el && el.focus) el.focus({ preventScroll: true });
  }
}

const footer = () => `<div class="foot"><p>${h(t('app.credit'))}</p><p>${h(t('app.no_data'))}</p></div>`;

// ------------------------------------------------------------------------------------------------- wizard

const SCREENS = B.SCREENS;
const screenId = () => SCREENS[Math.max(0, Math.min(S.step, SCREENS.length - 1))];

function blockerWords(blocker) {
  if (!blocker || blocker === 'err.generic') return '';
  if (blocker === 'week.weekdays_hint') return t(blocker, { n: S.answers.days });
  return t(blocker);
}

function renderWizard() {
  S.step = Math.max(0, Math.min(S.step, SCREENS.length - 1));
  const id = screenId();
  const body = SCREEN[id]();
  const blocker = B.screenBlocker(id, S.answers);
  const last = S.step === SCREENS.length - 1;
  const dots = SCREENS.map((x, i) => `<span class="dot ${i < S.step ? 'done' : i === S.step ? 'on' : ''}"></span>`).join('');
  const why = blockerWords(blocker);
  return `<div class="wiz-head"><div class="dots" aria-hidden="true">${dots}</div>
    <div class="wiz-title"><h1 class="step-title">${h(t('screen.' + id))}</h1><span class="step-count" aria-label="${h(t('nav.step', { n: S.step + 1, total: SCREENS.length }))}">${h(t('screen.count', { n: S.step + 1, total: SCREENS.length }))}</span></div></div>
    ${S.step === 0 && hasBrandWord(BRAND, S.lang, 'app.welcome') ? `<div class="welcome">${hasBrandWord(BRAND, S.lang, 'app.eyebrow') ? `<p class="eyebrow">${h(t('app.eyebrow'))}</p>` : ''}<p class="lead">${h(t('app.welcome'))}</p></div>` : ''}
    <section class="wiz-body" data-step="${id}" data-screen="${id}">${body}</section>
    ${footer()}
    <nav class="wiz-nav"><div class="wiz-nav-inner">
      ${S.step > 0 ? `<button class="btn ghost" data-action="back">‹ ${h(t('nav.back'))}</button>` : ''}
      <button class="btn primary" data-action="next" ${blocker ? 'disabled aria-disabled="true"' : ''}>${h(last ? t('nav.build') : t('nav.next'))} ›</button>
    </div>${why ? `<p class="wiz-why">${h(why)}</p>` : ''}</nav>`;
}

const chip = (action, value, label, on, extra = '') => `<button type="button" class="chip" data-action="${action}" data-value="${h(value)}" aria-pressed="${on ? 'true' : 'false'}" ${extra}>${label}</button>`;
const seg = (action, items, cur, cls = '') => `<div class="seg ${cls}" role="group">${items.map(([v, l]) => `<button type="button" data-action="${action}" data-value="${h(v)}" aria-pressed="${String(v) === String(cur)}">${h(l)}</button>`).join('')}</div>`;
const cardBtn = (action, value, title, sub, on, icon = '') => `<button type="button" class="card-btn" data-action="${action}" data-value="${h(value)}" aria-pressed="${on ? 'true' : 'false'}">${icon ? `<span class="ic" aria-hidden="true">${icon}</span>` : ''}<span class="t">${h(title)}</span>${sub ? `<span class="s">${h(sub)}</span>` : ''}</button>`;
const selectHtml = (field, label, opts, cur) => `<label class="sel"><span class="label">${h(label)}</span><select data-field="${field}">${opts.map(([v, l]) => `<option value="${h(v)}" ${String(v) === String(cur || '') ? 'selected' : ''}>${h(l)}</option>`).join('')}</select></label>`;

/** a question the person has not answered yet pulses softly until they do (coach, 2026-10-13: people slid past the training days) */
const need = (key) => (S.touched.has(key) ? '' : ' needs');
const TOUCH = {
  role: 'role', age: 'age', weight: 'weight', unit: 'weight', years: 'years', goal: 'goal',
  'sport-pick': 'detail', position: 'detail', detail: 'detail', season: 'detail', practice: 'detail', 'act-pick': 'detail', playday: 'playdays',
  league: 'detail', style: 'detail', focus: 'detail', format: 'detail',
  days: 'days', weekday: 'weekdays', kit: 'kit', pain: 'pain', 'pain-none': 'pain', sev: 'pain', route: 'health', health: 'health', safety: 'health',
  accepted: 'accept', guardian: 'accept', season_date: 'detail', event_date: 'detail'
};
const markAnswered = (action) => { if (TOUCH[action]) S.touched.add(TOUCH[action]); };

const GOAL_ICON = { muscle: '◆', strength: '▲', fat_loss: '◉', general: '✚', athletic: '➤', active: '✦' };

const SCREEN = {
  you() {
    const a = S.answers;
    return `<div class="field${need('role')}"><span class="label">${h(t('about.role'))}</span>${seg('role', [['self', t('about.role.self')], ['client', t('about.role.client')]], a.role, 'small')}</div>
      <div class="row2">
        <div class="field${need('age')}"><label class="label" for="age">${h(t('about.age'))}</label>
          <div class="stepper"><button type="button" data-action="age" data-value="-1" aria-label="${h(t('stepper.less'))}">−</button>
          <input id="age" type="number" inputmode="numeric" min="10" max="90" value="${h(a.age)}" data-field="age">
          <button type="button" data-action="age" data-value="1" aria-label="${h(t('stepper.more'))}">+</button></div></div>
        <div class="field${need('weight')}"><div class="label-row"><label class="label" for="weight">${h(t('about.weight'))}</label>${seg('unit', [['lb', 'lb'], ['kg', 'kg']], a.unit, 'tiny')}</div>
          <div class="stepper"><button type="button" data-action="weight" data-value="-1" aria-label="${h(t('stepper.less'))}">−</button>
          <input id="weight" type="number" inputmode="numeric" min="20" max="700" value="${h(a.weight)}" data-field="weight">
          <button type="button" data-action="weight" data-value="1" aria-label="${h(t('stepper.more'))}">+</button></div></div>
      </div>
      <div class="field${need('years')}"><span class="label">${h(t('about.years'))}</span>
        <div class="chips grid3">${B.YEARS_CHOICES.map(y => chip('years', y, h(t('about.years.' + y)), a.years === y)).join('')}</div></div>
      ${B.isMinor(a) ? `<p class="note">${h(t('about.minor_note'))}</p>` : ''}`;
  },
  goal() {
    const a = S.answers;
    const d = a.goal ? B.detailStepFor(a.goal) : null;
    if (!d) return `<div class="cards${need('goal')}">${B.GOALS.map(g => cardBtn('goal', g, t('goal.' + g), t('goal.' + g + '.sub'), a.goal === g, GOAL_ICON[g])).join('')}</div>`;
    // a goal with details: the cards shrink to one compact grid and the details open right under them, on the same screen
    const cards = `<div class="cards mini${need('goal')}">${B.GOALS.map(g => cardBtn('goal', g, t('goal.' + g), '', a.goal === g, GOAL_ICON[g])).join('')}</div>`;
    return cards + `<div class="detail${need('detail')}" data-detail="${d}">${DETAIL[d]()}</div>`;
  },
  week() {
    const a = S.answers;
    const play = a.goal === 'active' ? a.activity.play_days : [];
    const profiles = S.model.rules.equipment.intake_profiles;
    let out = `<div class="field${need('days')}"><span class="label">${h(t('week.days'))}</span><div class="chips grid5">${B.DAYS_CHOICES.map(d => chip('days', d, String(d), a.days === d)).join('')}</div>
      ${a.days === 2 ? `<p class="hint">${h(t('week.two_day_note'))}</p>` : ''}</div>`;
    out += `<div class="field${need('weekdays')}"><span class="label">${h(t('week.weekdays'))} <span class="label-sub">${h(t('week.weekdays_hint', { n: a.days }))}</span></span><div class="chips grid7">${B.WEEKDAYS.map(d => chip('weekday', d, h(t('weekday.short.' + d)) + (play.includes(d) ? `<small>${h(t('week.play_mark'))}</small>` : ''), a.weekdays.includes(d))).join('')}</div></div>`;
    out += `<div class="field${need('kit')}"><span class="label">${h(t('week.kit'))}</span><div class="cards kit">${profiles.map(p => cardBtn('kit', p, mt('intake.equipment.opt.' + p), t('kit.sub.' + p), a.equipment === p)).join('')}</div></div>`;
    out += optionsHtml();
    return out;
  },
  safety() {
    const a = S.answers;
    const areas = Object.keys(S.model.rules.volume.pain.areas);
    let out = `<div class="field${need('pain')}"><span class="label">${h(t('health.pain'))}</span><div class="chips small pain">${chip('pain-none', 'none', h(mt('intake.pain.opt.none')), S.touched.has('pain') && !a.pain.length)}${areas.map(ar => chip('pain', ar, h(mt('intake.pain.opt.' + ar)), a.pain.some(p => p.area === ar))).join('')}</div>`;
    if (a.pain.length) {
      out += `<p class="hint">${h(t('health.pain_hint'))}</p>` + a.pain.map(p => `<div class="pain-row"><span class="name">${h(mt('intake.pain.opt.' + p.area))}</span>${seg('sev', B.SEVERITIES.map(s => [p.area + ':' + s, t('health.sev.' + s)]), p.area + ':' + p.severity)}</div>`).join('');
    }
    out += '</div>';
    out += healthHtml();
    out += acceptHtml();
    return out;
  }
};

/** the goal's details, inline under the goal cards */
const DETAIL = {
  sport() {
    const s = S.answers.sport;
    if (!s.id) return `<span class="label">${h(t('goal.pick_sport'))}</span>${pickerHtml('sport')}`;
    const ps = S.model.pickerSport(s.id);
    const any = t('sport.position.any');
    let out = `<div class="picked"><span class="t">${h(mt(ps.name_key))}</span><button type="button" class="link-btn" data-action="sport-change">${h(t('pick.change'))}</button></div>`;
    const sels = [];
    if ((ps.positions || []).length) sels.push(selectHtml('position', t('sport.position_opt'), [['', any], ...ps.positions.map(p => [p.value, mt(p.name_key)])], s.position));
    if (ps.second_choice && (ps.second_choice.options || []).length) sels.push(selectHtml('detail', t('sport.detail_opt', { label: mt(ps.second_choice.name_key) }), [['', any], ...ps.second_choice.options.map(o => [o.value, mt(o.name_key)])], s.detail));
    if (sels.length) out += `<div class="sels">${sels.join('')}</div>`;
    const seasonWord = t('sport.season.' + s.season) + (s.season !== 'no_season' && s.season_date ? ' ' + s.season_date : '');
    const open = s.season !== 'no_season' && !s.season_date;
    out += `<details class="more" data-keep="sport-more" ${open ? 'open' : ''}><summary><span class="st"><span>${h(t('sport.more'))}</span><span class="cur">${h(seasonWord)} · ${h(t('sport.practice'))}: ${h(String(s.practice))}</span></span></summary><div class="body">
      <div class="field"><span class="label">${h(t('sport.season'))}</span><div class="chips small">${B.SEASON_TYPES.map(x => chip('season', x, h(t('sport.season.' + x)), s.season === x)).join('')}</div>
      ${s.season !== 'no_season' ? `<p class="hint"><label for="sdate">${h(t('sport.season_date'))}</label></p><input id="sdate" class="date" type="date" min="${today()}" value="${h(s.season_date || '')}" data-field="season_date">` : ''}</div>
      <div class="field"><span class="label">${h(t('sport.practice'))}</span><div class="chips grid8">${[0, 1, 2, 3, 4, 5, 6, 7].map(n => chip('practice', n, String(n), s.practice === n)).join('')}</div></div></div></details>`;
    return out;
  },
  activity() {
    const ac = S.answers.activity;
    if (!ac.id) return `<span class="label">${h(t('goal.pick_activity'))}</span>${pickerHtml('activity')}`;
    const act = S.model.activity(ac.id);
    let out = `<div class="picked"><span class="t">${h(mt(act.name_key))}</span><button type="button" class="link-btn" data-action="act-change">${h(t('pick.change'))}</button></div>`;
    const sels = [];
    const any = t('sport.position.any');
    if ((act.league_sport || []).length) sels.push(selectHtml('league', t('activity.league'), [['', any], ...act.league_sport.map(x => [x.value, S.model.hasSport(x.profile) ? mt(S.model.sport(x.profile).name_key) : cap(String(x.value).replace(/_/g, ' '))])], ac.league));
    if ((act.style || []).length) sels.push(selectHtml('style', t('activity.style'), [['', any], ...act.style.map(x => [x.value, t('activity.style.' + x.value) !== 'activity.style.' + x.value ? t('activity.style.' + x.value) : cap(String(x.value).replace(/_/g, ' '))])], ac.style));
    if (sels.length) out += `<div class="sels">${sels.join('')}</div>`;
    out += `<div class="field${need('playdays')}"><span class="label">${h(t('activity.play_days'))}</span><div class="chips grid7">${B.WEEKDAYS.map(d => chip('playday', d, h(t('weekday.short.' + d)), ac.play_days.includes(d))).join('')}</div></div>`;
    out += `<details class="more" ${ac.event_date ? 'open' : ''}><summary><span class="st"><span>${h(t('activity.event'))}</span>${ac.event_date ? `<span class="cur">${h(ac.event_date)}</span>` : ''}</span></summary><div class="body"><input id="edate" class="date" type="date" min="${today()}" value="${h(ac.event_date || '')}" data-field="event_date" aria-label="${h(t('activity.event'))}"><p class="hint">${h(t('activity.event_hint'))}</p></div></details>`;
    return out;
  },
  focus() {
    const a = S.answers;
    return `<div class="field"><span class="label">${h(t('focus.label'))}</span>
      <div class="chips grid3 small">${B.FOCUS_CHOICES.map(f => chip('focus', f, h(focusLabel(f)), a.focus.includes(f))).join('')}</div>
      <p class="hint">${h(t('focus.count', { n: B.focusSlots(a.focus) }))} · ${h(t('focus.intro').replace(/^[^.]*\.\s*/, ''))}</p></div>`;
  },
  format() {
    const a = S.answers;
    return `<div class="field"><span class="label">${h(t('format.label'))}</span>${seg('format', [['gym', t('format.gym')], ['bootcamp', t('format.bootcamp')]], a.format)}
      <p class="hint">${h(t('format.' + (a.format === 'bootcamp' ? 'bootcamp' : 'gym') + '.sub'))}</p></div>`;
  }
};

/** plan length, start date, split, tests and extra kit: sensible defaults, closed by default */
function optionsHtml() {
  const a = S.answers;
  const splits = B.splitChoices(a.goal, a.days);
  const extras = B.EXTRA_CHOICES.filter(x => S.model.has('en', 'equipment.token.' + x));
  const cur = [t('week.length.' + a.weeks), a.start_date, a.tests.length ? a.tests.map(x => mt('intake.tests.opt.' + x)).join(', ') : t('week.tests.none')];
  if (splits.length) cur.unshift(t('week.split.' + (splits.includes(a.split) ? a.split : 'default')));
  if (a.supersets === 'more') cur.push(t('week.supersets.more'));
  if (a.extras.length) cur.push('+' + a.extras.length);
  let body = '';
  if (splits.length) body += `<div class="field"><span class="label">${h(t('week.split'))}</span>${seg('split', splits.map(x => [x, t('week.split.' + x)]), splits.includes(a.split) ? a.split : 'default')}</div>`;
  body += `<div class="field"><span class="label">${h(t('week.supersets'))}</span>${seg('supersets', [['normal', t('week.supersets.normal')], ['more', t('week.supersets.more')]], a.supersets || 'normal')}<p class="hint">${h(t('week.supersets.hint'))}</p></div>`;
  body += `<div class="field"><span class="label">${h(t('week.length'))}</span>${seg('weeks', [[12, t('week.length.12')], [8, t('week.length.8')]], a.weeks)}</div>
    <div class="field"><label class="label" for="start">${h(t('week.start'))}</label><input id="start" class="date" type="date" value="${h(a.start_date)}" data-field="start_date"></div>`;
  body += `<div class="field"><span class="label">${h(t('week.tests'))}</span><div class="chips small">${chip('test', 'none', h(t('week.tests.none')), !a.tests.length)}${B.TEST_CHOICES.map(x => chip('test', x, h(mt('intake.tests.opt.' + x)), a.tests.includes(x))).join('')}</div></div>`;
  body += `<div class="field"><span class="label">${h(t('kit.extras'))}</span><div class="chips small">${extras.map(x => chip('extra', x, h(cap(mt('equipment.token.' + x))), a.extras.includes(x))).join('')}</div></div>`;
  return `<details class="more opts" data-keep="opts"><summary><span class="st"><span>${h(t('week.options'))}</span><span class="cur">${h(cur.join(' · '))}</span></span></summary><div class="body">${body}</div></details>`;
}

function healthHtml() {
  const a = S.answers;
  let out = '';
  if (a.role === 'client') {
    out += `<div class="field${need('health')}"><span class="label">${h(t('health.route'))}</span><div class="cards one compact">${['coach_screen', 'coach_own_sop'].map(r => cardBtn('route', r, mt('intake.health_route.opt.' + r), '', a.health_route === r)).join('')}</div>`;
    if (a.health_route === 'coach_own_sop') out += `<p class="note warn">${h(mt('warn.coach_bypass'))}</p>`;
    out += '</div>';
    if (a.health_route === 'coach_own_sop') return out;
  }
  const parq = S.model.rules.legal && S.model.rules.legal.parq_url;
  out += `<div class="field${need('health')}"><span class="label">${h(t('health.questions'))}</span><p class="small-text">${h(mt('health.intro'))}</p>`;
  if (a.health !== 'some') out += `<ul class="qlist">${B.SAFETY_KEYS.map(k => `<li>${h(mt('intake.safety.opt.' + k))}</li>`).join('')}</ul>`;
  out += `<div class="chips two">${chip('health', 'none', h(mt('health.none')), a.health === 'none')}${chip('health', 'some', h(mt('health.some')), a.health === 'some')}</div>`;
  if (a.health === 'some') {
    out += B.SAFETY_KEYS.map(k => `<div class="qa"><span class="q">${h(mt('intake.safety.opt.' + k))}</span>${seg('safety', [[k + ':1', t('health.yes')], [k + ':0', t('health.no')]], k + ':' + (a.safety[k] ? 1 : 0))}</div>`).join('');
    out += `<p class="note warn">${h(t('health.warn_note'))}</p>`;
  }
  if (parq) out += `<p class="hint small"><a href="${h(parq)}" target="_blank" rel="noopener noreferrer">${h(t('health.parq'))}</a></p>`;
  return out + '</div>';
}

function acceptHtml() {
  const a = S.answers;
  const L = S.model.rules.legal || {};
  const url = L.disclaimer_url ? (L.disclaimer_url[S.lang] || L.disclaimer_url.en) : '';
  const rel = releaseText(a.role === 'client' && !B.isMinor(a) ? 'release.coach' : 'release.client');
  let out = `<div class="field"><span class="label">${h(t('safety.release'))}</span><div class="release-text" tabindex="0">${rel.title ? `<p><b>${h(rel.title)}</b></p>` : ''}<p>${h(rel.body)}</p>
    ${url ? `<p><a href="${h(url)}" target="_blank" rel="noopener noreferrer">${h(mt('release.full_text_link'))}</a></p>` : ''}</div></div>`;
  if (B.isMinor(a)) {
    out += `<p class="note">${h(minorLine())}</p>`;
    out += `<label class="check ${a.guardian ? 'on' : 'needs'}"><input type="checkbox" data-field="guardian" ${a.guardian ? 'checked' : ''}><span>${h(t('accept.guardian'))}</span></label>`;
  }
  out += `<label class="check ${a.accepted ? 'on' : 'needs'}"><input type="checkbox" data-field="accepted" ${a.accepted ? 'checked' : ''}><span>${h(mt('release.own_risk'))}</span></label>`;
  return out;
}

function focusLabel(f) {
  const k = 'intake.focus.opt.' + f;
  const s = mt(k);
  return s === k ? cap(f) : s;
}

/** the release text of the model (release.client / release.coach): its title and body; the screen-mockup placeholders it carries
 *  ('[Read the full ...] [ ] I accept ... [Build my plan]') become the real link, checkbox and button of this page */
function releaseText(key) {
  const raw = S.model.has('en', key) ? S.model.t(S.lang, key) : '';
  const m = /^(.*?)\s*\((?:version|versión)\s*\[RELEASE_VERSION\]\)\s*(?:\[[^\]]*\])?\s*([\s\S]*)$/.exec(raw);
  let title = m ? m[1] : '', body = m ? m[2] : stripMarkers(raw);
  const link = S.model.has('en', 'release.full_text_link') ? ' [' + S.model.t(S.lang, 'release.full_text_link') + ']' : null;
  if (link && body.includes(link)) body = body.slice(0, body.indexOf(link));
  return { title: stripMarkers(title).trim(), body: stripMarkers(body).trim() };
}
function minorLine() {
  return mt('release.minor').replace(/\s*(?:Guardian's name|Nombre del tutor):\s*\[\s*\]\s*/i, ' ').trim();
}

// the sport / activity picker: a search box and a list (only the list re-renders while typing)
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function pickerHtml(kind) {
  return `<input class="search" type="search" placeholder="${h(t(kind === 'sport' ? 'sport.search' : 'activity.search'))}" aria-label="${h(t(kind === 'sport' ? 'sport.search' : 'activity.search'))}" value="${h(S.q)}" data-field="q" autocomplete="off">
    <div class="pick-list" id="pick-list">${pickListHtml(kind)}</div>`;
}
function pickListHtml(kind) {
  const P = S.model.profiles.picker;
  const q = norm(S.q);
  const match = (name) => !q || norm(name).includes(q);
  let out = '';
  if (kind === 'sport') {
    for (const g of P.groups) {
      const items = P.sports.filter(s => s.group === g.id && match(mt(s.name_key)));
      if (!items.length) continue;
      out += `<div class="pick-group">${h(mt(g.name_key))}</div>` + items.map(s => `<button type="button" class="pick-item" data-action="sport-pick" data-value="${h(s.id)}">${h(mt(s.name_key))}</button>`).join('');
    }
  } else {
    out = P.activities.filter(a => match(mt(a.name_key))).map(a => `<button type="button" class="pick-item" data-action="act-pick" data-value="${h(a.id)}">${h(mt(a.name_key))}</button>`).join('');
  }
  return out || `<p class="hint" style="padding:12px 14px">${h(t('pick.none_found'))}</p>`;
}

/** the template's own weekdays for a day count (validateIntake fills them), when it names that many days */
function engineWeekdays(days) {
  try {
    const probe = { ...S.answers, days, weekdays: null, accepted: true, guardian: true, health: 'none' };
    if (probe.goal === 'athletic' && !probe.sport.id) return null;
    if (probe.goal === 'active' && !probe.activity.id) return null;
    const v = validateIntake(B.buildIntake(probe, { lang: S.lang }), S.model);
    const wd = v.ok && v.intake.schedule.weekdays;
    return wd && wd.length === days ? wd : null;
  } catch { return null; }
}

// ------------------------------------------------------------------------------------------------- building and errors

const BUILD_MSGS = ['build.msg.1', 'build.msg.2', 'build.msg.3', 'build.msg.4', 'build.msg.5'];
const buildMsg = (sec) => BUILD_MSGS[Math.min(BUILD_MSGS.length - 1, Math.floor(sec / 3))];
/** the building screen: a calm moving bar (no percentage: the engine gives none) and the step it is on; only the text changes */
function renderBuilding() {
  const sec = Math.floor((performance.now() - S.buildStarted) / 1000);
  const n = S.answers && S.answers.weeks ? S.answers.weeks : 12;
  return `<div class="building" role="status" aria-live="polite">
    <h1 class="step-title">${h(t('build.title_weeks', { n }))}</h1>
    <div class="bar" aria-hidden="true"><span></span></div>
    <p class="build-msg" id="build-msg">${h(t(buildMsg(sec)))}</p>
    <p class="hint" id="build-slow" ${sec >= 6 ? '' : 'hidden'}>${h(t('build.slow'))}</p>
    <p class="hint">${h(t('build.calm'))}</p></div>`;
}
function tickBuilding() {
  const sec = Math.floor((performance.now() - S.buildStarted) / 1000);
  const m = document.getElementById('build-msg');
  if (m) { const txt = t(buildMsg(sec)); if (m.textContent !== txt) m.textContent = txt; }
  const sl = document.getElementById('build-slow');
  if (sl && sec >= 6) sl.hidden = false;
}

function renderInvalid() {
  const lines = S.errors.length ? S.errors : [t('err.generic')];
  return `<div class="wiz-head"><h1 class="step-title">${h(t('build.invalid'))}</h1></div>
    <ul class="sum">${lines.map(l => `<li><span>${h(l)}</span></li>`).join('')}</ul>
    <p style="margin-top:16px"><button class="btn primary" data-action="fix">${h(t('build.fix'))}</button></p>${footer()}`;
}

const STEP_OF_FIELD = [[/^(age|body_weight|experience|role)/, 'about'], [/^(goal|format)/, 'goal'], [/^sport/, 'sport'], [/^activity/, 'activity'],
  [/^(priority|focus)/, 'focus'], [/^(schedule|plan|prefs)/, 'week'], [/^equipment/, 'kit'], [/^(pain|safety|health_route)/, 'health'], [/^release/, 'accept']];
function stepForErrors(errs) {
  for (const e of errs) {
    const f = String(e.field || '');
    for (const [re, st] of STEP_OF_FIELD) if (re.test(f)) return SCREENS.indexOf(B.screenOfStep(st));
  }
  return 0;
}

async function startBuild() {
  const intake = B.buildIntake(S.answers, { lang: S.lang });
  // a quick check first (instant): field problems never wait for the build
  const v = validateIntake(intake, S.model);
  if (!v.ok) {
    S.errors = V.errorLines({ errors: v.errors }, S.model, S.lang);
    S.errStep = stepForErrors(v.errors);
    S.screen = 'invalid'; render(); return;
  }
  S.screen = 'building'; S.buildStarted = performance.now(); render(); window.scrollTo(0, 0);
  clearInterval(S.buildTimer);
  S.buildTimer = setInterval(() => { if (S.screen === 'building') tickBuilding(); }, 1000);
  try {
    const res = await generatePlan(intake);
    clearInterval(S.buildTimer);
    showPlan(res.plan, res.ms);
  } catch (e) {
    clearInterval(S.buildTimer);
    S.errors = [t('build.failed'), String(e && e.message || e)];
    S.errStep = S.step;
    S.screen = 'invalid'; render();
  }
}

function showPlan(plan, ms) {
  if (plan.status === 'invalid') {
    S.errors = V.errorLines(plan, S.model, S.lang);
    S.errStep = stepForErrors(plan.errors || []);
    S.screen = 'invalid'; render(); return;
  }
  S.plan = plan; S.ms = ms; S.cache = {}; S.open = new Set();
  S.hist = E.newHistory(plan); S.baseKeys = null; S.pool = {}; S.swapOpen = null; S.adding = null; S.addq = ''; S.busy = false; S.linking = null;
  S.week = 1; S.day = V.firstDay(plan, 1); S.tab = 'day';
  S.screen = 'plan';
  window.__bcLastBuildMs = ms;
  render(); window.scrollTo(0, 0);
}

// ------------------------------------------------------------------------------------------------- the plan screen

function cache() {
  const c = S.cache[S.lang] || (S.cache[S.lang] = {});
  return c;
}
function overviewMd() { const c = cache(); return c.overview || (c.overview = renderPlan(S.plan, S.model, { lang: S.lang, view: 'overview' })); }
function fullMd() { const c = cache(); return c.full || (c.full = renderPlan(S.plan, S.model, { lang: S.lang })); }

function renderPlanScreen() {
  const plan = S.plan;
  if (plan.status === 'refer') {
    return `<div class="panel md" style="margin-top:14px">${markdown(renderPlan(plan, S.model, { lang: S.lang }))}</div>
      <p><button class="btn primary" data-action="new">${h(t('plan.new'))}</button></p>${footer()}`;
  }
  const sm = V.summary(plan, S.model, S.lang);
  const sub = [sm.who || sm.goal, t('plan.days', { n: sm.days }), t('plan.weeks', { n: sm.weeks })].filter(Boolean).join(' · ');
  // one row: the plan's name and the Plan | Progress tabs (New plan sits with the actions under the card)
  const edited = S.hist && S.hist.steps.length ? ` <span class="badge edited">✎ ${h(t('edit.edited'))}</span>` : '';
  const top = `<div class="plan-bar"><div class="plan-sum"><div class="p">${h(sm.program)}${edited}</div><div class="s">${h(sub)}</div></div>
    <div class="tabs" role="tablist">
      <button role="tab" data-action="tab" data-value="day" aria-selected="${S.tab === 'day'}">${h(t('plan.tab.day'))}</button>
      <button role="tab" data-action="tab" data-value="progress" aria-selected="${S.tab === 'progress'}">${h(t('plan.tab.progress'))}</button></div></div>`;
  return top + (S.tab === 'progress' ? progressHtml() : dayViewHtml()) + footer();
}

function weekBarHtml() {
  const wi = V.weekInfo(S.plan, S.model, S.lang, S.week);
  const total = V.weeksTotal(S.plan);
  return `<div class="weekbar">
      <button class="arrow" data-action="week" data-value="-1" aria-label="${h(t('plan.prev_week'))}" ${S.week <= 1 ? 'disabled' : ''}>‹</button>
      <div class="mid"><div class="wk" aria-live="polite">${h(t('plan.week_of', { n: S.week, total }))}</div>
        <div class="ph"><span>${h(wi.phase)}</span>${wi.test ? `<span class="badge test">${h(wi.test_label)}</span>` : ''}${wi.accel ? `<span class="badge accel">⚡ ${h(t('plan.badge.accel'))}</span>` : ''}</div></div>
      <button class="arrow" data-action="week" data-value="1" aria-label="${h(t('plan.next_week'))}" ${S.week >= total ? 'disabled' : ''}>›</button></div>`;
}

function dayTabsHtml() {
  const tabs = V.dayTabs(S.plan, S.week);
  const lab = { optional: 'plan.day.optional', play: 'plan.day.play', aerobic: 'plan.day.cardio', sport: 'plan.day.sport' };
  return `<div class="daytabs" role="tablist">${tabs.map(d => {
    const kind = d.optional ? 'optional' : d.kind;
    const small = lab[kind] ? `<small>${h(t(lab[kind]))}</small>` : '';
    return `<button role="tab" class="daytab ${d.optional ? 'opt' : ''} ${d.kind}" data-action="day" data-value="${d.weekday}" aria-selected="${S.day === d.weekday}">${h(t('weekday.short.' + d.weekday))}${small}</button>`;
  }).join('')}</div>`;
}

function dayViewHtml() {
  const wi = V.weekInfo(S.plan, S.model, S.lang, S.week);
  // the week's notes: beside the card on a wide screen, under it on a phone (so the day card starts high on the screen)
  const notes = (where) => (wi && wi.notes_md ? `<details class="week-notes ${where}" data-keep="notes-${where}" ${wi.accel ? 'open' : ''}><summary>${h(t('plan.this_week'))}</summary><div class="body md">${markdown(wi.notes_md)}</div></details>` : '');
  const lg = V.legal(S.plan, S.model, S.lang);
  const hb = lg.health ? `<div class="banner health">${h(lg.health.short || lg.health.line)}</div>` : '';
  return `<div class="dayview"><div class="dv-side">${weekBarHtml()}${dayTabsHtml()}${hb}${notes('side')}</div>
    <div class="dv-main${linkingHere() ? ' linking' : ''}">${editStripHtml()}${dayCardHtml(S.week, S.day, false)}${linkBarHtml()}${addHtml()}${notes('main')}
    <div class="actions"><button class="btn" data-action="save-image"><span class="bi" aria-hidden="true">⤓</span><span class="bl">${h(t('plan.save_image'))}</span></button>${pdfBtn()}<button class="btn" data-action="new"><span class="bi" aria-hidden="true">↺</span><span class="bl">${h(t('plan.new'))}</span></button></div>${printLink()}
     <p class="hint-line">${h(t('plan.tap_hint'))}<br>${h(t('plan.swipe_hint'))}</p></div></div>`;
}

function badgeHtml(b) {
  if (!b) return '';
  if (b.kind === 'new') return `<span class="badge new">${h(t('plan.badge.new'))}</span>`;
  if (b.kind === 'sets' && b.n > 0) return `<span class="badge plus">${h(b.n === 1 ? t('plan.badge.plus_one') : t('plan.badge.plus_n', { n: b.n }))}</span>`;
  if (b.kind === 'sets' && b.n < 0) return `<span class="badge minus">${h(b.n === -1 ? t('plan.badge.minus_one') : t('plan.badge.minus_n', { n: -b.n }))}</span>`;
  return '';
}

function rowDetailsHtml(r, swapsInBar) {
  const P = [];
  if (r.effort_full) P.push(`<p><span class="k">${h(mt('ui.plan.effort'))}:</span> ${h(r.effort_full)}</p>`);
  for (const x of r.progress) P.push(`<p class="prog">${inline(x)}</p>`);
  if (r.superset_with) P.push(`<p><span class="k">${h(mt('ui.plan.superset_with'))}</span> ${inline(r.superset_with)}</p>`);
  if (r.notes.length) P.push('<ul>' + r.notes.map(n => `<li>${inline(n)}</li>`).join('') + '</ul>');
  for (const c of r.cue) P.push(`<p><em>${inline(c)}</em></p>`);
  if (r.swaps.length && swapsInBar) { /* the edit bar's Swap button lists them, with their notes (R4-LIB-04) */ }
  else if (r.swaps.length) {
    P.push(`<p class="k" style="margin-bottom:0">${h(mt('ui.plan.swaps'))}</p><ul>` + r.swaps.map(s => `<li><b>${h(s.name)}</b>${s.keeps ? `<span class="swap-k">${h(swapWords(s))}</span>` : ''}</li>`).join('') + '</ul>');
  } else if (r.md_swaps) P.push(`<p><span class="k">${h(mt('ui.plan.swaps'))}:</span> ${inline(r.md_swaps)}</p>`);
  if (r.video) {
    const label = r.video_kind === 'coach' ? mt('ui.plan.video') : mt('ui.plan.video_search');
    P.push(`<div class="vid"><a class="btn small" href="${h(r.video)}" target="_blank" rel="noopener noreferrer">▶ ${h(label)}</a>${r.copy_name ? `<code>${h(r.copy_name)}</code><button type="button" class="btn small" data-action="copy" data-value="${h(r.copy_name)}">${h(t('plan.copy'))}</button>` : ''}</div>`);
  } else if (r.md_video) P.push(`<p>${inline(r.md_video)}</p>`);
  return P.join('');
}

/** 'keeps X; loses Y' in the model's words (ui.plan.swap_note without the name) */
function swapWords(s) {
  const full = s.loses ? mt('ui.plan.swap_note', { name: '\u0001', keeps: s.keeps, loses: s.loses }) : mt('ui.plan.swap_note_keeps', { name: '\u0001', keeps: s.keeps });
  return full.replace('\u0001', '').trim().replace(/^\((.*)\)$/, '$1');
}

/** one exercise row: two short lines (name; sets × reps · reps in the tank · rest) and, tapped, its details */
/** one exercise row; `num` is what its number shows: 1, 2 ... for a straight exercise, A1, A2 ... inside a group */
function rowHtml(r, num, key, forPrint, ed) {
  const lk = ed && !forPrint ? linkingHere() : null;
  if (lk) return linkRowHtml(r, num, lk, ed);
  const open = S.open.has(key) && !forPrint;
  const bar = ed && !forPrint ? editBarHtml(r, key, ed) : '';
  const det = bar + rowDetailsHtml(r, !!bar);
  const tags = [r.superset_tag ? `<span class="badge tag">${h(r.superset_tag)}</span>` : '', ...r.tags.map(x => `<span class="badge tag">${h(x)}</span>`), badgeHtml(r.badge), r.edited && !forPrint ? `<span class="badge ed" title="${h(t('edit.badge'))}" data-snap-hide>✎</span>` : ''].join('');
  const dose = r.dose_s || r.dose;
  const meta = r.meta_s || r.meta;
  const line2 = dose || meta.length ? `<span class="r2">${dose ? `<span class="dose">${inline(dose)}</span>` : ''}${meta.length ? (dose ? ' · ' : '') + meta.map(x => inline(x)).join(' · ') : ''}${r.superset_with ? ` <span class="ss">⇄</span>` : ''}</span>` : '';
  const inner = `<span class="r1"><span class="num">${h(String(num))}</span><span class="nm">${inline(r.name)}</span><span class="bdg">${tags}</span></span>${line2}`;
  // ▶ beside every exercise: the YouTube search for its exact name (R4-LIB-05: a search link, never a third-party video). A link of
  // its own next to the row button (never inside it), so a tap opens the videos and does not open or close the row.
  const play = r.video && !forPrint ? playHtml(r) : '';
  if (det && !forPrint) {
    const btn = `<button type="button" class="row" data-action="row" data-value="${h(key)}" aria-expanded="${open}">${inner}</button>`;
    return `${play ? `<div class="row-wrap${open ? ' open' : ''}">${btn}${play}</div>` : btn}${open ? `<div class="det" data-snap-hide>${det}</div>` : ''}`;
  }
  if (play) return `<div class="row-wrap"><div class="row plain">${inner}</div>${play}</div>`;
  return `<div class="row plain">${inner}</div>`;
}

/**
 * A block's things to do, each lightly boxed (coach, 2026-10-13): a straight exercise is one card; a superset, triset, giant set,
 * circuit or WOD is one card with a coloured rail, a header in plain words ("A · SUPERSET  do A1 → A2, rest 60-90 s, repeat ×3")
 * and its exercises as lighter inner boxes, A1 → A2 ...
 */
function thingsHtml(b, keyOf, forPrint, ed) {
  const groups = b.groups || b.items.map(r => ({ kind: 'single', rows: [r] }));
  let k = 0, out = '';
  for (const g of groups) {
    if (g.kind === 'single') { out += `<div class="thing">${rowHtml(g.rows[0], ++k, keyOf(g.rows[0]), forPrint, ed)}</div>`; continue; }
    const hd = V.groupHeader(g, t);
    let inner = '';
    if (g.kind === 'wod') {
      inner += `<div class="thing wod-row">${rowHtml(g.rows[0], '', keyOf(g.rows[0]), forPrint, ed)}</div>`;
      for (const st of g.stations) {
        const play = st.video && !forPrint ? playHtml({ name: st.name, video: st.video, video_kind: st.video_kind }) : '';
        inner += `<div class="thing in"><div class="row-wrap"><div class="row plain"><span class="r1"><span class="num">${h(st.label)}</span><span class="nm">${inline(st.text)}</span></span></div>${play}</div></div>`;
      }
    } else for (const r of g.rows) inner += `<div class="thing in">${rowHtml(r, r.label, keyOf(r), forPrint, ed)}</div>`;
    out += `<div class="grp grp-${g.kind}" role="group" aria-label="${h(g.label + ' · ' + hd.kind)}"><div class="grp-h"><span class="grp-k">${h(g.label)} · ${h(hd.kind)}</span> <span class="grp-l">${h(hd.line)}</span>${hd.note ? `<span class="grp-n">${h(hd.note)}</span>` : ''}</div><div class="grp-b">${inner}</div></div>`;
  }
  return `<div class="things">${out}</div>`;
}

/** the ▶ button of a row: the exercise's YouTube search (the item's own `video` link), in a new tab or the YouTube app */
function playHtml(r) {
  const name = plain(r.name);
  const label = r.video_kind === 'coach' ? t('plan.play_coach', { name }) : t('plan.play', { name });
  return `<a class="play" href="${h(r.video)}" target="_blank" rel="noopener noreferrer" aria-label="${h(label)}" title="${h(label)}" data-snap-hide><span aria-hidden="true">▶</span></a>`;
}

/** warm-up and cool-down fold into one line ('Warm-up: 5 min any cardio + mobility'); tap to see each item */
const LINE_BLOCKS = ['warmup', 'cooldown'];

function dayCardHtml(n, weekday, forPrint) {
  const card = V.dayCard(S.plan, S.model, S.lang, n, weekday);
  const lg = V.legal(S.plan, S.model, S.lang);
  if (!card) return '';
  const tips = [card.est, ...card.tips].filter(Boolean);
  const showTips = tips.length && !forPrint && card.kind !== 'play' && card.kind !== 'sport';
  const tipsOpen = showTips && S.tips;
  // the head: day and week, the average time (information only, CT-01), the title, and the day tips toggle (the full time
  // sentence, the blocks you can switch off, supersets and what is easiest to remove)
  const est = card.est_short ? `<span class="est" title="${h(t('plan.est_label'))}">⏱ ${h(card.est_short)} <small>${h(t('plan.est_avg'))}</small></span>` : '';
  const tipsBtn = showTips ? `<button type="button" class="tips-btn" data-action="tips" aria-expanded="${tipsOpen ? 'true' : 'false'}" data-snap-hide>${h(t('plan.day_tips'))} (${tips.length}) <span aria-hidden="true">${tipsOpen ? '–' : '+'}</span></button>` : '';
  const head = `<div class="dc-head"><div class="dc-r1"><span class="wd">${h(card.weekday_name)} · ${h(mt('ui.plan.week', { n }))}</span>${est}</div>
    <div class="dc-r2"><span class="tt">${inline(card.title)}</span>${tipsBtn}</div></div>`;
  // the person edits a training day's lines (COACH-CX CX-02 / CX-04); the printed plan and the saved image never show the buttons
  const ed = !forPrint && S.hist && card.mapped && E.EDIT_DAY_KINDS.includes(card.kind) ? { n, weekday } : null;
  let body = '';
  if (card.kind === 'play' || card.kind === 'sport') {
    body = `<div class="simple-day">${inline(card.title)}</div>`;
  } else {
    if (tipsOpen) body += `<div class="dc-tips" data-snap-hide><ul>${tips.map(x => `<li>${inline(x)}</li>`).join('')}</ul></div>`;
    card.blocks.forEach((b, bi) => {
      const keyOf = (i) => `${n}.${weekday}.${(b.items[i] && b.items[i].slot_id) || bi + '.' + i}`;
      if (LINE_BLOCKS.includes(b.kind) && b.title && b.items.length) {
        const words = b.items.map(r => plain(r.name)).join(' + ');
        const rows = b.items.map((r, i) => rowHtml(r, i + 1, keyOf(i), forPrint, ed)).join('');
        body += `<details class="blk blk-line" data-keep="line-${b.kind}"><summary><b>${inline(b.title)}:</b> <span class="lw">${h(words)}</span></summary>${b.intro.map(x => `<div class="blk-intro">${inline(x)}</div>`).join('')}${rows}</details>`;
        return;
      }
      let title = b.title, opt = '';
      const m = /^(.*?)\s*(\(.*\))\s*$/.exec(b.title);
      if (m && b.kind === 'core') { title = m[1]; opt = m[2]; }
      body += `<div class="blk${b.on === false ? ' blk-off' : ''}"${b.kind ? ` data-kind="${b.kind}"` : ''}>${title ? `<div class="blk-h"><span class="blk-t"><span>${inline(title)}</span>${opt ? `<span class="opt">${inline(opt)}</span>` : ''}</span>${ed && b.toggle && b.kind ? blockSwitchHtml(b) : ''}</div>` : ''}`;
      // a circuit's own intro line is said by its group header
      const grouped = (b.groups || []).some(g => g.kind !== 'single');
      if (!(b.kind === 'circuit' && grouped)) for (const x of b.intro) body += `<div class="blk-intro">${inline(x)}</div>`;
      body += thingsHtml(b, (r) => `${n}.${weekday}.${r.slot_id || bi + '.' + b.items.indexOf(r)}`, forPrint, ed);
      body += '</div>';
    });
  }
  const foot = `<div class="dc-foot"><span class="dc-brand">${h(t('app.brand'))}</span> ${lg.health && lg.health.short ? `<span class="hw">${h(lg.health.short)}</span>` : ''}${h(lg.short)} ${lg.url ? `<a href="${h(lg.url)}" target="_blank" rel="noopener noreferrer">${h(lg.link_text)}</a>` : ''}</div>`;
  return `<article class="daycard" id="${forPrint ? '' : 'daycard'}" aria-label="${h(card.weekday_name)}">${head}${body}${foot}</article>`;
}


// ------------------------------------------------------------------------------------------------- editing (COACH-CX CX-02 / CX-04)
// A tap makes engine edits (app/edit-ui.js -> engine/edit.mjs applyPlanEdits, in the worker): the plan is recomputed (totals, the
// weekly sets, a fresh validation) and marked edited. Every step can be undone; nothing is stored or sent (R3-GEN-01).

const DONE = { swap: 'edit.done.swap', sets: 'edit.done.sets', remove: 'edit.done.remove', add: 'edit.done.add', block: 'edit.done.block', link: 'link.done_msg', unlink: 'link.unlinked_msg' };

async function runEdit(edits, kind) {
  if (!edits.length || S.busy || !S.hist) return;
  const h0 = S.hist, from = S.plan;
  S.busy = true; render();
  try {
    const res = await editPlan(from, edits, S.baseKeys === null);
    if (S.hist !== h0) return;   // a new plan was built meanwhile
    if (S.baseKeys === null) S.baseKeys = (res.base_conflicts || []).map(E.conflictKey);
    S.hist = E.pushStep(S.hist, { plan: res.plan, conflicts: res.conflicts || [], edits, kind });
    S.plan = E.current(S.hist); S.cache = {};
    S.busy = false; render();
    toast(t(DONE[kind] || 'edit.done.sets'));
  } catch (e) {
    console.warn('edit', e);
    if (S.hist === h0) { S.busy = false; render(); }
    toast(t('edit.failed'), 'error');
  }
}

function undo(all) {
  if (S.busy || !S.hist || !S.hist.steps.length) return;
  S.hist = all ? E.undoAll(S.hist) : E.undoLast(S.hist);
  S.plan = E.current(S.hist); S.cache = {}; S.swapOpen = null; S.linking = null;
  render();
  toast(t('edit.done.undo'));
}

/** Edited, Undo last / Undo all, and what the edits changed against the plan in the shown week (information only, CX-04) */
function editStripHtml() {
  if (!S.hist || !S.hist.steps.length) return S.busy ? `<div class="edit-strip" role="status"><span class="es-busy">${h(t('edit.working'))}</span></div>` : '';
  const last = S.hist.steps[S.hist.steps.length - 1];
  const c = E.conflictLines(E.newConflicts(last.conflicts, S.baseKeys), S.plan, S.model, S.lang, t, S.week);
  const dis = S.busy ? ' disabled' : '';
  const info = c.lines.length || c.other ? `<div class="es-info"><p>${h(t('edit.c.title'))}</p>${c.lines.length ? `<ul>${c.lines.map(x => `<li>${h(x)}</li>`).join('')}</ul>` : ''}${c.other ? `<p>${h(t('edit.c.other', { n: c.other }))}</p>` : ''}</div>` : '';
  return `<div class="edit-strip" role="status"><div class="es-r1"><span class="badge edited">✎ ${h(t('edit.edited'))}</span>${S.busy ? `<span class="es-busy">${h(t('edit.working'))}</span>` : ''}
    <span class="es-btns"><button type="button" class="btn small" data-action="ed-undo"${dis}>↶ ${h(t('edit.undo_last'))}</button><button type="button" class="btn small ghost" data-action="ed-undo-all"${dis}>${h(t('edit.undo_all'))}</button></span></div>
    ${info}<p class="es-note">${h(t('edit.note'))}</p></div>`;
}

/** the buttons of an opened exercise row: Sets - n + (this week and later), Swap (the line's library swaps), Remove */
function editBarHtml(r, key, ed) {
  const it = r.slot_id ? E.itemAt(S.plan, ed.n, ed.weekday, r.slot_id) : null;
  if (!E.canEdit(it)) return '';
  const v = (x) => h(r.slot_id + '|' + x);
  const dis = S.busy ? ' disabled' : '';
  const tune = E.canTune(it) ? `<div class="eb-sets"><span class="k">${h(t('edit.sets'))}</span>
      <button type="button" class="eb-step" data-action="ed-sets" data-value="${v(-1)}" aria-label="${h(t('edit.less'))}"${it.sets <= 1 || S.busy ? ' disabled' : ''}>−</button>
      <b class="eb-n" aria-live="polite">${it.sets}</b>
      <button type="button" class="eb-step" data-action="ed-sets" data-value="${v(1)}" aria-label="${h(t('edit.more'))}"${dis}>+</button>
      <small>${h(t('edit.sets_hint'))}</small></div>` : '';
  const swapOpen = S.swapOpen === key;
  const swapBtn = r.swaps.length ? `<button type="button" class="btn small" data-action="ed-swap-open" data-value="${h(key)}" aria-expanded="${swapOpen}">⇄ ${h(t('edit.swap'))}</button>` : '';
  const rm = `<button type="button" class="btn small ghost eb-rm" data-action="ed-remove" data-value="${h(r.slot_id)}"${dis}>✕ ${h(t('edit.remove'))}</button>`;
  // Link (G-314): tap it, then the other exercises of the day; Unlink takes this one out of its group
  const link = E.canLink(S.plan, ed.n, ed.weekday, r.slot_id) ? `<button type="button" class="btn small eb-link" data-action="ed-link-start" data-value="${h(r.slot_id)}"${dis}>${h(t('link.btn'))}</button>` : '';
  const unlink = it.superset ? `<button type="button" class="btn small ghost eb-unlink" data-action="ed-unlink" data-value="${h(r.slot_id)}"${dis}>${h(t('link.unlink'))}</button>` : '';
  const list = swapOpen ? `<div class="eb-swaps"><p class="k">${h(t('edit.swap_title'))}</p>${r.swaps.map(s => `<button type="button" class="swap-opt" data-action="ed-swap" data-value="${v(s.id)}"${dis}><b>${h(s.name)}</b>${s.keeps ? `<span class="swap-k">${h(swapWords(s))}</span>` : ''}</button>`).join('')}</div>` : '';
  return `<div class="edit-bar">${tune}<div class="eb-btns">${swapBtn}${link}${unlink}${rm}</div>${list}</div>`;
}

/** a block's on / off switch on its header (the engine's switchable blocks: core, athletic, power ...; R3-SES-02, R5-GRD-06) */
function blockSwitchHtml(b) {
  const on = b.on !== false;
  const k = 'block.short.' + b.kind;
  const name = S.model.has('en', k) ? mt(k) : plain(b.title);
  return `<button type="button" class="blk-sw" role="switch" aria-checked="${on}" data-action="ed-block" data-value="${h(b.kind + '|' + (on ? 0 : 1))}" aria-label="${h(t('edit.block_switch', { block: name }))}" data-snap-hide${S.busy ? ' disabled' : ''}><span class="knob" aria-hidden="true"></span>${h(on ? t('edit.on') : t('edit.off'))}</button>`;
}

/** the Link in progress on the shown day, or null */
function linkingHere() {
  const lk = S.linking;
  return lk && lk.n === S.week && lk.weekday === S.day && S.hist ? lk : null;
}

/** a row while the person picks what to link: a tap picks it (or un-picks it); a row that cannot be linked is shown dimmed */
function linkRowHtml(r, num, lk, ed) {
  const can = !!r.slot_id && E.canLink(S.plan, ed.n, ed.weekday, r.slot_id);
  const at = can ? lk.ids.indexOf(r.slot_id) : -1;
  const pick = at >= 0 ? `<span class="badge pick" aria-hidden="true">✓ ${at + 1}</span>` : '';
  const dose = r.dose_s || r.dose;
  const inner = `<span class="r1"><span class="num">${h(String(num))}</span><span class="nm">${inline(r.name)}</span><span class="bdg">${pick}</span></span>${dose ? `<span class="r2"><span class="dose">${inline(dose)}</span></span>` : ''}`;
  if (!can) return `<div class="row plain link-no">${inner}</div>`;
  return `<button type="button" class="row link-pick${at >= 0 ? ' picked' : ''}" data-action="ed-link-pick" data-value="${h(r.slot_id)}" aria-pressed="${at >= 0}">${inner}</button>`;
}

/** the bar that stays at the bottom while linking: "Tap exercises to link · 2 picked · Done · Cancel" */
function linkBarHtml() {
  const lk = linkingHere();
  if (!lk) return '';
  const n = lk.ids.length;
  return `<div class="link-bar" role="region" aria-label="${h(t('link.bar'))}" data-snap-hide><div class="lb-t"><b>${h(t('link.bar'))}</b><span aria-live="polite">${h(n >= 2 ? t('link.count', { n }) : t('link.need_two'))}</span></div>
    <div class="lb-b"><button type="button" class="btn small primary" data-action="ed-link-done"${n < 2 || S.busy ? ' disabled' : ''}>${h(t('link.done'))}</button><button type="button" class="btn small ghost" data-action="ed-link-cancel">${h(t('link.cancel'))}</button></div></div>`;
}

function poolOf() { return S.pool[S.lang] || (S.pool[S.lang] = E.libraryPool(S.plan, S.model, S.lang)); }

/** "Add exercise" under the day card: a search over the library that fits this plan, the block and the sets (default 3) */
function addHtml() {
  const d = ((V.weekOf(S.plan, S.week) || {}).days || []).find(x => x.weekday === S.day);
  if (!S.hist || !d || !E.EDIT_DAY_KINDS.includes(d.kind)) return '';
  if (S.adding !== S.day) return `<p class="add-line"><button type="button" class="btn small add-btn" data-action="ed-add-open"${S.busy ? ' disabled' : ''}>＋ ${h(t('edit.add'))}</button></p>`;
  const { kinds } = E.addBlocks(S.plan, S.week, S.day, S.model, null);
  const opts = [['', t('edit.block_auto')], ...kinds.map(k => [k, mt('block.' + k)])].map(([v, l]) => `<option value="${h(v)}"${(S.addBlock || '') === v ? ' selected' : ''}>${h(l)}</option>`).join('');
  return `<section class="add-panel" aria-label="${h(t('edit.add'))}"><div class="ap-h"><b>${h(t('edit.add_title'))}</b><button type="button" class="linkbtn" data-action="ed-add-close">${h(t('edit.close'))}</button></div>
    <div class="ap-opts"><label class="ap-blk"><span class="k">${h(t('edit.block'))}</span><select data-field="addblock">${opts}</select></label>
      <div class="eb-sets"><span class="k">${h(t('edit.sets'))}</span><button type="button" class="eb-step" data-action="ed-add-sets" data-value="-1" aria-label="${h(t('edit.less'))}"${S.addSets <= 1 ? ' disabled' : ''}>−</button><b class="eb-n">${S.addSets}</b><button type="button" class="eb-step" data-action="ed-add-sets" data-value="1" aria-label="${h(t('edit.more'))}"${S.addSets >= 8 ? ' disabled' : ''}>+</button></div></div>
    <label class="ap-l" for="addq">${h(t('edit.search'))}</label>
    <input id="addq" class="search ap-q" type="search" data-field="addq" value="${h(S.addq)}" placeholder="${h(t('edit.search_hint'))}" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div id="add-list" class="add-list">${addListHtml()}</div></section>`;
}

function addListHtml() {
  const res = E.searchLibrary(poolOf(), S.addq, S.plan, 12);
  if (!res.length) return S.addq.trim() ? `<p class="ap-sub">${h(t('edit.no_results'))}</p>` : '';
  const head = S.addq.trim() ? '' : `<p class="ap-sub">${h(t('edit.suggested'))}</p>`;
  return head + res.map(x => `<button type="button" class="add-opt" data-action="ed-add" data-value="${h(x.id)}"${S.busy ? ' disabled' : ''}><span class="an">${h(x.name)}</span>${x.addon ? `<span class="badge tag">${h(t('edit.addon'))}</span>` : ''}<span class="plus" aria-hidden="true">＋</span></button>`).join('');
}

function editAct(action, value) {
  if (S.busy && action !== 'ed-add-close') return;
  const parts = String(value || '').split('|');
  const a = parts[0], b = parts[1];
  switch (action) {
    case 'ed-sets': return runEdit(E.tuneEdits(S.plan, S.week, S.day, a, Number(b)), 'sets');
    case 'ed-swap-open': S.swapOpen = S.swapOpen === value ? null : value; return render();
    case 'ed-swap': S.swapOpen = null; return runEdit(E.swapEdits(S.plan, S.week, S.day, a, b), 'swap');
    case 'ed-remove': return runEdit(E.removeEdits(S.plan, S.week, S.day, a), 'remove');
    case 'ed-block': return runEdit(E.blockEdits(S.plan, S.day, a, b === '1'), 'block');
    case 'ed-add-open': {
      S.adding = S.day; S.addq = ''; S.addBlock = null; S.addSets = 3; render();
      const q = document.getElementById('addq');
      if (q && !isMobile()) q.focus({ preventScroll: true });
      return;
    }
    case 'ed-add-close': S.adding = null; return render();
    case 'ed-add-sets': S.addSets = Math.max(1, Math.min(8, S.addSets + Number(value))); return render();
    case 'ed-add': {
      const block = S.addBlock || E.addBlocks(S.plan, S.week, S.day, S.model, value).def;
      S.adding = null;
      return runEdit(E.addEdits(S.plan, S.day, value, block, S.addSets), 'add');
    }
    case 'ed-link-start':
      S.linking = { n: S.week, weekday: S.day, ids: E.linkStart(S.plan, S.week, S.day, value) };
      // (the open rows close: the picks, and then the new group, are seen whole)
      S.swapOpen = null; S.adding = null; S.open = new Set(); return render();
    case 'ed-link-pick': {
      const lk = linkingHere();
      if (!lk) return;
      lk.ids = lk.ids.includes(value) ? lk.ids.filter(x => x !== value) : [...lk.ids, value];
      return render();
    }
    case 'ed-link-cancel': S.linking = null; return render();
    case 'ed-link-done': {
      const lk = linkingHere();
      S.linking = null;
      if (!lk || lk.ids.length < 2) return render();
      const edits = E.linkEdits(S.plan, lk.n, lk.weekday, lk.ids);
      if (!edits.length) { render(); return toast(t('edit.failed'), 'error'); }
      return runEdit(edits, 'link');
    }
    case 'ed-unlink': return runEdit(E.unlinkEdits(S.plan, S.week, S.day, value), 'unlink');
    case 'ed-undo': return undo(false);
    case 'ed-undo-all': return undo(true);
    default:
  }
}

// ------------------------------------------------------------------------------------------------- the progress tab

function heatHtml(highlight) {
  const grid = (() => { const c = cache(); return c.grid || (c.grid = V.setsGrid(S.plan, S.model, S.lang, overviewMd())); })();
  if (!grid.length) return `<p class="sub">${h(t('progress.no_sets'))}</p>`;
  const eff = V.effortByWeek(S.plan);
  return grid.map(g => {
    const weeks = [];
    for (let w = g.from; w <= g.to; w++) weeks.push(w);
    const breaks = (g.rows[0] && g.rows[0].breaks) || [];
    const cells = (row) => {
      const vals = row.values.filter(v => typeof v === 'number');
      const lo = Math.min(...vals), hi = Math.max(...vals);
      return row.values.map((v, i) => {
        const sep = breaks.includes(i) && i > 0 ? '<td class="sep" aria-hidden="true"></td>' : '';
        if (typeof v !== 'number') return sep + '<td class="c">–</td>';
        const a = hi > lo ? 0.16 + 0.84 * (v - lo) / (hi - lo) : 0.5;
        const cur = highlight && weeks[i] === S.week ? ' cur' : '';
        return sep + `<td class="c${a > 0.55 ? ' hi' : ''}${cur}" style="background:rgba(var(--heat-rgb),${a.toFixed(2)})">${v}</td>`;
      }).join('');
    };
    const headCells = weeks.map((w, i) => (breaks.includes(i) && i > 0 ? '<th class="sep"></th>' : '') + `<th class="${highlight && w === S.week ? 'cur' : ''}">${w}</th>`).join('');
    const rows = g.rows.map(r => `<tr><td class="g" title="${h(r.name)}">${h(r.name)}</td>${cells(r)}${g.has_final ? `<td class="f">${h(r.final)}</td>` : ''}</tr>`).join('');
    const tot = g.total ? `<tr class="tot"><td class="g">${h(t('progress.total'))}</td>${cells(g.total)}${g.has_final ? `<td class="f">${h(g.total.final)}</td>` : ''}</tr>` : '';
    const effRow = `<tr><td class="g">${h(mt('ui.plan.effort'))}</td>${weeks.map((w, i) => { const e = eff.find(x => x.n === w); return (breaks.includes(i) && i > 0 ? '<td class="sep"></td>' : '') + `<td class="c eff">${h(e ? (e.intensifiers ? e.text + '+' : e.text) : '–')}</td>`; }).join('')}${g.has_final ? '<td></td>' : ''}</tr>`;
    return `<div class="heat-wrap"><table class="heat"><thead><tr><th class="g">${h(mt('ui.plan.col.week'))}</th>${headCells}${g.has_final ? `<th>${h(t('progress.final'))}</th>` : ''}</tr></thead><tbody>${rows}${tot}${effRow}</tbody></table></div>`;
  }).join('');
}

function progressHtml() {
  const lg = V.legal(S.plan, S.model, S.lang);
  const secs = (() => { const c = cache(); return c.secs || (c.secs = V.planSections(S.plan, S.model, S.lang, fullMd())); })();
  const header = V.headerMd(S.plan, S.model, S.lang, overviewMd());
  let out = editStripHtml();
  if (lg.health) out += `<div class="banner health"><b>${h(lg.health.label)}</b> ${h(lg.health.why)} ${h(lg.health.line)}</div>`;
  out += `<section class="panel"><h2>${h(t('progress.sets_title'))}</h2><p class="sub">${h(t('progress.sets_note'))} ${h(t('progress.effort_note'))}</p>${heatHtml(true)}</section>`;
  if (header) out += `<section class="panel md">${markdown(header)}</section>`;
  const openIds = ['before', 'progress'];
  for (const s of secs) out += `<details class="sec" ${openIds.includes(s.id) ? 'open' : ''}><summary>${h(s.title)}</summary><div class="md">${markdown(s.body)}</div></details>`;
  out += `<div class="banner release"><b>${h(lg.label)}</b> ${h(lg.full)} ${lg.url ? `<a href="${h(lg.url)}" target="_blank" rel="noopener noreferrer">${h(lg.link_text)}</a>` : ''}</div>`;
  out += `<div class="actions">${pdfBtn()}<button class="btn" data-action="new"><span class="bi" aria-hidden="true">↺</span><span class="bl">${h(t('plan.new'))}</span></button></div>${printLink()}`;
  return out;
}

// ------------------------------------------------------------------------------------------------- print and image

function buildPrint() {
  if (!S.plan || S.plan.status !== 'ok') { $print.innerHTML = ''; return; }
  const sm = V.summary(S.plan, S.model, S.lang);
  const lg = V.legal(S.plan, S.model, S.lang);
  const secs = V.planSections(S.plan, S.model, S.lang, fullMd()).filter(s => ['before', 'progress', 'instruction'].includes(s.id));
  let out = `<div class="pr-cover"><h1>${h(sm.program)}</h1><p>${h([sm.who || sm.goal, t('plan.days', { n: sm.days }), t('plan.weeks', { n: sm.weeks })].filter(Boolean).join(' · '))}</p>
    <div class="pr-legal"><b>${h(lg.label)}</b> ${h(lg.full)} ${h(lg.url || '')}</div>
    ${lg.health ? `<p class="banner health"><b>${h(lg.health.label)}</b> ${h(lg.health.why)} ${h(lg.health.line)}</p>` : ''}
    <div class="md">${markdown(V.headerMd(S.plan, S.model, S.lang, overviewMd()))}</div>
    <h2>${h(t('progress.sets_title'))}</h2>${heatHtml(false)}
    ${secs.map(s => `<div class="pr-sec md"><h2>${h(s.title)}</h2>${markdown(s.body)}</div>`).join('')}</div>`;
  for (const w of S.plan.weeks) {
    const wi = V.weekInfo(S.plan, S.model, S.lang, w.n);
    out += `<section class="pr-week"><h2>${h(t('plan.week_of', { n: w.n, total: wi.total }))} — ${h(wi.phase)}${wi.test ? ' · ' + h(wi.test_label) : ''}</h2>`;
    for (const d of V.dayTabs(S.plan, w.n)) {
      const c = V.dayCard(S.plan, S.model, S.lang, w.n, d.weekday);
      if (!c) continue;
      out += `<div class="pr-day"><h3>${h(c.weekday_name)} · ${inline(c.title)}</h3>${c.est ? `<div class="est">${inline(c.est)}</div>` : ''}<table>`;
      for (const b of c.blocks) {
        if (b.title) out += `<tr><td class="b" colspan="3">${inline(b.title)}${b.intro.length ? ' — ' + b.intro.map(inline).join(' ') : ''}</td></tr>`;
        let k = 0;
        for (const g of b.groups || b.items.map(r => ({ kind: 'single', rows: [r] }))) {
          if (g.kind !== 'single') { const hd = V.groupHeader(g, t); out += `<tr class="pr-g"><td colspan="3"><b>${h(g.label)} · ${h(hd.kind)}</b> ${h(hd.line)}${hd.note ? ' · ' + h(hd.note) : ''}</td></tr>`; }
          const cls = g.kind === 'single' ? '' : ' class="pr-in"';
          for (const r of g.rows) out += `<tr${cls}><td>${h(g.kind === 'single' ? String(++k) + '.' : r.label || g.label)} <b>${inline(r.name)}</b>${r.superset_tag ? ' [' + h(r.superset_tag) + ']' : ''}</td><td>${inline(r.dose)}</td><td>${r.meta.map(inline).join(' · ')}</td></tr>`;
          if (g.kind === 'wod') for (const st of g.stations) out += `<tr class="pr-in"><td>${h(st.label)} ${inline(st.text)}</td><td></td><td></td></tr>`;
        }
      }
      out += '</table></div>';
    }
    out += `<div class="pr-legal">${lg.health && lg.health.short ? h(lg.health.short) + ' ' : ''}${h(lg.short)} ${h(lg.url || '')}</div></section>`;
  }
  out += `<div class="pr-legal">${h(lg.footer)} ${h(lg.disclaimer)} ${h(lg.url || '')}<br>${h(t('app.credit'))} · ${h(t('print.generated'))} · ${h(mt('ui.plan.model_version', { model: S.plan.model_version, engine: S.plan.engine_version }))}</div>`;
  $print.innerHTML = out;
}

/** Download PDF: the button every device gets (window.print() does nothing in many iPhone in-app browsers) */
function pdfBtn() { return `<button class="btn" data-action="pdf"><span class="bi" aria-hidden="true">⤓</span><span class="bl">${h(t('plan.pdf'))}</span></button>`; }
/** Print stays as a small link on a desktop browser that can print */
function printLink() { return canPrint() ? `<p class="print-line"><button type="button" class="linkbtn" data-action="print">⎙ ${h(t('plan.print'))}</button></p>` : ''; }
function canPrint() { return typeof window.print === 'function' && !isMobile(); }

async function downloadPdf(btn) {
  if (!S.plan || S.plan.status !== 'ok' || btn.dataset.busy) return;
  const startedAt = performance.now();
  const old = btn.innerHTML;
  btn.dataset.busy = '1'; btn.disabled = true; btn.textContent = t('pdf.making');
  try {
    const JsPDF = await loadJsPdf();
    // let the button repaint before the (short) synchronous build
    await new Promise(r => setTimeout(r, 0));
    const logo = await pdfLogo();
    const blob = planPdfBlob(S.plan, S.model, S.lang, t, JsPDF, logo ? { ...BRAND, logo_data: logo } : BRAND);
    await deliver(blob, { name: pdfFileName(S.plan, BRAND.pdf.file_prefix), type: 'pdf', title: V.summary(S.plan, S.model, S.lang).program + ' - ' + BRAND.name, startedAt, words: t });
  } catch (e) {
    console.warn('pdf', e);
    toast(t('pdf.failed'), 'error');
  } finally {
    delete btn.dataset.busy; btn.disabled = false; btn.innerHTML = old;
  }
}

/** the brand's logo for the PDF cover as a data URL (fetched once, same origin); null without one or when it cannot be read */
let logoPromise = null;
function pdfLogo() {
  const L = BRAND.pdf && BRAND.pdf.logo;
  if (!L) return Promise.resolve(null);
  if (!logoPromise) {
    logoPromise = fetch(L.src, { credentials: 'same-origin' })
      .then(r => (r.ok ? r.blob() : null))
      .then(b => (b ? new Promise(res => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => res(null); fr.readAsDataURL(b); }) : null))
      .then(data => (data ? { data, w: L.w, h: L.h } : null))
      .catch(() => null);
  }
  return logoPromise;
}

async function saveImage(btn) {
  const node = document.getElementById('daycard');
  if (!node) return;
  const old = btn.innerHTML;
  const startedAt = performance.now();
  btn.disabled = true; btn.textContent = t('plan.saving');
  try {
    const bg = getComputedStyle(node).backgroundColor || '#fff';
    const blob = await nodeToPng(node, { background: bg });
    const name = `${BRAND.image_prefix}-week${S.week}-${S.day}.png`;
    await deliver(blob, { name, type: 'png', title: t('plan.share_title', { day: mt('weekday.' + S.day) }), startedAt, words: t });
  } catch {
    toast(t('plan.save_failed'), 'error');
  } finally {
    btn.disabled = false; btn.innerHTML = old;
  }
}

// ------------------------------------------------------------------------------------------------- navigation in the plan

function goWeek(delta) {
  const total = V.weeksTotal(S.plan);
  const n = Math.max(1, Math.min(total, S.week + delta));
  if (n === S.week) return;
  S.week = n;
  const tabs = V.dayTabs(S.plan, n);
  if (!tabs.some(d => d.weekday === S.day)) S.day = V.firstDay(S.plan, n);
  render();
}
function goDay(delta) {
  const tabs = V.dayTabs(S.plan, S.week);
  const i = tabs.findIndex(d => d.weekday === S.day);
  const j = i + delta;
  if (j >= 0 && j < tabs.length) { S.day = tabs[j].weekday; render(); return; }
  const total = V.weeksTotal(S.plan);
  if (j < 0 && S.week > 1) { S.week--; const t2 = V.dayTabs(S.plan, S.week); S.day = t2[t2.length - 1].weekday; render(); }
  else if (j >= tabs.length && S.week < total) { S.week++; S.day = V.dayTabs(S.plan, S.week)[0].weekday; render(); }
}

// ------------------------------------------------------------------------------------------------- events

function setA(patch) { S.answers = { ...S.answers, ...patch }; render(); }

function act(action, value, el) {
  if (S.screen === 'plan' && String(action).startsWith('ed-')) return editAct(action, value);
  // another week, day or tab (or the print / image / PDF) ends a Link that was not finished
  if (S.linking && ['week', 'day', 'tab', 'new', 'save-image', 'pdf', 'print'].includes(action)) S.linking = null;
  const a = S.answers;
  if (S.screen === 'wizard') markAnswered(action);
  switch (action) {
    case 'lang': return setLang(value);
    case 'reload': return location.reload();
    case 'role': return setA({ role: value });
    case 'age': return setA({ age: Math.max(10, Math.min(90, (Number(a.age) || 30) + Number(value))) });
    case 'weight': {
      const lim = a.unit === 'kg' ? [20, 320] : [40, 700];
      return setA({ weight: Math.max(lim[0], Math.min(lim[1], (Number(a.weight) || 0) + Number(value))) });
    }
    case 'unit': {
      if (value === a.unit) return;
      const w = value === 'kg' ? Math.round(a.weight / 2.20462) : Math.round(a.weight * 2.20462);
      return setA({ unit: value, weight: w });
    }
    case 'years': return setA({ years: Number(value) });
    case 'goal': {
      const changed = a.goal !== value;
      S.answers = { ...a, goal: value };
      if (changed) { S.q = ''; const wd = engineWeekdays(S.answers.days); if (wd) S.answers.weekdays = wd; }
      render();
      // a goal with nothing more to ask (get stronger) moves on by itself; the others open their details right here
      if (!B.detailStepFor(value)) setTimeout(() => { if (S.screen === 'wizard' && screenId() === 'goal' && S.answers.goal === value) { S.step++; render(); window.scrollTo(0, 0); } }, 180);
      return;
    }
    case 'sport-pick': S.q = ''; return setA({ sport: { ...a.sport, id: value, position: null, detail: null } });
    case 'sport-change': S.q = ''; return setA({ sport: { ...a.sport, id: null } });
    case 'position': return setA({ sport: { ...a.sport, position: value || null } });
    case 'detail': return setA({ sport: { ...a.sport, detail: value || null } });
    case 'season': return setA({ sport: { ...a.sport, season: value } });
    case 'practice': return setA({ sport: { ...a.sport, practice: Number(value) } });
    case 'act-pick': {
      S.q = '';
      S.answers = { ...a, activity: { ...a.activity, id: value, league: null, style: null } };
      const wd = engineWeekdays(S.answers.days); if (wd) S.answers.weekdays = wd;
      return render();
    }
    case 'act-change': S.q = ''; return setA({ activity: { ...a.activity, id: null } });
    case 'playday': return setA({ activity: { ...a.activity, play_days: a.activity.play_days.includes(value) ? a.activity.play_days.filter(x => x !== value) : B.WEEKDAYS.filter(d => d === value || a.activity.play_days.includes(d)) } });
    case 'league': return setA({ activity: { ...a.activity, league: a.activity.league === value ? null : value } });
    case 'style': return setA({ activity: { ...a.activity, style: a.activity.style === value ? null : value } });
    case 'focus': return setA({ focus: B.toggleFocus(a.focus, value) });
    case 'format': return setA({ format: value });
    case 'days': { const d = Number(value); S.answers = B.withDays(a, d, engineWeekdays(d)); return render(); }
    case 'weekday': return setA({ weekdays: B.toggleWeekday(a.weekdays, value, a.days) });
    case 'weeks': return setA({ weeks: Number(value) });
    case 'supersets': return setA({ supersets: value === 'more' ? 'more' : 'normal' });
    case 'split': return setA({ split: value });
    case 'test': {
      if (value === 'none') return setA({ tests: [] });
      return setA({ tests: a.tests.includes(value) ? a.tests.filter(x => x !== value) : [...a.tests, value] });
    }
    case 'kit': return setA({ equipment: value });
    case 'extra': return setA({ extras: a.extras.includes(value) ? a.extras.filter(x => x !== value) : [...a.extras, value] });
    case 'pain': return setA({ pain: a.pain.some(p => p.area === value) ? a.pain.filter(p => p.area !== value) : [...a.pain, { area: value, severity: 'mild' }] });
    case 'pain-none': return setA({ pain: [] });
    case 'sev': { const [area, sev] = value.split(':'); return setA({ pain: a.pain.map(p => (p.area === area ? { ...p, severity: sev } : p)) }); }
    case 'route': return setA({ health_route: value });
    case 'health': return setA({ health: value, safety: value === 'none' ? Object.fromEntries(B.SAFETY_KEYS.map(k => [k, false])) : a.safety });
    case 'safety': { const [k, v] = value.split(':'); return setA({ safety: { ...a.safety, [k]: v === '1' } }); }
    case 'next': {
      if (B.screenBlocker(screenId(), a)) return;
      if (S.step === SCREENS.length - 1) return startBuild();
      S.step++; render(); window.scrollTo(0, 0); return;
    }
    case 'back': S.step = Math.max(0, S.step - 1); render(); window.scrollTo(0, 0); return;
    case 'fix': S.screen = 'wizard'; S.step = S.errStep || 0; render(); return;
    case 'new':
      S.answers = { ...S.answers, accepted: false, guardian: false };   // the release is accepted for every build (H20)
      S.plan = null; S.cache = {}; S.hist = null; S.pool = {}; S.busy = false; S.adding = null; S.screen = 'wizard'; S.step = 0; render(); window.scrollTo(0, 0); return;
    case 'tab': S.tab = value; render(); return;
    case 'week': return goWeek(Number(value));
    case 'day': S.day = value; render(); return;
    case 'tips': S.tips = !S.tips; render(); return;
    case 'row': if (S.open.has(value)) S.open.delete(value); else S.open.add(value); render(); return;
    case 'copy':
      if (navigator.clipboard) navigator.clipboard.writeText(value).then(() => { el.textContent = t('plan.copied'); }, () => {});
      return;
    case 'save-image': return saveImage(el);
    case 'pdf': return downloadPdf(el);
    case 'print': buildPrint(); window.print(); return;
    default:
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  act(el.dataset.action, el.dataset.value, el, e);
});
document.addEventListener('input', (e) => {
  const f = e.target.dataset && e.target.dataset.field;
  if (f === 'addq') {
    S.addq = e.target.value;
    const list = document.getElementById('add-list');
    if (list) list.innerHTML = addListHtml();
    return;
  }
  if (f === 'q') {
    S.q = e.target.value;
    const list = document.getElementById('pick-list');
    if (list) list.innerHTML = pickListHtml(S.answers.goal === 'athletic' ? 'sport' : 'activity');
  }
});
document.addEventListener('change', (e) => {
  const el = e.target, f = el.dataset && el.dataset.field;
  if (f === 'addblock') { S.addBlock = el.value || null; return; }
  if (!f || !S.answers) return;
  const a = S.answers;
  markAnswered(f);
  if (f === 'age') return setA({ age: Math.max(10, Math.min(90, Math.round(Number(el.value) || a.age))) });
  if (f === 'weight') return setA({ weight: Math.max(1, Math.min(a.unit === 'kg' ? 320 : 700, Math.round(Number(el.value) || a.weight))) });
  if (f === 'season_date') return setA({ sport: { ...a.sport, season_date: el.value || null } });
  if (f === 'event_date') return setA({ activity: { ...a.activity, event_date: el.value || null } });
  if (f === 'position') return setA({ sport: { ...a.sport, position: el.value || null } });
  if (f === 'detail') return setA({ sport: { ...a.sport, detail: el.value || null } });
  if (f === 'league') return setA({ activity: { ...a.activity, league: el.value || null } });
  if (f === 'style') return setA({ activity: { ...a.activity, style: el.value || null } });
  if (f === 'start_date') return setA({ start_date: el.value || a.start_date });
  if (f === 'accepted') return setA({ accepted: el.checked });
  if (f === 'guardian') return setA({ guardian: el.checked });
});
document.addEventListener('keydown', (e) => {
  if (S.screen !== 'plan' || S.tab !== 'day') return;
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    const d = e.key === 'ArrowRight' ? 1 : -1;
    if (e.shiftKey) goWeek(d); else goDay(d);
  }
});
let touch = null;
document.addEventListener('touchstart', (e) => {
  if (S.screen !== 'plan' || S.tab !== 'day' || !e.target.closest('#daycard')) { touch = null; return; }
  const p = e.changedTouches[0]; touch = { x: p.clientX, y: p.clientY, t: Date.now() };
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (!touch) return;
  const p = e.changedTouches[0];
  const dx = p.clientX - touch.x, dy = p.clientY - touch.y;
  const quick = Date.now() - touch.t < 800;
  touch = null;
  if (quick && Math.abs(dx) > 60 && Math.abs(dy) < 50) goDay(dx < 0 ? 1 : -1);
}, { passive: true });
window.addEventListener('beforeprint', () => { if (S.screen === 'plan') buildPrint(); });

// ------------------------------------------------------------------------------------------------- start

// a small hook for the automated checks (the QA script fills the wizard's answers the way a person would)
window.__bc = {
  state: S,
  B, V,
  answersFromIntake: B.answersFromIntake,
  load(answers) { S.answers = { ...answers }; S.screen = 'wizard'; S.step = SCREENS.length - 1; render(); },
  build() { return startBuild(); },
  go(week, day) { S.week = week; S.day = day; render(); },
  show(plan) { showPlan(plan, 0); }
};

async function boot() {
  applyChrome();
  render();
  startWorker();
  try {
    // the disclaimer link resolves against document.baseURI: a white-label preview's <base href> (/<id> with or without the slash)
    S.model = await fetchModel(undefined, (raw) => brandRaw(raw, BRAND, document.baseURI || location.href));
  } catch (e) {
    // the real reason in small text (e.g. 'catalog.json: HTTP 401'), so a screenshot is enough to diagnose
    S.loadError = String((e && e.message) || e || '');
    S.screen = 'error'; render(); return;
  }
  S.answers = B.defaultAnswers(today());
  applyPrefill();
  S.screen = 'wizard';
  render();
}

// ---- prefilled link from an AI agent (#a=...; app/prefill.js): answers filled in, the last screen open, the person answers the
// health check and accepts the release themselves. The fragment never reaches a server; it is dropped from the address bar here.
function applyPrefill() {
  const pre = decodePrefill(location.hash, S.answers);
  if (!pre) return;
  S.answers = pre.answers;
  pre.touched.forEach(k => S.touched.add(k));
  if (pre.lang) { S.lang = pre.lang; applyChrome(); }
  S.step = SCREENS.length - 1;
  try { history.replaceState(null, '', location.pathname + location.search); } catch { /* fine */ }
}
boot();
