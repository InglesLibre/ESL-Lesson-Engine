// Slide Renderer - Complete Fixed Version
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
        
        // Clear the container
        container.innerHTML = '';
        
        if (!lessonData) {
            console.error('No lesson data provided');
            container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #f44336;">No lesson data provided</div>';
            return;
        }
        
        if (!lessonData.slides || lessonData.slides.length === 0) {
            console.error('No slides found');
            container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #ff9800;">No slides found in this lesson.</div>';
            return;
        }
        
        console.log('Rendering', lessonData.slides.length, 'slides');
        
        // Clear the slides array
        this.slideElements = [];
        
        // Create each slide and append to container
        lessonData.slides.forEach((slide, index) => {
            console.log(`Creating slide ${index}:`, slide.type);
            
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-page';
            slideDiv.dataset.index = index;
            slideDiv.style.display = 'none';
            slideDiv.style.padding = '20px';
            slideDiv.style.background = '#ffffff';
            slideDiv.style.borderRadius = '8px';
            slideDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            // Render the slide content
            this.renderSlide(slide, slideDiv, index, lessonData);
            
            // Append to container
            container.appendChild(slideDiv);
            this.slideElements.push(slideDiv);
            console.log(`Slide ${index} appended to container, total slides now: ${this.slideElements.length}`);
        });
        
        // Update Navigation with total slides
        if (typeof Navigation !== 'undefined') {
            Navigation.totalSlides = this.slideElements.length;
            Navigation.currentIndex = 0;
            console.log('Navigation totalSlides set to:', Navigation.totalSlides);
        }
        
        console.log('Total slides in array:', this.slideElements.length);
        
        if (this.slideElements.length > 0) {
            // Update counter
            const counter = document.getElementById('slideCounter');
            if (counter) {
                counter.textContent = `Slide 1 of ${lessonData.slides.length}`;
            }
            
            // Update progress
            this.updateProgress(0, lessonData.slides.length);
            
            // Show the first slide
            this.showSlide(0);
            
            console.log('Lesson rendered successfully');
        } else {
            console.error('No slides were created!');
            container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #f44336;">No slides were created!</div>';
        }
    },
    
    renderSlide(slide, container, index, lessonData) {
        console.log(`renderSlide called for slide ${index}, type: ${slide.type}`);
        
        // Clear any existing content
        container.innerHTML = '';
        
        const slideType = slide.type || 'content';
        container.className = `slide-${slideType.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Call the appropriate render method based on slide type
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
        slideNumber.style.marginTop = '1.5rem';
        slideNumber.style.paddingTop = '1rem';
        slideNumber.style.borderTop = '1px solid #e0e0e0';
        slideNumber.style.color = '#888';
        slideNumber.style.fontSize = '0.9rem';
        container.appendChild(slideNumber);
        
        // Add CC license after each slide
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
    
    renderTitle(slide, container) {
        const h1 = document.createElement('h1');
        h1.textContent = slide.title || 'Untitled';
        h1.style.color = '#1a3a5c';
        h1.style.textAlign = 'center';
        h1.style.marginBottom = '0.5rem';
        h1.style.fontSize = '2rem';
        container.appendChild(h1);
        
        if (slide.subtitle) {
            const p = document.createElement('p');
            p.textContent = slide.subtitle;
            p.style.textAlign = 'center';
            p.style.color = '#4a4a6a';
            p.style.fontSize = '1.1rem';
            container.appendChild(p);
        }
        
        this.renderImage(slide, container);
        this.renderContent(slide, container);
    },
    
    renderObjectives(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Learning Objectives';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        if (slide.content) {
            const p = document.createElement('p');
            p.textContent = slide.content;
            container.appendChild(p);
        }
        
        if (slide.objectives && slide.objectives.length > 0) {
            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';
            slide.objectives.forEach(obj => {
                const li = document.createElement('li');
                li.textContent = obj;
                li.style.padding = '0.5rem 0';
                li.style.borderBottom = '1px solid #f0f0f0';
                li.style.paddingLeft = '1.5rem';
                li.style.position = 'relative';
                
                const check = document.createElement('span');
                check.textContent = '✓';
                check.style.position = 'absolute';
                check.style.left = '0';
                check.style.color = '#f5c518';
                check.style.fontWeight = 'bold';
                li.prepend(check);
                
                ul.appendChild(li);
            });
            container.appendChild(ul);
        }
    },
    
    renderIceBreaker(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Ice Breaker';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.question) {
            const p = document.createElement('p');
            p.className = 'ice-breaker-question';
            p.textContent = slide.question;
            p.style.fontSize = '1.2rem';
            p.style.fontWeight = '500';
            p.style.padding = '1rem';
            p.style.background = '#f0f4f8';
            p.style.borderRadius = '8px';
            p.style.borderLeft = '4px solid #f5c518';
            container.appendChild(p);
        }
        
        if (slide.instructions) {
            const div = document.createElement('div');
            div.className = 'ice-breaker-instructions';
            div.innerHTML = `<strong>Instructions:</strong> ${slide.instructions}`;
            div.style.marginTop = '1rem';
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderVocabulary(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Vocabulary';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.words && slide.words.length > 0) {
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            grid.style.gap = '1rem';
            
            slide.words.forEach(word => {
                const item = document.createElement('div');
                item.style.background = '#f0f4f8';
                item.style.padding = '1rem';
                item.style.borderRadius = '8px';
                item.style.borderLeft = '4px solid #1a3a5c';
                
                const wordSpan = document.createElement('div');
                wordSpan.textContent = word.word;
                wordSpan.style.fontWeight = '700';
                wordSpan.style.color = '#1a3a5c';
                wordSpan.style.fontSize = '1.1rem';
                item.appendChild(wordSpan);
                
                if (word.definition) {
                    const defSpan = document.createElement('div');
                    defSpan.textContent = word.definition;
                    defSpan.style.fontSize = '0.95rem';
                    defSpan.style.color = '#4a4a6a';
                    defSpan.style.marginTop = '0.25rem';
                    item.appendChild(defSpan);
                }
                
                if (word.example) {
                    const exampleSpan = document.createElement('div');
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
        }
        
        this.renderContent(slide, container);
    },
    
    renderGapFill(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Gap Fill Activity';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.text && slide.answers) {
            const div = document.createElement('div');
            div.style.lineHeight = '2.5';
            let html = slide.text;
            slide.answers.forEach((answer) => {
                html = html.replace(/\{\{[^}]*\}\}/, `<input type="text" class="gap-fill-input" placeholder="..." style="padding:0.3rem 0.5rem;border:2px solid #ddd;border-radius:4px;min-width:100px;margin:0 0.25rem;" data-answer="${answer}">`);
            });
            div.innerHTML = html.replace(/\n/g, '<br>');
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderMultipleChoice(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Multiple Choice';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.questions) {
            const wrapper = document.createElement('div');
            wrapper.className = 'multiple-choice-wrapper';
            
            slide.questions.forEach((q, idx) => {
                const qDiv = document.createElement('div');
                qDiv.className = 'multiple-choice-question';
                qDiv.style.margin = '1.5rem 0';
                qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                
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
                    });
                    
                    optionsDiv.appendChild(label);
                });
                
                qDiv.appendChild(optionsDiv);
                wrapper.appendChild(qDiv);
            });
            
            container.appendChild(wrapper);
        }
        
        this.renderContent(slide, container);
    },
    
    renderDropdown(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Dropdown Activity';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.questions) {
            const wrapper = document.createElement('div');
            wrapper.className = 'dropdown-activity-wrapper';
            
            slide.questions.forEach((q, idx) => {
                const qDiv = document.createElement('div');
                qDiv.className = 'dropdown-question';
                qDiv.style.margin = '1rem 0';
                qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                
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
        }
        
        this.renderContent(slide, container);
    },
    
    renderSpeaking(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = slide.type || 'Speaking';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'speaking-prompt';
            div.innerHTML = slide.prompt;
            div.style.fontSize = '1.1rem';
            div.style.padding = '1rem';
            div.style.background = '#f0f4f8';
            div.style.borderRadius = '8px';
            div.style.borderLeft = '4px solid #f5c518';
            container.appendChild(div);
        }
        
        if (slide.questions && slide.questions.length > 0) {
            const ol = document.createElement('ol');
            slide.questions.forEach(q => {
                const li = document.createElement('li');
                li.textContent = q;
                ol.appendChild(li);
            });
            container.appendChild(ol);
        }
        
        if (slide.tips && slide.tips.length > 0) {
            const div = document.createElement('div');
            div.className = 'speaking-tips';
            div.innerHTML = `<strong>Tips:</strong><ul>${slide.tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
            div.style.background = '#e8f5e9';
            div.style.padding = '1rem';
            div.style.borderRadius = '8px';
            div.style.margin = '1rem 0';
            container.appendChild(div);
        }
        
        if (slide.duration) {
            const timer = document.createElement('div');
            timer.className = 'speaking-timer';
            timer.textContent = `${slide.duration}s`;
            timer.style.fontSize = '3rem';
            timer.style.fontWeight = '700';
            timer.style.color = '#1a3a5c';
            timer.style.textAlign = 'center';
            timer.style.margin = '1rem 0';
            container.appendChild(timer);
        }
        
        this.renderContent(slide, container);
    },
    
    renderReading(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Reading';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.text) {
            const div = document.createElement('div');
            div.className = 'reading-text';
            div.innerHTML = slide.text;
            div.style.background = '#f0f4f8';
            div.style.padding = '1.5rem';
            div.style.borderRadius = '8px';
            div.style.lineHeight = '1.8';
            div.style.margin = '1rem 0';
            container.appendChild(div);
        }
        
        if (slide.content) {
            const div = document.createElement('div');
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
        
        if (slide.questions && slide.questions.length > 0) {
            const h3 = document.createElement('h3');
            h3.textContent = 'Comprehension Questions';
            h3.style.marginTop = '1rem';
            container.appendChild(h3);
            
            const ol = document.createElement('ol');
            slide.questions.forEach(q => {
                const li = document.createElement('li');
                li.textContent = q;
                ol.appendChild(li);
            });
            container.appendChild(ol);
        }
    },
    
    renderListening(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Listening';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.audioUrl) {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = slide.audioUrl;
            audio.style.width = '100%';
            audio.style.margin = '1rem 0';
            container.appendChild(audio);
        }
        
        if (slide.script) {
            const div = document.createElement('div');
            div.className = 'listening-script';
            div.innerHTML = `<strong>Script:</strong> ${slide.script}`;
            div.style.background = '#f0f4f8';
            div.style.padding = '1rem';
            div.style.borderRadius = '8px';
            div.style.margin = '1rem 0';
            container.appendChild(div);
        }
        
        if (slide.content) {
            const div = document.createElement('div');
            div.innerHTML = slide.content;
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
    },
    
    renderWriting(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Writing';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'writing-prompt';
            div.innerHTML = slide.prompt;
            div.style.fontSize = '1.1rem';
            div.style.padding = '1rem';
            div.style.background = '#f0f4f8';
            div.style.borderRadius = '8px';
            container.appendChild(div);
        }
        
        if (slide.guidelines && slide.guidelines.length > 0) {
            const div = document.createElement('div');
            div.className = 'writing-guidelines';
            div.innerHTML = `<strong>Guidelines:</strong><ul>${slide.guidelines.map(g => `<li>${g}</li>`).join('')}</ul>`;
            div.style.margin = '1rem 0';
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderGrammarDiscovery(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Grammar Discovery';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.examples && slide.examples.length > 0) {
            const div = document.createElement('div');
            div.className = 'grammar-discovery';
            div.innerHTML = `<strong>Look at these examples:</strong><ul>${slide.examples.map(e => `<li>${e}</li>`).join('')}</ul>`;
            div.style.background = '#f0f4f8';
            div.style.borderLeft = '4px solid #f5c518';
            div.style.padding = '1.5rem';
            div.style.borderRadius = '8px';
            container.appendChild(div);
        }
        
        if (slide.question) {
            const p = document.createElement('p');
            p.className = 'grammar-question';
            p.textContent = slide.question;
            p.style.fontWeight = '500';
            p.style.marginTop = '1rem';
            container.appendChild(p);
        }
        
        this.renderContent(slide, container);
    },
    
    renderGrammarRules(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Grammar Rules';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const div = document.createElement('div');
        div.className = 'grammar-rules';
        div.style.background = '#1a3a5c';
        div.style.color = 'white';
        div.style.padding = '1.5rem';
        div.style.borderRadius = '8px';
        
        if (slide.rules && slide.rules.length > 0) {
            slide.rules.forEach(rule => {
                const p = document.createElement('p');
                p.innerHTML = `<strong style="color: #f5c518;">${rule.title}:</strong> ${rule.description}`;
                p.style.margin = '0.5rem 0';
                div.appendChild(p);
            });
        }
        
        container.appendChild(div);
        this.renderContent(slide, container);
    },
    
    renderMatching(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Matching Activity';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.pairs) {
            const div = document.createElement('div');
            div.className = 'matching-container';
            div.style.display = 'grid';
            div.style.gridTemplateColumns = '1fr 1fr';
            div.style.gap = '2rem';
            
            const leftCol = document.createElement('div');
            const rightCol = document.createElement('div');
            
            slide.pairs.forEach((pair, index) => {
                const leftItem = document.createElement('div');
                leftItem.className = 'matching-item';
                leftItem.textContent = pair.left;
                leftItem.style.padding = '0.5rem 1rem';
                leftItem.style.margin = '0.25rem 0';
                leftItem.style.background = '#f0f4f8';
                leftItem.style.borderRadius = '4px';
                leftItem.style.cursor = 'pointer';
                leftItem.dataset.index = index;
                leftCol.appendChild(leftItem);
                
                const rightItem = document.createElement('div');
                rightItem.className = 'matching-item';
                rightItem.textContent = pair.right;
                rightItem.style.padding = '0.5rem 1rem';
                rightItem.style.margin = '0.25rem 0';
                rightItem.style.background = '#f0f4f8';
                rightItem.style.borderRadius = '4px';
                rightItem.style.cursor = 'pointer';
                rightItem.dataset.index = index;
                rightCol.appendChild(rightItem);
            });
            
            div.appendChild(leftCol);
            div.appendChild(rightCol);
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderDragDrop(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Drag & Drop Activity';
        h2.style.color = '#1a3a5c';
        h2.style.fontSize = '1.5rem';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.items && slide.categories) {
            const div = document.createElement('div');
            div.className = 'dragdrop-wrapper';
            div.style.display = 'flex';
            div.style.flexWrap = 'wrap';
            div.style.gap = '2rem';
            div.style.margin = '1rem 0';
            
            // Items
            const itemsDiv = document.createElement('div');
            itemsDiv.style.flex = '1';
            itemsDiv.style.minWidth = '200px';
            itemsDiv.innerHTML = '<h4>Items</h4>';
            
            slide.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'drag-item';
                itemDiv.textContent = item.text;
                itemDiv.style.padding = '0.5rem 1rem';
                itemDiv.style.margin = '0.25rem 0';
                itemDiv.style.background = '#1a3a5c';
                itemDiv.style.color = 'white';
                itemDiv.style.borderRadius = '4px';
                itemDiv.style.cursor = 'grab';
                itemDiv.draggable = true;
                itemDiv.dataset.category = item.category;
                itemsDiv.appendChild(itemDiv);
            });
            
            // Categories
            const categoriesDiv = document.createElement('div');
            categoriesDiv.style.flex = '1';
            categoriesDiv.style.minWidth = '200px';
            categoriesDiv.innerHTML = '<h4>Categories</h4>';
            
            slide.categories.forEach(category => {
                const zone = document.createElement('div');
                zone.className = 'drop-zone';
                zone.textContent = category.name;
                zone.style.padding = '1rem';
                zone.style.margin = '0.5rem 0';
                zone.style.border = '2px dashed #999';
                zone.style.borderRadius = '8px';
                zone.style.minHeight = '80px';
                zone.style.background = '#f9f9f9';
                zone.dataset.category = category.name;
                categoriesDiv.appendChild(zone);
            });
            
            div.appendChild(itemsDiv);
            div.appendChild(categoriesDiv);
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderContent(slide, container) {
        if (slide.content) {
            const div = document.createElement('div');
            div.className = 'slide-content-text';
            div.innerHTML = slide.content;
            div.style.marginTop = '1rem';
            container.appendChild(div);
        }
    },
    
    renderImage(slide, container) {
        if (slide.image) {
            const img = document.createElement('img');
            img.className = 'lesson-image';
            img.src = slide.image;
            img.alt = slide.imageAlt || 'Lesson image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.margin = '1rem 0';
            
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = 'Image unavailable';
                placeholder.style.background = '#f0f4f8';
                placeholder.style.padding = '2rem';
                placeholder.style.textAlign = 'center';
                placeholder.style.borderRadius = '8px';
                placeholder.style.color = '#666';
                this.parentNode.insertBefore(placeholder, this);
            });
            
            container.appendChild(img);
        }
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
        if (!container) {
            console.error('Container not found');
            return;
        }
        
        // Use the stored slide elements
        console.log('Using stored slides array, length:', this.slideElements.length);
        
        if (this.slideElements.length === 0) {
            console.warn('No slides in stored array');
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #ff9800;">
                    <h2>No slides to display</h2>
                    <p>The lesson file appears to be empty or corrupted.</p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        Try selecting a different lesson from the dropdown.
                    </p>
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
        if (prevBtn) {
            prevBtn.disabled = index === 0;
            console.log('Prev button disabled:', prevBtn.disabled);
        }
        if (nextBtn) {
            nextBtn.disabled = index === this.slideElements.length - 1;
            console.log('Next button disabled:', nextBtn.disabled);
        }
        
        // Update navigation state
        if (typeof Navigation !== 'undefined') {
            Navigation.currentIndex = index;
            Navigation.totalSlides = this.slideElements.length;
            console.log('Updated Navigation state - currentIndex:', Navigation.currentIndex, 'totalSlides:', Navigation.totalSlides);
        }
        
        this.currentIndex = index;
        if (typeof App !== 'undefined') {
            App.currentSlideIndex = index;
            App.saveProgress();
        }
        
        console.log('Slide display updated, showing slide', index);
    }
};

console.log('Renderer loaded successfully');
