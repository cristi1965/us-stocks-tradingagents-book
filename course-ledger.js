function newTeachingLedger() {
  return {
    schema:2, version:0, appliedCommands:[], events:[],
    account:{cash:100000,settledCash:100000,receivables:[],payables:[],accountType:'PAPER_MARGIN'},
    orders:{}, positions:{
      'seed-shan':{id:'seed-shan',symbol:'SHAN',kind:'stock',qty:200,avg:100,source:'TEACHING_SEED'},
      'seed-corp':{id:'seed-corp',symbol:'CORP',kind:'stock',qty:100,avg:80,source:'TEACHING_SEED'},
      'seed-corp-call':{id:'seed-corp-call',symbol:'CORP',kind:'option',qty:1,strike:100,multiplier:100,source:'TEACHING_SEED'},
      'long-call-105':{id:'long-call-105',symbol:'SHAN',kind:'option',qty:1,strike:105,multiplier:100,source:'TEACHING_SEED'},
      'short-call-115':{id:'short-call-115',symbol:'SHAN',kind:'option',qty:-1,strike:115,multiplier:100,source:'TEACHING_SEED'}
    },
    marketBySymbol:{SHAN:{state:'OPEN',session:'REGULAR'}}, locates:{}, borrows:{}, corporateActions:{}, evidence:{}, scenarios:{},
  };
}

function ledgerHash(value) {
  const text=JSON.stringify(value,Object.keys(value).sort());let hash=2166136261;
  for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619)}
  return (hash>>>0).toString(16).padStart(8,'0');
}

function normalizeTeachingLedger(value) {
  if (!value || value.schema !== 2 || !Number.isInteger(value.version)) return newTeachingLedger();
  const base=newTeachingLedger(), copy=JSON.parse(JSON.stringify(value));
  return { ...base, ...copy, account:{...base.account,...(copy.account||{})}, orders:copy.orders||{}, positions:copy.positions||base.positions, marketBySymbol:copy.marketBySymbol||base.marketBySymbol, locates:copy.locates||{}, borrows:copy.borrows||{}, corporateActions:copy.corporateActions||{}, evidence:copy.evidence||{}, scenarios:copy.scenarios||{}, appliedCommands:Array.isArray(copy.appliedCommands)?copy.appliedCommands:[], events:Array.isArray(copy.events)?copy.events:[] };
}

