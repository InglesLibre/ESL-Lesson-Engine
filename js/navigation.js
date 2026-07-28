// Navigation Controller
const Navigation = {
    currentIndex: 0,
    totalSlides: 0,
    
    init() {
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.prevSlide();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextSlide();
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
        document.getElementById('prevBtn').disabled = current === 0;
        document.getElementById('nextBtn').disabled = current === total - 1;
    }
};
