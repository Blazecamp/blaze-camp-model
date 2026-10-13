// Screenshots of the Plan Builder: the 4 wizard screens, the building screen, the day card and the progress tab, on a phone
// (390x844) and a desktop (1280x800), in English and Spanish, plus special cases from the samples.
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
  await page.waitForSelector('[data-screen="you"]');
  await page.click(`.lang [data-value="${lang}"]`);
  return page;
}
const shot = (page, name, full = false) => page.screenshot({ path: OUT + name + '.png', fullPage: full });
const sample = (f) => JSON.parse(fs.readFileSync(ROOT + 'samples/intakes/' + f));

// 1. the wizard, athlete path (soccer): the 4 screens, the build, the plan
for (const [vp, lang] of [['phone', 'en'], ['phone', 'es'], ['desktop', 'en']]) {
  const p = await open(vp, lang);
  const pre = `${vp}-${lang}-`;
  await shot(p, pre + '1-you');
  await p.click('[data-action="next"]');
  await shot(p, pre + '2-goal');
  await p.click('[data-action="goal"][data-value="athletic"]');
  await p.fill('input[data-field="q"]', lang === 'en' ? 'soc' : 'fút');
  await shot(p, pre + '2a-goal-sport-search');
  await p.click('[data-action="sport-pick"][data-value="soccer"]');
  await p.selectOption('select[data-field="position"]', 'midfielder');
  await shot(p, pre + '2b-goal-sport');
  await p.click('[data-action="next"]');
  await shot(p, pre + '3-week');
  if (vp === 'phone') {
    await p.click('details.opts > summary');
    await shot(p, pre + '3b-week-options', true);
    await p.click('details.opts > summary');
  }
  await p.click('[data-action="next"]');
  await p.click('[data-action="pain"][data-value="knee"]');
  await p.click('[data-action="health"][data-value="none"]');
  await p.check('[data-field="accepted"]');
  await shot(p, pre + '4-safety');
  if (vp === 'phone') await shot(p, pre + '4-safety-full', true);
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 120000 });
  await shot(p, pre + '6-plan-day');
  await p.click('[data-action="tab"][data-value="progress"]');
  await shot(p, pre + '7-progress');
  await p.close();
}
// 2. the other goal details on the goal screen (phone, EN): build muscle (Focus muscles), stay active, lose fat (gym / bootcamp)
{
  const p = await open('phone', 'en');
  await p.click('[data-action="next"]');
  await p.click('[data-action="goal"][data-value="muscle"]');
  await p.click('[data-action="focus"][data-value="glutes"]');
  await shot(p, 'phone-en-2c-goal-muscle');
  await p.click('[data-action="goal"][data-value="active"]');
  await p.click('[data-action="act-pick"][data-value="rec_pickleball"]');
  await p.click('[data-action="playday"][data-value="Sat"]');
  await shot(p, 'phone-en-2d-goal-active');
  await p.click('[data-action="goal"][data-value="fat_loss"]');
  await shot(p, 'phone-en-2e-goal-fat-loss');
  // the building screen of a physique plan (the slowest kind)
  await p.click('[data-action="goal"][data-value="muscle"]');
  await p.click('[data-action="next"]');
  await p.click('[data-action="days"][data-value="5"]');
  await p.click('[data-action="next"]');
  await p.click('[data-action="health"][data-value="none"]');
  await p.check('[data-field="accepted"]');
  await p.click('[data-action="next"]');
  await p.waitForSelector('.building');
  await p.waitForTimeout(1500);
  await shot(p, 'phone-en-5-building');
  await p.waitForSelector('#daycard', { timeout: 180000 });
  await shot(p, 'phone-en-muscle-5day');
  await p.close();
}
// 3. desktop ES plan
{
  const p = await open('desktop', 'es');
  await p.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), sample('03-soccer.json'));
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 120000 });
  await shot(p, 'desktop-es-6-plan-day');
  await p.click('[data-action="tab"][data-value="progress"]');
  await shot(p, 'desktop-es-7-progress');
  await p.close();
}
// 4. special cases from the samples (phone)
const special = [
  ['06-full-body-aesthetics.json', 'en', 'phone-en-gym-day-aesthetics', 1, 'Mon'],
  ['08-pickleball-genpop.json', 'en', 'phone-en-two-day-pickleball', 1, 'Mon'],
  ['05-bootcamp.json', 'es', 'phone-es-bootcamp-circuit', 3, 'Mon'],
  ['04-crossfit-style-bootcamp.json', 'en', 'phone-en-crossfit-class', 2, 'Tue'],
  ['02-football.json', 'en', 'phone-en-athlete-football', 5, 'Mon'],
  ['07-push-pull-legs.json', 'en', 'phone-en-ppl-week12', 12, 'Mon'],
];
for (const [f, lang, name, wk, day] of special) {
  const p = await open('phone', lang);
  await p.evaluate((i) => window.__bc.load(window.__bc.answersFromIntake(i)), sample(f));
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 180000 });
  await p.evaluate(([n, d]) => window.__bc.go(n, d), [wk, day]);
  await shot(p, name);
  await shot(p, name + '-full', true);
  await p.locator('button.row').nth(4).click().catch(() => {});
  await shot(p, name + '-row-open');
  await p.close();
}
// 5. health yes (dark mode) and a minor
{
  const p = await open('phone', 'en', 'dark');
  const a = await p.evaluate((x) => window.__bc.answersFromIntake(x), sample('05-bootcamp.json'));
  a.health = 'some'; a.safety.heart = true; a.accepted = false;
  await p.evaluate((x) => window.__bc.load(x), a);
  await shot(p, 'phone-en-dark-health-yes-step', true);
  await p.check('[data-field="accepted"]');
  await p.click('[data-action="next"]');
  await p.waitForSelector('#daycard', { timeout: 120000 });
  await shot(p, 'phone-en-dark-health-yes-plan');
  await p.click('[data-action="tab"][data-value="progress"]');
  await shot(p, 'phone-en-dark-health-yes-progress');
  await p.close();
}
{
  const p = await open('phone', 'es');
  const a = await p.evaluate((x) => window.__bc.answersFromIntake(x), sample('01-swimming.json'));
  a.accepted = false; a.guardian = false;
  await p.evaluate((x) => window.__bc.load(x), a);
  await shot(p, 'phone-es-minor-safety', true);
  await p.close();
}
console.log('errors', errs);
await browser.close();
