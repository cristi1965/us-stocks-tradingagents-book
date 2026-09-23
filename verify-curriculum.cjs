const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

(async()=>{
  const sandbox={window:{}};
  vm.runInNewContext(fs.readFileSync('interactive/learning-content.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync('interactive/curriculum.js','utf8'),sandbox);
  const lessons=sandbox.window.LEARNING_LESSONS;
  const phases=sandbox.window.CURRICULUM_PHASES;
  const mainline=phases.flatMap(p=>p.lessonIds);
  const catalog=JSON.parse(fs.readFileSync('interactive/articles-catalog.json'));
  const articleIds=new Set(catalog.map(a=>a.id));

  assert.equal(phases.length,7);
  assert.equal(mainline.length,28);
  assert.equal(new Set(mainline).size,28);
  assert.deepEqual(new Set(mainline),new Set(lessons.map(l=>l.id)));
  assert.ok(phases.every(p=>p.question&&p.why&&p.output&&p.gate&&p.map));
  assert.ok(phases.flatMap(p=>p.articleIds).every(id=>articleIds.has(id)));
  assert.equal(phases.at(-1).optional,true);

  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4186/index.html');
  await page.waitForFunction(()=>window.LearningPractice?.lessons.length>28);
  assert.equal(new URL(page.url()).hash,'#path');
  assert.equal(await page.locator('.phase-card').count(),7);
  assert.match(await page.locator('h1').textContent(),/不用先刷118篇文章/);
  assert.match(await page.locator('.curriculum-principle').textContent(),/其余文章当资料库查，不是必刷任务/);

  await page.locator('#phase-account [data-id="risk-budget"]').first().click();
  assert.match(await page.locator('.detail-map-head strong').textContent(),/阶段 1/);
  await page.locator('#next').click();
  assert.equal(new URL(page.url()).hash,'#settled-cash');
  assert.match(await page.locator('.lesson-meta span').textContent(),/阶段 1/);
  for(const id of ['risk-budget','settled-cash']){
    const answer=await page.evaluate(id=>{window.LearningPractice.open(id,false);return window.LearningPractice.lessons.find(l=>l.id===id).quiz.answer;},id);
    await page.locator('input[name="answer"]').nth(answer).check();
    await page.locator('#quiz button[type="submit"]').click();
  }

  await page.locator('.brand').click();
  assert.equal(await page.locator('.phase-card').count(),7);
  await page.locator('#artifact-account').fill('太短');
  for(const checkbox of await page.locator('[data-phase-check="account"]').all())await checkbox.check();
  assert.doesNotMatch(await page.locator('#phase-account .phase-status').textContent(),/阶段任务已记录/);
  await page.locator('#artifact-account').fill('可投资资金是七万元，单笔风险预算另算；账户可用金额仍需向券商确认。');
  assert.match(await page.locator('#phase-account .phase-status').textContent(),/阶段任务已记录/);
  await page.reload();
  assert.match(await page.locator('#artifact-account').inputValue(),/七万元/);
  await page.locator('#learnNav').click();
  const headings=await page.locator('#catalog .catalog-group h3').allTextContents();
  assert.deepEqual(headings,Array.from(phases,p=>`阶段 ${p.number} · ${p.title}`));

  await page.setViewportSize({width:390,height:844});
  await page.locator('.brand').click();
  assert.equal(await page.locator('.phase-card[open]').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  fs.mkdirSync('output/playwright',{recursive:true});
  await page.screenshot({path:'output/playwright/systematic-curriculum-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'output/playwright/systematic-curriculum-desktop.png',fullPage:true});
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS curriculum: 7 stages, 28 unique core lessons, valid readings, unified next-step order, stage catalog, default path, mobile bounds.');
})().catch(error=>{console.error(error);process.exit(1)});
