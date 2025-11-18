// Dashboard Page JavaScript for Sleep Hub
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile navigation toggle (shared with other pages)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Initialize dashboard animations
    initializeDashboard();
    
    // Progress Circle Animation
    function animateProgressCircle() {
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressFill && progressPercentage) {
            const targetProgress = 75; // 75% progress
            const circumference = 2 * Math.PI * 50; // radius = 50
            const offset = circumference - (targetProgress / 100) * circumference;
            
            // Animate the circle
            setTimeout(() => {
                progressFill.style.strokeDashoffset = offset;
            }, 500);
            
            // Animate the percentage number
            animateCounter(progressPercentage, 0, targetProgress, 2000, '%');
        }
    }
    
    // Sleep Chart Animation
    function animateSleepChart() {
        const sleepBars = document.querySelectorAll('.sleep-fill');
        
        sleepBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetHeight = bar.style.height;
                bar.style.height = '0%';
                bar.offsetHeight; // Force reflow
                bar.style.height = targetHeight;
            }, index * 200);
        });
    }
    
    // Counter Animation
    function animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Progress Bars Animation
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill, .goal-fill, .badge-fill');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                bar.offsetWidth; // Force reflow
                bar.style.width = targetWidth;
            }, index * 150);
        });
    }
    
    // Initialize Dashboard
    function initializeDashboard() {
        // Set current date for sleep logging
        const dateInput = document.getElementById('sleepDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        // Start animations after a short delay
        setTimeout(() => {
            animateProgressCircle();
            animateSleepChart();
            animateProgressBars();
        }, 300);
        
        // Initialize real-time updates
        startRealTimeUpdates();
    }
    
    // Sleep Modal Functions
    window.logSleep = function() {
        const modal = document.getElementById('sleepModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            trackEvent('Dashboard Interaction', 'Open Sleep Modal', 'Log Sleep');
        }
    };
    
    window.closeSleepModal = function() {
        const modal = document.getElementById('sleepModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            trackEvent('Dashboard Interaction', 'Close Sleep Modal', 'Cancel');
        }
    };
    
    // Close modal on outside click
    const sleepModal = document.getElementById('sleepModal');
    if (sleepModal) {
        sleepModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSleepModal();
            }
        });
    }
    
    // Sleep Form Submission
    const sleepForm = document.querySelector('.sleep-form');
    if (sleepForm) {
        sleepForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const sleepData = {
                date: formData.get('sleepDate'),
                bedtime: formData.get('bedtime'),
                wakeTime: formData.get('wakeTime'),
                quality: formData.get('sleepQuality')
            };
            
            // Calculate sleep duration
            const duration = calculateSleepDuration(sleepData.bedtime, sleepData.wakeTime);
            
            // Save sleep data (in real app, this would go to backend)
            saveSleepData(sleepData, duration);
            
            // Update dashboard
            updateSleepStats(duration, sleepData.quality);
            
            // Show success message
            showNotification(`Sleep logged successfully! You got ${duration.toFixed(1)} hours of sleep.`, 'success');
            
            // Close modal
            closeSleepModal();
            
            // Reset form
            this.reset();
            
            trackEvent('Sleep Tracking', 'Log Sleep', `${duration.toFixed(1)} hours`);
        });
    }
    
    // Calculate Sleep Duration
    function calculateSleepDuration(bedtime, wakeTime) {
        const bed = new Date(`2000-01-01 ${bedtime}`);
        let wake = new Date(`2000-01-01 ${wakeTime}`);
        
        // If wake time is before bed time, assume it's the next day
        if (wake < bed) {
            wake.setDate(wake.getDate() + 1);
        }
        
        const duration = (wake - bed) / (1000 * 60 * 60); // Convert to hours
        return Math.max(0, Math.min(24, duration)); // Clamp between 0 and 24 hours
    }
    
    // Save Sleep Data
    function saveSleepData(sleepData, duration) {
        const existingData = JSON.parse(localStorage.getItem('sleepData') || '[]');
        
        const newEntry = {
            ...sleepData,
            duration: duration,
            timestamp: new Date().toISOString()
        };
        
        // Remove any existing entry for the same date
        const filteredData = existingData.filter(entry => entry.date !== sleepData.date);
        filteredData.push(newEntry);
        
        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentData = filteredData.filter(entry => 
            new Date(entry.date) >= thirtyDaysAgo
        );
        
        localStorage.setItem('sleepData', JSON.stringify(recentData));
    }
    
    // Update Sleep Stats
    function updateSleepStats(newDuration, quality) {
        // Update average
        const avgElement = document.querySelector('.average-number');
        if (avgElement) {
            const currentAvg = parseFloat(avgElement.textContent);
            const newAvg = ((currentAvg * 6 + newDuration) / 7).toFixed(1);
            animateCounter(avgElement, currentAvg, parseFloat(newAvg), 1000, '');
        }
        
        // Update quality indicator
        const qualityIndicator = document.querySelector('.quality-indicator');
        if (qualityIndicator) {
            qualityIndicator.className = `quality-indicator ${quality}`;
            qualityIndicator.querySelector('span').textContent = 
                quality.charAt(0).toUpperCase() + quality.slice(1);
        }
        
        // Update trend
        const trend = document.querySelector('.trend');
        if (trend) {
            const trendValue = (newDuration - 7.7).toFixed(1);
            const trendIcon = trendValue >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            const trendClass = trendValue >= 0 ? 'positive' : 'negative';
            
            trend.className = `trend ${trendClass}`;
            trend.innerHTML = `
                <i class="fas ${trendIcon}"></i>
                <span>${Math.abs(trendValue)}h from last week</span>
            `;
        }
        
        // Add new bar to sleep chart (simplified)
        addNewSleepBar(newDuration, quality);
    }
    
    // Add New Sleep Bar
    function addNewSleepBar(duration, quality) {
        const sleepBars = document.querySelector('.sleep-bars');
        const lastBar = sleepBars.querySelector('.day-bar.today');
        
        if (lastBar) {
            // Update the "today" bar
            const sleepFill = lastBar.querySelector('.sleep-fill');
            const hoursLabel = lastBar.querySelector('.hours-label');
            
            const percentage = (duration / 10) * 100; // Assuming 10 hours is 100%
            const qualityClass = getQualityClass(duration);
            
            sleepFill.style.height = `${Math.min(percentage, 100)}%`;
            sleepFill.className = `sleep-fill ${qualityClass}`;
            hoursLabel.textContent = `${duration.toFixed(1)}h`;
            
            // Animate the change
            sleepFill.style.transform = 'scaleY(0)';
            setTimeout(() => {
                sleepFill.style.transform = 'scaleY(1)';
            }, 100);
        }
    }
    
    // Get Quality Class
    function getQualityClass(duration) {
        if (duration >= 8.5) return 'excellent';
        if (duration >= 7.5) return 'good';
        return 'low';
    }
    
    // Quick Action Functions
    window.continueLesson = function() {
        showNotification('Redirecting to next lesson...', 'info');
        setTimeout(() => {
            window.location.href = 'resources.html';
        }, 1000);
        trackEvent('Dashboard Action', 'Continue Learning', 'Sleep & Emotions');
    };
    
    window.joinSession = function() {
        showNotification('Joining study session...', 'info');
        setTimeout(() => {
            window.location.href = 'schedule.html';
        }, 1000);
        trackEvent('Dashboard Action', 'Join Session', 'Today 2:00 PM');
    };
    
    window.viewCommunity = function() {
        showNotification('Opening community forum...', 'info');
        setTimeout(() => {
            window.location.href = 'community.html';
        }, 1000);
        trackEvent('Dashboard Action', 'View Community', 'Forum');
    };
    
    window.takeQuiz = function() {
        showNotification('Loading quiz...', 'info');
        setTimeout(() => {
            window.location.href = 'resources.html#quizzes';
        }, 1000);
        trackEvent('Dashboard Action', 'Take Quiz', 'Knowledge Test');
    };
    
    window.viewResources = function() {
        showNotification('Opening resource library...', 'info');
        setTimeout(() => {
            window.location.href = 'resources.html#downloads';
        }, 1000);
        trackEvent('Dashboard Action', 'View Resources', 'Downloads');
    };
    
    // Real-time Updates
    function startRealTimeUpdates() {
        // Update time-based elements every minute
        setInterval(updateTimeBasedElements, 60000);
        
        // Update activity timestamps
        setInterval(updateActivityTimestamps, 30000);
    }
    
    function updateTimeBasedElements() {
        // Update "Today" labels and relative times
        const timeElements = document.querySelectorAll('.activity-time');
        timeElements.forEach(element => {
            if (element.textContent.includes('hours ago')) {
                // Update relative time (simplified)
                const currentText = element.textContent;
                const hours = parseInt(currentText.match(/(\d+)/)[1]);
                element.textContent = `${hours + 1} hours ago`;
            }
        });
    }
    
    function updateActivityTimestamps() {
        // In a real app, this would fetch new activities from the server
        // For demo, we'll just simulate activity updates
        console.log('Checking for new activities...');
    }
    
    // Goal Progress Simulation
    function simulateGoalProgress() {
        const goalBars = document.querySelectorAll('.goal-fill');
        
        goalBars.forEach((bar, index) => {
            setTimeout(() => {
                const currentWidth = parseInt(bar.style.width);
                const newWidth = Math.min(currentWidth + Math.random() * 5, 100);
                bar.style.width = `${newWidth}%`;
                
                // Update percentage text
                const percentageElement = bar.closest('.goal-item').querySelector('.goal-percentage');
                if (percentageElement) {
                    percentageElement.textContent = `${Math.floor(newWidth)}%`;
                }
            }, index * 1000);
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #4A90E2;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 3000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }
                .notification-success { border-left-color: #2ECC71; }
                .notification-warning { border-left-color: #F39C12; }
                .notification-error { border-left-color: #E74C3C; }
                .notification-info { border-left-color: #4A90E2; }
                .notification-content { 
                    display: flex; 
                    align-items: center; 
                    gap: 0.5rem; 
                    flex: 1;
                }
                .notification-close { 
                    background: none; 
                    border: none; 
                    cursor: pointer; 
                    color: #6C757D;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    transition: background-color 0.2s;
                }
                .notification-close:hover {
                    background: #F8F9FA;
                }
                @keyframes slideInRight {
                    from { 
                        transform: translateX(100%); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(0); 
                        opacity: 1; 
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Achievement Hover Effects
    const achievementBadges = document.querySelectorAll('.achievement-badge');
    achievementBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            if (this.classList.contains('earned')) {
                this.style.transform = 'scale(1.05)';
            } else if (this.classList.contains('in-progress')) {
                this.style.transform = 'scale(1.02)';
                this.style.borderColor = 'var(--warning-color)';
            }
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.borderColor = '';
        });
    });
    
    // Module Item Click Handlers
    const moduleItems = document.querySelectorAll('.module-item');
    moduleItems.forEach(item => {
        item.addEventListener('click', function() {
            const moduleTitle = this.querySelector('h5').textContent;
            const moduleStatus = this.classList.contains('completed') ? 'completed' :
                               this.classList.contains('in-progress') ? 'in-progress' : 'locked';
            
            if (moduleStatus === 'locked') {
                showNotification('Complete previous modules to unlock this one', 'warning');
            } else if (moduleStatus === 'completed') {
                showNotification(`Opening "${moduleTitle}" for review...`, 'info');
                setTimeout(() => window.location.href = 'resources.html', 1000);
            } else {
                showNotification(`Continuing "${moduleTitle}"...`, 'info');
                setTimeout(() => window.location.href = 'resources.html', 1000);
            }
            
            trackEvent('Module Interaction', 'Click Module', moduleTitle);
        });
    });
    
    // Activity Item Hover Effects
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
            this.style.backgroundColor = 'white';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.backgroundColor = '';
        });
    });
    
    // Sleep Bar Hover Effects
    const dayBars = document.querySelectorAll('.day-bar');
    dayBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            const hours = this.getAttribute('data-hours');
            const day = this.getAttribute('data-day');
            
            if (hours && day) {
                const quality = getQualityClass(parseFloat(hours));
                const qualityText = quality === 'excellent' ? 'Excellent' :
                                  quality === 'good' ? 'Good' : 'Needs Improvement';
                
                showTooltip(this, `${day}: ${hours} hours (${qualityText})`);
            }
        });
        
        bar.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
    
    // Tooltip Functions
    let tooltipElement = null;
    
    function showTooltip(target, text) {
        hideTooltip(); // Remove any existing tooltip
        
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'dashboard-tooltip';
        tooltipElement.textContent = text;
        tooltipElement.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltipElement);
        
        const rect = target.getBoundingClientRect();
        tooltipElement.style.left = `${rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2}px`;
        tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 5}px`;
    }
    
    function hideTooltip() {
        if (tooltipElement) {
            tooltipElement.remove();
            tooltipElement = null;
        }
    }
    
    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            if (!sleepModal.classList.contains('hidden')) {
                closeSleepModal();
            }
            
            // Also close mobile menu
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Quick action shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'l':
                    e.preventDefault();
                    logSleep();
                    break;
                case 'n':
                    e.preventDefault();
                    continueLesson();
                    break;
                case 'j':
                    e.preventDefault();
                    joinSession();
                    break;
            }
        }
    });
    
    // Analytics Tracking (placeholder)
    function trackEvent(category, action, label) {
        console.log(`Dashboard Event: ${category} - ${action} - ${label}`);
        // In a real app, this would send data to analytics service
    }
    
    // Scroll Effects
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update header shadow based on scroll
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for Card Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe dashboard cards for animations
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Performance: Debounce resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        // Recalculate layouts if needed
        hideTooltip();
    }, 250));

    
    console.log('Sleep Hub - Dashboard loaded successfully! ??');
});