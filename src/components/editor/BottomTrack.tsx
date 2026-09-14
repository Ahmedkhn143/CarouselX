import React from 'react';
import { useCarousel } from '../../context/CarouselContext';

export const BottomTrack: React.FC = () => {
    const {
        slides,
        currentSlideIndex,
        goToSlide,
        addSlide,
        deleteSlide,
        updateCurrentSlide
    } = useCarousel();

    const currentSlide = slides[currentSlideIndex];

    return (
        <div className="bottom-panel">
            <div className="bottom-panel-header">
                <div className="slide-type-tabs">
                    <button
                        className={`slide-type-tab ${currentSlide?.type === 'title' ? 'active' : ''}`}
                        onClick={() => updateCurrentSlide({ type: 'title' })}
                    >
                        <i className="fa-solid fa-heading"></i> Intro
                    </button>
                    <button
                        className={`slide-type-tab ${currentSlide?.type === 'content' ? 'active' : ''}`}
                        onClick={() => updateCurrentSlide({ type: 'content' })}
                    >
                        <i className="fa-solid fa-align-left"></i> Content
                    </button>
                    <button
                        className={`slide-type-tab ${currentSlide?.type === 'cta' ? 'active' : ''}`}
                        onClick={() => updateCurrentSlide({ type: 'cta' })}
                    >
                        <i className="fa-solid fa-bullhorn"></i> Outro (CTA)
                    </button>
                </div>
                <span className="slide-info" id="slide-counter-label">
                    Slide #{currentSlideIndex + 1} of {slides.length}
                </span>
            </div>

            <div className="slides-track" id="slides-track">
                {slides.map((slide, i) => {
                    const isSelected = i === currentSlideIndex;
                    const label = slide.type === 'title' ? 'INTRO' : (slide.type === 'cta' ? 'OUTRO' : `SLIDE ${i + 1}`);

                    return (
                        <div
                            key={i}
                            className={`slide-thumb ${isSelected ? 'active' : ''}`}
                            onClick={() => goToSlide(i)}
                            title={`Go to slide #${i + 1}: ${slide.title || 'Untitled'}`}
                        >
                            {slides.length > 1 && (
                                <button
                                    className="slide-thumb-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSlide(i);
                                    }}
                                    title="Delete this slide"
                                >
                                    &times;
                                </button>
                            )}
                            <div className="slide-thumb-preview">
                                <div className="slide-thumb-num">{i + 1}</div>
                                <div style={{ fontSize: '7px', opacity: 0.7, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65px' }}>
                                    {slide.title || 'Slide'}
                                </div>
                            </div>
                            <div className="slide-thumb-label">{label}</div>
                        </div>
                    );
                })}

                <button
                    className="slide-add-btn"
                    onClick={addSlide}
                    title="Add a new slide to carousel"
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    );
};
