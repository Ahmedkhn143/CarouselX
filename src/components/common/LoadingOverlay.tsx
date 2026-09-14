import React from 'react';
import { useCarousel } from '../../context/CarouselContext';

export const LoadingOverlay: React.FC = () => {
    const { isLoading, loadingMessage } = useCarousel();

    if (!isLoading) return null;

    return (
        <div className="loading-overlay active">
            <div className="loader-ring"></div>
            <div className="loader-text">{loadingMessage}</div>
            <div className="loader-sub">This may take a few moments...</div>
        </div>
    );
};
