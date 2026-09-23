# 资料分别能帮我们确认什么

原稿核验日期为2026-09-13。下面把原稿的21项资料用途重新讲清楚。本次是白话改写，没有把旧日期改成新的核验日期。规则、软件版本和产品说明需要使用时重新查看原页面。

## 价格图记录了什么

1. **开、高、低、收、成交量。**一根K线把某段时间的成交记录压缩成几个数，英文简称OHLCV。先确认是否包含盘前盘后，以及是否调整过拆股。成交记录不是当前有人愿意买卖的报价。原稿用Cboe日级数据说明字段含义。

2. **最新成交不等于下一笔成交。**行情汇总记录市场刚才成交的价格和数量。你看到一笔100美元成交，不代表自己的订单也能在100美元成交。原稿引用Investor.gov的Consolidated Tape说明。

3. **订单写的是要求，不是结果。**市价单优先争取成交；限价单规定能接受的价格；止损单达到条件后才触发后续订单。真实结果还受到暂停交易、对手方数量和市场状态影响。不能把“发出订单”记作“已经成交”。

4. **成交需要时间，也可能分批。**每个报价可供交易的数量有限。订单到达时，价格可能已变。比较原计划和实际成交，要算价格差、费用与没成交的部分。原稿参考订单执行资料。

## 借钱和买多少

5. **借来的钱也会一起涨跌。**你用自己的钱加借款买资产，资产下跌时，借款通常不会自动减少。自己的钱因此可能亏得更快。教学不能只举上涨获利的例子。

6. **券商允许借多少，不等于你亏得起多少。**初始要求决定开仓要先出多少资金；维持要求决定持有期间至少保留多少。券商可以有更严格要求。原稿中的比例有适用条件，不能作为所有账户的通用值。现实使用要查看当前规则和券商通知。

## 经济消息与债券

7. **会议资料要按发布时间用。**政策声明、会议预测、新闻发布会和后来的会议纪要不是同一份材料。判断某一时刻的决定，只能用那时已公开的信息。FOMC是负责相关货币政策决定的委员会名称。

8. **收益率曲线是一组期限的比较。**它把不同剩余期限的债券收益率放在一起。某些官方常期限数值是从报价估算、插值得出的，不是某一只债券的实际成交价。2Y和10Y分别表示两年、十年期限。

9. **下载的数据也有日期和版本。**H.15是美联储的一组利率统计。使用它时要区分数据对应日、公开日和自己的决定时间；今天下载到的数据不一定等于过去当时看到的版本。

10. **国债也可能跌价。**固定现金流不变时，市场利率上升，旧债通常需要降价才能吸引买家。讨论到期偿付和讨论提前卖出能收回多少钱，是两件事。

11. **久期不是简单的“还有几年到期”。**修正久期可近似估算价格对收益率小幅变化的反应。例：系数为4，收益率上涨0.1个百分点，也就是0.001，价格变化约为−4×0.001=−0.4%。大幅变化时误差可能明显，不能把近似当精确值。

## 期权为何涨跌

12. **Greeks是一组变化速度。**Delta看股价小幅变化，Gamma看Delta怎样变化，Theta看时间，Vega看隐含波动率，Rho看利率。模型给的是一定条件下的近似，不能保证成交价严格照着变化。

13. **历史波动与隐含波动不同。**历史波动统计过去涨跌；隐含波动率IV是从当前期权价格反推的波动定价。IV高不是上涨概率高。不同到期日和行权价可以有不同IV；所谓IV Crush是IV明显下降，不是每一张期权都必然亏钱。

14. **行权会带来实际义务。**股票期权在适用条件下可能使买方取得或卖出股票，使卖方被要求交付或接收股票。看懂到期盈亏图后，还要检查数量、现金和交割规则。一个价差组合的一边被处理，另一边不一定自动按你期望处理。

15. **练习不能替代产品说明。**OCC的标准期权风险披露文件解释合约与风险。读者还要确认券商如何处理行权、指派和到期。答对题不代表已经满足真实账户的资格或资金条件。

## 用过去行情测试，有哪些陷阱

16. **回测是假设发生过的交易。**过去价格已知，不等于当时一定能按那个价格成交。只挑今天还活着的公司、提前使用以后才公开的信息、反复调参数，都可能让成绩看起来过好。

17. **“信号出现价”不是成交承诺。**如果没有逐笔报价和成交数据，程序常要假设怎样成交。应明确这是假设，并分别测试费用更高、价格更差和部分没成交的情况。

## AI研究能做什么，不能做什么

18. **TradingAgents是研究框架，不是收益承诺。**不同软件角色整理资料、讨论理由，但模型、输入数据和设置不同，结果可以不同。课程中的模拟订单不是券商真实执行。

19. **同股票、同日期，不一定重现同结果。**模型可能产生不同回答；新闻和社交信息也可能更新。真正复盘要保存当时输入、模型设置和资料版本，不能只写股票代码和日期。

20. **更新日志是项目自身的声明。**原稿记录了某些版本声称修复数据访问和未来信息泄漏。保留版本记录可以帮助检查，但不能据此说每一次课程运行都验证通过。每次仍需核对输入与时间。

21. **记忆也可能偷偷带来未来信息。**如果AI看到了后来才实现的收益，再回去评价之前的决定，就相当于提前知道答案。历史模拟要隔离各次运行状态，只使用当时已知的经验。

## 课程怎样检查一份AI输出

先列清楚：来源、数据对应时刻、何时公开、股票或合约、时间范围、字段与单位、采集时刻、原始副本。任一关键项缺失就写“目前无法判断”，不要让AI用常识补成实时事实。

再写看好理由、可能推翻判断的事实、计划损失、退出条件和模拟执行记录。最后分别评价资料是否可靠、判断是否合理、模拟发生了什么，不能只用最后赚钱与否倒推当时做得对不对。

下方保留原稿资料链接，便于逐项回看。引用标题和网址不翻译成新的程序标识。

## 原记录的资料链接

- https://datashop.cboe.com/equity-eod-summary
- https://www.investor.gov/introduction-investing/investing-basics/glossary/consolidated-tape
- https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders
- https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order
- https://www.finra.org/investors/investing/investment-products/stocks
- https://www.finra.org/rules-guidance/key-topics/margin-accounts
- https://www.federalreserve.gov/monetarypolicy.htm
- https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve
- https://www.federalreserve.gov/releases/h15/
- https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86
- https://www.finra.org/investors/insights/duration-what-interest-rate-hike-could-do-your-bond-portfolio
- https://www.optionseducation.org/advancedconcepts/understanding-options-greeks
- https://www.optionseducation.org/advancedconcepts/volatility-the-greeks
- https://www.theocc.com/clearance-and-settlement/clearing/equity-options-product-specifications
- https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document
- https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-47
- https://github.com/TauricResearch/TradingAgents#tradingagents-framework
- https://github.com/TauricResearch/TradingAgents#reproducibility
- https://github.com/TauricResearch/TradingAgents#news
- https://github.com/TauricResearch/TradingAgents#decision-log
