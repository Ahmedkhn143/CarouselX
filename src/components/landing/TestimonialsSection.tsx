import React from 'react';

const TESTIMONIALS = [
    {
        name: 'Hamza Tariq',
        role: 'Top LinkedIn Voice & Growth Marketer',
        avatar: 'HT',
        text: 'CarouselX cut my weekly content creation time from 3 hours down to 5 minutes. The PDF export formatting is crisp and works flawlessly on LinkedIn.'
    },
    {
        name: 'Ayesha Malik',
        role: 'B2B Freelance Copywriter',
        avatar: 'AM',
        text: 'The Roman Urdu & Bilingual tone options are an absolute superpower. My carousels connect so much deeper with local tech & founder communities.'
    },
    {
        name: 'Bilal Ahmed',
        role: 'SaaS Founder & Creator',
        avatar: 'BA',
        text: 'Finally, an AI carousel maker where you do not need an expensive paid subscription or private API keys just to test it out. It just works out of the box.'
    }
];

export const TestimonialsSection: React.FC = () => {
    return (
        <section className="landing-testimonials-section">
            <div className="landing-section-header">
                <span className="section-pill">TESTIMONIALS</span>
                <h2 className="section-title">Loved by 1,000+ Creators</h2>
                <p className="section-subtitle">
                    Here is how top creators and professionals are accelerating their personal brands with CarouselX.
                </p>
            </div>

            <div className="testimonials-grid">
                {TESTIMONIALS.map((t, idx) => (
                    <div key={idx} className="testimonial-card">
                        <div className="testimonial-stars">
                            {'★'.repeat(5)}
                        </div>
                        <p className="testimonial-text">"{t.text}"</p>
                        <div className="testimonial-author">
                            <div className="author-avatar">{t.avatar}</div>
                            <div>
                                <div className="author-name">{t.name}</div>
                                <div className="author-role">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
