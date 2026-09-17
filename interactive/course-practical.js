const practicalControlFallback = v2Control;
const practicalValidateFallback = v3Validate;
const practicalExplainFallback = explainInvalid;

const PRACTICAL_TITLES = {
  1: '完整仓位反推与结算', 10: '部分成交与订单状态', 11: '停牌重开后的真实损失',
  12: '风险簇净压力', 14: '杠杆与维持保证金', 15: '卖空 locate 与 SSR',
  16: 'CPI 首次值与修订值', 19: '财报尾部反推仓位', 20: '期权链流动性筛选',
  22: 'Greeks 联合损益', 23: 'IV Crush 双情景', 24: '价差与指派终态',
  26: '按证据类型检查时效'
};
Object.entries(PRACTICAL_TITLES).forEach(([index, title]) => { V2_TITLES[+index][0] = title; });

function practicalLab(intro, fields, button = '核对并写入 Paper 证据') {
  return `<div class="practical-lab"><div class="lab-brief"><b>市场现实关卡</b><p>${intro}</p></div><div class="lab-grid">${fields}</div><output class="lab-preview" data-practical-preview>修改数字后，这里会显示计算过程。</output><button data-run>${button}</button></div>`;
}
const field = (label, id, value, extra = '') => `<label>${label}<input id="${id}" value="${value}" ${extra}></label>`;
const select = (label, id, options) => `<label>${label}<select id="${id}"><option value="">请选择</option>${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>`;

