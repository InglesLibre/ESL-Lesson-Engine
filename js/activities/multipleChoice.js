// Multiple Choice Activity
const MultipleChoiceActivity = {
    render(container, slide) {
        console.log('MultipleChoiceActivity.render called');
        
        if (!slide.questions || slide.questions.length === 0) {
            console.warn('MultipleChoice: No questions provided');
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'activity-container multiple-choice-wrapper';
        wrapper.style.margin = '1.5rem 0';
        
        slide.questions.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'multiple-choice-question';
            qDiv.style.margin = '1.5rem 0';
            
            const prompt = document.createElement('p');
            prompt.innerHTML = `<strong>Q${idx + 1}:</strong> ${q.prompt}`;
            qDiv.appendChild(prompt);
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'multiple-choice-options';
            
            q.options.forEach(o => {
                const label = document.createElement('label');
                label.className = 'multiple-choice-option';
                label.style.display = 'block';
                label.style.padding = '0.5rem 1rem';
                label.style.margin = '0.25rem 0';
                label.style.background = '#f0f4f8';
                label.style.borderRadius = '4px';
                label.style.cursor = 'pointer';
                label.style.border = '2px solid transparent';
                label.style.transition = 'all 0.2s';
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${idx}`;
                input.value = o;
                input.style.marginRight = '0.5rem';
                
                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + o));
                
                label.addEventListener('click', function() {
                    const parent = this.parentElement;
                    // Clear all selections in this question
                    parent.querySelectorAll('.multiple-choice-option').forEach(el => {
                        el.style.borderColor = 'transparent';
                        el.style.background = '#f0f4f8';
                    });
                    this.style.borderColor = '#1a3a5c';
                    this.style.background = '#e3ecf5';
                    
                    // Check if correct
                    if (this.querySelector('input').value === q.answer) {
                        this.style.borderColor = '#4caf50';
                        this.style.background = '#e8f5e9';
                    } else {
                        this.style.borderColor = '#f44336';
                        this.style.background = '#ffebee';
                        // Show correct answer
                        parent.querySelectorAll('.multiple-choice-option').forEach(el => {
                            if (el.querySelector('input').value === q.answer) {
                                el.style.borderColor = '#4caf50';
                                el.style.background = '#e8f5e9';
                            }
                        });
                    }
                    
                    // Show explanation
                    const explanation = parent.parentElement.querySelector('.mc-explanation');
                    if (explanation && q.explanation) {
                        explanation.style.display = 'block';
                        explanation.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
                    }
                });
                
                optionsDiv.appendChild(label);
            });
            
            qDiv.appendChild(optionsDiv);
            
            // Explanation
            if (q.explanation) {
                const explanation = document.createElement('div');
                explanation.className = 'mc-explanation';
                explanation.style.display = 'none';
                explanation.style.marginTop = '0.75rem';
                explanation.style.padding = '0.75rem';
                explanation.style.borderRadius = '4px';
                explanation.style.background = '#e8f5e9';
                explanation.style.color = '#2e7d32';
                qDiv.appendChild(explanation);
            }
            
            wrapper.appendChild(qDiv);
        });
        
        container.appendChild(wrapper);
        console.log('MultipleChoiceActivity rendered successfully');
    }
};

console.log('MultipleChoiceActivity loaded');
