// Navigation Controller
const Navigation = {
    currentIndex: 0,
    totalSlides: 0,
    
    init() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    },
    
    nextSlide() {
        const slides = document.querySelectorAll('.slide-page');
        if (this.currentIndex < slides.length - 1) {
            this.currentIndex++;
            Renderer.showSlide(this.currentIndex);
            App.currentSlideIndex = this.currentIndex;
        }
    },
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            Renderer.showSlide(this.currentIndex);
            App.currentSlideIndex = this.currentIndex;
        }
    },
    
    goToSlide(index) {
        const slides = document.querySelectorAll('.slide-page');
        if (index >= 0 && index < slides.length) {
            this.currentIndex = index;
            Renderer.showSlide(index);
            App.currentSlideIndex = index;
        }
    },
    
    updateNavigation(current, total) {
        this.currentIndex = current;
        this.totalSlides = total;
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current === total - 1;
    }
};
