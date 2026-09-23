const V2_STAGES=[
  ['生存规则','最大损失、结算资金、跳空和连续亏损'],
  ['读图证据','开高低收与成交量（OHLCV）、相对成交量、趋势和关键区域'],
  ['订单执行','订单类型、时段、有效期限（TIF）、部分成交、停牌与重开'],
  ['账户风险','完整仓位反推、风险簇、保证金压力和恢复门槛'],
  ['事件交易','消费者价格指数（CPI）/美联储议息会议（FOMC）/收益率、财报缺口与跨资产冲突'],
  ['期权实战','合约筛选、期权敏感度（Greeks）联合损益、隐含波动率回落（IV Crush）、价差和到期处理'],
  ['证据与 Agent','分类型时效、来源、反证和默认拒绝（fail-closed）'],
  ['总验收','统一账户、市场、订单、事件和退出计划']
];
const V2_TITLES=[
  ['单笔最大损失','choice'],['完整仓位反推与结算','slider'],['隔夜跳空与止损真相','choice'],['连续亏损熔断协议','sequence'],
  ['一根 K 线与价格结构','chart'],['成交量有参照与 RVOL','choice'],['趋势还是区间','chart'],['关键区域与结构失效','chart'],
  ['订单类型与代价取舍','order'],['交易时段与保护边界','choice'],['部分成交与订单生命周期','order'],['停牌熔断与重开拍卖','order'],
  ['风险簇净压力测算','cluster'],['高贝塔多资产暴露','cluster'],['杠杆与维持保证金','choice'],['卖空 locate 与 SSR 限制','choice'],
  ['CPI 首次值与修订口径','macro'],['FOMC 会议三幕剧','sequence'],['收益率曲线与久期近似','macro'],['财报尾部反推仓位','slider'],
  ['期权链流动性筛选','option'],['Delta 与 Gamma 敏感度','option'],['Greeks 联合损益近似','option'],['IV Crush 双情景折算','choice'],['价差与指派终态处理','option'],
  ['证据类型与时效 TTL','agent'],['风险官关闸 fail-closed','agent'],['最终交易日总验收','final']
];
const V2_SIZES=[4,4,4,4,4,5,2,1];
const V2_COPY={choice:['先做判断，系统再揭晓后果。',['控制风险，等待证据','放大仓位，赌一次','忽略失效条件']],slider:['拖动参数，观察风险预算如何变化。',[]],sequence:['把停止、检查、减仓和恢复排成执行顺序。',[]],chart:['逐根看行情，选择等待确认或现在入场。',[]],order:['不同流动性需要不同订单，先选牺牲什么。',[]],cluster:['把代码不同、风险来源相同的持仓合并。',[]],macro:['同时观察预期差、2Y、10Y、美元和指数。',[]],option:['从期限、Delta、IV、点差与最大损失筛选。',[]],agent:['检查来源、时间戳、反证和失效条件。',[]],final:['把行情、假设、仓位、订单、事件和复盘写在一起。',[]]};
let v2Active=+(localStorage.getItem('manga-us-v2-active')||0),v2Done=new Set(JSON.parse(localStorage.getItem('manga-us-v2-done')||'[]')),v2Equity=+(localStorage.getItem('manga-us-v2-equity')||100000);
window.v2Active=v2Active;window.v2Done=v2Done;window.v2Equity=v2Equity;
const desk=document.createElement('section');desk.id='trainingDesk';desk.className='training-desk';desk.innerHTML='<aside id="stageRail"></aside><section id="lessonStage"></section><aside id="tradeJournal"></aside>';document.querySelector('#chapters').before(desk);
['#chapters','#chart','#risk','#options','#advancedLabs','#agents','#mastery','#quantLab'].forEach(s=>{const n=document.querySelector(s);if(n)n.classList.add('tool-hidden')});
function v2Stage(index){let n=0;for(let i=0;i<V2_SIZES.length;i++){n+=V2_SIZES[i];if(index<n)return i}return 7}
function v2Save(){window.v2Active=v2Active;window.v2Done=v2Done;window.v2Equity=v2Equity;localStorage.setItem('manga-us-v2-active',v2Active);localStorage.setItem('manga-us-v2-done',JSON.stringify([...v2Done]));localStorage.setItem('manga-us-v2-equity',v2Equity)}
function v2Rail(){let offset=0;stageRail.innerHTML='<div class="rail-title"><b>28 章训练路线</b><span>按交易决策顺序推进</span></div>'+V2_STAGES.map((s,i)=>{const start=offset;offset+=V2_SIZES[i];return `<details ${i===v2Stage(v2Active)?'open':''}><summary><i>${i+1}</i><span><b>${s[0]}</b><small>${s[1]}</small></span></summary>${V2_TITLES.slice(start,offset).map((x,j)=>`<button class="rail-lesson ${start+j===v2Active?'active':''} ${v2Done.has(start+j)?'done':''}" data-v2="${start+j}"><span>${start+j+1}</span>${x[0]}</button>`).join('')}</details>`}).join('');stageRail.querySelectorAll('[data-v2]').forEach(b=>b.onclick=()=>{v2Active=+b.dataset.v2;v2Save();v2Render()})}
function v2Control(type,index){if(type==='choice'){const sets={0:['风险 0.8%，先写失效条件','用 40% 仓位证明判断','亏损后加倍'],2:['按 -18% 缺口重算仓位','相信 -5% 止损必成交','财报后再处理'],5:['价格强，但量能仍待确认','量比 0.6 也叫放量','阳线必然继续涨'],7:['承认上升结构受损','继续下移失效点','均线向上所以无事'],9:['放量收盘站稳并守住回踩','盘中刺穿立即追','社媒热度代替价格'],14:['按最大损失决定杠杆','购买力就是风险预算','牛市可以忽略保证金'],23:['方向收益可能被 IV 和 Theta 吞掉','股价涨 Call 必涨','财报后 IV 必升']};const a=sets[index]||['控制风险，等待证据','重仓押方向','忽略失效条件'];return `<div class="decision-list">${a.map((x,i)=>`<button data-pick="${i?'bad':'good'}">${x}</button>`).join('')}</div>`}if(type==='slider'){const label=index===12?'单笔风险（0.1%-2.0%）':index===19?'财报缺口压力（1%-20%）':'执行缓冲（0.1%-2.0%）';return `<label class="sim-slider">${label}<input type="range" min="1" max="20" value="8"><output>0.8%</output></label><div class="live-math">账户风险预算：<b>$800</b></div><button data-run>提交参数</button>`}if(type==='sequence')return '<div class="sequence-list"><button data-step="1">停止新增风险</button><button data-step="2">检查共同暴露</button><button data-step="3">降仓或 Paper</button></div><p>按 1 → 2 → 3 点击。</p><button data-run>确认顺序</button>';if(type==='chart')return '<canvas id="storyChart" width="760" height="280"></canvas><div class="chart-actions"><button data-pick="good">等待收盘或回踩确认</button><button data-pick="bad">满仓追盘中突破</button></div>';if(type==='macro')return '<div class="macro-inputs"><label>实际值<input id="actual" type="number" value="3.2" step="0.1"></label><label>预期值<input id="consensus" type="number" value="3.0" step="0.1"></label></div><div class="cross-assets"><span>2Y <b>+12bp</b></span><span>10Y <b>+7bp</b></span><span>USD <b>+0.4%</b></span><span>NDX <b>-1.2%</b></span></div><button data-run>计算预期差并更新剧本</button>';if(type==='option')return `<div class="option-math"><label>合约张数<input id="contracts" type="number" value="1" min="1"></label><label>权利金<input id="debit" type="number" value="3" min="0.01"></label></div><div class="mini-chain"><button data-pick="good">30D · 0.42Δ · IV 38% · 点差 $0.15</button><button data-pick="bad">7D · 0.61Δ · IV 72% · 点差 $0.80</button></div><p>最大权利金风险：<b id="optionRisk">$300</b></p>`;if(type==='agent')return '<div class="evidence-stack"><button data-pick="good">10 分钟前 · SEC 文件 · 有反证</button><button data-pick="bad">30 小时前 · 无链接 · 大家都看多</button></div>';if(type==='order')return '<div class="decision-list"><button data-pick="good">小盘股：限价单 + 缩小数量</button><button data-pick="bad">小盘股：大额市价单</button><button data-pick="bad">止损价保证成交价</button></div>';if(type==='cluster')return '<fieldset class="cluster-pick"><legend>勾选属于同一科技/利率风险簇的持仓</legend><label><input type="checkbox" value="chip">芯片股</label><label><input type="checkbox" value="qqq">纳指 ETF</label><label><input type="checkbox" value="call">科技 Call</label><label><input type="checkbox" value="tBill">短期国库券</label></fieldset><button data-run>检查风险簇</button>';if(type==='final')return '<div class="final-fields"><label>行情状态<input id="planState"></label><label>失效条件<input id="planInvalid"></label><label>最大损失（美元）<input id="planLoss" type="number"></label><label>订单计划<input id="planOrder"></label><label>事件风险<input id="planEvent"></label><label>复盘时间<input id="planReview" type="datetime-local"></label></div><button data-run>运行总验收</button>';return '<button data-run>运行决策模拟</button>'}
function v2Chart(){const c=document.querySelector('#storyChart');if(!c)return;const p=c.getContext('2d'),a=[100,103,101,106,108,105,110,109,114,112,116];p.clearRect(0,0,c.width,c.height);p.strokeStyle='#207a58';p.lineWidth=4;p.beginPath();a.forEach((v,i)=>i?p.lineTo(35+i*65,245-(v-98)*12):p.moveTo(35,245-(v-98)*12));p.stroke();p.setLineDash([6,5]);p.strokeStyle='#b95443';p.beginPath();p.moveTo(30,170);p.lineTo(730,170);p.stroke();p.setLineDash([])}
function v2Complete(ok,button){lessonStage.querySelectorAll('[data-pick]').forEach(b=>b.disabled=true);if(button)button.classList.add(ok?'answer-right':'answer-wrong');lessonFeedback.textContent=ok?'本题通过，学习记录已保存；这不是实际成交验证。':'风险放大：这次不通关。即使偶然盈利，违反预设规则仍需纠正。';if(ok&&!v2Done.has(v2Active)){v2Done.add(v2Active);v2Equity=Math.round(v2Equity*(v2Active%4===0?.997:1.002));v2Save();v2Journal();v2Rail()}else if(ok){lessonFeedback.textContent='本章已经通过；可以复习，但不会重复改变净值。'}}
function v2Journal(){tradeJournal.innerHTML=`<small>模拟（Paper）学习账户</small><b>$${v2Equity.toLocaleString()}</b><span>学习证据 ${v2Done.size}/28</span><div class="proof"><i style="width:${v2Done.size/28*100}%"></i></div><ol><li>最大损失先于收益目标</li><li>错误不会被盈利洗白</li><li>所有训练仅限模拟（Paper）</li></ol><button id="openTools">专业工具箱</button>`;progressText.textContent=`${v2Done.size}/28 章`;progressBar.style.width=`${v2Done.size/28*100}%`;openTools.onclick=()=>{document.querySelectorAll('.tool-hidden').forEach(n=>n.classList.toggle('tool-visible'));openTools.textContent=openTools.textContent==='专业工具箱'?'收起工具箱':'专业工具箱'}}
function v2Render(){v2Rail();const [title,type]=V2_TITLES[v2Active],copy=V2_COPY[type]||V2_COPY.choice,role=v2Active%2?'宁姚':'阿良',avatar=v2Active%2?'宁姚-1ca9c3a0b6ec2dc9.png':'阿良-c7de86724bd40304.png';lessonStage.innerHTML=`<div class="lesson-top"><span>阶段 ${v2Stage(v2Active)+1} · 第 ${v2Active+1}/28 章</span><b>${Math.round(v2Done.size/28*100)}%</b></div><h2>${title}</h2><div class="comic-strip"><img src="assets/chat-avatars/${avatar}" alt="${role}"><div><b>${role}</b><p>${copy[0]}</p></div></div><div class="decision-surface"><h3>你现在怎么做？</h3>${v2Control(type,v2Active)}<p id="lessonFeedback">先做决定，再看解释。</p></div><div class="lesson-nav"><button data-prev ${v2Active===0?'disabled':''}>上一章</button><button data-next ${v2Active===27?'disabled':''}>下一章</button></div>`;lessonStage.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>v2Complete(b.dataset.pick==='good',b));lessonStage.querySelectorAll('[data-step]').forEach((b,i)=>b.onclick=()=>{b.dataset.clicked=i+1;b.classList.add('answer-right')});lessonStage.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>{let ok=true;if(type==='final')ok=['planState','planInvalid','planOrder','planEvent','planReview'].every(id=>document.querySelector('#'+id).value.trim())&&+planLoss.value>0;if(type==='sequence')ok=[...lessonStage.querySelectorAll('[data-step]')].every((x,i)=>+x.dataset.clicked===i+1);if(type==='cluster'){const picked=[...lessonStage.querySelectorAll('.cluster-pick input:checked')].map(x=>x.value);ok=['chip','qqq','call'].every(x=>picked.includes(x))&&!picked.includes('tBill')}if(type==='macro')ok=Number.isFinite(+actual.value)&&Number.isFinite(+consensus.value);if(type==='slider')ok=+slider.value<=10;v2Complete(ok,b)});const slider=lessonStage.querySelector('input[type=range]');if(slider)slider.oninput=()=>{slider.nextElementSibling.value=(slider.value/10).toFixed(1)+'%';const math=lessonStage.querySelector('.live-math b');if(math)math.textContent='$'+(100000*slider.value/1000).toLocaleString()};const contracts=lessonStage.querySelector('#contracts'),debit=lessonStage.querySelector('#debit');if(contracts)[contracts,debit].forEach(x=>x.oninput=()=>optionRisk.textContent='$'+Math.max(0,+contracts.value*+debit.value*100).toLocaleString());lessonStage.querySelector('[data-prev]').onclick=()=>{v2Active--;v2Save();v2Render()};lessonStage.querySelector('[data-next]').onclick=()=>{v2Active++;v2Save();v2Render()};v2Chart();v2Journal()}
v2Render();

