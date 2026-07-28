// Main Application Controller
const App = {
    currentLesson: null,
    currentSlideIndex: 0,
    lessonData: null,
    
    init() {
        console.log('App initializing...');
        
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
        const lessonSelect = document.getElementById('lessonSelect');
        if (lessonSelect) {
            lessonSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadLesson(e.target.value);
                }
            });
        }
        
        const teacherNotesToggle = document.getElementById('teacherNotesToggle');
        if (teacherNotesToggle) {
            teacherNotesToggle.addEventListener('click', () => {
                this.toggleTeacherNotes();
            });
        }
        
        const closeNotesBtn = document.getElementById('closeNotesBtn');
        if (closeNotesBtn) {
            closeNotesBtn.addEventListener('click', () => {
                this.hideTeacherNotes();
            });
        }
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
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
        
        // Load saved state AFTER lesson list is loaded
        // We'll handle this in loadLessonList completion
        
        console.log('App initialized');
    },
    
    async loadLessonList() {
        console.log('Loading lesson list...');
        
        try {
            let lessons = [];
            
            // Try to load from manifest
            try {
                const response = await fetch('lessons/lessons.json');
                if (response.ok) {
                    const manifest = await response.json();
                    lessons = manifest.lessons || [];
                    console.log('Loaded lessons from manifest:', lessons);
                } else {
                    console.log('lessons.json not found, using manual list');
                }
            } catch (e) {
                console.log('Error loading manifest:', e);
            }
            
            // If no lessons from manifest, use manual list
            if (lessons.length === 0) {
                lessons = this.getManualLessonList();
                console.log('Using manual lesson list:', lessons);
            }
            
            // Validate lessons - check if files exist
            const validLessons = [];
            for (const lesson of lessons) {
                try {
                    const response = await fetch(`lessons/${lesson.id}.json`);
                    if (response.ok) {
                        validLessons.push(lesson);
                        console.log(`Lesson ${lesson.id} found`);
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
            
            // If no valid lessons, show a message
            if (validLessons.length === 0) {
                const container = document.getElementById('slideContent');
                if (container) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: #ff9800;">
                            <h2>No lessons found</h2>
                            <p>Please add lesson JSON files to the "lessons" folder.</p>
                            <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                                Expected format: lessons/lesson-name.json
                            </p>
                        </div>
                    `;
                }
                return;
            }
            
            // Auto-load the first lesson if no saved state
            this.autoLoadFirstLesson(validLessons);
            
        } catch (error) {
            console.error('Error loading lesson list:', error);
            // Fallback to manual list
            const manualLessons = this.getManualLessonList();
            this.populateDropdown(manualLessons);
            
            // Auto-load from manual list
            if (manualLessons.length > 0) {
                this.autoLoadFirstLesson(manualLessons);
            }
        }
    },
    
    autoLoadFirstLesson(lessons) {
        console.log('Auto-loading first lesson...');
        
        // Check if we should load saved state first
        const lastLesson = localStorage.getItem('esl_last_lesson');
        if (lastLesson) {
            // Check if the lesson exists
            const lessonExists = lessons.some(l => l.id === lastLesson);
            if (lessonExists) {
                const select = document.getElementById('lessonSelect');
                if (select) {
                    select.value = lastLesson;
                    this.loadLesson(lastLesson);
                    return;
                }
            }
        }
        
        // Load the first lesson
        if (lessons.length > 0) {
            const firstLesson = lessons[0];
            const select = document.getElementById('lessonSelect');
            if (select) {
                select.value = firstLesson.id;
                this.loadLesson(firstLesson.id);
            }
        }
    },
    
    getManualLessonList() {
        // Only include lessons that actually exist
        return [
            { id: 'test-lesson', title: 'Test Lesson' },
            { id: 'on-the-move-full', title: 'On the Move - Full Lesson' }
        ];
    },
    
    populateDropdown(lessons) {
        const select = document.getElementById('lessonSelect');
        if (!select) {
            console.error('Lesson select element not found');
            return;
        }
        
        // Clear existing options (keep the first default option)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        if (lessons.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No lessons available';
            option.disabled = true;
            select.appendChild(option);
            select.disabled = true;
            return;
        }
        
        // Sort lessons alphabetically by title
        lessons.sort((a, b) => a.title.localeCompare(b.title));
        
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson.id;
            option.textContent = lesson.title;
            select.appendChild(option);
        });
        
        select.disabled = false;
        console.log(`Populated dropdown with ${lessons.length} lessons`);
    },
    
    async loadLesson(lessonId) {
        console.log(`Loading lesson: ${lessonId}`);
        
        try {
            const slideContent = document.getElementById('slideContent');
            if (!slideContent) {
                console.error('Slide content element not found');
                return;
            }
            
            slideContent.innerHTML = '<div style="text-align: center; padding: 3rem;">Loading lesson...</div>';
            
            const response = await fetch(`lessons/${lessonId}.json`);
            if (!response.ok) {
                throw new Error(`Lesson "${lessonId}" not found (404)`);
            }
            
            this.lessonData = await response.json();
            this.currentLesson = lessonId;
            this.currentSlideIndex = 0;
            
            console.log('Lesson data loaded:', this.lessonData);
            
            // Check if slides exist
            if (!this.lessonData.slides || this.lessonData.slides.length === 0) {
                slideContent.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #ff9800;">
                        <h2>Lesson has no slides</h2>
                        <p>The lesson file "${lessonId}.json" does not contain any slides.</p>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                            Please check the JSON structure. It should have a "slides" array.
                        </p>
                    </div>
                `;
                return;
            }
            
            // Check if Renderer exists
            if (typeof Renderer === 'undefined') {
                console.error('Renderer is not defined!');
                slideContent.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #f44336;">
                        <h2>Renderer not loaded</h2>
                        <p>The renderer.js file did not load correctly.</p>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                            Please check that renderer.js exists and is loaded.
                        </p>
                    </div>
                `;
                return;
            }
            
            // Render the lesson
            Renderer.renderLesson(this.lessonData);
            
            // Load saved progress
            const saved = Storage.loadProgress(lessonId);
            if (saved && saved.slideIndex !== undefined) {
                const slides = document.querySelectorAll('.slide-page');
                if (saved.slideIndex < slides.length) {
                    this.currentSlideIndex = saved.slideIndex;
                    Renderer.showSlide(saved.slideIndex);
                }
            }
            
            // Update title
            document.title = `${this.lessonData.title} - ESL Lesson Engine`;
            
            // Preload images (if any)
            if (this.lessonData.slides) {
                this.lessonData.slides.forEach(slide => {
                    if (slide.image) {
                        ImageLoader.preloadImage(slide.image);
                    }
                });
            }
            
            // Save current lesson to localStorage
            localStorage.setItem('esl_last_lesson', lessonId);
            
            console.log(`Lesson ${lessonId} loaded successfully`);
            
        } catch (error) {
            console.error('Error loading lesson:', error);
            const slideContent = document.getElementById('slideContent');
            if (slideContent) {
                slideContent.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #f44336;">
                        <h2>Failed to load lesson</h2>
                        <p style="margin-top: 1rem;">${error.message}</p>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                            The lesson file "lessons/${lessonId}.json" was not found or is invalid.
                        </p>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                            Please check that the file exists in the lessons folder.
                        </p>
                    </div>
                `;
            }
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
        // This is now handled in autoLoadFirstLesson
        // Kept for compatibility
    },
    
    toggleTeacherNotes() {
        const panel = document.getElementById('teacherNotesPanel');
        if (!panel) return;
        
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible && this.lessonData) {
            this.showTeacherNotes();
        }
    },
    
    hideTeacherNotes() {
        const panel = document.getElementById('teacherNotesPanel');
        if (panel) panel.style.display = 'none';
    },
    
    showTeacherNotes() {
        const content = document.getElementById('teacherNotesContent');
        if (!content) return;
        
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
        if (toggle) {
            toggle.textContent = body.classList.contains('theme-yellow') ? 
                'Switch to Baltic Blue' : 
                'Switch to School Bus Yellow';
        }
    },
    
    loadSavedTheme() {
        const theme = Storage.loadTheme();
        const toggle = document.getElementById('themeToggle');
        
        if (theme === 'yellow') {
            document.body.classList.add('theme-yellow');
            if (toggle) toggle.textContent = 'Switch to Baltic Blue';
        } else {
            document.body.classList.remove('theme-yellow');
            if (toggle) toggle.textContent = 'Switch to School Bus Yellow';
        }
    },
    
    showLicense() {
        // License is shown per slide in renderer
        // This method is kept for compatibility
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, initializing App...');
    App.init();
});