function practicalEvents(index, input, commandId) {
  const meta={commandId,chapter:index+1,ruleAsOf:'2026-09-15',paperOnly:true,inputDigest:ledgerHash(input)};
  const event=(type,entityId,payload={})=>({id:`${commandId}-${type}-${entityId}`,type,entityId,...meta,payload});
  if(index===1)return [event('SCENARIO_RECORDED','position-sizing',{budget:+input.psBudget,qty:+input.psShares,notional:+input.psNotional})];
  if(index===10)return [
    event('ORDER_ACCEPTED','shan-entry',{symbol:'SHAN',side:'BUY',qty:1000,session:'REGULAR',tif:'DAY',arrivalMid:49.8}),
    event('FILL_RECORDED','fill-shan-1',{orderId:'shan-entry',symbol:'SHAN',side:'BUY',qty:300,price:49.9,settlementDate:'NEXT_VERIFIED_BUSINESS_DAY'}),
    event('FILL_RECORDED','fill-shan-2',{orderId:'shan-entry',symbol:'SHAN',side:'BUY',qty:400,price:50,settlementDate:'NEXT_VERIFIED_BUSINESS_DAY'}),
    event('ORDER_EXPIRED','shan-entry',{reason:'DAY_END',remainingQty:300,executedPriceCost:110,opportunityCost:120,fees:7,totalImplementationShortfall:237})
  ];
  if(index===11)return [event('MARKET_STATE_CHANGED','SHAN',{from:'OPEN',to:'HALTED',reason:'NEWS_PENDING'}),event('ORDER_ACCEPTED','shan-stop',{symbol:'SHAN',side:'SELL',qty:200,trigger:95,status:'HELD',parentPosition:'seed-shan'}),event('MARKET_STATE_CHANGED','SHAN',{from:'HALTED',to:'PENDING_REOPEN',reason:'REOPENING_AUCTION_REFERENCE_82'}),event('MARKET_STATE_CHANGED','LULD-DEMO',{from:'OPEN',to:'LIMIT_STATE',reason:'PRICE_BAND'}),event('MARKET_STATE_CHANGED','LULD-DEMO',{from:'LIMIT_STATE',to:'PAUSED',reason:'LIMIT_STATE_PERSISTED'}),event('MARKET_STATE_CHANGED','LULD-DEMO',{from:'PAUSED',to:'PENDING_REOPEN',reason:'REOPEN_PROCESS'})];
  if(index===12)return [event('SCENARIO_RECORDED','risk-cluster',{grossLong:80000,deltaHedge:-20000,shockPct:-8,scenarioPnl:-4800})];
  if(index===14)return [event('MARGIN_SCENARIO_RECORDED','margin-account',{assetMarketValue:70000,loan:50000,accruedInterest:493.15,equity:19506.85,houseRequirement:.30,marginRatio:.2787,status:'MARGIN_DEFICIT'}),event('CASH_LOT_CREATED','unsettled-sale',{amount:10000,tradeDate:'TEACHING_FRIDAY',settlementDate:'NEXT_VERIFIED_BUSINESS_DAY',status:'UNSETTLED'}),event('ORDER_REJECTED','cash-reuse',{symbol:'SHAN',side:'BUY',qty:null,notional:12000,settledCash:5000,reason:'GOOD_FAITH_VIOLATION_RISK'})];
  if(index===15)return [event('LOCATE_GRANTED','locate-borr',{symbol:'BORR',requestedQty:200,locatedQty:150,expiresAt:'END_OF_TEACHING_SESSION'}),event('ORDER_ACCEPTED','borrow-short',{symbol:'BORR',side:'SELL_SHORT',qty:150,status:'ACCEPTED',ssr:true,ssrTriggerPct:-10,ssrDuration:'REMAINDER_OF_TRIGGER_DAY_AND_NEXT_TRADING_DAY',priceTest:'REQUIRED'}),event('FILL_RECORDED','fill-borr-short',{orderId:'borrow-short',symbol:'BORR',side:'SELL_SHORT',qty:150,price:45,settlementDate:'NEXT_VERIFIED_BUSINESS_DAY'}),event('BORROW_STATUS_CHANGED','borrow-borr',{symbol:'BORR',from:'AVAILABLE',to:'REVIEW',estimated30DayCost:44.38})];
  if(index===16)return [event('EVIDENCE_RECORDED','cpi-vintage',{releaseId:'CPI-TEACHING-SAMPLE',referencePeriod:'teaching-period',seasonalAdjustment:'same-basis',consensus:3,firstRelease:3.2,revised:3.1,vintageAtDecision:'FIRST_RELEASE'})];
  if(index===19)return [event('SCENARIO_RECORDED','earnings-gap',{officialClose:100,session:'AFTER_HOURS',tailGapPct:-20,costPerShare:.5,riskBudget:1000,qty:48,stressLoss:984})];
  if(index===20)return [event('ORDER_CANDIDATE_RECORDED','call-entry',{plannedQty:20,status:'CANDIDATE_ONLY',bid:2.95,ask:3.1,bidSize:180,askSize:220,dayVolume:4200,openInterest:12400,fillGuaranteed:false})];
  if(index===22)return [event('SCENARIO_RECORDED','greeks-local',{position:'LONG_CALL',delta:.5,gamma:.04,vegaPerPoint:.12,thetaPerDay:-.08,dS:3,dIvPoints:-10,days:1,estimatedContractPnl:40,approximation:'LOCAL'})];
  if(index===23)return [event('SCENARIO_RECORDED','iv-crush',{smallMoveContractPnl:-20,largeMoveTeachingApproximation:400,approximation:'SECOND_ORDER_TEACHING_ONLY',conclusion:'CONDITIONAL'})];
  if(index===24)return [event('OPTION_ASSIGNED','short-call-115',{symbol:'SHAN',contractId:'short-call-115',stockQty:-100,strike:115,multiplier:100,cashReceivable:11500,longLegId:'long-call-105',longLegAction:'UNRESOLVED'})];
  if(index===26)return [event('EVIDENCE_RECORDED','quote-freshness',{evidenceType:'QUOTE',ageSeconds:+input.evidenceAge,ttlSeconds:+input.evidenceTtl,status:'FRESH',sourceUrl:input.gateSource,sourceAsOf:input.gateTime,bearCase:input.gateBear,invalidation:input.gateInvalid,maxLoss:+input.gateLoss,inputSnapshot:input,modelConfig:'RULE_GATE_V2',asOf:new Date().toISOString()})];
  if(index===27)return [event('CORPORATE_ACTION_APPLIED','split-corp-2-for-1',{symbol:'CORP',actionId:'TEACHING-SPLIT-2-1',effectiveDate:'TEACHING_DATE',ratio:2,positionId:'seed-corp',optionPositionId:'seed-corp-call',openOrderId:'corp-limit',oldOrderQty:100,oldOrderPrice:100,optionRatio:2,optionStrikeRatio:.5,newOptionDeliverable:100,source:'OFFICIAL_TEACHING_SCENARIO'}),event('CORPORATE_ACTION_BLOCKED','merger-unknown',{symbol:'CORP',reason:'MISSING_OFFICIAL_TERMS_OR_OCC_MEMO'})];
  return [event('SCENARIO_RECORDED',`chapter-${index+1}`,input)];
}

