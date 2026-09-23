# 程序记录用普通话怎么看

下面解释项目里保留的机器记录。字段名是程序之间约定的名字，不能随意翻译，否则程序可能读不到。字段的值也不能因为改文字就把“未完成”改成“通过”。

## reviews：以前的检查记录

- round表示第几轮。reviewers是原记录写的检查角色，不足以证明其为真人持牌专家。
- status为completed，表示原记录声称那一轮完成；不代表当前修改后的版本也通过。
- issues_total和issues_closed分别表示原记录列出的总问题数和已关闭数。
- residual_risks是原检查者认为还需要注意的地方。借券费用会变；期权公式有近似误差；市场报价可能变稀少。这些说明不能消除对应风险。
- candidate_sha256和closed_artifact_sha256是内容摘要，用来识别某一份文件是否变化。它不是专业认证，也不证明内容不可篡改。

professional-attestation.json仍为pending，意思是专业身份和审核证明没有完成。空白的名字、日期和轮次不能当成已经填写。

## evidence：准备保存的证据

visual-inspection.json为pending，表示旧PDF视觉检查记录尚未完成。它列出的空白页、裁切和重叠清单为空，不一定代表没有问题，也可能是没有检查。

source-coverage.json也是pending，不能说所有来源都已对应。网页的本次检查和旧PDF检查是两项不同任务。

## source和manuscript：资料映射

source-index.json记录资料索引。当前files与chunks为空，表示这个索引里没有条目。文章在网页中存在，不等于这份旧索引已经填好。

source-map.jsonl和augmentation-ledger.jsonl是空文件。它们预备用来记录文字来自哪里、补充了什么；空文件不能证明追踪已经完成。

## build：为减少重复生成留下的缓存

incremental-state.json保存输入文件的摘要。它帮程序知道哪些文件改过，哪些需要重新处理。旧摘要不代表当前文件已经重新生成或审核。

## 测试脚本里的英文

PASS表示该脚本列出的检查通过；FAIL表示至少有一项失败。assert是程序在检查一个条件。pageerror是页面执行代码时的错误。headless表示测试浏览器不弹出可见窗口。

这些标识和HTTP、JSON、HTML、JavaScript等协议、语言名称保留原文。教学正文、解释和提示可以改成通俗中文，机器契约不能用全文替换强行中文化。
