const evidence = new Set(JSON.parse(localStorage.getItem('manga-us-evidence') || '[]'));
const remember = key => {
  evidence.add(key);
  localStorage.setItem('manga-us-evidence', JSON.stringify([...evidence]));
};

const riskForm = document.querySelector('.risk-form');
const riskBufferLabel = document.createElement('label');
riskBufferLabel.innerHTML = '每股为成交价偏差或跳空预留的钱（美元/股）<input id="riskBuffer" type="number" min="0" value="2">';
riskForm.append(riskBufferLabel);
const riskWarning = document.createElement('p');
riskWarning.id = 'riskWarning';
riskWarning.className = 'form-warning';
riskWarning.setAttribute('role', 'status');
riskForm.after(riskWarning);
function verifiedRisk(recordEvidence = false) {
  const eq = +document.querySelector('#equity').value;
  const pct = +document.querySelector('#riskPct').value;
  const enter = +document.querySelector('#entry').value;
  const exit = +document.querySelector('#stop').value;
  const buffer = +document.querySelector('#riskBuffer').value;
  const problems = [];
  if (!(eq > 0)) problems.push('账户净值必须大于 0');
  if (!(pct > 0 && pct <= 2)) problems.push('单笔计划风险必须大于 0%、不超过 2%');
  if (!(enter > 0 && exit > 0)) problems.push('价格必须大于 0');
  if (exit >= enter) problems.push('这里计算的是先买入、后卖出的持仓，止损必须低于入场价');
  if (buffer < 0) problems.push('滑点缓冲不能为负数');
  if (problems.length) {
    lossBudget.textContent = shares.textContent = notional.textContent = '--';
    riskWarning.textContent = `不能计算：${problems.join('；')}。`;
    return;
  }
  const budget = eq * pct / 100, count = Math.floor(budget / (enter - exit + buffer));
  lossBudget.textContent = `$${budget.toLocaleString()}`;
  shares.textContent = `${count} 股`;
  notional.textContent = `$${(count * enter).toLocaleString()}`;
  riskWarning.textContent = pct > 1 ? '黄色警报：超过 1% 已属激进预算，相关仓位还要合并计算。' : '校验通过：先定最大损失，再谈想赚多少。';
  if (recordEvidence === true) remember('position-sizing');
}
document.querySelectorAll('#risk input').forEach(input => input.oninput = () => verifiedRisk(true));
verifiedRisk();
const greekCard = document.querySelector('.mini-quiz').closest('article');
greekCard.querySelector('p').textContent = '以下先算每股期权报价变化：Vega 0.12、Theta -0.08，IV 下跌 20 个百分点并经过 1 天。一张标准合约通常乘以 100。';
const greekChoices = greekCard.querySelectorAll('.mini-quiz button');
greekChoices[0].textContent = '每股约 +$2.48；每张约 +$248';
greekChoices[1].textContent = '每股与每张都不变';
greekChoices[2].textContent = '每股约 -$2.48；每张约 -$248';
greekCard.querySelector('.mini-feedback').textContent = '先算每股报价变化，再乘标准合约乘数 100。';

[
  ['.bubble.chen', '陈平安-7900ed1ee3359c71.png', '陈平安'],
  ['.bubble.liang', '阿良-c7de86724bd40304.png', '阿良'],
  ['.bubble.zhou', '周米粒-61ad07e7e0a1025b.png', '周米粒']
].forEach(([selector, file, name]) => {
  const image = document.createElement('img');
  image.src = `assets/chat-avatars/${file}`;
  image.alt = name;
  document.querySelector(selector).prepend(image);
});

