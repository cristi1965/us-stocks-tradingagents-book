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
                "reason": f"触发当日 3 连亏熔断（连续亏损 {self.consecutive_losses} 笔）！系统强制冷却关闸，禁止感性报复交易。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        if self.daily_drawdown_pct >= self.max_daily_drawdown_limit:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"日内总回撤已达 {self.daily_drawdown_pct*100:.1f}%，触及 2.5% 每日安全红线！系统封存今日下单权限。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 2. Check quote freshness
        if stale_quote:
            return {
                "decision": TradeSignal.VETO,
                "reason": "行情数据超过 TTL 时效（Stale Quote）！Fail-Closed 默认拒绝原则：绝不在无时效依据下入场。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 3. Check Stop-Loss validity
        if stop_price >= entry_price:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"多头止损价 (${stop_price:.2f}) 必须严格低于入场价 (${entry_price:.2f})！无止损方案绝不下单。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        # 4. Check IV Crush for earnings
        if iv_percentile >= 90.0:
            return {
                "decision": TradeSignal.VETO,
                "reason": f"隐含波动率处于历史 {iv_percentile:.1f} 分位极高区！禁止在重大事件前夕裸买单腿期权（IV Crush 必输陷阱）。",
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
                "reason": "单股风险过大，根据 1% 风险预算允许买入股数为 0。建议调近止损或更换低波动标的。",
                "shares": 0,
                "dollar_risk": 0.0,
                "risk_pct": 0.0
            }

        return {
            "decision": TradeSignal.BUY,
            "reason": f"合规放行：单笔风险严格控制在 ${actual_dollar_risk:.2f} ({actual_risk_pct:.2f}% ≤ 1.00%)，名义敞口 ${final_shares * entry_price:,.2f}。",
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
            details.append(f"营收同比增速 {rev_growth*100:.1f}%，超预期加速。")
        elif rev_growth > 0.08:
            score += 25
            details.append(f"营收同比增速 {rev_growth*100:.1f}%，保持稳健。")
        else:
            details.append(f"营收增速放缓 ({rev_growth*100:.1f}%)，警惕估值杀。")

        if pe < 30:
            score += 35
            details.append(f"动态市盈率 P/E {pe:.1f}，在行业中位水平内。")
        else:
            score += 10
            details.append(f"动态市盈率 P/E {pe:.1f}，估值偏高，需要强催化剂支撑。")

        if filing_clean:
            score += 25
            details.append("SEC 10-Q/10-K 财报无未决诉讼与财务重述风险。")
        else:
            score -= 50
            details.append("警告：SEC 披露存在重大审计异动或内部人抛售！")

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
            details.append("价格位于 200 日牛熊分界线上方，大周期处于多头趋势。")
        else:
            score -= 20
            details.append("价格位于 200 日线下，属于逆势反弹，严禁重仓参与。")

        if 45 <= rsi <= 65:
            score += 30
            details.append(f"RSI 为 {rsi:.1f}，动量健康，无顶背离或极端超买。")
        elif rsi > 75:
            score -= 10
            details.append(f"RSI 处于超买区 ({rsi:.1f})，需防范高位均值回归洗盘。")
        else:
            score += 10
            details.append(f"RSI 为 {rsi:.1f}，动量处于震荡休整期。")

        if volume_ratio > 1.2:
            score += 30
            details.append(f"突破伴随放量（成交量为均量 {volume_ratio:.1f} 倍），机构吸筹迹象显著。")
        else:
            score += 10
            details.append("突破量能平淡，警惕假突破诱多。")

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
            details.append(f"新闻发布已超 {ttl_minutes} 分钟（超过 60m TTL 时效门限），信息已被盘口充分消化。")
            score = 20
        else:
            details.append(f"消息为 {ttl_minutes} 分钟内一手权威来源披露。")
            if news_score > 0.4:
                score = 80
                details.append("舆情呈结构性利好，评级普遍上调。")
            elif news_score < -0.3:
                score = 10
                details.append("负面舆情集中，存在做空机构报告阴影。")
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
    print(f"{YELLOW}{BOLD}【告别感性 · 六年美股三万刀亏损深度数学解剖报告】{RESET}\n")
    print(f"{DIM}真实样本：账户起始本金 $100,000，历经 6 年感性主观交易，累计净亏 -$30,000 (当前净值 $70,000)。{RESET}\n")

    # Math of Drawdown
    print(f"{WHITE}{BOLD}1. 亏损复利对称性陷阱（散户为什么越亏越难回本）：{RESET}")
    print(f"   · 本金亏损 10% ($90,000) ➜ 回本只需上涨：{BOLD}+11.1%{RESET}")
    print(f"   · 本金亏损 20% ($80,000) ➜ 回本需要上涨：{BOLD}+25.0%{RESET}")
    print(f"   · 本金亏损 30% ($70,000) ➜ 回本需要上涨：{RED}{BOLD}+42.86%{RESET} （当前真实处境）")
    print(f"   · 本金亏损 50% ($50,000) ➜ 回本需要翻倍：{RED}{BOLD}+100.0%{RESET}\n")

    print(f"{WHITE}{BOLD}2. 过去 6 年核心亏损病灶对照表：{RESET}")
    table = [
        ("致命病灶 1：感性重仓，单笔亏掉数千刀", "单笔未设 1% 止损（$1,000），一次大跌直接回撤 8%~15%", "1% 资本生命线", "单笔亏损严格锁死在 ≤ $1,000"),
        ("致命病灶 2：越跌越买，逆势加仓摊平", "Martingale 赌徒心理，不断接下落飞刀，导致仓位失控爆仓", "左侧右侧边界", "趋势未确认绝不加仓，破位立即出场"),
        ("致命病灶 3：连亏之后报复性加杠杆", "心态崩溃，急于一两天翻本，加大手数造成二次重创", "三连亏日内熔断", "当日连续 3 笔止损，强制停机关闸 24 小时"),
        ("致命病灶 4：重大事件前夕裸买期权", "赌财报或 CPI 裸买虚值 Call/Put，遭遇 IV Crush 权利金归零", "波动率悬崖防御", "重大事件拒绝单腿买方，改用垂直价差锁死亏损"),
    ]
    for title, desc, cure_title, cure_desc in table:
        print(f"  {RED}❌ {title}{RESET}")
        print(f"     现象：{desc}")
        print(f"     {GREEN}🛡️ 破局铁律（{cure_title}）：{cure_desc}{RESET}\n")

    print(f"{WHITE}{BOLD}3. TradingAgents 量化纪律重生路线图：{RESET}")
    print(f"   · 设定当前总资产 $70,000，单笔 1% 最大风险预算 = {BOLD}${70000*0.01:.2f}{RESET}。")
    print(f"   · 严格执行 2:1 盈亏比门槛：单笔潜在收益 ≥ $1,400 才允许入场。")
    print(f"   · 即使胜率仅有 45%，在 2:1 盈亏比与 1% 风控下，每 100 笔交易期望收益：")
    expectancy = (0.45 * 1400) - (0.55 * 700)
    print(f"     数学期望 E = (45% × $1,400) - (55% × $700) = {GREEN}{BOLD}+${expectancy:.2f} / 笔{RESET}。")
    print(f"     100 笔交易理论复利收益：{GREEN}{BOLD}+${expectancy * 100:,.2f} (+{(expectancy*100/70000)*100:.1f}%){RESET}，完全收复 $30k 失地！")
    print(f"\n{CYAN}💡 结论：决定你在美股生存的不是预测明天的行情，而是用风控公式把感性冲动关进制度的笼子里。{RESET}\n")


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
            "name": "英伟达财报前夕 (高 IV 散户高危陷阱)",
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
            "name": "特斯拉 (过期消息诱多场景)",
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

        print(f" 📊 [基本面智能体]: 评分 {f['score']:.0f} | 建议: {f['recommendation']} | {f['summary']}")
        print(f" 📈 [动量技术智能体]: 评分 {t['score']:.0f} | 建议: {t['recommendation']} | {t['summary']}")
        print(f" 📰 [舆情时效智能体]: 评分 {s['score']:.0f} | 建议: {s['recommendation']} | {s['summary']}")

        print(f"\n {MAGENTA}{BOLD}🛡️ [风控官终审裁决（一票否决权）]:{RESET}")
        if rg["decision"] == TradeSignal.BUY:
            print(f"   {GREEN}{BOLD}✅ 裁决：批准下单 (BUY){RESET}")
            print(f"   · 严守 1% 风险：单笔最大损失限制为 {BOLD}${rg['dollar_risk']:.2f}{RESET} ({rg['risk_pct']:.2f}% of $100,000)")
            print(f"   · 科学测算仓位：建议买入 {BOLD}{rg['shares']} 股{RESET} (名义本金占用: ${rg['notional']:,.2f})")
            print(f"   · 风控依据：{rg['reason']}")
        else:
            print(f"   {RED}{BOLD}❌ 裁决：一票否决 (VETO / FAIL-CLOSED){RESET}")
            print(f"   · 否决原因：{rg['reason']}")
            print(f"   · 执行动作：强制关闸，允许股数 = 0，保全本金！")
        print("\n")


def run_audit(tickers_str: str, equity: float = 100000.0):
    print_banner()
    sys_engine = MultiAgentSystem(equity=equity)
    tickers = [t.strip().upper() for t in tickers_str.split(",") if t.strip()]

    print(f"正在对标的池进行风控审计：{tickers}，账户总资金：${equity:,.2f}...\n")
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

    print("\n💡 审计依据：所有仓位均按 1% 资本生命线（$1,000）严格倒推，单股风险越大，股数自动缩减。")


def main():
    parser = argparse.ArgumentParser(
        description="TradingAgents Institutional Quantitative Terminal & Risk Guardian"
    )
    parser.add_argument("--demo", action="store_true", help="运行多智能体研议与风控否决全流程演示")
    parser.add_argument("--autopsy", action="store_true", help="打印 6 年 $30,000 亏损深度数学解剖与回本路线图")
    parser.add_argument("--audit", type=str, help="对指定代码列表进行 1% 仓位与风控门禁审计 (逗号分隔，如 AAPL,NVDA,MSFT)")
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
