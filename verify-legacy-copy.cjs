const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const results=[];
  for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4186/legacy.html',{waitUntil:'load'});
    for(let i=0;i<28;i++){
      await page.evaluate(i=>{v2Active=i;v2Save();v2Render();},i);
      const text=await page.locator('#lessonStage').innerText();
      assert.ok(text.length>60,'chapter '+i+' missing text');
    }
    await page.evaluate(()=>{v2Active=0;v2Save();v2Render();v2Complete(false);});
    const feedback=await page.locator('#lessonFeedback').textContent();
    assert.ok(feedback.trim(),'missing failure feedback');
    assert.ok(!/可恶！|这就是.*剑道/.test(feedback),'random dialogue replaced feedback');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert.equal(overflow,false);
    assert.deepEqual(errors,[]);
    fs.mkdirSync('output/playwright',{recursive:true});
    await page.screenshot({path:'output/playwright/legacy-copy-'+width+'.png'});
    results.push({width,chapters:28,feedback,overflow,errors});
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify({status:'PASS',checks:results}));
})().catch(e=>{console.error(e);process.exit(1)});
