#!/usr/bin/env node
// tools/plan.mjs - build a plan from the command line (for a person, a script or any shell-capable AI agent). No dependencies.
//
//   node tools/plan.mjs --answers answers.json [--brand <id>] [--lang en|es] [--out dir] [--format md,pdf,json,html] [--site https://...]
//   node tools/plan.mjs --intake intake.json   [same options]
//   node tools/plan.mjs --questions [--lang en|es] [--brand <id>]       the questions to ask, as JSON (agent/questions.mjs)
//   node tools/plan.mjs --plan plan.json --edits edits.json [--out dir] [--format ...]   apply edits to a built plan
//   node tools/plan.mjs --link --answers answers.json --site https://...  only the prefilled web link (the person accepts there)
//   node tools/plan.mjs --brands                                          the brands
//
// answers.json = the web tool's answers (app/intake-builder.js > defaultAnswers; send only what was asked). intake.json = intake/2
// (engine/CONTRACTS.md §2.1). '-' reads the JSON from stdin.
// The release must be accepted (answers.accepted / intake.release.accepted) after the person read it; else nothing is built.
// Prints the files written (default dir: ./plans) and, when the brand's site is known, the prefilled web link; exits 1 when the
// answers are incomplete or the engine finds the intake invalid, with the problems in plain words. Nothing is stored or logged.
import fs from 'node:fs';
import path from 'node:path';
import * as C from '../agent/core.mjs';
import { buildQuestions, questionsInLang } from '../agent/questions.mjs';
import { prefillLink } from '../app/prefill.js';

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const flag = (n) => argv.includes(n);
const readJson = (f) => JSON.parse(f === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(f, 'utf8'));
const die = (msg, code = 1) => { process.stderr.write(msg.replace(/\s*$/, '') + '\n'); process.exit(code); };

if (flag('--help') || flag('-h') || !argv.length) {
  process.stdout.write(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter(l => l.startsWith('//')).slice(1, 17).map(l => l.slice(3)).join('\n') + '\n');
  process.exit(argv.length ? 0 : 1);
}

try {
  const lang = arg('--lang');
  if (lang && !C.LANGS.includes(lang)) die(`--lang must be en or es (got ${lang})`);
  const formats = (arg('--format') || 'md,pdf').split(',').map(s => s.trim()).filter(Boolean);
  for (const f of formats) if (!C.FORMATS.includes(f)) die(`unknown format ${f} (${C.FORMATS.join(', ')})`);
  const out = arg('--out') || 'plans';

  if (flag('--brands')) {
    process.stdout.write(JSON.stringify(await C.listBrands(), null, 1) + '\n');
  } else if (flag('--questions')) {
    const q = await buildQuestions({ brand: arg('--brand'), site: arg('--site') });
    process.stdout.write(JSON.stringify(lang ? questionsInLang(q, lang) : q, null, 1) + '\n');
  } else if (flag('--link')) {
    const brand = await C.loadBrand(arg('--brand'));
    const site = C.siteUrlFor(brand, arg('--site'));
    if (!site) die(`the site address of brand ${brand.id} is not known: pass --site https://...`);
    const a = C.mergeAnswers(readJson(arg('--answers') || '-'));
    process.stdout.write(prefillLink(site, a, { lang: lang || brand.lang_default }) + '\n');
  } else if (arg('--plan')) {
    const brand = await C.loadBrand(arg('--brand'));
    const model = C.modelFor(brand, C.siteUrlFor(brand, arg('--site')));
    const plan = readJson(arg('--plan'));
    if (!arg('--edits')) die('--plan needs --edits edits.json (a list of edit operations)');
    const r = C.editPlan(plan, readJson(arg('--edits')), model);
    const L = lang || plan.lang || brand.lang_default;
    const files = C.writeOutputs({ plan: r.plan, model, lang: L, brand }, out, formats);
    report({ status: 'ok', edited: true, applied: r.applied.length, conflicts: r.conflicts, files });
  } else {
    const src = arg('--answers') ? { answers: readJson(arg('--answers')) } : arg('--intake') ? { intake: readJson(arg('--intake')) } : die('give --answers <file> or --intake <file> (or --questions)');
    const r = await C.buildPlan({ ...src, brand: arg('--brand'), lang, site: arg('--site') });
    if (r.status === 'needs_answers') {
      die(['The answers are not complete yet:', ...r.problems.map(p => `  - ${p.message}`), r.link ? `Or let the person finish on the web page: ${r.link}` : ''].filter(Boolean).join('\n'));
    }
    if (r.status === 'invalid') die(['The plan was not built. Fix these answers:', ...r.errors.map(e => `  - ${e.message}${e.field ? ` (${e.field})` : ''}`)].join('\n'));
    const files = C.writeOutputs(r, out, formats);
    report({ status: 'ok', brand: r.brand.id, lang: r.lang, summary: C.planSummary(r.plan, r.model, r.lang), files, link: r.link || null });
  }
} catch (e) {
  die(e instanceof C.AgentError ? e.message : (e && e.stack) || String(e));
}

function report(o) {
  if (flag('--json')) { process.stdout.write(JSON.stringify(o, null, 1) + '\n'); return; }
  const lines = [];
  if (o.summary) {
    const s = o.summary;
    lines.push(`${s.program} - ${[s.who || s.goal, `${s.days_per_week} days`, `${s.weeks} weeks`, s.start_date ? `from ${s.start_date}` : ''].filter(Boolean).join(' · ')}`);
    if (s.health_warning) lines.push(`Health warning: ${s.health_warning}`);
  }
  if (o.edited) lines.push(`Edits applied: ${o.applied}${o.conflicts.length ? ` (${o.conflicts.length} notes: ${o.conflicts.map(c => c.code).join(', ')})` : ''}`);
  for (const [f, p] of Object.entries(o.files)) lines.push(`${f}: ${p}`);
  if (o.link) lines.push(`link: ${o.link}`);
  process.stdout.write(lines.join('\n') + '\n');
}

