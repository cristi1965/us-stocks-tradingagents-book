document.querySelectorAll('.diagram img').forEach(img=>img.addEventListener('error',()=>{const p=document.createElement('p');p.className='image-error';p.textContent='图暂时没有加载出来。可先阅读下方说明，稍后刷新重试。';img.after(p);img.hidden=true;}));
document.querySelector('#decision .read-guide').insertAdjacentHTML('afterbegin','<p>“计划完整”包括写清反证和失效条件；“风险合规”包括现金、仓位与组合风险满足预设限制。执行方还必须具有相应权限。</p>');
document.querySelector('#sequence .read-guide').insertAdjacentHTML('afterbegin','<p>图里的 alt 表示“按情况走不同分支”，opt 表示“满足条件才发生”。这里的“撮合”就是为买单和卖单寻找可以成交的对手。</p>');
document.querySelectorAll('.diagram').forEach(region=>{
  const controls=document.createElement('p');controls.className='map-controls';
  const button=document.createElement('button');button.type='button';button.textContent='缩小看全图';button.setAttribute('aria-pressed','false');
  button.onclick=()=>{const fit=region.classList.toggle('fit');button.textContent=fit?'恢复清晰尺寸':'缩小看全图';button.setAttribute('aria-pressed',String(fit));};
  controls.append(button,document.createTextNode(' 宽图可左右滑动；先看全貌，再放大读字。'));region.before(controls);
});

const videos={
  route:[
    {title:'The Basics of Investing',channel:'美国证券交易委员会 SEC',level:'英文初级 · 2分钟',why:'先理解目标、风险、分散和费用，不从“买哪只”开始。',url:'https://www.youtube.com/watch?v=XV13bSbjAYo',tag:'先看'},
    {title:'Financial Markets · Lecture 1',channel:'YaleCourses · Robert Shiller',level:'英文中高级 · 完整公开课',why:'想系统深入时，看金融市场为什么存在，以及它怎样帮助管理现实风险。',url:'https://www.youtube.com/watch?v=WQui_3Hpmmc',tag:'深入选看'}
  ],
  domain:[
    {title:'How To Build An Investing Strategy',channel:'Fidelity Investments',level:'英文初级到中级',why:'重点看目标、财务情况和风险承受力怎样一步步形成策略。',url:'https://www.youtube.com/watch?v=5cXPa2GybZ8',tag:'先看'},
    {title:'7 Essential Types of Orders for Trading Stocks',channel:'Charles Schwab',level:'英文中级 · 示例较多',why:'看清计划怎样变成订单，以及不同订单究竟约束价格还是成交。',url:'https://www.youtube.com/watch?v=hVOa_nNGS1I',tag:'接着看'}
  ],
  decision:[
    {title:'Beware of Common Tactics That Scam Artists Use',channel:'Investor.gov / SEC',level:'英文初级 · 短片',why:'承诺高收益、制造紧迫感或催促付款，都是应该立即暂停的红旗。',url:'https://www.youtube.com/watch?v=H756sIpgv6s',tag:'先看'},
    {title:'How To Build An Investing Strategy',channel:'Fidelity Investments',level:'英文初级到中级',why:'重点看 01:15–02:40：目标、风险承受力和投资选择为什么不能颠倒。',url:'https://www.youtube.com/watch?v=5cXPa2GybZ8',tag:'对应检查门'}
  ],
  sequence:[
    {title:'Understanding Market, Limit, and Stop Orders',channel:'Charles Schwab',level:'英文初级到中级',why:'市价单不保证价格；限价单不保证成交；止损价只是触发条件。',url:'https://www.youtube.com/watch?v=Tiyystl8x40',tag:'先看'},
    {title:'Understanding Trade Settlement',channel:'Fidelity Investments',level:'英文初级到中级',why:'继续看成交之后的结算，理解“成交了”为什么不等于资金流程全部结束。',url:'https://www.youtube.com/watch?v=937TMbz9N4A',tag:'接着看'}
  ]
};
for(const [id,items] of Object.entries(videos)){
  const section=document.querySelector(`#${id}`),guide=section?.querySelector('.read-guide');
  if(!guide)continue;
  const block=document.createElement('section');block.className='video-guide';block.setAttribute('aria-labelledby',`video-${id}`);
  block.innerHTML=`<div class="video-guide-head"><div><span>精选视频 · YouTube</span><h3 id="video-${id}">换一种讲法，再理解一次</h3></div><p>视频为英文，可打开 YouTube 字幕并使用自动翻译。只看“观看重点”，不用逐句听懂。</p></div><div class="video-list">${items.map(item=>`<a class="video-item" href="${item.url}" target="_blank" rel="noopener"><span class="video-tag">${item.tag}</span><strong>${item.title}</strong><small>${item.channel} · ${item.level}</small><p>${item.why}</p><span class="video-open">在 YouTube 打开 ↗</span></a>`).join('')}</div><p class="video-note">用于理解流程，不构成个股推荐或收益承诺。视频可能由发布方调整或下架。</p>`;
  guide.after(block);
}
