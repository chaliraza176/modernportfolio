// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic Text Rotator for Hero Title
const dynamicText = document.querySelector('.dynamic-text');
if (dynamicText) {
    const titles = [
        'Code Explorer',
        'Problem Solver',
        'MERN Stack Developer',
        'Full Stack Developer'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeEffect() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            dynamicText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 100;
        } else {
            dynamicText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start the typing effect
    setTimeout(typeEffect, 1000);
}

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (scrollY > 50) {
        navbar.style.background = 'rgba(13, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(220, 20, 60, 0.3)';
    } else {
        navbar.style.background = 'rgba(13, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Menu Toggle
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        navbarToggle.classList.toggle('active');
    });
}

// Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-tag, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

console.log('Portfolio loaded successfully!');

// Color Theme Switcher
const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPickerModal = document.getElementById('colorPickerModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const presetColors = document.querySelectorAll('.preset-color');
const customColorInput = document.getElementById('customColor');
const applyCustomBtn = document.getElementById('applyCustomBtn');

// Function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Function to lighten color
function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to darken color
function darkenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    const r = Math.floor(rgb.r * (1 - percent));
    const g = Math.floor(rgb.g * (1 - percent));
    const b = Math.floor(rgb.b * (1 - percent));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to apply theme color
function applyThemeColor(baseColor) {
    const root = document.documentElement;
    const rgb = hexToRgb(baseColor);
    const primaryColor = darkenColor(baseColor, 0.3);
    const secondaryColor = baseColor;
    const accentColor = lightenColor(baseColor, 0.2);
    
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--border-color', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    root.style.setProperty('--card-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    
    // Update all shadow colors dynamically
    const style = document.createElement('style');
    style.id = 'dynamic-shadows';
    
    // Remove old dynamic styles
    const oldStyle = document.getElementById('dynamic-shadows');
    if (oldStyle) oldStyle.remove();
    
    style.innerHTML = `
        body {
            background: #000000 !important;
        }
        .hero-section::before {
            background: radial-gradient(circle at 30% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15) 0%, transparent 50%) !important;
        }
        .about-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 70% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        .projects-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 30%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12) 0%, transparent 60%);
            pointer-events: none;
            z-index: 0;
        }
        .contact-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        .avatar-circle {
            box-shadow: 0 0 50px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%) !important;
        }
        .avatar-image {
            border-color: ${secondaryColor} !important;
        }
        .btn-primary:hover,
        .btn:hover {
            box-shadow: 0 5px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important;
        }
        .btn-primary {
            background: ${primaryColor} !important;
            border-color: ${secondaryColor} !important;
        }
        .btn {
            border-color: ${secondaryColor} !important;
        }
        .project-card:hover {
            box-shadow: 0 10px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
            border-color: ${secondaryColor} !important;
        }
        .orbit-icon:hover,
        .floating-icon:hover {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
            border-color: ${secondaryColor} !important;
            box-shadow: 0 8px 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
        }
        .skill-tag:hover {
            background: ${primaryColor} !important;
            border-color: ${secondaryColor} !important;
        }
        .navbar {
            background: rgba(0, 0, 0, 0.98) !important;
            box-shadow: 0 2px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .contact-item i {
            color: ${secondaryColor} !important;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            border-color: ${secondaryColor} !important;
            box-shadow: 0 0 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .social-icons a:hover,
        .social-icons-contact a:hover {
            background: ${secondaryColor} !important;
            border-color: ${secondaryColor} !important;
        }
        .social-icons-nav a:hover,
        .color-picker-btn:hover {
            color: ${secondaryColor} !important;
        }
        .nav-link:hover,
        .nav-link.active {
            color: ${secondaryColor} !important;
        }
        .orbit-icon {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important;
            box-shadow: 0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .avatar-glow {
            background: radial-gradient(circle, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) 0%, transparent 70%) !important;
        }
        .project-card {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        .skill-tag {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .contact-form {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        .code-block {
            background: rgba(0, 0, 0, 0.6) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        .section-title::after {
            background: ${secondaryColor} !important;
        }
        .nav-link.active::after {
            background: ${secondaryColor} !important;
        }
        .preset-color:hover {
            box-shadow: 0 5px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6) !important;
        }
        .apply-custom-btn,
        .close-modal-btn {
            background: ${primaryColor} !important;
            border-color: ${secondaryColor} !important;
        }
        .apply-custom-btn:hover,
        .close-modal-btn:hover {
            background: ${secondaryColor} !important;
        }
        .color-picker-content {
            background: rgba(0, 0, 0, 0.95) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .footer {
            border-top-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        .form-group input,
        .form-group textarea {
            background: rgba(0, 0, 0, 0.4) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important;
        }
        .tag {
            background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25) !important;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4) !important;
        }
        .btn-link {
            border-color: ${secondaryColor} !important;
        }
        .btn-link:hover {
            background: ${secondaryColor} !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Save to localStorage
    localStorage.setItem('themeColor', baseColor);
    
    // Close modal
    colorPickerModal.classList.remove('active');
}

// Open color picker modal
if (colorPickerBtn) {
    colorPickerBtn.addEventListener('click', () => {
        colorPickerModal.classList.add('active');
    });
}

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        colorPickerModal.classList.remove('active');
    });
}

// Close modal on outside click
colorPickerModal.addEventListener('click', (e) => {
    if (e.target === colorPickerModal) {
        colorPickerModal.classList.remove('active');
    }
});

// Preset color buttons
presetColors.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        applyThemeColor(color);
    });
});

// Apply custom color
if (applyCustomBtn) {
    applyCustomBtn.addEventListener('click', () => {
        const color = customColorInput.value;
        applyThemeColor(color);
    });
}

// Load saved theme color on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
        applyThemeColor(savedColor);
    }
});
