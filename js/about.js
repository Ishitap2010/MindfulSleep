// About page PDF viewer functionality

class PDFViewer {
    constructor() {
        this.currentPDF = null;
        this.viewerSection = document.getElementById('pdf-viewer-section');
        this.modalIframe = document.getElementById('pdf-modal-iframe');
        this.loadingElement = document.getElementById('pdf-loading');
        this.modalTitleElement = document.getElementById('pdf-modal-title');
        this.modalMetaElement = document.getElementById('pdf-modal-meta');
        
        // Embedded viewer elements
        this.embeddedSection = document.getElementById('pdf-viewer-embedded');
        this.embeddedIframe = document.getElementById('pdf-iframe');
        this.embeddedTitleElement = document.getElementById('pdf-title');
        this.embeddedMetaElement = document.getElementById('pdf-meta');
        
        this.initializeEventListeners();
        this.makeLinksInteractive();
        this.setupEmbeddedViewer();
    }

    setupEmbeddedViewer() {
        // Set up the default embedded PDF
        const defaultPDF = {
            url: 'pdfs/teen-sleep-comprehensive-guide.pdf',
            title: 'Comprehensive Guide to Teen Sleep',
            type: 'Research Compilation • 2.5 MB • Featured Document'
        };
        
        // Set the current PDF for download functionality
        this.currentEmbeddedPDF = defaultPDF;
        
        // Set up embedded viewer controls
        this.setupEmbeddedControls();
        
        console.log('Embedded PDF viewer loaded with:', defaultPDF.title);
    }

