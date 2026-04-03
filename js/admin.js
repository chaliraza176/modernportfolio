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

    // --- 1. Auth Management ---
    const checkUser = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user.email === ADMIN_EMAIL) {
            loginScreen.style.display = 'none';
            adminPanel.style.display = 'block';
            fetchProjects();
        } else {
            loginScreen.style.display = 'flex';
            adminPanel.style.display = 'none';
        }
    };

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
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-list-item';
            item.innerHTML = `
                <div><strong style="color:var(--secondary-color);">${project.title}</strong><div style="font-size:0.8rem; color:#888;">${project.tags.join(', ')}</div></div>
                <div>
                    <button class="btn-edit" onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})' style="background:var(--secondary-color); border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Edit</button>
                    <button class="btn-delete" onclick="deleteProject(${project.id})" style="background:#ff4444; border:none; color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">Delete</button>
                </div>
            `;
            projectsListContainer.appendChild(item);
        });
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
