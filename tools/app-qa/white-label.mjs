// QA smoke for a white-label brand's site (WHITE_LABEL.md, "check the result"): at phone size (390 x 844), under the production
// Content-Security-Policy (vercel.json), it loads the page, checks the brand (title, logo, no other brand's name in the text),
// builds a plan through the wizard, downloads the PDF (checks %PDF, the file name, and with pypdf no other brand in its text), opens
// the disclaimer page, and fails on any page error or console error. Screenshots go to BC_QA_OUT.
// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (app/README.md).
//   BC_QA_URLS=http://127.0.0.1:8771/,http://127.0.0.1:8772/demo BC_QA_NAME="Demo Gym" BC_PDF_PREFIX=Demo-Gym-plan \
//   BC_QA_OUT=/tmp/wl-shots/ BC_CHROMIUM=/path/to/chrome node tools/app-qa/white-label.mjs
// The first URL gets the screenshots (1-wizard, 2-plan, 3-disclaimer); every URL gets the checks (a preview link with and
// without its trailing slash, an exported folder ...).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../../', import.meta.url).pathname;
const URLS = (process.env.BC_QA_URLS || 'http://127.0.0.1:8771/').split(',').filter(Boolean);
const NAME = process.env.BC_QA_NAME || '';
const PREFIX = process.env.BC_PDF_PREFIX || '';
const OUT = (process.env.BC_QA_OUT || '/tmp/wl-qa/').replace(/\/?$/, '/');
fs.mkdirSync(OUT, { recursive: true });
// the owner's name only in the legal texts: "Lalo Vera and / y BFit ...", "Lalo Vera, BFit ..." (a gym's parties, CH7-11),
// "Lalo Vera or BFit" / "a Lalo Vera ni a BFit" (the gym's addendum)
const FORBID = /Blaze|Gerardo|\bLalo\b(?! Vera(?: and| y|,| or| ni a) BFit)|Son H[aá]bitos|Nati Vera/;
const csp = JSON.parse(fs.readFileSync(ROOT + 'vercel.json')).headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const fails = [];
const fail = (m) => { fails.push(m); console.log('  FAIL', m); };

for (const [i, url] of URLS.entries()) {
  console.log(url);
  const shots = i === 0;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, acceptDownloads: true, locale: 'es-MX' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  page.on('requestfailed', r => errs.push('REQUEST FAILED ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('blob:') || u.startsWith('data:')) return route.continue();
    const r = await route.fetch(); await route.fulfill({ response: r, headers: { ...r.headers(), 'content-security-policy': csp } });
  });
  await page.goto(url);
  await page.waitForSelector('[data-screen="you"]', { timeout: 60000 });
  const title = await page.title();
  const logo = await page.evaluate(() => { const im = document.querySelector('.brand-logo'); return im ? { ok: im.complete && im.naturalWidth > 0, src: im.getAttribute('src') } : null; });
  console.log(`  title "${title}", logo ${JSON.stringify(logo)}`);
  if (NAME && !title.includes(NAME)) fail(`${url}: title "${title}" does not name ${NAME}`);
  if (!logo || !logo.ok) fail(`${url}: the logo did not load`);
  if (shots) await page.screenshot({ path: OUT + '1-wizard.png' });
  // the wizard: general fitness, the defaults, no health flag, accept, build
  await page.click('[data-action="next"]');
  await page.click('[data-action="goal"][data-value="general"]');
  await page.click('[data-action="next"]');
  await page.click('[data-action="next"]');
  await page.click('[data-action="health"][data-value="none"]');
  await page.check('[data-field="accepted"]');
  await page.click('[data-action="next"]');
  await page.waitForSelector('#daycard', { timeout: 240000 });
  if (shots) await page.screenshot({ path: OUT + '2-plan.png' });
  const text = await page.evaluate(() => document.body.innerText);
  const m = FORBID.exec(text.replace(/Lalo Vera(?: and| y|,| or| ni a) BFit Studios Corp\./g, ''));
  if (m) fail(`${url}: the page names "${m[0]}"`);
  if (NAME && !text.includes(NAME)) fail(`${url}: the plan page never names ${NAME}`);
  // the PDF
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.click('.dayview [data-action="pdf"]')]);
  const file = OUT + `${i}-` + dl.suggestedFilename();
  await dl.saveAs(file);
  const pdf = fs.readFileSync(file);
  console.log(`  PDF "${dl.suggestedFilename()}" ${(pdf.length / 1024).toFixed(0)} KB`);
  if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') fail(`${url}: the download is not a PDF`);
  if (PREFIX && !dl.suggestedFilename().startsWith(PREFIX + '-')) fail(`${url}: PDF name ${dl.suggestedFilename()}`);
  try {
    const py = 'import sys, re, pypdf\nt = " ".join((p.extract_text() or "") for p in pypdf.PdfReader(sys.argv[1]).pages)\nt = re.sub(r"\\s+", " ", t)\nprint(len(t), "|".join(re.findall(r".{0,25}(?:Blaze|Gerardo|Son H.bitos|Nati Vera|Lalo(?! Vera(?: and| y|,| or| ni a) BFit)).{0,25}", t)[:3]))';
    const r = execFileSync('python3', ['-I', '-c', py, file], { encoding: 'utf8' }).trim();
    console.log('  PDF text: ' + r.slice(0, 200));
    if (r.split(' ').slice(1).join(' ').trim()) fail(`${url}: the PDF names another brand: ${r}`);
  } catch (e) { console.log('  (pypdf not available: the PDF text is not checked)'); }
  // the disclaimer link the page itself gives (the release's link), then that page
  const disc = await page.evaluate(() => { const S = window.__bc && window.__bc.state; const u = S && S.model && S.model.rules.legal.disclaimer_url; return u ? u.es : null; });
  const local = disc ? new URL(new URL(disc).pathname, page.url()).href : null;
  if (!disc || !/disclaimer\.es\.html$/.test(disc)) fail(`${url}: the page's disclaimer link is ${disc}`);
  console.log(`  disclaimer link: ${disc}`);
  await page.goto(local || new URL('disclaimer.es.html', await page.evaluate(() => document.baseURI)).href);
  const dtext = await page.evaluate(() => document.body.innerText);
  if (!/que opera como/.test(dtext)) fail(`${url}: the disclaimer page has no brand legal line`);
  if (NAME && !dtext.includes(NAME)) fail(`${url}: the disclaimer page does not name ${NAME}`);
  if (shots) await page.screenshot({ path: OUT + '3-disclaimer.png' });
  if (errs.length) fail(`${url}: page errors: ${errs.join(' | ')}`);
  await ctx.unrouteAll({ behavior: 'ignoreErrors' });
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n${fails.length} problem(s)` : '\nall good');
process.exit(fails.length ? 1 : 0);
