# 全量通俗改写交付记录

## 实际改写范围

- 28课的标题、教学对话、解释、例题、答案反馈和衔接；63条中英文词条的定义、例子与误解提示。
- 118篇参考文章逐篇读原文后重写正文，共107808个中文字。默认显示通俗版，不只是增加导读。
- 旧页面的教学提示、工具反馈和文章入口；研究说明、课程大纲、历史实施计划和审核步骤。文件清单见 project-copy-audit.md。
- 每篇记录原文结构和删改说明。旧研究文档保存在 archive/pre-full-eli5/，文章原文保存在 articles-original.json。历史机器记录不篡改状态，另附 machine-records-explained.md。

## 写作原则

先解释发生了什么，再介绍专业名字；使用可复算的小例子，说明什么时候成立、什么时候会失效。保留有用公式，去掉口号、重复劝诫和未经核实的固定收益或规则承诺。

## 验证记录

自动验证输出见 output/full-rewrite-validation.txt；包括28课学习流程、术语交互、旧页面桌面/手机检查，以及118篇新阅读页。截图在 output/playwright/library-desktop.png 和 library-mobile.png。
浏览器测试证明所列功能可用，不证明每个读者都能学会，也不是金融专业认证。真实市场当日规则仍需核对。本次没有发布或推送远端。

## 逐篇覆盖

