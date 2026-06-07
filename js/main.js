// Load portfolio data and render
let allItems = [];

async function initializePortfolio() {
    try {
        let response;
        try {
            response = await fetch('/data/portfolio.json');
        } catch (e) {
            console.log('✗ Failed to load /data/portfolio.json:', e.message);
        }
        if (!response || !response.ok) {
            throw new Error(`Failed to fetch portfolio.json. Status: ${response?.status}`);
        }
        allItems = await response.json();
        console.log(`✓ Loaded ${allItems.length} portfolio items`);
        renderPortfolio(allItems);
        initializeFilters();
    } catch (error) {
        console.error('Error loading portfolio:', error);
        document.getElementById('portfolio-grid').innerHTML =
            '<p class="col-span-full text-center text-slate-600">Unable to load portfolio items. Error: ' + error.message + '</p>';
    }
}

function initializeFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const filtered = filter === 'all'
                ? allItems
                : allItems.filter(item => item.tags && item.tags.includes(filter));
            renderPortfolio(filtered);
        });
    });
}

function renderPortfolio(items) {
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-slate-400 text-sm py-12">No items in this category yet.</p>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'group rounded-xl overflow-hidden border border-slate-200 bg-white transition hover:shadow-lg';

        if (item.imageUrl) {
            div.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" class="w-full h-auto transition-transform duration-300 group-hover:scale-105">
                <div class="p-4">
                    <h4 class="text-sm font-medium text-slate-700">${item.title}</h4>
                    ${item.description ? `<p class="text-xs text-slate-600 mt-2">${item.description}</p>` : ''}
                    ${item.tools ? `<p class="text-xs text-slate-500 mt-2"><strong>Tools:</strong> ${item.tools}</p>` : ''}
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="p-4">
                    <h4 class="text-sm font-medium text-slate-700">${item.title}</h4>
                    ${item.description ? `<p class="text-xs text-slate-600 mt-2">${item.description}</p>` : ''}
                    ${item.tools ? `<p class="text-xs text-slate-500 mt-2"><strong>Tools:</strong> ${item.tools}</p>` : ''}
                </div>
            `;
        }

        grid.appendChild(div);
    });
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const statusDiv = document.getElementById('form-status');

    try {
        const res = await fetch("https://formspree.io/f/meednonb", {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json",
            },
        });

        if (res.ok) {
            statusDiv.className = 'text-sm py-2 status-success';
            statusDiv.textContent = 'Thanks — your message has been sent.';
            statusDiv.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
                statusDiv.classList.add('hidden');
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        statusDiv.className = 'text-sm py-2 status-error';
        statusDiv.textContent = 'Something went wrong. Please try again.';
        statusDiv.classList.remove('hidden');
    }
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePortfolio);
