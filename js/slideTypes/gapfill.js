// Gap Fill Activity
const GapFillActivity = {
    render(container, slide) {
        if (!slide.text || !slide.answers) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'activity-container gapfill-activity';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'gapfill-text';
        textDiv.style.lineHeight = '2.5';
        
        let html = slide.text;
        slide.answers.forEach((answer, index) => {
            html = html.replace(/\{\{[^}]*\}\}/, `
                <input type="text" 
                       class="gapfill-input" 
                       data-answer="${answer}" 
                       placeholder="..." 
                       style="padding:0.3rem 0.5rem;border:2px solid #ddd;border-radius:4px;min-width:100px;margin:0 0.25rem;">
            `);
        });
        
        textDiv.innerHTML = html.replace(/\n/g, '<br>');
        wrapper.appendChild(textDiv);
        
        // Check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'activity-btn';
        checkBtn.textContent = 'Check Answers';
        checkBtn.addEventListener('click', () => this.checkAnswers(wrapper));
        wrapper.appendChild(checkBtn);
        
        container.appendChild(wrapper);
    },
    
    checkAnswers(wrapper) {
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
        
        // Show result
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
    }
};
