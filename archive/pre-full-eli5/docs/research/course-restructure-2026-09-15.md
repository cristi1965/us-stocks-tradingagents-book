# 《漫画美股》课程结构与交互调研

> 这是一份2026-09-15的设计记录。白话来说：少堆内容，先讲清一个问题，再给例子和练习。文中的四步是内容顺序，不要求把阅读拆成四个互斥页面。技术缩写见 [阅读说明](../reading-guide.md)。

## 结论

课程不应继续按“对话、背景、例子、原则、题目”平铺累加。每章统一为四步：

1. 懂背景：概念、适用范围和不能推出什么。
2. 看例子：图表或数字场景，允许查看过程。
3. 做判断：一次只完成一个决策，不混考多个新概念。
4. 记规则：反馈、错误原因和可迁移检查项。

## 一手与开源参考

- TradingView Lightweight Charts：提供价格轴、时间轴、十字线和公开坐标转换 API，适合替换手写 canvas 推算。来源：https://github.com/tradingview/lightweight-charts
- ChartDojo：用短挑战、即时反馈、XP/连续学习组织技术分析训练；可借鉴“短练习”，不照搬形态预测。来源：https://github.com/michaelsboost/ChartDojo
- SEC Investor.gov：订单教育明确区分 stop、stop-limit 和 trailing stop；stop 价不是保证成交价。来源：https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15
- BLS CPI：CPI 有总体、核心及不同时间变化口径；比较实际与预期前必须保证同口径。来源：https://www.bls.gov/cpi/questions-and-answers.htm
- Federal Reserve SEP：经济预测包含增长、就业、通胀和适当政策利率路径，点阵图不是委员会承诺。来源：https://www.federalreserve.gov/faqs/summary-economic-projections-sep.htm
- Options Industry Council：课程按学习路径组织期权基础、策略和风险工具。来源：https://www.optionseducation.org

## 采用

- 固定四步学习循环和即时反馈。
- 图表必须显示价格、时段和可读取 OHLCV。
- 每个概念先给边界，再给操作题。
- 进度按可验证能力记录，而不是按阅读或点击记录。
- 错题保留原因，允许回到对应背景和例子。

## 不采用

- 不把 K 线形态当作确定性预测。
- 不用盈利奖励掩盖违规决策。
- 不接实盘自动交易。
- 不用更多卡片和动画替代课程结构。

## 后续优先级

1. 盘口分档成交与订单取舍模拟。
2. 带价格轴、时段和 tooltip 的 K 线回放。
3. RVOL 同时段基准计算。
4. 跳空计划损失与实际损失对照。
5. CPI/FOMC 多分支反例。
6. 五个期权章节各自独立的数值实验。
