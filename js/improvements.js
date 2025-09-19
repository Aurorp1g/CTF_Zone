// ===== 本地存储键 =====
const STORAGE_KEYS = {
    TOTAL_PROBLEMS: 'ctf_total_problems',
    SOLVED_LIST:    'ctf_solved_list'
};

// ===== 工具：数值动画 =====
function animateValue(el, start, end, duration, suffix = '') {
    if (!el) return;
    const range = end - start;
    const inc   = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += inc;
        if ((inc > 0 && current >= end) || (inc < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ===== 统计：从本地存储读取 =====
function initStats() {
    const totalEl   = document.getElementById('totalProblems');
    const solvedEl  = document.getElementById('solvedProblems');
    const rateEl    = document.getElementById('completionRate');
    if (!totalEl || !solvedEl || !rateEl) return;

    const total   = getTotalProblems();
    const solved  = getSolvedProblems();
    const rate    = total ? Math.round((solved / total) * 100) : 0;

    animateValue(totalEl,  0, total,  2000);
    animateValue(solvedEl, 0, solved, 2000);
    animateValue(rateEl,   0, rate,   2000, '%');
}

// ===== 总题数 =====
function getTotalProblems() {
    // 若 cA 已加载，用其大小；否则用本地存储或默认值 50
    if (typeof cA !== 'undefined' && cA instanceof Map) return cA.size;
    return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_PROBLEMS)) || 50;
}

// ===== 已解题数 =====
function getSolvedProblems() {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLVED_LIST) || '[]');
    return list.length;
}

// ===== 已解决列表 =====
function getSolvedList() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLVED_LIST) || '[]');
}

// ===== 标记题目为已解决 =====
function markProblemAsSolved(id) {
    const list = getSolvedList();
    if (list.includes(id)) return false;
    list.push(id);
    localStorage.setItem(STORAGE_KEYS.SOLVED_LIST, JSON.stringify(list));
    updateStatsDisplay();
    return true;
}

// ===== 更新统计面板 =====
function updateStatsDisplay() {
    const solvedEl = document.getElementById('solvedProblems');
    const rateEl   = document.getElementById('completionRate');
    if (!solvedEl || !rateEl) return;

    const total  = getTotalProblems();
    const solved = getSolvedProblems();
    const rate   = total ? Math.round((solved / total) * 100) : 0;

    animateValue(solvedEl, parseInt(solvedEl.textContent) || 0, solved, 1000);
    animateValue(rateEl,   parseInt(rateEl.textContent)   || 0, rate,   1000, '%');
}

// ===== 清空输入 =====
function clearInput() {
    document.getElementById('userInput').value = '';
    document.getElementById('result').innerHTML = '';
}

// 显示提示
function showHint() {
    const hints = [
        '💡 检查输入格式是否正确',
        '💡 flag 通常以 CTF{...} 格式出现',
        '💡 注意大小写敏感',
        '💡 确认是否选择了正确的题目'
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = `
        <div class="info">
            <i class="fas fa-info-circle"></i>
            ${randomHint}
        </div>
    `;
}

// 添加信息样式
const style = document.createElement('style');
style.textContent = `
    .info {
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInUp 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initStats();
    // 输入框焦点效果
    document.querySelectorAll('input,select').forEach(el => {
        el.addEventListener('focus', () => el.parentElement.style.transform = 'scale(1.02)');
        el.addEventListener('blur',  () => el.parentElement.style.transform = 'scale(1)');
    });
});

// ===== 键盘快捷键 =====
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'k') { e.preventDefault(); clearInput(); }
    if (e.ctrlKey && e.key === 'h') { e.preventDefault(); showHint(); }
});