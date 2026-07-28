// Local Storage Manager
const Storage = {
    prefix: 'esl_lesson_',
    themeKey: 'esl_theme',
    
    init() {
        // Initialize storage if needed
        if (!localStorage.getItem(this.themeKey)) {
            localStorage.setItem(this.themeKey, 'default');
        }
    },
    
    saveProgress(lessonId, data) {
        const key = `${this.prefix}${lessonId}`;
        try {
            localStorage.setItem(key, JSON.stringify(data));
            this.showSaveIndicator();
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    },
    
    loadProgress(lessonId) {
        const key = `${this.prefix}${lessonId}`;
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
            if (key && key.startsWith(this.prefix)) {
                const lessonId = key.replace(this.prefix, '');
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
    
    showSaveIndicator() {
        let indicator = document.getElementById('saveIndicator');
        if (!indicator) {
            const div = document.createElement('div');
            div.id = 'saveIndicator';
            div.className = 'save-indicator';
            div.textContent = 'Progress saved';
            document.body.appendChild(div);
            indicator = div;
        }
        
        indicator.classList.add('show');
        clearTimeout(indicator._timeout);
        indicator._timeout = setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
};
