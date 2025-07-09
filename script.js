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
            console.error('Mobile menu elements not found');
            return;
        }

        // Toggle mobile menu
        mobileToggle.addEventListener('click', () => {
            console.log('Mobile toggle clicked');
            this.isMenuOpen = !this.isMenuOpen;
            
            if (this.isMenuOpen) {
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking overlay
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isMenuOpen = false;
        });

        // Close menu when clicking nav links
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
                this.isMenuOpen = false;
            });
        });
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        this.isMenuOpen = false;
        
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        
        document.body.style.overflow = '';
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
        for (let [key, value] of formData) {
            data[key] = value;
        }

        const inputFile = this.generateInputFileContent(data);
        const preview = document.getElementById('inputPreview');
        if (preview) {
            preview.textContent = inputFile;
        }
    }

    generatePotentialSection(kp1, index, data) {
        const params = [];
        
        // Basic parameters
        params.push(`kp1='${kp1}'`);
        params.push(`ptype=${data[`ptype${index}`] || (index === 1 ? '1' : index === 4 ? '2' : '4')}`);
        params.push(`a1=${data[`a1_${index}`] || (index === 4 ? '1' : '0')}`);
        params.push(`a2=${data[`a2_${index}`] || (index === 2 ? '94' : '93')}`);
        
        // Coulomb radius (if specified)
        if (data[`rc${index}`]) {
            params.push(`rc=${data[`rc${index}`]}`);
        }
        
        let paramLines = [`&POTENTIAL  ${params.join(' ')}`];
        
        // Volume potential parameters
        const volumeParams = [];
        if (data[`uv${index}`]) volumeParams.push(`uv=${data[`uv${index}`]}`);
        if (data[`av${index}`]) volumeParams.push(`av=${data[`av${index}`]}`);
        if (data[`rv${index}`]) volumeParams.push(`rv=${data[`rv${index}`]}`);
        if (data[`uw${index}`]) volumeParams.push(`uw=${data[`uw${index}`]}`);
        if (data[`aw${index}`]) volumeParams.push(`aw=${data[`aw${index}`]}`);
        if (data[`rw${index}`]) volumeParams.push(`rw=${data[`rw${index}`]}`);
        
        if (volumeParams.length > 0) {
            paramLines.push(`            ${volumeParams.join(' ')}`);
        }
        
        // Surface potential parameters
        const surfaceParams = [];
        if (data[`vd${index}`]) surfaceParams.push(`vd=${data[`vd${index}`]}`);
        if (data[`avd${index}`]) surfaceParams.push(`avd=${data[`avd${index}`]}`);
        if (data[`rvd${index}`]) surfaceParams.push(`rvd=${data[`rvd${index}`]}`);
        if (data[`wd${index}`]) surfaceParams.push(`wd=${data[`wd${index}`]}`);
        if (data[`awd${index}`]) surfaceParams.push(`awd=${data[`awd${index}`]}`);
        if (data[`rwd${index}`]) surfaceParams.push(`rwd=${data[`rwd${index}`]}`);
        
        if (surfaceParams.length > 0) {
            paramLines.push(`            ${surfaceParams.join(' ')}`);
        }
        
        // Spin-orbit parameters
        const spinOrbitParams = [];
        if (data[`vsov${index}`]) spinOrbitParams.push(`vsov=${data[`vsov${index}`]}`);
        if (data[`rsov${index}`]) spinOrbitParams.push(`rsov=${data[`rsov${index}`]}`);
        if (data[`asov${index}`]) spinOrbitParams.push(`asov=${data[`asov${index}`]}`);
        if (data[`vsow${index}`]) spinOrbitParams.push(`vsow=${data[`vsow${index}`]}`);
        if (data[`rsow${index}`]) spinOrbitParams.push(`rsow=${data[`rsow${index}`]}`);
        if (data[`asow${index}`]) spinOrbitParams.push(`asow=${data[`asow${index}`]}`);
        
        if (spinOrbitParams.length > 0) {
            paramLines.push(`            ${spinOrbitParams.join(' ')}`);
        }
        
        paramLines.push('            /');
        
        return paramLines.join('\n');
    }

    generateInputFileContent(data) {
        const date = new Date().toLocaleDateString();
        return `NAMELIST
&GLOBAL      hcm=${data.hcm || '0.05'}  lmax=${data.lmax || '25'}  elab=${data.elab || '25.5'} thmin=${data.thmin || '0.'} thmax=${data.thmax || '180.'}  printf=${data.printf || 'f'} dwba=${data.dwba || '1'}  
             thinc=${data.thinc || '1'}   nx=${data.nx || '34'} rmax=${data.rmax || '50'}   nr=${data.nr || '100'}  lxmax=${data.lxmax || '12'}  ${data.lmin !== undefined ? 'lmin=' + data.lmin : ''}  ${data.jtmin !== undefined ? 'jtmin=' + data.jtmin : ''}  ${data.jtmax !== undefined ? 'jtmax=' + data.jtmax : ''}  ${data.lxmin !== undefined ? 'lxmin=' + data.lxmin : ''}  /



&SYSTEM     namep='${data.namep || 'd'}'     massp=${data.massp || '2.'}       zp=${data.zp || '1.0'}    jp=${data.jp || '0.'} sbx=${data.sbx || '0.'}
            namet='${data.namet || '93Nb'}'  masst=${data.masst || '93.0'}     zt=${data.zt || '41.0'}   jt=${data.jt || '0.0'}  be=${data.be || '2.224'}
            nameb='${data.nameb || 'p'}'     massb=${data.massb || '1.0078'}        zb=${data.zb || '1.0'}    jb=${data.jb || '0.'}   
            namex='${data.namex || 'n'}'     massx=${data.massx || '1.0087'}   zx=${data.zx || '0.0'}    jx=${data.jx || '0.'}  lbx=${data.lbx || '0'}    nodes=${data.nodes || '1'}  /


&OUTGOING   ecmbmin=${data.ecmbmin || '2'} ecmbmax=${data.ecmbmax || '30'} ecmbh=${data.ecmbh || '1'}  /


&OUTGOING /


${this.generatePotentialSection('a', 1, data)}

${this.generatePotentialSection('b', 2, data)}

${this.generatePotentialSection('x', 3, data)}

${this.generatePotentialSection('p', 4, data)}

${this.generatePotentialSection('t', 5, data)}



&POTENTIAL /`;
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
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Handle multi-line messages
        if (message.includes('\n')) {
            const lines = message.split('\n');
            lines.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.textContent = line;
                if (index > 0) lineElement.style.marginTop = '0.5rem';
                notification.appendChild(lineElement);
            });
        } else {
            notification.textContent = message;
        }
        
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
            max-width: 400px;
            word-wrap: break-word;
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

    // Enhanced validation with detailed error messages
    const validationErrors = [];
    
    // Required fields validation with user-friendly names
    const requiredFields = {
        'elab': 'Laboratory Energy',
        'namep': 'Projectile Name',
        'massp': 'Projectile Mass',
        'zp': 'Projectile Charge',
        'jp': 'Projectile Spin',
        'namet': 'Target Name',
        'masst': 'Target Mass',
        'zt': 'Target Charge',
        'jt': 'Target Spin',
        'nameb': 'Binary Product Name',
        'massb': 'Binary Product Mass',
        'zb': 'Binary Product Charge',
        'jb': 'Binary Product Spin',
        'namex': 'Ejectile Name',
        'massx': 'Ejectile Mass',
        'zx': 'Ejectile Charge',
        'jx': 'Ejectile Spin',
        'sbx': 'Binding Energy',
        'lbx': 'Orbital Angular Momentum',
        'nodes': 'Number of Nodes',
        'be': 'Binding Energy',
        'ecmbmin': 'Minimum CM Energy',
        'ecmbmax': 'Maximum CM Energy',
        'ecmbh': 'Energy Step'
    };
    
    // Check for missing required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
        if (!data[field] || data[field].toString().trim() === '') {
            validationErrors.push(`${label} is required`);
        }
    });
    
    // Numerical validation with detailed error messages
    try {
        const lmin = parseFloat(data.lmin || 0);
        const lmax = parseFloat(data.lmax);
        if (lmax <= lmin) {
            validationErrors.push('Maximum L value must be greater than minimum L value');
        }
        
        const jtmin = parseFloat(data.jtmin || 0);
        const jtmax = parseFloat(data.jtmax);
        if (jtmax <= jtmin) {
            validationErrors.push('Maximum Jt value must be greater than minimum Jt value');
        }
        
        const ecmbmin = parseFloat(data.ecmbmin);
        const ecmbmax = parseFloat(data.ecmbmax);
        if (ecmbmax <= ecmbmin) {
            validationErrors.push('Maximum CM energy must be greater than minimum CM energy');
        }
        
        // Additional physics validation
        if (parseFloat(data.elab) <= 0) {
            validationErrors.push('Laboratory energy must be positive');
        }
        
        if (parseFloat(data.ecmbh) <= 0) {
            validationErrors.push('Energy step must be positive');
        }
        
    } catch (error) {
        validationErrors.push('Invalid numerical values detected');
    }
    
    // Display validation errors
    if (validationErrors.length > 0) {
        const errorMessage = validationErrors.length === 1 
            ? validationErrors[0]
            : `${validationErrors.length} validation errors:\n• ${validationErrors.join('\n• ')}`;
        window.smoothieWebsite.showNotification(errorMessage, 'error');
        return;
    }

    const inputFile = window.smoothieWebsite.generateInputFileContent(data);
    window.smoothieWebsite.downloadFile('input.in', inputFile);
    window.smoothieWebsite.showNotification('Input file generated successfully!', 'success');
}

