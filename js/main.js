/**
 * Ali Raza - Portfolio Main JavaScript
 * Handles interactivity, animations, and theme switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // === 1. Smooth Scroll Navigation ===
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

    // === 2. Mobile Menu Toggle ===
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
            
            // Prevent scrolling on body when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbarMenu.classList.contains('active') && 
                !navbarMenu.contains(e.target) && 
                !navbarToggle.contains(e.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // === 3. Dynamic Text Rotator for Hero Title ===
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
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typingSpeed = 500;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // === 4. Active Navigation Link on Scroll ===
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
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
    });

    // === 5. Theme Color Switcher Logic ===
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const colorPickerModal = document.getElementById('colorPickerModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const presetColors = document.querySelectorAll('.preset-color');
    const customColorInput = document.getElementById('customColor');
    const applyCustomBtn = document.getElementById('applyCustomBtn');

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function lightenColor(hex, percent) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
        const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
        const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function darkenColor(hex, percent) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        const r = Math.floor(rgb.r * (1 - percent));
        const g = Math.floor(rgb.g * (1 - percent));
        const b = Math.floor(rgb.b * (1 - percent));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function applyThemeColor(baseColor, isInitial = false) {
        const root = document.documentElement;
        
        // Define RGB components
        const rgb = hexToRgb(baseColor);
        if (!rgb) return;

        // Calculate shades
        const primaryColor = darkenColor(baseColor, 0.3);
        const secondaryColor = baseColor;
        const accentColor = lightenColor(baseColor, 0.2);
        
        // Get RGB for the primary (darker) shade
        const primaryRgb = hexToRgb(primaryColor);
        
        // Set CSS Variables on root (html element)
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        root.style.setProperty('--secondary-color', secondaryColor);
        root.style.setProperty('--secondary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        root.style.setProperty('--accent-color', accentColor);
        root.style.setProperty('--border-color', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
        root.style.setProperty('--card-bg', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`);
        
        // Dynamic Styles for specific elements that need direct color assignment
        let style = document.getElementById('dynamic-theme-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'dynamic-theme-styles';
            document.head.appendChild(style);
        }
        
        // These are elements that use solid colors or specific logic not easily captured by root vars alone
        style.innerHTML = `
            .nav-link.active::after { background: ${secondaryColor} !important; }
            .btn-primary { background: ${primaryColor} !important; border-color: ${secondaryColor} !important; }
            .navbar { border-bottom-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important; }
            .social-icons a { border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important; }
            .orbit-icon { border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important; }
            .floating-icon { border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important; }
            .skill-tag { border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important; }
            .project-card:hover { border-color: ${secondaryColor} !important; box-shadow: 0 10px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3) !important; }
            .avatar-circle { box-shadow: 0 0 50px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) !important; }
            .avatar-image, .avatar-placeholder { border-color: ${secondaryColor} !important; }
        `;
        
        localStorage.setItem('themeColor', baseColor);
        if (!isInitial && colorPickerModal) {
            colorPickerModal.classList.remove('active');
        }
    }

    // Event Listeners for Theme Switcher
    if (colorPickerBtn) {
        colorPickerBtn.addEventListener('click', () => colorPickerModal.classList.add('active'));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => colorPickerModal.classList.remove('active'));
    }
    if (colorPickerModal) {
        colorPickerModal.addEventListener('click', (e) => {
            if (e.target === colorPickerModal) colorPickerModal.classList.remove('active');
        });
    }

    presetColors.forEach(btn => {
        btn.addEventListener('click', () => applyThemeColor(btn.getAttribute('data-color')));
    });

    if (applyCustomBtn) {
        applyCustomBtn.addEventListener('click', () => applyThemeColor(customColorInput.value));
    }

    // Load saved theme
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) applyThemeColor(savedColor, true);

    // Sync theme across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'themeColor' && e.newValue) {
            applyThemeColor(e.newValue);
        }
    });

    // === 6. Intersection Observer for Scroll Animations ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animation');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .skill-tag, .contact-form').forEach(el => {
        el.classList.add('scroll-hidden');
        observer.observe(el);
    });

    // === 7. Load Custom Projects from Supabase ===
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && typeof supabaseClient !== 'undefined') {
        const fetchProjects = async () => {
            const { data: customProjects, error } = await supabaseClient
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching projects:', error);
                return;
            }

            // Clear existing hardcoded projects to avoid duplicates
            projectsGrid.innerHTML = '';

            customProjects.forEach(project => {
                const article = document.createElement('article');
                article.className = 'project-card show-animation';
                
                const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
                
                article.innerHTML = `
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" class="project-img" onerror="this.src='https://via.placeholder.com/500x300/333333/ffffff?text=${encodeURIComponent(project.title)}'">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${tagsHTML}
                        </div>
                        <div class="project-links">
                            ${project.live_link ? `<a href="${project.live_link}" target="_blank" rel="noopener" class="btn-link">Live Demo</a>` : ''}
                            ${project.github_link ? `<a href="${project.github_link}" target="_blank" rel="noopener" class="btn-link">GitHub</a>` : ''}
                        </div>
                    </div>
                `;
                
                projectsGrid.appendChild(article);
            });
        };
        fetchProjects();
    }

    console.log('Portfolio Main Initialized Successfully!');
});
