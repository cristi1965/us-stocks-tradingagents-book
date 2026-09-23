# 旧课程还缺哪些训练：白话版

这是2026-09-15问题记录的重新讲解。原文、旧文件行号与当时的详细规则记录保存在archive/pre-full-eli5。下面不把过去的“当前状态”冒充今天的验证结果，也不宣布原计划全部完成。

## 先看四个问题

懂一根K线，不代表能完成一次交易。至少还要知道：账户的钱能不能用、市场能不能成交、期权到期后要交什么、判断时能否知道所用数据。

旧课程已讲价格图、订单、风险和期权，但一些内容只在文字中出现，没有进入练习或程序检查。应该用会改变结果的例子练，而不是再堆七篇定义。

## 哪些先做

P0表示先修：漏了会把不能下单说成能下单，或者把还会亏钱说成风险封顶。P1表示接着修：否则容易高估模拟成绩。P2是进一步学习，不应拦住基础课程。

### 钱到账了吗

卖掉股票后，账户显示一笔钱，不一定代表所有结算步骤已完成。T+1中的“1”指适用规则下的下一个营业日，不等于自然日的明天；不同市场和产品不能混用。

练习应分别显示现金账户还是借款账户、已结算的钱、待结算的钱、结算日期和券商要求。不能只看总余额就说可交易。旧稿记录的保证金迁移日期属于当时的规则资料，本次不重新确认，真实使用要查当前券商采用哪套规定。

### 市场正在正常交易吗

正常时段与盘前盘后的报价数量、价差和可用订单可能不同。NBBO指综合的最佳买卖报价，但适用范围不能凭同一个股票代码推断。

官方收盘价、盘后最后一笔成交和下一次开盘价是三个不同东西。还要查休市和提前收盘日。练习应给出交易时段和日历，而不是把任何时间都当作普通交易时间。

### 暂停交易时会怎样

个股价格波动限制、重大消息停牌、全市场暂停和自己设定的账户停手规则，不是一回事。LULD和MWCB是两类市场机制的缩写，具体门槛要以当时适用规则为准。

暂停时，止损设置不会创造对手方。恢复交易可能重新集中撮合，成交价可能远离暂停前价格。训练要显示“等待恢复”，不能悄悄按原止损价记作卖出。

### 想卖空，是否真有股票可借

卖空是先借股票卖出，以后买回归还。locate是卖空前核查可借性的程序；SSR涉及特定情况下的卖空价格限制。看空观点不代替这些条件。

练习应给出能借多少、借券费用怎样算、限制是否适用、借券被收回怎么办。费用随券商和时点变化，题设费率不能当成所有交易都适用。

### 期权到期后，账户里会多出什么

买方使用权利叫行权；卖方被要求履行义务叫指派；随后股票和现金如何交付叫交割。产品可能采用不同的行权方式、乘数和交割方式。

至少练四种情况：买入Call被处理、选择不行权、卖出Call被提前指派、组合里只有一边被处理。每种情况都要列出最终股票数量、现金和剩余义务，而不只画一条收益曲线。

### 拆股、分红等事件要一起改哪些数

这类事件统称公司行动。它可能改变股份数量、每股成本、未成交订单和期权应交付的东西。

以教学2:1拆股为例，100股变200股，每股成本从40变20，总成本仍是4000。不能只把图上的价格减半，就宣布账户亏了一半。实际订单和合约按相应通知处理，不能从股票拆分比例推断所有条款。

## 接着补，才能不高估模拟结果

### 一张订单可能走过多个状态

提交、接受、部分成交、全部成交、撤销和拒绝都要区分。TIF是有效时间；DAY指当日有效，IOC指立即成交能成交的部分并取消剩余，GTC也受券商期限约束。

例如想买1000股，先成交300股、再成交400股，剩下300股不等于已经买到。要分别记录数量、价格、时间和剩余订单怎么处理。

### 成本不只有佣金

点差是买卖报价之间的距离，滑点是实际成交与预期价格的差。没成交的部分也可能带来机会成本。implementation shortfall就是把原计划与实际执行放在一起比较造成的差额。

“零佣金”不能直接写成“零成本”。统一假设10个基点的成本，只是一组测试条件；一个基点是0.01个百分点，不是真实成交证据。