const V2_WHY=[
  "风险预算是事前愿意承担的损失金额。账户 $100,000 × 0.8% = $800；每股计划风险 $4.20，则 $800 ÷ $4.20 = 190.47，向下取整为 190 股。跳空仍可能使实际损失超预算。",
  "已结算资金是买卖交割已完成、可用于付款的钱；未结算卖出款仍在交割途中。先看这次买入用哪笔钱，再核对卖出时该笔钱是否已经结算。不要把现金账户所有当日买卖都说成违规。",
  "本教学情景假定在 $80 买入、最终在 $65 卖出：每股亏 $15。200 股共亏 $3,000，比原计划 $4 × 200 = $800 多亏 $2,200。",
  "停止新增风险是为了防止连续亏损后扩大下注。这里的日亏损阈值和恢复所需模拟笔数是练习设定，不是生理学定律，也不是交易所规则。",
  "开盘 $210、收盘 $220，所以实体长度 $10；最高 $225，所以上影线长 $5。四个价格不能告诉我们是谁卖出，也不能证明机构在出货。",
  "相对成交量（RVOL）把当前成交量除以历史同一时段均量。120 万 ÷ 200 万 = 0.6，表示比基准少 40%；它不能单独识别机构是否参与。",
  "在同一周期比较相邻波段高低点。低点由 $210 降到 $208，说明原先“低点持续抬高”的条件不再成立；这并不保证下一步一定下跌。",
  "支撑是价格过去多次停止下跌的区域。跌破后若反弹又在这里受阻，可把它当作候选阻力；需要观察，不能只凭一条线保证反转。",
  "市价单优先争取成交，成交价格不受限；限价买单只接受指定价格或更低价格，却可能买不到。盘口深度表示各个价位有多少可见挂单。",
  "盘前盘后要同时核对券商允许的时段、订单类型与价格保护。官方收盘价和盘后最后成交价是不同数据；某一交易场所的报价也不等于全市场报价。",
  "执行短缺比较实际执行与原计划的差别。买单的已成交成本按成交价减基准价计算；未成交部分按期末价减基准价计算，再加费用。结果也可能为负，表示比基准更有利。",
  "停牌意味着暂时不能成交。原止损价不会因此变成保证成交价；重开后应查询订单状态和实际成交记录，撤改单是否受理还要看券商及交易所规则。",
  "风险簇是可能因同一个因素同时亏损的一组持仓。先分别估计每项在同一情景中的损益，再相加。期权对冲额必须换成同口径风险暴露，不能直接拿权利金相减。",
  "高贝塔表示资产历史上对所选市场基准的变动较敏感。SOXL 的三倍目标针对半导体基准的单日收益，多日收益不能直接乘三，也不能拿纳指作它的跟踪基准。",
  "本例设借款 $50,000、年息 12%、按 365 天计息：30 天利息 $493.15。市值跌至 $70,000 后，净权益为 $19,506.85，除以市值得 27.87%，低于本例券商要求的 30%。",
  "卖空是先卖出借来的股票，以后买回归还。借券确认（Locate）和价格限制（SSR）是不同检查：前者查券源，后者查订单在限制生效时是否符合价格要求。",
  "公布值 3.2% 减预期值 3.0%，预期差为 0.2 个百分点。必须比较同一指标、时期和统计口径，并只使用当时已经公布的信息。",
  "美联储议息会议（FOMC）可能通过声明、经济预测和发布会影响预期。经济预测摘要（SEP）与点阵图并非每次会议都发布；偏鹰表示倾向更紧政策，偏鸽表示倾向更宽政策。",
  "2 年期（2Y）收益率升 6 个基点、10 年期（10Y）升 18 个基点，期限差增加 12 个基点。1 个基点（bp）是 0.01 个百分点。利差变化和债券价格变化要分开计算。",
  "压力测试是假设一次较大跌幅来检查持仓。本例现价 $215、跌幅 20%、每股额外成交成本 $0.50，所以每股压力风险 $43.50；$1,000 ÷ $43.50 向下取整为 22 股。",
  "期权链按到期日与行权价列出合约。买一（Bid）是买方报价，卖一（Ask）是卖方报价；未平仓量（OI）是尚未结束的合约数量，与今天成交多少不同。",
  "Delta 表示股价小幅变化 $1 时，期权每股报价大约变化多少。Delta 为 0.50 的一张标准合约，在当前附近约有 50 股的方向敏感度，并不等于真正持有 50 股。",
  "先分别算股价、波动率和时间的影响再相加：本例每股方向贡献 $1.68，波动率贡献 -$1.20，时间贡献 -$0.08，合计 $0.40；标准乘数 100 对应整张 $40。",
  "隐含波动率（IV）反映期权价格隐含的未来波动预期。事件后 IV 快速回落称 IV Crush；这会压低其他条件相同时的期权价格，但幅度和是否发生都不能保证。",
  "看涨借记价差同时买较低行权价的看涨期权、卖同到期较高行权价的看涨期权。本例行权价 210 和 225、净支出每股 $4，到期最大损失 $400、最大盈利 $1,100，未计费用。",
  "来源回答“谁发布”，报告期回答“说的是哪段时间”，时间戳回答“何时发布或采集”。有效时限（TTL）是该用途允许数据多旧；新采集的旧消息也不自动变新。",
  "默认拒绝（fail-closed）指必要条件无法确认时不放行。本课程的风险官检查来源、反证、时效和预算；多个智能体（Agent）意见一致不能补上缺失证据。",
  "拆股把同一份持仓分成更多股，不凭空创造财富。本练习按 2:1 拆股算数量与价格；实际挂单和期权如何处理仍须核对券商通知与合约调整公告。"
];
const originalV2Render=v2Render;
v2Render=function(){originalV2Render();const principle=document.createElement('section');principle.className='principle';principle.innerHTML=`<small>这一章只记一句</small><p>${V2_WHY[v2Active]}</p>`;lessonStage.querySelector('.decision-surface').before(principle)};
v2Render();
