const workbenchBaseRender = v2Render;
const lessonPhaseByChapter = (() => {
  try { return JSON.parse(localStorage.getItem('manga-us-workbench-phases') || '{}'); }
  catch (_) { return {}; }
})();

function makePhase(number, title, subtitle, nodes) {
  if (!nodes.length) return null;
  const section = document.createElement('section');
  section.className = 'learning-phase';
  section.id = `lesson-phase-${number}`;
  section.innerHTML = `<header><span>${String(number).padStart(2, '0')}</span><div><h3>${title}</h3><p>${subtitle}</p></div></header><div class="phase-content"></div>`;
  const content = section.querySelector('.phase-content');
  nodes.forEach(node => content.appendChild(node));
  return section;
}

function enhanceLessonStructure() {
  if (lessonStage.querySelector('.lesson-roadmap')) return;
  const top = lessonStage.querySelector('.lesson-top');
  const title = lessonStage.querySelector(':scope > h2');
  const nav = lessonStage.querySelector('.lesson-nav');
  if (!top || !title || !nav) return;

  const story = lessonStage.querySelector('.story-thread');
  const guide = lessonStage.querySelector('.story-guide');
  const background = lessonStage.querySelector('.background-card');
  const term = lessonStage.querySelector('.chapter-term');
  const reality = [...lessonStage.querySelectorAll('.market-reality')];
  const example = lessonStage.querySelector('.chapter-example');
  const decision = lessonStage.querySelector('.decision-surface');
  const principle = lessonStage.querySelector('.principle');
  const recap = lessonStage.querySelector('.stage-recap');

  const roadmap = document.createElement('nav');
  roadmap.className = 'lesson-roadmap';
  roadmap.setAttribute('aria-label', '本章学习步骤');
  roadmap.innerHTML = '<button type="button" data-phase="1"><b>1</b><span>懂背景</span></button><button type="button" data-phase="2"><b>2</b><span>看例子</span></button><button type="button" data-phase="3"><b>3</b><span>做判断</span></button><button type="button" data-phase="4"><b>4</b><span>记规则</span></button>';
  title.after(roadmap);

  const phases = [
    makePhase(1, '先把来龙去脉讲清楚', '知道它是什么、为什么影响美股，以及不能从中推出什么。', [guide, background, term, ...reality].filter(Boolean)),
    makePhase(2, '跟着一个具体场景走', '先看人物怎么想，再用数字或图把概念落地。', [story, example].filter(Boolean)),
    makePhase(3, '现在轮到你判断', '一次只解决当前问题；答错会告诉你缺了哪条证据。', [decision].filter(Boolean)),
    makePhase(4, '把规则带去下一章', '记住边界和动作，不背孤立术语。', [principle, recap].filter(Boolean))
  ].filter(Boolean);
  phases.forEach(phase => nav.before(phase));

  const ruleButton = roadmap.querySelector('[data-phase="4"]');
  function syncRuleLock() {
    const locked = !v2Done.has(v2Active);
    ruleButton.setAttribute('aria-disabled', String(locked));
    ruleButton.classList.toggle('locked', locked);
    ruleButton.title = locked ? '先完成“做判断”并形成 Paper 回执' : '';
    return locked;
  }

  function showPhase(number, moveFocus = false) {
    if (number === 4 && syncRuleLock()) {
      const feedback = lessonStage.querySelector('#lessonFeedback');
      if (feedback) feedback.textContent = '先完成“做判断”并形成 Paper 回执，才能打开本章规则。';
      showPhase(3, true);
      return;
    }
    lessonPhaseByChapter[v2Active] = number;
    try { localStorage.setItem('manga-us-workbench-phases', JSON.stringify(lessonPhaseByChapter)); } catch (_) {}
    phases.forEach(phase => { phase.hidden = phase.id !== `lesson-phase-${number}`; });
    roadmap.querySelectorAll('[data-phase]').forEach(button => {
      const active = +button.dataset.phase === number;
      button.toggleAttribute('aria-current', active);
    });
    syncRuleLock();
    const activePhase = lessonStage.querySelector(`#lesson-phase-${number}`);
    if (moveFocus && activePhase) {
      activePhase.tabIndex = -1;
      activePhase.focus({ preventScroll: true });
      activePhase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  roadmap.querySelectorAll('[data-phase]').forEach(button => {
    button.onclick = () => showPhase(+button.dataset.phase, true);
  });
  phases.slice(0, -1).forEach((phase, index) => {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'phase-next';
    next.textContent = index === 1 ? '我看懂例子了，开始判断' : `继续：${['看例子', '做判断', '记规则'][index]}`;
    next.onclick = () => showPhase(index + 2, true);
    phase.appendChild(next);
  });
  syncRuleLock();
  showPhase(lessonPhaseByChapter[v2Active] || 1);
}

const workbenchBaseComplete = v2Complete;
v2Complete = function(ok, button) {
  workbenchBaseComplete(ok, button);
  const ruleButton = lessonStage.querySelector('[data-phase="4"]');
  if (ruleButton) {
    const locked = !v2Done.has(v2Active);
    ruleButton.setAttribute('aria-disabled', String(locked));
    ruleButton.classList.toggle('locked', locked);
    ruleButton.title = locked ? '先完成“做判断”并形成 Paper 回执' : '';
  }
};

v2Render = function() {
  workbenchBaseRender();
  enhanceLessonStructure();
};

const workbenchStyle = document.createElement('style');
workbenchStyle.textContent = `
#lessonStage{scroll-margin-top:78px}.lesson-roadmap{position:sticky;top:66px;z-index:3;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin:18px 0 28px;border:1px solid #ccd5d0;background:#ccd5d0}
.lesson-roadmap button{display:flex;align-items:center;gap:9px;min-width:0;min-height:46px;padding:11px 12px;border:0;border-radius:0;color:#334540;background:#f7faf8;text-decoration:none}.lesson-roadmap button:hover{background:#e7f1ec}.lesson-roadmap button[aria-current]{color:#fff;background:#18342c}.lesson-roadmap b{display:grid;place-items:center;width:24px;height:24px;flex:0 0 auto;color:#fff;background:#207a58;font-size:12px}.lesson-roadmap span{font-size:13px;font-weight:800;white-space:nowrap}
.lesson-roadmap button.locked{color:#7c8985;background:#eef1ef;cursor:not-allowed}.lesson-roadmap button.locked b{background:#9aa6a2}
.learning-phase{scroll-margin-top:132px;margin:0 0 30px;padding-top:4px;border-top:1px solid #d7ddd9}.learning-phase>header{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;padding:18px 0 14px}.learning-phase>header>span{display:grid;place-items:center;width:38px;height:38px;color:#207a58;background:#e2efe8;font-weight:900}.learning-phase>header h3{margin:0;font-size:21px;letter-spacing:0}.learning-phase>header p{margin:2px 0 0;color:#60716c;font-size:13px}.phase-content>*:first-child{margin-top:0}.phase-content>*:last-child{margin-bottom:0}
.learning-phase .story-guide,.learning-phase .background-card,.learning-phase .chapter-example,.learning-phase .principle{border-radius:0}.learning-phase .background-card{background:#fff}.learning-phase .decision-surface{min-height:0}.learning-phase .story-thread{margin-top:0}
.phase-next{width:100%;margin-top:18px;color:#fff;background:#18342c;border-color:#18342c}.phase-next:active{transform:translateY(1px)}
@media(max-width:700px){.lesson-roadmap{position:static;grid-template-columns:repeat(4,minmax(0,1fr));margin-inline:-16px}.lesson-roadmap button{justify-content:center;padding:10px 4px}.lesson-roadmap button b{display:none}.lesson-roadmap span{font-size:12px}.learning-phase{scroll-margin-top:78px;margin-bottom:24px}.learning-phase>header{grid-template-columns:34px minmax(0,1fr)}.learning-phase>header>span{width:32px;height:32px}.learning-phase>header h3{font-size:18px}.learning-phase>header p{font-size:12px}.background-card:not([open]) .background-body{display:none}}
`;
document.head.appendChild(workbenchStyle);
v2Render();
