import React from 'react';
import { useCarousel } from '../context/CarouselContext';

interface HeaderProps {
    onExportPdf: () => void;
    onExportPng: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportPdf, onExportPng }) => {
    const { setIsApiKeyModalOpen, saveDraft } = useCarousel();

    return (
        <header className="top-header">
            <div className="header-left">
                <div className="logo-icon">PC</div>
                <div className="logo-text">
                    Pak<span>Carousel</span>
                    <span style={{ fontWeight: 400, fontSize: '12px', color: 'var(--text-muted)' }}>.ai</span>
                </div>
                <span className="pk-flag">🇵🇰 PK</span>
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
