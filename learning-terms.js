(() => {
  'use strict';
  const entries = window.LEARNING_GLOSSARY || [];
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const aliases = new Map();
  for (const entry of entries) for (const alias of entry.aliases) if (alias.length > 1) aliases.set(alias.toLowerCase(), entry);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pattern = [...aliases.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  const panel = document.createElement('aside');
  panel.id='termPanel'; panel.className='term-panel'; panel.hidden=true;
  panel.setAttribute('role','dialog'); panel.setAttribute('aria-labelledby','termTitle');
  document.body.append(panel);
  let active=null, pinned=false, timer;
  function close(returnFocus=false) {
    clearTimeout(timer); const previous=active; panel.hidden=true; pinned=false; active=null;
    if(previous) previous.setAttribute('aria-expanded','false');
    if(returnFocus && previous?.isConnected) { suppressFocus=true; previous.focus({preventScroll:true}); suppressFocus=false; }
  }
  let suppressFocus=false;
  function shell(title, subtitle, body) {
    panel.innerHTML=`<div class="term-panel-head"><div><h2 id="termTitle">${escape(title)}</h2><p>${escape(subtitle)}</p></div><button type="button" class="term-close" aria-label="关闭术语解释">×</button></div><div class="term-panel-body">${body}</div>`;
    panel.querySelector('.term-close').onclick=()=>close(true);
  }
  function anchor(button, pin) {
    clearTimeout(timer);
    if(active && active!==button) active.setAttribute('aria-expanded','false');
    active=button; pinned=pin; panel.hidden=false;
    panel.setAttribute('aria-modal',String(pin));
    if(button) button.setAttribute('aria-expanded','true');
  }
  function show(button, pin=false) {
    if(pinned && !pin) return;
    const entry=byId.get(button.dataset.term); if(!entry) return;
    anchor(button,pin);
    shell(entry.chinese,entry.english,`<p class="term-mode">${pin?'已固定，可滚动阅读。':'悬停预览 · 点击词条可固定阅读'}</p><section><h3>什么意思</h3><p>${escape(entry.meaning)}</p></section><section><h3>举个例子</h3><p>${escape(entry.example)}</p></section><section><h3>容易误解的地方</h3><p>${escape(entry.pitfall)}</p></section><p class="term-footnote">示例为教学假设。</p>`);
    if(pin) panel.querySelector('.term-close').focus({preventScroll:true});
  }
  function scheduleClose() {clearTimeout(timer);timer=setTimeout(()=>{if(!pinned && !panel.matches(':hover') && !panel.contains(document.activeElement) && !active?.matches(':focus')) close();},250);}
  function enhance(root) {
    if(!pattern) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      if(!node.nodeValue.trim() || node.parentElement.closest('button,a,textarea,input,select,script,style,[contenteditable],.notes')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      const re=new RegExp(pattern,'gi'); let match,last=0; const fragment=document.createDocumentFragment(); let changed=false;
      while((match=re.exec(node.nodeValue))){
        const token=match[0],before=node.nodeValue[match.index-1]||'',after=node.nodeValue[re.lastIndex]||'';
        if((/^[a-z]/i.test(token)&&/[a-z0-9_]/i.test(before)) || (/[a-z]$/i.test(token)&&/[a-z0-9_]/i.test(after)))continue;
        const entry=aliases.get(token.toLowerCase());
        fragment.append(document.createTextNode(node.nodeValue.slice(last,match.index)));
        const button=document.createElement('button'); button.type='button';button.className='term-link';button.dataset.term=entry.id;
        button.textContent=token;button.setAttribute('aria-label',`${token}：${entry.chinese}，查看解释`);button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','termPanel');button.setAttribute('aria-expanded','false');
        fragment.append(button);last=re.lastIndex;changed=true;
      }
      if(changed){fragment.append(document.createTextNode(node.nodeValue.slice(last)));node.replaceWith(fragment);}
    }
  }
  document.addEventListener('pointerover',event=>{const button=event.target.closest('.term-link');if(button && event.pointerType!=='touch')show(button);});
  document.addEventListener('pointerout',event=>{if(event.target.closest('.term-link'))scheduleClose();});
  panel.addEventListener('pointerenter',()=>clearTimeout(timer));panel.addEventListener('pointerleave',scheduleClose);
  document.addEventListener('focusout',event=>{if(event.target.closest('.term-link') || panel.contains(event.target))scheduleClose();});
  document.addEventListener('focusin',event=>{if(suppressFocus)return;const button=event.target.closest('.term-link');if(button)show(button);else if(!panel.contains(event.target)&&!pinned)close();});
  document.addEventListener('click',event=>{
    const button=event.target.closest('.term-link');
    if(button){event.preventDefault();event.stopPropagation();show(button,true);return;}
    if(!panel.hidden && !panel.contains(event.target) && event.target!==active)close();
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!panel.hidden){event.preventDefault();close(true);return;}
    if(event.key==='Tab'&&pinned&&!panel.hidden){
      const focusable=[...panel.querySelectorAll('button,input,a[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  function dictionary(button){
    anchor(button,true);
    shell('中英术语词典',`${entries.length} 个词条 · 支持中文、英文和缩写`,`<label for="termSearch">查找术语</label><input id="termSearch" type="search" placeholder="例如：Delta、权利金、止损"><div id="termResults"></div>`);
    const input=panel.querySelector('#termSearch'),results=panel.querySelector('#termResults');
    function search(){const q=input.value.trim().toLowerCase();const found=entries.filter(e=>[e.english,e.chinese,...e.aliases].join(' ').toLowerCase().includes(q));results.innerHTML=found.length?found.map(e=>`<button type="button" class="dictionary-entry" data-entry="${escape(e.id)}"><b>${escape(e.chinese)}</b><span>${escape(e.english)}</span></button>`).join(''):'<p>没有找到，试试中文名称或更短的关键词。</p>';}
    input.oninput=search;results.onclick=event=>{const target=event.target.closest('[data-entry]');if(!target)return;const proxy=button;proxy.dataset.term=target.dataset.entry;show(proxy,true);const back=document.createElement('button');back.type='button';back.textContent='← 返回词典';back.onclick=()=>dictionary(button);panel.querySelector('.term-panel-body').prepend(back);};search();input.focus();
  }
  window.LearningTerms={enhance,close,dictionary};
  document.querySelector('#glossaryOpen').onclick=event=>dictionary(event.currentTarget);
})();
