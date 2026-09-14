import React, { useState } from 'react';

const FAQS = [
    {
        q: 'Is CarouselX really free to use?',
        a: 'Yes! CarouselX comes with a free built-in AI copywriting engine that generates structured slide decks at zero cost. There are no credit cards, subscriptions, or paywalls.'
    },
    {
        q: 'Do I need an Anthropic Claude API key?',
        a: 'No. The built-in free AI works automatically out of the box. If you do happen to have your own Anthropic Claude API key and wish to connect directly to Claude 3.5 Sonnet, you can optionally enter it in App Settings.'
    },
    {
        q: 'How do I upload the carousel to LinkedIn?',
        a: 'Click "Download PDF" in the header to export your multi-page PDF. Then go to LinkedIn, click "Start a post", select the document/paperclip icon ("Add a document"), choose your PDF, add a title, and publish. LinkedIn converts the PDF into an interactive swipeable carousel!'
    },
    {
        q: 'Can I customize colors, fonts, and branding?',
        a: 'Yes! You can choose from 8+ curated template presets, pick any custom background/text/accent color with live color pickers, select from serif, sans-serif, and condensed fonts, and customize your creator watermark.'
    },
    {
        q: 'Are my carousel drafts saved automatically?',
        a: 'Yes. CarouselX saves your current work in your browser’s local storage. You can also click "Save Draft" anytime to ensure your progress is preserved.'
    }
];

export const FaqSection: React.FC = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggle = (i: number) => {
        setOpenIdx(prev => (prev === i ? null : i));
    };

    return (
        <section className="landing-faq-section" id="faq">
            <div className="landing-section-header">
                <span className="section-pill">FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="section-title">Got Questions? We Have Answers</h2>
                <p className="section-subtitle">
                    Everything you need to know about creating viral carousels with CarouselX.
                </p>
            </div>

            <div className="faq-accordion-list">
                {FAQS.map((faq, i) => {
                    const isOpen = openIdx === i;
                    return (
                        <div key={i} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                            <button className="faq-question-btn" onClick={() => toggle(i)}>
                                <span>{faq.q}</span>
                                <i className={`fa-solid fa-chevron-down faq-chevron ${isOpen ? 'rotated' : ''}`}></i>
                            </button>
                            {isOpen && (
                                <div className="faq-answer-content">
                                    <p>{faq.a}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