### 数据要保留当时的版本

actual是公布值，consensus是事前预期，prior是上一期值。先确认它们对应同一指标、月份与调整方式。

数据发布后可能修订。vintage表示当时那个版本。回放过去的决定不能用以后修订的数字。会议纪要通常也晚于会议决定；先画发布时间线，再决定当时能用哪份材料。

### 回测程序要承认自己没模拟什么

费用、怎样成交、价格偏差和可用资金应分开处理。停牌、部分成交和公司行动不能在程序里自动消失。

一个只按每天收盘价买卖的简化模型，可以用于学习算法，但要写明没有订单簿、没有逐笔顺序、没有真实成交保障。知名开源引擎也只是提供工具，不能保证某个策略有收益。

### 把订单、成交与持仓对起来

对账就是检查四件事：本地计划、对方接受的订单、成交回报、最终持仓。出现未知结果、重复记录或迟到成交时，不能直接重发订单；否则可能把同一笔交易做两遍。

课程可以用模拟数据演练这个过程，不需要接通真实券商。

## 进一步学习哪些产品差异

股票期权、ETF期权与指数期权可能有不同交割规则。VIX是衡量一类预期波动的指数，买期货或其他产品不等于直接持有今天的指数。开收盘拍卖会集中报价和数量，但买卖不平衡不是下一段价格方向的保证。

先查合约规格和如何结算，再谈交易方法。不要只根据名称猜风险。

## 推荐怎么实施

先检查资金，再检查市场状态，接着检查期权与公司行动后的持仓。然后记录订单全过程，保存数据版本，补齐模拟缺失条件，最后再加复杂产品。

每个重要问题都要有一道会改变结果的练习。例如：资金未结算时能否重复买卖、停牌时能否退出、只有一条期权腿被指派后还欠多少股票。题目答案需要有算式或可检查条件。

## 这份记录不能证明什么

原调查没有使用真实账户下单。后面的链接是当时保存的来源，本次没有逐条重开核实法规、时间、门槛或软件版本。文字改写不等于监管认证、真实成交验证，也不证明所有旧功能已经修复。

## 原记录的资料链接

- https://www.finra.org/investors/insights/frequent-intraday-trading
- https://www.sec.gov/compliance/risk-alerts/shortening-securities-transaction-settlement-cycle
- https://syndication.finra.org/content/understanding-new-intraday-margin-requirements
- https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210?page=1
- https://www.finra.org/investors/insights/extended-hours-trading
- https://www.nasdaq.com/holidayandtradinghours
- https://www.nyse.com/trade/trading-information
- https://www.nyse.com/publicdocs/nyse/NYSE_MWCB_FAQ.pdf
- https://www.nyse.com/regulation/corporate-actions-market-watch-proxy-compliance
- https://www.nyse.com/trade/auctions
- https://www.sec.gov/investor/pubs/regsho.htm
- https://prd-web.optionseducation.org/news/understanding-the-life-cycle-of-an-option-trade
- https://prd-web.optionseducation.org/optionsoverview/exercising-options
- https://www.finra.org/investors/insights/corporate-actions-public-companies-what-you-should-know
- https://www.finra.org/rules-guidance/rulebooks/finra-rules/5330
- https://www.optionseducation.org/referencelibrary/faq/splits-mergers-spinoffs-bankruptcies
- https://www.finra.org/investors/insights/time-parameters-qualifiers-stock-orders
- https://www.sec.gov/about/reports-publications/investorpubstradexec
- https://www.sec.gov/answers/bestex.htm
- https://www.bls.gov/schedule/2026/
- https://www.bls.gov/cpi/seasonal-adjustment/
- https://www.bls.gov/web/empsit/cesfaq.htm
- https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
- https://github.com/QuantConnect/Lean/blob/master/Common/Securities/Security.cs
- https://github.com/QuantConnect/Lean/blob/master/Algorithm.Python/CustomModelsAlgorithm.py
- https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/live.md
- https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/reconciliation.md
- https://prd-web.optionseducation.org/advancedconcepts/equity-vs-index-options
- https://www.cboe.com/tradable-products/vix/vix-futures/
