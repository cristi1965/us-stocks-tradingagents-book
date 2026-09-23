const CHAPTER_BACKGROUND = [
  ["单笔最大损失","风险预算是事前愿意承担的损失金额。账户 $100,000 × 0.8% = $800；每股计划风险 $4.20，则 $800 ÷ $4.20 = 190.47，向下取整为 190 股。跳空仍可能使实际损失超预算。","先算预算，再算每股风险，最后向下取整。买入金额是 190 × $215 = $40,850，与允许亏损 $800 是两个不同数字。","不要把教学假设、近似计算或历史观察当作成交保证。","股数 = 向下取整(风险预算 ÷ 每股计划风险)"],
  ["结算资金约束","已结算资金是买卖交割已完成、可用于付款的钱；未结算卖出款仍在交割途中。先看这次买入用哪笔钱，再核对卖出时该笔钱是否已经结算。不要把现金账户所有当日买卖都说成违规。","本练习只用已结算资金安排当日买卖，具体资金资格与违规处理以账户规则为准。","不要把教学假设、近似计算或历史观察当作成交保证。","可买数量同时受风险预算与已结算付款能力限制"],
  ["隔夜跳空真相","本教学情景假定在 $80 买入、最终在 $65 卖出：每股亏 $15。200 股共亏 $3,000，比原计划 $4 × 200 = $800 多亏 $2,200。","这里的 $65 是给定成交假设；真实订单何时、以何价成交，要看触发条件、订单类型和当时买卖盘。","不要把教学假设、近似计算或历史观察当作成交保证。","情景亏损 = (入场价 - 情景成交价) × 股数"],
  ["连续亏损熔断","停止新增风险是为了防止连续亏损后扩大下注。这里的日亏损阈值和恢复所需模拟笔数是练习设定，不是生理学定律，也不是交易所规则。","先停止新增风险，再检查已有持仓和保护订单。不要为停手而一并断开必要的持仓监控。","不要把教学假设、近似计算或历史观察当作成交保证。","达到练习停手条件 → 停止新增风险 → 检查与模拟复盘"],
  ["一根 K 线与价格","开盘 $210、收盘 $220，所以实体长度 $10；最高 $225，所以上影线长 $5。四个价格不能告诉我们是谁卖出，也不能证明机构在出货。","复权是为分红、拆股调整历史价格口径。常规时段与含盘前盘后的图表也不能直接混着比。","不要把教学假设、近似计算或历史观察当作成交保证。","实体长度 = |收盘 - 开盘|；上影线 = 最高 - 较高的开盘或收盘价"],
  ["成交量与 RVOL","相对成交量（RVOL）把当前成交量除以历史同一时段均量。120 万 ÷ 200 万 = 0.6，表示比基准少 40%；它不能单独识别机构是否参与。","盘中累计量只与过去同一截止时刻相比，完整日量才与过去完整日量相比。","不要把教学假设、近似计算或历史观察当作成交保证。","相对成交量 = 当前累计量 ÷ 历史同一时段平均量"],
  ["趋势还是区间","在同一周期比较相邻波段高低点。低点由 $210 降到 $208，说明原先“低点持续抬高”的条件不再成立；这并不保证下一步一定下跌。","波段高点是附近一段价格中的相对高点，波段低点同理。先固定周期再比较，避免随意挑点。","不要把教学假设、近似计算或历史观察当作成交保证。","比较相邻波段：高点是否抬高，低点是否抬高"],
  ["关键区域与失效","支撑是价格过去多次停止下跌的区域。跌破后若反弹又在这里受阻，可把它当作候选阻力；需要观察，不能只凭一条线保证反转。","成交密集区表示过去成交较多的价格范围，不能据此知道现在还有多少未卖出的持仓。","不要把教学假设、近似计算或历史观察当作成交保证。","支撑与阻力需要价格反应证据，不能由固定公式保证"],
  ["订单类型与取舍","市价单优先争取成交，成交价格不受限；限价买单只接受指定价格或更低价格，却可能买不到。盘口深度表示各个价位有多少可见挂单。","止损市价单（Stop-Market）触发后按市价执行；止损限价单（Stop-Limit）触发后仍受限价约束，可能不成交。","不要把教学假设、近似计算或历史观察当作成交保证。","点差率 = (卖一 - 买一) ÷ 中间价 × 100%"],
  ["交易时段与保护","盘前盘后要同时核对券商允许的时段、订单类型与价格保护。官方收盘价和盘后最后成交价是不同数据；某一交易场所的报价也不等于全市场报价。","本练习采用限价和减量措施。具体减多少由可承受损失和盘口条件决定，不把固定比例当市场规则。","不要把教学假设、近似计算或历史观察当作成交保证。","先核对时段与订单权限，再决定限价和数量"],
  ["部分成交与生命周期","执行短缺比较实际执行与原计划的差别。买单的已成交成本按成交价减基准价计算；未成交部分按期末价减基准价计算，再加费用。结果也可能为负，表示比基准更有利。","300 股在 $219.50、400 股在 $220 成交，均价约 $219.786；剩余 300 股尚未买到，不能当作已有持仓。","不要把教学假设、近似计算或历史观察当作成交保证。","买入执行短缺 = 已成交数量×(成交价-基准价) + 未成交数量×(期末价-基准价) + 费用"],
  ["停牌熔断与拍卖","停牌意味着暂时不能成交。原止损价不会因此变成保证成交价；重开后应查询订单状态和实际成交记录，撤改单是否受理还要看券商及交易所规则。","本例 $215 买入 200 股、$195 卖出，总损失 $4,000；与 $211 止损计划相比，多损失 $3,200。","不要把教学假设、近似计算或历史观察当作成交保证。","每股额外缺口损失 = 原止损价 - 实际卖出价"],
  ["风险簇净压力","风险簇是可能因同一个因素同时亏损的一组持仓。先分别估计每项在同一情景中的损益，再相加。期权对冲额必须换成同口径风险暴露，不能直接拿权利金相减。","只有在给定的线性等效暴露假设下，$50,000 + $30,000 - $20,000 = $60,000，乘 -8% 得 -$4,800。","不要把教学假设、近似计算或历史观察当作成交保证。","组合压力损益 = 各持仓在同一情景下的损益之和"],
  ["高贝塔资产共振","高贝塔表示资产历史上对所选市场基准的变动较敏感。SOXL 的三倍目标针对半导体基准的单日收益，多日收益不能直接乘三，也不能拿纳指作它的跟踪基准。","25% 是本练习的持仓限制。短期国库券不属于同一科技风险簇，但仍需核对期限、价格和流动性。","不要把教学假设、近似计算或历史观察当作成交保证。","先换算同一基准的风险暴露，再检查练习总额上限"],
  ["杠杆与维持保证金","本例设借款 $50,000、年息 12%、按 365 天计息：30 天利息 $493.15。市值跌至 $70,000 后，净权益为 $19,506.85，除以市值得 27.87%，低于本例券商要求的 30%。","融资利率、计息方式与维持要求均为本例输入，实际账户需读取券商当前规则。","不要把教学假设、近似计算或历史观察当作成交保证。","保证金率 = (市值 - 借款 - 应计利息) ÷ 市值"],
  ["卖空与 SSR 限制","卖空是先卖出借来的股票，以后买回归还。借券确认（Locate）和价格限制（SSR）是不同检查：前者查券源，后者查订单在限制生效时是否符合价格要求。","先核对已确认的借券数量，再核对价格要求与适用例外；不能把借券确认当成永久可借保证。","不要把教学假设、近似计算或历史观察当作成交保证。","检查借券数量、SSR适用状态与订单价格，不能仅套一个报价公式"],
  ["CPI 预期差与版本","公布值 3.2% 减预期值 3.0%，预期差为 0.2 个百分点。必须比较同一指标、时期和统计口径，并只使用当时已经公布的信息。","0.2 个百分点不是相对增加 0.2%。预期差只是可能影响市场的一个因素，不能直接推出股票必涨或必跌。","不要把教学假设、近似计算或历史观察当作成交保证。","预期差 = 同口径公布值 - 同口径预期值"],
  ["FOMC 条件剧本","美联储议息会议（FOMC）可能通过声明、经济预测和发布会影响预期。经济预测摘要（SEP）与点阵图并非每次会议都发布；偏鹰表示倾向更紧政策，偏鸽表示倾向更宽政策。","会前写清：出现什么信息、观察什么价格反应、条件不满足时怎样等待。不要把预测当作已发生事实。","不要把教学假设、近似计算或历史观察当作成交保证。","声明、预测与发布会分别记录；降息概率不能只由单一价格直接相减得出"],
  ["美债收益率与久期","2 年期（2Y）收益率升 6 个基点、10 年期（10Y）升 18 个基点，期限差增加 12 个基点。1 个基点（bp）是 0.01 个百分点。利差变化和债券价格变化要分开计算。","另作独立久期练习：修正久期 8、收益率升 0.50 个百分点，则价格约降 8 × 0.005 = 4%，只适合小变动近似。","不要把教学假设、近似计算或历史观察当作成交保证。","价格变化比例 ≈ -修正久期 × 收益率变化（小数）"],
  ["财报尾部反推仓位","压力测试是假设一次较大跌幅来检查持仓。本例现价 $215、跌幅 20%、每股额外成交成本 $0.50，所以每股压力风险 $43.50；$1,000 ÷ $43.50 向下取整为 22 股。","22 股在该情景下约亏 $957；23 股约亏 $1,000.50，已经超过 $1,000 预算。","不要把教学假设、近似计算或历史观察当作成交保证。","股数 = 向下取整(1000 ÷ 43.50) = 22"],
  ["期权链流动性筛选","期权链按到期日与行权价列出合约。买一（Bid）是买方报价，卖一（Ask）是卖方报价；未平仓量（OI）是尚未结束的合约数量，与今天成交多少不同。","点差率以中间价为分母；练习筛选阈值不是盈利保证，数量较大的订单还要看可成交数量。","不要把教学假设、近似计算或历史观察当作成交保证。","点差率 = (卖一 - 买一) ÷ ((卖一 + 买一) ÷ 2)"],
  ["Delta 与 Gamma","Delta 表示股价小幅变化 $1 时，期权每股报价大约变化多少。Delta 为 0.50 的一张标准合约，在当前附近约有 50 股的方向敏感度，并不等于真正持有 50 股。","Gamma 表示股价变化 $1 时 Delta 大约变化多少。假定 Gamma 暂不变：0.50 + 0.04 × 3 ≈ 0.62。","不要把教学假设、近似计算或历史观察当作成交保证。","新 Delta ≈ 原 Delta + Gamma × 股价变化"],
  ["Greeks 联合损益","先分别算股价、波动率和时间的影响再相加：本例每股方向贡献 $1.68，波动率贡献 -$1.20，时间贡献 -$0.08，合计 $0.40；标准乘数 100 对应整张 $40。","Vega 表示 IV 每变化 1 个百分点时的价格变化；Theta 表示一天时间变化的近似影响。所有输入先统一为每股报价单位。","不要把教学假设、近似计算或历史观察当作成交保证。","整张近似损益 = 每股近似损益 × 合约乘数"],
  ["IV Crush 双情景","隐含波动率（IV）反映期权价格隐含的未来波动预期。事件后 IV 快速回落称 IV Crush；这会压低其他条件相同时的期权价格，但幅度和是否发生都不能保证。","比较两个情景必须使用同一组期权参数和单位；大幅变化下局部敏感度可能变化，需要重新估值，不能把近似当成交保证。","不要把教学假设、近似计算或历史观察当作成交保证。","总近似损益 = 方向影响 + 波动率影响 + 时间影响"],
  ["价差与到期处理","看涨借记价差同时买较低行权价的看涨期权、卖同到期较高行权价的看涨期权。本例行权价 210 和 225、净支出每股 $4，到期最大损失 $400、最大盈利 $1,100，未计费用。","卖出的合约叫短腿，买入的叫长腿。短腿被提前指派后会产生股票交付义务，长腿不会自动替你完成所有处理。","不要把教学假设、近似计算或历史观察当作成交保证。","最大盈利 = (行权价差 - 每股净支出) × 100"],
  ["证据类型与 TTL","来源回答“谁发布”，报告期回答“说的是哪段时间”，时间戳回答“何时发布或采集”。有效时限（TTL）是该用途允许数据多旧；新采集的旧消息也不自动变新。","30 秒行情、15 分钟快讯是练习阈值；证据能否继续使用还取决于新公告和用途。","不要把教学假设、近似计算或历史观察当作成交保证。","有效性：来源可核对、报告期适用、时间满足用途、没有更新信息推翻"],
  ["风险官关闸","默认拒绝（fail-closed）指必要条件无法确认时不放行。本课程的风险官检查来源、反证、时效和预算；多个智能体（Agent）意见一致不能补上缺失证据。","拒绝时记录哪项检查不通过；模拟记录（Paper）用来练流程，不表示已获准真实下单。","不要把教学假设、近似计算或历史观察当作成交保证。","必要检查全部通过才放行；缺项或异常默认拒绝"],
  ["最终交易日总验收","拆股把同一份持仓分成更多股，不凭空创造财富。本练习按 2:1 拆股算数量与价格；实际挂单和期权如何处理仍须核对券商通知与合约调整公告。","校验摘要（SHA-256）可以帮助发现内容变化，但摘要本身不是数字签名，也不能保证记录不可篡改。","不要把教学假设、近似计算或历史观察当作成交保证。","2:1练习：股数×2，每股成本÷2，总成本不变"]
];

