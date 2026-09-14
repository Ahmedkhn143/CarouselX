import React from 'react';
import { useCarousel } from '../../context/CarouselContext';

export const Toast: React.FC = () => {
    const { toastMessage } = useCarousel();

    if (!toastMessage) return null;

    return (
        <div className="toast-banner">
            <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i>
            <span>{toastMessage}</span>
        </div>
    );
};
