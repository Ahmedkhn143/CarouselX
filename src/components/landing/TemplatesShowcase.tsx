import React from 'react';
import { TEMPLATES } from '../../constants/templates';
import { useCarousel } from '../../context/CarouselContext';

export const TemplatesShowcase: React.FC = () => {
    const { navigateToStudio } = useCarousel();

    return (
        <section className="landing-templates-section" id="templates">
            <div className="landing-section-header">
                <span className="section-pill">DESIGN GALLERY</span>
                <h2 className="section-title">8+ High-Converting Templates</h2>
                <p className="section-subtitle">
                    Select any template below to launch straight into the studio with that theme pre-configured.
                </p>
            </div>

            <div className="landing-templates-grid">
                {Object.entries(TEMPLATES).map(([key, tpl]) => {
                    const bgStyle = tpl.bgGradient
                        ? `linear-gradient(135deg, ${tpl.bgGradient[0]}, ${tpl.bgGradient[1]})`
                        : (tpl.bgColor || '#FFFFFF');

                    return (
                        <div key={key} className="landing-template-card">
                            <div className="landing-template-preview" style={{ background: bgStyle, color: tpl.textColor }}>
                                <span
                                    className="landing-template-badge"
                                    style={{ background: tpl.accentColor + '25', color: tpl.accentColor, borderColor: tpl.accentColor + '50' }}
                                >
                                    {tpl.name.toUpperCase()}
                                </span>
                                <div style={{ fontFamily: tpl.headingFont, fontWeight: 'bold', fontSize: '16px', lineHeight: 1.2, marginTop: '8px' }}>
                                    Stop The Scroll
                                </div>
                                <div style={{ fontFamily: tpl.bodyFont, fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                                    Clean layout & typography that hooks readers instantly.
                                </div>
                            </div>

                            <div className="landing-template-info">
                                <div>
                                    <div className="landing-template-name">{tpl.name}</div>
                                    <div className="landing-template-cat">{tpl.category.toUpperCase()} • {tpl.headingFont}</div>
                                </div>
                                <button
                                    className="landing-use-btn"
                                    onClick={() => navigateToStudio({ template: key })}
                                >
                                    Use Template <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