function reduceTeachingEvent(state,event) {
  const p=event.payload;
  if(event.type==='ORDER_ACCEPTED'||event.type==='ORDER_CANDIDATE_RECORDED'||event.type==='ORDER_REJECTED')state.orders[event.entityId]={id:event.entityId,version:1,fills:[],filledQty:0,remainingQty:p.qty??0,status:event.type==='ORDER_REJECTED'?'REJECTED':p.status||'ACCEPTED',...p};
  if(event.type==='FILL_RECORDED'){
    const order=state.orders[p.orderId];if(!order)throw new Error(`找不到这笔成交对应的订单：${p.orderId}`);
    if(order.fills.some(fill=>fill.id===event.entityId))return;
    if(order.status==='REJECTED'||order.status==='CANCELED_DAY_END')throw new Error(`订单已经关闭，不能再记录成交：${order.id}`);
    if((p.side||order.side)==='SELL_SHORT'){
      const locate=Object.values(state.locates).find(row=>row.symbol===p.symbol&&row.status==='ACTIVE'&&row.locatedQty>=p.qty);
      if(!locate)throw new Error(`${p.symbol} 的卖空数量超过当前已确认可借的股数`);
    }
    order.fills.push({id:event.entityId,qty:p.qty,price:p.price,settlementDate:p.settlementDate});order.filledQty+=p.qty;order.remainingQty=order.qty-order.filledQty;order.status=order.remainingQty?'PARTIAL':'FILLED';order.version++;
    const executionSide=p.side||order.side,sign=executionSide==='SELL_SHORT'||executionSide==='SELL'?-1:1,id=`position-${p.symbol}`;const old=state.positions[id]||{id,symbol:p.symbol,kind:'stock',qty:0,avg:0,source:'FILLS'};const nextQty=old.qty+sign*p.qty;old.avg=nextQty?((old.avg*Math.abs(old.qty)+p.price*p.qty)/Math.abs(nextQty)):0;old.qty=nextQty;state.positions[id]=old;
    const amount=p.qty*p.price;if(executionSide==='BUY'){state.account.cash-=amount;state.account.settledCash-=amount;state.account.payables.push({fillId:event.entityId,amount,settlementDate:p.settlementDate,status:'PENDING_SETTLEMENT'})}else state.account.receivables.push({fillId:event.entityId,amount,settlementDate:p.settlementDate,status:'PENDING_SETTLEMENT'});
  }
  if(event.type==='ORDER_EXPIRED'){const order=state.orders[event.entityId];if(!order)throw new Error('找不到需要设为到期失效的订单');if(order.remainingQty!==p.remainingQty)throw new Error('订单剩余股数与到期记录不一致');order.status='CANCELED_DAY_END';order.version++;order.execution={executedPriceCost:p.executedPriceCost,opportunityCost:p.opportunityCost,fees:p.fees,totalImplementationShortfall:p.totalImplementationShortfall}}
  if(event.type==='MARKET_STATE_CHANGED'){const old=state.marketBySymbol[event.entityId]||{state:p.from};if(old.state!==p.from)throw new Error(`市场状态不能从 ${old.state} 直接变为 ${p.to}`);state.marketBySymbol[event.entityId]={...old,state:p.to,reason:p.reason,version:(old.version||0)+1}}
  if(event.type==='LOCATE_GRANTED')state.locates[event.entityId]={id:event.entityId,...p,status:'ACTIVE'};
  if(event.type==='BORROW_STATUS_CHANGED')state.borrows[event.entityId]={id:event.entityId,...p,status:p.to};
  if(event.type==='OPTION_ASSIGNED'){
    const short=state.positions[p.contractId],long=state.positions[p.longLegId];if(!short||short.qty>=0)throw new Error('只有账户里已卖出的期权，才能记录被要求交割');if(!long)throw new Error('找不到配套买入的期权');short.qty+=1;short.assignmentState='ASSIGNED';
    const id='assigned-stock',old=state.positions[id]||{id,symbol:p.symbol,kind:'stock',qty:0,avg:p.strike,source:'ASSIGNMENT'};old.qty+=p.stockQty;state.positions[id]=old;state.account.receivables.push({eventId:event.id,amount:p.cashReceivable,settlementDate:'NEXT_VERIFIED_BUSINESS_DAY'});long.assignmentState=p.longLegAction;
  }
  if(event.type==='CORPORATE_ACTION_APPLIED'){
    if(state.corporateActions[p.actionId])return;const position=state.positions[p.positionId],option=state.positions[p.optionPositionId];if(!position||!option)throw new Error('找不到需要进行拆股等调整的持仓');position.qty*=p.ratio;position.avg/=p.ratio;option.qty*=p.optionRatio;option.strike*=p.optionStrikeRatio;state.orders[p.openOrderId]={id:p.openOrderId,symbol:p.symbol,side:'SELL',qty:p.oldOrderQty*p.ratio,price:p.oldOrderPrice/p.ratio,status:'OPEN_ADJUSTED',version:1};state.corporateActions[p.actionId]={...p,status:'APPLIED'};state.optionDeliverable={symbol:p.symbol,contracts:option.qty,strike:option.strike,sharesPerContract:p.newOptionDeliverable,status:'CONFIRMED_BY_SCENARIO_SOURCE'};
  }
  if(event.type==='CORPORATE_ACTION_BLOCKED')state.corporateActions[event.entityId]={...p,status:'BLOCKED'};
  if(event.type==='CASH_LOT_CREATED')state.account.receivables.push({id:event.entityId,...p});
  if(event.type==='MARGIN_SCENARIO_RECORDED'||event.type==='SCENARIO_RECORDED')state.scenarios[event.entityId]=p;
  if(event.type==='EVIDENCE_RECORDED'){if(p.evidenceType==='QUOTE'&&p.ageSeconds>p.ttlSeconds)throw new Error('报价已超过设置的有效时限，请更新报价');if(p.evidenceType==='NEWS'&&p.ageSeconds>3600)throw new Error('新闻已超过有效时限，请更新来源');state.evidence[event.entityId]={...p,status:'FRESH'};}
}

