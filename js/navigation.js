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
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextSlide();
            });
        }
        
        console.log('Navigation initialized');
    },
    
    nextSlide() {
        console.log('nextSlide called, currentIndex:', this.currentIndex);
        
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            console.log('Moving to slide:', this.currentIndex);
            
            if (typeof Renderer !== 'undefined') {
                Renderer.showSlide(this.currentIndex);
            }
            
            if (typeof App !== 'undefined') {
                App.currentSlideIndex = this.currentIndex;
            }
        }
    },
    
    prevSlide() {
        console.log('prevSlide called, currentIndex:', this.currentIndex);
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            console.log('Moving to slide:', this.currentIndex);
            
            if (typeof Renderer !== 'undefined') {
                Renderer.showSlide(this.currentIndex);
            }
            
            if (typeof App !== 'undefined') {
                App.currentSlideIndex = this.currentIndex;
            }
        }
    },
    
    goToSlide(index) {
        console.log('goToSlide called with index:', index);
        
        if (index >= 0 && index < this.totalSlides) {
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
        }
        if (nextBtn) {
            nextBtn.disabled = current === total - 1;
        }
    }
};

console.log('Navigation loaded successfully');
