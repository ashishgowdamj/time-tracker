// Chart rendering functions

function renderWeeklyChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Ensure data is valid
    if (!data || !data.labels || !data.values || !Array.isArray(data.labels) || !Array.isArray(data.values)) {
        console.error('Invalid chart data');
        return;
    }
    
    // If data is empty, display a message
    if (data.labels.length === 0 || data.values.length === 0) {
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['No Data'],
                datasets: [{
                    label: 'Hours',
                    data: [0],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Day of Week'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function() {
                                return 'No data available';
                            }
                        }
                    }
                }
            }
        });
        return;
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Hours',
                data: data.values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day of Week'
                    }
                }
            }
        }
    });
}

function renderProjectChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Ensure data is valid
    if (!data || !data.labels || !data.values || !Array.isArray(data.labels) || !Array.isArray(data.values)) {
        console.error('Invalid chart data');
        return;
    }
    
    // If data is empty, display a message
    if (data.labels.length === 0 || data.values.length === 0) {
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Data'],
                datasets: [{
                    label: 'Hours',
                    data: [1],
                    backgroundColor: ['#ccc'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function() {
                                return 'No project data available';
                            }
                        }
                    }
                }
            }
        });
        return;
    }
    
    // Use custom colors if provided, otherwise generate them
    const colors = data.colors && data.colors.length === data.labels.length
        ? data.colors
        : generateColors(data.labels.length);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Hours',
                data: data.values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} hours`;
                        }
                    }
                }
            }
        }
    });
}

// Helper to generate colors
function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 137) % 360; // Golden angle approximation for nice distribution
        colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
}

// Export functions
window.renderWeeklyChart = renderWeeklyChart;
window.renderProjectChart = renderProjectChart;
