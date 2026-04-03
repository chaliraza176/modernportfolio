/**
 * Ali Raza - Portfolio Admin JS (Supabase Auth Version)
 * Handles secure login, forgot password, and full CRUD.
 * RESTRICTED: Only alirazachh176@gmail.com can log in.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const forgotPassLink = document.getElementById('forgotPassLink');
    
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
            if (session) await supabaseClient.auth.signOut(); // Sign out unauthorized users
        }
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPass').value;
        
        if (email !== ADMIN_EMAIL) {
            alert('Unauthorized login attempt. Only the site owner can access the admin panel.');
            return;
        }
        
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Login failed: ' + error.message);
        } else {
            checkUser();
        }
    });

    forgotPassLink.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value.trim();
        if (!email || email !== ADMIN_EMAIL) {
            alert('Please enter your admin email to reset your password.');
            return;
        }
        
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/admin.html'
        });
        
        if (error) alert('Error: ' + error.message);
        else alert('Password reset link sent to your email!');
    });

    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', async () => {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPass').value;
            
            if (email !== ADMIN_EMAIL) {
                alert('Only ' + ADMIN_EMAIL + ' can register as an admin.');
                return;
            }
            if (!password || password.length < 6) {
                alert('Please enter a secure password (at least 6 characters).');
                return;
            }
            
            const { error } = await supabaseClient.auth.signUp({ email, password });
            if (error) alert('Registration failed: ' + error.message);
            else alert('Registration successful! Ab aap wahi email/password se login kar sakte hain.');
        });
    }

    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        checkUser();
    });

    // --- 2. Registration Logic (DEVELOPER ONLY - Access via console to set up once) ---
    window.setupAdmin = async (email, password) => {
        if (email !== ADMIN_EMAIL) {
            console.error('Registration restricted to the admin email.');
            return;
        }
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) console.error('Setup failed:', error.message);
        else console.log('Admin account registered! Please login now.');
    };

    // --- 3. Tag Management ---
    function renderTags() {
        tagsListContainer.innerHTML = '';
        currentTags.forEach((tag, index) => {
            const tagEl = document.createElement('div');
            tagEl.className = 'tag-item';
            tagEl.innerHTML = `
                ${tag}
                <button type="button" onclick="removeTag(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            tagsListContainer.appendChild(tagEl);
        });
    }

    addTagBtn.addEventListener('click', () => {
        const value = tagInput.value.trim();
        if (value && !currentTags.includes(value)) {
            currentTags.push(value);
            tagInput.value = '';
            renderTags();
        }
    });

    window.removeTag = (index) => {
        currentTags.splice(index, 1);
        renderTags();
    };

    // --- 4. CRUD Operations ---
    async function fetchProjects() {
        const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching projects:', error);
            return;
        }
        renderProjectsList(data);
    }

    function renderProjectsList(projects) {
        const header = projectsListContainer.querySelector('h3');
        projectsListContainer.innerHTML = '';
        if (header) projectsListContainer.appendChild(header);

        if (projects.length === 0) {
            projectsListContainer.innerHTML += '<p style="text-align:center; padding:20px; color:#666;">No projects found in database.</p>';
            return;
        }

        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-list-item';
            item.innerHTML = `
                <div class="project-info-mini">
                    <strong style="display:block; font-size: 1.1rem; color: var(--secondary-color);">${project.title}</strong>
                    <span style="font-size: 0.85rem; color: var(--text-gray);">${project.tags.join(', ')}</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-edit" onclick="editProject(${JSON.stringify(project).replace(/"/g, '&quot;')})" style="background:var(--secondary-color); border:none; color:white; padding:8px 15px; border-radius:5px; cursor:pointer;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
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

        if (projectData.tags.length === 0) {
            alert('Please add at least one tag.');
            return;
        }

        if (isEditing) {
            const id = projectIDInput.value;
            const { error } = await supabaseClient.from('projects').update(projectData).eq('id', id);
            if (error) alert('Error updating: ' + error.message);
            else {
                alert('Project updated!');
                resetForm();
            }
        } else {
            const { error } = await supabaseClient.from('projects').insert([projectData]);
            if (error) alert('Error saving: ' + error.message);
            else {
                alert('Project added!');
                resetForm();
            }
        }
        fetchProjects();
    });

    window.editProject = (project) => {
        isEditing = true;
        formTitle.textContent = 'Edit Project';
        submitBtn.textContent = 'Update Project';
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
        if (confirm('Delete this project forever?')) {
            const { error } = await supabaseClient.from('projects').delete().eq('id', id);
            if (error) alert('Error deleting: ' + error.message);
            else fetchProjects();
        }
    };

    function resetForm() {
        isEditing = false;
        formTitle.textContent = 'Add New Project';
        submitBtn.textContent = 'Save Project';
        cancelEditBtn.style.display = 'none';
        adminForm.reset();
        currentTags = [];
        renderTags();
    }

    cancelEditBtn.addEventListener('click', resetForm);

    // Initial Auth Check
    checkUser();
});
