import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Slide, PlatformType, TabType } from '../types/carousel';
import { SAMPLE_SLIDES } from '../constants/sampleData';
import { TEMPLATES } from '../constants/templates';
import { StorageService } from '../services/storageService';

interface CarouselContextType {
    slides: Slide[];
    currentSlideIndex: number;
    platform: PlatformType;
    activeTemplate: string;
    customBgColor: string | null;
    customTextColor: string | null;
    customAccentColor: string | null;
    customBgGradient: [string, string] | null;
    customBgImage: string | null;
    bgOverlayOpacity: number;
    bgOverlayColor: string;
    headingFont: string | null;
    bodyFont: string | null;
    showDecorations: boolean;
    showCounter: boolean;
    showBranding: boolean;
    creatorName: string;
    creatorHandle: string;
    activeTab: TabType;
    isAiModalOpen: boolean;
    isTemplateModalOpen: boolean;
    isApiKeyModalOpen: boolean;
    isLoading: boolean;
    loadingMessage: string;
    toastMessage: string | null;

    // Actions
    setSlides: (slides: Slide[]) => void;
    setCurrentSlideIndex: (index: number) => void;
    goToSlide: (index: number) => void;
    prevSlide: () => void;
    nextSlide: () => void;
    addSlide: () => void;
    deleteSlide: (index: number) => void;
    updateCurrentSlide: (updates: Partial<Slide>) => void;
    setPlatform: (platform: PlatformType) => void;
    setTemplate: (templateKey: string) => void;
    setCustomBgColor: (color: string | null) => void;
    setCustomTextColor: (color: string | null) => void;
    setCustomAccentColor: (color: string | null) => void;
    setCustomBgGradient: (grad: [string, string] | null) => void;
    setCustomBgImage: (img: string | null) => void;
    setBgOverlayOpacity: (opacity: number) => void;
    setBgOverlayColor: (color: string) => void;
    applyBgImageToSlide: (slideIdx: number, img: string | null, opacity?: number) => void;
    applyBgImageToAll: (img: string | null, opacity?: number) => void;
    setHeadingFont: (font: string | null) => void;
    setBodyFont: (font: string | null) => void;
    setShowDecorations: (show: boolean) => void;
    setShowCounter: (show: boolean) => void;
    setShowBranding: (show: boolean) => void;
    setCreatorName: (name: string) => void;
    setCreatorHandle: (handle: string) => void;
    setActiveTab: (tab: TabType) => void;
    setIsAiModalOpen: (open: boolean) => void;
    setIsTemplateModalOpen: (open: boolean) => void;
    setIsApiKeyModalOpen: (open: boolean) => void;
    currentView: 'landing' | 'studio';
    setIsLoading: (loading: boolean, message?: string) => void;
    navigateToStudio: (options?: { template?: string; topic?: string }) => void;
    navigateToLanding: () => void;
    showToast: (message: string) => void;
    saveDraft: () => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export const CarouselProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [slides, setSlides] = useState<Slide[]>(SAMPLE_SLIDES);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    const [platform, setPlatform] = useState<PlatformType>('linkedin');
    const [activeTemplate, setActiveTemplate] = useState<string>('modern');

    const [customBgColor, setCustomBgColor] = useState<string | null>(null);
    const [customTextColor, setCustomTextColor] = useState<string | null>(null);
    const [customAccentColor, setCustomAccentColor] = useState<string | null>(null);
    const [customBgGradient, setCustomBgGradient] = useState<[string, string] | null>(null);
    const [customBgImage, setCustomBgImage] = useState<string | null>(null);
    const [bgOverlayOpacity, setBgOverlayOpacity] = useState<number>(0.65);
    const [bgOverlayColor, setBgOverlayColor] = useState<string>('#000000');

    const [headingFont, setHeadingFont] = useState<string | null>(null);
    const [bodyFont, setBodyFont] = useState<string | null>(null);

    const [showDecorations, setShowDecorations] = useState<boolean>(true);
    const [showCounter, setShowCounter] = useState<boolean>(true);
    const [showBranding, setShowBranding] = useState<boolean>(true);

    const [creatorName, setCreatorName] = useState<string>('Hamza');
    const [creatorHandle, setCreatorHandle] = useState<string>('Freelancer & Creator');

    const [activeTab, setActiveTab] = useState<TabType>('tab-ai');
    const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

    const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');

