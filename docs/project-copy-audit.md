# 全工程 ELI5 文字检查记录

本轮在前轮检查基础上完成剩余全文改写：118篇文章默认通俗版，旧文档改正文，原文与历史证据保留备查。

## 发现并处理的问题

- 旧体验层把“股票”等普通词换成复杂术语：停用自动替词。
- 具体错误解释被随机人物对白覆盖：保留校验给出的原因。
- 旧例题29项与28章错位：重排为28项，修复最后三章对应。
- 比喻、口号或未证实说法代替讲解：改为定义、数值、条件和边界。
- 模拟工具显示英文异常或暗示实际认证、实时结果：改成原因说明并标注教学演示。
- 项目大纲默认读者有六年经验：改为从基础问题开始。
- 历史计划的“专家终审”“100分”易被误认成当前证明：加历史记录说明，不伪造认证。

## 验证

新版28课回归和63词条交互通过。旧版28章在1440px与390px打开、渲染和错误反馈检查通过，无页面脚本错误和横向溢出。旧版的每种金融计算与每条答案未全部重测；语法检查不等于数学或法规认证。

## 必须保留的边界

- 118篇参考文章逐篇阅读并改写；原文单独对照。删去未经核实的历史数值、重复劝诫和错误概念，在每篇coverageNote中说明。
- 历史研究和计划正文改成白话，旧版本归档。机器证据保留状态，并新增中文解释。金融规则未做全量专业认证；重点来源抽查另有记录。
- 旧脚本存在多层覆盖；部分早期题型与章名不一致，最终页面有后续覆盖。本次页面冒烟检查不证明所有组合状态正确。
- upgrades.js 的行情来源检查存在两组域名条件冲突，属于独立逻辑问题，本次文字检查没有改动其放行规则。
- 不同旧场景使用1%、0.8%、1.5%等阈值，个别演示固定记录loss:300；本次未重新统一全部场景算法。已修复3:1拆股却写翻倍减半的文字矛盾。

## 文件覆盖表

总计 94 个项目自有文本文件；逐行记录检查方式。

