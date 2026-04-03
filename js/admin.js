/**
 * Ali Raza - Portfolio Admin JS (Supabase Version)
 * Handles full CRUD operations and Auth.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
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

    // --- 1. Auth Management ---
    const checkUser = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            loginScreen.style.display = 'none';
            adminPanel.style.display = 'block';
            fetchProjects();
        } else {
            loginScreen.style.display = 'flex';
            adminPanel.style.display = 'none';
        }
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;
        
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Login failed: ' + error.message);
        } else {
            checkUser();
        }
    });

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
