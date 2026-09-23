const REPLAY_KEY='manga-us-replay-v1';
const STAGE_ENDS=[3,7,11,15,19,24,26,27];
const STAGE_TALK=[
  ['你要证明的不是自己胆大，是明天还能坐在桌前。','我也赞成活着。活着才有下一把大的。','把“下一把大的”删掉。','那我写：下一碗大的。'],
  ['这根阳线很长，是不是该追？','长得像剑，不一定握得住；先看量，再看它收在哪里。','影线是去过，收盘才是留下。','原来 K 线也会嘴硬。'],
  ['我等到回踩了，限价单却没成交。','没成交只是没缘分，追成市价单可能变孽缘。','下单前先想清楚：更在意成交价，还是更在意能不能成交。','没买到不亏钱，也算半个好消息。'],
  ['五只科技股，怎么像同一只在跌？','衣服颜色不同，雷雨来了都站同一座山头。','会因同一个原因下跌的持仓，要合起来算损失。','五个碗里装同一锅粥。'],
  ['CPI 出来前，我猜对数字不就行了？','还得猜市场原来押了什么。答案对了，考卷可能早被价格批完。','事件前先降到能承受跳空的仓位。','锣响之前，先把耳朵捂好。'],
  ['股价涨了，Call 怎么还亏？','你买的不只方向，还有时间和热闹。热闹散了，票也会便宜。','先写清期权费最多能亏多少，再算股价变化的影响（Delta）。','原来烟花票过了时辰也会变纸。'],
  ['三个 Agent 都看多，可以下单了吗？','三个人抄同一条旧消息，只算一个人说话。','没写来源、时间或可能推翻判断的证据，就不能继续。','嗓门不能当证据，链接可以。'],
  ['这次计划写完，我是不是会赢？','不会。它能帮你记录为什么这么做，亏了也能找到要改的地方。','合格流程允许亏损，不允许失控。','账记清了，下回才知道哪口锅漏。']
];
let replayState={};
try{replayState=JSON.parse(localStorage.getItem(REPLAY_KEY)||'{}')}catch{replayState={}}
function replayCount(){return replayState[v2Active]||5}
function saveReplay(){localStorage.setItem(REPLAY_KEY,JSON.stringify(replayState))}
function drawReplayChart(){
  const c=document.querySelector('#storyChart');
  if(!c)return;
  const rows=SIM_BARS.slice(0,Math.min(SIM_BARS.length,replayCount()));
  const p=c.getContext('2d'),lo=Math.min(...rows.map(x=>x[2])),hi=Math.max(...rows.map(x=>x[1])),step=(c.width-80)/Math.max(rows.length,1),y=v=>210-(v-lo)/(Math.max(1,hi-lo))*160;
  p.clearRect(0,0,c.width,c.height);
  rows.forEach((b,i)=>{const x=45+i*step;p.strokeStyle=b[3]>=b[0]?'#207a58':'#b95443';p.beginPath();p.moveTo(x,y(b[1]));p.lineTo(x,y(b[2]));p.stroke();p.fillStyle=p.strokeStyle;p.fillRect(x-5,y(Math.max(b[0],b[3])),10,Math.max(3,Math.abs(y(b[0])-y(b[3]))));p.globalAlpha=.3;p.fillRect(x-6,268-b[4]/6,12,b[4]/6);p.globalAlpha=1});
  p.fillStyle='#667673';p.fillText(`SHAN · 已知 D1-D${rows.length} · 下一根尚未揭晓`,18,20);
}
function stageRecap(){
  const old=document.querySelector('.stage-recap');if(old)old.remove();
  if(!STAGE_ENDS.includes(v2Active)||!v2Done.has(v2Active))return;
  const start=v2Active-V2_SIZES[v2Stage(v2Active)]+1,events=sim.history.filter(x=>x.chapter-1>=start&&x.chapter-1<=v2Active);
  const first=events[0]?.equity||sim.account.equity,last=events.at(-1)?.equity||sim.account.equity,delta=last-first;
  const box=document.createElement('section');box.className='stage-recap';box.innerHTML=`<small>第 ${v2Stage(v2Active)+1} 幕复盘</small><h3>${V2_STAGES[v2Stage(v2Active)][0]}：本幕操作记录已保存</h3><div><span>本幕决策 <b>${events.length}</b></span><span>账户变化 <b>${delta>=0?'+':''}$${delta.toLocaleString()}</b></span><span>当前净值 <b>$${last.toLocaleString()}</b></span></div><p>盈亏不是通关标准；是否按事前规则行动，才是。</p>`;
  lessonStage.querySelector('.lesson-nav').before(box);
}
const replayBaseComplete=v2Complete;
v2Complete=function(ok,button){
  if(V2_TITLES[v2Active][1]==='chart'&&!v2Done.has(v2Active)&&replayCount()<=5){lessonFeedback.textContent='先记下你现在的观察，再揭晓一根新 K 线；不能偷看答案后补判断。';return}
  replayBaseComplete(ok,button);stageRecap();
};
const replayBaseRender=v2Render;
v2Render=function(){
  replayBaseRender();
  const stage=v2Stage(v2Active),talk=STAGE_TALK[stage],names=['陈平安','阿良','宁姚','周米粒'];
  lessonStage.querySelectorAll('.story-thread p span').forEach((node,i)=>node.innerHTML=`<b>${names[i]}</b>${talk[i]}`);
  if(V2_TITLES[v2Active][1]==='chart'){
    const actions=lessonStage.querySelector('.chart-actions');
    const reveal=document.createElement('button');reveal.id='revealBar';reveal.textContent='确认当前观察，查看下一根 K 线';
    actions.before(reveal);
    reveal.onclick=()=>{replayState[v2Active]=Math.min(SIM_BARS.length,replayCount()+1);saveReplay();drawReplayChart();lessonFeedback.textContent=`已揭晓第 ${replayCount()} 根。现在只根据当时可见信息做决定。`;if(replayCount()>=SIM_BARS.length)reveal.disabled=true};
    drawReplayChart();
  }
  stageRecap();
};
v2Render();
