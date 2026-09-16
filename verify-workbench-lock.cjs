const { chromium } = require('playwright');

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => message.type() === 'error' && errors.push(message.text()));
  await page.goto('http://127.0.0.1:4180/?v=41-workbench-lock', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('manga-us-v2-done', JSON.stringify(Array.from({ length: 27 }, (_, index) => index)));
    localStorage.setItem('manga-us-v2-active', '27');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rule = page.locator('[data-phase="4"]');
  const before = await rule.getAttribute('aria-disabled');
  await page.evaluate(() => document.querySelector('[data-phase="4"]').click());
  const blocked = await page.locator('#lesson-phase-3').isVisible();

  await page.evaluate(() => {
    v2Done.add(27);
    v2Complete(true);
  });
  const after = await rule.getAttribute('aria-disabled');
  await page.evaluate(() => document.querySelector('[data-phase="4"]').click());
  const opened = await page.locator('#lesson-phase-4').isVisible();

  await browser.close();
  const result = { before, blocked, after, opened, errors };
  console.log(JSON.stringify(result, null, 2));
  if (before !== 'true' || !blocked || after !== 'false' || !opened || errors.length) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