| ID | 改写标题 | 正文字数（中文） | 原章节数 |
| --- | --- | ---: | ---: |
| start-why | 为什么买的股票不差，账户还是亏钱？ | 898 | 5 |
| start-touzi-touji | 同样买一只股票，怎么分清投资、投机和碰运气？ | 941 | 5 |
| start-duoshao-qian | 买股票前，怎样判断这笔钱能不能承受亏损？ | 937 | 6 |
| start-kaihu | 选择券商和开户渠道，应该先核对什么？ | 956 | 5 |
| start-jiaoyi-shijian | 为什么已经挂单，却还没有成交？ | 953 | 5 |
| start-feiyong | 一笔买卖到底花了多少钱？ | 914 | 6 |
| start-t1t0 | 当天能卖、钱能再买、钱能取出，是一回事吗？ | 905 | 5 |
| start-zhangdieting | 跌停以后，为什么仍然可能卖不出去？ | 888 | 6 |
| start-chuquan | 公司分红了，为什么股价参考值反而降低？ | 941 | 6 |
| start-daxin | 中签买到新股，为什么仍然可能亏钱？ | 937 | 6 |
| market-gupiao | 买一股股票，究竟买到了什么？ | 966 | 5 |
| market-jiage | 屏幕上的股价，是买家和卖家怎样凑出来的？ | 937 | 5 |
| market-shizhi | 八元股票一定比八十元股票便宜吗？ | 980 | 5 |
| market-zhishu | 大盘涨了，为什么自己的股票没涨？ | 949 | 5 |
| market-bankuai | 一家卖酱油的公司，为什么也能被叫作AI概念股？ | 967 | 5 |
| market-sanshi | 换一个市场买股票，哪些旧习惯必须重新检查？ | 970 | 5 |
| market-fengge | 大盘、成长、价值这些标签，能帮你看清什么？ | 1027 | 5 |
| market-etf | ETF是一篮子资产，为什么盘中还会买贵？ | 962 | 5 |
| market-beixiang | 资金流入和融资余额，能直接告诉你该买什么吗？ | 972 | 5 |
| market-ipo | 发行、回购、ST和退市，分别改变了股东什么？ | 970 | 6 |
| market-caibaoji | 公司利润明明增长，财报出来后为什么还会跌？ | 998 | 5 |
| market-longhu | 龙虎榜上有人大买，为什么不能直接照着买？ | 979 | 5 |
| kline-gouzao | 一根K线里的粗柱和细线，各记录了什么？ | 905 | 6 |
| kline-dangen | 长影线和十字星，是反转信号还是一天的记录？ | 937 | 6 |
| kline-chuizi | 长得一样的锤子线和上吊线，为什么名字不同？ | 958 | 6 |
| kline-tunmo | 阳包阴说的包住，到底要包住哪一段？ | 967 | 6 |
| kline-qimingxing | 启明星为什么要看三根，而不能只看中间那颗星？ | 937 | 6 |
| kline-hongsanbing | 连续三根阳线，为什么不一定是有力的红三兵？ | 958 | 6 |
| kline-yunxian | 大K线里面缩着一根小K线，说明什么？ | 962 | 6 |
| kline-quekou | 图上的缺口，真的迟早一定会补吗？ | 983 | 6 |
| kline-zhouqi | 日线在跌、周线在涨，到底该信哪一个？ | 957 | 6 |
| kline-liangjia | 放量上涨和缩量下跌，分别能证明什么？ | 1001 | 6 |
| kline-juxian | 形态完全符合课本，为什么还是走反了？ | 991 | 6 |
| kline-fuquan | 股票从四十元变二十元，为什么不一定亏了一半？ | 996 | 6 |
| trend-dingyi | 连续涨了几天，就能叫上升趋势吗？ | 979 | 6 |
| trend-zhicheng | 支撑是地板吗？为什么破了以后有时跌得更快？ | 990 | 6 |
| trend-qushixian | 价格跌破趋势线，是趋势结束还是只是走慢了？ | 975 | 6 |
| trend-toujian | 三个高点像头和肩，就能断定要跌了吗？ | 917 | 6 |
| trend-shuangding | 两个高点像M，什么时候才算双顶？ | 987 | 6 |
| trend-sanjiao | 三角形、旗形和楔形，都表示下一步要上涨吗？ | 1036 | 6 |
| trend-yuanhu | 股价走成一个碗，为什么还不能认定见底？ | 843 | 6 |
| trend-tupo | 价格越过关口，怎样判断只是探头还是站住？ | 852 | 6 |
| trend-jieduan | 冷清、上涨、过热，为什么只是理解趋势的框架？ | 952 | 6 |
| trend-gailv | 形态胜率很高，为什么照着做仍可能亏钱？ | 845 | 6 |
| indi-zonggang | 指标到底增加了什么，又看不到什么？ | 864 | 5 |
| indi-ma | 均线怎样算，金叉为什么不能提前保证上涨？ | 835 | 6 |
| indi-ema | EMA让最近价格更重要，代价是什么？ | 832 | 6 |
| indi-macd | MACD的两条线和柱子，各自在比较什么？ | 825 | 5 |
| indi-kdj | KDJ超过80，为什么价格还可以一直涨？ | 818 | 6 |
| indi-rsi | RSI的70和30，究竟在量什么？ | 843 | 5 |
| indi-boll | 布林带变窄，只说明安静，还是预告上涨？ | 832 | 6 |
| indi-vol | 成交量大，到底说明买的人多还是交易更活跃？ | 828 | 6 |
| indi-obv | OBV向上，是成交量记账结果，还是资金真的流入？ | 865 | 6 |
| indi-atr | ATR怎样把跳空也算进去，为什么不能告诉你涨跌？ | 832 | 6 |
| indi-chouma | 筹码图上的成本，是谁的真实买入价？ | 917 | 6 |
| indi-bias | 离均线很远，价格一定要跌回来吗？ | 815 | 6 |
| indi-gongzhen | 三个指标一起点头，真的等于三份证据吗？ | 920 | 5 |
| indi-shixiao | 指标不灵了，是算法坏了，还是原来的假设不适用？ | 915 | 6 |
| fund-sanbiao | 公司说赚了钱，为什么银行账户却没增加？ | 879 | 5 |
| fund-yingshou | 收入增长很快，怎样判断利润也是真的在长？ | 852 | 5 |
| fund-roe | 同样赚20%，有的靠生意，有的靠借钱，怎么分清？ | 803 | 5 |
| fund-xianjinliu | 利润与经营现金流差很多，怎样把原因找出来？ | 939 | 5 |
| fund-fuzhai | 负债率一样，为什么一家轻松，另一家快还不上钱？ | 886 | 5 |
| fund-cunhuo | 货越来越多、欠款越来越多，是扩张还是卖不动？ | 879 | 5 |
| fund-pe | 市盈率20倍，是保证20年回本吗？ | 841 | 5 |
| fund-pbps | 利润不好用时，PB、PS和PEG还能告诉你什么？ | 841 | 5 |
| fund-guxi | 股息率很高，是分得多，还是股价跌得多？ | 874 | 5 |
| fund-dcf | 未来收到的钱，怎样折算成今天的公司价值？ | 833 | 5 |
| fund-hucheng | 一门生意赚钱，凭什么竞争者抢不走？ | 957 | 5 |
| fund-shangye | 这家公司到底靠什么收钱，明年为什么还能收？ | 963 | 5 |
| fund-hangye | 市场很大，为什么里面的公司仍可能赚不到钱？ | 826 | 6 |
| fund-zaojia | 财报哪里值得怀疑，又为什么不能凭一个比例指控造假？ | 936 | 5 |
| trade-dingdan | 限价、市价和条件单，到底各保证了什么？ | 872 | 5 |
| trade-cangwei | 判断可能会错，怎样先算清一次错误伤账户多深？ | 839 | 5 |
| trade-fenpi | 分三次买，究竟分散了什么风险？ | 833 | 6 |
| trade-zhisun | 止损线画好了，为什么实际亏损仍可能更大？ | 912 | 6 |
| trade-zhiying | 已经赚钱了，怎样决定卖出而不总盯着最高点？ | 872 | 6 |
| trade-jihua | 交易计划写什么，日志怎样记才不是只抄盈亏？ | 920 | 6 |
| trade-zuoyou | 下跌时买与等回升后买，各在承担什么？ | 890 | 6 |
| trade-dingtou | 固定金额一直买，为什么成本较低也仍会亏钱？ | 862 | 6 |
| trade-wangge | 价格来回走，网格为什么能赚钱又会亏钱？ | 832 | 6 |
| trade-huadian | 屏幕显示10元，为什么实际买入更贵？ | 873 | 5 |
| trade-gganggan | 借钱买股票，为什么还没跌光就会被卖出？ | 876 | 6 |
| trade-zhuizhang | 为什么越怕错过，越容易高买低卖？ | 873 | 6 |
| master-jiazhi | 便宜的股票，怎样分清机会和正在变坏的生意？ | 907 | 6 |
| master-duanyongping | “不懂不做”，怎样变成能检查的研究步骤？ | 917 | 5 |
| master-lynch | 身边生意很火，怎样查到它是不是好投资？ | 959 | 5 |
| master-fisher | 一家成长公司，怎样判断它还能好多久？ | 905 | 5 |
| master-livermore | 价格突破之后，怎样区分计划交易和临时追涨？ | 847 | 6 |
| master-haigui | 把交易写成规则，真的能减少临场乱改吗？ | 867 | 6 |
| master-bogle | 不挑赢家，买一篮子市场为什么也值得研究？ | 892 | 5 |
| master-dalio | 不知道下一阶段经济怎样，怎样检查组合怕什么？ | 902 | 5 |
| master-quant | 让电脑按规则交易，怎样判断它真的有用？ | 917 | 5 |
| master-duizhao | 价值、成长、趋势和指数，哪种问题适合哪种方法？ | 933 | 6 |
| mind-qizhong-sifa | 反复亏钱时，先检查哪七种行为？ | 900 | 5 |
| mind-sunshi | 为什么赚一点就想卖，亏很多却舍不得卖？ | 866 | 5 |
| mind-maoding | 股价为什么不会因为你买在20元就回到20元？ | 850 | 6 |
| mind-congzhong | 大家都在赚钱时，怎样判断自己是不是只怕错过？ | 920 | 6 |
| mind-guodu | 连续赚了几次，怎样防止把运气当成能力？ | 880 | 5 |
| mind-xingcunzhe | 只看还在榜单上的赢家，会漏掉什么？ | 866 | 5 |
| mind-huiche | 亏50%后，为什么要涨100%才能回本？ | 859 | 6 |
| mind-heitiane | 平时很少发生的事，为什么也要算进风险？ | 940 | 5 |
| mind-peizhi | 家庭有一笔存款，到底多少可以承受股票下跌？ | 959 | 6 |
| mind-qingdan | 下单前怎样用一张清单发现承受不起的风险？ | 849 | 6 |
| tool-kanpan | 打开看盘软件，先看清哪些数字才不会误读？ | 926 | 5 |
| tool-wudang | 五档里买单很多，为什么不代表股价一定涨？ | 858 | 5 |
| tool-fenshi | 分时图的两条线，到底各在说什么？ | 942 | 5 |
| tool-wangzhan | 查股票资料，怎样从网页回到可靠的原始文件？ | 932 | 5 |
| tool-caibao | 找到一份财报后，先核对哪几页才不被摘要带偏？ | 946 | 5 |
| tool-rili | CPI、就业和议息出来时，市场到底在重算什么？ | 977 | 5 |
| tool-lilv | 利率上升，为什么未来的钱现在会显得更便宜？ | 926 | 5 |
| tool-meilianchu | 美联储调利率，怎样一步步影响其他市场？ | 983 | 5 |
| tool-zhouqi-shizhong | 经济冷暖变了，怎样用“投资时钟”整理思路？ | 940 | 5 |
| tool-zhaiquan | 债券、可转债和REITs，收到的现金分别是什么？ | 1000 | 6 |
| tool-qiquan | 股票方向看对了，为什么买期权仍可能亏钱？ | 940 | 6 |
| tool-jijin | 挑基金时，除了去年涨了多少，还要比较什么？ | 966 | 5 |
| tool-shuyu | 看到成交量、PE和涨停，怎样一句话说清它们？ | 950 | 6 |
| tool-lujing | 刚亏了一笔、遇到生词、想系统学，分别从哪里读？ | 1008 | 5 |

