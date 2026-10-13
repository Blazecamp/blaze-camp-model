// tests/app-pdf.test.mjs - the Plan Builder's "Download PDF" (app/pdf.js) and the device checks of its delivery (app/deliver.js).
// The PDF is drawn in Node with the same vendored jsPDF the page loads (app/vendor/jspdf.umd.min.js), from the committed sample
// plans, in English and Spanish. The browser side (share sheet, fallback sheet, download) is checked by tools/app-qa/pdf.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { ROOT, loadCompiledModel } from './helpers/models.mjs';
import { ui } from '../app/i18n.js';
import { pdfText, pdfFileName, mdLines, pdfDoc, drawPdf } from '../app/pdf.js';
import { isIOS, isMobile } from '../app/deliver.js';

const model = loadCompiledModel();
const { jsPDF } = createRequire(import.meta.url)(path.join(ROOT, 'app/vendor/jspdf.umd.min.js'));
const samplePlan = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/plans', name + '.json'), 'utf8'));

/** every text the PDF draws, decoded from its (deflated) content streams as Windows-1252 */
function pdfStrings(buf) {
  const bin = buf.toString('latin1');
  let all = '';
  for (const m of bin.matchAll(/stream\r?\n/g)) {
    const start = m.index + m[0].length;
    const end = bin.indexOf('endstream', start);
    const raw = buf.subarray(start, end);
    let s;
    try { s = zlib.inflateSync(raw).toString('latin1'); } catch { s = raw.toString('latin1'); }
    for (const t of s.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)) all += t[1].replace(/\\([()\\])/g, '$1') + '\n';
  }
  return all;
}

test('app pdf: the text the standard font can hold (Spanish accents kept, symbols swapped, emoji dropped)', () => {
  assert.equal(pdfText('Sentadilla búlgara: ¿Qué? ¡Sí! ñ Ñ ü'), 'Sentadilla búlgara: ¿Qué? ¡Sí! ñ Ñ ü');
  assert.equal(pdfText('3 × 8-12 · 2 en reserva – “x” — …'), '3 × 8-12 · 2 en reserva – “x” — …');
  assert.equal(pdfText('A ⇄ B → C ≤ 5'), 'A <-> B -> C <= 5');
  assert.equal(pdfText('⚡ bigger step 🔥'), 'bigger step');
  for (const ch of pdfText('ⓐ☃⏱ ok')) assert.ok(ch.codePointAt(0) <= 255 || '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'.includes(ch));
});

test('app pdf: the file name names the goal and the start date', () => {
  assert.equal(pdfFileName({ meta: { goal: 'muscle', start_date: '2026-10-12' } }), 'Blaze-Camp-plan-muscle-2026-10-12.pdf');
  assert.equal(pdfFileName({ meta: { goal: 'fat_loss' } }), 'Blaze-Camp-plan-fat-loss.pdf');
  assert.equal(pdfFileName({}), 'Blaze-Camp-plan-plan.pdf');
});

test('app pdf: Markdown sections become plain headings, paragraphs and bullets', () => {
  const l = mdLines('### How\n\nSome **bold** text\nthat wraps.\n\n- one _two_\n- [link](https://x.y)\n| a | b |\n|---|---|\n| 1 | 2 |');
  assert.deepEqual(l, [
    { kind: 'h', text: 'How' }, { kind: 'p', text: 'Some bold text that wraps.' },
    { kind: 'li', text: 'one two' }, { kind: 'li', text: 'link' }, { kind: 'li', text: 'a · b' }, { kind: 'li', text: '1 · 2' }
  ]);
});

for (const [name, lang, word] of [['08-pickleball-genpop', 'es', 'Sentadilla'], ['07-push-pull-legs', 'en', 'Squat'], ['05-bootcamp', 'es', 'Sentadilla']]) {
  test(`app pdf: ${name} (${lang}) - every week and day, the release on every page, a valid small PDF`, () => {
    const plan = samplePlan(name);
    const doc = pdfDoc(plan, model, lang, (k, a) => ui(lang, k, a));
    assert.equal(doc.weeks.length, plan.weeks.length);
    doc.weeks.forEach((w, i) => assert.equal(w.days.length, plan.weeks[i].days.length, `week ${w.n} days`));
    assert.ok(doc.release && doc.release_short && doc.credit.includes('Lalo'));
    assert.ok(doc.weeks.flatMap(w => w.days).some(d => d.blocks.some(b => b.rows.some(r => r.dose))), 'rows have doses');
    // nothing the font cannot draw, no raw key, no undefined
    const strings = JSON.stringify(doc, (k, v) => (typeof v === 'function' ? undefined : v));
    assert.doesNotMatch(strings, /undefined|NaN|\[object|ui\.plan\.|LEGAL REVIEW|REVISIÓN LEGAL/);
    for (const ch of strings) assert.ok(ch.codePointAt(0) <= 0x2122, `char ${ch}`);

    const pdf = drawPdf(doc, jsPDF);
    const buf = Buffer.from(pdf.output('arraybuffer'));
    assert.equal(buf.subarray(0, 5).toString('latin1'), '%PDF-');
    const pages = pdf.getNumberOfPages();
    assert.equal((buf.toString('latin1').match(/\/Type \/Page\b/g) || []).length, pages);
    assert.ok(pages >= plan.weeks.length + 2 && pages <= plan.weeks.length * 6 + 10, `pages ${pages}`);
    assert.ok(buf.length < 2 * 1024 * 1024, `size ${buf.length}`);
    const text = pdfStrings(buf);
    assert.ok(text.includes(word), `${word} in the PDF`);
    if (lang === 'es') assert.match(text, /[áéíóúñ]/, 'Spanish accents written as text');
    const pageWord = lang === 'es' ? 'Página' : 'Page';
    assert.ok(text.includes(`${pageWord} 1 de ${pages}`) || text.includes(`${pageWord} 1 of ${pages}`), 'page numbers');
    const short = doc.release_short.slice(0, 25);
    assert.ok(text.split(short).length - 1 >= pages, 'the release line on every page');
  });
}

test('app deliver: iPhone, iPad (also as a Mac with touch), Android and desktop', () => {
  const nav = (userAgent, maxTouchPoints = 0) => ({ userAgent, maxTouchPoints });
  const iphone = nav('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 5);
  const ipad = nav('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 5);
  const mac = nav('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 0);
  const android = nav('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36', 5);
  assert.ok(isIOS(iphone) && isMobile(iphone));
  assert.ok(isIOS(ipad) && isMobile(ipad));
  assert.ok(!isIOS(mac) && !isMobile(mac));
  assert.ok(!isIOS(android) && isMobile(android));
});

test('app pdf: the page offers Download PDF, Print only on desktop, and loads jsPDF only on demand', () => {
  const main = fs.readFileSync(path.join(ROOT, 'app/main.js'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'app/index.html'), 'utf8');
  assert.match(main, /data-action="pdf"/);
  assert.match(main, /function canPrint\(\) \{ return typeof window\.print === 'function' && !isMobile\(\); \}/);
  assert.doesNotMatch(html, /jspdf/i, 'jsPDF is not loaded with the page');
  assert.ok(fs.existsSync(path.join(ROOT, 'app/vendor/jspdf.LICENSE.txt')));
  assert.match(fs.readFileSync(path.join(ROOT, 'app/vendor/jspdf.umd.min.js'), 'utf8').slice(0, 300), /jsPDF - PDF Document creation from JavaScript\s+\*\s+Version 4\.2\.1/);
});
