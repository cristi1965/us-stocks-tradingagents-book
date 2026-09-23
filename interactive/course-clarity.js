V2_TITLES[2][0] = '财报夜：95 元止损为什么卖在 82 元';
V2_TITLES[4][0] = '第一眼看懂一根 K 线';
V2_WHY[2] = '止损只负责触发卖单，不保证成交价。开盘若直接跳过 95 元，第一笔可成交价格可能已经是 82 元。';
V2_WHY[4] = '绿色实体表示收盘高于开盘；影线表示盘中去过却没守住；量柱表示当天成交有多热闹。';

const clarityControl = v2Control;
v2Control = function(type, index) {
  if (index === 0) return `
    <div class="plain-case">
      <b>今天只决定一件事：猜错一次，最多亏多少</b>
      <p>账户有 10 万美元。先规定这一笔最多亏 800 美元，再按止损距离计算能买多少。不是先买满，再祈祷别跌。</p>
    </div>
    <div class="decision-list">
      <button data-pick="good">先把最多亏损写成 800 美元，再算能买多少</button>
      <button data-pick="bad" data-plain="买得多不等于判断更准，只会让一次错误更贵。">先买四成仓位，跌了再想</button>
      <button data-pick="bad" data-plain="亏损后加倍，会让下一次错误更快伤到账户。">第一次亏了，第二次加倍赚回来</button>
    </div>`;
  if (index === 2) return `
    <div class="plain-case">
      <b>先看发生了什么</b>
      <p>你 100 元买入，计划跌到 95 元卖出。今晚公司发布财报，第二天市场第一笔成交直接是 82 元。</p>
      <p class="plain-math">市场没有在 95 元开门，所以止损单只能去 82 元附近找买家。</p>
    </div>
    <div class="decision-list">
      <button data-pick="good">财报前减小仓位：即使 82 元卖出，我也承受得起</button>
      <button data-pick="bad" data-plain="95 元只会触发卖单，不保证有人愿意在 95 元买。">设了 95 元止损，就一定能卖在 95 元</button>
      <button data-pick="bad" data-plain="财报公布后，跳空损失可能已经发生。">先满仓过财报，第二天再想办法</button>
    </div>`;
  if (index === 4) return `
    <div class="plain-lesson">
      <div><b>1 · 看粗方块</b><span>绿色：收盘比开盘高。红色：收盘比开盘低。</span></div>
      <div><b>2 · 看上下细线</b><span>细线叫影线：价格去过那里，但收盘时没停在那里。</span></div>
      <div><b>3 · 看底下柱子</b><span>柱子越高，当天成交越热闹。要和前几天比较。</span></div>
      <p class="chart-one-line"><b>先别预测：</b>这张图只能告诉你当天怎么走，不能保证明天涨跌。</p>
    </div>
    <canvas id="storyChart" width="760" height="280"></canvas>
    <div class="first-chart-quiz single-step">
      <label>先看实体：最后一根是绿色，说明什么？
        <select id="candleBody"><option value="">请选择</option><option value="up">收盘价高于开盘价</option><option value="wrong">当天一定赚钱</option></select>
      </label>
      <button type="button" data-candle-check>先核对实体</button>
      <label id="volumeStep" hidden>再看量柱：最后一根量柱更高，说明什么？
        <select id="candleVolume"><option value="">请选择</option><option value="busy">成交比前几天更活跃</option><option value="wrong">明天一定上涨</option></select>
      </label>
    </div>
    <div class="chart-actions" id="volumeSubmit" hidden><button data-run>核对量柱</button></div>`;
  if (index === 6) return `
    <div class="plain-case chart-story">
      <b>先看走势，不用填价格</b>
      <p>把每根 K 线的收盘位置连起来。高点和低点都在逐步抬高，才叫上升趋势；反复在同一片区域来回，才叫区间。</p>
    </div>
    <canvas id="storyChart" width="760" height="280"></canvas>
    <fieldset class="plain-picks">
      <legend>图里的价格更像哪一种？</legend>
      <label><input type="radio" name="trendRead" value="range"> 一直在相近的高低点之间来回</label>
      <label><input type="radio" name="trendRead" value="up"> 高点和低点都在逐步抬高</label>
      <label><input type="radio" name="trendRead" value="random"> 只看最后一根绿色就算上涨趋势</label>
    </fieldset>
    <div class="chart-actions"><button data-run>提交我的判断</button></div>`;
  if (index === 7 || index === 8) return `
    <div class="plain-case chart-story">
      <b>支撑不是一个精确数字</b>
      <p>价格曾在 500 美元附近多次止跌，所以把 496-502 美元看成一块支撑区。若放量收盘跌到 496 美元下方，原来的判断就需要作废。</p>
      <p class="plain-math">先找一片经常接住价格的区域，再写清楚跌到哪里算自己看错。</p>
    </div>
    <canvas id="storyChart" width="760" height="280"></canvas>
    <fieldset class="plain-picks">
      <legend>按上面的说明，哪份计划写得清楚？</legend>
      <label><input type="radio" name="zoneRead" value="clear"> 支撑区 496-502 美元；放量收盘跌破 496 美元，承认判断失效</label>
      <label><input type="radio" name="zoneRead" value="line"> 支撑只能是 500.00 美元，多一分钱都不算</label>
      <label><input type="radio" name="zoneRead" value="hope"> 跌了就把支撑继续往下改，总会反弹</label>
    </fieldset>
    <div class="chart-actions"><button data-run>提交这份计划</button></div>`;
  return clarityControl(type, index);
};

