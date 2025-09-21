(()=>{
    if(sessionStorage.getItem('bootDone')){
    document.getElementById('boot').remove();
    return;
    }

    const term  = document.querySelector('.term');
    const raw = [
    'CTF Zone 初始化',
    'Copyright \u00A9 2025 Aurorp1g',
    '',
    '正在检查环境... 环境可用 [OK]',
    '',
    '>> 正在加载赛博空间...',
    '>> 题目矩阵载入进度... 100%',
    '>> 初始化完成，欢迎白帽',
    '',
    '>> 加密模块  ............... [OK]',
    '>> Flag 验证服务已就绪',
    '>> 祝你玩得开心！'
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
    sessionStorage.setItem('bootDone', '1');
    setTimeout(()=>document.getElementById('boot').remove(), 1000);
    }
    }
    type();
})();