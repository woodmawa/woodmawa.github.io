// Project configuration - customize your projects here
const projectCategories = {
    'Core Libraries': [
        {
            name: 'grooy-HttpClient',
            repo: 'groovy-HttpClient',
            description: 'Modern groovy http client, for java 25 + virtual threads, with DSL support and test framework\nMaven central co-ordinates io.github.woodmawa:groovy-httpclient:1.0.1',
            features: [
                'Java 21+ (compiled on Java 25)  ',
                'Virtual threads for aysnc calls ',
                'SecurityConfig class and factory methods to setup security policy when calling the constructor ',
                'URL Builder to construct safe URLs ',
                'testing framework included ',
                'guidance on certificate management and supporting scripts ',
                'project documentation in /docs'
            ],
            documentation: 'Modern Architecture\n' +
                'Virtual Thread Executor — Handle millions of concurrent requests with minimal overhead (Java 21+)\n' +
                'HTTP/2 Support — Automatic protocol negotiation with multiplexing\n' +
                'Zero Magic — Wraps Java\'s standard HttpClient — no reflection, no bytecode manipulation\n' +
                'Groovy-First Design\n' +
                'Fluent DSL — Natural, expressive syntax for requests, headers, and multipart uploads\n' +
                'Automatic JSON/XML Parsing — Built-in content-type aware response handling\n' +
                'Closure-Based Configuration — Groovy-idiomatic request building\n' +
                'Production-Ready Resilience\n' +
                'Circuit Breaker — Automatic failure detection with CLOSED → OPEN → HALF_OPEN states\n' +
                'Retry Policies — Exponential backoff with jitter for transient failures\n' +
                'Request/Response Interceptors — Logging, metrics, and custom processing\n' +
                'Security by Default\n' +
                'Environment-Aware Profiles — testing(), development(), production() configurations\n' +
                'SSRF Protection — Host allow-listing and absolute URL controls\n' +
                'TLS Configuration — Custom trust stores, hostname verification, protocol selection\n' +
                'Configurable Timeouts — Connect, request, and synchronous operation limits\n' +
                'Comprehensive Testing Framework\n' +
                'MockHttpServer — Lightweight, dependency-free embedded test server\n' +
                'HttpClientTestDsl — Fluent DSL for endpoint mocking and verification\n' +
                'HttpClientTestTrait — Spock trait for seamless test integration\n' +
                'Request Recording — Rich assertions for headers, body, cookies, and query parameters'
        }
    ],
    'Tools & Utilities': [
        {
            name: 'Your Tool',
            repo: 'tool-name',
            description: 'Description of your tool',
            features: [
                'Tool feature 1',
                'Tool feature 2'
            ],
            documentation: 'Getting started with this tool...'
        }
    ],
    'Frameworks': [
        {
            name: 'Your Framework',
            repo: 'framework-name',
            description: 'Description of your framework',
            features: [
                'Framework feature 1',
                'Framework feature 2'
            ],
            documentation: 'Framework documentation...'
        }
    ]
};

