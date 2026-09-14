import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { useCarousel } from '../../context/CarouselContext';
import { TEMPLATES, DIMENSIONS } from '../../constants/templates';
import type { Slide } from '../../types/carousel';

export interface SlideCanvasHandle {
    renderSlideToDataUrl: (slideIndex: number) => Promise<string>;
    getCurrentSlideDataUrl: () => string;
}

export const SlideCanvas = forwardRef<SlideCanvasHandle>((_, ref) => {
    const canvasElRef = useRef<HTMLCanvasElement | null>(null);
    const frameRef = useRef<HTMLDivElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    const {
        slides,
        currentSlideIndex,
        platform,
        activeTemplate,
        customBgColor,
        customTextColor,
        customAccentColor,
        customBgGradient,
        headingFont,
        bodyFont,
        showDecorations,
        showCounter,
        showBranding,
        creatorName,
        creatorHandle,
        updateCurrentSlide,
        prevSlide,
        nextSlide
    } = useCarousel();

    const isInternalUpdateRef = useRef(false);

    // Helpers to resolve current colors and fonts
    const getTemplate = useCallback(() => {
        return TEMPLATES[activeTemplate] || TEMPLATES.modern;
    }, [activeTemplate]);

    const getBgColor = useCallback(() => {
        return customBgColor || getTemplate().bgColor || '#FFFFFF';
    }, [customBgColor, getTemplate]);

    const getTextColor = useCallback(() => {
        return customTextColor || getTemplate().textColor || '#111827';
    }, [customTextColor, getTemplate]);

    const getAccentColor = useCallback(() => {
        return customAccentColor || getTemplate().accentColor || '#7C3AED';
    }, [customAccentColor, getTemplate]);

    const getHeadingFont = useCallback(() => {
        return headingFont || getTemplate().headingFont || 'Inter';
    }, [headingFont, getTemplate]);

    const getBodyFont = useCallback(() => {
        return bodyFont || getTemplate().bodyFont || 'Inter';
    }, [bodyFont, getTemplate]);

    const isColorDark = useCallback((hex: string) => {
        if (!hex || hex.startsWith('rgba') || hex.startsWith('linear')) return true;
        const c = hex.replace('#', '');
        if (c.length !== 6) return true;
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 140;
    }, []);

    // Resize and scale canvas to fit viewport
    const scaleCanvasElement = useCallback(() => {
        const frameEl = frameRef.current;
        const canvas = fabricCanvasRef.current;
        if (!frameEl || !canvas) return;

        const dim = DIMENSIONS[platform];
        const viewport = frameEl.parentElement;
        if (!viewport) return;

        const maxW = Math.max(viewport.clientWidth - 120, 200);
        const maxH = Math.max(viewport.clientHeight - 60, 200);
        const scale = Math.min(maxW / dim.width, maxH / dim.height, 1);

        frameEl.style.width = `${Math.round(dim.width * scale)}px`;
        frameEl.style.height = `${Math.round(dim.height * scale)}px`;

        const upperCanvas = (canvas as any).upperCanvasEl;
        const lowerCanvas = (canvas as any).lowerCanvasEl;
        if (upperCanvas) {
            upperCanvas.style.width = '100%';
            upperCanvas.style.height = '100%';
        }
        if (lowerCanvas) {
            lowerCanvas.style.width = '100%';
            lowerCanvas.style.height = '100%';
        }
        canvas.calcOffset();
    }, [platform]);

    // Draw full slide onto a given canvas
    const drawSlide = useCallback((canvas: fabric.Canvas, slide: Slide, slideIdx: number) => {
        if (!slide) return;

        canvas.clear();
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const tpl = getTemplate();
        const bgCol = getBgColor();
        const txtCol = getTextColor();
        const accCol = getAccentColor();
        const hFont = getHeadingFont();
        const bFont = getBodyFont();

        // 1. Background (Gradient or solid)
        const activeGrad = customBgGradient || tpl.bgGradient;
        if (activeGrad && !customBgColor) {
            const grad = new fabric.Gradient({
                type: 'linear',
                coords: { x1: 0, y1: 0, x2: w, y2: h },
                colorStops: [
                    { offset: 0, color: activeGrad[0] },
                    { offset: 1, color: activeGrad[1] }
                ]
            });
            canvas.setBackgroundColor(grad, () => canvas.renderAll());
        } else {
            canvas.setBackgroundColor(bgCol, () => canvas.renderAll());
        }

        // 2. Decorations
        if (showDecorations && tpl.decorations !== false) {
            const style = tpl.decorStyle || 'circles';
            const isDark = isColorDark(bgCol);
            const decoColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
            const decoColor2 = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

            if (style === 'circles') {
                canvas.add(new fabric.Circle({
                    radius: w * 0.2,
                    fill: decoColor,
                    left: w * 0.65,
                    top: -h * 0.08,
                    selectable: false, evented: false
                }));
                canvas.add(new fabric.Circle({
                    radius: w * 0.15,
                    fill: decoColor2,
                    left: -w * 0.05,
                    top: h * 0.7,
                    selectable: false, evented: false
                }));
            } else if (style === 'bars') {
                canvas.add(new fabric.Rect({
                    left: 0, top: 0, width: w, height: 16,
                    fill: accCol, selectable: false, evented: false
                }));
                canvas.add(new fabric.Rect({
                    left: 0, top: h - 16, width: w, height: 16,
                    fill: accCol, selectable: false, evented: false
                }));
            } else if (style === 'bubbles') {
                canvas.add(new fabric.Circle({
                    radius: w * 0.28,
                    fill: 'rgba(255,255,255,0.07)',
                    left: w * 0.6,
                    top: -h * 0.15,
                    selectable: false, evented: false
                }));
                canvas.add(new fabric.Circle({
                    radius: w * 0.2,
                    fill: 'rgba(255,255,255,0.05)',
                    left: -w * 0.1,
                    top: h * 0.65,
                    selectable: false, evented: false
                }));
            } else if (style === 'border') {
                canvas.add(new fabric.Rect({
                    left: 36, top: 36, width: w - 72, height: h - 72,
                    fill: 'transparent', stroke: txtCol,
                    strokeWidth: 1.5, opacity: 0.12,
                    selectable: false, evented: false
                }));
            }
        }

        // 3. Badge / Step Label
        if (slide.badge) {
            const isDark = isColorDark(bgCol);
            const badgeBgCol = isDark ? 'rgba(255,255,255,0.18)' : accCol + '22';
            const badgeTxtCol = isDark ? '#FFFFFF' : accCol;

            const badgeText = new fabric.IText(slide.badge.toUpperCase(), {
                fontSize: 22,
                fontFamily: bFont,
                fontWeight: '700',
                fill: badgeTxtCol,
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
                width: (badgeText.width || 120) + 24,
                height: (badgeText.height || 26) + 16,
                fill: badgeBgCol,
                rx: 8,
                ry: 8,
                selectable: false, evented: false
            });

            canvas.add(badgeBg, badgeText);
        }

        // 4. Main Text Content
        const isTitleSlide = slide.type === 'title';
        const isCTA = slide.type === 'cta';
        const hasUrdu = /[\u0600-\u06FF]/.test((slide.title || '') + (slide.body || '') + (slide.subtitle || ''));
        const actualHeadingFont = hasUrdu ? 'Noto Nastaliq Urdu' : hFont;

        const titleFontSize = isTitleSlide ? 72 : (isCTA ? 64 : 56);
        const title = new fabric.Textbox(slide.title || 'Slide Title', {
            left: 80,
            top: isTitleSlide ? h * 0.22 : h * 0.2,
            fontSize: titleFontSize,
            fontFamily: actualHeadingFont,
            fontWeight: hFont === 'Bebas Neue' ? 'normal' : 'bold',
            fill: txtCol,
            name: 'title',
            lineHeight: 1.2,
            width: w - 160,
            splitByGrapheme: true,
            selectable: true
        });
        canvas.add(title);

        const bodyContent = isTitleSlide ? (slide.subtitle || '') : (slide.body || '');
        if (bodyContent) {
            const titleH = (title.height || 60) * (title.scaleY || 1);
            const bodyTop = (title.top || 100) + titleH + 28;
            const body = new fabric.Textbox(bodyContent, {
                left: 80,
                top: bodyTop,
                fontSize: isTitleSlide ? 28 : 26,
                fontFamily: bFont,
                fontWeight: 'normal',
                fill: txtCol,
                name: isTitleSlide ? 'subtitle' : 'body',
                lineHeight: 1.6,
                opacity: 0.85,
                width: w - 160,
                splitByGrapheme: true,
                selectable: true
            });
            canvas.add(body);
        }

        // 5. Swipe CTA (Title slide only)
        if (isTitleSlide) {
            const isDark = isColorDark(bgCol);
            const pillBg = new fabric.Rect({
                left: w - 220,
                top: h - 140,
                width: 140,
                height: 44,
                fill: accCol,
                rx: 22,
                ry: 22,
                selectable: false, evented: false
            });

            const swipeText = new fabric.Text('Swipe ➤', {
                left: w - 200,
                top: h - 130,
                fontSize: 18,
                fontFamily: bFont,
                fontWeight: '700',
                fill: isDark ? '#000000' : '#FFFFFF',
                selectable: false, evented: false
            });

            canvas.add(pillBg, swipeText);
        }

        // 6. Counter (Content slides)
        if (showCounter && slide.type === 'content') {
            const circle = new fabric.Circle({
                radius: 24,
                fill: accCol,
                left: w - 120,
                top: 76,
                selectable: false, evented: false
            });
            const numText = new fabric.Text(String(slideIdx), {
                left: w - 108,
                top: 84,
                fontSize: 22,
                fontFamily: bFont,
                fontWeight: '800',
                fill: isColorDark(accCol) ? '#FFFFFF' : '#000000',
                selectable: false, evented: false
            });
            canvas.add(circle, numText);
        }

        // 7. Creator Branding
        if (showBranding) {
            const nameText = new fabric.Text(creatorName || 'Creator', {
                left: 80,
                top: h - 120,
                fontSize: 22,
                fontFamily: bFont,
                fontWeight: '700',
                fill: txtCol,
                selectable: false, evented: false
            });

            const handleText = new fabric.Text(creatorHandle || '@handle', {
                left: 80,
                top: h - 92,
                fontSize: 16,
                fontFamily: bFont,
                fontWeight: '400',
                fill: txtCol,
                opacity: 0.6,
                selectable: false, evented: false
            });

            canvas.add(nameText, handleText);
        }

        canvas.renderAll();
    }, [getTemplate, getBgColor, getTextColor, getAccentColor, getHeadingFont, getBodyFont, customBgGradient, customBgColor, showDecorations, isColorDark, showCounter, showBranding, creatorName, creatorHandle]);

    // Synchronize canvas text changes back to React state
    const syncCanvasToState = useCallback(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        isInternalUpdateRef.current = true;
        const updates: Partial<Slide> = {};

        canvas.getObjects().forEach((obj: any) => {
            if (obj.name === 'title') updates.title = obj.text;
            else if (obj.name === 'body') updates.body = obj.text;
            else if (obj.name === 'subtitle') updates.subtitle = obj.text;
            else if (obj.name === 'badge') updates.badge = obj.text;
        });

        updateCurrentSlide(updates);
        setTimeout(() => {
            isInternalUpdateRef.current = false;
        }, 50);
    }, [updateCurrentSlide]);

    // Initialize Fabric Canvas once on mount
    useEffect(() => {
        if (!canvasElRef.current) return;

        const dim = DIMENSIONS[platform];
        const canvas = new fabric.Canvas(canvasElRef.current, {
            width: dim.width,
            height: dim.height,
            backgroundColor: '#FFFFFF',
            preserveObjectStacking: true,
            selection: true
        });

        fabricCanvasRef.current = canvas;

        canvas.on('text:changed', syncCanvasToState);
        canvas.on('object:modified', syncCanvasToState);

        scaleCanvasElement();

        const handleResize = () => scaleCanvasElement();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
            fabricCanvasRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Update canvas size when platform changes
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const dim = DIMENSIONS[platform];
        canvas.setWidth(dim.width);
        canvas.setHeight(dim.height);
        scaleCanvasElement();
    }, [platform, scaleCanvasElement]);

    // Re-draw when slide data or visual props change
    useEffect(() => {
        if (isInternalUpdateRef.current) return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const currentSlide = slides[currentSlideIndex];
        if (currentSlide) {
            drawSlide(canvas, currentSlide, currentSlideIndex + 1);
        }
    }, [slides, currentSlideIndex, drawSlide]);

    // Keyboard navigation (ArrowLeft, ArrowRight)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
                return;
            }
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevSlide, nextSlide]);

    // Imperative API for PDF & image export
    useImperativeHandle(ref, () => ({
        getCurrentSlideDataUrl: () => {
            const canvas = fabricCanvasRef.current;
            if (!canvas) return '';
            return canvas.toDataURL({ format: 'png', quality: 1.0 });
        },
        renderSlideToDataUrl: async (index: number) => {
            const canvas = fabricCanvasRef.current;
            if (!canvas) return '';

            const targetSlide = slides[index];
            if (!targetSlide) return '';

            drawSlide(canvas, targetSlide, index + 1);
            await new Promise(r => setTimeout(r, 60));
            const dataUrl = canvas.toDataURL({ format: 'png', quality: 1.0 });

            // Restore current slide
            const currentSlide = slides[currentSlideIndex];
            if (currentSlide) {
                drawSlide(canvas, currentSlide, currentSlideIndex + 1);
            }

            return dataUrl;
        }
    }));

    return (
        <div className="canvas-viewport">
            <button
                className="nav-arrow left"
                id="nav-prev"
                onClick={prevSlide}
                title="Previous Slide (Arrow Left)"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="canvas-frame" ref={frameRef}>
                <canvas ref={canvasElRef} id="slide-canvas" />
            </div>

            <button
                className="nav-arrow right"
                id="nav-next"
                onClick={nextSlide}
                title="Next Slide (Arrow Right)"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
});

SlideCanvas.displayName = 'SlideCanvas';
