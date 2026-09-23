const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
  const catalog=JSON.parse(fs.readFileSync('interactive/articles-catalog.json','utf8'));
  const originals=JSON.parse(fs.readFileSync('interactive/articles-original.json','utf8'));
  const articles=Object.assign({},...[1,2,3].map(n=>JSON.parse(fs.readFileSync('interactive/articles-plain-'+n+'.json','utf8'))));
  assert.equal(Object.keys(articles).length,118);
  assert.equal(catalog.length,118);
  for(const row of catalog){
    const a=articles[row.id];assert.ok(a,'Missing '+row.id);
    assert.ok(a.title&&a.coverageNote&&a.sourceSections.length,'Missing provenance '+row.id);
    assert.ok(a.body.length>=650,'Too short '+row.id);
    assert.notEqual(a.body,originals[row.id],'Not rewritten '+row.id);
    assert.ok(!/待补充|TODO|PLACEHOLDER/.test(a.body),'Placeholder '+row.id);
  }
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4186/library.html');
  await page.waitForFunction(()=>window.PlainLibrary?.catalog.length===118);
  assert.equal(await page.locator('.article-link').count(),118);
  for(const row of catalog){
    await page.evaluate(id=>window.PlainLibrary.open(id,false),row.id);
    assert.equal(await page.locator('#article h1').textContent(),articles[row.id].title);
    assert.ok((await page.locator('#articleBody').innerText()).length>600);
    assert.ok(await page.locator('#articleBody h2').count()>0);
  }
  await page.locator('#originalView').click();
  await page.locator('.article-original').waitFor();
  assert.ok((await page.locator('.article-original').innerText()).length>500);
  assert.ok(await page.locator('.article-original h2').count()>0);
  await page.locator('#plainView').click();
  assert.equal(await page.locator('.article-original').count(),0);
  await page.locator('#articleSearch').fill('不存在zzzzz');assert.equal(await page.locator('.article-link').count(),0);
  for(const query of ['Call','Put']){
    await page.locator('#articleSearch').fill(query);
    assert.equal(await page.locator('[data-article="tool-qiquan"]').count(),1);
  }
  await page.locator('#articleSearch').fill('');assert.equal(await page.locator('.article-link').count(),118);
  await page.evaluate(()=>window.PlainLibrary.open('tool-qiquan',false));
  assert.equal(await page.locator('#articleBody [data-term="spread-legs"]').count(),0,'Single option position must not open spread-legs explanation');
  await page.reload();await page.waitForFunction(()=>window.PlainLibrary);
  assert.equal(await page.locator('#article h1').textContent(),articles['tool-qiquan'].title);
  const term=page.locator('#articleBody .term-link').first();await term.click();
  assert.equal(await page.locator('#termPanel').isVisible(),true);await page.keyboard.press('Escape');
  await page.mouse.move(0,0);await page.evaluate(()=>window.LearningTerms.close());
  fs.mkdirSync('output/playwright',{recursive:true});
  await page.screenshot({path:'output/playwright/library-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.mouse.move(0,0);await page.evaluate(()=>window.LearningTerms.close());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'output/playwright/library-mobile.png',fullPage:true});
  await page.goto('http://127.0.0.1:4186/legacy.html');
  await page.evaluate(()=>window.openRieslingArticleModal('trade-cangwei'));
  await page.waitForURL('**/library.html#trade-cangwei');
  await page.waitForFunction(()=>window.PlainLibrary);
  assert.equal(await page.locator('#article h1').textContent(),articles['trade-cangwei'].title);
  const fail=await browser.newPage();
  await fail.route('**/articles-plain-2.json',route=>route.abort());
  await fail.goto('http://127.0.0.1:4186/library.html');
  await fail.locator('#retryLibrary').waitFor();await fail.unroute('**/articles-plain-2.json');
  await fail.locator('#retryLibrary').click();await fail.waitForFunction(()=>window.PlainLibrary);
  let releaseOriginal;
  await fail.route('**/articles-original.json',async route=>{
    await new Promise(resolve=>{releaseOriginal=resolve;});await route.continue();
  });
  await fail.locator('#originalView').click();
  await fail.locator('#plainView').click();
  while(!releaseOriginal)await new Promise(resolve=>setTimeout(resolve,10));
  const originalResponse=fail.waitForResponse('**/articles-original.json');releaseOriginal();
  await originalResponse;await fail.waitForLoadState('networkidle');
  assert.equal(await fail.locator('.article-original').count(),0,'Late original response must not override plain view');
  await fail.evaluate(()=>window.PlainLibrary.open('indi-ma',false));
  await fail.locator('#originalView').click();
  assert.ok(await fail.locator('.article-original figure').count()>0);
  assert.equal(await fail.locator('.article-original figure details[open]').count(),0);
  const originalChart=originals['indi-ma'].match(/^:::chart\s*\n([\s\S]*?)^:::\s*$/m)[0];
  assert.equal(await fail.locator('.article-original figure code').first().textContent(),originalChart);
  await fail.evaluate(()=>window.PlainLibrary.open('fund-sanbiao',false));
  assert.equal(await fail.locator('#articleBody [data-term="equity"]').count(),0,'Company equity must not open account-equity explanation');
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS: 118 rewritten articles, all render, provenance, search, original comparison, reload, terms, mobile, legacy links, fetch retry.');
})().catch(e=>{console.error(e);process.exit(1)});
