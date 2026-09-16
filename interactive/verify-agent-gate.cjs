const { chromium } = require('playwright');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await chromium.launch({ headless:true, executablePath:chrome });
  const page = await browser.newPage({ viewport:{width:1440,height:900} });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4180/?v=43-agent-gate',{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(()=>{
    localStorage.removeItem('manga-us-paper-receipts');
    const set=(id,value)=>{const el=document.getElementById(id);el.value=value};
    set('agentSource','https://www.nyse.com/quote/XNYS:SHAN');set('bullCase','这是一条超过二十个字符且可以核对的一手看多证据说明');set('bearCase','这是一条超过二十个字符且可以推翻判断的反面证据');set('invalidCase','收盘跌破关键价位并且成交量确认后判断失效');set('maxLoss','500');set('equity','100000');set('agentArtifactVersion','agent-config-v3');
    set('agentEvidenceType','quote');set('agentTime',new Date(Date.now()-10*60*1000).toISOString().slice(0,16));runAgents.click();const staleQuote=/30 秒/.test(agentVerdict.textContent);
    set('agentEvidenceType','filing');set('agentSource','https://www.sec.gov/example');set('agentReportPeriod','2026 Q2');set('agentTime',new Date(Date.now()-60*24*3600*1000).toISOString().slice(0,16));runAgents.click();
    const filingVerdict=agentVerdict.textContent;
    const receipt=JSON.parse(localStorage.getItem('manga-us-paper-receipts')||'[]').at(-1);
    set('agentEvidenceType','quote');set('agentReportPeriod','');set('agentSource','https://www.sec.gov/example');runAgents.click();const mismatchRejected=/来源与证据类型不匹配/.test(agentVerdict.textContent);
    return {staleQuote,filingAccepted:/允许进入 Paper/.test(filingVerdict),receiptReplayable:receipt?.source?.startsWith('https://www.sec.gov/')&&receipt?.reportPeriod==='2026 Q2'&&receipt?.inputSnapshot?.bearCase&&receipt?.modelConfig==='TRADINGAGENTS_TEACHING_GATE_V2',mismatchRejected};
  });
  await browser.close();
  console.log(JSON.stringify({...result,errors},null,2));
  if(errors.length||Object.values(result).some(value=>value!==true))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});