const payoffInputs = document.querySelector('[data-panel="payoff"] .lab-inputs');
payoffInputs.insertAdjacentHTML('beforeend', '<label>现价<input id="spotPrice" type="number" value="100"></label><label>到期天数<input id="daysToExpiry" type="number" min="1" value="30"></label><label>隐含波动率（%）<input id="impliedVol" type="number" min="1" value="35"></label>');
shortStrike.parentElement.id = 'shortStrikeLabel';
const optionCoach = document.createElement('div');
optionCoach.className = 'lab-output';
payoffSummary.after(optionCoach);
function optionEstimate(recordEvidence = false) {
  const k1 = +strike.value, k2 = +shortStrike.value, debit = +premium.value, spot = +spotPrice.value, days = +daysToExpiry.value, iv = +impliedVol.value;
  shortStrikeLabel.hidden = strategy.value !== 'spread';
  if (![k1, debit, spot, days, iv].every(value => Number.isFinite(value) && value > 0)) {
    optionCoach.textContent = '不能计算：现价、行权价、净支出、到期天数和隐含波动率都必须是大于 0 的有效数字。';
    return;
  }
  if (strategy.value === 'spread' && (!Number.isFinite(k2) || k2 <= k1 || debit >= k2 - k1)) {
    optionCoach.textContent = '不能计算：卖出行权价必须高于买入行权价，且净支出必须大于 0、低于价差宽度。';
    return;
  }
  const expectedMove = spot * iv / 100 * Math.sqrt(days / 365);
  optionCoach.textContent = `用当前波动率粗算的波动幅度（一倍标准差）约 ±$${expectedMove.toFixed(2)}。它不是目标价；价差还要现场检查两份合约是否好买卖、是否只成交其中一份、卖出的合约是否提前被要求交割，以及到期如何处理。`;
  if (recordEvidence === true) remember('options-parameters');
}
[strategy, strike, shortStrike, premium, spotPrice, daysToExpiry, impliedVol].forEach(el => el.addEventListener('input', () => optionEstimate(true)));
optionEstimate();

drawPayoff = function (recordEvidence = false) {
  const chart = document.querySelector('#payoffChart'), pen = chart.getContext('2d');
  const buy = +strike.value, sell = +shortStrike.value, debit = +premium.value;
  const spot = +spotPrice.value, days = +daysToExpiry.value, iv = +impliedVol.value;
  const isSpread = strategy.value === 'spread', width = sell - buy;
  pen.clearRect(0, 0, chart.width, chart.height);
  pen.strokeStyle = '#d9d4c8'; pen.beginPath(); pen.moveTo(40, chart.height / 2); pen.lineTo(chart.width - 20, chart.height / 2); pen.stroke();
  if (![buy, debit, spot, days, iv].every(value => Number.isFinite(value) && value > 0)) { payoffSummary.textContent = '参数无效：所有价格、净支出、到期天数和隐含波动率都必须是大于 0 的有效数字。'; return; }
  if (isSpread && (!Number.isFinite(sell) || width <= 0 || debit >= width)) { payoffSummary.textContent = '参数无效：卖出行权价必须更高，且净支出必须低于价差宽度。'; return; }
  pen.beginPath();
  for (let spot = 70; spot <= 140; spot++) {
    const profit = isSpread ? Math.min(Math.max(spot - buy, 0), width) - debit : Math.max(spot - buy, 0) - debit;
    const px = 40 + (spot - 70) / 70 * (chart.width - 60), py = chart.height / 2 - profit * 8;
    spot === 70 ? pen.moveTo(px, py) : pen.lineTo(px, py);
  }
  pen.strokeStyle = '#3b8b61'; pen.lineWidth = 3; pen.stroke();
  payoffSummary.textContent = isSpread ? '价差有效。最大亏损 $' + (debit * 100) + '；最大盈利 $' + ((width - debit) * 100) + '。另需检查两份合约是否好买卖、是否只成交其中一份、卖出的合约是否提前被要求交割，以及到期如何处理。' : '最大亏损 $' + (debit * 100) + '；盈亏平衡价 $' + (buy + debit) + '。到期前价格还受股价、股价敏感度变化、时间和波动率影响（对应 Delta、Gamma、Theta、Vega）。';
  if (recordEvidence === true) remember('option-payoff');
};
[strategy, strike, shortStrike, premium, spotPrice, daysToExpiry, impliedVol].forEach(el => el.addEventListener('input', () => drawPayoff(true)));
drawPayoff();

