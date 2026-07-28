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
    
    // Debounce
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
    
    // Escape HTML
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Get slide type class
    getSlideTypeClass(type) {
        return `slide-${type.toLowerCase().replace(/\s+/g, '-')}`;
    },
    
    // Format duration
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    }
};

console.log('Helpers loaded');
