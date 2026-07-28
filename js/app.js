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
        
        // Load saved theme FIRST
        this.loadSavedTheme();
        
        // Load lesson list automatically
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
            // Method 1: Try to load manifest
            const lessons = await this.fetchLessonList();
            
            const select = document.getElementById('lessonSelect');
            // Clear existing options (except the default)
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Sort lessons alphabetically by title
            lessons.sort((a, b) => a.title.localeCompare(b.title));
            
            lessons.forEach(lesson => {
                const option = document.createElement('option');
                option.value = lesson.id;
                option.textContent = lesson.title;
                select.appendChild(option);
            });
            
            // If lessons found, enable the select
            if (lessons.length > 0) {
                select.disabled = false;
            }
            
            console.log(`Loaded ${lessons.length} lessons`);
            
        } catch (error) {
            console.error('Error loading lesson list:', error);
            // Fallback: try manual list
            this.loadManualLessonList();
        }
    },
    
    async fetchLessonList() {
        // Method 1: Try to get list from lessons.json manifest
        try {
            const response = await fetch('lessons/lessons.json');
            if (response.ok) {
                const manifest = await response.json();
                return manifest.lessons || [];
            }
        } catch (e) {
            console.log('No lessons.json manifest found');
        }
        
        // Method 2: Try to scan for JSON files
        try {
            // Try GitHub Pages API first
            if (window.location.hostname.includes('github.io')) {
                const repoPath = window.location.pathname.split('/').slice(1, 2).join('/');
                const apiUrl = `https://api.github.com/repos/${window.location.hostname.split('.')[0]}/${repoPath}/contents/lessons`;
                
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const files = await response.json();
                    const jsonFiles = files.filter(file => 
                        file.name.endsWith('.json') && file.name !== 'lessons.json'
                    );
                    
                    const lessons = await Promise.all(jsonFiles.map(async (file) => {
                        try {
                            const lessonResponse = await fetch(`lessons/${file.name}`);
                            if (lessonResponse.ok) {
                                const data = await lessonResponse.json();
                                return {
                                    id: file.name.replace('.json', ''),
                                    title: data.title || file.name.replace('.json', '').replace(/-/g, ' ')
                                };
                            }
                        } catch (e) {
                            console.warn(`Could not load ${file.name}`);
                        }
                        return {
                            id: file.name.replace('.json', ''),
                            title: file.name.replace('.json', '').replace(/-/g, ' ')
                        };
                    }));
                    
                    if (lessons.length > 0) {
                        return lessons;
                    }
                }
            }
        } catch (e) {
            console.log('Could not scan directory');
        }
        
        // Method 3: Manual list
        return this.getManualLessonList();
    },
    
    getManualLessonList() {
        // This is the fallback list
        const manualLessons = [
            { id: 'demo', title: 'Demo Lesson' },
            { id: 'on-the-move-1', title: 'On the Move - Part 1' },
            { id: 'on-the-move-2', title: 'On the Move - Part 2' },
            { id: 'on-the-move-full', title: 'On the Move - Full Lesson' }
        ];
        
        // Save to localStorage for offline use
        localStorage.setItem('esl_lesson_manifest', JSON.stringify(manualLessons));
        
        return manualLessons;
    },
    
    loadManualLessonList() {
        const select = document.getElementById('lessonSelect');
        const lessons = this.getManualLessonList();
        
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson.id;
            option.textContent = lesson.title;
            select.appendChild(option);
        });
    },
    
    async loadLesson(lessonId) {
        try {
            // Show loading state
            const slideContent = document.getElementById('slideContent');
            slideContent.innerHTML = '<div style="text-align: center; padding: 3rem;">Loading lesson...</div>';
            
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
            
            // Save current lesson to localStorage
            localStorage.setItem('esl_last_lesson', lessonId);
            
        } catch (error) {
            console.error('Error loading lesson:', error);
            const slideContent = document.getElementById('slideContent');
            slideContent.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #f44336;">
                    <h2>Failed to load lesson</h2>
                    <p>${error.message}</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Please check that the file exists in the lessons folder.</p>
                </div>
            `;
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
            const lastLesson = localStorage.getItem('esl_last_lesson');
            if (lastLesson && saved[lastLesson]) {
                const select = document.getElementById('lessonSelect');
                select.value = lastLesson;
                this.loadLesson(lastLesson);
                return;
            }
            
            // If no last lesson, load the first one
            const firstLesson = Object.keys(saved)[0];
            if (firstLesson) {
                const select = document.getElementById('lessonSelect');
                select.value = firstLesson;
                this.loadLesson(firstLesson);
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
            <div class="note-section">
                <h3>Level</h3>
                <p>${this.lessonData.level || 'Not specified'}</p>
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
        } else {
            // Ensure default theme (Baltic Blue) is applied
            document.body.classList.remove('theme-yellow');
            const toggle = document.getElementById('themeToggle');
            toggle.textContent = 'Switch to School Bus Yellow';
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
