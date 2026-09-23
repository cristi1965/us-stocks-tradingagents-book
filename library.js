(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  $('.library-nav').insertAdjacentHTML('afterbegin','<p><a href="maps.html">先看全貌：流程与概念地图 →</a></p>');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let articles={}, catalog=[], active='', originalMode=false, originals=null, viewRequest=0, practiceBank={};
  function markdown(source){
    const lines=source.replace(/\r/g,'').split('\n');
    let out='', paragraph=[], list=null, code=null;
    const inline=s=>esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
    const flush=()=>{if(paragraph.length){out+='<p>'+inline(paragraph.join(' '))+'</p>';paragraph=[];}if(list){out+=list.type==='ol'?'</ol>':'</ul>';list=null;}};
    for(const line of lines){
      if(line.startsWith('```')){flush();if(code!==null){out+='<pre><code>'+esc(code.join('\n'))+'</code></pre>';code=null;}else code=[];continue;}
      if(code!==null){code.push(line);continue;}
      if(!line.trim()){flush();continue;}
      const heading=line.match(/^(#{1,4})\s+(.+)/);
      if(heading){flush();const level=Math.max(2,heading[1].length);out+='<h'+level+'>'+inline(heading[2])+'</h'+level+'>';continue;}
      const item=line.match(/^\s*(?:([-*])\s+|\d+[.)、]\s+)(.+)/);
      if(item){if(paragraph.length){out+='<p>'+inline(paragraph.join(' '))+'</p>';paragraph=[];}const type=item[1]?'ul':'ol';if(list?.type!==type){if(list)out+='</'+list.type+'>';out+='<'+type+'>';list={type};}out+='<li>'+inline(item[2])+'</li>';continue;}
      if(line.startsWith('> ')){flush();out+='<blockquote>'+inline(line.slice(2))+'</blockquote>';continue;}
      if(list){out+='</'+list.type+'>';list=null;}paragraph.push(line);
    }
    flush();if(code!==null)out+='<pre><code>'+esc(code.join('\n'))+'</code></pre>';
    return out;
  }
  function originalMarkup(source){
    let out='', end=0;
    for(const match of source.matchAll(/^:::chart\s*\n([\s\S]*?)^:::\s*$/gm)){
      out+=markdown(source.slice(end,match.index));
      let caption='原文图表';try{caption=JSON.parse(match[1]).cap||caption;}catch{}
      out+='<figure><figcaption>'+esc(caption)+'</figcaption><details><summary>查看原图数据（此处不绘图）</summary><pre><code>'+esc(match[0])+'</code></pre></details></figure>';
      end=match.index+match[0].length;
    }
    return out+markdown(source.slice(end));
  }
  function renderList(){
    const query=$('#articleSearch').value.trim().toLowerCase();
    const rows=catalog.filter(r=>[r.title,articles[r.id].title,articles[r.id].body].join(' ').toLowerCase().includes(query));
    $('#libraryCount').textContent=query?'找到 '+rows.length+' 篇':'118篇逐篇改写 · 可自由选择';
    $('#articleList').innerHTML=[...new Set(rows.map(r=>r.section))].map(section=>'<section><h3>'+esc(section)+'</h3>'+rows.filter(r=>r.section===section).map(r=>'<button class="article-link" data-article="'+esc(r.id)+'" '+(r.id===active?'aria-current="page"':'')+'>'+esc(articles[r.id].title)+'</button>').join('')+'</section>').join('')||'<p>没有找到，换个短一点的词试试。</p>';
  }
  async function open(id, focus=true){
    if(!articles[id])return;
    window.LearningTerms.close();
    active=id;originalMode=false;viewRequest++;history.replaceState(null,'','#'+encodeURIComponent(id));
    renderList();renderArticle();
    if(focus){$('#article').focus({preventScroll:true});$('#article').scrollIntoView({block:'start'});}
  }
  function renderArticle(){
    window.LearningTerms.close();
    const a=articles[active], meta=catalog.find(r=>r.id===active);
    $('#article').innerHTML='<div class="article-meta">'+esc(meta.section)+'</div><h1>'+esc(a.title)+'</h1><p class="article-note">课程通俗改写 · 根据参考文章重新组织讲解，不是作者原话。例子用于理解，不代表实时行情。</p><div class="article-actions"><button id="plainView" aria-pressed="'+!originalMode+'">读通俗版</button><button id="originalView" aria-pressed="'+originalMode+'">对照参考原文</button></div><div id="articleBody" class="article-body">'+(originalMode?'<div class="article-original">'+originalMarkup(originals[active])+'</div>':markdown(a.body))+'</div><details class="source-notes"><summary>这篇怎样改写的？</summary><p>原文标题：'+esc(meta.title)+'</p><p>'+esc(a.coverageNote)+'</p><p>原文结构：'+esc(a.sourceSections.join(' → '))+'</p></details>';
    $('.article-note').insertAdjacentHTML('afterend',window.DetailContext.render(meta.section,a.title,active));
    const practiceLink='<a class="article-practice-link" href="index.html#article-'+encodeURIComponent(active)+'-1">把这篇拆开做题 →</a>';
    $('.article-actions').insertAdjacentHTML('beforeend',practiceLink);
    const questions=practiceBank[active]||[];
    const pointLinks=questions.map((q,i)=>'<li><a href="index.html#article-'+encodeURIComponent(active)+'-'+(i+1)+'">'+esc(q.title)+' →</a></li>').join('');
    $('#articleBody').insertAdjacentHTML('afterend','<section class="example"><h2>读完了，试着用一次</h2><p>每次练一个知识点。答错会解释原因，并加入首页的复习清单。</p>'+(pointLinks?'<ol class="article-practice-points">'+pointLinks+'</ol>':practiceLink)+'</section>');
    if(!originalMode)for(const heading of $('#articleBody').querySelectorAll('h2')){
      const matches=questions.map((q,i)=>({q,i})).filter(({q})=>q.sourceHeading===heading.textContent);
      if(matches.length)heading.insertAdjacentHTML('afterend','<p class="small">'+matches.map(({q,i})=>'<a class="inline-practice" href="index.html#article-'+encodeURIComponent(active)+'-'+(i+1)+'">练这一点：'+esc(q.title)+' →</a>').join(' · ')+'</p>');
    }
    if(!originalMode)window.LearningTerms.enhance($('#articleBody'));
    $('#plainView').onclick=()=>{viewRequest++;originalMode=false;renderArticle();$('#plainView').focus({preventScroll:true});};
    $('#originalView').onclick=async()=>{
      const request=++viewRequest,id=active,button=$('#originalView');button.disabled=true;button.textContent='正在加载原文…';
      try{if(!originals){const r=await fetch('articles-original.json');if(!r.ok)throw Error('load');originals=await r.json();}
        if(active===id&&request===viewRequest){originalMode=true;renderArticle();$('#originalView').focus({preventScroll:true});}
      }catch{if(active===id&&request===viewRequest){button.disabled=false;button.textContent='原文加载失败，点击重试';}}
    };
  }
  $('#articleSearch').oninput=renderList;
  $('#articleList').onclick=e=>{const b=e.target.closest('[data-article]');if(b)open(b.dataset.article);};
  function hashId(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
  window.addEventListener('hashchange',()=>{const id=hashId();if(articles[id])open(id);});
  async function load(){
    try{
      const urls=['articles-catalog.json','articles-plain-1.json','articles-plain-2.json','articles-plain-3.json'];
      const data=await Promise.all(urls.map(async url=>{const r=await fetch(url);if(!r.ok)throw Error(url);return r.json();}));
      catalog=data[0];articles=Object.assign({},...data.slice(1));
      if(catalog.length!==118||catalog.some(r=>!articles[r.id]?.body))throw Error('incomplete');
      window.PlainLibrary={articles,catalog,open};
      open(articles[hashId()]?hashId():catalog[0].id,false);
    }catch{
      $('#libraryCount').textContent='文章暂时没有加载成功';
      $('#article').innerHTML='<div class="library-error"><h1>文章没有加载成功</h1><p>请确认通过本地服务打开页面，再试一次。</p><button id="retryLibrary">重新加载</button></div>';
      $('#retryLibrary').onclick=load;
    }
  }
  const questionLoad=Promise.all([1,2,3].map(async n=>{const r=await fetch('article-practice-'+n+'.json');if(!r.ok)throw Error('practice');return r.json();}));
  load();
  questionLoad.then(data=>{practiceBank=Object.assign({},...data);if(active)renderArticle();}).catch(()=>{});
})();
