// Slide Renderer - Complete
const Renderer = {
    currentIndex: 0,
    
    renderLesson(lessonData) {
        const container = document.getElementById('slideContent');
        container.innerHTML = '';
        
        if (!lessonData || !lessonData.slides || lessonData.slides.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem;">No slides found in this lesson.</div>';
            return;
        }
        
        lessonData.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-page';
            slideDiv.dataset.index = index;
            slideDiv.style.display = index === 0 ? 'block' : 'none';
            this.renderSlide(slide, slideDiv, index, lessonData);
            container.appendChild(slideDiv);
        });
        
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `Slide 1 of ${lessonData.slides.length}`;
        }
        
        this.updateProgress(0, lessonData.slides.length);
        if (typeof Navigation !== 'undefined') {
            Navigation.updateNavigation(0, lessonData.slides.length);
        }
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
        
        if (slide.content) {
            const p = document.createElement('p');
            p.textContent = slide.content;
            container.appendChild(p);
        }
        
        if (slide.objectives && slide.objectives.length > 0) {
            const ul = document.createElement('ul');
            slide.objectives.forEach(obj => {
                const li = document.createElement('li');
                li.textContent = obj;
                ul.appendChild(li);
            });
            container.appendChild(ul);
        }
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
            container.appendChild(div);
        }
        
        if (slide.duration) {
            const timer = document.createElement('div');
            timer.className = 'speaking-timer';
            timer.textContent = `${slide.duration}s`;
            container.appendChild(timer);
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
        
        if (slide.text && slide.answers) {
            if (typeof GapFillActivity !== 'undefined') {
                GapFillActivity.render(container, slide.text, slide.answers);
            } else {
                // Fallback simple rendering
                const div = document.createElement('div');
                div.className = 'gap-fill-text';
                div.innerHTML = slide.text.replace(/\{\{([^}]+)\}\}/g, '<input type="text" class="gap-fill-input" placeholder="...">');
                container.appendChild(div);
            }
        }
        
        this.renderContent(slide, container);
    },
    
    renderDropdown(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Dropdown Activity';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.questions) {
            if (typeof DropdownActivity !== 'undefined') {
                DropdownActivity.render(container, slide.questions);
            } else {
                // Fallback simple rendering
                const div = document.createElement('div');
                div.className = 'dropdown-activity-wrapper';
                slide.questions.forEach((q, idx) => {
                    const qDiv = document.createElement('div');
                    qDiv.innerHTML = `<p>${q.prompt}</p><select class="dropdown-select">${q.options.map(o => `<option>${o}</option>`).join('')}</select>`;
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
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.pairs) {
            if (typeof MatchingActivity !== 'undefined') {
                MatchingActivity.render(container, slide.pairs);
            } else {
                const div = document.createElement('div');
                div.className = 'matching-container';
                div.innerHTML = '<p>Matching activity</p>';
                container.appendChild(div);
            }
        }
        
        this.renderContent(slide, container);
    },
    
    renderDragDrop(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Drag & Drop Activity';
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.items && slide.categories) {
            if (typeof DragDropActivity !== 'undefined') {
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
        container.appendChild(h2);
        
        this.renderImage(slide, container);
        
        if (slide.questions) {
            if (typeof MultipleChoiceActivity !== 'undefined') {
                MultipleChoiceActivity.render(container, slide.questions);
            } else {
                const div = document.createElement('div');
                div.className = 'multiple-choice-wrapper';
                slide.questions.forEach((q, idx) => {
                    const qDiv = document.createElement('div');
                    qDiv.innerHTML = `<p>${q.prompt}</p>`;
                    q.options.forEach(o => {
                        qDiv.innerHTML += `<label class="multiple-choice-option"><input type="radio" name="q${idx}"> ${o}</label>`;
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
            container.appendChild(div);
        }
    },
    
    renderImage(slide, container) {
        if (slide.image) {
            const img = document.createElement('img');
            img.className = 'lesson-image';
            img.src = slide.image;
            img.alt = slide.imageAlt || 'Lesson image';
            
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
        if (!fill || !text) return;
        
        const percentage = total > 0 ? ((current + 1) / total * 100) : 0;
        fill.style.width = `${percentage}%`;
        text.textContent = `${current + 1} / ${total}`;
    },
    
    showSlide(index) {
        const slides = document.querySelectorAll('.slide-page');
        if (!slides || slides.length === 0) {
            console.warn('No slides found');
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
