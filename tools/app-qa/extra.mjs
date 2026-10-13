// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
const OUT = process.env.BC_QA_OUT || '/tmp/bc-qa/';
fs.mkdirSync(OUT, { recursive: true });
const vercel = JSON.parse(fs.readFileSync(ROOT + 'vercel.json'));
const csp = vercel.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
const page = await ctx.newPage();
const errs = [];
page.on('console', m => { if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) errs.push(m.text()); });
page.on('pageerror', e => errs.push(e.message));
await page.route('**/*', async (route) => { const r = await route.fetch(); const headers = { ...r.headers(), 'content-security-policy': csp }; await route.fulfill({ response: r, headers }); });
await page.goto((process.env.BC_QA_URL || 'http://127.0.0.1:8766/'));
await page.waitForSelector('[data-screen="you"]');
const intake = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/08-pickleball-genpop.json'));
await page.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), intake);
await page.click('[data-action="next"]');
await page.waitForSelector('#daycard');
// save image
const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.click('[data-action="save-image"]')]);
const p = OUT + 'saved-' + dl.suggestedFilename();
await dl.saveAs(p);
console.log('saved image', dl.suggestedFilename(), fs.statSync(p).size);
// swipe + keys
await page.keyboard.press('ArrowRight');
console.log('after right', await page.evaluate(() => window.__bc.state.day));
await page.keyboard.press('Shift+ArrowRight');
console.log('after shift-right week', await page.evaluate(() => window.__bc.state.week));
// print -> pdf
await page.evaluate(() => { document.querySelector('[data-action="print"]'); });
await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: OUT + 'plan-08.pdf', format: 'Letter' });
await page.screenshot({ path: OUT + 'print-preview.png', fullPage: false });
console.log('pdf bytes', fs.statSync(OUT + 'plan-08.pdf').size);
console.log('errors', errs);
await browser.close();
