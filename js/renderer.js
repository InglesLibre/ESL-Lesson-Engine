// Slide Renderer - Plugin-based Architecture
const Renderer = {
    currentIndex: 0,
    slideElements: [],
    
    renderLesson(lessonData) {
        console.log('renderLesson called with:', lessonData);
        
        const container = document.getElementById('slideContent');
        if (!container) {
            console.error('Container element not found!');
            return;
        }
        
        container.innerHTML = '';
        
        if (!lessonData || !lessonData.slides || lessonData.slides.length === 0) {
            container.innerHTML = '<div class="empty-state">No slides found in this lesson.</div>';
            return;
        }
        
        console.log('Rendering', lessonData.slides.length, 'slides');
        
        this.slideElements = [];
        
        lessonData.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-page';
            slideDiv.dataset.index = index;
            slideDiv.style.display = 'none';
            slideDiv.style.padding = '20px';
            slideDiv.style.background = '#ffffff';
            slideDiv.style.borderRadius = '8px';
            slideDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            this.renderSlide(slide, slideDiv, index, lessonData);
            
            container.appendChild(slideDiv);
            this.slideElements.push(slideDiv);
        });
        
        // Update Navigation
        if (typeof Navigation !== 'undefined') {
            Navigation.totalSlides = this.slideElements.length;
            Navigation.currentIndex = 0;
        }
        
        if (this.slideElements.length > 0) {
            const counter = document.getElementById('slideCounter');
            if (counter) {
                counter.textContent = `Slide 1 of ${lessonData.slides.length}`;
            }
            
            this.updateProgress(0, lessonData.slides.length);
            this.showSlide(0);
            
            console.log('Lesson rendered successfully');
        }
    },
    
    renderSlide(slide, container, index, lessonData) {
        // Clear existing content
        container.innerHTML = '';
        
        const slideType = slide.type || 'content';
        const typeClass = slideType.toLowerCase().replace(/\s+/g, '-');
        container.className = `slide-page slide-${typeClass}`;
        
        // Look up the slide type renderer
        let renderer = App.slideTypes && App.slideTypes[slideType];
        
        if (renderer && typeof renderer.render === 'function') {
            // Use the dedicated slide type renderer
            renderer.render(slide, container);
        } else {
            // Fallback rendering
            this.renderFallback(slide, container);
        }
        
        // Add slide number and footer
        this.addSlideFooter(container, index, lessonData);
    },
    
    renderFallback(slide, container) {
        // Simple fallback rendering
        if (slide.title) {
            const h1 = document.createElement('h1');
            h1.textContent = slide.title;
            h1.style.color = '#1a3a5c';
            h1.style.marginBottom = '0.5rem';
            container.appendChild(h1);
        }
        
        if (slide.content) {
            const div = document.createElement('div');
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
        
        // Render activities if present - check for activity type
        if (slide.type === 'Gap Fill' || slide.type === 'Dropdown' || 
            slide.type === 'Matching' || slide.type === 'Multiple Choice' || 
            slide.type === 'Drag & Drop') {
            this.renderActivity(slide, container);
        }
        
        // Also render if activity data is present
        if (slide.text || slide.questions || slide.words || slide.pairs || slide.items) {
            this.renderActivity(slide, container);
        }
    },
    
    renderActivity(slide, container) {
        console.log('renderActivity called for type:', slide.type);
        
        // Delegate to activity renderers based on slide type
        const activityRenderers = {
            'Gap Fill': GapFillActivity,
            'Dropdown': DropdownActivity,
            'Matching': MatchingActivity,
            'Multiple Choice': MultipleChoiceActivity,
            'Drag & Drop': DragDropActivity
        };
        
        const renderer = activityRenderers[slide.type];
        
        if (renderer && typeof renderer.render === 'function') {
            console.log('Using activity renderer for:', slide.type);
            renderer.render(container, slide);
        } else {
            console.warn('No renderer found for activity type:', slide.type);
            // Try to render based on data structure
            this.renderGenericActivity(slide, container);
        }
    },
    
    renderGenericActivity(slide, container) {
        console.log('Using generic activity rendering for:', slide.type);
        
        // Gap Fill
        if (slide.text && slide.answers) {
            this.renderGapFillGeneric(slide, container);
            return;
        }
        
        // Multiple Choice
        if (slide.questions && slide.questions.length > 0 && slide.questions[0].options) {
            this.renderMultipleChoiceGeneric(slide, container);
            return;
        }
        
        // Dropdown
        if (slide.questions && slide.questions.length > 0 && slide.questions[0].options) {
            this.renderDropdownGeneric(slide, container);
            return;
        }
        
        // Vocabulary
        if (slide.words && slide.words.length > 0) {
            this.renderVocabularyGeneric(slide, container);
            return;
        }
        
        // If nothing matches, show a message
        const div = document.createElement('div');
        div.style.padding = '1rem';
        div.style.background = '#fff3cd';
        div.style.borderRadius = '4px';
        div.style.color = '#856404';
        div.textContent = 'Activity content available but no specific renderer found.';
        container.appendChild(div);
    },
    
    renderGapFillGeneric(slide, container) {
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
    },
    
    renderMultipleChoiceGeneric(slide, container) {
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
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${idx}`;
                input.value = o;
                
                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + o));
                
                label.addEventListener('click', function() {
                    const parent = this.parentElement;
                    parent.querySelectorAll('.multiple-choice-option').forEach(el => {
                        el.style.borderColor = 'transparent';
                        el.style.background = '#f0f4f8';
                    });
                    this.style.borderColor = '#1a3a5c';
                    this.style.background = '#e3ecf5';
                    
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
    },
    
    renderDropdownGeneric(slide, container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'activity-container dropdown-wrapper';
        wrapper.style.margin = '1.5rem 0';
        
        slide.questions.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'dropdown-question';
            qDiv.style.margin = '1rem 0';
            
            const prompt = document.createElement('p');
            prompt.innerHTML = `<strong>Q${idx + 1}:</strong> ${q.prompt}`;
            qDiv.appendChild(prompt);
            
            const select = document.createElement('select');
            select.className = 'dropdown-select';
            select.style.padding = '0.5rem';
            select.style.border = '2px solid #ddd';
            select.style.borderRadius = '4px';
            select.style.minWidth = '150px';
            select.dataset.answer = q.answer || '';
            
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Select...';
            select.appendChild(defaultOpt);
            
            q.options.forEach(o => {
                const opt = document.createElement('option');
                opt.value = o;
                opt.textContent = o;
                select.appendChild(opt);
            });
            
            select.addEventListener('change', function() {
                if (this.value === this.dataset.answer) {
                    this.style.borderColor = '#4caf50';
                    this.style.background = '#e8f5e9';
                } else if (this.value !== '') {
                    this.style.borderColor = '#f44336';
                    this.style.background = '#ffebee';
                } else {
                    this.style.borderColor = '#ddd';
                    this.style.background = '';
                }
            });
            
            qDiv.appendChild(select);
            wrapper.appendChild(qDiv);
        });
        
        container.appendChild(wrapper);
    },
    
    renderVocabularyGeneric(slide, container) {
        const grid = document.createElement('div');
        grid.className = 'vocabulary-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        grid.style.gap = '1rem';
        grid.style.margin = '1rem 0';
        
        slide.words.forEach(word => {
            const item = document.createElement('div');
            item.className = 'vocab-item';
            item.style.background = '#f0f4f8';
            item.style.padding = '1rem';
            item.style.borderRadius = '8px';
            item.style.borderLeft = '4px solid #1a3a5c';
            
            const wordSpan = document.createElement('div');
            wordSpan.className = 'vocab-word';
            wordSpan.textContent = word.word;
            wordSpan.style.fontWeight = '700';
            wordSpan.style.color = '#1a3a5c';
            wordSpan.style.fontSize = '1.1rem';
            item.appendChild(wordSpan);
            
            if (word.definition) {
                const defSpan = document.createElement('div');
                defSpan.className = 'vocab-definition';
                defSpan.textContent = word.definition;
                defSpan.style.fontSize = '0.95rem';
                defSpan.style.color = '#4a4a6a';
                defSpan.style.marginTop = '0.25rem';
                item.appendChild(defSpan);
            }
            
            if (word.example) {
                const exampleSpan = document.createElement('div');
                exampleSpan.className = 'vocab-example';
                exampleSpan.textContent = `"${word.example}"`;
                exampleSpan.style.fontStyle = 'italic';
                exampleSpan.style.color = '#6a6a8a';
                exampleSpan.style.marginTop = '0.25rem';
                exampleSpan.style.fontSize = '0.9rem';
                item.appendChild(exampleSpan);
            }
            
            grid.appendChild(item);
        });
        
        container.appendChild(grid);
    },
    
    addSlideFooter(container, index, lessonData) {
        // Slide number
        const slideNumber = document.createElement('div');
        slideNumber.className = 'slide-number';
        slideNumber.textContent = `${index + 1} / ${lessonData.slides.length}`;
        slideNumber.style.marginTop = '1.5rem';
        slideNumber.style.paddingTop = '1rem';
        slideNumber.style.borderTop = '1px solid #e0e0e0';
        slideNumber.style.color = '#888';
        slideNumber.style.fontSize = '0.9rem';
        container.appendChild(slideNumber);
        
        // CC License
        const licenseDiv = document.createElement('div');
        licenseDiv.className = 'cc-license';
        licenseDiv.style.fontSize = '0.85rem';
        licenseDiv.style.color = '#666';
        licenseDiv.style.textAlign = 'center';
        licenseDiv.style.marginTop = '20px';
        licenseDiv.style.paddingTop = '14px';
        licenseDiv.style.borderTop = '2px solid #ddd';
        licenseDiv.innerHTML = `
            <a href="https://example.com" style="color: #1a3a5c; text-decoration: none;">ESL Classroom resources</a> © 1999 by <a href="https://example.com" style="color: #1a3a5c; text-decoration: none;">InglesLibrePe@gmail.com</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" style="color: #1a3a5c; text-decoration: none;">Creative Commons Attribution-ShareAlike 4.0 International</a>
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons" style="max-width:1.5em;max-height:1.5em;margin:0 0.1em;border:none;display:inline;vertical-align:middle;">
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution" style="max-width:1.5em;max-height:1.5em;margin:0 0.1em;border:none;display:inline;vertical-align:middle;">
            <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="ShareAlike" style="max-width:1.5em;max-height:1.5em;margin:0 0.1em;border:none;display:inline;vertical-align:middle;">
        `;
        container.appendChild(licenseDiv);
    },
    
    updateProgress(current, total) {
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (!fill || !text) return;
        
        const percentage = total > 0 ? ((current + 1) / total * 100) : 0;
        fill.style.width = `${percentage}%`;
        text.textContent = `${current + 1} / ${total}`;
    },
    
    showSlide(index) {
        console.log('showSlide called with index:', index);
        
        const container = document.getElementById('slideContent');
        if (!container) return;
        
        if (this.slideElements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>No slides to display</h2>
                    <p>Try selecting a different lesson from the dropdown.</p>
                </div>
            `;
            return;
        }
        
        if (index < 0) index = 0;
        if (index >= this.slideElements.length) index = this.slideElements.length - 1;
        
        this.slideElements.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        this.updateProgress(index, this.slideElements.length);
        
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `Slide ${index + 1} of ${this.slideElements.length}`;
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === this.slideElements.length - 1;
        
        // Update Navigation state
        if (typeof Navigation !== 'undefined') {
            Navigation.currentIndex = index;
            Navigation.totalSlides = this.slideElements.length;
        }
        
        this.currentIndex = index;
        if (typeof App !== 'undefined') {
            App.currentSlideIndex = index;
            App.saveProgress();
        }
        
        console.log('Showing slide', index);
    }
};

console.log('Renderer loaded successfully');
