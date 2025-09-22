(()=>{
    if(localStorage.getItem('bootDone')){
    document.getElementById('boot').remove();
    return;
    }

    const term  = document.querySelector('.term');
    const raw = [
    'CTF Zone 初始化...',
    'Copyright \u00A9 2025 Aurorp1g',
    '',
    '正在检查环境... 环境可用 [OK]',
    '',
    '>> 加载赛博空间 ████████████ 100%',
    '>> 题目矩阵注入 ████████████ 100%',
    '>> 加密模块检测 ████████████ 100%',
    '>> 初始化完成, 欢迎白帽！！',
    '',
    '>> Flag 验证服务已上线',
    '>> 愿你享受这场数字盛宴！'
    ];

    let lineIndex = 0, charIndex = 0;

    function newEmptyLine(){
    const line = document.createElement('div');
    line.className = 'line';
    term.appendChild(line);
    return line;
    }

    function injectPrefix(line){

    const txt = document.createElement('span');
    txt.className = 'text';
    line.append(txt);

    const cur = document.createElement('span');
    cur.className = 'cursor';
    cur.textContent = '█';
    line.append(cur);

    return txt;
    }

let curLine = newEmptyLine();
let txtSpan;

function type(){
    if(lineIndex < raw.length){
    if(charIndex === 0) txtSpan = injectPrefix(curLine);

    if(charIndex < raw[lineIndex].length){
        txtSpan.textContent += raw[lineIndex][charIndex++];
        setTimeout(type, 30);
    }else{
        curLine.querySelector('.cursor').remove();
        lineIndex++; charIndex = 0;
        curLine = newEmptyLine(); 
        setTimeout(type, 300);
    }
    }else{
    localStorage.setItem('bootDone', '1');
    setTimeout(()=>document.getElementById('boot').remove(), 1000);
    }
    }
    type();
})();

