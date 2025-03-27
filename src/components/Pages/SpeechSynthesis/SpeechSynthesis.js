import React, { useState, useRef } from 'react';
import { Mic, Volume2, Copy, Loader2, Key, Upload } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';

const SpeechSynthesis = () => {
    const { apiKey, generateApiKey } = useAuth();
    const [text, setText] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualApiKey, setManualApiKey] = useState('');
    const [useManualKey, setUseManualKey] = useState(false);
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const audioRef = useRef(null);

    const ensureApiKey = async () => {
        if (!apiKey && !useManualKey) {
            setIsGeneratingKey(true);
            try {
                await generateApiKey();
            } catch (err) {
                throw new Error('Failed to generate API key');
            } finally {
                setIsGeneratingKey(false);
            }
        }
        return useManualKey ? manualApiKey : apiKey;
    };

    const handleSynthesize = async () => {
        if (!text.trim()) {
            setError('Please enter text to synthesize');
            return;
        }

        setError(null);
        setIsLoading(true);
        setAudioUrl('');

        try {
            const keyToUse = await ensureApiKey();
            if (!keyToUse) {
                throw new Error('No API key available');
            }

            const response = await fetch('https://apis.omeife.ai/api/v1/user/translation/speech/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keyToUse}`
                },
                body: JSON.stringify({
                    question: text.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.auth === 'auth-001') {
                    const newKey = await generateApiKey();
                    if (!newKey) throw new Error('Session expired');
                    return handleSynthesize();
                }
                throw new Error(data.message || 'Speech synthesis failed');
            }

            if (data.status === 'success' && data.data.audio_url) {
                setAudioUrl(data.data.audio_url);
            } else {
                throw new Error('No audio URL received');
            }
        } catch (err) {
            setError(err.message || 'Failed to synthesize speech');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayAudio = () => {
        if (audioRef.current && audioUrl) {
            audioRef.current.play();
        }
    };

    const handleClear = () => {
        setText('');
        setAudioUrl('');
        setError(null);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header d-flex align-items-center">
                            <Volume2 className="me-2 text-primary" />
                            <h2 className="card-title mb-0">Speech Synthesis</h2>
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
                                        disabled={isGeneratingKey}
                                    >
                                        {isGeneratingKey ? (
                                            <>
                                                <Loader2 className="me-1 spin" size={16} />
                                                Generating...
                                            </>
                                        ) : 'Generate API Key'}
                                    </button>
                                )}
                            </div>

                            {/* Text Input */}
                            <textarea 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text to convert to speech"
                                className="form-control mb-3"
                                rows="4"
                            />

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mb-3">
                                <button 
                                    onClick={handleSynthesize}
                                    disabled={!text.trim() || isLoading || isGeneratingKey || (!apiKey && !manualApiKey)}
                                    className="btn btn-primary flex-grow-1"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="me-2 spin" size={16} />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="me-2" size={16} />
                                            Synthesize Speech
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={handleClear}
                                    className="btn btn-outline-secondary"
                                    disabled={isLoading}
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Audio Player */}
                            {audioUrl && (
                                <div className="mt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5>Generated Speech</h5>
                                        <button 
                                            onClick={handlePlayAudio}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <Volume2 size={16} className="me-1" />
                                            Play
                                        </button>
                                    </div>
                                    <audio 
                                        ref={audioRef} 
                                        src={audioUrl} 
                                        controls 
                                        className="w-100"
                                    />
                                </div>
                            )}

                            {/* Error Handling */}
                            {error && (
                                <div className="alert alert-danger mt-3 d-flex align-items-center">
                                    <div className="flex-grow-1">{error}</div>
                                    {error.includes('expired') && (
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => window.location.reload()}
                                        >
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

export default SpeechSynthesis;