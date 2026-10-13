// tests/v07-browser.test.mjs - the engine runs unchanged in the public web tool's browser (engine/DECISIONS.md G-311): its sources
// use no syntax or built-in newer than Safari 15.0 - a regex lookbehind makes the whole module fail to parse on Safari before 16.4,
// and Array.prototype.at, Object.hasOwn and structuredClone arrived in Safari 15.4.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './helpers/models.mjs';

const BAD = [
  [/\(\?<[=!]/, 'regex lookbehind'],
  [/\.at\(\s*-?\d/, 'Array.prototype.at'],
  [/\bObject\.hasOwn\s*\(/, 'Object.hasOwn'],
  [/\bstructuredClone\s*\(/, 'structuredClone'],
  [/\.(toSorted|toReversed|toSpliced|findLast|findLastIndex)\s*\(/, 'ES2023 array method'],
  [/\.with\s*\(\s*-?\d/, 'Array.prototype.with'],
  [/\b(Object|Map)\.groupBy\s*\(/, 'groupBy'],
  [/\.(union|intersection|difference|symmetricDifference|isSubsetOf|isSupersetOf|isDisjointFrom)\s*\(/, 'Set methods'],
  [/\bPromise\.withResolvers\b|\bArray\.fromAsync\b|\.isWellFormed\s*\(/, 'ES2024 built-in']
];

test('G-311: engine sources use nothing newer than Safari 15.0 (no lookbehind, at, hasOwn, structuredClone, ES2023+ built-ins)', () => {
  const hits = [];
  for (const dir of ['engine', path.join('engine', 'progression')]) {
    for (const f of fs.readdirSync(path.join(ROOT, dir)).filter(x => x.endsWith('.mjs')).sort()) {
      const lines = fs.readFileSync(path.join(ROOT, dir, f), 'utf8').split('\n');
      lines.forEach((l, i) => {
        if (/^\s*(\/\/|\*)/.test(l)) return;
        const code = l.replace(/\/\/ .*$/, '');
        for (const [re, what] of BAD) if (re.test(code)) hits.push(`${dir}/${f}:${i + 1} ${what}`);
      });
    }
  }
  assert.deepEqual(hits, []);
});