const backgroundBaseRender = v2Render;
v2Render = function() {
  backgroundBaseRender();
  const row = CHAPTER_BACKGROUND[v2Active];
  if (!row) return;
  const [analogy, concept, impact, trap, action] = row;
  const mapData = (typeof CHAPTER_RIESLING_MAP !== 'undefined' && CHAPTER_RIESLING_MAP[v2Active]) || null;

  const card = document.createElement('details');
  card.className = 'background-card';
  card.open = true;

  if (mapData) {
    card.innerHTML = `
      <summary>
        <div class="summary-meta-left">
          <span class="summary-tag-riesling">🍷 本章阅读导引</span>
          <span class="summary-ticker-tag">${mapData.ticker}</span>
        </div>
        <b class="summary-heading">${mapData.title} · ${mapData.primaryTitle}</b>
        <span class="summary-chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="background-body">
        <!-- 1. 白话心法 -->
        <div class="bg-sec bg-riesling">
          <div class="bg-sec-header">
            <div class="bg-sec-badge-box">
              <span class="bg-badge-icon">🍷</span>
              <span class="bg-badge-label">本章白话解释（课程编写）</span>
              <span class="bg-badge-article">《${mapData.primaryTitle}》</span>
            </div>
            <button type="button" class="btn-read-riesling" onclick="window.openRieslingArticleModal('${mapData.primaryArticleId}')">
              <span>📖 读这篇的通俗讲解</span>
              <span class="arrow">↗</span>
            </button>
          </div>
          <p class="bg-quote-prose">${concept}</p>
        </div>

        <!-- 2. 学术实证 -->
        <div class="bg-sec bg-empirical">
          <div class="bg-sec-header">
            <div class="bg-sec-badge-box">
              <span class="bg-badge-icon">🔬</span>
              <span class="bg-badge-label">为什么这样算</span>
            </div>
            <span class="bg-sec-meta-pill">教学说明，非实时行情</span>
          </div>
          <div class="bg-sec-text">${mapData.microstructureMechanic}</div>
        </div>

        <!-- 3. 四神票标定 -->
        <div class="bg-sec bg-ticker">
          <div class="bg-sec-header">
            <div class="bg-sec-badge-box">
              <span class="bg-badge-icon">⚡</span>
              <span class="bg-badge-label">把步骤算清楚</span>
              <span class="ticker-pill-active">${mapData.ticker}</span>
            </div>
            <span class="bg-sec-meta-pill quant">价格与费用均按题设</span>
          </div>
          <div class="bg-sec-text">${action}</div>
        </div>

        <!-- 4. 散户认知误区 -->
        <div class="bg-sec background-trap">
          <div class="bg-sec-header">
            <div class="bg-sec-badge-box">
              <span class="bg-badge-icon">⚠️</span>
              <span class="bg-badge-label">容易误解的地方</span>
            </div>
            <span class="bg-sec-meta-pill danger">检查理解</span>
          </div>
          <div class="bg-sec-text">${trap}</div>
        </div>

        <!-- 5. 看完立刻执行清单 -->
        <div class="bg-sec background-action">
          <div class="bg-sec-header">
            <div class="bg-sec-badge-box">
              <span class="bg-badge-icon">🎯</span>
              <span class="bg-badge-label">看完立刻执行清单</span>
            </div>
            <span class="bg-sec-meta-pill success">按步骤核对</span>
          </div>
          <div class="formula-banner">
            <span class="formula-tag">计算或核对方法</span>
            <code>${mapData.actionableFormula}</code>
          </div>
          <div class="action-body-text"><b>执行动作：</b>${action}</div>
        </div>
      </div>
    `;
  } else {
    card.innerHTML = `
      <summary>
        <div class="summary-meta-left">
          <span class="summary-tag-riesling">先补背景</span>
        </div>
        <b class="summary-heading">${analogy}</b>
        <span class="summary-chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="background-body">
        <p><strong>说人话：</strong>${concept}</p>
        <p><strong>为什么影响美股：</strong>${impact}</p>
        <p class="background-trap"><strong>别这样理解：</strong>${trap}</p>
        <p class="background-action"><strong>看完立刻做：</strong>${action}</p>
      </div>
    `;
  }

  const story = lessonStage.querySelector('.story-guide');
  (story || lessonStage.querySelector('.comic-strip')).after(card);
};

