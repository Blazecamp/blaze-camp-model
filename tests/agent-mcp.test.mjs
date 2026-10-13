// tests/agent-mcp.test.mjs - the MCP server (agent/mcp-server.mjs) spawned as an MCP client would: JSON-RPC over stdio,
// initialize + notifications/initialized + tools/list, then get_questions, build_plan (a sample and the gate), plan_slots,
// edit_plan and render_plan. Files go to a temp folder that the test removes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import readline from 'node:readline';
import { ROOT } from './helpers/models.mjs';

function server(out) {
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (k === 'BRAND' || k.startsWith('SITE_URL')) delete env[k];
  const p = spawn(process.execPath, [path.join(ROOT, 'agent/mcp-server.mjs'), '--out', out], { stdio: ['pipe', 'pipe', 'pipe'], env });
  const waiting = new Map();
  const rl = readline.createInterface({ input: p.stdout });
  const stray = [];
  rl.on('line', (l) => { const m = JSON.parse(l); if (waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } else stray.push(m); });
  let id = 0;
  return {
    stray,
    request(method, params) { const n = ++id; p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n'); return new Promise(r => waiting.set(n, r)); },
    notify(method, params) { p.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n'); },
    call(name, args) { return this.request('tools/call', { name, arguments: args }); },
    close() { p.stdin.end(); return new Promise(r => p.on('close', r)); }
  };
}

test('mcp: handshake, tools, a plan built from a sample, the gate, edits and rendering', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-test-'));
  const s = server(out);
  try {
    const init = await s.request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
    assert.equal(init.result.protocolVersion, '2025-06-18');
    assert.ok(init.result.capabilities.tools);
    assert.match(init.result.instructions, /I accept/);
    s.notify('notifications/initialized');
    const old = await s.request('initialize', { protocolVersion: '1999-01-01' });
    assert.equal(old.result.protocolVersion, '2025-06-18', 'an unknown version -> the latest supported');

    const list = await s.request('tools/list', {});
    const names = list.result.tools.map(t => t.name);
    for (const n of ['get_questions', 'build_plan', 'render_plan', 'edit_plan', 'list_brands', 'plan_slots', 'search_exercises']) assert.ok(names.includes(n), n);
    const bp = list.result.tools.find(t => t.name === 'build_plan');
    assert.match(bp.description, /LIABILITY GATE/);
    assert.match(bp.description, /NO DATA KEPT/);
    for (const t of list.result.tools) assert.equal(t.inputSchema.type, 'object');

    const brands = await s.call('list_brands', {});
    assert.deepEqual(brands.result.structuredContent.brands.map(b => b.id), ['blazecamp', 'sonhabitos']);

    const q = await s.call('get_questions', { lang: 'en' });
    const qs = JSON.parse(q.result.content[0].text);
    assert.equal(qs.questions.find(x => x.id === 'goal').prompt, 'Your goal');

    // the gate: no accepted release -> no plan, and the reply says what is missing
    const gate = await s.call('build_plan', { answers: { goal: 'general', health: 'none' } });
    assert.equal(gate.result.isError, true);
    assert.equal(gate.result.structuredContent.status, 'needs_answers');
    assert.match(gate.result.content[0].text, /release is not accepted/);
    assert.equal(fs.readdirSync(out).length, 0, 'nothing written');

    // a sample intake: built, files written
    const intake = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/intakes/08-pickleball-genpop.json'), 'utf8'));
    const b = await s.call('build_plan', { intake, lang: 'es', formats: ['pdf', 'md', 'json'] });
    assert.equal(b.result.isError, false, b.result.content[0].text.slice(0, 300));
    const r = b.result.structuredContent;
    assert.equal(r.status, 'ok');
    for (const f of ['pdf', 'md', 'json']) assert.ok(fs.existsSync(r.files[f]), f);
    assert.equal(fs.readFileSync(r.files.pdf).subarray(0, 5).toString('latin1'), '%PDF-');
    assert.match(fs.readFileSync(r.files.md, 'utf8'), /Úsalo bajo tu propio riesgo|propio riesgo/);
    assert.match(r.markdown, /^# /);

    // plan_slots -> edit_plan -> render_plan
    const slots = (await s.call('plan_slots', { plan_path: r.files.json, week: 1 })).result.structuredContent;
    const day = slots.days.find(d => d.blocks.some(bl => bl.items.length));
    const item = day.blocks.flatMap(bl => bl.items).find(it => typeof it.sets === 'number' && it.sets > 1);
    const ed = await s.call('edit_plan', { plan_path: r.files.json, edits: [{ op: 'set_sets', weekday: day.weekday, slot_id: item.slot_id, sets: item.sets + 1, weeks: [1] }], formats: ['json', 'md'] });
    assert.equal(ed.result.isError, false, ed.result.content[0].text.slice(0, 300));
    assert.equal(ed.result.structuredContent.applied, 1);
    assert.equal(JSON.parse(fs.readFileSync(ed.result.structuredContent.files.json, 'utf8')).edited, true);
    assert.notEqual(ed.result.structuredContent.files.json, r.files.json, 'the built plan is kept beside the edited one');
    assert.match(ed.result.structuredContent.files.json, /-edited\.json$/);
    const bad = await s.call('edit_plan', { plan_path: r.files.json, edits: [{ op: 'drop_everything' }] });
    assert.equal(bad.result.isError, true);
    const rp = await s.call('render_plan', { plan_path: r.files.json, lang: 'en', view: 'week', weeks: [1] });
    assert.match(rp.result.content[0].text, /Week 1/);
    const se = await s.call('search_exercises', { query: 'goblet squat' });
    assert.ok(se.result.structuredContent.exercises.length > 0);

    const unknown = await s.request('nope/method', {});
    assert.equal(unknown.error.code, -32601);
    assert.equal(s.stray.length, 0, 'no reply to a notification');
  } finally {
    await s.close();
    fs.rmSync(out, { recursive: true, force: true });
  }
});
