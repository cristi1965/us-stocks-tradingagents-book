const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
(async()=>{
 const s={window:{}};vm.runInNewContext(fs.readFileSync('interactive/learning-content.js','utf8'),s);
 const ids=new Set(s.window.LEARNING_LESSONS.map(l=>l.id));
 const bank=Object.assign({},...[1,2,3].map(n=>JSON.parse(fs.readFileSync(`interactive/article-practice-${n}.json`))));
 Object.entries(bank).forEach(([id,qs])=>qs.forEach((q,i)=>ids.add(`article-${id}-${i+1}`)));
 const catalog=JSON.parse(fs.readFileSync('interactive/articles-catalog.json'));
 const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4186/maps.html');
 assert.equal(await page.locator('.diagram img').count(),4);
 assert.ok(await page.locator('.diagram img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));
 for(const href of await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')))){
  if(href.startsWith('index.html#'))assert.ok(ids.has(href.split('#')[1]),href);
  if(href.startsWith('library.html#'))assert.ok(catalog.some(a=>a.id===href.split('#')[1]),href);
 }
 for(const id of ['learning-route','domain-map','decision-flow','order-sequence']){
  const mmd=fs.readFileSync(`figures/${id}.mmd`,'utf8');assert.ok(fs.readFileSync(`figures/${id}.md`,'utf8').includes('```mermaid\n'+mmd+'```'));
 }
 fs.mkdirSync('output/playwright',{recursive:true});
 await page.screenshot({path:'output/playwright/maps-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.locator('.map-tabs a[href="#sequence"]').click();
 const region=page.locator('#sequence .diagram');assert.ok(await region.evaluate(e=>e.scrollWidth>e.clientWidth));
 await region.focus();await page.keyboard.press('ArrowRight');
 await page.locator('#sequence .map-controls button').click();assert.ok(await region.evaluate(e=>e.scrollWidth<=e.clientWidth));
 await page.locator('#sequence .map-controls button').click();assert.ok(await region.evaluate(e=>e.scrollWidth>e.clientWidth));
 await page.screenshot({path:'output/playwright/maps-mobile.png'});
 await page.locator('a[href="index.html#partial-fill"]').last().click();await page.waitForFunction(()=>window.LearningPractice);
 assert.match(await page.locator('h1').textContent(),/只买到一部分/);
 await page.locator('.sidebar a[href="maps.html"]').click();await page.waitForURL('**/maps.html');
 await page.goto('http://127.0.0.1:4186/library.html');await page.locator('.library-nav a[href="maps.html"]').click();await page.waitForURL('**/maps.html');
 // Every article detail receives a local context diagram, not only the overview page.
 await page.goto('http://127.0.0.1:4186/library.html');await page.waitForFunction(()=>window.PlainLibrary?.catalog.length===118);
 for(const row of catalog){
  await page.evaluate(id=>window.PlainLibrary.open(id,false),row.id);
  assert.equal(await page.locator('.detail-map').count(),1,row.id);
  assert.equal((await page.locator('.detail-map .current').innerText()).includes('你在这里'),true,row.id);
  assert.ok(await page.locator('.detail-map details img').getAttribute('src'));
 }
 await page.evaluate(()=>window.PlainLibrary.open('start-duoshao-qian',false));await page.setViewportSize({width:390,height:844});
 await page.locator('.detail-map details summary').click();
 assert.equal(await page.locator('.detail-map details img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'output/playwright/article-detail-map-mobile.png',fullPage:true});
 // Core lessons and article exercises use the same contextual diagram with their own group.
 await page.goto('http://127.0.0.1:4186/index.html');await page.waitForFunction(()=>window.LearningPractice?.lessons.length>28);
 const detailLessons=await page.evaluate(()=>window.LearningPractice.lessons.filter((l,i,a)=>i<28||a.findIndex(x=>x.group===l.group)===i).map(l=>({id:l.id,group:l.group})));
 for(const lesson of detailLessons){
  await page.evaluate(id=>window.LearningPractice.open(id,false),lesson.id);
  const label=await page.locator('.detail-map-head strong').textContent();
  assert.ok(label.includes(lesson.group)||/主线阶段|补充资料/.test(label),`${lesson.id}: ${label}`);
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.LearningPractice.open('risk-budget',false));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'output/playwright/detail-map-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 4 rendered local diagrams, source parity, lesson/article links, desktop/mobile bounds, scrollable sequence, both entry points.');
})().catch(e=>{console.error(e);process.exit(1)});