    const [isLoading, setIsLoadingState] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Processing...');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const navigateToStudio = (options?: { template?: string; topic?: string }) => {
        if (options?.template) {
            setTemplate(options.template);
        }
        setCurrentView('studio');
    };

    const navigateToLanding = () => {
        setCurrentView('landing');
    };

    // Auto-load draft on mount
    useEffect(() => {
        const draft = StorageService.loadDraft();
        if (draft) {
            if (draft.slides && draft.slides.length > 0) setSlides(draft.slides);
            if (draft.template) setActiveTemplate(draft.template);
            if (draft.platform) setPlatform(draft.platform);
            if (draft.creatorName) setCreatorName(draft.creatorName);
            if (draft.creatorHandle) setCreatorHandle(draft.creatorHandle);
            if (draft.customBgColor !== undefined) setCustomBgColor(draft.customBgColor);
            if (draft.customTextColor !== undefined) setCustomTextColor(draft.customTextColor);
            if (draft.customAccentColor !== undefined) setCustomAccentColor(draft.customAccentColor);
            if (draft.customBgGradient !== undefined) setCustomBgGradient(draft.customBgGradient);
            if (draft.customBgImage !== undefined) setCustomBgImage(draft.customBgImage);
            if (draft.bgOverlayOpacity !== undefined) setBgOverlayOpacity(draft.bgOverlayOpacity);
            if (draft.bgOverlayColor !== undefined) setBgOverlayColor(draft.bgOverlayColor);
            if (draft.headingFont !== undefined) setHeadingFont(draft.headingFont);
            if (draft.bodyFont !== undefined) setBodyFont(draft.bodyFont);
            if (draft.showDecorations !== undefined) setShowDecorations(draft.showDecorations);
            if (draft.showCounter !== undefined) setShowCounter(draft.showCounter);
            if (draft.showBranding !== undefined) setShowBranding(draft.showBranding);
        }
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const setIsLoading = (loading: boolean, message: string = 'Processing...') => {
        setIsLoadingState(loading);
        setLoadingMessage(message);
    };

    const goToSlide = (index: number) => {
        if (index >= 0 && index < slides.length) {
            setCurrentSlideIndex(index);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const addSlide = () => {
        const newSlide: Slide = {
            slide_number: slides.length + 1,
            type: 'content',
            title: 'New Slide',
            body: 'Add your informative content or tips here...',
            badge: `STEP ${slides.length}`
        };
        const updated = [...slides, newSlide];
        setSlides(updated);
        setCurrentSlideIndex(updated.length - 1);
    };

    const deleteSlide = (index: number) => {
        if (slides.length <= 1) {
            showToast("You must keep at least 1 slide.");
            return;
        }
        const updated = slides.filter((_, i) => i !== index).map((s, i) => ({
            ...s,
            slide_number: i + 1
        }));
        setSlides(updated);
        if (currentSlideIndex >= updated.length) {
            setCurrentSlideIndex(updated.length - 1);
        }
    };

    const updateCurrentSlide = (updates: Partial<Slide>) => {
        setSlides(prev => {
            const next = [...prev];
            if (next[currentSlideIndex]) {
                next[currentSlideIndex] = { ...next[currentSlideIndex], ...updates };
            }
            return next;
        });
    };

    const applyBgImageToSlide = (slideIdx: number, img: string | null, opacity?: number) => {
        setSlides(prev => {
            const next = [...prev];
            if (next[slideIdx]) {
                next[slideIdx] = {
                    ...next[slideIdx],
                    bgImage: img || undefined,
                    bgOverlayOpacity: opacity !== undefined ? opacity : next[slideIdx].bgOverlayOpacity
                };
            }
            return next;
        });
        showToast(img ? "Background applied to current slide!" : "Slide background cleared.");
    };

    const applyBgImageToAll = (img: string | null, opacity?: number) => {
        setCustomBgImage(img);
        if (opacity !== undefined) setBgOverlayOpacity(opacity);
        // Also clear individual slide bg overrides so global applies everywhere
        setSlides(prev => prev.map(s => {
            const copy = { ...s };
            delete copy.bgImage;
            delete copy.bgOverlayOpacity;
            return copy;
        }));
        showToast(img ? "Background applied to ALL slides!" : "Carousel background cleared.");
    };

    const setTemplate = (templateKey: string) => {
        setActiveTemplate(templateKey);
        setCustomBgColor(null);
        setCustomTextColor(null);
        setCustomAccentColor(null);
        setCustomBgGradient(null);
        setCustomBgImage(null);

        const tpl = TEMPLATES[templateKey];
        if (tpl) {
            if (tpl.bgGradient) {
                setCustomBgGradient(tpl.bgGradient);
            }
            if (tpl.bgImage) {
                setCustomBgImage(tpl.bgImage);
            }
        }
    };

    const saveDraft = () => {
        StorageService.saveDraft({
            slides,
            template: activeTemplate,
            platform,
            creatorName,
            creatorHandle,
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
            showBranding
        });
        showToast("Draft saved successfully to your browser!");
    };

    return (
        <CarouselContext.Provider
            value={{
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
                activeTab,
                isAiModalOpen,
                isTemplateModalOpen,
                isApiKeyModalOpen,
                currentView,
                isLoading,
                loadingMessage,
                toastMessage,

                setSlides,
                setCurrentSlideIndex,
                goToSlide,
                prevSlide,
                nextSlide,
                addSlide,
                deleteSlide,
                updateCurrentSlide,
                setPlatform,
                setTemplate,
                setCustomBgColor,
                setCustomTextColor,
                setCustomAccentColor,
                setCustomBgGradient,
                setCustomBgImage,
                setBgOverlayOpacity,
                setBgOverlayColor,
                applyBgImageToSlide,
                applyBgImageToAll,
                setHeadingFont,
                setBodyFont,
                setShowDecorations,
                setShowCounter,
                setShowBranding,
                setCreatorName,
                setCreatorHandle,
                setActiveTab,
                setIsAiModalOpen,
                setIsTemplateModalOpen,
                setIsApiKeyModalOpen,
                setIsLoading,
                navigateToStudio,
                navigateToLanding,
                showToast,
                saveDraft
            }}
        >
            {children}
        </CarouselContext.Provider>
    );
};

export const useCarousel = (): CarouselContextType => {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error('useCarousel must be used within a CarouselProvider');
    }
    return context;
};
