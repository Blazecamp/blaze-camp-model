// Entry point for `node --test tests/` (Node 22 loads a directory argument as a module: tests/package.json -> main).
// Imports every tests/**/*.test.mjs in sorted order so the whole suite runs in this one test process.
// `node --test` with no argument discovers the same files itself (this file does not match the default patterns).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.test.mjs')) files.push(p);
  }
};
walk(here);
for (const f of files) await import(pathToFileURL(f).href);
