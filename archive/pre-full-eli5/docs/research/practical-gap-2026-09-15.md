# 《漫画美股》真实 Paper / 交易决策知识缺口审计

> 这份记录保存的是2026-09-15的调查结论。它在问四件事：钱够不够、市场能不能成交、期权到期后要交什么、数据当时是否已经知道。下面的规则日期和旧文件行号按原记录保留，本次文字检查不代表重新核实了这些规则。缩写见 [阅读说明](../reading-guide.md)。

- 审计日期：2026-09-15（Asia/Shanghai）
- 课程范围：`interactive/`
- 外部来源范围：SEC、FINRA、Federal Reserve、BLS、Cboe、OCC/OIC、Nasdaq、NYSE 的官方资料，以及优秀开源项目的官方仓库/文档。
- 约束：只评估知识与训练缺口；不建议接通实盘，不把 Paper 盈亏当作真实成交证明，不把市场相关性写成因果。

## 1. 结论

课程已经不是“只教 K 线”的入门课。它覆盖交易时段、基础订单、点差/滑点、仓位与回撤、CPI/FOMC/收益率、财报跳空、Greeks/IV/价差、证据时效与 Paper-only 风险门（课程证据：`interactive/chapters.js:2-21`；`interactive/course-v2.js:1-12,26`；`interactive/upgrades.js:143-165`）。

真正影响真实 Paper 或未来交易决策的主要短板，不是再增加形态，而是补齐四类“交易管道事实”：

1. **账户能否执行**：T+1、现金账户 settled cash、盘中保证金及券商过渡状态目前没有进入决策门。
2. **市场是否允许成交**：Reg SHO、LULD、全市场熔断、新闻停牌和重开拍卖没有进入订单状态机。
3. **合约到期后会发生什么**：课程提醒了提前指派，但没有让学习者处理自动行权、反向指令、盘后标的波动和交割后的股票/现金头寸。
4. **数据是否属于同一版本**：课程会读 actual/consensus/prior，却没有要求保存 BLS 数据的季调口径、发布时间、首次值与修订版本；回测也没有成交、费用、购买力和公司行动模型。

因此建议先做 P0 的“能否下单/能否成交/会得到什么头寸”，再做 P1 的“成交质量/数据版本/回测真实性”，最后才扩展 P2 的波动率和产品细节。

## 2. 判定口径

- **法规/规则**：监管机构、交易所或清算机构明确规定的义务、限制、时间或处理方式；课程必须标注“截至何日”和适用范围。
- **市场机制**：市场、交易所、清算或数据系统如何实际处理订单、停牌、拍卖、行权和结算；不等同于交易建议。
- **实践建议**：基于前述规则，为 Paper 训练增加的字段、门禁或情景；不是法规要求。
- **推论**：由课程现状与一手资料共同推出的课程设计判断；不会写成收益或价格因果。

优先级定义：

- **P0**：缺失可能使 Paper 训练给出“可下单、可成交、风险已封顶”的错误结论，或让未来真实账户出现限制、强制处理、意外股票头寸。
- **P1**：缺失会系统性高估成交/回测质量，或让宏观事件记录不可复现。
- **P2**：能提升产品辨识与研究深度，但不应阻塞基础 Paper 训练。

| 优先级 | 缺口 | 为什么现在要补 |
|---|---|---|
| P0 | T+1 / settled cash / 盘中保证金版本 | 决定账户是否允许交易，且 2026-2027 正处规则迁移期。 |
| P0 | 延长时段 / 交易日历 / official close | 决定报价保护、可用订单和滑点基准是否成立。 |
| P0 | LULD / MWCB / 新闻停牌 / 重开 | 决定订单能否成交以及缺口风险是否需要重算。 |
| P0 | 卖空 locate / SSR / close-out | 决定 `SELL` 能否建立空仓，不能由看空观点代替。 |
| P0 | 期权行权 / 指派 / 交割 | 决定“定义风险”结构到期后实际得到什么头寸。 |
| P0 | 公司行动端到端处理 | 同时影响价格序列、未成交订单、持仓和期权交割物。 |
| P1 | TIF / 拍卖 / 订单生命周期 | 避免把提交订单等同于完整成交。 |
| P1 | 成交质量 / 宏观 vintage / 回测现实模型 / 对账 | 避免 Paper 与回测系统性高估可复制性。 |
| P2 | 指数期权、VIX、拍卖深度 | 提升产品辨识和市场结构深度，但不阻塞基础训练。 |

