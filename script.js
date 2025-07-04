// Modern JavaScript for SMOOTHIE Website
class SmoothieWebsite {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupPageTransitions();
        this.setupMobileMenu();
        this.setupParallaxEffects();
        this.setupFormHandlers();
        this.setupGeneratorForm();
    }

    setupEventListeners() {
        // Download buttons
        const downloadButtons = document.querySelectorAll('.btn-download');
        downloadButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleDownload(button);
            });
        });

        // Example buttons
        const exampleButtons = document.querySelectorAll('.btn-example');
        exampleButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showExample(button);
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe all cards and sections
        const observeElements = document.querySelectorAll(
            '.feature-card, .paper-card, .download-card, .example-card, .program-card, .contact-card, .support-card'
        );
        observeElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupPageTransitions() {
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');

        if (!mobileToggle || !sidebar || !sidebarOverlay) {
            console.error('Mobile menu elements not found:', {
                mobileToggle: !!mobileToggle,
                sidebar: !!sidebar,
                sidebarOverlay: !!sidebarOverlay
            });
            return;
        }

        // Toggle mobile menu - handle both click and touch
        const toggleMenu = (e) => {
            console.log('Mobile menu toggle triggered:', e.type);
            e.preventDefault();
            e.stopPropagation();
            
            this.isMenuOpen = !this.isMenuOpen;
            console.log('Menu state:', this.isMenuOpen ? 'opening' : 'closing');
            
            if (this.isMenuOpen) {
                sidebar.classList.add('open');
                mobileToggle.classList.add('active');
                sidebarOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Force reflow before adding active class
                sidebarOverlay.offsetHeight;
                
                // Animate overlay
                requestAnimationFrame(() => {
                    sidebarOverlay.classList.add('active');
                });
            } else {
                this.closeMobileMenu();
            }
        };
        
        mobileToggle.addEventListener('click', toggleMenu);
        mobileToggle.addEventListener('touchstart', toggleMenu, { passive: false });

        // Close menu when clicking overlay
        sidebarOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeMobileMenu();
        });
        
        // Handle touch events for better mobile support
        sidebarOverlay.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.closeMobileMenu();
        });

        // Close menu when clicking nav links - handle both click and touch
        const navLinks = sidebar.querySelectorAll('.nav-link');
        console.log('Found nav links:', navLinks.length);
        navLinks.forEach(link => {
            const closeMenuOnNavigation = (e) => {
                console.log('Nav link clicked:', e.type, link.textContent);
                // Don't prevent default for navigation links
                this.closeMobileMenu();
            };
            
            link.addEventListener('click', closeMenuOnNavigation);
            link.addEventListener('touchstart', closeMenuOnNavigation, { passive: true });
        });

        // Handle responsive behavior
        this.handleResize();
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        this.isMenuOpen = false;
        
        if (sidebar) sidebar.classList.remove('open');
        if (mobileToggle) mobileToggle.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (sidebarOverlay) sidebarOverlay.style.display = 'none';
        }, 300);
    }

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-section');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupFormHandlers() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', (e) => {
                e.target.parentElement.classList.remove('focused');
            });
        });

    }

    setupGeneratorForm() {
        // Setup input file generator functionality
        const form = document.getElementById('smoothieForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
            });
        });

        // Initialize preview
        this.updatePreview();
    }

    handleResize() {
        if (window.innerWidth > 768) {
            // Close mobile menu when switching to desktop
            this.closeMobileMenu();
        }
    }

    handleDownload(button) {
        const card = button.closest('.download-card');
        const title = card.querySelector('h3').textContent;
        
        // Add download animation
        button.style.transform = 'scale(0.95)';
        button.textContent = 'Downloading...';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.textContent = `Download for ${title.split(' ')[0]}`;
            this.showNotification(`${title} download started!`, 'success');
        }, 1000);
    }

    showExample(button) {
        const card = button.closest('.example-card');
        const title = card.querySelector('h3').textContent;
        
        // Create modal for example
        const modal = document.createElement('div');
        modal.className = 'example-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <pre><code># Example SMOOTHIE Input File
# ${title}

&input
    projectile_mass = 2.014
    target_mass = 12.0
    beam_energy = 56.0
    angular_range = 0.0, 180.0
    angular_step = 1.0
&end

&potentials
    real_central = woods_saxon
    imaginary_central = woods_saxon
    spin_orbit = thomas
&end

&breakup
    channels = 2
    fragment_1 = proton
    fragment_2 = neutron
&end</code></pre>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Close modal
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    updatePreview() {
        const form = document.getElementById('smoothieForm');
        if (!form) return;

        const formData = new FormData(form);
        const data = {};
        for (let [key, value] = formData) {
            data[key] = value;
        }

        const inputFile = this.generateInputFileContent(data);
        const preview = document.getElementById('inputPreview');
        if (preview) {
            preview.textContent = inputFile;
        }
    }

    generateInputFileContent(data) {
        const date = new Date().toLocaleDateString();
        return `# SMOOTHIE Input File
# Generated on ${date}

&input
    projectile_mass = ${data.projectileMass || '2.014'}
    target_mass = ${data.targetMass || '12.0'}
    projectile_z = ${data.projectileZ || '1'}
    target_z = ${data.targetZ || '6'}
    projectile_a = ${data.projectileA || '2'}
    beam_energy = ${data.beamEnergy || '56.0'}
    angular_range = ${data.angleMin || '0.0'}, ${data.angleMax || '180.0'}
    angular_step = ${data.angleStep || '1.0'}
&end

&potentials
    real_central = ${data.realCentral || 'woods_saxon'}
    imaginary_central = ${data.imaginaryCentral || 'woods_saxon'}
    spin_orbit = ${data.spinOrbit || 'thomas'}
    coulomb = ${data.coulomb || 'point'}
&end

&breakup
    channels = ${data.channels || '2'}
    fragment_1 = ${data.fragment1 || 'proton'}
    fragment_2 = ${data.fragment2 || 'neutron'}
    binding_energy = ${data.bindingEnergy || '2.225'}
&end

&numerical
    r_max = ${data.rMax || '20.0'}
    r_step = ${data.rStep || '0.1'}
    l_max = ${data.lMax || '20'}
    tolerance = ${data.tolerance || '1e-6'}
&end`;
    }

    downloadFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#34C759' : type === 'error' ? '#FF3B30' : '#007AFF'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for button handlers
function generateInputFile() {
    const form = document.getElementById('smoothieForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData) {
        data[key] = value;
    }

    if (!data.projectileMass || !data.targetMass || !data.beamEnergy) {
        window.smoothieWebsite.showNotification('Please fill in all required fields', 'error');
        return;
    }

    const inputFile = window.smoothieWebsite.generateInputFileContent(data);
    window.smoothieWebsite.downloadFile('smoothie_input.txt', inputFile);
    window.smoothieWebsite.showNotification('Input file generated successfully!', 'success');
}

function loadExample() {
    // Load a sample example into the form
    const form = document.getElementById('smoothieForm');
    if (!form) return;

    // Set example values
    document.getElementById('projectileMass').value = '2.014';
    document.getElementById('targetMass').value = '12.0';
    document.getElementById('beamEnergy').value = '56.0';
    document.getElementById('projectileZ').value = '1';
    document.getElementById('targetZ').value = '6';
    document.getElementById('projectileA').value = '2';
    document.getElementById('bindingEnergy').value = '2.225';

    // Update preview
    window.smoothieWebsite.updatePreview();
    window.smoothieWebsite.showNotification('Example loaded successfully!', 'success');
}

function resetForm() {
    const form = document.getElementById('smoothieForm');
    if (form) {
        form.reset();
        window.smoothieWebsite.updatePreview();
    }
}

function copyToClipboard() {
    const preview = document.getElementById('inputPreview');
    if (!preview) return;

    navigator.clipboard.writeText(preview.textContent).then(() => {
        window.smoothieWebsite.showNotification('Input file copied to clipboard!', 'success');
    }).catch(() => {
        window.smoothieWebsite.showNotification('Failed to copy to clipboard', 'error');
    });
}

function downloadInputFile() {
    const preview = document.getElementById('inputPreview');
    if (!preview) return;

    window.smoothieWebsite.downloadFile('smoothie_input.txt', preview.textContent);
    window.smoothieWebsite.showNotification('Input file downloaded!', 'success');
}

function copyBibTeX(bibtexId, buttonElement) {
    const bibtexElement = document.getElementById(bibtexId);
    if (!bibtexElement) {
        console.error('BibTeX element not found:', bibtexId);
        return;
    }
    
    const preElement = bibtexElement.querySelector('pre');
    if (!preElement) {
        console.error('Pre element not found in BibTeX box:', bibtexId);
        return;
    }
    
    const bibtexText = preElement.textContent;
    console.log('Attempting to copy BibTeX text:', bibtexText.substring(0, 50) + '...');
    
    // Find the button that was clicked - either passed or find via event
    const copyButton = buttonElement || (window.event && window.event.target) || document.querySelector(`button[onclick*="${bibtexId}"]`);
    const originalText = copyButton ? copyButton.textContent : 'Copy BibTeX';
    
    // Add visual feedback
    if (copyButton) {
        copyButton.classList.add('copying');
        copyButton.textContent = 'Copying...';
        copyButton.disabled = true;
    }
    
    // Function to reset button state
    const resetButton = (success = false) => {
        setTimeout(() => {
            if (copyButton) {
                copyButton.classList.remove('copying');
                copyButton.textContent = success ? 'Copied!' : originalText;
                copyButton.disabled = false;
                
                if (success) {
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 1500);
                }
            }
        }, 100);
    };
    
    // Check if clipboard API is available
    console.log('Clipboard API available:', !!navigator.clipboard);
    console.log('Secure context:', window.isSecureContext);
    
    if (!navigator.clipboard || !window.isSecureContext) {
        console.log('Using fallback method - Clipboard API not available or not in secure context');
        // Fallback for older browsers or non-secure contexts
        fallbackCopyToClipboard(bibtexText, bibtexId, resetButton);
        return;
    }
    
    navigator.clipboard.writeText(bibtexText).then(() => {
        console.log('Successfully copied to clipboard via Clipboard API');
        showNotificationSafe('BibTeX copied to clipboard!', 'success');
        resetButton(true);
        
        // Toggle visibility of BibTeX box
        if (bibtexElement.style.display === 'none' || bibtexElement.style.display === '') {
            bibtexElement.style.display = 'block';
            setTimeout(() => {
                bibtexElement.style.display = 'none';
            }, 3000);
        }
    }).catch((err) => {
        console.error('Clipboard API failed:', err);
        showNotificationSafe('Trying alternative copy method...', 'info');
        resetButton(false);
        
        // Try fallback method
        fallbackCopyToClipboard(bibtexText, bibtexId, resetButton);
    });
}