v2Control = function(type, index) {
  if (index === 1) return practicalLab('账户 $100,000，风险 0.8%，入场 $100，止损 $96，每股摩擦 $0.20。先算预算，再向下取整股数。',
    field('风险预算（美元）','psBudget','', 'type="number"') + field('最大股数','psShares','', 'type="number"') + field('名义仓位（美元）','psNotional','', 'type="number"'));
  if (index === 10) return practicalLab('常规时段用 DAY 限价买 1,000 股；300 股成交 $49.90，400 股成交 $50.00，剩余未成交。决策时中间价 $49.80。',
    select('交易时段','fillSession',[['regular','常规时段 9:30-16:00 ET'],['extended','延长时段']]) + select('TIF','fillTif',[['day','DAY'],['ioc','IOC']]) + field('已成交股数','fillQty','', 'type="number"') + field('成交均价','fillAvg','', 'type="number" step="0.001"') + field('未成交股数','fillOpen','', 'type="number"') + field('已成交价差（美元）','fillShortfall','', 'type="number" step="0.01"') + field('未成交机会成本（收盘 $50.20）','fillOpportunity','', 'type="number"') + field('费用（美元）','fillFees','', 'type="number"') + field('完整 implementation shortfall','fillTotal','', 'type="number"') + select('DAY 单收盘终态','fillEndState',[['cancelled','剩余 300 股失效/撤销'],['forever','永久保持 PARTIAL']]));
  if (index === 11) return practicalLab('200 股在 $100 买入，止损触发价 $95；新闻停牌后以 $82 重开。再区分 LULD、全市场熔断和新闻停牌。',
    field('计划损失（美元）','haltPlanLoss','', 'type="number"') + field('实际损失（美元）','haltActualLoss','', 'type="number"') + field('额外缺口损失（美元）','haltExtraLoss','', 'type="number"') + select('新闻停牌订单状态','haltState',[['pending','等待重开拍卖'],['filled95','已按 95 成交']]) + select('LULD 完整链路','luldAction',[['chain','15 秒限价状态未解除 → 至少 5 分钟暂停 → 重开'],['account','等同账户自设熔断']]) + select('MWCB 阈值与层级','mwcbThresholds',[['full','Level 1/2/3 = 7%/13%/20%'],['wrong','5%/10%/15%']]) + select('MWCB Level 1/2（3:25 ET 前）','mwcb1Action',[['pause','市场暂停 15 分钟'],['close','当天永久关闭']]) + select('MWCB Level 1/2（3:25 ET 后）','mwcbLateAction',[['continue','不因 Level 1/2 暂停'],['pause','仍暂停 15 分钟']]) + select('MWCB Level 3','mwcb3Action',[['close','当天停止交易'],['pause','只暂停 15 分钟']]));
  if (index === 12) return practicalLab('科技股 +$50,000、QQQ +$30,000、Put 的 Delta 对冲 -$20,000。科技簇压力情景为 -8%。负暴露能减轻损失。',
    field('科技股情景损益','clusterStock','', 'type="number"') + field('QQQ 情景损益','clusterEtf','', 'type="number"') + field('Put 情景损益','clusterHedge','', 'type="number"') + field('组合压力损失','clusterNetLoss','', 'type="number"'));
  if (index === 14) return (practicalLab('保证金账户：自有 $50,000、借款 $50,000，标的跌 30%，house requirement 30%，借款年息 12% 持有 30 天。现金账户另有 $5,000 settled cash 与 $10,000 尚未结算卖出款。',
    field('下跌后资产市值','marginAssets','', 'type="number"') + field('30 天借款利息','marginInterest','', 'type="number" step="0.01"') + field('扣利息后账户权益','marginEquity','', 'type="number" step="0.01"') + field('保证金率（%）','marginRatio','', 'type="number" step="0.01"') + select('三层保证金规则','marginLayers',[['layers','Reg T 通常 50% 初始 / FINRA 通常 25% 多头维持 / 券商 house 可更高'],['same','三者都是 30%']]) + select('保证金处理','marginStatus',[['call','低于 30% house requirement，可能补资或强平'],['safe','没有任何风险']]) + field('现金账户当前可用 settled cash','settledAvailable','', 'type="number"') + select('用 $12,000 买入后当日卖出','settlementDecision',[['reject','拒绝：其中 $7,000 依赖未结算卖出款'],['allow','允许且没有结算风险']]) + select('结算日历状态','settlementCalendar',[['verified','已核对下一个营业日'],['missing','没日历也直接假定明天']])));
  if (index === 15) return (practicalLab('申请卖空 200 股，locate 只确认 150 股；股价 $45，年化借券费假设 8%，持有 30 天。标的相较前收跌 10% 后触发 SSR，当天剩余时间及下一交易日适用价格测试。',
    field('最多允许模拟股数','shortQty','', 'type="number"') + field('30 天借券费（美元）','shortBorrowCost','', 'type="number" step="0.01"') + select('下单处理','shortStatus',[['restricted','缩到可借数量，并遵守 SSR 价格测试'],['sell200','直接卖空 200 股']]) + select('SSR 执行价要求','ssrExecution',[['aboveBid','不得在当前 NBBO 买价或更低价执行/展示；short-exempt 例外需单独标记'],['atBid','可在当前买价直接砸盘']]) + select('若 locate 完全缺失','noLocateDecision',[['reject','拒绝建立空仓'],['guess','沿用昨天可借状态']]) + select('持仓期可借状态撤回','borrowRecallDecision',[['review','停止新增并核对券商回补要求'],['ignore','忽略并继续加空']])));
  if (index === 16) return practicalLab('同口径 CPI 共识 3.0%；首次公布 3.2%，后来修订为 3.1%。回放事件日只能使用当时可见的首次值。',
    field('事件日 surprise（百分点）','cpiFirst','', 'type="number" step="0.1"') + field('修订后 surprise（百分点）','cpiRevised','', 'type="number" step="0.1"') + select('回测事件日使用哪个值','cpiVintage',[['first','首次公布 3.2%'],['revised','修订后 3.1%']]));
  if (index === 19) return practicalLab('账户允许财报尾部损失 $1,000；标的 $100，压力缺口 20%，另留每股 $0.50 摩擦。',
    field('每股压力风险','earnRiskPerShare','', 'type="number" step="0.01"') + field('最大股数','earnShares','', 'type="number"') + field('名义仓位','earnNotional','', 'type="number"') + field('压力损失','earnLoss','', 'type="number" step="0.01"'));
  if (index === 20) return (practicalLab('同一策略期限下比较两张 Call。A: Bid 2.95×180 / Ask 3.10×220 / 当日量 4,200 / OI 12,400；B: Bid 1.20×3 / Ask 2.10×5 / 当日量 12 / OI 18。计划买 20 张。',
    field('A 中间价','chainMidA','', 'type="number" step="0.001"') + field('A 点差率（%）','chainSpreadA','', 'type="number" step="0.01"') + field('B 点差率（%）','chainSpreadB','', 'type="number" step="0.01"') + field('计划订单张数','chainOrderQty','', 'type="number"') + select('更可执行的候选','chainPick',[['a','A：点差、报价尺寸、成交量与 OI 均较好'],['b','B：报价更便宜所以一定更好']]) + select('能否保证 20 张全按 Ask 成交','chainGuarantee',[['no','不能；盘口是快照，不是成交保证'],['yes','能，Ask size 已经保证']])));
  if (index === 22) return (practicalLab('多头 Call 1 张：Delta .50、Gamma .04、Vega .12/IV 点、Theta -$0.08/天。标的 +$3，IV -10 点，过 1 天。',
    select('仓位与合约方向','greekSide',[['longCall','多头 Call'],['shortCall','空头 Call'],['longPut','多头 Put']]) + field('Delta 贡献（每股）','greekDelta','', 'type="number" step="0.01"') + field('Gamma 贡献（每股）','greekGamma','', 'type="number" step="0.01"') + field('合计变化（每股）','greekUnit','', 'type="number" step="0.01"') + field('整张合约变化（美元）','greekContract','', 'type="number" step="0.01"') + select('近似边界','greekBoundary',[['local','局部近似；大幅变动需重算或用定价模型'],['exact','任何幅度都精确']])));
  if (index === 23) return practicalLab('沿用上一章 Greeks 做二阶教学近似。情景 A 标的只涨 $2；情景 B 标的大涨 $8。两者都是 IV -10 点、过 1 天；大幅变动时实战必须重算 Greeks 或用定价模型。',
    field('情景 A 二阶近似损益','crushSmall','', 'type="number" step="0.01"') + field('情景 B 二阶教学近似','crushLarge','', 'type="number" step="0.01"') + select('你能推出什么','crushConclusion',[['conditional','方向正确可能亏，也可能赚，取决于各项贡献'],['alwaysLose','IV Crush 后 Call 一定亏'],['alwaysWin','股价涨 Call 一定赚']]));
  if (index === 24) return practicalLab('买 105 Call、卖 115 Call，净借记 $3，乘数 100。到期前短 Call 被指派，长 Call 尚未处理。',
    field('最大亏损（美元）','spreadLoss','', 'type="number"') + field('最大盈利（美元）','spreadProfit','', 'type="number"') + field('盈亏平衡价','spreadBreakeven','', 'type="number" step="0.01"') + field('指派后股票数量','assignedShares','', 'type="number"') + field('指派现金变化','assignedCash','', 'type="number"') + select('下一步','assignmentAction',[['verify','核对券商截止时间、购买力并处理长腿'],['ignore','价差定义风险，所以无需处理']]));
  if (index === 26) {
    const gate = practicalControlFallback(type, index).replace(/<button data-run>.*?<\/button>/, '');
    return `${gate}${practicalLab('行情、新闻和财报文件不能共用“24 小时”。本题另检查 15 秒前的报价，课程阈值为 30 秒。',
      select('证据类型','evidenceType',[['quote','实时行情'],['news','新闻'],['filing','财报文件']]) + field('采集后经过（秒）','evidenceAge','15', 'type="number"') + field('行情阈值（秒）','evidenceTtl','30', 'type="number"') + select('风险门','evidenceDecision',[['accept','时效合格，可继续 Paper'],['reject','统一按 24 小时拒绝']]))}`;
  }
  if (index === 27) {
    const original = practicalControlFallback(type, index);
    return `<div class="corporate-check"><div class="lab-brief"><b>总验收附加关：公司行动与非对称尾部</b><p>2:1 普通整数拆股前 100 股、均价 $80、卖出限价 $100；标准 Call 1 张、执行价 $100、交割 100 股。本题的标准调整为合约数翻倍、执行价减半、每张仍交割 100 股；非标准行动必须查 OCC memo。</p></div><div class="lab-grid">${field('调整后股数','corpShares','', 'type="number"')}${field('调整后均价','corpAvg','', 'type="number"')}${field('调整后限价','corpLimit','', 'type="number"')}${field('调整后期权合约数','corpOptionContracts','', 'type="number"')}${field('调整后执行价','corpOptionStrike','', 'type="number"')}${field('每张交割股数','corpDeliverable','', 'type="number"')}${select('现金分红后的历史价格','dividendAction',[['adjust','保留原始价，并另存复权序列'],['gap','一律当成暴跌信号']])}${select('并购后交割物不清楚','mergerAction',[['unavailable','缺官方条款/OCC memo，风险门拒绝'],['assume','仍假设固定 100 股']])}${field('做多 100 股下跳 18% 损失','tailLongLoss','', 'type="number"')}${field('做空 100 股上跳 25% 损失','tailShortLoss','', 'type="number"')}</div></div>${original}`;
  }
  return practicalControlFallback(type, index);
};

