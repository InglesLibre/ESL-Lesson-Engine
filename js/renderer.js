// Add or replace the showSlide method in renderer.js
showSlide(index) {
    const slides = document.querySelectorAll('.slide-page');
    if (!slides || slides.length === 0) {
        console.warn('No slides found');
        return;
    }
    
    // Ensure index is within bounds
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    // Show/hide slides
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
    
    // Update progress
    this.updateProgress(index, slides.length);
    
    // Update counter
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `Slide ${index + 1} of ${slides.length}`;
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    
    // Store current index
    this.currentIndex = index;
    if (App && App.currentSlideIndex !== undefined) {
        App.currentSlideIndex = index;
    }
    
    // Save progress
    if (App && App.saveProgress) {
        App.saveProgress();
    }
}
