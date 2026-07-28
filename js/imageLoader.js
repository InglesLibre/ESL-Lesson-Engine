// Image Preloader
const ImageLoader = {
    cache: new Set(),
    
    init() {
        // Nothing to initialize
    },
    
    preloadImage(url) {
        if (!url) return;
        if (this.cache.has(url)) return;
        
        const img = new Image();
        img.onload = () => {
            this.cache.add(url);
        };
        img.onerror = () => {
            console.warn('Failed to load image:', url);
        };
        img.src = url;
    },
    
    preloadImages(urls) {
        if (!urls || !Array.isArray(urls)) return;
        urls.forEach(url => this.preloadImage(url));
    },
    
    isCached(url) {
        return this.cache.has(url);
    }
};
