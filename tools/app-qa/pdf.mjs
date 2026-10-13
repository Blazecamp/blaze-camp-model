// QA for "Download PDF" and "Save image" under the production Content-Security-Policy (vercel.json), on three plans:
//   desktop          -> a real download (the file is saved and checked)
//   iPhone + share   -> navigator.share({files}) (mocked: the shared file is captured and checked); if the build took longer than
//                       the tap's window, the sheet's own Share button is pressed
//   iPhone, no share -> the fallback sheet: "Open PDF" (a blob: link, opened in a new tab) / the image to press and hold
// Each PDF is checked: starts with %PDF, page count, size, and (with pypdf, when installed) its text: accents, release line.
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
// Another brand's build (tools/build-site.mjs --brand sonhabitos): BC_PDF_PREFIX=Son-Habitos-plan BC_FORBID_NAMES=1 (the PDF text
// must not name Blaze Camp, Gerardo or Coach Lalo; "Lalo Vera" only inside the legal parties).
const PREFIX = process.env.BC_PDF_PREFIX || 'Blaze-Camp-plan';
const FORBID = !!process.env.BC_FORBID_NAMES;
const { chromium, devices } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../../', import.meta.url).pathname;
const BASE = process.env.BC_QA_URL || 'http://127.0.0.1:8766/';
const OUT = (process.env.BC_QA_OUT || '/tmp/bc-qa/') + 'pdf/';
fs.mkdirSync(OUT, { recursive: true });
const vercel = JSON.parse(fs.readFileSync(ROOT + 'vercel.json'));
const csp = vercel.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const CASES = [
  { sample: '08-pickleball-genpop', lang: 'es', word: 'Sentadilla' },
  { sample: '07-push-pull-legs', lang: 'en', word: 'Squat' },
  { sample: '05-bootcamp', lang: 'es', word: 'Sentadilla' }
].filter(c => !process.argv[2] || c.sample.includes(process.argv[2]));
const iphone = devices['iPhone 13'];
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL', m); };

function checkPdf(file, c, label) {
  const b = fs.readFileSync(file);
  const head = b.subarray(0, 5).toString('latin1');
  const pages = (b.toString('latin1').match(/\/Type \/Page\b/g) || []).length;
  let info = { pages };
  try {
    const py = `import sys, json, re, pypdf\nr = pypdf.PdfReader(sys.argv[1])\nt = '\\n'.join(p.extract_text() or '' for p in r.pages)\nprint(json.dumps({'pages': len(r.pages), 'word': sys.argv[2] in t, 'accents': sum(t.count(x) for x in 'áéíóúñ¿¡'), 'page1': ('Page 1 of' in t) or ('Página 1 de' in t), 'release_pages': sum(1 for p in r.pages if ('own risk' in (p.extract_text() or '')) or ('propio riesgo' in (p.extract_text() or ''))), 'names': re.findall(r'.{0,30}(?:Blaze|BLAZE|Gerardo|Lalo(?! Vera (?:and|y) BFit)).{0,30}', re.sub(r'\\s+', ' ', t))}))`;
    info = JSON.parse(execFileSync('python3', ['-I', '-c', py, file, c.word], { encoding: 'utf8' }));
  } catch (e) { info.pypdf = 'not available: ' + String(e.message).split('\n')[0]; }
  console.log(`  ${label}: ${file.split('/').pop()} ${(b.length / 1024).toFixed(0)} KB ${JSON.stringify(info)}`);
  if (head !== '%PDF-') fail(`${label}: not a PDF (${head})`);
  if (b.length > 2 * 1024 * 1024) fail(`${label}: ${b.length} bytes`);
  if (!(info.pages >= 10)) fail(`${label}: ${info.pages} pages`);
  if (info.word === false) fail(`${label}: "${c.word}" missing`);
  if (c.lang === 'es' && info.accents === 0) fail(`${label}: no accents`);
  if (info.page1 === false) fail(`${label}: no page numbers`);
  if (FORBID && info.names && info.names.length) fail(`${label}: names ${JSON.stringify(info.names.slice(0, 3))}`);
  if (typeof info.release_pages === 'number' && info.release_pages !== info.pages) fail(`${label}: release line on ${info.release_pages} of ${info.pages} pages`);
}

async function open(c, ctxOpts, init, slowMs = 0) {
  const ctx = await browser.newContext({ acceptDownloads: true, ...ctxOpts });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('blob:') || u.startsWith('data:')) return route.continue();
    if (slowMs && u.includes('/vendor/')) await new Promise(r => setTimeout(r, slowMs));   // a slow phone network
    const r = await route.fetch(); await route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
  });
  await page.goto(BASE);
  await page.waitForSelector('[data-screen="you"]');
  await page.click(`.lang [data-value="${c.lang}"]`);
  const intake = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/' + c.sample + '.json'));
  await page.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), intake);
  await page.click('[data-action="next"]');
  await page.waitForSelector('#daycard', { timeout: 240000 });
  return { ctx, page, errs };
}

