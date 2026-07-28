// Dropdown Activity Engine
const DropdownActivity = {
    render(container, questions) {
        const wrapper = document.createElement('div');
        wrapper.className = 'dropdown-activity-wrapper';
        
        questions.forEach((q, idx) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'dropdown-question';
            questionDiv.dataset.index = idx;
            
            // Question prompt
            const prompt = document.createElement('p');
            prompt.innerHTML = `<strong>Question ${idx + 1}:</strong> ${q.prompt}`;
            questionDiv.appendChild(prompt);
            
            // Dropdown select
            const select = document.createElement('select');
            select.className = 'dropdown-select';
            select.dataset.answer = q.answer || '';
            select.id = `dropdown_${idx}`;
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select an option...';
            select.appendChild(defaultOption);
            
            // Add options
            q.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                select.appendChild(option);
            });
            
            // Add feedback area
            const feedback = document.createElement('div');
            feedback.className = 'dropdown-feedback';
            feedback.style.marginTop = '0.5rem';
            feedback.style.fontSize = '0.9rem';
            
            select.addEventListener('change', () => {
                this.checkAnswer(select, feedback);
            });
            
            questionDiv.appendChild(select);
            questionDiv.appendChild(feedback);
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
    
    checkAnswer(select, feedback) {
        const selectedValue = select.value;
        const correctAnswer = select.dataset.answer;
        const isCorrect = selectedValue === correctAnswer;
        
        // Clear previous styles
        select.classList.remove('correct', 'incorrect');
        
        if (isCorrect && selectedValue !== '') {
            select.classList.add('correct');
            feedback.innerHTML = '<span style="color: #4caf50;">Correct!</span>';
            feedback.style.color = '#4caf50';
        } else if (selectedValue !== '') {
            select.classList.add('incorrect');
            feedback.innerHTML = `<span style="color: #f44336;">Incorrect. The answer was: ${correctAnswer}</span>`;
            feedback.style.color = '#f44336';
        } else {
            feedback.innerHTML = '';
        }
        
        // Save progress
        this.saveProgress(select.closest('.dropdown-activity-wrapper'));
    },
    
    checkAllAnswers(container) {
        const selects = container.querySelectorAll('.dropdown-select');
        let correctCount = 0;
        let totalCount = selects.length;
        
        selects.forEach(select => {
            const selectedValue = select.value;
            const correctAnswer = select.dataset.answer;
            const feedback = select.parentElement.querySelector('.dropdown-feedback');
            
            if (selectedValue === correctAnswer && selectedValue !== '') {
                correctCount++;
                select.classList.add('correct');
            } else if (selectedValue !== '') {
                select.classList.add('incorrect');
            }
            
            // Show feedback for all
            if (feedback) {
                if (selectedValue === correctAnswer && selectedValue !== '') {
                    feedback.innerHTML = '<span style="color: #4caf50;">Correct!</span>';
                } else if (selectedValue !== '') {
                    feedback.innerHTML = `<span style="color: #f44336;">Incorrect. Answer: ${correctAnswer}</span>`;
                }
            }
        });
        
        // Show results
        const resultDiv = document.createElement('div');
        resultDiv.className = 'dropdown-results';
        resultDiv.style.marginTop = '1rem';
        resultDiv.style.padding = '1rem';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.background = 'var(--bg-light)';
        resultDiv.innerHTML = `
            <strong>Results:</strong> ${correctCount} out of ${totalCount} correct
            ${correctCount === totalCount ? ' - Perfect!' : ''}
        `;
        
        const oldResults = container.querySelector('.dropdown-results');
        if (oldResults) oldResults.remove();
        container.appendChild(resultDiv);
    },
    
    reset(container) {
        const selects = container.querySelectorAll('.dropdown-select');
        selects.forEach(select => {
            select.value = '';
            select.classList.remove('correct', 'incorrect');
            const feedback = select.parentElement.querySelector('.dropdown-feedback');
            if (feedback) feedback.innerHTML = '';
        });
        
        const results = container.querySelector('.dropdown-results');
        if (results) results.remove();
    },
    
    saveProgress(container) {
        const selects = container.querySelectorAll('.dropdown-select');
        const progress = [];
        selects.forEach(select => {
            progress.push({
                value: select.value,
                selected: select.value !== ''
            });
        });
        
        const lessonId = App.currentLesson;
        if (lessonId) {
            const saved = Storage.loadProgress(lessonId) || {};
            saved.dropdownProgress = progress;
            Storage.saveProgress(lessonId, saved);
        }
    },
    
    loadProgress(container) {
        const lessonId = App.currentLesson;
        if (!lessonId) return;
        
        const saved = Storage.loadProgress(lessonId);
        if (saved && saved.dropdownProgress) {
            const selects = container.querySelectorAll('.dropdown-select');
            saved.dropdownProgress.forEach((data, index) => {
                if (selects[index]) {
                    selects[index].value = data.value;
                    if (data.selected) {
                        const feedback = selects[index].parentElement.querySelector('.dropdown-feedback');
                        if (feedback) {
                            this.checkAnswer(selects[index], feedback);
                        }
                    }
                }
            });
        }
    }
};
