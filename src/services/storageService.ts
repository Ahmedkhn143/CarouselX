import type { Slide, PlatformType } from '../types/carousel';

const API_KEY_STORAGE = 'claude_api_key';
const DRAFT_STORAGE = 'pak_carousel_draft';

export interface SavedDraft {
    slides: Slide[];
    template: string;
    platform: PlatformType;
    creatorName: string;
    creatorHandle: string;
    customBgColor?: string | null;
    customTextColor?: string | null;
    customAccentColor?: string | null;
    headingFont?: string | null;
    bodyFont?: string | null;
    showDecorations?: boolean;
    showCounter?: boolean;
    showBranding?: boolean;
}

export const StorageService = {
    getApiKey(): string {
        return localStorage.getItem(API_KEY_STORAGE) || '';
    },

    setApiKey(key: string): void {
        localStorage.setItem(API_KEY_STORAGE, key);
    },

    saveDraft(data: SavedDraft): void {
        localStorage.setItem(DRAFT_STORAGE, JSON.stringify(data));
    },

    loadDraft(): SavedDraft | null {
        try {
            const raw = localStorage.getItem(DRAFT_STORAGE);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Failed to parse draft from localStorage', e);
            return null;
        }
    }
};
