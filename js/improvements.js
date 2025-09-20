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
    showEncourageEasterEgg();
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

let lastHintIndex = -1; 
function showHint() {
    const hints = [
        '💡 检查输入格式是否正确',
        '💡 flag 通常以 flag{...} 格式出现',
        '💡 注意大小写敏感',
        '💡 确认是否选择了正确的题目'
    ];

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * hints.length);
    } while (randomIndex === lastHintIndex);

    lastHintIndex = randomIndex; 
    const randomHint = hints[randomIndex];

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

function showEncourageEasterEgg() {
  const rate = getCompletionRate();          
  if (rate === null) return;                 
  const cfg = encourageCfg(rate);            
  if (!cfg) return;                          

  showEncourageModal(cfg);

  launchStarRain(cfg.color);

  if (rate === 100) launchFireworks();
}

const ENCOURAGE_MAP = [
  { min: 0,   max: 19, text: '万事开头难，继续冲！',        color: '#ff00c1' },
  { min: 20,  max: 39, text: '节奏不错，保持住~',          color: '#00f2ff' },
  { min: 40,  max: 59, text: '已经过半，胜利在望！',        color: '#4facfe' },
  { min: 60,  max: 79, text: '大佬请收下我的膝盖！',        color: '#f093fb' },
  { min: 80,  max: 99, text: '封神之路近在咫尺！',          color: '#fa709a' },
  { min: 100, max: 100, text: '全收集达成！你就是CTF之神！', color: '#ffd700' }
];
let lastRate = -1;
function encourageCfg(rate) {
  if (rate === lastRate) return null;
  lastRate = rate;
  return ENCOURAGE_MAP.find(o => rate >= o.min && rate <= o.max);
}
function getCompletionRate() {
  const total = getTotalProblems();
  if (!total) return null;
  return Math.round((getSolvedProblems() / total) * 100);
}

function showEncourageModal({ text, color }) {
  const exist = document.getElementById('encourage-modal');
  if (exist) exist.remove();

  const dom = document.createElement('div');
  dom.id = 'encourage-modal';
  dom.innerHTML = `
    <div class="encourage-box">
      <div class="encourage-header"><h3>彩蛋来袭</h3></div>
      <div class="encourage-body"><p>${text}</p></div>
    </div>`;
  document.body.appendChild(dom);

  const style = document.createElement('style');
  style.textContent = `
    #encourage-modal{
      position:fixed;inset:0;
      display:flex;align-items:center;justify-content:center;
      z-index:3500;animation:fadeIn .3s ease
    }
    #encourage-modal.hidden{display:none}
    .encourage-box{
      width:90%;max-width:420px;
        background: #000;
        border:1px solid rgba(0,242,255,.25);
        border-radius:var(--r);
        box-shadow:var(--shadow),var(--glow);
        display:flex;
        flex-direction:column;
        overflow:hidden;
      animation:zoomIn .3s ease
    }
    .encourage-header{
      padding:1rem 1.25rem;
      background:rgba(0,242,255,.08);
      display:flex;align-items:center;justify-content:center
    }
    .encourage-header h3{font-size:1.1rem;font-weight:600;letter-spacing:.5px;margin:0}
    .encourage-body{
      flex:1;padding:1.5rem 1.25rem;
      text-align:center;font-size:1rem;font-weight:600;color:${color}
    }
    @keyframes fadeIn{from{opacity:0}}
    @keyframes zoomIn{from{transform:scale(.95)}}
  `;
  document.head.appendChild(style);

  setTimeout(() => dom.remove(), 4000);
}

function launchStarRain(color) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 3100;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * -h,
    size: Math.random() * 3 + 4,
    speed: Math.random() * 3 + 2,
    rot: Math.random() * 360,
    rotSpeed: Math.random() * 4 - 2
  }));

  function drawStar(cx, cy, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(0, -r);
      ctx.rotate(Math.PI / 4);
      ctx.lineTo(0, -r * 0.5);
      ctx.rotate(Math.PI / 4);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    let active = false;
    stars.forEach(s => {
      s.y += s.speed;
      s.rot += s.rotSpeed;
      if (s.y < h + 20) {
        active = true;
        drawStar(s.x, s.y, s.size, s.rot);
      }
    });
    if (active) requestAnimationFrame(animate);
    else canvas.remove();
  }
  animate();
}

function launchFireworks() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3200';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const rockets = [];
  const colors = ['#00f2ff', '#ff00c1', '#ffd700', '#4facfe', '#fa709a'];

  class Rocket {
    constructor() {
      this.x = Math.random() * w;
      this.y = h;                      
      this.vy = -(Math.random() * 4 + 6); 
      this.targetY = Math.random() * h * 0.4 + 100; 
      this.exploded = false;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      if (this.exploded) return;
      this.y += this.vy;
      if (this.y <= this.targetY) {
        this.explode();   
        this.exploded = true;
      }
    }
    draw() {
      if (this.exploded) return;
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    explode() {
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.color = color;
      this.g = 0.08; 
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.g;
      this.alpha -= 0.015;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let frame;
  (function animate() {
    ctx.clearRect(0, 0, w, h);

    if (Math.random() < 0.05) rockets.push(new Rocket());

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      r.draw();
      if (r.exploded) rockets.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(i, 1);
    }

    frame = requestAnimationFrame(animate);
  })();

  setTimeout(() => {
    cancelAnimationFrame(frame);
    canvas.remove();
  }, 10000);
}