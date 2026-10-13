#!/usr/bin/env node
// agent/mcp-server.mjs - a Model Context Protocol server (stdio, JSON-RPC 2.0, one message per line) that lets an AI agent
// (Claude Desktop, Claude Code, any MCP client) ask the plan questions, build a plan, render it, edit it and hand back files.
// No dependencies. Nothing is stored or logged: no request is written anywhere; plan files are written only to the output folder
// (--out <dir>, else env PLAN_OUT_DIR, else a new folder under the OS temp folder per build), and only the plan.
//
//   node agent/mcp-server.mjs [--out <dir>] [--brand <id>] [--site https://...]
//   claude mcp add blaze-plan -- node /abs/path/agent/mcp-server.mjs        (agent/README.md has the Claude Desktop entry)
//
// Tools: get_questions, build_plan, render_plan, plan_slots, search_exercises, edit_plan, list_brands (descriptions below).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import * as C from './core.mjs';
import { buildQuestions, questionsInLang } from './questions.mjs';

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const OUT = arg('--out') || process.env.PLAN_OUT_DIR || null;
const DEFAULT_BRAND = arg('--brand') || process.env.BRAND || 'blazecamp';
const DEFAULT_SITE = arg('--site') || undefined;
const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const SERVER = { name: 'blaze-plan', title: 'Plan Builder (coach\'s model)', version: '1.0.0' };

const GATE = 'LIABILITY GATE: no plan is built until the release is accepted for this build. Show the person the release text from get_questions (release.client for themselves, release.coach when a coach builds for a client, release.minor too when under 18) and get an explicit "I accept" from them in this conversation before sending accepted: true. Never assume acceptance.';
const NODATA = 'NO DATA KEPT: nothing is stored or logged; do not keep the answers after delivering the plan. Never ask sex, gender, sleep, stress, job, life or energy, and never a session length.';

const TOOLS = [
  {
    name: 'get_questions',
    description: `The questions to ask the person, in order, with choices (EN and ES labels), defaults, when each applies, the 5 health questions and the release texts. Ask them one or two at a time, then call build_plan. ${GATE} ${NODATA}`,
    inputSchema: { type: 'object', properties: { lang: { type: 'string', enum: ['en', 'es'], description: 'only this language\'s words (default: both)' }, brand: { type: 'string', description: 'brand id (list_brands); default: the server\'s brand' } } }
  },
  {
    name: 'build_plan',
    description: `Build a complete training plan from the person's answers (the get_questions fields; send only what was asked) or from a full intake/2. Returns a summary, the plan's Markdown overview, the files written (PDF, Markdown, JSON ...) and, when the brand's site is known, a prefilled web link. A health-check yes does not stop the plan: it carries a health warning. If answers are missing it says which. ${GATE} The prefilled link is the recommended path when the person is not the one in this conversation: they open it, answer the health check, accept the release and tap Build themselves. ${NODATA}`,
    inputSchema: {
      type: 'object',
      properties: {
        answers: { type: 'object', description: 'wizard answers (agent/questions.json > questions[].id; nested sport / activity / safety objects); must hold accepted: true only after the person said "I accept"' },
        intake: { type: 'object', description: 'a full intake/2 instead of answers (engine/CONTRACTS.md §2.1); release.accepted under the same rule' },
        brand: { type: 'string', description: 'brand id (list_brands)' },
        lang: { type: 'string', enum: ['en', 'es'] },
        formats: { type: 'array', items: { type: 'string', enum: C.FORMATS }, description: 'files to write (default ["pdf", "md", "json"]; json is needed for render_plan / edit_plan)' },
        site: { type: 'string', description: 'the brand\'s web address for the prefilled link (optional)' },
        markdown: { type: 'string', enum: ['overview', 'week1', 'none'], description: 'Markdown returned in the reply (default overview; the full plan is in the .md file)' }
      }
    }
  },
  {
    name: 'render_plan',
    description: 'Render a built plan as Markdown in English or Spanish: the full plan, the overview, a training block table, chosen weeks or days. Give plan_path (the json file build_plan wrote) or the plan object.',
    inputSchema: {
      type: 'object',
      properties: {
        plan_path: { type: 'string' }, plan: { type: 'object' }, brand: { type: 'string' }, lang: { type: 'string', enum: ['en', 'es'] },
        view: { type: 'string', enum: ['full', 'overview', 'block', 'week', 'day'] }, weeks: { type: 'array', items: { type: 'integer' } }
      }
    }
  },
  {
    name: 'plan_slots',
    description: 'The exercises of one week of a built plan, day by day: slot_id, exercise, sets, the block each sits in, and linked_with (the superset / triset group it is done in, or null). Use it to find the slot_id and block an edit needs (for example the slot_ids to link).',
    inputSchema: { type: 'object', properties: { plan_path: { type: 'string' }, plan: { type: 'object' }, week: { type: 'integer' }, lang: { type: 'string', enum: ['en', 'es'] }, brand: { type: 'string' } } }
  },
  {
    name: 'search_exercises',
    description: 'Search the exercise library by name (EN or ES) for add_exercise. Returns exercise ids and names.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, lang: { type: 'string', enum: ['en', 'es'] }, limit: { type: 'integer' } }, required: ['query'] }
  },
  {
    name: 'edit_plan',
    description: `Edit a built plan: everything is editable (the person or coach owns the plan). Operations: ${Object.values(C.EDIT_OPS).join(' | ')}. Weekly totals are recomputed, the plan is marked edited, and "conflicts" tell the person where the edit leaves the template's own rules (information only: the edit is still applied). Writes new files. ${NODATA}`,
    inputSchema: {
      type: 'object',
      properties: { plan_path: { type: 'string' }, plan: { type: 'object' }, edits: { type: 'array', items: { type: 'object' } }, brand: { type: 'string' }, lang: { type: 'string', enum: ['en', 'es'] }, formats: { type: 'array', items: { type: 'string', enum: C.FORMATS } } },
      required: ['edits']
    }
  },
  {
    name: 'list_brands',
    description: 'The brands this server can build for (each has its own name, words, legal party wording, PDF look and web site).',
    inputSchema: { type: 'object', properties: {} }
  }
];

