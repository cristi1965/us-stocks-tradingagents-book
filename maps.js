document.querySelectorAll('.diagram img').forEach(img=>img.addEventListener('error',()=>{const p=document.createElement('p');p.className='image-error';p.textContent='图暂时没有加载出来。可先阅读下方说明，稍后刷新重试。';img.after(p);img.hidden=true;}));
document.querySelector('#decision .read-guide').insertAdjacentHTML('afterbegin','<p>“计划完整”包括写清反证和失效条件；“风险合规”包括现金、仓位与组合风险满足预设限制。执行方还必须具有相应权限。</p>');
document.querySelector('#sequence .read-guide').insertAdjacentHTML('afterbegin','<p>图里的 alt 表示“按情况走不同分支”，opt 表示“满足条件才发生”。这里的“撮合”就是为买单和卖单寻找可以成交的对手。</p>');
document.querySelectorAll('.diagram').forEach(region=>{
  const controls=document.createElement('p');controls.className='map-controls';
  const button=document.createElement('button');button.type='button';button.textContent='缩小看全图';button.setAttribute('aria-pressed','false');
  button.onclick=()=>{const fit=region.classList.toggle('fit');button.textContent=fit?'恢复清晰尺寸':'缩小看全图';button.setAttribute('aria-pressed',String(fit));};
  controls.append(button,document.createTextNode(' 宽图可左右滑动；先看全貌，再放大读字。'));region.before(controls);
});
