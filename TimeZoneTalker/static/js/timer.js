// Handle timer functionality
let timerInterval;
let timerElement;

function startTimer(startTimestamp) {
    timerElement = document.getElementById('timer-display');
    if (!timerElement) return;
    
    // Clear existing interval if any
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Update timer immediately
    updateTimer(startTimestamp);
    
    // Set up interval to update timer every second
    timerInterval = setInterval(() => {
        updateTimer(startTimestamp);
    }, 1000);
}

function updateTimer(startTimestamp) {
    if (!timerElement) return;
    
    const now = Math.floor(Date.now() / 1000);
    const elapsedSeconds = now - startTimestamp;
    
    // Format time as HH:MM:SS
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay(element) {
    // This function is used to display the current duration for paused timers
    if (!element) return;
    
    // Get the data from the element
    const startTime = parseInt(element.dataset.startTime);
    const status = element.dataset.status;
    
    if (status === 'paused') {
        // For paused timers, we assume the duration is already calculated and stored
        // So we just display it correctly by making an AJAX call to get the current duration
        const entryId = document.getElementById('entry-id').value;
        if (entryId) {
            fetch(`/timer/${entryId}/duration`)
                .then(response => response.json())
                .then(data => {
                    if (data.duration) {
                        element.textContent = data.duration;
                    }
                })
                .catch(error => {
                    console.error('Error getting timer duration:', error);
                });
        }
    }
}

// Function to stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Export functions
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.updateTimerDisplay = updateTimerDisplay;
