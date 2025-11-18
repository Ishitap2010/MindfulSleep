// Schedule Page JavaScript for Sleep Hub
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile navigation toggle (shared with home page)
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
    
    // Filter Tabs Functionality
    const filterTabs = document.querySelectorAll('.tab-btn');
    const sessionCards = document.querySelectorAll('.session-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter session cards
            sessionCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 200);
                }
            });
            
            // Update session counts
            updateSessionCounts(filter);
        });
    });
    
    // Update session counts based on filter
    function updateSessionCounts(filter) {
        const sections = document.querySelectorAll('.schedule-section');
        
        sections.forEach(section => {
            const cards = section.querySelectorAll('.session-card');
            const countElement = section.querySelector('.session-count');
            
            if (countElement) {
                let visibleCount = 0;
                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        visibleCount++;
                    }
                });
                
                const sessionText = visibleCount === 1 ? 'session' : 'sessions';
                countElement.textContent = `${visibleCount} ${sessionText} available`;
            }
        });
    }
    
    // Session Card Interactions
    const joinButtons = document.querySelectorAll('.join-btn');
    const infoButtons = document.querySelectorAll('.info-btn');
    const waitlistButtons = document.querySelectorAll('.waitlist-btn');
    
    // Join Session Handler
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionCard = this.closest('.session-card');
            const sessionTitle = sessionCard.querySelector('h3').textContent;
            
            // Simulate joining session
            showNotification(`Joining "${sessionTitle}"...`, 'success');
            
            // Update button state
            this.innerHTML = '<i class="fas fa-video"></i> Joining...';
            this.classList.add('btn-disabled');
            this.disabled = true;
            
            // Simulate redirect to video call
            setTimeout(() => {
                showNotification(`Successfully joined "${sessionTitle}"!`, 'success');
                this.innerHTML = '<i class="fas fa-video"></i> In Session';
            }, 2000);
            
            // Track event
            trackEvent('Session Interaction', 'Join Session', sessionTitle);
        });
    });
    
    // Info Button Handler
    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionCard = this.closest('.session-card');
            const sessionTitle = sessionCard.querySelector('h3').textContent;
            
            showSessionDetails(sessionCard);
            trackEvent('Session Interaction', 'View Details', sessionTitle);
        });
    });
    
    // Waitlist Button Handler
    waitlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionCard = this.closest('.session-card');
            const sessionTitle = sessionCard.querySelector('h3').textContent;
            
            // Add to waitlist
            this.innerHTML = '<i class="fas fa-check"></i> On Waitlist';
            this.classList.remove('btn-outline');
            this.classList.add('btn-secondary');
            this.disabled = true;
            
            showNotification(`Added to waitlist for "${sessionTitle}"`, 'success');
            trackEvent('Session Interaction', 'Join Waitlist', sessionTitle);
        });
    });
    
    // Calendar Navigation
    let currentWeek = new Date();
    
    window.previousWeek = function() {
        currentWeek.setDate(currentWeek.getDate() - 7);
        updateCalendarView();
        trackEvent('Calendar Navigation', 'Previous Week', formatWeek(currentWeek));
    };
    
    window.nextWeek = function() {
        currentWeek.setDate(currentWeek.getDate() + 7);
        updateCalendarView();
        trackEvent('Calendar Navigation', 'Next Week', formatWeek(currentWeek));
    };
    
    function updateCalendarView() {
        const weekRange = document.querySelector('.week-range');
        if (weekRange) {
            const startOfWeek = new Date(currentWeek);
            const dayOfWeek = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            weekRange.textContent = `${startStr} - ${endStr}`;
        }
        
        // Update calendar dates
        updateCalendarDates();
    }
    
    function updateCalendarDates() {
        const dayHeaders = document.querySelectorAll('.day-header .date');
        const dayCells = document.querySelectorAll('.day-cell');
        
        const startOfWeek = new Date(currentWeek);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        
        // Update header dates
        dayHeaders.forEach((dateEl, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            dateEl.textContent = date.getDate();
        });
        
        // Update cell classes for past/present/future
        const today = new Date();
        dayCells.forEach((cell, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            
            cell.classList.remove('past', 'today', 'future');
            
            if (date.toDateString() === today.toDateString()) {
                cell.classList.add('today');
            } else if (date < today) {
                cell.classList.add('past');
            } else {
                cell.classList.add('future');
            }
        });
    }
    
    function formatWeek(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Session Mini Card Clicks (Calendar)
    const sessionMinis = document.querySelectorAll('.session-mini');
    sessionMinis.forEach(mini => {
        mini.addEventListener('click', function() {
            const title = this.querySelector('.title').textContent;
            const time = this.querySelector('.time').textContent;
            
            showNotification(`Session: ${title} at ${time}`, 'info');
            trackEvent('Calendar Interaction', 'Session Mini Click', title);
        });
    });
    
    // My Sessions - Cancel Registration
    const cancelButtons = document.querySelectorAll('.my-session-card .btn-danger-outline');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sessionCard = this.closest('.my-session-card');
            const sessionTitle = sessionCard.querySelector('h3').textContent;
            
            if (confirm(`Are you sure you want to cancel your registration for "${sessionTitle}"?`)) {
                // Animate removal
                sessionCard.style.transform = 'translateX(-100%)';
                sessionCard.style.opacity = '0';
                
                setTimeout(() => {
                    sessionCard.remove();
                    updateMySessionsCount();
                }, 300);
                
                showNotification(`Cancelled registration for "${sessionTitle}"`, 'warning');
                trackEvent('My Sessions', 'Cancel Registration', sessionTitle);
            }
        });
    });
    
    // Set Reminder Buttons
    const reminderButtons = document.querySelectorAll('.my-session-card .btn-outline');
    reminderButtons.forEach(button => {
        if (button.textContent.includes('Set Reminder')) {
            button.addEventListener('click', function() {
                const sessionCard = this.closest('.my-session-card');
                const sessionTitle = sessionCard.querySelector('h3').textContent;
                
                // Request notification permission if needed
                if ('Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            setSessionReminder(sessionTitle, this);
                        }
                    });
                } else if (Notification.permission === 'granted') {
                    setSessionReminder(sessionTitle, this);
                } else {
                    showNotification('Please enable notifications to set reminders', 'warning');
                }
            });
        }
    });
    
    function setSessionReminder(sessionTitle, button) {
        // Update button state
        button.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
        button.classList.add('btn-success');
        button.disabled = true;
        
        showNotification(`Reminder set for "${sessionTitle}"`, 'success');
        trackEvent('My Sessions', 'Set Reminder', sessionTitle);
        
        // In a real app, this would schedule a notification
        // For demo, we'll show a notification after 5 seconds
        setTimeout(() => {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Sleep Hub Reminder', {
                    body: `"${sessionTitle}" starts in 15 minutes!`,
                    icon: '/favicon.ico'
                });
            }
        }, 5000);
    }
    
    function updateMySessionsCount() {
        const mySessionsSection = document.querySelector('.my-sessions-section');
        const sessionCount = mySessionsSection.querySelector('.session-count');
        const remainingSessions = document.querySelectorAll('.my-session-card').length;
        
        if (sessionCount) {
            const sessionText = remainingSessions === 1 ? 'session' : 'sessions';
            sessionCount.textContent = `${remainingSessions} upcoming ${sessionText}`;
        }
    }
    
    // Host Session Modal
    window.openHostModal = function() {
        const modal = document.getElementById('hostModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            trackEvent('Modal Interaction', 'Open Host Modal', 'Schedule Page');
        }
    };
    
    window.closeHostModal = function() {
        const modal = document.getElementById('hostModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            trackEvent('Modal Interaction', 'Close Host Modal', 'Schedule Page');
        }
    };
    
    // Close modal on outside click
    const modal = document.getElementById('hostModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeHostModal();
            }
        });
    }
    
    // Show Session Details Modal
    function showSessionDetails(sessionCard) {
        const title = sessionCard.querySelector('h3').textContent;
        const description = sessionCard.querySelector('p').textContent;
        const time = sessionCard.querySelector('.time').textContent;
        const duration = sessionCard.querySelector('.duration').textContent;
        
        // Create and show details modal (simplified version)
        const detailsHTML = `
            <div class="modal" id="sessionDetailsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" onclick="closeSessionDetails()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Time:</strong> ${time} (${duration})</p>
                        <p><strong>Description:</strong> ${description}</p>
                        <button class="btn btn-primary">Join Session</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', detailsHTML);
        document.body.style.overflow = 'hidden';
    }
    
    window.closeSessionDetails = function() {
        const modal = document.getElementById('sessionDetailsModal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    };
    
    // Notification System
    function showNotification(message, type = 'info') {
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
                    animation: slideIn 0.3s ease;
                }
                .notification-success { border-left-color: #2ECC71; }
                .notification-warning { border-left-color: #F39C12; }
                .notification-error { border-left-color: #E74C3C; }
                .notification-content { display: flex; align-items: center; gap: 0.5rem; }
                .notification-close { background: none; border: none; cursor: pointer; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
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
    
    // Analytics Tracking (placeholder)
    function trackEvent(category, action, label) {
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
        // In a real app, this would send data to analytics service
    }
    
    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                if (openModal.id === 'hostModal') {
                    closeHostModal();
                } else if (openModal.id === 'sessionDetailsModal') {
                    closeSessionDetails();
                }
            }
            
            // Also close mobile menu
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Arrow keys for calendar navigation
        if (e.ctrlKey) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                previousWeek();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextWeek();
            }
        }
    });
    
    // Scroll Effects
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update header shadow
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe session cards for scroll animations
    const animateElements = document.querySelectorAll('.session-card, .my-session-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize calendar view
    updateCalendarView();
    
    // Performance optimization: Debounce resize events
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
        // Adjust calendar layout if needed
        updateCalendarView();
    }, 250));
    
    console.log('Sleep Hub - Schedule page loaded successfully! ??');
});