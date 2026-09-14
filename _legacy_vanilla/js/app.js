/**
 * app.js — Main Application Controller (aiCarousels-style)
 * Orchestrates UI, modals, events, sidebar tabs, and PDF export.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. Initialize Fabric Canvas =====
    CarouselCanvas.init('slide-canvas');

    // Default sample carousel (Pakistani market themed)
    const sampleSlides = [
        {
            slide_number: 1,
            type: 'title',
            title: 'You will read this first',
            subtitle: 'Then you will read this.\nAnd you will read this last.',
            badge: 'TURN AN IDEA INTO A SUCCESS'
        },
        {
            slide_number: 2,
            type: 'content',
            title: 'Define Your Idea',
            body: 'A solid foundation starts with a well-defined idea. Spend time to research and make sure it is unique and viable.',
            badge: 'STEP 1'
        },
        {
            slide_number: 3,
            type: 'content',
            title: 'Create a Plan',
            body: 'Set goals, create a budget and research potential funding sources. Make sure that your plan is realistic and achievable.',
            badge: 'STEP 2'
        },
        {
            slide_number: 4,
            type: 'content',
            title: 'Build Your Team',
            body: 'Hire talented people from local universities and tech communities. Pakistan has amazing untapped talent.',
            badge: 'STEP 3'
        },
        {
            slide_number: 5,
            type: 'content',
            title: 'Launch & Iterate',
            body: 'Start with an MVP, get feedback from early users, and iterate quickly. Speed is your competitive advantage.',
            badge: 'STEP 4'
        },
        {
            slide_number: 6,
            type: 'cta',
            title: 'Ready to Begin\nYour Journey?',
            body: 'Turn your idea into reality.\nLaunch your business today!',
            badge: 'YOUR NEXT STEP AWAITS'
        }
    ];

    CarouselCanvas.setSlidesData(sampleSlides);

    // ===== 2. Sidebar Tab Navigation =====
    const iconTabs = document.querySelectorAll('.icon-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    iconTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            iconTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const panel = document.getElementById(targetId);
            if (panel) panel.classList.add('active');
        });
    });

    // ===== 3. Collapsible Panel Sections =====
    document.querySelectorAll('.panel-section-header[data-toggle]').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-toggle');
            const body = document.getElementById(targetId);
            const chevron = header.querySelector('.chevron');
            if (body) body.classList.toggle('collapsed');
            if (chevron) chevron.classList.toggle('collapsed');
        });
    });

    // ===== 4. Platform Format =====
    const platformSelect = document.getElementById('platform-format');
    platformSelect.addEventListener('change', (e) => {
        CarouselCanvas.setPlatform(e.target.value);
    });

    // ===== 5. Color Palette Swatches =====
    document.querySelectorAll('#color-body .color-swatch[data-color]').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.querySelectorAll('#color-body .color-swatch[data-color]').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const color = swatch.getAttribute('data-color');
            CarouselCanvas.customBgColor = color;
            document.getElementById('color-bg').value = color;
            CarouselCanvas.renderCurrentSlide();
        });
    });

    // Custom color inputs
    document.getElementById('color-bg').addEventListener('input', (e) => {
        CarouselCanvas.customBgColor = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    document.getElementById('color-text').addEventListener('input', (e) => {
        CarouselCanvas.customTextColor = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    document.getElementById('color-accent').addEventListener('input', (e) => {
        CarouselCanvas.customAccentColor = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    // ===== 6. Background Gradient Swatches =====
    document.querySelectorAll('[data-bg-gradient]').forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Apply a CSS gradient as the background via canvas gradient
            const gradientStr = swatch.getAttribute('data-bg-gradient');
            // Parse colors from the gradient string
            const colors = gradientStr.match(/#[0-9A-Fa-f]{6}/g);
            if (colors && colors.length >= 2) {
                const w = CarouselCanvas.canvas.getWidth();
                const h = CarouselCanvas.canvas.getHeight();
                const grad = new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: w, y2: h },
                    colorStops: [
                        { offset: 0, color: colors[0] },
                        { offset: 1, color: colors[1] }
                    ]
                });
                CarouselCanvas.canvas.setBackgroundColor(grad, CarouselCanvas.canvas.renderAll.bind(CarouselCanvas.canvas));
                CarouselCanvas.customBgColor = null; // Let gradient take over
                // Re-set template to use gradient colors
                CarouselCanvas.customTextColor = '#FFFFFF';
                CarouselCanvas.renderCurrentSlide();
            }
        });
    });

    // ===== 7. Font Selections =====
    document.getElementById('font-heading').addEventListener('change', (e) => {
        CarouselCanvas.headingFontOverride = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    document.getElementById('font-body').addEventListener('change', (e) => {
        CarouselCanvas.bodyFontOverride = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    // ===== 8. Toggle Switches =====
    document.getElementById('toggle-decorations').addEventListener('change', (e) => {
        CarouselCanvas.showDecorations = e.target.checked;
        CarouselCanvas.renderCurrentSlide();
    });

    document.getElementById('toggle-counter').addEventListener('change', (e) => {
        CarouselCanvas.showCounter = e.target.checked;
        CarouselCanvas.renderCurrentSlide();
    });

    document.getElementById('toggle-branding').addEventListener('change', (e) => {
        CarouselCanvas.showBranding = e.target.checked;
        CarouselCanvas.renderCurrentSlide();
    });

    // ===== 9. Creator Info =====
    document.getElementById('creator-name').addEventListener('input', (e) => {
        CarouselCanvas.creatorName = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    document.getElementById('creator-handle').addEventListener('input', (e) => {
        CarouselCanvas.creatorHandle = e.target.value;
        CarouselCanvas.renderCurrentSlide();
    });

    // ===== 10. Text Edit Panel (Tab: Text & Content) =====
    document.getElementById('edit-slide-title').addEventListener('input', (e) => {
        const slide = CarouselCanvas.slidesData[CarouselCanvas.currentSlideIndex];
        if (slide) {
            slide.title = e.target.value;
            CarouselCanvas.renderCurrentSlide();
        }
    });

    document.getElementById('edit-slide-body').addEventListener('input', (e) => {
        const slide = CarouselCanvas.slidesData[CarouselCanvas.currentSlideIndex];
        if (slide) {
            if (slide.type === 'title') slide.subtitle = e.target.value;
            else slide.body = e.target.value;
            CarouselCanvas.renderCurrentSlide();
        }
    });

    document.getElementById('edit-slide-badge').addEventListener('input', (e) => {
        const slide = CarouselCanvas.slidesData[CarouselCanvas.currentSlideIndex];
        if (slide) {
            slide.badge = e.target.value;
            CarouselCanvas.renderCurrentSlide();
        }
    });

    // ===== 11. Slide Navigation Arrows =====
    document.getElementById('nav-prev').addEventListener('click', () => CarouselCanvas.prevSlide());
    document.getElementById('nav-next').addEventListener('click', () => CarouselCanvas.nextSlide());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowLeft') CarouselCanvas.prevSlide();
        if (e.key === 'ArrowRight') CarouselCanvas.nextSlide();
    });

    // ===== 12. API Key Modal =====
    const apiModal = document.getElementById('api-modal');
    const apiKeyInput = document.getElementById('claude-api-key');

    document.getElementById('btn-api-settings').addEventListener('click', () => {
        apiKeyInput.value = ClaudeAPI.getApiKey();
        apiModal.classList.add('active');
    });

    document.getElementById('api-modal-close').addEventListener('click', () => apiModal.classList.remove('active'));
    document.getElementById('api-modal-cancel').addEventListener('click', () => apiModal.classList.remove('active'));

    document.getElementById('api-modal-save').addEventListener('click', () => {
        ClaudeAPI.setApiKey(apiKeyInput.value.trim());
        apiModal.classList.remove('active');
    });

    // Also sync from settings tab
    const settingsApiKey = document.getElementById('settings-api-key');
    if (settingsApiKey) {
        settingsApiKey.value = ClaudeAPI.getApiKey();
        settingsApiKey.addEventListener('change', (e) => {
            ClaudeAPI.setApiKey(e.target.value.trim());
        });
    }

    // ===== 13. AI Generate Modal =====
    const aiModal = document.getElementById('ai-modal');

    document.getElementById('btn-generate').addEventListener('click', () => {
        aiModal.classList.add('active');
    });

    document.getElementById('ai-modal-close').addEventListener('click', () => aiModal.classList.remove('active'));
    document.getElementById('ai-modal-skip').addEventListener('click', () => aiModal.classList.remove('active'));

    document.getElementById('ai-modal-generate').addEventListener('click', async () => {
        const topic = document.getElementById('ai-topic').value.trim();
        const tone = document.getElementById('ai-tone').value;

        if (!topic) {
            alert('Please enter a carousel topic!');
            return;
        }

        if (!ClaudeAPI.getApiKey()) {
            aiModal.classList.remove('active');
            apiKeyInput.value = '';
            apiModal.classList.add('active');
            return;
        }

        aiModal.classList.remove('active');

        // Show loading
        const loadingOverlay = document.getElementById('loading-overlay');
        const loaderText = document.getElementById('loader-text');
        loaderText.textContent = 'Generating carousel content with AI...';
        loadingOverlay.classList.add('active');

        try {
            const slides = await ClaudeAPI.generateCarouselContent(topic, tone);
            CarouselCanvas.setSlidesData(slides);
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            loadingOverlay.classList.remove('active');
        }
    });

    // ===== 14. Template Modal =====
    const templateModal = document.getElementById('template-modal');

    const openTemplateModal = () => {
        _renderTemplateGrid();
        templateModal.classList.add('active');
    };

    document.getElementById('btn-open-template-modal').addEventListener('click', openTemplateModal);
    const btn2 = document.getElementById('btn-open-template-modal-2');
    if (btn2) btn2.addEventListener('click', openTemplateModal);

    document.getElementById('template-modal-close').addEventListener('click', () => templateModal.classList.remove('active'));

    // Category filter buttons
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            _renderTemplateGrid(btn.getAttribute('data-cat'));
        });
    });

    function _renderTemplateGrid(filterCategory = 'all') {
        const grid = document.getElementById('template-grid');
        grid.innerHTML = '';

        const templates = CarouselCanvas.getTemplateList();
        const filtered = filterCategory === 'all'
            ? templates
            : templates.filter(t => t.category === filterCategory);

        filtered.forEach(tpl => {
            const card = document.createElement('div');
            card.className = `template-preview-card ${tpl.key === CarouselCanvas.activeTemplate ? 'active' : ''}`;
            card.onclick = () => {
                CarouselCanvas.setTemplate(tpl.key);
                // Update color inputs
                document.getElementById('color-bg').value = tpl.bgColor || '#FFFFFF';
                document.getElementById('color-text').value = tpl.textColor || '#111827';
                document.getElementById('color-accent').value = tpl.accentColor || '#7C3AED';
                templateModal.classList.remove('active');
            };

            const thumb = document.createElement('div');
            thumb.className = 'template-thumb-img';
            if (tpl.bgGradient) {
                thumb.style.background = `linear-gradient(135deg, ${tpl.bgGradient[0]}, ${tpl.bgGradient[1]})`;
            } else {
                thumb.style.background = tpl.bgColor || '#FFFFFF';
            }

            // Mini preview content
            const miniTitle = document.createElement('div');
            miniTitle.style.cssText = `font-family:${tpl.headingFont};font-weight:bold;font-size:14px;color:${tpl.textColor};line-height:1.2;`;
            miniTitle.textContent = 'Unlock Your Potential';

            const miniBody = document.createElement('div');
            miniBody.style.cssText = `font-family:${tpl.bodyFont};font-size:10px;color:${tpl.textColor};opacity:0.7;line-height:1.4;`;
            miniBody.textContent = 'Preview of this template style';

            thumb.appendChild(miniTitle);
            thumb.appendChild(miniBody);

            const name = document.createElement('div');
            name.className = 'template-preview-name';
            name.textContent = tpl.name;

            card.appendChild(thumb);
            card.appendChild(name);
            grid.appendChild(card);
        });
    }

    // ===== 15. Download / Export =====
    document.getElementById('btn-download').addEventListener('click', async () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loaderText = document.getElementById('loader-text');
        loaderText.textContent = 'Exporting carousel to PDF...';
        loadingOverlay.classList.add('active');

        const originalIndex = CarouselCanvas.currentSlideIndex;
        const w = CarouselCanvas.canvas.getWidth();
        const h = CarouselCanvas.canvas.getHeight();

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: w > h ? 'landscape' : 'portrait',
                unit: 'px',
                format: [w, h]
            });

            for (let i = 0; i < CarouselCanvas.slidesData.length; i++) {
                CarouselCanvas.goToSlide(i);
                await new Promise(r => setTimeout(r, 200));

                const imgData = CarouselCanvas.canvas.toDataURL({ format: 'png', quality: 1.0 });
                if (i > 0) pdf.addPage([w, h]);
                pdf.addImage(imgData, 'PNG', 0, 0, w, h);
            }

            pdf.save('pak-carousel.pdf');
        } catch (err) {
            alert('Export Error: ' + err.message);
        } finally {
            CarouselCanvas.goToSlide(originalIndex);
            loadingOverlay.classList.remove('active');
        }
    });

    // ===== 16. Save Draft (localStorage) =====
    document.getElementById('btn-save-draft').addEventListener('click', () => {
        const data = {
            slides: CarouselCanvas.slidesData,
            template: CarouselCanvas.activeTemplate,
            platform: CarouselCanvas.platform,
            creatorName: CarouselCanvas.creatorName,
            creatorHandle: CarouselCanvas.creatorHandle
        };
        localStorage.setItem('pak_carousel_draft', JSON.stringify(data));
        alert('Draft saved successfully!');
    });

    // Load draft on startup if available
    const savedDraft = localStorage.getItem('pak_carousel_draft');
    if (savedDraft) {
        try {
            const data = JSON.parse(savedDraft);
            if (data.template) CarouselCanvas.activeTemplate = data.template;
            if (data.platform) {
                CarouselCanvas.platform = data.platform;
                platformSelect.value = data.platform;
            }
            if (data.creatorName) {
                CarouselCanvas.creatorName = data.creatorName;
                document.getElementById('creator-name').value = data.creatorName;
            }
            if (data.creatorHandle) {
                CarouselCanvas.creatorHandle = data.creatorHandle;
                document.getElementById('creator-handle').value = data.creatorHandle;
            }
            if (data.slides && data.slides.length > 0) {
                CarouselCanvas.setSlidesData(data.slides);
            }
        } catch (e) {
            console.warn('Failed to load draft:', e);
        }
    }

});
