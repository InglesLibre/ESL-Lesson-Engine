// Slide Renderer - Final Fixed Version
const Renderer = {
    currentIndex: 0,
    slides: [],
    
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
        
        // Store slides for later use
        this.slides = [];
        
        // Create each slide and append to container
        lessonData.slides.forEach((slide, index) => {
            console.log(`Creating slide ${index}:`, slide.type);
            
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-page';
            slideDiv.dataset.index = index;
            slideDiv.style.display = 'none'; // Hide all initially
            slideDiv.style.padding = '20px';
            slideDiv.style.background = 'var(--bg-white, #ffffff)';
            slideDiv.style.borderRadius = '8px';
            slideDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            // Render the slide content
            this.renderSlide(slide, slideDiv, index, lessonData);
            
            // Append to container
            container.appendChild(slideDiv);
            this.slides.push(slideDiv);
            console.log(`Slide ${index} appended to container`);
        });
        
        // Get all slides from container
        const allSlides = container.querySelectorAll('.slide-page');
        console.log('Total slides created:', allSlides.length);
        
        if (allSlides.length > 0) {
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
        container.appendChild(h1);
        
        if (slide.subtitle) {
            const p = document.createElement('p');
            p.textContent = slide.subtitle;
            p.style.textAlign = 'center';
            p.style.color = '#4a4a6a';
            p.style.fontSize = '1.1rem';
            container.appendChild(p);
        }
        
        this.renderContent(slide, container);
    },
    
    renderObjectives(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Learning Objectives';
        h2.style.color = '#1a3a5c';
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
    
    renderVocabulary(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Vocabulary';
        h2.style.color = '#1a3a5c';
        container.appendChild(h2);
        
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
        container.appendChild(h2);
        
        if (slide.text && slide.answers) {
            const div = document.createElement('div');
            div.style.lineHeight = '2.5';
            let html = slide.text.replace(/\{\{([^}]+)\}\}/g, function(match, p1) {
                return `<input type="text" class="gap-fill-input" placeholder="..." style="padding:0.3rem 0.5rem;border:2px solid #ddd;border-radius:4px;min-width:100px;margin:0 0.25rem;" data-answer="${p1}">`;
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
        container.appendChild(h2);
        
        if (slide.questions) {
            const wrapper = document.createElement('div');
            slide.questions.forEach((q, idx) => {
                const qDiv = document.createElement('div');
                qDiv.style.margin = '1.5rem 0';
                qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                
                q.options.forEach(o => {
                    const label = document.createElement('label');
                    label.style.display = 'block';
                    label.style.padding = '0.5rem 1rem';
                    label.style.margin = '0.25rem 0';
                    label.style.background = '#f0f4f8';
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
        container.appendChild(h2);
        
        if (slide.questions) {
            const wrapper = document.createElement('div');
            slide.questions.forEach((q, idx) => {
                const qDiv = document.createElement('div');
                qDiv.style.margin = '1rem 0';
                qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.prompt}</p>`;
                
                const select = document.createElement('select');
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
        container.appendChild(h2);
        
        if (slide.prompt) {
            const div = document.createElement('div');
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
            div.innerHTML = `<strong>Tips:</strong><ul>${slide.tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
            div.style.background = '#e8f5e9';
            div.style.padding = '1rem';
            div.style.borderRadius = '8px';
            div.style.margin = '1rem 0';
            container.appendChild(div);
        }
        
        if (slide.duration) {
            const timer = document.createElement('div');
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
        container.appendChild(h2);
        
        if (slide.text) {
            const div = document.createElement('div');
            div.innerHTML = slide.text;
            div.style.background = '#f0f4f8';
            div.style.padding = '1.5rem';
            div.style.borderRadius = '8px';
            div.style.lineHeight = '1.8';
            div.style.margin = '1rem 0';
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderListening(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Listening';
        h2.style.color = '#1a3a5c';
        container.appendChild(h2);
        
        if (slide.content) {
            const div = document.createElement('div');
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
    },
    
    renderWriting(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Writing';
        h2.style.color = '#1a3a5c';
        container.appendChild(h2);
        
        if (slide.prompt) {
            const div = document.createElement('div');
            div.innerHTML = slide.prompt;
            div.style.fontSize = '1.1rem';
            div.style.padding = '1rem';
            div.style.background = '#f0f4f8';
            div.style.borderRadius = '8px';
            container.appendChild(div);
        }
        
        this.renderContent(slide, container);
    },
    
    renderGrammarDiscovery(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Grammar Discovery';
        h2.style.color = '#1a3a5c';
        container.appendChild(h2);
        
        if (slide.content) {
            const div = document.createElement('div');
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
    },
    
    renderGrammarRules(slide, container) {
        const h2 = document.createElement('h2');
        h2.textContent = 'Grammar Rules';
        h2.style.color = '#1a3a5c';
        container.appendChild(h2);
        
        if (slide.rules) {
            const div = document.createElement('div');
            div.style.background = '#1a3a5c';
            div.style.color = 'white';
            div.style.padding = '1.5rem';
            div.style.borderRadius = '8px';
            
            slide.rules.forEach(rule => {
                const p = document.createElement('p');
                p.innerHTML = `<strong style="color: #f5c518;">${rule.title}:</strong> ${rule.description}`;
                p.style.margin = '0.5rem 0';
                div.appendChild(p);
            });
            container.appendChild(div);
        }
    },
    
    renderContent(slide, container) {
        if (slide.content) {
            const div = document.createElement('div');
            div.innerHTML = slide.content;
            div.style.marginTop = '1rem';
            container.appendChild(div);
        }
    },
    
    renderImage(slide, container) {
        if (slide.image) {
            const img = document.createElement('img');
            img.src = slide.image;
            img.alt = slide.imageAlt || 'Lesson image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.margin = '1rem 0';
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
        
        const slides = container.querySelectorAll('.slide-page');
        console.log('Found slides in showSlide:', slides.length);
        
        if (!slides || slides.length === 0) {
            console.warn('No slides found in container');
            // Try to find slides in the container's children
            const children = container.children;
            console.log('Container children:', children.length);
            
            // Check if any children have the slide-page class
            let hasSlideClass = false;
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList && children[i].classList.contains('slide-page')) {
                    hasSlideClass = true;
                    break;
                }
            }
            
            if (!hasSlideClass) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #ff9800;">
                        <h2>No slides to display</h2>
                        <p>The lesson file appears to be empty or corrupted.</p>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                            Try selecting a different lesson from the dropdown.
                        </p>
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
        
        console.log('Slide display updated, showing slide', index);
    }
};

console.log('Renderer loaded successfully');
