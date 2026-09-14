import React from 'react';

interface CarouselXLogoProps {
    size?: number;
    className?: string;
}

export const CarouselXLogo: React.FC<CarouselXLogoProps> = ({ size = 36, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(124, 58, 237, 0.28))' }}
        >
            <defs>
                <linearGradient id="cx-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="cx-grad-back" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="cx-grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
            </defs>

            {/* Back Stacked Card (Carousel depth effect) */}
            <rect
                x="14"
                y="3"
                width="26"
                height="32"
                rx="6"
                fill="url(#cx-grad-back)"
                transform="rotate(8 27 19)"
            />

            {/* Middle Card */}
            <rect
                x="8"
                y="5"
                width="27"
                height="33"
                rx="6.5"
                fill="#EDE9FE"
            />

            {/* Front Active Main Card */}
            <rect
                x="4"
                y="7"
                width="28"
                height="34"
                rx="7"
                fill="url(#cx-grad-main)"
            />

            {/* Carousel track indicator dots on top of card */}
            <circle cx="10" cy="13" r="1.5" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="15" cy="13" r="1.5" fill="#FFFFFF" fillOpacity="0.4" />
            <circle cx="20" cy="13" r="1.5" fill="#FFFFFF" fillOpacity="0.4" />

            {/* Dynamic Sharp "X" in center */}
            <path
                d="M11 20L25 34M25 20L11 34"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* High-tech Glowing Sparkle in corner */}
            <path
                d="M34 5L35.2 8.8L39 10L35.2 11.2L34 15L32.8 11.2L29 10L32.8 8.8L34 5Z"
                fill="url(#cx-grad-accent)"
            />
        </svg>
    );
};
