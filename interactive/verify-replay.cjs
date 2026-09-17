const { chromium } = require('playwright');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const results = [];
  for (const viewport of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.goto('http://127.0.0.1:4180/?v=23', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {localStorage.clear();localStorage.setItem('manga-us-v2-done','[0,1,2,3]')});
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelector('[data-v2="4"]').click());
    await page.evaluate(() => document.querySelector('[data-phase="3"]').click());
    const gated = await page.locator('#volumeStep').isHidden();
    await page.locator('#revealBar').click();
    const revealText = await page.locator('#lessonFeedback').textContent();
    await page.locator('#candleBody').selectOption('wrong');
    await page.locator('[data-candle-check]').click();
    const bodyRetry = await page.locator('#volumeStep').isHidden();
    await page.locator('#candleBody').selectOption('up');
    await page.locator('[data-candle-check]').click();
    await page.locator('#candleVolume').selectOption('wrong');
    await page.locator('#volumeSubmit [data-run]').click();
    const retryEnabled = await page.locator('[data-run]').isEnabled();
    await page.locator('#candleVolume').selectOption('busy');
    await page.locator('#volumeSubmit [data-run]').click();
    const passed = await page.evaluate(() => JSON.parse(localStorage.getItem('manga-us-v2-done') || '[]').includes(4));
    const chartLessons = [];
    for (const lesson of [
      {index:6, name:'trendRead', answer:'up', plain:'不用填价格'},
      {index:7, name:'zoneRead', answer:'clear', plain:'支撑不是一个精确数字'}
    ]) {
      await page.evaluate(index => {
        localStorage.setItem('manga-us-v2-active', String(index));
        localStorage.setItem('manga-us-v2-done', JSON.stringify(Array.from({length:index}, (_, i) => i)));
      }, lesson.index);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.querySelector('[data-phase="3"]').click());
      const text = await page.locator('#lessonStage').innerText();
      const numericFields = await page.locator('#lessonStage input[type="number"]').count();
      await page.locator('#revealBar').click();
      await page.locator(`input[name="${lesson.name}"][value="${lesson.answer}"]`).check();
      await page.locator('[data-run]').click();
      chartLessons.push({
        index: lesson.index,
        plain: text.includes(lesson.plain),
        noManualPrice: numericFields === 0,
        passed: await page.evaluate(index => JSON.parse(localStorage.getItem('manga-us-v2-done') || '[]').includes(index), lesson.index)
      });
    }
    await page.evaluate(() => {
      localStorage.setItem('manga-us-v2-active','3');
      localStorage.setItem('manga-us-v2-done',JSON.stringify([3]));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelector('[data-phase="4"]').click());
    const recap = await page.locator('.stage-recap').isVisible();
    await page.reload({ waitUntil: 'domcontentloaded' });
    const phaseRestored = await page.locator('[data-phase="4"]').getAttribute('aria-current') !== null && await page.locator('#lesson-phase-4').isVisible();
    const names = await page.locator('.story-thread p span b').allTextContents();
    const layout = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    const a11y = await page.evaluate(() => ({feedback:lessonFeedback.getAttribute('role'),progress:document.querySelector('.proof').getAttribute('role'),stageSummaries:[...stageRail.querySelectorAll('summary')].filter(x=>getComputedStyle(x).display!=='none').length}));
    await page.evaluate(() => { localStorage.setItem('manga-us-v2-done','[0]'); localStorage.setItem('manga-us-v2-active','1'); });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelector('[data-v2="1"]').click());
    await page.evaluate(() => document.querySelector('[data-phase="3"]').click());
    await page.locator('#psBudget').fill('700');
    await page.evaluate(() => document.querySelector('[data-v2="2"]').click());
    await page.evaluate(() => document.querySelector('[data-v2="1"]').click());
    await page.evaluate(() => document.querySelector('[data-phase="3"]').click());
    const draftRestored = await page.locator('#psBudget').inputValue() === '700';
    const locked = await page.locator('[data-v2="3"]').isDisabled();
    await page.evaluate(() => {localStorage.setItem('manga-us-v2-done','not-json');localStorage.setItem('manga-us-v3-events','{broken');});
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelector('[data-phase="3"]').click());
    const cacheRecovered = await page.locator('#lessonStage h2').isVisible();
    await page.evaluate(() => {localStorage.setItem('manga-us-v2-done',JSON.stringify(Array.from({length:26},(_,i)=>i)));localStorage.setItem('manga-us-v2-active','26');});
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelector('[data-phase="3"]').click());
    await page.locator('#evidenceType').selectOption('quote');
    await page.locator('#evidenceAge').fill('60');
    await page.locator('#evidenceTtl').fill('30');
    await page.locator('#evidenceDecision').selectOption('accept');
    await page.locator('[data-run]').click();
    const staleQuoteRejected = await page.locator('#evidenceAge').getAttribute('aria-invalid') === 'true';
    results.push({viewport:viewport.name,gated,bodyRetry,revealText,retryEnabled,passed,chartLessons,recap,phaseRestored,names,draftRestored,locked,cacheRecovered,staleQuoteRejected,a11y,overflow:layout.scroll>layout.width,errors});
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results,null,2));
  if (results.some(x => !x.gated || !x.bodyRetry || !x.retryEnabled || !x.passed || x.chartLessons.some(y => !y.plain || !y.noManualPrice || !y.passed) || !x.recap || !x.phaseRestored || !x.draftRestored || !x.locked || !x.cacheRecovered || !x.staleQuoteRejected || x.a11y.feedback!=='status' || x.a11y.progress!=='progressbar' || x.a11y.stageSummaries!==8 || x.overflow || x.errors.length)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
