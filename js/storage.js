// Storage Manager
const Storage = {
    prefix: 'esl_',
    themeKey: 'esl_theme',
    progressPrefix: 'esl_progress_',
    
    init() {
        if (!localStorage.getItem(this.themeKey)) {
            localStorage.setItem(this.themeKey, 'default');
        }
    },
    
    saveProgress(lessonId, data) {
        const key = `${this.progressPrefix}${lessonId}`;
        try {
            localStorage.setItem(key, JSON.stringify({
                ...data,
                savedAt: Date.now()
            }));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    },
    
    loadProgress(lessonId) {
        const key = `${this.progressPrefix}${lessonId}`;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading progress:', error);
            return null;
        }
    },
    
    loadAllProgress() {
        const progress = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.progressPrefix)) {
                const lessonId = key.replace(this.progressPrefix, '');
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    progress[lessonId] = data;
                } catch (error) {
                    console.error('Error parsing stored data:', error);
                }
            }
        }
        return progress;
    },
    
    saveTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    },
    
    loadTheme() {
        return localStorage.getItem(this.themeKey) || 'default';
    },
    
    clearProgress(lessonId) {
        const key = `${this.progressPrefix}${lessonId}`;
        localStorage.removeItem(key);
    },
    
    clearAllProgress() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.progressPrefix)) {
                localStorage.removeItem(key);
            }
        }
    }
};

console.log('Storage loaded');
