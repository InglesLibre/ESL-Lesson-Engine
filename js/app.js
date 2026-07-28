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
        document.getElementById('lessonSelect').
