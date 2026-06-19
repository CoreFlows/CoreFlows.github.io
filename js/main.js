// Load portfolio data and render
let allItems = [];

async function initializePortfolio() {
    try {
        let response;
        try {
            response = await fetch('data/portfolio.json');
        } catch (e) {
            console.log('✗ Failed to load data/portfolio.json:', e.message);
        }
        if (!response || !response.ok) {
            throw new Error(`Failed to fetch portfolio.json. Status: ${response?.status}`);
        }
        allItems = await response.json();
        console.log(`✓ Loaded ${allItems.length} portfolio items`);
        renderPortfolio(allItems);
        initializeFilters();
        initializeLightbox();
    } catch (error) {
        console.error('Error loading portfolio:', error);
        document.getElementById('portfolio-grid').innerHTML =
            '<p class="col-span-full text-center text-navy-600">Unable to load portfolio items. Error: ' + error.message + '</p>';
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
        grid.innerHTML = '<p class="col-span-full text-center text-navy-400 text-sm py-12">No items in this category yet.</p>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'group rounded-xl overflow-hidden border border-navy-900/10 bg-white transition hover:shadow-lg';

        if (item.imageUrl) {
            div.innerHTML = `
                <div class="relative overflow-hidden cursor-zoom-in lightbox-trigger" data-img="${item.imageUrl}">
                    <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" class="w-full h-auto transition-transform duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-colors flex items-center justify-center pointer-events-none">
                        <i class="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl"></i>
                    </div>
                </div>
                <div class="p-5">
                    <h4 class="text-lg font-serif font-bold text-navy-900">${item.title}</h4>
                    ${item.description ? `<p class="text-sm text-navy-800 opacity-80 mt-3 leading-relaxed whitespace-pre-wrap">${item.description}</p>` : ''}
                    ${item.tools ? `<p class="text-xs text-navy-500 mt-4 font-medium uppercase tracking-wider"><strong>Tools:</strong> ${item.tools}</p>` : ''}
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="p-5">
                    <h4 class="text-lg font-serif font-bold text-navy-900">${item.title}</h4>
                    ${item.description ? `<p class="text-sm text-navy-800 opacity-80 mt-3 leading-relaxed whitespace-pre-wrap">${item.description}</p>` : ''}
                    ${item.tools ? `<p class="text-xs text-navy-500 mt-4 font-medium uppercase tracking-wider"><strong>Tools:</strong> ${item.tools}</p>` : ''}
                </div>
            `;
        }

        grid.appendChild(div);
    });
}

function initializeLightbox() {
    const grid = document.getElementById('portfolio-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    // Event delegation for dynamically loaded images
    grid.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (trigger) {
            const imgSrc = trigger.getAttribute('data-img');
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        }
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // clear src after transition to avoid flicker on next open
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('#lightbox-content') && e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const statusDiv = document.getElementById('form-status');

    try {
        const res = await fetch("https://formspree.io/f/maqzevaq", {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json",
            },
        });

        if (res.ok) {
            statusDiv.className = 'text-sm py-3 text-accent-500 font-medium';
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
        statusDiv.className = 'text-sm py-3 text-red-400 font-medium';
        statusDiv.textContent = 'Something went wrong. Please try again.';
        statusDiv.classList.remove('hidden');
    }
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePortfolio);
