import React, { useState } from 'react';
import { useCarousel } from '../../../context/CarouselContext';
import { TEMPLATES } from '../../../constants/templates';
import type { PlatformType } from '../../../types/carousel';

const PRESET_COLORS = [
    '#FBBF24', '#6366F1', '#10B981', '#EF4444', '#1E1B4B', '#FFFFFF',
    '#EC4899', '#F97316', '#14B8A6', '#8B5CF6', '#64748B', '#0EA5E9'
];

export const AiTab: React.FC = () => {
    const {
        platform,
        setPlatform,
        setIsAiModalOpen,
        setIsTemplateModalOpen,
        activeTemplate,
        customBgColor,
        setCustomBgColor,
        customTextColor,
        setCustomTextColor,
        customAccentColor,
        setCustomAccentColor,
        headingFont,
        setHeadingFont,
        bodyFont,
        setBodyFont,
        showDecorations,
        setShowDecorations,
        showCounter,
        setShowCounter,
        showBranding,
        setShowBranding,
        creatorName,
        setCreatorName,
        creatorHandle,
        setCreatorHandle
    } = useCarousel();

    // Section collapse states
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        color: false,
        text: false,
        effects: false,
        counter: false,
        creator: false
    });

    const toggleSection = (key: string) => {
        setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentTemplate = TEMPLATES[activeTemplate] || TEMPLATES.modern;
    const activeBg = customBgColor || currentTemplate.bgColor || '#FFFFFF';
    const activeText = customTextColor || currentTemplate.textColor || '#111827';
    const activeAccent = customAccentColor || currentTemplate.accentColor || '#7C3AED';

    return (
        <div className="tab-panel active" id="tab-ai">
            {/* AI Generator Hero */}
            <div className="generate-section">
                <div className="generate-title">
                    AI Carousel Generator <span className="pro-badge"><i className="fa-solid fa-sparkles"></i> AI</span>
                </div>
                <button
                    className="btn-generate-main"
                    id="btn-generate"
                    onClick={() => setIsAiModalOpen(true)}
                >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Carousel...
                </button>
                <div className="or-divider">or customize manually below</div>
            </div>

            {/* Platform & Template Select */}
            <div className="panel-section">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>Template Settings</h3>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label>Platform Format</label>
                    <select
                        className="platform-select"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as PlatformType)}
                    >
                        <option value="linkedin">🔗 LinkedIn (4:5, Recommended)</option>
                        <option value="instagram">📷 Instagram (1:1, Square)</option>
                        <option value="twitter">🐦 Twitter / X (16:9, Landscape)</option>
                    </select>
                </div>

                <button
                    className="btn-select-template"
                    id="btn-open-template-modal"
                    onClick={() => setIsTemplateModalOpen(true)}
                >
                    <i className="fa-solid fa-swatchbook"></i> Select Template ({currentTemplate.name})...
                </button>
            </div>

            {/* Color Palette */}
            <div className="panel-section">
                <div className="panel-section-header" onClick={() => toggleSection('color')}>
                    <h3>Color Palette</h3>
                    <i className={`fa-solid fa-chevron-down chevron ${collapsedSections.color ? 'collapsed' : ''}`}></i>
                </div>
                <div className={`panel-section-body ${collapsedSections.color ? 'collapsed' : ''}`} id="color-body">
                    <div className="color-grid">
                        {PRESET_COLORS.map(c => (
                            <div
                                key={c}
                                className={`color-swatch ${activeBg.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
                                style={{ background: c, border: c === '#FFFFFF' ? '1px solid #ddd' : undefined }}
                                onClick={() => setCustomBgColor(c)}
                                title={`Select ${c}`}
                            />
                        ))}
                    </div>
                    <div className="color-custom-row">
                        <div className="color-input-wrap">
                            <input
                                type="color"
                                value={activeBg.startsWith('#') ? activeBg : '#FBBF24'}
                                onChange={(e) => setCustomBgColor(e.target.value)}
                            />
                            <span>BG</span>
                        </div>
                        <div className="color-input-wrap">
                            <input
                                type="color"
                                value={activeText.startsWith('#') ? activeText : '#1E1B4B'}
                                onChange={(e) => setCustomTextColor(e.target.value)}
                            />
                            <span>Text</span>
                        </div>
                        <div className="color-input-wrap">
                            <input
                                type="color"
                                value={activeAccent.startsWith('#') ? activeAccent : '#7C3AED'}
                                onChange={(e) => setCustomAccentColor(e.target.value)}
                            />
                            <span>Accent</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Text Settings */}
            <div className="panel-section">
                <div className="panel-section-header" onClick={() => toggleSection('text')}>
                    <h3>Text & Fonts</h3>
                    <i className={`fa-solid fa-chevron-down chevron ${collapsedSections.text ? 'collapsed' : ''}`}></i>
                </div>
                <div className={`panel-section-body ${collapsedSections.text ? 'collapsed' : ''}`} id="text-body">
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Heading Font</label>
                        <select
                            className="platform-select"
                            value={headingFont || currentTemplate.headingFont}
                            onChange={(e) => setHeadingFont(e.target.value)}
                        >
                            <option value="Playfair Display">Playfair Display (Serif)</option>
                            <option value="Bebas Neue">Bebas Neue (Condensed)</option>
                            <option value="Inter">Inter (Sans-serif)</option>
                            <option value="Noto Nastaliq Urdu">Noto Nastaliq Urdu (Urdu)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Body Font</label>
                        <select
                            className="platform-select"
                            value={bodyFont || currentTemplate.bodyFont}
                            onChange={(e) => setBodyFont(e.target.value)}
                        >
                            <option value="Inter">Inter (Sans-serif)</option>
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Noto Nastaliq Urdu">Noto Nastaliq Urdu</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Background Effects */}
            <div className="panel-section">
                <div className="panel-section-header" onClick={() => toggleSection('effects')}>
                    <h3>Background Effects</h3>
                    <i className={`fa-solid fa-chevron-down chevron ${collapsedSections.effects ? 'collapsed' : ''}`}></i>
                </div>
                <div className={`panel-section-body ${collapsedSections.effects ? 'collapsed' : ''}`} id="effects-body">
                    <div className="toggle-row">
                        <label>Show decorations</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showDecorations}
                                onChange={(e) => setShowDecorations(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Counter */}
            <div className="panel-section">
                <div className="panel-section-header" onClick={() => toggleSection('counter')}>
                    <h3>Counter & Corners</h3>
                    <i className={`fa-solid fa-chevron-down chevron ${collapsedSections.counter ? 'collapsed' : ''}`}></i>
                </div>
                <div className={`panel-section-body ${collapsedSections.counter ? 'collapsed' : ''}`} id="counter-body">
                    <div className="toggle-row">
                        <label>Show slide counter</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showCounter}
                                onChange={(e) => setShowCounter(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Creator Info */}
            <div className="panel-section">
                <div className="panel-section-header" onClick={() => toggleSection('creator')}>
                    <h3>Creator Branding</h3>
                    <i className={`fa-solid fa-chevron-down chevron ${collapsedSections.creator ? 'collapsed' : ''}`}></i>
                </div>
                <div className={`panel-section-body ${collapsedSections.creator ? 'collapsed' : ''}`} id="creator-body">
                    <div className="toggle-row" style={{ marginBottom: '10px' }}>
                        <label>Show creator branding</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showBranding}
                                onChange={(e) => setShowBranding(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: '8px' }}>
                        <label>Your Title / Handle</label>
                        <input
                            type="text"
                            value={creatorHandle}
                            onChange={(e) => setCreatorHandle(e.target.value)}
                            placeholder="@handle or title"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
