// Simple router for GitHub Pages compatibility
const Router = {
    currentRoute: '',
    
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    },
    
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentRoute = hash;
        
        if (hash.startsWith('lesson/')) {
            const lessonId = hash.split('/')[1];
            if (lessonId) {
                App.loadLesson(lessonId);
            }
        } else if (hash === '/') {
            // Home - show lesson selection
            this.showHome();
        }
    },
    
    navigateTo(route) {
        window.location.hash = route;
    },
    
    showHome() {
        // Show lesson selection interface
        const slideContent = document.getElementById('slideContent');
        slideContent.innerHTML = `
            <div class="home-screen">
                <h1>Welcome to ESL Lesson Engine</h1>
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
                        <h3>Two Themes</h3>
                        <p>Baltic Blue and School Bus Yellow</p>
                    </div>
                </div>
            </div>
        `;
    }
};
