import React from 'react';
import { useCarousel } from '../../../context/CarouselContext';

export const ElementsTab: React.FC = () => {
    const {
        showDecorations,
        setShowDecorations,
        showCounter,
        setShowCounter,
        showBranding,
        setShowBranding
    } = useCarousel();

    return (
        <div className="tab-panel active" id="tab-elements">
            <div className="panel-section">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Design Elements</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Fine-tune the geometric accents, slide numbers, and footer metadata.
                </p>

                <div className="toggle-row">
                    <label>Background Shapes / Accents</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showDecorations}
                            onChange={(e) => setShowDecorations(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="toggle-row" style={{ marginTop: '12px' }}>
                    <label>Slide Counter Badge</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showCounter}
                            onChange={(e) => setShowCounter(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="toggle-row" style={{ marginTop: '12px' }}>
                    <label>Creator Branding Footer</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showBranding}
                            onChange={(e) => setShowBranding(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};
