import React from 'react';
import { useCarousel } from '../context/CarouselContext';
import { CarouselXLogo } from './common/CarouselXLogo';

interface HeaderProps {
    onExportPdf: () => void;
    onExportPng: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportPdf, onExportPng }) => {
    const { setIsApiKeyModalOpen, saveDraft, navigateToLanding } = useCarousel();

    return (
        <header className="top-header">
            <div className="header-left">
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    onClick={navigateToLanding}
                    title="Back to CarouselX Home"
                >
                    <CarouselXLogo size={36} />
                    <div className="logo-text">
                        Carousel<span>X</span>
                    </div>
                </div>
                <button
                    className="header-btn"
                    onClick={navigateToLanding}
                    style={{ padding: '6px 12px', fontSize: '12px', background: 'transparent' }}
                    title="Return to Landing Page"
                >
                    <i className="fa-solid fa-house"></i> Home
                </button>
                <span className="logo-tag-badge">
                    <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '10px' }}></i> STUDIO
                </span>
            </div>
            <div className="header-right">
                <button
                    className="header-btn"
                    id="btn-api-settings"
                    onClick={() => setIsApiKeyModalOpen(true)}
                    title="Configure Claude API Key"
                >
                    <i className="fa-solid fa-key"></i> API Key
                </button>
                <button
                    className="header-btn accent-outline"
                    id="btn-save-draft"
                    onClick={saveDraft}
                    title="Save current carousel draft"
                >
                    <i className="fa-solid fa-bookmark"></i> Save Draft
                </button>
                <button
                    className="header-btn"
                    onClick={onExportPng}
                    title="Download current slide as PNG image"
                >
                    <i className="fa-solid fa-image"></i> PNG
                </button>
                <button
                    className="header-btn primary"
                    id="btn-download"
                    onClick={onExportPdf}
                    title="Download entire carousel as multi-page PDF for LinkedIn"
                >
                    <i className="fa-solid fa-download"></i> Download PDF
                </button>
            </div>
        </header>
    );
};
