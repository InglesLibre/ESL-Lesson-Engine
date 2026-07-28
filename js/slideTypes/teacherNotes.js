// Teacher Notes Slide Renderer
const SlideTeacherNotes = {
    render(slide, container) {
        // This slide type is special - it only shows in teacher view
        // For student view, it shows a placeholder or is hidden
        
        const title = document.createElement('h2');
        title.textContent = 'Teacher Notes';
        title.className = 'slide-heading';
        container.appendChild(title);
        
        if (slide.content) {
            const div = document.createElement('div');
            div.className = 'teacher-notes-content';
            div.innerHTML = slide.content;
            container.appendChild(div);
        }
        
        // Mark as teacher-only content
        container.classList.add('teacher-only');
    }
};
