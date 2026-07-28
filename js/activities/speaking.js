// Speaking Activity Engine
const SpeakingActivity = {
    timerInterval: null,
    timeLeft: 0,
    isRecording: false,
    
    render(container, data) {
        const wrapper = document.createElement('div');
        wrapper.className = 'speaking-activity-wrapper';
        
        // Prompt
        if (data.prompt) {
            const promptDiv = document.createElement('div');
            promptDiv.className = 'speaking-prompt';
            promptDiv.innerHTML = `<h3>Speaking Prompt</h3><p>${data.prompt}</p>`;
            wrapper.appendChild(promptDiv);
        }
        
        // Tips
        if (data.tips && data.tips.length > 0) {
            const tipsDiv = document.createElement('div');
            tipsDiv.className = 'speaking-tips';
            tipsDiv.innerHTML = `
                <h4>Tips</h4>
                <ul>${data.tips.map(t => `<li>${t}</li>`).join('')}</ul>
            `;
            wrapper.appendChild(tipsDiv);
        }
        
        // Timer
        if (data.duration) {
            const timerDiv = document.createElement('div');
            timerDiv.className = 'speaking-timer';
            timerDiv.id = 'speakingTimer';
            timerDiv.textContent = `${data.duration}s`;
            wrapper.appendChild(timerDiv);
            
            // Timer controls
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'speaking-controls';
            controlsDiv.style.display = 'flex';
            controlsDiv.style.gap = '0.5rem';
            controlsDiv.style.marginTop = '1rem';
            controlsDiv.style.justifyContent = 'center';
            
            const startBtn = document.createElement('button');
            startBtn.className = 'nav-btn';
            startBtn.textContent = 'Start Timer';
            startBtn.addEventListener('click', () => {
                this.startTimer(data.duration, timerDiv, startBtn, resetBtn);
            });
            
            const resetBtn = document.createElement('button');
            resetBtn.className = 'nav-btn';
            resetBtn.textContent = 'Reset Timer';
            resetBtn.addEventListener('click', () => {
                this.resetTimer(data.duration, timerDiv, startBtn);
            });
            
            controlsDiv.appendChild(startBtn);
            controlsDiv.appendChild(resetBtn);
            wrapper.appendChild(controlsDiv);
        }
        
        // Recording options
        if (data.enableRecording !== false) {
            const recordingDiv = document.createElement('div');
            recordingDiv.className = 'speaking-recording';
            recordingDiv.style.marginTop = '1.5rem';
            recordingDiv.style.padding = '1rem';
            recordingDiv.style.borderRadius = '8px';
            recordingDiv.style.background = 'var(--bg-light)';
            
            const recordBtn = document.createElement('button');
            recordBtn.className = 'nav-btn';
            recordBtn.id = 'recordBtn';
            recordBtn.textContent = 'Start Recording';
            recordBtn.style.background = '#f44336';
            recordBtn.addEventListener('click', () => this.toggleRecording(recordBtn));
            
            const statusText = document.createElement('span');
            statusText.id = 'recordingStatus';
            statusText.style.marginLeft = '1rem';
            statusText.style.fontWeight = '500';
            
            recordingDiv.appendChild(recordBtn);
            recordingDiv.appendChild(statusText);
            wrapper.appendChild(recordingDiv);
        }
        
        // Notes area
        const notesDiv = document.createElement('div');
        notesDiv.className = 'speaking-notes';
        notesDiv.style.marginTop = '1.5rem';
        notesDiv.innerHTML = `
            <h4>Notes</h4>
            <textarea id="speakingNotes" class="gap-fill-input" 
                style="width: 100%; min-height: 100px; padding: 0.75rem; border-radius: 8px; resize: vertical;"
                placeholder="Write notes or your response here..."></textarea>
            <button id="saveNotesBtn" class="nav-btn" style="margin-top: 0.5rem;">Save Notes</button>
        `;
        wrapper.appendChild(notesDiv);
        
        container.appendChild(wrapper);
        
        // Load saved notes
        this.loadNotes();
        
        // Save notes
        const saveNotesBtn = document.getElementById('saveNotesBtn');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => this.saveNotes());
        }
    },
    
    startTimer(duration, display, startBtn, resetBtn) {
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timeLeft = duration;
        startBtn.disabled = true;
        startBtn.textContent = 'Running...';
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            display.textContent = `${this.timeLeft}s`;
            
            // Change color when time is low
            if (this.timeLeft <= 5) {
                display.style.color = '#f44336';
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                display.textContent = 'Time\'s up!';
                startBtn.disabled = false;
                startBtn.textContent = 'Restart Timer';
                display.style.color = '#f44336';
            }
        }, 1000);
    },
    
    resetTimer(duration, display, startBtn) {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timeLeft = duration;
        display.textContent = `${duration}s`;
        display.style.color = 'var(--primary)';
        startBtn.disabled = false;
        startBtn.textContent = 'Start Timer';
    },
    
    toggleRecording(button) {
        if (!this.isRecording) {
            this.startRecording(button);
        } else {
            this.stopRecording(button);
        }
    },
    
    startRecording(button) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    this.isRecording = true;
                    button.textContent = 'Stop Recording';
                    button.style.background = '#4caf50';
                    document.getElementById('recordingStatus').textContent = 'Recording...';
                    
                    // Store stream for later use
                    this.mediaStream = stream;
                    
                    // Create audio recorder
                    const mediaRecorder = new MediaRecorder(stream);
                    this.mediaRecorder = mediaRecorder;
                    const audioChunks = [];
                    
                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };
                    
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        
                        // Create audio player
                        const audioPlayer = document.createElement('audio');
                        audioPlayer.controls = true;
                        audioPlayer.src = audioUrl;
                        audioPlayer.style.marginTop = '1rem';
                        audioPlayer.style.width = '100%';
                        
                        // Remove old player
                        const oldPlayer = document.getElementById('audioPlayer');
                        if (oldPlayer) oldPlayer.remove();
                        
                        audioPlayer.id = 'audioPlayer';
                        document.getElementById('speaking-recording')?.appendChild(audioPlayer);
                    };
                    
                    mediaRecorder.start();
                })
                .catch((error) => {
                    console.error('Error accessing microphone:', error);
                    document.getElementById('recordingStatus').textContent = 'Error: Cannot access microphone';
                    button.textContent = 'Start Recording';
                    button.style.background = '#f44336';
                });
        } else {
            alert('Your browser does not support audio recording.');
        }
    },
    
    stopRecording(button) {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.isRecording = false;
            button.textContent = 'Start Recording';
            button.style.background = '#f44336';
            document.getElementById('recordingStatus').textContent = 'Recording saved. Play below.';
            
            // Stop all tracks
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.mediaStream = null;
            }
        }
    },
    
    saveNotes() {
        const notesTextarea = document.getElementById('speakingNotes');
        if (notesTextarea) {
            const notes = notesTextarea.value;
            const lessonId = App.currentLesson;
            if (lessonId) {
                const saved = Storage.loadProgress(lessonId) || {};
                saved.speakingNotes = notes;
                Storage.saveProgress(lessonId, saved);
                
                // Show save indicator
                const indicator = document.createElement('div');
                indicator.style.marginTop = '0.5rem';
                indicator.style.color = '#4caf50';
                indicator.textContent = 'Notes saved!';
                notesTextarea.parentElement.appendChild(indicator);
                setTimeout(() => {
                    indicator.remove();
                }, 2000);
            }
        }
    },
    
    loadNotes() {
        const lessonId = App.currentLesson;
        if (lessonId) {
            const saved = Storage.loadProgress(lessonId);
            if (saved && saved.speakingNotes) {
                const notesTextarea = document.getElementById('speakingNotes');
                if (notesTextarea) {
                    notesTextarea.value = saved.speakingNotes;
                }
            }
        }
    }
};
