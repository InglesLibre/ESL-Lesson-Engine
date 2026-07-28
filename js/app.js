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
            // First try to load from manifest
            let lessons = [];
            
            try {
                const response = await fetch('lessons/lessons.json');
                if (response.ok) {
                    const manifest = await response.json();
                    lessons = manifest.lessons || [];
                    console.log('Loaded lessons from manifest');
                }
            } catch (e) {
                console.log('No lessons.json found');
            }
            
            // If no lessons from manifest, try scanning
            if (lessons.length === 0) {
                lessons = await this.scanForLessons();
            }
            
            // If still no lessons, use manual list
            if (lessons.length === 0) {
                lessons = this.getManualLessonList();
            }
            
            // Validate lessons - check if files exist
            const validLessons = [];
            for (const lesson of lessons) {
                try {
                    const response = await fetch(`lessons/${lesson.id}.json`);
                    if (response.ok) {
                        validLessons.push(lesson);
                    } else {
                        console.warn(`Lesson ${lesson.id} not found, skipping`);
                    }
                } catch (e) {
                    console.warn(`Could not verify lesson ${lesson.id}`);
                }
            }
            
            // Update the dropdown
            this.populateDropdown(validLessons);
            
            console.log(`Loaded ${validLessons.length} valid lessons`);
            
        } catch (error) {
            console.error('Error loading lesson list:', error);
            // Fallback to manual list
            const manualLessons = this.getManualLessonList();
            this.populateDropdown(manualLessons);
        }
    },
    
    async scanForLessons() {
        const lessons = [];
        
        // Try GitHub API if on GitHub Pages
        try {
            if (window.location.hostname.includes('github.io')) {
                const repoName = window.location.pathname.split('/')[1] || '';
                const apiUrl = `https://api.github.com/repos/${window.location.hostname.split('.')[0]}/${repoName}/contents/lessons`;
                
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const files = await response.json();
                    const jsonFiles = files.filter(file => 
                        file.name.endsWith('.json') && 
                        file.name !== 'lessons.json'
                    );
                    
                    for (const file of jsonFiles) {
                        try {
                            const lessonResponse = await fetch(`lessons/${file.name}`);
                            if (lessonResponse.ok) {
                                const data = await lessonResponse.json();
                                lessons.push({
                                    id: file.name.replace('.json', ''),
                                    title: data.title || file.name.replace('.json', '').replace(/-/g, ' ')
                                });
                            }
                        } catch (e) {
                            console.warn(`Could not load ${file.name}`);
                        }
                    }
                }
            }
        } catch (e) {
            console.log('Could not scan via GitHub API');
        }
        
        return lessons;
    },
    
    getManualLessonList() {
        // Only include lessons that actually exist
        const existingLessons = [];
        
        // Check which lessons exist by trying to fetch them
        const possibleLessons = [
            { id: 'test-lesson', title: 'Test Lesson' },
            { id: 'on-the-move-full', title: 'On the Move - Full Lesson' }
        ];
        
        // Return the list - the app will validate them
        return possibleLessons;
    },
    
    populateDropdown(lessons) {
        const select = document.getElementById('lessonSelect');
        
        // Clear existing options (keep the first default option)
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
        
        // If no lessons found, show message
        if (lessons.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No lessons found';
            option.disabled = true;
            select.appendChild(option);
        }
        
        // Enable the select
        select.disabled = false;
    },
    
    async loadLesson(lessonId) {
        try {
            // Show loading state
            const slideContent = document.getElementById('slideContent');
            slideContent.innerHTML = '<div style="text-align: center; padding: 3rem;">Loading lesson...</div>';
            
            const response = await fetch(`lessons/${lessonId}.json`);
            if (!response.ok) {
                throw new Error(`Lesson "${lessonId}" not found (404)`);
            }
            
            this.lessonData = await response.json();
            this.currentLesson = lessonId;
            this.currentSlideIndex = 0;
            
            // Render the lesson
            Renderer.renderLesson(this.lessonData);
            
            // Get slide count
            const slides = document.querySelectorAll('.slide-page');
            const totalSlides = slides.length;
            
            // Update navigation
            Navigation.updateNavigation(0, totalSlides);
            
            // Show first slide
            Renderer.showSlide(0);
            
            // Load saved progress
            const saved = Storage.loadProgress(lessonId);
            if (saved && saved.slideIndex !== undefined && saved.slideIndex < totalSlides) {
                this.currentSlideIndex = saved.slideIndex;
                Renderer.showSlide(saved.slideIndex);
                Navigation.updateNavigation(saved.slideIndex, totalSlides);
            }
            
            // Update title
            document.title = `${this.lessonData.title} - ESL Lesson Engine`;
            
            // Preload images (if any)
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
                    <p style="margin-top: 1rem;">${error.message}</p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        The lesson file "lessons/${lessonId}.json" was not found.
                    </p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        Please check that the file exists in the lessons folder.
                    </p>
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
                // Check if the option exists
                let optionExists = false;
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === lastLesson) {
                        optionExists = true;
                        break;
                    }
                }
                if (optionExists) {
                    select.value = lastLesson;
                    this.loadLesson(lastLesson);
                    return;
                }
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
            document.body.classList.remove('theme-yellow');
            const toggle = document.getElementById('themeToggle');
            toggle.textContent = 'Switch to School Bus Yellow';
        }
    },
    
    showLicense() {
        // License is now shown per slide in renderer
        // This method is kept for compatibility but does nothing
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
