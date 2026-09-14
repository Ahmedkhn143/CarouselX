import React from 'react';

const FEATURES = [
    {
        icon: 'fa-wand-magic-sparkles',
        color: '#7C3AED',
        bg: '#EDE9FE',
        title: 'Free Built-In AI Copywriter',
        desc: 'Zero-configuration AI that turns any prompt into a copywritten 6 to 10-slide carousel. No credit card or paid API key required.'
    },
    {
        icon: 'fa-file-pdf',
        color: '#EF4444',
        bg: '#FEE2E2',
        title: '1-Click LinkedIn Document PDF',
        desc: 'Compiles all slides into a pixel-perfect multi-page PDF formatted precisely for LinkedIn Document Posts, driving 3x higher organic reach.'
    },
    {
        icon: 'fa-palette',
        color: '#3B82F6',
        bg: '#DBEAFE',
        title: '8+ Handcrafted Designer Themes',
        desc: 'From high-contrast Dark Premium and Sunset Gradients to clean Minimal and Pakistan Green. Switch styles in 1 click.'
    },
    {
        icon: 'fa-arrow-pointer',
        color: '#10B981',
        bg: '#D1FAE5',
        title: 'Interactive Fabric.js Canvas',
        desc: 'Direct inline text editing, live scaling, geometric accent shapes, and step counter badges. Drag, drop, and customize effortlessly.'
    },
    {
        icon: 'fa-language',
        color: '#F59E0B',
        bg: '#FEF3C7',
        title: 'Urdu & Hinglish Copywriting',
        desc: 'Tailored for Pakistani and South Asian creators. Full support for Nastaliq script and conversational Roman Urdu that connects deeply.'
    },
    {
        icon: 'fa-id-badge',
        color: '#EC4899',
        bg: '#FCE7F3',
        title: 'Custom Creator Branding',
        desc: 'Seamlessly imprint your name, social handle, and custom brand colors on every slide footer so your content is always attributed.'
    }
];

export const FeaturesSection: React.FC = () => {
    return (
        <section className="landing-features-section" id="features">
            <div className="landing-section-header">
                <span className="section-pill">POWERFUL CAPABILITIES</span>
                <h2 className="section-title">Everything You Need To Go Viral</h2>
                <p className="section-subtitle">
                    Crafted specifically for marketers, freelancers, agency owners, and LinkedIn thought leaders.
                </p>
            </div>

            <div className="features-grid">
                {FEATURES.map((f, i) => (
                    <div key={i} className="feature-card">
                        <div className="feature-icon-wrap" style={{ background: f.bg, color: f.color }}>
                            <i className={`fa-solid ${f.icon}`}></i>
                        </div>
                        <h3 className="feature-title">{f.title}</h3>
                        <p className="feature-desc">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
