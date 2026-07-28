// Slide Renderer
const Renderer = {
    renderLesson(lessonData) {
        const container = document.getElementById('slideContent');
        container.innerHTML = '';
        
        lessonData.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-page';
            slideDiv.dataset.index = index;
            slideDiv.style.display = index === 0 ? 'block' : 'none';
            
            this.renderSlide(slide, slideDiv, index, lessonData);
            container.appendChild(slideDiv);
        });
        
        // Update total slides
        const counter = document.getElementById('slideCounter');
        counter.textContent = `Slide 1 of ${lessonData.slides.length}`;
        
        // Update progress
        this.updateProgress(0, lessonData.slides.length);
    },
    
    renderSlide(slide, container, index, lessonData) {
        const slideType = slide.type || 'content';
        
        // Add slide class
        container.className = `slide-${slideType.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Build slide content based on type
        switch(slideType) {
            case 'Title':
                this.renderTitle(slide, container);
                break;
            case 'Objectives':
                this.renderObjectives(slide, container);
                break;
            case 'Ice Breaker':
                this.renderIceBreaker(slide, container);
                break;
            case 'Vocabulary':
                this.renderVocabulary(slide, container);
                break;
            case 'Reading':
                this.renderReading(slide, container);
                break;
            case 'Listening':
                this.renderListening(slide, container);
                break;
            case 'Speaking Part 1':
            case 'Speaking Part 2':
            case 'Speaking Part 3':
                this.renderSpeaking(slide, container);
                break;
            case 'Writing':
                this.renderWriting(slide, container);
                break;
            case 'Grammar Discovery':
                this.renderGrammarDiscovery(slide, container);
                break;
            case 'Grammar Rules':
                this.renderGrammarRules(slide, container);
                break;
            case 'Gap Fill':
                this.renderGapFill(slide, container);
                break;
            case 'Dropdown':
                this.renderDropdown(slide, container);
                break;
            case 'Matching':
                this.renderMatching(slide, container);
                break;
            case 'Drag & Drop':
                this.renderDragDrop(slide, container);
                break;
            case 'Multiple Choice':
                this.renderMultipleChoice(slide, container);
                break;
            default:
                this.renderContent(slide, container);
        }
        
        // Add slide number
        const slideNumber = document.createElement('div');
        slideNumber.className = 'slide-number';
        slideNumber.textContent = `${index + 1} / ${lessonData.slides.length}`;
        container.appendChild(slideNumber);
        
        // Add CC license after each slide
        const licenseDiv = document.createElement('div');
        licenseDiv.className = 'cc-license';
        licenseDiv.innerHTML = `
            <a href="https://example.com">ESL Classroom resources</a> © 1999 by <a href="https://example.com">InglesLibrePe@gmail.com</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International</a>
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons">
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution">
            <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="ShareAlike">
        `;
        container.appendChild(licenseDiv);
    },
    
    renderTitle(slide, container) {
        const h1 = document.createElement('h1');
        h1.textContent = slide.title || 'Untitled';
        container.appendChild(h1);
        
        if (slide.subtitle) {
            const p = document.createElement('p');
            p.className = 'subtitle';
            p.textContent = slide.subtitle;
            container.appendChild(p);
        }
        
        this.renderImage(slide, container);
        this.renderContent(slide, container);
    },
    
    renderObjectives(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Learning Objectives';
        container.appendChild(h2);
        
        if (slide.objectives && slide.objectives.length > 0) {
            const ul = document.createElement('ul');
            slide.objectives.forEach(obj => {
                const li = document.createElement('li');
                li.textContent = obj;
                ul.appendChild(li);
            });
            container.appendChild(ul);
        }
        
        this.renderContent(slide, container);
    },
    
    renderIceBreaker(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Ice Breaker';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.question) {
            const p = document.createElement('p');
            p.className = 'ice-breaker-question';
            p.textContent = slide.question;
            container.appendChild(p);
        }
        
        if (slide.instructions) {
            const div = document.createElement('div');
            div.className = 'ice-breaker-instructions';
            div.innerHTML = `<strong>Instructions:</strong> ${slide.instructions}`;
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderVocabulary(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Vocabulary';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.words && slide.words.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'vocabulary-grid';
            
            slide.words.forEach(word => {
                const item = document.createElement('div');
                item.className = 'vocab-item';
                
                const wordSpan = document.createElement('div');
                wordSpan.className = 'word';
                wordSpan.textContent = word.word;
                item.appendChild(wordSpan);
                
                if (word.definition) {
                    const defSpan = document.createElement('div');
                    defSpan.className = 'definition';
                    defSpan.textContent = word.definition;
                    item.appendChild(defSpan);
                }
                
                if (word.example) {
                    const exampleSpan = document.createElement('div');
                    exampleSpan.className = 'example';
                    exampleSpan.textContent = `"${word.example}"`;
                    item.appendChild(exampleSpan);
                }
                
                grid.appendChild(item);
            });
            
            container.appendChild(grid);
        }
        
        this.renderContent(slide, container);
    },
    
    renderReading(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Reading';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.text) {
            const div = document.createElement('div');
            div.className = 'reading-text';
            div.innerHTML = slide.text;
            container.appendChild(div);
        }
        
        if (slide.questions && slide.questions.length > 0) {
            const h3 = document.createElement('h3');
            h3.textContent = 'Comprehension Questions';
            container.appendChild(h3);
            
            const ol = document.createElement('ol');
            slide.questions.forEach(q => {
                const li = document.createElement('li');
                li.textContent = q;
                ol.appendChild(li);
            });
            container.appendChild(ol);
        }
        
        this.renderContent(slide, container);
    },
    
    renderListening(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Listening';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.audioUrl) {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = slide.audioUrl;
            container.appendChild(audio);
        }
        
        if (slide.script) {
            const div = document.createElement('div');
            div.className = 'listening-script';
            div.innerHTML = `<strong>Script:</strong> ${slide.script}`;
            container.appendChild(div);
        }
        
        if (slide.questions && slide.questions.length > 0) {
            const h3 = document.createElement('h3');
            h3.textContent = 'Comprehension Questions';
            container.appendChild(h3);
            
            const ol = document.createElement('ol');
            slide.questions.forEach(q => {
                const li = document.createElement('li');
                li.textContent = q;
                ol.appendChild(li);
            });
            container.appendChild(ol);
        }
        
        this.renderContent(slide, container);
    },
    
    renderSpeaking(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = slide.type || 'Speaking';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'speaking-prompt';
            div.innerHTML = slide.prompt;
            container.appendChild(div);
        }
        
        if (slide.tips && slide.tips.length > 0) {
            const div = document.createElement('div');
            div.className = 'speaking-tips';
            div.innerHTML = `<strong>Tips:</strong><ul>${slide.tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
            container.appendChild(div);
        }
        
        // Add timer
        if (slide.duration) {
            const timer = document.createElement('div');
            timer.className = 'speaking-timer';
            timer.textContent = `${slide.duration}s`;
            container.appendChild(timer);
            
            // Start timer when visible
            // This would be handled by an intersection observer in a real implementation
        }
        
        this.renderContent(slide, container);
    },
    
    renderWriting(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Writing';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'writing-prompt';
            div.innerHTML = slide.prompt;
            container.appendChild(div);
        }
        
        if (slide.guidelines && slide.guidelines.length > 0) {
            const div = document.createElement('div');
            div.className = 'writing-guidelines';
            div.innerHTML = `<strong>Guidelines:</strong><ul>${slide.guidelines.map(g => `<li>${g}</li>`).join('')}</ul>`;
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderGrammarDiscovery(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Grammar Discovery';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.examples && slide.examples.length > 0) {
            const div = document.createElement('div');
            div.className = 'grammar-discovery';
            div.innerHTML = `<strong>Look at these examples:</strong><ul>${slide.examples.map(e => `<li>${e}</li>`).join('')}</ul>`;
            container.appendChild(div);
        }
        
        if (slide.question) {
            const p = document.createElement('p');
            p.className = 'grammar-question';
            p.textContent = slide.question;
            container.appendChild(p);
        }
        
        this.renderContent(slide, container);
    },
    
    renderGrammarRules(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Grammar Rules';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const div = document.createElement('div');
        div.className = 'grammar-rules';
        
        if (slide.rules && slide.rules.length > 0) {
            slide.rules.forEach(rule => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${rule.title}:</strong> ${rule.description}`;
                div.appendChild(p);
            });
        }
        
        container.appendChild(div);
        this.renderContent(slide, container);
    },
    
    renderGapFill(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Gap Fill Activity';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'activity-container gap-fill-activity';
        
        if (slide.text) {
            const textDiv = document.createElement('div');
            textDiv.className = 'gap-fill-text';
            
            // Process text with placeholders
            const parts = slide.text.split(/\{\{([^}]+)\}\}/g);
            const answers = slide.answers || [];
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
                    
                    // Check answer when user blurs
                    input.addEventListener('blur', () => {
                        const isCorrect = input.value.trim().toLowerCase() === 
                                        input.dataset.answer.toLowerCase();
                        input.className = `gap-fill-input ${isCorrect ? 'correct' : 'incorrect'}`;
                        if (isCorrect) {
                            input.disabled = true;
                        }
                    });
                    
                    textDiv.appendChild(input);
                    answerIndex++;
                }
            });
            
            containerDiv.appendChild(textDiv);
        }
        
        container.appendChild(containerDiv);
        this.renderContent(slide, container);
    },
    
    renderDropdown(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Dropdown Activity';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'activity-container dropdown-activity';
        
        if (slide.questions && slide.questions.length > 0) {
            slide.questions.forEach((q, idx) => {
                const div = document.createElement('div');
                div.className = 'dropdown-question';
                div.innerHTML = `<p>${q.prompt}</p>`;
                
                const select = document.createElement('select');
                select.className = 'dropdown-select';
                select.dataset.index = idx;
                select.dataset.answer = q.answer || '';
                
                // Add options
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select...';
                select.appendChild(defaultOption);
                
                q.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                
                select.addEventListener('change', () => {
                    const isCorrect = select.value === select.dataset.answer;
                    select.className = `dropdown-select ${isCorrect ? 'correct' : ''}`;
                    if (isCorrect) {
                        select.disabled = true;
                    }
                });
                
                div.appendChild(select);
                containerDiv.appendChild(div);
            });
        }
        
        container.appendChild(containerDiv);
        this.renderContent(slide, container);
    },
    
    renderMatching(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Matching Activity';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'activity-container matching-activity';
        containerDiv.id = 'matchingContainer';
        
        if (slide.pairs && slide.pairs.length > 0) {
            // This would integrate with the matching.js activity engine
            MatchingActivity.render(containerDiv, slide.pairs);
        }
        
        container.appendChild(containerDiv);
        this.renderContent(slide, container);
    },
    
    renderDragDrop(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Drag & Drop Activity';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'activity-container dragdrop-activity';
        containerDiv.id = 'dragDropContainer';
        
        if (slide.items && slide.categories) {
            DragDropActivity.render(containerDiv, slide.items, slide.categories);
        }
        
        container.appendChild(containerDiv);
        this.renderContent(slide, container);
    },
    
    renderMultipleChoice(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Multiple Choice';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const containerDiv = document.createElement('div');
        containerDiv.className = 'activity-container multiple-choice-activity';
        
        if (slide.questions && slide.questions.length > 0) {
            slide.questions.forEach((q, idx) => {
                const div = document.createElement('div');
                div.className = 'multiple-choice-question';
                div.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'multiple-choice-options';
                
                q.options.forEach((opt, optIdx) => {
                    const label = document.createElement('label');
                    label.className = 'multiple-choice-option';
                    
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `q${idx}`;
                    input.value = opt;
                    
                    const span = document.createElement('span');
                    span.textContent = opt;
                    
                    label.appendChild(input);
                    label.appendChild(span);
                    
                    label.addEventListener('click', () => {
                        // Clear selections
                        optionsDiv.querySelectorAll('.multiple-choice-option').forEach(el => {
                            el.classList.remove('selected');
                        });
                        label.classList.add('selected');
                        
                        // Check answer
                        const isCorrect = opt === q.answer;
                        if (isCorrect) {
                            label.classList.add('correct');
                        } else {
                            label.classList.add('incorrect');
                            // Highlight correct answer
                            optionsDiv.querySelectorAll('.multiple-choice-option').forEach(el => {
                                if (el.textContent.trim() === q.answer) {
                                    el.classList.add('correct');
                                }
                            });
                        }
                    });
                    
                    optionsDiv.appendChild(label);
                });
                
                div.appendChild(optionsDiv);
                containerDiv.appendChild(div);
            });
        }
        
        container.appendChild(containerDiv);
        this.renderContent(slide, container);
    },
    
    renderContent(slide, container) {
        if (slide.content) {
            const div = document.createElement('div');
            div.className = 'slide-content-text';
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
    },
    
    renderImage(slide, container) {
        if (slide.image) {
            const img = document.createElement('img');
            img.className = 'lesson-image';
            img.src = slide.image;
            img.alt = slide.imageAlt || 'Lesson image';
            
            // Add loading state
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = 'Image unavailable';
                container.appendChild(placeholder);
            });
            
            container.appendChild(img);
        }
    },
    
    updateProgress(current, total) {
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        const percentage = total > 0 ? ((current + 1) / total * 100) : 0;
        fill.style.width = `${percentage}%`;
        text.textContent = `${current + 1} / ${total}`;
    },
    
    showSlide(index) {
        const slides = document.querySelectorAll('.slide-page');
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        this.updateProgress(index, slides.length);
        
        // Update counter
        const counter = document.getElementById('slideCounter');
        counter.textContent = `Slide ${index + 1} of ${slides.length}`;
        
        // Update navigation buttons
        document.getElementById('prevBtn').disabled = index === 0;
        document.getElementById('nextBtn').disabled = index === slides.length - 1;
        
        // Save progress
        App.saveProgress();
    }
};
