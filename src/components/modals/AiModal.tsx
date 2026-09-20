import React, { useState, useEffect } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { AIService } from '../../services/aiService';
import { StorageService, type AIProvider } from '../../services/storageService';

const TRENDING_TOPICS = [
    'Top 5 High-Income AI Skills in 2026',
    'How to Land $3,000/mo Freelance Clients',
    'The 3-Second Hook Formula for LinkedIn',
    '5 Costly Personal Branding Mistakes to Avoid',
    'Daily Deep Work Habits of Top 1% Creators',
    'Cold Outreach Blueprint That Gets 40% Replies'
];

export const AiModal: React.FC = () => {
    const {
        isAiModalOpen,
        setIsAiModalOpen,
        setIsApiKeyModalOpen,
        setSlides,
        setCurrentSlideIndex,
        setIsLoading,
        showToast
    } = useCarousel();

    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('english');
    const [slideCount, setSlideCount] = useState(6);
    const [activeProvider, setActiveProvider] = useState<AIProvider>('gemini');
    const [hasKeyConfigured, setHasKeyConfigured] = useState(false);

    useEffect(() => {
        if (isAiModalOpen) {
            const provider = StorageService.getAiProvider();
            setActiveProvider(provider);

            const hasGemini = !!StorageService.getGeminiApiKey();
            const hasGroq = !!StorageService.getGroqApiKey();
            const hasClaude = !!StorageService.getApiKey();

            setHasKeyConfigured(
                (provider === 'gemini' && hasGemini) ||
                (provider === 'groq' && hasGroq) ||
                (provider === 'claude' && hasClaude) ||
                hasGemini || hasGroq
            );
        }
    }, [isAiModalOpen]);

    if (!isAiModalOpen) return null;

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert('Please enter a carousel topic or select one of the trending ideas!');
            return;
        }

        setIsAiModalOpen(false);
        setIsLoading(true, 'Synthesizing viral carousel copy with AI...');

        try {
            const newSlides = await AIService.generateCarouselContent(
                topic.trim(),
                tone,
                slideCount
            );
            setSlides(newSlides);
            setCurrentSlideIndex(0);
            showToast(`Generated ${newSlides.length} viral slides!`);
        } catch (err: any) {
            console.error('Generation failure:', err);
            alert('AI Generation Error: ' + (err.message || 'Failed to generate carousel.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setIsAiModalOpen(false)}>
            <div className="modal ai-gen-modal" style={{ maxWidth: '620px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span className="step-indicator">VIRAL AI GENERATOR</span>
                            {hasKeyConfigured ? (
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
                                    <i className="fa-solid fa-circle-check" style={{ fontSize: '10px' }}></i>
                                    {activeProvider === 'gemini' ? 'Google Gemini 2.0 (Free Active)' : activeProvider === 'groq' ? 'Groq Llama 3.3 (Free Active)' : 'Claude Active'}
                                </span>
                            ) : (
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        padding: '3px 8px',
                                        borderRadius: '999px',
                                        background: '#FEF3C7',
                                        color: '#D97706',
                                        border: '1px solid #FDE68A',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <i className="fa-solid fa-wand-magic" style={{ fontSize: '10px' }}></i> Smart Niche Engine
                                </span>
                            )}
                        </div>
                        <h3 style={{ marginTop: '8px' }}>Generate High-Converting Carousel</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Create structured, viral carousels designed for maximum saves, swipes & impressions.
                        </p>
                    </div>
                    <button className="modal-close" onClick={() => setIsAiModalOpen(false)}>&times;</button>
                </div>

                {/* Free API Key Banner */}
                {!hasKeyConfigured && (
                    <div
                        style={{
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            marginBottom: '16px',
                            fontSize: '12.5px',
                            color: '#166534',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-bolt" style={{ color: '#059669' }}></i>
                            <span>Tip: Connect a <strong>100% Free Gemini Key</strong> for limitless custom AI power!</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAiModalOpen(false);
                                setIsApiKeyModalOpen(true);
                            }}
                            style={{
                                background: '#059669',
                                color: '#fff',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Set Free Key ↗
                        </button>
                    </div>
                )}

                {/* Topic Input */}
                <div className="form-group">
                    <label>Carousel Topic or Idea</label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. 5 freelancing habits that make $5,000/mo, Top 5 AI tools in 2026, How to build an audience on LinkedIn, Personal branding mistakes to avoid..."
                        rows={3}
                        autoFocus
                    />
                </div>

                {/* Trending Topic Presets */}
                <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        🔥 Trending Idea Starters
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {TRENDING_TOPICS.map((preset, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setTopic(preset)}
                                style={{
                                    fontSize: '11.5px',
                                    padding: '4px 9px',
                                    borderRadius: '999px',
                                    border: '1px solid var(--border-color)',
                                    background: topic === preset ? '#EEF2FF' : 'var(--bg-secondary)',
                                    color: topic === preset ? '#4F46E5' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontWeight: topic === preset ? 600 : 500,
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                            <option value={5}>5 slides (Fast hook + 3 points + CTA)</option>
                            <option value={6}>6 slides (Standard viral format)</option>
                            <option value={8}>8 slides (Comprehensive breakdown)</option>
                            <option value={10}>10 slides (Mega masterclass deck)</option>
                        </select>
                    </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAiModalOpen(false);
                            setIsApiKeyModalOpen(true);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <i className="fa-solid fa-gear"></i> AI Settings
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="header-btn" onClick={() => setIsAiModalOpen(false)}>Cancel</button>
                        <button className="header-btn primary" onClick={handleGenerate}>
                            <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Carousel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
