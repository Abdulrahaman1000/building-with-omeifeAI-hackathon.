import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Languages, Copy, Loader2, Key, RefreshCw } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';

const SpeechTranslation = () => {
    const { apiKey, generateApiKey } = useAuth();
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fromLanguage, setFromLanguage] = useState('english');
    const [toLanguage, setToLanguage] = useState('hausa');
    const [transcribedText, setTranscribedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState(null);
    const [manualApiKey, setManualApiKey] = useState('');
    const [useManualKey, setUseManualKey] = useState(false);
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const languages = ['english', 'hausa', 'yoruba'];

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

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

    const startRecording = async () => {
        setError(null);
        setTranscribedText('');
        setTranslatedText('');
        audioChunksRef.current = [];

        try {
            const keyToUse = await ensureApiKey();
            if (!keyToUse) {
                throw new Error('No API key available');
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await handleTranscribeAndTranslate(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            setError(err.message || 'Unable to access microphone');
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleTranscribeAndTranslate = async (audioBlob) => {
        setIsLoading(true);
        setError(null);

        try {
            const keyToUse = useManualKey ? manualApiKey : apiKey;
            if (!keyToUse) {
                throw new Error('No API key available');
            }

            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            formData.append('from', fromLanguage);
            formData.append('to', toLanguage);

            const response = await fetch('https://apis.omeife.ai/api/user/developer/srt-translate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${keyToUse}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.auth === 'auth-001') {
                    const newKey = await generateApiKey();
                    if (!newKey) throw new Error('Session expired');
                    return handleTranscribeAndTranslate(audioBlob);
                }
                throw new Error(data.message || 'Translation failed');
            }

            if (data.status === 'success') {
                setTranscribedText(data.data.transcribed_text || 'No text transcribed');
                setTranslatedText(data.data.translated_text || 'No translation available');
            } else {
                throw new Error(data.message || 'Translation failed');
            }
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyText = (text) => {
        if (text) {
            navigator.clipboard.writeText(text)
                .catch(copyErr => console.error('Copy failed:', copyErr));
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header d-flex align-items-center">
                            <Languages className="me-2 text-primary" />
                            <h2 className="card-title mb-0">Speech Translation</h2>
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

                            {/* Language Selectors */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-2 mb-md-0">
                                    <label className="form-label">From</label>
                                    <select 
                                        value={fromLanguage}
                                        onChange={(e) => setFromLanguage(e.target.value)}
                                        className="form-select"
                                    >
                                        {languages.filter(lang => lang !== toLanguage).map(lang => (
                                            <option key={lang} value={lang}>
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
                                        {languages.filter(lang => lang !== fromLanguage).map(lang => (
                                            <option key={lang} value={lang}>
                                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Recording Controls */}
                            <div className="text-center mb-3">
                                {!isRecording ? (
                                    <button 
                                        onClick={startRecording}
                                        disabled={isLoading || isGeneratingKey || (!apiKey && !manualApiKey)}
                                        className="btn btn-primary rounded-circle p-3"
                                    >
                                        <Mic size={24} />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={stopRecording}
                                        className="btn btn-danger rounded-circle p-3"
                                    >
                                        <StopCircle size={24} />
                                    </button>
                                )}
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="d-flex justify-content-center mb-3">
                                    <div className="spinner-border text-primary me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span>Processing your speech...</span>
                                </div>
                            )}

                            {/* Error Handling */}
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center">
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

                            {/* Results */}
                            {transcribedText && (
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5>Transcription</h5>
                                        <button 
                                            onClick={() => handleCopyText(transcribedText)}
                                            className="btn btn-sm btn-outline-secondary"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                    <textarea 
                                        readOnly 
                                        value={transcribedText}
                                        className="form-control bg-light"
                                        rows="3"
                                    />
                                </div>
                            )}

                            {translatedText && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5>Translation</h5>
                                        <button 
                                            onClick={() => handleCopyText(translatedText)}
                                            className="btn btn-sm btn-outline-secondary"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                    <textarea 
                                        readOnly 
                                        value={translatedText}
                                        className="form-control bg-light"
                                        rows="3"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeechTranslation;