import React from 'react';
import { useCarousel } from '../../context/CarouselContext';

export const CtaSection: React.FC = () => {
    const { navigateToStudio } = useCarousel();

    return (
        <section className="landing-cta-banner-section">
            <div className="cta-banner-card">
                <div className="cta-banner-glow"></div>
                <div className="cta-banner-content">
                    <span className="cta-badge">⚡ ZERO BARRIER TO ENTRY</span>
                    <h2 className="cta-headline">Ready To 10x Your LinkedIn & Instagram Engagement?</h2>
                    <p className="cta-subheadline">
                        Start generating viral carousels right now with free built-in AI. No sign-up, no credit card, no waiting.
                    </p>
                    <div className="cta-actions">
                        <button className="cta-btn-primary" onClick={() => navigateToStudio()}>
                            <i className="fa-solid fa-wand-magic-sparkles"></i> Open CarouselX Studio Free
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
