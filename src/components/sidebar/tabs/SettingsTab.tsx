import React, { useState, useEffect } from 'react';
import { StorageService } from '../../../services/storageService';
import { useCarousel } from '../../../context/CarouselContext';

export const SettingsTab: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const { showToast } = useCarousel();

    useEffect(() => {
        setApiKey(StorageService.getApiKey());
    }, []);

    const handleSaveKey = (e: React.FormEvent) => {
        e.preventDefault();
        StorageService.setApiKey(apiKey.trim());
        showToast("Claude API key updated successfully!");
    };

    return (
        <div className="tab-panel active" id="tab-settings">
            <div className="panel-section">
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>App & AI Settings</h3>

                <form onSubmit={handleSaveKey}>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label>Claude API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-ant-api03-..."
                        />
                        <span className="helper-label">
                            Key is stored in your local browser only. Never shared or sent to any intermediary server.
                        </span>
                    </div>
                    <button type="submit" className="header-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <i className="fa-solid fa-save"></i> Save Key
                    </button>
                </form>

                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Target Audience Tone</label>
                    <select className="platform-select" defaultValue="english">
                        <option value="english">English (Professional LinkedIn)</option>
                        <option value="hinglish">Roman Urdu / Hinglish (Casual PK)</option>
                        <option value="bilingual">Bilingual (English + Urdu Script)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
