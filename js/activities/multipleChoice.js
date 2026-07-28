// Multiple Choice Activity Engine
const MultipleChoiceActivity = {
    render(container, questions) {
        const wrapper = document.createElement('div');
        wrapper.className = 'multiple-choice-wrapper';
        
        questions.forEach((q, idx) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'multiple-choice-question';
            questionDiv.dataset.index = idx;
            
            // Question prompt
            const prompt = document.createElement('p');
            prompt.innerHTML = `<strong>Question ${idx + 1}:</strong> ${q.prompt}`;
            questionDiv.appendChild(prompt);
            
            // Options
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'multiple-choice-options';
            
            // Shuffle options for variety
            const shuffledOptions = Utils.shuffle(q.options);
            
            shuffledOptions.forEach((opt) => {
                const label = document.createElement('label');
                label.className = 'multiple-choice-option';
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `mc_q${idx}`;
                input.value = opt;
                
                const span = document.createElement('span');
                span.textContent = opt;
                
                label.appendChild(input);
                label.appendChild(span);
                
                // Add feedback area
                const feedback = document.createElement('div');
                feedback.className = 'mc-feedback';
                feedback.style.marginTop = '0.25rem';
                feedback.style.fontSize = '0.9rem';
                
                label.addEventListener('click', (e) => {
                    // Only handle click on label, not on input
                    if (e.target.tagName === 'INPUT') return;
                    
                    // Clear selections in this question
                    optionsDiv.querySelectorAll('.multiple-choice-option').forEach(el => {
                        el.classList.remove('selected', 'correct', 'incorrect');
                    });
                    
                    label.classList.add('selected');
                    
                    // Check answer
                    this.checkAnswer(label, q.answer);
                });
                
                // Handle input click
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Clear selections in this question
                    optionsDiv.querySelectorAll('.multiple-choice-option').forEach(el => {
                        el.classList.remove('selected', 'correct', 'incorrect');
                    });
                    
                    label.classList.add('selected');
                    
                    // Check answer
                    this.checkAnswer(label, q.answer);
                });
                
                optionsDiv.appendChild(label);
            });
            
            questionDiv.appendChild(optionsDiv);
            
            // Add explanation if available
            if (q.explanation) {
                const explanation = document.createElement('div');
                explanation.className = 'mc-explanation';
                explanation.style.marginTop = '1rem';
                explanation.style.padding = '0.75rem';
                explanation.style.borderRadius = '8px';
                explanation.style.background = 'var(--bg-light)';
                explanation.style.display = 'none';
                explanation.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
                questionDiv.appendChild(explanation);
            }
            
            wrapper.appendChild(questionDiv);
        });
        
        container.appendChild(wrapper);
        
        // Add check all button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'nav-btn';
        checkBtn.textContent = 'Check All Answers';
        checkBtn.addEventListener('click', () => this.checkAllAnswers(container));
        container.appendChild(checkBtn);
        
        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'nav-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginLeft = '0.5rem';
        resetBtn.addEventListener('click', () => this.reset(container));
        container.appendChild(resetBtn);
        
        // Load saved progress
        this.loadProgress(container);
    },
    
    checkAnswer(label, correctAnswer) {
        const selectedValue = label.querySelector('input').value;
        const isCorrect = selectedValue === correctAnswer;
        
        // Remove previous feedback
        const existingFeedback = label.parentElement.parentElement.querySelector('.mc-feedback-result');
        if (existingFeedback) existingFeedback.remove();
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'mc-feedback-result';
        feedbackDiv.style.marginTop = '0.5rem';
        feedbackDiv.style.padding = '0.5rem';
        feedbackDiv.style.borderRadius = '4px';
        
        if (isCorrect) {
            label.classList.add('correct');
            feedbackDiv.style.background = '#e8f5e9';
            feedbackDiv.style.color = '#2e7d32';
            feedbackDiv.textContent = 'Correct!';
        } else {
            label.classList.add('incorrect');
            feedbackDiv.style.background = '#ffebee';
            feedbackDiv.style.color = '#c62828';
            feedbackDiv.textContent = `Incorrect. The answer was: ${correctAnswer}`;
            
            // Highlight correct answer
            const options = label.parentElement.querySelectorAll('.multiple-choice-option');
            options.forEach(opt => {
                const optValue = opt.querySelector('input').value;
                if (optValue === correctAnswer) {
                    opt.classList.add('correct');
                }
            });
            
            // Show explanation if available
            const explanation = label.closest('.multiple-choice-question').querySelector('.mc-explanation');
            if (explanation) {
                explanation.style.display = 'block';
            }
        }
        
        // Insert feedback after options
        const optionsDiv = label.closest('.multiple-choice-options');
        optionsDiv.appendChild(feedbackDiv);
        
        // Save progress
        this.saveProgress(label.closest('.multiple-choice-wrapper'));
    },
    
    checkAllAnswers(container) {
        const questions = container.querySelectorAll('.multiple-choice-question');
        let correctCount = 0;
        let totalCount = questions.length;
        
        questions.forEach(q => {
            const selectedOption = q.querySelector('.multiple-choice-option.selected');
            if (selectedOption) {
                const isCorrect = selectedOption.classList.contains('correct');
                if (isCorrect) correctCount++;
            }
        });
        
        // Show results
        const resultDiv = document.createElement('div');
        resultDiv.className = 'mc-results';
        resultDiv.style.marginTop = '1rem';
        resultDiv.style.padding = '1rem';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.background = 'var(--bg-light)';
        resultDiv.innerHTML = `
            <strong>Results:</strong> ${correctCount} out of ${totalCount} correct
            ${correctCount === totalCount ? ' - Perfect!' : ''}
        `;
        
        const oldResults = container.querySelector('.mc-results');
        if (oldResults) oldResults.remove();
        container.appendChild(resultDiv);
    },
    
    reset(container) {
        const questions = container.querySelectorAll('.multiple-choice-question');
        questions.forEach(q => {
            const options = q.querySelectorAll('.multiple-choice-option');
            options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
                const input = opt.querySelector('input');
                if (input) input.checked = false;
            });
            
            const feedbacks = q.querySelectorAll('.mc-feedback-result');
            feedbacks.forEach(f => f.remove());
            
            const explanation = q.querySelector('.mc-explanation');
            if (explanation) explanation.style.display = 'none';
        });
        
        const results = container.querySelector('.mc-results');
        if (results) results.remove();
    },
    
    saveProgress(container) {
        const questions = container.querySelectorAll('.multiple-choice-question');
        const progress = [];
        questions.forEach(q => {
            const selected = q.querySelector('.multiple-choice-option.selected');
            progress.push({
                selected: selected ? selected.querySelector('input').value : null,
                correct: selected ? selected.classList.contains('correct') : false
            });
        });
        
        const lessonId = App.currentLesson;
        if (lessonId) {
            const saved = Storage.loadProgress(lessonId) || {};
            saved.multipleChoiceProgress = progress;
            Storage.saveProgress(lessonId, saved);
        }
    },
    
    loadProgress(container) {
        const lessonId = App.currentLesson;
        if (!lessonId) return;
        
        const saved = Storage.loadProgress(lessonId);
        if (saved && saved.multipleChoiceProgress) {
            const questions = container.querySelectorAll('.multiple-choice-question');
            saved.multipleChoiceProgress.forEach((data, index) => {
                if (questions[index] && data.selected) {
                    const options = questions[index].querySelectorAll('.multiple-choice-option');
                    options.forEach(opt => {
                        const input = opt.querySelector('input');
                        if (input && input.value === data.selected) {
                            input.checked = true;
                            opt.classList.add('selected');
                            if (data.correct) {
                                opt.classList.add('correct');
                            }
                            // Restore feedback
                            const correctAnswer = questions[index].querySelector('.multiple-choice-options').dataset.answer;
                            this.checkAnswer(opt, correctAnswer);
                        }
                    });
                }
            });
        }
    }
};
