// Runtime shim so the research prototypes run unchanged in Node (V8) and in the JavaScriptCore shell (Safari's engine).
const isJSC = typeof globalThis.readFile === 'function' && typeof globalThis.process === 'undefined';
const fs = isJSC ? null : await import('node:fs');
export const runtime = isJSC ? 'JavaScriptCore (macOS jsc shell)' : `Node ${process.version} (V8)`;
export const readText = (p) => (isJSC ? globalThis.readFile(String(p)) : fs.readFileSync(p, 'utf8'));
export const nowMs = () => (isJSC ? globalThis.preciseTime() * 1000 : Number(process.hrtime.bigint()) / 1e6);
export const env = isJSC ? {} : process.env;
export const isMain = (metaUrl) => !isJSC && metaUrl === `file://${process.argv[1]}`;
export const print = (s) => (isJSC ? globalThis.print(s) : console.log(s));
/** absolute path / URL of a repo file (the jsc shell has no URL global): rel is relative to the repo root */
export const repoFile = (rel) => {
  const here = import.meta.url.replace(/^file:\/\//, '');           // .../design/research/env.mjs
  const root = here.replace(/design\/research\/env\.mjs$/, '');
  return isJSC ? root + rel : new URL('file://' + root + rel);
};
