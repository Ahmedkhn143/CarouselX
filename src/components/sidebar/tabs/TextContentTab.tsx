import React from 'react';
import { useCarousel } from '../../../context/CarouselContext';

export const TextContentTab: React.FC = () => {
    const { slides, currentSlideIndex, updateCurrentSlide } = useCarousel();
    const currentSlide = slides[currentSlideIndex];

    if (!currentSlide) {
        return (
            <div className="tab-panel active" id="tab-text">
                <div className="panel-section">
                    <p>No slide selected.</p>
                </div>
            </div>
        );
    }

    const isTitle = currentSlide.type === 'title';

    return (
        <div className="tab-panel active" id="tab-text">
            <div className="panel-section">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Edit Slide #{currentSlideIndex + 1} Content</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    You can edit slide text directly on the canvas or type in these fields:
                </p>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Badge / Step Label</label>
                    <input
                        type="text"
                        value={currentSlide.badge || ''}
                        onChange={(e) => updateCurrentSlide({ badge: e.target.value })}
                        placeholder="e.g. STEP 1, TIP #2, HOOK"
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Slide Title</label>
                    <input
                        type="text"
                        value={currentSlide.title || ''}
                        onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                        placeholder="Enter headline..."
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>{isTitle ? 'Subtitle / Hook' : 'Slide Body Content'}</label>
                    <textarea
                        value={isTitle ? (currentSlide.subtitle || '') : (currentSlide.body || '')}
                        onChange={(e) => {
                            if (isTitle) {
                                updateCurrentSlide({ subtitle: e.target.value });
                            } else {
                                updateCurrentSlide({ body: e.target.value });
                            }
                        }}
                        placeholder="Enter description text..."
                    />
                </div>

                <div className="form-group">
                    <label>Slide Type</label>
                    <select
                        className="platform-select"
                        value={currentSlide.type}
                        onChange={(e) => updateCurrentSlide({ type: e.target.value as any })}
                    >
                        <option value="title">Title / Cover Slide</option>
                        <option value="content">Content / Tip Slide</option>
                        <option value="cta">Call-To-Action (Outro) Slide</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
