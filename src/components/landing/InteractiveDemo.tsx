import React, { useState } from 'react';
import { AIService } from '../../services/aiService';
import { useCarousel } from '../../context/CarouselContext';
import type { Slide } from '../../types/carousel';

const SUGGESTIONS = [
    '5 Freelancing habits that make $5k/mo',
    'How to build a personal brand on LinkedIn',
    'Ramadan productivity blueprint for entrepreneurs',
    'Remote developer interview tips in Pakistan'
];

export const InteractiveDemo: React.FC = () => {
    const { setSlides, navigateToStudio } = useCarousel();

    const [topic, setTopic] = useState('5 Freelancing habits that make $5k/mo');
    const [tone, setTone] = useState('english');
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewSlides, setPreviewSlides] = useState<Slide[]>([
        {
            slide_number: 1,
            type: 'title',
            title: '5 Freelancing Habits That Make $5k/Mo',
            subtitle: 'Stop trading hours for pennies. The exact playbook used by top 1% freelancers.',
            badge: 'PROVEN FRAMEWORK'
        },
        {
            slide_number: 2,
            type: 'content',
            title: 'Niche Down Aggressively',
            body: 'Generalists compete on price; specialists command premium rates. Pick one painful problem and solve it completely.',
            badge: 'HABIT 1'
        },
        {
            slide_number: 3,
            type: 'content',
            title: 'Package Value, Not Hours',
            body: 'Switch from hourly billing to outcome-based project pricing. Clients pay for speed, clarity, and results.',
            badge: 'HABIT 2'
        },
        {
            slide_number: 4,
            type: 'cta',
            title: 'Ready To Scale Your Earnings?',
            body: 'Save this post for later.\nFollow for weekly actionable freelancing strategies!',
            badge: 'SAVE & SHARE'
        }
    ]);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        try {
            const results = await AIService.generateCarouselContent(topic.trim(), tone, 6);
            setPreviewSlides(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOpenInStudio = () => {
        setSlides(previewSlides);
        navigateToStudio();
    };

    return (
        <section className="landing-demo-section" id="demo">
            <div className="landing-section-header">
                <span className="section-pill">LIVE PLAYGROUND</span>
                <h2 className="section-title">Experience The Free AI Copywriter</h2>
                <p className="section-subtitle">
                    Type any topic or click a suggested prompt to see how CarouselX crafts viral slide copy in seconds.
                </p>
            </div>

            <div className="demo-box-card">
                {/* Prompt Controls */}
                <div className="demo-controls">
                    <div className="demo-chips">
                        <span className="chips-label">Popular Prompts:</span>
                        {SUGGESTIONS.map((s, idx) => (
                            <button
                                key={idx}
                                className={`demo-chip ${topic === s ? 'active' : ''}`}
                                onClick={() => setTopic(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="demo-input-row">
                        <input
                            type="text"
                            className="demo-input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter any topic, keyword, or guide title..."
                        />
                        <select
                            className="demo-select"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                        >
                            <option value="english">English (Professional)</option>
                            <option value="hinglish">Roman Urdu / Hinglish</option>
                            <option value="bilingual">Bilingual (English + Urdu)</option>
                        </select>
                        <button
                            className="demo-gen-btn"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i> Writing...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-wand-magic-sparkles"></i> Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Live Preview Cards Grid */}
                <div className="demo-slides-grid">
                    {previewSlides.map((slide, i) => (
                        <div key={i} className={`demo-slide-card ${slide.type}`}>
                            <div className="demo-slide-header">
                                <span className="demo-slide-badge">{slide.badge || `SLIDE ${i + 1}`}</span>
                                <span className="demo-slide-num">#{i + 1}</span>
                            </div>
                            <h3 className="demo-slide-title">{slide.title}</h3>
                            <p className="demo-slide-body">
                                {slide.type === 'title' ? slide.subtitle : slide.body}
                            </p>
                            <div className="demo-slide-footer">
                                <span className="demo-slide-tag">{slide.type.toUpperCase()}</span>
                                <span className="demo-slide-arrow">➤</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Banner */}
                <div className="demo-cta-footer">
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: 'white' }}>
                            Like these slides? Edit them on canvas & export as PDF!
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                            Switch templates, adjust colors, modify branding, and download 1080p PDF in 1 click.
                        </div>
                    </div>
                    <button className="demo-open-studio-btn" onClick={handleOpenInStudio}>
                        <i className="fa-solid fa-arrow-right"></i> Open In Studio & Export
                    </button>
                </div>
            </div>
        </section>
    );
};
