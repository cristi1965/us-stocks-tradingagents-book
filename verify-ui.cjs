const { chromium } = require('playwright');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4180/?audit=18.2#risk');
  await page.waitForTimeout(300);
  await page.locator('#openTools').click();

  const defaultShares = await page.locator('#shares').textContent();
  await page.locator('#stop').fill('520');
  const invalidRisk = await page.locator('#riskWarning').textContent();
  await page.locator('#stop').fill('480');

  await page.locator('[data-lab="payoff"]').click();
  await page.locator('#strategy').selectOption('spread');
  await page.locator('#shortStrike').fill('100');
  const invalidSpread = await page.locator('[data-panel="payoff"] .lab-output').last().textContent();

  const avatarCount = await page.locator('.dialogue .bubble img').count();
  const chapterCount = await page.locator('.chapter-card').count();
  await page.locator('.chapter-card').first().click();
  const depth = {
    steps: await page.locator('.chapter-depth-grid ol li').count(),
    traps: await page.locator('.chapter-depth-grid ul li').count(),
    checks: await page.locator('.chapter-check input').count(),
    example: await page.locator('.number-case').textContent()
  };
  await page.locator('.chapter-note').fill('盘后点差扩大到 0.40 美元，若超过最大滑点就撤单。');
  const noteSaved = await page.locator('.chapter-note').inputValue();
  const dialogOverflow = await page.locator('#chapterDialog').evaluate(el => el.scrollWidth > el.clientWidth);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(JSON.stringify({ defaultShares, invalidRisk, invalidSpread, avatarCount, chapterCount, depth, noteSaved, dialogOverflow, overflow, errors }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
