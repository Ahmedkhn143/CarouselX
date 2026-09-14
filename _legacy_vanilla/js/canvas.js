/**
 * canvas.js — Fabric.js Slide Canvas Editor (aiCarousels-style)
 * Manages templates, slide rendering, decorations, and live text editing.
 */

const TEMPLATES = {
    modern: {
        name: 'Modern',
        category: 'modern',
        bgColor: '#FBBF24',
        textColor: '#1E1B4B',
        accentColor: '#7C3AED',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'circles'
    },
    minimal: {
        name: 'Minimal',
        category: 'minimal',
        bgColor: '#FFFFFF',
        textColor: '#111827',
        accentColor: '#6366F1',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        decorations: false,
        decorStyle: 'border'
    },
    bold: {
        name: 'Bold',
        category: 'bold',
        bgColor: '#1E1B4B',
        textColor: '#FFFFFF',
        accentColor: '#FBBF24',
        headingFont: 'Bebas Neue',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'bars'
    },
    gradient_sunset: {
        name: 'Sunset Gradient',
        category: 'gradient',
        bgGradient: ['#FF7E5F', '#FEB47B'],
        textColor: '#FFFFFF',
        accentColor: '#FFFFFF',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'bubbles'
    },
    gradient_ocean: {
        name: 'Ocean Gradient',
        category: 'gradient',
        bgGradient: ['#667eea', '#764ba2'],
        textColor: '#FFFFFF',
        accentColor: '#E0E7FF',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'bubbles'
    },
    pk_green: {
        name: 'Pakistan Green',
        category: 'modern',
        bgColor: '#006747',
        textColor: '#FFFFFF',
        accentColor: '#FBBF24',
        headingFont: 'Bebas Neue',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'circles'
    },
    rose: {
        name: 'Rose Gold',
        category: 'modern',
        bgColor: '#FDF2F8',
        textColor: '#831843',
        accentColor: '#EC4899',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'circles'
    },
    dark_premium: {
        name: 'Dark Premium',
        category: 'modern',
        bgColor: '#0F172A',
        textColor: '#F1F5F9',
        accentColor: '#38BDF8',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        decorations: true,
        decorStyle: 'bubbles'
    }
};

const DIMENSIONS = {
    linkedin: { width: 1080, height: 1350 },
    instagram: { width: 1080, height: 1080 },
    twitter: { width: 1600, height: 900 }
};

