// Vocabulary Slide Renderer
const SlideVocabulary = {
    render(slide, container) {
        // Title
        const title = document.createElement('h2');
        title.textContent = 'Vocabulary';
        title.className = 'slide-heading';
        container.appendChild(title);
        
        // Words
        if (slide.words && slide.words.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'vocabulary-grid';
            
            slide.words.forEach(word => {
                const item = document.createElement('div');
                item.className = 'vocab-item';
                
                const wordSpan = document.createElement('div');
                wordSpan.className = 'vocab-word';
                wordSpan.textContent = word.word;
                item.appendChild(wordSpan);
                
                if (word.definition) {
                    const defSpan = document.createElement('div');
                    defSpan.className = 'vocab-definition';
                    defSpan.textContent = word.definition;
                    item.appendChild(defSpan);
                }
                
                if (word.example) {
                    const exampleSpan = document.createElement('div');
                    exampleSpan.className = 'vocab-example';
                    exampleSpan.textContent = `"${word.example}"`;
                    item.appendChild(exampleSpan);
                }
                
                grid.appendChild(item);
            });
            
            container.appendChild(grid);
        }
        
        // Content
        if (slide.content) {
            const div = document.createElement('div');
            div.className = 'slide-content';
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
    }
};
