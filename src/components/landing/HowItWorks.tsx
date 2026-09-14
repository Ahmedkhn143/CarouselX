import React from 'react';

const STEPS = [
    {
        num: '01',
        icon: 'fa-wand-magic-sparkles',
        title: 'Prompt The Free AI Copywriter',
        desc: 'Enter any topic, advice, or article excerpt. Choose English, Roman Urdu, or Bilingual. The AI generates hooks, actionable body copy, and CTAs.'
    },
    {
        num: '02',
        icon: 'fa-sliders',
        title: 'Customize Design & Branding',
        desc: 'Pick a template, choose your brand colors, customize fonts, toggle background accents, and personalize your creator footer.'
    },
    {
        num: '03',
        icon: 'fa-cloud-arrow-down',
        title: 'Export Multi-Page PDF & Post',
        desc: 'Download your carousel as a crisp, 1080p multi-page PDF document. Upload it straight to LinkedIn to enjoy 3x more algorithmic distribution.'
    }
];

export const HowItWorks: React.FC = () => {
    return (
        <section className="landing-how-section" id="how-it-works">
            <div className="landing-section-header">
                <span className="section-pill">HOW IT WORKS</span>
                <h2 className="section-title">Create A Carousel In 3 Simple Steps</h2>
                <p className="section-subtitle">
                    From blank page to viral carousel post in under 2 minutes.
                </p>
            </div>

            <div className="how-steps-grid">
                {STEPS.map((s, idx) => (
                    <div key={idx} className="how-step-card">
                        <div className="how-step-num">{s.num}</div>
                        <div className="how-icon-wrap">
                            <i className={`fa-solid ${s.icon}`}></i>
                        </div>
                        <h3 className="how-step-title">{s.title}</h3>
                        <p className="how-step-desc">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