const closeEnough = (id, expected, tolerance = .011) => {
  const el = document.querySelector('#' + id);
  return el && el.value !== '' && Math.abs(+el.value - expected) <= tolerance;
};
let practicalLastResult = null;
function practicalResult(index) {
  const tests = {
    1: [['psBudget',800],['psShares',190],['psNotional',19000]],
    10: [['fillSession','regular','select'],['fillTif','day','select'],['fillQty',700],['fillAvg',49.957,0.002],['fillOpen',300],['fillShortfall',110],['fillOpportunity',120],['fillFees',7],['fillTotal',237],['fillEndState','cancelled','select']],
    11: [['haltPlanLoss',1000],['haltActualLoss',3600],['haltExtraLoss',2600],['haltState','pending','select'],['luldAction','chain','select'],['mwcbThresholds','full','select'],['mwcb1Action','pause','select'],['mwcbLateAction','continue','select'],['mwcb3Action','close','select']],
    12: [['clusterStock',-4000],['clusterEtf',-2400],['clusterHedge',1600],['clusterNetLoss',4800]],
    14: [['marginAssets',70000],['marginInterest',493.15,.02],['marginEquity',19506.85,.02],['marginRatio',27.87,.02],['marginLayers','layers','select'],['marginStatus','call','select'],['settledAvailable',5000],['settlementDecision','reject','select'],['settlementCalendar','verified','select']],
    15: [['shortQty',150],['shortBorrowCost',44.38,.02],['shortStatus','restricted','select'],['ssrExecution','aboveBid','select'],['noLocateDecision','reject','select'],['borrowRecallDecision','review','select']],
    16: [['cpiFirst',.2],['cpiRevised',.1],['cpiVintage','first','select']],
    19: [['earnRiskPerShare',20.5],['earnShares',48],['earnNotional',4800],['earnLoss',984]],
    20: [['chainMidA',3.025,.002],['chainSpreadA',4.96,.02],['chainSpreadB',54.55,.02],['chainOrderQty',20],['chainPick','a','select'],['chainGuarantee','no','select']],
    22: [['greekSide','longCall','select'],['greekDelta',1.5],['greekGamma',.18],['greekUnit',.4],['greekContract',40],['greekBoundary','local','select']],
    23: [['crushSmall',-20],['crushLarge',400],['crushConclusion','conditional','select']],
    24: [['spreadLoss',300],['spreadProfit',700],['spreadBreakeven',108],['assignedShares',-100],['assignedCash',11500],['assignmentAction','verify','select']],
    26: [['evidenceType','quote','select'],['evidenceAge',15],['evidenceTtl',30],['evidenceDecision','accept','select']]
  };
  if (index === 27) {
    const base = practicalValidateFallback(V2_TITLES[index][1]);
    const corp = [['corpShares',200],['corpAvg',40],['corpLimit',50],['corpOptionContracts',2],['corpOptionStrike',50],['corpDeliverable',100],['dividendAction','adjust','select'],['mergerAction','unavailable','select'],['tailLongLoss',1800],['tailShortLoss',2500]];
    const wrong = corp.filter(([id,val,tol]) => tol === 'select' ? document.querySelector('#'+id)?.value !== val : !closeEnough(id,val,tol)).map(([id]) => id);
    return {ok:base && !wrong.length, wrong, message:base ? '拆股必须同时调整股数、均价、未成交订单和期权交割物。' : '先完成总交易计划，再核对公司行动。'};
  }
  if (!tests[index]) return null;
  const wrong = tests[index].filter(([id,val,tol]) => tol === 'select' ? document.querySelector('#'+id)?.value !== val : !closeEnough(id,val,tol)).map(([id]) => id);
  const base = index === 26 ? practicalValidateFallback(V2_TITLES[index][1]) : true;
  return {ok:base&&!wrong.length, wrong, message:'有字段不符合该场景的计算或市场状态。'};
}

