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
        
        // Render activities if present
        if (slide.questions || slide.text || slide.words) {
            this.renderActivity(slide, container);
        }
    },
    
    renderActivity(slide, container) {
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
            renderer.render(container, slide);
        }
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
