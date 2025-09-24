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
  { min: 0,   max: 4,   text: '刚起步，别急，慢慢来~',         color: '#ff00c1' },
  { min: 5,   max: 9,   text: '已经动起来了，不错哟',           color: '#f200cb' },
  { min: 10,  max: 14,  text: '手感开始有了，继续继续',         color: '#e600d6' },
  { min: 15,  max: 19,  text: '节奏慢慢对上了，保持住',         color: '#d900e0' },
  { min: 20,  max: 24,  text: '五分之一啦，状态开始上来',       color: '#00f2ff' },
  { min: 25,  max: 29,  text: '四分之一达成，感觉越来越顺',     color: '#00e0f0' },
  { min: 30,  max: 34,  text: '三分天下已有其一！',         color: '#00cce0' },
  { min: 35,  max: 39,  text: '三分关口，速度开始稳了',          color: '#00b8d0' },
  { min: 40,  max: 44,  text: '四成入手，开始有点上头',         color: '#4facfe' },
  { min: 45,  max: 49,  text: '快过半了，别松劲，再冲一波',     color: '#3a9cfc' },
  { min: 50,  max: 54,  text: '过半啦！可以稍微喘口气，但别停', color: '#2688fc' },
  { min: 55,  max: 59,  text: '五五关卡，手感已经热起来了',     color: '#1a7cfc' },
  { min: 60,  max: 64,  text: '六成到手，大佬请收下我的膝盖',   color: '#f093fb' },
  { min: 65,  max: 69,  text: '六五节点，思路开始清晰得发光',   color: '#e683f9' },
  { min: 70,  max: 74,  text: '七成进度，进度条开始发光',     color: '#da73f7' },
  { min: 75,  max: 79,  text: '七五关口，开始感受到收尾的节奏', color: '#cc63f5' },
  { min: 80,  max: 84,  text: '八成达成，开始有点不舍得了',     color: '#fa709a' },
  { min: 85,  max: 89,  text: '八五节点，手指开始不自觉加速',   color: '#f8608c' },
  { min: 90,  max: 94,  text: '九成！封神之路近在咫尺！',   color: '#ff507c' },
  { min: 95,  max: 99,  text: '只差临门一脚，金色传说在招手',         color: '#ff406c' },
  { min: 100, max: 100, text: '全收集达成！你就是这个站的神！',       color: '#ffd700' }
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