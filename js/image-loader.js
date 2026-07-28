// Image Loader - Handles image preloading and caching
const ImageLoader = {
    cache: new Map(),
    loading: new Set(),
    failed: new Set(),
    
    init() {
        console.log('ImageLoader initializing...');
    },
    
    preloadImage(url) {
        if (!url) return Promise.resolve();
        
        // Check cache
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url));
        }
        
        // Check if already loading
        if (this.loading.has(url)) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (this.cache.has(url)) {
                        clearInterval(checkInterval);
                        resolve(this.cache.get(url));
                    }
                    if (this.failed.has(url)) {
                        clearInterval(checkInterval);
                        resolve(null);
                    }
                }, 100);
            });
        }
        
        // Start loading
        this.loading.add(url);
        
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                this.cache.set(url, img);
                this.loading.delete(url);
                console.log('Image loaded:', url);
                resolve(img);
            };
            
            img.onerror = () => {
                this.failed.add(url);
                this.loading.delete(url);
                console.warn('Image failed to load:', url);
                resolve(null);
            };
            
            img.src = url;
        });
    },
    
    preloadImages(urls) {
        if (!urls || !Array.isArray(urls)) return;
        
        urls.forEach(url => {
            this.preloadImage(url);
        });
    },
    
    getImage(url) {
        return this.cache.get(url) || null;
    },
    
    isLoaded(url) {
        return this.cache.has(url);
    },
    
    isLoading(url) {
        return this.loading.has(url);
    },
    
    hasFailed(url) {
        return this.failed.has(url);
    },
    
    clearCache() {
        this.cache.clear();
        this.loading.clear();
        this.failed.clear();
        console.log('Image cache cleared');
    }
};

console.log('ImageLoader loaded successfully');