## 3. 当前已有覆盖，避免重复建设

| 已覆盖能力 | 课程证据 | 审计判断 |
|---|---|---|
| 常规、盘前、盘后与隔夜风险；盘后使用限价并缩量 | `interactive/chapters.js:2`；`interactive/chapter-depth.js:2` | 保留；需要补“延长时段没有常规 NBBO 保护、券商规则各异”的可验证边界。 |
| 市价、限价、止损，点差、滑点、部分成交和跳空 | `interactive/chapters.js:8`；`interactive/chapter-depth.js:8` | 基础正确；不要重复讲定义，改为订单生命周期与停牌/拍卖情景。 |
| 单笔风险、相关风险簇、回撤熔断、保证金购买力不等于风险预算 | `interactive/chapters.js:9-11`；`interactive/course-v2.js:26` | 风险观念较完整；缺账户规则、盘中缺口与券商 house requirement。 |
| CPI actual/consensus/prior 与跨资产观察 | `interactive/chapters.js:12`；`interactive/upgrades.js:107-120` | 已避免“数据高于预期所以股票必跌”的因果错误；缺版本、季调、发布时间和修订。 |
| FOMC 声明、SEP/点阵图、发布会三阶段剧本 | `interactive/chapters.js:13`；`interactive/course-v2.js:26` | 已覆盖条件剧本；缺官方日历、minutes 的三周滞后和事件时间戳。 |
| 2Y/10Y/30Y、久期近似和曲线 | `interactive/chapters.js:14`；`interactive/mastery.js:4,12` | 已覆盖方向与一阶近似；无需再加“收益率升、债价跌”的重复内容。 |
| 财报跳空和事件前压力测试 | `interactive/chapters.js:15`；`interactive/chapter-depth.js:15` | 已明确止损不能消除缺口；需与停牌、开盘拍卖和期权到期处理相连。 |
| 期权乘数、Greeks、IV Crush、定义风险价差 | `interactive/chapters.js:16-19`；`interactive/upgrades.js:67-104` | 数值基础较好；“定义风险”仍未覆盖指派后股票头寸、盘后行权选择与公司行动交割物。 |
| 来源、时间戳、反证、失效条件和 fail-closed Paper 风险门 | `interactive/chapters.js:20-21`；`interactive/upgrades.js:143-165` | 应作为新增模块的统一验收框架；保持 Paper-only。 |
| 样本内/外、固定 bp 成本和组合压力 | `interactive/mastery.js:10-11`；`interactive/chapter-depth.js:22` | 已建立反过拟合意识；模拟成交仍过于理想化。 |

## 4. P0 缺口

### P0-1：T+1、现金账户 settled cash 与盘中保证金没有成为下单前置条件

