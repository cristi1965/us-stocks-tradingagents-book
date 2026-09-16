const { chromium } = require('playwright');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const answers = {
  1:{psBudget:800,psShares:190,psNotional:19000},
  10:{fillSession:'regular',fillTif:'day',fillQty:700,fillAvg:49.957,fillOpen:300,fillShortfall:110,fillOpportunity:120,fillFees:7,fillTotal:237,fillEndState:'cancelled'},
  11:{haltPlanLoss:1000,haltActualLoss:3600,haltExtraLoss:2600,haltState:'pending',luldAction:'chain',mwcbThresholds:'full',mwcb1Action:'pause',mwcbLateAction:'continue',mwcb3Action:'close'},
  12:{clusterStock:-4000,clusterEtf:-2400,clusterHedge:1600,clusterNetLoss:4800},
  14:{marginAssets:70000,marginInterest:493.15,marginEquity:19506.85,marginRatio:27.87,marginLayers:'layers',marginStatus:'call',settledAvailable:5000,settlementDecision:'reject',settlementCalendar:'verified'},
  15:{shortQty:150,shortBorrowCost:44.38,shortStatus:'restricted',ssrExecution:'aboveBid',noLocateDecision:'reject',borrowRecallDecision:'review'},
  16:{cpiFirst:.2,cpiRevised:.1,cpiVintage:'first'},
  19:{earnRiskPerShare:20.5,earnShares:48,earnNotional:4800,earnLoss:984},
  20:{chainMidA:3.025,chainSpreadA:4.96,chainSpreadB:54.55,chainOrderQty:20,chainPick:'a',chainGuarantee:'no'},
  22:{greekSide:'longCall',greekDelta:1.5,greekGamma:.18,greekUnit:.4,greekContract:40,greekBoundary:'local'},
  23:{crushSmall:-20,crushLarge:400,crushConclusion:'conditional'},
  24:{spreadLoss:300,spreadProfit:700,spreadBreakeven:108,assignedShares:-100,assignedCash:11500,assignmentAction:'verify'},
  26:{gateSource:'https://www.sec.gov/example',gateBear:'反证条件已经明确记录',gateLoss:100,gateInvalid:'价格失效条件已经明确',evidenceType:'quote',evidenceAge:15,evidenceTtl:30,evidenceDecision:'accept'}
};

