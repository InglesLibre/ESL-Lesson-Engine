// Slide Renderer - Complete Fixed Version
const Renderer = {
    currentIndex: 0,
    
    renderLesson(lessonData) {
        const container = document.getElementById('slideContent');
        container.innerHTML = '';
        
        if (!lessonData || !lessonData.slides || lessonData.slides.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem;">No slides found in this lesson.</div>';
            return;
        }
        
        // Debug: Log how many slides we're rendering
        console.log('Rendering', lessonData.slides.length, 'slides');
        
        // Create each slide
        lessonData.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-page';
            slideDiv.dataset.index = index;
            slideDiv.style.display = 'none'; // Hide all initially
            this.renderSlide(slide, slideDiv, index, lessonData);
            container.appendChild(slideDiv);
        });
        
        // Show the first slide
        const allSlides = container.querySelectorAll('.slide-page');
        if (allSlides.length > 0) {
            allSlides[0].style.display = 'block';
        }
        
        // Update counter
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `Slide 1 of ${lessonData.slides.length}`;
        }
        
        // Update progress
        this.updateProgress(0, lessonData.slides.length);
        
        // Update navigation
        if (typeof Navigation !== 'undefined') {
            Navigation.updateNavigation(0, lessonData.slides.length);
        }
        
        console.log('Slides rendered:', allSlides.length);
    },
    
    renderSlide(slide, container, index, lessonData) {
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
        h1.style.color = 'var(--primary)';
        h1.style.textAlign = 'center';
        h1.style.marginBottom = '0.5rem';
        container.appendChild(h1);
        
        if (slide.subtitle) {
            const p = document.createElement('p');
            p.className = 'subtitle';
            p.textContent = slide.subtitle;
            p.style.textAlign = 'center';
            p.style.color = 'var(--text-medium)';
            p.style.fontSize = '1.1rem';
            container.appendChild(p);
        }
        
        this.renderImage(slide, container);
        this.renderContent(slide, container);
    },
    
    renderObjectives(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Learning Objectives';
        h2.style.color = 'var(--primary)';
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
                
                // Add checkmark
                const check = document.createElement('span');
                check.textContent = '✓';
                check.style.position = 'absolute';
                check.style.left = '0';
                check.style.color = 'var(--secondary)';
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
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.question) {
            const p = document.createElement('p');
            p.className = 'ice-breaker-question';
            p.textContent = slide.question;
            p.style.fontSize = '1.2rem';
            p.style.fontWeight = '500';
            p.style.padding = '1rem';
            p.style.background = 'var(--bg-light)';
            p.style.borderRadius = '8px';
            p.style.borderLeft = '4px solid var(--secondary)';
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
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.words && slide.words.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'vocabulary-grid';
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            grid.style.gap = '1rem';
            
            slide.words.forEach(word => {
                const item = document.createElement('div');
                item.className = 'vocab-item';
                item.style.background = 'var(--bg-light)';
                item.style.padding = '1rem';
                item.style.borderRadius = '8px';
                item.style.borderLeft = '4px solid var(--primary)';
                
                const wordSpan = document.createElement('div');
                wordSpan.className = 'word';
                wordSpan.textContent = word.word;
                wordSpan.style.fontWeight = '700';
                wordSpan.style.color = 'var(--primary)';
                wordSpan.style.fontSize = '1.1rem';
                item.appendChild(wordSpan);
                
                if (word.definition) {
                    const defSpan = document.createElement('div');
                    defSpan.className = 'definition';
                    defSpan.textContent = word.definition;
                    defSpan.style.fontSize = '0.95rem';
                    defSpan.style.color = 'var(--text-medium)';
                    defSpan.style.marginTop = '0.25rem';
                    item.appendChild(defSpan);
                }
                
                if (word.example) {
                    const exampleSpan = document.createElement('div');
                    exampleSpan.className = 'example';
                    exampleSpan.textContent = `"${word.example}"`;
                    exampleSpan.style.fontStyle = 'italic';
                    exampleSpan.style.color = 'var(--text-light)';
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
    
    renderReading(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Reading';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.text) {
            const div = document.createElement('div');
            div.className = 'reading-text';
            div.innerHTML = slide.text;
            div.style.background = 'var(--bg-light)';
            div.style.padding = '1.5rem';
            div.style.borderRadius = '8px';
            div.style.lineHeight = '1.8';
            div.style.margin = '1rem 0';
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
        
        this.renderContent(slide, container);
    },
    
    renderListening(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Listening';
        h2.style.color = 'var(--primary)';
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
            div.style.background = 'var(--bg-light)';
            div.style.padding = '1rem';
            div.style.borderRadius = '8px';
            div.style.margin = '1rem 0';
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
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'speaking-prompt';
            div.innerHTML = slide.prompt;
            div.style.fontSize = '1.1rem';
            div.style.padding = '1rem';
            div.style.background = 'var(--bg-light)';
            div.style.borderRadius = '8px';
            div.style.borderLeft = '4px solid var(--secondary)';
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
            timer.style.color = 'var(--primary)';
            timer.style.textAlign = 'center';
            timer.style.margin = '1rem 0';
            container.appendChild(timer);
        }
        
        this.renderContent(slide, container);
    },
    
    renderWriting(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Writing';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'writing-prompt';
            div.innerHTML = slide.prompt;
            div.style.fontSize = '1.1rem';
            div.style.padding = '1rem';
            div.style.background = 'var(--bg-light)';
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
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.examples && slide.examples.length > 0) {
            const div = document.createElement('div');
            div.className = 'grammar-discovery';
            div.innerHTML = `<strong>Look at these examples:</strong><ul>${slide.examples.map(e => `<li>${e}</li>`).join('')}</ul>`;
            div.style.background = 'var(--bg-light)';
            div.style.borderLeft = '4px solid var(--secondary)';
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
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        const div = document.createElement('div');
        div.className = 'grammar-rules';
        div.style.background = 'var(--primary)';
        div.style.color = 'white';
        div.style.padding = '1.5rem';
        div.style.borderRadius = '8px';
        
        if (slide.rules && slide.rules.length > 0) {
            slide.rules.forEach(rule => {
                const p = document.createElement('p');
                p.innerHTML = `<strong style="color: var(--secondary);">${rule.title}:</strong> ${rule.description}`;
                p.style.margin = '0.5rem 0';
                div.appendChild(p);
            });
        }
        
        container.appendChild(div);
        this.renderContent(slide, container);
    },
    
    renderGapFill(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Gap Fill Activity';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.text && slide.answers) {
            if (typeof GapFillActivity !== 'undefined' && GapFillActivity.render) {
                GapFillActivity.render(container, slide.text, slide.answers);
            } else {
                // Fallback simple rendering
                const div = document.createElement('div');
                div.className = 'gap-fill-text';
                div.style.lineHeight = '2.5';
                let html = slide.text.replace(/\{\{([^}]+)\}\}/g, '<input type="text" class="gap-fill-input" placeholder="..." style="padding:0.3rem 0.5rem;border:2px solid #ddd;border-radius:4px;min-width:100px;">');
                div.innerHTML = html.replace(/\n/g, '<br>');
                container.appendChild(div);
            }
        }
        
        this.renderContent(slide, container);
    },
    
    renderDropdown(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Dropdown Activity';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.questions) {
            if (typeof DropdownActivity !== 'undefined' && DropdownActivity.render) {
                DropdownActivity.render(container, slide.questions);
            } else {
                // Fallback simple rendering
                const div = document.createElement('div');
                div.className = 'dropdown-activity-wrapper';
                slide.questions.forEach((q, idx) => {
                    const qDiv = document.createElement('div');
                    qDiv.style.margin = '1rem 0';
                    qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                    const select = document.createElement('select');
                    select.className = 'dropdown-select';
                    select.style.padding = '0.5rem';
                    select.style.border = '2px solid #ddd';
                    select.style.borderRadius = '4px';
                    select.style.minWidth = '150px';
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
                    qDiv.appendChild(select);
                    div.appendChild(qDiv);
                });
                container.appendChild(div);
            }
        }
        
        this.renderContent(slide, container);
    },
    
    renderMatching(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Matching Activity';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.pairs) {
            if (typeof MatchingActivity !== 'undefined' && MatchingActivity.render) {
                MatchingActivity.render(container, slide.pairs);
            } else {
                const div = document.createElement('div');
                div.className = 'matching-container';
                div.style.display = 'grid';
                div.style.gridTemplateColumns = '1fr 1fr';
                div.style.gap = '2rem';
                div.innerHTML = '<p>Matching activity</p>';
                container.appendChild(div);
            }
        }
        
        this.renderContent(slide, container);
    },
    
    renderDragDrop(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Drag & Drop Activity';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.items && slide.categories) {
            if (typeof DragDropActivity !== 'undefined' && DragDropActivity.render) {
                DragDropActivity.render(container, slide.items, slide.categories);
            } else {
                const div = document.createElement('div');
                div.className = 'dragdrop-wrapper';
                div.innerHTML = '<p>Drag & Drop activity</p>';
                container.appendChild(div);
            }
        }
        
        this.renderContent(slide, container);
    },
    
    renderMultipleChoice(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Multiple Choice';
        h2.style.color = 'var(--primary)';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.questions) {
            if (typeof MultipleChoiceActivity !== 'undefined' && MultipleChoiceActivity.render) {
                MultipleChoiceActivity.render(container, slide.questions);
            } else {
                // Fallback simple rendering
                const div = document.createElement('div');
                div.className = 'multiple-choice-wrapper';
                slide.questions.forEach((q, idx) => {
                    const qDiv = document.createElement('div');
                    qDiv.style.margin = '1.5rem 0';
                    qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                    q.options.forEach(o => {
                        const label = document.createElement('label');
                        label.className = 'multiple-choice-option';
                        label.style.display = 'block';
                        label.style.padding = '0.5rem 1rem';
                        label.style.margin = '0.25rem 0';
                        label.style.background = 'var(--bg-light)';
                        label.style.borderRadius = '4px';
                        label.style.cursor = 'pointer';
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `q${idx}`;
                        input.value = o;
                        label.appendChild(input);
                        label.appendChild(document.createTextNode(' ' + o));
                        qDiv.appendChild(label);
                    });
                    div.appendChild(qDiv);
                });
                container.appendChild(div);
            }
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
            
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = 'Image unavailable';
                placeholder.style.background = 'var(--bg-light)';
                placeholder.style.padding = '2rem';
                placeholder.style.textAlign = 'center';
                placeholder.style.borderRadius = '8px';
                placeholder.style.color = 'var(--text-medium)';
                container.appendChild(placeholder);
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
        const slides = document.querySelectorAll('.slide-page');
        if (!slides || slides.length === 0) {
            console.warn('No slides found');
            const container = document.getElementById('slideContent');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #ff9800;">
                        <h2>No slides to display</h2>
                        <p>The lesson file appears to be empty or corrupted.</p>
                    </div>
                `;
            }
            return;
        }
        
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        this.updateProgress(index, slides.length);
        
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `Slide ${index + 1} of ${slides.length}`;
        }
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === slides.length - 1;
        
        this.currentIndex = index;
        if (typeof App !== 'undefined') {
            App.currentSlideIndex = index;
            App.saveProgress();
        }
    }
};

// Log that renderer loaded
console.log('Renderer loaded successfully');
