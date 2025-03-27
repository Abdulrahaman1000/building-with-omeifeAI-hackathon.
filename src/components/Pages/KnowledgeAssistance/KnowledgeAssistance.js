import React, { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, Copy, Clock, Calendar, Key } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../../context/AuthContext';

const KnowledgeAssistanceComponent = () => {
    const { apiKey, generateApiKey } = useAuth();
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualApiKey, setManualApiKey] = useState('');
    const [useManualKey, setUseManualKey] = useState(false);

    useEffect(() => {
        if (error && question) {
            setError(null);
        }
    }, [question]);

    const handleSubmitQuestion = async () => {
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        setResponse(null);
        setError(null);
        setIsLoading(true);

        try {
            // Determine which key to use
            const keyToUse = useManualKey ? manualApiKey : apiKey;
            
            if (!keyToUse) {
                throw new Error('No API key available. Please generate or enter one.');
            }

            const response = await fetch('https://apis.omeife.ai/api/v1/user/developer/knowledge-assistance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keyToUse}` // Using API key as Bearer token
                },
                body: JSON.stringify({
                    question: question.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get response');
            }

            setResponse(data.data);
        } catch (err) {
            setError(err.message || 'Request error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyResponse = () => {
        if (response?.text?.response) {
            navigator.clipboard.writeText(response.text.response)
                .then(() => {
                    // Optional: Show success feedback
                })
                .catch(copyErr => {
                    console.error('Copy failed:', copyErr);
                });
        }
    };

    const handleClear = () => {
        setQuestion('');
        setResponse(null);
        setError(null);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header d-flex align-items-center">
                            <HelpCircle className="me-2 text-primary" />
                            <h2 className="card-title mb-0">Knowledge Assistance</h2>
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

                            {/* Question Input */}
                            <textarea 
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ask your question..."
                                className="form-control mb-3"
                                rows="4"
                            />

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mb-3">
                                <button 
                                    onClick={handleSubmitQuestion}
                                    disabled={!question.trim() || isLoading || (!apiKey && !manualApiKey)}
                                    className="btn btn-primary flex-grow-1"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        'Ask Question'
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

                            {/* Response Display */}
                            {response && (
                                <div className="mt-4">
                                    <div className="position-relative mb-4">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <p className="mb-0">{response.text.response}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleCopyResponse}
                                            className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
                                            title="Copy response"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>

                                    {/* Metadata */}
                                    <div className="d-flex flex-wrap gap-3 text-muted small">
                                        <div className="d-flex align-items-center">
                                            <Calendar className="me-1" size={14} />
                                            <span>{response.date}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Clock className="me-1" size={14} />
                                            <span>{response.time}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <RefreshCw className="me-1" size={14} />
                                            <span>{response.chatTime}</span>
                                        </div>
                                    </div>
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

export default KnowledgeAssistanceComponent;