const clarityValidate = v3Validate;
v3Validate = function(type) {
  if (v2Active === 4) return candleBody.value === 'up' && candleVolume.value === 'busy';
  if (v2Active === 6) return document.querySelector('input[name="trendRead"]:checked')?.value === 'up';
  if (v2Active === 7 || v2Active === 8) return document.querySelector('input[name="zoneRead"]:checked')?.value === 'clear';
  return clarityValidate(type);
};

const clarityComplete = v2Complete;
v2Complete = function(ok, button) {
  clarityComplete(ok, button);
  if (!ok && button?.dataset.plain) lessonFeedback.textContent = button.dataset.plain + ' 换一个做法再试。';
};

const STAGE_GUIDES = [
  ['生存规则：先学别出局','阿良带着十万本金进山，第一件事不是找翻倍股，而是先定最大损失、核实结算资金并防范隔夜跳空。本金没了，后面的机会都与你无关。'],
  ['读图证据：价格留下的脚印','K 线记录已经发生的交易。先读开盘价、最高价、最低价、收盘价和成交量，再比较前后几天的变化。一根线的颜色不能预测明天。'],
  ['订单执行：下单前算清成本','想买不等于买得到。先决定用什么订单、等多久、没成交怎么办；盘前盘后和停牌后重新开市时，还要防价格突然变化。'],
  ['账户风险：几只股票可能一起跌','买了几只科技股，也可能同时亏钱。把可能一起跌的持仓放在一起算损失；借钱买股时，还要检查账户里自己的钱是否够券商要求。'],
  ['事件交易：大日子提前准备','物价数据（CPI）、美联储议息会议（FOMC）和公司财报都可能让价格突然变化。比较公布值与原先预期，并算算价格跳过止损价时会亏多少。'],
  ['期权实战：猜对涨跌也可能亏','期权价格还会受剩余天数和市场预期波动的影响。逐个学会衡量这些影响，再比较同时买卖两张期权的方案，并准备好到期后的处理办法。'],
  ['证据与 AI：先查资料，再做判断','几个 AI 助手赞同同一观点，可能只是看了同一份资料。检查资料来源、更新时间和反对理由；资料不够或风险超预算，就先不下单。'],
  ['最后检查：把一笔交易从头走完','核对账户、行情、订单、重大消息和退出计划。再检查拆股、分红或价格突然跳变时该怎么办，并留下能回头核对的记录。']
];

const CHAPTER_TERMS = {
  16: ['CPI', '消费者价格指数。市场更在意公布值和大家原先预期值差多少。'],
  17: ['FOMC', '美联储议息会议。结果不只是一句加息或降息，还包括声明和发布会。'],
  18: ['2Y、10Y、bp', '2Y 和 10Y 是 2 年期、10 年期美债收益率。1bp 等于 0.01 个百分点。'],
  20: ['Call、30D、Bid / Ask、OI', 'Call 是看涨期权；30D 是约 30 天到期；Bid / Ask 是买卖报价；OI 是还没平仓的合约数。'],
  21: ['Delta、Gamma', 'Delta 粗略表示股价变 1 美元时，期权价格会变多少；Gamma 表示 Delta 还会变多快。'],
  22: ['Theta、Vega、IV', 'Theta 是时间每天拿走多少价值；Vega 看隐含波动率变化的影响；IV 是从期权价格反推出的、市场预期未来波动程度。'],
  23: ['IV Crush', '重大消息公布后，不确定性突然下降，IV 常快速回落，期权价格可能跟着缩水。'],
  24: ['价差', '同时买一张、卖一张不同执行价的期权，把最大亏损和最大盈利都提前封住。'],
  25: ['SEC', '美国证券交易委员会。公司提交的正式文件可以从 SEC 官网追溯。'],
  26: ['风险门', '资料不新、没有来源、没有反证或亏损超预算时，系统直接禁止下单。']
};

