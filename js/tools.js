function handleEnter(e){if(e.keyCode===13){validateData();e.preventDefault();}}

async function validateData(){
    const userInput = document.getElementById('userInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!userInput) {
        resultDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> 请输入需要加密的内容</div>`;
        return;
    }

    showLoading(); 
    setTimeout(()=>{
        try{
            const bmResult = bm(userInput);
            resultDiv.innerHTML = `
                <div class="success">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>哈希生成完成</strong>
                        <div class="hash-display">${bmResult}</div>
                    </div>
                </div>`;
            window.lastHash = bmResult; 
        }catch(error){
            resultDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> 处理错误：${error.message||'无效输入'}</div>`;
        }
    },500);
}

function showLoading(){
    const resultDiv=document.getElementById('result');
    resultDiv.innerHTML=`
        <div class="loading-container">
            <div class="loading"></div><span>正在计算...</span>
        </div>`;
}
function clearInput(){
    document.getElementById('userInput').value='';
    document.getElementById('result').innerHTML='';
}
function copyHash(){
    if(window.lastHash){
        navigator.clipboard.writeText(window.lastHash).then(()=>{
            const toast=document.createElement('div');toast.className='toast';
                style.textContent = `
                    .toast{position:fixed;top:20px;right:20px;padding:1rem 1.5rem;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:2000;animation:slideInRight .3s ease-out;display:flex;align-items:center;gap:.5rem}
                    @keyframes slideInRight{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
                `;
            toast.innerHTML='<i class="fas fa-copy"></i> 已复制到剪贴板';
            document.body.appendChild(toast);
            setTimeout(()=>toast.remove(),2000);
        });
    }
}
function clearSolvedList() {
    if (!confirm('⚠️ 确定要清空所有解题进度吗？\n（操作不可恢复）')) return;

    localStorage.removeItem('ctf_solved_list');

    const solvedEl = parent.document?.getElementById('solvedProblems');
    const rateEl   = parent.document?.getElementById('completionRate');
    if (solvedEl) solvedEl.textContent = '0';
    if (rateEl)   rateEl.textContent   = '0%';

    const toast = document.createElement('div');
    toast.className = 'toast toast-warn';
    toast.innerHTML = '<i class="fas fa-check"></i> 解题进度已清空';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

const style = document.createElement('style');
style.textContent = `
.admin-danger{
    background: linear-gradient(135deg,#fa709a 0%,#fee140 100%);
    color: #fff;
}
.admin-danger:hover{
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(250, 112, 154, .4);
}
.toast-warn{
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg,#fa709a 0%,#fee140 100%);
    color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,.3);
    z-index: 2000;
    animation: slideInRight .3s ease-out;
    display: flex;
    align-items: center;
    gap: .5rem;
}
@keyframes slideInRight{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
`;
document.head.appendChild(style);

function clearLocalCache() {
    if (!confirm('⚠️ 确定要清空所有本地缓存吗？\n（操作不可恢复）')) return;

    localStorage.removeItem('ctf-guide-seen'); 
    localStorage.removeItem('bootDone'); 

    const toast = document.createElement('div');
    toast.className = 'toast toast-warn';
    toast.innerHTML = '<i class="fas fa-check"></i> 本地缓存已清空';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

const cacheStyle = document.createElement('style');
cacheStyle.textContent = `
.cache-danger{
    background: linear-gradient(135deg,#ff4b4b 0%,#ff8e53 100%);
    color: #fff;
}
.cache-danger:hover{
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(250, 112, 154, .4);
}
.cache-toast{
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg,#fa709a 0%,#fee140 100%);
    color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,.3);
    z-index: 2000;
    animation: pulseWarn 1.5s infinite;
    display: flex;
    align-items: center;
    gap: .5rem;
}
@keyframes slideInRight{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}
`;
document.head.appendChild(cacheStyle);
