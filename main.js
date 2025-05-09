function initQuestionSelect() {
    const select = document.getElementById('questionSelect');
    select.innerHTML = '<option value="">请选择题目</option>';
    
    Array.from(cA.keys()).forEach(questionId => {
        const option = document.createElement('option');
        option.value = questionId;
        option.textContent = questionId;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', initQuestionSelect);

async function validateData() {
    const question = document.getElementById('questionSelect').value;
    const userInput = document.getElementById('userInput').value.trim();
    
    if (!question && bm(userInput) === 'uvQFGbfhKG/WvDL7is4pUg') {
        const tip = document.createElement('div');
        tip.style = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:15px;background:#4CAF50;color:white;border-radius:5px;';
        tip.innerHTML = '🎉 管理员模式已激活，正在跳转...';
        document.body.appendChild(tip);
        
        setTimeout(() => {
            window.location.href = 'encode.html';
        }, 2000);
        return;
    }
    const resultDiv = document.getElementById('result');
    
    if (!question) {
        resultDiv.innerHTML = `<div class="error">⚠ 请选择要校验的题目</div>`;
        return;
    }
    if (!userInput) {
        resultDiv.innerHTML = `<div class="error">⚠ 请输入解题结果</div>`;
        return;
    }

    try {
        const s = bm(userInput);
        const correctHash = cA.get(question);
        
        if (s === correctHash) {
            resultDiv.innerHTML = `
                <div class="success">
                    ✅ 校验通过！flag正确
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="error">
                    ❌ flag错误
                </div>
            `;
        }
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error">
                ⚠ 处理错误：${error.message || '无效输入'}
            </div>
        `;
    }
}
