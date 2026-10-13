// Blaze Camp engine 0.7 - work package "safety gate, printed words, public files" (coach_answers_round5.md). One describe per round-5
// answer, named by its id: R5-GEN-02 (a health-check flag warns, it no longer stops the plan), R5-GRD-06 (the core block is printed as
// optional and adjustable), R5-PUB-01 (the public sheet exports hold no third-party video links and no client names), R5-PUB-02
// (credentials as written: "Master NASM coach" only) and the coach's grades of the 8 samples. Every plan here is generated in the test.
// Layer: tools/fixture/v07-words.mjs; decisions: engine/DECISIONS.md G-270 ... G-289.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw, loadModelWithoutHealthFlag, ROOT } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import { safetyScreen } from '../engine/intake.mjs';
import { amendRulesW7, UI_W7, ES_PRIORITY_W7 } from '../tools/fixture/v07-words.mjs';
import { UI_P7 } from '../tools/fixture/v07-plain.mjs'; // plain words win over every earlier layer (CH7-09, G-315)

const clone = (x) => JSON.parse(JSON.stringify(x));
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const SAMPLES = Object.keys(NAMES);
const SAFETY_KEYS = ['heart', 'surgery_6mo', 'pregnant_postpartum_6mo', 'injury_in_treatment', 'doctor_said_no'];
const compiled = loadCompiledModel();
const model = compiled || loadFixtureModel();
const raw = compiled ? readModelDir() : readFixtureRaw();
const HF = model.rules.legal.health_flag;
const t = (lang, k, a) => model.t(lang, k, a);
const unesc = (s) => s.replace(/\\([\\*_`])/g, '$1');
const sample = (n, mut) => { const i = clone(loadSample(NAMES[n])); if (mut) mut(i); return i; };
const md = (p, lang = 'en', opts = {}) => unesc(renderPlan(p, model, { lang, ...opts }));
const check = (res, id) => res.checks.find(c => c.id === id);
const asCoach = (route) => (i) => { i.role = 'client'; i.health_route = route; i.release.version = 'release.coach'; delete i.release.guardian; };
const SEVERE_KNEE = [{ area: 'knee', side: 'left', severity: 'severe', worse_with: [] }];
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };

describe('v0.7 words - the amendment layer', () => {
  it('amendRulesW7 does not change its input and is idempotent on the built model; both builds carry it', () => {
    const fx = readFixtureRaw();
    const r0 = clone(fx.rules);
    const r1 = amendRulesW7(fx.rules);
    assert.deepEqual(fx.rules, r0);
    assert.deepEqual(r1, fx.rules, 'the fixture already carries the layer');
    assert.deepEqual(raw.rules.legal.health_flag, fx.rules.legal.health_flag);
    assert.deepEqual(raw.rules.render.v7, fx.rules.render.v7);
  });
  it('R2-GEN-08 / H14: every new line has EN and ES with the same placeholders; the machine-written Spanish waits in es_review.priority_review', () => {
    const PH = (s) => [...String(s).matchAll(/\{([a-z_]+)\}/g)].map(m => m[1]).sort().join(',');
    for (const [k, [en, es]] of Object.entries(UI_W7)) {
      if (!(k in UI_P7)) { assert.equal(raw.i18n.en[k], en, k); assert.equal(raw.i18n.es[k], es, k); } // (plain words, CH7-09 / G-315: a line the last words layer rewrote is checked in tests/v07-plain-words.test.mjs)
      assert.equal(PH(en), PH(es), `placeholders ${k}`);
    }
    if (compiled) for (const k of ES_PRIORITY_W7) assert.ok(raw.i18n.es_review.priority_review.includes(k), k);
  });
});

describe('R5-GEN-02: a health-check flag no longer stops the plan; the plan is built with a clear warning', () => {
  it('R5-GEN-02: the rule is on (warn), the release gate is unchanged and required, the warning wording is marked for the attorney', () => {
    assert.equal(HF.on_flag, 'warn');
    assert.equal(HF.gate_unchanged, true);
    assert.equal(model.rules.legal.gate.required, true);
    assert.ok(HF.refs.includes('R5-GEN-02'));
    for (const k of [HF.line_key, HF.short_key, HF.warning_key]) {
      assert.match(t('en', k), /\[LEGAL REVIEW\]/, k);
      assert.match(t('es', k), /\[REVISIÓN LEGAL\]/, k);
    }
    // the coach's words: general fitness information, not a plan from a doctor, see a medical professional
    assert.match(t('en', HF.line_key), /general fitness information/);
    assert.match(t('en', HF.line_key), /not a plan from a doctor/);
    assert.match(t('en', HF.line_key), /medical professional/);
  });

  for (const key of SAFETY_KEYS) {
    it(`R5-GEN-02: a yes on '${key}' builds a valid plan that prints the warning in English and Spanish`, () => {
      const p = generate(sample('06', i => { i.safety[key] = true; }), model);
      assert.equal(p.status, 'ok');
      assert.equal(p.refer, null);
      assert.ok(p.weeks.length > 0);
      assert.equal(p.validation.ok, true, JSON.stringify(p.validation.checks.filter(c => !c.pass)));
      assert.equal(p.meta.health.warn, true);
      assert.equal(p.meta.health.refer, false);
      assert.deepEqual(p.meta.health.reasons, [HF.answer_reason_key], 'G-274: a yes on the health check, never which one');
      assert.ok(!JSON.stringify(p).includes('refer.reason.' + key), 'G-274: the answer is nowhere in the plan');
      assert.ok(p.meta.warnings.some(w => w.key === HF.warning_key));
      for (const lang of ['en', 'es']) {
        const full = md(p, lang);
        assert.ok(full.includes(t(lang, HF.label_key)), `${lang}: label`);
        assert.ok(full.includes(t(lang, HF.line_key)), `${lang}: the full warning`);
        assert.ok(full.toLowerCase().includes(t(lang, HF.answer_reason_key).toLowerCase()), `${lang}: what raised it`);
        assert.ok(!full.toLowerCase().includes(t(lang, 'refer.reason.' + key).toLowerCase()), `${lang}: G-274: not which answer`);
        // up front: before the first week
        assert.ok(full.indexOf(t(lang, HF.line_key)) < full.indexOf('\n## '), `${lang}: printed at the top`);
        // never 'nothing in it asked for a doctor first' on a flagged plan
        assert.ok(!full.includes(t(lang, 'ui.plan.health_check_ok')), `${lang}: no 'health check ok' stamp`);
        assert.ok(full.includes(t(lang, HF.stamp_key)), `${lang}: the flagged stamp`);
        // the short line on the week and day views
        for (const view of ['week', 'day', 'block']) assert.ok(md(p, lang, { view, weeks: [1] }).includes(t(lang, HF.short_key)), `${lang} ${view}: short line`);
      }
    });
  }

  it('R5-GEN-02: a plan with no flag prints no health warning and keeps "health check ok"', () => {
    const p = planOf('06');
    assert.equal(p.meta.health.warn, false);
    assert.ok(!p.meta.warnings.some(w => w.key === HF.warning_key));
    for (const lang of ['en', 'es']) {
      const full = md(p, lang);
      assert.ok(!full.includes(t(lang, HF.line_key)) && !full.includes(t(lang, HF.short_key)), lang);
      assert.ok(full.includes(t(lang, 'ui.plan.health_check_ok')), lang);
    }
  });

  it('R5-GEN-02 / H20: the release gate still comes first - no release, no plan, even with a health flag', () => {
    const p = generate(sample('06', i => { i.safety.heart = true; i.release.accepted = false; }), model);
    assert.equal(p.status, 'invalid');
    assert.deepEqual(p.weeks, []);
    assert.ok(p.errors.some(e => e.code === 'release_missing'));
  });

  it('R5-GEN-02 / G-270: the health warning is said once, up front - not a second time in the notices', () => {
    const full = md(generate(sample('06', i => { i.safety.heart = true; }), model), 'en');
    assert.equal(full.split(t('en', HF.warning_key)).length - 1, 0, 'the notice line is not printed');
    assert.equal(full.split(t('en', HF.line_key)).length - 1, 1, 'the full warning once');
  });

  it('R5-GEN-02 / G-271 (PROPOSED): severe pain builds the plan with the moderate pain rules and the same warning', () => {
    const p = generate(sample('08', i => { i.pain = clone(SEVERE_KNEE); }), model);
    assert.equal(p.status, 'ok');
    assert.equal(p.validation.ok, true, JSON.stringify(p.validation.checks.filter(c => !c.pass)));
    assert.equal(p.meta.health.warn, true);
    assert.deepEqual(p.meta.health.reasons, ['refer.reason.severe_pain']);
    const pain = p.meta.derived.pain;
    assert.equal(pain[0].severity, HF.severe_pain.build_as);
    assert.equal(pain[0].reported_severity, 'severe');
    assert.ok(p.meta.warnings.some(w => /pain_plan/.test(w.code || w.key)), 'the pain rules are applied');
    for (const lang of ['en', 'es']) assert.ok(md(p, lang).toLowerCase().includes(t(lang, 'refer.reason.severe_pain').toLowerCase()), lang);
    // planned like the same intake with moderate pain: the same muscle-group schedule
    const m = generate(sample('08', i => { i.pain = clone(SEVERE_KNEE); i.pain[0].severity = 'moderate'; }), model);
    assert.deepEqual(p.weeks.map(w => w.target_by_group), m.weeks.map(w => w.target_by_group));
  });

  it('R5-GEN-02 / G-274: a yes and severe pain together: both reasons, in that order; a plan naming the health answer fails V1', () => {
    const p = generate(sample('08', i => { i.safety.surgery_6mo = true; i.safety.heart = true; i.pain = clone(SEVERE_KNEE); }), model);
    assert.equal(p.status, 'ok');
    assert.deepEqual(p.meta.health.reasons, [HF.answer_reason_key, 'refer.reason.severe_pain']);
    assert.equal(p.validation.ok, true);
    const named = clone(p); named.meta.health.reasons = ['refer.reason.heart'];
    assert.equal(check(validatePlan(named, model), 'V1').pass, false);
  });

  it('R5-GEN-02 / G-272: the coach routes - coach_screen warns on a flag; coach_own_sop skips the check (bypass warning) but severe pain still warns', () => {
    const screen = generate(sample('06', i => { asCoach('coach_screen')(i); i.safety.doctor_said_no = true; }), model);
    assert.equal(screen.status, 'ok');
    assert.equal(screen.validation.ok, true);
    assert.equal(screen.meta.health.warn, true);
    assert.deepEqual(screen.meta.health.reasons, [HF.answer_reason_key]);
    const sop = generate(sample('06', i => { asCoach('coach_own_sop')(i); i.safety = null; }), model);
    assert.equal(sop.status, 'ok');
    assert.equal(sop.meta.health.bypass, true);
    assert.equal(sop.meta.health.warn, false);
    assert.ok(sop.meta.warnings.some(w => w.key === 'warning.coach_bypass'));
    const sopSevere = generate(sample('06', i => { asCoach('coach_own_sop')(i); i.safety = null; i.pain = clone(SEVERE_KNEE); }), model);
    assert.equal(sopSevere.status, 'ok');
    assert.equal(sopSevere.validation.ok, true, JSON.stringify(sopSevere.validation.checks.filter(c => !c.pass)));
    assert.equal(sopSevere.meta.health.bypass, true);
    assert.equal(sopSevere.meta.health.warn, true);
    assert.ok(md(sopSevere, 'en').includes(t('en', HF.line_key)));
  });

  it('R5-GEN-02 / G-273: V1 holds the new rule - a flagged ok plan without the warning, or with severe pain left unconverted, fails', () => {
    const p = generate(sample('06', i => { i.safety.heart = true; }), model);
    const noWarn = clone(p); noWarn.meta.health.warn = false;
    assert.equal(check(validatePlan(noWarn, model), 'V1').pass, false);
    const noLine = clone(p); noLine.meta.warnings = noLine.meta.warnings.filter(w => w.key !== HF.warning_key);
    assert.equal(check(validatePlan(noLine, model), 'V1').pass, false);
    const s = generate(sample('08', i => { i.pain = clone(SEVERE_KNEE); }), model);
    const raw = clone(s); raw.meta.derived.pain[0].severity = 'severe';
    assert.equal(check(validatePlan(raw, model), 'V1').pass, false);
    const ok = validatePlan(clone(p), model);
    assert.equal(check(ok, 'V1').pass, true);
    assert.equal(check(ok, 'V21').pass, true);
    assert.equal(check(ok, 'H20').pass, true);
  });

  it('R5-GEN-02: the retired stop is kept only for a model without rules.legal.health_flag (engine 0.6 shape)', () => {
    const old = loadModelWithoutHealthFlag();
    const i = sample('06', x => { x.safety.heart = true; });
    assert.equal(safetyScreen(i, old).refer, true);
    const p = generate(i, old);
    assert.equal(p.status, 'refer');
    assert.deepEqual(p.weeks, []);
  });
});

describe('R5-GRD-06: the core block is optional and says so; everything is adjustable', () => {
  const CO = model.rules.render.v7.core_optional;
  it('R5-GRD-06: the engine still builds the core block on every main day by default (H05)', () => {
    for (const n of SAMPLES) {
      const p = planOf(n);
      for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
        const core = d.blocks.find(b => b.kind === 'core');
        assert.ok(core && core.items.length && core.on !== false, `${n} w${w.n} ${d.weekday}: core block`);
      }
    }
  });
  it('R5-GRD-06: every core heading says it is optional and can be switched off or changed, in English and Spanish; the guide says so once', () => {
    for (const n of SAMPLES) {
      for (const lang of ['en', 'es']) {
        const full = md(planOf(n), lang);
        const head = '**' + t(lang, 'block.core') + ' ' + t(lang, CO.heading_suffix_key) + '**';
        assert.ok(full.includes(head), `${n} ${lang}: ${head}`);
        assert.ok(!full.includes('**' + t(lang, 'block.core') + '**'), `${n} ${lang}: no core heading without the optional line`);
        assert.equal(full.split(t(lang, CO.guide_key)).length - 1, 1, `${n} ${lang}: the guide line once`);
      }
    }
    assert.match(t('en', CO.heading_suffix_key), /optional/);
    assert.match(t('es', CO.heading_suffix_key), /opcional/);
  });
  it('R5-GRD-06 / CX-04: a core block the person switched off prints as off, not as optional', () => {
    const p = planOf('06');
    const d = p.weeks[0].days.find(x => x.kind === 'main');
    const { plan: e } = applyPlanEdits(p, [{ op: 'set_block', weekday: d.weekday, block: 'core', on: false, weeks: [1] }], model);
    const day = md(e, 'en', { view: 'day', weeks: [1] });
    assert.ok(day.includes('**' + t('en', 'block.core') + ' ' + t('en', 'edit.block_off') + '**'), 'off');
  });
});

// ---------------------------------------------------------------- R5-PUB-01: the public sheet exports
const THIRD_PARTY = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:watch|shorts|embed|live|channel|playlist|@)|vimeo\.com\/|instagram\.com\/|tiktok\.com\/|facebook\.com\/|fb\.watch\/|loom\.com\/)/i;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;
const PHONE = /\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/;
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out); else out.push(f);
  }
  return out;
}
/** the entries of a zip file (an .xlsx), inflated with node:zlib - no dependency @returns {Map<string,string>} */
function unzip(file) {
  const b = fs.readFileSync(file);
  let eocd = -1;
  for (let i = b.length - 22; i >= 0; i--) if (b.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  assert.ok(eocd >= 0, file + ': not a zip');
  const n = b.readUInt16LE(eocd + 10);
  let p = b.readUInt32LE(eocd + 16);
  const out = new Map();
  for (let k = 0; k < n; k++) {
    const method = b.readUInt16LE(p + 10), size = b.readUInt32LE(p + 20), nameLen = b.readUInt16LE(p + 28), extra = b.readUInt16LE(p + 30), comment = b.readUInt16LE(p + 32), off = b.readUInt32LE(p + 42);
    const name = b.toString('utf8', p + 46, p + 46 + nameLen);
    const data = b.subarray(off + 30 + b.readUInt16LE(off + 26) + b.readUInt16LE(off + 28)).subarray(0, size);
    out.set(name, (method === 8 ? zlib.inflateRawSync(data) : data).toString('utf8'));
    p += 46 + nameLen + extra + comment;
  }
  return out;
}
const PUBLIC_TEXT = () => [
  ...walk(path.join(ROOT, 'dumps')),
  ...walk(path.join(ROOT, 'analysis')),
  path.join(ROOT, 'synthesis', '02_exercise_catalog_crosswalk.json'),
  ...fs.readdirSync(path.join(ROOT, 'design', 'scratch')).filter(d => /^snap/.test(d)).flatMap(d => walk(path.join(ROOT, 'design', 'scratch', d)))
].filter(f => !/\.(xlsx|png|jpg|gif|pdf)$/i.test(f));

describe('R5-PUB-01: the public sheet exports hold no third-party video links and no client contact details', () => {
  it('R5-PUB-01: dumps/, analysis/, the crosswalk and the design/scratch snapshots: no third-party video link (only YouTube search links built from names)', () => {
    const bad = [];
    for (const f of PUBLIC_TEXT()) {
      const s = fs.readFileSync(f, 'utf8');
      const lines = s.split('\n');
      lines.forEach((l, i) => { if (THIRD_PARTY.test(l)) bad.push(path.relative(ROOT, f) + ':' + (i + 1)); });
    }
    assert.deepEqual(bad.slice(0, 20), []);
  });
  it('R5-PUB-01: raw/*.xlsx: no third-party video link in any cell or hyperlink target; the internal sheet links and the workbook parts are kept', () => {
    for (const f of ['MASTER_MODEL.xlsx', 'BYOP.xlsx']) {
      const z = unzip(path.join(ROOT, 'raw', f));
      assert.ok(z.has('xl/workbook.xml') && z.has('xl/sharedStrings.xml'), f);
      for (const [name, s] of z) assert.ok(!THIRD_PARTY.test(s), `${f} ${name}`);
      for (const [name, s] of z) if (/_rels\/.*\.rels$/.test(name)) assert.ok(!/TargetMode="External"[^>]*youtu|youtu[^>]*TargetMode="External"/.test(s), `${f} ${name}`);
    }
    const mm = unzip(path.join(ROOT, 'raw', 'MASTER_MODEL.xlsx'));
    assert.ok([...mm.values()].some(s => s.includes('[video link removed]')), 'the removed links are marked');
    assert.ok([...mm.values()].some(s => /<hyperlink [^>]*location=/.test(s)), 'the links to other tabs are kept');
  });
  it('R5-PUB-01: no e-mail address or phone number in the sheet exports (client contact details)', () => {
    const files = [...walk(path.join(ROOT, 'dumps')), ...walk(path.join(ROOT, 'analysis')).filter(f => /\.(md|txt|json)$/.test(f))];
    const bad = [];
    for (const f of files) {
      const s = fs.readFileSync(f, 'utf8');
      if (EMAIL.test(s) || PHONE.test(s)) bad.push(path.relative(ROOT, f));
    }
    for (const f of ['MASTER_MODEL.xlsx', 'BYOP.xlsx']) {
      const ss = unzip(path.join(ROOT, 'raw', f)).get('xl/sharedStrings.xml');
      if (EMAIL.test(ss.replace(/xmlns[^"]*"[^"]*"/g, '')) || PHONE.test(ss)) bad.push(f);
    }
    assert.deepEqual(bad, []);
  });
  it('R5-PUB-01: AGENTS.md says raw/ and dumps/ are the link-stripped public exports', () => {
    const a = fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8');
    assert.match(a, /link-stripped/);
    assert.match(a, /R5-PUB-01/);
  });
});

describe('R5-PUB-02: credentials as written - "Master NASM coach" only', () => {
  it('R5-PUB-02: no certifications placeholder in README.md, MODEL_CARD.md or AGENTS.md; the credential line stays', () => {
    for (const f of ['README.md', 'MODEL_CARD.md', 'AGENTS.md']) {
      const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
      assert.ok(!/PLACEHOLDER: Coach Lalo's list of certifications/.test(s), f);
      assert.ok(!/\*\*Certifications:\*\*/.test(s), f);
      assert.match(s, /Master NASM coach/, f);
    }
  });
});

describe('R5-GRD-01..08: the coach\'s grades of the 8 samples are recorded beside the AI grades', () => {
  it('R5-GRD-01..08: README, HANDOFF and samples/SAMPLES.md carry "the coach\'s grades (round 5)": A for 01, 02, 07; B+ for 03, 04, 05, 06, 08', () => {
    for (const f of ['README.md', 'HANDOFF.md', path.join('samples', 'SAMPLES.md')]) {
      const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
      assert.match(s, /coach's grades \(round 5\)/i, f);
    }
  });
});
