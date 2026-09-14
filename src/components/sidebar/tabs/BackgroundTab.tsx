import React from 'react';
import { useCarousel } from '../../../context/CarouselContext';

const GRADIENTS: [string, string][] = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
    ['#FF7E5F', '#FEB47B'],
    ['#0F2027', '#2C5364']
];

export const BackgroundTab: React.FC = () => {
    const { setCustomBgGradient, setCustomBgColor, setCustomTextColor } = useCarousel();

    const handleApplyGradient = (g: [string, string]) => {
        setCustomBgGradient(g);
        setCustomBgColor(null);
        setCustomTextColor('#FFFFFF'); // Set light text for dark/colorful gradients
    };

    return (
        <div className="tab-panel active" id="tab-background">
            <div className="panel-section">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Gradient Presets</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Click any gradient preset to instantly apply high-contrast background to your carousel:
                </p>
                <div className="color-grid">
                    {GRADIENTS.map((g, idx) => (
                        <div
                            key={idx}
                            className="color-swatch"
                            style={{
                                background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`
                            }}
                            onClick={() => handleApplyGradient(g)}
                            title={`Gradient ${g[0]} to ${g[1]}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
