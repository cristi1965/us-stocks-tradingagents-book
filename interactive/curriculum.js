(() => {
  'use strict';
  const phases=[
    {id:'account',number:1,title:'先认清自己与账户',question:'哪些钱可以承担损失？账户里显示的钱都能立刻使用吗？',why:'先把风险预算和账户可用资金分开，后面的数量计算才不会用错前提。',lessonIds:['risk-budget','settled-cash'],articleIds:['start-duoshao-qian','start-t1t0','market-gupiao','market-sanshi','mind-peizhi'],output:'写出一张资金用途表：生活必需、应急缓冲、可投资资金、单笔最多承受的损失。',gate:'能区分可投资资金、单笔风险预算和题目给出的已结算可用现金；真实账户状态以券商当前规则为准。',map:'domain'},
    {id:'evidence',number:2,title:'把看到的信息变成证据',question:'我看到的是事实、指标，还是自己的故事？',why:'先准确描述时间、价格、成交量和来源，才能谈解释。',lessonIds:['ohlc','relative-volume','trend-structure','evidence-age'],articleIds:['kline-gouzao','kline-zhouqi','trend-dingyi','indi-zonggang','indi-vol','tool-caibao'],output:'做一张证据卡：对象、时间、来源、数值和尚未知道的部分。',gate:'能先描述再解释，并识别过期、修订后或重复的来源。',map:'route'},
    {id:'thesis',number:3,title:'提出可被推翻的判断',question:'我为什么想做？看到什么事实就应承认自己错了？',why:'一个只能被证明、不能被推翻的故事，不是可检查的计划。',lessonIds:['invalidation-zone','data-vintage','event-sequence','yield-duration'],articleIds:['fund-sanbiao','fund-shangye','fund-xianjinliu','tool-rili','tool-lilv','master-duizhao'],output:'写一句判断、三条依据、一条反例和一个失效条件。',gate:'新消息出现时，能指出它改变了哪条依据，不用后来数据冒充当时信息。',map:'decision'},
    {id:'sizing',number:4,title:'算清能承担多少',question:'判断即使正确，这个数量会不会先让账户撑不住？',why:'先检查单笔损失，再检查组合、杠杆、卖空和事件等特殊风险。',lessonIds:['gap-risk','loss-circuit','cluster-risk','correlated-assets','leverage-equity','short-sale','event-position'],articleIds:['trade-cangwei','trade-zhisun','trade-gganggan','mind-heitiane','mind-qingdan'],output:'同时算出现金上限、单笔风险数量、组合压力损失和停手条件。',gate:'能解释跳空、相关性、杠杆和事件为什么会让实际损失超过计划。',map:'domain'},
    {id:'gate',number:5,title:'检查整份计划',question:'是继续、补齐，还是放弃？',why:'修好一个缺口不代表整份计划已经通过，AI的多数意见也不是许可。',lessonIds:['risk-gate','integrated-plan'],articleIds:['trade-jihua','mind-guodu','tool-wangzhan'],output:'完成一张研究卡：证据、判断、失效、数量、风险、订单和未确认项。',gate:'能找出所有冲突，说明拒绝原因；信息变化后会重算整张卡。',map:'decision'},
    {id:'execution',number:6,title:'模拟执行并复盘',question:'提交了就是成交吗？部分成交、拒绝和撤单怎么记？',why:'订单是请求，成交是结果。复盘要分开当时证据、执行过程和最终盈亏。',lessonIds:['order-tradeoff','session-liquidity','partial-fill','halt-reopen'],articleIds:['trade-dingdan','trade-huadian','trade-fenpi','start-feiyong','start-zhangdieting'],output:'保留订单请求、接收回执、实际成交、剩余委托和账户变化。',gate:'能选订单并说明取舍，不把已提交当成已成交，不用结果篡改当时理由。',map:'sequence'},
    {id:'options',number:7,title:'选修：期权为什么多一层复杂性',question:'方向看对，为什么还可能亏钱？',why:'期权同时受价格、时间、波动预期、乘数和交割条件影响，不是更便宜的股票。',lessonIds:['option-quotes','delta-gamma','combined-greeks','iv-crush','debit-spread'],articleIds:['tool-qiquan'],output:'画出一份合约的权利义务、投入、到期损益和到期前风险。',gate:'能区分到期损益与中途价格，统一乘数与单位，说明方向正确仍亏的原因。',map:'domain',optional:true}
  ];
  const byLesson=new Map(),byArticle=new Map();
  phases.forEach(p=>{p.lessonIds.forEach(id=>byLesson.set(id,p));p.articleIds.forEach(id=>byArticle.set(id,p));});
  window.CURRICULUM_PHASES=phases;
  window.Curriculum={phases,findByLesson:id=>byLesson.get(id),findByArticle:id=>byArticle.get(id)};
})();