function loadExample() {
    // Load d93Nb.in example into the form
    const form = document.getElementById('smoothieForm');
    if (!form) return;

    // GLOBAL parameters from d93Nb.in
    document.getElementById('hcm').value = '0.05';
    document.getElementById('lmax').value = '25';
    document.getElementById('elab').value = '25.5';
    document.getElementById('thmin').value = '0.';
    document.getElementById('thmax').value = '180.';
    document.getElementById('printf').value = 'f';
    document.getElementById('dwba').value = '1';
    document.getElementById('thinc').value = '1';
    document.getElementById('nx').value = '34';
    document.getElementById('rmax').value = '50';
    document.getElementById('nr').value = '100';
    document.getElementById('lxmax').value = '12';

    // SYSTEM parameters from d93Nb.in
    document.getElementById('namep').value = 'd';
    document.getElementById('massp').value = '2.0';
    document.getElementById('zp').value = '1.0';
    document.getElementById('jp').value = '0.0';
    document.getElementById('sbx').value = '0.0';
    document.getElementById('namet').value = '93Nb';
    document.getElementById('masst').value = '93.0';
    document.getElementById('zt').value = '41.0';
    document.getElementById('jt').value = '0.0';
    document.getElementById('be').value = '2.224';
    document.getElementById('nameb').value = 'p';
    document.getElementById('massb').value = '1.0078';
    document.getElementById('zb').value = '1.0';
    document.getElementById('jb').value = '0.0';
    document.getElementById('namex').value = 'n';
    document.getElementById('massx').value = '1.0087';
    document.getElementById('zx').value = '0.0';
    document.getElementById('jx').value = '0.0';
    document.getElementById('lbx').value = '0';
    document.getElementById('nodes').value = '1';

    // OUTGOING parameters from d93Nb.in
    document.getElementById('ecmbmin').value = '2';
    document.getElementById('ecmbmax').value = '30';
    document.getElementById('ecmbh').value = '1';

    // POTENTIAL parameters from d93Nb.in
    // Potential 1: a-A system
    document.getElementById('ptype1').value = '1';
    document.getElementById('a1_1').value = '0';
    document.getElementById('a2_1').value = '93';
    document.getElementById('rc1').value = '1.3';
    document.getElementById('uv1').value = '77.3';
    document.getElementById('av1').value = '0.77';
    document.getElementById('rv1').value = '1.15';
    document.getElementById('uw1').value = '6.1';
    document.getElementById('aw1').value = '0.47';
    document.getElementById('rw1').value = '1.33';
    document.getElementById('wd1').value = '8.4';
    document.getElementById('awd1').value = '0.77';
    document.getElementById('rwd1').value = '1.37';

    // Potential 2: b-B* system
    document.getElementById('ptype2').value = '4';
    document.getElementById('a1_2').value = '0';
    document.getElementById('a2_2').value = '94';

    // Potential 3: x-A system
    document.getElementById('ptype3').value = '4';
    document.getElementById('a1_3').value = '0';
    document.getElementById('a2_3').value = '93';

    // Potential 4: p (b-x) system
    document.getElementById('ptype4').value = '2';
    document.getElementById('a1_4').value = '1';
    document.getElementById('a2_4').value = '1';
    document.getElementById('rc4').value = '1.5';
    document.getElementById('uv4').value = '72.15';
    document.getElementById('av4').value = '1.484';

    // Potential 5: t (b-A) system
    document.getElementById('ptype5').value = '4';
    document.getElementById('a1_5').value = '0';
    document.getElementById('a2_5').value = '93';

    // Update preview
    window.smoothieWebsite.updatePreview();
    window.smoothieWebsite.showNotification('d93Nb.in example loaded successfully!', 'success');
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
    console.log('=== COPY BIBTEX DEBUG START ===');
    console.log('bibtexId:', bibtexId);
    console.log('buttonElement:', buttonElement);
    
    // Find the BibTeX element
    const bibtexElement = document.getElementById(bibtexId);
    console.log('bibtexElement found:', !!bibtexElement);
    
    if (!bibtexElement) {
        alert('ERROR: BibTeX element not found with ID: ' + bibtexId);
        return;
    }
    
    // Find the pre element
    const preElement = bibtexElement.querySelector('pre');
    console.log('preElement found:', !!preElement);
    
    if (!preElement) {
        alert('ERROR: Pre element not found inside BibTeX box');
        console.log('bibtexElement innerHTML:', bibtexElement.innerHTML);
        return;
    }
    
    // Get the text content
    const textContent = preElement.textContent;
    const innerText = preElement.innerText;
    const innerHTML = preElement.innerHTML;
    
    console.log('textContent:', textContent);
    console.log('innerText:', innerText);
    console.log('innerHTML:', innerHTML);
    
    const bibtexText = textContent || innerText || innerHTML.replace(/<[^>]*>/g, '');
    console.log('Final bibtexText length:', bibtexText.length);
    console.log('Final bibtexText preview:', bibtexText.substring(0, 100));
    
    if (!bibtexText || bibtexText.trim().length === 0) {
        alert('ERROR: No text content found to copy');
        return;
    }
    
    // Method 1: Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        console.log('Trying modern clipboard API...');
        navigator.clipboard.writeText(bibtexText.trim()).then(() => {
            console.log('✅ Modern clipboard API SUCCESS');
            alert('✅ BibTeX copied successfully!');
            updateButton(buttonElement);
        }).catch(err => {
            console.log('❌ Modern clipboard API FAILED:', err);
            tryFallbackMethod(bibtexText.trim(), buttonElement, bibtexElement);
        });
    } else {
        console.log('Modern clipboard API not available, trying fallback...');
        tryFallbackMethod(bibtexText.trim(), buttonElement, bibtexElement);
    }
}

