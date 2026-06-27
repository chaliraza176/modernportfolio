/**
 * Ali Raza - Portfolio Admin JS (HYBRID VERSION: MAGIC LINK + PASSWORD)
 */

document.addEventListener('DOMContentLoaded', async () => {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const statusMsg = document.getElementById('statusMsg');
    
    const magicForm = document.getElementById('magicForm');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const adminForm = document.getElementById('adminForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const projectIDInput = document.getElementById('projectID');
    
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagsListContainer = document.getElementById('tagsList');
    const projectsListContainer = document.getElementById('projectsList');
    
    // Image Uploader & Preview Elements
    const pImageFile = document.getElementById('pImageFile');
    const pImage = document.getElementById('pImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewText = document.getElementById('previewText');

    function updateImagePreview(src) {
        if (src && src.trim() !== '') {
            imagePreview.src = src;
            imagePreview.style.display = 'block';
            previewText.style.display = 'none';
        } else {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
            previewText.style.display = 'block';
        }
    }

    if (pImage) {
        pImage.addEventListener('input', () => {
            updateImagePreview(pImage.value);
        });
    }

    if (pImageFile) {
        pImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Url = event.target.result;
                    pImage.value = base64Url;
                    updateImagePreview(base64Url);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    let currentTags = [];
    let isEditing = false;
    const ADMIN_EMAIL = 'alirazachh176@gmail.com';

    // --- 0. Theme Sync Logic ---
    function applyTheme() {
        const savedColor = localStorage.getItem('themeColor') || '#00ffcc';
        document.documentElement.style.setProperty('--secondary-color', savedColor);
        document.documentElement.style.setProperty('--primary-color', savedColor);
        
        // Update RGB version for overlays
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
        }
        const rgb = hexToRgb(savedColor);
        if (rgb) document.documentElement.style.setProperty('--secondary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    applyTheme();
    // Re-check periodically or on storage change
    window.addEventListener('storage', applyTheme);

    // --- 1. Auth Management ---
    const checkUser = async () => {
        const isBypassLoggedIn = sessionStorage.getItem('admin-logged-in') === 'true';
        if (isBypassLoggedIn) {
            loginScreen.style.display = 'none';
            adminPanel.style.display = 'block';
            fetchProjects();
            return;
        }

        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user.email === ADMIN_EMAIL) {
                loginScreen.style.display = 'none';
                adminPanel.style.display = 'block';
                await migrateLegacyProjects(); // One-time migration for old cards
                fetchProjects();
                return;
            }
        } catch (err) {
            console.warn("Supabase session lookup failed, checking local login state.", err);
        }

        loginScreen.style.display = 'flex';
        adminPanel.style.display = 'none';
    };

    // --- Legacy Migration Utility ---
    async function migrateLegacyProjects() {
        const isMigrated = localStorage.getItem('projects-migrated-to-supabase');
        if (isMigrated) return; // Only run once

        const { data: existing } = await supabaseClient.from('projects').select('id').limit(1);
        if (existing && existing.length > 0) {
             localStorage.setItem('projects-migrated-to-supabase', 'true');
             return;
        }

        const legacyProjects = [
            { title: "Student Portal Dashboard", description: "A responsive student dashboard featuring course registration, grade viewing, and announcements.", image: "assets/images/student-portal.png", tags: ["HTML", "CSS", "JavaScript", "Responsive"], live_link: "https://studentportal-creponne-8d980e.netlify.app/", github_link: "https://github.com/chaliraza176" },
            { title: "Futuristic Portfolio", description: "A design-focused portfolio featuring glassmorphism effects, smooth scroll animations, and interactive micro-interactions.", image: "assets/images/futuristic-portfolio.png", tags: ["HTML", "CSS", "JavaScript", "Animations"], live_link: "https://portfoliofutuistic-ganache-4571e3.netlify.app/", github_link: "https://github.com/chaliraza176" },
            { title: "Minimalist Portfolio", description: "A single-page portfolio optimized for fast performance and clean UI.", image: "assets/images/minimalist-portfolio.png", tags: ["HTML", "CSS", "JavaScript", "Performance"], live_link: "https://calm-dodol-a21aca.netlify.app/", github_link: "https://github.com/chaliraza176" },
            { title: "Simple Portfolio", description: "A clean and straightforward portfolio website showcasing front-end creativity.", image: "assets/images/simple-portfolio.png", tags: ["HTML", "CSS", "JavaScript", "Responsive"], live_link: "https://simpleportfolio-palmier-f4a93b.netlify.app/", github_link: "https://github.com/chaliraza176" },
            { title: "MillionVerified Clone", description: "Created a copy website focusing on email verification services using HTML, JavaScript and TailwindCSS.", image: "assets/images/millionverified.png", tags: ["HTML", "JavaScript", "TailwindCSS"], live_link: "", github_link: "https://github.com/chaliraza176" },
            { title: "Nvysion Platform", description: "A modern, scalable full-stack e-commerce platform for custom printing services.", image: "assets/images/Nvysion Platform.PNG", tags: ["React 19", "Node.js", "MongoDB", "Express"], live_link: "https://nvysion-platform-4cedc1.netlify.app/", github_link: "https://github.com/chaliraza176/Nvysion-Platform" },
            { title: "UniqVue AI App", description: "An advanced AI-Powered Event Photo Sharing mobile application built with React Native.", image: "assets/images/uniqvue.png", tags: ["React Native", "TypeScript", "AI", "Mobile"], live_link: "", github_link: "https://github.com/chaliraza176/UniqVue-ReactNative-" },
            { title: "Modern E-Commerce Store", description: "A high-end, responsive online store interface featuring modern product grids and dynamic cart functionality.", image: "assets/images/online-store.png", tags: ["HTML", "CSS", "JavaScript", "UX/UI"], live_link: "", github_link: "https://github.com/chaliraza176/online-store" },
            { 
                title: "AdFlow Pro", 
                description: "A premium full-stack ad marketplace featuring 3D interactions, parallax animations, and glassmorphism. Built with role-based access for an innovative campaign experience.", 
                image: "assets/images/AdFlow Pro.PNG", 
                tags: ["Next.js", "Supabase", "AdTech", "Management"], 
                live_link: "https://mid-term-project-addflow-pro.vercel.app/", 
                github_link: "https://github.com/chaliraza176/mid-term-project-addflow-pro" 
            },
            { 
                title: "Air Draw — Hand Gesture Doodler", 
                description: "A web-based drawing app that uses your webcam and Google MediaPipe AI to let you draw, erase, and pan on a canvas using only hand gestures.", 
                image: "assets/images/Air Draw — Hand Gesture Doodler.PNG", 
                tags: ["HTML", "CSS", "JavaScript", "MediaPipe AI", "Hand Gesture"], 
                live_link: "https://airdrawcontroller.netlify.app/", 
                github_link: "https://github.com/chaliraza176/air-draw-controller" 
            }
        ];

        const { error } = await supabaseClient.from('projects').insert(legacyProjects);
        if (!error) localStorage.setItem('projects-migrated-to-supabase', 'true');
    }

    // Magic Link Submission
    if (magicForm) {
        magicForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = ADMIN_EMAIL;
            statusMsg.textContent = '⏱ Sending Magic Link...';
            const { error } = await supabaseClient.auth.signInWithOtp({
                email: email,
                options: { emailRedirectTo: window.location.href }
            });
            if (error) {
                statusMsg.textContent = '❌ Error: ' + error.message;
            } else {
                statusMsg.textContent = '📧 Success! Magic Link sent. Check your Gmail inbox.';
            }
        });
    }

    // Password Login Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = ADMIN_EMAIL;
            const password = document.getElementById('loginPass').value;
            statusMsg.textContent = '⏱ Logging in...';
            
            // Bypass mode check (admin123)
            if (password === 'admin123') {
                sessionStorage.setItem('admin-logged-in', 'true');
                statusMsg.textContent = '✅ Success! Redirecting...';
                setTimeout(() => {
                    checkUser();
                }, 500);
                return;
            }

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email, password: password 
                });
                if (error) {
                    statusMsg.textContent = '❌ Login failed: ' + error.message;
                } else {
                    statusMsg.textContent = '✅ Success! Redirecting...';
                    checkUser();
                }
            } catch (err) {
                statusMsg.textContent = '❌ Connection failed. Use bypass password admin123!';
            }
        });
    }

    logoutBtn.addEventListener('click', async () => {
        sessionStorage.removeItem('admin-logged-in');
        try {
            await supabaseClient.auth.signOut();
        } catch (err) {
            console.warn("Signout error:", err);
        }
        checkUser();
    });

    // --- 2. Tag Management ---
    function renderTags() {
        tagsListContainer.innerHTML = '';
        currentTags.forEach((tag, index) => {
            const tagEl = document.createElement('div');
            tagEl.className = 'tag-item';
            tagEl.innerHTML = `${tag} <button type="button" onclick="removeTag(${index})" style="background:none; border:none; color:black; cursor:pointer;"><i class="fas fa-times"></i></button>`;
            tagsListContainer.appendChild(tagEl);
        });
    }

    if (addTagBtn) {
        addTagBtn.addEventListener('click', () => {
            const value = tagInput.value.trim();
            if (value && !currentTags.includes(value)) {
                currentTags.push(value);
                tagInput.value = '';
                renderTags();
            }
        });
    }
    window.removeTag = (index) => {
        currentTags.splice(index, 1);
        renderTags();
    };

    // --- 3. CRUD Operations ---
    // --- 3. CRUD Operations ---
    function sortProjectsByPosition(projects) {
        return projects.sort((a, b) => {
            const getPos = (proj) => {
                if (!proj.tags) return Infinity;
                const posTag = proj.tags.find(t => t.toLowerCase().startsWith('pos:'));
                if (posTag) {
                    const num = parseInt(posTag.split(':')[1]);
                    return isNaN(num) ? Infinity : num;
                }
                return Infinity;
            };
            const posA = getPos(a);
            const posB = getPos(b);
            if (posA !== posB) {
                return posA - posB;
            }
            
            const getTimestamp = (proj) => {
                if (proj.created_at) {
                    const d = new Date(proj.created_at).getTime();
                    if (!isNaN(d)) return d;
                }
                if (typeof proj.id === 'number') {
                    return proj.id;
                }
                if (typeof proj.id === 'string' && proj.id.startsWith('default-')) {
                    const num = parseInt(proj.id.split('-')[1]);
                    return isNaN(num) ? 0 : num;
                }
                const numId = parseInt(proj.id);
                return isNaN(numId) ? 0 : numId;
            };
            
            return getTimestamp(b) - getTimestamp(a);
        });
    }

    async function fetchProjects() {
        const defaultProjectsList = [
            {
                id: 'default-1',
                title: "Air Draw — Hand Gesture Doodler",
                description: "A web-based drawing app that uses your webcam and Google MediaPipe AI to let you draw, erase, and pan on a canvas using only hand gestures — no mouse, no touch required. Features real-time 21-point hand landmark detection.",
                image: "assets/images/Air Draw — Hand Gesture Doodler.PNG",
                tags: ["HTML", "CSS", "JavaScript", "MediaPipe AI", "Hand Gesture", "pos:1"],
                live_link: "https://airdrawcontroller.netlify.app/",
                github_link: "https://github.com/chaliraza176/air-draw-controller"
            },
            {
                id: 'default-2',
                title: "AdFlow Pro",
                description: "A premium full-stack ad marketplace featuring 3D interactions, parallax animations, and glassmorphism. Built with role-based access for accurate campaign monitoring.",
                image: "assets/images/AdFlow Pro.PNG",
                tags: ["Next.js", "Supabase", "AdTech", "Management", "pos:2"],
                live_link: "https://mid-term-project-addflow-pro.vercel.app/",
                github_link: "https://github.com/chaliraza176/mid-term-project-addflow-pro"
            },
            {
                id: 'default-3',
                title: "Modern E-Commerce Store",
                description: "A high-end, responsive online store interface featuring modern product grids, dynamic cart functionality, and elegant minimalist aesthetics for a premium user experience.",
                image: "assets/images/online-store.png",
                tags: ["HTML", "CSS", "JavaScript", "UX/UI", "pos:3"],
                live_link: "",
                github_link: "https://github.com/chaliraza176/online-store"
            },
            {
                id: 'default-4',
                title: "Nvysion Platform",
                description: "A modern, scalable full-stack e-commerce platform for custom printing services. Features seamless 4over API integration, real-time pricing engine, and comprehensive order management.",
                image: "assets/images/Nvysion Platform.PNG",
                tags: ["React 19", "Node.js", "MongoDB", "Express", "pos:4"],
                live_link: "https://nvysion-platform-4cedc1.netlify.app/",
                github_link: "https://github.com/chaliraza176/Nvysion-Platform"
            },
            {
                id: 'default-5',
                title: "UniqVue AI App",
                description: "An advanced AI-Powered Event Photo Sharing mobile application built with React Native. Features include automated photo sorting, face recognition, and seamless group sharing.",
                image: "assets/images/uniqvue.png",
                tags: ["React Native", "TypeScript", "AI", "Mobile", "pos:5"],
                live_link: "",
                github_link: "https://github.com/chaliraza176/UniqVue-ReactNative-"
            },
            {
                id: 'default-6',
                title: "Healthcare & Appointment App",
                description: "A Flutter-based medical solution featuring appointment booking, patient management dashboard, and role-based secure login systems for doctors and patients.",
                image: "assets/images/healthcare.png",
                tags: ["Dart", "Flutter", "Medical UI", "pos:6"],
                live_link: "",
                github_link: "https://github.com/chaliraza176/fluter_project/tree/main/lab%20mid"
            }
        ];

        try {
            const { data, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data) {
                const sorted = sortProjectsByPosition(data);
                renderProjectsList(sorted);
                localStorage.setItem('cached-projects', JSON.stringify(data));
                return;
            }
        } catch (err) {
            console.warn("Supabase fetch failed, falling back to local storage.", err);
        }

        // Fallback to localStorage with one-time defaults migration
        let cached = localStorage.getItem('cached-projects');
        let parsed = cached ? JSON.parse(cached) : [];
        
        if (localStorage.getItem('defaults-migrated-v2') !== 'true') {
            defaultProjectsList.forEach(defProj => {
                const exists = parsed.some(p => p.title.toLowerCase().trim() === defProj.title.toLowerCase().trim());
                if (!exists) {
                    parsed.push(defProj);
                }
            });
            localStorage.setItem('cached-projects', JSON.stringify(parsed));
            localStorage.setItem('defaults-migrated-v2', 'true');
        }

        // Force-inject default positions if missing in current cache
        if (localStorage.getItem('defaults-positioned-v3') !== 'true') {
            parsed = parsed.map(proj => {
                const def = defaultProjectsList.find(d => d.title.toLowerCase().trim() === proj.title.toLowerCase().trim());
                if (def) {
                    const hasPos = proj.tags.some(t => t.toLowerCase().startsWith('pos:'));
                    if (!hasPos) {
                        const defPosTag = def.tags.find(t => t.toLowerCase().startsWith('pos:'));
                        if (defPosTag) {
                            proj.tags.push(defPosTag);
                        }
                    }
                }
                return proj;
            });
            localStorage.setItem('cached-projects', JSON.stringify(parsed));
            localStorage.setItem('defaults-positioned-v3', 'true');
        }
        
        const sorted = sortProjectsByPosition(parsed);
        renderProjectsList(sorted);
    }

    function renderProjectsList(projects) {
        projectsListContainer.innerHTML = '';
        if (projects.length === 0) {
            projectsListContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">Add your first project above!</p>';
            return;
        }

        // Using Card Layout for Admin List
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        grid.style.gap = '25px';

        projects.forEach(project => {
            const card = document.createElement('article');
            card.className = 'project-card';
            card.style.position = 'relative';
            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" class="project-img" style="aspect-ratio: 16/9; object-fit: cover; border-radius: 10px 10px 0 0;">
                </div>
                <div class="project-content" style="padding: 20px;">
                    <h3 class="project-title" style="color: var(--secondary-color);">${project.title}</h3>
                    <p class="project-description" style="font-size: 0.85rem; height: 50px; overflow: hidden; margin: 10px 0;">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.filter(tag => !tag.toLowerCase().startsWith('pos:')).map(tag => `<span class="tag" style="background: rgba(var(--secondary-color-rgb), 0.1); color: var(--secondary-color); font-size:0.7rem;">${tag}</span>`).join('')}
                    </div>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button class="btn-edit" onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})' style="flex:1; background:var(--secondary-color); border:none; padding:8px; border-radius:5px; cursor:pointer; font-weight:bold;">Edit</button>
                        <button class="btn-delete" onclick="deleteProject(${project.id})" style="flex:1; background:#ff444433; border:1px solid #ff4444; color:#ff4444; padding:8px; border-radius:5px; cursor:pointer;">Delete</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        projectsListContainer.appendChild(grid);
    }

    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clean out any existing category and position tags from currentTags
        let cleanedTags = currentTags.filter(t => {
            const lower = t.toLowerCase();
            return lower !== 'react' && lower !== 'portfolio' && lower !== 'app' && lower !== 'apps' && !lower.startsWith('pos:');
        });

        // Add the newly selected category tag
        const categoryVal = document.getElementById('pCategory').value;
        if (categoryVal === 'react') {
            cleanedTags.push('React');
        } else if (categoryVal === 'portfolio') {
            cleanedTags.push('Portfolio');
        } else if (categoryVal === 'apps') {
            cleanedTags.push('App');
        }

        // Add position tag if specified
        const positionVal = document.getElementById('pPosition').value;
        if (positionVal && parseInt(positionVal) > 0) {
            cleanedTags.push('pos:' + parseInt(positionVal));
        }

        const projectData = {
            title: document.getElementById('pTitle').value,
            description: document.getElementById('pDesc').value,
            image: document.getElementById('pImage').value,
            tags: cleanedTags,
            live_link: document.getElementById('pLive').value,
            github_link: document.getElementById('pGithub').value
        };

        if (isEditing) {
            try {
                const { error } = await supabaseClient.from('projects').update(projectData).eq('id', projectIDInput.value);
                if (error) throw error;
                alert('Project Updated in Database!'); 
                resetForm(); 
                fetchProjects();
                return;
            } catch (err) {
                console.warn("DB save failed, falling back to local storage.", err);
            }
            
            // Local Storage fallback
            let cached = JSON.parse(localStorage.getItem('cached-projects') || '[]');
            cached = cached.map(p => p.id == projectIDInput.value ? { ...p, ...projectData } : p);
            localStorage.setItem('cached-projects', JSON.stringify(cached));
            alert('Database offline. Project updated in Local Storage!');
            resetForm();
            fetchProjects();
        } else {
            try {
                const { error } = await supabaseClient.from('projects').insert([projectData]);
                if (error) throw error;
                alert('Project Saved to Database!'); 
                resetForm(); 
                fetchProjects();
                return;
            } catch (err) {
                console.warn("DB save failed, falling back to local storage.", err);
            }
            
            // Local Storage fallback
            let cached = JSON.parse(localStorage.getItem('cached-projects') || '[]');
            const newProject = { id: Date.now(), ...projectData };
            cached.unshift(newProject);
            localStorage.setItem('cached-projects', JSON.stringify(cached));
            alert('Database offline. Project saved to Local Storage!');
            resetForm();
            fetchProjects();
        }
    });

    window.editProject = (project) => {
        isEditing = true;
        formTitle.textContent = 'Edit Project';
        submitBtn.textContent = 'UPDATE PROJECT';
        cancelEditBtn.style.display = 'block';
        projectIDInput.value = project.id;
        document.getElementById('pTitle').value = project.title;
        document.getElementById('pDesc').value = project.description;
        document.getElementById('pImage').value = project.image;
        updateImagePreview(project.image); // Load edit preview
        document.getElementById('pLive').value = project.live_link || '';
        document.getElementById('pGithub').value = project.github_link || '';
        currentTags = [...project.tags];
        renderTags();

        // Extract position from tags
        const posTag = project.tags.find(t => t.toLowerCase().startsWith('pos:'));
        if (posTag) {
            document.getElementById('pPosition').value = parseInt(posTag.split(':')[1]) || '';
        } else {
            document.getElementById('pPosition').value = '';
        }

        // Determine category for dropdown
        const lowerTags = project.tags.map(t => t.toLowerCase());
        const lowerTitle = project.title.toLowerCase();
        let detectedCategory = 'portfolio'; // default fallback

        if (lowerTags.includes('portfolio')) {
            detectedCategory = 'portfolio';
        } else if (lowerTags.includes('react')) {
            detectedCategory = 'react';
        } else if (lowerTags.includes('app') || lowerTags.includes('apps')) {
            detectedCategory = 'apps';
        } else {
            // Implicit keyword detection
            if (lowerTitle.includes('portfolio') || lowerTags.includes('animations') || lowerTags.includes('performance') || lowerTags.includes('ux/ui')) {
                detectedCategory = 'portfolio';
            } else if (lowerTags.some(t => t.includes('react') || t.includes('next.js') || t.includes('nextjs'))) {
                detectedCategory = 'react';
            } else if (lowerTags.some(t => t.includes('flutter') || t.includes('dart') || t.includes('mobile') || t.includes('native') || t.includes('adtech')) || lowerTitle.includes('app') || lowerTitle.includes('doodler')) {
                detectedCategory = 'apps';
            }
        }
        document.getElementById('pCategory').value = detectedCategory;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteProject = async (id) => {
        if (confirm('Delete this project?')) {
            try {
                const { error } = await supabaseClient.from('projects').delete().eq('id', id);
                if (error) throw error;
                fetchProjects();
                return;
            } catch (err) {
                console.warn("DB delete failed, falling back to local storage.", err);
            }
            
            // Local Storage fallback
            let cached = JSON.parse(localStorage.getItem('cached-projects') || '[]');
            cached = cached.filter(p => p.id != id);
            localStorage.setItem('cached-projects', JSON.stringify(cached));
            alert('Database offline. Project deleted from Local Storage!');
            fetchProjects();
        }
    };

    function resetForm() {
        isEditing = false;
        formTitle.textContent = 'Add New Project';
        submitBtn.textContent = 'SAVE PROJECT';
        cancelEditBtn.style.display = 'none';
        adminForm.reset();
        updateImagePreview(''); // Clear preview
        document.getElementById('pCategory').value = 'react';
        document.getElementById('pPosition').value = '';
        currentTags = [];
        renderTags();
    }
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);
    checkUser();
});
