function initQuestionSelect() {
  const select=document.getElementById('questionSelect');
  select.innerHTML='<option value="">请选择题目</option>';
  Array.from(cA.keys()).forEach(id=>{
    const o=document.createElement('option');o.value=id;o.textContent=id;select.appendChild(o);
  });
}
function handleEnter(e){if(e.keyCode===13){validateData();e.preventDefault();}}
document.addEventListener('DOMContentLoaded',initQuestionSelect);

async function validateData(){
  const q=document.getElementById('questionSelect').value;
  const v=document.getElementById('userInput').value.trim();
  if(!q&&bm(v)==='Ku/DQgCilKPMfbgbQ6gYcw'){
    const t=document.createElement('div');
    t.style='position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:15px;background:#4CAF50;color:white;border-radius:5px;z-index: 1001;';
    t.innerHTML='🎉 管理员模式已激活，正在跳转...';
    document.body.appendChild(t);
    setTimeout(()=>location.href='html/encode.html',2000);
    return;
  }
  const r=document.getElementById('result');
  if(!q){r.innerHTML='<div class="error">⚠ 请选择要校验的题目</div>';return;}
  if(!v){r.innerHTML='<div class="error">⚠ 请输入解题结果</div>';return;}
  try{
    const h=bm(v),ok=cA.get(q);
    r.innerHTML=h===ok?'<div class="success">✅ 校验通过！flag正确</div>':'<div class="error">❌ flag错误</div>';
  }catch(e){r.innerHTML='<div class="error">⚠ 处理错误：'+(e.message||'无效输入')+'</div>';}
}