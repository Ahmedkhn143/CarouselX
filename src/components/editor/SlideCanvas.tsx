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
        customBgImage,
        bgOverlayOpacity,
        bgOverlayColor,
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

    const scalerContainerRef = useRef<HTMLDivElement | null>(null);

    // Resize and scale canvas to fit viewport perfectly without ANY clipping
    const scaleCanvasElement = useCallback(() => {
        const frameEl = frameRef.current;
        const containerEl = scalerContainerRef.current;
        if (!frameEl || !containerEl) return;

        const dim = DIMENSIONS[platform];
        const viewport = containerEl.parentElement;
        if (!viewport) return;

        const maxW = Math.max(viewport.clientWidth - 140, 220);
        const maxH = Math.max(viewport.clientHeight - 80, 220);
        const scale = Math.min(maxW / dim.width, maxH / dim.height, 1);

        const scaledW = Math.round(dim.width * scale);
        const scaledH = Math.round(dim.height * scale);

        containerEl.style.width = `${scaledW}px`;
        containerEl.style.height = `${scaledH}px`;

        frameEl.style.width = `${dim.width}px`;
        frameEl.style.height = `${dim.height}px`;
        frameEl.style.transform = `scale(${scale})`;
        frameEl.style.transformOrigin = 'center center';
    }, [platform]);

    // Draw full slide onto a given canvas
    const drawSlide = useCallback(async (canvas: fabric.Canvas, slide: Slide, slideIdx: number) => {
        if (!slide) return;

        canvas.clear();
        const w = canvas.getWidth();
        const h = canvas.getHeight();
        const tpl = getTemplate();
        const bgCol = getBgColor();
        const activeBgImage = slide.bgImage || customBgImage;
        const activeOverlayOpacity = slide.bgOverlayOpacity !== undefined ? slide.bgOverlayOpacity : bgOverlayOpacity;
        const isDark = activeBgImage ? true : isColorDark(bgCol);
        const txtCol = customTextColor || (activeBgImage ? '#FFFFFF' : getTemplate().textColor || '#111827');
        const accCol = getAccentColor();
        const hFont = getHeadingFont();
        const bFont = getBodyFont();

        // 1. Background (Image, Gradient or solid)
        if (activeBgImage) {
            canvas.setBackgroundColor('#0B0F19', () => canvas.renderAll());
            await new Promise<void>((resolve) => {
                let resolved = false;
                const timer = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }, 3500);

                fabric.Image.fromURL(
                    activeBgImage,
                    (img) => {
                        if (resolved) return;
                        resolved = true;
                        clearTimeout(timer);
                        if (img && img.width && img.height) {
                            const scale = Math.max(w / img.width, h / img.height);
                            img.set({
                                scaleX: scale,
                                scaleY: scale,
                                originX: 'center',
                                originY: 'center',
                                left: w / 2,
                                top: h / 2,
                                selectable: false,
                                evented: false
                            });
                            canvas.add(img);

                            // Dark overlay dimmer rectangle for 100% crisp typography
                            const overlay = new fabric.Rect({
                                left: 0,
                                top: 0,
                                width: w,
                                height: h,
                                fill: bgOverlayColor || '#000000',
                                opacity: activeOverlayOpacity !== undefined ? activeOverlayOpacity : 0.65,
                                selectable: false,
                                evented: false
                            });
                            canvas.add(overlay);
                        }
                        resolve();
                    },
                    { crossOrigin: 'anonymous' }
                );
            });
        } else {
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
        }

        // 2. Decorations
        if (showDecorations && tpl.decorations !== false) {
            const style = tpl.decorStyle || 'circles';
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

        // 3. Badge / Step Pill (Expert Designer Pill)
        let badgeBottom = 100;
        if (slide.badge) {
            const isDark = isColorDark(bgCol);
            const badgeBgCol = isDark ? 'rgba(255, 255, 255, 0.15)' : accCol + '20';
            const badgeTxtCol = isDark ? '#FFFFFF' : accCol;

            const badgeText = new fabric.Text(slide.badge.toUpperCase(), {
                fontSize: 20,
                fontFamily: bFont,
                fontWeight: '700',
                fill: badgeTxtCol,
                left: 96,
                top: 92,
                name: 'badge',
                selectable: true,
                hasControls: false
            });

            const padX = 20;
            const padY = 10;
            const badgeW = (badgeText.width || 100) + padX * 2;
            const badgeH = (badgeText.height || 24) + padY * 2;

            const badgeBg = new fabric.Rect({
                left: 80,
                top: 82,
                width: badgeW,
                height: badgeH,
                fill: badgeBgCol,
                stroke: isDark ? 'rgba(255, 255, 255, 0.25)' : accCol + '40',
                strokeWidth: 1.5,
                rx: badgeH / 2,
                ry: badgeH / 2,
                selectable: false,
                evented: false
            });

            badgeBottom = 82 + badgeH;
            canvas.add(badgeBg, badgeText);
        }

        // 4. Main Text Content (Expert Typography)
        const isTitleSlide = slide.type === 'title';
        const isCTA = slide.type === 'cta';
        const hasUrdu = /[\u0600-\u06FF]/.test((slide.title || '') + (slide.body || '') + (slide.subtitle || ''));
        const actualHeadingFont = hasUrdu ? 'Noto Nastaliq Urdu' : hFont;

        const titleFontSize = isTitleSlide ? 68 : (isCTA ? 60 : 52);
        const titleTop = badgeBottom + 40;

        const title = new fabric.Textbox(slide.title || 'Slide Title', {
            left: 80,
            top: titleTop,
            fontSize: titleFontSize,
            fontFamily: actualHeadingFont,
            fontWeight: hFont === 'Bebas Neue' ? 'normal' : '800',
            fill: txtCol,
            name: 'title',
            lineHeight: 1.2,
            width: w - 160,
            selectable: true
        });
        canvas.add(title);

        const bodyContent = isTitleSlide ? (slide.subtitle || '') : (slide.body || '');
        if (bodyContent) {
            const titleH = (title.height || 60) * (title.scaleY || 1);
            const bodyTop = titleTop + titleH + 36;
            const bodyFontSize = isTitleSlide ? 32 : 32;

            const body = new fabric.Textbox(bodyContent, {
                left: 80,
                top: bodyTop,
                fontSize: bodyFontSize,
                fontFamily: bFont,
                fontWeight: '400',
                fill: txtCol,
                name: isTitleSlide ? 'subtitle' : 'body',
                lineHeight: 1.55,
                opacity: 0.88,
                width: w - 160,
                selectable: true
            });
            canvas.add(body);
        }

        // 5. Swipe Pill (Title Slide Only)
        if (isTitleSlide) {
            const pillW = 150;
            const pillH = 46;
            const pillLeft = w - 80 - pillW;
            const pillTop = h - 130;

            const pillBg = new fabric.Rect({
                left: pillLeft,
                top: pillTop,
                width: pillW,
                height: pillH,
                fill: accCol,
                rx: pillH / 2,
                ry: pillH / 2,
                selectable: false,
                evented: false,
                shadow: new fabric.Shadow({
                    color: 'rgba(0,0,0,0.2)',
                    blur: 12,
                    offsetY: 4
                })
            });

            const swipeText = new fabric.Text('Swipe  ➔', {
                left: pillLeft + 24,
                top: pillTop + 13,
                fontSize: 18,
                fontFamily: bFont,
                fontWeight: '700',
                fill: isColorDark(accCol) ? '#FFFFFF' : '#000000',
                selectable: false,
                evented: false
            });

            canvas.add(pillBg, swipeText);
        }

        // 6. Modern Slide Counter Pill (Content & CTA slides)
        if (showCounter && !isTitleSlide) {
            const totalSlides = slides.length || 6;
            const counterText = `${String(slideIdx).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
            const isDark = isColorDark(bgCol);

            const counterLabel = new fabric.Text(counterText, {
                fontSize: 18,
                fontFamily: bFont,
                fontWeight: '700',
                fill: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)',
                selectable: false,
                evented: false
            });

            const cW = (counterLabel.width || 60) + 24;
            const cH = 36;
            const cLeft = w - 80 - cW;
            const cTop = 82;

            const counterBg = new fabric.Rect({
                left: cLeft,
                top: cTop,
                width: cW,
                height: cH,
                fill: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                rx: cH / 2,
                ry: cH / 2,
                selectable: false,
                evented: false
            });

            counterLabel.set({
                left: cLeft + 12,
                top: cTop + 9
            });

            canvas.add(counterBg, counterLabel);
        }

        // 7. Creator Branding (Bottom Bar with Avatar)
        if (showBranding) {
            const avatarRadius = 18;
            const avatarLeft = 80;
            const avatarTop = h - 122;

            const avatarCircle = new fabric.Circle({
                radius: avatarRadius,
                fill: accCol,
                left: avatarLeft,
                top: avatarTop,
                selectable: false,
                evented: false
            });

            const initial = (creatorName || 'C').trim().charAt(0).toUpperCase() || 'C';
            const initialText = new fabric.Text(initial, {
                fontSize: 16,
                fontFamily: bFont,
                fontWeight: '700',
                fill: isColorDark(accCol) ? '#FFFFFF' : '#000000',
                originX: 'center',
                originY: 'center',
                left: avatarLeft + avatarRadius,
                top: avatarTop + avatarRadius,
                selectable: false,
                evented: false
            });

            const nameText = new fabric.Text(creatorName || 'Creator', {
                left: avatarLeft + avatarRadius * 2 + 12,
                top: avatarTop - 2,
                fontSize: 20,
                fontFamily: bFont,
                fontWeight: '700',
                fill: txtCol,
                selectable: false,
                evented: false
            });

            const handleText = new fabric.Text(creatorHandle || '@handle', {
                left: avatarLeft + avatarRadius * 2 + 12,
                top: avatarTop + 24,
                fontSize: 14,
                fontFamily: bFont,
                fontWeight: '500',
                fill: txtCol,
                opacity: 0.7,
                selectable: false,
                evented: false
            });

            canvas.add(avatarCircle, initialText, nameText, handleText);
        }

        canvas.renderAll();
    }, [getTemplate, getBgColor, getTextColor, getAccentColor, getHeadingFont, getBodyFont, customBgGradient, customBgColor, customBgImage, bgOverlayOpacity, bgOverlayColor, showDecorations, isColorDark, showCounter, showBranding, creatorName, creatorHandle]);

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
            void drawSlide(canvas, currentSlide, currentSlideIndex + 1);
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

            await drawSlide(canvas, targetSlide, index + 1);
            // Allow fabric canvas to settle after async image/gradient rendering
            await new Promise(r => setTimeout(r, 100));
            const dataUrl = canvas.toDataURL({ format: 'png', quality: 1.0 });

            // Restore current slide
            const currentSlide = slides[currentSlideIndex];
            if (currentSlide) {
                await drawSlide(canvas, currentSlide, currentSlideIndex + 1);
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

            <div className="canvas-scaler-container" ref={scalerContainerRef}>
                <div className="canvas-frame" ref={frameRef}>
                    <canvas ref={canvasElRef} id="slide-canvas" />
                </div>
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
