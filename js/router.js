// Router - Handles URL routing for GitHub Pages
const Router = {
    currentRoute: '',
    
    init() {
        console.log('Router initializing...');
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
        
        // Handle initial load
        window.addEventListener('load', () => {
            this.handleRoute();
        });
        
        console.log('Router initialized');
    },
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentRoute = hash;
        console.log('Route changed to:', hash);
        
        if (hash.startsWith('lesson/')) {
            const lessonId = hash.split('/')[1];
            if (lessonId && typeof App !== 'undefined') {
                App.loadLesson(lessonId);
            }
        } else if (hash === '/') {
            this.showHome();
        }
    },
    
    navigateTo(route) {
        window.location.hash = route;
    },
    
    navigateToLesson(lessonId) {
        this.navigateTo(`lesson/${lessonId}`);
    },
    
    showHome() {
        const slideContent = document.getElementById('slideContent');
        if (!slideContent) return;
        
        slideContent.innerHTML = `
            <div class="home-screen">
                <h1>Welcome to ESL Lesson Generator</h1>
                <p>Select a lesson from the dropdown above to begin.</p>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>Interactive Activities</h3>
                        <p>Gap-fill, multiple choice, drag & drop, and more</p>
                    </div>
                    <div class="feature-card">
                        <h3>Track Progress</h3>
                        <p>Your progress is saved automatically</p>
                    </div>
                    <div class="feature-card">
                        <h3>Exam Preparation</h3>
                        <p>Cambridge B2 First focused content</p>
                    </div>
                </div>
            </div>
        `;
    }
};

console.log('Router loaded successfully');