v3Validate = function(type) {
  practicalLastResult = practicalResult(v2Active);
  return practicalLastResult ? practicalLastResult.ok : practicalValidateFallback(type);
};

explainInvalid = function() {
  if (!PRACTICAL_TITLES[v2Active] && v2Active !== 27) return practicalExplainFallback();
  lessonStage.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  practicalLastResult = practicalResult(v2Active);
  if (!practicalLastResult) return practicalExplainFallback();
  practicalLastResult.wrong.forEach(id => document.querySelector('#'+id)?.setAttribute('aria-invalid','true'));
  const wrongRules = practicalLastResult.wrong.filter(id => document.querySelector('#'+id)?.tagName === 'SELECT');
  const wrongMath = practicalLastResult.wrong.filter(id => !wrongRules.includes(id));
  const reasons = [wrongMath.length ? `算式或单位错误：${wrongMath.length} 项` : '', wrongRules.length ? `市场规则或状态错误：${wrongRules.length} 项` : ''].filter(Boolean).join('；');
  lessonFeedback.textContent = `未通过：${reasons}。红框处请修改；正确答案不会自动填入。`;
};

const PRACTICAL_PREVIEWS = {
  1:'预算 = 100,000 × 0.8%；股数 = floor(预算 ÷ (|100-96|+0.20))；最后检查名义仓位。',
  10:'均价 = 成交金额 ÷ 已成交数量。完整 implementation shortfall = 已成交价差 $110 + 未成交 300 股的机会成本 $120 + 费用 $7 = $237；DAY 单剩余数量收盘失效。',
  11:'计划损失按触发价算；实际损失按重开可成交价算；两者差额就是缺口多付的代价。',
  12:'三项情景损益相加；对冲为正贡献，压力损失取净损益的相反数。',
  14:'利息=50,000×12%×30/365；权益=70,000-50,000-利息；保证金率=权益÷资产。现金账户只把 settled cash 当可重复使用资金。',
  15:'可下数量不超过 locate 数量；借券费 = 市值 × 年化费率 × 30/365。',
  16:'surprise = 公布值 - 同口径共识；事件回放必须冻结当时可见版本。',
  19:'每股压力风险 = 100×20%+0.50；股数向下取整，再复算总损失。',
  20:'中间价=(Bid+Ask)/2；点差率=(Ask-Bid)/中间价。还要比较订单数量、报价尺寸和成交量；盘口快照不保证成交。',
  22:'先确认多空与 Call/Put 的符号；每股变化≈Δ×dS + 0.5×Γ×dS² + Vega×dIV点数 + Theta×天数。它只是局部近似。',
  23:'分别代入 dS=2 与 dS=8。这是二阶教学近似，只用来理解方向；大波动会让 Greeks 变化，不能把 +$400 当成精确报价。',
  24:'宽度=10；最大亏损=借记×100；最大盈利=(宽度-借记)×100；短 Call 指派产生 -100 股。',
  26:'报价阈值按秒；新闻按分钟；财报文件按报告期与版本。阈值是课程演练规则，不代表所有券商。'
};

