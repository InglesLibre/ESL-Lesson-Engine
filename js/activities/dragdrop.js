// Drag & Drop Activity Engine
const DragDropActivity = {
    render(container, items, categories) {
        const wrapper = document.createElement('div');
        wrapper.className = 'dragdrop-wrapper';
        
        // Create source items
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'drag-items';
        sourceDiv.style.display = 'flex';
        sourceDiv.style.flexWrap = 'wrap';
        sourceDiv.style.gap = '0.5rem';
        sourceDiv.style.marginBottom = '1rem';
        sourceDiv.style.padding = '1rem';
        sourceDiv.style.border = '2px dashed var(--bg-light)';
        sourceDiv.style.borderRadius = '8px';
        sourceDiv.style.minHeight = '100px';
        
        const shuffledItems = Utils.shuffle(items);
        shuffledItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'drag-item';
            div.draggable = true;
            div.textContent = item.text;
            div.dataset.category = item.category;
            div.dataset.originalCategory = item.category;
            
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    text: item.text,
                    category: item.category
                }));
                div.classList.add('dragging');
            });
            
            div.addEventListener('dragend', () => {
                div.classList.remove('dragging');
            });
            
            sourceDiv.appendChild(div);
        });
        
        wrapper.appendChild(sourceDiv);
        
        // Create drop zones
        const dropDiv = document.createElement('div');
        dropDiv.className = 'drop-zones';
        dropDiv.style.display = 'grid';
        dropDiv.style.gridTemplateColumns = `repeat(auto-fit, minmax(200px, 1fr))`;
        dropDiv.style.gap = '1rem';
        dropDiv.style.marginTop = '1rem';
        
        categories.forEach(category => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.category = category.name;
            zone.style.minHeight = '150px';
            zone.innerHTML = `<h4 style="margin-top: 0; margin-bottom: 0.5rem;">${category.name}</h4><div class="dropped-items"></div>`;
            
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
                
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const item = sourceDiv.querySelector(`.drag-item[data-category="${data.category}"]`);
                    
                    if (item && item.textContent === data.text) {
                        // Check if category matches
                        const isCorrect = data.category === category.name;
                        
                        // Clone the item
                        const clone = item.cloneNode(true);
                        clone.draggable = false;
                        clone.style.cursor = 'default';
                        clone.classList.add('dropped');
                        clone.dataset.placedIn = category.name;
                        
                        if (isCorrect) {
                            clone.style.background = '#4caf50';
                            clone.style.color = 'white';
                        } else {
                            clone.style.background = '#f44336';
                            clone.style.color = 'white';
                        }
                        
                        const droppedItems = zone.querySelector('.dropped-items');
                        droppedItems.appendChild(clone);
                        
                        // Remove from source
                        item.remove();
                        
                        // Check if all items are placed
                        this.checkCompletion(wrapper);
                    }
                } catch (error) {
                    console.error('Error handling drop:', error);
                }
            });
            
            dropDiv.appendChild(zone);
        });
        
        wrapper.appendChild(dropDiv);
        container.appendChild(wrapper);
        
        // Add check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'nav-btn';
        checkBtn.textContent = 'Check Answers';
        checkBtn.addEventListener('click', () => this.checkAnswers(container));
        container.appendChild(checkBtn);
        
        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'nav-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginLeft = '0.5rem';
        resetBtn.addEventListener('click', () => this.reset(container));
        container.appendChild(resetBtn);
        
        // Load saved progress
        this.loadProgress(container);
    },
    
    checkCompletion(wrapper) {
        const sourceItems = wrapper.querySelectorAll('.drag-items .drag-item');
        const totalItems = sourceItems.length + wrapper.querySelectorAll('.dropped').length;
        const placedItems = wrapper.querySelectorAll('.dropped').length;
        
        if (placedItems === totalItems) {
            const message = document.createElement('div');
            message.className = 'dragdrop-complete';
            message.style.marginTop = '1rem';
            message.style.padding = '0.75rem';
            message.style.borderRadius = '8px';
            message.style.background = '#e8f5e9';
            message.style.color = '#2e7d32';
            message.textContent = 'All items placed! Click "Check Answers" to review.';
            
            const oldMessage = wrapper.querySelector('.dragdrop-complete');
            if (oldMessage) oldMessage.remove();
            wrapper.appendChild(message);
        }
    },
    
    checkAnswers(container) {
        const wrapper = container.querySelector('.dragdrop-wrapper');
        if (!wrapper) return;
        
        const droppedItems = wrapper.querySelectorAll('.dropped');
        let correctCount = 0;
        let totalCount = droppedItems.length;
        
        droppedItems.forEach(item => {
            const originalCategory = item.dataset.originalCategory;
            const placedCategory = item.dataset.placedIn;
            
            if (originalCategory === placedCategory) {
                correctCount++;
                item.style.background = '#4caf50';
                item.style.color = 'white';
                item.style.border = '2px solid #388e3c';
            } else {
                item.style.background = '#f44336';
                item.style.color = 'white';
                item.style.border = '2px solid #d32f2f';
            }
        });
        
        // Show results
        const resultDiv = document.createElement('div');
        resultDiv.className = 'dragdrop-results';
        resultDiv.style.marginTop = '1rem';
        resultDiv.style.padding = '1rem';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.background = 'var(--bg-light)';
        resultDiv.innerHTML = `
            <strong>Results:</strong> ${correctCount} out of ${totalCount} placed correctly
            ${correctCount === totalCount && totalCount > 0 ? ' - Perfect!' : ''}
            ${totalCount === 0 ? ' - No items placed yet.' : ''}
        `;
        
        const oldResults = container.querySelector('.dragdrop-results');
        if (oldResults) oldResults.remove();
        container.appendChild(resultDiv);
        
        // Save progress
        this.saveProgress(container);
    },
    
    reset(container) {
        const wrapper = container.querySelector('.dragdrop-wrapper');
        if (!wrapper) return;
        
        // Get all dropped items
        const droppedItems = wrapper.querySelectorAll('.dropped');
        const sourceDiv = wrapper.querySelector('.drag-items');
        
        droppedItems.forEach(item => {
            // Create new draggable item
            const newItem = document.createElement('div');
            newItem.className = 'drag-item';
            newItem.draggable = true;
            newItem.textContent = item.textContent;
            newItem.dataset.category = item.dataset.originalCategory;
            newItem.dataset.originalCategory = item.dataset.originalCategory;
            
            newItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    text: item.textContent,
                    category: item.dataset.originalCategory
                }));
                newItem.classList.add('dragging');
            });
            
            newItem.addEventListener('dragend', () => {
                newItem.classList.remove('dragging');
            });
            
            sourceDiv.appendChild(newItem);
            item.remove();
        });
        
        // Clear drop zones
        wrapper.querySelectorAll('.dropped-items').forEach(drop => {
            drop.innerHTML = '';
        });
        
        // Remove results and completion messages
        const results = container.querySelector('.dragdrop-results');
        if (results) results.remove();
        
        const complete = wrapper.querySelector('.dragdrop-complete');
        if (complete) complete.remove();
        
        // Reset styles
        wrapper.querySelectorAll('.drop-zone').forEach(zone => {
            zone.style.borderColor = 'var(--text-medium)';
            zone.style.background = 'var(--bg-light)';
        });
    },
    
    saveProgress(container) {
        const wrapper = container.querySelector('.dragdrop-wrapper');
        if (!wrapper) return;
        
        const progress = {
            placedItems: []
        };
        
        const droppedItems = wrapper.querySelectorAll('.dropped');
        droppedItems.forEach(item => {
            progress.placedItems.push({
                text: item.textContent,
                originalCategory: item.dataset.originalCategory,
                placedIn: item.dataset.placedIn
            });
        });
        
        const lessonId = App.currentLesson;
        if (lessonId) {
            const saved = Storage.loadProgress(lessonId) || {};
            saved.dragDropProgress = progress;
            Storage.saveProgress(lessonId, saved);
        }
    },
    
    loadProgress(container) {
        const lessonId = App.currentLesson;
        if (!lessonId) return;
        
        const saved = Storage.loadProgress(lessonId);
        if (saved && saved.dragDropProgress) {
            // Reset current state first
            this.reset(container);
            
            const wrapper = container.querySelector('.dragdrop-wrapper');
            if (!wrapper) return;
            
            // Recreate the placed items
            const dropZones = wrapper.querySelectorAll('.drop-zone');
            const sourceDiv = wrapper.querySelector('.drag-items');
            
            saved.dragDropProgress.placedItems.forEach(itemData => {
                // Find the item in source
                const sourceItem = sourceDiv.querySelector(`.drag-item[data-category="${itemData.originalCategory}"]`);
                if (sourceItem && sourceItem.textContent === itemData.text) {
                    // Find the correct drop zone
                    const targetZone = Array.from(dropZones).find(
                        zone => zone.dataset.category === itemData.placedIn
                    );
                    
                    if (targetZone) {
                        const clone = sourceItem.cloneNode(true);
                        clone.draggable = false;
                        clone.style.cursor = 'default';
                        clone.classList.add('dropped');
                        clone.dataset.placedIn = itemData.placedIn;
                        
                        if (itemData.originalCategory === itemData.placedIn) {
                            clone.style.background = '#4caf50';
                            clone.style.color = 'white';
                        } else {
                            clone.style.background = '#f44336';
                            clone.style.color = 'white';
                        }
                        
                        const droppedItems = targetZone.querySelector('.dropped-items');
                        droppedItems.appendChild(clone);
                        sourceItem.remove();
                    }
                }
            });
        }
    }
};