(async () => {
  const browser = await chromium.launch({ headless:true, executablePath:chrome });
  const results=[];
  for (const viewport of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]) {
    const page=await browser.newPage({viewport});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>m.type()==='error'&&errors.push(m.text()));
    await page.goto('http://127.0.0.1:4180/?v=43',{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>{localStorage.clear();localStorage.setItem('manga-us-v2-done',JSON.stringify(Array.from({length:28},(_,i)=>i)))});
    await page.reload({waitUntil:'domcontentloaded'});
    const labs=[];
    for (const [index,row] of Object.entries(answers)) {
      const i=+index;
      await page.evaluate(i=>document.querySelector(`[data-v2="${i}"]`).click(),i);
      await page.evaluate(()=>document.querySelector('[data-phase="3"]').click());
      const emptyRejected=await page.evaluate(()=>!v3Validate(V2_TITLES[v2Active][1]));
      await page.evaluate(row=>Object.entries(row).forEach(([id,value])=>{const el=document.getElementById(id);el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}))}),row);
      if(i===26)await page.evaluate(()=>{gateTime.value=new Date(Date.now()-60000).toISOString().slice(0,16);gateTime.dispatchEvent(new Event('input',{bubbles:true}))});
      const accepted=await page.evaluate(()=>v3Validate(V2_TITLES[v2Active][1]));
      await page.locator('.practical-lab [data-run]').click();
      const receipt=await page.evaluate(i=>sim.marketChecks?.[i+1]?.status==='passed',i);
      const beforeRepeat=await page.evaluate(()=>({version:sim.practicalLedger.version,events:sim.practicalLedger.events.length}));
      await page.locator('.practical-lab [data-run]').click();
      const afterRepeat=await page.evaluate(()=>({version:sim.practicalLedger.version,events:sim.practicalLedger.events.length}));
      labs.push({index:i,emptyRejected,accepted,receipt,idempotent:JSON.stringify(beforeRepeat)===JSON.stringify(afterRepeat),feedback:receipt?'':await page.locator('#lessonFeedback').textContent(),fields:await page.locator('.practical-lab input,.practical-lab select').count()});
    }
    await page.evaluate(()=>document.querySelector('[data-v2="27"]').click());
    await page.evaluate(()=>document.querySelector('[data-phase="3"]').click());
    await page.evaluate(()=>{
      const values={corpShares:200,corpAvg:40,corpLimit:50,corpOptionContracts:2,corpOptionStrike:50,corpDeliverable:100,dividendAction:'adjust',mergerAction:'unavailable',tailLongLoss:1800,tailShortLoss:2500,planState:'日线多头但等待确认',planSide:'long',planEntry:100,planStop:99,planShares:100,planCost:.1,planLoss:110,planGapPct:5,planGapLoss:510,planInvalid:'收盘跌破前低退出',planOrder:'常规时段限价分批',planCluster:'科技利率风险簇',planClusterLoss:100,planGap:'财报前减仓一半',planEvent:'避开宏观公布窗口',planReview:'2026-09-16T10:00'};
      Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}))});
    });
    const finalAccepted=await page.evaluate(()=>v3Validate('final'));
    await page.locator('[data-run]').click();
    const finalReceipt=await page.evaluate(()=>sim.marketChecks?.[28]?.status==='passed');
    await page.evaluate(()=>document.querySelector('[data-v2="4"]').click());
    await page.evaluate(()=>document.querySelector('[data-phase="3"]').click());
    const chartText=await page.locator('#chartDataText').textContent();
    const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,reality:Object.keys(MARKET_REALITY).length,chapters:V2_TITLES.length,ledger:{schema:sim.practicalLedger?.schema===2,versioned:sim.practicalLedger?.version===14,partial:sim.practicalLedger?.orders?.['shan-entry']?.fills?.length===2&&sim.practicalLedger?.orders?.['shan-entry']?.remainingQty===300&&sim.practicalLedger?.orders?.['shan-entry']?.status==='CANCELED_DAY_END'&&sim.practicalLedger?.orders?.['shan-entry']?.execution?.totalImplementationShortfall===237,partialPosition:sim.practicalLedger?.positions?.['position-SHAN']?.qty===700,halt:sim.practicalLedger?.orders?.['shan-stop']?.status==='HELD'&&sim.practicalLedger?.marketBySymbol?.SHAN?.state==='PENDING_REOPEN',luld:sim.practicalLedger?.marketBySymbol?.['LULD-DEMO']?.state==='PENDING_REOPEN',settlement:sim.practicalLedger?.orders?.['cash-reuse']?.status==='REJECTED'&&sim.practicalLedger?.account?.receivables?.some(x=>x.id==='unsettled-sale'),short:sim.practicalLedger?.positions?.['position-BORR']?.qty===-150&&sim.practicalLedger?.orders?.['borrow-short']?.ssrDuration==='REMAINDER_OF_TRIGGER_DAY_AND_NEXT_TRADING_DAY',assignment:sim.practicalLedger?.positions?.['assigned-stock']?.qty===-100&&sim.practicalLedger?.positions?.['short-call-115']?.qty===0,corporate:sim.practicalLedger?.positions?.['seed-corp']?.qty===200&&sim.practicalLedger?.positions?.['seed-corp-call']?.qty===2&&sim.practicalLedger?.positions?.['seed-corp-call']?.strike===50&&sim.practicalLedger?.optionDeliverable?.sharesPerContract===100,evidence:sim.practicalLedger?.evidence?.['quote-freshness']?.sourceUrl?.startsWith('https://www.sec.gov/')&&sim.practicalLedger?.evidence?.['quote-freshness']?.inputSnapshot?.gateBear,invariants:teachingLedgerInvariants(sim.practicalLedger).length===0}}));
    results.push({viewport:viewport.name,labs,finalAccepted,finalReceipt,chartHasOHLCV:/开.*高.*低.*收.*量/s.test(chartText),overflow:layout.scroll>layout.width,reality:layout.reality,chapters:layout.chapters,ledger:layout.ledger,errors});
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results,null,2));
  if(results.some(r=>r.errors.length||r.overflow||!r.finalAccepted||!r.finalReceipt||!r.chartHasOHLCV||r.reality!==7||r.chapters!==28||Object.values(r.ledger).some(x=>!x)||r.labs.some(x=>!x.emptyRejected||!x.accepted||!x.receipt||!x.idempotent||x.fields<3)))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});
