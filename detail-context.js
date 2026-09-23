(() => {
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const routes={
    '开始之前':['先看资金用途','弄清投资约束','再认识市场','route'],
    '市场地图':['已知自己的约束','认识产品与市场','再读价格和公司','domain'],
    'K线语言':['知道价格怎么来','读懂一段价格','再看趋势与成交量','route'],
    '趋势与形态':['先读懂K线','描述趋势与形态','写清什么算判断错','decision'],
    '技术指标':['先看价格和量','用指标压缩信息','再查滞后与误导','decision'],
    '看懂公司':['先看业务和报表','联系利润、现金与估值','再写判断与反例','domain'],
    '交易实务':['先有判断与限制','把计划变成订单','再核对真实成交','sequence'],
    '流派与大师':['先理解方法条件','拆成可检验规则','再用自己的约束','decision'],
    '心态与风险':['识别偏差与脆弱点','把损失换成生活影响','再设限制与备案','route'],
    '工具与词典':['先写清问题','选工具并检查输入','再验证输出能否使用','decision'],
    '生存规则':['资金用途','损失预算与停手条件','读图和证据','route'],
    '读图证据':['先定损失边界','读价格、量和趋势','再写判断失效条件','route'],
    '订单执行':['已有判断和数量','选订单并检查状态','根据成交更新账户','sequence'],
    '账户风险':['核对账户与欠款','查杠杆、集中与相关风险','再决定数量','domain'],
    '事件交易':['先看时间与预期','重新计算事件风险','再决定是否持有','decision'],
    '期权实战':['先认清权利与义务','拆价格、时间与波动','再检查最坏情况','domain'],
    '证据与Agent':['先确认来源与时间','检查AI的依据与反例','通过风险门后才继续','decision'],
    '综合练习':['汇总当时证据','完整检查计划','执行后核对与复盘','decision']
  };
  const maps={route:['学习路线图','learning-route.svg','route'],domain:['领域关系图','domain-map.svg','domain'],decision:['决策流程图','decision-flow.svg','decision'],sequence:['下单时序图','order-sequence.svg','sequence']};
  function render(group,title,id){
    const phase=window.Curriculum?.findByLesson(id)||window.Curriculum?.findByArticle(id);
    let row=routes[group]||routes['工具与词典'],label=`补充资料 · ${group}`;
    if(phase){const phases=window.Curriculum.phases,previous=phases[phase.number-2],next=phases[phase.number];row=[previous?`阶段 ${previous.number} · ${previous.title}`:'起点：先承认自己的约束',`阶段 ${phase.number} · ${phase.title}`,next?`阶段 ${next.number} · ${next.title}`:'完成主线，按需继续查阅',phase.map];label=`主线阶段 ${phase.number} · ${phase.title}`;}
    const map=maps[row[3]];
    return `<aside class="detail-map" aria-label="${esc(title)}在整体流程中的位置"><div class="detail-map-head"><div><span>${phase?'当前知识点在主线的位置':'这是补充资料，不必按顺序刷完'}</span><strong>${esc(label)}</strong></div><a href="index.html#path">返回7阶段主线 →</a></div><div class="detail-flow"><span>${esc(row[0])}</span><b aria-hidden="true">→</b><span class="current">${esc(row[1])}<small>你在这里</small></span><b aria-hidden="true">→</b><span>${esc(row[2])}</span></div><details><summary>在详情里看对应大图</summary><div class="detail-map-image"><img src="assets/maps/${map[1]}" alt="${map[0]}"></div></details></aside>`;
  }
  window.DetailContext={render,groups:Object.keys(routes)};
})();