- **法规/规则事实**：多数美股交易当前按 T+1，即交易日后的下一个营业日结算；现金账户必须用已结算资金全额付款，使用未结算卖出款买入后又在其结算前卖出，可能构成 good faith violation；未付款即卖出可构成 free-riding。[FINRA：Frequent Intraday Trading](https://www.finra.org/investors/insights/frequent-intraday-trading)（访问：2026-09-15）；[SEC：Shortening the Securities Transaction Settlement Cycle](https://www.sec.gov/compliance/risk-alerts/shortening-securities-transaction-settlement-cycle)（访问：2026-09-15）。
- **法规/规则事实，时效敏感**：FINRA 新盘中保证金要求于 2026-06-04 生效，但券商可在过渡期内继续旧 PDT 制度或提前迁移，过渡期到 2027-10-20；新框架取消统一的 25,000 美元 PDT 门槛和按次数认定，改为盘中权益/头寸监控，券商仍可提高 house requirements。[FINRA：Understanding the New Intraday Margin Requirements](https://syndication.finra.org/content/understanding-new-intraday-margin-requirements)（访问：2026-09-15）；[FINRA Rule 4210](https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210?page=1)（访问：2026-09-15）。
- **当前缺口**：课程只说“保证金购买力不是风险预算”（`interactive/course-v2.js:26`），Paper 账户却只有 cash/equity/position，没有 settled cash、settlement date、account regime、intraday margin deficit 或 broker transition mode（`interactive/course-sim.js:4-8`）。
- **影响**：同一个高频交易计划可能在现金账户违反资金结算约束，或在不同过渡状态的保证金账户被阻止/产生 margin deficit；仅凭仓位风险百分比无法判断“能否下单”。
- **实践建议**：Paper 账户增加 `account_type`、`settled_cash`、`unsettled_proceeds[]`、`settlement_date`、`margin_regime_as_of`、`broker_house_requirement`；每笔订单先输出“允许/拒绝/需核实券商”及依据。
- **验收**：覆盖周五卖出、周末、交易所休市日、同日重复买卖；在 2027-10-20 前，保证金题必须允许“券商仍在旧制度”和“已迁移新制度”两条分支，不把任一制度写成全市场唯一现状。

### P0-2：延长时段只讲“更薄”，没有讲保护边界、官方收盘和券商差异

- **市场机制事实**：常规交易时段为 9:30-16:00 ET；FINRA 将典型盘前描述为 7:00-9:30 ET、盘后为 16:00-20:00 ET，并指出部分零售渠道还有隔夜交易。延长时段市场不互联，常规时段发布的 NBBO 不适用；订单可能部分成交或不成交，券商可限制产品、时段和订单类型。[FINRA：Extended-Hours Trading](https://www.finra.org/investors/insights/extended-hours-trading)（访问：2026-09-15）。
- **市场机制事实**：4:00 p.m. 的交易所价格是官方收盘；延长时段交易不改变该官方收盘，也不决定次日开盘。[FINRA：Extended-Hours Trading](https://www.finra.org/investors/insights/extended-hours-trading)（访问：2026-09-15）。
- **市场机制事实**：Nasdaq 公布 2026 休市和提前收盘日；例如感恩节次日及圣诞节前一日为 1:00 p.m. ET 提前收盘。[Nasdaq：U.S. Holiday & Trading Hours](https://www.nasdaq.com/holidayandtradinghours)（访问：2026-09-15）。
- **当前缺口**：课程要求确认 session、点差、深度和限价（`interactive/chapter-depth.js:2`），但没有让学习者区分“官方 close”“last extended-hours trade”“次日 auction open”，也没有交易日历与提前收盘输入。
- **影响**：Paper 订单可能拿错误参考价衡量滑点，或假设在休市/提前收盘后仍能按常规机制成交。
- **实践建议**：每笔 Paper 订单绑定 `session`、`venue/broker availability`、`quote_scope`、`official_close`、`calendar_version`；延长时段统一显示“无常规 NBBO 保护，需核实券商限制”。
- **验收**：同一证券在 15:59、16:01、提前收盘后的订单分别给出不同状态，不把盘后最后价当官方收盘或次日开盘保证。

### P0-3：没有 LULD、全市场熔断、新闻停牌与重开拍卖状态

- **市场机制事实**：LULD 在 9:30-16:00 ET 防止 NMS 股票在动态价格带外成交，价格带参考前五分钟平均价格；它与全市场熔断不是同一机制。[NYSE：Trading Information - LULD](https://www.nyse.com/trade/trading-information)（访问：2026-09-15）。
- **市场机制事实**：全市场熔断以标普 500 相对前收盘的单日跌幅为阈值，Level 1/2/3 分别为 7%/13%/20%；Level 1/2 在 3:25 p.m. 前触发时至少暂停 15 分钟，Level 3 当日停止交易。[NYSE：Market-Wide Circuit Breakers FAQ](https://www.nyse.com/publicdocs/nyse/NYSE_MWCB_FAQ.pdf)（访问：2026-09-15）。
- **市场机制事实**：NYSE 会因待发布重大新闻、反向拆股、并购生效等情形实施停牌；重开由拍卖处理，订单接受与成交不是“恢复后立即按停牌前价”。[NYSE Regulation：Corporate Actions, Market Watch & Proxy Compliance](https://www.nyse.com/regulation/corporate-actions-market-watch-proxy-compliance)（访问：2026-09-15）；[NYSE：Auctions](https://www.nyse.com/trade/auctions)（访问：2026-09-15）。
- **当前缺口**：课程有自定义“账户熔断”（`interactive/chapters.js:11`），但没有市场级 `LIMIT_STATE/HALTED/QUOTE_ONLY/REOPENING_AUCTION`；这两个“熔断”容易被混为一谈。
- **影响**：止损、撤单和市价退出在停牌期间可能无法按计划执行；重开价格由聚合供需和拍卖约束形成，计划损失可能被低估。
- **实践建议**：新增“个股 LULD / 新闻停牌 / MWCB / 账户熔断”四分题；Paper 订单状态机至少包含 `NEW/PARTIAL/FILLED/CANCELED/REJECTED/HALTED/PENDING_REOPEN`。
- **验收**：给出财报待发布停牌、LULD、Level 1 和 Level 3 四个场景，学习者必须正确判断能否成交、是否接受新订单、何时需重算缺口风险；具体交易所规则必须带版本日期。

### P0-4：课程没有卖空可借性、SSR 与强制回补链路

- **法规/规则事实**：Regulation SHO 要求卖空订单标记；券商在执行卖空前一般必须有合理依据相信证券可借并记录 locate。[SEC：Key Points About Regulation SHO](https://www.sec.gov/investor/pubs/regsho.htm)（访问：2026-09-15）。
- **法规/规则事实**：个股单日下跌至少 10% 会触发 Rule 201 卖空价格测试，限制适用于当日余下时间和下一交易日；Reg SHO 另有 fail-to-deliver close-out 与 threshold securities 要求。[SEC：Key Points About Regulation SHO](https://www.sec.gov/investor/pubs/regsho.htm)（访问：2026-09-15）。
- **当前缺口**：28 章路线和 21 个详细章节均没有 short/borrow/locate/SSR 训练（正向覆盖清单：`interactive/course-v2.js:2-9`；`interactive/chapters.js:2-21`）。
- **影响**：把“看空”直接翻译成 `SELL` 会制造并不存在的可成交性；Paper 盈亏会忽略无法 locate、价格测试与回补约束。
- **实践建议**：默认 Paper 卖空 fail closed；只有显式输入 `borrowable_at`、`locate_status`、`short_sale_marking`、`SSR_status`、`borrow_cost_assumption` 后才允许模拟，并把借券成本标为券商/时点依赖，不给固定通用费率。
- **验收**：至少覆盖无 locate、触发 SSR、借券状态在持仓期变化、停牌后重开四个场景；课程必须明确“价格下跌与裸卖空指控之间不能仅凭相关性建立因果”。

### P0-5：期权“定义风险”没有走完自动行权、指派与交割

- **清算/合约事实**：美股和 ETF 期权通常是 American-style，可在到期前行权；短方可在到期前被指派。[OCC/OIC：Understanding the Life Cycle of an Option Trade](https://prd-web.optionseducation.org/news/understanding-the-life-cycle-of-an-option-trade)（访问：2026-09-15）。
- **清算/合约事实**：到期时，OCC 对价内至少 0.01 美元的合约实行 exercise-by-exception，但持有人可提交 contrary instruction；价外也可选择行权，价内也可选择不行权。[OCC/OIC：Understanding the Life Cycle of an Option Trade](https://prd-web.optionseducation.org/news/understanding-the-life-cycle-of-an-option-trade)（访问：2026-09-15）。
- **清算/合约事实**：美国式 Call 的提前行权/指派可能与除息日有关；券商的客户指派方法和行权截止时间可能不同。[OCC/OIC：Exercising Options](https://prd-web.optionseducation.org/optionsoverview/exercising-options)（访问：2026-09-15）。
- **当前缺口**：课程文字提醒“短腿提前指派与到期处理”（`interactive/upgrades.js:79,101`），但模拟只把 long Call 到期归零，没有 exercise、assignment、contrary instruction、股票交割或购买力检查（`interactive/course-sim.js:3-8`）。
- **影响**：debit spread 的到期图显示最大损失，并不保证学习者不会因一腿被指派、另一腿未处理、盘后价格变化或资金不足而获得意外股票/空头头寸。
- **实践建议**：增加 expiry eve / after-hours / assignment morning 三阶段；输出每腿状态、交割物、所需现金/股票、是否触发券商风险处置。仍只在 Paper 中模拟。
- **验收**：长 Call 自动行权、价内但提交不行权、短 Call 提前指派、价差仅一腿被指派四个案例都必须算出次日头寸与现金变化，不能只画到期收益线。

### P0-6：公司行动没有进入订单、价格序列和期权交割物

- **市场机制事实**：公司行动包括分红、拆股/反向拆股、并购、权利发行等，可能改变股票代码、股份数量或持仓权利；交易所上市公司的公司行动由上市交易所处理。[FINRA：Corporate Actions by Public Companies](https://www.finra.org/investors/insights/corporate-actions-public-companies-what-you-should-know)（访问：2026-09-15）。
- **规则事实**：在适用条件下，券商持有的未成交订单会在除息、除权或拆股日调整价格和/或数量，除非订单带有相应的不调整指令。[FINRA Rule 5330：Adjustment of Orders](https://www.finra.org/rules-guidance/rulebooks/finra-rules/5330)（访问：2026-09-15）。
- **清算/合约事实**：拆股、并购、分拆和破产等公司行动可能改变期权合约的标的交割物、名称或数量；应以 OCC adjustment memo 为准。[OCC/OIC：Splits, Mergers, Spinoffs & Bankruptcies](https://www.optionseducation.org/referencelibrary/faq/splits-mergers-spinoffs-bankruptcies)（访问：2026-09-15）。
- **当前缺口**：课程仅在 K 线口径里写“处理拆股、分红复权并保留原始字段”（`interactive/chapter-depth.js:4`），没有订单调整、持仓换股、零碎股、期权 deliverable 或事件 memo 训练。
- **影响**：未复权价格可能制造虚假跳空；只复权图表却不复算订单/持仓会破坏 Paper 账本；期权仍假设固定 100 股交割会给出错误风险。
- **实践建议**：建立 `corporate_action_event`，同时作用于 raw/adjusted price、open orders、positions 和 option deliverable；事件必须保存官方公告/交易所或 OCC memo URL、effective date 与处理版本。
- **验收**：2:1 拆股、1:20 反向拆股、普通现金分红、并购换股各跑一次账本不变量检查；调整前后总经济暴露变化必须可解释，不能仅凭价格缺口判断收益或损失。

## 5. P1 缺口

### P1-1：订单类型有定义，但缺 time-in-force、拍卖截止和完整生命周期

- **市场机制事实**：Day、GTC、IOC、FOK、AON、MOO/MOC 等时间参数会改变未成交数量如何处理；MOO/MOC 有提交、修改和撤销限制。[FINRA：Trading Terms - Time Parameters and Qualifiers](https://www.finra.org/investors/insights/time-parameters-qualifiers-stock-orders)（访问：2026-09-15）。
- **市场机制事实**：NYSE 开盘/收盘拍卖发布 imbalance；NYSE 的 MOC/LOC 常规截止为 3:50 p.m. ET，之后撤销会被拒绝，4:00 p.m. 开始收盘拍卖。[NYSE：Auctions](https://www.nyse.com/trade/auctions)（访问：2026-09-15）。
- **当前缺口**：课程把订单选择简化为“小盘股：限价 + 缩量”（`interactive/course-v2.js:19`），Paper orders 只有 side/qty/price，没有 TIF、submitted/accepted/partial/canceled/rejected 时间线（`interactive/course-sim.js:4-8`）。
- **实践建议**：用一笔 1,000 股订单演示 300/400/300 三次 fill、cancel/replace、部分成交后的风险预算和收盘拍卖冻结；不要为所有券商声称统一支持同一 TIF。

### P1-2：成交质量没有从“滑点数字”升级到路由与可比较证据

- **市场机制事实**：券商负有寻求 reasonably available best execution 的义务；订单可能被送往交易所、做市商、ECN 或内部化，SEC 要求公开订单路由和执行质量信息。[SEC：Trade Execution](https://www.sec.gov/about/reports-publications/investorpubstradexec)（访问：2026-09-15）；[SEC：Best Execution](https://www.sec.gov/answers/bestex.htm)（访问：2026-09-15）。
- **当前缺口**：课程只记录统一滑点缓冲或固定 bp 成本（`interactive/course-v3.js:5`；`interactive/mastery.js:10-11`），没有 quote timestamp、bid/ask、NBBO scope、order route、fill timestamp、price improvement 或 fill rate。
- **实践建议**：Paper 回放保存 decision quote 与 fill evidence，至少比较实现短缺、点差、成交率和延迟；把“零佣金”与“零交易成本”分开。
- **推论**：单一 `10 bp` 成本不是错，但只能是敏感性情景，不能充当真实执行证据。

### P1-3：宏观模块没有“数据发布契约”和 revision-aware 复盘

- **官方数据事实**：BLS 2026 发布日历明确列出发布时间并使用 ET；CPI、Employment Situation 等重要发布通常在 8:30 a.m. ET，但具体日期应从当年官方日历读取。[BLS：Schedule of Selected Releases 2026](https://www.bls.gov/schedule/2026/)（访问：2026-09-15）。
- **官方数据事实**：CPI 同时有季调与未季调数据；每年更新季调因子时，最近五年季调指数可能被修订。[BLS：Seasonal Adjustment in the CPI](https://www.bls.gov/cpi/seasonal-adjustment/)（访问：2026-09-15）。
- **官方数据事实**：CES 非农初值会在随后两个月各修订一次，并按年度 benchmark 重新锚定；因此今天下载的历史值可能不是事件当时看到的 vintage。[BLS：CES Frequently Asked Questions](https://www.bls.gov/web/empsit/cesfaq.htm)（访问：2026-09-15）。
- **官方事件事实**：FOMC 每年通常有八次例会；例会 minutes 在政策决定后三周发布，SEP 只随标记的会议发布。[Federal Reserve：FOMC Calendars](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm)（访问：2026-09-15）。
- **当前缺口**：课程有 actual/consensus/prior 和多资产反应，但输入没有 `release_id`、`reference_period`、`release_at_et`、`seasonal_adjustment`、`vintage_at_decision`、`revision`（`interactive/upgrades.js:107-120`）。
- **实践建议**：宏观卡片必须绑定 BLS/Fed 直链和事件时间；复盘同时展示“当时 vintage”和“当前修订值”，禁止用修订后的历史数据改写当时判断。
- **推论**：数据与资产同向/反向的单次反应只能记录为条件观察，不能证明该数据造成价格变化。

### P1-4：回测的成交、购买力和公司行动模型不足以支持 Paper 迁移

- **开源实现事实**：LEAN 将 fee、fill、slippage、buying power 作为独立现实模型，而不是一个总成本常数。[QuantConnect LEAN：Security.cs](https://github.com/QuantConnect/Lean/blob/master/Common/Securities/Security.cs)（访问：2026-09-15）；[QuantConnect LEAN：CustomModelsAlgorithm.py](https://github.com/QuantConnect/Lean/blob/master/Algorithm.Python/CustomModelsAlgorithm.py)（访问：2026-09-15）。
- **开源实现事实**：NautilusTrader 明确区分回测与 live 的 venue、transport、timing、persistence、external activity 与 reconciliation，并用订单/成交/持仓报告校准内部状态。[NautilusTrader：Live Trading](https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/live.md)（访问：2026-09-15）；[NautilusTrader：Execution Reconciliation](https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/reconciliation.md)（访问：2026-09-15）。
- **当前缺口**：课程趋势回测按收盘数组和固定 bp 直接改变净值（`interactive/mastery.js:10-11`），无法表达 bid/ask、bar 内先后顺序、订单失效、部分成交、停牌、资金结算和公司行动。
- **实践建议**：先给回测结果标 `toy_model`，再新增最小保守成交模型；每项无法模拟的机制显式列为 `unavailable`，不静默假设成交。
- **推论**：开源引擎不是收益正确性的背书；它们说明真实模拟至少需要哪些独立模型和状态边界。

### P1-5：Paper 账本没有“外部现实对账”概念

- **开源实现事实**：成熟执行引擎会在启动和运行期间对账订单、成交与持仓，识别遗漏 fill、外部订单、部分成交后撤销和本地/场所状态差异；对账失败时不应继续启动交易。[NautilusTrader：Execution Reconciliation](https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/reconciliation.md)（访问：2026-09-15）。
- **当前缺口**：课程的 Paper 账本完全由前端预设 chapter outcome 更新，不存在 unknown、duplicate、late fill 或 reconciliation（`interactive/course-sim.js:3-8`）。
- **实践建议**：即使不接实盘，也应训练“本地计划、券商订单、成交回报、最终持仓”四栏核对；任何未知结果先冻结新增风险，而不是重发订单。
- **边界**：本建议是交易系统素养训练，不授权课程连接券商或自动实盘。

## 6. P2 缺口

### P2-1：股票/ETF 期权与指数期权的风格和结算差异

- **合约事实**：标准股票期权通常实物交割股票；部分指数期权现金结算，行权风格和结算值形成方式也可能不同。[OCC/OIC：Equity vs. Index Options](https://prd-web.optionseducation.org/advancedconcepts/equity-vs-index-options)（访问：2026-09-15）。
- **当前缺口**：课程所有期权例子都默认 100 股乘数和股票交割（`interactive/chapters.js:16-19`）。
- **实践建议**：在 P0 到期流程完成后，再增加 contract-spec lookup 题；禁止从代码名称猜交割方式。

### P2-2：VIX 现货指数与可交易衍生品没有分开

- **产品事实**：VIX futures 反映市场对不同未来到期日 VIX 水平的估计；它不是把当下 VIX 指数直接持有到未来。[Cboe：VIX Futures](https://www.cboe.com/tradable-products/vix/vix-futures/)（访问：2026-09-15）。
- **当前缺口**：课程讲 IV 和 Vega，但没有波动率期限结构或“指数、期货、期权”标的差异（课程范围：`interactive/course-v2.js:7-9`）。
- **实践建议**：只作为进阶产品辨识；先教 quote/contract/settlement，再谈对冲，不把 VIX 上升与股票下跌写成必然因果。

### P2-3：官方开盘/收盘拍卖数据可作为“价格发现”案例

- **市场机制事实**：NYSE 从 8:00 a.m. 开始发布开盘 imbalance，并在 3:50 p.m. 后按秒发布收盘 imbalance；indicative match price、paired quantity、imbalance 和 collars 是不同字段。[NYSE：Auctions](https://www.nyse.com/trade/auctions)（访问：2026-09-15）。
- **当前缺口**：课程把 open/close 当 K 线字段（`interactive/chapters.js:3-4`），没有解释官方 open/close 可由拍卖形成。
- **实践建议**：用于解释财报后开盘缺口和指数调仓日收盘流动性；不要把 imbalance 方向直接当下一时段收益预测。

## 7. 推荐课程实施顺序

1. **账户门**：T+1、settled cash、2026-2027 保证金制度版本与券商状态。
2. **市场状态机**：常规/延长时段、LULD、新闻停牌、MWCB、重开拍卖。
3. **头寸终态**：期权 exercise/assignment、公司行动、股票/现金交割物。
4. **订单证据**：TIF、部分成交、cancel/replace、quote/fill 时间戳与成交质量。
5. **数据版本**：BLS/Fed 官方日历、vintage、revision、季调口径。
6. **模拟真实性**：fee/fill/slippage/buying-power 分离，无法模拟项显式 unavailable。
7. **进阶产品**：指数期权和 VIX 期限结构。

不建议把以上内容做成七篇纯文字。每个 P0 至少要有一个会改变订单或持仓状态的 Paper 场景，并复用课程已有的来源、时间、反证、失效条件和 fail-closed 验收。

## 8. P0 最小验收清单

| 场景 | 必须输出 | 失败条件 |
|---|---|---|
| 现金账户用未结算卖出款再次买卖 | settled/unsettled、settlement date、允许/拒绝原因 | 只看 cash 总额即允许 |
| 过渡期内盘中交易 | broker regime、规则生效/迁移日期、margin deficit | 把旧 PDT 或新框架写成唯一现状 |
| 盘后财报订单 | session、quote scope、limit、official close、calendar | 把盘后 last 当官方 close/次日 open |
| LULD/新闻停牌/MWCB | market state、订单状态、重开方式 | 仍按止损价即时成交 |
| 卖空 | locate、SSR、borrow assumption、close-out risk | `SELL` 无条件变成空仓 |
| 期权到期与短腿指派 | 每腿状态、contrary instruction、交割物、次日购买力 | 只显示到期收益线 |
| 拆股/分红/并购 | raw/adjusted price、订单、持仓、deliverable、memo | 只改图表不改账本 |

## 9. 一手来源清单

以下均于 2026-09-15 访问；同一 URL 在正文相邻事实后重复标注，便于逐 claim 审计。

| 所有者 | 本报告使用的直接资料 |
|---|---|
| SEC | [T+1 风险提示](https://www.sec.gov/compliance/risk-alerts/shortening-securities-transaction-settlement-cycle)、[Regulation SHO](https://www.sec.gov/investor/pubs/regsho.htm)、[Trade Execution](https://www.sec.gov/about/reports-publications/investorpubstradexec)、[Best Execution](https://www.sec.gov/answers/bestex.htm) |
| FINRA | [Frequent Intraday Trading](https://www.finra.org/investors/insights/frequent-intraday-trading)、[新盘中保证金要求](https://syndication.finra.org/content/understanding-new-intraday-margin-requirements)、[Rule 4210](https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210?page=1)、[Extended-Hours Trading](https://www.finra.org/investors/insights/extended-hours-trading)、[订单时间参数](https://www.finra.org/investors/insights/time-parameters-qualifiers-stock-orders)、[公司行动](https://www.finra.org/investors/insights/corporate-actions-public-companies-what-you-should-know)、[Rule 5330](https://www.finra.org/rules-guidance/rulebooks/finra-rules/5330) |
| Federal Reserve | [FOMC Calendars](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) |
| BLS | [2026 发布日历](https://www.bls.gov/schedule/2026/)、[CPI 季调](https://www.bls.gov/cpi/seasonal-adjustment/)、[CES FAQ](https://www.bls.gov/web/empsit/cesfaq.htm) |
| NYSE | [Trading Information](https://www.nyse.com/trade/trading-information)、[MWCB FAQ](https://www.nyse.com/publicdocs/nyse/NYSE_MWCB_FAQ.pdf)、[监管停牌与公司行动](https://www.nyse.com/regulation/corporate-actions-market-watch-proxy-compliance)、[Auctions](https://www.nyse.com/trade/auctions) |
| Nasdaq | [U.S. Holiday & Trading Hours](https://www.nasdaq.com/holidayandtradinghours) |
| OCC / OIC | [Option Trade Life Cycle](https://prd-web.optionseducation.org/news/understanding-the-life-cycle-of-an-option-trade)、[Exercising Options](https://prd-web.optionseducation.org/optionsoverview/exercising-options)、[Corporate Action Adjustments](https://www.optionseducation.org/referencelibrary/faq/splits-mergers-spinoffs-bankruptcies)、[Equity vs. Index Options](https://prd-web.optionseducation.org/advancedconcepts/equity-vs-index-options) |
| Cboe | [VIX Futures](https://www.cboe.com/tradable-products/vix/vix-futures/) |
| 开源官方仓库 | [QuantConnect LEAN Security reality models](https://github.com/QuantConnect/Lean/blob/master/Common/Securities/Security.cs)、[LEAN custom models example](https://github.com/QuantConnect/Lean/blob/master/Algorithm.Python/CustomModelsAlgorithm.py)、[NautilusTrader live boundary](https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/live.md)、[NautilusTrader reconciliation](https://github.com/nautechsystems/nautilus_trader/blob/develop/docs/concepts/reconciliation.md) |

## 10. 来源完整性与限制

- 本报告没有使用媒体、二手博客、券商营销页或聚合百科。
- [OCC/OIC 的期权生命周期页面](https://prd-web.optionseducation.org/news/understanding-the-life-cycle-of-an-option-trade)（访问：2026-09-15）页脚说明该站讨论 OCC 发行的交易所期权，并链接 OCC 的标准期权风险披露；本报告仅用其说明合约生命周期，不把示例当投资建议。
- FINRA 盘中保证金正处券商迁移期，课程若实施该模块，必须在发布前重新核验 Rule 4210、FINRA 迁移说明和目标券商规则；本报告只确认截至 2026-09-15 的官方状态。
- NYSE/Nasdaq 的交易时间、拍卖截止、LULD/MWCB 与公司行动规则会更新；课程中不得硬编码为无版本常量。
- 开源仓库只用于识别应建模的边界，不证明任何策略可盈利，也不证明其适配器适用于目标券商。
- 本审计没有使用真实券商账户或实盘订单验证；所有实施建议继续保持 Paper-only。

## 11. 复核记录

- 本地正向覆盖：逐章检查 `interactive/chapters.js`、`course-v2.js`、`chapter-depth.js`、`course-sim.js`、`upgrades.js`、`mastery.js`。
- 本地缺口检索：检查 `T+1/settled/freeride/good faith/PDT/intraday margin/Reg SHO/locate/SSR/LULD/MWCB/halt/reopen/assignment/exercise/corporate action/MOO/MOC/IOC/FOK/reconciliation` 等词及同义中文表达；缺口结论以“无可执行训练或状态”，而非仅以“无关键词”判定。
- 外链复核：所有事实性外部 claim 均在相邻段落给出直接 URL 和访问日期；来源域限制在本报告开头列出的官方机构与开源项目官方仓库。