const macroPanel = document.querySelector('[data-panel="macro"]');
macroPanel.querySelector('p').insertAdjacentHTML('afterend', '<div class="lab-inputs"><label>公布值<input id="macroActual" type="number" step="0.1" value="3.2"></label><label>市场预期<input id="macroConsensus" type="number" step="0.1" value="3.0"></label><label>前值<input id="macroPrior" type="number" step="0.1" value="3.1"></label><label>10 年期国债收益率变化（bp）<input id="tenYearMove" type="number" value="8"></label><label>美元指数变化（%）<input id="dollarMove" type="number" step="0.1" value="0.4"></label></div>');
const originalMacro = runMacro.onclick;
runMacro.onclick = () => {
  const fields = [macroActual, macroConsensus, macroPrior, tenYearMove, dollarMove];
  if (fields.some(field => field.value.trim() === '') || fields.some(field => !Number.isFinite(+field.value))) {
    macroOutput.textContent = '请先填完公布值、市场预期、前值、10 年期国债收益率变化和美元指数变化。';
    return false;
  }
  originalMacro();
  const surprise = +macroActual.value - +macroConsensus.value;
  macroOutput.textContent += ` 公布值减市场预期 ${surprise >= 0 ? '+' : ''}${surprise.toFixed(1)}；10Y ${+tenYearMove.value >= 0 ? '+' : ''}${tenYearMove.value}bp；美元 ${+dollarMove.value >= 0 ? '+' : ''}${dollarMove.value}%。先看债券、股票和美元的反应是否一致，再决定是否增加风险。`;
  remember('macro-scenario');
  return true;
};

const trackClick = (selector, key, valid = () => true) => {
  const button = document.querySelector(selector), original = button.onclick;
  button.onclick = event => { if (!valid()) return; const result = original ? original.call(button, event) : false; if (result !== false) remember(key); };
};
trackClick('#runStress', 'cluster-stress');
trackClick('#runBacktest', 'backtest', () => Number.isFinite(+tradeCost.value) && +tradeCost.value >= 0);
trackClick('#runAssets', 'multiasset-stress');
trackClick('#calcBond', 'bond-duration', () => Number.isFinite(+duration.value) && +duration.value > 0 && Number.isFinite(+bps.value));

