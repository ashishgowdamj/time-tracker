// Timezone utilities
document.addEventListener('DOMContentLoaded', function() {
    // Set default date/time if empty
    const dateTimeInput = document.querySelector('input[name="date_time"]');
    if (dateTimeInput && !dateTimeInput.value) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        dateTimeInput.value = `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    
    // Set default source timezone to user's timezone if available
    const sourceTimezoneSelect = document.querySelector('select[name="source_timezone"]');
    if (sourceTimezoneSelect) {
        try {
            // Attempt to get user's timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
                for (let i = 0; i < sourceTimezoneSelect.options.length; i++) {
                    if (sourceTimezoneSelect.options[i].value === timezone) {
                        sourceTimezoneSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        } catch (e) {
            console.error('Error getting local timezone:', e);
        }
    }
    
    // Set up quick timezone pairs
    setupQuickTimezones();
});

function setupQuickTimezones() {
    // Predefined common timezone pairs
    const commonPairs = [
        { name: 'US East ↔ US West', from: 'America/New_York', to: 'America/Los_Angeles' },
        { name: 'London ↔ New York', from: 'Europe/London', to: 'America/New_York' },
        { name: 'India ↔ US', from: 'Asia/Kolkata', to: 'America/New_York' },
        { name: 'Japan ↔ US', from: 'Asia/Tokyo', to: 'America/Los_Angeles' },
        { name: 'Australia ↔ Europe', from: 'Australia/Sydney', to: 'Europe/London' }
    ];
    
    // Create buttons for common pairs
    const container = document.createElement('div');
    container.className = 'mt-3';
    container.innerHTML = '<p class="form-label">Quick Timezone Pairs:</p>';
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group flex-wrap';
    buttonGroup.setAttribute('role', 'group');
    
    commonPairs.forEach(pair => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-sm btn-outline-secondary';
        button.textContent = pair.name;
        button.addEventListener('click', () => {
            setTimezonePair(pair.from, pair.to);
        });
        buttonGroup.appendChild(button);
    });
    
    container.appendChild(buttonGroup);
    
    // Find the form and inject the container after the first div
    const form = document.querySelector('form');
    if (form) {
        const firstFormGroup = form.querySelector('.mb-3');
        if (firstFormGroup) {
            firstFormGroup.parentNode.insertBefore(container, firstFormGroup.nextSibling);
        }
    }
}

function setTimezonePair(from, to) {
    const sourceSelect = document.querySelector('select[name="source_timezone"]');
    const targetSelect = document.querySelector('select[name="target_timezone"]');
    
    if (sourceSelect && targetSelect) {
        // Set source timezone
        for (let i = 0; i < sourceSelect.options.length; i++) {
            if (sourceSelect.options[i].value === from) {
                sourceSelect.selectedIndex = i;
                break;
            }
        }
        
        // Set target timezone
        for (let i = 0; i < targetSelect.options.length; i++) {
            if (targetSelect.options[i].value === to) {
                targetSelect.selectedIndex = i;
                break;
            }
        }
    }
}