const MARKET_REALITY = {
  10:['延长时段与订单生命周期','盘前盘后不沿用常规时段的全部报价保护，券商可限制订单类型；Day/GTC/IOC 等 TIF 会改变未成交部分如何处理。','FINRA Extended-Hours Trading / Trading Terms','https://www.finra.org/investors/insights/extended-hours-trading'],
  11:['停牌、LULD 与重开','止损触发不等于成交。个股价格带、新闻停牌、全市场熔断和账户自设熔断是四套不同机制；重开可能进入拍卖。','NYSE Trading Information / Auctions','https://www.nyse.com/trade/auctions'],
  14:['T+1、已结算资金与保证金版本','多数美股现为 T+1；现金账户要区分 settled cash。盘中保证金规则及券商过渡状态具有时效性，必须记录规则版本和 house requirement。','FINRA Frequent Intraday Trading','https://www.finra.org/investors/insights/frequent-intraday-trading'],
  15:['卖空不是点一下 SELL','建立空仓前通常需要 locate。较前收跌 10% 触发 SSR 后，价格测试适用于当天剩余时间及下一交易日。可借状态、成本与券商限制都依赖时点。','SEC Regulation SHO','https://www.sec.gov/investor/pubs/regsho.htm'],
  19:['official close、盘后价与重开价','16:00 ET official close、盘后最后成交和次日开盘不是同一个价格。财报仓位要按不可连续成交的尾部缺口反推。','FINRA Extended-Hours Trading','https://www.finra.org/investors/insights/extended-hours-trading'],
  24:['定义风险仍有到期操作风险','美股/ETF 期权通常可提前行权；短腿可能提前指派。到期自动行权、反向指令、盘后波动和券商截止时间会改变次日股票与现金状态。','OIC Option Life Cycle','https://www.optionseducation.org/news/understanding-the-life-cycle-of-an-option-trade'],
  27:['公司行动必须穿透整本账','拆股、分红、并购会同时影响原始/复权价格、持仓、未成交订单和期权交割物；期权调整以 OCC memo 为准。','FINRA Corporate Actions','https://www.finra.org/investors/insights/corporate-actions-public-companies-what-you-should-know']
};

