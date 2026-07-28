// Add or update this method in renderer.js
showSlide(index) {
    const slides = document.querySelectorAll('.slide-page');
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
    
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
    
    // Save progress
    if (App && App.saveProgress) {
        App.saveProgress();
    }
}
