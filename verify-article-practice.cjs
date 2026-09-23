const {chromium}=require('playwright');
const fs=require('fs'),assert=require('node:assert/strict');
(async()=>{
 const catalog=JSON.parse(fs.readFileSync('interactive/articles-catalog.json'));
 const bank=Object.assign({},...[1,2,3].map(n=>JSON.parse(fs.readFileSync(`interactive/article-practice-${n}.json`))));
 const articles=Object.assign({},...[1,2,3].map(n=>JSON.parse(fs.readFileSync(`interactive/articles-plain-${n}.json`))));
 assert.equal(Object.keys(bank).length,118);
 const prompts=new Set();let count=0;
 for(const a of catalog){
  assert.ok(bank[a.id]?.length>=3,a.id);
  const headings=articles[a.id].body.split('\n').filter(x=>/^##\s/.test(x)).map(x=>x.replace(/^##\s+/,''));
  for(const q of bank[a.id]){
   assert.ok(q.explanation.length>=35,a.id+' short explanation');
   assert.ok(headings.includes(q.sourceHeading),a.id+' source heading '+q.sourceHeading);
   assert.equal(q.options.length,3);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);
   assert.ok(q.options.every(o=>o.text&&o.feedback.length>=8));
   assert.equal(new Set(q.options.map(o=>o.text)).size,3);
   assert.ok(!prompts.has(q.prompt),'duplicate '+q.prompt);prompts.add(q.prompt);count++;
  }
 }
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('tradingagents-learning-v1'))localStorage.setItem('tradingagents-learning-v1',JSON.stringify({active:'risk-budget',records:{'risk-budget':{passed:true,attempts:2}},notes:{'risk-budget':'保留我的原笔记'}}));});
 await page.goto('http://127.0.0.1:4186/library.html#start-duoshao-qian');
 await page.locator('.article-practice-link').first().click();
 await page.waitForFunction(()=>window.LearningPractice);
 assert.match(page.url(),/#article-start-duoshao-qian-1$/);
 assert.equal(await page.locator('#courseScope').inputValue(),'articles');
 const articleLessons=await page.evaluate(()=>window.LearningPractice.lessons.filter(l=>l.articleId));
 assert.equal(articleLessons.length,count);
 const current=articleLessons.find(l=>l.id==='article-start-duoshao-qian-1');
 await page.locator('input[name=answer]').nth((current.quiz.answer+1)%3).check();
 await page.locator('#quiz button').click();
 assert.equal(await page.locator('#reviewCount').textContent(),'1');
 await page.locator('#reviewNav').click();await page.locator('.review-item button').click();
 await page.locator('input[name=answer]').nth(current.quiz.answer).check();await page.locator('#quiz button').click();
 assert.equal(await page.locator('#reviewCount').textContent(),'0');
 await page.locator('.notes summary').click();await page.locator('#note').fill('回本比例以跌后金额为分母');
 await page.reload();await page.waitForFunction(()=>window.LearningPractice);
 assert.equal(await page.locator('#note').inputValue(),'回本比例以跌后金额为分母');
 await page.locator('#next').click();assert.match(page.url(),/-2$/);
 await page.locator('#previous').click();assert.match(page.url(),/-1$/);
 await page.locator('#search').fill('不存在的题xyz');assert.equal(await page.locator('.lesson-link').count(),0);await page.locator('#search').fill('');
 await page.locator('#courseScope').selectOption('core');assert.match(await page.locator('#progress').textContent(),/^1 \/ 28/);
 assert.equal(await page.locator('#note').inputValue(),'保留我的原笔记');
 // Every question is rendered and all three feedback paths are exercised through the real form handler.
 for(const lesson of articleLessons){
  const result=await page.evaluate(id=>{
   const app=window.LearningPractice;app.open(id,false);const l=app.lessons.find(l=>l.id===id),feedback=[];
   for(let i=0;i<3;i++){document.querySelectorAll('#quiz input')[i].checked=true;document.querySelector('#quiz').requestSubmit();feedback.push(document.querySelector('#feedback').textContent);}
   document.querySelectorAll('#quiz input')[l.quiz.answer].checked=true;document.querySelector('#quiz').requestSubmit();
   return {title:document.querySelector('h1').textContent,explanation:document.querySelector('.article-concept').textContent,feedback};
  },lesson.id);
  assert.equal(result.title,lesson.title);assert.ok(result.explanation.includes(lesson.concept));
  lesson.quiz.options.forEach((o,i)=>assert.ok(result.feedback[i].includes(o.feedback),lesson.id));
 }
 assert.equal(await page.locator('#reviewCount').textContent(),'0');
 assert.match(await page.locator('#progress').textContent(),new RegExp(`^${count} / ${count}`));
 await page.evaluate(()=>window.LearningPractice.open('article-start-duoshao-qian-1',false));
 fs.mkdirSync('output/playwright',{recursive:true});
 await page.screenshot({path:'output/playwright/article-practice-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'output/playwright/article-practice-mobile.png',fullPage:true});
 await page.locator('.article-concept a').click();await page.waitForURL('**/library.html#start-duoshao-qian');
 const fail=await browser.newPage();await fail.route('**/article-practice-2.json',route=>route.abort());
 await fail.goto('http://127.0.0.1:4186/index.html#article-tool-qiquan-1');await fail.locator('#retryPractice').waitFor();
 assert.equal(await fail.locator('.phase-card').count(),7);assert.match(await fail.locator('#progress').textContent(),/28/);
 assert.equal(await fail.evaluate(()=>window.LearningPractice.lessons.length),28);
 await fail.unroute('**/article-practice-2.json');await fail.locator('#retryPractice').click();await fail.waitForFunction(()=>window.LearningPractice?.lessons.length>28);
 assert.match(fail.url(),/#article-tool-qiquan-1$/);assert.equal(await fail.locator('h1').textContent(),bank['tool-qiquan'][0].title);
 assert.deepEqual(errors,[]);await browser.close();
 console.log(`PASS: 118 articles / ${count} questions; all option feedback, source headings, shared review, existing records, notes, reload, navigation, mobile, load failure/retry.`);
})().catch(e=>{console.error(e);process.exit(1)});