function refreshPracticalPreview() {
  const out = lessonStage.querySelector('[data-practical-preview]');
  if (out) out.textContent = PRACTICAL_PREVIEWS[v2Active] || out.textContent;
}
function storePracticalState(index) {
  if (!Number.isFinite(sim.account.settledCash)) sim.account.settledCash = sim.account.cash;
  sim.account.accountType = sim.account.accountType || 'paper-margin';
  sim.account.marginRegimeAsOf = '2026-09-15';
  sim.marketChecks = sim.marketChecks || {};
  const inputs = {};
  lessonStage.querySelectorAll('.decision-surface input,.decision-surface select,.decision-surface textarea').forEach(el => { if (el.id) inputs[el.id] = el.value; });
  const outcomes = {
    1:'风险预算 $800，190 股，名义仓位 $19,000。',
    10:'常规时段 DAY 限价单成交 700 股，剩余 300 股收盘失效；完整 implementation shortfall 为 $237。',
    11:'新闻停牌单进入 PENDING_REOPEN；LULD、MWCB Level 1/3 已按不同状态处理。计划损失 $1,000，重开情景损失 $3,600。',
    12:'科技风险簇净压力损失 $4,800，含 Put 对冲 +$1,600。',
    14:'扣除 30 天利息后权益 $19,506.85、保证金率 27.87%，低于 30% house requirement；现金账户只有 $5,000 settled cash 可用。',
    15:'locate 只覆盖 150 股；SSR 状态下按价格测试处理。无 locate 拒绝，可借状态撤回时进入 REVIEW。',
    16:'事件日固定首次值 surprise +0.2，修订后为 +0.1。',
    19:'尾部每股风险 $20.50，最多 48 股，压力损失 $984。',
    20:'计划 20 张；候选 A 中间价 $3.025、点差率 4.96%，报价尺寸与成交量更匹配，但不保证全按 Ask 成交。',
    22:'多头 Call 的 Greeks 联合近似 +$0.40/股，标准合约约 +$40；大幅变动需重算。',
    23:'同样 IV Crush，小涨的二阶近似 -$20，大涨的教学近似 +$400；后者不是精确定价。',
    24:'价差最大亏损 $300、最大盈利 $700、平衡价 $108；短腿指派后暂为 -100 股。',
    26:'报价年龄 15 秒，低于本课 30 秒阈值；仅允许继续 Paper。',
    27:'2:1 拆股后 200 股、均价 $40、限价 $50；标准期权变为 2 张、执行价 $50、每张仍交割 100 股。缺并购条款或 OCC memo 时拒绝。'
  };
  const source = MARKET_REALITY[index];
  const migrated = migrateTeachingLedger(sim.practicalLedger, sim.marketChecks);
  sim.practicalLedger = migrated.state;
  if (migrated.changed) saveSim();
  const previous = sim.marketChecks[index+1];
  if (previous?.status === 'passed') return {ok:true,outcome:previous.outcome,idempotent:true};
  const applied = applyTeachingCommand(sim.practicalLedger, index, inputs);
  if (!applied.ok) return {ok:false,error:`账本拒绝写入：${applied.errors.join('；')}`};
  sim.practicalLedger = applied.state;
  sim.marketChecks[index+1] = {status:'passed',asOf:new Date().toISOString(),ruleAsOf:'2026-09-15',scope:source?source[2]:'course scenario',sourceUrl:source?source[3]:null,paperOnly:true,inputs,outcome:outcomes[index]};
  saveSim();
  return {ok:true,outcome:outcomes[index],idempotent:applied.idempotent};
}

