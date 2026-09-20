import React, { useRef, useState } from 'react';
import { useCarousel } from '../../../context/CarouselContext';

interface BgPreset {
    id: string;
    name: string;
    category: string;
    url: string;
}

const CURATED_BACKGROUNDS: BgPreset[] = [
    {
        id: 'cyberpunk-mesh',
        name: 'Cyberpunk Glow',
        category: 'Trending',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'dark-tech-grid',
        name: 'Tech Matrix',
        category: 'Viral',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'neon-waves',
        name: '3D Fluid Silk',
        category: 'Modern',
        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'cosmic-aura',
        name: 'Cosmic Nebula',
        category: 'Aesthetic',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'studio-noir',
        name: 'Moody Studio Noir',
        category: 'Minimal',
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'emerald-luxury',
        name: 'Emerald Velvet',
        category: 'Luxury',
        url: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'charcoal-grain',
        name: 'Charcoal Minimal',
        category: 'Minimal',
        url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1080&q=80'
    },
    {
        id: 'circuit-glow',
        name: 'Circuit Glow',
        category: 'Tech',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80'
    }
];

const GRADIENTS: [string, string][] = [
    ['#0F2027', '#2C5364'],
    ['#111827', '#312E81'],
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#FF7E5F', '#FEB47B']
];

const OVERLAY_COLORS = [
    { label: 'Pitch Black', value: '#000000' },
    { label: 'Midnight Navy', value: '#050D1A' },
    { label: 'Deep Indigo', value: '#130A2A' },
    { label: 'Forest Noir', value: '#041810' }
];

