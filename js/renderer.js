// Slide Renderer
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
        
        // Update total slides
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `Slide 1 of ${lessonData.slides.length}`;
        }
        
        // Update progress
        this.updateProgress(0, lessonData.slides.length);
        
        // Update navigation
        Navigation.updateNavigation(0, lessonData.slides.length);
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
    
    // ... (all the render methods from previous code go here)
    // Make sure to include all render methods: renderTitle, renderObjectives, etc.
    
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
        
        // Ensure index is within bounds
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        // Show/hide slides
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        // Update progress
        this.updateProgress(index, slides.length);
        
        // Update counter
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `Slide ${index + 1} of ${slides.length}`;
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === slides.length - 1;
        
        // Store current index
        this.currentIndex = index;
        if (App && App.currentSlideIndex !== undefined) {
            App.currentSlideIndex = index;
        }
        
        // Save progress
        if (App && App.saveProgress) {
            App.saveProgress();
        }
    }
};
