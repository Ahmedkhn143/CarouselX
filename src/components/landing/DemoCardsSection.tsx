import React, { useState } from 'react';
import { useCarousel } from '../../context/CarouselContext';

interface DemoCardItem {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    templateKey: string;
    stats: string;
    tags: string[];
}

const DEMO_CARDS: DemoCardItem[] = [
    {
        id: 'growth',
        title: 'Social Growth & SaaS Metrics',
        category: 'High-Impact Analytics',
        description: 'Designed for tech founders and growth marketers. Clean neon line graphs and campaign performance badges.',
        image: '/assets/demo_card_1.jpg',
        templateKey: 'bold',
        stats: '142k Impressions',
        tags: ['LinkedIn 4:5', 'SaaS', 'Neon Dark']
    },
    {
        id: 'creative',
        title: 'Creative Studio Innovations',
        category: 'Brand & Visual Design',
        description: 'Fluid 3D abstract shapes with high-contrast typography. Perfect for design agencies, portfolios, and creatives.',
        image: '/assets/demo_card_2.jpg',
        templateKey: 'gradient_ocean',
        stats: '89k Impressions',
        tags: ['Instagram 1:1', 'Agency', 'Fluid 3D']
    },
    {
        id: 'branding',
        title: 'Elevate Your Personal Brand',
        category: 'Thought Leadership',
        description: 'LinkedIn Top Voice authority format with golden achievement badges and milestone network growth charts.',
        image: '/assets/demo_card_3.jpg',
        templateKey: 'dark_premium',
        stats: '210k Impressions',
        tags: ['Top Voice', 'Authority', 'Milestones']
    }
];

export const DemoCardsSection: React.FC = () => {
    const { navigateToStudio } = useCarousel();
    const [activeCardId, setActiveCardId] = useState('growth');

    return (
        <section className="landing-demo-cards-section" id="demo-cards">
            <div className="landing-section-header">
                <span className="section-pill">INSPIRATION GALLERY</span>
                <h2 className="section-title">Viral Carousel Demo Cards</h2>
                <p className="section-subtitle">
                    Real-world visual slide designs generated for high engagement on LinkedIn & Instagram feeds.
                </p>
            </div>

            <div className="demo-cards-grid">
                {DEMO_CARDS.map((card) => {
                    const isActive = activeCardId === card.id;
                    return (
                        <div
                            key={card.id}
                            className={`demo-card-item ${isActive ? 'active' : ''}`}
                            onMouseEnter={() => setActiveCardId(card.id)}
                        >
                            <div className="demo-card-img-container">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="demo-card-img"
                                    loading="lazy"
                                />
                                <div className="demo-card-overlay">
                                    <span className="demo-card-stats-badge">
                                        <i className="fa-solid fa-chart-line"></i> {card.stats}
                                    </span>
                                </div>
                            </div>

                            <div className="demo-card-body">
                                <div className="demo-card-tags">
                                    {card.tags.map((t, idx) => (
                                        <span key={idx} className="demo-card-tag">{t}</span>
                                    ))}
                                </div>

                                <h3 className="demo-card-title">{card.title}</h3>
                                <p className="demo-card-desc">{card.description}</p>

                                <button
                                    className="demo-card-action-btn"
                                    onClick={() => navigateToStudio({ template: card.templateKey })}
                                >
                                    <span>Customize in Studio</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
