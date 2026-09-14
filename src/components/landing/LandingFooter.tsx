import React from 'react';
import { CarouselXLogo } from '../common/CarouselXLogo';
import { useCarousel } from '../../context/CarouselContext';

export const LandingFooter: React.FC = () => {
    const { navigateToStudio } = useCarousel();

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="landing-footer">
            <div className="footer-inner">
                <div className="footer-col-brand">
                    <div className="footer-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <CarouselXLogo size={32} />
                        <span className="logo-text">
                            Carousel<span>X</span>
                        </span>
                    </div>
                    <p className="footer-desc">
                        The modern AI-powered LinkedIn & Instagram carousel generator. Turn ideas into viral slide decks in seconds.
                    </p>
                    <div className="footer-badge">
                        <i className="fa-solid fa-bolt" style={{ color: '#FBBF24' }}></i> Free Built-In AI Engine
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-heading">Product</h4>
                    <button className="footer-link" onClick={() => scrollTo('features')}>Features</button>
                    <button className="footer-link" onClick={() => scrollTo('demo')}>Live Playground</button>
                    <button className="footer-link" onClick={() => scrollTo('templates')}>Template Gallery</button>
                    <button className="footer-link" onClick={() => navigateToStudio()}>Launch Studio</button>
                </div>

                <div className="footer-col">
                    <h4 className="footer-heading">Resources</h4>
                    <button className="footer-link" onClick={() => scrollTo('how-it-works')}>How It Works</button>
                    <button className="footer-link" onClick={() => scrollTo('faq')}>FAQ</button>
                    <a className="footer-link" href="https://github.com/Ahmedkhn143/CarouselX" target="_blank" rel="noreferrer">
                        GitHub Repository
                    </a>
                </div>

                <div className="footer-col">
                    <h4 className="footer-heading">Formats</h4>
                    <span className="footer-text">LinkedIn Document (4:5)</span>
                    <span className="footer-text">Instagram Square (1:1)</span>
                    <span className="footer-text">Twitter / X Landscape (16:9)</span>
                </div>
            </div>

            <div className="footer-bottom">
                <div>© {new Date().getFullYear()} CarouselX. Built with precision for top creators.</div>
                <div className="footer-made-with">
                    Crafted with <i className="fa-solid fa-heart" style={{ color: '#EF4444' }}></i> for LinkedIn & Instagram Growth
                </div>
            </div>
        </footer>
    );
};