// Fetch real GitHub repos
async function fetchGitHubRepos() {
    try {
        const response = await fetch('https://api.github.com/users/woodmawa/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error('GitHub API request failed');

        const repos = await response.json();

        // Filter out forks and private repos, sort by stars
        return repos
            .filter(repo => !repo.fork && !repo.private)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
}

// Merge GitHub data with manual configurations
function mergeProjectData(githubRepos) {
    const mergedCategories = {};

    // Start with manually configured projects
    for (const [category, projects] of Object.entries(projectCategories)) {
        mergedCategories[category] = projects.map(project => {
            const githubRepo = githubRepos.find(r => r.name === project.repo);
            return {
                ...project,
                stars: githubRepo?.stargazers_count || 0,
                language: githubRepo?.language || 'Groovy',
                url: githubRepo?.html_url || `https://github.com/woodmawa/${project.repo}`,
                updated: githubRepo?.updated_at
            };
        });
    }

    // Add uncategorized repos
    const categorizedRepos = Object.values(projectCategories)
        .flat()
        .map(p => p.repo);

    const uncategorized = githubRepos
        .filter(repo => !categorizedRepos.includes(repo.name))
        .map(repo => ({
            name: repo.name,
            repo: repo.name,
            description: repo.description || 'No description available',
            features: ['Explore the repository to learn more'],
            documentation: 'See the README in the repository for documentation.',
            stars: repo.stargazers_count,
            language: repo.language,
            url: repo.html_url,
            updated: repo.updated_at
        }));

    if (uncategorized.length > 0) {
        mergedCategories['Other Projects'] = uncategorized;
    }

    return mergedCategories;
}

// Render projects
function renderProjects(categories) {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';
    container.classList.remove('loading');

    if (Object.keys(categories).length === 0) {
        container.innerHTML = '<p class="loading">No projects found. Check back soon!</p>';
        return;
    }

    for (const [category, projects] of Object.entries(categories)) {
        const accordion = createAccordion(category, projects);
        container.appendChild(accordion);
    }

    // Add event listeners for accordions
    initAccordions();
}

// Create accordion for each category
function createAccordion(category, projects) {
    const accordion = document.createElement('div');
    accordion.className = 'accordion';

    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `
        <h3>${category}</h3>
        <span class="accordion-icon">▼</span>
    `;

    const content = document.createElement('div');
    content.className = 'accordion-content';

    const body = document.createElement('div');
    body.className = 'accordion-body';

    projects.forEach((project, index) => {
        const projectElement = createProjectElement(project, `${category}-${index}`);
        body.appendChild(projectElement);
    });

    content.appendChild(body);
    accordion.appendChild(header);
    accordion.appendChild(content);

    return accordion;
}

// Create individual project element with tabs
function createProjectElement(project, id) {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-card';
    projectDiv.innerHTML = `
        <h4>${project.name}</h4>
        <div class="project-meta">
            <span class="meta-item">
                ⭐ ${project.stars} stars
            </span>
            <span class="meta-item">
                💻 ${project.language}
            </span>
            ${project.updated ? `<span class="meta-item">📅 Updated ${new Date(project.updated).toLocaleDateString()}</span>` : ''}
        </div>
        
        <div class="tabs" id="tabs-${id}">
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="overview-${id}">Overview</button>
                <button class="tab-button" data-tab="features-${id}">Features</button>
                <button class="tab-button" data-tab="docs-${id}">Documentation</button>
            </div>
            
            <div class="tab-content active" id="overview-${id}">
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.url}" target="_blank" class="btn">View on GitHub</a>
                    ${project.url ? `<a href="${project.url}#readme" target="_blank" class="btn btn-secondary">Read Documentation</a>` : ''}
                </div>
            </div>
            
            <div class="tab-content" id="features-${id}">
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tab-content" id="docs-${id}">
                <p>${project.documentation}</p>
                <a href="${project.url}" target="_blank" class="btn">View Full Documentation</a>
            </div>
        </div>
    `;

    return projectDiv;
}

// Initialize accordion functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const wasActive = accordion.classList.contains('active');

            // Close all accordions
            document.querySelectorAll('.accordion').forEach(acc => {
                acc.classList.remove('active');
            });

            // Open clicked accordion if it wasn't active
            if (!wasActive) {
                accordion.classList.add('active');
            }
        });
    });

    // Initialize tab functionality
    initTabs();
}

// Initialize tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            const tabsContainer = button.closest('.tabs');

            // Remove active class from all buttons and contents in this tabs container
            tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            tabsContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const githubRepos = await fetchGitHubRepos();
    const categories = mergeProjectData(githubRepos);
    renderProjects(categories);

    // Open first accordion by default
    const firstAccordion = document.querySelector('.accordion');
    if (firstAccordion) {
        firstAccordion.classList.add('active');
    }
});