export const BackgroundTab: React.FC = () => {
    const {
        slides,
        currentSlideIndex,
        customBgImage,
        bgOverlayOpacity,
        bgOverlayColor,
        setBgOverlayOpacity,
        setBgOverlayColor,
        applyBgImageToSlide,
        applyBgImageToAll,
        setCustomBgGradient,
        setCustomBgColor,
        setCustomTextColor,
        showToast
    } = useCarousel();

    const [applyScope, setApplyScope] = useState<'all' | 'current'>('all');
    const [customUrlInput, setCustomUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const currentSlide = slides[currentSlideIndex];
    const activeSlideBgImage = currentSlide?.bgImage || customBgImage;
    const activeOpacity = currentSlide?.bgOverlayOpacity !== undefined 
        ? currentSlide.bgOverlayOpacity 
        : bgOverlayOpacity;

    const handleSelectPreset = (url: string) => {
        if (applyScope === 'all') {
            applyBgImageToAll(url);
        } else {
            applyBgImageToSlide(currentSlideIndex, url);
        }
        setCustomTextColor('#FFFFFF'); // High contrast white text for darkened images
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (PNG, JPG, WEBP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
            const dataUrl = loadEvt.target?.result as string;
            if (dataUrl) {
                if (applyScope === 'all') {
                    applyBgImageToAll(dataUrl);
                } else {
                    applyBgImageToSlide(currentSlideIndex, dataUrl);
                }
                setCustomTextColor('#FFFFFF');
                showToast('Custom image background loaded successfully!');
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleApplyCustomUrl = () => {
        if (!customUrlInput.trim()) return;
        if (applyScope === 'all') {
            applyBgImageToAll(customUrlInput.trim());
        } else {
            applyBgImageToSlide(currentSlideIndex, customUrlInput.trim());
        }
        setCustomTextColor('#FFFFFF');
        setCustomUrlInput('');
    };

    const handleClearBackground = () => {
        if (applyScope === 'all') {
            applyBgImageToAll(null);
        } else {
            applyBgImageToSlide(currentSlideIndex, null);
        }
    };

    const handleOpacityChange = (val: number) => {
        setBgOverlayOpacity(val);
        if (applyScope === 'current') {
            applyBgImageToSlide(currentSlideIndex, activeSlideBgImage, val);
        }
    };

    const handleApplyGradient = (g: [string, string]) => {
        if (applyScope === 'all') {
            applyBgImageToAll(null);
        } else {
            applyBgImageToSlide(currentSlideIndex, null);
        }
        setCustomBgGradient(g);
        setCustomBgColor(null);
        setCustomTextColor('#FFFFFF');
    };

    return (
        <div className="tab-panel active" id="tab-background" style={{ paddingBottom: '30px' }}>
            {/* 1. Scope Selection */}
            <div className="panel-section" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                    Apply Background To
                </label>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button
                        type="button"
                        onClick={() => setApplyScope('all')}
                        style={{
                            flex: 1,
                            padding: '8px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            border: applyScope === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: applyScope === 'all' ? 'var(--primary-light, #EEF2FF)' : 'var(--card-bg, #FFFFFF)',
                            color: applyScope === 'all' ? 'var(--primary)' : 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <i className="fa-solid fa-layer-group"></i> All Slides
                    </button>
                    <button
                        type="button"
                        onClick={() => setApplyScope('current')}
                        style={{
                            flex: 1,
                            padding: '8px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            border: applyScope === 'current' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: applyScope === 'current' ? 'var(--primary-light, #EEF2FF)' : 'var(--card-bg, #FFFFFF)',
                            color: applyScope === 'current' ? 'var(--primary)' : 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <i className="fa-solid fa-file"></i> Slide #{currentSlideIndex + 1} Only
                    </button>
                </div>
            </div>

            {/* 2. Active Background Status & Reset */}
            {activeSlideBgImage && (
                <div className="panel-section" style={{
                    marginBottom: '16px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            <i className="fa-solid fa-image"></i> Active Image Background
                        </span>
                        <button
                            type="button"
                            onClick={handleClearBackground}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#EF4444',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            title="Remove background image"
                        >
                            <i className="fa-solid fa-trash-can"></i> Remove
                        </button>
                    </div>

                    {/* Dimmer Slider */}
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                            <span>Dark Dimmer Overlay</span>
                            <span style={{ color: 'var(--primary)' }}>{Math.round(activeOpacity * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.05"
                            value={activeOpacity}
                            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            <span>Brighter (10%)</span>
                            <span>Standard (65%)</span>
                            <span>Darker (90%)</span>
                        </div>
                    </div>

                    {/* Overlay Color Picker */}
                    <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Overlay Tint</span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            {OVERLAY_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setBgOverlayColor(c.value)}
                                    title={c.label}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: c.value,
                                        border: bgOverlayColor === c.value ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        outline: bgOverlayColor === c.value ? '2px solid rgba(99, 102, 241, 0.4)' : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Upload Custom Image */}
            <div className="panel-section" style={{ marginBottom: '18px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                    Upload Custom Background
                </h3>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '1.5px dashed var(--primary)',
                        borderRadius: '10px',
                        backgroundColor: 'var(--card-bg, #FAFAFA)',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    Choose Local Image File
                </button>

                {/* Paste URL */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <input
                        type="text"
                        placeholder="Paste image URL (Unsplash / Pexels)..."
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomUrl()}
                        style={{
                            flex: 1,
                            padding: '8px 10px',
                            fontSize: '11px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        style={{
                            padding: '8px 12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            cursor: 'pointer'
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* 4. Curated Viral Background Textures */}
            <div className="panel-section" style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700 }}>
                        🔥 Trending Viral Backgrounds
                    </h3>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309' }}>
                        1M+ AESTHETIC
                    </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    High-contrast textures used by top creators:
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px'
                }}>
                    {CURATED_BACKGROUNDS.map((preset) => (
                        <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset.url)}
                            style={{
                                position: 'relative',
                                height: '80px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: activeSlideBgImage === preset.url ? '2.5px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)',
                                boxShadow: activeSlideBgImage === preset.url ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
                                transition: 'transform 0.15s, box-shadow 0.15s'
                            }}
                        >
                            <img
                                src={preset.url}
                                alt={preset.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.7)'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '4px 6px',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                color: '#FFFFFF',
                                fontSize: '10px',
                                fontWeight: 700,
                                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                            }}>
                                {preset.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Gradient Presets */}
            <div className="panel-section">
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                    Vibrant Gradients
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Click to switch back to sleek vector gradients:
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