const practicalJournalBase = v2Journal;
v2Journal = function() {
  practicalJournalBase();
  const passed = Object.values(sim.marketChecks || {}).filter(row => row.status === 'passed').length;
  const badge = document.createElement('div');
  badge.className = 'reality-proof';
  badge.innerHTML = `<span>实战计算回执</span><b>${passed}/14</b><small>保存输入、结果与规则版本</small>`;
  tradeJournal.querySelector('#openTools')?.before(badge);
};

const practicalCompleteBase = v2Complete;
v2Complete = function(ok, button) {
  const stored = ok && (PRACTICAL_TITLES[v2Active] || v2Active === 27) ? storePracticalState(v2Active) : null;
  if (stored && !stored.ok) {
    lessonFeedback.textContent = stored.error;
    return;
  }
  practicalCompleteBase(ok, button);
  if (stored?.outcome) lessonFeedback.textContent = `计算与状态迁移都正确。${stored.outcome}`;
};

const practicalRenderBase = v2Render;
v2Render = function() {
  practicalRenderBase();
  refreshPracticalPreview();
  lessonStage.querySelectorAll('.practical-lab input,.practical-lab select').forEach(el => el.addEventListener('input', refreshPracticalPreview));
  const chart = lessonStage.querySelector('#storyChart');
  if (chart) {
    const rows = SIM_BARS.slice(0, Math.min(SIM_BARS.length, typeof replayCount === 'function' ? replayCount() : sim.barCursor));
    const bar = rows.at(-1), snapshot = document.createElement('p');
    snapshot.className = 'chart-snapshot';
    snapshot.textContent = `常规时段教学样本 · ET · D${rows.length}：开 ${bar[0]} / 高 ${bar[1]} / 低 ${bar[2]} / 收 ${bar[3]} / 量 ${bar[4]}`;
    (lessonStage.querySelector('#chartDataText') || chart).after(snapshot);
  }
  const note = MARKET_REALITY[v2Active];
  if (note) {
    const box = document.createElement('aside');
    box.className = 'market-reality';
    box.innerHTML = `<small>美股市场机制 · 截至 2026-09-15</small><h4>${note[0]}</h4><p>${note[1]}</p><a href="${note[3]}" target="_blank" rel="noreferrer">官方依据：${note[2]}</a>`;
    lessonStage.querySelector('.story-guide')?.after(box);
  }
};