const backgroundStyle = document.createElement('style');
backgroundStyle.textContent = `
.background-card {
  margin: 0 0 18px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.2s ease;
}
.background-card summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  cursor: pointer;
  background: #fafafa;
  border-bottom: 1px solid #f1f5f9;
  user-select: none;
  list-style: none;
}
.background-card summary::-webkit-details-marker {
  display: none;
}
.summary-meta-left {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.summary-tag-riesling {
  padding: 3px 8px;
  color: #ffffff;
  background: #be185d;
  font-size: 11px;
  font-weight: 700;
  border-radius: 5px;
  letter-spacing: 0.02em;
  line-height: 1.2;
}
.summary-ticker-tag {
  padding: 2px 7px;
  color: #0284c7;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  font-size: 11px;
  font-weight: 800;
  font-family: var(--font-mono, monospace);
  border-radius: 5px;
  line-height: 1.2;
}
.summary-heading {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
  letter-spacing: -0.01em;
}
.summary-chevron {
  font-size: 12px;
  color: #94a3b8;
  transition: transform 0.2s ease;
}
details[open] > summary .summary-chevron {
  transform: rotate(180deg);
}
.background-body {
  padding: 14px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.background-body .bg-sec {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13.5px;
  line-height: 1.7;
  letter-spacing: -0.005em;
  word-break: break-word;
}
.bg-sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}
.bg-sec-badge-box {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.bg-badge-icon {
  font-size: 14px;
}
.bg-badge-label {
  font-size: 12.5px;
  font-weight: 700;
}
.bg-badge-article {
  font-size: 11.5px;
  font-weight: 600;
  color: #be185d;
  background: rgba(255, 255, 255, 0.8);
  padding: 1px 7px;
  border-radius: 4px;
  border: 1px solid #fbcfe8;
}
.bg-sec-meta-pill {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #475569;
  letter-spacing: 0.02em;
}
.bg-sec-meta-pill.quant {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}
.bg-sec-meta-pill.danger {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}
.bg-sec-meta-pill.success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}
.ticker-pill-active {
  font-family: var(--font-mono, monospace);
  font-size: 11.5px;
  font-weight: 800;
  background: #f59e0b;
  color: #ffffff;
  padding: 1px 6px;
  border-radius: 4px;
}
.bg-quote-prose {
  margin: 0;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 6px;
  border-left: 3.5px solid #be185d;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.75;
  color: #831843;
}
.btn-read-riesling {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ffffff;
  color: #be185d;
  border: 1px solid #fbcfe8;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(190, 24, 93, 0.08);
  transition: all 0.15s ease;
  white-space: nowrap;
}
.btn-read-riesling:hover {
  background: #be185d;
  color: #ffffff;
  border-color: #be185d;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(190, 24, 93, 0.2);
}
.btn-read-riesling .arrow {
  font-size: 11px;
  font-weight: 800;
}
.bg-sec-text {
  color: inherit;
  line-height: 1.7;
}
.formula-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  overflow-x: auto;
}
.formula-tag {
  font-size: 9.5px;
  font-weight: 800;
  color: #38bdf8;
  background: #1e293b;
  padding: 1px 5px;
  border-radius: 3px;
  font-family: var(--font-mono, monospace);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}
.formula-banner code {
  color: #f1f5f9;
  font-family: var(--font-mono, monospace);
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.action-body-text {
  font-size: 13px;
  color: #14532d;
  line-height: 1.6;
}
.bg-riesling {
  background: #fdf2f8;
  border-left: 3.5px solid #be185d;
  color: #831843;
}
.bg-empirical {
  background: #f8fafc;
  border-left: 3.5px solid #0284c7;
  color: #1e293b;
}
.bg-ticker {
  background: #fffbeb;
  border-left: 3.5px solid #f59e0b;
  color: #78350f;
}
.background-trap {
  background: #fff1f2;
  border-left: 3.5px solid #e11d48;
  color: #881337;
}
.background-action {
  background: #f0fdf4;
  border-left: 3.5px solid #16a34a;
  color: #14532d;
}
@media (max-width: 700px) {
  .background-card summary { flex-direction: column; align-items: flex-start; }
  .summary-heading { font-size: 14px; }
}
`;
document.head.appendChild(backgroundStyle);
v2Render();
