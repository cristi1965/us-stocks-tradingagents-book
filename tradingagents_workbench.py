#!/usr/bin/env python3
"""
TradingAgents Institutional Quantitative Workbench
===================================================
A standalone multi-agent quantitative framework and risk guardian.
Designed for disciplined US equities trading: Data, Logic, Discipline.

No heavy third-party dependencies (100% Python Standard Library).
Compatible with Python 3.8+.

Author: TradingAgents Quantitative Architecture Group
"""

import sys
import math
import json
import time
import argparse
from typing import Dict, List, Any, Optional, Tuple

# ANSI Terminal Colors
BOLD = "\033[1m"
DIM = "\033[2m"
GREEN = "\033[32m"
RED = "\033[31m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
MAGENTA = "\033[35m"
CYAN = "\033[36m"
WHITE = "\033[37m"
RESET = "\033[0m"


class TradeSignal:
    BUY = "BUY"
    HOLD = "HOLD"
    SELL = "SELL"
    VETO = "VETO"


class RiskGatekeeperAgent:
    """
    The Ultimate Guardian: Enforces Ironclad Disciplines.
    Holds absolute VETO power over all other agents.
    """
    def __init__(self, total_equity: float = 100000.0, max_risk_pct: float = 0.01):
        self.total_equity = total_equity
        self.max_risk_pct = max_risk_pct  # Strict 1% risk limit ($1,000 per trade)
        self.max_dollar_risk = self.total_equity * self.max_risk_pct
        self.consecutive_losses = 0
        self.daily_drawdown_pct = 0.0
        self.max_daily_drawdown_limit = 0.025  # 2.5% daily circuit breaker

    def check_trade(
        self,
        ticker: str,
        entry_price: float,
        stop_price: float,
        slippage_buffer: float = 0.05,
        stale_quote: bool = False,
        iv_percentile: float = 50.0
    ) -> Dict[str, Any]:
        """
        Calculates position size and performs fail-closed verification.
        """
        # 1. Check circuit breakers
        if self.consecutive_losses >= 3:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"今天已连续亏损 {self.consecutive_losses} 笔，达到连续 3 笔亏损就暂停的规则。本次模拟不再允许买入。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        if self.daily_drawdown_pct >= self.max_daily_drawdown_limit:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"今天的回撤已达 {self.daily_drawdown_pct*100:.1f}%，达到 2.5% 的暂停线。本次模拟不再允许买入。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 2. Check quote freshness
        if stale_quote:
            return {
                "decision": TradeSignal.VETO,
                "reason": "报价已超过有效时限（TTL）。先更新报价；缺少有效报价时，默认不允许买入（Fail-Closed）。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 3. Check Stop-Loss validity
        if stop_price >= entry_price:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"多头止损价 (${stop_price:.2f}) 必须严格低于入场价 (${entry_price:.2f})！请先填好止损计划。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 4. Check IV Crush for earnings
        if iv_percentile >= 90.0:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"市场预估的波动率（IV）处于历史 {iv_percentile:.1f} 分位。本课规则不允许在这个高位单独买入期权；波动率回落会压低期权价格，但不等于一定亏损。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 5. Position Sizing: Strict 1% Risk Formula
        per_share_risk = (entry_price - stop_price) + slippage_buffer
        if per_share_risk <= 0:
            per_share_risk = 0.01

        max_shares_by_risk = math.floor(self.max_dollar_risk / per_share_risk)
        # Cap single asset notional at 20% of account
        max_shares_by_notional = math.floor((self.total_equity * 0.20) / entry_price)
        final_shares = max(0, min(max_shares_by_risk, max_shares_by_notional))

        actual_dollar_risk = final_shares * per_share_risk
        actual_risk_pct = (actual_dollar_risk / self.total_equity) * 100.0

        if final_shares == 0:
            return {
                "decision": TradeSignal.VETO,
                "reason": "单股风险过大，根据 1% 风险预算允许买入股数为 0。请重新检查计划；不要只为凑出股数就随意移动止损价。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        return {
            "decision": TradeSignal.BUY,
            "reason": f"模拟检查通过：按计划计算，单笔风险为 ${actual_dollar_risk:.2f} ({actual_risk_pct:.2f}% ≤ 1.00%)，买入总金额 ${final_shares * entry_price:,.2f}。",
            "shares": final_shares,
            "dollar_risk": actual_dollar_risk,
            "risk_pct": actual_risk_pct,
            "per_share_risk": per_share_risk,
            "notional": final_shares * entry_price
        }


class FundamentalAnalystAgent:
    """Evaluates earnings growth, valuation, and SEC filing integrity."""
    def analyze(self, ticker: str, data: Dict[str, Any]) -> Dict[str, Any]:
        pe = data.get("pe", 25.0)
        rev_growth = data.get("rev_growth", 0.15)
        filing_clean = data.get("filing_clean", True)

        score = 0.0
        details = []

        if rev_growth > 0.20:
            score += 40
            details.append(f"营收同比增速 {rev_growth*100:.1f}%，达到本演示的较高增速档。")
        elif rev_growth > 0.08:
            score += 25
            details.append(f"营收同比增速 {rev_growth*100:.1f}%，达到本演示的中等增速档。")
        else:
            details.append(f"营收同比增速为 {rev_growth*100:.1f}%，本演示将其归入较低档。增长不足可能使投资者不愿付原来的价格。")

        if pe < 30:
            score += 35
            details.append(f"预期市盈率 P/E（股价相当于每股预期盈利的倍数） {pe:.1f}，低于本演示设定的 30 倍门槛。")
        else:
            score += 10
            details.append(f"预期市盈率 P/E（股价相当于每股预期盈利的倍数） {pe:.1f}，达到或超过本演示门槛，需要更多证据解释这个价格是否合理。")

        if filing_clean:
            score += 25
            details.append("本演示输入将 SEC 季报/年报（10-Q/10-K）的风险标记设为正常；程序没有核查真实文件。")
        else:
            score -= 50
            details.append("本演示输入将财报风险标记设为异常，需要进一步查看真实披露。")

        recommendation = TradeSignal.BUY if score >= 60 else (TradeSignal.HOLD if score >= 35 else TradeSignal.SELL)
        return {
            "agent": "Fundamental Analyst",
            "score": score,
            "recommendation": recommendation,
            "summary": "；".join(details)
        }


class MomentumTechnicalAgent:
    """Evaluates trend structure, ATR, and volume confirmation."""
    def analyze(self, ticker: str, data: Dict[str, Any]) -> Dict[str, Any]:
        above_sma200 = data.get("above_sma200", True)
        rsi = data.get("rsi", 54.0)
        volume_ratio = data.get("volume_ratio", 1.3)  # vs 20-day avg

        score = 0.0
        details = []

        if above_sma200:
            score += 40
            details.append("价格高于过去 200 天的平均价，本演示把它作为较长期上涨趋势的参考。")
        else:
            score -= 20
            details.append("价格低于过去 200 天的平均价；本演示认为趋势条件不足，不宜投入过多资金。")

        if 45 <= rsi <= 65:
            score += 30
            details.append(f"RSI 为 {rsi:.1f}，位于本演示的中间区间；这个数字不能单独证明上涨可靠。")
        elif rsi > 75:
            score -= 10
            details.append(f"RSI 处于超买区 ({rsi:.1f})，价格短期可能涨得过快，需要留意回落。")
        else:
            score += 10
            details.append(f"RSI 为 {rsi:.1f}，未进入本演示的中间区间或超买区。")

        if volume_ratio > 1.2:
            score += 30
            details.append(f"突破伴随放量（成交量为均量 {volume_ratio:.1f} 倍），交易更活跃，但仅凭成交量不能确定是谁在买。")
        else:
            score += 10
            details.append("成交量没有明显增加，需要留意突破后又跌回原区间。")

        recommendation = TradeSignal.BUY if score >= 65 else (TradeSignal.HOLD if score >= 40 else TradeSignal.SELL)
        return {
            "agent": "Momentum Technical",
            "score": score,
            "recommendation": recommendation,
            "summary": "；".join(details)
        }


class SentimentNewsAgent:
    """Evaluates real-time news sentiment and evidence validity (TTL)."""
    def analyze(self, ticker: str, data: Dict[str, Any]) -> Dict[str, Any]:
        news_score = data.get("news_sentiment", 0.65)  # -1.0 to +1.0
        ttl_minutes = data.get("news_age_minutes", 15)

        stale = ttl_minutes > 120
        details = []

        if stale:
            details.append(f"新闻发布已超 {ttl_minutes} 分钟（超过本程序 120 分钟有效时限），本演示不再把它当作新消息使用；不能据此断定市场已完全消化。")
            score = 20
        else:
            details.append(f"消息为 {ttl_minutes} 分钟内的新消息；本演示没有联网核查来源。")
            if news_score > 0.4:
                score = 80
                details.append("本演示输入的新闻情绪偏正面。")
            elif news_score < -0.3:
                score = 10
                details.append("本演示输入的新闻情绪偏负面。")
            else:
                score = 50
                details.append("市场讨论度中性。")

        recommendation = TradeSignal.BUY if score >= 60 else (TradeSignal.HOLD if score >= 35 else TradeSignal.SELL)
        return {
            "agent": "Sentiment & News",
            "score": score,
            "recommendation": recommendation,
            "stale": stale,
            "summary": "；".join(details)
        }


class MultiAgentSystem:
    """Coordinates multi-agent debate and risk gate enforcement."""
    def __init__(self, equity: float = 100000.0):
        self.fundamental = FundamentalAnalystAgent()
        self.technical = MomentumTechnicalAgent()
        self.sentiment = SentimentNewsAgent()
        self.risk_guard = RiskGatekeeperAgent(total_equity=equity)

    def evaluate(self, ticker: str, market_data: Dict[str, Any]) -> Dict[str, Any]:
        f_res = self.fundamental.analyze(ticker, market_data)
        t_res = self.technical.analyze(ticker, market_data)
        s_res = self.sentiment.analyze(ticker, market_data)

        # Risk parameters
        entry = market_data.get("price", 100.0)
        stop = market_data.get("stop", entry * 0.96)
        slippage = market_data.get("slippage", 0.05)
        iv_pct = market_data.get("iv_percentile", 45.0)

        # Gatekeeper Veto
        risk_res = self.risk_guard.check_trade(
            ticker=ticker,
            entry_price=entry,
            stop_price=stop,
            slippage_buffer=slippage,
            stale_quote=s_res.get("stale", False),
            iv_percentile=iv_pct
        )

        return {
            "ticker": ticker,
            "fundamental": f_res,
            "technical": t_res,
            "sentiment": s_res,
            "risk_guard": risk_res,
            "final_approved": risk_res["decision"] == TradeSignal.BUY
        }


def print_banner():
    print(f"{CYAN}{BOLD}" + "=" * 76)
    print(" 🤖 TradingAgents Institutional Quantitative Terminal (v2.4 Pre-Glass Edition)")
    print(" 坚守三原则：📊 走数据 (Data) · 🧠 走逻辑 (Logic) · 🛡️ 走纪律 (Discipline)")
    print("=" * 76 + f"{RESET}\n")


def run_loss_autopsy():
    """
    Mathematical autopsy of the 6-year -$30,000 loss and the recovery roadmap.
    """
    print(f"{YELLOW}{BOLD}【用数字复盘：六年美股亏损三万美元的教学例子】{RESET}\n")
    print(f"{DIM}教学假设：账户起始本金 $100,000，经过 6 年交易，累计净亏 -$30,000 (当前净值 $70,000)。{RESET}\n")

    # Math of Drawdown
    print(f"{WHITE}{BOLD}1. 亏损后为什么需要更大的涨幅才能回本：{RESET}")
    print(f"   · 本金亏损 10% ($90,000) ➜ 回本只需上涨：{BOLD}+11.1%{RESET}")
    print(f"   · 本金亏损 20% ($80,000) ➜ 回本需要上涨：{BOLD}+25.0%{RESET}")
    print(f"   · 本金亏损 30% ($70,000) ➜ 回本需要上涨：{RED}{BOLD}+42.86%{RESET} （本例当前情况）")
    print(f"   · 本金亏损 50% ($50,000) ➜ 回本需要翻倍：{RED}{BOLD}+100.0%{RESET}\n")

    print(f"{WHITE}{BOLD}2. 本例要检查的四种交易习惯：{RESET}")
    table = [
        ("待检查习惯 1：感性重仓，单笔亏掉数千刀", "单笔未设 1% 止损（$1,000），一次大跌直接回撤 8%~15%", "单笔 1% 风险预算", "计划损失不超过 $1,000；跳空或成交偏差可能让实际损失更大"),
        ("待检查习惯 2：越跌越买，逆势加仓摊平", "不断加钱摊低买入均价，如果还在下跌，亏损金额会继续放大", "先确认下跌是否停止", "趋势未确认就不加仓；跌破事先约定的位置时按计划退出"),
        ("待检查习惯 3：连亏之后报复性加杠杆", "心态崩溃，急于一两天翻本，加大手数造成二次重创", "三连亏日内熔断", "当日连续 3 笔止损后暂停交易；本演示只展示拒绝结果，不设置真实倒计时"),
        ("待检查习惯 4：重大事件前夕裸买期权", "赌财报或通胀数据，单独买入虚值期权；波动率回落可能造成亏损，到期仍无行权价值才会归零", "防范期权波动率回落", "重大事件前不单独买入期权；研究价差时仍要检查交割和到期风险"),
    ]
    for title, desc, cure_title, cure_desc in table:
        print(f"  {RED}❌ {title}{RESET}")
        print(f"     现象：{desc}")
        print(f"     {GREEN}🛡️ 对应的控制规则（{cure_title}）：{cure_desc}{RESET}\n")

    print(f"{WHITE}{BOLD}3. 用 TradingAgents 演示如何按规则检查：{RESET}")
    print(f"   · 设定当前总资产 $70,000，单笔 1% 最大风险预算 = {BOLD}${70000*0.01:.2f}{RESET}。")
    print(f"   · 严格执行 2:1 盈亏比门槛：单笔潜在收益 ≥ $1,400 才允许入场。")
    print(f"   · 即使胜率仅有 45%，在 2:1 盈亏比与 1% 风控下，每 100 笔交易平均收益假设：")
    expectancy = (0.45 * 1400) - (0.55 * 700)
    print(f"     数学期望 E = (45% × $1,400) - (55% × $700) = {GREEN}{BOLD}+${expectancy:.2f} / 笔{RESET}。")
    print(f"     按固定金额计算的 100 笔理论期望收益（未计成本）：{GREEN}{BOLD}+${expectancy * 100:,.2f} (+{(expectancy*100/70000)*100:.1f}%){RESET}。这低于 $30,000，不能保证回本。")
    print(f"\n{CYAN}💡 结论：先写清能承受多少损失，再决定买多少。期望收益只是基于假设的平均值，不是未来收益承诺。{RESET}\n")


def run_demo():
    print_banner()
    sys_engine = MultiAgentSystem(equity=100000.0)

    demo_cases = [
        {
            "ticker": "AAPL",
            "name": "苹果公司 (Apple Inc.)",
            "scenario": "财报超预期放量突破，基本面与动量全面配合",
            "data": {
                "price": 224.50,
                "stop": 218.00,
                "slippage": 0.10,
                "pe": 28.5,
                "rev_growth": 0.16,
                "above_sma200": True,
                "rsi": 58.0,
                "volume_ratio": 1.45,
                "news_sentiment": 0.72,
                "news_age_minutes": 25,
                "iv_percentile": 42.0
            }
        },
        {
            "ticker": "NVDA_EVENT",
            "name": "英伟达财报前夕 (高预估波动率教学情景)",
            "scenario": "全网狂热看多，但 IV 处于 96% 极高位，散户冲动裸买 Call",
            "data": {
                "price": 128.00,
                "stop": 120.00,
                "slippage": 0.20,
                "pe": 55.0,
                "rev_growth": 1.20,
                "above_sma200": True,
                "rsi": 78.0,
                "volume_ratio": 2.1,
                "news_sentiment": 0.95,
                "news_age_minutes": 10,
                "iv_percentile": 96.0  # High IV Trap!
            }
        },
        {
            "ticker": "TSLA_STALE",
            "name": "特斯拉 (使用旧消息的教学情景)",
            "scenario": "基于社交媒体 3 小时前的传闻冲动下单",
            "data": {
                "price": 248.00,
                "stop": 240.00,
                "slippage": 0.15,
                "pe": 62.0,
                "rev_growth": 0.08,
                "above_sma200": False,
                "rsi": 42.0,
                "volume_ratio": 0.85,
                "news_sentiment": 0.50,
                "news_age_minutes": 180,  # 3 hours ago > 60m TTL!
                "iv_percentile": 55.0
            }
        }
    ]

    for idx, case in enumerate(demo_cases, 1):
        ticker = case["ticker"]
        name = case["name"]
        scen = case["scenario"]
        data = case["data"]

        print(f"{BOLD}{BLUE}======================================================================{RESET}")
        print(f"【案例 {idx}】标的：{ticker} ({name})")
        print(f"场景描述：{scen}")
        print(f"{BOLD}{BLUE}======================================================================{RESET}")

        eval_res = sys_engine.evaluate(ticker, data)
        f = eval_res["fundamental"]
        t = eval_res["technical"]
        s = eval_res["sentiment"]
        rg = eval_res["risk_guard"]

        print(f" 📊 [公司经营与价格分析]: 评分 {f['score']:.0f} | 建议: {f['recommendation']} | {f['summary']}")
        print(f" 📈 [价格走势分析]: 评分 {t['score']:.0f} | 建议: {t['recommendation']} | {t['summary']}")
        print(f" 📰 [新闻情绪与时间检查]: 评分 {s['score']:.0f} | 建议: {s['recommendation']} | {s['summary']}")

        print(f"\n {MAGENTA}{BOLD}🛡️ [风险检查结果（任一规则不通过就拒绝）]:{RESET}")
        if rg["decision"] == TradeSignal.BUY:
            print(f"   {GREEN}{BOLD}✅ 结果：允许模拟买入 (BUY){RESET}")
            print(f"   · 严守 1% 风险：按止损价估算的单笔损失为 {BOLD}${rg['dollar_risk']:.2f}{RESET} ({rg['risk_pct']:.2f}% of $100,000)")
            print(f"   · 按本例公式计算：可模拟买入 {BOLD}{rg['shares']} 股{RESET} (买入金额: ${rg['notional']:,.2f})")
            print(f"   · 风控依据：{rg['reason']}")
        else:
            print(f"   {RED}{BOLD}❌ 结果：拒绝本次模拟买入 (VETO / FAIL-CLOSED){RESET}")
            print(f"   · 否决原因：{rg['reason']}")
            print(f"   · 本次结果：允许买入股数 = 0，不提交真实订单。")
        print("\n")


def run_audit(tickers_str: str, equity: float = 100000.0):
    print_banner()
    sys_engine = MultiAgentSystem(equity=equity)
    tickers = [t.strip().upper() for t in tickers_str.split(",") if t.strip()]

    print(f"正在检查这些股票的模拟风险：{tickers}，账户总资金：${equity:,.2f}...\n")
    print(f"{'代码':<8} | {'入场价':<8} | {'止损价':<8} | {'每股风险':<10} | {'允许买入股数':<12} | {'风险占用($)':<12} | {'风控状态'}")
    print("-" * 85)

    default_prices = {
        "AAPL": (224.50, 218.00),
        "NVDA": (118.00, 112.50),
        "MSFT": (430.00, 418.00),
        "TSLA": (245.00, 235.00),
        "GOOGL": (165.00, 158.00),
        "AMZN": (185.00, 177.00),
        "META": (510.00, 492.00)
    }

    for t in tickers:
        p_entry, p_stop = default_prices.get(t, (100.0, 95.0))
        eval_res = sys_engine.evaluate(t, {
            "price": p_entry,
            "stop": p_stop,
            "slippage": 0.10,
            "iv_percentile": 45.0,
            "news_age_minutes": 15
        })
        rg = eval_res["risk_guard"]
        status = f"{GREEN}放行{RESET}" if rg["decision"] == TradeSignal.BUY else f"{RED}否决{RESET}"
        print(f"{t:<8} | ${p_entry:<7.2f} | ${p_stop:<7.2f} | ${rg.get('per_share_risk', 0.0):<9.2f} | {rg['shares']:<12} | ${rg['dollar_risk']:<11.2f} | {status}")

    print("\n💡 审计依据：所有股数均按输入账户资产的 1% 风险预算倒算，单股风险越大，股数自动缩减。")


def main():
    parser = argparse.ArgumentParser(
        description="TradingAgents Institutional Quantitative Terminal & Risk Guardian"
    )
    parser.add_argument("--demo", action="store_true", help="运行多个分析角色和风险检查的完整教学演示")
    parser.add_argument("--autopsy", action="store_true", help="打印 6 年 $30,000 亏损教学复盘与回本所需涨幅")
    parser.add_argument("--audit", type=str, help="对指定代码列表进行 1% 仓位与风险规则检查 (逗号分隔，如 AAPL,NVDA,MSFT)")
    parser.add_argument("--equity", type=float, default=100000.0, help="设定账户总资产 (默认 $100,000)")

    args = parser.parse_args()

    if args.autopsy:
        run_loss_autopsy()
    elif args.audit:
        run_audit(args.audit, equity=args.equity)
    elif args.demo:
        run_demo()
    else:
        # Default: run both banner, demo, and autopsy summary
        run_demo()
        run_loss_autopsy()


if __name__ == "__main__":
    main()