function drawPracticalAxes() {
  const canvas = document.querySelector('#storyChart');
  if (!canvas) return;
  const rows = SIM_BARS.slice(0, Math.min(SIM_BARS.length, typeof replayCount === 'function' ? replayCount() : sim.barCursor));
  if (!rows.length) return;
  const snapshot = lessonStage.querySelector('.chart-snapshot'), bar = rows.at(-1);
  if (snapshot) snapshot.textContent = `常规时段教学样本 · ET · D${rows.length}：开 ${bar[0]} / 高 ${bar[1]} / 低 ${bar[2]} / 收 ${bar[3]} / 量 ${bar[4]}`;
  const pen = canvas.getContext('2d'), lo=Math.min(...rows.map(x=>x[2])), hi=Math.max(...rows.map(x=>x[1]));
  pen.save(); pen.font='11px sans-serif'; pen.fillStyle='#52615d'; pen.strokeStyle='#d7dfdb'; pen.lineWidth=1;
  pen.fillText('常规时段 · ET',canvas.width-132,20);
  [hi,(hi+lo)/2,lo].forEach(price=>{const y=52+(hi-price)/Math.max(1,hi-lo)*145;pen.beginPath();pen.moveTo(36,y);pen.lineTo(canvas.width-44,y);pen.stroke();pen.fillText(price.toFixed(1),canvas.width-39,y+4)});
  const last=rows.length-1;[0,Math.floor(last/2),last].forEach(i=>pen.fillText(`D${i+1}`,42+i*(canvas.width-80)/Math.max(rows.length,1),250));
  pen.restore();
}
const practicalChartBase = v2Chart;
v2Chart = function(){ practicalChartBase(); drawPracticalAxes(); };
if (typeof drawReplayChart === 'function') {
  const practicalReplayBase = drawReplayChart;
  drawReplayChart = function(){ practicalReplayBase(); drawPracticalAxes(); };
}

const practicalStyle = document.createElement('style');
practicalStyle.textContent = `
.practical-lab,.corporate-check{display:grid;gap:14px}.lab-brief{padding:14px 16px;border-left:4px solid #207a58;background:#fff}.lab-brief b{color:#174e3d}.lab-brief p{margin:5px 0 0;line-height:1.6}.lab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.lab-grid label{display:grid;gap:6px;color:#40514c;font-size:12px}.lab-grid input,.lab-grid select{width:100%;min-height:44px;padding:9px 10px;border:1px solid #aebdb6;background:#fff;color:#172622;font:inherit}.lab-grid [aria-invalid=true]{border:2px solid #b54838;background:#fff4f1}.lab-preview{display:block;padding:12px 14px;color:#334a44;background:#e6f0eb;line-height:1.55}.market-reality{margin:0 0 18px;padding:16px 18px;border-left:4px solid #315f8b;background:#eef5fa}.market-reality small{color:#315f8b;font-weight:800}.market-reality h4{margin:5px 0 7px;font-size:18px}.market-reality p{margin:0 0 8px;line-height:1.65}.market-reality a{color:#174e6b;font-size:12px;font-weight:700}.corporate-check{margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid #cbd6d0}.reality-proof{display:grid;grid-template-columns:1fr auto;gap:3px 10px;padding:12px 0;border-block:1px solid #ffffff2a}.reality-proof span,.reality-proof small{color:#b9c5c0;font-size:11px}.reality-proof b{grid-row:1/3;grid-column:2;font-size:18px}.chart-snapshot{margin:8px 0 12px;padding:10px 12px;background:#eef5f1;color:#344b44;font:700 12px/1.5 monospace}
@media(max-width:700px){.lab-grid{grid-template-columns:minmax(0,1fr)}.practical-lab button{width:100%}}
`;
document.head.appendChild(practicalStyle);
v2Render();
