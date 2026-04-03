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
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user.email === ADMIN_EMAIL) {
            loginScreen.style.display = 'none';
            adminPanel.style.display = 'block';
            await migrateLegacyProjects(); // One-time migration for old cards
            fetchProjects();
        } else {
            loginScreen.style.display = 'flex';
            adminPanel.style.display = 'none';
        }
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
            { title: "Nvysion Platform", description: "A modern, scalable full-stack e-commerce platform for custom printing services.", image: "assets/images/nvysion-platform.png", tags: ["React 19", "Node.js", "MongoDB", "Express"], live_link: "https://nvysion-platform-4cedc1.netlify.app/", github_link: "https://github.com/chaliraza176/Nvysion-Platform" },
            { title: "UniqVue AI App", description: "An advanced AI-Powered Event Photo Sharing mobile application built with React Native.", image: "assets/images/uniqvue.png", tags: ["React Native", "TypeScript", "AI", "Mobile"], live_link: "", github_link: "https://github.com/chaliraza176/UniqVue-ReactNative-" },
            { title: "Modern E-Commerce Store", description: "A high-end, responsive online store interface featuring modern product grids and dynamic cart functionality.", image: "assets/images/online-store.png", tags: ["HTML", "CSS", "JavaScript", "UX/UI"], live_link: "", github_link: "https://github.com/chaliraza176/online-store" }
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
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email, password: password 
            });
            if (error) {
                statusMsg.textContent = '❌ Login failed: ' + error.message;
            } else {
                statusMsg.textContent = '✅ Success! Redirecting...';
                checkUser();
            }
        });
    }

    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
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
    async function fetchProjects() {
        const { data, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
        if (!error) renderProjectsList(data);
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
                        ${project.tags.map(tag => `<span class="tag" style="background: rgba(var(--secondary-color-rgb), 0.1); color: var(--secondary-color); font-size:0.7rem;">${tag}</span>`).join('')}
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
        const projectData = {
            title: document.getElementById('pTitle').value,
            description: document.getElementById('pDesc').value,
            image: document.getElementById('pImage').value,
            tags: [...currentTags],
            live_link: document.getElementById('pLive').value,
            github_link: document.getElementById('pGithub').value
        };
        if (isEditing) {
            const { error } = await supabaseClient.from('projects').update(projectData).eq('id', projectIDInput.value);
            if (!error) { alert('Project Updated!'); resetForm(); }
        } else {
            const { error } = await supabaseClient.from('projects').insert([projectData]);
            if (!error) { alert('Project Saved!'); resetForm(); }
        }
        fetchProjects();
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
        document.getElementById('pLive').value = project.live_link || '';
        document.getElementById('pGithub').value = project.github_link || '';
        currentTags = [...project.tags];
        renderTags();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteProject = async (id) => {
        if (confirm('Delete this project?')) {
            const { error } = await supabaseClient.from('projects').delete().eq('id', id);
            if (!error) fetchProjects();
        }
    };

    function resetForm() {
        isEditing = false;
        formTitle.textContent = 'Add New Project';
        submitBtn.textContent = 'SAVE PROJECT';
        cancelEditBtn.style.display = 'none';
        adminForm.reset();
        currentTags = [];
        renderTags();
    }
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);
    checkUser();
});
