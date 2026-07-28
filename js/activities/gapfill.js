// Gap Fill Activity
const GapFillActivity = {
    render(container, slide) {
        console.log('GapFillActivity.render called');
        
        if (!slide.text || !slide.answers) {
            console.warn('GapFill: No text or answers provided');
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'activity-container gapfill-activity';
        wrapper.style.margin = '1.5rem 0';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'gapfill-text';
        textDiv.style.lineHeight = '2.5';
        
        let html = slide.text;
        slide.answers.forEach((answer) => {
            html = html.replace(/\{\{[^}]*\}\}/, `<input type="text" class="gapfill-input" data-answer="${answer}" placeholder="..." style="padding:0.3rem 0.5rem;border:2px solid #ddd;border-radius:4px;min-width:100px;margin:0 0.25rem;">`);
        });
        
        textDiv.innerHTML = html.replace(/\n/g, '<br>');
        wrapper.appendChild(textDiv);
        
        // Check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'activity-btn';
        checkBtn.textContent = 'Check Answers';
        checkBtn.style.padding = '0.4rem 1.5rem';
        checkBtn.style.border = 'none';
        checkBtn.style.borderRadius = '4px';
        checkBtn.style.background = '#1a3a5c';
        checkBtn.style.color = 'white';
        checkBtn.style.fontWeight = '600';
        checkBtn.style.cursor = 'pointer';
        checkBtn.style.marginTop = '0.75rem';
        
        checkBtn.addEventListener('click', function() {
            const inputs = wrapper.querySelectorAll('.gapfill-input');
            let correct = 0;
            inputs.forEach(input => {
                const userAnswer = input.value.trim().toLowerCase();
                const correctAnswer = input.dataset.answer.toLowerCase();
                const isCorrect = userAnswer === correctAnswer;
                input.style.borderColor = isCorrect ? '#4caf50' : '#f44336';
                input.style.background = isCorrect ? '#e8f5e9' : '#ffebee';
                if (isCorrect) correct++;
            });
            
            const result = document.createElement('div');
            result.className = 'gapfill-result';
            result.textContent = `${correct} out of ${inputs.length} correct`;
            result.style.marginTop = '1rem';
            result.style.padding = '0.75rem';
            result.style.borderRadius = '4px';
            result.style.background = '#f0f4f8';
            
            const oldResult = wrapper.querySelector('.gapfill-result');
            if (oldResult) oldResult.remove();
            wrapper.appendChild(result);
        });
        
        wrapper.appendChild(checkBtn);
        container.appendChild(wrapper);
        
        console.log('GapFillActivity rendered successfully');
    }
};

console.log('GapFillActivity loaded');
