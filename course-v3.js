const v3Events=JSON.parse(localStorage.getItem('manga-us-v3-events')||'[]');
const v2ControlFallback=v2Control;
v2Control=function(type,index){
  if(index===1)return '<div class="number-task"><p>账户 $100,000，请自选不超过 1% 的风险比例，并算出相应允许亏损。</p><label>风险比例（%）<input id="riskAnswer" type="number" step="0.1"></label><label>允许亏损（美元）<input id="lossAnswer" type="number"></label></div><button data-run>核对预算</button>';
  if(index===11)return '<div class="number-task"><p>入场 $50、止损 $48、滑点缓冲 $1，每股总风险是多少？</p><label>每股风险<input id="bufferAnswer" type="number" step="0.1"></label></div><button data-run>核对滑点</button>';
  if(index===12)return '<div class="number-task"><p>账户 $100,000，风险 1%，每股风险 $20。</p><label>最大股数<input id="sharesAnswer" type="number"></label></div><button data-run>核对股数</button>';
  if(index===19)return '<div class="number-task"><p>$20,000 财报仓位若跳空 -20%，损失多少？</p><label>压力损失<input id="gapAnswer" type="number"></label></div><button data-run>运行缺口压力</button>';
  if(index===16)return '<div class="macro-inputs"><label>公布值<input id="actual" type="number" value="3.2" step="0.1"></label><label>市场原先预期<input id="consensus" type="number" value="3.0" step="0.1"></label><label>两者比较<select id="surprise"><option value="">请选择</option><option value="hot">公布值更高</option><option value="same">刚好相同</option><option value="cool">公布值更低</option></select></label></div><button data-run>核对预期差</button>';
  if(index===18)return '<div class="macro-inputs"><label>2 年期收益率变化（bp）<input id="twoY" type="number" value="20"></label><label>10 年期收益率变化（bp）<input id="tenY" type="number" value="5"></label><label>哪一端跑得更快<select id="curveAnswer"><option value="">请选择</option><option value="flatten">2 年期更快，曲线趋平</option><option value="same">两端相同，斜率不变</option><option value="steepen">10 年期更快，曲线变陡</option></select></label></div><button data-run>核对曲线</button>';
  if(index===20)return '<div class="mini-chain"><button data-pick="good">剩余30天 · 买一 2.95 / 卖一 3.10 · 未平仓量12,400</button><button data-pick="bad">剩余7天 · 买一 1.20 / 卖一 2.10 · 未平仓量18</button></div><p>先比较点差占权利金比例、期限和未平仓量。</p>';
  if(index===21)return '<div class="number-task"><p>1 张标准看涨期权（Call），乘数 100、Delta（方向敏感度）0.50，当前约等效多少股的方向敏感度？</p><label>等效股数<input id="deltaAnswer" type="number"></label></div><button data-run>核对 Delta</button>';
  if(index===22)return '<div class="number-task"><p>Vega 0.12，IV 下降 10 个百分点；忽略其他因素，期权每股报价约变化多少美元？Vega 表示 IV 每变化 1 个百分点时的报价变化。</p><label>价格变化<input id="vegaAnswer" type="number" step="0.1"></label></div><button data-run>核对 Vega</button>';
  if(index===24)return '<div class="number-task"><p>同到期日买入行权价 $105、卖出行权价 $115 的标准看涨期权，每股净支出 $3、乘数 100，忽略费用。</p><label>最大亏损（每张）<input id="spreadLoss" type="number"></label><label>最大盈利（每张）<input id="spreadProfit" type="number"></label></div><button data-run>核对价差</button>';
  if(index===25)return '<div class="agent-board"><label><input type="checkbox" value="fresh">10 分钟前 SEC 文件</label><label><input type="checkbox" value="bear">包含反证</label><label><input type="checkbox" value="social">无链接社媒观点</label></div><button data-run>提交证据桌</button>';
  if(index===26)return '<div class="final-fields"><label>HTTPS 来源<input id="gateSource"></label><label>数据时间<input id="gateTime" type="datetime-local"></label><label>反证<input id="gateBear"></label><label>最大损失<input id="gateLoss" type="number"></label><label>失效条件<input id="gateInvalid"></label></div><button data-run>提交风险官</button>';
  return v2ControlFallback(type,index);
};
const V3_CHARTS={4:[[100,103,98,102,120],[102,106,101,105,160],[105,107,102,103,105],[103,109,102,108,210],[108,112,107,111,250]],6:[[100,104,98,103,130],[103,105,100,101,95],[101,104,99,103,90],[103,105,100,101,100],[101,104,99,102,86]],8:[[498,503,496,501,160],[501,506,499,504,130],[504,505,497,499,210],[499,503,496,502,180],[502,508,501,507,240]]};
v2Chart=function(){const c=document.querySelector('#storyChart');if(!c)return;const rows=V3_CHARTS[v2Active]||V3_CHARTS[4],p=c.getContext('2d'),lo=Math.min(...rows.map(x=>x[2])),hi=Math.max(...rows.map(x=>x[1])),step=130,y=v=>210-(v-lo)/(hi-lo)*160;p.clearRect(0,0,c.width,c.height);rows.forEach((b,i)=>{const x=65+i*step;p.strokeStyle=b[3]>=b[0]?'#207a58':'#b95443';p.beginPath();p.moveTo(x,y(b[1]));p.lineTo(x,y(b[2]));p.stroke();p.fillStyle=p.strokeStyle;p.fillRect(x-12,y(Math.max(b[0],b[3])),24,Math.max(4,Math.abs(y(b[0])-y(b[3]))));p.globalAlpha=.35;p.fillRect(x-16,260-b[4]/3,32,b[4]/3);p.globalAlpha=1});p.fillStyle='#667673';p.fillText('开高低收（OHLC）与成交量（固定教学样本）',20,22)};
function v3Validate(type){
  if(v2Active===1)return +riskAnswer.value>0&&+riskAnswer.value<=1&&+lossAnswer.value===100000*(+riskAnswer.value)/100;
  if(v2Active===11)return +bufferAnswer.value===3;
  if(v2Active===12)return +sharesAnswer.value===50;
  if(v2Active===19)return +gapAnswer.value===4000;
  if(v2Active===16){const diff=+actual.value-(+consensus.value),answer=diff>0?'hot':diff<0?'cool':'same';return actual.value!==''&&consensus.value!==''&&surprise.value===answer}
  if(v2Active===18){const diff=+twoY.value-(+tenY.value),answer=diff>0?'flatten':diff<0?'steepen':'same';return twoY.value!==''&&tenY.value!==''&&curveAnswer.value===answer}
  if(v2Active===21)return +deltaAnswer.value===50;
  if(v2Active===22)return +vegaAnswer.value===-1.2;
  if(v2Active===24)return +spreadLoss.value===300&&+spreadProfit.value===700;
  if(v2Active===25){const x=[...lessonStage.querySelectorAll('.agent-board input:checked')].map(n=>n.value);return x.includes('fresh')&&x.includes('bear')&&!x.includes('social')}
  if(v2Active===26){const age=gateTime.value?(Date.now()-new Date(gateTime.value))/36e5:999;return /^https:\/\//.test(gateSource.value)&&age>=0&&age<=24&&gateBear.value.trim().length>=8&&+gateLoss.value>0&&gateInvalid.value.trim().length>=8}
  if(type==='final')return v2Done.size>=27&&['planState','planInvalid','planOrder','planEvent','planReview'].every(id=>document.querySelector('#'+id).value.trim().length>=4)&&+planLoss.value>0&&+planLoss.value<=v2Equity*.02;
  if(type==='sequence')return [...lessonStage.querySelectorAll('[data-step]')].every((x,i)=>+x.dataset.clicked===i+1);
  if(type==='cluster'){const x=[...lessonStage.querySelectorAll('.cluster-pick input:checked')].map(n=>n.value);return ['chip','qqq','call'].every(v=>x.includes(v))&&!x.includes('tBill')}
  return true;
}
const v3BaseRender=v2Render;
v2Render=function(){v3BaseRender();const type=V2_TITLES[v2Active][1];lessonStage.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>v2Complete(v3Validate(type),b));let clickOrder=0;lessonStage.querySelectorAll('[data-step]').forEach((b,i)=>b.onclick=()=>{clickOrder++;b.dataset.clicked=clickOrder;b.classList.toggle('answer-right',clickOrder===i+1)});v2Chart()};
const v3BaseComplete=v2Complete;
v2Complete=function(ok,button){const before=v2Done.has(v2Active);v3BaseComplete(ok,button);if(ok&&!before){const pnl=v2Equity-(v3Events.at(-1)?.equity||100000);v3Events.push({chapter:v2Active+1,title:V2_TITLES[v2Active][0],equity:v2Equity,pnl,time:new Date().toISOString()});localStorage.setItem('manga-us-v3-events',JSON.stringify(v3Events));v2Journal()}};
const v3BaseJournal=v2Journal;
v2Journal=function(){v3BaseJournal();const list=document.createElement('div');list.className='journal-events';list.innerHTML='<b>最近练习（数值为教学演示）</b>'+v3Events.slice(-4).reverse().map(e=>`<span>第${e.chapter}章 · ${e.title}<small>${e.pnl>=0?'+':''}$${e.pnl}</small></span>`).join('');openTools.before(list)};
v2Render();