## 交付文件指纹

以下指纹对应报告生成时的文件，用于区分后续版本。

| 文件 | SHA-256 |
| --- | --- |
| interactive/library.html | 5816c52f9e5981978638e6b642e6c73cb4b778cdfb24e50390430d43cd223a14 |
| interactive/library.js | b5b6790e25299cf6ab5e9b03376b3cf072e2cf292016ab6f20181192106d7ad8 |
| interactive/library.css | 078a104f4de6bb23e358ebbba87b500d26300aa20ec993d6eba4cb344a36f9ec |
| interactive/articles-catalog.json | 49c2ebf8f95a363066aaaada3ce328be4b9730e301bac59d91d39bedb98ee586 |
| interactive/articles-plain-1.json | 863fa8a09cbb7cf232237f7345f2e19845422bf30f7aa8f07a6df369a2cc8ee8 |
| interactive/articles-plain-2.json | b0225d6b05068031f0af4193d1bc4ab8f9e2132960fc0ca4a82d6daa53583f0c |
| interactive/articles-plain-3.json | ab252949e9e4da310b366c6c20edbc3995fa16cab3e4a4633849afdc45d2f7ec |
| interactive/learning-content.js | fcabdcfc99fbc4493be020dc0dd38d4b6f9fdef2e3ec150bc20b75658a15601b |
| interactive/learning-glossary.js | d0898968c2d11d1a9485891aea10b3f989601d4dc3e5b54f8424dd261f5af45a |
| interactive/learning-terms.js | 526d65d976792417b982f5972e6c08403e857469172a228d9ec4cfc37c91c3df |
| verify-library.cjs | 22c8c949d5d5cfd42af05bd0ff23710516e7b8a5850408e32bb86d58cab87bc4 |
