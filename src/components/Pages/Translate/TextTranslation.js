import React, { useState, useEffect } from 'react';
import { Languages, Copy, RefreshCw, Key } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';

const TranslationComponent = () => {
    const { apiKey, generateApiKey } = useAuth();
    const [text, setText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('english');
    const [toLanguage, setToLanguage] = useState('hausa');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualApiKey, setManualApiKey] = useState('');
    const [useManualKey, setUseManualKey] = useState(false);

    const languages = ['english', 'hausa', 'yoruba', 'igbo'];

    useEffect(() => {
        if (error && text) {
            setError(null);
        }
    }, [text]);

    const handleTranslate = async () => {
        if (!text.trim()) {
            setError('Please enter text to translate');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // Determine which key to use
            const keyToUse = useManualKey ? manualApiKey : apiKey;
            
            if (!keyToUse) {
                throw new Error('No API key available. Please generate or enter one.');
            }

            const response = await fetch('https://apis.omeife.ai/api/v1/user/developer/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keyToUse}` // Using API key as Bearer token
                },
                body: JSON.stringify({
                    text: text.trim(),
                    from: fromLanguage,
                    to: toLanguage
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Translation failed');
            }

            setTranslatedText(data.data.translated_text);
        } catch (err) {
            setError(err.message || 'Translation error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyTranslation = () => {
        if (translatedText) {
            navigator.clipboard.writeText(translatedText)
                .then(() => {
                    // Optional: Show success feedback
                })
                .catch(copyErr => {
                    console.error('Copy failed:', copyErr);
                });
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header d-flex align-items-center">
                            <Languages className="me-2 text-primary" />
                            <h2 className="card-title mb-0">Translation Service</h2>
                        </div>
                        <div className="card-body">
                            {/* API Key Section */}
                            <div className="mb-4">
                                <div className="form-check form-switch mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="useManualKey"
                                        checked={useManualKey}
                                        onChange={() => setUseManualKey(!useManualKey)}
                                    />
                                    <label className="form-check-label" htmlFor="useManualKey">
                                        Use custom API key
                                    </label>
                                </div>

                                {useManualKey && (
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">
                                            <Key size={16} />
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter your API key"
                                            value={manualApiKey}
                                            onChange={(e) => setManualApiKey(e.target.value)}
                                        />
                                    </div>
                                )}

                                {!useManualKey && apiKey && (
                                    <div className="alert alert-info d-flex align-items-center">
                                        <Key className="me-2" size={16} />
                                        <small>Using your generated API key</small>
                                    </div>
                                )}

                                {!useManualKey && !apiKey && (
                                    <button 
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={generateApiKey}
                                    >
                                        Generate API Key
                                    </button>
                                )}
                            </div>

                            {/* Translation Form */}
                            <textarea 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text to translate"
                                className="form-control mb-3"
                                rows="4"
                            />

                            <div className="row mb-3">
                                <div className="col-md-6 mb-2 mb-md-0">
                                    <label className="form-label">From</label>
                                    <select 
                                        value={fromLanguage}
                                        onChange={(e) => setFromLanguage(e.target.value)}
                                        className="form-select"
                                    >
                                        {languages.map(lang => (
                                            <option key={`from-${lang}`} value={lang}>
                                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">To</label>
                                    <select 
                                        value={toLanguage}
                                        onChange={(e) => setToLanguage(e.target.value)}
                                        className="form-select"
                                    >
                                        {languages.map(lang => (
                                            <option key={`to-${lang}`} value={lang}>
                                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleTranslate}
                                disabled={!text.trim() || isLoading || (!apiKey && !manualApiKey)}
                                className="btn btn-primary w-100 mb-3"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Processing...
                                    </>
                                ) : (
                                    'Translate'
                                )}
                            </button>

                            {translatedText && (
                                <div className="position-relative">
                                    <textarea 
                                        readOnly 
                                        value={translatedText}
                                        className="form-control bg-light"
                                        rows="4"
                                    />
                                    <button 
                                        onClick={handleCopyTranslation}
                                        className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
                                        title="Copy translation"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger mt-3 d-flex align-items-center">
                                    <div className="flex-grow-1">{error}</div>
                                    {error.includes('expired') && (
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => window.location.reload()}
                                        >
                                            <RefreshCw size={16} className="me-1" />
                                            Refresh
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationComponent;