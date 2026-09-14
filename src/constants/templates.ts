import type { Template, PlatformDimension, PlatformType } from '../types/carousel';

export const TEMPLATES: Record<string, Template> = {
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

export const DIMENSIONS: Record<PlatformType, PlatformDimension> = {
    linkedin: { width: 1080, height: 1350 },
    instagram: { width: 1080, height: 1080 },
    twitter: { width: 1600, height: 900 }
};
