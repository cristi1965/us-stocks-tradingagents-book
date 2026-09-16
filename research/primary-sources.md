# 美股进阶课程一手来源底稿

核验日期：2026-09-13  
用途：为 20 章互动课程扩充提供事实边界，不构成投资建议。这里把官方材料能够直接支持的事实与课程设计推论分开；示例行情必须标明固定样本、时区和数据口径。

## 1. K 线、OHLCV 与订单执行

1. **事实**：Cboe Equity EOD Summary 的日级字段包括 Open、High、Low、Close、Trade Volume 和 VWAP；其中 Close 是正常交易时段的最后成交价。该产品覆盖美国全国交易所主上市股票和 ETF，不含 OTC。  
   **官方来源**：[Cboe Equity EOD Summary](https://datashop.cboe.com/equity-eod-summary)  
   **教学边界**：OHLCV 是特定时间窗内的历史成交汇总，不是盘口、可成交报价或订单回执。练习必须先声明正常交易时段/盘前盘后、时区、复权方式和标的覆盖范围。

2. **事实**：Consolidated Tape 报告交易所上市证券的最新成交价和成交量。  
   **官方来源**：[Investor.gov - Consolidated Tape](https://www.investor.gov/introduction-investing/investing-basics/glossary/consolidated-tape)  
   **教学边界**：K 线或最新成交价只能描述历史市场数据，不能证明读者能按该价格成交。

3. **事实**：市价单保证执行但不保证执行价格；限价单限制可接受价格但不保证成交；止损单到达止损价后转为市价单。  
   **官方来源**：[Investor.gov - Types of Orders](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders)  
   **教学边界**：课程应把“信号、提交订单、成交回报”拆成三个状态。回测不可默认在收盘价无摩擦成交，应显式处理点差、滑点、部分成交和未成交。

4. **事实**：订单执行并非瞬时；报价只对应有限股数，订单到达市场前价格可能变化，券商路由也会影响包括价格与费用在内的总成本。  
   **官方来源**：[Investor.gov - Executing an Order](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order)  
   **教学边界**：不得把屏幕上的最后成交价写成成交保证。互动题至少要区分 bid/ask、流动性、延迟和路由。

## 2. 仓位、保证金与杠杆

5. **事实**：保证金交易是从券商借入部分买入成本，因此会同时放大收益和损失。  
   **官方来源**：[FINRA - Stocks](https://www.finra.org/investors/investing/investment-products/stocks)  
   **教学边界**：杠杆不能只展示上行情景；每个仓位题都应同时计算最大可承受损失、跳空后损失、保证金余量和退出条件。

6. **事实**：Regulation T 下一般可为新购保证金证券借入最高相当于购买价 50% 的资金；维持保证金还受 FINRA 规则和券商更严格的 house requirements 约束。  
   **官方来源**：[FINRA - Margin Accounts](https://www.finra.org/rules-guidance/key-topics/margin-accounts)  
   **教学边界**：50% 是一般初始借款上限，不等于“2 倍杠杆是安全的”。课程必须区分现金账户/保证金账户、初始保证金/维持保证金、监管最低值/券商规则，并说明券商可能要求补充资金或平仓。

## 3. 宏观事件与收益率曲线

7. **事实**：美联储货币政策的法定目标是最大就业、稳定物价和适度长期利率；官方货币政策页提供 FOMC 日历、声明、会议纪要、新闻发布会和经济预测材料。  
   **官方来源**：[Federal Reserve - Monetary Policy](https://www.federalreserve.gov/monetarypolicy.htm)  
   **教学边界**：事件练习应以官方发布日期和当时可得材料为准，不能把事后发布的会议纪要、修订数据或后续解释回填进此前决策。

8. **事实**：美国财政部日度收益率曲线把收益率与期限相联系；Constant Maturity Treasury 利率由约美东时间 15:30 的指示性市场买价经收益率曲线插值得出，并非某一只国债的实际成交收益率。  
   **官方来源**：[U.S. Treasury - Daily Treasury Par Yield Curve Rates](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve)  
   **教学边界**：收益率曲线是期限截面，不能把插值 CMT 当成可成交报价。2Y/10Y、10Y/30Y 利差题必须保存观察日期、可得时间和数据版本。

9. **事实**：Federal Reserve H.15 提供名义与 TIPS 的常期限收益率和历史下载；常期限值使用 Treasury 的曲线插值方法。  
   **官方来源**：[Federal Reserve - H.15 Selected Interest Rates](https://www.federalreserve.gov/releases/h15/)  
   **教学边界**：可以用来教授期限利差和实际利率，但必须区分观测频率、发布日期与交易决策时点。

## 4. 美债价格、利率风险与久期

10. **事实**：固定利率债券价格通常与市场利率反向变化；到期时间越长，通常利率风险越高。美国国债仍然存在利率变化导致的市场价格风险。  
    **官方来源**：[Investor.gov - Interest Rate Risk](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86)  
    **教学边界**：“美债无风险”最多用于非常狭义的信用或名义兑付讨论，不能抹去到期前卖出的价格风险。

11. **事实**：Duration 虽以年表示，但它衡量债券价格对利率变化的敏感度；duration 越高，价格通常对利率变化越敏感。  
    **官方来源**：[FINRA - Duration: Understanding the Relationship Between Bond Prices and Interest Rates](https://www.finra.org/investors/insights/duration-what-interest-rate-hike-could-do-your-bond-portfolio)  
    **教学边界**：不能把 duration 等同于剩余期限，也不能把 `价格变化约等于 -Duration x 收益率变化` 当成大幅利率变动下的精确答案；进阶题要提示 modified duration、凸性和近似误差。

## 5. 期权 Greeks 与隐含波动率

12. **事实**：Delta、Gamma、Theta、Vega、Rho 是期权定价输入变化下的理论指引，不保证权利金会精确按 Greeks 变化；相关输入包括标的价、执行价、到期时间、隐含波动率、利率和预期普通股息。  
    **官方来源**：[Options Industry Council - Understanding Options Greeks](https://www.optionseducation.org/advancedconcepts/understanding-options-greeks)  
    **教学边界**：Greeks 是局部、模型依赖的敏感度，不是收益或方向预测。多个输入同时变化时，不得把单项 Greeks 机械相加并写成结果保证。

13. **事实**：历史波动率是对实际价格变化的统计度量；隐含波动率是由当前期权价格反映的市场预期波动。  
    **官方来源**：[Options Industry Council - Volatility and the Greeks](https://www.optionseducation.org/advancedconcepts/volatility-the-greeks)  
    **教学边界**：IV 不是方向预测，也不保证未来实现波动。IV Crush 练习必须区分 implied、historical/realized volatility，并注明期限结构和 skew 可能不同。

## 6. 行权、指派与标准化期权风险

14. **事实**：股票期权的行权和指派会导致取得或交付标的股票；未备兑期权卖方需要维持适用保证金。  
    **官方来源**：[OCC - Equity Options Product Specifications](https://www.theocc.com/clearance-and-settlement/clearing/equity-options-product-specifications)  
    **教学边界**：卖方在到期前也可能面对指派、资金和交割风险。课程不能只展示到期收益图，必须加入提前指派和账户资金不足的失败状态。

15. **事实**：OCC 明确说明期权有风险且不适合所有投资者，投资者在买卖标准化期权前应阅读《Characteristics and Risks of Standardized Options》。  
    **官方来源**：[OCC - Options Disclosure Document](https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document)  
    **教学边界**：教育内容、计算器或测验不能替代 ODD、券商的适当性判断和真实账户约束。

## 7. 回测证据与偏差

16. **事实**：Investor.gov 提醒，回测表现是假设性的，不反映实际表现；过去表现不能预测未来结果。  
    **官方来源**：[Investor.gov - Investment Adviser Advertisements and Hypothetical Performance](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-47)  
    **教学边界**：每个回测必须披露样本内/样本外、交易成本、数据修订、幸存者偏差、前视偏差和参数选择过程，不得把回测收益包装为可实现收益承诺。

17. **事实**：订单类型和执行机制意味着历史信号价不等于真实可成交价。  
    **官方来源**：[Investor.gov - Types of Orders](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders)、[Investor.gov - Executing an Order](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order)  
    **教学边界**：回测引擎若没有订单簿和逐笔成交数据，应明确称为近似成交模型，并对点差、滑点和未成交做保守压力测试。

## 8. TradingAgents 与课程 evidence gate

18. **事实**：TradingAgents 官方将项目定位为研究框架，并明确指出交易表现会受模型、temperature、交易时期、数据质量和其他非确定性因素影响，不构成金融、投资或交易建议；Portfolio Manager 批准后的订单被送到 simulated exchange。  
    **官方来源**：[TradingAgents README - Framework](https://github.com/TauricResearch/TradingAgents#tradingagents-framework)  
    **教学边界**：课程应坚持 Research/Paper-only，不能把框架输出称为券商执行或个性化投顾。任何真实下单能力都属于框架外的独立系统，需另设人工审批、风险限额、凭证和审计。

19. **事实**：官方复现说明指出，即使 ticker 和 date 相同，模型非确定性仍可能产生不同结果；历史日期运行时，live news/social 数据也会变化，回测不保证复现论文结果。  
    **官方来源**：[TradingAgents README - Reproducibility](https://github.com/TauricResearch/TradingAgents#reproducibility)  
    **教学边界**：不得用“同一天重跑”冒充 point-in-time 回放。课程凭证必须固定模型配置、输入快照、来源、抓取时间、错误状态和输出哈希。

20. **事实**：官方 README 的更新记录称 2026-06 版本加入 verified data-access contract，2026-07/08 版本修复 Alpha Vantage、FRED、社交情绪和 decision-log memory 的前视问题，并增加 Trader price grounding。  
    **官方来源**：[TradingAgents README - News](https://github.com/TauricResearch/TradingAgents#news)  
    **教学边界**：这些是项目对特定能力和修复的声明，不等于每一次课程运行都通过了完整、可审计的 evidence gate。准确表述应为：课程在官方 point-in-time 修复与 verified data 能力之上，额外实施自己的失败关闭证据门禁。

21. **事实**：官方 decision log 会在后续运行中获取已实现收益，并把同 ticker 的历史决定和跨 ticker lessons 注入 agent context。  
    **官方来源**：[TradingAgents README - Decision Log](https://github.com/TauricResearch/TradingAgents#decision-log)  
    **教学边界**：历史回测必须证明 memory 中只包含决策时点已经可得的信息，并隔离各回测路径的状态；否则后验收益或后续经验可能直接造成前视偏差。

### 建议的课程 evidence gate

以下是基于上述官方事实形成的**课程设计要求**，不是 TradingAgents 官方术语或官方完整规范：

- 只有在 `source URL/provider`、`as-of`、`available-at`、`ticker/instrument`、`window`、`field/unit`、`retrieved-at` 和原始快照标识齐全时，证据才可进入结论。
- 数据缺失、来源失败、时间穿越、标的错配、单位不明或快照不可追溯时，状态必须是 `research_unavailable`，不得用模型常识或旧缓存补成“当前事实”。
- 每个 BUY/HOLD/SELL 研究假设同时保存支持证据、反证、最大损失、失效条件、Paper 订单和模拟成交回执；缺任一关键风险字段即拒绝进入 Paper。
- 评测分别记录“研究结论正确性、证据契约完整性、模拟执行结果”，不能仅以最终盈亏反推当时决策合格。

## 面向 20 章扩充的使用顺序

- 基础图表章：用事实 1-4 建立 OHLCV、报价、订单和成交的状态差异。
- 风险与仓位章：用事实 5-6 设计 all-in、杠杆、补仓和强平的失败路径。
- 宏观与国债章：用事实 7-11 设计事件时点、曲线、期限利差和久期近似题。
- 期权章：用事实 12-15 设计 Greeks、IV Crush、提前指派和保证金题。
- 策略验证章：用事实 16-17 审核回测偏差和执行假设。
- AI 研究章：用事实 18-21 设计来源校验、point-in-time 回放、失败关闭、Paper 回执与复盘。

## 总边界

- 所有数值案例均是固定教学样本，不冒充当前行情。
- 不提供个性化买卖建议，不承诺收益，不以通过测验代表适合进行期权或保证金交易。
- 官方页面会更新；正式发布前应重新核验链接内容，并记录核验日期或固定版本。
