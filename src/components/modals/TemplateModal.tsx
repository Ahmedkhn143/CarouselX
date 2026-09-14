import React, { useState } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { TEMPLATES } from '../../constants/templates';
import type { PlatformType, TemplateCategory } from '../../types/carousel';

export const TemplateModal: React.FC = () => {
    const {
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        activeTemplate,
        setTemplate,
        platform,
        setPlatform
    } = useCarousel();

    const [filterCategory, setFilterCategory] = useState<TemplateCategory>('all');

    if (!isTemplateModalOpen) return null;

    const categories: { id: TemplateCategory; label: string }[] = [
        { id: 'all', label: 'All Templates' },
        { id: 'modern', label: 'Modern' },
        { id: 'minimal', label: 'Minimal' },
        { id: 'bold', label: 'Bold' },
        { id: 'gradient', label: 'Gradient' }
    ];

    const templateList = Object.entries(TEMPLATES).map(([key, tpl]) => ({
        key,
        ...tpl
    }));

    const filteredTemplates = filterCategory === 'all'
        ? templateList
        : templateList.filter(t => t.category === filterCategory);

    return (
        <div className="modal-overlay" onClick={() => setIsTemplateModalOpen(false)}>
            <div className="modal template-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>Select a Customizable Template</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Choose from curated color themes and typography combinations.
                        </p>
                    </div>
                    <button className="modal-close" onClick={() => setIsTemplateModalOpen(false)}>&times;</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ width: '180px', marginBottom: 0 }}>
                        <label>Format</label>
                        <select
                            className="platform-select"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value as PlatformType)}
                        >
                            <option value="linkedin">🔗 LinkedIn (4:5)</option>
                            <option value="instagram">📷 Instagram (1:1)</option>
                            <option value="twitter">🐦 Twitter (16:9)</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            Category
                        </label>
                        <div className="template-categories" style={{ marginTop: '4px', marginBottom: 0 }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`cat-btn ${filterCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setFilterCategory(cat.id)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="template-grid" id="template-grid">
                    {filteredTemplates.map(tpl => {
                        const isActive = tpl.key === activeTemplate;
                        const bgStyle = tpl.bgGradient
                            ? `linear-gradient(135deg, ${tpl.bgGradient[0]}, ${tpl.bgGradient[1]})`
                            : (tpl.bgColor || '#FFFFFF');

                        return (
                            <div
                                key={tpl.key}
                                className={`template-preview-card ${isActive ? 'active' : ''}`}
                                onClick={() => {
                                    setTemplate(tpl.key);
                                    setIsTemplateModalOpen(false);
                                }}
                            >
                                <div className="template-thumb-img" style={{ background: bgStyle }}>
                                    <div
                                        style={{
                                            fontFamily: tpl.headingFont,
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            color: tpl.textColor,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        Unlock Potential
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: tpl.bodyFont,
                                            fontSize: '10px',
                                            color: tpl.textColor,
                                            opacity: 0.75,
                                            lineHeight: 1.3
                                        }}
                                    >
                                        Previewing {tpl.name} layout & styles
                                    </div>
                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '4px' }}>
                                        <span
                                            style={{
                                                fontSize: '8px',
                                                fontWeight: 'bold',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: tpl.accentColor,
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            STEP 1
                                        </span>
                                    </div>
                                </div>
                                <div className="template-preview-name">{tpl.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