const SHARE_MOCK = () => {
  window.__shared = [];
  navigator.canShare = (d) => !!(d && d.files && d.files.length);
  navigator.share = async (d) => {
    const f = d.files[0];
    const buf = new Uint8Array(await f.arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    window.__shared.push({ name: f.name, type: f.type, size: f.size, b64: btoa(s), title: d.title });
  };
};
const NO_SHARE = () => {
  Object.defineProperty(Navigator.prototype, 'share', { value: undefined, configurable: true });
  Object.defineProperty(Navigator.prototype, 'canShare', { value: undefined, configurable: true });
  // keep each blob the page makes, so the check can read the file behind a blob: link (the CSP's connect-src forbids fetch(blob:))
  window.__blobs = {};
  const make = URL.createObjectURL.bind(URL);
  URL.createObjectURL = (b) => { const u = make(b); window.__blobs[u] = b; return u; };
};
const blobB64 = (page, url) => page.evaluate(async (u) => {
  const buf = new Uint8Array(await window.__blobs[u].arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
}, url);

/** press a button; on a phone it ends either in a share call or in the sheet (then press the sheet's Share) */
async function pressAndShare(page, selector) {
  const before = await page.evaluate(() => window.__shared.length);
  await page.click(selector);
  await page.waitForFunction((n) => window.__shared.length > n || document.getElementById('bc-sheet'), before, { timeout: 60000 });
  let path = 'direct share';
  if (await page.evaluate((n) => window.__shared.length === n, before)) {
    path = 'sheet -> Share button';
    await page.click('#bc-sheet [data-sheet="share"]');
    await page.waitForFunction((n) => window.__shared.length > n, before, { timeout: 10000 });
  }
  const s = await page.evaluate(() => { const x = window.__shared[window.__shared.length - 1]; return x; });
  return { path, s };
}

for (const c of CASES) {
  console.log(`${c.sample} (${c.lang})`);
  // 1. desktop: a real download, Print offered
  {
    const { ctx, page, errs } = await open(c, { viewport: { width: 1280, height: 800 } });
    if (!(await page.$('.print-line [data-action="print"]'))) fail('desktop: no Print link');
    const t0 = Date.now();
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('.dayview [data-action="pdf"]')]);
    const file = OUT + `desktop-${c.lang}-` + dl.suggestedFilename();
    await dl.saveAs(file);
    console.log(`  desktop: download "${dl.suggestedFilename()}" in ${Date.now() - t0} ms; toast: ${await page.textContent('#bc-toast')}`);
    if (!new RegExp('^' + PREFIX + '-[a-z-]+-\\d{4}-\\d{2}-\\d{2}\\.pdf$').test(dl.suggestedFilename())) fail('desktop: file name ' + dl.suggestedFilename());
    checkPdf(file, c, 'desktop');
    // a second press (jsPDF already loaded) is quicker
    const t1 = Date.now();
    const [dl2] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('.dayview [data-action="pdf"]')]);
    console.log(`  desktop: second press ${Date.now() - t1} ms (${dl2.suggestedFilename()})`);
    // the progress tab has the button too
    await page.click('[data-action="tab"][data-value="progress"]');
    if (!(await page.$('[data-action="pdf"]'))) fail('progress tab: no Download PDF');
    if (errs.length) fail('desktop console: ' + errs.join(' | '));
    await ctx.close();
  }
  // 2. iPhone with the share sheet (mocked)
  {
    const { ctx, page, errs } = await open(c, { ...iphone }, SHARE_MOCK);
    if (await page.$('[data-action="print"]')) fail('iPhone: Print is offered');
    const r = await pressAndShare(page, '.dayview [data-action="pdf"]');
    const file = OUT + `iphone-share-${c.lang}-` + r.s.name;
    fs.writeFileSync(file, Buffer.from(r.s.b64, 'base64'));
    console.log(`  iPhone share: ${r.path}, ${r.s.name} ${r.s.type} "${r.s.title}"`);
    if (r.s.type !== 'application/pdf') fail('iPhone share: type ' + r.s.type);
    checkPdf(file, c, 'iPhone share');
    // a second press: jsPDF is loaded, so the share should come straight from the tap
    const r2 = await pressAndShare(page, '.dayview [data-action="pdf"]');
    console.log(`  iPhone share (second press): ${r2.path}`);
    if (r2.path !== 'direct share') fail('iPhone: second PDF press did not share directly');
    const ri = await pressAndShare(page, '[data-action="save-image"]');
    const png = Buffer.from(ri.s.b64, 'base64');
    console.log(`  iPhone share image: ${ri.path}, ${ri.s.name} ${ri.s.type} ${png.length} bytes`);
    if (ri.s.type !== 'image/png' || png.subarray(1, 4).toString() !== 'PNG') fail('iPhone share image: not a PNG');
    fs.writeFileSync(OUT + `iphone-share-${c.lang}-${ri.s.name}`, png);
    if (errs.length) fail('iPhone share console: ' + errs.join(' | '));
    await ctx.close();
  }
  // 2b. iPhone with the share sheet on a slow network (jsPDF takes 1.5 s): the tap's window has passed, so the sheet offers its
  //     own Share button; and a share that the browser refuses (NotAllowedError) also ends in the sheet, never in silence
  if (c === CASES[0]) {
    const { ctx, page, errs } = await open(c, { ...iphone }, SHARE_MOCK, 1500);
    const r = await pressAndShare(page, '.dayview [data-action="pdf"]');
    console.log(`  iPhone share, slow network: ${r.path}`);
    if (r.path !== 'sheet -> Share button') fail('iPhone slow: expected the sheet\'s Share button, got ' + r.path);
    fs.writeFileSync(OUT + 'iphone-slow-' + r.s.name, Buffer.from(r.s.b64, 'base64'));
    checkPdf(OUT + 'iphone-slow-' + r.s.name, c, 'iPhone slow');
    await page.evaluate(() => { navigator.share = async () => { throw new DOMException('no gesture', 'NotAllowedError'); }; });
    await page.click('#bc-sheet [data-sheet="close"]').catch(() => {});
    await page.click('[data-action="save-image"]');
    await page.waitForSelector('#bc-sheet', { timeout: 30000 });
    const note = await page.textContent('#bc-sheet');
    console.log(`  iPhone share refused: sheet shown (${/press and hold|Mantén presionada/i.test(note) ? 'with the image to hold' : 'no image?'})`);
    if (!/press and hold|Mantén presionada/i.test(note)) fail('iPhone refused share: no image fallback');
    if (errs.length) fail('iPhone slow console: ' + errs.join(' | '));
    await ctx.close();
  }
  // 3. iPhone without the share sheet: the fallback sheet
  {
    const { ctx, page, errs } = await open(c, { ...iphone }, NO_SHARE);
    await page.click('.dayview [data-action="pdf"]');
    await page.waitForSelector('#bc-sheet', { timeout: 60000 });
    const sh = await page.evaluate(() => ({
      title: document.querySelector('#bc-sheet h2').textContent, share: !!document.querySelector('#bc-sheet [data-sheet="share"]'),
      open: document.querySelector('#bc-sheet .sheet-open') && document.querySelector('#bc-sheet .sheet-open').href,
      hint: document.querySelector('#bc-sheet .sheet-hint').textContent,
      dl: document.querySelector('#bc-sheet [data-sheet="download"]').getAttribute('download')
    }));
    console.log(`  iPhone no share: sheet "${sh.title}" open=${sh.open && sh.open.slice(0, 5)} download=${sh.dl} hint="${sh.hint}"`);
    if (sh.share || !sh.open || !sh.open.startsWith('blob:')) fail('iPhone no share: sheet ' + JSON.stringify(sh));
    await page.screenshot({ path: OUT + `iphone-noshare-pdf-sheet-${c.lang}.png` });
    const file = OUT + `iphone-sheet-${c.lang}-` + sh.dl;
    fs.writeFileSync(file, Buffer.from(await blobB64(page, sh.open), 'base64'));
    checkPdf(file, c, 'iPhone sheet');
    const [tab] = await Promise.all([ctx.waitForEvent('page', { timeout: 10000 }), page.click('#bc-sheet .sheet-open')]);
    await tab.waitForLoadState().catch(() => {});
    console.log(`  iPhone no share: Open PDF -> new tab ${tab.url().slice(0, 30)}...`);
    await tab.close();
    await page.click('#bc-sheet [data-sheet="close"]');
    if (await page.$('#bc-sheet')) fail('sheet did not close');
    await page.click('[data-action="save-image"]');
    await page.waitForSelector('#bc-sheet .sheet-img', { timeout: 30000 });
    await page.waitForFunction(() => document.querySelector('#bc-sheet .sheet-img').naturalWidth > 0, null, { timeout: 10000 });
    const img = await page.evaluate(() => ({ w: document.querySelector('#bc-sheet .sheet-img').naturalWidth, hint: document.querySelector('#bc-sheet .sheet-hint').textContent }));
    console.log(`  iPhone no share: image sheet ${img.w}px wide, hint "${img.hint}"`);
    await page.screenshot({ path: OUT + `iphone-noshare-image-sheet-${c.lang}.png` });
    if (errs.length) fail('iPhone no share console: ' + errs.join(' | '));
    await ctx.close();
  }
}
await browser.close();
console.log(fails.length ? `FAILED: ${fails.length}\n- ${fails.join('\n- ')}` : 'all PDF / image checks passed');
process.exit(fails.length ? 1 : 0);
