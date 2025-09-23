const STORAGE_KEYS = { SOLVED_LIST: 'ctf_solved_list' };
const getSolvedList = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SOLVED_LIST) || '[]');
const getTotal = () => (typeof cA !== 'undefined' && cA instanceof Map ? cA.size : 50);

function renderTimeline() {
    const list = getSolvedList();
    const total = getTotal();
    const solved = list.length;
    const rate = total ? Math.round((solved / total) * 100) : 0;

    ['total', 'solved', 'rate'].forEach(id => document.getElementById(id).textContent = id === 'rate' ? rate + '%' : (id === 'total' ? total : solved));

    const box = document.getElementById('timeline');
    if (!solved) {
    box.innerHTML = `<div class="empty"><i class="fas fa-box-open"></i><p>暂无记录，快去解题吧！</p></div>`;
    return;
    }
    const now = Date.now();
    box.innerHTML = list.map((id, i) => {
    const ts = new Date(now - (solved - i) * 3 * 60 * 1000);
    return `
        <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <i class="timeline-icon fas fa-flag"></i>
            <div class="timeline-body">
            <div class="timeline-title">${id}</div>
            <div class="timeline-time">${ts.toLocaleString('zh-CN')}</div>
            </div>
        </div>
        </div>`;
    }).join('');
}

function openCyberPoster(){
  const cv = document.getElementById('cyberCanvas');
  drawCyber(cv);
  document.getElementById('cyberModal').style.display = 'flex';
}
function closeCyberPoster(){
  document.getElementById('cyberModal').style.display = 'none';
}

function drawCyber(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
    const rate = parseInt(document.getElementById('rate').textContent);

   const img = new Image();
   img.src = '../assets/Cyber.webp';
   img.onload = function () {
    ctx.drawImage(img, 0, 0, w, h);



    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 38px "Century Gothic"';
    ctx.fillText('CTF Zone', w/12, h/8);
    ctx.font = '25px "SimSun"';
    ctx.fillStyle = '#e0e6f0';
    ctx.fillText('战绩时光机', w/12, h/8+50);

    const cardX = 700, cardY = 180, cardW = 420, cardH = 200;
    ctx.fillStyle = 'rgba(29,32,47,.55)';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = 'rgba(0,242,255,.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    const solved = getSolvedList().length;
    ctx.fillStyle = '#00f2ff';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(solved, cardX + cardW / 2, cardY + 70);
    ctx.font = '24px Inter';
    ctx.fillStyle = '#e0e6f0';
    ctx.fillText('题已破解', cardX + cardW / 2, cardY + 100);
    ctx.fillStyle = 'rgba(224,230,240,.8)';
    ctx.fillText(`完成率 ${rate}%`, cardX + cardW / 2, cardY + 140);

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.font = 'italic 28px Georgia';
    ctx.strokeText('Keep hacking, keep shining.', 4*w/5, 11*h/12);
    ctx.fillText('Keep hacking, keep shining.', 4*w/5, 11*h/12);
  };
}

function downloadCyber(){
  document.getElementById('cyberCanvas').toBlob(blob=>{
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'CTF-Zone-赛博战绩.png';
    a.click();
  });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTimeline();
});