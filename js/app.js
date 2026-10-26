// Softwood Consulting site behaviour.
// Pages, posts and the project list are built by Jekyll (see _data/projects.yml and _posts/).
// This script only adds: accordions and tabs on /projects/, live GitHub stats on project cards,
// and an "Other Projects" group for public repos not listed in _data/projects.yml.

const GITHUB_USER = 'woodmawa';

async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error(`GitHub API request failed: ${response.status}`);
        const repos = await response.json();
        return repos
            .filter(repo => !repo.fork && !repo.private && repo.name !== `${GITHUB_USER}.github.io`)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

function showMeta(card, selector, value) {
    const item = card.querySelector(selector);
    if (!item || value === undefined || value === null || value === '') return;
    item.querySelector('.value').textContent = value;
    item.hidden = false;
}

// Fill stars, language and last-updated on the cards Jekyll rendered
function decorateProjectCards(repos) {
    document.querySelectorAll('.project-card[data-repo]').forEach(card => {
        const repo = repos.find(r => r.name === card.dataset.repo);
        if (!repo) return;
        showMeta(card, '.meta-stars', repo.stargazers_count);
        showMeta(card, '.meta-language', repo.language);
        showMeta(card, '.meta-updated', new Date(repo.pushed_at || repo.updated_at).toLocaleDateString('en-GB'));
    });
}

function renderOtherProjects(repos) {
    const target = document.getElementById('otherProjects');
    if (!target) return;

    const listed = new Set([...document.querySelectorAll('.project-card[data-repo]')].map(c => c.dataset.repo));
    const others = repos.filter(repo => !listed.has(repo.name));
    if (others.length === 0) return;

    const cards = others.map(repo => `
        <div class="project-card" id="${escapeHtml(repo.name)}">
            <h4>${escapeHtml(repo.name)}</h4>
            <div class="project-meta">
                <span class="meta-item">⭐ ${repo.stargazers_count} stars</span>
                ${repo.language ? `<span class="meta-item">💻 ${escapeHtml(repo.language)}</span>` : ''}
                <span class="meta-item">📅 Updated ${new Date(repo.pushed_at || repo.updated_at).toLocaleDateString('en-GB')}</span>
            </div>
            <p class="project-description">${escapeHtml(repo.description || 'No description available')}</p>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn">View on GitHub</a>
            </div>
        </div>`).join('');

    target.innerHTML = `
        <div class="accordion">
            <div class="accordion-header">
                <h3>Other Projects</h3>
                <span class="accordion-icon">▼</span>
            </div>
            <div class="accordion-content">
                <div class="accordion-body">${cards}</div>
            </div>
        </div>`;
    initAccordion(target.querySelector('.accordion'));
}

function initAccordion(accordion) {
    accordion.querySelector('.accordion-header').addEventListener('click', () => {
        const wasActive = accordion.classList.contains('active');
        document.querySelectorAll('.accordion').forEach(acc => acc.classList.remove('active'));
        if (!wasActive) accordion.classList.add('active');
    });
}

function initTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabs = button.closest('.tabs');
            tabs.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            tabs.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
}

// /projects/#repo-name opens that project's accordion and scrolls to it
function openProjectFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const card = document.getElementById(id);
    const accordion = card?.closest('.accordion');
    if (!accordion) return;
    document.querySelectorAll('.accordion').forEach(acc => acc.classList.remove('active'));
    accordion.classList.add('active');
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('projectsContainer')) return;

    document.querySelectorAll('.accordion').forEach(initAccordion);
    initTabs();
    openProjectFromHash();
    window.addEventListener('hashchange', openProjectFromHash);

    const repos = await fetchGitHubRepos();
    decorateProjectCards(repos);
    renderOtherProjects(repos);
    openProjectFromHash();
});
