// Main Application Controller
const App = {
    currentLesson: null,
    currentSlideIndex: 0,
    lessonData: null,
    
    init() {
        // Initialize components
        Router.init();
        Navigation.init();
        Storage.init();
        ImageLoader.init();
        
        // Load lesson list
        this.loadLessonList();
        
        // Setup event listeners
        document.getElementById('lessonSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadLesson(e.target.value);
            }
        });
        
        document.getElementById('teacherNotesToggle').addEventListener('click', () => {
            this.toggleTeacherNotes();
        });
        
        document.getElementById('closeNotesBtn').addEventListener('click', () => {
            this.hideTeacherNotes();
        });
        
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') Navigation.prevSlide();
            if (e.key === 'ArrowRight') Navigation.nextSlide();
            if (e.key === 'n' || e.key === 'N') this.toggleTeacherNotes();
        });
        
        // Save progress periodically
        setInterval(() => {
            this.saveProgress();
        }, 30000);
        
        // Load saved state
        this.loadSavedState();
    },
    
    async loadLessonList() {
        try {
            // In production, this would fetch from a directory listing
            // For demo, we'll use a predefined list
            const lessons = [
                { id: 'demo', title: 'Demo Lesson' },
                { id: 'on-the-move-1', title: 'On the Move - Part 1' },
                { id: 'on-the-move-2', title: 'On the Move - Part 2' }
            ];
            
            const select = document.getElementById('lessonSelect');
            lessons.forEach(lesson => {
                const option = document.createElement('option');
                option.value = lesson.id;
                option.textContent = lesson.title;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading lesson list:', error);
        }
    },
    
    async loadLesson(lessonId) {
        try {
            const response = await fetch(`lessons/${lessonId}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.lessonData = await response.json();
            this.currentLesson = lessonId;
            this.currentSlideIndex = 0;
            
            // Render the lesson
            Renderer.renderLesson(this.lessonData);
            Navigation.updateNavigation(0, this.lessonData.slides.length);
            
            // Load saved progress
            const saved = Storage.loadProgress(lessonId);
            if (saved && saved.slideIndex !== undefined) {
                this.currentSlideIndex = saved.slideIndex;
                Navigation.goToSlide(saved.slideIndex);
            }
            
            // Update title
            document.title = `${this.lessonData.title} - ESL Lesson Engine`;
            
            // Preload images
            this.lessonData.slides.forEach(slide => {
                if (slide.image) {
                    ImageLoader.preloadImage(slide.image);
                }
            });
            
            // Show license
            this.showLicense();
            
        } catch (error) {
            console.error('Error loading lesson:', error);
            alert('Failed to load lesson. Please try again.');
        }
    },
    
    saveProgress() {
        if (this.currentLesson && this.currentSlideIndex !== undefined) {
            Storage.saveProgress(this.currentLesson, {
                slideIndex: this.currentSlideIndex,
                timestamp: Date.now()
            });
        }
    },
    
    loadSavedState() {
        const saved = Storage.loadAllProgress();
        if (saved && Object.keys(saved).length > 0) {
            // Auto-load the last lesson
            const lastLesson = Object.keys(saved).pop();
            if (lastLesson) {
                const select = document.getElementById('lessonSelect');
                select.value = lastLesson;
                this.loadLesson(lastLesson);
            }
        }
    },
    
    toggleTeacherNotes() {
        const panel = document.getElementById('teacherNotesPanel');
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible && this.lessonData) {
            this.showTeacherNotes();
        }
    },
    
    hideTeacherNotes() {
        document.getElementById('teacherNotesPanel').style.display = 'none';
    },
    
    showTeacherNotes() {
        const content = document.getElementById('teacherNotesContent');
        const notes = this.lessonData.teacherNotes || 'No teacher notes available for this lesson.';
        
        content.innerHTML = `
            <div class="note-section">
                <h3>Lesson Overview</h3>
                <p>${this.lessonData.description || 'No description available.'}</p>
            </div>
            <div class="note-section">
                <h3>Objectives</h3>
                ${this.lessonData.objectives ? 
                    `<ul>${this.lessonData.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>` :
                    '<p>No objectives listed.</p>'
                }
            </div>
            <div class="note-section">
                <h3>Teaching Notes</h3>
                ${typeof notes === 'string' ? 
                    `<p>${notes}</p>` :
                    notes.map(note => `<p>• ${note}</p>`).join('')
                }
            </div>
            <div class="note-section">
                <h3>Materials</h3>
                <p>${this.lessonData.materials || 'Standard classroom materials.'}</p>
            </div>
            <div class="note-section">
                <h3>Estimated Time</h3>
                <p>${this.lessonData.estimatedTime || '45-60 minutes'}</p>
            </div>
        `;
    },
    
    toggleTheme() {
        const body = document.body;
        body.classList.toggle('theme-yellow');
        
        // Save theme preference
        const currentTheme = body.classList.contains('theme-yellow') ? 'yellow' : 'default';
        Storage.saveTheme(currentTheme);
        
        // Update toggle text
        const toggle = document.getElementById('themeToggle');
        toggle.textContent = body.classList.contains('theme-yellow') ? 
            'Switch to Baltic Blue' : 
            'Switch to School Bus Yellow';
    },
    
    loadSavedTheme() {
        const theme = Storage.loadTheme();
        if (theme === 'yellow') {
            document.body.classList.add('theme-yellow');
            const toggle = document.getElementById('themeToggle');
            toggle.textContent = 'Switch to Baltic Blue';
        }
    },
    
    showLicense() {
        const panel = document.getElementById('licensePanel');
        const content = panel.querySelector('.license-content');
        
        content.innerHTML = `
            <div class="cc-license">
                <a href="https://example.com">ESL Classroom resources</a> © 1999 by <a href="https://example.com">InglesLibrePe@gmail.com</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International</a>
                <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons">
                <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution">
                <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="ShareAlike">
            </div>
        `;
        
        panel.style.display = 'block';
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
