import React from 'react';
import { CarouselXLogo } from '../common/CarouselXLogo';
import { useCarousel } from '../../context/CarouselContext';

export const LandingNavbar: React.FC = () => {
    const { navigateToStudio } = useCarousel();

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="landing-navbar">
            <div className="landing-nav-inner">
                <div className="landing-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <CarouselXLogo size={36} />
                    <span className="logo-text">
                        Carousel<span>X</span>
                    </span>
                    <span className="landing-pill-free">100% Free AI</span>
                </div>

                <nav className="landing-nav-links">
                    <button className="landing-nav-link" onClick={() => scrollTo('features')}>Features</button>
                    <button className="landing-nav-link" onClick={() => scrollTo('demo')}>Live Demo</button>
                    <button className="landing-nav-link" onClick={() => scrollTo('templates')}>Templates</button>
                    <button className="landing-nav-link" onClick={() => scrollTo('how-it-works')}>How It Works</button>
                    <button className="landing-nav-link" onClick={() => scrollTo('faq')}>FAQ</button>
                </nav>

                <div className="landing-nav-actions">
                    <button
                        className="landing-btn-secondary"
                        onClick={() => navigateToStudio()}
                    >
                        Open Studio
                    </button>
                    <button
                        className="landing-btn-primary"
                        onClick={() => navigateToStudio()}
                    >
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Create Carousel
                    </button>
                </div>
            </div>
        </header>
    );
};
