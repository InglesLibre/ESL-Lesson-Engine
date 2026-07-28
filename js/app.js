// Main Application Controller
const App = {
    currentLesson: null,
    currentSlideIndex: 0,
    lessonData: null,
    slideTypes: {},
    isFullscreen: false,
    
    init() {
        console.log('App initializing...');
        
        // Initialize components
        Router.init();
        Navigation.init();
        Storage.init();
        ImageLoader.init();
        
        // Register slide types
        this.registerSlideTypes();
        
        // Load saved theme
        this.loadSavedTheme();
        
        // Load lesson list
        this.loadLessonList();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Auto-save progress
        setInterval(() => {
            this.saveProgress();
        }, 30000);
        
        console.log('App initialized');
    },
    
    registerSlideTypes() {
        // Register all available slide types
        this.slideTypes = {
            'Title': SlideTitle,
            'Speaking Part 1': SlideSpeaking,
            'Speaking Part 2': SlideSpeaking,
            'Speaking Part 3': SlideSpeaking,
            'Grammar Discovery': SlideGrammar,
            'Grammar Rules': SlideGrammar,
            'Vocabulary': SlideVocabulary,
            'Teacher Notes': SlideTeacherNotes,
            'Objectives': SlideTitle,
            'Ice Breaker': SlideSpeaking,
            'Reading': SlideTitle,
            'Listening': SlideTitle,
            'Writing': SlideTitle,
            // Activities - these will be handled by the activity engine
            'Gap Fill': null,
            'Dropdown': null,
            'Matching': null,
            'Drag & Drop': null,
            'Multiple Choice': null
        };
        
        console.log('Slide types registered:', Object.keys(this.slideTypes));
    },
    
    setupEventListeners() {
        // Lesson selector
        const lessonSelect = document.getElementById('lessonSelect');
        if (lessonSelect) {
            lessonSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadLesson(e.target.value);
                }
            });
        }
        
        // Teacher notes toggle
        const notesToggle = document.getElementById('teacherNotesToggle');
        if (notesToggle) {
            notesToggle.addEventListener('click', () => {
                this.togglePanel('teacherNotesPanel');
            });
        }
        
        const closeNotes = document.getElementById('closeNotesBtn');
        if (closeNotes) {
            closeNotes.addEventListener('click', () => {
                this.closePanel('teacherNotesPanel');
            });
        }
        
        // Table of contents toggle
        const tocToggle = document.getElementById('tocToggle');
        if (tocToggle) {
            tocToggle.addEventListener('click', () => {
                this.togglePanel('tocPanel');
            });
        }
        
        const closeToc = document.getElementById('closeTocBtn');
        if (closeToc) {
            closeToc.addEventListener('click', () => {
                this.closePanel('tocPanel');
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        // Print button
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    },
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Arrow keys for navigation
            if (e.key === 'ArrowLeft') {
                if (typeof Navigation !== 'undefined') {
                    Navigation.prevSlide();
                }
            }
            if (e.key === 'ArrowRight') {
                if (typeof Navigation !== 'undefined') {
                    Navigation.nextSlide();
                }
            }
            
            // 'n' for teacher notes
            if (e.key === 'n' || e.key === 'N') {
                this.togglePanel('teacherNotesPanel');
            }
            
            // 't' for table of contents
            if (e.key === 't' || e.key === 'T') {
                this.togglePanel('tocPanel');
            }
            
            // 'f' for fullscreen
            if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
            
            // Escape for closing panels
            if (e.key === 'Escape') {
                this.closePanel('teacherNotesPanel');
                this.closePanel('tocPanel');
            }
        });
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
                }
            } catch (e) {
                console.log('No lessons.json found');
            }
            
            // If no lessons, use fallback
            if (lessons.length === 0) {
                lessons = this.getDefaultLessons();
            }
            
            // Validate lessons
            const validLessons = [];
            for (const lesson of lessons) {
                try {
                    const response = await fetch(`lessons/${lesson.id}.json`);
                    if (response.ok) {
                        validLessons.push(lesson);
                    }
                } catch (e) {
                    console.warn(`Lesson ${lesson.id} not found`);
                }
            }
            
            this.populateDropdown(validLessons);
            
            // Auto-load first lesson
            if (validLessons.length > 0) {
                this.autoLoadLesson(validLessons);
            }
            
        } catch (error) {
            console.error('Error loading lesson list:', error);
        }
    },
    
    getDefaultLessons() {
        return [
            { id: 'demo', title: 'Demo Lesson' },
            { id: 'on-the-move-1', title: 'On the Move - Part 1' },
            { id: 'lifestyles', title: 'Lifestyles' }
        ];
    },
    
    populateDropdown(lessons) {
        const select = document.getElementById('lessonSelect');
        if (!select) return;
        
        // Clear existing options
        while (select.options.length > 1) {
            select.remove(1);
        }
        
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
    
    autoLoadLesson(lessons) {
        // Check for last lesson
        const lastLesson = localStorage.getItem('esl_last_lesson');
        if (lastLesson) {
            const exists = lessons.some(l => l.id === lastLesson);
            if (exists) {
                const select = document.getElementById('lessonSelect');
                if (select) {
                    select.value = lastLesson;
                    this.loadLesson(lastLesson);
                    return;
                }
            }
        }
        
        // Load first lesson
        if (lessons.length > 0) {
            const first = lessons[0];
            const select = document.getElementById('lessonSelect');
            if (select) {
                select.value = first.id;
                this.loadLesson(first.id);
            }
        }
    },
    
    async loadLesson(lessonId) {
        console.log(`Loading lesson: ${lessonId}`);
        
        try {
            const slideContent = document.getElementById('slideContent');
            if (!slideContent) return;
            
            slideContent.innerHTML = '<div class="loading-state">Loading lesson...</div>';
            
            const response = await fetch(`lessons/${lessonId}.json`);
            if (!response.ok) {
                throw new Error(`Lesson "${lessonId}" not found`);
            }
            
            this.lessonData = await response.json();
            this.currentLesson = lessonId;
            this.currentSlideIndex = 0;
            
            // Update metadata
            this.updateMetadata(this.lessonData);
            
            // Render the lesson
            if (typeof Renderer !== 'undefined') {
                Renderer.renderLesson(this.lessonData);
            } else {
                console.error('Renderer not defined');
                slideContent.innerHTML = '<div class="error-state">Renderer not loaded. Please check the console for errors.</div>';
                return;
            }
            
            // Update title
            document.title = `${this.lessonData.metadata?.title || 'Lesson'} - ESL Lesson Generator`;
            
            // Save last lesson
            localStorage.setItem('esl_last_lesson', lessonId);
            
            // Generate TOC
            this.generateTOC();
            
            console.log(`Lesson ${lessonId} loaded successfully`);
            
        } catch (error) {
            console.error('Error loading lesson:', error);
            const slideContent = document.getElementById('slideContent');
            if (slideContent) {
                slideContent.innerHTML = `
                    <div class="error-state">
                        <h2>Failed to load lesson</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }
    },
    
    updateMetadata(lessonData) {
        const metadata = lessonData.metadata || {};
        
        const levelEl = document.getElementById('slideLevel');
        if (levelEl) {
            levelEl.innerHTML = `Level: <strong>${metadata.level || 'Not specified'}</strong>`;
        }
        
        const examEl = document.getElementById('slideExam');
        if (examEl) {
            examEl.innerHTML = `Exam: <strong>${metadata.exam || 'General'}</strong>`;
        }
        
        const durationEl = document.getElementById('slideTimer');
        if (durationEl) {
            const duration = metadata.duration || 0;
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            durationEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    
    generateTOC() {
        const content = document.getElementById('tocContent');
        if (!content || !this.lessonData) return;
        
        const slides = this.lessonData.slides || [];
        let html = '<ul class="toc-list">';
        
        slides.forEach((slide, index) => {
            const title = slide.title || slide.type || `Slide ${index + 1}`;
            html += `
                <li class="toc-item">
                    <span class="toc-number">${index + 1}</span>
                    <span class="toc-title">${title}</span>
                    <span class="toc-type">${slide.type || 'content'}</span>
                    <button class="toc-go-btn" data-index="${index}">Go</button>
                </li>
            `;
        });
        
        html += '</ul>';
        content.innerHTML = html;
        
        // Add click handlers
        content.querySelectorAll('.toc-go-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (typeof Navigation !== 'undefined') {
                    Navigation.goToSlide(index);
                }
                this.closePanel('tocPanel');
            });
        });
    },
    
    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // Refresh content if needed
            if (panelId === 'teacherNotesPanel') {
                this.populateTeacherNotes();
            }
        }
    },
    
    closePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = 'none';
        }
    },
    
    populateTeacherNotes() {
        const content = document.getElementById('teacherNotesContent');
        if (!content || !this.lessonData) return;
        
        const notes = this.lessonData.teacherNotes || [];
        let html = '';
        
        if (typeof notes === 'string') {
            html = `<p>${notes}</p>`;
        } else if (Array.isArray(notes)) {
            html = `<ul>${notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
        } else {
            html = '<p>No teacher notes available.</p>';
        }
        
        content.innerHTML = html;
    },
    
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.classList.contains('theme-yellow') ? 'yellow' : 'default';
        const newTheme = currentTheme === 'yellow' ? 'default' : 'yellow';
        
        body.classList.toggle('theme-yellow');
        
        if (typeof Storage !== 'undefined') {
            Storage.saveTheme(newTheme);
        }
        
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.textContent = newTheme === 'yellow' ? '🎨' : '🎨';
            toggle.title = newTheme === 'yellow' ? 'Switch to Baltic Blue' : 'Switch to School Bus Yellow';
        }
    },
    
    loadSavedTheme() {
        let theme = 'default';
        if (typeof Storage !== 'undefined') {
            theme = Storage.loadTheme();
        }
        if (theme === 'yellow') {
            document.body.classList.add('theme-yellow');
        }
    },
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.log('Exit fullscreen failed');
            });
        }
    },
    
    saveProgress() {
        if (this.currentLesson && this.currentSlideIndex !== undefined) {
            if (typeof Storage !== 'undefined') {
                Storage.saveProgress(this.currentLesson, {
                    slideIndex: this.currentSlideIndex,
                    timestamp: Date.now()
                });
            }
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, initializing App...');
    App.init();
});