function tryFallbackMethod(text, buttonElement, bibtexElement) {
    console.log('=== TRYING FALLBACK METHOD ===');
    
    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    textarea.value = text;
    
    document.body.appendChild(textarea);
    
    try {
        // Focus and select
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        
        console.log('Selected text length:', textarea.selectionEnd - textarea.selectionStart);
        
        // Execute copy command
        const successful = document.execCommand('copy');
        console.log('execCommand result:', successful);
        
        if (successful) {
            console.log('✅ Fallback method SUCCESS');
            alert('✅ BibTeX copied successfully!');
            updateButton(buttonElement);
        } else {
            console.log('❌ Fallback method FAILED');
            showManualCopy(text, bibtexElement);
        }
    } catch (err) {
        console.log('❌ Fallback method ERROR:', err);
        showManualCopy(text, bibtexElement);
    } finally {
        document.body.removeChild(textarea);
    }
}

function updateButton(buttonElement) {
    if (buttonElement) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Copied!';
        buttonElement.style.backgroundColor = '#28a745';
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.backgroundColor = '';
        }, 2000);
    }
}

function showManualCopy(text, bibtexElement) {
    alert('❌ Automatic copy failed. The BibTeX will be shown below - please select and copy it manually.');
    if (bibtexElement) {
        bibtexElement.style.display = 'block';
    }
    console.log('Text to copy manually:');
    console.log(text);
}



// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    try {
        window.smoothieWebsite = new SmoothieWebsite();
        console.log('SmoothieWebsite initialized successfully');
    } catch (error) {
        console.error('Error initializing SmoothieWebsite:', error);
    }
    
    // Initialize back to top functionality
    initBackToTop();
    
});

// Back to Top functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', toggleBackToTop);
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Keyboard support
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
    
    // Initial check
    toggleBackToTop();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothieWebsite;
}