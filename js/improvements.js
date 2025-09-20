const STORAGE_KEYS = {
    TOTAL_PROBLEMS: 'ctf_total_problems',
    SOLVED_LIST:    'ctf_solved_list'
};

const animTimers = new Map(); 

function animateValue(el, start, end, duration, suffix = '') {
    if (!el) return;

    if (animTimers.has(el)) {
        clearInterval(animTimers.get(el));
        animTimers.delete(el);
    }

    const range = end - start;
    const inc   = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += inc;
        if ((inc > 0 && current >= end) || (inc < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
            animTimers.delete(el); 
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);

    animTimers.set(el, timer); 
}

function initStats() {
    const totalEl   = document.getElementById('totalProblems');
    const solvedEl  = document.getElementById('solvedProblems');
    const rateEl    = document.getElementById('completionRate');
    if (!totalEl || !solvedEl || !rateEl) return;

    const total   = getTotalProblems();
    const solved  = getSolvedProblems();
    const rate    = total ? Math.round((solved / total) * 100) : 0;

    animateValue(totalEl,  0, total,  300);
    animateValue(solvedEl, 0, solved, 300);
    animateValue(rateEl,   0, rate,   300, '%');
}

function getTotalProblems() {
    if (typeof cA !== 'undefined' && cA instanceof Map) return cA.size;
    return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_PROBLEMS)) || 50;
}

function getSolvedProblems() {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLVED_LIST) || '[]');
    return list.length;
}

function getSolvedList() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLVED_LIST) || '[]');
}

function markProblemAsSolved(id) {
    const list = getSolvedList();
    if (list.includes(id)) return false;
    list.push(id);
    localStorage.setItem(STORAGE_KEYS.SOLVED_LIST, JSON.stringify(list));
    updateStatsDisplay();
    return true;
}

function updateStatsDisplay() {
    const solvedEl = document.getElementById('solvedProblems');
    const rateEl   = document.getElementById('completionRate');
    if (!solvedEl || !rateEl) return;

    const total  = getTotalProblems();
    const solved = getSolvedProblems();
    const rate   = total ? Math.round((solved / total) * 100) : 0;

    animateValue(solvedEl, parseInt(solvedEl.textContent) || 0, solved, 500);
    animateValue(rateEl,   parseInt(rateEl.textContent)   || 0, rate,   500, '%');
}

function clearInput() {
    document.getElementById('userInput').value = '';
    document.getElementById('result').innerHTML = '';
}

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

document.addEventListener('DOMContentLoaded', () => {
    initStats();
    document.querySelectorAll('input,select').forEach(el => {
        el.addEventListener('focus', () => el.parentElement.style.transform = 'scale(1.02)');
        el.addEventListener('blur',  () => el.parentElement.style.transform = 'scale(1)');
    });
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'k') { e.preventDefault(); clearInput(); }
    if (e.ctrlKey && e.key === 'h') { e.preventDefault(); showHint(); }
});