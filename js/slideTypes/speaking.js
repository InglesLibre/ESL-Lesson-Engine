// Speaking Slide Renderer
const SlideSpeaking = {
    render(slide, container) {
        // Title
        const title = document.createElement('h2');
        title.textContent = slide.type || 'Speaking';
        title.className = 'slide-heading';
        container.appendChild(title);
        
        // Part indicator
        if (slide.part) {
            const part = document.createElement('div');
            part.className = 'speaking-part';
            part.textContent = `Part ${slide.part}`;
            container.appendChild(part);
        }
        
        // Prompt
        if (slide.prompt) {
            const div = document.createElement('div');
            div.className = 'speaking-prompt';
            div.innerHTML = slide.prompt;
            container.appendChild(div);
        }
        
        // Questions
        if (slide.questions && slide.questions.length > 0) {
            const ol = document.createElement('ol');
            ol.className = 'speaking-questions';
            slide.questions.forEach(q => {
                const li = document.createElement('li');
                li.textContent = q;
                ol.appendChild(li);
            });
            container.appendChild(ol);
        }
        
        // Tips
        if (slide.tips && slide.tips.length > 0) {
            const div = document.createElement('div');
            div.className = 'speaking-tips';
            div.innerHTML = `<strong>Tips:</strong><ul>${slide.tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
            container.appendChild(div);
        }
        
        // Duration timer
        if (slide.duration) {
            const timer = document.createElement('div');
            timer.className = 'speaking-timer';
            timer.textContent = `${slide.duration}s`;
            container.appendChild(timer);
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