// ------------------------------------------------------------------------------------------------- tool calls

const outDir = () => (OUT ? path.resolve(OUT) : fs.mkdtempSync(path.join(os.tmpdir(), 'plan-')));
const planFrom = (a) => {
  if (a.plan && typeof a.plan === 'object') return a.plan;
  if (a.plan_path) return JSON.parse(fs.readFileSync(a.plan_path, 'utf8'));
  throw new C.AgentError('bad_plan', 'give plan_path (the .json file build_plan wrote) or plan');
};
const brandAndModel = async (a) => {
  const brand = await C.loadBrand(a.brand || DEFAULT_BRAND);
  return { brand, model: C.modelFor(brand, C.siteUrlFor(brand, a.site || DEFAULT_SITE)) };
};

export async function callTool(name, a = {}) {
  switch (name) {
    case 'list_brands': return { brands: await C.listBrands() };
    case 'get_questions': {
      const q = await buildQuestions({ brand: a.brand || DEFAULT_BRAND, site: a.site || DEFAULT_SITE });
      return C.LANGS.includes(a.lang) ? questionsInLang(q, a.lang) : q;
    }
    case 'build_plan': {
      if (!a.answers && !a.intake) throw new C.AgentError('bad_input', 'give answers (or intake)');
      const r = await C.buildPlan({ answers: a.answers, intake: a.intake, brand: a.brand || DEFAULT_BRAND, lang: a.lang, site: a.site || DEFAULT_SITE });
      if (r.status === 'needs_answers') return { status: 'needs_answers', problems: r.problems.map(p => p.message), link: r.link || null, _error: true };
      if (r.status === 'invalid') return { status: 'invalid', errors: r.errors, _error: true };
      const files = C.writeOutputs(r, outDir(), a.formats && a.formats.length ? a.formats : ['pdf', 'md', 'json']);
      const mdMode = a.markdown || 'overview';
      const markdown = mdMode === 'none' ? null : C.planMarkdown(r.plan, r.model, r.lang, r.brand, mdMode === 'week1' ? { view: 'week', weeks: [1] } : { view: 'overview' });
      return { status: 'ok', brand: r.brand.id, lang: r.lang, summary: C.planSummary(r.plan, r.model, r.lang), files, link: r.link || null, markdown };
    }
    case 'render_plan': {
      const { brand, model } = await brandAndModel(a);
      const plan = planFrom(a);
      const lang = C.LANGS.includes(a.lang) ? a.lang : plan.lang || brand.lang_default;
      return { markdown: C.planMarkdown(plan, model, lang, brand, { view: a.view || 'overview', weeks: a.weeks && a.weeks.length ? a.weeks : undefined }) };
    }
    case 'plan_slots': {
      const { brand, model } = await brandAndModel(a);
      const plan = planFrom(a);
      return { week: a.week || 1, days: C.planSlots(plan, model, C.LANGS.includes(a.lang) ? a.lang : plan.lang || brand.lang_default, a.week || 1) };
    }
    case 'search_exercises': {
      const { model } = await brandAndModel(a);
      return { exercises: C.searchExercises(model, a.query, C.LANGS.includes(a.lang) ? a.lang : 'en', Math.min(50, a.limit || 20)) };
    }
    case 'edit_plan': {
      const { brand, model } = await brandAndModel(a);
      const plan = planFrom(a);
      const r = C.editPlan(plan, a.edits, model);
      const lang = C.LANGS.includes(a.lang) ? a.lang : plan.lang || brand.lang_default;
      const files = C.writeOutputs({ plan: r.plan, model, lang, brand }, outDir(), a.formats && a.formats.length ? a.formats : ['pdf', 'md', 'json']);
      return { status: 'ok', edited: true, applied: r.applied.length, conflicts: r.conflicts, summary: C.planSummary(r.plan, model, lang), files };
    }
    default: throw new C.AgentError('unknown_tool', `unknown tool ${name}`);
  }
}