function fallbackCopyToClipboard(text, bibtexId, resetButton) {
    console.log('Using fallback copy method');
    
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    
    try {
        // Focus and select the text
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        
        // Try to copy
        const successful = document.execCommand('copy');
        console.log('execCommand copy result:', successful);
        
        if (successful) {
            console.log('Successfully copied via execCommand');
            showNotificationSafe('BibTeX copied to clipboard!', 'success');
            if (resetButton) resetButton(true);
            
            // Toggle visibility of BibTeX box
            const bibtexElement = document.getElementById(bibtexId);
            if (bibtexElement && (bibtexElement.style.display === 'none' || bibtexElement.style.display === '')) {
                bibtexElement.style.display = 'block';
                setTimeout(() => {
                    bibtexElement.style.display = 'none';
                }, 3000);
            }
        } else {
            throw new Error('execCommand returned false');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotificationSafe('Copy failed. Please select the text and copy manually (Ctrl+C or Cmd+C).', 'error');
        if (resetButton) resetButton(false);
        
        // Show the BibTeX box so user can copy manually
        const bibtexElement = document.getElementById(bibtexId);
        if (bibtexElement) {
            bibtexElement.style.display = 'block';
        }
    } finally {
        document.body.removeChild(textarea);
    }
}

function showNotificationSafe(message, type = 'info') {
    // Check if the smoothieWebsite instance exists
    if (window.smoothieWebsite && typeof window.smoothieWebsite.showNotification === 'function') {
        window.smoothieWebsite.showNotification(message, type);
    } else {
        // Fallback: use browser alert or console
        console.log(`Notification [${type}]: ${message}`);
        // You could also use alert, but it's less elegant
        if (type === 'error') {
            alert(message);
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smoothieWebsite = new SmoothieWebsite();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothieWebsite;
}