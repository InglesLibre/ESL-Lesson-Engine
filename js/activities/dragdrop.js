// Drag & Drop Activity Engine
const DragDropActivity = {
    render(container, items, categories) {
        // Create source items
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'drag-items';
        sourceDiv.id = 'dragSource';
        
        const shuffledItems = Utils.shuffle(items);
        shuffledItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'drag-item';
            div.draggable = true;
            div.textContent = item.text;
            div.dataset.category = item.category;
            
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.text);
                div.classList.add('dragging');
            });
            
            div.addEventListener('dragend', () => {
                div.classList.remove('dragging');
            });
            
            sourceDiv.appendChild(div);
        });
        
        // Create drop zones
        const dropDiv = document.createElement('div');
        dropDiv.className = 'drop-zones';
        dropDiv.style.display = 'grid';
        dropDiv.style.gridTemplateColumns = `repeat(${categories.length}, 1fr)`;
        dropDiv.style.gap = '1rem';
        
        categories.forEach(category => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.category = category.name;
            zone.innerHTML = `<h4>${category.name}</h4><div class="dropped-items"></div>`;
            
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const data = e.dataTransfer.getData('text/plain');
                const sourceItem = document.querySelector(`.drag-item[data-category="${category.name}"]`);
                
                if (sourceItem && sourceItem.textContent === data) {
                    // Move to drop zone
                    const droppedItems = zone.querySelector('.dropped-items');
                    const clone = sourceItem.cloneNode(true);
                    clone.draggable = false;
                    clone.style.cursor = 'default';
                    clone.classList.add('dropped');
                    droppedItems.appendChild(clone);
                    sourceItem.remove();
                }
            });
            
            dropDiv.appendChild(zone);
        });
        
        const wrapper = document.createElement('div');
        wrapper.className = 'drag-drop-container';
        wrapper.appendChild(sourceDiv);
        wrapper.appendChild(dropDiv);
        container.appendChild(wrapper);
        
        // Add check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'nav-btn';
        checkBtn.textContent = 'Check Answers';
        checkBtn.addEventListener('click', () => this.checkAnswers());
        container.appendChild(checkBtn);
    },
    
    checkAnswers() {
        const zones = document.querySelectorAll('.drop-zone');
        let correct = 0;
        let total = 0;
        
        zones.forEach(zone => {
            const category = zone.dataset.category;
            const items = zone.querySelectorAll('.dropped');
            total += items.length;
            
            items.forEach(item => {
                if (item.dataset.category === category) {
                    correct++;
                }
            });
        });
        
        const totalItems = document.querySelectorAll('.drag-item').length + total;
        alert(`You placed ${correct} out of ${totalItems} items correctly.`);
    }
};
