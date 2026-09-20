import type { Slide, PlatformType } from '../types/carousel';

const API_KEY_STORAGE = 'claude_api_key';
const GEMINI_API_KEY_STORAGE = 'gemini_api_key';
const GROQ_API_KEY_STORAGE = 'groq_api_key';
const AI_PROVIDER_STORAGE = 'ai_provider_choice';
const DRAFT_STORAGE = 'carouselx_draft';
const LEGACY_DRAFT_STORAGE = 'pak_carousel_draft';

export type AIProvider = 'gemini' | 'groq' | 'claude' | 'built_in';

export interface SavedDraft {
    slides: Slide[];
    template: string;
    platform: PlatformType;
    creatorName: string;
    creatorHandle: string;
    customBgColor?: string | null;
    customTextColor?: string | null;
    customAccentColor?: string | null;
    customBgGradient?: [string, string] | null;
    customBgImage?: string | null;
    bgOverlayOpacity?: number;
    bgOverlayColor?: string;
    headingFont?: string | null;
    bodyFont?: string | null;
    showDecorations?: boolean;
    showCounter?: boolean;
    showBranding?: boolean;
}

export const StorageService = {
    // Claude Key
    getApiKey(): string {
        return localStorage.getItem(API_KEY_STORAGE) || '';
    },

    setApiKey(key: string): void {
        localStorage.setItem(API_KEY_STORAGE, key);
    },

    // Gemini Free Key
    getGeminiApiKey(): string {
        return localStorage.getItem(GEMINI_API_KEY_STORAGE) || 
            ((import.meta as any).env?.VITE_GEMINI_API_KEY || '');
    },

    setGeminiApiKey(key: string): void {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, key);
    },

    // Groq Free Key
    getGroqApiKey(): string {
        return localStorage.getItem(GROQ_API_KEY_STORAGE) || 
            ((import.meta as any).env?.VITE_GROQ_API_KEY || '');
    },

    setGroqApiKey(key: string): void {
        localStorage.setItem(GROQ_API_KEY_STORAGE, key);
    },

    // Active AI Provider
    getAiProvider(): AIProvider {
        const stored = localStorage.getItem(AI_PROVIDER_STORAGE) as AIProvider | null;
        if (stored) return stored;
        if (this.getGeminiApiKey()) return 'gemini';
        if (this.getGroqApiKey()) return 'groq';
        if (this.getApiKey()) return 'claude';
        return 'gemini'; // default to gemini as free tier
    },

    setAiProvider(provider: AIProvider): void {
        localStorage.setItem(AI_PROVIDER_STORAGE, provider);
    },

    saveDraft(data: SavedDraft): void {
        localStorage.setItem(DRAFT_STORAGE, JSON.stringify(data));
    },

    loadDraft(): SavedDraft | null {
        try {
            const raw = localStorage.getItem(DRAFT_STORAGE) || localStorage.getItem(LEGACY_DRAFT_STORAGE);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Failed to parse draft from localStorage', e);
            return null;
        }
    }
};
