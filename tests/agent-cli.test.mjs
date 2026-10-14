// tests/agent-cli.test.mjs - tools/plan.mjs, the command line an agent (or a person) builds plans with: 2 samples in English and
// Spanish for both brands (Markdown, PDF, JSON, HTML), the wizard's answers shape, incomplete answers and invalid intakes (plain
// words, exit 1, nothing written), the questions, the prefilled link and edits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './helpers/models.mjs';
import { decodePrefill } from '../app/prefill.js';
import * as B from '../app/intake-builder.js';

const CLI = path.join(ROOT, 'tools/plan.mjs');
const NAMES = /blaze|\blalo\b|\bgerardo\b/i;
const PARTIES = ['Lalo Vera and BFit Studios Corp., doing business as Son Hábitos', 'Lalo Vera y BFit Studios Corp., que opera como Son Hábitos'];
function run(args, input) {
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (k === 'BRAND' || k.startsWith('SITE_URL')) delete env[k];
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', input, env, timeout: 120000 });
  return { code: r.status, out: r.stdout, err: r.stderr };
}
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'plan-cli-'));
const sample = (n) => path.join(ROOT, 'samples/intakes', n + '.json');

for (const [name, brand, lang] of [['08-pickleball-genpop', 'blazecamp', 'en'], ['05-bootcamp', 'blazecamp', 'es'], ['08-pickleball-genpop', 'sonhabitos', 'es'], ['05-bootcamp', 'sonhabitos', 'en']]) {
  test(`cli: ${name} (${brand}, ${lang}) - Markdown, PDF, JSON and HTML`, () => {
    const out = tmp();
    try {
      const r = run(['--intake', sample(name), '--brand', brand, '--lang', lang, '--out', out, '--format', 'md,pdf,json,html', '--site', 'https://plan.example.org', '--json']);
      assert.equal(r.code, 0, r.err);
      const o = JSON.parse(r.out);
      assert.equal(o.status, 'ok');
      assert.equal(o.lang, lang);
      const prefix = brand === 'sonhabitos' ? 'Son-Habitos-plan-' : 'Blaze-Camp-plan-';
      for (const f of ['md', 'pdf', 'json', 'html']) { assert.ok(fs.existsSync(o.files[f]), f); assert.ok(path.basename(o.files[f]).startsWith(prefix), o.files[f]); }
      const md = fs.readFileSync(o.files.md, 'utf8');
      assert.match(md, lang === 'es' ? /propio riesgo/ : /own risk/);
      assert.doesNotMatch(md, /LEGAL REVIEW|REVISIÓN LEGAL|undefined/);
      assert.equal(fs.readFileSync(o.files.pdf).subarray(0, 5).toString('latin1'), '%PDF-');
      const html = fs.readFileSync(o.files.html, 'utf8');
      assert.match(html, /^<!doctype html>/);
      assert.doesNotMatch(html, /<script|<link /, 'self-contained, no script');
      const plan = JSON.parse(fs.readFileSync(o.files.json, 'utf8'));
      assert.equal(plan.status, 'ok');
      if (brand === 'sonhabitos') {
        for (const s of [md, html]) assert.doesNotMatch(PARTIES.reduce((a, p) => a.split(p).join(''), s), NAMES);
        assert.match(md, /https:\/\/plan\.example\.org\/disclaimer/);
        assert.match(md, /Son Hábitos · Nati Vera/);
      } else assert.match(md, /Coach Lalo/);
    } finally { fs.rmSync(out, { recursive: true, force: true }); }
  });
}

