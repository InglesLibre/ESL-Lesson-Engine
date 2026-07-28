// Navigation Controller
const Navigation = {
    currentIndex: 0,
    totalSlides: 0,
    
    init() {
        console.log('Navigation initializing...');
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.prevSlide();
            });
        } else {
            console.error('Previous button not found');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextSlide();
            });
        } else {
            console.error('Next button not found');
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                console.log('Left arrow pressed');
                this.prevSlide();
            }
            if (e.key === 'ArrowRight') {
                console.log('Right arrow pressed');
                this.nextSlide();
            }
        });
        
        console.log('Navigation initialized');
    },
    
    nextSlide() {
        console.log('nextSlide called, currentIndex:', this.currentIndex);
        console.log('Total slides:', this.totalSlides);
        
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            console.log('Moving to slide:', this.currentIndex);
            
            if (typeof Renderer !== 'undefined') {
                Renderer.showSlide(this.currentIndex);
            } else {
                console.error('Renderer not defined');
            }
            
            if (typeof App !== 'undefined') {
                App.currentSlideIndex = this.currentIndex;
            }
        } else {
            console.log('Already at last slide');
        }
    },
    
    prevSlide() {
        console.log('prevSlide called, currentIndex:', this.currentIndex);
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            console.log('Moving to slide:', this.currentIndex);
            
            if (typeof Renderer !== 'undefined') {
                Renderer.showSlide(this.currentIndex);
            } else {
                console.error('Renderer not defined');
            }
            
            if (typeof App !== 'undefined') {
                App.currentSlideIndex = this.currentIndex;
            }
        } else {
            console.log('Already at first slide');
        }
    },
    
    goToSlide(index) {
        console.log('goToSlide called with index:', index);
        
        const slides = document.querySelectorAll('.slide-page');
        if (index >= 0 && index < slides.length) {
            this.currentIndex = index;
            
            if (typeof Renderer !== 'undefined') {
                Renderer.showSlide(index);
            }
            
            if (typeof App !== 'undefined') {
                App.currentSlideIndex = index;
            }
        }
    },
    
    updateNavigation(current, total) {
        console.log('updateNavigation called with current:', current, 'total:', total);
        
        this.currentIndex = current;
        this.totalSlides = total;
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = current === 0;
            console.log('Prev button disabled:', prevBtn.disabled);
        }
        if (nextBtn) {
            nextBtn.disabled = current === total - 1;
            console.log('Next button disabled:', nextBtn.disabled);
        }
    }
};

console.log('Navigation loaded successfully');