const CHAPTER_GUIDES = {
  20: ['先看这张票好不好卖', '两张 Call 都看涨，但成交活跃度可能天差地别。到期太近、买卖报价差太大或几乎没人持有的合约，即使方向猜对，也可能很难按合理价格退出。'],
  21: ['股价动一元，期权不一定也动一元', 'Delta 像期权跟随股价的步幅，Gamma 则提醒你这个步幅还会变化。先算一张期权的价格变化大约相当于持有多少股股票，再判断买得多不多。'],
  22: ['股价原地不动，期权也会变价', '期权像一张会过期、也会随市场紧张程度涨价的票。Theta 记录时间流逝的影响，Vega 记录市场预期波动改变的影响。'],
  23: ['财报公布后，热闹会突然散场', '财报前大家愿意为未知结果多付钱，消息公布后这部分价格可能迅速消失。所以股票小涨，不代表 Call 一定赚钱。'],
  24: ['用一部分上限，换一个明确底线', '只买 Call 成本可能较高；同时卖出更高执行价的 Call，可以降低成本，但也放弃超过该价位后的额外收益。先把最大亏损和最大盈利都算清楚。']
};

const clarityRender = v2Render;
v2Render = function() {
  clarityRender();
  const guide = document.createElement('section');
  guide.className = 'story-guide';
  if (v2Active === 4) guide.innerHTML = '<small>先别猜涨跌</small><h3>今天只学会看懂图上三样东西</h3><p>粗方块看开盘和收盘，细线看盘中到过哪里，底下柱子看成交热不热闹。先会读记录，再谈支撑和阻力。</p>';
  else if (v2Active === 2) guide.innerHTML = '<small>一个财报夜</small><h3>门口直接从 100 元开到了 82 元</h3><p>止损像你喊“我要卖”。但买家只肯出 82 元时，喊 95 元不能变出一个 95 元的买家。</p>';
  else {
    const story = CHAPTER_GUIDES[v2Active] || STAGE_GUIDES[v2Stage(v2Active)];
    guide.innerHTML = `<small>这章为什么要学</small><h3>${story[0]}</h3><p>${story[1]}</p>`;
  }
  lessonStage.querySelector('.story-thread').after(guide);
  const term = CHAPTER_TERMS[v2Active];
  if (term) {
    const glossary = document.createElement('aside');
    glossary.className = 'chapter-term';
    glossary.innerHTML = `<b>${term[0]} 是什么？</b><p>${term[1]}</p>`;
    guide.after(glossary);
  }
  if (v2Active === 4) {
    const check = lessonStage.querySelector('[data-candle-check]');
    const volumeCheck = lessonStage.querySelector('#volumeSubmit [data-run]');
    check.onclick = () => {
      if (candleBody.value !== 'up') {
        lessonFeedback.textContent = '绿色只说明收盘价高于开盘价，不保证你赚钱，也不保证明天上涨。';
        return;
      }
      check.disabled = true;
      volumeStep.hidden = false;
      volumeSubmit.hidden = false;
      lessonFeedback.textContent = '实体读对了。现在只看底下的量柱。';
    };
    const submitVolume = volumeCheck.onclick;
    volumeCheck.onclick = event => {
      if (candleVolume.value !== 'busy') {
        lessonFeedback.textContent = '量柱更高只说明这一天成交比前几天更活跃，不能保证明天上涨。';
        return;
      }
      submitVolume(event);
    };
  }
};

const clarityStyle = document.createElement('style');
clarityStyle.textContent = '.story-guide,.plain-case{margin:18px 0;padding:18px;border-left:4px solid #d89b38;background:#fff7e7}.story-guide small,.plain-case>b{color:#9b641a;font-weight:800}.story-guide h3{margin:5px 0}.chapter-term{margin:0 0 18px;padding:16px 18px;background:#edf6f2;border-left:4px solid #207a58}.chapter-term b{color:#174e3d}.chapter-term p{margin:6px 0 0}.plain-math{padding:12px;background:#fff;font-weight:700}.plain-lesson{display:grid;gap:8px;margin-bottom:16px}.plain-lesson div{display:grid;gap:3px;padding:13px;background:#fff}.first-chart-quiz{display:grid;grid-template-columns:1fr 1fr;gap:10px}.first-chart-quiz label{display:grid;gap:5px}.first-chart-quiz select{min-height:44px;padding:8px;font:inherit}.plain-picks{display:grid;gap:10px;margin:16px 0;padding:0;border:0}.plain-picks legend{margin-bottom:10px;font-weight:800}.plain-picks label{display:flex;align-items:flex-start;gap:10px;padding:14px 16px;border:1px solid #cdd8d2;border-radius:8px;background:#fff;line-height:1.55;cursor:pointer}.plain-picks input{flex:0 0 auto;margin-top:.3em}.chart-story p{max-width:64ch}@media(max-width:700px){.first-chart-quiz{grid-template-columns:1fr}.plain-picks label{padding:12px}}';
clarityStyle.textContent += '[hidden]{display:none!important}';
document.head.appendChild(clarityStyle);
v2Render();
