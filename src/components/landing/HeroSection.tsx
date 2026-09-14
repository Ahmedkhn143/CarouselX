import React, { useState } from 'react';
import { useCarousel } from '../../context/CarouselContext';

const HERO_PREVIEWS = [
    {
        num: 1,
        badge: 'VIRAL BLUEPRINT',
        title: 'How I Grew from 0 to 50k Followers',
        desc: 'Without paid ads, cold DMs, or 10-hour workdays. The exact 5-step carousel framework.',
        theme: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        accent: '#FBBF24',
        textColor: '#FFFFFF'
    },
    {
        num: 2,
        badge: 'STEP 1: HOOK FIRST',
        title: 'Treat Slide #1 Like a Billboard',
        desc: 'If users do not stop scrolling on slide 1, slides 2 through 6 do not exist. Keep headlines under 8 words.',
        theme: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        accent: '#38BDF8',
        textColor: '#FFFFFF'
    },
    {
        num: 3,
        badge: 'STEP 2: HIGH CONTRAST',
        title: 'Colors That Pop on Feeds',
        desc: 'Use high-contrast backgrounds like Deep Purple or Sunset Gradient. Bold text increases readability by 40%.',
        theme: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)',
        accent: '#FDE047',
        textColor: '#FFFFFF'
    }
];

export const HeroSection: React.FC = () => {
    const { navigateToStudio } = useCarousel();
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);

    const currentSlide = HERO_PREVIEWS[activeHeroSlide];

    return (
        <section className="landing-hero">
            <div className="hero-badge">
                <span className="hero-badge-sparkle">✨</span>
                <span>Next-Generation Carousel Builder • 100% Free AI Included</span>
            </div>

            <h1 className="hero-headline">
                Create Viral LinkedIn & Instagram{' '}
                <span className="hero-gradient-text">Carousels In Seconds</span>
            </h1>

            <p className="hero-subheadline">
                Turn your thoughts, guides, and tips into high-converting slide decks.
                Export clean, multi-page PDFs ready for LinkedIn Document posts in 1 click.
                No design skills required.
            </p>

            <div className="hero-cta-group">
                <button
                    className="hero-btn-primary"
                    onClick={() => navigateToStudio()}
                >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Open CarouselX Studio (Free)
                </button>
                <button
                    className="hero-btn-secondary"
                    onClick={() => {
                        const el = document.getElementById('demo');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <i className="fa-solid fa-play"></i> Watch Live AI Demo
                </button>
            </div>

            <div className="hero-metrics-strip">
                <div className="metric-item">
                    <span className="metric-num">10,000+</span>
                    <span className="metric-label">Slides Created</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-item">
                    <span className="metric-num">100% Free</span>
                    <span className="metric-label">No Key Required</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-item">
                    <span className="metric-num">4.9 / 5</span>
                    <span className="metric-label">Creator Rating</span>
                </div>
            </div>

            {/* Interactive Hero Preview Showcase */}
            <div className="hero-mockup-wrapper">
                <div className="hero-glow-back"></div>

                <div className="hero-mockup-card">
                    {/* Mockup Toolbar */}
                    <div className="mockup-header">
                        <div className="mockup-dots">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <div className="mockup-title">CarouselX Live Studio Preview</div>
                        <div className="mockup-badge">
                            <i className="fa-solid fa-file-pdf"></i> LinkedIn PDF Ready
                        </div>
                    </div>

                    {/* Mockup Content Area */}
                    <div className="mockup-body">
                        {/* Slide Display */}
                        <div
                            className="mockup-slide"
                            style={{ background: currentSlide.theme, color: currentSlide.textColor }}
                        >
                            <div className="mockup-slide-top">
                                <span
                                    className="mockup-slide-badge"
                                    style={{ color: currentSlide.accent, borderColor: currentSlide.accent + '55' }}
                                >
                                    {currentSlide.badge}
                                </span>
                                <span className="mockup-slide-counter">
                                    0{currentSlide.num} / 0{HERO_PREVIEWS.length}
                                </span>
                            </div>

                            <div className="mockup-slide-center">
                                <h2 className="mockup-slide-title">{currentSlide.title}</h2>
                                <p className="mockup-slide-desc">{currentSlide.desc}</p>
                            </div>

                            <div className="mockup-slide-bottom">
                                <div className="mockup-creator-brand">
                                    <div className="mockup-avatar">AH</div>
                                    <div>
                                        <div className="mockup-creator-name">Ahmad Khan</div>
                                        <div className="mockup-creator-handle">@ahmadkhan • LinkedIn Creator</div>
                                    </div>
                                </div>
                                <div className="mockup-swipe-pill" style={{ background: currentSlide.accent }}>
                                    Swipe ➤
                                </div>
                            </div>
                        </div>

                        {/* Floating Feature Tags */}
                        <div className="floating-tag tag-1">
                            <i className="fa-solid fa-bolt" style={{ color: '#FBBF24' }}></i> Free AI Built-in
                        </div>
                        <div className="floating-tag tag-2">
                            <i className="fa-solid fa-palette" style={{ color: '#7C3AED' }}></i> 8+ Design Themes
                        </div>
                        <div className="floating-tag tag-3">
                            <i className="fa-solid fa-cloud-arrow-down" style={{ color: '#10B981' }}></i> 1080p PDF Export
                        </div>
                    </div>

                    {/* Mini Slider Controls */}
                    <div className="mockup-controls">
                        <button
                            className="mockup-nav-btn"
                            onClick={() => setActiveHeroSlide(prev => (prev > 0 ? prev - 1 : HERO_PREVIEWS.length - 1))}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <div className="mockup-slider-dots">
                            {HERO_PREVIEWS.map((_, i) => (
                                <span
                                    key={i}
                                    className={`slider-dot ${i === activeHeroSlide ? 'active' : ''}`}
                                    onClick={() => setActiveHeroSlide(i)}
                                ></span>
                            ))}
                        </div>
                        <button
                            className="mockup-nav-btn"
                            onClick={() => setActiveHeroSlide(prev => (prev < HERO_PREVIEWS.length - 1 ? prev + 1 : 0))}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
