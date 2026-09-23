(async () => {
  'use strict';
  const coreLessons = window.LEARNING_LESSONS;
  let lessons = coreLessons;
  let articleCatalog=[], practiceLoadError=false;
  try {
    const data=await Promise.all(['articles-catalog.json','article-practice-1.json','article-practice-2.json','article-practice-3.json'].map(async url=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw Error(url);return await r.json();}finally{clearTimeout(timer);}}));
    articleCatalog=data[0];
    const bank=Object.assign({},...data.slice(1));
    if(articleCatalog.length!==118||articleCatalog.some(a=>!Array.isArray(bank[a.id])||bank[a.id].length<3))throw Error('incomplete');
    const extra=articleCatalog.flatMap(a=>bank[a.id].map((q,i)=>({
      id:`article-${a.id}-${i+1}`,title:q.title,group:a.section,goal:q.title,concept:q.explanation,
      articleId:a.id,articleTitle:a.title,sourceHeading:q.sourceHeading,part:i+1,parts:bank[a.id].length,
      terms:[],example:{prompt:'',steps:[]},
      quiz:{prompt:q.prompt,options:q.options,answer:q.answer}
    })));
    if(extra.some(l=>!l.title||!l.concept||!l.sourceHeading||!l.quiz.prompt||!Array.isArray(l.quiz.options)||l.quiz.options.length!==3||l.quiz.options.some(o=>!o.text||!o.feedback)||!Number.isInteger(l.quiz.answer)||l.quiz.answer<0||l.quiz.answer>2))throw Error('invalid quiz');
    lessons=[...coreLessons,...extra];
  } catch {practiceLoadError=true;}
  const key = 'tradingagents-learning-v1';
  const $ = selector => document.querySelector(selector);
  $('.sidebar').insertAdjacentHTML('afterbegin','<p><a href="maps.html">先看全貌：流程与概念地图 →</a></p>');
  $('#catalog').insertAdjacentHTML('beforebegin','<label class="search-label" for="courseScope">选择学习内容</label><select id="courseScope"><option value="core">基础路线 · 28课</option><option value="articles">文章拆解 · 118篇练习</option></select><p id="practiceStatus" role="status" class="small muted"></p>');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  if (!Array.isArray(lessons) || !lessons.length) { $('#lesson').textContent = '课程内容未能加载，请刷新页面重试。'; return; }
  let state = { active: lessons[0].id, records: {}, notes: {}, artifacts:{}, phaseChecks:{} };
  let storageWarning = '';
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved === 'object') {
      if (lessons.some(l => l.id === saved.active)) state.active = saved.active;
      for (const field of ['records','notes','artifacts','phaseChecks']) if (saved[field] && typeof saved[field] === 'object' && !Array.isArray(saved[field])) state[field] = saved[field];
    }
  } catch { storageWarning = '无法读取本地记录，本次仍可学习；可导出记录备份。'; }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { storageWarning = '浏览器未能保存记录。请用“导出学习记录”备份本次进度。'; }
    $('#storageStatus').textContent = storageWarning;
  }
  const record = id => { const r = state.records[id]; return r && typeof r === 'object' ? r : {}; };
  const wrong = () => lessons.filter(l => record(l.id).needsReview === true);
  const mainlineIds=(window.CURRICULUM_PHASES||[]).flatMap(phase=>phase.lessonIds);
  const mainlineLessons=mainlineIds.map(id=>coreLessons.find(l=>l.id===id)).filter(Boolean);
  let mode = 'path';
  let scope='core';
  const scoped=()=>lessons.filter(l=>scope==='articles'?!!l.articleId:!l.articleId);
  function catalog() {
    const term = $('#search').value.trim().toLowerCase();
    const ordered=scope==='core'?mainlineLessons:scoped();
    const found = ordered.filter(l => `${l.title} ${l.group} ${l.goal} ${l.concept} ${l.articleTitle||''} ${l.quiz.prompt}`.toLowerCase().includes(term));
    const groupOf=l=>scope==='articles'?`${l.group} · ${l.articleTitle}`:(()=>{const phase=window.Curriculum?.findByLesson(l.id);return phase?`阶段 ${phase.number} · ${phase.title}`:l.group;})();
    const groups = [...new Set(found.map(groupOf))];
    $('#catalog').innerHTML = groups.length ? groups.map(group => `<section class="catalog-group"><h3>${escape(group)}</h3>${found.filter(l => groupOf(l) === group).map(l => `<button class="lesson-link" data-id="${escape(l.id)}" ${l.id === state.active && mode === 'learn' ? 'aria-current="page"' : ''}><span class="num">${l.articleId?l.part:String(mainlineIds.indexOf(l.id)+1).padStart(2,'0')}</span><span>${escape(l.title)}</span><span class="${record(l.id).needsReview ? 'retry' : 'tick'}" aria-label="${record(l.id).needsReview ? '待复习' : record(l.id).passed ? '练习通过' : '未完成'}">${record(l.id).needsReview ? '↻' : record(l.id).passed ? '✓' : ''}</span></button>`).join('')}</section>`).join('') : '<p class="empty small">没有找到相关知识点，试试更短的关键词。</p>';
    $('#progress').textContent = `${scoped().filter(l => record(l.id).passed).length} / ${scoped().length} 练习通过`;
    $('#courseScope').value=scope;
    $('#reviewCount').textContent = wrong().length;
    for(const id of ['pathNav','learnNav','reviewNav'])$('#'+id).removeAttribute('aria-current');
    $('#'+(mode==='path'?'pathNav':mode==='review'?'reviewNav':'learnNav')).setAttribute('aria-current','page');
  }
  function open(id, focus = true) {
    if (!lessons.some(l => l.id === id)) return;
    mode = 'learn'; state.active = id; persist();
    scope=lessons.find(l=>l.id===id).articleId?'articles':'core';
    history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    render();
    if (focus) { $('#lesson').focus({preventScroll:true}); $('#lesson').scrollIntoView({block:'start'}); }
  }
  function render() {
    window.LearningTerms.close();
    catalog();
    const l = lessons.find(l => l.id === state.active), index = lessons.indexOf(l), r = record(l.id);
    const corePosition=mainlineIds.indexOf(l.id);
    const currentPhase=window.Curriculum?.findByLesson(l.id),previousLesson=mainlineLessons[corePosition-1],previousPhase=window.Curriculum?.findByLesson(previousLesson?.id);
    const cleanGoal=String(l.goal||'').replace(/[。！？]$/,'');
    const bridgeText=l.articleId?l.bridge:corePosition===0?'这是整条主线的起点：先确定自己最多能承受多少损失，再讨论可以买多少。':currentPhase!==previousPhase?`主线从“${previousPhase?.title}”转入阶段 ${currentPhase?.number}；这一节开始解决“${cleanGoal}”。`:`上一节“${previousLesson?.title}”给了这一节的前提；现在继续解决“${cleanGoal}”。`;
    const dialogue = l.dialogue || {question:`我学完这一节，具体要会什么？`,answer:l.concept,check:`所以先记住：${l.rule}`};
    $('#lesson').innerHTML = `<article><div class="lesson-heading"><div class="lesson-meta"><span>${escape(l.group)} · ${index+1} / ${lessons.length}</span><a href="#practice">已经会了？直接做题 ↓</a></div><h1>${escape(l.title)}</h1><p class="goal">这一节学会：${escape(l.goal)}</p><p class="bridge">${escape(l.bridge)}</p></div><details class="terms"><summary>遇到不懂的词，先看这里</summary><dl>${l.terms.map(([term,meaning]) => `<dt>${escape(term)}</dt><dd>${escape(meaning)}</dd>`).join('')}</dl></details><section class="dialogue" aria-label="本节教学对话"><div class="dialogue-line learner"><b>你问</b><p>${escape(dialogue.question)}</p></div><div class="dialogue-line coach"><b>这样理解</b><p>${escape(dialogue.answer)}</p></div><div class="dialogue-line learner"><b>你来解释</b><div><p>${escape(dialogue.checkQuestion)}</p><details class="self-check"><summary>想好了？看看怎么解释</summary><p>${escape(dialogue.checkAnswer)}</p></details></div></div></section><section class="example"><h2>一步一步算给你看</h2><p>${escape(l.example.prompt)}</p><ol>${l.example.steps.map(s => `<li>${escape(s)}</li>`).join('')}</ol></section><section class="practice" id="practice"><div class="practice-heading"><h2>换个条件，你来试试</h2><span>${r.needsReview ? '上次答错 · 再试一次' : r.passed ? '本节练习已通过 · 可重新检验' : '答完立即看原因'}</span></div><form id="quiz"><fieldset><legend>${escape(l.quiz.prompt)}</legend>${l.quiz.options.map((o,i) => `<label class="option"><input type="radio" name="answer" value="${i}" required><span>${escape(o.text)}</span></label>`).join('')}</fieldset><div class="submit-row"><button class="primary" type="submit">检查答案</button><p>可以参照例题。答错后会告诉你错在哪里。</p></div></form><div id="feedback" role="status" aria-live="polite"></div></section><details class="notes"><summary>用自己的话记一句 · 自动保存在此浏览器</summary><label for="note" class="search-label">我的理解 / 仍然不懂的地方</label><textarea id="note" placeholder="例如：止损价是触发价，不是保证成交价。">${escape(typeof state.notes[l.id] === 'string' ? state.notes[l.id] : '')}</textarea></details><div class="next-row"><button id="previous" ${index === 0 ? 'disabled' : ''}>← 上一节</button><span class="muted small">可以自由跳读</span><button id="next">${index === lessons.length-1 ? '去复习 →' : '下一节 →'}</button></div><p class="source">想继续深入？<a href="legacy.html" target="_blank" rel="noopener">打开完整专题与模拟工具 ↗</a></p></article>`;
    if(!l.articleId) $('.bridge').textContent=bridgeText;
    if(l.articleId){
      $('.lesson-heading').innerHTML=`<div class="lesson-meta"><span>${escape(l.group)} · 本文第 ${l.part} / ${l.parts} 个知识点</span><a href="#practice">直接做题 ↓</a></div><h1>${escape(l.title)}</h1><p class="bridge">来自：${escape(l.articleTitle)}</p>`;
      $('.terms').remove();$('.example').remove();
      $('.dialogue').outerHTML=`<section class="example article-concept"><h2>先弄懂这一点</h2><p>${escape(l.concept)}</p><a href="library.html#${encodeURIComponent(l.articleId)}">回到文章看完整解释 →</a><p class="small muted">对应段落：${escape(l.sourceHeading)}</p></section>`;
      $('.submit-row p').textContent='先按自己的理解选。每个选项都有原因说明。';
      $('.source').innerHTML=`<a href="library.html#${encodeURIComponent(l.articleId)}">返回这篇文章 →</a>`;
    }else{
      const phase=window.Curriculum?.findByLesson(l.id);
      $('.lesson-meta span').textContent=`${phase?`阶段 ${phase.number} · ${phase.title}`:l.group} · ${mainlineIds.indexOf(l.id)+1} / ${coreLessons.length}`;
    }
    $('.lesson-heading').insertAdjacentHTML('afterend',window.DetailContext.render(l.group,l.title,l.articleId||l.id));
    const sequence=l.articleId?scoped():mainlineLessons,position=sequence.indexOf(l);
    $('#previous').disabled=position===0;
    $('#next').textContent=position===sequence.length-1?'去复习 →':l.articleId&&l.part===l.parts?'下一篇练习 →':'下一节 →';
    window.LearningTerms.enhance($('#lesson'));
    $('#quiz').onsubmit = event => {
      event.preventDefault();
      const selected = $('#quiz input:checked');
      if (!selected) return;
      const choice = Number(selected.value), ok = choice === l.quiz.answer, previous = record(l.id);
      state.records[l.id] = { passed: ok || previous.passed === true, needsReview: !ok, attempts: (Number(previous.attempts)||0)+1, lastChoice:choice, lastCorrect:ok, updatedAt:new Date().toISOString() };
      persist(); catalog();
      $('#feedback').className = `feedback ${ok ? 'correct' : ''}`;
      $('#feedback').innerHTML = `<strong>${ok ? '答对了。' : '还差一点，看看这里。'}</strong><p>${escape(l.quiz.options[choice].feedback)}</p>${ok ? '<p>这一题已通过。稍后可回到这里，脱离例题再检验一次。</p>' : '<p>已加入复习。可以重新选择，再检查答案。</p>'}`;
      window.LearningTerms.enhance($('#feedback'));
    };
    $('#note').oninput = event => { state.notes[l.id] = event.target.value; persist(); };
    $('#previous').onclick = () => {if(position>0)open(sequence[position-1].id);};
    $('#next').onclick = () => position === sequence.length-1 ? review() : open(sequence[position+1].id);
  }
  function review() {
    window.LearningTerms.close(); mode = 'review'; catalog();
    const queue = wrong();
    $('#lesson').innerHTML = `<div class="lesson-heading"><div class="lesson-meta">复习清单</div><h1>把没想清楚的，再练一次。</h1><p class="review-intro">这里保留最近答错的题。重新答对后会移出清单。</p></div>${queue.length ? queue.map(l => `<section class="review-item"><div><h2>${escape(l.title)}</h2><p>${escape(l.goal)}</p></div><button data-id="${escape(l.id)}">重新练习 →</button></section>`).join('') : '<div class="empty"><p>目前没有待复习的错题。</p><p>这表示没有未解决的错误记录，不代表已经掌握全部内容。</p><button id="resume" class="primary">继续学习 →</button></div>'}`;
    window.LearningTerms.enhance($('#lesson'));
    if ($('#resume')) $('#resume').onclick = () => open(state.active);
    $('#lesson').focus({preventScroll:true}); $('#lesson').scrollIntoView({block:'start'});
  }
  function path(focus=true){
    window.LearningTerms.close();mode='path';scope='core';history.replaceState(null,'','#path');catalog();
    const phases=window.CURRICULUM_PHASES||[],lessonById=new Map(coreLessons.map(l=>[l.id,l])),articleById=new Map(articleCatalog.map(a=>[a.id,a]));
    const passed=id=>record(id).passed===true;
    const taskParts={account:['资金用途与不可动用金额','可投资资金','单笔风险预算','仍需向券商确认的账户数字'],evidence:['对象与日期','价格和成交量','数据来源','尚未知道的部分'],thesis:['一句可验证的判断','三条依据','一条反例','一个失效条件'],sizing:['单笔压力','组合压力','跳空或特殊风险','停手条件'],gate:['证据','判断与失效','数量与风险','缺失项','继续、补齐或放弃'],execution:['订单请求','券商回执','实际成交与剩余','账户变化','按当时证据复盘'],options:['权利与义务','最大投入','到期损益','到期前价格因素','交割或指派仍需确认的事项']};
    const phaseComplete=phase=>{const checks=state.phaseChecks[phase.id]||[];return phase.lessonIds.every(passed)&&(state.artifacts[phase.id]||'').trim().length>=20&&taskParts[phase.id].every((_,index)=>checks[index]);};
    const firstIncomplete=phases.find(phase=>!phaseComplete(phase))?.number||1;
    const casePrompts={account:'小林有10万元存款，其中3万元是一年内要用的钱。写出可投资资金和单笔最多能承受的损失，并标出仍需向券商确认的账户数字。',evidence:'继续使用小林的案例：记录一个标的在明确日期的价格、成交量和来源，先不判断涨跌。',thesis:'根据上一阶段的证据，写出一句判断、三条依据、一条反例和一个失效条件。',sizing:'在判断可能出错的前提下，计算单笔、组合和跳空压力，并写出停手条件。',gate:'把前四阶段合成一张研究卡，标出缺失项，并作出继续、补齐或放弃的决定。',execution:'为通过检查的案例选择模拟订单，记录请求、回执、成交、剩余和复盘，不能把提交当成交。',options:'另开选修案例：写清合约权利义务、最大投入、到期损益和到期前仍会变化的因素。'};
    const cards=phases.map(phase=>{
      const done=phase.lessonIds.filter(passed).length,checks=state.phaseChecks[phase.id]||[],artifact=state.artifacts[phase.id]||'',complete=phaseComplete(phase);
      const first=phase.lessonIds.find(id=>!passed(id))||phase.lessonIds[0];
      const lessonsHtml=phase.lessonIds.map(id=>{const l=lessonById.get(id);return `<button class="phase-lesson" data-id="${escape(id)}" aria-label="${escape(l.title)}，${passed(id)?'知识题已通过':'知识题未通过，去学习'}"><span aria-hidden="true">${passed(id)?'✓':'○'}</span><span>${escape(l.title)}</span><span>${passed(id)?'已练':'去学'}</span></button>`;}).join('');
      const articlesHtml=phase.articleIds.map(id=>{const a=articleById.get(id);return `<li><a href="library.html#${encodeURIComponent(id)}">${escape(a?.title||id)}</a> <a class="small" href="index.html#article-${encodeURIComponent(id)}-1">做题 →</a></li>`;}).join('');
      const opened=innerWidth>650||phase.number===firstIncomplete?'open':'';
      const checklist=taskParts[phase.id].map((part,index)=>`<label class="phase-check"><input type="checkbox" data-phase-check="${phase.id}" data-check-index="${index}" ${checks[index]?'checked':''}> 已写清：${escape(part)}</label>`).join('');
      return `<details class="phase-card" id="phase-${phase.id}" ${opened}><summary class="phase-head"><span class="phase-number">${String(phase.number).padStart(2,'0')}</span><div><h2>${escape(phase.title)}</h2><p class="phase-question">${escape(phase.question)}</p></div><span class="phase-status ${complete?'done':''}">${complete?'阶段任务已记录':`${done} / ${phase.lessonIds.length} 道知识题 · 作品待自查`}</span></summary><div class="phase-body"><p class="phase-why">${escape(phase.why)}</p><div class="phase-columns"><div><h3>主线必学 · 按这个顺序</h3><div class="phase-lessons">${lessonsHtml}</div></div><div><h3>遇到对应困惑时再读</h3><ol class="phase-articles">${articlesHtml}</ol></div></div><section class="phase-task" aria-labelledby="task-${phase.id}"><h3 id="task-${phase.id}">贯穿案例 · 阶段作品</h3><p>${escape(casePrompts[phase.id])}</p><label for="artifact-${phase.id}">${escape(phase.output)}</label><textarea id="artifact-${phase.id}" data-artifact="${phase.id}" placeholder="请分行写：${escape(taskParts[phase.id].join('；'))}。至少20个字。">${escape(artifact)}</textarea><fieldset class="phase-checklist"><legend>逐项检查，缺一项就继续补</legend>${checklist}</fieldset><p class="phase-gate"><b>本阶段标准：</b>${escape(phase.gate)}</p><p class="small muted">这是结构完整性自查，不检查观点是否正确，也不代表真实交易能力或平台认证。</p></section><div class="path-actions"><button class="primary" data-id="${escape(first)}">${done===phase.lessonIds.length?'重新检验知识题':'继续本阶段'} →</button><a href="maps.html#${escape(phase.map)}">看对应整体图 →</a></div></div></details>`;
    }).join('');
    const total=phases.flatMap(p=>p.lessonIds).filter(passed).length;
    $('#lesson').innerHTML=`<article><div class="curriculum-intro"><p class="lesson-meta">7阶段统一主线 · ${total} / ${coreLessons.length} 道核心练习已通过</p><h1>不用先刷118篇文章。先跑通一条主线。</h1><p class="goal">每个阶段都回答一个实际问题：先弄清账户，再收集证据、写判断、算风险、检查计划，最后模拟执行。</p><p class="curriculum-principle">28课是主线；精读文章用来补理解；354道文章题用来查漏补缺。其余文章当资料库查，不是必刷任务。</p></div><div class="phase-list">${cards}</div><p class="curriculum-footnote">“练习通过”只代表曾答对本题，不是真实交易能力证明。每阶段的产出和通过标准，才是组织学习的骨架。</p></article>`;
    window.LearningTerms.enhance($('#lesson'));
    $('#lesson').querySelectorAll('.phase-status').forEach(status=>{status.setAttribute('role','status');status.setAttribute('aria-live','polite');});
    const refreshPhaseStatus=id=>{const phase=phases.find(item=>item.id===id),status=$(`#phase-${id} .phase-status`),complete=phaseComplete(phase),done=phase.lessonIds.filter(passed).length;status.textContent=complete?'阶段任务已记录':`${done} / ${phase.lessonIds.length} 道知识题 · 作品待自查`;status.classList.toggle('done',complete);};
    $('#lesson').querySelectorAll('[data-artifact]').forEach(input=>input.oninput=event=>{const id=event.target.dataset.artifact;state.artifacts[id]=event.target.value;persist();refreshPhaseStatus(id);});
    $('#lesson').querySelectorAll('[data-phase-check]').forEach(input=>input.onchange=event=>{const id=event.target.dataset.phaseCheck,index=Number(event.target.dataset.checkIndex);state.phaseChecks[id]=state.phaseChecks[id]||[];state.phaseChecks[id][index]=event.target.checked;persist();refreshPhaseStatus(id);});
    if(focus){$('#lesson').focus({preventScroll:true});$('#lesson').scrollIntoView({block:'start'});}
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-id]');
    if (button) open(button.dataset.id);
  });
  $('#search').oninput = catalog;
  $('#courseScope').onchange=event=>{scope=event.target.value;$('#search').value='';const first=scoped()[0];if(first)open(first.id);else catalog();};
  $('#catalogToggle').onclick = () => { const expanded = $('.sidebar').classList.toggle('expanded'); $('#catalogToggle').setAttribute('aria-expanded', String(expanded)); $('#catalogToggle').textContent = expanded ? '收起目录' : '展开目录'; };
  $('#pathNav').onclick = () => path();
  $('#learnNav').onclick = () => open(state.active);
  $('#reviewNav').onclick = review;
  $('.brand').onclick = event => { event.preventDefault(); path(); };
  $('#export').onclick = () => {
    const blob = new Blob([JSON.stringify({schemaVersion:1, exportedAt:new Date().toISOString(), ...state},null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'tradingagents-learning.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  try { const old = JSON.parse(localStorage.getItem('manga-us-v2-done')); if (Array.isArray(old) && old.length) $('#oldProgress').textContent = `旧版 ${new Set(old.filter(n => Number.isInteger(n) && n >= 0 && n < 28)).size} 章记录已保留，可从“旧版与工具”查看。`; } catch {}
  function readHash() { try { return decodeURIComponent(location.hash.slice(1)); } catch { return ''; } }
  window.addEventListener('hashchange', () => { const id=readHash(); if(id==='path')path();else if (lessons.some(l => l.id === id)) open(id); });
  const target = readHash();
  if(lessons.some(l => l.id === target))open(target,false);else path(false);
  if(practiceLoadError){
    if(target.startsWith('article-'))history.replaceState(null,'','#'+encodeURIComponent(target));
    $('#practiceStatus').innerHTML='文章练习暂时没有加载成功，基础28课仍可使用。<button id="retryPractice">重新加载题库</button>';
    $('#retryPractice').onclick=()=>location.reload();
  }else $('#practiceStatus').textContent=`118篇已拆成 ${lessons.length-coreLessons.length} 道练习，答错后进入同一复习清单。`;
  window.LearningPractice={lessons,open};
})();
