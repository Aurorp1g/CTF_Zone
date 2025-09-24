function initQuestionSelect() {
  const select=document.getElementById('questionSelect');
  select.innerHTML='<option value="">请选择题目</option>';
  Array.from(cA.keys()).forEach(id=>{
    const o=document.createElement('option');o.value=id;o.textContent=id;select.appendChild(o);
  });
}

function handleEnter(e){if(e.keyCode===13){validateData();e.preventDefault();}}

document.addEventListener('DOMContentLoaded',initQuestionSelect);

document.addEventListener('DOMContentLoaded', () => {
    initQuestionSelect();
});

function showLoading() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="loading-container">
            <div class="loading"></div><span>正在验证...</span>
        </div>`;
}

(() => {
function markProblemAsSolved(id) {
    const list = getSolvedList();
    if (list.includes(id)) return false;
    list.push(id);
    localStorage.setItem(STORAGE_KEYS.SOLVED_LIST, JSON.stringify(list));
    updateStatsDisplay();
    showEncourageEasterEgg();
    return true;
}
window.validateData = async function () {
    const q = document.getElementById('questionSelect').value.trim();
    const v = document.getElementById('userInput').value.trim();
    const r = document.getElementById('result');

    if (!q && bm(v) === 'Ku/DQgCilKPMfbgbQ6gYcw') {
        window.showAdminMode();
        return;
    }

    window.showLoading();

    setTimeout(() => {
        if (!q) { r.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> 请选择要校验的题目</div>'; return; }
        if (!v) { r.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> 请输入解题结果</div>'; return; }

        try {
            const h  = bm(v);
            const ok = cA.get(q);
            if (h === ok) {
                const isNew = markProblemAsSolved(q);
                r.innerHTML = `
                    <div class="success">
                        <i class="fas fa-check-circle"></i>
                        <div><strong>验证成功！</strong><p>flag正确，恭喜解题成功！${isNew ? ' (新解锁)' : ''}</p></div>
                    </div>`;
                if (isNew) window.showToast('🎉 完成新题目！');
                window.initQuestionSelect();
            } else {
                r.innerHTML = `
                    <div class="error">
                        <i class="fas fa-times-circle"></i>
                        <div><strong>验证失败</strong><p>flag错误，请重新检查</p></div>
                    </div>`;
            }
        } catch (e) {
            r.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> 处理错误：${e.message || '无效输入'}</div>`;
        }
    }, 500);
};
})();


function showAdminMode() {
    const t = document.createElement('div');
    t.className = 'admin-notification';
    t.innerHTML = `
        <div class="admin-content">
            <i class="fas fa-crown"></i>
            <h3>管理员模式已激活</h3>
            <p style="text-align: center; margin: 20px auto;">正在跳转...</p>
        </div>
    `;
    document.body.appendChild(t);
    
    setTimeout(() => {
        location.href = 'html/encode.html?key=Ku/DQgCilKPMfbgbQ6gYcw';
    }, 2000);
}

const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .loading-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(0, 242, 255, 0.1);
        border-radius: 12px;
        animation: slideInUp 0.5s ease-out;
    }
    
    .admin-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 2000;
        animation: adminAppear 0.5s ease-out;
    }
    
    .admin-content {
        text-align: center;
        color: white;
    }
    
    .admin-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
        animation: crownGlow 1s ease-in-out infinite alternate;
    }
    
    @keyframes adminAppear {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes crownGlow {
        from { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
        to { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); }
    }
`;
document.head.appendChild(loadingStyle);

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML  = `<i class="fas fa-check-circle"></i>${msg}`;
    const style = document.createElement('style');
    style.textContent = `
        .toast{position:fixed;top:20px;right:20px;padding:1rem 1.5rem;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:2000;animation:slideInRight .3s ease-out;display:flex;align-items:center;gap:.5rem}
        @keyframes slideInRight{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
    `;
    if (!document.querySelector('#toast-style')) { style.id = 'toast-style'; document.head.appendChild(style); }
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideInRight .3s ease-out reverse'; setTimeout(() => toast.remove(), 300); }, 2500);
}

function installSolvedCardModal() {
    const modal = document.createElement('div');
    modal.id = 'solved-modal';
    modal.className = 'hidden';
    modal.innerHTML = `
        <div class="solved-box">
        <div class="solved-header">
            <h3>已解决题目</h3>
            <span class="solved-close">&times;</span>
        </div>
        <div class="solved-body"></div>
        </div>`;
    document.body.appendChild(modal);

    const style = document.createElement('style');
    style.textContent = `
    #solved-modal{
    position:fixed;
    inset:0;
    background:rgba(13,15,24,.75);
    backdrop-filter:blur(12px);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:3000;
    animation:fadeIn .3s ease;
    }
    #solved-modal.hidden{display:none}

    .solved-box{
    width:90%;
    max-width:420px;
    max-height:70vh;
    background:var(--bg-card);
    border:1px solid rgba(0,242,255,.25);
    border-radius:var(--r);
    box-shadow:var(--shadow),var(--glow);
    display:flex;
    flex-direction:column;
    overflow:hidden;
    animation:zoomIn .3s ease;
    }

    .solved-header{
    padding:1rem 1.25rem;
    background:rgba(0,242,255,.08);
    display:flex;
    align-items:center;
    justify-content:space-between;
    }
    .solved-header h3{
    font-size:1.1rem;
    font-weight:600;
    letter-spacing:.5px;
    }
    .solved-close{
    cursor:pointer;
    font-size:1.5rem;
    color:var(--text-dim);
    transition:color .2s;
    }
    .solved-close:hover{color:var(--prime)}

    .solved-body{
    flex:1;
    overflow-y:auto;
    padding:1rem 1.25rem 1.25rem;
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(90px,1fr));
    gap:.75rem;
    }
    .solved-tag{
    position:relative;
    background:linear-gradient(135deg,rgba(0,242,255,.12) 0%, rgba(255,0,193,.12) 100%);
    border:1px solid rgba(0,242,255,.25);
    border-radius:calc(var(--r)/2);
    padding:.5rem 0;
    text-align:center;
    font-size:.9rem;
    font-weight:500;
    color:var(--prime);
    transition:transform .2s, box-shadow .2s;
    }
    .solved-tag:hover{
    transform:translateY(-2px);
    box-shadow:0 0 10px var(--prime);
    }

    .solved-empty{
    grid-column:1/-1;
    text-align:center;
    color:var(--text-dim);
    font-size:.9rem;
    }

    @keyframes fadeIn{from{opacity:0}}
    @keyframes zoomIn{from{transform:scale(.95)}}

    #solvedProblems.closest('.stat-card'){
    cursor:pointer;
    transition:transform .2s, box-shadow .2s;
    }
    #solvedProblems.closest('.stat-card'):hover{
    transform:translateY(-3px);
    box-shadow:0 0 15px var(--prime);
    }
    `;
    document.head.appendChild(style);

    const solvedCard = document.querySelector('#solvedProblems')?.closest('.stat-card');
    if (!solvedCard) return;
    solvedCard.style.cursor = 'pointer';

    solvedCard.addEventListener('click', () => {
        const list = getSolvedList().sort();
        const body = modal.querySelector('.solved-body');
        body.innerHTML = list.length
        ? list.map(id => `<div class="solved-tag">${id}</div>`).join('')
        : '<div style="color:#666;text-align:center;width:100%">暂无记录</div>';
        modal.classList.remove('hidden');
    });

    modal.querySelector('.solved-close').addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
}
document.addEventListener('DOMContentLoaded', installSolvedCardModal);