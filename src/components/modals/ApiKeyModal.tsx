import React, { useState, useEffect } from 'react';
import { useCarousel } from '../../context/CarouselContext';
import { StorageService, type AIProvider } from '../../services/storageService';
import { AIService } from '../../services/aiService';

export const ApiKeyModal: React.FC = () => {
    const { isApiKeyModalOpen, setIsApiKeyModalOpen, showToast } = useCarousel();

    const [activeTab, setActiveTab] = useState<AIProvider>('gemini');
    const [geminiKey, setGeminiKey] = useState('');
    const [groqKey, setGroqKey] = useState('');
    const [claudeKey, setClaudeKey] = useState('');

    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (isApiKeyModalOpen) {
            setGeminiKey(StorageService.getGeminiApiKey());
            setGroqKey(StorageService.getGroqApiKey());
            setClaudeKey(StorageService.getApiKey());
            setActiveTab(StorageService.getAiProvider());
            setTestStatus(null);
        }
    }, [isApiKeyModalOpen]);

    if (!isApiKeyModalOpen) return null;

    const handleTestConnection = async () => {
        let keyToTest = '';
        if (activeTab === 'gemini') keyToTest = geminiKey.trim();
        else if (activeTab === 'groq') keyToTest = groqKey.trim();
        else if (activeTab === 'claude') keyToTest = claudeKey.trim();

        if (!keyToTest) {
            setTestStatus({ success: false, message: 'Please enter an API key first to test.' });
            return;
        }

        setIsTesting(true);
        setTestStatus(null);

        try {
            const ok = await AIService.testConnection(activeTab as any, keyToTest);
            if (ok) {
                setTestStatus({ success: true, message: 'API connection successful! Your key is valid and ready to generate viral carousels.' });
            } else {
                setTestStatus({ success: false, message: 'Connection failed. Please double-check your API key and try again.' });
            }
        } catch (e: any) {
            setTestStatus({ success: false, message: 'Error testing connection: ' + (e.message || 'Network error') });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        StorageService.setGeminiApiKey(geminiKey.trim());
        StorageService.setGroqApiKey(groqKey.trim());
        StorageService.setApiKey(claudeKey.trim());
        StorageService.setAiProvider(activeTab);

        setIsApiKeyModalOpen(false);
        showToast(`AI settings saved! Active provider: ${activeTab.toUpperCase()}`);
    };

    return (
        <div className="modal-overlay" onClick={() => setIsApiKeyModalOpen(false)}>
            <div className="modal" style={{ maxWidth: '580px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <span className="step-indicator">AI ENGINE SETTINGS</span>
                        <h3 style={{ marginTop: '4px' }}>Configure Free AI API</h3>
                    </div>
                    <button className="modal-close" onClick={() => setIsApiKeyModalOpen(false)}>&times;</button>
                </div>

                {/* Provider Selector Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('gemini'); setTestStatus(null); }}
                        style={{
                            padding: '10px 8px',
                            borderRadius: '8px',
                            border: activeTab === 'gemini' ? '2px solid var(--accent-primary, #6366f1)' : '1px solid var(--border-color, #e2e8f0)',
                            background: activeTab === 'gemini' ? '#EEF2FF' : 'var(--bg-secondary, #f8fafc)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: '13px', color: activeTab === 'gemini' ? '#4F46E5' : 'inherit' }}>
                            <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '6px' }}></i>
                            Gemini 2.0
                        </div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                            100% Free • Recommended
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setActiveTab('groq'); setTestStatus(null); }}
                        style={{
                            padding: '10px 8px',
                            borderRadius: '8px',
                            border: activeTab === 'groq' ? '2px solid var(--accent-primary, #6366f1)' : '1px solid var(--border-color, #e2e8f0)',
                            background: activeTab === 'groq' ? '#EEF2FF' : 'var(--bg-secondary, #f8fafc)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: '13px', color: activeTab === 'groq' ? '#4F46E5' : 'inherit' }}>
                            <i className="fa-solid fa-bolt" style={{ marginRight: '6px' }}></i>
                            Groq Cloud
                        </div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                            100% Free • Ultra Fast
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setActiveTab('claude'); setTestStatus(null); }}
                        style={{
                            padding: '10px 8px',
                            borderRadius: '8px',
                            border: activeTab === 'claude' ? '2px solid var(--accent-primary, #6366f1)' : '1px solid var(--border-color, #e2e8f0)',
                            background: activeTab === 'claude' ? '#EEF2FF' : 'var(--bg-secondary, #f8fafc)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: '13px', color: activeTab === 'claude' ? '#4F46E5' : 'inherit' }}>
                            <i className="fa-solid fa-brain" style={{ marginRight: '6px' }}></i>
                            Claude
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                            Anthropic (Paid)
                        </div>
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    {/* Google Gemini Tab */}
                    {activeTab === 'gemini' && (
                        <div>
                            <div
                                style={{
                                    background: '#F0FDF4',
                                    border: '1px solid #BBF7D0',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    marginBottom: '16px',
                                    fontSize: '13px',
                                    color: '#166534',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px'
                                }}
                            >
                                <i className="fa-solid fa-circle-check" style={{ marginTop: '2px', fontSize: '15px' }}></i>
                                <div>
                                    <strong>Google Gemini Free API Key (Recommended)</strong>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#15803D' }}>
                                        Google AI Studio provides 1,500 free requests per day without any credit card required.
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <a
                                            href="https://aistudio.google.com/apikey"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#15803D',
                                                fontWeight: 700,
                                                textDecoration: 'underline',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            Get Your Free Gemini API Key in 10 Seconds <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }}></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Google Gemini API Key</span>
                                    {geminiKey && (
                                        <span style={{ color: '#059669', fontSize: '12px', fontWeight: 600 }}>
                                            <i className="fa-solid fa-check"></i> Key Configured
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={geminiKey}
                                    onChange={(e) => { setGeminiKey(e.target.value); setTestStatus(null); }}
                                    placeholder="AIzaSy..."
                                    autoFocus
                                />
                                <span className="helper-label">
                                    Stored securely in your browser localStorage. Sent directly to Google's official Gemini endpoint.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Groq Cloud Tab */}
                    {activeTab === 'groq' && (
                        <div>
                            <div
                                style={{
                                    background: '#F0FDF4',
                                    border: '1px solid #BBF7D0',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    marginBottom: '16px',
                                    fontSize: '13px',
                                    color: '#166534',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px'
                                }}
                            >
                                <i className="fa-solid fa-bolt" style={{ marginTop: '2px', fontSize: '15px' }}></i>
                                <div>
                                    <strong>Groq Cloud Free API (Llama 3.3 70B)</strong>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#15803D' }}>
                                        Groq offers completely free access to cutting-edge open models with ultra-fast speed.
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <a
                                            href="https://console.groq.com/keys"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#15803D',
                                                fontWeight: 700,
                                                textDecoration: 'underline',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            Get Your Free Groq API Key <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }}></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Groq API Key</span>
                                    {groqKey && (
                                        <span style={{ color: '#059669', fontSize: '12px', fontWeight: 600 }}>
                                            <i className="fa-solid fa-check"></i> Key Configured
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={groqKey}
                                    onChange={(e) => { setGroqKey(e.target.value); setTestStatus(null); }}
                                    placeholder="gsk_..."
                                    autoFocus
                                />
                                <span className="helper-label">
                                    Stored securely in your browser. Powered by Llama 3.3 70B on Groq hardware.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Claude Tab */}
                    {activeTab === 'claude' && (
                        <div>
                            <div className="form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Anthropic Claude API Key</span>
                                    {claudeKey && (
                                        <span style={{ color: '#059669', fontSize: '12px', fontWeight: 600 }}>
                                            <i className="fa-solid fa-check"></i> Key Configured
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={claudeKey}
                                    onChange={(e) => { setClaudeKey(e.target.value); setTestStatus(null); }}
                                    placeholder="sk-ant-api03-..."
                                    autoFocus
                                />
                                <span className="helper-label">
                                    Note: Anthropic is a paid API. For 100% free generation, switch to the Gemini tab above.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Test Connection Banner */}
                    {testStatus && (
                        <div
                            style={{
                                marginTop: '12px',
                                padding: '10px 14px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                background: testStatus.success ? '#ECFDF5' : '#FEF2F2',
                                border: `1px solid ${testStatus.success ? '#A7F3D0' : '#FECACA'}`,
                                color: testStatus.success ? '#065F46' : '#991B1B',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className={`fa-solid ${testStatus.success ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                            <span>{testStatus.message}</span>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            type="button"
                            className="header-btn"
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                        >
                            {isTesting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i> Testing Connection...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-plug-circle-check"></i> Test Connection
                                </>
                            )}
                        </button>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                className="header-btn"
                                onClick={() => setIsApiKeyModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="header-btn primary">
                                <i className="fa-solid fa-save"></i> Save & Activate
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
