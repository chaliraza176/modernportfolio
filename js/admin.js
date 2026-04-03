/**
 * Ali Raza - Portfolio Admin JS (SUPABASE MAGIC LINK VERSION)
 * No passwords needed. Just click the link in your email.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const magicForm = document.getElementById('magicForm');
    const statusMsg = document.getElementById('statusMsg');
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

    // --- 1. Auth Management (Magic Link) ---
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

    if (magicForm) {
        magicForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('magicEmail').value.trim();
            
            if (email !== ADMIN_EMAIL) {
                alert('Restricted: Only the site owner can request a Magic Link.');
                return;
            }

            statusMsg.textContent = '⏱ Sending Magic Link... Please wait.';
            statusMsg.style.display = 'block';

            const { error } = await supabaseClient.auth.signInWithOtp({
                email: email,
                options: {
                    // This will redirect you back to this admin page after you click the link in Gmail
                    emailRedirectTo: window.location.href 
                }
            });

            if (error) {
                statusMsg.textContent = '❌ Error: ' + error.message;
                statusMsg.style.color = '#ff4444';
            } else {
                statusMsg.textContent = '📧 Success! Magic Link sent to your Gmail inbox. Check your email and click the link to login.';
                statusMsg.style.color = 'var(--secondary-color)';
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
            tagEl.innerHTML = `
                ${tag}
                <button type="button" onclick="removeTag(${index})" style="background:none; border:none; color:black; cursor:pointer;">
                    <i class="fas fa-times"></i>
                </button>
            `;
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
        projectsListContainer.innerHTML = '';
        if (projects.length === 0) {
            projectsListContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">No projects found. Add your first one above!</p>';
            return;
        }

        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-list-item';
            item.innerHTML = `
                <div class="project-info-mini">
                    <strong style="color: var(--secondary-color); font-size:1.1rem;">${project.title}</strong>
                    <div style="font-size: 0.8rem; color: #888;">${project.tags.join(', ')}</div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-edit" onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})' style="background:var(--secondary-color); border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Edit</button>
                    <button class="btn-delete" onclick="deleteProject(${project.id})" style="background:#ff4444; border:none; color:white; padding:8px 15px; border-radius:5px; cursor:pointer;">Delete</button>
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
            const id = projectIDInput.value;
            const { error } = await supabaseClient.from('projects').update(projectData).eq('id', id);
            if (error) alert('Update error: ' + error.message);
            else {
                alert('Project updated!');
                resetForm();
            }
        } else {
            const { error } = await supabaseClient.from('projects').insert([projectData]);
            if (error) alert('Save error: ' + error.message);
            else {
                alert('Project added globally!');
                resetForm();
            }
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
        if (confirm('Are you sure you want to delete this project?')) {
            const { error } = await supabaseClient.from('projects').delete().eq('id', id);
            if (error) alert('Delete error: ' + error.message);
            else fetchProjects();
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

    // Initial Auth Check
    checkUser();
});
