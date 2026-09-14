import React from 'react';
import { useCarousel } from '../../../context/CarouselContext';
import { TEMPLATES } from '../../../constants/templates';

export const TemplatesTab: React.FC = () => {
    const { activeTemplate, setTemplate, setIsTemplateModalOpen } = useCarousel();

    return (
        <div className="tab-panel active" id="tab-template">
            <div className="panel-section">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Choose Template Style</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Quickly switch between pre-designed color and typography styles.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(TEMPLATES).map(([key, tpl]) => (
                        <button
                            key={key}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-sm)',
                                border: activeTemplate === key ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                                background: activeTemplate === key ? 'var(--accent-bg)' : 'var(--bg-sidebar)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setTemplate(key)}
                        >
                            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                                {tpl.name}
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: tpl.bgGradient ? tpl.bgGradient[0] : tpl.bgColor,
                                        border: '1px solid #ddd'
                                    }}
                                />
                                <span
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: tpl.accentColor
                                    }}
                                />
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    className="btn-select-template"
                    style={{ marginTop: '16px' }}
                    onClick={() => setIsTemplateModalOpen(true)}
                >
                    <i className="fa-solid fa-swatchbook"></i> Open Full Template Gallery
                </button>
            </div>
        </div>
    );
};
