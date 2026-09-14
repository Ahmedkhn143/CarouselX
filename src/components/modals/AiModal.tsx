import React, { useState, useEffect } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storageService';

export const AiModal: React.FC = () => {
    const {
        isAiModalOpen,
        setIsAiModalOpen,
        setSlides,
        setCurrentSlideIndex,
        setIsLoading,
        showToast
    } = useCarousel();

    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('english');
    const [slideCount, setSlideCount] = useState(6);
    const [hasCustomKey, setHasCustomKey] = useState(false);
    const [useCustomKey, setUseCustomKey] = useState(false);

    useEffect(() => {
        const key = StorageService.getApiKey();
        if (key && key.startsWith('sk-ant-')) {
            setHasCustomKey(true);
            setUseCustomKey(true);
        }
    }, [isAiModalOpen]);

    if (!isAiModalOpen) return null;

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert('Please enter a carousel topic or idea!');
            return;
        }

        setIsAiModalOpen(false);
        setIsLoading(true, 'Generating high-impact carousel slides with AI...');

        try {
            const apiKey = useCustomKey ? StorageService.getApiKey() : undefined;
            const newSlides = await AIService.generateCarouselContent(
                topic.trim(),
                tone,
                slideCount,
                apiKey
            );
            setSlides(newSlides);
            setCurrentSlideIndex(0);
            showToast(`Generated ${newSlides.length} slides with AI!`);
        } catch (err: any) {
            alert('AI Generation Error: ' + (err.message || 'Failed to generate carousel.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setIsAiModalOpen(false)}>
            <div className="modal ai-gen-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="step-indicator">AI GENERATOR</span>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    borderRadius: '999px',
                                    background: '#ECFDF5',
                                    color: '#059669',
                                    border: '1px solid #A7F3D0',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <i className="fa-solid fa-bolt" style={{ fontSize: '10px' }}></i> Free AI Included
                            </span>
                        </div>
                        <h3 style={{ marginTop: '8px' }}>Generate Carousel With AI</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Instantly create structured, copywritten carousels for LinkedIn & Instagram.
                        </p>
                    </div>
                    <button className="modal-close" onClick={() => setIsAiModalOpen(false)}>&times;</button>
                </div>

                <div className="form-group">
                    <label>Carousel Topic or Idea</label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. 5 freelancing habits that make $5,000/mo, Ramadan productivity hacks, how to build an audience on LinkedIn, personal branding mistakes to avoid..."
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label>Language & Tone</label>
                    <select
                        className="platform-select"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                    >
                        <option value="english">English (Professional LinkedIn Growth)</option>
                        <option value="hinglish">Roman Urdu / Hinglish (Conversational PK)</option>
                        <option value="bilingual">Bilingual (English + Urdu Script)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Number of Slides</label>
                    <select
                        className="platform-select"
                        value={slideCount}
                        onChange={(e) => setSlideCount(Number(e.target.value))}
                    >
                        <option value={6}>6 slides (Hook + 4 Actionable Points + CTA)</option>
                        <option value={8}>8 slides (Comprehensive breakdown)</option>
                        <option value={10}>10 slides (Mega masterclass deck)</option>
                    </select>
                </div>

                {hasCustomKey && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <input
                            type="checkbox"
                            id="use-custom-key"
                            checked={useCustomKey}
                            onChange={(e) => setUseCustomKey(e.target.checked)}
                        />
                        <label htmlFor="use-custom-key" style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            Use my custom Anthropic Claude API Key (optional)
                        </label>
                    </div>
                )}

                <div className="modal-footer">
                    <button className="header-btn" onClick={() => setIsAiModalOpen(false)}>Cancel</button>
                    <button className="header-btn primary" onClick={handleGenerate}>
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Slides
                    </button>
                </div>
            </div>
        </div>
    );
};
