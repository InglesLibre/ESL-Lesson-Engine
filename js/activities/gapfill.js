// Gap Fill Activity Engine
const GapFillActivity = {
    answers: {},
    
    render(container, text, answers) {
        this.answers = answers;
        const wrapper = document.createElement('div');
        wrapper.className = 'gapfill-wrapper';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'gap-fill-text';
        textDiv.style.lineHeight = '2.5';
        
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
                input.autocomplete = 'off';
                input.spellcheck = false;
                
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
                
                // Allow case-insensitive comparison
                input.addEventListener('input', () => {
                    if (input.classList.contains('correct')) return;
                    input.classList.remove('incorrect', 'hint');
                });
                
                textDiv.appendChild(input);
                answerIndex++;
            }
        });
        
        wrapper.appendChild(textDiv);
        container.appendChild(wrapper);
        
        // Add controls
        const controlsDiv = document.createElement('div');
        controlsDiv.style.marginTop = '1rem';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '0.5rem';
        controlsDiv.style.flexWrap = 'wrap';
        
        const checkBtn = document.createElement('button');
        checkBtn.className = 'nav-btn';
        checkBtn.textContent = 'Check All';
        checkBtn.addEventListener('click', () => this.checkAllAnswers(wrapper));
        controlsDiv.appendChild(checkBtn);
        
        const showBtn = document.createElement('button');
        showBtn.className = 'nav-btn';
        showBtn.textContent = 'Show Answers';
        showBtn.addEventListener('click', () => this.showAnswers(wrapper));
        controlsDiv.appendChild(showBtn);
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'nav-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.addEventListener('click', () => this.reset(wrapper));
        controlsDiv.appendChild(resetBtn);
        
        wrapper.appendChild(controlsDiv);
        
        // Load saved progress
        this.loadProgress(wrapper);
    },
    
    checkAnswer(input) {
        if (input.disabled) return;
        
        const userAnswer = input.value.trim();
        const correctAnswer = input.dataset.answer;
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        
        // Remove existing classes
        input.classList.remove('correct', 'incorrect', 'hint');
        
        if (isCorrect && userAnswer !== '') {
            input.classList.add('correct');
            input.disabled = true;
            this.showFeedback(input, 'Correct!', '#4caf50');
        } else if (userAnswer !== '') {
            input.classList.add('incorrect');
            this.showFeedback(input, `Try again!`, '#f44336');
            
            // Add hint after a moment
            setTimeout(() => {
                if (!input.disabled && input.value.trim() !== '') {
                    input.classList.add('hint');
                    input.placeholder = `Hint: ${correctAnswer.charAt(0)}...`;
                }
            }, 1500);
        }
        
        // Save progress
        this.saveProgress(input.closest('.gapfill-wrapper'));
    },
    
    showFeedback(input, message, color) {
        // Remove existing feedback
        const existingFeedback = input.parentElement.querySelector(`.feedback-${input.id}`);
        if (existingFeedback) existingFeedback.remove();
        
        const feedback = document.createElement('span');
        feedback.className = `feedback-${input.id}`;
        feedback.textContent = message;
        feedback.style.marginLeft = '0.5rem';
        feedback.style.color = color;
        feedback.style.fontSize = '0.9rem';
        feedback.style.fontWeight = '500';
        
        input.parentElement.insertBefore(feedback, input.nextSibling);
        
        // Remove feedback after 3 seconds
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 3000);
    },
    
    checkAllAnswers(wrapper) {
        const inputs = wrapper.querySelectorAll('.gap-fill-input');
        let correctCount = 0;
        let totalCount = inputs.length;
        let answeredCount = 0;
        
        inputs.forEach(input => {
            if (!input.disabled && input.value.trim() !== '') {
                this.checkAnswer(input);
            }
            if (input.disabled && input.classList.contains('correct')) {
                correctCount++;
            }
            if (input.value.trim() !== '') {
                answeredCount++;
            }
        });
        
        // Show results
        let resultMessage = `${correctCount} out of ${totalCount} correct`;
        if (answeredCount < totalCount) {
            resultMessage += ` (${answeredCount} answered, ${totalCount - answeredCount} remaining)`;
        }
        if (correctCount === totalCount && totalCount > 0) {
            resultMessage += ' - Perfect!';
        }
        
        this.showGlobalFeedback(wrapper, resultMessage, correctCount === totalCount ? '#4caf50' : '#ff9800');
    },
    
    showAnswers(wrapper) {
        const inputs = wrapper.querySelectorAll('.gap-fill-input');
        inputs.forEach(input => {
            if (!input.disabled) {
                const correctAnswer = input.dataset.answer;
                input.value = correctAnswer;
                input.classList.add('correct');
                input.disabled = true;
                this.showFeedback(input, 'Answer shown', '#2196f3');
            }
        });
        
        this.showGlobalFeedback(wrapper, 'Answers revealed', '#2196f3');
    },
    
    showGlobalFeedback(wrapper, message, color) {
        // Remove existing global feedback
        const existing = wrapper.querySelector('.gapfill-global-feedback');
        if (existing) existing.remove();
        
        const feedback = document.createElement('div');
        feedback.className = 'gapfill-global-feedback';
        feedback.style.marginTop = '1rem';
        feedback.style.padding = '0.75rem';
        feedback.style.borderRadius = '8px';
        feedback.style.background = color + '20';
        feedback.style.color = color;
        feedback.style.fontWeight = '500';
        feedback.textContent = message;
        
        wrapper.appendChild(feedback);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (feedback.parentElement) {
                feedback.remove();
            }
        }, 5000);
    },
    
    reset(wrapper) {
        const inputs = wrapper.querySelectorAll('.gap-fill-input');
        inputs.forEach(input => {
            input.value = '';
            input.className = 'gap-fill-input';
            input.disabled = false;
            input.placeholder = '...';
            // Remove feedback
            const feedback = input.parentElement.querySelector(`.feedback-${input.id}`);
            if (feedback) feedback.remove();
        });
        
        // Remove global feedback
        const globalFeedback = wrapper.querySelector('.gapfill-global-feedback');
        if (globalFeedback) globalFeedback.remove();
        
        // Save reset state
        this.saveProgress(wrapper);
    },
    
    saveProgress(wrapper) {
        const inputs = wrapper.querySelectorAll('.gap-fill-input');
        const progress = [];
        inputs.forEach(inp => {
            progress.push({
                value: inp.value,
                disabled: inp.disabled,
                correct: inp.classList.contains('correct')
            });
        });
        
        const lessonId = App.currentLesson;
        if (lessonId) {
            const saved = Storage.loadProgress(lessonId) || {};
            saved.gapFillProgress = progress;
            Storage.saveProgress(lessonId, saved);
        }
    },
    
    loadProgress(wrapper) {
        const lessonId = App.currentLesson;
        if (!lessonId) return;
        
        const saved = Storage.loadProgress(lessonId);
        if (saved && saved.gapFillProgress) {
            const inputs = wrapper.querySelectorAll('.gap-fill-input');
            saved.gapFillProgress.forEach((data, index) => {
                if (inputs[index]) {
                    inputs[index].value = data.value;
                    if (data.disabled) {
                        inputs[index].disabled = true;
                        inputs[index].classList.add(data.correct ? 'correct' : 'incorrect');
                        if (data.correct) {
                            this.showFeedback(inputs[index], 'Correct!', '#4caf50');
                        }
                    }
                }
            });
        }
    }
};