function teachingLedgerInvariants(state) {
  const errors=[];
  Object.values(state.orders).forEach(order=>{if(order.fills&&Number.isFinite(order.qty)){const filled=order.fills.reduce((n,f)=>n+f.qty,0);if(filled>order.qty)errors.push(`${order.id}: 成交股数超过订单股数`);if(filled!==order.filledQty||order.remainingQty!==order.qty-filled)errors.push(`${order.id}: 已成交和剩余股数对不上`)}});
  Object.values(state.positions).forEach(position=>{const priced=position.kind==='option'?Number.isFinite(position.strike)&&Number.isFinite(position.multiplier):Number.isFinite(position.avg);if(!Number.isFinite(position.qty)||!priced)errors.push(`${position.id}: 持仓数量或价格不是有效数字`)});
  if(!Number.isFinite(state.account.cash)||!Number.isFinite(state.account.settledCash)||state.account.settledCash>state.account.cash)errors.push('现金账目对不上：请检查金额，以及已结算现金是否超过总现金');
  return errors;
}

function applyTeachingCommand(current,index,input) {
  const state=normalizeTeachingLedger(current),commandId=`chapter-${index+1}`;
  if(state.appliedCommands.includes(commandId))return {ok:true,idempotent:true,state,events:[]};
  const events=practicalEvents(index,input,commandId),next=JSON.parse(JSON.stringify(state));
  try{events.forEach(event=>reduceTeachingEvent(next,event));const errors=teachingLedgerInvariants(next);if(errors.length)return {ok:false,errors,state};next.version++;next.appliedCommands.push(commandId);next.events.push(...events);return {ok:true,idempotent:false,state:next,events};}
  catch(error){return {ok:false,errors:[error.message],state};}
}

function migrateTeachingLedger(current, checks) {
  let state=normalizeTeachingLedger(current),changed=!current||current.schema!==2;
  Object.keys(checks||{}).map(Number).sort((a,b)=>a-b).forEach(chapter=>{
    const row=checks[chapter];if(row?.status!=='passed')return;
    const applied=applyTeachingCommand(state,chapter-1,row.inputs||{});
    if(applied.ok&&!applied.idempotent){state=applied.state;changed=true}
  });
  return {state,changed};
}