const CarouselCanvas = {
    canvas: null,
    currentSlideIndex: 0,
    slidesData: [],
    platform: 'linkedin',
    activeTemplate: 'modern',
    showDecorations: true,
    showCounter: true,
    showBranding: true,
    creatorName: 'Hamza',
    creatorHandle: 'Freelancer & Creator',
    customBgColor: null,
    customTextColor: null,
    customAccentColor: null,
    headingFontOverride: null,
    bodyFontOverride: null,

    init(canvasId) {
        const dim = DIMENSIONS[this.platform];
        this.canvas = new fabric.Canvas(canvasId, {
            width: dim.width,
            height: dim.height,
            backgroundColor: '#FFFFFF',
            preserveObjectStacking: true,
            selection: true
        });

        // Scale the element to fit viewport
        this._scaleCanvasElement();

        this.canvas.on('text:changed', () => this._syncTextToData());
        this.canvas.on('object:modified', () => this._syncTextToData());

        window.addEventListener('resize', () => this._scaleCanvasElement());
    },

    _scaleCanvasElement() {
        const wrapperEl = document.querySelector('.canvas-frame');
        if (!wrapperEl) return;

        const dim = DIMENSIONS[this.platform];
        const viewport = document.querySelector('.canvas-viewport');
        if (!viewport) return;

        const maxW = viewport.clientWidth - 120;
        const maxH = viewport.clientHeight - 40;
        const scale = Math.min(maxW / dim.width, maxH / dim.height, 1);

        wrapperEl.style.width = (dim.width * scale) + 'px';
        wrapperEl.style.height = (dim.height * scale) + 'px';

        const canvasEl = this.canvas.getElement();
        canvasEl.style.width = '100%';
        canvasEl.style.height = '100%';

        this.canvas.calcOffset();
    },

    setPlatform(platform) {
        this.platform = platform;
        const dim = DIMENSIONS[platform];
        this.canvas.setWidth(dim.width);
        this.canvas.setHeight(dim.height);
        this._scaleCanvasElement();
        this.renderCurrentSlide();
    },

    setTemplate(templateKey) {
        this.activeTemplate = templateKey;
        this.customBgColor = null;
        this.customTextColor = null;
        this.customAccentColor = null;
        this.renderCurrentSlide();
    },

    setSlidesData(slides) {
        this.slidesData = slides;
        this.currentSlideIndex = 0;
        this.renderCurrentSlide();
        this._updateThumbnails();
    },

    goToSlide(index) {
        if (index < 0 || index >= this.slidesData.length) return;
        this.currentSlideIndex = index;
        this.renderCurrentSlide();
        this._updateThumbnails();
        this._updateSlideLabel();
    },

    prevSlide() {
        this.goToSlide(this.currentSlideIndex - 1);
    },

    nextSlide() {
        this.goToSlide(this.currentSlideIndex + 1);
    },

    _getTemplate() {
        return TEMPLATES[this.activeTemplate] || TEMPLATES.modern;
    },

    _getBgColor() {
        return this.customBgColor || this._getTemplate().bgColor || '#FFFFFF';
    },

    _getTextColor() {
        return this.customTextColor || this._getTemplate().textColor || '#111827';
    },

    _getAccentColor() {
        return this.customAccentColor || this._getTemplate().accentColor || '#7C3AED';
    },

    _getHeadingFont() {
        return this.headingFontOverride || this._getTemplate().headingFont || 'Inter';
    },

    _getBodyFont() {
        return this.bodyFontOverride || this._getTemplate().bodyFont || 'Inter';
    },

    renderCurrentSlide() {
        const slide = this.slidesData[this.currentSlideIndex];
        if (!slide) return;

        this.canvas.clear();
        const w = this.canvas.getWidth();
        const h = this.canvas.getHeight();
        const tpl = this._getTemplate();

        // 1. Background
        this._drawBackground(w, h, tpl);

        // 2. Decorations
        if (this.showDecorations && (tpl.decorations !== false)) {
            this._drawDecorations(w, h, tpl);
        }

        // 3. Badge / Step Label
        if (slide.badge) {
            this._drawBadge(slide.badge, w, h);
        }

        // 4. Main Text Content
        this._drawContent(slide, w, h);

        // 5. Swipe CTA (title slide only)
        if (slide.type === 'title') {
            this._drawSwipeCTA(w, h);
        }

        // 6. Counter
        if (this.showCounter) {
            this._drawCounter(w, h);
        }

        // 7. Creator Branding
        if (this.showBranding) {
            this._drawCreatorBranding(w, h);
        }

        this.canvas.renderAll();
        this._updateSlideEditFields(slide);
    },

    _drawBackground(w, h, tpl) {
        if (tpl.bgGradient && !this.customBgColor) {
            const grad = new fabric.Gradient({
                type: 'linear',
                coords: { x1: 0, y1: 0, x2: w, y2: h },
                colorStops: [
                    { offset: 0, color: tpl.bgGradient[0] },
                    { offset: 1, color: tpl.bgGradient[1] }
                ]
            });
            this.canvas.setBackgroundColor(grad, this.canvas.renderAll.bind(this.canvas));
        } else {
            this.canvas.setBackgroundColor(this._getBgColor(), this.canvas.renderAll.bind(this.canvas));
        }
    },

    _drawDecorations(w, h, tpl) {
        const style = tpl.decorStyle || 'circles';
        const accent = this._getAccentColor();
        const isDark = this._isColorDark(this._getBgColor());
        const decoColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        const decoColor2 = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

        if (style === 'circles') {
            this.canvas.add(new fabric.Circle({
                radius: w * 0.2,
                fill: decoColor,
                left: w * 0.65,
                top: -h * 0.08,
                selectable: false, evented: false
            }));
            this.canvas.add(new fabric.Circle({
                radius: w * 0.15,
                fill: decoColor2,
                left: -w * 0.05,
                top: h * 0.7,
                selectable: false, evented: false
            }));
        } else if (style === 'bars') {
            this.canvas.add(new fabric.Rect({
                left: 0, top: 0, width: w, height: 14,
                fill: accent, selectable: false, evented: false
            }));
            this.canvas.add(new fabric.Rect({
                left: 0, top: h - 14, width: w, height: 14,
                fill: accent, selectable: false, evented: false
            }));
        } else if (style === 'bubbles') {
            this.canvas.add(new fabric.Circle({
                radius: w * 0.28,
                fill: 'rgba(255,255,255,0.07)',
                left: w * 0.6,
                top: -h * 0.15,
                selectable: false, evented: false
            }));
            this.canvas.add(new fabric.Circle({
                radius: w * 0.2,
                fill: 'rgba(255,255,255,0.05)',
                left: -w * 0.1,
                top: h * 0.65,
                selectable: false, evented: false
            }));
        } else if (style === 'border') {
            this.canvas.add(new fabric.Rect({
                left: 36, top: 36, width: w - 72, height: h - 72,
                fill: 'transparent', stroke: this._getTextColor(),
                strokeWidth: 1.5, opacity: 0.12,
                selectable: false, evented: false
            }));
        }
    },

    _drawBadge(text, w, h) {
        const isDark = this._isColorDark(this._getBgColor());
        const bgCol = isDark ? 'rgba(255,255,255,0.15)' : this._getAccentColor() + '20';
        const txtCol = isDark ? '#FFFFFF' : this._getAccentColor();

        const badge = new fabric.IText(text.toUpperCase(), {
            fontSize: 22,
            fontFamily: this._getBodyFont(),
            fontWeight: '700',
            fill: txtCol,
            left: 80,
            top: 80,
            name: 'badge',
            charSpacing: 80,
            selectable: true,
            hasControls: false
        });

        const badgeBg = new fabric.Rect({
            left: 68,
            top: 72,
            width: badge.width + 24,
            height: badge.height + 16,
            fill: bgCol,
            rx: 8,
            ry: 8,
            selectable: false, evented: false
        });

        this.canvas.add(badgeBg, badge);
    },

    _drawContent(slide, w, h) {
        const textColor = this._getTextColor();
        const headingFont = this._getHeadingFont();
        const bodyFont = this._getBodyFont();
        const isTitleSlide = slide.type === 'title';
        const isCTA = slide.type === 'cta';

        // Check for Urdu script
        const hasUrdu = /[\u0600-\u06FF]/.test(slide.title + (slide.body || '') + (slide.subtitle || ''));
        const actualHeadingFont = hasUrdu ? 'Noto Nastaliq Urdu' : headingFont;

        // Title
        const titleFontSize = isTitleSlide ? 72 : (isCTA ? 64 : 56);
        const title = new fabric.IText(slide.title || 'Slide Title', {
            left: 80,
            top: isTitleSlide ? h * 0.22 : h * 0.2,
            fontSize: titleFontSize,
            fontFamily: actualHeadingFont,
            fontWeight: headingFont === 'Bebas Neue' ? 'normal' : 'bold',
            fill: textColor,
            name: 'title',
            lineHeight: 1.2,
            width: w - 160,
            splitByGrapheme: true,
            selectable: true
        });
        this.canvas.add(title);

        // Body / Subtitle
        const bodyContent = isTitleSlide ? (slide.subtitle || '') : (slide.body || '');
        if (bodyContent) {
            const bodyTop = title.top + title.height * title.scaleY + 28;
            const body = new fabric.IText(bodyContent, {
                left: 80,
                top: bodyTop,
                fontSize: isTitleSlide ? 28 : 26,
                fontFamily: bodyFont,
                fontWeight: 'normal',
                fill: textColor,
                name: isTitleSlide ? 'subtitle' : 'body',
                lineHeight: 1.6,
                opacity: 0.85,
                width: w - 160,
                splitByGrapheme: true,
                selectable: true
            });
            this.canvas.add(body);
        }
    },

    _drawSwipeCTA(w, h) {
        const accent = this._getAccentColor();
        const isDark = this._isColorDark(this._getBgColor());

        // Swipe button pill
        const pillBg = new fabric.Rect({
            left: w - 220,
            top: h - 140,
            width: 140,
            height: 44,
            fill: accent,
            rx: 22,
            ry: 22,
            selectable: false, evented: false
        });

        const swipeText = new fabric.Text('Swipe ➤', {
            left: w - 200,
            top: h - 130,
            fontSize: 18,
            fontFamily: this._getBodyFont(),
            fontWeight: '700',
            fill: isDark ? '#000000' : '#FFFFFF',
            selectable: false, evented: false
        });

        this.canvas.add(pillBg, swipeText);
    },

    _drawCounter(w, h) {
        const textColor = this._getTextColor();
        const accent = this._getAccentColor();
        const num = this.currentSlideIndex + 1;
        const total = this.slidesData.length;

        // Numbered circle badge (top-right for content slides)
        if (this.slidesData[this.currentSlideIndex]?.type === 'content') {
            const circle = new fabric.Circle({
                radius: 24,
                fill: accent,
                left: w - 120,
                top: 76,
                selectable: false, evented: false
            });
            const numText = new fabric.Text(String(num - 1), { // Content slide number (1-indexed from content)
                left: w - 108,
                top: 84,
                fontSize: 22,
                fontFamily: this._getBodyFont(),
                fontWeight: '800',
                fill: this._isColorDark(accent) ? '#FFFFFF' : '#000000',
                selectable: false, evented: false
            });
            this.canvas.add(circle, numText);
        }
    },

    _drawCreatorBranding(w, h) {
        const textColor = this._getTextColor();

        // Name text
        const nameText = new fabric.Text(this.creatorName || 'Creator', {
            left: 80,
            top: h - 120,
            fontSize: 22,
            fontFamily: this._getBodyFont(),
            fontWeight: '700',
            fill: textColor,
            selectable: false, evented: false
        });

        const handleText = new fabric.Text(this.creatorHandle || '@handle', {
            left: 80,
            top: h - 92,
            fontSize: 16,
            fontFamily: this._getBodyFont(),
            fontWeight: '400',
            fill: textColor,
            opacity: 0.6,
            selectable: false, evented: false
        });

        this.canvas.add(nameText, handleText);
    },

    _isColorDark(hex) {
        if (!hex || hex.startsWith('rgba') || hex.startsWith('linear')) return true;
        const c = hex.replace('#', '');
        if (c.length !== 6) return true;
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 140;
    },

    _syncTextToData() {
        const slide = this.slidesData[this.currentSlideIndex];
        if (!slide) return;

        this.canvas.getObjects().forEach(obj => {
            if (obj.name === 'title') slide.title = obj.text;
            else if (obj.name === 'body') slide.body = obj.text;
            else if (obj.name === 'subtitle') slide.subtitle = obj.text;
            else if (obj.name === 'badge') slide.badge = obj.text;
        });

        this._updateThumbnails();
        this._updateSlideEditFields(slide);
    },

    _updateSlideEditFields(slide) {
        const titleInput = document.getElementById('edit-slide-title');
        const bodyInput = document.getElementById('edit-slide-body');
        const badgeInput = document.getElementById('edit-slide-badge');
        if (titleInput) titleInput.value = slide.title || '';
        if (bodyInput) bodyInput.value = slide.body || slide.subtitle || '';
        if (badgeInput) badgeInput.value = slide.badge || '';
    },

    _updateSlideLabel() {
        const label = document.getElementById('slide-counter-label');
        if (label) {
            label.textContent = `Slide #${this.currentSlideIndex + 1}`;
        }
    },

    _updateThumbnails() {
        const track = document.getElementById('slides-track');
        if (!track) return;

        track.innerHTML = '';
        this.slidesData.forEach((slide, i) => {
            const thumb = document.createElement('div');
            thumb.className = `slide-thumb ${i === this.currentSlideIndex ? 'active' : ''}`;
            thumb.onclick = () => this.goToSlide(i);

            const preview = document.createElement('div');
            preview.className = 'slide-thumb-preview';

            const num = document.createElement('div');
            num.className = 'slide-thumb-num';
            num.textContent = i + 1;

            preview.appendChild(num);
            thumb.appendChild(preview);

            const label = document.createElement('div');
            label.className = 'slide-thumb-label';
            label.textContent = slide.type === 'title' ? 'INTRO' : (slide.type === 'cta' ? 'OUTRO' : `Slide ${i}`);
            thumb.appendChild(label);

            track.appendChild(thumb);
        });

        // Add slide button
        const addBtn = document.createElement('button');
        addBtn.className = 'slide-add-btn';
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        addBtn.onclick = () => {
            this.slidesData.push({
                slide_number: this.slidesData.length + 1,
                type: 'content',
                title: 'New Slide',
                body: 'Add your content here...',
                badge: `TIP ${this.slidesData.length}`
            });
            this.goToSlide(this.slidesData.length - 1);
        };
        track.appendChild(addBtn);
    },

    // Get template list for modal
    getTemplateList() {
        return Object.entries(TEMPLATES).map(([key, tpl]) => ({
            key,
            ...tpl
        }));
    }
};
