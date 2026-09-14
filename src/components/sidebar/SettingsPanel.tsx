import React from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { AiTab } from './tabs/AiTab';
import { TemplatesTab } from './tabs/TemplatesTab';
import { TextContentTab } from './tabs/TextContentTab';
import { BackgroundTab } from './tabs/BackgroundTab';
import { ElementsTab } from './tabs/ElementsTab';
import { SettingsTab } from './tabs/SettingsTab';

export const SettingsPanel: React.FC = () => {
    const { activeTab } = useCarousel();

    return (
        <aside className="settings-panel">
            {activeTab === 'tab-ai' && <AiTab />}
            {activeTab === 'tab-template' && <TemplatesTab />}
            {activeTab === 'tab-text' && <TextContentTab />}
            {activeTab === 'tab-background' && <BackgroundTab />}
            {activeTab === 'tab-elements' && <ElementsTab />}
            {activeTab === 'tab-settings' && <SettingsTab />}
        </aside>
    );
};
