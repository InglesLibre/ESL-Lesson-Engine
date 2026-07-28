// Title Slide Renderer
const SlideTitle = {
    render(slide, container) {
        // Title
        if (slide.title) {
            const h1 = document.createElement('h1');
            h1.textContent = slide.title;
            h1.className = 'slide-title-main';
            container.appendChild(h1);
        }
        
        // Subtitle
        if (slide.subtitle) {
            const p = document.createElement('p');
            p.textContent = slide.subtitle;
            p.className = 'slide-subtitle';
            container.appendChild(p);
        }
        
        // Image
        if (slide.image) {
            const img = document.createElement('img');
            img.src = slide.image;
            img.alt = slide.imageAlt || 'Slide image';
            img.className = 'slide-image';
            container.appendChild(img);
        }
        
        // Content
        if (slide.content) {
            const div = document.createElement('div');
            div.className = 'slide-content';
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
        
        // Objectives
        if (slide.objectives && slide.objectives.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'objectives-list';
            slide.objectives.forEach(obj => {
                const li = document.createElement('li');
                li.textContent = obj;
                ul.appendChild(li);
            });
            container.appendChild(ul);
        }
    }
};
