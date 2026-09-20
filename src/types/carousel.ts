export type PlatformType = 'linkedin' | 'instagram' | 'twitter';

export type SlideType = 'title' | 'content' | 'cta';

export type TemplateCategory = 'all' | 'modern' | 'minimal' | 'bold' | 'gradient';

export interface Slide {
    slide_number: number;
    type: SlideType;
    title: string;
    body?: string;
    subtitle?: string;
    badge?: string;
    bgImage?: string;
    bgOverlayOpacity?: number;
}

export interface Template {
    name: string;
    category: TemplateCategory;
    bgColor?: string;
    bgGradient?: [string, string];
    bgImage?: string;
    textColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    decorations?: boolean;
    decorStyle?: 'circles' | 'border' | 'bars' | 'bubbles';
}

export interface PlatformDimension {
    width: number;
    height: number;
}

export interface CreatorInfo {
    name: string;
    handle: string;
}

export type TabType = 'tab-ai' | 'tab-template' | 'tab-text' | 'tab-background' | 'tab-elements' | 'tab-settings';
