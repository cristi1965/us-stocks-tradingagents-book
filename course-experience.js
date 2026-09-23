// ============================================================================
// Course Experience Upgrade: Stream Reading, Smart Problem Solving & Helpers
// ============================================================================

(function() {
  // Exact answer keys and derivation steps for all practical lab exercises
  const PRACTICAL_DATA = {
    1: {
      answers: { psBudget: 800, psShares: 190, psNotional: 19000 },
      steps: [
        '① 风险预算 = 账户净值 ($100,000) × 风险上限 (0.8%) = $800',
        '② 每股真实风险 = 入场 ($100) - 止损 ($96) + 摩擦缓冲 ($0.20) = $4.20',
        '③ 最大可买股数 = 800 ÷ 4.20 = 190.47 股 → 向下取整为 190 股',
        '④ 名义仓位价值 = 190 股 × $100 = $19,000'
      ]
    },
    10: {
      answers: { fillSession: 'regular', fillTif: 'day', fillQty: 700, fillAvg: 49.957, fillOpen: 300, fillShortfall: 110, fillOpportunity: 120, fillFees: 7, fillTotal: 237, fillEndState: 'cancelled' },
      steps: [
        '① 已成交股数 = 300 (49.90) + 400 (50.00) = 700 股',
        '② 成交均价 = (300×49.90 + 400×50.00) ÷ 700 = $49.957',
        '③ 未成交股数 = 1,000 - 700 = 300 股',
        '④ 已成交价差 (Shortfall) = 700 × (49.957 - 49.80 基准) = $110.00',
        '⑤ 未成交机会成本 = 300 × (50.20 收盘 - 49.80 基准) = $120.00',
        '⑥ 完整执行短缺 (IS) = 价差 $110 + 机会成本 $120 + 费用 $7 = $237.00',
        '⑦ DAY 单收盘终态：剩余 300 股未成交部分在收盘时自动撤销失效。'
      ]
    },
    11: {
      answers: { haltPlanLoss: 1000, haltActualLoss: 3600, haltExtraLoss: 2600, haltState: 'pending', luldAction: 'chain', mwcbThresholds: 'full', mwcb1Action: 'pause', mwcbLateAction: 'continue', mwcb3Action: 'close' },
      steps: [
        '① 计划损失 = 200 股 × ($100 入场 - $95 计划止损) = $1,000',
        '② 实际损失 = 200 股 × ($100 入场 - $82 重开成交) = $3,600',
        '③ 额外缺口损失 = 实际损失 $3,600 - 计划损失 $1,000 = $2,600 (跳空缺口穿透)',
        '④ 新闻停牌期间订单无法即时撮合，处于等待重开集合拍卖状态。',
        '⑤ LULD 链路：15 秒限价未解除 → 至少 5 分钟暂停 → 集合竞价重开。'
      ]
    },
    12: {
      answers: { clusterStock: -4000, clusterEtf: -2400, clusterHedge: 1600, clusterNetLoss: 4800 },
      steps: [
        '① 标的资产损益 = +$50,000 × (-8% 压力) = -$4,000',
        '② 行业 ETF 损益 = +$30,000 × (-8% 压力) = -$2,400',
        '③ Put 对冲端损益 = -$20,000 × (-8% 压力) = +$1,600 (负暴露贡献对冲收益)',
        '④ 组合净压力损失 = -(-4,000 - 2,400 + 1,600) = $4,800'
      ]
    },
    14: {
      answers: { marginAssets: 70000, marginInterest: 493.15, marginEquity: 19506.85, marginRatio: 27.87, marginLayers: 'layers', marginStatus: 'call', settledAvailable: 5000, settlementDecision: 'reject', settlementCalendar: 'verified' },
      steps: [
        '① 下跌 30% 后总资产市值 = $100,000 × (1 - 30%) = $70,000',
        '② 30 天借款利息 = 借款 $50,000 × 12% × 30 ÷ 365 = $493.15',
        '③ 扣利息后账户权益 = 市值 $70,000 - 借款 $50,000 - 利息 $493.15 = $19,506.85',
        '④ 保证金率 = 权益 $19,506.85 ÷ 资产市值 $70,000 = 27.87%',
        '⑤ 因 27.87% 低于券商 house requirement (30%)，触发 Margin Call。',
        '⑥ 现金账户当前可用 Settled Cash 为 $5,000；$12,000 买入依赖未结算款，当日卖出会违规，需拒绝。'
      ]
    },
    15: {
      answers: { shortQty: 150, shortBorrowCost: 44.38, shortStatus: 'restricted', ssrExecution: 'aboveBid', noLocateDecision: 'reject', borrowRecallDecision: 'review' },
      steps: [
        '① 最多允许做空股数 = Locate 确认数量 = 150 股 (不得超出借出许可)',
        '② 30 天借券费 = 150 股 × $45 × 8% 年化 × 30 ÷ 365 = $44.38',
        '③ 触发 SSR 限制：卖空订单只能在高于当前 NBBO 买价执行，不得主动砸盘。'
      ]
    },
    16: {
      answers: { cpiFirst: 0.2, cpiRevised: 0.1, cpiVintage: 'first' },
      steps: [
        '① 首次公布数据预期差 (Surprise) = 3.2% - 3.0% = 0.2 个百分点',
        '② 修订后预期差 = 3.1% - 3.0% = 0.1 个百分点',
        '③ 回放事件日只能使用发布当时可见的首次公布值 (Vintage)，不可用未来修订值改写历史。'
      ]
    },
    19: {
      answers: { earnRiskPerShare: 20.5, earnShares: 48, earnNotional: 4800, earnLoss: 984 },
      steps: [
        '① 每股压力风险 = $100 × 20% 缺口 + $0.50 摩擦 = $20.50',
        '② 最大可配股数 = floor($1,000 预算 ÷ $20.50) = 48 股',
        '③ 名义仓位 = 48 股 × $100 = $4,800',
        '④ 实际压力损失 = 48 股 × $20.50 = $984.00 (在 $1,000 预算内)'
      ]
    },
    20: {
      answers: { chainMidA: 3.025, chainSpreadA: 4.96, chainSpreadB: 54.55, chainOrderQty: 20, chainPick: 'a', chainGuarantee: 'no' },
      steps: [
        '① A 中间价 = (2.95 + 3.10) ÷ 2 = $3.025',
        '② A 点差率 = (3.10 - 2.95) ÷ 3.025 = 4.96%',
        '③ B 中间价 = (1.20 + 2.10) ÷ 2 = $1.65；B 点差率 = (2.10 - 1.20) ÷ 1.65 = 54.55%',
        '④ A 候选的点差仅 4.96%、OI 达 12,400，流动性远优于 B。'
      ]
    },
    22: {
      answers: { greekSide: 'longCall', greekDelta: 1.5, greekGamma: 0.18, greekUnit: 0.4, greekContract: 40, greekBoundary: 'local' },
      steps: [
        '① Delta 贡献 = 0.50 × (+3) = +$1.50',
        '② Gamma 贡献 = 0.5 × 0.04 × (3)² = +$0.18',
        '③ Vega 贡献 = 0.12 × (-10 点) = -$1.20；Theta 贡献 = -$0.08 × 1 天 = -$0.08',
        '④ 每股合计变化 = 1.50 + 0.18 - 1.20 - 0.08 = +$0.40',
        '⑤ 整张合约变化 = +$0.40 × 100 乘数 = +$40.00'
      ]
    },
    23: {
      answers: { crushSmall: -20, crushLarge: 400, crushConclusion: 'conditional' },
      steps: [
        '① 情景 A (只涨 $2)：每股损益 = 0.5×2 + 0.5×0.04×(2)² - 1.20 - 0.08 = -$0.20；整张 -$20 (IV Crush 吞没收益)',
        '② 情景 B (大涨 $8)：每股损益 = 0.5×8 + 0.5×0.04×(8)² - 1.20 - 0.08 = +$4.00；整张 +$400',
        '③ 结论：方向正确可能赚也可能亏，取决于方向收益能否跑赢 IV 坍塌与时间损耗。'
      ]
    },
    24: {
      answers: { spreadLoss: 300, spreadProfit: 700, spreadBreakeven: 108, assignedShares: -100, assignedCash: 11500, assignmentAction: 'verify' },
      steps: [
        '① 价差宽度 = 115 - 105 = $10；净借记 = $3.00',
        '② 最大亏损 = $3.00 × 100 = $300；最大盈利 = (10 - 3) × 100 = $700',
        '③ 盈亏平衡点 = 买入执行价 105 + 净借记 3 = $108.00',
        '④ 短 Call 115 被提前指派：产生 -100 股空头头寸并收到现金 100 × $115 = $11,500。'
      ]
    },
    26: {
      answers: { evidenceType: 'quote', evidenceAge: 15, evidenceTtl: 30, evidenceDecision: 'accept' },
      steps: [
        '① 行情数据属于秒级敏感特征，课程设定 TTL 阈值为 30 秒。',
        '② 采集时间经过 15 秒 < 30 秒阈值，时效合格，风险官允许放行。'
      ]
    },
    27: {
      answers: { corpShares: 200, corpAvg: 40, corpLimit: 50, corpOptionContracts: 2, corpOptionStrike: 50, corpDeliverable: 100, dividendAction: 'adjust', mergerAction: 'unavailable', tailLongLoss: 1800, tailShortLoss: 2500 },
      steps: [
        '① 2:1 拆股后：股数翻倍 (100 → 200 股)，均价减半 ($80 → $40)，挂单限价减半 ($100 → $50)',
        '② 标准期权调整：合约数翻倍 (1 → 2 张)，执行价减半 ($100 → $50)，每张仍交割 100 股',
        '③ 做多 100 股下跳 18% 损失 = 100 × 100 × 18% = $1,800',
        '④ 做空 100 股上跳 25% 损失 = 100 × 100 × 25% = $2,500 (多空面临非对称尾部)'
      ]
    }
  };


  // 1.0.1 TradingAgents Production Python Code Mapping for 28 Chapters
  const TRADINGAGENTS_CODE_MAPPING = {
    0: {
      module: 'tradingagents.risk.position_sizer',
      title: '单笔最大损失反推股数',
      code: `class PositionSizer(TradingAgent):
    def compute_position(self, equity: float, entry: float, stop: float, buffer: float = 0.20) -> Order:
        risk_budget = equity * 0.008  # 单笔硬性风控 <= 0.8%
        per_share_risk = (entry - stop) + buffer
        max_shares = int(risk_budget // per_share_risk)  # 向下取整
        return Order(ticker="SHAN", qty=max_shares, limit_price=entry, stop_price=stop)`
    },
    1: {
      module: 'tradingagents.settlement.t_plus_one_guard',
      title: 'T+1 资金与好意违规门禁',
      code: `class TPlusOneGuard(TradingAgent):
    def validate_order(self, order: Order, settled_cash: float, unsettled_sales: list) -> bool:
        if order.amount > settled_cash:
            # 依赖未结算款时禁止日内冲销
            self.flag_good_faith_violation_risk()
            return False  # Fail-closed 拦截
        return True`
    },
    2: {
      module: 'tradingagents.risk.gap_exposure_cap',
      title: '隔夜跳空断崖与离散缺口控制',
      code: `class GapExposureCap(TradingAgent):
    def adjust_for_earnings(self, current_shares: int, price: float, max_loss: float) -> int:
        gap_risk_pct = 0.20  # 离散跳空压力设为 20%
        per_share_gap_loss = price * gap_risk_pct + 0.50
        allowed_shares = int(max_loss // per_share_gap_loss)
        return min(current_shares, allowed_shares)  # 财报前强制平抑超额仓位`
    },
    3: {
      module: 'tradingagents.circuit.daily_breaker',
      title: '连续亏损停机熔断协议',
      code: `class DailyCircuitBreaker(TradingAgent):
    def check_breaker(self, daily_pnl_pct: float, consecutive_losses: int) -> Verdict:
        if daily_pnl_pct <= -0.015 or consecutive_losses >= 3:
            self.lock_system_trading(mode="PAPER_ONLY")
            return Verdict(action="HALT_TRADING", reason="触发日损失 1.5% 或 3 连亏熔断，转入复盘")
        return Verdict(action="PASS")`
    },
    9: {
      module: 'tradingagents.execution.extended_hours_router',
      title: '盘后流动性与限价路由',
      code: `class ExtendedHoursRouter(TradingAgent):
    def route_order(self, order: Order, is_extended: bool, spread_pct: float) -> Order:
        if is_extended:
            if order.order_type == OrderType.MARKET:
                raise RiskViolation("盘前盘后无 NBBO 保护，严禁市价单")
            order.qty = int(order.qty * 0.3)  # 盘后自动缩减 70% 规模
        return order`
    },
    12: {
      module: 'tradingagents.portfolio.risk_cluster_engine',
      title: '高贝塔共振与多因子净敞口合并',
      code: `class RiskClusterEngine(TradingAgent):
    def compute_cluster_stress(self, positions: list[Position], stress_pct: float = -0.08) -> float:
        tech_cluster = [p for p in positions if p.cluster == "TECH_RATES"]
        net_exposure = sum(p.market_value * p.beta for p in tech_cluster)
        net_stress_loss = net_exposure * stress_pct
        assert abs(net_stress_loss) <= self.max_cluster_budget, "风险簇净亏损超限！"
        return net_stress_loss`
    },
    14: {
      module: 'tradingagents.margin.leverage_guard',
      title: '维持保证金与净值安全垫',
      code: `class LeverageGuard(TradingAgent):
    def check_margin_health(self, equity: float, borrowed: float, house_req: float = 0.30) -> bool:
        total_assets = equity + borrowed
        margin_ratio = equity / total_assets
        if margin_ratio < house_req + 0.10:  # 必须保有 10% 缓冲垫
            self.warn_margin_call_risk()
            return False  # 禁止新增任何负债敞口
        return True`
    },
    19: {
      module: 'tradingagents.event.earnings_tail_sizer',
      title: '财报极端尾部逆向推演',
      code: `class EarningsTailSizer(TradingAgent):
    def size_for_earnings(self, ticker: str, price: float, max_loss: float = 1000.0) -> int:
        expected_gap = price * 0.20 + 0.50
        safe_shares = int(max_loss // expected_gap)
        return safe_shares  # 如 1000 / 20.5 = 48 股`
    },
    23: {
      module: 'tradingagents.options.iv_crush_guard',
      title: '重大事件 IV Crush 悬崖防护',
      code: `class IVCrushGuard(TradingAgent):
    def evaluate_option_entry(self, is_naked_call: bool, current_iv: float, has_earnings: bool):
        if has_earnings and is_naked_call and current_iv > 0.70:
            return Reject("IV 超过 70% 且临近财报，裸买 Call 必遭 IV Crush 吞没，强制改为 Vertical Spread")
        return Accept()`
    },
    24: {
      module: 'tradingagents.options.vertical_spread_synthesizer',
      title: '垂直价差限定最大已知风险',
      code: `class VerticalSpreadSynthesizer(TradingAgent):
    def construct_bull_spread(self, spot: float, buy_k: float, sell_k: float, debit: float) -> SpreadPlan:
        max_loss = debit * 100
        max_profit = (sell_k - buy_k - debit) * 100
        return SpreadPlan(type="DEBIT_SPREAD", max_loss=max_loss, max_profit=max_profit, capped=True)`
    },
    26: {
      module: 'tradingagents.gate.fail_closed_arbiter',
      title: 'Fail-Closed 风险官关闸核心门禁',
      code: `class FailClosedArbiter(TradingAgent):
    def arbitrate(self, bull_case: str, bear_case: str, data_ttl_sec: int, max_loss: float) -> Decision:
        if data_ttl_sec > 30: return Reject("行情超过 30s TTL 阈值，数据已过期")
        if not bear_case or len(bear_case) < 20: return Reject("缺少反面证伪证据，违反两造辩论铁律")
        if max_loss > self.account_equity * 0.01: return Reject("单笔最大亏损超出 1% 净值预算")
        return ApprovePaper(run_id=generate_hash_id())`
    }
  };


  // 1.0.2 Interactive TradingAgents Multi-Agent Scenarios
  const TRADINGAGENTS_SCENARIOS = {
    nvda_earnings: {
      id: 'nvda_earnings',
      name: 'NVDA 财报前：IV 为 115% 的示例',
      ticker: 'NVDA',
      spot: '$120.00',
      ivRank: 'IV 处于 98% 历史分位 (115%)',
      chapterRef: '第 24 章 · 波动率坍塌与价差对冲',
      ruleRef: '重大事件前高 IV 严禁裸买单腿期权',
      pythonFile: 'tradingagents/options/iv_crush_guard.py',
      options: [
        {
          id: 'naked_call',
          badge: '🚨 未经充分检查的做法',
          name: '单腿裸买 125 Call 赌业绩翻倍',
          desc: '权利金支出 $5,000 (占净值 5.0%) · 无反证 · 财报后面临 IV Crush 毁灭性贬值',
          type: 'bad'
        },
        {
          id: 'spread_hedge',
          badge: '🛡️ 先检查风险的做法',
          name: '115/125 垂直借记价差 (Debit Spread)',
          desc: '买入 115 Call 同时卖出 125 Call 对冲 IV · 锁死最大亏损 $300 (0.3% 净值) · 反证完备',
          type: 'good'
        }
      ],
      logs: {
        bad: [
          { role: 'DataAgent', badge: '数据员', text: '抓取 NVDA 盘口价格 $120.00，检测当前 IV 处于 98% 历史分位 (115%)，TTL 4s 合格。', cls: 'cyan' },
          { role: 'TechAnalyst', badge: '阿良·技术面', text: '日线多头排列，量比 RVOL 达 1.8，突破迹象明显，社区看多情绪极端过热。', cls: 'purple' },
          { role: 'FundAnalyst', badge: '陈平安·基本面', text: '财报预期极度苛刻，买方市场已计入超高预期，缺少下行反证与估值缓冲。', cls: 'yellow' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '申报候选订单：单腿裸买 125 Call 10 张，权利金支出 $5,000。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '🚨 FAIL-CLOSED 严厉关闸！违反第 24 章：高 IV 期权可能在消息公布后跌价；本例没有证据支持 90% 的确定跌幅；且单笔风险 $5,000 严重超出 1% 净值安全红线！', cls: 'red' }
        ],
        good: [
          { role: 'DataAgent', badge: '数据员', text: '抓取 NVDA 盘口价格 $120.00，数据源 SEC EDGAR / SIP 实时通道，TTL 合格。', cls: 'cyan' },
          { role: 'TechAnalyst', badge: '阿良·技术面', text: '多头大趋势确立，但上方存在历史密集成交阻力带 $128。', cls: 'purple' },
          { role: 'FundAnalyst', badge: '陈平安·基本面', text: '建立量化反证：若数据中心毛利率指引低于 74%，原多头假设立即失效。', cls: 'yellow' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '合成垂直借记价差：买入 115 Call，同时卖出 125 Call 卖方对冲 IV 坍塌，净支出 $3.00。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '✅ 终审核准放行！最大已知亏损锁定在 $300 (0.3% 净值 ≤ 1.0%)；反证完备；抵御 IV 暴跌风险。准予生成 Paper 审计小票！', cls: 'green' }
        ]
      },
      verdicts: {
        bad: {
          status: 'rejected',
          title: '宁姚：这个方案暂不通过',
          rule: '【触犯法则】第 24 章 (波动率坍塌) & 第 1 章 (单笔 1% 预算)',
          detail: '本例单独买入看涨期权，最多可能损失 $5,000，超过本情景的 1% 本金上限；不能仅凭 IV 推断胜率。',
          action: '强制关闸 · 允许下单 = 0 · 保全真实本金 $100,000'
        },
        good: {
          status: 'accepted',
          title: '示例方案通过检查',
          rule: '【符合法则】第 24 章 (垂直价差防线) & 第 27 章 (反证完备)',
          detail: '本例同时买卖两张期权，净支出 $300.00 (0.30% ≤ 1.00%)。价差可减小部分波动率影响，但不能消除全部风险。',
          action: '示例方案通过 · 保存本地模拟记录'
        }
      },
      pyCode: `# TradingAgents 工业级自动化风控流：NVDA 财报高 IV 守护门禁
# 模块路径: tradingagents/options/iv_crush_guard.py
from tradingagents.core import MultiAgentSystem, Order, OrderType
from tradingagents.options import IVCrushGuard, VerticalSpreadSynthesizer
from tradingagents.risk import FailClosedArbiter, PositionSizer

class NVDAEarningsRiskPipeline:
    """TauricResearch / TradingAgents 财报事件期权风控流水线"""
    def __init__(self, ticker="NVDA", equity=100000.0):
        self.ticker = ticker
        self.equity = equity
        self.arbiter = FailClosedArbiter(max_loss_pct=0.01) # 单笔最大 1%
        self.iv_guard = IVCrushGuard(max_event_iv_percentile=0.85)

    def audit_order(self, proposed_order: Order, market_context: dict) -> dict:
        current_iv = market_context.get("implied_volatility", 1.15)
        iv_rank = market_context.get("iv_percentile", 0.98)

        # 1. 检查第 24 章：高 IV 裸买期权一票否决
        if iv_rank > 0.85 and proposed_order.strategy_type == "NAKED_LONG_CALL":
            return self.arbiter.veto(
                reason="【违反第24章】财报前夕 IV 处于 98% 历史极高位，严禁裸买单腿期权！",
                suggested_fix="改用 115/125 垂直借记价差 (Debit Spread)，利用卖腿对冲 IV 暴跌。"
            )

        # 2. 检查第 1 章：单笔最大可能损失 ≤ 1% 净值 ($1,000)
        max_loss = proposed_order.calculate_max_loss()
        if max_loss > self.equity * 0.01:
            return self.arbiter.veto(
                reason=f"【违反第1章】单笔最大亏损 $\{max_loss:,.2f\} 超过净值 1% 安全红线 ($1,000)！",
                suggested_fix="缩减开仓张数或收窄行权价差宽度以符合限额。"
            )

        return self.arbiter.approve(proposed_order, seal_id="SEAL-NVDA-EARNINGS-PASS")`
    },
    tsla_extended: {
      id: 'tsla_extended',
      name: 'TSLA 盘后：买价和卖价相差很大',
      ticker: 'TSLA',
      spot: '$215.00',
      ivRank: '买卖点差 $6.00 (2.75%)',
      chapterRef: '第 10 章 · 延长时段与执行成本',
      ruleRef: '延长时段无 NBBO 保护，严禁市价单',
      pythonFile: 'tradingagents/execution/extended_hours_router.py',
      options: [
        {
          id: 'market_order',
          badge: '🚨 未经充分检查的做法',
          name: '突发拉升 3% 立即打市价单 500 股追涨',
          desc: '盘后做市商抽离流动性 · 市价单将被打穿至卖二卖三 · 预计滑点损失 $3,000+',
          type: 'bad'
        },
        {
          id: 'limit_order',
          badge: '🛡️ 先检查风险的做法',
          name: '收缩至 100 股，挂限价买单 $215.50 被动排队',
          desc: '规模收缩 80% · 锁定被动限价单 · 避免打穿盘口 · 耐心等待真实对手盘',
          type: 'good'
        }
      ],
      logs: {
        bad: [
          { role: 'DataAgent', badge: '数据员', text: '检测到当前交易时段为美东 17:10 盘后延长时段，买一 $215.00，卖一 $221.00，点差率 2.75%。', cls: 'cyan' },
          { role: 'TechAnalyst', badge: '阿良·技术面', text: '分时图直线拉升 3%，社交媒体讨论热度飙升，散户多头情绪亢奋。', cls: 'purple' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '申报市价买单 500 股，指令立即入场追高！', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '🚨 FAIL-CLOSED 严厉关闸！违反第 10 章：延长交易时段无 NBBO 保护，市价单会被薄盘口直接打穿掠夺；且规模未作防御性削减！', cls: 'red' }
        ],
        good: [
          { role: 'DataAgent', badge: '数据员', text: '盘后时段买卖点差较大 ($6.00)，交易所法定 NBBO 保护处于失效状态。', cls: 'cyan' },
          { role: 'FundAnalyst', badge: '陈平安·基本面', text: '核对官方信息源，尚未见 SEC 官方 8-K 正式文件，传闻可信度不足。', cls: 'yellow' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '规模收缩至 100 股，挂限价买单 $215.50，在盘口内部被动排队等待撮合。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '✅ 终审核准放行！执行防御性被动限价与缩量规则，规避恶性滑点侵蚀。准予生成 Paper 凭单！', cls: 'green' }
        ]
      },
      verdicts: {
        bad: {
          status: 'rejected',
          title: '宁姚：这个方案暂不通过',
          rule: '【触犯法则】第 10 章 (延长时段与执行成本)',
          detail: '盘后流动性枯竭时打市价单，等同于向做市商赠送无风险滑点利润！',
          action: '强制关闸 · 撤销市价买单 · 保全本金'
        },
        good: {
          status: 'accepted',
          title: '示例方案通过检查',
          rule: '【符合法则】第 10 章 (被动限价与订单路由)',
          detail: '严格执行被动限价与微型测试仓位，消除滑点黑洞风险。',
          action: '准予放行 · 生成限价申报小票 · 等待撮合'
        }
      },
      pyCode: `# TradingAgents 工业级自动化风控流：TSLA 盘后时段执行门禁
# 模块路径: tradingagents/execution/extended_hours_router.py
from tradingagents.core import Order, OrderType
from tradingagents.execution import ExtendedHoursRouter, SpreadThresholdGuard
from tradingagents.risk import FailClosedArbiter

class TSLAExtendedHoursPipeline:
    def __init__(self, ticker="TSLA", equity=100000.0):
        self.ticker = ticker
        self.equity = equity
        self.router = ExtendedHoursRouter(allow_market_orders=False)
        self.spread_guard = SpreadThresholdGuard(max_spread_pct=0.01)

    def audit_order(self, proposed_order: Order, market_context: dict) -> dict:
        session = market_context.get("session", "POST_MARKET")
        bid, ask = market_context.get("bid", 215.0), market_context.get("ask", 221.0)
        spread_pct = (ask - bid) / bid

        # 1. 检查第 10 章：延长时段严禁市价单
        if session != "REGULAR" and proposed_order.order_type == OrderType.MARKET:
            return FailClosedArbiter.veto(
                reason="【违反第10章】延长交易时段流动性薄弱，严禁使用市价单 (Market Order)！",
                suggested_fix="必须切换为限价单 (Limit Order)，在买一卖一之间合理挂单。"
            )

        # 2. 检查点差超标
        if spread_pct > 0.015:
            return FailClosedArbiter.veto(
                reason=f"【点差滑点预警】当前买卖点差高达 {spread_pct*100:.2f}% ($6.00)，滑点损耗过大！",
                suggested_fix="挂被动限价单等待撮合，并将规模削减至 100 股以内。"
            )

        return FailClosedArbiter.approve(proposed_order, seal_id="SEAL-TSLA-EXTENDED-PASS")`
    },
    semis_cluster: {
      id: 'semis_cluster',
      name: '半导体组合：几只股票可能一起亏',
      ticker: 'SOXX/NVDA/AMD',
      spot: '$224.50',
      ivRank: 'Beta 2.2 · 加息敏感簇',
      chapterRef: '第 12 章 · 跨标的多因子净风险共振',
      ruleRef: '同因子多标的净敞口严禁无对冲裸露',
      pythonFile: 'tradingagents/portfolio/risk_cluster_engine.py',
      options: [
        {
          id: 'naked_longs',
          badge: '🚨 未经充分检查的做法',
          name: '同时加仓 NVDA + AMD + TSM 三大多头',
          desc: '以为分散到三只标的，实际同一行业因子净暴露 $45,000 · 利率上冲时三只同时暴跌',
          type: 'bad'
        },
        {
          id: 'cluster_hedged',
          badge: '🛡️ 先检查风险的做法',
          name: '配置 SOXS 反向对冲，净 Delta 压降至安全阈值',
          desc: '计算净行业因子敞口 · 匹配反向对冲头寸 · 保证在利率上冲压力测试下净损失 ≤ 2%',
          type: 'good'
        }
      ],
      logs: {
        bad: [
          { role: 'DataAgent', badge: '数据员', text: '读取持仓：当前半导体组合包含 NVDA, AMD, TSM，行业相关系数高达 0.88。', cls: 'cyan' },
          { role: 'TechAnalyst', badge: '阿良·技术面', text: '各标的均处于上升趋势线，动量因子处于 85 分位。', cls: 'purple' },
          { role: 'FundAnalyst', badge: '陈平安·基本面', text: '美债 10 年期收益率正在逼近 4.40% 关口，高估值科技标的净压力共振极高！', cls: 'yellow' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '申报买入一揽子半导体多头，新增名义敞口 $30,000。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '🚨 FAIL-CLOSED 严厉关闸！违反第 12 章：跨标的净行业因子敞口超过净值 40%，未配置利率对冲，压力测试下预期回撤达 8.5%，一票否决！', cls: 'red' }
        ],
        good: [
          { role: 'DataAgent', badge: '数据员', text: '读取多因子矩阵与相关性数据，有效协方差矩阵计算完毕。', cls: 'cyan' },
          { role: 'FundAnalyst', badge: '陈平安·基本面', text: '建立宏观利率对冲模型：匹配反向 ETF (SOXS) 吸收利率冲击。', cls: 'yellow' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '优化组合权重：多头标的配比 60%，配置 40% SOXS 对冲头寸，净 Beta 压至 0.6。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '✅ 终审核准放行！多因子压力测试通过，极端加息情景下净亏损压降在 1.8% 预算内，准予出票！', cls: 'green' }
        ]
      },
      verdicts: {
        bad: {
          status: 'rejected',
          title: '宁姚：这个方案暂不通过',
          rule: '【触犯法则】第 12 章 (多因子净风险簇共振)',
          detail: '三只股票可能受同一行业消息影响而一起跌，合计损失超过本例预算。',
          action: '强制关闸 · 拦截订单 · 要求重新计算组合协方差'
        },
        good: {
          status: 'accepted',
          title: '示例方案通过检查',
          rule: '【符合法则】第 12 章 (行业簇净敞口管理)',
          detail: '有效运用反向对冲抵消系统性因子冲击，压力测试损失符合风控红线。',
          action: '准予放行 · 生成组合平衡审计凭证'
        }
      },
      pyCode: `# TradingAgents 工业级自动化风控流：半导体组合因子共振门禁
# 模块路径: tradingagents/portfolio/risk_cluster_engine.py
from tradingagents.portfolio import RiskClusterEngine
from tradingagents.risk import FailClosedArbiter

class SemiClusterRiskPipeline:
    def __init__(self, equity=100000.0):
        self.equity = equity
        self.cluster_engine = RiskClusterEngine(max_cluster_loss_pct=0.03)

    def audit_orders(self, proposed_orders: list, current_holdings: dict) -> dict:
        # 1. 检查第 12 章：跨标的净因子敞口
        stress_loss = self.cluster_engine.calc_rate_hike_stress_loss(
            holdings=current_holdings,
            additions=proposed_orders,
            rate_shock_bps=50 # 50bp 利率冲击
        )
        if stress_loss > self.equity * 0.03:
            return FailClosedArbiter.veto(
                reason=f"【违反第12章】半导体行业簇在加息情景下压力测试亏损 $\{stress_loss:,.2f\} > 3%！",
                suggested_fix="配置反向 ETF (如 SOXS) 对冲 Beta，将净 Delta 压至 0.6 以下。"
            )
        return FailClosedArbiter.approve(proposed_orders, seal_id="SEAL-SEMI-CLUSTER-PASS")`
    },
    fomc_macro: {
      id: 'fomc_macro',
      name: '美联储公布利率决定：先观察还是立刻下单',
      ticker: 'SPY/QQQ',
      spot: '$550.00',
      ivRank: '距决议发布 5 分钟',
      chapterRef: '第 16 章 · 宏观窗口与反证纪律',
      ruleRef: '重磅宏观公布前 15 分钟内严禁挂单博弈',
      pythonFile: 'tradingagents/gate/fail_closed_arbiter.py',
      options: [
        {
          id: 'gamble_release',
          badge: '🚨 未经充分检查的做法',
          name: '决议公布前 2 分钟挂双向突破单赌暴涨暴跌',
          desc: '数据公布瞬间流动性瞬间归零 · 买卖点差扩大 10 倍 · 触发上下双向假突破扫损',
          type: 'bad'
        },
        {
          id: 'blackout_window',
          badge: '🛡️ 先检查风险的做法',
          name: '启动决议静默期 (Blackout Window)，全部撤单离场观望',
          desc: '公布前 15 分钟至公布后 30 分钟严禁开立新仓 · 等待市场充分吸收并确立趋势后再研判',
          type: 'good'
        }
      ],
      logs: {
        bad: [
          { role: 'DataAgent', badge: '数据员', text: '读取日历：距离美联储利率决议公布仅剩 120 秒，盘口订单深度骤降 80%。', cls: 'cyan' },
          { role: 'TechAnalyst', badge: '阿良·技术面', text: '分时波动收敛至三角形末端，即将爆发方向性大行情。', cls: 'purple' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '申报双向突破挂单：上方挂突破买单，下方挂破位卖单。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '🚨 FAIL-CLOSED 严厉关闸！违反第 16/27 章：宏观窗口做市商撤单避险，流动性真空将导致双向极端滑点，价格可能上下反复触发止损；本例没有证据支持 95% 的爆仓概率，绝不放行！', cls: 'red' }
        ],
        good: [
          { role: 'DataAgent', badge: '数据员', text: '监测到当前处于高危宏观事件前夕窗口 (Blackout Window)。', cls: 'cyan' },
          { role: 'FundAnalyst', badge: '陈平安·基本面', text: '点阵图预期存在巨大分歧，非农与通胀数据交织，静待鲍威尔讲话指引。', cls: 'yellow' },
          { role: 'TraderAgent', badge: '周米粒·交易员', text: '执行静默期防守动作：撤销全部未成交挂单，保持 100% 闲置现金防御。', cls: 'white' },
          { role: 'RiskManager', badge: '宁姚·风险官', text: '✅ 终审核准放行！成功执行避险静默协议，保全本金不受异常滑点与机构假动作收割！', cls: 'green' }
        ]
      },
      verdicts: {
        bad: {
          status: 'rejected',
          title: '宁姚：这个方案暂不通过',
          rule: '【触犯法则】第 16/27 章 (宏观静默与流动性真空)',
          detail: '宏观决议公布瞬间做市商撤单，限价单可能无法成交；转成市价的止损单则可能以较差价格成交，要区分订单类型。',
          action: '强制关闸 · 自动撤单 · 启动 30 分钟静默冷却'
        },
        good: {
          status: 'accepted',
          title: '示例方案通过检查',
          rule: '【符合法则】第 16 章 (事件静默与反证)',
          detail: '严格遵守宏观决议静默防线，抵御不可预知剧烈随机波动。',
          action: '准予放行 · 记录防御性避险审计'
        }
      },
      pyCode: `# TradingAgents 工业级自动化风控流：宏观窗口静默门禁
# 模块路径: tradingagents/gate/fail_closed_arbiter.py
from tradingagents.macro import EconomicCalendarGate
from tradingagents.gate import FailClosedArbiter

class FOMCMacroRiskPipeline:
    def __init__(self, equity=100000.0):
        self.equity = equity
        self.gate = EconomicCalendarGate(blackout_mins_before=15, blackout_mins_after=30)

    def audit_execution(self, order, macro_context: dict) -> dict:
        event = macro_context.get("event", "FOMC_RATE_DECISION")
        mins = macro_context.get("mins_to_release", 2)
        if 0 <= mins <= 15:
            return FailClosedArbiter.veto(
                reason=f"【违反第16/27章】距离 {event} 仅剩 {mins} 分钟，流动性极度真空！",
                suggested_fix="启动 Blackout 避险静默，撤销挂单，等待行情消化后再入场。"
            )
        return FailClosedArbiter.approve(order, seal_id="SEAL-MACRO-WINDOW-PASS")`
    }
  };

  // 1.0 Comprehensive Data-Logic-Discipline Paradigm Mapping (28 Chapters)
  const PARADIGM_TRINITY = {
  0: {
    title: '先算买多少',
    isCritical: true,
    data: '标的 TSLA 现价 $215，止损 $211（每股风险 $4.20 含摩擦），账户 $100k 预算 $800 (0.8%)，严格反推限买 190 股。',
    logic: '每股可能亏多少，乘以股数，就是这笔计划可能亏的钱。先定能承受的损失，再算能买多少。',
    discipline: '本例另设 1%（$1,000）的上限。不要把可用资金多，理解成可以多冒险；跳空仍可能让实际亏损超过计划。',
    trap: '凭感觉大注买 TSLA，赚 $200 慌忙落袋，亏 $2,000 舍不得割肉甚至加仓摊平，单笔黑天鹅直接爆仓。',
    cure: '先定亏损预算，再算每股风险，最后把股数向下取整。'
  },
  1: {
    title: '确认钱能不能用',
    isCritical: false,
    data: '买入算力云 CRWV 现价 $80；美股 T+1 结算周期；现金账户可用 Settled Cash 决定实际买力。',
    logic: '卖出股票后，钱通常要等结算完成。现金账户若用这笔未结算的钱买入，又在原款到账前卖出，可能构成善意违规（GFV）。',
    discipline: '下单前查看券商显示的已结算现金（settled cash），不要只看账户总余额。',
    trap: '以为账户浮动数字是立即可用的自有现金，频繁买卖 CRWV 导致违规被券商冻结 90 天。',
    cure: '查清结算日期和可用现金；不能确认，就先不买。'
  },
  2: {
    title: '止损不保证卖价',
    isCritical: true,
    data: '持有 CRWV 现价 $80 设 $76 止损；财报夜遭遇突发算力指引下调，次日直接以 $65 跳空开盘（-18.7%）。',
    logic: '止损价只是触发卖单的条件。若价格直接从 $80 跳到 $65，就可能无法在 $76 卖出。',
    discipline: '财报前先算价格突然下跳时会亏多少，再决定是否减少持股。',
    trap: '迷信 Stop Loss 能保命，财报夜满仓赌 CRWV 暴利，第二天开盘遭遇断崖跳空，穿透止损直接深套。',
    cure: '本例用 -20% 的跳空来检查仓位；这是练习假设，不是最大跌幅保证。'
  },
  3: {
    title: '连亏后先停手',
    isCritical: true,
    data: '操作 3 倍杠杆半导体 SOXL；日内连续两笔各止损 $800，触及单日最大亏损线 -1.6%（$1,600）。',
    logic: '连续亏损后，人容易急着赚回来，反而买得更多、借得更多，让下一次损失更大。',
    discipline: '本例到单日亏损上限或连续亏 2 笔就停止新交易，先核对订单和剩余持仓。',
    trap: '亏损后急红了眼，想用 SOXL 3 倍杠杆“一把翻本”，结果在心态彻底失衡下一天亏光数月本金。',
    cure: '提前写好停手条件。触发后暂停新单，记录错误原因，再安排复盘。'
  },
  4: {
    title: 'K 线记录了什么',
    isCritical: false,
    data: 'TSLA 日 K 线：开 $210、高 $225、低 $205、收 $220；长上影线记录冲高 $225 遇阻，实体记录收盘。',
    logic: 'K 线只告诉你价格到过哪里、最后收在哪里；不能单凭影线断定是谁在买卖或为什么买卖。',
    discipline: '一根上涨 K 线不能保证明天上涨。先看前后走势、成交量和是否收盘。',
    trap: '看到 TSLA 单日大阳线冲动追高，买在 $225 长上影线顶部，次日回调割肉。',
    cure: '先认开盘、收盘、最高、最低，再与之前的成交量比较。'
  },
  5: {
    title: '成交量要跟什么比',
    isCritical: false,
    data: 'COIN 突破时成交 120 万股看似很多，但过去 20 日同期均量 200 万股，相对成交量 RVOL 仅 0.6。',
    logic: '120 万股是否多，要与相同时间段的平常成交量比。成交少不能单独证明有人故意诱导买入。',
    discipline: '本例 RVOL < 1.0 时先不追入；这是练习规则，不是所有市场通用的判断线。',
    trap: '单看 COIN 分时成交量柱子高大就以为机构爆买，其实量比极低，被虚假冲高诱多套牢。',
    cure: '把今天与过去相同时间段比较，再结合价格变化判断。'
  },
  6: {
    title: '高点低点怎么变',
    isCritical: false,
    data: 'CRWV 上升波段高点从 $75 升到 $90，低点从 $70 升到 $82；若后续回调跌破 $80 则上升结构破坏。',
    logic: '连续更高的高点和低点，支持上升趋势的判断。跌破事先选定的低点，就要重新检查这个判断。',
    discipline: '按事先写好的失效条件处理，不要因为亏了钱就把止损不断往下移。',
    trap: 'CRWV 亏损后自我催眠“AI算力大趋势还在”，不断下调止损线，直到深陷泥潭。',
    cure: '标出前几个高点和低点，写清跌到哪里需要重新判断。'
  },
  7: {
    title: '支撑是一片区域',
    isCritical: false,
    data: 'TSLA 在 $209~$214 形成密集成交支撑区；三次下探止跌；放量跌破 $209 则判定区域失效。',
    logic: '价格曾多次在某片区域止跌，说明那里曾有买盘。跌破后可能变成阻力，但需要后续走势确认。',
    discipline: '不要认定 $210 一定守得住；按事先写好的条件判断支撑是否失效。',
    trap: '把 TSLA $210 当成不可跌破的信仰底，跌破后继续补仓，最终被击穿平仓。',
    cure: '圈出支撑区域，提前写好跌破后怎么处理。'
  },
  8: {
    title: '订单有不同取舍',
    isCritical: false,
    data: 'COIN 盘口买一 $220、卖一 $221.50（点差率 0.68%）；大额市价单滑点可达 $223，限价 $221.20 守住成本。',
    logic: '市价单优先尽快成交，但不保证价格，也不是任何时候都能成交；限价单限制最差可接受价格，但可能一直成交不了。',
    discipline: '本练习对波动较大的 COIN 使用限价单，并检查是否只成交了一部分。',
    trap: '在流动性波动的 COIN 上无脑按市价买入，瞬间吃在最差卖档，买入即账面亏损 1.5%。',
    cure: '先看买价和卖价差多少，再决定愿意接受的价格和等待时间。'
  },
  9: {
    title: '盘前盘后有什么不同',
    isCritical: true,
    data: 'CRWV 常规时段（09:30-16:00 EST）vs 延长时段；盘后缺乏 NBBO 保护，点差常常扩大 5~10 倍。',
    logic: '盘前盘后的买卖人手可能更少，报价差可能更大，不能照搬常规时段的价格保护和成交经验。',
    discipline: '本例盘后只用限价单，股数不超过平时的 1/3；实际可用订单要查券商规则。',
    trap: '盘后看到 CRWV 传闻小作文，急不可耐打市价单追高，成交在荒谬天价，次日开盘暴跌 15%。',
    cure: '分清常规收盘价和盘后成交价，打开延长时段图表观察变化。'
  },
  10: {
    title: '下单之后还要看什么',
    isCritical: false,
    data: 'TSLA 挂 1,000 股 DAY 单；300 股成交在 $212，400 股在 $212.50，收盘自动撤销剩余 300 股。',
    logic: '提交 1,000 股的订单，不代表已经买到 1,000 股。要逐笔核对成交数量和价格。',
    discipline: '部分成交后，按实际持股重新检查可能亏多少，并核对止损订单的股数。',
    trap: '以为提交了 1,000 股 TSLA 就算完成了，收盘只成交了 300 股却不知情，风控比例彻底失真。',
    cure: '查清已成交、未成交和已取消的数量，再决定下一步。'
  },
  11: {
    title: '停牌时为什么卖不了',
    isCritical: false,
    data: 'CRWV 因突发重大战略重组被交易所新闻停牌（Halt）；盘中止损单无法成交；重开集合竞价在 $65。',
    logic: '停牌时交易暂停。重新开市的价格取决于当时愿意买卖的人，不一定是停牌前的价格。',
    discipline: '先查停牌原因、订单状态和重新开市安排；不要把点击撤单当成已经撤销。',
    trap: '误以为 CRWV 停牌时挂了止损就能按停牌前价格逃跑，重开暴跌后心理崩溃乱砍仓。',
    cure: '提前算价格跳过止损时的损失，并留出处理余地。'
  },
  12: {
    title: '几笔持仓可能一起亏',
    isCritical: true,
    data: '组合同时持仓芯片股 +$50k、SOXL +$30k、CRWV 算力云 +$20k；在半导体 -8% 压力情景下共振亏损。',
    logic: '股票代码不同，不代表风险不同。同受芯片行业、利率或市场情绪影响的持仓，可能同时下跌。',
    discipline: '把可能一起跌的持仓合起来计算损失，不要逐笔都合格就认定总风险合格。',
    trap: '买了 SOXL 又买了 CRWV 和科技股，以为代码不同就是分散风险，加息杀估值时三者同向暴跌。',
    cure: '选一个共同下跌的情景，合计各笔盈亏，再看是否超过预算。'
  },
  13: {
    title: '高波动持仓一起看',
    isCritical: false,
    data: 'SOXL（Beta ~3.2）、COIN（Beta ~2.8）、TSLA（Beta ~2.1）；高贝塔资产在加息周期杀跌共振。',
    logic: 'Beta 用来描述价格对市场变化的敏感程度。历史上波动大，不代表未来每次都按同一个倍数变化。',
    discipline: '给高波动持仓设总上限，并检查其他持仓是否也会受同一个原因影响。',
    trap: '牛市赚了点钱就膨胀，把防守现金全部换成 3 倍做多 SOXL，一波半导体回调直接本金腰斩。',
    cure: '除了看股票数量，还要看持仓会不会在同一件事发生时一起亏。'
  },
  14: {
    title: '借钱买股会放大什么',
    isCritical: true,
    data: '自有 $50k、融资借款 $50k 买入 3 倍杠杆 SOXL；半导体跌 30% 放大为净值缩水 60%，触发 30% 维持线。',
    logic: '股价下跌时，欠券商的钱不会跟着减少，所以自己剩余的钱会下降得更快；利息还要另外算。',
    discipline: '用扣除负债后的账户净值计算风险预算，不把借款额度当成自己的钱。',
    trap: '把券商给的 4 倍杠杆当成自己的本金全仓买入 SOXL，稍微一个 5% 的日常波动就被券商强平爆仓。',
    cure: '分开记资产市值、借款、利息和自己的净值，再查券商维持要求。'
  },
  15: {
    title: '做空前先查什么',
    isCritical: false,
    data: 'TSLA 盘中跌幅超 10% 触发 Rule 201 SSR；券商 Locate 借券费率跳升；卖单禁止低于最佳买价。',
    logic: '做空先要确认能借到股票，并支付借券费。价格上涨会造成亏损；SSR 生效时还受卖空价格限制。',
    discipline: '未确认借券就不提交卖空单；还要检查借券费、召回风险和当前价格限制。',
    trap: '看到 TSLA 暴跌就盲目市价追空，触及 SSR 订单被拒，反弹时遭遇散户强力轧空直接被拉爆。',
    cure: '核对借券数量和费用，再制定价格上涨时的退出方案。'
  },
  16: {
    title: '公布值要与预期比较',
    isCritical: false,
    data: 'CPI 实际值 3.2% vs 预期值 3.0%（预期差 +0.2）；加密高贝塔 COIN 盘中瞬间跳水 -4.5%。',
    logic: '市场在公布前已有预期。复盘当天的价格变化，要用当时能看到的数据，不能偷用后来修订的数字。',
    discipline: '不要只看 CPI 高低就猜涨跌；保留首次公布值、预期值和各自来源。',
    trap: '看到 CPI 数字偏高就主观断定 COIN 必跌而盲目做空，结果利空出尽市场大幅反弹被打脸。',
    cure: '先算公布值比预期高或低多少，再看市场如何反应。'
  },
  17: {
    title: '会前准备几种结果',
    isCritical: false,
    data: 'FOMC 声明偏鹰令 2Y 美债利率飙升 15bp；TSLA 盘中下挫 $8；会前准备三套剧本。',
    logic: '声明、利率预测和发布会可能提供不同信息，价格也可能反复变化。偏鹰是更重视压通胀，偏鸽是更重视支持经济。',
    discipline: '会前分别写好偏鹰、中性、偏鸽时怎么做；公布时先观察，不急着猜第一下涨跌。',
    trap: '决议公布前 5 分钟全仓买入 TSLA 单向期权赌运气，声明公布后被双向大幅扫盘多空双爆。',
    cure: '先写“如果出现什么，就做什么”，再决定要不要持仓。'
  },
  18: {
    title: '利率为什么影响估值',
    isCritical: false,
    data: '10 年期美债收益率上升 18bp；远期高增长现金流折现的算力股 CRWV 估值承压下挫 6.5%。',
    logic: '同样一笔未来才拿到的钱，折算到今天值多少会受利率影响。利率上升时，主要依靠远期盈利的公司估值可能承压。',
    discipline: '不要把利率上升理解成股价必跌；同时检查公司盈利、价格和已有持仓。',
    trap: '忽略宏观利率上行，在加息周期顶峰满仓高估值未盈利成长股，遭遇估值腰斩。',
    cure: '比较收益率变化和公司预期盈利，再检查自己是否押了太多同类风险。'
  },
  19: {
    title: '财报前算突然下跌',
    isCritical: true,
    data: 'TSLA 财报前暗含 20% 极端预期缺口；账户仅允许 $1,000 损失；每股风险 $42.50，限买 23 股。',
    logic: '财报后价格可能直接跳过止损价。要用假设的跳空幅度估算损失，不能只用日常止损距离。',
    discipline: '本例预算 $1,000 ÷ 每股压力风险 $42.50，向下取整为 23 股；更大的跳空仍可能超预算。',
    trap: '财报前抱有侥幸心理，满仓持有 TSLA，盘后跳空低开 15%，一笔亏掉全年收益。',
    cure: '先算假设的大跌会亏多少，再决定财报前能留多少股。'
  },
  20: {
    title: '期权便宜不一定好买卖',
    isCritical: false,
    data: 'COIN 活跃月平价 Call（Bid 8.20 / Ask 8.60，点差率 4.7%）；远月虚值 Call 点差率高达 54.5%。',
    logic: '标准股票期权通常按每股报价，一张通常对应 100 股。买卖报价差大，会增加进出成本。',
    discipline: '本例排除点差率 > 10% 或未平仓量 OI < 500 的合约；这些是练习筛选条件，不保证一定成交。',
    trap: '看着一张虚值期权报价 $0.30 以为便宜，一口气买 50 张，点差高达 50%，买入瞬间亏损，想卖无接盘。',
    cure: '先算整张价格和买卖差价，再查成交量、未平仓量和到期日。'
  },
  21: {
    title: '期权跟随股价的幅度',
    isCritical: false,
    data: '买入 TSLA 210 Call 1 张（Delta 0.50 等效 50 股 TSLA）；股价涨 $3 后 Delta 增至 0.62。',
    logic: 'Delta 粗略表示股价变 $1 时期权每股价格变多少；Gamma 表示股价变化时 Delta 又会变多少。',
    discipline: '用 Delta × 100 × 张数估算相当于多少股的价格影响；这只是当前附近的近似值。',
    trap: '买了 10 张 TSLA Call 以为才花几千块，其实等效于持有 500 股 TSLA，股价稍微下挫就血本无归。',
    cure: '把期权换成大约等效的股数，再与其他持仓一起检查。'
  },
  22: {
    title: '期权的四种价格影响',
    isCritical: false,
    data: '多头 COIN Call：Delta .50 + Gamma .04 + Vega .12/IV点 + Theta -$0.08/天；标的 +$3，整张赚 $40。',
    logic: '期权价格同时受股价、波动预期和时间影响。股价不变时，其他因素仍可能让期权涨价或跌价。',
    discipline: '把 Delta、Gamma、Vega、Theta 的影响分别算清楚；不要只看股价方向。',
    trap: '买入 COIN 看涨期权后标的横盘一周，期权价值被 Theta 和波动率磨损掉 60%。',
    cure: '把四项近似变化相加，并注意模型只适合当前附近的小幅变化。'
  },
  23: {
    title: '财报后期权为什么可能跌',
    isCritical: true,
    data: 'COIN 财报前 IV 110% vs 财报后 IV 45%；情景 A（小涨 $2 净亏 -$20）；情景 B（暴涨 $8 净赚 +$400）。',
    logic: '消息公布后，市场愿意为不确定性支付的钱可能减少。这种隐含波动率快速下降叫 IV Crush，可能抵消股价上涨带来的收益。',
    discipline: '本例避免财报前只买高 IV 的看涨期权；先比较股价小涨和大涨两种结果。',
    trap: '财报前花重金买 COIN Call，财报公布股价微涨 2%，第二天开盘期权暴跌 50%，方向看对却亏惨。',
    cure: '分别计算方向、波动率和时间的影响，看合计结果，而不是只看涨跌。'
  },
  24: {
    title: '同时买卖期权有什么代价',
    isCritical: true,
    data: 'TSLA 买 210 Call 卖 225 Call（Debit Spread）；净借记 $3，最大亏损 $300，最大盈利 $1,200。',
    logic: '本例买较低执行价的 Call、卖较高执行价的 Call，减少净支出，同时限制最大盈利；到期前还要处理提前指派等问题。',
    discipline: '先写清两张期权的执行价、到期日、净支出和指派后的处理方式。',
    trap: '习惯性裸买单腿期权，频繁遭遇 100% 归零；或做价差不知短腿在除息日前会被提前指派。',
    cure: '算清完整价差的盈亏上限，并检查是否需要在到期前平仓。'
  },
  25: {
    title: '资料能用多久',
    isCritical: false,
    data: 'CRWV 证据时效阈值 TTL（实时盘口 30 秒，新闻快讯 60 分钟，SEC 10-Q 季度财报）；一手出处。',
    logic: '报价几秒就可能变化，公司财报的使用期限则不同。TTL 就是这类资料允许使用多久。',
    discipline: '按资料类型检查更新时间和原始来源；过期或查不到来源，就暂停使用。',
    trap: '根据社交媒体上转发的未经核实的 CRWV 算力假新闻冲动开仓，接在主力出货的最顶峰。',
    cure: '保存来源、公布时间、采集时间和失效条件，再做判断。'
  },
  26: {
    title: '资料不够就不下单',
    isCritical: true,
    data: 'Fail-Closed 默认拒绝原则；针对 TSLA/CRWV/COIN/SOXL 四只示例股票或基金设一票否决权；证伪条件清单。',
    logic: '几个 AI 助手赞同一个观点，不等于有几份独立证据。资料不足或预计亏损超预算，仍然应该拒绝方案。',
    discipline: '下单前写下：出现什么事实说明我可能错了，以及准备怎么退出。',
    trap: '被牛市狂热情绪感染，没有任何止损和反证计划，凭盲目信仰满仓冲进去当接盘侠。',
    cure: '让风险检查有权拒绝交易；fail-closed 就是条件不满足时默认不放行。'
  },
  27: {
    title: '把一笔交易从头检查',
    isCritical: false,
    data: '教学情景：TSLA 按 3:1 拆股。股票数量变为3倍，每股成本变为原来的1/3；挂单价格与数量要按适用规则核对，期权如何调整要查看对应合约公告。不要把2:1拆股的翻倍、减半规则套到这里。',
    logic: '拆股和分红可能改变股数、价格或订单条件。把下单前、成交后和退出时需要检查的事情连起来。',
    discipline: '保存每一步用的资料、判断和订单状态，方便事后核对。',
    trap: '拆股后忘记撤销调整旧限价单，导致被交易所按异常价格成交造成无谓亏损。',
    cure: '核对公司行动通知，再检查模拟记录是否完整。'
  }
};

  // 1. Inject Smart Solver Tools into Practical Labs
  function injectPracticalSmartTools() {
    const lab = document.querySelector('.practical-lab');
    if (!lab || lab.querySelector('.lab-smart-toolbar')) return;

    const data = PRACTICAL_DATA[window.v2Active];
    if (!data) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'lab-smart-toolbar';
    toolbar.innerHTML = `
      <button type="button" class="btn-smart-steps">💡 看每一步怎么算</button>
      <button type="button" class="btn-smart-fill">✨ 填入示例答案</button>
    `;

    const card = document.createElement('div');
    card.className = 'lab-derivation-card';
    card.hidden = true;
    card.innerHTML = `
      <div class="derivation-header">
        <b>一步一步算给你看</b>
        <small>先看每个数字从哪里来，再自己算一遍</small>
      </div>
      <ol class="derivation-steps">
        ${data.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    `;

    toolbar.querySelector('.btn-smart-steps').onclick = () => {
      card.hidden = !card.hidden;
      toolbar.querySelector('.btn-smart-steps').textContent = card.hidden ? '💡 看每一步怎么算' : '收起计算步骤';
    };

    toolbar.querySelector('.btn-smart-fill').onclick = () => {
      Object.entries(data.answers).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) {
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.removeAttribute('aria-invalid');
        }
      });
      // Trigger preview update
      if (typeof window.refreshPracticalPreview === 'function') {
        window.refreshPracticalPreview();
      }
      // Highlight feedback
      const preview = lab.querySelector('.lab-preview');
      if (preview) {
        preview.style.background = '#e6f7ef';
        preview.style.borderColor = '#10b981';
      }
    };

    lab.prepend(card);
    lab.prepend(toolbar);
  }

  // 1.1 Dynamic Risk Waterline Component (Apple Quantitative Precision)
  function getRiskWaterlineHtml(chapter) {
    return `
      <div class="cockpit-card bret-victor-waterline" id="riskWaterlineCard">
        <div class="waterline-head">
          <div class="waterline-title">
            <span class="waterline-icon">🌊</span>
            <b>拖动滑块，算这笔交易可能亏多少</b>
            <span class="waterline-pill-rule">本例亏损上限：本金的 1%</span>
          </div>
          <div class="waterline-equity-badge">
            基准账户: <b>$100,000</b> | 红线预算: <b class="waterline-budget-text">$1,000 (1.0%)</b>
          </div>
        </div>

        <div class="waterline-gauge-container">
          <div class="waterline-gauge-track">
            <!-- Background Calibrated Zones -->
            <div class="gauge-zone safe" style="left: 0; width: 40%;" title="安全区 (≤1.0%)"></div>
            <div class="gauge-zone warning" style="left: 40%; width: 40%;" title="预警区 (1.0%~2.0%)"></div>
            <div class="gauge-zone danger" style="left: 80%; width: 20%;" title="熔断区 (>2.0%)"></div>

            <!-- 1.0% Discipline Redline Pin (strictly at 40%) -->
            <div class="gauge-redline-pin" style="left: 40%;">
              <span class="redline-flag">1.0% 纪律红线</span>
              <div class="redline-stem"></div>
            </div>

            <!-- Dynamic Fill Bar -->
            <div class="waterline-gauge-fill-wrap">
              <div class="waterline-gauge-fill" id="waterlineGaugeFill" style="width: 32%;"></div>
            </div>

            <!-- Dynamic Needle / Thumb -->
            <div class="waterline-needle" id="waterlineNeedle" style="left: 32%;">
              <div class="needle-core"></div>
              <div class="needle-tooltip" id="needleTooltip">$800 · 0.80% (安全)</div>
            </div>
          </div>

          <div class="waterline-gauge-scale">
            <span style="left: 0;">0% ($0)</span>
            <span class="scale-target" style="left: 40%; transform: translateX(-50%);">1.0% ($1,000) 🛡️ 纪律上限</span>
            <span class="scale-danger" style="right: 0;">2.5%+ 熔断极限</span>
          </div>
        </div>

        <!-- Quick Scenario Presets -->
        <div class="waterline-presets">
          <div class="preset-header-bar">
            <span class="preset-label">⚡ 试试不同的买入股数</span>
          </div>
          <div class="preset-button-row">
            <button type="button" class="btn-risk-preset is-active" data-shares="400" data-stop="48">
              <span class="preset-name">🟢 纪律 0.8%</span>
              <span class="preset-sub">400股 · 合规放行</span>
            </button>
            <button type="button" class="btn-risk-preset" data-shares="700" data-stop="48">
              <span class="preset-name">🟡 超标 1.4%</span>
              <span class="preset-sub">700股 · 风险预警</span>
            </button>
            <button type="button" class="btn-risk-preset" data-shares="1200" data-stop="48">
              <span class="preset-name">🔴 违规 2.4%</span>
              <span class="preset-sub">1200股 · 严重超载</span>
            </button>
          </div>
        </div>

        <div class="waterline-explorable-controls">
          <div class="ctrl-group">
            <label><span>入场价格</span> <b id="lblEntryPrice">$50.00</b></label>
            <input type="range" id="sliderEntryPrice" min="10" max="300" step="1" value="50">
          </div>
          <div class="ctrl-group">
            <label><span>止损线 (单股风险 <span id="lblPerShareRisk" style="color:#b91c1c;">$2.00</span>)</span> <b id="lblStopPrice">$48.00</b></label>
            <input type="range" id="sliderStopPrice" min="5" max="295" step="1" value="48">
          </div>
          <div class="ctrl-group">
            <label><span>计划股数</span> <b id="lblSharesCount">400 股</b></label>
            <input type="range" id="sliderSharesCount" min="10" max="1500" step="10" value="400">
          </div>
        </div>

        <div class="waterline-insight-card" id="waterlineInsightCard">
          <div class="insight-status green" id="waterlineStatus">✅ 状态评估：单笔风险 $800.00 (0.80%) · 处于 1% 纪律安全区，准予放行</div>
          <div class="insight-text" id="waterlineInsightText">
            💡 <b>数理真相：</b>当单笔亏损严格控制在 1%（$1,000）以内时，即便极端行情遭遇连续 5 笔止损，总回撤仅 4.9%，需 +5.1% 即可重回水面；若单笔冒 5% 风险，连续 5 笔亏损将直接跌去 22.6% 本金，需 +29.2% 才能回本！
          </div>
        </div>
      </div>
    `;
  }

  function bindWaterlineEvents(container) {
    const waterline = container.querySelector('#riskWaterlineCard');
    if (!waterline) return;

    const sliderEntry = waterline.querySelector('#sliderEntryPrice');
    const sliderStop = waterline.querySelector('#sliderStopPrice');
    const sliderShares = waterline.querySelector('#sliderSharesCount');
    const lblEntry = waterline.querySelector('#lblEntryPrice');
    const lblStop = waterline.querySelector('#lblStopPrice');
    const lblPerShare = waterline.querySelector('#lblPerShareRisk');
    const lblShares = waterline.querySelector('#lblSharesCount');
    const gaugeFill = waterline.querySelector('#waterlineGaugeFill');
    const needle = waterline.querySelector('#waterlineNeedle');
    const tooltip = waterline.querySelector('#needleTooltip');
    const status = waterline.querySelector('#waterlineStatus');
    const insightText = waterline.querySelector('#waterlineInsightText');
    const presetBtns = waterline.querySelectorAll('.btn-risk-preset');

    presetBtns.forEach(btn => {
      btn.onclick = () => {
        presetBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (btn.dataset.shares) sliderShares.value = btn.dataset.shares;
        if (btn.dataset.stop) sliderStop.value = btn.dataset.stop;
        update();
      };
    });

    function update() {
      let entry = +sliderEntry.value;
      let stop = +sliderStop.value;
      if (stop >= entry) {
        stop = entry - 1;
        sliderStop.value = stop;
      }
      let shares = +sliderShares.value;
      let perShare = Math.max(0.01, entry - stop);
      let dollarRisk = shares * perShare;
      let riskPct = (dollarRisk / 100000) * 100;
      let gaugePct = Math.min(100, Math.max(0, (riskPct / 2.5) * 100));

      lblEntry.textContent = `$${entry.toFixed(2)}`;
      lblStop.textContent = `$${stop.toFixed(2)}`;
      lblPerShare.textContent = `$${perShare.toFixed(2)}`;
      lblShares.textContent = `${shares} 股 (名义市值 $${(shares * entry).toLocaleString()})`;

      gaugeFill.style.width = `${gaugePct}%`;
      needle.style.left = `${gaugePct}%`;

      gaugeFill.className = 'waterline-gauge-fill';
      if (riskPct <= 1.0) {
        needle.className = 'waterline-needle safe';
        tooltip.textContent = `$${dollarRisk.toFixed(0)} · ${riskPct.toFixed(2)}% (安全)`;
        status.className = 'insight-status green';
        status.textContent = `✅ 状态评估：单笔风险 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%) · 处于 1% 纪律安全区，准予放行`;
        insightText.innerHTML = `💡 <b>数理真相：</b>当单笔亏损严格控制在 1%（$1,000）以内时，即便极端行情遭遇连续 5 笔止损，总回撤仅 4.9%，需 +5.1% 即可重回水面；若单笔冒 5% 风险，连续 5 笔亏损将直接跌去 22.6% 本金，需 +29.2% 才能回本！`;
      } else if (riskPct <= 2.0) {
        gaugeFill.classList.add('warning');
        needle.className = 'waterline-needle warning';
        tooltip.textContent = `$${dollarRisk.toFixed(0)} · ${riskPct.toFixed(2)}% (超标)`;
        status.className = 'insight-status yellow';
        const maxAllowed = Math.floor(1000 / perShare);
        status.textContent = `⚠️ 状态评估：单笔风险 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%) · 超出 1% 阈值！建议削减股数至 ≤ ${maxAllowed} 股`;
        insightText.innerHTML = `⚠️ <b>越界警示：</b>当前风险已达 ${riskPct.toFixed(2)}%。在震荡市中，连续 3 笔此等级别的亏损就会吞噬 ${(riskPct * 3).toFixed(1)}% 本金，诱发感性急躁情绪。`;
      } else {
        gaugeFill.classList.add('danger');
        needle.className = 'waterline-needle danger';
        tooltip.textContent = `$${dollarRisk.toFixed(0)} · ${riskPct.toFixed(2)}% (熔断)`;
        status.className = 'insight-status red';
        status.textContent = `🚫 状态评估：单笔风险 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%) · 散户亏损黑洞！Fail-Closed 强制熔断否决开仓！`;
        insightText.innerHTML = `🚨 <b>本例风险提醒：</b>单笔亏损高达 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%)！一次突发黑天鹅或跳空低开将造成永久性重创，不能用一次计算解释 -$30,000 的历史亏损。本例按预算拒绝方案。`;
      }
    }

    waterline._simulateRisk = function(simShares, simPerShare) {
      if (simShares == null) {
        update();
        return;
      }
      let entry = +sliderEntry.value;
      let perShare = simPerShare || Math.max(0.01, entry - +sliderStop.value);
      let dollarRisk = simShares * perShare;
      let riskPct = (dollarRisk / 100000) * 100;
      let gaugePct = Math.min(100, Math.max(0, (riskPct / 2.5) * 100));

      gaugeFill.style.width = `${gaugePct}%`;
      needle.style.left = `${gaugePct}%`;

      gaugeFill.className = 'waterline-gauge-fill';
      if (riskPct <= 1.0) {
        needle.className = 'waterline-needle safe';
        tooltip.textContent = `$${dollarRisk.toFixed(0)} · ${riskPct.toFixed(2)}% (安全)`;
        status.className = 'insight-status green';
        status.textContent = `🎯 选项预演：单笔风险 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%) · 处于 1% 纪律安全区，准予放行`;
      } else if (riskPct <= 2.0) {
        gaugeFill.classList.add('warning');
        needle.className = 'waterline-needle warning';
        tooltip.textContent = `$${dollarRisk.toFixed(0)} · ${riskPct.toFixed(2)}% (超标)`;
        status.className = 'insight-status yellow';
        status.textContent = `⚠️ 选项预演：单笔风险 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%) · 超标预警！超出机构量化限额`;
      } else {
        gaugeFill.classList.add('danger');
        needle.className = 'waterline-needle danger';
        tooltip.textContent = `$${dollarRisk.toFixed(0)} · ${riskPct.toFixed(2)}% (熔断)`;
        status.className = 'insight-status red';
        status.textContent = `🚫 选项预演：单笔风险 $${dollarRisk.toFixed(2)} (${riskPct.toFixed(2)}%) · 散户亏损黑洞！Fail-Closed 熔断否决！`;
      }
    };

    [sliderEntry, sliderStop, sliderShares].forEach(input => {
      input.addEventListener('input', () => {
        presetBtns.forEach(b => b.classList.remove('is-active'));
        update();
      });
    });
    update();
  }

  // 2. Inject Dual-Wing Cockpit into Phase 3 (做判断)
  function injectDualWingCockpit() {
    const phase3 = document.getElementById('lesson-phase-3');
    if (!phase3) return;

    const phaseContent = phase3.querySelector('.phase-content');
    if (!phaseContent) return;

    let leftWing = phaseContent.querySelector('.cockpit-left-wing');
    if (!leftWing) {
      leftWing = document.createElement('aside');
      leftWing.className = 'cockpit-left-wing';
      const decisionSurface = phaseContent.querySelector('.decision-surface');
      if (decisionSurface) {
        decisionSurface.before(leftWing);
      } else {
        phaseContent.prepend(leftWing);
      }
    }

    const curChapter = (typeof window !== 'undefined' && window.v2Active !== undefined)
      ? window.v2Active
      : (typeof v2Active !== 'undefined' ? v2Active : +(localStorage.getItem('manga-us-v2-active') || 0));

    const background = document.querySelector('.background-card');
    const reality = document.querySelector('.market-reality');
    const story = document.querySelector('.story-thread');
    const depth = (typeof CHAPTER_DEPTH !== 'undefined' && CHAPTER_DEPTH[curChapter]) ? CHAPTER_DEPTH[curChapter] : null;
    const ruleWhy = (typeof V2_WHY !== 'undefined' && V2_WHY[curChapter]) ? V2_WHY[curChapter] : '';

    let factsHtml = '';
    if (depth) {
      factsHtml = `
        <div class="cockpit-card facts-card">
          <div class="cockpit-card-title">📌 <b>题目已经告诉你的事</b></div>
          <p class="facts-scene">${depth.scene}</p>
          ${depth.example ? `<div class="facts-example"><b>数据参考：</b>${depth.example}</div>` : ''}
        </div>
      `;
    }

    let dialogueHtml = '';
    if (story) {
      dialogueHtml = `
        <div class="cockpit-card dialogue-card">
          <div class="cockpit-card-title">⚡ <b>听听大家怎么想</b></div>
          <div class="dialogue-compact-list">${story.innerHTML}</div>
        </div>
      `;
    }

    let realityHtml = '';
    if (reality) {
      realityHtml = `
        <div class="cockpit-card reality-card">
          <div class="cockpit-card-title">📐 <b>交易为什么会这样</b></div>
          <p>${reality.querySelector('p')?.innerHTML || reality.textContent.trim()}</p>
          ${reality.querySelector('a') ? `<div class="reality-ref">${reality.querySelector('a').outerHTML}</div>` : ''}
        </div>
      `;
    } else if (background) {
      realityHtml = `
        <div class="cockpit-card reality-card">
          <div class="cockpit-card-title">💡 <b>关键概念说明</b></div>
          <p>${background.querySelector('.background-body')?.innerHTML || background.innerHTML}</p>
        </div>
      `;
    }

    let ruleHtml = '';
    if (ruleWhy) {
      ruleHtml = `
        <div class="cockpit-card rule-card">
          <div class="cockpit-card-title">🛡️ <b>本章要记住的规则</b></div>
          <p>“${ruleWhy}”</p>
        </div>
      `;
    }

    const paradigmInfo = PARADIGM_TRINITY[curChapter];
    let paradigmHtml = '';
    if (paradigmInfo) {
      paradigmHtml = `
        <div class="cockpit-card paradigm-card">
          <div class="cockpit-card-title">
            <span>⚖️</span> <b>做决定前，先问这三个问题</b>
            ${paradigmInfo.isCritical ? '<span class="critical-tag">🔥 重点规则</span>' : ''}
          </div>
          <div class="paradigm-trinity-grid">
            <div class="trinity-item data-box">
              <div class="trinity-head"><span class="badge-blue">📊 有哪些数字</span></div>
              <p>${paradigmInfo.data}</p>
            </div>
            <div class="trinity-item logic-box">
              <div class="trinity-head"><span class="badge-purple">🧠 为什么这样判断</span></div>
              <p>${paradigmInfo.logic}</p>
            </div>
            <div class="trinity-item discipline-box">
              <div class="trinity-head"><span class="badge-emerald">🛡️ 到什么条件就停手</span></div>
              <p>${paradigmInfo.discipline}</p>
            </div>
          </div>
          <div class="banned-trap-alert">
            <div class="trap-head">
              <span class="trap-icon">⚠️</span> <b>容易犯的错：</b>
            </div>
            <p class="trap-desc">❌ ${paradigmInfo.trap}</p>
            <div class="trap-cure"><b>💡 可以怎么改：</b>${paradigmInfo.cure}</div>
          </div>
        </div>
      `;
    }

    const taCode = TRADINGAGENTS_CODE_MAPPING[curChapter];
    let taCodeHtml = '';
    if (taCode) {
      taCodeHtml = `
        <div class="cockpit-card tradingagents-code-card">
          <div class="tradingagents-code-head" onclick="this.nextElementSibling.hidden = !this.nextElementSibling.hidden;">
            <span>🤖 <b>用 Python 表达规则的示例</b> (${taCode.module})</span>
            <span class="tradingagents-code-badge">展开源码 ▾</span>
          </div>
          <div class="tradingagents-code-body" hidden>
            <pre><code>${taCode.code}</code></pre>
            <div class="tradingagents-code-note">💡 这是说明规则的示意代码，类名和接口需自行实现；复制后不能直接连接券商。</div>
          </div>
        </div>
      `;
    }

    const waterlineHtml = getRiskWaterlineHtml(curChapter);
    let autopsyCalloutHtml = '';
    if (curChapter === 3) {
      autopsyCalloutHtml = `
        <div class="cockpit-card autopsy-trigger-card" style="border-left: 3.5px solid #be123c; background: #fff1f2; margin-bottom: 12px; padding: 12px 14px; border-radius: 8px;">
          <div style="font-weight: 800; color: #9f1239; font-size: 13px; margin-bottom: 4px;">
            🚨 6年-$30,000 亏损核心转折点（连亏报复性加仓）
          </div>
          <p style="font-size: 12px; color: #475569; margin: 0 0 8px; line-height: 1.5;">
            在连续亏损后急于翻本，违规加大手数或加杠杆，导致了 80% 的本金不可逆破损。
          </p>
          <button type="button" class="btn-open-autopsy-inline" id="btnOpenAutopsyInline" style="background: #be123c; color: #fff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            📉 打开 6年-$30k 亏损深度复盘沙盒 ➔
          </button>
        </div>
      `;
    }

    leftWing.innerHTML = paradigmHtml + autopsyCalloutHtml + waterlineHtml + taCodeHtml + factsHtml + dialogueHtml + realityHtml + ruleHtml;
    bindWaterlineEvents(leftWing);
    const inlineAutopsyBtn = leftWing.querySelector('#btnOpenAutopsyInline');
    if (inlineAutopsyBtn) {
      inlineAutopsyBtn.onclick = () => toggleLossAutopsyModal();
    }

    // Add keyboard hint attributes (1, 2, 3) and reactive waterline simulation to decision buttons
    const decisionButtons = phase3.querySelectorAll('.decision-list button');
    const waterlineCard = leftWing.querySelector('#riskWaterlineCard');

    let feedbackBox = phase3.querySelector('#decisionSimFeedback');
    if (!feedbackBox) {
      feedbackBox = document.createElement('div');
      feedbackBox.id = 'decisionSimFeedback';
      feedbackBox.className = 'decision-sim-feedback';
      feedbackBox.textContent = '先读题目，再选答案。左侧计算器是独立练习，不能用它判断本题是否答对。';
      const decisionList = phase3.querySelector('.decision-list');
      if (decisionList) decisionList.before(feedbackBox);
    }

    decisionButtons.forEach((btn, i) => {
      if (!btn.hasAttribute('data-key')) {
        btn.setAttribute('data-key', String(i + 1));
      }
      btn.addEventListener('mouseenter', () => {
        // Wording is not numeric evidence. Only the chapter validator grades choices.
        if (feedbackBox) feedbackBox.textContent = '想一想：题目给了哪些数字或事实，能支持这个选项？选定后会显示检查结果。';
      });
      btn.addEventListener('mouseleave', () => {
        if (waterlineCard && typeof waterlineCard._simulateRisk === 'function') {
          waterlineCard._simulateRisk(null);
        }
        if (feedbackBox) {
          feedbackBox.textContent = '先读题目，再选答案。左侧计算器是独立练习，不能用它判断本题是否答对。';
        }
      });
    });
  }

  // 3. View Mode Toggle (全景通读流 vs 双翼驾驶舱)
  let isStreamMode = localStorage.getItem('manga-view-mode') === 'stream';

  function applyViewMode() {
    const stage = document.getElementById('lessonStage');
    const lessonTop = stage?.querySelector('.lesson-top');
    const roadmap = document.querySelector('.lesson-roadmap');
    if (!stage || !roadmap) return;

    // Decouple from roadmap: Mount viewModeToggle strictly into lesson-top
    let toggleBtn = document.getElementById('viewModeToggle');
    if (!toggleBtn && lessonTop) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.id = 'viewModeToggle';
      toggleBtn.className = 'mode-toggle-btn';
      lessonTop.appendChild(toggleBtn);
      toggleBtn.onclick = () => {
        isStreamMode = !isStreamMode;
        localStorage.setItem('manga-view-mode', isStreamMode ? 'stream' : 'cockpit');
        applyViewMode();
      };
    }

    if (toggleBtn) {
      toggleBtn.innerHTML = isStreamMode
        ? '<b>📖</b><span>整章一起看</span>'
        : '<b>🎯</b><span>一步一步学</span>';
      toggleBtn.title = isStreamMode ? '点击切换为一步一步学' : '点击切换为整章一起看';
    }

    stage.classList.toggle('stream-mode', isStreamMode);

    const phases = stage.querySelectorAll('.learning-phase');
    if (isStreamMode) {
      phases.forEach(p => p.hidden = false);
    } else {
      let phasesStore = window.lessonPhaseByChapter;
      if (!phasesStore || typeof phasesStore !== 'object') {
        try { phasesStore = JSON.parse(localStorage.getItem('manga-us-workbench-phases') || '{}'); }
        catch (_) { phasesStore = {}; }
      }
      const curChapter = (typeof window !== 'undefined' && window.v2Active !== undefined)
        ? window.v2Active
        : (typeof v2Active !== 'undefined' ? v2Active : +(localStorage.getItem('manga-us-v2-active') || 0));
      const activeNumber = phasesStore ? (phasesStore[curChapter] || 1) : 1;
      phases.forEach(p => { p.hidden = p.id !== `lesson-phase-${activeNumber}`; });
      roadmap.querySelectorAll('[data-phase]').forEach(button => {
        const active = +button.dataset.phase === activeNumber;
        button.toggleAttribute('aria-current', active);
      });
    }
  }

  // 4. Wrap choice answer feedback with Socratic guidance and soft unlock
  const originalComplete = window.v2Complete;
  if (typeof originalComplete === 'function') {
    window.v2Complete = function(ok, button) {
      originalComplete.apply(this, arguments);
      const feedback = document.getElementById('lessonFeedback');
      if (!ok) {
        if (feedback) {
          // Keep the validator's explanation, including the field that needs fixing.
          if (!feedback.textContent.trim()) feedback.textContent = '这次还没通过。请按题目提示检查答案，再试一次。';
          feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        setTimeout(() => {
          const stage = document.getElementById('lessonStage');
          if (stage) {
            stage.querySelectorAll('[data-pick]').forEach(b => {
              if (!b.classList.contains('answer-right')) {
                b.disabled = false;
              }
            });
          }
        }, 500);
      } else {
        if (feedback) {
          if (!feedback.textContent.trim()) feedback.textContent = '答案通过了本题检查。接下来看看本章规则。';
          feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        renderJournalLiveReceipts();
      }
    };
  }

  // 5. Override window scroll and heading focus to keep header permanently docked
  window.lessonHeadingFocus = function() {
    const h = document.querySelector('#lessonStage h2');
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
    const stage = document.getElementById('lessonStage');
    if (stage) stage.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo(0, 0);
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }, { passive: true });

  // 6. Minimalist Toast Helper
  function showKeyToast(msg) {
    let toast = document.getElementById('keyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'keyToast';
      toast.className = 'key-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  // 7. Theme Switcher (🍎 经典苹果 / ☀️ 论文暖白 / 🌙 彭博暗黑) & Header Tools
  let currentTheme = localStorage.getItem('manga-theme') || 'apple';
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('manga-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      if (theme === 'apple') {
        themeBtn.innerHTML = '🍎 经典苹果';
        themeBtn.title = '当前为经典苹果 Pre-Glass 主题，点击切换为论文暖白';
      } else if (theme === 'light') {
        themeBtn.innerHTML = '☀️ 论文暖白';
        themeBtn.title = '当前为论文暖白主题，点击切换为彭博暗黑';
      } else {
        themeBtn.innerHTML = '🌙 彭博暗黑';
        themeBtn.title = '当前为彭博暗黑终端主题，点击切换为经典苹果';
      }
    }
  }

  function injectHeaderTools() {
    const header = document.querySelector('header');
    if (!header || header.querySelector('.header-tools')) return;

    const tools = document.createElement('div');
    tools.className = 'header-tools';
    tools.innerHTML = `
      <button type="button" id="openRieslingBtn" class="riesling-pill" title="118篇逐篇改写的通俗讲解，可对照原文 (快捷键 R)">
        📖 通俗讲解 (118篇)
      </button>
      <button type="button" id="openTradingAgentsBtn" class="tradingagents-pill" title="TradingAgents 多智能体量化实操台 (快捷键 M)">
        🤖 TradingAgents
      </button>
      <button type="button" id="openTradingViewBtn" class="tradingview-pill" title="TradingView 免费版实操指南：突破3指标限制、Cboe BZX 避坑、单警报自动化 (快捷键 V / T)">
        📈 TradingView
      </button>
      <button type="button" id="openLossAutopsyBtn" class="autopsy-pill" title="告别感性：6年-$30k 亏损深度解剖与量化重生沙盒 (快捷键 X)">
        📉 亏损复盘
      </button>
      <button type="button" id="paradigmGuideBtn" class="paradigm-pill" title="散户破局：告别感性 · 走数据/走逻辑/走纪律 (快捷键 P)">
        🧭 破局罗盘
      </button>
      <button type="button" id="shortcutHintBtn" class="shortcut-pill" title="快捷键操作指南 (快捷键 ?)">⌨️ <span>?</span></button>
      <button type="button" id="themeToggle" class="theme-toggle-btn" title="切换设计主题 (经典苹果/论文暖白/彭博暗黑)">🍎 经典苹果</button>
    `;
    header.appendChild(tools);

    tools.querySelector('#openRieslingBtn').onclick = () => {
      if (typeof window.openRieslingArticleModal === 'function') {
        const curChap = (typeof window !== 'undefined' && window.v2Active !== undefined)
          ? window.v2Active
          : (typeof v2Active !== 'undefined' ? v2Active : 0);
        const mapping = window.CHAPTER_RIESLING_MAP && window.CHAPTER_RIESLING_MAP[curChap];
        window.openRieslingArticleModal(mapping ? mapping.primaryArticleId : 'trade-cangwei');
      }
    };
    tools.querySelector('#openTradingAgentsBtn').onclick = () => {
      toggleTradingAgentsModal();
    };
    tools.querySelector('#openTradingViewBtn').onclick = () => {
      toggleTradingViewModal();
    };
    tools.querySelector('#openLossAutopsyBtn').onclick = () => {
      toggleLossAutopsyModal();
    };
    tools.querySelector('#paradigmGuideBtn').onclick = () => {
      toggleParadigmModal();
    };
    tools.querySelector('#themeToggle').onclick = () => {
      const nextTheme = currentTheme === 'apple' ? 'light' : currentTheme === 'light' ? 'dark' : 'apple';
      applyTheme(nextTheme);
    };
    tools.querySelector('#shortcutHintBtn').onclick = () => {
      toggleShortcutModal();
    };
    applyTheme(currentTheme);
  }


  // 7.2 TradingAgents Hands-on Project Arena Modal (Apple Pre-Glassmorphism High Taste Edition)
  function toggleTradingAgentsModal() {
    let dialog = document.getElementById('tradingAgentsDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'tradingAgentsDialog';
      dialog.className = 'tradingagents-dialog';
      dialog.innerHTML = `
        <div class="tradingagents-dialog-content">
          <div class="tradingagents-dialog-head">
            <div class="ta-mac-lights">
              <span class="ta-light red" title="关闭窗口 (Esc)"></span>
              <span class="ta-light yellow" title="最小化"></span>
              <span class="ta-light green" title="全屏实操"></span>
            </div>
            <div class="ta-title-center">
              <div class="ta-title-main">
                <span class="ta-app-icon">🤖</span>
                <h3>TradingAgents：几个 AI 角色如何一起检查交易</h3>
                <span class="ta-badge-engine">v2.4 情景演示</span>
                <span class="ta-badge-gate">🛡️ 条件不足就拒绝</span>
              </div>
              <div class="ta-title-sub">
                用预设对白演示 28 章规则；这里不会调用模型、获取实时行情或下单。
              </div>
            </div>
            <button type="button" class="btn-close-agents" aria-label="关闭">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5"></line>
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5"></line>
              </svg>
            </button>
          </div>
          <div class="tradingagents-dialog-body">
            <div class="arena-controls">
              <div class="arena-section">
                <div class="arena-section-head">
                  <span class="arena-step-tag">01</span>
                  <b>选一个练习场景</b>
                </div>
                <select id="arenaScenarioSelect" class="arena-select">
                  <option value="nvda_earnings">NVDA 财报前：IV 为 115% 的示例</option>
                  <option value="tsla_extended">TSLA 盘后：买价和卖价相差很大</option>
                  <option value="semis_cluster">半导体组合：几只股票可能一起亏</option>
                  <option value="fomc_macro">FOMC 利率决议 (重磅数据窗口 · 流动性骤降)</option>
                </select>
                <div id="arenaScenarioMeta" class="arena-scenario-meta"></div>
              </div>

              <div class="arena-section">
                <div class="arena-section-head">
                  <span class="arena-step-tag">02</span>
                  <b>比较两种做法</b>
                </div>
                <div id="arenaOptionsList" class="arena-options-list"></div>
              </div>

              <div class="arena-section">
                <div class="arena-section-head">
                  <span class="arena-step-tag">03</span>
                  <b>每个 AI 角色检查什么</b>
                </div>
                <div class="arena-pipeline-grid" id="arenaPipelineNodes">
                  <div class="pipeline-node" data-node="data">
                    <span class="p-dot"></span>
                    <span class="p-role">数据员 Data</span>
                    <span class="p-status">检查资料是否在 30 秒有效期内</span>
                  </div>
                  <div class="pipeline-node" data-node="analyst">
                    <span class="p-dot"></span>
                    <span class="p-role">分析师 Analyst</span>
                    <span class="p-status">阿良/陈平安对决</span>
                  </div>
                  <div class="pipeline-node" data-node="trader">
                    <span class="p-dot"></span>
                    <span class="p-role">交易员 Trader</span>
                    <span class="p-status">周米粒生成订单</span>
                  </div>
                  <div class="pipeline-node" data-node="risk">
                    <span class="p-dot"></span>
                    <span class="p-role">风控官 Risk Gate</span>
                    <span class="p-status">宁姚一票否决权</span>
                  </div>
                </div>
              </div>

              <button type="button" id="arenaRunBtn" class="arena-run-btn">
                <span>▶ 运行这个场景的演示</span>
                <kbd>Enter</kbd>
              </button>
            </div>

            <div class="arena-console">
              <div class="console-nav-toolbar">
                <div class="console-status-pill">
                  <span id="arenaStatusIndicator" class="status-indicator">● 等待开始</span>
                </div>
                <div id="arenaNavTabs" class="console-segmented-tabs">
                  <button type="button" class="arena-tab-btn is-active" data-tab="stream">🖥️ 看检查过程</button>
                  <button type="button" class="arena-tab-btn" data-tab="code">🐍 Python 示意代码</button>
                  <button type="button" class="arena-tab-btn" data-tab="receipt">🧾 本次模拟记录</button>
                </div>
              </div>

              <!-- Tab 1: Terminal Stream -->
              <div id="arenaTabStream" class="arena-tab-panel is-active">
                <div class="terminal-os-bar">
                  <span>以下为预设情景对白，不是正在运行的终端</span>
                </div>
                <div id="terminalStreamLog" class="terminal-stream-log">
                  <div class="log-line green">情景演示 v2.4 已准备好。</div>
                  <div class="log-line green">演示参考 28 章规则：资料不够或风险超限，就拒绝方案。</div>
                  <div class="log-line white">请在左侧选择情景与决策模式，点击【启动推演】开始多智能体审查。</div>
                </div>
                <div id="terminalVerdictBox" class="terminal-verdict-box" style="display: none;"></div>
              </div>

              <!-- Tab 2: Python Code -->
              <div id="arenaTabCode" class="arena-tab-panel" style="display: none;">
                <div class="code-panel-topbar">
                  <span id="arenaCodeFilename" class="code-filename">📄 tradingagents/options/iv_crush_guard.py</span>
                  <div class="code-actions">
                    <button type="button" class="btn-copy-py" id="btnCopyPyCode">📋 复制源码</button>
                    <a href="https://github.com/TauricResearch/TradingAgents" target="_blank" rel="noreferrer" class="link-github-py">GitHub ↗</a>
                  </div>
                </div>
                <div class="code-editor-shell">
                  <pre id="arenaPyCodeDisplay"></pre>
                </div>
              </div>

              <!-- Tab 3: Paper Receipt -->
              <div id="arenaTabReceipt" class="arena-tab-panel" style="display: none;">
                <div id="arenaReceiptContainer" class="arena-receipt-container"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      // Close handlers
      dialog.querySelector('.btn-close-agents').onclick = () => dialog.close();
      const redLight = dialog.querySelector('.ta-light.red');
      if (redLight) redLight.onclick = () => dialog.close();
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

      const scenarioSelect = dialog.querySelector('#arenaScenarioSelect');
      const scenarioMeta = dialog.querySelector('#arenaScenarioMeta');
      const optionsContainer = dialog.querySelector('#arenaOptionsList');
      const pipelineNodes = dialog.querySelector('#arenaPipelineNodes');
      const streamLog = dialog.querySelector('#terminalStreamLog');
      const verdictBox = dialog.querySelector('#terminalVerdictBox');
      const pyCodeDisplay = dialog.querySelector('#arenaPyCodeDisplay');
      const codeFilename = dialog.querySelector('#arenaCodeFilename');
      const statusIndicator = dialog.querySelector('#arenaStatusIndicator');
      const receiptContainer = dialog.querySelector('#arenaReceiptContainer');

      // Tab switcher
      function switchTab(tabId) {
        dialog.querySelectorAll('.arena-tab-btn').forEach(btn => {
          btn.classList.toggle('is-active', btn.dataset.tab === tabId);
        });
        dialog.querySelector('#arenaTabStream').style.display = tabId === 'stream' ? 'flex' : 'none';
        dialog.querySelector('#arenaTabCode').style.display = tabId === 'code' ? 'flex' : 'none';
        dialog.querySelector('#arenaTabReceipt').style.display = tabId === 'receipt' ? 'flex' : 'none';
      }

      dialog.querySelectorAll('.arena-tab-btn').forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
      });

      // Receipt renderer
      function renderReceipt(scen, status) {
        if (status === 'accepted') {
          receiptContainer.innerHTML = `
            <div class="ta-receipt-card accepted">
              <div class="ta-receipt-watermark">APPROVED</div>
              <div class="ta-receipt-head">
                <div class="ta-receipt-title">📋 本次情景演示记录</div>
                <div class="ta-receipt-id">PAPER-TA-${Date.now().toString(36).slice(-5).toUpperCase()}</div>
              </div>
              <div class="ta-receipt-grid">
                <div class="ta-receipt-item"><span class="lbl">核准时间</span><span class="val">${new Date().toLocaleTimeString()}（本地时间）</span></div>
                <div class="ta-receipt-item"><span class="lbl">标的代码</span><span class="val"><b>${scen.ticker}</b></span></div>
                <div class="ta-receipt-item"><span class="lbl">所属章节</span><span class="val">${scen.chapterRef}</span></div>
                <div class="ta-receipt-item"><span class="lbl">风险检查结果</span><span class="val green">见本情景的说明</span></div>
                <div class="ta-receipt-item full"><span class="lbl">风控条款</span><span class="val">${scen.ruleRef}</span></div>
                <div class="ta-receipt-item full"><span class="lbl">固定展示编号（不是校验哈希）</span><code class="val mono">8f2a4bc97e10398f5a1d77b8c02a4e91823901cd7a18f4e9104b2</code></div>
              </div>
              <div class="ta-receipt-footer">
                <span>🛡️ 签发人：宁姚 · 首席风控官 (Fail-Closed Gatekeeper)</span>
                <span class="badge-audit-pass">✅ 演示结果</span>
              </div>
            </div>
          `;
        } else {
          receiptContainer.innerHTML = `
            <div class="ta-receipt-card rejected">
              <div class="ta-receipt-watermark">REJECTED</div>
              <div class="ta-receipt-head">
                <div class="ta-receipt-title">🚨 宁姚：这个方案暂不通过</div>
                <div class="ta-receipt-id">HALT-VETO-${Date.now().toString(36).slice(-5).toUpperCase()}</div>
              </div>
              <div class="ta-receipt-grid">
                <div class="ta-receipt-item"><span class="lbl">关闸时间</span><span class="val">${new Date().toLocaleTimeString()}（本地时间）</span></div>
                <div class="ta-receipt-item"><span class="lbl">违规标的</span><span class="val"><b>${scen.ticker}</b></span></div>
                <div class="ta-receipt-item"><span class="lbl">未满足的规则</span><span class="val red">${scen.chapterRef}</span></div>
                <div class="ta-receipt-item"><span class="lbl">允许下单股数</span><span class="val red">0 股 (绝对禁止)</span></div>
                <div class="ta-receipt-item full"><span class="lbl">保全本金</span><span class="val green">$100,000（示例本金，未下单）</span></div>
              </div>
              <div class="ta-receipt-footer">
                <span>🛡️ 签发人：宁姚 · 风险官一票否决权生效</span>
                <span class="badge-audit-halt">🚨 默认关闸拦截</span>
              </div>
            </div>
          `;
        }
      }

      function updateScenarioUI() {
        const key = scenarioSelect.value;
        const scen = TRADINGAGENTS_SCENARIOS[key];
        if (!scen) return;

        // Update meta tags
        scenarioMeta.innerHTML = `
          <span class="meta-pill">标的 <b>${scen.ticker}</b></span>
          <span class="meta-pill">基准 <b>${scen.spot}</b></span>
          <span class="meta-pill">特征 <b>${scen.ivRank}</b></span>
          <span class="meta-pill blue">📚 ${scen.chapterRef}</span>
        `;

        // Update options
        optionsContainer.innerHTML = scen.options.map((opt, i) => `
          <div class="arena-opt-card ${i === 0 ? 'is-selected' : ''} ${opt.type === 'bad' ? 'card-bad' : 'card-good'}" data-type="${opt.type}">
            <div class="opt-card-radio">
              <input type="radio" name="arenaOpt" value="${opt.type}" ${i === 0 ? 'checked' : ''}>
              <span class="radio-disc"></span>
            </div>
            <div class="opt-card-body">
              <div class="opt-card-top">
                <span class="opt-badge ${opt.type}">${opt.badge}</span>
                <b class="opt-title">${opt.name}</b>
              </div>
              <div class="opt-desc">${opt.desc}</div>
            </div>
          </div>
        `).join('');

        // Bind card clicks
        optionsContainer.querySelectorAll('.arena-opt-card').forEach(card => {
          card.onclick = () => {
            optionsContainer.querySelectorAll('.arena-opt-card').forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
          };
        });

        // Update code
        pyCodeDisplay.textContent = scen.pyCode;
        codeFilename.textContent = `📄 ${scen.pythonFile}`;

        // Reset pipeline nodes
        pipelineNodes.querySelectorAll('.pipeline-node').forEach(node => {
          node.className = 'pipeline-node';
        });

        // Reset terminal & status
        statusIndicator.textContent = '● 等待开始';
        statusIndicator.className = 'status-indicator';
        verdictBox.style.display = 'none';
        streamLog.innerHTML = `
          <div class="log-line green">情景演示 v2.4 已准备好。</div>
          <div class="log-line green">演示参考 28 章规则：资料不够或风险超限，就拒绝方案。</div>
          <div class="log-line white">当前情景：【${scen.name}】已就绪，点击【启动推演】开始多智能体审查。</div>
        `;

        receiptContainer.textContent = '还没有本情景的结果。选择一个方案并运行演示后，这里才会显示记录。';
      }

      scenarioSelect.onchange = updateScenarioUI;
      updateScenarioUI();

      dialog.querySelector('#btnCopyPyCode').onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(pyCodeDisplay.textContent).then(() => {
            showKeyToast('已复制 TradingAgents Python 源码！');
          });
        }
      };

      dialog.querySelector('#arenaRunBtn').onclick = () => {
        const key = scenarioSelect.value;
        const scen = TRADINGAGENTS_SCENARIOS[key];
        const selectedType = dialog.querySelector('input[name="arenaOpt"]:checked')?.value || 'bad';
        const logs = scen.logs[selectedType] || [];
        const verdict = scen.verdicts[selectedType];

        switchTab('stream');
        streamLog.innerHTML = `<div class="log-line white">[START] 启动 TradingAgents 多智能体对齐推演：${scen.ticker}...</div>`;
        verdictBox.style.display = 'none';
        statusIndicator.textContent = '● 正在播放角色检查过程';
        statusIndicator.className = 'status-indicator running';

        // Reset nodes
        pipelineNodes.querySelectorAll('.pipeline-node').forEach(n => n.className = 'pipeline-node');

        let delay = 0;
        logs.forEach((item, idx) => {
          delay += 400;
          setTimeout(() => {
            const line = document.createElement('div');
            line.className = `log-line ${item.cls}`;
            line.innerHTML = `<span class="ta-role-badge ${item.cls}">[${item.badge || item.role}]</span> ${item.text}`;
            streamLog.appendChild(line);
            streamLog.scrollTop = streamLog.scrollHeight;

            // Illuminate pipeline node
            if (item.role === 'DataAgent') {
              const n = pipelineNodes.querySelector('[data-node="data"]');
              if (n) n.className = 'pipeline-node active green';
            } else if (item.role === 'TechAnalyst' || item.role === 'FundAnalyst') {
              const n = pipelineNodes.querySelector('[data-node="analyst"]');
              if (n) n.className = 'pipeline-node active purple';
            } else if (item.role === 'TraderAgent') {
              const n = pipelineNodes.querySelector('[data-node="trader"]');
              if (n) n.className = 'pipeline-node active blue';
            } else if (item.role === 'RiskManager') {
              const n = pipelineNodes.querySelector('[data-node="risk"]');
              if (n) n.className = `pipeline-node active ${verdict.status === 'accepted' ? 'green' : 'red'}`;
            }

            if (idx === logs.length - 1) {
              if (verdict.status === 'accepted') {
                statusIndicator.textContent = '● 示例方案通过';
                statusIndicator.className = 'status-indicator green';
                verdictBox.className = 'terminal-verdict-box accepted';
                verdictBox.innerHTML = `
                  <div class="verdict-box-head">
                    <span class="verdict-icon">✅</span>
                    <div>
                      <b>${verdict.title}</b>
                      <p>${verdict.rule}</p>
                    </div>
                  </div>
                  <div class="verdict-box-detail">${verdict.detail}</div>
                  <div class="verdict-box-foot">
                    <span>${verdict.action}</span>
                    <button type="button" class="btn-goto-receipt" onclick="document.querySelector('[data-tab=receipt]').click()">查看 Paper 凭单 ↗</button>
                  </div>
                `;
                verdictBox.style.display = 'block';

                showKeyToast('TradingAgents 审查通过，Paper 水单已入账！');
                const receipt = {
                  id: `paper-agent-${Date.now().toString(36).slice(-4).toUpperCase()}`,
                  time: new Date().toLocaleTimeString(),
                  loss: 300,
                  source: 'https://www.sec.gov/edgar/tradingagents',
                  modelConfig: 'TRADINGAGENTS_MULTI_AGENT_PROD'
                };
                const existing = JSON.parse(localStorage.getItem('manga-us-paper-receipts') || '[]');
                existing.push(receipt);
                localStorage.setItem('manga-us-paper-receipts', JSON.stringify(existing.slice(-20)));
                if (typeof renderJournalLiveReceipts === 'function') renderJournalLiveReceipts();
                renderReceipt(scen, 'accepted');
              } else {
                statusIndicator.textContent = '● 示例方案未通过';
                statusIndicator.className = 'status-indicator red';
                verdictBox.className = 'terminal-verdict-box rejected';
                verdictBox.innerHTML = `
                  <div class="verdict-box-head">
                    <span class="verdict-icon">🚨</span>
                    <div>
                      <b>${verdict.title}</b>
                      <p>${verdict.rule}</p>
                    </div>
                  </div>
                  <div class="verdict-box-detail">${verdict.detail}</div>
                  <div class="verdict-box-foot">
                    <span class="red-action">${verdict.action}</span>
                    <button type="button" class="btn-goto-receipt" onclick="document.querySelector('[data-tab=receipt]').click()">查看关闸裁决令 ↗</button>
                  </div>
                `;
                verdictBox.style.display = 'block';
                renderReceipt(scen, 'rejected');
              }
              streamLog.scrollTop = streamLog.scrollHeight;
            }
          }, delay);
        });
      };
    }

    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  // 7.2.5 TradingView Free Plan Practical Workbench (突破3指标限制 · Cboe BZX 避坑 · 单警报自动化)
  const TRADINGVIEW_PINESCRIPT_V5 = `//@version=5
indicator("TradingAgents 4-in-1 Quant Discipline Deck (Free Plan Safe)", overlay=true)

// ==========================================
// 1. 20 / 50 EMA 机构趋势带
// ==========================================
lenFast = input.int(20, "短周期 EMA (快速趋势)", group="趋势均线")
lenSlow = input.int(50, "中周期 EMA (机构生命线)", group="趋势均线")
ema20 = ta.ema(close, lenFast)
ema50 = ta.ema(close, lenSlow)

plot(ema20, "EMA 20", color=color.rgb(33, 150, 243, 0), linewidth=2)
plot(ema50, "EMA 50", color=color.rgb(255, 152, 0, 0), linewidth=2)

// ==========================================
// 2. 日内锚定 VWAP (成交量加权平均价)
// ==========================================
showVWAP = input.bool(true, "开启日内 VWAP", group="VWAP 日内基准")
myVwap = ta.vwap(hlc3)
plot(showVWAP ? myVwap : na, "Session VWAP", color=color.rgb(156, 39, 176, 0), linewidth=2, style=plot.style_line)

// ==========================================
// 3. 散户救命防线：1.5% 单笔最大损失动态止损水线
// ==========================================
entryPrice = input.float(0.0, "持仓成本价（填 0 不画提醒线）", group="价格提醒（不代表账户亏损比例）")
riskPct = input.float(1.5, "股价相对入场价的跌幅 (%)", minval=0.1, maxval=5.0, group="价格提醒（不代表账户亏损比例）")

var float stopLossLevel = na
if entryPrice > 0
    stopLossLevel := entryPrice * (1 - riskPct / 100)

plot(stopLossLevel, "1.5% 股价下跌提醒线", color=color.rgb(244, 67, 54, 0), linewidth=2, style=plot.style_circles)

// ==========================================
// 4. 隔夜跳空缺口与极端波动标记
// ==========================================
gapThreshold = input.float(1.0, "跳空缺口阈值 (%)", group="缺口与极端异动")
isGapUp = (open - close[1]) / close[1] * 100 >= gapThreshold
isGapDown = (close[1] - open) / close[1] * 100 >= gapThreshold

plotshape(isGapUp, title="向上跳空", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small)
plotshape(isGapDown, title="向下跳空", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.small)

// ==========================================
// 5. 免费版唯一警报 (Alert) 触发器 (可直连 Webhook)
// ==========================================
alertCondition = ta.crossunder(close, stopLossLevel)
if alertCondition
    alert('{"ticker": "' + syminfo.ticker + '", "price": ' + str.tostring(close) + ', "event": "RISK_VETO", "msg": "收盘低于设置的价格提醒线，请检查交易计划"}', alert.freq_once_per_bar_close)
`;

  const TRADINGVIEW_CHAPTER_TIPS = [
    { ch: 1, title: "单笔最大损失", ticker: "TSLA", tool: "风险/回报比 (Alt+T)", tip: "在 TSLA 现价 $215 拉出长多工具，将止损距锁定入场价的 1.5%（$211），先看止损线在哪再反推股数。" },
    { ch: 2, title: "完整仓位反推", ticker: "CRWV", tool: "价格文本注释 (Text)", tip: "在 CRWV 图表左上角用文本框写明：$100k × 0.8% = $800 预算，每股风险 $4.20，限买 190 股。" },
    { ch: 3, title: "财报前夜止损", ticker: "CRWV", tool: "垂直时间线 (Alt+V)", tip: "在 CRWV 财报日前 15:55 美东画垂直警戒线，触发前 10 分钟强平单向重仓，防隔夜 $65 恶性跳空。" },
    { ch: 4, title: "连续亏损熔断", ticker: "SOXL", tool: "水平射线 (Alt+H)", tip: "在 3倍杠杆 SOXL 日内连亏 2 笔达 1.5% 熔断线时，画黄色封禁线，合上电脑离开屏幕。" },
    { ch: 5, title: "一根 K 线与价格", ticker: "TSLA", tool: "矩形工具 (Rectangle)", tip: "框选 TSLA 日线实体与影线，顶端标 $225 试盘高位，下影线标 $205 探底支撑。" },
    { ch: 6, title: "成交量与 RVOL", ticker: "COIN", tool: "成交量指标 (Volume)", tip: "开启 20 日成交量均线，COIN 突破若相对量比 RVOL < 1.0 则标红警示“假突破”。" },
    { ch: 7, title: "趋势与结构破坏", ticker: "CRWV", tool: "趋势线 (Alt+T)", tip: "标注 CRWV 上升通道 Higher Low，在前低 $80 画红线，跌破即趋势破坏坚决止损。" },
    { ch: 8, title: "关键区域与失效", ticker: "TSLA", tool: "平行通道 / 矩形", tip: "在 TSLA $210-$215 画密集筹码支撑带，放量跌破则原区域立即反转为强阻力区。" },
    { ch: 9, title: "订单类型与点差", ticker: "COIN", tool: "标尺 (Shift+Click)", tip: "测量 COIN 买一卖一点差（常达 0.5%~1%），点差过大时强制限价单，禁止市价扫单。" },
    { ch: 10, title: "跳空缺口与挂单", ticker: "COIN", tool: "矩形工具 (Rectangle)", tip: "将 COIN 隔夜跳空高开形成的空白区域框选为灰色缺口区，限价单挂在缺口下沿。" },
    { ch: 11, title: "延长时段防洗盘", ticker: "CRWV", tool: "ETH 模式切换", tip: "图表右下角开启「ETH」延长时段，盘后无 NBBO 保护，市价单极易在假影线上被洗。" },
    { ch: 12, title: "执行短缺与分批", ticker: "TSLA", tool: "价格标签 (Price Note)", tip: "标注 TSLA 1,000 股分批成交均价与未成交 300 股机会成本，核算执行短缺。" },
    { ch: 13, title: "停牌与重开拍卖", ticker: "CRWV", tool: "垂直线 (Alt+V)", tip: "在 CRWV 新闻停牌时段标出集合竞价预估撮合价格，重算跳空敞口。" },
    { ch: 14, title: "风险簇共同暴露", ticker: "SOXL & CRWV", tool: "比较代码 (Compare)", tip: "叠加 SOXL 与 CRWV 走势，直观展现 AI 算力与半导体单一风险簇共振，避免假分散。" },
    { ch: 16, title: "融资杠杆与强平", ticker: "SOXL", tool: "水平线 (Alt+H)", tip: "在 SOXL 成本线下方标出 30% 维持保证金强平警戒线，杠杆持仓触线前必须主动减仓。" },
    { ch: 17, title: "卖空借券与 SSR", ticker: "TSLA", tool: "水平线 (Alt+H)", tip: "昨收盘价 × 0.90 标为红色 SSR 启动线。TSLA 破位后禁止市价做空，必须在升档挂单。" },
    { ch: 18, title: "CPI 首次值与版本", ticker: "COIN", tool: "垂直时间线 (Alt+V)", tip: "锁定美东 8:30 AM CPI 数据发布时间线，并在发布前开启 1 分钟图观察点差是否瞬间扩大。" },
    { ch: 19, title: "FOMC 条件剧本", ticker: "TSLA", tool: "预测/测量工具", tip: "在 TSLA 图表上标注鹰派、中性、鸽派三套价格触发点，根据决议会后走势选择剧本。" },
    { ch: 20, title: "收益率久期折现", ticker: "CRWV", tool: "比较标的 (US10Y)", tip: "叠加 10 年期美债收益率，分析利率飙升对远期高增长算力股 CRWV 的估值压制。" },
    { ch: 21, title: "财报尾部极端风险", ticker: "TSLA", tool: "价格范围 (Price Range)", tip: "标出 TSLA 财报隐含的 20% 极端预期波动区间，反推最大安全买入股数（如 23 股）。" },
    { ch: 22, title: "期权流动性点差", ticker: "COIN", tool: "文本标注 (Text)", tip: "记录 COIN 活跃主力月与远月虚值期权点差率，流动性第一，拒绝高点差陷阱。" },
    { ch: 23, title: "期权 Delta/Gamma", ticker: "TSLA", tool: "信息标签 (Note)", tip: "记录 TSLA 210 Call 当前 0.50 Delta，股价上涨 $3 时标注 Delta 增至 0.62 的头寸膨胀。" },
    { ch: 24, title: "IV Crush 双情景", ticker: "COIN", tool: "水平线 (Alt+H)", tip: "标记 COIN 财报后 IV 从 110% 骤降至 45% 的坍塌水位，避免单腿买方惨遭双杀。" },
    { ch: 25, title: "期权非线性收益", ticker: "SOXL", tool: "损益曲线草图", tip: "绘制 SOXL 衍生品二阶非线性损益曲线，小涨小跌期权磨损，大涨大跌非线性爆发。" },
    { ch: 26, title: "垂直借记价差", ticker: "TSLA", tool: "双水平线 (Alt+H)", tip: "标注 TSLA 210/225 Bull Call Spread 买卖两端行权价，限定 $300 最大损失。" },
    { ch: 27, title: "证据时效与 TTL", ticker: "CRWV", tool: "信息注释 (Note)", tip: "在 CRWV 财报 K 线上标注 SEC 官方 10-Q 披露时间戳与 24 小时 TTL 有效期。" },
    { ch: 28, title: "风险官 Fail-Closed", ticker: "示例股票或基金", tool: "警报器 (Alt+A)", tip: "针对 TSLA/CRWV/COIN/SOXL 挂载 1.5% 止损水线自动化警报，条件不满足坚决关闸。" }
  ];

  function toggleTradingViewModal(defaultTab) {
    let dialog = document.getElementById('tradingViewModal');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'tradingViewModal';
      dialog.className = 'tradingagents-dialog tradingview-dialog';
      dialog.innerHTML = `
        <div class="tradingagents-dialog-content tv-dialog-content">
          <div class="tradingagents-dialog-head">
            <div class="macos-traffic-lights">
              <span class="light red" onclick="document.getElementById('tradingViewModal').close()"></span>
              <span class="light yellow"></span>
              <span class="light green"></span>
            </div>
            <div class="ta-header-title-box">
              <div class="ta-title-main">
                <h3>📈 TradingView 免费版实操舱 · 零成本量化看盘与风控工作台</h3>
                <span class="ta-badge-engine">v5 Pine Script</span>
                <span class="ta-badge-gate">免付费破3指标</span>
                <span class="ta-badge-gate" style="background:#e8f5e9;color:#2e7d32;border-color:#c8e6c9;">Cboe BZX 避坑</span>
                <span class="ta-badge-gate" style="background:#fef3c7;color:#b45309;border-color:#fde68a;">示例股票或基金实战 (TSLA/CRWV/COIN/SOXL)</span>
              </div>
              <div class="ta-title-sub">
                专为个人量化交易者定制 · 突破 3 指标槽位限制 · Cboe BZX 抽样防洗盘 · 单条警报 Webhook 自动化 · 28 课画线实操
              </div>
            </div>
            <button type="button" class="btn-close-tv btn-close-agents" aria-label="关闭">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5"></line>
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5"></line>
              </svg>
            </button>
          </div>
          <div class="tradingagents-dialog-body tv-dialog-body">
            <!-- Left Deck: Modern macOS Pro Sidebar Navigation -->
            <div class="tv-controls tv-sidebar-nav">
              <div class="tv-sidebar-title">实战工作台导航</div>
              <div class="strategy-options tv-options">
                <button type="button" class="strategy-card active" data-tv-tab="pinescript">
                  <div class="tv-nav-icon">01</div>
                  <div class="tv-nav-text">
                    <div class="tv-nav-title">4合1 Pine Script 源码</div>
                    <div class="tv-nav-desc">突破免费版 3 指标槽位限制</div>
                  </div>
                  <span class="tv-nav-badge pro">免付费</span>
                </button>

                <button type="button" class="strategy-card" data-tv-tab="bzx">
                  <div class="tv-nav-icon">02</div>
                  <div class="tv-nav-text">
                    <div class="tv-nav-title">Cboe BZX 避坑指南</div>
                    <div class="tv-nav-desc">防 15% 撮合假影线与洗盘</div>
                  </div>
                  <span class="tv-nav-badge warn">避坑</span>
                </button>

                <button type="button" class="strategy-card" data-tv-tab="alert">
                  <div class="tv-nav-icon">03</div>
                  <div class="tv-nav-text">
                    <div class="tv-nav-title">单警报 Webhook 联动</div>
                    <div class="tv-nav-desc">唯一警报直连风控自动化</div>
                  </div>
                  <span class="tv-nav-badge auto">自动化</span>
                </button>

                <button type="button" class="strategy-card" data-tv-tab="drawing">
                  <div class="tv-nav-icon">04</div>
                  <div class="tv-nav-text">
                    <div class="tv-nav-title">28 课专属画线手卡</div>
                    <div class="tv-nav-desc">TSLA / CRWV / COIN / SOXL 口诀</div>
                  </div>
                  <span class="tv-nav-badge tips">神票实战</span>
                </button>
              </div>

              <div class="tv-sidebar-footer">
                <div class="tv-footer-card">
                  <div class="tv-footer-title">⚡ 四只示例股票或基金实战校准</div>
                  <div class="tv-ticker-pills">
                    <span class="tv-pill-tag tsla">TSLA</span>
                    <span class="tv-pill-tag crwv">CRWV</span>
                    <span class="tv-pill-tag coin">COIN</span>
                    <span class="tv-pill-tag soxl">SOXL</span>
                  </div>
                  <p>以下价格和阈值是练习示例。实际使用前，要按当前行情、持股数量和亏损预算重新计算。</p>
                </div>
              </div>
            </div>

            <!-- Right Deck: Interactive View Panes -->
            <div class="arena-console tv-console">
              <!-- View 1: Pine Script -->
              <div class="tv-view-pane active" id="tvPanePinescript">
                <div class="tv-pane-header">
                  <div>
                    <h4>🛠️ 4合1 量化合流 Pine Script v5 源码</h4>
                    <p>复制下方源码粘贴至 TradingView 底部「Pine 编辑器」，保存并添加到图表，仅占用 1 个指标槽位！</p>
                  </div>
                  <button type="button" class="btn-copy-code" id="btnCopyPineScript">📋 一键复制 Pine Script 源码</button>
                </div>
                <div class="tv-steps-guide">
                  <div class="tv-step-item">
                    <span class="tv-step-num">1</span>
                    <div><b>展开 Pine 编辑器</b><p>在 TradingView 任意标的图表底部，点击「Pine 编辑器」标签页。</p></div>
                  </div>
                  <div class="tv-step-item">
                    <span class="tv-step-num">2</span>
                    <div><b>粘贴替换代码</b><p>全选清空默认代码，点击上方按钮复制本源码，粘贴进编辑器。</p></div>
                  </div>
                  <div class="tv-step-item">
                    <span class="tv-step-num">3</span>
                    <div><b>保存并添加图表</b><p>点击「保存」，然后点击「添加到图表」，立刻获得完整的量化风控复合图层！</p></div>
                  </div>
                </div>
                <div class="code-view-box tv-code-box">
                  <pre><code id="tvPineCodeText">${TRADINGVIEW_PINESCRIPT_V5.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
              </div>

              <!-- View 2: Cboe BZX -->
              <div class="tv-view-pane" id="tvPaneBzx" style="display:none;">
                <div class="tv-pane-header">
                  <div>
                    <h4>⚠️ Cboe BZX 免费数据源避坑指南（散户必读保命手卡）</h4>
                    <p>先看图表标注的数据源和是否延迟。若使用的是 Cboe BZX 数据，不要把单一交易所的成交量当成全市场总量。</p>
                  </div>
                </div>
                <div class="tv-bzx-grid">
                  <div class="bzx-card bad">
                    <div class="bzx-card-title">❌ 误区一：盯 1 秒/1 分钟图看“突破”</div>
                    <p><strong>底层真相：</strong>单一交易所与全市场汇总数据可能不同。不要用未经核实的 10%~15% 固定比例推算，也不要直接把细线判定为假成交。</p>
                    <div class="bzx-solution">🛡️ <strong>实战对策：</strong>在免费版上，趋势与止损判定以 <strong>5 分钟、15 分钟、日线收盘价</strong> 为准，忽略 1 分钟超短噪音。</div>
                  </div>
                  <div class="bzx-card bad">
                    <div class="bzx-card-title">❌ 误区二：开盘前 5 分钟挂市价单 (Market Order)</div>
                    <p><strong>底层真相：</strong>9:30-9:35 开盘期间，COIN 与 CRWV 盘口深度极浅，点差往往比主板 SIP 宽出 3~10 倍，市价单成交单笔滑点可直接蒸发 1.5% 预算！</p>
                    <div class="bzx-solution">🛡️ <strong>实战对策：</strong><strong>绝对严禁市价单！</strong>一律使用<strong>限价单 (Limit Order)</strong> 挂单，宁可挂单不成交，也绝不在深水区被抽流动性。</div>
                  </div>
                  <div class="bzx-card good">
                    <div class="bzx-card-title">✅ 必开配置：开启延长交易时段 (Extended Hours)</div>
                    <p><strong>底层真相：</strong>消息公布时间要逐项查日历，不能统一按 8:30 AM 或 16:00。打开延长时段能多看一部分交易，但不会消除真实跳空。</p>
                    <div class="bzx-solution">🛡️ <strong>实战对策：</strong>在 TradingView 图表右下角时区旁，点击 <strong>「ETH」</strong> 开启盘前盘后延长时段，让隔夜资金博弈清晰可见。</div>
                  </div>
                  <div class="bzx-card good">
                    <div class="bzx-card-title">✅ 成交量定性：只看放大倍数，不看绝对股数</div>
                    <p><strong>底层真相：</strong>BZX 的成交量只反映对应数据源，不能固定乘 8 或按 1/8 换算成全市场量。先确认图表统计了哪些交易。</p>
                    <div class="bzx-solution">🛡️ <strong>实战对策：</strong>比较当前柱成交量相对于过去 20 根均量（Volume MA20）的<strong>倍数关系</strong>（如放大 2.5 倍），定性放量与缩量。</div>
                  </div>
                </div>
              </div>

              <!-- View 3: Single Alert -->
              <div class="tv-view-pane" id="tvPaneAlert" style="display:none;">
                <div class="tv-pane-header">
                  <div>
                    <h4>🔔 设置价格提醒，了解如何发送通知</h4>
                    <p>先核对你的套餐能用多少条警报，以及是否支持 Webhook。下方只演示价格提醒：股价跌 1.5%，不等于整个账户亏 1.5%。</p>
                  </div>
                </div>
                <div class="tv-alert-setup">
                  <div class="tv-alert-form">
                    <div class="form-row">
                      <label>当前监控标的 (Ticker)：</label>
                      <div class="tv-quick-tickers">
                        <button type="button" class="btn-ticker-tag is-active" data-ticker="TSLA" data-price="215.00">TSLA</button>
                        <button type="button" class="btn-ticker-tag" data-ticker="CRWV" data-price="80.00">CRWV</button>
                        <button type="button" class="btn-ticker-tag" data-ticker="COIN" data-price="220.00">COIN</button>
                        <button type="button" class="btn-ticker-tag" data-ticker="SOXL" data-price="35.00">SOXL</button>
                      </div>
                      <input type="text" id="tvAlertTicker" value="TSLA" class="tv-input" />
                    </div>
                    <div class="form-row">
                      <label>持仓入场价 ($)：</label>
                      <input type="number" id="tvAlertEntry" value="215.00" step="0.5" class="tv-input" />
                    </div>
                    <div class="form-row">
                      <label>股价比入场价下跌多少时提醒（%）：</label>
                      <input type="number" id="tvAlertPct" value="1.5" step="0.1" class="tv-input" />
                    </div>
                    <div class="tv-calc-result">
                      <span>按上方跌幅计算的提醒价：</span>
                      <b id="tvAlertStopVal">$211.78</b>
                    </div>
                  </div>
                  <div class="tv-webhook-box">
                    <div class="tv-webhook-head">
                      <b>Webhook 通知内容示例（需自行连接接收服务）</b>
                      <button type="button" class="btn-copy-sm" id="btnCopyWebhook">复制 Webhook 报文</button>
                    </div>
                    <pre><code id="tvWebhookJson">{\n  "ticker": "TSLA",\n  "close": 211.78,\n  "event": "RISK_WATERLINE_BREACH",\n  "action": "HALT_AND_CLOSE",\n  "source": "TradingView_Free_Deck",\n  "auth_token": "SHAN_TA_SECURE_TOKEN_2026"\n}</code></pre>
                    <div class="tv-webhook-desc">
                      💡 <strong>设置方法：</strong>在 TradingView 警报窗口中，条件选择我们刚才安装的「TradingAgents 4-in-1」指标，触发动作勾选「Webhook URL」，把示例 JSON 填入消息正文，还需自行配置接收地址和身份验证。复制消息不会自动完成风控或下单。
                    </div>
                  </div>
                </div>
              </div>

              <!-- View 4: Drawing Cheat Sheet -->
              <div class="tv-view-pane" id="tvPaneDrawing" style="display:none;">
                <div class="tv-pane-header">
                  <div>
                    <h4>📐 28 节课专属画线板实操手卡 (对照免费版画线工具)</h4>
                    <p>学完知识，立刻在 TradingView 免费版标的图表画出防线。以下为全书重点章节画线工具与参数一览表：</p>
                  </div>
                  <div class="tv-drawing-badge-box">
                    <span class="tv-legend-pill tsla">TSLA</span>
                    <span class="tv-legend-pill crwv">CRWV</span>
                    <span class="tv-legend-pill coin">COIN</span>
                    <span class="tv-legend-pill soxl">SOXL</span>
                  </div>
                </div>
                <div class="tv-drawing-table-box">
                  <table class="tv-drawing-table">
                    <thead>
                      <tr>
                        <th style="width:10%">章节</th>
                        <th style="width:17%">核心主题</th>
                        <th style="width:13%">实战标的</th>
                        <th style="width:20%">TradingView 免费工具</th>
                        <th>实战画线口诀与参数</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${TRADINGVIEW_CHAPTER_TIPS.map(t => `
                        <tr>
                          <td><span class="badge-ch">第 ${t.ch} 章</span></td>
                          <td><b>${t.title}</b></td>
                          <td><span class="badge-ticker ${t.ticker.toLowerCase().replace(/[^a-z]/g, '')}">${t.ticker}</span></td>
                          <td><code>${t.tool}</code></td>
                          <td>${t.tip}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      // Close handler
      dialog.querySelector('.btn-close-tv').onclick = () => dialog.close();

      // Tab switching
      const cards = dialog.querySelectorAll('.tv-options .strategy-card');
      const panes = {
        pinescript: dialog.querySelector('#tvPanePinescript'),
        bzx: dialog.querySelector('#tvPaneBzx'),
        alert: dialog.querySelector('#tvPaneAlert'),
        drawing: dialog.querySelector('#tvPaneDrawing')
      };

      cards.forEach(card => {
        card.onclick = () => {
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const tabKey = card.dataset.tvTab;
          Object.keys(panes).forEach(k => {
            if (panes[k]) panes[k].style.display = (k === tabKey ? 'block' : 'none');
          });
        };
      });

      // Copy Pine Script Code
      dialog.querySelector('#btnCopyPineScript').onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(TRADINGVIEW_PINESCRIPT_V5).then(() => {
            showKeyToast('已复制 Pine Script v5 源码！请直接粘贴进 TradingView Pine 编辑器');
          });
        }
      };

      // Alert Calculator
      const tickerInput = dialog.querySelector('#tvAlertTicker');
      const entryInput = dialog.querySelector('#tvAlertEntry');
      const pctInput = dialog.querySelector('#tvAlertPct');
      const stopVal = dialog.querySelector('#tvAlertStopVal');
      const webhookJson = dialog.querySelector('#tvWebhookJson');
      const tickerBtns = dialog.querySelectorAll('.btn-ticker-tag');

      tickerBtns.forEach(btn => {
        btn.onclick = () => {
          tickerBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          tickerInput.value = btn.dataset.ticker;
          if (btn.dataset.price) entryInput.value = btn.dataset.price;
          updateAlertCalc();
        };
      });

      function updateAlertCalc() {
        const ticker = (tickerInput.value || 'TSLA').toUpperCase().trim();
        const entry = parseFloat(entryInput.value) || 215.00;
        const pct = parseFloat(pctInput.value) || 1.5;
        const stop = (entry * (1 - pct / 100)).toFixed(2);
        stopVal.textContent = `$${stop}`;
        const payload = {
          ticker: ticker,
          close: parseFloat(stop),
          event: "RISK_WATERLINE_BREACH",
          action: "HALT_AND_CLOSE",
          source: "TradingView_Free_Deck",
          auth_token: "SHAN_TA_SECURE_TOKEN_2026"
        };
        webhookJson.textContent = JSON.stringify(payload, null, 2);
      }

      [tickerInput, entryInput, pctInput].forEach(inp => inp.addEventListener('input', updateAlertCalc));

      dialog.querySelector('#btnCopyWebhook').onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(webhookJson.textContent).then(() => {
            showKeyToast('已复制 Webhook 报文！');
          });
        }
      };
    }

    if (defaultTab) {
      const targetCard = dialog.querySelector(`[data-tv-tab="${defaultTab}"]`);
      if (targetCard) targetCard.click();
    }

    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
  window.toggleTradingViewModal = toggleTradingViewModal;



  // 7.1.5 Loss Autopsy & Replay Simulator Modal (告别感性 · 六年美股三万刀亏损深度解剖)
  const LOSS_AUTOPSY_TRADES = [
    {
      name: "第 1 笔：突破假动作回踩破位 (False Breakout)",
      emo: {
        action: "追高买入后股价跳水，舍不得割肉，心想“跌这么多了肯定会反弹”，死扛到底。",
        pnl: -2200,
        tags: ["不设止损", "抱侥幸心理", "浮亏扩大"]
      },
      quant: {
        action: "本例按事先设置的止损退出，记录损失 $1,000。真实市价单不保证成交价，实际损失可能超过预算。",
        pnl: -1000,
        tags: ["1%止损执行", "承认失误", "保全99%本金"]
      }
    },
    {
      name: "第 2 笔：逆势下行探底 (Falling Knife)",
      emo: {
        action: "看股价继续下跌，动了 Martingale 赌徒念头：逆势补仓 500 股以摊平买入成本，结果遭遇继续阴跌。",
        pnl: -3800,
        tags: ["加仓摊平", "越跌越买", "仓位失控"]
      },
      quant: {
        action: "价格跌破 200 日线且均线空头排列，动量智能体判定趋势破坏，风险官一票否决开仓请求。",
        pnl: 0,
        tags: ["拒绝接飞刀", "空仓观望", "零损失"]
      }
    },
    {
      name: "第 3 笔：连续震荡假信号止损 (Consecutive Losses)",
      emo: {
        action: "连续两笔亏损后心态彻底失衡，急于一天回本，情绪报复性加 2 倍杠杆重仓下单！",
        pnl: -5500,
        tags: ["报复性开仓", "私加杠杆", "情绪失控"]
      },
      quant: {
        action: "出现第 2 笔小额止损 (-$950)。触发【连亏熔断保护协议】，系统自动锁定交易权限 24 小时强制冷却。",
        pnl: -950,
        tags: ["熔断机制生效", "强制冷静", "截断连败"]
      }
    },
    {
      name: "第 4 笔：科技巨头财报公布前夕 (High IV Earnings Event)",
      emo: {
        action: "听说财报必大涨，全仓裸买虚值看涨期权（IV 120%）。财报后股价微涨 1.5%，但遭遇 IV Crush，期权价格大幅下跌！",
        pnl: -4500,
        tags: ["赌徒博弈", "IV Crush 归零", "致命无知"]
      },
      quant: {
        action: "期权智能体识别 IV 处于 95 分位极高区，坚决拒绝单腿买方，改用垂直借记价差 (Debit Spread) 严格锁定最大风险。",
        pnl: 1400,
        tags: ["垂直价差对冲", "波动率防御", "本例盈利"]
      }
    },
    {
      name: "第 5 笔：CPI 宏观数据超预期公布 (Macro Shock Event)",
      emo: {
        action: "数据公布前 1 分钟凭直觉猜降息重仓买入，CPI 暴雷导致纳指盘前跳空低开，开盘瞬间被爆击。",
        pnl: -4200,
        tags: ["猜宏观数据", "忽略跳空风险", "被动挨打"]
      },
      quant: {
        action: "宏观事件前夕自动降仓至 20% 防御水位，设置跨资产压力缓冲，仅承受预期内的微小扰动。",
        pnl: -600,
        tags: ["事件前降仓", "压力测试", "风险可控"]
      }
    },
    {
      name: "第 6 笔：盘后盘前流动性枯竭时段 (Extended Hours Trap)",
      emo: {
        action: "盘后看到突发快讯冲动用市价单挂单，买卖点差高达 $1.20，遭遇做市商严重滑点宰割。",
        pnl: -2800,
        tags: ["盘后市价单", "滑点吞噬", "流动性盲区"]
      },
      quant: {
        action: "时段路由智能体强制执行：盘前盘后只允许限价单 (DAY/IOC)，若点差超过 0.3% 立即拒绝路由。",
        pnl: 0,
        tags: ["限价单铁律", "流动性门禁", "拒绝滑点"]
      }
    },
    {
      name: "第 7 笔：高位横盘破位诱多 (Distribution Breakdown)",
      emo: {
        action: "大盘在历史高位反复背离，身边朋友都在赚钱，FOMO 追高买入题材股，惨遭主力出货套牢。",
        pnl: -3500,
        tags: ["FOMO 情绪", "高位接盘", "盲目跟风"]
      },
      quant: {
        action: "舆情智能体检测到社媒狂热度过载，技术智能体发出顶背离预警，启动防守减仓策略。",
        pnl: 0,
        tags: ["逆情绪纪律", "防守空仓", "安全避险"]
      }
    },
    {
      name: "第 8 笔：顺势右侧放量突破 (Confirmed Momentum Trend)",
      emo: {
        action: "之前亏怕了，稍有一点微利 ($300) 就慌忙落袋为安，彻底错过了随后的 40% 主升浪！",
        pnl: 300,
        tags: ["拿不住利润", "亏大赚小", "盈亏比倒挂"]
      },
      quant: {
        action: "放量突破牛熊线确认，采用移动止盈 (Trailing Stop) 保护利润，实现 2.8:1 优异盈亏比！",
        pnl: 2800,
        tags: ["让利润奔跑", "移动止盈", "盈亏比 2.8:1"]
      }
    },
    {
      name: "第 9 笔：极端恐慌下影线反转 (Capitulation Reversal)",
      emo: {
        action: "在市场连续阴跌的大阴线底部承受不住心理压力，在最低点恐慌割肉，刚割完股价暴力反弹！",
        pnl: -4800,
        tags: ["恐慌割肉", "倒在黎明前", "心态崩溃"]
      },
      quant: {
        action: "遵循客观出场规则，未触及失效位不因恐慌盲目割肉，反向利用做空限制 SSR 进行高确定性交易。",
        pnl: 3200,
        tags: ["客观纪律", "逆向捕捉", "利润兑现"]
      }
    },
    {
      name: "第 10 笔：高盈亏比主升浪波段 (R:R 3:1 Wave)",
      emo: {
        action: "账户已被折腾到只剩 $70,000 (-$30,000)，面对真正的大机会已经不敢下单，只能眼睁睁看行情起飞。",
        pnl: 0,
        tags: ["丧失信心", "心理瘫痪", "最终净亏 $30k"]
      },
      quant: {
        action: "多智能体一致共识，严格按 1% 风险（当前本金的 1%）建立标准仓位，捕获完整波段收益！",
        pnl: 4600,
        tags: ["知行合一", "复利增长", "查看下方累计盈亏"]
      }
    }
  ];

  function toggleLossAutopsyModal() {
    let dialog = document.getElementById('lossAutopsyDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'lossAutopsyDialog';
      dialog.className = 'autopsy-dialog';
      dialog.innerHTML = `
        <div class="autopsy-dialog-content">
          <div class="autopsy-dialog-head">
            <div>
              <h3>📉 告别感性 · 六年美股三万刀亏损深度解剖与量化重生沙盒</h3>
              <p>以 -$30,000 的亏损为例，比较 10 笔预设交易的做法。这些结果是演示数据，不是策略收益证明。</p>
            </div>
            <button type="button" class="btn-close-autopsy" aria-label="关闭">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5"></line>
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5"></line>
              </svg>
            </button>
          </div>

          <div class="autopsy-dialog-body">
            <!-- Section 1: Asymmetric Drawdown Math -->
            <div class="autopsy-math-card">
              <div class="autopsy-card-header">
                <b>📐 亏损后，要涨多少才能回本</b>
                <span class="math-badge">亏损数学方程</span>
              </div>
              <div class="autopsy-stats-grid">
                <div class="stat-box">
                  <span class="stat-label">初始账户本金</span>
                  <span class="stat-val">$100,000</span>
                  <small>6 年前入场资金</small>
                </div>
                <div class="stat-box loss">
                  <span class="stat-label">6年感性累计净亏</span>
                  <span class="stat-val">-$30,000</span>
                  <small>回撤幅度 -30.0%</small>
                </div>
                <div class="stat-box current">
                  <span class="stat-label">示例剩余本金</span>
                  <span class="stat-val">$70,000</span>
                  <small>亏损后还剩的钱</small>
                </div>
                <div class="stat-box recover">
                  <span class="stat-label">真实回本所需净涨幅</span>
                  <span class="stat-val">+42.86%</span>
                  <small>剩余本金变少，回本更难</small>
                </div>
              </div>
              <div class="autopsy-math-formula">
                <code>回本所需收益率 R = 亏损金额 ÷ 剩余本金 = $30,000 ÷ $70,000 = +42.86%</code>
                <p>⚠️ <b>痛点反思：</b>亏损 30% 并不等于赚回 30% 就能打平！如果你继续凭感性追涨杀跌、不设 1% 止损，一旦本金亏到 50% ($50,000)，回本需要上涨 100%（翻倍）！这说明剩余本金越少，回本越难；这里没有统计证据支持“90% 散户”这样的结论。</p>
              </div>
            </div>

            <!-- Section 2: Interactive 10-Trade Monte Carlo Replay Simulator -->
            <div class="autopsy-simulator-section">
              <div class="simulator-toolbar">
                <div class="sim-title">
                  <b>⚡ 10 笔美股真实市场情境 · 对照推演回放</b>
                  <span id="simStepIndicator" class="sim-step-badge">当前进度: 第 0 / 10 笔</span>
                </div>
                <div class="sim-actions">
                  <button type="button" id="btnSimStep" class="btn-sim-primary">▶ 逐笔推演下一笔</button>
                  <button type="button" id="btnSimFast" class="btn-sim-secondary">⚡ 一键推演完毕</button>
                  <button type="button" id="btnSimReset" class="btn-sim-ghost">🔄 重置回放</button>
                </div>
              </div>

              <!-- Dynamic Equity Chart -->
              <div class="sim-chart-wrap">
                <div class="chart-legend">
                  <span class="legend-item red"><i class="dot red"></i> 过去6年感性交易模式 (-$30,000 路径)</span>
                  <span class="legend-item green"><i class="dot green"></i> TradingAgents 按规则交易的示例路径</span>
                  <span class="legend-item baseline"><i class="line-base"></i> $100k 起始本金基准</span>
                </div>
                <svg id="simDualEquitySvg" class="sim-equity-svg" viewBox="0 0 800 160" preserveAspectRatio="none">
                  <!-- Rendered dynamically -->
                </svg>
              </div>

              <!-- Step Comparison Cards -->
              <div class="sim-dual-cards">
                <!-- Left: Emotional Mode -->
                <div class="sim-card emotional-mode">
                  <div class="sim-card-head">
                    <span class="mode-badge red">❌ 过去6年感性交易模式</span>
                    <div class="card-equity-live">
                      净值: <b id="emoEquityVal">$100,000</b> (<span id="emoPnlVal" class="text-red">$0</span>)
                    </div>
                  </div>
                  <div class="sim-card-content">
                    <div class="sim-scenario-name" id="emoScenarioName">准备就绪：点击【逐笔推演】开始重温 10 笔市场考验</div>
                    <div class="sim-inner-box red">
                      <div class="box-title">💭 散户当时的心魔独白与感性动作：</div>
                      <p id="emoMonologue">“先观察行情，凭盘感买卖。”</p>
                    </div>
                    <div class="sim-tags-list" id="emoTagsList">
                      <span class="sim-tag red">无风控</span>
                      <span class="sim-tag red">凭直觉</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Quant Mode -->
                <div class="sim-card quant-mode">
                  <div class="sim-card-head">
                    <span class="mode-badge green">🛡️ TradingAgents 量化纪律模式</span>
                    <div class="card-equity-live">
                      净值: <b id="quantEquityVal">$100,000</b> (<span id="quantPnlVal" class="text-green">+$0</span>)
                    </div>
                  </div>
                  <div class="sim-card-content">
                    <div class="sim-scenario-name" id="quantScenarioName">准备就绪：智能体系统 Fail-Closed 防线已就位</div>
                    <div class="sim-inner-box green">
                      <div class="box-title">🤖 TradingAgents 多智能体协同裁决：</div>
                      <p id="quantVerdict">“风险官牢守 本例亏损上限：本金的 1%与日内 3 连亏熔断门禁。”</p>
                    </div>
                    <div class="sim-tags-list" id="quantTagsList">
                      <span class="sim-tag green">1% 止损红线</span>
                      <span class="sim-tag green">Fail-Closed</span>
                      <span class="sim-tag green">盈亏比 ≥ 2:1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Local Python CLI Integration -->
            <div class="autopsy-python-bridge">
              <div class="bridge-head">
                <b>💻 本地工程已生成 Python 终端工具：<code>tradingagents_workbench.py</code></b>
                <p>在你的 Mac 终端中直接运行，随时进行实盘股票池扫描与风控体检：</p>
              </div>
              <div class="bridge-commands">
                <div class="cmd-row">
                  <code>python3 tradingagents_workbench.py --autopsy</code>
                  <button type="button" class="btn-copy-cmd" data-cmd="python3 tradingagents_workbench.py --autopsy">复制命令</button>
                  <span class="cmd-desc">打印 6 年亏损数学解剖与回本方程</span>
                </div>
                <div class="cmd-row">
                  <code>python3 tradingagents_workbench.py --demo</code>
                  <button type="button" class="btn-copy-cmd" data-cmd="python3 tradingagents_workbench.py --demo">复制命令</button>
                  <span class="cmd-desc">运行三大实战案例的多智能体辩论与风控一票否决</span>
                </div>
                <div class="cmd-row">
                  <code>python3 tradingagents_workbench.py --audit AAPL,NVDA,TSLA</code>
                  <button type="button" class="btn-copy-cmd" data-cmd="python3 tradingagents_workbench.py --audit AAPL,NVDA,TSLA">复制命令</button>
                  <span class="cmd-desc">对自选标的按 本例亏损上限：本金的 1%倒推仓位股数</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      dialog.querySelector('.btn-close-autopsy').onclick = () => dialog.close();
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

      dialog.querySelectorAll('.btn-copy-cmd').forEach(btn => {
        btn.onclick = () => {
          const cmd = btn.dataset.cmd;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(cmd).then(() => {
              showKeyToast('已复制命令！可在 Mac 终端粘贴运行。');
            });
          }
        };
      });

      const btnStep = dialog.querySelector('#btnSimStep');
      const btnFast = dialog.querySelector('#btnSimFast');
      const btnReset = dialog.querySelector('#btnSimReset');
      const stepIndicator = dialog.querySelector('#simStepIndicator');
      const emoEquityEl = dialog.querySelector('#emoEquityVal');
      const emoPnlEl = dialog.querySelector('#emoPnlVal');
      const emoScenarioEl = dialog.querySelector('#emoScenarioName');
      const emoMonologueEl = dialog.querySelector('#emoMonologue');
      const emoTagsList = dialog.querySelector('#emoTagsList');

      const quantEquityEl = dialog.querySelector('#quantEquityVal');
      const quantPnlEl = dialog.querySelector('#quantPnlVal');
      const quantScenarioEl = dialog.querySelector('#quantScenarioName');
      const quantVerdictEl = dialog.querySelector('#quantVerdict');
      const quantTagsList = dialog.querySelector('#quantTagsList');
      const svgEl = dialog.querySelector('#simDualEquitySvg');

      let currentStep = 0;

      function renderSimUI() {
        stepIndicator.textContent = `当前进度: 第 ${currentStep} / ${LOSS_AUTOPSY_TRADES.length} 笔`;

        let emoEq = 100000;
        let quantEq = 100000;
        const emoHistory = [100000];
        const quantHistory = [100000];

        for (let i = 0; i < currentStep; i++) {
          emoEq += LOSS_AUTOPSY_TRADES[i].emo.pnl;
          quantEq += LOSS_AUTOPSY_TRADES[i].quant.pnl;
          emoHistory.push(emoEq);
          quantHistory.push(quantEq);
        }

        emoEquityEl.textContent = `$${emoEq.toLocaleString()}`;
        const emoDelta = emoEq - 100000;
        emoPnlEl.textContent = `${emoDelta >= 0 ? '+' : ''}$${emoDelta.toLocaleString()}`;

        quantEquityEl.textContent = `$${quantEq.toLocaleString()}`;
        const quantDelta = quantEq - 100000;
        quantPnlEl.textContent = `${quantDelta >= 0 ? '+' : ''}$${quantDelta.toLocaleString()}`;

        if (currentStep > 0) {
          const trade = LOSS_AUTOPSY_TRADES[currentStep - 1];
          emoScenarioEl.textContent = trade.name;
          emoMonologueEl.textContent = `“${trade.emo.action}” (当期损益: ${trade.emo.pnl >= 0 ? '+' : ''}$${trade.emo.pnl})`;
          emoTagsList.innerHTML = trade.emo.tags.map(t => `<span class="sim-tag red">${t}</span>`).join('');

          quantScenarioEl.textContent = trade.name;
          quantVerdictEl.textContent = `${trade.quant.action} (当期损益: ${trade.quant.pnl >= 0 ? '+' : ''}$${trade.quant.pnl})`;
          quantTagsList.innerHTML = trade.quant.tags.map(t => `<span class="sim-tag green">${t}</span>`).join('');
        } else {
          emoScenarioEl.textContent = '准备就绪：点击【逐笔推演】开始重温 10 笔市场考验';
          emoMonologueEl.textContent = '“先观察行情，凭盘感买卖。”';
          emoTagsList.innerHTML = '<span class="sim-tag red">无风控</span><span class="sim-tag red">凭直觉</span>';

          quantScenarioEl.textContent = '准备就绪：智能体系统 Fail-Closed 防线已就位';
          quantVerdictEl.textContent = '“风险官牢守 本例亏损上限：本金的 1%与日内 3 连亏熔断门禁。”';
          quantTagsList.innerHTML = '<span class="sim-tag green">1% 止损红线</span><span class="sim-tag green">Fail-Closed</span>';
        }

        btnStep.disabled = currentStep >= LOSS_AUTOPSY_TRADES.length;
        btnFast.disabled = currentStep >= LOSS_AUTOPSY_TRADES.length;

        // Render SVG Lines
        const minVal = 60000;
        const maxVal = 130000;
        const mapY = (val) => 140 - ((val - minVal) / (maxVal - minVal)) * 120;
        const stepWidth = 720 / 10;
        const startX = 40;

        const baseY = mapY(100000);
        let svgHtml = `
          <line x1="20" y1="${baseY}" x2="780" y2="${baseY}" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5" />
          <text x="25" y="${baseY - 5}" font-size="10" fill="#94a3b8" font-family="monospace">$100k 基准</text>
        `;

        // Emotional polyline
        const emoPoints = emoHistory.map((val, idx) => `${startX + idx * stepWidth},${mapY(val)}`).join(' ');
        svgHtml += `<polyline points="${emoPoints}" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;
        emoHistory.forEach((val, idx) => {
          svgHtml += `<circle cx="${startX + idx * stepWidth}" cy="${mapY(val)}" r="4" fill="#dc2626" />`;
        });

        // Quant polyline
        const quantPoints = quantHistory.map((val, idx) => `${startX + idx * stepWidth},${mapY(val)}`).join(' ');
        svgHtml += `<polyline points="${quantPoints}" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;
        quantHistory.forEach((val, idx) => {
          svgHtml += `<circle cx="${startX + idx * stepWidth}" cy="${mapY(val)}" r="4" fill="#16a34a" />`;
        });

        svgEl.innerHTML = svgHtml;
      }

      btnStep.onclick = () => {
        if (currentStep < LOSS_AUTOPSY_TRADES.length) {
          currentStep++;
          renderSimUI();
        }
      };

      btnFast.onclick = () => {
        currentStep = LOSS_AUTOPSY_TRADES.length;
        renderSimUI();
      };

      btnReset.onclick = () => {
        currentStep = 0;
        renderSimUI();
      };

      renderSimUI();
    }

    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  // 7.1 Paradigm Shift Compass Modal (散户破局 · 数据/逻辑/纪律罗盘)
  function toggleParadigmModal() {
    let dialog = document.getElementById('paradigmDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'paradigmDialog';
      dialog.className = 'paradigm-dialog';
      dialog.innerHTML = `
        <div class="paradigm-dialog-content">
          <div class="paradigm-dialog-head">
            <div>
              <h3>🧭 散户破局指南：告别感性 · 走数据 / 走逻辑 / 走纪律</h3>
              <p>6 年 3 万刀学费深度复盘与机构级风控防御体系</p>
            </div>
            <button type="button" class="btn-close-paradigm" aria-label="关闭">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5"></line>
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5"></line>
              </svg>
            </button>
          </div>
          <div class="paradigm-dialog-body">
            <div>
              <div class="paradigm-section-title">🚨 为什么 6 年会亏掉 3 万刀？四大隐蔽收割黑洞</div>
              <div class="holes-grid">
                <div class="hole-card">
                  <h4>① 仓位无锚（赚小钱跑，亏大钱死扛）</h4>
                  <p>没有按“可承受最大亏损”反推股数，赚几百刀心慌止盈，亏几千刀加仓摊平，一次黑天鹅单笔直接爆仓。</p>
                </div>
                <div class="hole-card">
                  <h4>② 裸期权 IV 坍塌与时间流逝黑洞</h4>
                  <p>财报前裸买虚值 Call/Put，即便股价猜对微涨，也会被 IV Crush 暴跌与 Theta 每天流逝吞噬 60%~90%。</p>
                </div>
                <div class="hole-card">
                  <h4>③ 高贝塔资产的伪分散共振杀跌</h4>
                  <p>账户里买入 5 只不同的热门科技股，以为分散了风险，本质上都是高贝塔宏观利率敞口，估值下杀时全军覆没。</p>
                </div>
                <div class="hole-card">
                  <h4>④ 盘前盘后做市商掠夺与跳空击穿</h4>
                  <p>迷信止损单是保价单，财报跳空直接越过止损价；在流动性薄弱的盘后打市价单，被宽点差掠夺几百刀。</p>
                </div>
              </div>
            </div>

            <div>
              <div class="paradigm-section-title">🔥 10 维心智转换：感性散户 vs 量化交易员</div>
              <div class="hole-card" style="background: #fdfefe; border: 1px solid #cbd5e1; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.6;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
                      <th style="padding: 6px 8px; color: #b91c1c; width: 45%;">❌ 曾经的感性冲动（亏损根源）</th>
                      <th style="padding: 6px 8px; color: #047857; width: 55%;">✔️ 现在的量化三原则（数据·逻辑·纪律）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 6px 8px; color: #991b1b;">“看好这家公司，先买满仓位再找止损”</td>
                      <td style="padding: 6px 8px; color: #065f46;"><b>📊 走数据</b>：预算 $800 ÷ 每股风险 $4 = 严格只能买 200 股。</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 6px 8px; color: #991b1b;">“已经跌了 20%，肯定见底了，加仓摊平”</td>
                      <td style="padding: 6px 8px; color: #065f46;"><b>🛡️ 走纪律</b>：触碰预设止损点无条件出局，严禁加仓摊平。</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 6px 8px; color: #991b1b;">“今天连亏两单太气人了，加大杠杆翻本”</td>
                      <td style="padding: 6px 8px; color: #065f46;"><b>🛡️ 走纪律</b>：日内连亏 3 笔立即合电脑熔断，当日禁开新仓。</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 6px 8px; color: #991b1b;">“财报今晚出，买张 Call 赌个暴利翻倍”</td>
                      <td style="padding: 6px 8px; color: #065f46;"><b>🧠 走逻辑</b>：识别 IV Crush 悬崖，事件前拒绝裸买期权。</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 6px 8px; color: #991b1b;">“想用期权以小博大，单腿买虚值最便宜”</td>
                      <td style="padding: 6px 8px; color: #065f46;"><b>🛡️ 走纪律</b>：用垂直价差（Spread）限定最大亏损，对冲时间衰减。</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 8px; color: #991b1b;">“盘后出好消息，赶快按市价单追进”</td>
                      <td style="padding: 6px 8px; color: #065f46;"><b>🧠 走逻辑</b>：延长时段无 NBBO 保护，市价单会被点差狠狠吞噬。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div class="paradigm-section-title">🛡️ 散户破局 10 大重点规则（直达实战台）</div>
              <div class="critical-links-grid" id="paradigmCriticalLinks">
                <!-- Dynamically rendered -->
              </div>
            </div>
          </div>
          <div class="paradigm-dialog-foot">
            <button type="button" class="btn-copy-creed">📋 复制个人交易军规 7 条</button>
            <button type="button" class="btn-close-paradigm-text" style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 13px;">关闭 (Esc)</button>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      // Render critical links
      const linksContainer = dialog.querySelector('#paradigmCriticalLinks');
      const criticalIndices = [0, 2, 3, 9, 12, 14, 19, 23, 24, 26];
      criticalIndices.forEach(idx => {
        const item = PARADIGM_TRINITY[idx];
        if (!item) return;
        const btn = document.createElement('div');
        btn.className = 'critical-link-item';
        btn.innerHTML = `
          <div class="critical-link-title">第 ${idx + 1} 章 · ${item.title}</div>
          <div class="critical-link-desc"><b>破局重点：</b>${item.cure}</div>
        `;
        btn.onclick = () => {
          dialog.close();
          if (typeof window.v2Active !== 'undefined') {
            window.v2Active = idx;
            if (typeof window.v2Save === 'function') window.v2Save();
            if (typeof window.v2Render === 'function') window.v2Render();
          } else {
            localStorage.setItem('manga-us-v2-active', String(idx));
            location.reload();
          }
        };
        linksContainer.appendChild(btn);
      });

      dialog.querySelector('.btn-close-paradigm').onclick = () => dialog.close();
      dialog.querySelector('.btn-close-paradigm-text').onclick = () => dialog.close();
      dialog.querySelector('.btn-copy-creed').onclick = () => {
        const creed = [
          '【量化交易员终身交易军规 7 条】',
          '1. 【单笔定亏】每笔实盘最大亏损严禁超过账户总净值的 1%，仓位由亏损反推。',
          '2. 【严禁摊平】触及止损线无条件斩仓离场，绝对不准加仓摊平成本。',
          '3. 【三亏熔断】日内连续亏损 3 笔或单日亏损触及 1.5%，立即关电脑拔网线。',
          '4. 【不赌财报】重大事件与财报前夕必须大幅降仓，严禁全仓过夜赌单边。',
          '5. 【拒绝裸期权】严禁在财报前裸买虚值期权，使用垂直价差（Spread）锁定最大亏损。',
          '6. 【禁盘后市价】延长时段流动性薄弱无 NBBO 保护，严禁使用市价单追价。',
          '7. 【无反证不下单】每笔交易必须在事前写下反面失效条件，坚守 Fail-Closed 关闸。'
        ].join('\n');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(creed).then(() => {
            showKeyToast('已复制交易军规 7 条到剪贴板！');
          }).catch(() => {
            showKeyToast('复制失败，请选中文字手动复制');
          });
        }
      };
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    }
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  // 8. Keyboard Shortcut Cheat Sheet Modal
  function toggleShortcutModal() {
    let dialog = document.getElementById('shortcutDialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'shortcutDialog';
      dialog.className = 'shortcut-dialog';
      dialog.innerHTML = `
        <div class="shortcut-dialog-content">
          <div class="shortcut-dialog-head">
            <h3>⌨️ 键盘快捷键</h3>
            <button type="button" class="btn-close-shortcuts" aria-label="关闭">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                <line x1="1.5" y1="1.5" x2="8.5" y2="8.5"></line>
                <line x1="8.5" y1="1.5" x2="1.5" y2="8.5"></line>
              </svg>
            </button>
          </div>
          <div class="shortcut-grid">
            <div class="shortcut-item"><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd><span>快速做出判断（选择题 / 排序）</span></div>
            <div class="shortcut-item"><kbd>Enter</kbd> / <kbd>Space</kbd><span>推进到下一阶段（懂背景 → 看例子 → 做判断 → 记规则）</span></div>
            <div class="shortcut-item"><kbd>J</kbd> / <kbd>→</kbd><span>直接切到下一章</span></div>
            <div class="shortcut-item"><kbd>K</kbd> / <kbd>←</kbd><span>直接切到上一章</span></div>
            <div class="shortcut-item"><kbd>[</kbd><span>收起 / 展开左侧 28 章目录树</span></div>
            <div class="shortcut-item"><kbd>V</kbd><span>打开 TradingView 免费版实操舱 (突破3指标/BZX避坑)</span></div>
            <div class="shortcut-item"><kbd>M</kbd><span>打开 TradingAgents 多智能体实操台</span></div>
            <div class="shortcut-item"><kbd>X</kbd><span>打开 6年-$30k 亏损深度复盘沙盒</span></div>
            <div class="shortcut-item"><kbd>P</kbd><span>打开 散户破局指南罗盘 (数据·逻辑·纪律)</span></div>
            <div class="shortcut-item"><kbd>T</kbd><span>一键轮换设计主题 (🍎 经典苹果 / ☀️ 论文暖白 / 🌙 彭博暗黑)</span></div>
            <div class="shortcut-item"><kbd>R</kbd><span>打开118篇通俗讲解</span></div>
            <div class="shortcut-item"><kbd>?</kbd><span>打开 / 关闭本快捷键速查表</span></div>
            <div class="shortcut-item"><kbd>Esc</kbd><span>关闭弹窗 / 极速防窥模式</span></div>
          </div>
          <div class="shortcut-dialog-foot">
            <small>提示：在输入框内输入时不触发全局快捷键</small>
            <button type="button" class="btn-dismiss-shortcuts">我知道了 (Enter)</button>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);
      dialog.querySelector('.btn-close-shortcuts').onclick = () => dialog.close();
      dialog.querySelector('.btn-dismiss-shortcuts').onclick = () => dialog.close();
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    }
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  // 9. Right Column: Live Paper Receipts Feed & Exposure Meter
  function renderJournalLiveReceipts() {
    const journal = document.getElementById('tradeJournal');
    if (!journal) return;

    let dock = journal.querySelector('.journal-terminal-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.className = 'journal-terminal-dock';
      const openTools = journal.querySelector('#openTools');
      if (openTools) {
        openTools.after(dock);
      } else {
        journal.appendChild(dock);
      }
    }

    const curDoneSize = (typeof v2Done !== 'undefined' && v2Done.size !== undefined) ? v2Done.size : 0;
    const coveragePct = Math.round(curDoneSize / 28 * 100);

    const doneList = (typeof v2Done !== 'undefined') ? Array.from(v2Done).sort((a, b) => b - a) : [];

    let receiptsHtml = '';
    if (doneList.length === 0) {
      receiptsHtml = `
        <div class="receipt-empty">
          <span class="pulse-dot">●</span>
          <p>等待首笔决策提交生成 Paper 凭证...</p>
        </div>
      `;
    } else {
      receiptsHtml = doneList.slice(0, 5).map(chIdx => {
        const title = (typeof V2_TITLES !== 'undefined' && V2_TITLES[chIdx]) ? V2_TITLES[chIdx][0] : `第 ${chIdx + 1} 章`;
        return `
          <div class="receipt-ticket">
            <div class="ticket-meta">
              <span class="ticket-ch">CH.${String(chIdx + 1).padStart(2, '0')}</span>
              <span class="ticket-status">✓ 练习通过</span>
            </div>
            <div class="ticket-title">${title}</div>
            <div class="ticket-foot">
              <span class="ticket-tag">Paper 台账</span>
              <span class="ticket-verified">已校验</span>
            </div>
          </div>
        `;
      }).join('');
    }

    dock.innerHTML = `
      <div class="exposure-meter">
        <div class="meter-head">
          <span>🛡️ 章节完成比例</span>
          <b class="tabular-nums">${coveragePct}%</b>
        </div>
        <div class="meter-bar">
          <div class="meter-fill" style="width: ${coveragePct}%"></div>
        </div>
        <div class="meter-labels">
          <span>仅显示章节进度</span>
          <span>这里只统计练习进度</span>
        </div>
      </div>

      <div class="live-receipts-feed">
        <div class="feed-header">
          <span>📜 模拟练习记录 (${curDoneSize}/28)</span>
          <small class="live-indicator">LIVE</small>
        </div>
        <div class="receipts-list">
          ${receiptsHtml}
        </div>
      </div>
    `;
  }

  // 10. Phase 4: Rule Seal Badge & Next Chapter Preview
  function enhancePhase4Rules() {
    const phase4 = document.getElementById('lesson-phase-4');
    if (!phase4) return;

    const curChapter = (typeof window !== 'undefined' && window.v2Active !== undefined)
      ? window.v2Active
      : (typeof v2Active !== 'undefined' ? v2Active : +(localStorage.getItem('manga-us-v2-active') || 0));

    // Enhance principle with stamp and copy action
    const principle = phase4.querySelector('.principle');
    if (principle && !principle.querySelector('.rule-seal-badge')) {
      const quoteText = principle.querySelector('p')?.textContent.trim() || principle.textContent.trim();
      const sealBadge = document.createElement('div');
      sealBadge.className = 'rule-seal-badge';
      const paradigmInfo = PARADIGM_TRINITY[curChapter];
      let contrastHtml = '';
      if (paradigmInfo) {
        contrastHtml = `
          <div class="rule-contrast-grid">
            <div class="contrast-col emotion-col">
              <span class="contrast-tag red">❌ 曾经的感性冲动</span>
              <p>${paradigmInfo.trap}</p>
            </div>
            <div class="contrast-col discipline-col">
              <span class="contrast-tag green">✔️ 现在的铁血纪律</span>
              <p>${paradigmInfo.discipline}</p>
            </div>
          </div>
        `;
      }
      sealBadge.innerHTML = `
        <div class="seal-inner-row">
          <div class="seal-meta">
            <span class="seal-stamp">🛡️ 风控委员会审计核准</span>
            <small class="seal-serial">NO. RISK-${String(curChapter + 1).padStart(3, '0')}</small>
          </div>
          <button type="button" class="btn-copy-rule" title="复制本章风控军规">📋 复制本章纪律卡</button>
        </div>
        ${contrastHtml}
      `;
      principle.prepend(sealBadge);

      sealBadge.querySelector('.btn-copy-rule').onclick = () => {
        const fullRuleText = `【风控军规 第 ${curChapter + 1} 章 · ${PARADIGM_TRINITY[curChapter]?.title || ''}】\n` +
          `❌ 摒弃感性心魔：${paradigmInfo?.trap || ''}\n` +
          `📊 数据依据：${paradigmInfo?.data || ''}\n` +
          `🧠 微观逻辑：${paradigmInfo?.logic || ''}\n` +
          `🛡️ 铁血纪律：${paradigmInfo?.discipline || quoteText}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullRuleText).then(() => {
            showKeyToast('已复制本章风控军规至剪贴板！');
          }).catch(() => {
            showKeyToast('复制失败，请选中文字手动复制');
          });
        } else {
          showKeyToast('当前浏览器不支持复制，请选中文字手动复制');
        }
      };
    }

    // Riesling mastery card before nextPreview
    let rieslingMastery = phase4.querySelector('.riesling-mastery-card');
    if (!rieslingMastery) {
      rieslingMastery = document.createElement('div');
      rieslingMastery.className = 'riesling-mastery-card';
      const nav = phase4.querySelector('.lesson-nav') || phase4.lastElementChild;
      phase4.insertBefore(rieslingMastery, nav);
    }
    const curChapNum = curChapter + 1;
    const rMap = (typeof window !== 'undefined' && window.CHAPTER_RIESLING_MAP) ? window.CHAPTER_RIESLING_MAP[curChapter] : null;
    if (rMap) {
      const getTitle = (id) => {
        if (window.RIESLING_TOC && window.RIESLING_TOC.sections) {
          for (const s of window.RIESLING_TOC.sections) {
            for (const it of s.items) {
              if (it.id === id) return it.t;
            }
          }
        }
        return id;
      };
      const subBtns = (rMap.relatedIds || []).map(id => {
        const title = getTitle(id);
        return `<button type="button" class="btn-sub-art" onclick="window.openRieslingArticleModal('${id}')" title="深入研习：《${title}》">📄 《${title}》</button>`;
      }).join(' ');
      rieslingMastery.innerHTML = `
        <div class="riesling-mastery-head">
          <div class="mastery-head-left">
            <span class="mastery-wine-badge">🍷 本章通关核准</span>
            <span class="mastery-title-text">继续阅读与第 ${curChapNum} 章有关的文章</span>
          </div>
          <small class="mastery-sub-badge">118 篇文章索引</small>
        </div>
        <div class="riesling-mastery-body">
          <div class="mastery-item primary-art-row">
            <span class="mastery-label">📖 核心主修篇目：</span>
            <a href="javascript:void(0)" class="mastery-main-link" onclick="window.openRieslingArticleModal('${rMap.primaryArticleId}')">
              《${rMap.primaryTitle || rMap.primaryArticleId}》 <span class="arrow">↗</span>
            </a>
          </div>
          ${subBtns ? `<div class="mastery-item sub-art-row"><span class="mastery-label">📚 进阶延伸研读：</span><div class="sub-arts-wrap">${subBtns}</div></div>` : ''}
          <div class="mastery-item quote-row">
            <span class="mastery-label">💡 雷司令本章心法金句：</span>
            <blockquote class="mastery-quote-text">“${rMap.rieslingQuote}”</blockquote>
          </div>
          <div class="mastery-item proof-row">
            <span class="mastery-label">🔬 相关原理与参考说明：</span>
            <span class="mastery-proof-content">${rMap.microstructureMechanic} — <i>${rMap.empiricalProof}</i></span>
          </div>
          <div class="mastery-item formula-row">
            <span class="mastery-label">🎯 计算公式：</span>
            <code class="mastery-formula-code">${rMap.actionableFormula}</code>
          </div>
        </div>
      `;
    }

    // Next chapter preview card before lesson-nav
    let nextPreview = phase4.querySelector('.next-chapter-preview');
    if (!nextPreview) {
      nextPreview = document.createElement('div');
      nextPreview.className = 'next-chapter-preview';
      const nav = phase4.querySelector('.lesson-nav') || phase4.lastElementChild;
      phase4.insertBefore(nextPreview, nav);
    }

    if (curChapter < 27) {
      const nextIdx = curChapter + 1;
      const nextTitle = (typeof V2_TITLES !== 'undefined' && V2_TITLES[nextIdx]) ? V2_TITLES[nextIdx][0] : `第 ${nextIdx + 1} 章`;
      const nextDepth = (typeof CHAPTER_DEPTH !== 'undefined' && CHAPTER_DEPTH[nextIdx]) ? CHAPTER_DEPTH[nextIdx] : null;
      const trap = nextDepth?.traps?.[0] || '先了解交易成本，以及哪些情况不能照搬这个做法。';
      nextPreview.innerHTML = `
        <div class="preview-badge">⚡ 下一章会学什么</div>
        <div class="preview-body">
          <h4>第 ${nextIdx + 1} 章 · ${nextTitle}</h4>
          <p><b>提前警惕：</b>${trap}</p>
        </div>
      `;
    } else {
      nextPreview.innerHTML = `
        <div class="preview-badge success">🎓 全流程总结业</div>
        <div class="preview-body">
          <h4>28 章练习的最后检查</h4>
          <p>请核对 28 章练习记录，并重新做一遍还不熟悉的题目。模拟练习通过，不代表真实交易不会亏损。</p>
        </div>
      `;
    }
  }

  // 10.1 Enhance Chapter Badges in Navigation Rail (🔥 救命防线)
  function enhanceChapterBadges() {
    const rail = document.getElementById('stageRail');
    if (!rail) return;
    const criticalIndices = new Set([0, 2, 3, 9, 12, 14, 19, 23, 24, 26]);
    const buttons = rail.querySelectorAll('.rail-lesson[data-v2]');
    buttons.forEach(btn => {
      const idx = parseInt(btn.dataset.v2, 10);
      if (criticalIndices.has(idx)) {
        if (!btn.querySelector('.rail-critical-badge')) {
          const badge = document.createElement('span');
          badge.className = 'rail-critical-badge';
          badge.textContent = '🔥 救命防线';
          badge.title = '散户 6 年亏损止血核心防线';
          btn.appendChild(badge);
        }
      }
    });
  }

  // 10.2 Enhance Phase 1 & 2 Top Guidance Bar
  function enhancePhase1And2() {
    const curChapter = (typeof window !== 'undefined' && window.v2Active !== undefined)
      ? window.v2Active
      : (typeof v2Active !== 'undefined' ? v2Active : +(localStorage.getItem('manga-us-v2-active') || 0));
    const info = PARADIGM_TRINITY[curChapter];
    if (!info) return;

    ['#lesson-phase-1', '#lesson-phase-2'].forEach((phaseId) => {
      const phase = document.querySelector(phaseId);
      if (!phase) return;
      const content = phase.querySelector('.phase-content');
      if (!content) return;

      let bar = content.querySelector('.phase-paradigm-pillbar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'phase-paradigm-pillbar';
        content.prepend(bar);
      }
      bar.innerHTML = `
        <div class="paradigm-row badge-data-pill">
          <span class="pill-tag data">📊 数据基准</span>
          <span class="pill-text">${info.data}</span>
        </div>
        <div class="paradigm-row badge-logic-pill">
          <span class="pill-tag logic">🧠 逻辑推演</span>
          <span class="pill-text">${info.logic}</span>
        </div>
        <div class="paradigm-row badge-discipline-pill">
          <span class="pill-tag discipline">🛡️ 纪律红线</span>
          <span class="pill-text">${info.discipline}</span>
        </div>
      `;

      if (phaseId === '#lesson-phase-2') {
        const tvTip = TRADINGVIEW_CHAPTER_TIPS.find(t => t.ch === curChapter + 1) || {
          tool: "水平射线 (Alt+H) / 风险回报比 (Alt+T)",
          tip: "在 TradingView 免费版标出本章风控防线与基准线，结合 4合1 Pine Script 复合指标盯盘。"
        };
        let tvBox = content.querySelector('.tv-practice-callout');
        if (!tvBox) {
          tvBox = document.createElement('div');
          tvBox.className = 'tv-practice-callout';
          content.appendChild(tvBox);
        }
        tvBox.innerHTML = `
          <div class="tv-callout-head">
            <div class="tv-callout-left">
              <span class="tv-callout-badge">📈 TradingView 免费版实操</span>
              <span class="tv-callout-tool">推荐工具：<code>${tvTip.tool}</code></span>
            </div>
            <button type="button" class="btn-open-tv-guide">打开实操工作台 ↗</button>
          </div>
          <div class="tv-callout-body">
            <strong>盯盘与画线口诀：</strong>${tvTip.tip}
          </div>
        `;
        tvBox.querySelector('.btn-open-tv-guide').onclick = () => toggleTradingViewModal('drawing');
      }
    });
  }

  // 11. Full Keyboard Ergonomics
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    // 1, 2, 3: Tactile selection
    if (['1', '2', '3'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const stage = document.getElementById('lessonStage');
      if (!stage) return;
      const choices = stage.querySelectorAll('#lesson-phase-3 .decision-list button, #lesson-phase-3 .sequence-list button');
      if (choices[idx] && !choices[idx].disabled) {
        choices[idx].classList.add('shake-soft');
        setTimeout(() => choices[idx].classList.remove('shake-soft'), 300);
        choices[idx].click();
      }
      return;
    }

    // Enter or Space: Advance to next step or submit current decision
    if (e.key === 'Enter' || e.key === ' ') {
      const dialog = document.getElementById('shortcutDialog');
      if (dialog && dialog.open) {
        dialog.close();
        return;
      }
      const stage = document.getElementById('lessonStage');
      if (!stage) return;
      const activePhase = stage.querySelector('.learning-phase:not([hidden])');
      if (activePhase) {
        const runBtn = activePhase.querySelector('button[data-run]');
        if (runBtn && !runBtn.disabled) {
          e.preventDefault();
          runBtn.click();
          return;
        }
        const nextPhaseBtn = activePhase.querySelector('.phase-next');
        if (nextPhaseBtn && !nextPhaseBtn.disabled) {
          e.preventDefault();
          nextPhaseBtn.click();
          return;
        }
      }
    }

    // 'j' or 'J': Next Chapter
    if (e.key === 'j' || e.key === 'J') {
      const nextBtn = document.querySelector('.lesson-nav [data-next], #lessonStage [data-next]');
      if (nextBtn && !nextBtn.disabled) {
        e.preventDefault();
        nextBtn.click();
        showKeyToast('下一章 (J)');
      }
      return;
    }

    // 'k' or 'K': Previous Chapter
    if (e.key === 'k' || e.key === 'K') {
      const prevBtn = document.querySelector('.lesson-nav [data-prev], #lessonStage [data-prev]');
      if (prevBtn && !prevBtn.disabled) {
        e.preventDefault();
        prevBtn.click();
        showKeyToast('上一章 (K)');
      }
      return;
    }

    // 't' or 'T': Rotate Theme
    if (e.key === 't' || e.key === 'T') {
      const nextTheme = currentTheme === 'apple' ? 'light' : currentTheme === 'light' ? 'dark' : 'apple';
      applyTheme(nextTheme);
      showKeyToast(`切换主题: ${nextTheme === 'apple' ? '🍎 经典苹果' : nextTheme === 'light' ? '☀️ 论文暖白' : '🌙 彭博暗黑'}`);
      return;
    }

    // 'x' or 'X': Loss Autopsy Modal
    if (e.key === 'x' || e.key === 'X') {
      e.preventDefault();
      toggleLossAutopsyModal();
      return;
    }

    // 'v' or 'V': TradingView Free Practical Modal
    if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      toggleTradingViewModal();
      return;
    }

    // 'm' or 'M': TradingAgents Modal
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      toggleTradingAgentsModal();
      return;
    }

    // 'p' or 'P': Paradigm Modal
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      toggleParadigmModal();
      return;
    }

    // 'r' or 'R': Riesling Library Modal
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      if (typeof window.openRieslingArticleModal === 'function') {
        const curChap = (typeof window !== 'undefined' && window.v2Active !== undefined)
          ? window.v2Active
          : (typeof v2Active !== 'undefined' ? v2Active : 0);
        const mapping = window.CHAPTER_RIESLING_MAP && window.CHAPTER_RIESLING_MAP[curChap];
        window.openRieslingArticleModal(mapping ? mapping.primaryArticleId : 'trade-cangwei');
      }
      return;
    }

    // '?': Shortcut Modal
    if (e.key === '?') {
      e.preventDefault();
      toggleShortcutModal();
      return;
    }

    // '[' or '【': Toggle Sidebar Rail
    if (e.key === '[' || e.key === '【') {
      e.preventDefault();
      toggleSidebarRail();
      showKeyToast('切换目录栏 ([)');
      return;
    }
  });

  // 11.5 Free Sidebar Chapter Navigation (支持全 28 章任意自由点击秒切)
  function bindSidebarFreeNavigation() {
    const rail = document.getElementById('stageRail');
    if (rail && !rail.dataset.clickFreeBound) {
      rail.dataset.clickFreeBound = 'true';
      rail.addEventListener('click', (e) => {
        const btn = e.target.closest('.rail-lesson[data-v2]');
        if (!btn) return;
        const targetIdx = parseInt(btn.dataset.v2, 10);
        if (!isNaN(targetIdx) && targetIdx !== v2Active) {
          if (typeof persistDraft === 'function') persistDraft();
          v2Active = targetIdx;
          if (typeof v2Save === 'function') v2Save();
          if (typeof v2Render === 'function') v2Render();
          if (typeof lessonHeadingFocus === 'function') lessonHeadingFocus();
        }
      }, true);
    }
  }

  // 11.6 Collapsible Sidebar Rail Toggle
  function injectSidebarToggle() {
    const desk = document.getElementById('trainingDesk');
    const rail = document.getElementById('stageRail');
    if (!rail) return;
    if (desk && desk.classList.contains('rail-collapsed')) {
      rail.classList.add('rail-collapsed');
    }
    const titleDiv = rail.querySelector('.rail-title');
    if (titleDiv && !titleDiv.querySelector('.btn-toggle-rail')) {
      const isCollapsed = desk && desk.classList.contains('rail-collapsed');
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'btn-toggle-rail';
      toggleBtn.id = 'btnToggleRail';
      toggleBtn.title = isCollapsed ? '展开左侧目录 (快捷键 [ )' : '收起左侧目录 (快捷键 [ )';
      toggleBtn.innerHTML = isCollapsed
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg><span>收起</span>`;
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        toggleSidebarRail();
      };
      titleDiv.appendChild(toggleBtn);
    }
    rail.querySelectorAll('summary').forEach(s => {
      const b = s.querySelector('b');
      if (b && !s.getAttribute('title')) {
        s.setAttribute('title', `阶段: ${b.textContent.trim()}`);
      }
      if (!s._boundCollapseClick) {
        s._boundCollapseClick = true;
        s.addEventListener('click', () => {
          if (desk && desk.classList.contains('rail-collapsed')) {
            toggleSidebarRail(false);
          }
        });
      }
    });
  }

  function toggleSidebarRail(force) {
    const desk = document.getElementById('trainingDesk');
    const rail = document.getElementById('stageRail');
    if (!desk || !rail) return;
    const isCurrentlyCollapsed = desk.classList.contains('rail-collapsed');
    const nextCollapsed = force !== undefined ? force : !isCurrentlyCollapsed;

    if (nextCollapsed) {
      desk.classList.add('rail-collapsed');
      rail.classList.add('rail-collapsed');
      const toggleBtn = rail.querySelector('#btnToggleRail');
      if (toggleBtn) {
        toggleBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
        toggleBtn.title = '展开目录 (快捷键 [ )';
      }
    } else {
      desk.classList.remove('rail-collapsed');
      rail.classList.remove('rail-collapsed');
      const toggleBtn = rail.querySelector('#btnToggleRail');
      if (toggleBtn) {
        toggleBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>收起</span>
        `;
        toggleBtn.title = '收起目录 (快捷键 [ )';
      }
    }
  }

  // 12. Hook into render cycle
  const previousRender = window.v2Render;
  if (typeof previousRender === 'function') {
    window.v2Render = function() {
      previousRender.apply(this, arguments);
      injectHeaderTools();
      injectPracticalSmartTools();
      injectDualWingCockpit();
      enhancePhase4Rules();
      renderJournalLiveReceipts();
      enhanceChapterBadges();
      enhancePhase1And2();
      bindSidebarFreeNavigation();
      injectSidebarToggle();
      applyViewMode();

      const active = document.querySelector('.rail-lesson.active');
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
  }

  window.addEventListener('DOMContentLoaded', () => {
    injectHeaderTools();
    injectPracticalSmartTools();
    injectDualWingCockpit();
    enhancePhase4Rules();
    renderJournalLiveReceipts();
    enhanceChapterBadges();
    enhancePhase1And2();
    bindSidebarFreeNavigation();
    injectSidebarToggle();
    applyViewMode();
  });
})();
