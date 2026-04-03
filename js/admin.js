/**
 * Ali Raza - Portfolio Admin JS
 * Handles adding and deleting projects from localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.getElementById('adminForm');
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagsListContainer = document.getElementById('tagsList');
    const projectsListContainer = document.getElementById('projectsList');
    
    let currentTags = [];
    let customProjects = JSON.parse(localStorage.getItem('customProjects')) || [];

    // --- 1. Tag Management ---
    function renderTags() {
        tagsListContainer.innerHTML = '';
        currentTags.forEach((tag, index) => {
            const tagEl = document.createElement('div');
            tagEl.className = 'tag-item';
            tagEl.innerHTML = `
                ${tag}
                <button type="button" onclick="window.removeTag(${index})">
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

    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTagBtn.click();
        }
    });

    window.removeTag = (index) => {
        currentTags.splice(index, 1);
        renderTags();
    };

    // --- 2. Project Persistence ---
    function saveProjects() {
        localStorage.setItem('customProjects', JSON.stringify(customProjects));
        renderProjectsList();
    }

    function renderProjectsList() {
        // Clear previous list but keep the header
        const header = projectsListContainer.querySelector('h3');
        projectsListContainer.innerHTML = '';
        if (header) projectsListContainer.appendChild(header);

        if (customProjects.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.style.color = 'var(--text-gray)';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '20px';
            emptyMsg.textContent = 'No custom projects added yet.';
            projectsListContainer.appendChild(emptyMsg);
            return;
        }

        customProjects.forEach((project, index) => {
            const item = document.createElement('div');
            item.className = 'project-list-item';
            item.innerHTML = `
                <div class="project-info-mini">
                    <strong style="display:block; font-size: 1.1rem; color: var(--secondary-color);">${project.title}</strong>
                    <span style="font-size: 0.85rem; color: var(--text-gray);">${project.tags.join(', ')}</span>
                </div>
                <button class="btn-delete" onclick="window.deleteProject(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            `;
            projectsListContainer.appendChild(item);
        });
    }

    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProject = {
            id: Date.now(),
            title: document.getElementById('pTitle').value,
            description: document.getElementById('pDesc').value,
            image: document.getElementById('pImage').value,
            tags: [...currentTags],
            liveLink: document.getElementById('pLive').value,
            githubLink: document.getElementById('pGithub').value
        };

        if (newProject.tags.length === 0) {
            alert('Please add at least one tag/language.');
            return;
        }

        customProjects.push(newProject);
        saveProjects();

        // Reset form
        adminForm.reset();
        currentTags = [];
        renderTags();
        
        alert('Project added successfully!');
    });

    window.deleteProject = (index) => {
        if (confirm('Are you sure you want to delete this project?')) {
            customProjects.splice(index, 1);
            saveProjects();
        }
    };

    // Initial render
    renderProjectsList();
});
