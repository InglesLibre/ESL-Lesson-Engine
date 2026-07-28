// Grammar Slide Renderer
const SlideGrammar = {
    render(slide, container) {
        // Title
        const title = document.createElement('h2');
        title.textContent = slide.type === 'Grammar Discovery' ? 'Grammar Discovery' : 'Grammar Rules';
        title.className = 'slide-heading';
        container.appendChild(title);
        
        if (slide.type === 'Grammar Discovery') {
            this.renderDiscovery(slide, container);
        } else {
            this.renderRules(slide, container);
        }
        
        // Content
        if (slide.content) {
            const div = document.createElement('div');
            div.className = 'slide-content';
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
    },
    
    renderDiscovery(slide, container) {
        // Examples
        if (slide.examples && slide.examples.length > 0) {
            const div = document.createElement('div');
            div.className = 'grammar-discovery-examples';
            div.innerHTML = `<strong>Look at these examples:</strong><ul>${slide.examples.map(e => `<li>${e}</li>`).join('')}</ul>`;
            container.appendChild(div);
        }
        
        // Question
        if (slide.question) {
            const p = document.createElement('p');
            p.className = 'grammar-discovery-question';
            p.textContent = slide.question;
            container.appendChild(p);
        }
    },
    
    renderRules(slide, container) {
        if (slide.rules && slide.rules.length > 0) {
            const div = document.createElement('div');
            div.className = 'grammar-rules-container';
            
            slide.rules.forEach(rule => {
                const p = document.createElement('p');
                p.className = 'grammar-rule';
                p.innerHTML = `<strong>${rule.title}:</strong> ${rule.description}`;
                div.appendChild(p);
            });
            
            container.appendChild(div);
        }
    }
};
