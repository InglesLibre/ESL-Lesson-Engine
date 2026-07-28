// Gap Fill Activity Engine
const GapFillActivity = {
    answers: {},
    
    render(container, text, answers) {
        this.answers = answers;
        const textDiv = document.createElement('div');
        textDiv.className = 'gap-fill-text';
        
        // Process text with placeholders {{word}}
        const parts = text.split(/\{\{([^}]+)\}\}/g);
        let answerIndex = 0;
        
        parts.forEach((part, i) => {
            if (i % 2 === 0) {
                // Plain text
                if (part) {
                    const span = document.createElement('span');
                    span.textContent = part;
                    textDiv.appendChild(span);
                }
            } else {
                // Gap
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'gap-fill-input';
                input.dataset.index = answerIndex;
                input.dataset.answer = answers[answerIndex] || '';
                input.placeholder = '...';
                input.id = `gap_${answerIndex}`;
                
                // Check answer when user blurs
                input.addEventListener('blur', () => {
                    this.checkAnswer(input);
                });
                
                // Check answer when Enter key pressed
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.checkAnswer(input);
                        // Move to next input
                        const inputs = textDiv.querySelectorAll('.gap-fill-input');
                        const currentIndex = Array.from(inputs).indexOf(input);
                        if (currentIndex < inputs.length - 1) {
                            inputs[currentIndex + 1].focus();
                        }
                    }
                });
                
                textDiv.appendChild(input);
                answerIndex++;
            }
        });
        
        container.appendChild(textDiv);
        
        // Add check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'nav-btn';
        checkBtn.textContent = 'Check All Answers';
        checkBtn.addEventListener('click', () => this.checkAllAnswers(textDiv));
        container.appendChild(checkBtn);
        
        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'nav-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginLeft = '0.5rem';
        resetBtn.addEventListener('click', () => this.reset(textDiv));
        container.appendChild(resetBtn);
    },
    
    checkAnswer(input) {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer.toLowerCase();
        const isCorrect = userAnswer === correctAnswer;
        
        // Remove existing classes
        input.classList.remove('correct', 'incorrect', 'hint');
        
        if (isCorrect) {
            input.classList.add('correct');
            input.disabled = true;
        } else {
            input.classList.add('incorrect');
            // Add hint after a moment
            setTimeout(() => {
                if (!input.disabled) {
                    input.classList.add('hint');
                    input.placeholder = `Hint: ${input.dataset.answer.charAt(0)}...`;
                }
            }, 1500);
        }
        
        // Save progress
        this.saveProgress(input);
    },
    
    checkAllAnswers(container) {
        const inputs = container.querySelectorAll('.gap-fill-input');
        let correctCount = 0;
        let totalCount = inputs.length;
        
        inputs.forEach(input => {
            if (input.disabled && input.classList.contains('correct')) {
                correctCount++;
            } else if (!input.disabled) {
                this.checkAnswer(input);
            }
        });
        
        // Show results
        const resultDiv = document.createElement('div');
        resultDiv.className = 'gap-fill-results';
        resultDiv.style.marginTop = '1rem';
        resultDiv.style.padding = '1rem';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.background = 'var(--bg-light)';
        resultDiv.innerHTML = `
            <strong>Results:</strong> ${correctCount} out of ${totalCount} correct
            ${correctCount === totalCount ? ' - Perfect!' : ''}
        `;
        
        // Remove old results
        const oldResults = container.querySelector('.gap-fill-results');
        if (oldResults) oldResults.remove();
        container.appendChild(resultDiv);
    },
    
    reset(container) {
        const inputs = container.querySelectorAll('.gap-fill-input');
        inputs.forEach(input => {
            input.value = '';
            input.className = 'gap-fill-input';
            input.disabled = false;
            input.placeholder = '...';
        });
        
        // Remove results
        const results = container.querySelector('.gap-fill-results');
        if (results) results.remove();
    },
    
    saveProgress(input) {
        const container = input.closest('.gap-fill-text');
        const inputs = container.querySelectorAll('.gap-fill-input');
        const progress = [];
        inputs.forEach(inp => {
            progress.push({
                value: inp.value,
                disabled: inp.disabled,
                correct: inp.classList.contains('correct')
            });
        });
        
        // Save to localStorage
        const lessonId = App.currentLesson;
        if (lessonId) {
            const saved = Storage.loadProgress(lessonId) || {};
            saved.gapFillProgress = progress;
            Storage.saveProgress(lessonId, saved);
        }
    },
    
    loadProgress(container) {
        const lessonId = App.currentLesson;
        if (!lessonId) return;
        
        const saved = Storage.loadProgress(lessonId);
        if (saved && saved.gapFillProgress) {
            const inputs = container.querySelectorAll('.gap-fill-input');
            saved.gapFillProgress.forEach((data, index) => {
                if (inputs[index]) {
                    inputs[index].value = data.value;
                    if (data.disabled) {
                        inputs[index].disabled = true;
                        inputs[index].classList.add(data.correct ? 'correct' : 'incorrect');
                    }
                }
            });
        }
    }
};
