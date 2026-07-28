// Matching Activity Engine
const MatchingActivity = {
    selectedLeft: null,
    selectedRight: null,
    matchedPairs: [],
    
    render(container, pairs) {
        // Shuffle both sides
        const leftItems = pairs.map(p => p.left);
        const rightItems = pairs.map(p => p.right);
        const shuffledLeft = Utils.shuffle(leftItems);
        const shuffledRight = Utils.shuffle(rightItems);
        
        // Create containers
        const leftDiv = document.createElement('div');
        leftDiv.className = 'matching-items left-items';
        const rightDiv = document.createElement('div');
        rightDiv.className = 'matching-items right-items';
        
        // Render left items
        shuffledLeft.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'matching-item';
            item.dataset.value = text;
            item.dataset.index = index;
            item.textContent = text;
            item.addEventListener('click', () => this.selectLeft(item, text));
            leftDiv.appendChild(item);
        });
        
        // Render right items
        shuffledRight.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'matching-item';
            item.dataset.value = text;
            item.dataset.index = index;
            item.textContent = text;
            item.addEventListener('click', () => this.selectRight(item, text));
            rightDiv.appendChild(item);
        });
        
        const wrapper = document.createElement('div');
        wrapper.className = 'matching-container';
        wrapper.appendChild(leftDiv);
        wrapper.appendChild(rightDiv);
        container.appendChild(wrapper);
        
        // Add check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'nav-btn';
        checkBtn.textContent = 'Check Matches';
        checkBtn.addEventListener('click', () => this.checkMatches());
        container.appendChild(checkBtn);
    },
    
    selectLeft(element, value) {
        if (element.classList.contains('matched')) return;
        
        // Deselect previous
        document.querySelectorAll('.left-items .matching-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        element.classList.add('selected');
        this.selectedLeft = { element, value };
        
        this.tryMatch();
    },
    
    selectRight(element, value) {
        if (element.classList.contains('matched')) return;
        
        // Deselect previous
        document.querySelectorAll('.right-items .matching-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        element.classList.add('selected');
        this.selectedRight = { element, value };
        
        this.tryMatch();
    },
    
    tryMatch() {
        if (this.selectedLeft && this.selectedRight) {
            // Check if they match
            const leftValue = this.selectedLeft.value;
            const rightValue = this.selectedRight.value;
            
            // This would check against the original pairs
            // For demo, we'll use a simple check
            const isMatch = this.checkPairMatch(leftValue, rightValue);
            
            if (isMatch) {
                this.selectedLeft.element.classList.remove('selected');
                this.selectedLeft.element.classList.add('matched');
                this.selectedRight.element.classList.remove('selected');
                this.selectedRight.element.classList.add('matched');
                this.matchedPairs.push(leftValue, rightValue);
            } else {
                this.selectedLeft.element.classList.remove('selected');
                this.selectedRight.element.classList.remove('selected');
            }
            
            this.selectedLeft = null;
            this.selectedRight = null;
        }
    },
    
    checkPairMatch(left, right) {
        // This would check against the actual pairs
        // For demo, we'll use a simple match check
        return left.toLowerCase().charAt(0) === right.toLowerCase().charAt(0);
    },
    
    checkMatches() {
        const totalPairs = document.querySelectorAll('.left-items .matching-item').length;
        const matchedPairs = document.querySelectorAll('.matching-item.matched').length / 2;
        
        if (matchedPairs === totalPairs) {
            alert('Perfect! All matches are correct!');
        } else {
            alert(`You matched ${matchedPairs} out of ${totalPairs} pairs.`);
        }
    }
};
