import React, { useState } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { ClaudeService } from '../../services/claudeService';
import { StorageService } from '../../services/storageService';

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

    if (!isAiModalOpen) return null;

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert('Please enter a carousel topic or idea!');
            return;
        }

        const apiKey = StorageService.getApiKey();
        if (!apiKey) {
            setIsAiModalOpen(false);
            setIsApiKeyModalOpen(true);
            showToast("Please enter your Claude API Key first to generate with AI.");
            return;
        }

        setIsAiModalOpen(false);
        setIsLoading(true, 'Generating high-impact carousel slides with Claude AI...');

        try {
            const newSlides = await ClaudeService.generateCarouselContent(
                topic.trim(),
                tone,
                slideCount,
                apiKey
            );
            setSlides(newSlides);
            setCurrentSlideIndex(0);
            showToast(`Successfully generated ${newSlides.length} slides!`);
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
                        <span className="step-indicator">STEP 1 OF 2</span>
                        <h3 style={{ marginTop: '8px' }}>Generate Content With AI</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Create tailored carousel copy instantly for LinkedIn & Instagram in Pakistan.
                        </p>
                    </div>
                    <button className="modal-close" onClick={() => setIsAiModalOpen(false)}>&times;</button>
                </div>

                <div className="form-group">
                    <label>Carousel Topic</label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. 5 essential freelancing tips for Pakistani youth, Ramadan productivity hacks, morning routine for entrepreneurs, remote work salary negotiation..."
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label>Language / Tone</label>
                    <select
                        className="platform-select"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                    >
                        <option value="english">English (Professional LinkedIn Growth)</option>
                        <option value="hinglish">Roman Urdu / Hinglish (Conversational PK)</option>
                        <option value="bilingual">Bilingual English + Urdu Script</option>
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
                        <option value={8}>8 slides (In-depth guide)</option>
                        <option value={10}>10 slides (Ultimate mega carousel)</option>
                    </select>
                </div>

                <div className="modal-footer">
                    <button className="header-btn" onClick={() => setIsAiModalOpen(false)}>Cancel</button>
                    <button className="header-btn primary" onClick={handleGenerate}>
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Carousel
                    </button>
                </div>
            </div>
        </div>
    );
};
