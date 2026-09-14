import React, { useState, useEffect } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { StorageService } from '../../services/storageService';

export const ApiKeyModal: React.FC = () => {
    const { isApiKeyModalOpen, setIsApiKeyModalOpen, showToast } = useCarousel();
    const [key, setKey] = useState('');

    useEffect(() => {
        if (isApiKeyModalOpen) {
            setKey(StorageService.getApiKey());
        }
    }, [isApiKeyModalOpen]);

    if (!isApiKeyModalOpen) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        StorageService.setApiKey(key.trim());
        setIsApiKeyModalOpen(false);
        showToast("Claude API key saved successfully!");
    };

    return (
        <div className="modal-overlay" onClick={() => setIsApiKeyModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Claude API Configuration</h3>
                    <button className="modal-close" onClick={() => setIsApiKeyModalOpen(false)}>&times;</button>
                </div>

                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Anthropic Claude API Key</label>
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="sk-ant-api03-..."
                            autoFocus
                        />
                        <span className="helper-label">
                            Your key is stored locally in your browser. We connect directly to Anthropic — your key never leaves your device or browser storage.
                        </span>
                    </div>

                    <div className="modal-footer" style={{ marginTop: '20px' }}>
                        <button
                            type="button"
                            className="header-btn"
                            onClick={() => setIsApiKeyModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="header-btn primary">
                            <i className="fa-solid fa-save"></i> Save API Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