// ------------------------------------------------------------------------------------------------- JSON-RPC over stdio

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

async function handle(msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    if (msg && msg.id !== undefined && msg.method === undefined) return;   // a response to us: we send no requests
    return fail(msg && msg.id !== undefined ? msg.id : null, -32600, 'invalid request');
  }
  const isNote = msg.id === undefined || msg.id === null;
  const { id, method, params = {} } = msg;
  if (isNote) return;   // notifications/initialized, notifications/cancelled ...: nothing to do
  try {
    switch (method) {
      case 'initialize': {
        const asked = params.protocolVersion;
        return reply(id, {
          protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER,
          instructions: `Build training plans from the coach's model. Call get_questions first and ask them in conversation; then build_plan. ${GATE} ${NODATA} General fitness information, not medical advice.`
        });
      }
      case 'ping': return reply(id, {});
      case 'tools/list': return reply(id, { tools: TOOLS });
      case 'tools/call': {
        const tool = TOOLS.find(t => t.name === params.name);
        if (!tool) return fail(id, -32602, `unknown tool ${params.name}`);
        try {
          const out = await callTool(params.name, params.arguments || {});
          const isError = !!(out && out._error);
          if (out && out._error) delete out._error;
          const res = { content: [{ type: 'text', text: textOf(params.name, out) }], isError };
          if (!['get_questions', 'render_plan'].includes(params.name)) res.structuredContent = out;   // (large texts once only)
          return reply(id, res);
        } catch (e) {
          return reply(id, { content: [{ type: 'text', text: e instanceof C.AgentError ? e.message : String((e && e.message) || e) }], isError: true });
        }
      }
      case 'resources/list': return reply(id, { resources: [] });
      case 'prompts/list': return reply(id, { prompts: [] });
      default: return fail(id, -32601, `method not found: ${method}`);
    }
  } catch (e) {
    return fail(id, -32603, String((e && e.message) || e));
  }
}

/** the text part of a tool result: the readable part first, then the JSON */
function textOf(name, out) {
  if (name === 'build_plan' && out.status === 'ok') {
    const f = Object.entries(out.files).map(([k, p]) => `${k}: ${p}`).join('\n');
    return [`Plan built (${out.brand}, ${out.lang}).`, f, out.link ? `Prefilled web link: ${out.link}` : '', out.markdown || ''].filter(Boolean).join('\n\n');
  }
  if (name === 'render_plan') return out.markdown;
  return JSON.stringify(out, null, 1);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  let chain = Promise.resolve();
  rl.on('line', (line) => {
    const s = line.trim();
    if (!s) return;
    let msg;
    try { msg = JSON.parse(s); } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }); return; }
    chain = chain.then(() => (Array.isArray(msg) ? Promise.all(msg.map(handle)) : handle(msg))).catch(() => {});
  });
  rl.on('close', () => { chain.then(() => { process.stdin.pause(); }); });
}