| 文件 | 字符数 | 检查方式 |
| --- | ---: | --- |
| `book-project.json` | 2246 | 已审读改写；纠正经验假设与当前教学目标 |
| `build/incremental-state.json` | 1690 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `docs/full-plain-rewrite-report.md` | 7755 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `docs/full-rewrite-review.md` | 925 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `docs/machine-records-explained.md` | 1135 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `docs/project-copy-audit.md` | 11433 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `docs/reading-guide.md` | 2008 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `docs/research/course-restructure-2026-09-15.md` | 977 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `docs/research/practical-gap-2026-09-15.md` | 4533 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `docs/rewrite-source-checks.md` | 704 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `evidence/source-coverage.json` | 26 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `evidence/visual-inspection.json` | 233 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `interactive/app.js` | 11475 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/articles-catalog.json` | 10131 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/articles-original.json` | 564377 | 原文对照存档；118篇均另有默认显示的通俗改写 |
| `interactive/articles-plain-1.json` | 55883 | 逐篇读原文后完整改写；含原结构及删改说明 |
| `interactive/articles-plain-2.json` | 55676 | 逐篇读原文后完整改写；含原结构及删改说明 |
| `interactive/articles-plain-3.json` | 53918 | 逐篇读原文后完整改写；含原结构及删改说明 |
| `interactive/bootstrap.js` | 410 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/chapter-depth.js` | 19557 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/chapter-examples.js` | 4696 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/chapters.js` | 6544 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-background.js` | 15172 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-clarity.js` | 9283 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-comic-theater.js` | 14040 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-experience.css` | 166089 | 已提取全部CSS生成文字；只将“决策正确”改为“本题通过” |
| `interactive/course-experience.js` | 154909 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-ledger.js` | 13768 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-practical.js` | 24024 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-quality.js` | 7452 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-replay.js` | 3801 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-riesling-library.js` | 599726 | 28章导读已改写；文章入口改为通俗版，原文内嵌副本仅供历史对照 |
| `interactive/course-sim.js` | 7158 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-ux.js` | 6921 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-v2.css` | 9443 | 已提取全部CSS生成文字；只将“决策正确”改为“本题通过” |
| `interactive/course-v2.js` | 13056 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-v3.js` | 7388 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/course-workbench.js` | 8129 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/index.html` | 1862 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/learning-content.js` | 45320 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/learning-glossary.js` | 24236 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/learning-terms.js` | 6593 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/learning.css` | 10290 | 已提取全部CSS生成文字；只将“决策正确”改为“本题通过” |
| `interactive/learning.js` | 9137 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/legacy.html` | 6109 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/library.css` | 2347 | 已提取全部CSS生成文字；只将“决策正确”改为“本题通过” |
| `interactive/library.html` | 1143 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/library.js` | 6037 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/mastery.js` | 6510 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/review-18-2.cjs` | 2505 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/styles.css` | 11125 | 已提取全部CSS生成文字；只将“决策正确”改为“本题通过” |
| `interactive/upgrades.css` | 1858 | 已提取全部CSS生成文字；只将“决策正确”改为“本题通过” |
| `interactive/upgrades.js` | 15929 | 教学或工具文字已审读；按需改写；标识符保持兼容 |
| `interactive/verify-agent-gate.cjs` | 2200 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/verify-ledger.cjs` | 2039 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/verify-practical.cjs` | 7809 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/verify-replay.cjs` | 6828 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/verify-ui.cjs` | 2106 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/verify-v2.cjs` | 2243 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `interactive/verify-workbench-lock.cjs` | 1725 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `manuscript/augmentation-ledger.jsonl` | 0 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `manuscript/claims.md` | 910 | 已审读改写；纠正经验假设与当前教学目标 |
| `manuscript/outline.md` | 1827 | 已审读改写；纠正经验假设与当前教学目标 |
| `manuscript/reviewer-plan.md` | 368 | 审核步骤正文已白话改写；不伪造通过结论 |
| `manuscript/source-map.jsonl` | 0 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `package.json` | 433 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `research/primary-sources.md` | 4088 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `reviews/professional-attestation.json` | 281 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `reviews/reviewer-plan.md` | 225 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `reviews/round-1/summary.json` | 1027 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `reviews/round-2/summary.json` | 815 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `scratch/capture-audit-screens.js` | 2592 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `scratch/capture-clean-layout.cjs` | 2614 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `scratch/create-comic-theater.js` | 12607 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `scratch/inspect-font.cjs` | 1714 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `scratch/verify-tv-and-polish.cjs` | 4198 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `scratch/verify-waterline-autopsy.cjs` | 4121 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `server.go` | 2235 | 服务参数和错误日志改为中文；协议标识保留 |
| `source/source-index.json` | 153 | 已检查记录类型；保留历史状态，不改成新审核结论 |
| `specs/background-eli5-plan.md` | 409 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/content-expansion-tasks.md` | 275 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/content-expansion.md` | 459 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/full-plain-rewrite.md` | 590 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/learning-refactor.md` | 2157 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/plain-language.md` | 663 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/practical-100-plan.md` | 612 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/practical-100-tasks.md` | 262 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `specs/project-copy-audit.md` | 514 | 正文已白话整理；旧稿归档，原来源链接保留 |
| `tradingagents_workbench.py` | 18477 | 命令行教学文字已审读改写；未运行交易 |
| `verify-learning.cjs` | 4097 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `verify-legacy-copy.cjs` | 1516 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `verify-library.cjs` | 5816 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `verify-terms.cjs` | 2787 | 全文扫描；非学习正文，保留程序字段与检查信息 |
| `verify-v2.js` | 532 | 全文扫描；非学习正文，保留程序字段与检查信息 |

## 参考原文扫描

共 118 篇，542304 字符（含Markdown及图表数据）；按空行分段，有 521 段超过350字符。长段或英文数量只是阅读难度线索，不是事实错误判定。

| 原文ID | 字符数 | 大写英文缩写次数 | 长段数 |
| --- | ---: | ---: | ---: |
| start-why | 2967 | 2 | 0 |
| start-touzi-touji | 3135 | 0 | 4 |
| start-duoshao-qian | 4357 | 0 | 6 |
| start-kaihu | 3113 | 6 | 3 |
| start-jiaoyi-shijian | 3907 | 4 | 3 |
| start-feiyong | 3684 | 0 | 3 |
| start-t1t0 | 3248 | 3 | 3 |
| start-zhangdieting | 4605 | 3 | 3 |
| start-chuquan | 4313 | 5 | 4 |
| start-daxin | 4086 | 1 | 3 |
| market-gupiao | 3071 | 2 | 2 |
| market-jiage | 3463 | 0 | 1 |
| market-shizhi | 2676 | 2 | 1 |
| market-zhishu | 4076 | 7 | 4 |
| market-bankuai | 3242 | 12 | 2 |
| market-sanshi | 3599 | 5 | 2 |
| market-fengge | 2976 | 0 | 2 |
| market-etf | 3910 | 53 | 3 |
| market-beixiang | 3422 | 0 | 2 |
| market-ipo | 5872 | 22 | 7 |
| market-caibaoji | 4026 | 0 | 1 |
| market-longhu | 3199 | 1 | 1 |
| kline-gouzao | 3902 | 1 | 3 |
| kline-dangen | 3797 | 0 | 3 |
| kline-chuizi | 4555 | 0 | 5 |
| kline-tunmo | 4381 | 0 | 4 |
| kline-qimingxing | 4151 | 2 | 4 |
| kline-hongsanbing | 3664 | 0 | 4 |
| kline-yunxian | 4191 | 1 | 3 |
| kline-quekou | 4555 | 1 | 3 |
| kline-zhouqi | 4242 | 0 | 4 |
| kline-liangjia | 4457 | 1 | 6 |
| kline-juxian | 4343 | 0 | 3 |
| kline-fuquan | 4698 | 0 | 6 |
| trend-dingyi | 5215 | 0 | 4 |
| trend-zhicheng | 4850 | 0 | 7 |
| trend-qushixian | 4433 | 0 | 3 |
| trend-toujian | 4809 | 1 | 5 |
| trend-shuangding | 5356 | 1 | 6 |
| trend-sanjiao | 4959 | 0 | 7 |
| trend-yuanhu | 4626 | 1 | 5 |
| trend-tupo | 4810 | 2 | 7 |
| trend-jieduan | 4853 | 0 | 6 |
| trend-gailv | 4835 | 0 | 3 |
| indi-zonggang | 4650 | 16 | 6 |
| indi-ma | 3722 | 12 | 4 |
| indi-ema | 4676 | 79 | 6 |
| indi-macd | 3885 | 25 | 2 |
| indi-kdj | 3839 | 30 | 3 |
| indi-rsi | 4606 | 38 | 4 |
| indi-boll | 5174 | 3 | 6 |
| indi-vol | 4053 | 3 | 4 |
| indi-obv | 4913 | 42 | 6 |
| indi-atr | 5264 | 63 | 8 |
| indi-chouma | 5238 | 2 | 5 |
| indi-bias | 5249 | 0 | 7 |
| indi-gongzhen | 4658 | 20 | 5 |
| indi-shixiao | 4744 | 14 | 4 |
| fund-sanbiao | 5225 | 1 | 3 |
| fund-yingshou | 5466 | 3 | 2 |
| fund-roe | 5657 | 52 | 6 |
| fund-xianjinliu | 5220 | 2 | 6 |
| fund-fuzhai | 5221 | 1 | 4 |
| fund-cunhuo | 4877 | 4 | 6 |
| fund-pe | 5034 | 70 | 5 |
| fund-pbps | 5432 | 99 | 3 |
| fund-guxi | 5057 | 4 | 6 |
| fund-dcf | 5738 | 15 | 8 |
| fund-hucheng | 4442 | 1 | 3 |
| fund-shangye | 4932 | 1 | 6 |
| fund-hangye | 4772 | 10 | 5 |
| fund-zaojia | 4889 | 2 | 6 |
| trade-dingdan | 6011 | 8 | 9 |
| trade-cangwei | 4827 | 2 | 4 |
| trade-fenpi | 4600 | 1 | 5 |
| trade-zhisun | 4224 | 1 | 5 |
| trade-zhiying | 5462 | 1 | 7 |
| trade-jihua | 4604 | 0 | 5 |
| trade-zuoyou | 4224 | 2 | 3 |
| trade-dingtou | 4711 | 0 | 3 |
| trade-wangge | 4856 | 5 | 4 |
| trade-huadian | 5086 | 5 | 7 |
| trade-gganggan | 5123 | 0 | 6 |
| trade-zhuizhang | 4554 | 0 | 6 |
| master-jiazhi | 5539 | 6 | 7 |
| master-duanyongping | 5582 | 6 | 8 |
| master-lynch | 5374 | 9 | 5 |
| master-fisher | 5031 | 0 | 5 |
| master-livermore | 4805 | 2 | 5 |
| master-haigui | 5081 | 0 | 5 |
| master-bogle | 4520 | 4 | 5 |
| master-dalio | 4795 | 1 | 2 |
| master-quant | 5016 | 3 | 5 |
| master-duizhao | 4684 | 0 | 5 |
| mind-qizhong-sifa | 4883 | 1 | 5 |
| mind-sunshi | 4537 | 0 | 3 |
| mind-maoding | 4993 | 0 | 8 |
| mind-congzhong | 5686 | 4 | 6 |
| mind-guodu | 4303 | 1 | 2 |
| mind-xingcunzhe | 4362 | 0 | 2 |
| mind-huiche | 4595 | 0 | 3 |
| mind-heitiane | 5214 | 0 | 4 |
| mind-peizhi | 4883 | 0 | 2 |
| mind-qingdan | 4962 | 0 | 4 |
| tool-kanpan | 4821 | 0 | 3 |
| tool-wudang | 5197 | 0 | 6 |
| tool-fenshi | 5438 | 5 | 5 |
| tool-wangzhan | 4620 | 16 | 2 |
| tool-caibao | 4240 | 19 | 5 |
| tool-rili | 5067 | 14 | 1 |
| tool-lilv | 4003 | 1 | 5 |
| tool-meilianchu | 4747 | 6 | 7 |
| tool-zhouqi-shizhong | 4793 | 2 | 7 |
| tool-zhaiquan | 5572 | 6 | 5 |
| tool-qiquan | 5012 | 6 | 5 |
| tool-jijin | 5107 | 6 | 4 |
| tool-shuyu | 5167 | 27 | 7 |
| tool-lujing | 4131 | 0 | 4 |

## 排除目录

- `.git`：依赖、历史输出、临时文件或图片资源；不作课程文字改写
- `.playwright-cli`：依赖、历史输出、临时文件或图片资源；不作课程文字改写
- `archive`：依赖、历史输出、临时文件或图片资源；不作课程文字改写
- `interactive/assets`：依赖、历史输出、临时文件或图片资源；不作课程文字改写
- `node_modules`：依赖、历史输出、临时文件或图片资源；不作课程文字改写
- `output`：依赖、历史输出、临时文件或图片资源；不作课程文字改写
- `work`：依赖、历史输出、临时文件或图片资源；不作课程文字改写

机器标识、协议字段、来源标题不为追求中文而改名。截图与图片内嵌文字不属于本次可编辑文本扫描。