(function () {
  function shouldShowGuide() {
    return localStorage.getItem('ctf-guide-seen') !== 'true';
  }
  if (!shouldShowGuide()) return;

  const guideHTML = `
<div id="newbie-guide-modal" class="modal-overlay">
  <div class="guide-modal">
    <div class="guide-header">
      <h2>🎉 欢迎来到 CTF Zone！</h2>
      <button class="close-btn">&times;</button>
    </div>
    <div class="guide-content">
      <div class="guide-step active" data-step="1">
        <div class="step-icon">📥</div>
        <h3>获取题目</h3>
        <p>所有题目文件均在<b>导航栏&nbsp;→&nbsp;题目列表</b>对应卡片内下载！</p>
        <div class="guide-highlight nav-demo">
          <i class="fas fa-list fa-fw"></i>
          <span>题目列表</span>
        </div>
      </div>
      <div class="guide-step" data-step="2">
        <div class="step-icon">📋</div>
        <h3>选择题目</h3>
        <p>从下拉菜单中选择你想校验的题目，每道题都有不同的难度等级。</p>
        <div class="guide-highlight">
          <select class="demo-select">
            <option>请选择题目</option>
            <option>示例题目 1</option>
            <option>示例题目 2</option>
          </select>
        </div>
      </div>
      
      <div class="guide-step" data-step="3">
        <div class="step-icon">🔑</div>
        <h3>输入 Flag</h3>
        <p>在输入框中填入你解题后得到的 flag，格式通常为 <code>flag{...}</code>。</p>
        <div class="guide-highlight">
          <input type="text" class="demo-input" placeholder="flag{your_answer_here}">
        </div>
      </div>
      
      <div class="guide-step" data-step="4">
        <div class="step-icon">✅</div>
        <h3>验证答案</h3>
        <p>点击"执行校验"按钮，系统会验证你的答案是否正确。</p>
        <div class="guide-highlight">
          <button class="demo-btn">执行校验</button>
        </div>
      </div>
      
      <div class="guide-step" data-step="5">
        <div class="step-icon">📊</div>
        <h3>追踪进度</h3>
        <p>查看页面底部的统计信息，了解你的解题进度和完成率。</p>
        <div class="guide-highlight stats-demo">
          <div class="stat-item">
            <i class="fas fa-trophy"></i>
            <span>总题数: 50</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-check-circle"></i>
            <span>已解决: 5</span>
          </div>
        </div>
      </div>
    </div>
    <div class="guide-footer">
      <div class="step-indicators">
        <span class="indicator active" data-step="1"></span>
        <span class="indicator" data-step="2"></span>
        <span class="indicator" data-step="3"></span>
        <span class="indicator" data-step="4"></span>
        <span class="indicator" data-step="5"></span>
      </div>
      <div class="guide-actions">
        <label class="dont-show-again">
          <input type="checkbox" id="dontShowAgain">
          <span>下次不再显示</span>
        </label>
        <div class="step-buttons">
          <button class="prev-btn" style="display:none">上一步</button>
          <button class="next-btn">下一步</button>
          <button class="finish-btn" style="display:none">完成</button>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="guide-complete-toast" class="toast-notification">
  <i class="fas fa-check-circle"></i>
  <span>引导完成！祝你挑战愉快！</span>
</div>`;

  const guideCSS = `
<style id="guide-styles">
.nav-demo {gap: 0.8rem;font-size: 1.1rem;color: var(--prime);background: rgba(0, 242, 255, 0.08);border: 1px solid rgba(0, 242, 255, 0.4);}
.nav-demo i {font-size: 1.4rem;filter: drop-shadow(0 0 4px var(--prime));}
.modal-overlay{position:fixed;inset:0;background:rgba(13,15,24,.9);backdrop-filter:blur(10px);z-index:9997;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s ease-out}
.guide-modal{background:linear-gradient(135deg,rgba(29,32,47,.95) 0%,rgba(13,15,24,.95) 100%);border:1px solid rgba(0,242,255,.3);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 30px rgba(0,242,255,.2);width:90%;max-width:600px;max-height:80vh;overflow:hidden;animation:slideInUp .5s ease-out}
.guide-header{padding:2rem;text-align:center;border-bottom:1px solid rgba(0,242,255,.2);position:relative}
.guide-header h2{font-size:1.8rem;background:linear-gradient(90deg,var(--prime),var(--second));background-clip:text;-webkit-text-fill-color:transparent;margin:0}
.close-btn{position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--text-dim);font-size:2rem;cursor:pointer;transition:color .3s}
.close-btn:hover{color:var(--prime)}
.guide-content{padding:2rem;min-height:300px}
.guide-step{display:none;text-align:center;animation:fadeIn .5s ease-out}
.guide-step.active{display:block}
.step-icon{font-size:3rem;margin-bottom:1rem;animation:bounce 2s infinite}
.guide-step h3{font-size:1.5rem;color:var(--prime);margin-bottom:1rem}
.guide-step p{color:var(--text-dim);line-height:1.6;margin-bottom:2rem}
.guide-highlight{background:rgba(0,242,255,.1);border:2px solid rgba(0,242,255,.3);border-radius:12px;padding:1.5rem;margin:1.5rem 0;display:flex;justify-content:center;align-items:center}
.demo-select,.demo-input{background:rgba(0,242,255,.1);border:1px solid rgba(0,242,255,.5);border-radius:8px;padding:.75rem 1rem;color:var(--text);font-size:1rem;width:200px}
.demo-btn{background:linear-gradient(135deg,var(--prime),var(--second));border:none;border-radius:8px;padding:.75rem 1.5rem;color:white;font-weight:600;cursor:pointer;transition:transform .3s}
.demo-btn:hover{transform:translateY(-2px)}
.stats-demo{display:flex;gap:2rem;justify-content:center}
.stat-item{display:flex;flex-direction:column;align-items:center;gap:.5rem;color:var(--text-dim)}
.stat-item i{font-size:1.5rem;color:var(--prime)}
.guide-footer{padding:2rem;border-top:1px solid rgba(0,242,255,.2)}
.step-indicators{display:flex;justify-content:center;gap:.5rem;margin-bottom:1.5rem}
.indicator{width:12px;height:12px;border-radius:50%;background:rgba(0,242,255,.3);transition:all .3s;cursor:pointer}
.indicator.active{background:var(--prime);box-shadow:0 0 10px var(--prime)}
.guide-actions{display:flex;justify-content:space-between;align-items:center}
.dont-show-again{display:flex;align-items:center;gap:.5rem;color:var(--text-dim);cursor:pointer}
.dont-show-again input{width:16px;height:16px;accent-color:var(--prime)}
.step-buttons{display:flex;gap:1rem}
.prev-btn,.next-btn,.finish-btn{padding:.75rem 1.5rem;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all .3s}
.prev-btn{background:rgba(255,255,255,.1);color:var(--text)}
.next-btn{background:linear-gradient(135deg,var(--prime),var(--second));color:white}
.finish-btn{background:linear-gradient(135deg,#4CAF50,#8BC34A);color:white}
.prev-btn:hover,.next-btn:hover,.finish-btn:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(0,0,0,.3)}
.toast-notification{position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#4CAF50,#8BC34A);color:white;padding:1rem 1.5rem;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:9998;display:none;align-items:center;gap:.5rem;animation:slideInRight .3s ease-out}
.toast-notification.show{display:flex}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideInRight{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
@keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)}}
</style>`;

  const anchor = document.getElementById('guide-anchor');
  if (anchor) {
    anchor.innerHTML = guideHTML;
    anchor.insertAdjacentHTML('beforeend', guideCSS);
  } else {
    document.head.insertAdjacentHTML('beforeend', guideCSS);
    document.body.insertAdjacentHTML('afterbegin', guideHTML);
  }

  const modal = document.getElementById('newbie-guide-modal');
  const toast = document.getElementById('guide-complete-toast');
  let currentStep = 1;
  const totalSteps = 5;

  modal.querySelector('.close-btn').onclick = () => closeGuide();
  modal.querySelector('.next-btn').onclick = () => nextStep();
  modal.querySelector('.prev-btn').onclick = () => prevStep();
  modal.querySelector('.finish-btn').onclick = () => finishGuide();
  modal.querySelectorAll('.indicator').forEach(ind => {
    ind.onclick = () => goToStep(parseInt(ind.dataset.step, 10));
  });
  document.getElementById('dontShowAgain').onchange = e => {
    if (e.target.checked) localStorage.setItem('ctf-guide-seen', 'true');
    else localStorage.removeItem('ctf-guide-seen');
  };
  document.addEventListener('keydown', e => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'Escape') closeGuide();
    if (e.key === 'ArrowLeft') prevStep();
    if (e.key === 'ArrowRight') currentStep < totalSteps ? nextStep() : finishGuide();
  });

  function showGuide() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateDisplay();
  }
  function closeGuide() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  function finishGuide() {
    closeGuide();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
  function nextStep() {
    if (currentStep < totalSteps) goToStep(currentStep + 1);
  }
  function prevStep() {
    if (currentStep > 1) goToStep(currentStep - 1);
  }
  function goToStep(step) {
    modal.querySelector('.guide-step.active')?.classList.remove('active');
    currentStep = step;
    modal.querySelector(`[data-step="${step}"]`)?.classList.add('active');
    modal.querySelectorAll('.indicator').forEach((ind, idx) =>
      ind.classList.toggle('active', idx + 1 === step)
    );
    modal.querySelector('.prev-btn').style.display = step === 1 ? 'none' : 'block';
    modal.querySelector('.next-btn').style.display = step === totalSteps ? 'none' : 'block';
    modal.querySelector('.finish-btn').style.display = step === totalSteps ? 'block' : 'none';
  }
  function updateDisplay() {
    goToStep(currentStep);
  }

  showGuide();
})();