    setupEmbeddedControls() {
        // Download button for embedded viewer
        const embeddedDownloadBtn = document.getElementById('pdf-download-btn');
        if (embeddedDownloadBtn) {
            embeddedDownloadBtn.addEventListener('click', () => {
                this.downloadEmbeddedPDF();
            });
        }

        // Fullscreen button for embedded viewer
        const embeddedFullscreenBtn = document.getElementById('pdf-fullscreen-btn');
        if (embeddedFullscreenBtn) {
            embeddedFullscreenBtn.addEventListener('click', () => {
                this.toggleEmbeddedFullscreen();
            });
        }

        // Minimize button for embedded viewer
        const minimizeBtn = document.getElementById('pdf-minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.toggleEmbeddedMinimize();
            });
        }
    }

    initializeEventListeners() {
        // Modal Close button
        const closeBtn = document.getElementById('pdf-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closePDFViewer();
            });
        }

        // Modal Download button
        const modalDownloadBtn = document.getElementById('pdf-modal-download-btn');
        if (modalDownloadBtn) {
            modalDownloadBtn.addEventListener('click', () => {
                this.downloadCurrentPDF();
            });
        }

        // Modal Fullscreen button
        const modalFullscreenBtn = document.getElementById('pdf-modal-fullscreen-btn');
        if (modalFullscreenBtn) {
            modalFullscreenBtn.addEventListener('click', () => {
                this.toggleModalFullscreen();
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.viewerSection && this.viewerSection.style.display === 'flex') {
                this.closePDFViewer();
            }
        });

        // Click outside to close modal
        if (this.viewerSection) {
            this.viewerSection.addEventListener('click', (e) => {
                if (e.target === this.viewerSection) {
                    this.closePDFViewer();
                }
            });
        }

        // Modal iframe load event
        if (this.modalIframe) {
            this.modalIframe.addEventListener('load', () => {
                this.hideLoading();
            });

            this.modalIframe.addEventListener('error', () => {
                this.showError();
            });
        }
    }

    makeLinksInteractive() {
        // PDF links in research sections (open in modal)
        document.querySelectorAll('.pdf-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pdfUrl = link.href;
                const title = this.extractTitleFromLink(link);
                this.openModalPDF(pdfUrl, title, 'Research Paper');
            });
        });

        // Resource cards (load in embedded viewer)
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const pdfUrl = card.href;
                const title = card.querySelector('h4').textContent;
                const type = card.querySelector('.resource-type').textContent;
                this.loadEmbeddedPDF(pdfUrl, title, type);
            });
        });

        // Reference links (open in modal)
        document.querySelectorAll('.ref-links .pdf-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pdfUrl = link.href;
                const title = link.closest('.reference-item').querySelector('h4').textContent;
                this.openModalPDF(pdfUrl, title, 'Academic Citation');
            });
        });
    }

    extractTitleFromLink(link) {
        const text = link.textContent || link.innerText;
        return text.replace(/\s*\(PDF\)\s*/i, '').trim();
    }

    // Load PDF in embedded viewer
    loadEmbeddedPDF(url, title, type) {
        this.currentEmbeddedPDF = { url, title, type };
        
        // Update embedded viewer content
        if (this.embeddedTitleElement) this.embeddedTitleElement.textContent = title;
        if (this.embeddedMetaElement) this.embeddedMetaElement.textContent = type;
        
        // Load PDF in embedded iframe
        const pdfViewerUrl = this.getPDFViewerURL(url);
        if (this.embeddedIframe) {
            this.embeddedIframe.src = pdfViewerUrl;
        }
        
        // Ensure embedded viewer is visible
        if (this.embeddedSection) {
            this.embeddedSection.classList.remove('minimized');
        }
        
        // Scroll to embedded viewer
        if (this.embeddedSection) {
            this.embeddedSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        console.log('Loaded in embedded viewer:', title);
    }

    // Open PDF in modal viewer
    openModalPDF(url, title, type) {
        this.currentPDF = { url, title, type };
        
        // Update modal viewer content
        if (this.modalTitleElement) this.modalTitleElement.textContent = title;
        if (this.modalMetaElement) this.modalMetaElement.textContent = type;
        
        // Show loading
        this.showLoading();
        
        // Show modal viewer
        if (this.viewerSection) {
            this.viewerSection.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        // Load PDF with viewer parameters
        const pdfViewerUrl = this.getPDFViewerURL(url);
        if (this.modalIframe) {
            this.modalIframe.src = pdfViewerUrl;
        }
        
        // Focus management for accessibility
        const closeBtn = document.getElementById('pdf-close-btn');
        if (closeBtn) closeBtn.focus();
        
        console.log('Opened in modal viewer:', title);
    }

    getPDFViewerURL(pdfUrl) {
        // Use browser's built-in PDF viewer with parameters
        const viewerParams = new URLSearchParams({
            'toolbar': '1',
            'navpanes': '1',
            'scrollbar': '1',
            'page': '1',
            'zoom': 'page-width'
        });
        
        return `${pdfUrl}#${viewerParams.toString()}`;
    }

    // Embedded viewer controls
    downloadEmbeddedPDF() {
        if (this.currentEmbeddedPDF) {
            this.downloadPDF(this.currentEmbeddedPDF);
        }
    }

    toggleEmbeddedFullscreen() {
        if (this.embeddedSection) {
            const isFullscreen = this.embeddedSection.classList.contains('fullscreen');
            
            if (isFullscreen) {
                this.embeddedSection.classList.remove('fullscreen');
                document.body.style.overflow = 'auto';
            } else {
                this.embeddedSection.classList.add('fullscreen');
                document.body.style.overflow = 'hidden';
            }
            
            this.updateEmbeddedFullscreenIcon(!isFullscreen);
        }
    }

    toggleEmbeddedMinimize() {
        if (this.embeddedSection) {
            const isMinimized = this.embeddedSection.classList.contains('minimized');
            
            if (isMinimized) {
                this.embeddedSection.classList.remove('minimized');
            } else {
                this.embeddedSection.classList.add('minimized');
            }
            
            this.updateMinimizeIcon(!isMinimized);
        }
    }

    updateEmbeddedFullscreenIcon(isFullscreen) {
        const icon = document.querySelector('#pdf-fullscreen-btn i');
        if (icon) {
            icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        }
    }

    updateMinimizeIcon(isMinimized) {
        const icon = document.querySelector('#pdf-minimize-btn i');
        if (icon) {
            icon.className = isMinimized ? 'fas fa-plus' : 'fas fa-minus';
        }
    }

    // Modal viewer controls
    closePDFViewer() {
        if (this.viewerSection) {
            this.viewerSection.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (this.modalIframe) {
            this.modalIframe.src = '';
        }
        this.currentPDF = null;
        
        // Remove fullscreen if active
        if (this.viewerSection) {
            this.viewerSection.classList.remove('fullscreen');
            this.updateModalFullscreenIcon(false);
        }
    }

    downloadCurrentPDF() {
        if (this.currentPDF) {
            this.downloadPDF(this.currentPDF);
        }
    }

    toggleModalFullscreen() {
        if (this.viewerSection) {
            const isFullscreen = this.viewerSection.classList.contains('fullscreen');
            
            if (isFullscreen) {
                this.viewerSection.classList.remove('fullscreen');
            } else {
                this.viewerSection.classList.add('fullscreen');
            }
            
            this.updateModalFullscreenIcon(!isFullscreen);
        }
    }

    updateModalFullscreenIcon(isFullscreen) {
        const icon = document.querySelector('#pdf-modal-fullscreen-btn i');
        if (icon) {
            icon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
        }
    }

    // Common download functionality
    downloadPDF(pdfObject) {
        const link = document.createElement('a');
        link.href = pdfObject.url;
        link.download = this.sanitizeFilename(pdfObject.title);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Downloaded:', pdfObject.title);
    }

    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.remove('hidden');
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
        }
    }

    showError() {
        this.hideLoading();
        console.error('PDF loading failed for:', this.currentPDF?.url);
    }
}

// Enhanced PDF link behavior
function enhancePDFLinks() {
    document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
        if (!link.querySelector('.fas.fa-file-pdf')) {
            link.classList.add('pdf-link-enhanced');
        }
    });
}

// Handle mobile touch events for better UX
function setupMobileInteractions() {
    if ('ontouchstart' in window) {
        document.querySelectorAll('.resource-card, .pdf-link').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
}

// Accessibility enhancements
function setupAccessibility() {
    document.querySelectorAll('.resource-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize PDF viewer
    window.pdfViewer = new PDFViewer();
    
    // Setup additional enhancements
    enhancePDFLinks();
    setupMobileInteractions();
    setupAccessibility();
    
    console.log('About page with embedded PDF viewer initialized');
});

// Handle dynamic content loading
function refreshPDFViewer() {
    if (window.pdfViewer) {
        window.pdfViewer.makeLinksInteractive();
        enhancePDFLinks();
        setupAccessibility();
    }
}