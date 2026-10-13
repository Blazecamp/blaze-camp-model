// COACH-CH7 CH7-10: every brand has an agent pack (agent/packs/<brand>/), current with its brand file and the live questions.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './helpers/models.mjs';
import { buildPacks } from '../agent/packs.mjs';
import { brandIds } from '../agent/core.mjs';

const files = await buildPacks();

test('CH7-10: every brand has its pack, and the committed packs are current (node agent/packs.mjs)', () => {
  for (const id of brandIds()) for (const f of ['AGENTS.md', 'README.md', 'answers.example.json', 'check.sh', 'questions.en.md', 'preguntas.es.md'])
    assert.ok(files[`agent/packs/${id}/${f}`], `${id}/${f}`);
  for (const [rel, content] of Object.entries(files)) assert.equal(fs.readFileSync(path.join(ROOT, rel), 'utf8'), content, rel + ' is out of date: run node agent/packs.mjs');
});

test('CH7-10: the pack carries the coach\'s flow, the brand\'s own API and legal links', () => {
  const bc = files['agent/packs/blazecamp/AGENTS.md'], sh = files['agent/packs/sonhabitos/AGENTS.md'];
  assert.match(bc, /https:\/\/blaze-camp-model\.vercel\.app/); assert.match(bc, /TWO messages/); assert.match(bc, /DISCLAIMER\.es\.md/); assert.match(bc, /eparmedx/);
  assert.match(sh, /https:\/\/plan\.sonhabitos\.com\/disclaimer\.es\.html/); assert.match(sh, /DOS mensajes/); assert.match(sh, /«Acepto»/);
  assert.doesNotMatch(sh, /blaze-camp-model\.vercel\.app/);
  for (const t of [bc, sh]) { assert.match(t, /format.*pdf/); assert.doesNotMatch(t, /one or two at a time/); }
  const ex = JSON.parse(files['agent/packs/sonhabitos/answers.example.json']);
  assert.equal(ex.lang, 'es'); assert.equal(ex.answers.accepted, true);
});

test('CH7-02: the Son Hábitos pack names no other brand or owner (the repo links and the approved legal party excepted)', () => {
  for (const [rel, content] of Object.entries(files)) {
    if (!rel.startsWith('agent/packs/sonhabitos/')) continue;
    const t = content.replace(/https:\/\/(raw\.githubusercontent|github)\.com\/Blazecamp\/blaze-camp-model\S*/g, '').replace(/Lalo Vera (and|y) BFit Studios Corp\./g, '');
    assert.doesNotMatch(t, /Blaze|Gerardo|Lalo/, rel);
  }
});
