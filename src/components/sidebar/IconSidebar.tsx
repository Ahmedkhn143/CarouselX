import React from 'react';
import { useCarousel } from '../../context/CarouselContext';
import type { TabType } from '../../types/carousel';

export const IconSidebar: React.FC = () => {
    const { activeTab, setActiveTab } = useCarousel();

    const tabs: { id: TabType; title: string; icon: string }[] = [
        { id: 'tab-ai', title: 'AI Generator', icon: 'fa-wand-magic-sparkles' },
        { id: 'tab-template', title: 'Templates', icon: 'fa-palette' },
        { id: 'tab-text', title: 'Text & Content', icon: 'fa-font' },
        { id: 'tab-background', title: 'Backgrounds', icon: 'fa-image' },
        { id: 'tab-elements', title: 'Design Elements', icon: 'fa-shapes' },
        { id: 'tab-settings', title: 'Settings', icon: 'fa-sliders' },
    ];

    return (
        <nav className="icon-sidebar">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`icon-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.title}
                >
                    <i className={`fa-solid ${tab.icon}`}></i>
                </button>
            ))}
        </nav>
    );
};
