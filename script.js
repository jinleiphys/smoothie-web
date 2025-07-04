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

        if (!mobileToggle || !sidebar || !sidebarOverlay) return;

        // Toggle mobile menu
        mobileToggle.addEventListener('click', () => {
            this.isMenuOpen = !this.isMenuOpen;
            sidebar.classList.toggle('open', this.isMenuOpen);
            mobileToggle.classList.toggle('active', this.isMenuOpen);
            sidebarOverlay.style.display = this.isMenuOpen ? 'block' : 'none';
            
            // Animate overlay
            if (this.isMenuOpen) {
                setTimeout(() => sidebarOverlay.classList.add('active'), 10);
            } else {
                sidebarOverlay.classList.remove('active');
                setTimeout(() => sidebarOverlay.style.display = 'none', 300);
            }
        });

        // Close menu when clicking overlay
        sidebarOverlay.addEventListener('click', () => {
            this.isMenuOpen = false;
            sidebar.classList.remove('open');
            mobileToggle.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            setTimeout(() => sidebarOverlay.style.display = 'none', 300);
        });

        // Close menu when clicking nav links
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.isMenuOpen = false;
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                setTimeout(() => sidebarOverlay.style.display = 'none', 300);
            });
        });

        // Handle responsive behavior
        this.handleResize();
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
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        if (window.innerWidth > 768) {
            // Close mobile menu when switching to desktop
            if (sidebar) sidebar.classList.remove('open');
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
                sidebarOverlay.style.display = 'none';
            }
            this.isMenuOpen = false;
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

function copyBibTeX(bibtexId) {
    const bibtexElement = document.getElementById(bibtexId);
    if (!bibtexElement) return;
    
    const bibtexText = bibtexElement.querySelector('pre').textContent;
    
    navigator.clipboard.writeText(bibtexText).then(() => {
        window.smoothieWebsite.showNotification('BibTeX copied to clipboard!', 'success');
        
        // Toggle visibility of BibTeX box
        if (bibtexElement.style.display === 'none' || bibtexElement.style.display === '') {
            bibtexElement.style.display = 'block';
            setTimeout(() => {
                bibtexElement.style.display = 'none';
            }, 3000);
        }
    }).catch(() => {
        window.smoothieWebsite.showNotification('Failed to copy BibTeX', 'error');
    });
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smoothieWebsite = new SmoothieWebsite();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothieWebsite;
}