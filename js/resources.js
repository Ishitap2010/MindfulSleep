// Resources Page JavaScript for Sleep Hub
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
    
    // Initialize resources page
    initializeResourcesPage();
    
    // Resource Filtering
    const resourceFilters = document.querySelectorAll('.resource-filter');
    const resourceCards = document.querySelectorAll('[data-category]');
    
    resourceFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            
            // Update active filter
            resourceFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter resources
            filterResources(category);
            
            // Update section counters
            updateResourceCounts(category);
            
            // Track filter usage
            trackEvent('Resource Filter', 'Filter Applied', category);
        });
    });
    
    function filterResources(category) {
        resourceCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const section = card.closest('.resources-section');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                if (section) section.style.display = 'block';
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
        
        // Hide sections with no visible cards
        setTimeout(() => {
            document.querySelectorAll('.resources-section').forEach(section => {
                const visibleCards = section.querySelectorAll('[data-category]:not([style*="display: none"])');
                if (category !== 'all' && visibleCards.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
        }, 250);
    }
    
    function updateResourceCounts(category) {
        document.querySelectorAll('.resources-section').forEach(section => {
            const cards = section.querySelectorAll('[data-category]');
            const countElement = section.querySelector('.resource-count');
            
            if (countElement) {
                let visibleCount = 0;
                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        visibleCount++;
                    }
                });
                
                const resourceType = section.id.replace('-', ' ');
                const itemText = visibleCount === 1 ? 'item' : 'items';
                countElement.textContent = `${visibleCount} ${itemText} available`;
            }
        });
    }
    
    // Module Functions
    window.reviewModule = function(moduleId) {
        showNotification(`Opening ${moduleId} module for review...`, 'info');
        setTimeout(() => {
            // Simulate navigation to module review
            showNotification('Module review loaded successfully!', 'success');
        }, 1000);
        trackEvent('Module Interaction', 'Review Module', moduleId);
    };
    
    window.continueModule = function(moduleId) {
        showNotification(`Continuing ${moduleId} module...`, 'info');
        setTimeout(() => {
            // Simulate navigation to next lesson
            showNotification('Loading next lesson...', 'success');
        }, 1000);
        trackEvent('Module Interaction', 'Continue Module', moduleId);
    };
    
    window.viewProgress = function(moduleId) {
        showDetailedProgress(moduleId);
        trackEvent('Module Interaction', 'View Progress', moduleId);
    };
    
    window.downloadCertificate = function(moduleId) {
        showNotification('Downloading certificate...', 'info');
        setTimeout(() => {
            showNotification('Certificate downloaded successfully!', 'success');
        }, 2000);
        trackEvent('Module Interaction', 'Download Certificate', moduleId);
    };
    
    window.viewRequirements = function(moduleId) {
        showModuleRequirements(moduleId);
        trackEvent('Module Interaction', 'View Requirements', moduleId);
    };
    
    // Interactive Tool Functions
    window.launchTool = function(toolId) {
        const toolModal = document.getElementById('toolModal');
        const toolTitle = document.getElementById('toolModalTitle');
        const toolContainer = document.getElementById('toolContainer');
        
        if (toolModal && toolTitle && toolContainer) {
            // Set tool-specific content
            const toolData = getToolData(toolId);
            toolTitle.textContent = toolData.title;
            toolContainer.innerHTML = toolData.content;
            
            // Show modal
            toolModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Initialize tool-specific functionality
            initializeTool(toolId);
            
            trackEvent('Interactive Tool', 'Launch Tool', toolId);
        }
    };
    
    window.closeTool = function() {
        const toolModal = document.getElementById('toolModal');
        if (toolModal) {
            toolModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };
    
    function getToolData(toolId) {
        const tools = {
            'sleep-simulator': {
                title: 'Sleep Cycle Simulator',
                content: `
                    <div class="tool-interface">
                        <h3>Interactive Sleep Cycle Visualization</h3>
                        <p>Explore the different stages of sleep and their impact on teenage brain development.</p>
                        <div class="simulator-controls">
                            <button class="btn btn-primary" onclick="startSimulation()">
                                <i class="fas fa-play"></i>
                                Start Simulation
                            </button>
                            <div class="simulation-display" id="sleepSimulation">
                                <div class="sleep-stage-indicator">
                                    <span class="stage-label">Sleep Stage: <strong>Awake</strong></span>
                                    <div class="brain-wave-display">
                                        <canvas id="brainWaveCanvas" width="400" height="100"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            'sleep-calculator': {
                title: 'Sleep Debt Calculator',
                content: `
                    <div class="tool-interface">
                        <h3>Calculate Your Sleep Debt</h3>
                        <form id="sleepDebtForm" class="calculator-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="ageInput">Age</label>
                                    <input type="number" id="ageInput" min="13" max="19" value="16" required>
                                </div>
                                <div class="form-group">
                                    <label for="idealSleep">Ideal Sleep (hours)</label>
                                    <input type="number" id="idealSleep" min="7" max="10" step="0.5" value="9" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Weekly Sleep Hours</label>
                                <div class="week-inputs">
                                    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                                        <div class="day-input">
                                            <label for="${day.toLowerCase()}Sleep">${day}</label>
                                            <input type="number" id="${day.toLowerCase()}Sleep" min="0" max="12" step="0.5" value="7" required>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-calculator"></i>
                                Calculate Sleep Debt
                            </button>
                        </form>
                        <div id="sleepDebtResults" class="results-display hidden">
                            <!-- Results will be displayed here -->
                        </div>
                    </div>
                `
            },
            'bedtime-optimizer': {
                title: 'Bedtime Optimizer',
                content: `
                    <div class="tool-interface">
                        <h3>Find Your Optimal Bedtime</h3>
                        <form id="bedtimeForm" class="optimizer-form">
                            <div class="form-group">
                                <label for="wakeTime">Wake Up Time</label>
                                <input type="time" id="wakeTime" value="07:00" required>
                            </div>
                            <div class="form-group">
                                <label for="sleepDuration">Desired Sleep Duration</label>
                                <select id="sleepDuration" required>
                                    <option value="8">8 hours</option>
                                    <option value="8.5">8.5 hours</option>
                                    <option value="9" selected>9 hours</option>
                                    <option value="9.5">9.5 hours</option>
                                    <option value="10">10 hours</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="fallAsleepTime">Time to Fall Asleep (minutes)</label>
                                <input type="number" id="fallAsleepTime" min="5" max="60" value="15" required>
                            </div>
                            <div class="form-group">
                                <label>Sleep Chronotype</label>
                                <div class="radio-group">
                                    <label><input type="radio" name="chronotype" value="early" required> Early Bird</label>
                                    <label><input type="radio" name="chronotype" value="normal" checked> Normal</label>
                                    <label><input type="radio" name="chronotype" value="late"> Night Owl</label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-magic"></i>
                                Optimize My Bedtime
                            </button>
                        </form>
                        <div id="bedtimeResults" class="results-display hidden">
                            <!-- Results will be displayed here -->
                        </div>
                    </div>
                `
            }
        };
        
        return tools[toolId] || {
            title: 'Interactive Tool',
            content: '<p>Tool loading...</p>'
        };
    }
    
    function initializeTool(toolId) {
        switch(toolId) {
            case 'sleep-simulator':
                initializeSleepSimulator();
                break;
            case 'sleep-calculator':
                initializeSleepCalculator();
                break;
            case 'bedtime-optimizer':
                initializeBedtimeOptimizer();
                break;
        }
    }
    
    function initializeSleepSimulator() {
        window.startSimulation = function() {
            const canvas = document.getElementById('brainWaveCanvas');
            if (canvas) {
                animateBrainWaves(canvas);
            }
        };
    }
    
    function initializeSleepCalculator() {
        const form = document.getElementById('sleepDebtForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                calculateSleepDebt();
            });
        }
    }
    
    function initializeBedtimeOptimizer() {
        const form = document.getElementById('bedtimeForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                optimizeBedtime();
            });
        }
    }
    
    function calculateSleepDebt() {
        const idealSleep = parseFloat(document.getElementById('idealSleep').value);
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        let totalActual = 0;
        
        days.forEach(day => {
            const sleep = parseFloat(document.getElementById(`${day}Sleep`).value);
            totalActual += sleep;
        });
        
        const weeklyIdeal = idealSleep * 7;
        const sleepDebt = weeklyIdeal - totalActual;
        const avgActual = totalActual / 7;
        
        const resultsDiv = document.getElementById('sleepDebtResults');
        resultsDiv.innerHTML = `
            <div class="results-card">
                <h4>Your Sleep Analysis</h4>
                <div class="result-metrics">
                    <div class="metric">
                        <span class="metric-label">Weekly Sleep Debt:</span>
                        <span class="metric-value ${sleepDebt > 0 ? 'negative' : 'positive'}">
                            ${sleepDebt > 0 ? '+' : ''}${sleepDebt.toFixed(1)} hours
                        </span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Average Nightly Sleep:</span>
                        <span class="metric-value">${avgActual.toFixed(1)} hours</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Recommended Sleep:</span>
                        <span class="metric-value">${idealSleep} hours</span>
                    </div>
                </div>
                <div class="recommendations">
                    <h5>Personalized Recommendations:</h5>
                    <ul>
                        ${sleepDebt > 2 ? '<li>Consider gradually increasing your nightly sleep by 15-30 minutes</li>' : ''}
                        ${sleepDebt > 5 ? '<li>Prioritize weekend recovery sleep (but not more than 1-2 extra hours)</li>' : ''}
                        ${sleepDebt <= 0 ? '<li>Great job! You\'re meeting your sleep needs consistently</li>' : ''}
                        <li>Maintain a consistent sleep schedule, even on weekends</li>
                        <li>Create a relaxing bedtime routine 30-60 minutes before sleep</li>
                    </ul>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        
        // Add CSS for results if not already added
        if (!document.querySelector('#calculator-styles')) {
            const styles = document.createElement('style');
            styles.id = 'calculator-styles';
            styles.textContent = `
                .calculator-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-row { display: flex; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
                .week-inputs { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
                .day-input { display: flex; flex-direction: column; gap: 0.25rem; }
                .day-input label { font-size: 0.75rem; font-weight: 600; }
                .day-input input { padding: 0.5rem; border: 1px solid #DEE2E6; border-radius: 0.375rem; }
                .radio-group { display: flex; gap: 1rem; }
                .radio-group label { display: flex; align-items: center; gap: 0.5rem; }
                .results-display { margin-top: 2rem; }
                .results-card { background: #F8F9FA; padding: 1.5rem; border-radius: 0.75rem; }
                .result-metrics { display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0; }
                .metric { display: flex; justify-content: space-between; }
                .metric-value.negative { color: #E74C3C; }
                .metric-value.positive { color: #27AE60; }
                .recommendations ul { margin-left: 1rem; }
                .recommendations li { margin-bottom: 0.5rem; }
            `;
            document.head.appendChild(styles);
        }
    }
    
    function optimizeBedtime() {
        const wakeTime = document.getElementById('wakeTime').value;
        const sleepDuration = parseFloat(document.getElementById('sleepDuration').value);
        const fallAsleepTime = parseInt(document.getElementById('fallAsleepTime').value);
        const chronotype = document.querySelector('input[name="chronotype"]:checked').value;
        
        // Calculate optimal bedtime
        const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
        const wakeMinutes = wakeHour * 60 + wakeMin;
        const sleepMinutes = sleepDuration * 60;
        const bedtimeMinutes = wakeMinutes - sleepMinutes - fallAsleepTime;
        
        // Handle negative minutes (previous day)
        const adjustedBedtime = bedtimeMinutes < 0 ? bedtimeMinutes + 1440 : bedtimeMinutes;
        const bedHour = Math.floor(adjustedBedtime / 60);
        const bedMin = adjustedBedtime % 60;
        
        const bedtimeString = `${bedHour.toString().padStart(2, '0')}:${bedMin.toString().padStart(2, '0')}`;
        
        // Chronotype adjustments
        let adjustment = '';
        switch(chronotype) {
            case 'early':
                adjustment = 'As an early bird, this schedule should work well for you!';
                break;
            case 'late':
                adjustment = 'As a night owl, you might find this bedtime challenging. Try gradually shifting earlier by 15 minutes each night.';
                break;
            default:
                adjustment = 'This schedule should align well with your natural rhythms.';
        }
        
        const resultsDiv = document.getElementById('bedtimeResults');
        resultsDiv.innerHTML = `
            <div class="results-card">
                <h4>Your Optimized Sleep Schedule</h4>
                <div class="schedule-display">
                    <div class="time-block">
                        <span class="time-label">Optimal Bedtime:</span>
                        <span class="time-value">${bedtimeString}</span>
                    </div>
                    <div class="time-block">
                        <span class="time-label">Wake Up Time:</span>
                        <span class="time-value">${wakeTime}</span>
                    </div>
                    <div class="time-block">
                        <span class="time-label">Total Sleep:</span>
                        <span class="time-value">${sleepDuration} hours</span>
                    </div>
                </div>
                <div class="chronotype-advice">
                    <p><strong>Personalized Advice:</strong> ${adjustment}</p>
                </div>
                <div class="sleep-tips">
                    <h5>Tips for Success:</h5>
                    <ul>
                        <li>Start your wind-down routine 30 minutes before bedtime</li>
                        <li>Avoid screens 1 hour before bed</li>
                        <li>Keep your room cool (65-68�F) and dark</li>
                        <li>Try light therapy in the morning to strengthen your circadian rhythm</li>
                        <li>Be consistent - stick to this schedule even on weekends</li>
                    </ul>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        
        // Add CSS for bedtime optimizer if not already added
        if (!document.querySelector('#optimizer-styles')) {
            const styles = document.createElement('style');
            styles.id = 'optimizer-styles';
            styles.textContent = `
                .optimizer-form { display: flex; flex-direction: column; gap: 1rem; }
                .schedule-display { margin: 1.5rem 0; }
                .time-block { display: flex; justify-content: space-between; padding: 0.75rem; background: white; margin-bottom: 0.5rem; border-radius: 0.5rem; }
                .time-value { font-weight: 700; color: #4A90E2; font-size: 1.1rem; }
                .chronotype-advice { background: #E3F2FD; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; }
                .sleep-tips ul { margin-left: 1rem; }
                .sleep-tips li { margin-bottom: 0.5rem; }
            `;
            document.head.appendChild(styles);
        }
    }
    
    function animateBrainWaves(canvas) {
        const ctx = canvas.getContext('2d');
        let animationFrame = 0;
        
        function drawWave() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#4A90E2';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + Math.sin((x + animationFrame) * 0.02) * 20;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            animationFrame += 2;
            
            if (animationFrame < 1000) {
                requestAnimationFrame(drawWave);
            }
        }
        
        drawWave();
    }
    
    // Video Functions
    window.playVideo = function(videoId) {
        const videoModal = document.getElementById('videoModal');
        const videoTitle = document.getElementById('videoModalTitle');
        const videoContainer = document.getElementById('videoContainer');
        
        if (videoModal && videoTitle && videoContainer) {
            const videoData = getVideoData(videoId);
            videoTitle.textContent = videoData.title;
            videoContainer.innerHTML = videoData.content;
            
            videoModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            trackEvent('Video Interaction', 'Play Video', videoId);
        }
    };
    
    window.closeVideo = function() {
        const videoModal = document.getElementById('videoModal');
        if (videoModal) {
            videoModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };
    
    function getVideoData(videoId) {
        const videos = {
            'rem-sleep': {
                title: 'The Science of REM Sleep',
                content: `
                    <div class="video-player">
                        <div class="video-placeholder">
                            <i class="fas fa-play-circle" style="font-size: 4rem; color: #4A90E2;"></i>
                            <p>Video: The Science of REM Sleep</p>
                            <p>Duration: 12:45 | Quality: HD</p>
                            <p><em>In a real application, this would load the actual video player.</em></p>
                        </div>
                    </div>
                `
            },
            'teen-patterns': {
                title: 'Teen Sleep Patterns Explained',
                content: `
                    <div class="video-player">
                        <div class="video-placeholder">
                            <i class="fas fa-play-circle" style="font-size: 4rem; color: #4A90E2;"></i>
                            <p>Video: Teen Sleep Patterns Explained</p>
                            <p>Duration: 8:30 | Quality: HD</p>
                            <p><em>In a real application, this would load the actual video player.</em></p>
                        </div>
                    </div>
                `
            },
            'sleep-hygiene': {
                title: 'Sleep Hygiene Masterclass',
                content: `
                    <div class="video-player">
                        <div class="video-placeholder">
                            <i class="fas fa-play-circle" style="font-size: 4rem; color: #4A90E2;"></i>
                            <p>Video: Sleep Hygiene Masterclass</p>
                            <p>Duration: 15:20 | Quality: 4K</p>
                            <p><em>In a real application, this would load the actual video player.</em></p>
                        </div>
                    </div>
                `
            }
        };
        
        return videos[videoId] || {
            title: 'Video Player',
            content: '<p>Video loading...</p>'
        };
    }
    
    window.addToPlaylist = function(videoId) {
        const savedPlaylist = JSON.parse(localStorage.getItem('videoPlaylist') || '[]');
        
        if (!savedPlaylist.includes(videoId)) {
            savedPlaylist.push(videoId);
            localStorage.setItem('videoPlaylist', JSON.stringify(savedPlaylist));
            showNotification('Video added to your playlist!', 'success');
        } else {
            showNotification('Video is already in your playlist', 'info');
        }
        
        trackEvent('Video Interaction', 'Add to Playlist', videoId);
    };
    
    // Quiz Functions
    window.startQuiz = function(quizId) {
        showNotification('Loading quiz...', 'info');
        setTimeout(() => {
            showNotification(`Starting ${quizId} quiz. Good luck!`, 'success');
            // In real app, this would navigate to quiz interface
        }, 1000);
        trackEvent('Quiz Interaction', 'Start Quiz', quizId);
    };
    
    window.previewQuiz = function(quizId) {
        showQuizPreview(quizId);
        trackEvent('Quiz Interaction', 'Preview Quiz', quizId);
    };
    
    window.reviewQuiz = function(quizId) {
        showNotification('Loading quiz review...', 'info');
        setTimeout(() => {
            showNotification('Quiz review loaded successfully!', 'success');
        }, 1000);
        trackEvent('Quiz Interaction', 'Review Quiz', quizId);
    };
    
    window.retakeQuiz = function(quizId) {
        if (confirm('Are you sure you want to retake this quiz? Your current score will be replaced.')) {
            showNotification('Preparing quiz retake...', 'info');
            setTimeout(() => {
                showNotification('Quiz loaded - you can now retake it!', 'success');
            }, 1000);
            trackEvent('Quiz Interaction', 'Retake Quiz', quizId);
        }
    };
    
    // Download Functions
    window.downloadFile = function(fileId) {
        showNotification('Preparing download...', 'info');
        
        // Simulate download process
        setTimeout(() => {
            const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
            if (!downloads.includes(fileId)) {
                downloads.push(fileId);
                localStorage.setItem('downloads', JSON.stringify(downloads));
            }
            
            showNotification('File downloaded successfully!', 'success');
            updateDownloadProgress();
        }, 2000);
        
        trackEvent('Download Interaction', 'Download File', fileId);
    };
    
    // Progress Functions
    window.viewDetailedProgress = function() {
        showNotification('Loading detailed progress report...', 'info');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        trackEvent('Progress Interaction', 'View Detailed Progress', 'Resources Page');
    };
    
    function showDetailedProgress(moduleId) {
        showNotification(`Loading progress for ${moduleId} module...`, 'info');
        setTimeout(() => {
            showNotification('Progress details loaded successfully!', 'success');
        }, 1000);
    }
    
    function showModuleRequirements(moduleId) {
        showNotification(`Loading requirements for ${moduleId} module...`, 'info');
        setTimeout(() => {
            showNotification('Complete the Emotional Balance module to unlock this content.', 'warning');
        }, 1000);
    }
    
    function showQuizPreview(quizId) {
        showNotification('Loading quiz preview...', 'info');
        setTimeout(() => {
            showNotification('Quiz preview: 15 questions covering sleep stages, brain waves, and memory consolidation.', 'info');
        }, 1000);
    }
    
    // Initialize page
    function initializeResourcesPage() {
        // Animate progress circles
        animateProgressCircles();
        
        // Update download progress from localStorage
        updateDownloadProgress();
        
        // Initialize scroll animations
        initializeScrollAnimations();
        
        // Set up hover effects
        initializeHoverEffects();
    }
    
    function animateProgressCircles() {
        const progressRings = document.querySelectorAll('.progress-ring[data-progress]');
        
        progressRings.forEach(ring => {
            const progress = parseInt(ring.getAttribute('data-progress'));
            const circle = ring.querySelector('.progress-fill');
            
            if (circle) {
                const circumference = 2 * Math.PI * 25; // radius = 25
                const offset = circumference - (progress / 100) * circumference;
                
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 500);
            }
        });
    }
    
    function updateDownloadProgress() {
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        const totalDownloads = document.querySelectorAll('.download-card').length;
        const progressBar = document.querySelector('.progress-card .downloads + .progress-info .progress-fill');
        const progressNumber = document.querySelector('.progress-card .downloads + .progress-info .progress-number');
        
        if (progressBar && progressNumber) {
            const percentage = (downloads.length / totalDownloads) * 100;
            progressBar.style.width = `${percentage}%`;
            progressNumber.textContent = `${downloads.length} / ${totalDownloads}`;
        }
    }
    
    function initializeScrollAnimations() {
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
        
        // Observe resource cards for animations
        const resourceCards = document.querySelectorAll('.module-card, .tool-card, .video-card, .quiz-card, .download-card');
        resourceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            observer.observe(card);
        });
    }
    
    function initializeHoverEffects() {
        // Video thumbnail hover effects
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const videoCard = this.closest('.video-card');
                const videoTitle = videoCard.querySelector('h3').textContent;
                const videoId = this.closest('.video-card').querySelector('.btn').getAttribute('onclick').match(/'([^']+)'/)[1];
                playVideo(videoId);
            });
        });
        
        // Module card hover effects
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.module-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.module-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'toolModal') {
                closeTool();
            } else if (e.target.id === 'videoModal') {
                closeVideo();
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const toolModal = document.getElementById('toolModal');
            const videoModal = document.getElementById('videoModal');
            
            if (toolModal && !toolModal.classList.contains('hidden')) {
                closeTool();
            } else if (videoModal && !videoModal.classList.contains('hidden')) {
                closeVideo();
            }
            
            // Also close mobile menu
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Number keys for quick filter selection
        if (e.key >= '1' && e.key <= '6') {
            const filterIndex = parseInt(e.key) - 1;
            const filters = document.querySelectorAll('.resource-filter');
            if (filters[filterIndex]) {
                filters[filterIndex].click();
            }
        }
    });
    
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
                .video-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    background: #F8F9FA;
                    border-radius: 0.5rem;
                    text-align: center;
                    gap: 1rem;
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
    
    // Analytics Tracking (placeholder)
    function trackEvent(category, action, label) {
        console.log(`Resources Event: ${category} - ${action} - ${label}`);
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
        updateResourceCounts('all');
    }, 250));
    
    
    console.log('Sleep Hub - Resources page loaded successfully! ??');
});