const sourceLabel = document.createElement('label');
sourceLabel.innerHTML = '主要证据链接<input id="agentSource" type="url" placeholder="https://...">';
document.querySelector('#agentTime').closest('article').insertBefore(sourceLabel, runAgents);
const evidenceMeta = document.createElement('div');
evidenceMeta.className = 'agent-evidence-meta';
evidenceMeta.innerHTML = '<label>证据类型<select id="agentEvidenceType"><option value="quote">行情（本课 30 秒）</option><option value="news">新闻（本课 60 分钟）</option><option value="filing">官方文件（按报告期/版本）</option></select></label><label>报告期（文件必填）<input id="agentReportPeriod" placeholder="2026 Q2"></label><label>文件/模型版本<input id="agentArtifactVersion" placeholder="10-Q v1 / agent-config-v3"></label>';
sourceLabel.after(evidenceMeta);
const receiptList = document.createElement('ol');
receiptList.id = 'paperReceipts';
receiptList.className = 'receipt-list';
agentVerdict.after(receiptList);
function renderReceipts() {
  const rows = JSON.parse(localStorage.getItem('manga-us-paper-receipts') || '[]');
  receiptList.innerHTML = rows.slice(-3).reverse().map(row => `<li><b>${row.id}</b> · ${row.time} · 最大损失 $${row.loss}</li>`).join('');
}
runAgents.onclick = () => {
  const age = agentTime.value ? (Date.now() - new Date(agentTime.value).getTime()) / 36e5 : 9999;
  const source = agentSource.value.trim();
  const loss = +maxLoss.value;
  const currentEquity = +equity.value;
  const reasons = [];
  const evidenceType = agentEvidenceType.value;
  const sourceLower = source.toLowerCase();
  const sourceMatchesType = evidenceType === 'quote'
    ? /https:\/\/(www\.)?(nyse\.com|nasdaq\.com)\//i.test(source)
    : evidenceType === 'news'
      ? /^https:\/\/(www\.)?(sec\.gov|federalreserve\.gov|bls\.gov|home\.treasury\.gov)\//i.test(source)
      : /^https:\/\/(www\.)?(sec\.gov|federalreserve\.gov|bls\.gov|home\.treasury\.gov)\//i.test(source);
  if (!sourceMatchesType) reasons.push(`${evidenceType === 'quote' ? '行情' : evidenceType === 'news' ? '新闻' : '文件'}来源与证据类型不匹配`);
  if (age < 0) reasons.push('证据时间不能在未来');
  if (evidenceType === 'quote' && age > 30 / 3600) reasons.push('行情已超过本课 30 秒时限');
  if (evidenceType === 'news' && age > 1) reasons.push('新闻已超过本课 60 分钟时限');
  if (evidenceType === 'filing' && agentReportPeriod.value.trim().length < 4) reasons.push('官方文件必须记录报告期');
  if (agentArtifactVersion.value.trim().length < 3) reasons.push('缺少文件或模型版本');
  if (!/^https:\/\/(www\.)?(sec\.gov|federalreserve\.gov|bls\.gov|home\.treasury\.gov)\//i.test(source)) reasons.push('缺少允许的一手官方 HTTPS 证据链接');
  if (bullCase.value.trim().length < 20) reasons.push('请用至少 20 个字写清支持上涨的证据');
  if (bearCase.value.trim().length < 20) reasons.push('请用至少 20 个字写清可能推翻判断的证据');
  if (!(Number.isFinite(loss) && loss > 0 && loss <= currentEquity * 0.02)) reasons.push('最大损失必须大于 0 且不超过净值 2%');
  if (invalidCase.value.trim().length < 15) reasons.push('请用至少 15 个字写清出现什么情况就放弃原判断');
  if (reasons.length) {
    agentVerdict.textContent = `风险官拒绝：${reasons.join('；')}。`;
    return;
  }
  const rows = JSON.parse(localStorage.getItem('manga-us-paper-receipts') || '[]');
  const snapshot = {evidenceType,source,sourceAsOf:agentTime.value,reportPeriod:agentReportPeriod.value.trim(),artifactVersion:agentArtifactVersion.value.trim(),bullCase:bullCase.value.trim(),bearCase:bearCase.value.trim(),invalidation:invalidCase.value.trim(),loss,currentEquity};
  const receipt = {id: `paper-${Date.now().toString(36)}`, time: new Date().toLocaleString(), loss, source, sourceAsOf:agentTime.value, evidenceType, reportPeriod:snapshot.reportPeriod, artifactVersion:snapshot.artifactVersion, inputSnapshot:snapshot, modelConfig:'TRADINGAGENTS_TEACHING_GATE_V2'};
  rows.push(receipt);
  localStorage.setItem('manga-us-paper-receipts', JSON.stringify(rows.slice(-20)));
  agentVerdict.textContent = `风险检查通过，可继续模拟交易：${receipt.id}。这不会提交真实订单。`;
  remember('agent-risk-gate');
  renderReceipts();
};
renderReceipts();

submitExam.onclick = () => {
  let score = 0, missing = 0, riskCorrect = false;
  exam.forEach((q, i) => {
    const selected = document.querySelector(`input[name="exam-${i}"]:checked`);
    if (!selected) missing++;
    else if (+selected.value === q[3]) { score++; if (i === 1) riskCorrect = true; }
  });
  if (missing) { examResult.textContent = `还有 ${missing} 题未答。`; return; }
  const chaptersPassed = JSON.parse(localStorage.getItem('manga-us-v2-done') || '[]').length;
  const requiredLabs = ['position-sizing', 'option-payoff', 'macro-scenario', 'cluster-stress', 'backtest', 'bond-duration', 'agent-risk-gate'];
  const missingLabs = requiredLabs.filter(key => !evidence.has(key));
  const pass = score >= 4 && riskCorrect && chaptersPassed === 28 && missingLabs.length === 0;
  examResult.textContent = `${score}/5 · ${pass ? '结业验收通过。请继续用 Paper 记录至少 20 笔，再评估真实行为。' : !riskCorrect ? '未通过：仓位风险题是必过项，不能用其他题抵消。' : chaptersPassed < 28 ? `未通过：28 章只验收了 ${chaptersPassed} 章。` : `未通过：还缺实验凭证 ${missingLabs.join('、')}。`}`;
  localStorage.setItem('manga-us-final', pass ? 'pass' : 'review');
  if (pass) remember('final-exam');
};

openChapter = function (i) {
  const c = COURSE_CHAPTERS[i], d = CHAPTER_DEPTH[i];
  const cast = [
    ['阿良', '阿良-c7de86724bd40304.png'],
    ['宁姚', '宁姚-1ca9c3a0b6ec2dc9.png'],
    ['周米粒', '周米粒-61ad07e7e0a1025b.png'],
    ['陈平安', '陈平安-7900ed1ee3359c71.png']
  ];
  const [speaker, avatar] = cast[i % cast.length];
  chapterContent.innerHTML = `
    <p class="kicker">第 ${i + 1} 章 · ${chapterGroup(i)}</p><h2>${c.t}</h2>
    <div class="chapter-dialogue"><img src="assets/chat-avatars/${avatar}" alt="${speaker}"><div><b>${speaker} · 今日局面</b><p>${d.scene}</p></div></div>
    <section class="chapter-depth-block"><h3>先抓住这一件事</h3><p>${c.m}</p><div class="number-case"><b>用数字算一遍</b><p>${d.example}</p></div></section>
    <section class="chapter-depth-grid"><article><h3>三步决策</h3><ol>${d.steps.map(item => `<li>${item}</li>`).join('')}</ol></article><article class="danger-panel"><h3>最容易踩的坑</h3><ul>${d.traps.map(item => `<li>${item}</li>`).join('')}</ul></article></section>
    <section class="chapter-check"><h3>上场前检查</h3>${d.check.map(item => `<label><input type="checkbox"><span>${item}</span></label>`).join('')}</section>
    <section class="chapter-task"><h3>实战任务</h3><p>${c.task}</p><textarea class="chapter-note" placeholder="写下你的判断、数字和失效条件。内容只保存在当前浏览器。"></textarea></section>
    <fieldset class="chapter-quiz"><legend>${c.q}</legend>${c.o.map((o, n) => `<label><input type="radio" name="chapter-answer" value="${n}"><span>${o}</span></label>`).join('')}<button data-check-chapter="${i}">提交验收</button><p class="quiz-feedback" aria-live="polite"></p></fieldset>`;
  chapterDialog.showModal();
  const note = chapterContent.querySelector('.chapter-note');
  const noteKey = `manga-us-note-${i}`;
  note.value = localStorage.getItem(noteKey) || '';
  note.oninput = () => localStorage.setItem(noteKey, note.value);
  chapterContent.querySelector('[data-check-chapter]').onclick = () => {
    const selected = chapterContent.querySelector('input[name="chapter-answer"]:checked');
    const checks = [...chapterContent.querySelectorAll('.chapter-check input')];
    const feedback = chapterContent.querySelector('.quiz-feedback');
    if (!selected) { feedback.textContent = '先选择一个答案。'; return; }
    if (checks.some(box => !box.checked)) { feedback.textContent = '先完成三项上场检查，不靠记答案通关。'; return; }
    if (note.value.trim().length < 20) { feedback.textContent = '实战记录至少写 20 个字，并包含数字或失效条件。'; return; }
    if (+selected.value === c.a) {
      courseDone.add(i);
      localStorage.setItem('manga-us-chapters', JSON.stringify([...courseDone]));
      feedback.textContent = '通过：判断、检查表和实战记录已组成学习记录。';
      renderChapters(); updateProgress();
    } else feedback.textContent = `未通过：${c.m}`;
  };
};
