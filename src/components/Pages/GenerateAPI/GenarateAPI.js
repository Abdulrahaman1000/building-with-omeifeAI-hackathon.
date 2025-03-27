import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Key, Copy, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const GenerateAPIKey = () => {
    const { token } = useAuth();
    const [apiKey, setApiKey] = useState(localStorage.getItem('developerApiKey') || null);
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDebug, setShowDebug] = useState(false);

    const generateAPIKey = async () => {
        if (!token) {
            const errorMsg = 'Authentication token is missing. Please log in again.';
            console.error(errorMsg);
            setError(errorMsg);
            return;
        }

        setIsLoading(true);
        setError(null);
        setIsCopied(false);

        try {
            const response = await fetch('https://apis.omeife.ai/api/v1/user/developer/generate-key', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }

            const data = await response.json();

            if (data.status !== 'success') {
                throw new Error(data.message || 'API key generation failed');
            }

            if (!data.data?.key) {
                throw new Error('Invalid API key format in response');
            }

            // Store the new API key in local storage
            const newApiKey = data.data.key;
            localStorage.setItem('developerApiKey', newApiKey);
            setApiKey(newApiKey);

            // Optional: Log the generated API key for debugging
            console.log('API Key Generated and Stored:', newApiKey);

        } catch (err) {
            console.error('[API Key] Generation error:', err);
            setError(err.message || 'Failed to generate API key. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch(copyErr => {
                    console.error('Failed to copy:', copyErr);
                    setError('Failed to copy to clipboard. Please copy manually.');
                });
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-4">
                                <Key className="me-3 text-primary" size={40} />
                                <div>
                                    <Card.Title as="h1" className="mb-0">API Key Management</Card.Title>
                                    <p className="text-muted mb-0">Generate and manage your developer access key</p>
                                </div>
                            </div>

                            {error && (
                                <Alert variant="danger" className="d-flex align-items-center">
                                    <AlertTriangle className="me-2 flex-shrink-0" />
                                    <div>{error}</div>
                                </Alert>
                            )}

                            <Card className="mb-4 border-0 bg-light">
                                <Card.Body>
                                    <p className="mb-3">
                                        Your API key provides access to Omeife's developer services. 
                                        <strong className="text-danger"> Keep this key confidential</strong> and 
                                        never expose it in client-side code.
                                    </p>

                                    <Button 
                                        variant="primary" 
                                        onClick={generateAPIKey}
                                        disabled={isLoading}
                                        className="w-100 mb-3"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Generating...
                                            </>
                                        ) : 'Generate New API Key'}
                                    </Button>

                                    {apiKey && (
                                        <div className="mt-3">
                                            <label className="form-label text-muted">Your API Key:</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control bg-white"
                                                    value={apiKey}
                                                    readOnly
                                                    aria-label="API Key"
                                                />
                                                <Button 
                                                    variant={isCopied ? 'outline-success' : 'outline-secondary'}
                                                    onClick={handleCopy}
                                                    disabled={isCopied}
                                                >
                                                    {isCopied ? (
                                                        <>
                                                            <CheckCircle className="me-1" size={18} />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="me-1" size={18} />
                                                            Copy
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="mt-2 text-end">
                                                <small className="text-muted">
                                                    {apiKey.length}-character key
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            <div className="text-center mt-4">
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    onClick={() => setShowDebug(!showDebug)}
                                    className="text-muted"
                                >
                                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                                </Button>
                            </div>

                            {showDebug && (
                                <Card bg="light" className="mt-3">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-2">
                                            <ShieldAlert className="me-2 text-warning" size={20} />
                                            <Card.Title as="h6" className="mb-0">Debug Information</Card.Title>
                                        </div>
                                        <pre className="small mb-0 p-2 bg-white rounded">
                                            {JSON.stringify({
                                                hasToken: !!token,
                                                apiKeyExists: !!apiKey,
                                                apiKeyLength: apiKey?.length || 0,
                                                timestamp: new Date().toISOString()
                                            }, null, 2)}
                                        </pre>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default GenerateAPIKey;