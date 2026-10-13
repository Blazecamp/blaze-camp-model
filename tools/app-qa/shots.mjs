// Playwright is not a dependency of this repo: install it in a scratch folder and point BC_PLAYWRIGHT at it (see app/README.md).
const { chromium } = await import(process.env.BC_PLAYWRIGHT || 'playwright');
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
const OUT = process.argv[2] || ROOT + 'app/screenshots/';
const BASE = (process.env.BC_QA_URL || 'http://127.0.0.1:8766/');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.BC_CHROMIUM ? { executablePath: process.env.BC_CHROMIUM } : {});
const VP = { phone: { width: 390, height: 844 }, desktop: { width: 1280, height: 800 } };
const errs = [];
async function open(vp, lang, scheme = 'light') {
  const page = await browser.newPage({ viewport: VP[vp], colorScheme: scheme });
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(BASE);
  await page.waitForSelector('[data-step="about"]');
  await page.click(`.lang [data-value="${lang}"]`);
  return page;
}
const shot = (page, name, full = false) => page.screenshot({ path: OUT + name + '.png', fullPage: full });

// 1. the wizard, athlete path (soccer), every step
for (const vp of ['phone', 'desktop']) for (const lang of ['en', 'es']) {
  const p = await open(vp, lang);
  const pre = `${vp}-${lang}-`;
  await shot(p, pre + '1-about');
  await p.click('[data-action="next"]');
  await shot(p, pre + '2-goal');
  await p.click('[data-action="goal"][data-value="athletic"]');
  await p.waitForSelector('[data-step="sport"]');
  await p.fill('input[data-field="q"]', lang === 'en' ? 'soc' : 'fút');
  await shot(p, pre + '3a-sport-search');
  await p.click('[data-action="sport-pick"][data-value="soccer"]');
  await p.click('[data-action="position"][data-value="midfielder"]');
  await shot(p, pre + '3b-sport');
  await p.click('[data-action="next"]');
  await shot(p, pre + '4-week');
  await p.click('[data-action="next"]');
  await shot(p, pre + '5-kit');
  await p.click('[data-action="next"]');
  await p.click('[data-action="pain"][data-value="knee"]');
  await p.click('[data-action="health"][data-value="none"]');
  await shot(p, pre + '6-health');
  await p.click('[data-action="next"]');
  await p.check('[data-field="accepted"]');
  await shot(p, pre + '7-accept');
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 120000 });
  await shot(p, pre + '8-plan-day');
  await p.click('[data-action="tab"][data-value="progress"]');
  await shot(p, pre + '9-progress');
  await p.close();
}
// 2. special cases from the samples (phone)
const special = [
  ['08-pickleball-genpop.json', 'en', 'phone-en-two-day-pickleball', 1, 'Mon'],
  ['05-bootcamp.json', 'es', 'phone-es-bootcamp-circuit', 3, 'Mon'],
  ['04-crossfit-style-bootcamp.json', 'en', 'phone-en-crossfit-class', 2, 'Tue'],
  ['02-football.json', 'en', 'phone-en-athlete-football', 5, 'Mon'],
  ['07-push-pull-legs.json', 'en', 'phone-en-ppl-week12', 12, 'Mon'],
];
for (const [f, lang, name, wk, day] of special) {
  const p = await open('phone', lang);
  const intake = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/' + f));
  await p.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), intake);
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 180000 });
  await p.evaluate(([n, d]) => window.__bc.go(n, d), [wk, day]);
  await shot(p, name);
  await shot(p, name + '-full', true);
  await p.locator('button.row').nth(4).click().catch(() => {});
  await shot(p, name + '-row-open');
  await p.close();
}
// 3. health yes + minor + dark mode
{
  const p = await open('phone', 'en', 'dark');
  const i = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/05-bootcamp.json'));
  const a = await p.evaluate((x) => window.__bc.answersFromIntake(x), i);
  a.health = 'some'; a.safety.heart = true; a.accepted = false;
  await p.evaluate((x) => { window.__bc.load(x); window.__bc.state.step = window.__bc.B.stepsFor(x).indexOf('health'); window.__bc.go && 0; }, a);
  await p.evaluate(() => { const S = window.__bc.state; S.screen = 'wizard'; document.querySelector('[data-action="lang"][data-value="en"]').click(); });
  await shot(p, 'phone-en-dark-health-yes-step', true);
  await p.click('[data-action="next"]');
  await p.check('[data-field="accepted"]');
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard');
  await shot(p, 'phone-en-dark-health-yes-plan');
  await p.click('[data-action="tab"][data-value="progress"]');
  await shot(p, 'phone-en-dark-health-yes-progress');
  await p.close();
}
{
  const p = await open('phone', 'es');
  const i = JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/01-swimming.json'));
  const a = await p.evaluate((x) => window.__bc.answersFromIntake(x), i);
  a.accepted = false; a.guardian = false;
  await p.evaluate((x) => window.__bc.load(x), a);
  await shot(p, 'phone-es-minor-accept', true);
  await p.close();
}
console.log('errors', errs);
await browser.close();
