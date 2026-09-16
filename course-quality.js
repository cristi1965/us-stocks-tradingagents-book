const ATTEMPT_KEY='manga-us-attempts-v1';
let lessonAttempts={};try{lessonAttempts=JSON.parse(localStorage.getItem(ATTEMPT_KEY)||'{}')}catch{lessonAttempts={}}
function saveAttempts(){localStorage.setItem(ATTEMPT_KEY,JSON.stringify(lessonAttempts))}
function firstIncomplete(){for(let i=0;i<28;i++)if(!v2Done.has(i))return i;return 28}
function applyProgressSemantics(){const proof=tradeJournal.querySelector('.proof');if(proof){proof.setAttribute('role','progressbar');proof.setAttribute('aria-label','课程进度');proof.setAttribute('aria-valuemin','0');proof.setAttribute('aria-valuemax','28');proof.setAttribute('aria-valuenow',String(v2Done.size))}}
function applyNavigationLock(){const unlocked=firstIncomplete();stageRail.querySelectorAll('[data-v2]').forEach(button=>{const index=+button.dataset.v2,locked=index>unlocked&&!v2Done.has(index);button.disabled=locked;button.toggleAttribute('aria-disabled',locked);if(locked)button.title=`先完成第 ${unlocked+1} 章`;else button.removeAttribute('title')});const next=lessonStage.querySelector('[data-next]');if(next){const locked=v2Active===27||(v2Active+1>unlocked&&!v2Done.has(v2Active+1));next.disabled=locked;next.toggleAttribute('aria-disabled',locked);if(locked&&v2Active<27)next.title=`先完成第 ${unlocked+1} 章`;else next.removeAttribute('title')}}
const qualityBaseJournal=v2Journal;
v2Journal=function(){qualityBaseJournal();applyProgressSemantics()};
const qualityBaseComplete=v2Complete;
v2Complete=function(ok,button){const key=String(v2Active),row=lessonAttempts[key]||{tries:0,wrong:0};row.tries++;if(!ok)row.wrong++;lessonAttempts[key]=row;saveAttempts();qualityBaseComplete(ok,button);applyProgressSemantics();applyNavigationLock()};
function fieldError(id,message){const el=document.querySelector('#'+id);if(!el)return;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby','lessonFeedback');if(!lessonFeedback.textContent.includes(message))lessonFeedback.textContent+=(lessonFeedback.textContent?' ':'')+message}
function explainInvalid(){lessonStage.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));lessonFeedback.textContent='';if(v2Active===26){const age=gateTime.value?(Date.now()-new Date(gateTime.value))/36e5:999;if(!/^https:\/\/(www\.)?(sec\.gov|federalreserve\.gov|bls\.gov|home\.treasury\.gov)\//i.test(gateSource.value))fieldError('gateSource','来源必须是 SEC、美联储、美国劳工统计局或美国财政部的一手官方链接。');if(age<0||age>24)fieldError('gateTime','本练习要求填写过去 24 小时内的时间。');if(+gateLoss.value<=0||+gateLoss.value>sim.account.equity*.02)fieldError('gateLoss','最大损失必须大于 0 且不超过当前净值的 2%。')}if(v2Active===27){const entry=+planEntry.value,stop=+planStop.value,shares=+planShares.value,cost=+planCost.value,gapPct=+planGapPct.value,planned=(Math.abs(entry-stop)+cost)*shares,gapLoss=(entry*gapPct/100+cost)*shares,limit=sim.account.equity*.02;if(!(entry>0))fieldError('planEntry','入场价必须大于 0。');if(!(stop>0))fieldError('planStop','止损价必须大于 0。');if(!(shares>0))fieldError('planShares','股数必须大于 0。');if(!(cost>=0))fieldError('planCost','单股滑点与费用不能小于 0。');if(!(gapPct>0))fieldError('planGapPct','隔夜缺口比例必须大于 0。');if(!(planned>0)||Math.abs(planned-(+planLoss.value))>.01)fieldError('planLoss','计划止损风险必须等于 (|入场价 - 止损价| + 单股滑点与费用) × 股数。');if(planned>limit)fieldError('planLoss','计划止损风险超过当前净值的 2%。');if(!(gapLoss>0)||Math.abs(gapLoss-(+planGapLoss.value))>.01)fieldError('planGapLoss','缺口压力损失必须等于 (入场价 × 缺口比例 ÷ 100 + 单股滑点与费用) × 股数。');if(gapLoss>limit)fieldError('planGapLoss','缺口压力损失超过当前净值的 2%。');['planState','planInvalid','planOrder','planCluster','planGap','planEvent','planReview'].forEach(id=>{if(document.querySelector('#'+id).value.trim().length<4)fieldError(id,'请补全标记字段。')})}if(!lessonFeedback.textContent)lessonFeedback.textContent='答案还不成立，请回看题目条件后重试。'}
const qualityBaseRender=v2Render;
v2Render=function(){qualityBaseRender();applyNavigationLock();lessonStage.querySelectorAll('[data-run]').forEach(button=>{const original=button.onclick;button.onclick=e=>{if(!v3Validate(V2_TITLES[v2Active][1])){explainInvalid();return}original(e)}});const recap=lessonStage.querySelector('.stage-recap');if(recap){const stage=v2Stage(v2Active),start=v2Active-V2_SIZES[stage]+1,weak=[];for(let i=start;i<=v2Active;i++)if((lessonAttempts[i]?.wrong||0)>0)weak.push(`第${i+1}章 ${V2_TITLES[i][0]}`);recap.insertAdjacentHTML('beforeend',`<p><b>薄弱点：</b>${weak.length?weak.join('、'):'本幕暂无错题记录'}。${weak.length?'建议先回做这些章节，再进入下一幕。':'可以进入下一幕。'}</p>`)}applyProgressSemantics()};
document.querySelectorAll('[data-complete]').forEach(button=>button.onclick=()=>{document.querySelector('#trainingDesk').scrollIntoView({behavior:'smooth'});setTimeout(()=>lessonHeadingFocus(),350)});
v2Render();

const qualityExplainInvalid = explainInvalid;
function meaningfulPlanText(value) {
  const text = value.trim();
  if (text.length < 6) return false;
  if (/(测试|随便|不知道|暂无|待定|填充|占位|abcd|asdf|1234)/i.test(text)) return false;
  const compact = text.replace(/\s/g, '');
  if (/^(.{1,12})\1+$/.test(compact)) return false;
  return new Set(compact).size >= 4;
}
const meaningfulBaseValidate = v3Validate;
v3Validate = function(type) {
  const valid = meaningfulBaseValidate(type);
  if (!valid || type !== 'final' || v2Active !== 27) return valid;
  return ['planState','planInvalid','planOrder','planCluster','planGap','planEvent','planReview'].every(id => meaningfulPlanText(document.querySelector('#' + id).value));
};
explainInvalid = function() {
  if (v2Active !== 27) return qualityExplainInvalid();
  lessonStage.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  lessonFeedback.textContent = '';
  const side = planSide.value;
  const entry = +planEntry.value;
  const stop = +planStop.value;
  const shares = +planShares.value;
  const cost = +planCost.value;
  const gapPct = +planGapPct.value;
  const clusterLoss = +planClusterLoss.value;
  const planned = (Math.abs(entry - stop) + cost) * shares;
  const gapLoss = (entry * gapPct / 100 + cost) * shares;
  const totalRisk = clusterLoss + Math.max(planned, gapLoss);
  const limit = sim.account.equity * .02;
  if (!side) fieldError('planSide', '请选择做多或做空。');
  if (side === 'long' && stop >= entry) fieldError('planStop', '做多计划的止损价必须低于入场价。');
  if (side === 'short' && stop <= entry) fieldError('planStop', '做空计划的止损价必须高于入场价。');
  if (!(entry > 0)) fieldError('planEntry', '入场价必须大于 0。');
  if (!(stop > 0)) fieldError('planStop', '止损价必须大于 0。');
  if (!(shares > 0)) fieldError('planShares', '股数必须大于 0。');
  if (!(cost >= 0)) fieldError('planCost', '每股滑点与费用不能小于 0。');
  if (!(gapPct > 0)) fieldError('planGapPct', '隔夜缺口比例必须大于 0。');
  if (!(clusterLoss >= 0)) fieldError('planClusterLoss', '同风险簇已有压力损失不能小于 0。');
  if (!(planned > 0) || Math.abs(planned - (+planLoss.value)) > .01) fieldError('planLoss', '计划止损风险计算不正确。');
  if (!(gapLoss > 0) || Math.abs(gapLoss - (+planGapLoss.value)) > .01) fieldError('planGapLoss', '缺口压力损失计算不正确。');
  if (totalRisk > limit) fieldError('planClusterLoss', '这笔较大压力损失加同风险簇已有压力损失，合计超过当前净值的 2%。');
  ['planState','planInvalid','planOrder','planCluster','planGap','planEvent','planReview'].forEach(id => {
    if (!meaningfulPlanText(document.querySelector('#' + id).value)) fieldError(id, '请写清具体条件，不能填“测试、随便、待定”或重复占位词。');
  });
  if (!lessonFeedback.textContent) lessonFeedback.textContent = '请检查填写内容后再试。';
};
