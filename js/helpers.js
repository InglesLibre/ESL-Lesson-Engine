// Helper Utilities
const Helpers = {
    // Shuffle array
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Escape HTML
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Unescape HTML
    unescapeHtml(html) {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent;
    },
    
    // Get slide type class
    getSlideTypeClass(type) {
        return `slide-${type.toLowerCase().replace(/\s+/g, '-')}`;
    },
    
    // Format duration (seconds to MM:SS)
    formatDuration(seconds) {
        if (!seconds || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    // Parse duration (MM:SS to seconds)
    parseDuration(duration) {
        if (!duration) return 0;
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return parseInt(duration) || 0;
    },
    
    // Get CEFR level color
    getLevelColor(level) {
        const colors = {
            'A1': '#4caf50',
            'A2': '#8bc34a',
            'B1': '#ffc107',
            'B2': '#ff9800',
            'C1': '#f44336',
            'C2': '#9c27b0'
        };
        return colors[level] || '#666';
    },
    
    // Get CEFR level label
    getLevelLabel(level) {
        const labels = {
            'A1': 'Beginner',
            'A2': 'Elementary',
            'B1': 'Intermediate',
            'B2': 'Upper Intermediate',
            'C1': 'Advanced',
            'C2': 'Proficiency'
        };
        return labels[level] || level || 'Not specified';
    },
    
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
    
    // Check if object is empty
    isEmpty(obj) {
        return !obj || Object.keys(obj).length === 0;
    },
    
    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Get URL parameter
    getUrlParam(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    },
    
    // Set URL parameter
    setUrlParam(name, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },
    
    // Remove URL parameter
    removeUrlParam(name) {
        const url = new URL(window.location.href);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    },
    
    // Get file extension
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    },
    
    // Check if URL is an image
    isImageUrl(url) {
        if (!url) return false;
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
        const ext = this.getFileExtension(url);
        return extensions.includes(ext);
    },
    
    // Get image URL from GitHub raw content
    getGitHubRawUrl(repo, path) {
        return `https://raw.githubusercontent.com/${repo}/main/${path}`;
    },
    
    // Truncate text
    truncate(text, maxLength, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + suffix;
    },
    
    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // Convert to title case
    toTitleCase(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    },
    
    // Check if running on GitHub Pages
    isGitHubPages() {
        return window.location.hostname.includes('github.io');
    },
    
    // Get repository name from URL
    getRepoName() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[1] || '';
    }
};

console.log('Helpers loaded successfully');