test('cli: the wizard answers shape -> a plan and the prefilled link; stdin works', () => {
  const out = tmp();
  try {
    const answers = { age: 41, weight: 72, unit: 'kg', years: 2, goal: 'fat_loss', format: 'bootcamp', days: 3, equipment: 'BASIC_GYM', health: 'some', safety: { injury_in_treatment: true }, accepted: true };
    const r = run(['--answers', '-', '--out', out, '--format', 'md', '--site', 'https://plan.example.org', '--json'], JSON.stringify(answers));
    assert.equal(r.code, 0, r.err);
    const o = JSON.parse(r.out);
    assert.ok(o.summary.health_warning, 'a health yes warns and does not stop the plan');
    const d = decodePrefill(new URL(o.link).hash, B.defaultAnswers('2026-10-13'));
    assert.equal(d.answers.format, 'bootcamp');
    assert.equal(d.answers.accepted, false, 'the link never carries the acceptance');
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test('cli: incomplete answers and invalid intakes - plain words, exit 1, nothing written', () => {
  const out = tmp();
  try {
    const a = run(['--answers', '-', '--out', out], JSON.stringify({ goal: 'muscle' }));
    assert.equal(a.code, 1);
    assert.match(a.err, /health check is not answered/);
    assert.match(a.err, /release is not accepted/);
    const i = JSON.parse(fs.readFileSync(sample('08-pickleball-genpop'), 'utf8'));
    i.release.accepted = false;
    const b = run(['--intake', '-', '--out', out], JSON.stringify(i));
    assert.equal(b.code, 1);
    assert.match(b.err, /not built/);
    assert.match(b.err, /release\.accepted/);
    const c = run(['--intake', '-', '--out', out], JSON.stringify({ ...JSON.parse(fs.readFileSync(sample('08-pickleball-genpop'), 'utf8')), gender: 'x', stress: 3 }));
    assert.equal(c.code, 1);
    assert.match(c.err, /\(gender\)/);
    assert.match(c.err, /\(stress\)/);
    // Son Hábitos needs its site address for its own disclaimer pages: its brand file carries it (plan.sonhabitos.com)
    const d = run(['--intake', sample('08-pickleball-genpop'), '--brand', 'sonhabitos', '--format', 'md', '--out', out + '-sh']);
    assert.equal(d.code, 0, d.err);
    assert.match(fs.readFileSync(path.join(out + '-sh', fs.readdirSync(out + '-sh')[0]), 'utf8'), /plan\.sonhabitos\.com\/disclaimer/);
    fs.rmSync(out + '-sh', { recursive: true, force: true });
    assert.equal(run(['--intake', sample('08-pickleball-genpop'), '--brand', 'nope']).code, 1);
    assert.deepEqual(fs.readdirSync(out), []);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test('cli: --questions (one language), --brands, --link, and edits', () => {
  const q = run(['--questions', '--lang', 'es']);
  assert.equal(q.code, 0, q.err);
  assert.equal(JSON.parse(q.out).questions.find(x => x.id === 'goal').prompt, 'Tu objetivo');
  { const ids = JSON.parse(run(['--brands']).out).map(b => b.id); for (const id of ['blazecamp', 'sonhabitos']) assert.ok(ids.includes(id), id); }   // white-label gyms may be added
  const l = run(['--link', '--answers', '-', '--site', 'https://plan.example.org/', '--lang', 'es'], JSON.stringify({ goal: 'general', accepted: true }));
  assert.equal(l.code, 0, l.err);
  assert.match(l.out.trim(), /^https:\/\/plan\.example\.org\/#a=[\w-]+&l=es$/);
  const out = tmp();
  try {
    const b = JSON.parse(run(['--intake', sample('08-pickleball-genpop'), '--out', out, '--format', 'json', '--json']).out);
    const plan = JSON.parse(fs.readFileSync(b.files.json, 'utf8'));
    const day = plan.weeks[0].days.find(d => (d.blocks || []).some(bl => (bl.items || []).some(it => it.exercise_id && it.sets > 1)));
    const it = day.blocks.flatMap(bl => bl.items).find(x => x.exercise_id && x.sets > 1);
    const edits = path.join(out, 'edits.json');
    fs.writeFileSync(edits, JSON.stringify([{ op: 'set_sets', weekday: day.weekday, slot_id: it.slot_id, sets: it.sets - 1 }]));
    const e = run(['--plan', b.files.json, '--edits', edits, '--out', out, '--format', 'json,md', '--json']);
    assert.equal(e.code, 0, e.err);
    const eo = JSON.parse(e.out);
    assert.equal(eo.applied, 1);
    assert.equal(JSON.parse(fs.readFileSync(eo.files.json, 'utf8')).edited, true);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
